// WordPress -> Astro URL migration audit.
//
// Answers five questions about the migration, and writes both a JSON dump and a
// markdown summary table:
//
//   1. Inventory   - every old WordPress URL we know about, and its target.
//   2. Necessity   - which slugs changed when the old path was still available.
//   3. Correctness - redirect status codes, chains, and loops (static analysis).
//   4. Live        - what production actually returns for every old URL.
//   5. Coverage    - every built page is either at its old path or the target
//                    of exactly one redirect.
//
// Old WordPress URLs are tested in BOTH forms (with and without the trailing
// slash) because WordPress served, canonicalized, and got indexed with the
// slash, while the Astro redirect table is written slash-less.
//
// Sources:
//   - vercel.json                      (Vercel platform redirects)
//   - astro.config.mjs                 (framework redirects, static entries)
//   - src/content/links/*.yaml         (Keystatic shortlinks -> astro redirects)
//   - src/pages + src/content          (the built route set)
//   - <inventory>/lorraineklee_content_inventory.csv        (public crawl, 2026-05-04)
//   - <inventory>/lorraineklee_admin_content_inventory.csv  (WP DB export)
//   - <inventory>/lorraineklee_admin_redirects.csv          (WP Redirection rules)
//
// The inventory package is gitignored (client data). Point at it with
// --inventory <dir>; the default resolves the main checkout from a worktree.
// Without it the audit still runs against the repo config alone and says so.
//
// Run:
//   node scripts/audit-url-migration.mjs                       # config + live
//   node scripts/audit-url-migration.mjs --no-live             # static only
//   node scripts/audit-url-migration.mjs --origin https://...  # different host
//   node scripts/audit-url-migration.mjs --out ./audit         # output prefix

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');

// ---------------------------------------------------------------- args

