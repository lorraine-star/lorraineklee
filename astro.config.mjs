// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Site pages prerender to static HTML; the Keystatic admin routes
  // (/keystatic, /api/keystatic) are server-rendered, which the adapter serves.
  adapter: vercel(),

  // CLI-130: the standalone /keynotes catalog duplicated the Speaking page;
  // consolidate to a single Speaking page and preserve any external links.
  redirects: {
    '/keynotes': '/speaking',
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

  integrations: [mdx(), react(), markdoc(), keystatic()]
});
