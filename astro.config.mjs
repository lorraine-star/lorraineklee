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
  site: 'https://lorraineklee.com',

  // Site pages prerender to static HTML; the Keystatic admin routes
  // (/keystatic, /api/keystatic) are server-rendered, which the adapter serves.
  adapter: vercel(),

  // CLI-130: the standalone /keynotes catalog duplicated the Speaking page;
  // consolidate to a single Speaking page and preserve any external links.
  redirects: {
    '/keynotes': '/speaking',
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
