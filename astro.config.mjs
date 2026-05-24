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

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  integrations: [mdx(), react(), markdoc(), keystatic()]
});
