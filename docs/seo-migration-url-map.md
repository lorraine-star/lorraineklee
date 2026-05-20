# SEO Migration URL Map — lorraineklee.com

**Linear:** CLI-38 — Map current URL structure for SEO migration plan
**Prepared:** 2026-05-19
**Source data:** `lorraineklee_verified_inventory_package/` (public-crawl inventory of 150 URLs, dated 2026-05-04) and `lorraineklee_admin_redirects.csv` (existing WordPress redirect rules).

## Purpose

Map every current WordPress URL to its target URL on the Astro site so existing
search rankings and inbound links survive the migration. Every URL is marked
**preserve** (path unchanged) or **301** (path changes — needs a redirect).

## Global rules

These apply site-wide and are **not** repeated per row below.

1. **Trailing slashes.** WordPress serves every URL with a trailing slash
   (`/about/`); the Astro build serves without (`/about`). Configure
   `trailingSlash: 'never'` in `astro.config.mjs` and add a single Vercel rule
   redirecting `/:path/` → `/:path` (301). Every "preserve" row below therefore
   still emits one slash-normalization 301 — handled globally, not per row.
2. **Host/protocol.** `http://` → `https://` and any `www.` host already
   normalize to `https://lorraineklee.com`; no change needed.
3. **Redirect type.** All redirects are **301 (permanent)** unless noted, so
   link equity passes to the target.

## Target Astro sitemap (intended)

| Astro URL | Status | Source page(s) |
|---|---|---|
| `/` | built | Home |
| `/about` | built | About |
| `/speaking` | built | Speaking |
| `/book` | built | Unforgettable Presence |
| `/contact` | built | Contact |
| `/learn` | built | Free Resources / Subscribe hub |
| `/articles` | built | Articles index |
| `/articles/[slug]` | built | Individual articles / newsletter issues |
| `/thought-leadership` | **pending** | Thought Leadership (slug change — see CLI-38) |
| `/testimonials` | **pending** | Testimonials |
| `/coaching` | **pending** | Coaching |
| `/consulting` | **pending** | Consulting |
| `/interviews` | **pending** | Guest Interviews |
| `/keynotes/[slug]` | **pending** | Keynote detail pages (CMS collection) |
| `/courses` | **pending** | LinkedIn Learning courses hub + collection |

Rows mapping to a **pending** target are flagged `⏳` — the redirect can only
go live once that page is built.

---

## 1. Core marketing pages

| WordPress URL | Target Astro URL | Strategy | Notes |
|---|---|---|---|
| `/` | `/` | preserve | |
| `/about/` | `/about` | preserve | |
| `/articles/` | `/articles` | preserve | |
| `/speaking/` | `/speaking` | preserve | |
| `/contact/` | `/contact` | preserve | |
| `/the-thought-leadership/` | `/thought-leadership` ⏳ | **301** | Known slug change confirmed by Lorraine's teammate 2026-05-04 — drop the extraneous "the". |
| `/featured-in/` | `/thought-leadership` ⏳ | **301** | Consolidate into Thought Leadership (overlapping content; matches existing WP rule id 12). Confirm with client. |
| `/testimonials/` | `/testimonials` ⏳ | preserve | |
| `/testimonials-old/` | `/testimonials` ⏳ | **301** | Legacy duplicate — consolidate. |
| `/coaching/` | `/coaching` ⏳ | preserve | |
| `/consulting/` | `/consulting` ⏳ | preserve | |
| `/mentorship/` | `/about` | **301** | Thin page — fold into About unless client wants a standalone page. |
| `/interviews/` | `/interviews` ⏳ | preserve | |
| `/free-resources/` | `/learn` | **301** | |
| `/subscribe/` | `/learn` | **301** | |
| `/unforgettable-presence/` | `/book` | **301** | Astro book page lives at `/book`. |
| `/awardsandaccolades/` | `/about` | **301** | Fold awards into About unless a standalone `/awards` page is wanted. |
| `/bio-and-headshot/` | `/media-kit` ⏳ | **301** | Press/media assets — group with Media Kit. |
| `/media-kit/` | `/media-kit` ⏳ | preserve | |
| `/portfolio-2/` | `/speaking` | **301** | Portfolio content overlaps Speaking. Confirm with client. |
| `/learning-courses/` | `/courses` ⏳ | **301** | |
| `/linkedin-presence-training/` | `/speaking` | **301** | Training offer — fold into Speaking/Training. Confirm. |
| `/video-communications-training/` | `/speaking` | **301** | As above. |
| `/prezi-presentation-design-services/` | `/speaking` | **301** | As above. Confirm whether service is still offered. |

## 2. Legal / utility pages