function arg(name, fallback) {
	const i = process.argv.indexOf(`--${name}`);
	return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const FLAGS = new Set(process.argv.filter((a) => a.startsWith('--')));

const ORIGIN = arg('origin', 'https://lorraineklee.com').replace(/\/$/, '');
const OUT_PREFIX = arg('out', path.join(REPO, 'url-audit'));
const CONCURRENCY = Number(arg('concurrency', '10'));
const DO_LIVE = !FLAGS.has('--no-live');

// A worktree lives at <main>/.claude/worktrees/<name>; the gitignored inventory
// package only exists in the main checkout, so walk up to find it.
function defaultInventoryDir() {
	const candidates = [
		path.join(REPO, 'docs', 'lorraineklee_verified_inventory_package'),
		path.resolve(REPO, '..', '..', '..', 'docs', 'lorraineklee_verified_inventory_package'),
	];
	return candidates.find((c) => fs.existsSync(c)) ?? candidates[0];
}
const INVENTORY = arg('inventory', defaultInventoryDir());

// ---------------------------------------------------------------- helpers

/** Minimal RFC4180 CSV reader (quoted fields, embedded commas + newlines). */
function parseCsv(text) {
	const rows = [];
	let row = [];
	let cur = '';
	let quoted = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (quoted) {
			if (c === '"') {
				if (text[i + 1] === '"') {
					cur += '"';
					i++;
				} else quoted = false;
			} else cur += c;
		} else if (c === '"') quoted = true;
		else if (c === ',') {
			row.push(cur);
			cur = '';
		} else if (c === '\n') {
			row.push(cur);
			rows.push(row);
			row = [];
			cur = '';
		} else if (c !== '\r') cur += c;
	}
	if (cur !== '' || row.length) {
		row.push(cur);
		rows.push(row);
	}
	if (!rows.length) return [];
	const header = rows[0];
	return rows
		.slice(1)
		.filter((r) => r.length >= header.length - 1 && r.some((v) => v !== ''))
		.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function readCsv(file) {
	const p = path.join(INVENTORY, file);
	if (!fs.existsSync(p)) return null;
	return parseCsv(fs.readFileSync(p, 'utf8'));
}

// Only the apex and www serve this site. app./courses./my. are third-party
// services on a vanity subdomain — as external as amazon.com for audit purposes.
//
// The host under audit counts as ours too: running against a preview
// deployment, a 404 on <hash>.vercel.app is our own missing route, not a dead
// third-party destination, and conflating the two turns a clean preview report
// into a list of phantom broken links.
const PRODUCTION_HOSTS = /^(www\.)?lorraineklee\.com$/i;
const ORIGIN_HOST = (() => {
	try {
		return new URL(ORIGIN).hostname.toLowerCase();
	} catch {
		return '';
	}
})();
const SITE_HOSTS = {
	test: (host) => PRODUCTION_HOSTS.test(host) || (host && host.toLowerCase() === ORIGIN_HOST),
};

/** Strip host + query + hash, collapse to a leading-slash path. */
function toPath(value) {
	if (!value) return '';
	let v = String(value).trim();
	if (!v) return '';
	if (/^https?:\/\//i.test(v)) {
		try {
			const u = new URL(v);
			if (!SITE_HOSTS.test(u.hostname)) return v; // external
			v = u.pathname + u.search + u.hash;
		} catch {
			return v;
		}
	}
	if (!v.startsWith('/')) return v;
	return v;
}

/** Path without query/hash/trailing slash, for identity comparisons. */
function normalize(p) {
	if (!p || !p.startsWith('/')) return p;
	const bare = p.split('#')[0].split('?')[0];
	return bare.length > 1 ? bare.replace(/\/+$/, '') : '/';
}

const isExternal = (v) => {
	if (!/^https?:\/\//i.test(v)) return false;
	try {
		return !SITE_HOSTS.test(new URL(v).hostname);
	} catch {
		return true;
	}
};

const hostOf = (u) => {
	try {
		return new URL(u).hostname;
	} catch {
		return '';
	}
};

// ---------------------------------------------------------------- 1. redirect config

/** Vercel platform redirects. `permanent: true` is emitted as a 308 by Vercel. */
function loadVercelRedirects() {
	const cfg = JSON.parse(fs.readFileSync(path.join(REPO, 'vercel.json'), 'utf8'));
	return (cfg.redirects ?? []).map((r) => ({
		source: r.source,
		destination: r.destination,
		layer: 'vercel.json',
		declared: r.permanent === false ? 307 : 308,
		declaredNote: r.permanent === false ? 'permanent:false' : 'permanent:true',
		pattern: r.source.includes(':') || r.source.includes('*'),
	}));
}

/** Static entries in astro.config.mjs `redirects` (Astro emits 301). */
function loadAstroRedirects() {
	const src = fs.readFileSync(path.join(REPO, 'astro.config.mjs'), 'utf8');
	const block = src.match(/redirects:\s*\{([\s\S]*?)\n\s{2}\},/);
	const out = [];
	if (block) {
		for (const m of block[1].matchAll(/'([^']+)':\s*'([^']+)'/g)) {
			out.push({
				source: m[1],
				destination: m[2],
				layer: 'astro.config',
				declared: 301,
				declaredNote: 'astro redirects',
				pattern: false,
			});
		}
	}
	return out;
}

/** Keystatic shortlinks -> astro redirects (status 301, mostly external). */
function loadShortlinks(reservedSegments) {
	const dir = path.join(REPO, 'src', 'content', 'links');
	if (!fs.existsSync(dir)) return [];
	const out = [];
	for (const file of fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))) {
		const text = fs.readFileSync(path.join(dir, file), 'utf8');
		const field = (name) => {
			const m = text.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'));
			if (!m) return '';
			const inline = m[1].trim();
			// Keystatic writes long URLs as a folded block scalar (`destination: >-`)
			// with the value on the following indented lines; a fold joins them.
			if (inline === '>-' || inline === '>' || inline === '|-' || inline === '|') {
				const rest = text.slice(m.index + m[0].length).split('\n').slice(1);
				const body = [];
				for (const line of rest) {
					if (!/^\s+\S/.test(line)) break;
					body.push(line.trim());
				}
				return body.join(inline.startsWith('|') ? '\n' : '');
			}
			return inline.replace(/^['"]|['"]$/g, '');
		};
		// Keystatic derives an entry's slug from its FILENAME (slugField only
		// controls what the admin writes into the name), and shortlinks.ts keys
		// off reader slugs — so the filename is what actually goes live. A `slug:`
		// field that disagrees with the filename is stale data, not a second route.
		const slug = path.basename(file, path.extname(file)).trim().toLowerCase().replace(/^\/+/, '');
		const declaredSlug = field('slug').trim().toLowerCase();
		const active = field('active') !== 'false';
		const destination = field('destination');
		if (!slug) continue;
		out.push({
			source: `/${slug}`,
			destination,
			layer: 'keystatic shortlink',
			declared: 301,
			declaredNote: 'shortlinks.ts status:301',
			pattern: false,
			staleSlugField: declaredSlug && declaredSlug !== slug ? declaredSlug : null,
			skipped: !active
				? 'inactive'
				: !destination
					? 'no destination'
					: reservedSegments.has(slug)
						? 'reserved-collision'
						: null,
		});
	}
	return out;
}

// ---------------------------------------------------------------- 2. built routes

function builtRoutes() {
	const routes = new Set();
	const pagesDir = path.join(REPO, 'src', 'pages');
	for (const name of fs.readdirSync(pagesDir)) {
		if (name.startsWith('[')) continue;
		const full = path.join(pagesDir, name);
		if (fs.statSync(full).isDirectory()) continue;
		const seg = name.replace(/\.(astro|md|mdx)$/i, '');
		routes.add(seg === 'index' ? '/' : `/${seg}`);
	}
	// Dynamic collections: /courses/[slug], /keynotes/[slug], /articles/[slug].
	for (const [dir, prefix] of [
		['courses', '/courses'],
		['keynotes', '/keynotes'],
		['articles', '/articles'],
	]) {
		// /keynotes has no index.astro — it is a redirect to /speaking, not a page.
		if (fs.existsSync(path.join(pagesDir, dir, 'index.astro'))) routes.add(prefix);
		const cdir = path.join(REPO, 'src', 'content', dir);
		if (!fs.existsSync(cdir)) continue;
		for (const entry of fs.readdirSync(cdir)) {
			const slug = entry.replace(/\.(yaml|yml|mdoc|md|json)$/i, '');
			routes.add(`${prefix}/${slug}`);
		}
	}
	return routes;
}

// ---------------------------------------------------------------- 3. old-URL inventory

function loadOldUrls() {
	/** @type {Map<string, {path:string, sources:Set<string>, meta:object}>} */
	const map = new Map();
	const add = (rawPath, source, meta = {}) => {
		const p = toPath(rawPath);
		if (!p || !p.startsWith('/')) return;
		const key = normalize(p);
		if (!key || key.includes('*')) return;
		if (!map.has(key)) map.set(key, { path: key, sources: new Set(), meta: {} });
		const rec = map.get(key);
		rec.sources.add(source);
		Object.assign(rec.meta, meta);
	};

	const crawl = readCsv('lorraineklee_content_inventory.csv');
	if (crawl) {
		for (const r of crawl) {
			if (!r.url) continue;
			add(r.url, 'public-crawl', {
				crawlStatus: r.status_code,
				contentType: r.content_type,
				title: r.title,
				robots: r.robots_meta,
			});
		}
	}

	const admin = readCsv('lorraineklee_admin_content_inventory.csv');
	if (admin) {
		const PUBLIC_TYPES = new Set([
			'page',
			'post',
			'linkedin-courses',
			'keynote',
			'keynotes_v2',
			'testimonial',
			'youtube-video',
		]);
		for (const r of admin) {
			if (r.status !== 'publish' || !PUBLIC_TYPES.has(r.post_type)) continue;
			const url = r.url || `/${r.slug}/`;
			add(url, 'wp-db', { postType: r.post_type, wpTitle: r.title, noindex: r.yoast_noindex });
		}
	}

	const wpRedirects = readCsv('lorraineklee_admin_redirects.csv');
	if (wpRedirects) {
		for (const r of wpRedirects) {
			if (r.status !== 'enabled') continue;
			if (!r.url || !r.url.startsWith('/')) continue;
			if (r.url.length > 120) continue; // encoded ConvertKit tracking blobs
			add(r.url, 'wp-redirection-rule', {
				wpRedirectTarget: r.action_data,
				wpHits: r.hits,
				wpLastAccess: r.last_access,
			});
		}
	}

	return { map, haveInventory: Boolean(crawl || admin || wpRedirects) };
}

// ---------------------------------------------------------------- 4. resolution

/** Resolve a path through the repo redirect table, detecting chains + loops. */
function resolveStatic(startPath, bySource) {
	const hops = [];
	const seen = new Set();
	let cur = normalize(startPath);
	for (let i = 0; i < 10; i++) {
		if (seen.has(cur)) return { hops, loop: true, final: cur };
		seen.add(cur);
		const rule = bySource.get(cur);
		if (!rule || rule.skipped) break;
		hops.push(rule);
		if (isExternal(rule.destination)) return { hops, loop: false, final: rule.destination };
		cur = normalize(toPath(rule.destination));
	}
	return { hops, loop: false, final: cur };
}

// ---------------------------------------------------------------- 5. live checks

// Vercel preview deployments sit behind SSO. Without a bypass token every
// request 302s to vercel.com/sso-api and lands on a login page that answers
// 200 — which silently reads as "every URL is fine" when nothing was measured.
// --bypass sends the project's Protection Bypass for Automation secret
// (Vercel project settings -> Deployment Protection).
const BYPASS = arg('bypass', process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? null);
const SSO_HOSTS = /(^|\.)vercel\.com$/i;

function request(url) {
	return new Promise((resolve) => {
		const lib = url.startsWith('https:') ? https : http;
		const headers = { 'user-agent': 'lkl-url-audit/1.0' };
		if (BYPASS) headers['x-vercel-protection-bypass'] = BYPASS;
		const req = lib.request(
			url,
			{ method: 'GET', headers },
			(res) => {
				let body = '';
				let bytes = 0;
				res.on('data', (d) => {
					// Only the head of the document is needed (meta refresh + canonical).
					if (bytes < 20000) {
						body += d;
						bytes += d.length;
					}
				});
				res.on('end', () =>
					resolve({ status: res.statusCode, location: res.headers.location ?? null, body }),
				);
			},
		);
		req.on('error', (e) => resolve({ status: 0, error: e.message, location: null, body: '' }));
		req.setTimeout(25000, () => {
			req.destroy();
			resolve({ status: 0, error: 'timeout', location: null, body: '' });
		});
		req.end();
	});
}

/** Follow a URL manually, recording every hop. Also detects meta-refresh. */
async function trace(startUrl, maxHops = 8) {
	const hops = [];
	let url = startUrl;
	const seen = new Set();
	for (let i = 0; i < maxHops; i++) {
		if (seen.has(url)) {
			hops.push({ url, status: 'LOOP' });
			return { hops, final: url, finalStatus: 'LOOP', loop: true };
		}
		seen.add(url);
		const res = await request(url);
		hops.push({ url, status: res.status, location: res.location, error: res.error });
		if (res.status >= 300 && res.status < 400 && res.location) {
			url = new URL(res.location, url).href;
			continue;
		}
		// Client-side redirect: <meta http-equiv="refresh" content="0;url=...">
		const meta = res.body.match(
			/<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["'][^"']*url=([^"';]+)/i,
		);
		if (res.status === 200 && meta) {
			hops[hops.length - 1].metaRefresh = meta[1].trim();
			url = new URL(meta[1].trim(), url).href;
			continue;
		}
		const canonical = res.body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
		return {
			hops,
			final: url,
			finalStatus: res.status,
			loop: false,
			canonical: canonical ? canonical[1] : null,
		};
	}
	return { hops, final: url, finalStatus: 'MAX_HOPS', loop: false };
}

async function pool(items, worker, limit) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, async () => {
			while (next < items.length) {
				const i = next++;
				results[i] = await worker(items[i], i);
			}
		}),
	);
	return results;
}

