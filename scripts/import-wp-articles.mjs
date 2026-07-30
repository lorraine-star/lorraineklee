// One-off import: rebuilds the Keystatic `articles` collection from the posts
// still served by the retired WordPress install (CLI-203).
//
// Why scrape rather than use a WXR export: the WP install is alive and public at
// lorrainekleeco.wpengine.com, but its admin is unreachable without WP Engine
// account access (see CLI-68), and the Dropbox permanent archive is
// backup-based with no WXR. The rendered pages carry the full body text, so
// they are the available source.
//
// Extraction is by cross-page intersection rather than a CSS selector: the site
// is Elementor-built and the posts do not share one content container — the
// newsletter issues put the body in a text-editor widget, the "from the archive"
// pages do not. Any block of text that appears on more than one page is site
// chrome (nav, newsletter CTA, footer) and is dropped; what remains, in document
// order, is that page's own content.
//
// Run:
//   node scripts/import-wp-articles.mjs --dry     # print what would be written
//   node scripts/import-wp-articles.mjs           # write entries + images

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WP = 'https://lorrainekleeco.wpengine.com';
const DRY = process.argv.includes('--dry');

const OUT_CONTENT = path.join(REPO, 'src', 'content', 'articles');
const OUT_IMAGES = path.join(REPO, 'public', 'images', 'articles');

// slug -> [title, wpPostDate]. Both come from the WordPress DB export, not the
// pages: the "from the archive" pages inherit the site-wide <title>, and the
// visible byline is not per-issue — issues 42, 43 and 44 all render
// "12 April 2023" and issue 45 renders no date at all, so the rendered date
// cannot order them. The DB post_date is the only consistent field, even though
// it puts all four issues on the day they were migrated into WordPress rather
// than the day each was sent. Real send dates are not recoverable from either
// source; Lorraine can correct them in Keystatic if she has them.
const ARTICLES = [
	['issue-42-why-youre-feeling-burnt-out-and-how-to-fix-it', "Issue #42: Why You're Feeling Burnt Out — And How to Fix It", '2023-04-03'],
	['issue-43-what-your-linkedin-headline-is-missing', 'Issue #43: What Your LinkedIn Headline Is Missing', '2023-04-03'],
	['issue-44-how-to-create-a-superpowered-agenda', 'Issue #44: How to Create a Superpowered Agenda', '2023-04-03'],
	['issue-45-have-you-taken-advantage-of-this-linkedin-feature', 'Issue #45: Have You Taken Advantage of This LinkedIn Feature?', '2023-04-03'],
	['tools-and-techniques-for-smarter-work', 'Tools and Techniques for Smarter Work', '2024-03-04'],
	['from-the-archive-one-easy-way-to-expand-your-network-on-linkedin', 'From the Archive: One Easy Way to Expand Your Network on LinkedIn', '2024-03-04'],
	['from-the-archive-avoid-this-resume-trap', 'From the Archive: Avoid This Résumé Trap', '2024-03-04'],
	['from-the-archive-polish-your-presence-for-remote-interviews-with-this-video-setup', 'From the Archive: Polish Your Presence for Remote Interviews With This Video Setup', '2024-03-04'],
];

// Everything after this marker is the newsletter sign-off appended to each
// issue, not part of the article.
const SIGN_OFF = /^thanks for reading/i;