| WordPress URL | Target Astro URL | Strategy | Notes |
|---|---|---|---|
| `/privacy-policy/` | `/privacy-policy` ⏳ | preserve | |
| `/terms-privacy-legal/` | `/terms-privacy-legal` ⏳ | preserve | |
| `/payment-policy/` | `/payment-policy` ⏳ | preserve | Carry only if commerce is migrated. |
| `/subscribe/`, `/your-preferences-updated/` | `/learn` | **301** | Preference-center pages — consolidate. |
| `/key-takeaways-download/` | `/learn` | **301** | Thin download page. |
| `/survey-ultimate-guide/` | `/learn` | **301** | Thin. |

## 3. Posts — articles & newsletter issues

Map to `/articles/[slug]`, keeping the existing slug where possible.

| WordPress URL | Target Astro URL | Strategy |
|---|---|---|
| `/issue-42-why-youre-feeling-burnt-out-and-how-to-fix-it/` | `/articles/issue-42-why-youre-feeling-burnt-out-and-how-to-fix-it` ⏳ | **301** |
| `/issue-43-what-your-linkedin-headline-is-missing/` | `/articles/issue-43-what-your-linkedin-headline-is-missing` ⏳ | **301** |
| `/issue-44-how-to-create-a-superpowered-agenda/` | `/articles/issue-44-how-to-create-a-superpowered-agenda` ⏳ | **301** |
| `/issue-45-have-you-taken-advantage-of-this-linkedin-feature/` | `/articles/issue-45-have-you-taken-advantage-of-this-linkedin-feature` ⏳ | **301** |
| `/tools-and-techniques-for-smarter-work/` | `/articles/tools-and-techniques-for-smarter-work` ⏳ | **301** |
| `/amy-j/`, `/apurva-bhagali/`, `/dorienne-b/`, `/jason-r/`, `/rachel-h/`, `/samantha-l/`, `/sulbha-m/`, `/teju-k/`, `/women-leaders-in-data-al/` | `/testimonials` ⏳ | **301** |

> The 9 person-name post slugs are testimonial entries miscategorized as posts —
> redirect to the consolidated `/testimonials` page (or to anchors within it).

## 4. Keynotes (custom post type)

WordPress exposes **two** route families for the same keynotes —
`/keynote/...` and `/keynotes_v2/...`. Pick `/keynotes/[slug]` as canonical in
Astro and 301 **both** WP families to it.

| WordPress URL pattern | Target Astro URL | Strategy |
|---|---|---|
| `/keynote/{slug}/` | `/keynotes/{slug}` ⏳ | **301** |
| `/keynotes_v2/{slug}/` | `/keynotes/{slug}` ⏳ | **301** |
| `/keynotes-archive/` | `/speaking` | **301** |

Affected slugs (10 `/keynote/*` + 6 `/keynotes_v2/*`): `9-essential-tips-for-more-effective-hybrid-and-virtual-meetings`,
`communicate-with-confidence-in-a-virtual-world`,
`how-to-build-influence-in-the-hybrid-office`,
`how-to-build-your-linkedin-presence`,
`how-to-lead-with-impact-strategies-to-build-collaboration-and-trust-on-your-team`,
`how-to-present-like-a-pro`,
`how-to-stand-out-virtually-video-and-linkedin-essentials`,
`make-a-memorable-first-impression-on-video-the-tea-method`,
`supercharge-your-executive-presence-a-leaders-guide-to-managing-your-brand-at-work`.

## 5. LinkedIn Learning courses (custom post type)

27 `/linkedin-courses/*` URLs. Many are duplicate pairs (with/without
`-with-lorraine-k-lee` suffix). Pick one canonical slug per course under
`/courses/[slug]` and 301 the rest.

| WordPress URL pattern | Target Astro URL | Strategy |
|---|---|---|
| `/linkedin-courses/{slug}/` | `/courses/{canonical-slug}` ⏳ | **301** |
| Duplicate variant slugs | `/courses/{canonical-slug}` ⏳ | **301** |

> Duplicate pairs to collapse (keep the `-with-lorraine-k-lee` variant as
> canonical for consistency): better-business-writing, effective-collaboration,
> new-managers, stand-out-as-an-introvert, virtual-and-hybrid-meeting-essentials,
> hybrid-meetings, how-to-speak. Action: build a deduplicated course collection.

## 6. Testimonial / video custom post types

| WordPress URL pattern | Target Astro URL | Strategy | Notes |
|---|---|---|---|
| `/testimonial/{slug}/` (9 URLs) | `/testimonials` ⏳ | **301** | Convert to CMS collection rendered on the Testimonials page. |
| `/youtube-video/{slug}/` (4 URLs) | `/interviews` ⏳ | **301** | Convert to CMS collection on Interviews. |

## 7. Archive / taxonomy / author routes

WordPress auto-generates these. The Astro site has no equivalent archives.

| WordPress URL pattern | Target Astro URL | Strategy |
|---|---|---|
| `/category/{slug}/` (6 URLs) | `/articles` | **301** |
| `/tag/{slug}/` (2 URLs) | `/articles` | **301** |
| `/keynote-category/{slug}/` (2 URLs) | `/speaking` | **301** |
| `/author/lorraineklee/` | `/about` | **301** |

## 8. Commerce / payment pages