// ---------------------------------------------------------------- main

const reservedSegments = new Set(['keystatic', 'api']);
for (const name of fs.readdirSync(path.join(REPO, 'src', 'pages'))) {
	if (name.startsWith('[')) continue;
	const seg = name.replace(/\.(astro|md|mdx|ts|js)$/i, '');
	if (seg !== 'index') reservedSegments.add(seg.toLowerCase());
}
const vercelRules = loadVercelRedirects();
for (const r of vercelRules) {
	const single = r.source.match(/^\/([^/]+)\/?$/);
	if (single) reservedSegments.add(single[1].toLowerCase());
}

const astroRules = loadAstroRedirects();
const shortlinkRules = loadShortlinks(reservedSegments);
const allRules = [...vercelRules, ...astroRules, ...shortlinkRules];

// vercel.json is evaluated before framework redirects, so it wins a collision.
const bySource = new Map();
const collisions = [];
for (const r of allRules) {
	if (r.pattern) continue;
	const key = normalize(r.source);
	if (bySource.has(key)) {
		collisions.push({ source: key, kept: bySource.get(key).layer, shadowed: r.layer });
		continue;
	}
	bySource.set(key, r);
}

const routes = builtRoutes();
const { map: oldUrls, haveInventory } = loadOldUrls();

