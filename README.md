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

The Contact page form is sent through [Formspree](https://formspree.io) — the
legacy WordPress mailer cannot send transactional email, so the Astro site does
not depend on it. The form submits over `fetch` (AJAX) and shows inline success
and error states; a hidden honeypot field (`_gotcha`) filters bots.

Set the Formspree form id in the `PUBLIC_FORMSPREE_ID` environment variable
(locally in a `.env` file, and in the Vercel project settings):

```sh
PUBLIC_FORMSPREE_ID=xxxxxxxx   # the id from https://formspree.io/f/<id>
```

Until it is set, the form validates input but shows an error state on submit
instead of sending.

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