function get(url, binary = false) {
	return new Promise((resolve) => {
		https
			.get(url, { headers: { 'user-agent': 'Mozilla/5.0 (article-import)' } }, (res) => {
				if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					res.resume();
					return resolve(get(new URL(res.headers.location, url).href, binary));
				}
				const chunks = [];
				res.on('data', (d) => chunks.push(d));
				res.on('end', () =>
					resolve({ status: res.statusCode, body: binary ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8') })
				);
			})
			.on('error', () => resolve({ status: 0, body: binary ? Buffer.alloc(0) : '' }));
	});
}

const decode = (s) =>
	s
		.replace(/&#8217;|&rsquo;/g, '’')
		.replace(/&#8216;|&lsquo;/g, '‘')
		.replace(/&#8220;|&ldquo;/g, '“')
		.replace(/&#8221;|&rdquo;/g, '”')
		.replace(/&#8211;|&ndash;/g, '–')
		.replace(/&#8212;|&mdash;/g, '—')
		.replace(/&#8230;|&hellip;/g, '…')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;|&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

/**
 * Turn one block of WordPress HTML into markdown. The bodies use only p, span,
 * strong, em, a and li — the spans are Slate editor artifacts carrying no
 * meaning, so they are unwrapped rather than translated.
 */
/**
 * Kit (ConvertKit) rewrote every outbound link in the newsletter as a click
 * tracker with the real destination base64'd into the path. Those trackers will
 * rot when the campaign is retired, so unwrap them back to the real URL.
 */
function unwrapTracking(href) {
	const m = href.match(/convertkit-mail2?\.com\/click\/[a-z0-9]+\/([A-Za-z0-9+/=_-]+)/i);
	if (!m) return href;
	try {
		const decoded = Buffer.from(m[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
		return /^https?:\/\//i.test(decoded) ? decoded : href;
	} catch {
		return href;
	}
}

function toMarkdown(html) {
	let s = html
		.replace(/<span[^>]*>/gi, '')
		.replace(/<\/span>/gi, '')
		// Keep the surrounding whitespace: trimming the inner text welds the
		// marker to the next word ("**The problem:**Many organizations").
		.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => {
			const t = inner.trim();
			if (!t) return '';
			const lead = /^\s/.test(inner) ? ' ' : '';
			const tail = /\s$/.test(inner) ? ' ' : '';
			return `${lead}**${t}**${tail}`;
		})
		.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => {
			const t = inner.trim();
			if (!t) return '';
			// Already-bold inner text would produce _**x**_ with no separation.
			const lead = /^\s/.test(inner) ? ' ' : '';
			const tail = /\s$/.test(inner) ? ' ' : '';
			return `${lead}_${t}_${tail}`;
		})
		.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
			const label = text.replace(/<[^>]+>/g, '').trim();
			return label ? `[${label}](${unwrapTracking(href)})` : '';
		})
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => `\n- ${inner.replace(/<[^>]+>/g, '').trim()}`)
		.replace(/<\/(ul|ol)>/gi, '\n')
		.replace(/<[^>]+>/g, '');
	s = decode(s);
	// Markdoc treats {% %} as a tag; the bodies contain Kit merge fields such as
	// {{ subscriber.first_name }} which are harmless, but a stray brace pair
	// would break the parse.
	return s.replace(/\{%/g, '{ %').replace(/[ \t]+/g, ' ').trim();
}

/** Every text-bearing block on the page, in document order. */
function blocks(html) {
	const body = html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '');
	const out = [];
	for (const m of body.matchAll(/<(p|h2|h3|h4|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
		const tag = m[1].toLowerCase();
		const md = toMarkdown(m[2]);
		if (!md || md.length < 3) continue;
		out.push({ tag, md, key: md.replace(/\s+/g, ' ').slice(0, 120) });
	}
	return out;
}

/**
 * The post's featured image. Yoast emits it as og:image, which is more reliable
 * than scanning <img> tags — Elementor lazy-loads body images and the first
 * <img> on the page is site chrome.
 */
function featuredImage(html) {
	const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
	if (!m) return '';
	return /wp-content\/uploads/.test(m[1]) ? m[1] : '';
}

/** Yoast's article:published_time — the real per-post publish date. */
function publishedDate(html) {
	const m = html.match(/<meta[^>]+property="article:published_time"[^>]+content="(\d{4}-\d{2}-\d{2})/i);
	return m ? m[1] : '';
}

/** Every uploaded image a page references, from og:image and from <img>. */
function allUploads(html) {
	const out = new Set();
	for (const m of html.matchAll(/wp-content\/uploads\/[^"'\s)]+\.(?:png|jpe?g|webp|gif)/gi)) {
		out.add(m[0].replace(/-\d+x\d+(\.\w+)$/, '$1')); // collapse resized variants
	}
	return [...out];
}

// Blocks that survive the cross-page filter but are still not article content.
const NOT_CONTENT = [
	/^table of contents$/i,
	/^\d{1,2}\s+\w+\s+\d{4},\s*lorraine/i, // the byline line, captured as `date`
];

// ---------------------------------------------------------------- fetch

const pages = [];
for (const [slug, title, date] of ARTICLES) {
	const res = await get(`${WP}/${slug}/`);
	if (res.status !== 200) {
		console.error(`SKIP ${slug}: HTTP ${res.status}`);
		continue;
	}
	pages.push({ slug, title, fallbackDate: date, html: res.body, blocks: blocks(res.body), uploads: allUploads(res.body) });
	process.stderr.write(`fetched ${slug}\n`);
}

// Site chrome appears on every page; a post's own words appear on exactly one.
const seenOn = new Map();
// A file used by more than one page is site furniture (logo, newsletter header,
// the default og:image Yoast falls back to), never that post's own hero.
const uploadSeenOn = new Map();
for (const p of pages) {
	for (const k of new Set(p.blocks.map((b) => b.key))) seenOn.set(k, (seenOn.get(k) ?? 0) + 1);
	for (const u of p.uploads) uploadSeenOn.set(u, (uploadSeenOn.get(u) ?? 0) + 1);

}

for (const p of pages) {
	const own = [];
	for (const b of p.blocks) {
		if ((seenOn.get(b.key) ?? 0) > 1) continue; // shared with another page => chrome
		if (SIGN_OFF.test(b.md)) break; // newsletter sign-off and everything after
		if (NOT_CONTENT.some((re) => re.test(b.md))) continue;
		own.push(b);
	}
	p.body = own;
	const og = featuredImage(p.html);
	const ogKey = og.replace(/-\d+x\d+(\.\w+)$/, '$1').replace(/^https?:\/\/[^/]+\//, '');
	p.hero = og && (uploadSeenOn.get(ogKey) ?? 0) === 1 ? og : '';
	p.date = publishedDate(p.html) || p.fallbackDate;
	// First full sentence of the body, for the meta description.
	const firstProse = own.find((b) => b.tag === 'p' && b.md.length > 60);
	// Meta description: cut on a word boundary, not mid-word.
	const raw = firstProse ? firstProse.md.replace(/\*\*/g, '').replace(/_/g, '').trim() : '';
	p.description =
		raw.length <= 160 ? raw : raw.slice(0, 160).replace(/\s+\S*$/, '') + '…';
}

// ---------------------------------------------------------------- report / write

for (const p of pages) {
	const words = p.body.reduce((n, b) => n + b.md.split(/\s+/).length, 0);
	console.log(`\n=== ${p.slug}`);
	console.log(`    title : ${p.title}`);
	console.log(`    date  : ${p.date || '(none found)'}`);
	console.log(`    hero  : ${p.hero ? p.hero.split('/').pop() : '(none)'}`);
	console.log(`    blocks: ${p.body.length}  words: ${words}`);
	console.log(`    desc  : ${p.description.slice(0, 100)}`);
	if (DRY) for (const b of p.body) console.log(`      [${b.tag}] ${b.md.slice(0, 110)}`);
}

if (DRY) {
	console.log('\n--dry: nothing written.');
	process.exit(0);
}

fs.mkdirSync(OUT_IMAGES, { recursive: true });
for (const p of pages) {
	let heroPath = '';
	if (p.hero) {
		const name = `${p.slug}${path.extname(new URL(p.hero).pathname) || '.webp'}`;
		// Yoast wrote og:image against the canonical domain, but lorraineklee.com
		// now serves the Astro site — the uploads only exist on the WP host.
		const src = p.hero.replace(/^https?:\/\/(www\.)?lorraineklee\.com/i, WP);
		const img = await get(src, true);
		if (img.status === 200 && img.body.length) {
			fs.writeFileSync(path.join(OUT_IMAGES, name), img.body);
			heroPath = `/images/articles/${name}`;
		} else {
			console.error(`  hero download failed for ${p.slug}: HTTP ${img.status} (${src})`);
		}
	}

	const dir = path.join(OUT_CONTENT, p.slug);
	fs.mkdirSync(dir, { recursive: true });
	const yamlString = (v) => `'${String(v).replace(/'/g, "''")}'`;
	const frontmatter = [
		'---',
		`title: ${yamlString(p.title)}`,
		`date: ${p.date || ''}`,
		`description: ${yamlString(p.description)}`,
		`hero_image: ${heroPath}`,
		'external_url: ""',
		'---',
		'',
	].join('\n');
	const body = p.body.map((b) => (b.tag.startsWith('h') ? `## ${b.md}` : b.md)).join('\n\n');
	fs.writeFileSync(path.join(dir, 'index.mdoc'), frontmatter + body + '\n');
	console.log(`wrote src/content/articles/${p.slug}/index.mdoc${heroPath ? ' + hero' : ''}`);
}
