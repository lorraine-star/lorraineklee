// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { getShortlinkRedirects } from './src/lib/shortlinks';

// CLI-151: branded shortlinks live in the Keystatic "Shortlinks" collection and
// are generated into the redirects map below at build time (external 301s). A
// slug that collides with a real route or an existing redirect is skipped and
// logged here, so a real page always wins.
const { redirects: shortlinkRedirects, warnings: shortlinkWarnings } =
  await getShortlinkRedirects();
for (const warning of shortlinkWarnings) {
  console.warn(`[shortlinks] ${warning}`);
}

// https://astro.build/config
export default defineConfig({
  // CLI-64: canonical production URL. Required by @astrojs/sitemap and used to
  // emit absolute URLs; the domain resolves here after the CLI-66 DNS cutover.
  //
  // CLI-206: this must name the host that actually answers 200. The apex 308s to
  // www, so pointing `site` at the apex made every canonical, og:url and sitemap
  // <loc> declare a URL that redirects — the one signal whose whole job is to be
  // unambiguous. If the apex is ever made the serving host instead (a Vercel
  // domain setting, not a code change), flip this back in the same commit.
  site: 'https://www.lorraineklee.com',

  // CLI-198: the slash-less URL is canonical, and this line is what makes every
  // redirect reachable from the URL form WordPress actually indexed.
  //
  // WordPress served and canonicalised with a trailing slash ("/mentorship/"),
  // but every redirect source in vercel.json is written slash-less. Vercel only
  // emits its trailing-slash normalisation routes when trailingSlash is
  // configured, and it never was — so "/mentorship/" matched no redirect, fell
  // through to the filesystem and 404d. 279 of 319 known old URLs.
  //
  // Setting this makes the Vercel adapter emit `^/(.*)/$ -> /$1` (308) as the
  // FIRST route in .vercel/output/config.json, ahead of the redirect table.
  // It also moves Seo.astro's canonical and the sitemap off the "/about/" form,
  // which that route now redirects away from. Verify with
  // `node scripts/audit-url-migration.mjs` after deploying, not by reading config.
  trailingSlash: 'never',

  // Site pages prerender to static HTML; the Keystatic admin routes
  // (/keystatic, /api/keystatic) are server-rendered, which the adapter serves.
  adapter: vercel(),

  // CLI-130: the standalone /keynotes catalog duplicated the Speaking page;
  // consolidate to a single Speaking page and preserve any external links.
  redirects: {
    '/keynotes': '/speaking',
    // The archived media kit overlaps the Bio and Headshot page.
    '/media-kit': '/speaker-bio',
    ...shortlinkRedirects,
  },

  vite: {
    // Allow relocating Vite's cache off a cloud-synced tree (e.g. Dropbox),
    // which can lock node_modules/.vite mid-build. Defaults to Vite's normal
    // location when the env var is unset, so this is a no-op by default.
    cacheDir: process.env.VITE_CACHE_DIR || undefined,
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  integrations: [mdx(), react(), markdoc(), keystatic(), sitemap({
    // Keep the Keystatic admin (/keystatic) and its API (/api/keystatic) out
    // of the public sitemap.
    filter: (page) => !page.includes('/keystatic'),
  })]
});