These depend on whether WooCommerce/Stripe checkout is migrated. **Do not 301
to content pages** until the commerce decision is made — a premature redirect
breaks live payment flows.

| WordPress URL | Recommended action |
|---|---|
| `/cart/`, `/checkout/`, `/shop/`, `/my-account/` | Hold — confirm whether store is retired. If retired, 301 → `/` and remove from sitemap. |
| `/payment-form/`, `/payment-form-ecamm-bundle/`, `/payment-form-for-purchasing-the-recording/`, `/payment-form-for-qa-and-an-additional-live-qa-session/`, `/unforgettable-presence-linkedin-guide-payment/`, `/masterclass-checkout/` | Hold — validate each active payment flow before redirecting or retiring. |
| `/payment-confirmation/`, `/payment-failed/` | Keep as functional transactional pages or retire with the store. |

## 9. Legacy / event / thin pages — confirm with client, then retire

Crawl flagged these as stale, event-specific, or thin. Default: **noindex +
301 to the nearest evergreen page**, pending client confirmation.

| WordPress URL | Target Astro URL | Strategy |
|---|---|---|
| `/training-old/` | `/speaking` | **301** |
| `/googlefireside2025/`, `/hercareerstory-may2025/`, `/servicenow-linkedin-2025/` | `/speaking` | **301** (event pages — confirm if any are still promoted) |
| `/zoomies/` | `/` | **301** (confirm) |
| `/staging-for-unforgettable-presence-tm/` | `/book` | **301** (staging artifact — should not be public) |
| `/linkedin-replay/`, `/linkedin-training-replay/`, `/linkedin-training/` | `/speaking` | **301** |
| `/ecamm-workshop/`, `/ecamm-bonuses/` | `/` | **301** (confirm if workshop still sold) |
| `/from-invisible-to-influential/`, `/from-invisible-to-influential-thank-you/` | `/learn` | **301** (active 5-day course — confirm canonical home) |
| `/ultimate-linkedin-guide/`, `/ultimate-guide-to-linkedin-free-version/` | `/learn` | **301** |
| `/unforgettable-presence-masterclass/` | `/book` | **301** |
| `/from-the-archive-*` (3 URLs) | `/articles/{slug}` ⏳ | **301** |
| `/email-me-with-your-topic-of-interest/`, `/thank-you-for-sharing-your-interest/`, `/thank-you-youre-still-on-the-list/`, `/linkedin-workshop-video/`, `/key-takeaways-download/` | `/contact` or `/learn` | **301** (thin utility pages) |
| `/newsletter-back-issues/` | `/articles` | **301** |
| `/async-linkedin-profile-audit-assessment/` | `/coaching` ⏳ | **301** (confirm if service active) |

## 10. Existing WordPress vanity / campaign short-links

`lorraineklee_admin_redirects.csv` holds **~190 existing redirect rules** —
short marketing links (`/amazon`, `/buybook`, `/masterclass`, `/zoom`, booking
links, etc.). These are **not** content pages and most point to external
services (Maven, ConvertKit/Kit, Google Docs, LinkedIn Learning, booking apps).

**Strategy:** the CSV **is** the authoritative mapping for this group.

- **`enabled` rules → preserve.** Port every enabled rule into `vercel.json`
  redirects (or a dedicated redirect config) so the short-links keep working.
- **`disabled` rules → drop.** Do not migrate.
- **Cleanup before porting:**
  - Circular pairs both `enabled` — e.g. `/consulting-and-coaching/` ⇄
    `/consulting/` (rows 17/20), `/training/` → `/trainings/` vs `/speaking-copy/`.
    Resolve to a single direction.
  - Internal-target rules (e.g. `/learn` → `/subscribe/`, `/featured-in/` →
    `/thought-leadership/`) must be reconciled against Sections 1–9 above so
    WordPress short-links and the Astro sitemap don't disagree. **Conflict
    flagged:** WP rule id 5 sends `/learn` → `/subscribe/`, but this plan makes
    `/learn` a real Astro page — drop that rule.
  - `/book` and `/book/` (rows 165/166/202) → external book page; in Astro
    `/book` is a real page, so **these rules must be removed** or they will
    shadow the new Book page.
- **Implementing all ~190 in `vercel.json` is a follow-up task** (recommend a
  separate ticket); this plan only ships the one redirect CLI-38 calls out as
  critical (see below).

## Implemented in this PR

`vercel.json` now contains the critical redirect from CLI-38:

```
/the-thought-leadership/  →  /thought-leadership/   (301)
```

## Open questions for the client

1. Is the WooCommerce/Stripe store still active, or fully retired? (Section 8.)
2. Keep `/featured-in`, `/mentorship`, `/portfolio`, `/awardsandaccolades` as
   standalone pages, or consolidate as proposed?
3. Which event pages (Google, ServiceNow, HerCareerStory, Zoomies) are still
   promoted and need a live URL?
4. Confirm canonical home for the "From Invisible to Influential" 5-day course.
