# AGENTS.md

Project guidance for AI agents working in this repository.

## Style Rules

- Never use em dashes in prose, comments, documentation, or UI copy.

## Development

- Install dependencies with `npm install`.
- Run the dev server with `npm run dev`.
- Run the production build with `npm run build`.
- If a component uses a React island, carousel, animation, or browser-only behavior, verify it after hydration. Prefer `npm run build` plus a local preview or Vercel preview when investigating production-only styling.

## Linear Workflow

- Work in this repo is tracked in Linear with issue prefix `CLI-`.
- When you start working on a Linear ticket, check its status first.
- If the ticket is not already `In Progress`, set it to `In Progress` before doing implementation work.

## Global Sections

Some page sections are shared across the site. The canonical registry lives in the header comment of `src/pages/index.astro`.

Current global section IDs:

- `trust-as-seen-in`: use `src/components/TrustAsSeenIn.astro`.
- `book-promo`: use `src/components/BookPromo.astro`.
- `testimonials`: use `src/components/Testimonials.astro`.
- `student-testimonials`: use `src/components/StudentTestimonials.astro`.

Every global section must include `data-global-section="<id>"`. Search for that attribute to find all instances before changing a global section.

## How To Use Global Sections

- Import and render the canonical Astro wrapper from `src/components`.
- Do not duplicate global section markup in a page.
- Do not redesign a global section in isolation.
- Do not import low-level implementation pieces directly into pages unless you are editing the canonical wrapper itself.
- If a page needs different copy, data, or an anchor ID, add or use props on the canonical wrapper.
- If a page needs a visual variant, add that variant to the canonical wrapper and keep the behavior discoverable from the wrapper file.

Preferred usage:

```astro
---
import StudentTestimonials from '../components/StudentTestimonials.astro';
---

<StudentTestimonials />
```

Avoid page-level usage like this:

```astro
---
import SecondaryTestimonialsCarousel from '../components/SecondaryTestimonialsCarousel';
---

<SecondaryTestimonialsCarousel client:visible testimonials={items} />
```

That lower-level React component is an implementation detail. It relies on surrounding card, section, grid, and token styles. Using it directly can look correct in one layout but break in Vercel preview or after hydration.

## Global Section Styling Rules

- Required styles for a reusable global section should live with the canonical component whenever practical.
- If styles must live in a shared stylesheet, document the dependency in the component header and verify that every layout using the component loads that stylesheet.
- Scope reusable section styles with `[data-global-section="<id>"]` or the wrapper class. Avoid broad selectors like `.t-card`, `.testimonials-track`, or `.section-head` when writing global-section-specific rules.
- When moving a global section across layouts, check for required primitives such as `.grid12`, `.section`, `.section-head`, `.t-card`, token variables, and carousel CSS.
- Keep low-level React carousel components focused on behavior. Page agents should not patch their layout ad hoc in page files.

## Verification For Global Sections

- Run `npm run build` after changing or reusing a global section.
- Verify the route in a browser at desktop and mobile widths.
- For carousel or client-hydrated sections, verify after hydration. A Vite dev page can hide production bundling issues, and a production preview can expose missing CSS.
- If Vercel preview looks wrong after a fix, hard-refresh or open an incognito window before assuming the deployed build is wrong.
- For temporary audits, use `src/pages/global-audit.astro` if present, or create a temporary audit route that renders the canonical wrappers only.
