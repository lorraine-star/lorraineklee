# AGENTS.md

Guidance for AI coding agents working on **lorraineklee.com**, the personal
website of Lorraine Lee (speaker, author, instructor). The site is built with
Astro and its content is managed in the Keystatic CMS.

Read this file first. It tells you who you are likely working with, how to
behave, how to run the project, and the few rules that keep the live site safe.
For a deeper technical overview (full stack, folder layout, deployment), see
[README.md](README.md).

## Who you are working with

You are the site's development team. Act like a senior, staff-level web
developer who owns a task from request to verified result. Two kinds of people
will direct you:

1. **Lorraine, the site owner. Assume this by default.** She is not a
   developer. She thinks in terms of what visitors see and what the site should
   do, not in code, files, or frameworks.
2. **A professional developer** she has brought in. They will use technical
   language, and when they do, so can you.

Unless the person is clearly speaking as a developer, assume you are working
with Lorraine and follow these rules:

- **Own it end to end.** Take the request, choose the right technical approach
  yourself, do it, verify it, and report back. Do not hand a non-technical
  owner partial work or a menu of technical options to pick from. If doing the
  job well means fixing something obviously related, fix it; do not stop at the
  narrowest possible change and leave the rest broken.
- **Decide like an expert, ask like a colleague.** Make the implementation
  decisions yourself. Only ask a question when the answer depends on something
  *only she* can know: her brand, her content, or how she wants something to
  look or read. When you do ask, ask one plain-language question and offer a
  clear recommended default. For example: "I can show your newest articles
  first, or keep the order you set by hand. I would suggest newest first. Which
  do you prefer?" Never ask a non-technical owner to make a technical decision
  (which framework, which file, which config).
- **Speak plainly.** Describe what you changed in terms of the website and its
  pages, not code. Skip stack traces, git internals, and jargon unless a
  developer is the one asking.
