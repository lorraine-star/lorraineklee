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
| Buttons / CTAs | ~20 pages, shared `.btn` CSS classes inline, plus a separate React `ui/button.tsx` | Follow-up (tier 2) | Renders consistently because the CSS is shared, so not a divergence bug. Componentize incrementally as pages are touched (no separate ticket); a big-bang sitewide swap risks regressions. |
| Page hero / section head / CTA shells | ~21 pages, inline markup sharing CSS classes (`page-hero`, `section-head`) | Globalize incrementally (tier 2) | Same shell, page-local content. No shared component today. Prototype `PageHero.astro` added and `coaching.astro` converted. See "Tiers of sharing" below. |
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

## Tiers of sharing: shared shell vs shared content

Not everything that repeats should be a tier-1 global. There are three tiers:

1. **Tier 1: global singleton.** Same markup AND same content everywhere. One
   canonical component, no props; a change propagates automatically. Examples:
   the footer socials, nav links, press marquee, cookie banner. This is what
   the footer consolidation above fixed.
2. **Tier 2: parameterized shared component.** Same markup/structure, but the
   content changes per page. The component owns the shell; content is injected
   via props/slots or pulled from the CMS by a key/placement. Examples already
   in the codebase: `Testimonials.astro` (props or
   `getTestimonials({ placement })`), `FreeCourseForm.astro` (`formId`,
   labels), `EditorialNav.astro` (`activeId`, CTA), and the new `Footer.astro`
   (`logoSrc`). At the page level, Astro's `src/layouts/*.astro` + `<slot/>` is
   the same idea: identical outer shell, different page body.
3. **Tier 3: page-local.** Unique to one page; inline.

### The tier-2 gap (page heroes, section heads, CTA blocks)

These section shells are tier-2 by nature (same structure, different copy per
page) but are currently held together only by shared CSS classes inlined
across roughly 21 pages (`page-hero`, `section-head`, `.btn`), with no shared
component. That looks consistent today, but the structure is shared by
convention, not enforced: a markup change on one page will not propagate, which
is the same failure mode as the footer, just slower to surface.

**Prototype (this work):** `src/components/PageHero.astro` was introduced as the
tier-2 pattern and `src/pages/coaching.astro` was converted to use it. The
component owns the hero shell (eyebrow, headline, lead) via props; each page
keeps its own CTAs in the default slot. The same approach extends to a
`SectionHead` and a shared `Button`/`Cta`. Per decision, this is done
incrementally as pages are touched, without a separate ticket.

## Shared cross-layout behavior (not a visual section)

Beyond the visual sections above, some shared *behavior* also needs one source
of truth so it cannot drift between layouts.

- **Scroll reveal / staggered waterfall** (CLI-132, PR #105). Canonical module:
  `src/scripts/reveals.ts`, exposing
  `initReveals({ staggerStep, forceRevealAfter })`. Both editorial layouts import
  it: SpeakingLayout calls `initReveals()` (80ms stagger); FunnelLayout calls
  `initReveals({ staggerStep: 70, forceRevealAfter: 2500 })` plus its own
  `html.fc-js` CSS fallback. The supporting CSS (`.reveal`, `.reveal.is-in`,
  reduced-motion) lives in `src/styles/editorial/templates.css`. Do not
  reintroduce a per-layout copy of the reveal logic. Registered global sections
  that sit inside a `.reveal` / `.reveal-stagger` container are *consumers* of
  this behavior (they depend on the host layout calling `initReveals()`), not
  drivers. HomeLayout (home page, this audit/gallery page) has no reveal system
  and is untouched.

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
- **Componentize incrementally (no separate ticket):** promote the tier-2
  section shells (page hero, section head, CTA/`Button`) to shared components
  the way `PageHero.astro` now does for the hero. Convert pages as they are
  touched rather than in one sitewide swap, since CTAs already render
  consistently via shared CSS and a big-bang refactor risks regressions.
