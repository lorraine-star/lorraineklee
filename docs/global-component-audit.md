# Global Component Audit (CLI-138)

Decision document for which components on lorraineklee.com should be a single
shared/global source of truth versus intentionally page-local.

## Summary

The triggering symptom was the footer rendering inconsistently across pages:
the social icons (and several other details) differed page to page. This
audit is the full sweep behind that symptom. The goal is one source of truth
for anything meant to be identical site-wide, while keeping intentional
per-page variants clearly documented so they are not "fixed" by accident.

### Method

- Enumerated every repeated section/component across `src/components`,
  `src/layouts`, and `src/pages`.
- For each, traced where it is rendered and compared the actual markup,
  data, and asset paths between instances.
- Classified each into one verdict: `Already global`, `Globalize now`,
  `Intentionally page-local`, or `Follow-up`.
- Cross-checked against the existing global-section registry (the header
  comment in `src/pages/index.astro`) and the `data-global-section`
  tagging convention.

## Decision matrix

| Component / section | Where it appears | Verdict | Notes |
| --- | --- | --- | --- |
| `TrustAsSeenIn.astro` (`trust-as-seen-in`) | Multiple pages via shared wrapper | Already global | Tagged `data-global-section`. Keep. |
| `Testimonials.astro` (`testimonials`) | Multiple pages via shared wrapper | Already global | Tagged `data-global-section`. Keep. |
| `StudentTestimonials.astro` (`student-testimonials`) | Multiple pages via shared wrapper | Already global | Tagged `data-global-section`. Keep. |
| `BookPromo.astro` (`book-promo`) | Multiple pages via shared wrapper | Already global | Tagged `data-global-section`. Keep. |
| `CookieBanner.astro` | All 4 layouts (HomeLayout, Layout, FunnelLayout, SpeakingLayout) | Already global | Single component rendered by every layout. Keep. |
| Site navigation (`SiteNav.astro`, `editorial/EditorialNav.astro`) | `SiteNav` in default `Layout`; `EditorialNav` in SpeakingLayout, FunnelLayout, and home | Already global | Both consume `mainNavItems` from `src/lib/nav.ts`, so link sets stay consistent. No action. |
| **Footer (social icons + brand + base bar)** | `EditorialFooter.astro` via SpeakingLayout (~16 editorial pages) vs an inline-duplicated copy in `src/pages/index.astro` (~lines 230-303) | **Globalize now** | The headline fix. Identical markup that has diverged. See details below. |
| Social-icon SVGs | Third copy inline in `src/pages/contact.astro` (lines 31-45) | Globalize now | Same icon set duplicated a third time; should consume the shared social source of truth. |
| `FunnelLayout.astro` minimal footer | Funnel/conversion pages | Intentionally page-local | Lean footer, no socials, by design for conversion pages. Keep as a variant. |
| `Layout.astro` minimal footer | Utility pages | Intentionally page-local | Single-line copyright, no socials, by design. Keep as a variant. |
| `FreeCourseForm.astro` | Subscribe + funnel | Intentionally page-local | Context-specific form; not a sitewide identical element. Keep. |
| `DynamicIslandTOC` (`ui/dynamic-island-toc.tsx`) | Legal pages | Intentionally page-local | Table of contents specific to long legal pages. Keep. |
| React testimonial carousels + `ui/*` building blocks | Behind the global testimonial wrappers | Intentionally page-local | Correctly encapsulated implementation pieces. Pages should use the `Testimonials.astro` / `StudentTestimonials.astro` wrappers, never these directly. Keep. |
| Buttons / CTAs | ~20 pages, shared `.btn` CSS classes inline, plus a separate React `ui/button.tsx` | Follow-up | Renders consistently because the CSS is shared, so not a divergence bug. A sitewide swap to one component would touch many files and risk regressions. Recommend a dedicated follow-up ticket. |
| `CourseTestimonials.tsx` | (none) | Follow-up (dead code) | Appears unused. Being removed in a sibling PR. See dead-code note below. |

## The footer: divergence details (Globalize now)

`src/components/editorial/EditorialFooter.astro` (rendered by SpeakingLayout
across the editorial pages) and the inline footer in `src/pages/index.astro`
share identical markup but have drifted in four ways:

1. **Social URLs.** Editorial uses bare URLs (`instagram.com`, `youtube.com`,
   `x.com`); the homepage uses handle URLs (`instagram.com/lorraineklee`,
   `youtube.com/@lorraineklee`, `x.com/lorraineklee`). This is the visible
   "social icons differ page to page" symptom.
2. **Logo path.** Editorial uses `/images/editorial/logo-primary.png`; the
   homepage uses `/images/v1/logo-primary.png`.
3. **Base-bar links.** Editorial shows Terms + Privacy + Contact; the
   homepage shows Contact only.
4. **Copyright.** Editorial uses a dynamic `{year}`; the homepage hardcodes
   `(c) 2026`.

A third copy of the social-icon SVGs lives in `src/pages/contact.astro`
(lines 31-45), independent of both footers.

### Resolution (being implemented in a sibling PR; code not touched here)

- A single `src/lib/social.ts` source of truth for social links and icons.
- A canonical `src/components/Footer.astro`, tagged
  `data-global-section="site-footer"`, accepting a `logoSrc` prop so the
  one legitimate per-page difference (logo asset path) stays configurable.
- Consumed by SpeakingLayout, `src/pages/index.astro`, and the
  `src/pages/contact.astro` icons, replacing all three duplicated copies.

This keeps the footer identical everywhere except for the explicitly
parameterized logo, and removes the SVG triplication.

## Dead-code finding

- `src/components/CourseTestimonials.tsx` appears unused (no importers).
  Being removed in a sibling PR.
- Do NOT remove `src/components/ui/interfaces-carousel.tsx` or
  `src/components/ui/testimonials-columns-1.tsx`. They ARE used:
  `interfaces-carousel.tsx` by `HomeTestimonialsCarousel.tsx` and
  `testimonials-columns-1.tsx` by `SecondaryTestimonialsCarousel.tsx`,
  which the global testimonial wrappers render.

## Global-section registry convention

Shared sections follow an existing convention:

- Each shared section is tagged with `data-global-section="<id>"` in its
  markup. Search for that attribute to find every instance.
- The canonical registry lives in the header comment of
  `src/pages/index.astro`. When another page needs a shared section, import
  the canonical component rather than copying its markup, and do not redesign
  a global section in isolation.
- Coordinate edits to global sections via Linear so parallel worktrees do
  not drift.

Current registry entries: `trust-as-seen-in`, `testimonials`,
`student-testimonials`, `book-promo`. **`site-footer` is being added** to
that registry as part of the footer consolidation.

## Recommendations / next steps

- **This batch:** consolidate the footer into a single canonical
  `Footer.astro` plus `src/lib/social.ts`, tagged
  `data-global-section="site-footer"`, consumed by SpeakingLayout,
  `index.astro`, and the `contact.astro` icons. Add `site-footer` to the
  registry in the `index.astro` header comment. Remove the unused
  `CourseTestimonials.tsx`.
- **Keep as variants:** the FunnelLayout and Layout minimal footers,
  `FreeCourseForm.astro`, and `DynamicIslandTOC` are intentionally
  page-local; do not fold them into the global footer.
- **Follow-up ticket:** introduce a single `Button` component to replace the
  inline `.btn` CSS usage and the separate React `ui/button.tsx`. Not in
  this batch because CTAs already render consistently (shared CSS), so this
  is cleanup rather than a divergence bug, and a sitewide swap risks
  regressions and merge conflicts across many files.