// Every redirect source is itself an old URL worth auditing.
for (const r of allRules) {
	if (r.pattern) continue;
	const key = normalize(r.source);
	if (!oldUrls.has(key)) oldUrls.set(key, { path: key, sources: new Set(), meta: {} });
	oldUrls.get(key).sources.add(`redirect-config:${r.layer}`);
}

const records = [...oldUrls.values()].sort((a, b) => a.path.localeCompare(b.path));

for (const rec of records) {
	rec.sourceList = [...rec.sources].sort();
	const rule = bySource.get(rec.path);
	rec.rule = rule ?? null;
	rec.isRoute = routes.has(rec.path);
	const resolved = resolveStatic(rec.path, bySource);
	rec.staticHops = resolved.hops.length;
	rec.staticLoop = resolved.loop;
	rec.staticFinal = resolved.final;
	rec.staticFinalIsRoute = isExternal(resolved.final)
		? null
		: routes.has(normalize(resolved.final));

}

// ---------------------------------------------------------------- necessity

// How many old URLs land on each internal destination? A destination reached by
// several old URLs is a consolidation, not a slug change: the old paths have no
// 1:1 page to sit at, so keeping them would mean building new pages.
const destCountsAll = new Map();
for (const rec of records) {
	const rule = rec.rule;
	if (!rule || rule.skipped || isExternal(rule.destination)) continue;
	const d = normalize(toPath(rule.destination));
	destCountsAll.set(d, (destCountsAll.get(d) ?? 0) + 1);
}

