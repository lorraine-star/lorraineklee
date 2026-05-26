# CLAUDE.md

Project guidance for AI agents working in this repository.

## Style rules

- Never use em dashes in prose, comments, documentation, or UI copy.

## Linear workflow

- Work in this repo is tracked in Linear (issue prefix `CLI-`).
- When you start working on a Linear ticket, first check its status. If it is
  not already **In Progress**, set it to **In Progress** before doing any work.

## Global sections

- Some page sections are **shared/global** across the site. The canonical
  registry lives in the header comment of `src/pages/index.astro`.
- Each global section is tagged with `data-global-section="<id>"`. Search
  for that attribute to find every instance.
- Do **not** redesign a global section in isolation. Edit the canonical
  source (a shared component or the home page) and coordinate via Linear so
  parallel worktrees don't drift.

Current canonical global section components:

- `trust-as-seen-in`: use `src/components/TrustAsSeenIn.astro`.
- `book-promo`: use `src/components/BookPromo.astro`.
- `testimonials`: use `src/components/Testimonials.astro`.
- `student-testimonials`: use `src/components/StudentTestimonials.astro`.

When using a global section on a page, import and render the canonical Astro
wrapper. Do not duplicate its markup in the page, and do not import low-level
implementation pieces such as `HomeTestimonialsCarousel`,
`SecondaryTestimonialsCarousel`, or `TestimonialsColumn` directly into pages
unless you are editing the canonical wrapper itself.

If a page needs different copy, data, an anchor ID, or a visual variant, add
props or a documented variant to the canonical wrapper. Keep required styles
with the wrapper when practical. If styles must live in a shared stylesheet,
document the dependency in the component header and verify that every layout
using the component loads that stylesheet.

For global section styles, prefer selectors scoped by
`[data-global-section="<id>"]` or the wrapper class. Avoid broad page-level
patches against shared classes like `.t-card`, `.testimonials-track`, or
`.section-head` unless the change is intentionally sitewide.

After adding or changing a global section usage, run `npm run build` and verify
the affected page in a browser at desktop and mobile widths. For React islands
or carousels, verify after hydration because Vite dev and Vercel preview can
surface different missing-CSS behavior.
