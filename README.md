# lorraineklee.com

Astro rebuild of lorraineklee.com, with content managed in Keystatic.

## Stack

- [Astro](https://astro.build) — site framework
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Keystatic](https://keystatic.com) — Git-backed CMS (admin UI at `/keystatic`)
- [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/) and [Markdoc](https://markdoc.dev) — content authoring
- [React](https://react.dev) — powers the Keystatic admin UI
- Deployed on [Vercel](https://vercel.com)

## Development

```sh
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # build the production site
npm run preview  # preview the production build locally
```

## Content (Keystatic)

Page content lives in `src/content/` and is edited through the Keystatic admin
UI at `http://localhost:4321/keystatic` while the dev server is running.

- **Singletons** — one entry per page: Home, About, Speaking, Learn, Book, Contact
- **Articles** — a collection of articles and press features

Storage runs on [Keystatic Cloud](https://keystatic.com/docs/cloud) (project
`lorraineklee/lorraineklee`). The admin UI authenticates against Keystatic
Cloud and commits content changes straight to this GitHub repo, so Lorraine
can edit without her own GitHub account. To run the admin against local files
instead, set `storage` to `{ kind: 'local' }` in `keystatic.config.ts`.

## Contact form

The Contact page form is Lorraine's own [Typeform](https://www.typeform.com/),
embedded inline via Typeform's `embed.js`. Submissions land in her Typeform
inbox and trigger her existing automation integrations.

Set the Typeform form ID in Keystatic on the **Contact** singleton, in the
**Typeform form ID** field — the 8-character ID from the form's share URL
(`https://<account>.typeform.com/to/<id>`). The ID also lives in
`src/content/contact/index.yaml` as `typeform_id` for local development.

If the field is empty the form area falls back to a "not connected yet"
message with a `mailto:` to `contact_email`.

## Project structure

```
src/
  components/        shared Astro components
  content/           Keystatic content (singletons + collections)
  layouts/           shared page layouts
  lib/               the Keystatic reader and helpers
  pages/             routes
  styles/            global styles
keystatic.config.ts  CMS schema (singletons, collections, fields)
```

## Deployment

Vercel builds the site with the `@astrojs/vercel` adapter.

- Pushes to `main` deploy to production.
- Every branch and pull request gets its own preview URL.
- Site pages are prerendered to static HTML; the Keystatic admin routes
  (`/keystatic`, `/api/keystatic`) are server-rendered by the adapter.

Keystatic's Astro adapter has not yet widened its peer range to Astro 6, so
`.npmrc` sets `legacy-peer-deps=true` to keep `npm install` working locally
and on Vercel.

The repo is private and owned by Ryan; ownership transfers to Lorraine at the
milestone 3 handoff.