for (const rec of records) {
	const rule = rec.rule;
	rec.necessity = null;

	if (rec.isRoute) {
		rec.necessity = { kind: 'preserved', why: 'served at the original path; no redirect' };
		continue;
	}
	if (!rule || rule.skipped) continue;

	if (isExternal(rule.destination)) {
		rec.necessity = {
			kind: 'vanity-shortlink',
			why: 'points off-site (booking, Kit, Amazon, LinkedIn Learning); never a page on either site',
		};
		continue;
	}

	const destPath = normalize(toPath(rule.destination));
	const hasFragment = String(rule.destination).includes('#');
	const shared = destCountsAll.get(destPath) ?? 0;
	const destIsPage = routes.has(destPath);

	if (destPath === '/') {
		rec.necessity = { kind: 'retired', why: 'content retired; sent to the home page' };
	} else if (hasFragment) {
		rec.necessity = {
			kind: 'model-change',
			why: `standalone WP page became a section of ${destPath}; no 1:1 URL exists to preserve`,
		};
	} else if (!destIsPage) {
		rec.necessity = { kind: 'target-missing', why: `destination ${destPath} is not a built route` };
	} else if (shared > 1) {
		rec.necessity = {
			kind: 'consolidation',
			why: `${shared} old URLs merge into ${destPath}; only one could keep its path`,
		};
	} else {
		// 1:1 with a real page and a different path => an avoidable slug change.
		const oldSegs = rec.path.split('/').filter(Boolean);
		const newSegs = destPath.split('/').filter(Boolean);
		const dirChanged = oldSegs.slice(0, -1).join('/') !== newSegs.slice(0, -1).join('/');
		const tailChanged = oldSegs.at(-1) !== newSegs.at(-1);
		rec.necessity = {
			kind: 'slug-change-1to1',
			subkind: dirChanged && tailChanged ? 'directory+slug' : dirChanged ? 'directory' : 'slug',
			// A path is free unless something else is already built or redirected there.
			oldPathFree: !routes.has(rec.path),
			why: `single old URL -> single page at a different path (${rec.path} -> ${destPath})`,
		};
	}
}

for (const rec of records) {
	if (!rec.rule || isExternal(rec.rule.destination)) continue;
	rec.destShared = destCountsAll.get(normalize(toPath(rec.rule.destination))) ?? 0;
}

// ---------------------------------------------------------------- live

