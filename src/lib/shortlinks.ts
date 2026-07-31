import fs from 'node:fs';
import path from 'node:path';
// Explicit .ts extension so this module also resolves under Node's type-stripping
// loader, which scripts/validate-shortlinks.mjs uses. Vite resolves it the same way.
import { reader } from './keystatic.ts';

export interface ShortlinkRedirect {
  status: number;
  destination: string;
}

/**
 * CLI-199: slugs that WordPress served with capitals.
 *
 * The WP Redirection plugin stored these mixed-case and matched them exactly,
 * so on WordPress the capitalised form was the one that worked — and it is the
 * form printed on workshop slides and pasted into follow-up emails. This module
 * lowercases every slug (Keystatic slugs are lowercase by convention), and
 * Vercel matches redirect sources case-sensitively, so the port silently
 * inverted which casing resolves and the handed-out links began 404ing.
 *
 * Each entry re-publishes the original casing alongside the canonical lowercase
 * slug, pointing at the same destination — one hop, no duplicated URLs, and no
 * extra rows cluttering the Shortlinks collection in the Keystatic admin.
 *
 * Sourced from the enabled mixed-case rules in the WordPress export. Add to this
 * list if a capitalised link turns up that is not here; do not add lowercase
 * ones, they already resolve.
 */
export const LEGACY_CASE_ALIASES = [
  'CC-feedback',
  'NISM-discount',
  'NUL-feedback',
  'SASE-resources',
  'SASE-workbook',
  'WS-feedback',
  'catch-up-APAC-timezone-30min',
  'cisco-linkedin-DD',
];

/**
 * CLI-199 / CLI-208: which capitalised paths vercel.json is expected to serve.
 *
 * These aliases are NOT added to the Astro `redirects` config. Astro's router
 * matches paths case-insensitively, so declaring both "/cc-feedback" and
 * "/CC-feedback" reads as one route defined twice — Astro warns today and says
 * it becomes a hard error in a future version. Vercel matches case-sensitively,
 * which is the only reason the aliases work at all, so they live in vercel.json
 * where Astro never sees them.
 *
 * That split means the destination is written in vercel.json rather than derived
 * from the Keystatic entry, so this function exists to make drift detectable:
 * `npm run validate:shortlinks` compares what vercel.json actually serves against
 * what this says it should, and fails on a mismatch.
 *
 * Returns only aliases whose lowercase twin is live. If the twin was skipped
 * (inactive, colliding, no destination) the alias must not exist either — a
 * capitalised route pointing at something the site no longer publishes is worse
 * than a 404.
 */
export function expectedLegacyAliasRedirects(
  redirects: Record<string, ShortlinkRedirect>,
  aliases: readonly string[] = LEGACY_CASE_ALIASES
): Record<string, string> {
  const expected: Record<string, string> = {};

  for (const alias of aliases) {
    const canonical = redirects[`/${alias.toLowerCase()}`];
    if (!canonical) continue;
    expected[`/${alias}`] = canonical.destination;
  }

  return expected;
}

// Single-segment paths a shortlink must never shadow: real top-level pages, the
// Keystatic admin/API, and existing one-segment redirect sources in vercel.json.
// A shortlink whose slug matches one of these is skipped at build so the real
// route always wins (CLI-151).
function reservedSegments(): Set<string> {
  const reserved = new Set<string>(['keystatic', 'api']);

  try {
    const pagesDir = path.join(process.cwd(), 'src', 'pages');
    for (const name of fs.readdirSync(pagesDir)) {
      // Dynamic routes (e.g. [slug].astro) are not single-segment shortlink targets.
      if (name.startsWith('[')) continue;
      const segment = name.replace(/\.(astro|md|mdx|ts|js)$/i, '');
      if (segment === 'index') continue; // the home route "/"
      reserved.add(segment.toLowerCase());
    }
  } catch {
    // src/pages should always exist; if it can't be read, fall through to the
    // vercel.json sources below rather than failing the build.
  }

  try {
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')
    ) as { redirects?: Array<{ source?: string }> };
    const aliasSources = new Set(LEGACY_CASE_ALIASES.map((a) => `/${a}`));
    for (const redirect of vercelConfig.redirects ?? []) {
      const source = String(redirect?.source ?? '');
      // The CLI-208 case aliases live in vercel.json but are not real routes --
      // each one exists precisely to mirror a shortlink. Treating them as
      // reserved would make every alias evict the shortlink it mirrors, taking
      // out the lowercase form the alias depends on.
      if (aliasSources.has(source)) continue;
      const singleSegment = source.match(/^\/([^/]+)\/?$/);
      if (singleSegment) reserved.add(singleSegment[1].toLowerCase());
    }
  } catch {
    // No vercel.json (or unparseable): the page routes above are still enforced.
  }

  return reserved;
}

export type ShortlinkSkipReason = 'reserved-collision' | 'no-destination' | 'inactive';

export interface SkippedShortlink {
  slug: string;
  reason: ShortlinkSkipReason;
}

/**
 * Read the Keystatic `links` (Shortlinks) collection and turn each active,
 * non-colliding entry into a 301 redirect for the Astro `redirects` config.
 *
 * Returns `warnings` for entries skipped because of a reserved-route collision
 * or a missing destination, so astro.config can log them at build time, and
 * `skipped` as the same information in structured form. CLI-202: a skipped
 * shortlink looks saved and active in the Keystatic admin but silently does
 * nothing, so `npm run validate:shortlinks` turns a collision into a failed
 * check rather than a warning nobody reads.
 */
export async function getShortlinkRedirects(): Promise<{
  redirects: Record<string, ShortlinkRedirect>;
  warnings: string[];
  skipped: SkippedShortlink[];
}> {
  const redirects: Record<string, ShortlinkRedirect> = {};
  const warnings: string[] = [];
  const skipped: SkippedShortlink[] = [];

  let entries: Awaited<ReturnType<typeof reader.collections.links.all>> = [];
  try {
    entries = await reader.collections.links.all();
  } catch {
    // Collection folder absent (e.g. before the first shortlink is created).
    return { redirects, warnings, skipped };
  }

  const reserved = reservedSegments();

  for (const { slug, entry } of entries) {
    const cleanSlug = (slug ?? '').trim().toLowerCase().replace(/^\/+/, '');
    if (!cleanSlug) continue;
    if (!entry.active) {
      skipped.push({ slug: cleanSlug, reason: 'inactive' });
      continue;
    }
    if (!entry.destination) {
      warnings.push(`"/${cleanSlug}" has no destination URL; skipped.`);
      skipped.push({ slug: cleanSlug, reason: 'no-destination' });
      continue;
    }
    if (reserved.has(cleanSlug)) {
      warnings.push(
        `"/${cleanSlug}" matches an existing page or redirect; skipped so the real route still wins.`
      );
      skipped.push({ slug: cleanSlug, reason: 'reserved-collision' });
      continue;
    }
    redirects[`/${cleanSlug}`] = { status: 301, destination: entry.destination };
  }

  // The capitalised aliases are deliberately NOT added here — see
  // expectedLegacyAliasRedirects() for why they live in vercel.json instead.

  return { redirects, warnings, skipped };
}
