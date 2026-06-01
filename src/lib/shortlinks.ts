import fs from 'node:fs';
import path from 'node:path';
import { reader } from './keystatic';

export interface ShortlinkRedirect {
  status: number;
  destination: string;
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
    for (const redirect of vercelConfig.redirects ?? []) {
      const singleSegment = String(redirect?.source ?? '').match(/^\/([^/]+)\/?$/);
      if (singleSegment) reserved.add(singleSegment[1].toLowerCase());
    }
  } catch {
    // No vercel.json (or unparseable): the page routes above are still enforced.
  }

  return reserved;
}

/**
 * Read the Keystatic `links` (Shortlinks) collection and turn each active,
 * non-colliding entry into a 301 redirect for the Astro `redirects` config.
 *
 * Returns `warnings` for entries skipped because of a reserved-route collision
 * or a missing destination, so astro.config can log them at build time.
 */
export async function getShortlinkRedirects(): Promise<{
  redirects: Record<string, ShortlinkRedirect>;
  warnings: string[];
}> {
  const redirects: Record<string, ShortlinkRedirect> = {};
  const warnings: string[] = [];

  let entries: Awaited<ReturnType<typeof reader.collections.links.all>> = [];
  try {
    entries = await reader.collections.links.all();
  } catch {
    // Collection folder absent (e.g. before the first shortlink is created).
    return { redirects, warnings };
  }

  const reserved = reservedSegments();

  for (const { slug, entry } of entries) {
    const cleanSlug = (slug ?? '').trim().toLowerCase().replace(/^\/+/, '');
    if (!cleanSlug) continue;
    if (!entry.active) continue;
    if (!entry.destination) {
      warnings.push(`"/${cleanSlug}" has no destination URL; skipped.`);
      continue;
    }
    if (reserved.has(cleanSlug)) {
      warnings.push(
        `"/${cleanSlug}" matches an existing page or redirect; skipped so the real route still wins.`
      );
      continue;
    }
    redirects[`/${cleanSlug}`] = { status: 301, destination: entry.destination };
  }

  return { redirects, warnings };
}