// --reuse <audit.json> replays a previous live pass instead of re-requesting.
// Re-analysis is cheap; hammering Kit/LinkedIn/Google to re-derive a verdict is
// not, and their rate limiting makes a second pass noisier than the first.
const REUSE = arg('reuse', null);
if (REUSE && !fs.existsSync(REUSE)) {
	// Silently falling through would emit a table with every live column blank,
	// which reads as "no data" rather than "you typo'd the path".
	console.error(`--reuse: no such file: ${REUSE}`);
	process.exit(1);
}
if (REUSE) {
	const prev = JSON.parse(fs.readFileSync(REUSE, 'utf8'));
	const byPath = new Map(prev.records.map((r) => [r.path, r.live]));
	let hits = 0;
	for (const rec of records) {
		const live = byPath.get(rec.path);
		if (live) {
			rec.live = live;
			hits++;
		}
	}
	process.stderr.write(`Reused ${hits}/${records.length} live results from ${REUSE}\n`);
}

if (DO_LIVE && !REUSE) {
	// Test the historical (trailing-slash) form and the slash-less form.
	const targets = [];
	for (const rec of records) {
		if (rec.path === '/') {
			targets.push({ rec, form: 'slash', url: `${ORIGIN}/` });
			continue;
		}
		targets.push({ rec, form: 'slash', url: `${ORIGIN}${rec.path}/` });
		targets.push({ rec, form: 'bare', url: `${ORIGIN}${rec.path}` });
	}
	// Probe one URL first. If it lands on a Vercel auth wall, every subsequent
	// result would be that login page answering 200 — a clean-looking report
	// measuring nothing. Refuse to produce it.
	const probe = await trace(`${ORIGIN}/`);
	// PRODUCTION_HOSTS, not SITE_HOSTS — the latter counts the origin as ours by
	// definition, which would make this guard unconditionally false.
	if (SSO_HOSTS.test(hostOf(probe.final)) && !PRODUCTION_HOSTS.test(hostOf(ORIGIN))) {
		console.error(
			[
				'',
				`Deployment protection is blocking ${ORIGIN}`,
				`  ${ORIGIN}/ -> ${probe.hops.map((h) => h.status).join(' -> ')} -> ${probe.final}`,
				'',
				'Every request would land on the Vercel login page, which answers 200 — the',
				'report would show every URL healthy while having measured nothing.',
				'',
				'Fix one of:',
				'  1. Vercel project -> Settings -> Deployment Protection -> Protection Bypass',
				'     for Automation. Then re-run with --bypass <secret> (or set',
				'     VERCEL_AUTOMATION_BYPASS_SECRET).',
				'  2. Set Vercel Authentication to "Only Production" so previews are public.',
				'  3. Point --origin at production, which is not protected.',
				'',
			].join('\n')
		);
		process.exit(2);
	}

	process.stderr.write(`Live-checking ${targets.length} URLs against ${ORIGIN} ...\n`);
	let done = 0;
	await pool(
		targets,
		async (t) => {
			const r = await trace(t.url);
			t.rec.live ??= {};
			t.rec.live[t.form] = {
				start: t.url,
				hops: r.hops.map((h) => ({ url: h.url, status: h.status, location: h.location ?? null, metaRefresh: h.metaRefresh ?? null })),
				redirectHops: r.hops.filter((h) => typeof h.status === 'number' && h.status >= 300 && h.status < 400).length,
				metaRefreshHops: r.hops.filter((h) => h.metaRefresh).length,
				firstStatus: r.hops[0]?.status ?? null,
				final: r.final,
				finalStatus: r.finalStatus,
				loop: r.loop,
				canonical: r.canonical ?? null,
			};
			done++;
			if (done % 50 === 0) process.stderr.write(`  ${done}/${targets.length}\n`);
			return null;
		},
		CONCURRENCY,
	);
	process.stderr.write(`  ${done}/${targets.length} done\n`);
}

// ---------------------------------------------------------------- verdicts

const onOurSite = (u) => SITE_HOSTS.test(hostOf(u));

// External hosts answer an unauthenticated bot with a gate, not a verdict on the
// link: Google Docs/Drive 401 a signed-out fetch, LinkedIn serves 999 to bots,
// 403/429 are bot-walls and rate limits. Those are "not verifiable from here",
// not broken. 404/410 from an external host IS a dead destination.
const EXTERNAL_GATE = new Set([401, 403, 429, 999]);

/**
 * Classify one form of one old URL. Separates our-side failures (the redirect
 * never fired, or fired into our own 404) from external-destination failures.
 */