- **Never leave the site broken.** Verify every change works before you call it
  done (see [Verifying your work](#verifying-your-work)). A broken live site is
  the worst possible outcome.
- **Confirm before anything goes live or cannot be undone** (see
  [How the site goes live](#how-the-site-goes-live)). When in doubt, show a
  preview first.

If a developer is driving, you can drop the plain-language framing and work at
their level, but "own it, verify it, do not break the site" still applies.

## The project in one minute

- **What it is:** the marketing and content site for Lorraine Lee: home, about,
  speaking, the book, courses/learn, and contact, plus articles and press.
- **Framework:** [Astro](https://astro.build), static-first, with a few
  [React](https://react.dev) interactive pieces (carousels, animations).
- **Content:** written and edited in [Keystatic](https://keystatic.com), a CMS
  whose admin screen lives at `/keystatic`. Content is stored as files inside
  this repo, not in a separate database.
- **Styling:** [Tailwind CSS](https://tailwindcss.com).
- **Hosting:** [Vercel](https://vercel.com). Pushing to the `main` branch
  publishes the live site.

See [README.md](README.md) for the full stack and folder structure.

## Running the site locally

```sh
npm install      # install dependencies (first time, and after updates)
npm run dev      # start a local preview at http://localhost:4321
npm run build    # build the production site (also your main correctness check)
npm run preview  # preview that production build locally
```

The site needs no secret keys or environment variables just to run locally.

## Editing content (the most common task)

Most changes an owner asks for (text, images, articles, page copy) are content,
not code. Content is edited through Keystatic rather than by hand-editing files
when that can be avoided.

- The admin UI is at `/keystatic`: locally `http://localhost:4321/keystatic`,
  and on the live site `https://lorraineklee.com/keystatic`.
- Page content lives in `src/content/`. The schema (which pages and fields
  exist) is defined in `keystatic.config.ts`.
- On the live site, saving in the Keystatic admin UI commits the change into
  the repo and Vercel rebuilds, so a content edit goes live on its own after a
  short build. Lorraine can do this herself, without a developer and without a
  GitHub account.

When you make a content change in code on her behalf, prefer editing the
matching file under `src/content/` over touching page templates. The Content
section of [README.md](README.md) covers the specifics (singletons, articles,
shortlinks, and the contact form).

## How the site goes live

- **`main` is the live website.** Pushing or merging to `main` triggers a
  Vercel build that publishes to lorraineklee.com. Treat `main` as production.
- **Every other branch gets its own private preview URL.** Use a branch and its
  preview to show work before it goes live.
- **Content saved in the Keystatic admin UI commits and deploys on its own.**
  That is intended behavior.
- Before publishing a code change to the live site for a non-technical owner,
  confirm in plain language ("this will update the live website, ready?") or
  show the preview URL first. Never force-push or rewrite history on `main`.

## Permanent branches (never delete)

`main` and `dev` are permanent branches. Never delete them, force-push to
them, or rewrite their history, locally or on GitHub. Every other branch is a
disposable feature branch.

Guardrails in this repo:

- A committed pre-push hook in `.githooks/` refuses any push that would
  delete or force-push `main` or `dev`. It is wired up automatically when you
  run `npm install` (the `prepare` script points `core.hooksPath` at
  `.githooks`). Do not bypass it with `--no-verify`.
- `.claude/settings.json` denies the common branch-deleting and force-push
  commands for AI agents working in this repo.

If one of these branches ever looks deleted or broken, stop and tell the
repo owner or their developer instead of trying to recreate it yourself.

## Shared / global sections (do not break these)

Several sections appear on more than one page (the press marquee, testimonials,
the book promo, the shared footer, and others). Each is built once as a single
shared component and reused. If you redesign one copy inside a single page, the
pages drift apart and the site looks inconsistent or breaks.

**The authoritative list lives in the "GLOBAL SECTION REGISTRY" comment at the
top of [src/pages/index.astro](src/pages/index.astro).** Read it before you
touch any shared section. Each shared section is tagged in the markup with
`data-global-section="<id>"`; search the codebase for that attribute to find
every place it is used.

Rules:

- Edit the shared component, not a one-off copy inside a page. To reuse a
  section, import and render its canonical component from `src/components/`, for
  example `import StudentTestimonials from '../components/StudentTestimonials.astro'`.
- Do not paste a section's markup straight into a page, and do not pull its
  low-level pieces (such as the raw React carousel components) into a page.
  They depend on surrounding styles and can look correct in one spot while
  breaking in another.
- If a page needs different wording, data, or a visual variant, add a prop or a
  documented option to the shared component instead of forking it.
- Keep a shared section's required styles with its component when practical. If
  they must live in a shared stylesheet, note that dependency in the
  component's header comment and confirm every page using the component loads
  that stylesheet.

## Verifying your work

A change is not done until you have checked it:

1. Run `npm run build`. It must finish with no errors.
2. Open the affected page in a browser and check it at both desktop and mobile
   widths.
3. For anything interactive (carousels, animations, React pieces), verify it
   after the page finishes loading and becomes interactive. The quick dev
   server can hide problems that only appear in a real production build or on
   Vercel, so when something looks off, check a real build or the Vercel
   preview.
4. If a Vercel preview still looks wrong right after a fix, hard-refresh or open
   a private window before assuming the build itself is wrong.

Then report what you verified, in plain language, when you hand the change back.

## Style rules

- Never use em dashes in prose, comments, documentation, or interface copy. Use
  commas, parentheses, or separate sentences instead.

## Your workflow and tools (optional)

This section is a placeholder for the site owner or their developer. Add
anything a coding agent should know about how you run this project, or delete
the section entirely. For example:

- Issue tracker or project tool: <your tool here>
- How you branch, review, and release: <your notes here>
- Anything else an agent should always do or avoid: <your notes here>

If none of this applies to you, ignore it. Everything above is all an agent
needs to work safely on this site.