function classifyLive(live, { form, hasRule, isRoute }) {
	if (!live) return { problems: [], notes: [] };
	const problems = [];
	const notes = [];

	const ourHops = live.hops.filter((h) => onOurSite(h.url));
	const ourRedirects = ourHops.filter((h) => typeof h.status === 'number' && h.status >= 300 && h.status < 400);
	// The apex -> www 308 is a host normalization hop, not a content redirect.
	const contentRedirects = ourRedirects.filter((h) => {
		if (!h.location) return true;
		const from = new URL(h.url);
		const to = new URL(h.location, h.url);
		return normalize(from.pathname) !== normalize(to.pathname);
	});
	const hostHops = ourRedirects.length - contentRedirects.length;

	const landedOnUs = onOurSite(live.final);
	const label = form === 'slash' ? 'trailing-slash form' : 'bare form';

	if (live.loop) problems.push(`redirect loop (${label})`);

	if (landedOnUs) {
		if (live.finalStatus === 404) {
			problems.push(
				hasRule
					? `404 — redirect never fired (${label})`
					: isRoute
						? `404 — page exists but this form 404s (${label})`
						: `404 — no redirect, no page (${label})`,
			);
		} else if (typeof live.finalStatus === 'number' && live.finalStatus >= 500) {
			problems.push(`${live.finalStatus} server error (${label})`);
		}
	} else if (typeof live.finalStatus === 'number') {
		if (live.finalStatus === 404 || live.finalStatus === 410) {
			problems.push(`dead external destination (${live.finalStatus})`);
		} else if (EXTERNAL_GATE.has(live.finalStatus)) {
			notes.push(`external destination returned ${live.finalStatus} to an anonymous bot — verify by hand`);
		}
	}

	// Status-code quality, our hops only. Vercel `permanent:true` emits 308.
	for (const h of contentRedirects) {
		if (h.status === 302 || h.status === 303 || h.status === 307) {
			problems.push(`temporary redirect ${h.status} on our host (${label})`);
		}
	}
	if (live.metaRefreshHops) problems.push(`client-side meta refresh (${label})`);

	if (contentRedirects.length > 1) problems.push(`chain: ${contentRedirects.length} of our hops (${label})`);
	if (hostHops) notes.push(`+${hostHops} apex→www hop`);

	const externalRedirects = live.hops.filter(
		(h) => !onOurSite(h.url) && typeof h.status === 'number' && h.status >= 300 && h.status < 400,
	);
	if (externalRedirects.length) {
		notes.push(`+${externalRedirects.length} external hop(s) beyond our control`);
	}

	return { problems, notes, contentRedirects: contentRedirects.length, hostHops, landedOnUs };
}

function verdict(rec) {
	const problems = [];
	const notes = [];

	if (rec.staticLoop) problems.push('redirect loop (config)');
	if (rec.staticHops > 1) problems.push(`chain: ${rec.staticHops} config hops`);

	const ctx = { hasRule: Boolean(rec.rule && !rec.rule.skipped), isRoute: rec.isRoute };
	for (const form of ['slash', 'bare']) {
		const c = classifyLive(rec.live?.[form], { ...ctx, form });
		rec.liveClass ??= {};
		rec.liveClass[form] = c;
		problems.push(...c.problems);
		notes.push(...c.notes);
	}

	if (!rec.rule && !rec.isRoute && !rec.staticHops) problems.push('no redirect and no page');
	if (rec.rule?.skipped) problems.push(`shortlink skipped at build: ${rec.rule.skipped}`);

	rec.notes = [...new Set(notes)];
	return [...new Set(problems)];
}

for (const rec of records) rec.problems = verdict(rec);

// Coverage: a built route must be an old path, or the target of >= 1 redirect.
const redirectTargets = new Set();
for (const r of allRules) {
	if (r.skipped) continue;
	if (isExternal(r.destination)) continue;
	redirectTargets.add(normalize(toPath(r.destination)));
}
const redirectTargetCounts = new Map();
for (const r of allRules) {
	if (r.skipped || isExternal(r.destination)) continue;
	const p = normalize(toPath(r.destination));
	redirectTargetCounts.set(p, (redirectTargetCounts.get(p) ?? 0) + 1);
}
const wpPaths = new Set(
	records.filter((r) => r.sourceList.some((s) => !s.startsWith('redirect-config'))).map((r) => r.path),
);
const routeCoverage = [...routes].sort().map((rt) => ({
	route: rt,
	wasWordPressUrl: wpPaths.has(rt),
	incomingRedirects: redirectTargetCounts.get(rt) ?? 0,
	status: wpPaths.has(rt)
		? 'original path preserved'
		: (redirectTargetCounts.get(rt) ?? 0) > 0
			? 'new path, reachable via redirect'
			: 'new path, no old URL points here',
}));

const orphanRoutes = [...routes]
	.filter((rt) => {
		if (oldUrls.has(rt) && oldUrls.get(rt).sourceList?.some((s) => !s.startsWith('redirect-config'))) return false;
		return !redirectTargets.has(rt);
	})
	.sort();

// ---------------------------------------------------------------- output

const summary = {
	generated: new Date().toISOString(),
	origin: ORIGIN,
	inventoryDir: haveInventory ? INVENTORY : null,
	inventoryPresent: haveInventory,
	counts: {
		oldUrlsTotal: records.length,
		fromPublicCrawl: records.filter((r) => r.sourceList.includes('public-crawl')).length,
		fromWpDb: records.filter((r) => r.sourceList.includes('wp-db')).length,
		fromWpRedirectionRules: records.filter((r) => r.sourceList.includes('wp-redirection-rule')).length,
		configOnly: records.filter((r) => r.sourceList.every((s) => s.startsWith('redirect-config'))).length,
		vercelRules: vercelRules.length,
		astroRules: astroRules.length,
		shortlinkRules: shortlinkRules.length,
		shortlinksSkipped: shortlinkRules.filter((r) => r.skipped).length,
		builtRoutes: routes.size,
	},
	collisions,
	orphanRoutes,
	routeCoverage,
	staleSlugFields: allRules.filter((r) => r.staleSlugField).map((r) => ({ file: r.source, declared: r.staleSlugField })),
	necessity: records.reduce((acc, r) => {
		const k = r.necessity?.kind ?? 'unclassified';
		acc[k] = (acc[k] ?? 0) + 1;
		return acc;
	}, {}),
	slugChanges1to1: records
		.filter((r) => r.necessity?.kind === 'slug-change-1to1')
		.map((r) => ({ old: r.path, new: normalize(toPath(r.rule.destination)), subkind: r.necessity.subkind })),
	withProblems: records.filter((r) => r.problems.length).length,
	problemTally: records
		.flatMap((r) => r.problems)
		.reduce((acc, p) => {
			const k = p.replace(/\d+/g, 'N');
			acc[k] = (acc[k] ?? 0) + 1;
			return acc;
		}, {}),
};

fs.writeFileSync(`${OUT_PREFIX}.json`, JSON.stringify({ summary, records, rules: allRules }, null, 2));

const cell = (v) => String(v ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (v, n = 78) => (String(v).length > n ? String(v).slice(0, n - 1) + '…' : String(v));

const lines = [
	`# WordPress → Astro URL audit — full table`,
	'',
	`Generated ${summary.generated} against ${ORIGIN}. ${records.length} old URLs.`,
	'',
	'`/old/` is the historical WordPress form (indexed + linked); `/old` is the bare form.',
	'',
	'| # | Old URL (WP form) | New URL / target | Redirect type | Live `/old/` | Live `/old` | Change | Verdict |',
	'|---|---|---|---|---|---|---|---|',
];
records.forEach((rec, i) => {
	const target = rec.rule?.destination ?? (rec.isRoute ? '(same path — page)' : '—');
	const type = rec.rule
		? `${rec.rule.declared} · ${rec.rule.layer}`
		: rec.isRoute
			? 'none needed'
			: 'none';
	const fmt = (l) => {
		if (!l) return '—';
		if (typeof l.finalStatus !== 'number') return String(l.finalStatus);
		const chain = l.redirectHops ? ` (${l.redirectHops}h)` : '';
		return l.redirectHops ? `${l.firstStatus}→${l.finalStatus}${chain}` : String(l.finalStatus);
	};
	const v = rec.problems.length ? `**fix** — ${rec.problems.join('; ')}` : 'OK';
	lines.push(
		`| ${i + 1} | \`${cell(rec.path === '/' ? '/' : rec.path + '/')}\` | ${cell(short(target))} | ${cell(type)} | ${cell(fmt(rec.live?.slash))} | ${cell(fmt(rec.live?.bare))} | ${cell(rec.necessity?.kind)} | ${cell(v)} |`,
	);
});
fs.writeFileSync(`${OUT_PREFIX}.md`, lines.join('\n') + '\n');

console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote ${OUT_PREFIX}.json and ${OUT_PREFIX}.md`);
