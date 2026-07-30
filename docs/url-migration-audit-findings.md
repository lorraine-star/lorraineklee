# WordPress → Astro URL migration audit — findings

**Date:** 2026-07-30
**Audited against:** `https://lorraineklee.com` (production, Vercel deployment `e4be32f`)
**Full per-URL table:** [url-migration-audit.md](url-migration-audit.md) (319 rows)
**Raw data:** `docs/url-migration-audit.json`
**Reproduce:** `node scripts/audit-url-migration.mjs`

---

## Headline

**279 of 319 known WordPress URLs 404 on production in the exact form Google indexed
them.** The redirect table is written slash-less (`/mentorship`); WordPress served,
canonicalized and got indexed with a trailing slash (`/mentorship/`); nothing on the
new site normalizes between the two. Every 301/308 in `vercel.json`, `astro.config.mjs`
and the Keystatic shortlinks collection is therefore invisible to the traffic it was
written for.

```
GET https://lorraineklee.com/mentorship/   →  404      (the indexed URL)
GET https://lorraineklee.com/mentorship    →  308 → /about   (the redirect that exists)
```

Pages that were *preserved* at their original path are unaffected — Astro emits
`/about/index.html`, which Vercel serves for both forms. Only **redirects** are
slash-sensitive. That is why the site looks healthy when you click around and is
broken for everything arriving from search or an old link.

135 of the 150 URLs in the May 2026 public crawl — the crawl that represents the
indexed WordPress site — are in the 404 set.

---

## 1. Inventory

| Source | URLs | Notes |
|---|---:|---|
| Public crawl, 2026-05-04 (`lorraineklee_content_inventory.csv`) | 150 | Yoast sitemap + discovery; the best proxy for what is indexed |
| WordPress DB export (`lorraineklee_admin_content_inventory.csv`) | 138 | published `page`, `post`, `linkedin-courses`, `keynote`, `keynotes_v2`, `testimonial`, `youtube-video` |
| WP Redirection plugin rules (`lorraineklee_admin_redirects.csv`) | 163 enabled / 201 total | vanity + campaign short links |
| `vercel.json` | 166 rules | 164 literal + 2 pattern (`/category/:slug`, `/tag/:slug`) |
| `astro.config.mjs` | 2 static | `/keynotes` → `/speaking`, `/media-kit` → `/speaker-bio` |
| Keystatic `links` collection | 114 entries | 113 active → 301s generated at build |
| **Union, deduplicated** | **319** | |

Cross-checks: the 138 DB URLs and the 150 crawled URLs agree; every WP content type
that had a public URL is represented. The inventory package is gitignored client data
and lives in the main checkout at `docs/lorraineklee_verified_inventory_package/`.

### Inventory gaps

The inventory is **complete for pages that existed on 2026-05-04** and incomplete in
three specific ways:

1. **No Search Console export.** The crawl finds pages that were linked; it cannot find
   URLs that only exist as backlinks or historical index entries — old campaign
   landing pages, deleted posts that still rank, URLs with query strings. *Fill with:*
   Search Console → Performance → Pages, 16-month export, plus the Index Coverage
   report's "Excluded" tab.
2. **No `sitemap.xml` snapshot from the WP site.** The site is off WP Engine, so the
   Yoast sitemap can only be recovered from the permanent archive
   (`Lorraine backups\lorraineklee-wordpress-permanent-archive-2026-05-29\`) or the
   Wayback Machine. The crawl was seeded from it, so the delta is probably small.
3. **No attachment/media URLs.** 1,840 `attachment` rows were excluded — WP media
   permalinks (`/?attachment_id=`, `/uploads/...`) are not audited here.

Given the 404 finding below, the Search Console export is worth pulling regardless:
it is the only way to see which of these URLs are still being requested.

---

## 2. Unnecessary slug changes

Of 319 old URLs, only **14** are true 1:1 slug changes — one old URL, one new page,
different path, no consolidation. Everything else changed path for a structural
reason (merged into a hub, became an anchor, retired, or was always an off-site link).

| Old URL | New URL | Kind | Could we serve the old path? | Switch back now? |
|---|---|---|---|---|
| `/consulting-and-coaching/` | `/consulting` | slug | Yes | **No** — the WP site already 301'd this to `/consulting` before migration. `/consulting` is the older canonical; keep it. |
| `/newsletter/` | `/subscribe/` | slug | Yes | **No** — `/newsletter` was a WP Redirection vanity rule, not a page. `/subscribe/` is the real WP page path and is preserved. Correct as-is. |
| `/keynote/{slug}/` ×3 | `/keynotes/{slug}` | directory | Yes — `src/pages/keynote/[slug].astro` has no conflict | **Recommend keeping the redirect.** WP exposed the same 9 keynotes under *two* prefixes (`/keynote/` and `/keynotes_v2/`); one canonical prefix had to win, and `/keynotes` matches `/courses`, `/articles`. Reverting would re-fragment. |
| `/linkedin-courses/{verbose-slug}/` ×10 | `/courses/{short-slug}` | directory + slug | Directory: yes. Slug: yes. | **Recommend keeping.** 27 WP URLs collapse to 18 courses; 9 are duplicate pairs, so most of the family had to redirect anyway. Keeping `/linkedin-courses/nano-tips-for-quick-decision-making-with-lorraine-k-lee` to save one redirect is not worth the URL. |

The 3 `/keynote/*` and 10 `/linkedin-courses/*` rows above are the *1:1 remainder* of
families that are otherwise many-to-one — they are 1:1 only because those particular
slugs had no duplicate twin. Treating them differently from their siblings would be
worse than the redirect.

**Verdict: no unnecessary slug change needs reverting.** The migration's path choices
are defensible. The damage is in the delivery mechanism (§3–4), not the URL design.

One design note that *is* worth revisiting: **23 old article/newsletter URLs redirect
to the `/articles` index rather than to an article page** (15 literal rules plus the
8 `/category/*` and `/tag/*` archives caught by the two pattern rules), because the
Keystatic `articles` collection is empty — `src/content/articles/*/` does not exist,
so `/articles/[slug]` builds zero pages. Google treats a many-to-one redirect onto a
generic hub as a soft 404 and passes little or no equity. Those URLs — including the
4 indexed `issue-4x` newsletter posts and 3 `from-the-archive-*` posts — are the
largest recoverable SEO loss after the trailing-slash bug.

---

## 3. Redirect correctness (static + live)

| Check | Result |
|---|---|
| Permanent vs temporary | **All permanent.** No 302/303/307 originates on our host. |
| `vercel.json` (`permanent: true`) | Emits **308**, not 301 |
| `astro.config.mjs` + shortlinks | Emit **301** |
| apex → www | **308** |
| Client-side redirects | **None** — no meta-refresh, no JS redirect anywhere |
| Redirect loops | **None** |
| Chains on our host | **None** — every old URL reaches its target in one hop |

308 is `301 Moved Permanently` with the method preserved. Google states it treats 308
exactly as 301 for indexing and link equity, so the mixed 301/308 is cosmetically
inconsistent but SEO-neutral. Not worth changing.

Two real chain-adjacent items:

- **Every old URL costs one extra hop** because the apex 308s to `www` before the
  redirect table is consulted (`/mentorship` → 308 → `www/mentorship` → 308 →
  `/about`). Harmless for ranking, but it means the redirect table would be reached
  one hop sooner if the redirects were also served on the apex.
- **25 shortlinks chain through an external hop** whose input we control:
  15 LinkedIn Learning links still use the retired `-with-lorraine-lee` slug and 301
  to `-with-lorraine-k-lee`; 10 Kit links still use `lorraineklee.ck.page` and 301 to
  `lorraineklee.kit.com`. Repointing them removes a hop each.

---

## 4. Live verification

Script: [`scripts/audit-url-migration.mjs`](../scripts/audit-url-migration.mjs).
It requests every old URL in **both** forms, follows each hop manually (no automatic
following), and records status, `Location`, meta-refresh, and the final landing URL.
635 requests against production.

**Historical form `/old/`** — 319 URLs:

| Outcome | Count |
|---|---:|
| 404 | **299** (279 that have a configured redirect + 20 that have none) |
| 200 | 19 (the preserved pages) |

**Bare form `/old`** — 318 URLs (`/` has no bare form):

| Outcome | Count |
|---|---:|
| Lands on a page on our site (200) | 192 |
| Lands on a live external destination (200) | 77 |
| **404 on our site — no redirect, no page** | **13** |
| Redirect fires, but the **external destination is dead** (404/410) | 20 — 14 booking widgets, 5 Kit pages, 1 Stanford course (410) |
| External destination gated from an anonymous bot (401/403/429/999) | 16 — Google Docs/Drive, LinkedIn, gamma.app; needs a signed-in spot-check, not a code fix |
| 500-class errors | 0 |
| 302 / 307 on our host | 0 |
| Loops | 0 |

### 13 URLs that 404 in both forms

| URL | Why it matters |
|---|---|
| `/payment-policy/` | **A real indexed WP page** (crawl status 200, `index,follow`). Dropped with no redirect. |
| `/CC-feedback`, `/cisco-linkedin-DD`, `/NISM-discount`, `/NUL-feedback`, `/SASE-resources`, `/SASE-workbook`, `/WS-feedback`, `/catch-up-APAC-timezone-30min` | **Case regression.** The WP Redirection rules were mixed-case; `src/lib/shortlinks.ts` lowercases every slug, so only the lowercase twin resolves. These are links printed on workshop slides and handed to clients. |
| `/home` | WP's internal front-page slug; never a public URL. Ignore. |
| `/8074ab1a1f` | A Kit hash the WP rules aliased to `/linkedin-guide`. Marginal. |
| `/r8u62l05.../aHR0cDov...` | A ConvertKit click-tracking blob. Ignore. |

### Other live observations

- **No `src/pages/404.astro`.** Every miss lands on Vercel's bare
  `404: Not Found` page — no branding, no navigation, no route back into the site.
  With 279 URLs currently 404ing, this is the page most old traffic sees.
- **Canonical and sitemap point at a redirecting host.** `astro.config.mjs` sets
  `site: 'https://lorraineklee.com'` (apex), but the apex 308s to `www`. So every
  `<link rel="canonical">`, every `og:url`, every `<loc>` in `sitemap-0.xml`, and the
  `Sitemap:` line in `robots.txt` names a URL that redirects. Google resolves this,
  but the declared canonical should be a 200 URL.
- `review/vercel.json` sets `"trailingSlash": true` — it is a nested config in a
  static design-review folder and Vercel ignores it. Misleading; worth deleting.
- Two Keystatic entries have a `slug:` field that disagrees with their filename
  (`buy-the-book.yaml` says `book`, `catch-up-30-mins.yaml` says `catch-up`). The
  filename wins, so both work; the stale field is a data-consistency wart.

---

## 5. Coverage of the new site

All **47** built pages are accounted for. Zero orphans.

| Status | Count |
|---|---:|
| Serving at the original WordPress path (no redirect needed) | 19 |
| New path, reachable via ≥1 redirect | 28 |
| New path with no old URL pointing at it | **0** |

The 28 new paths are the 18 `/courses/*`, the 9 `/keynotes/*`, and `/speaker-bio`.
Each has 1–2 old URLs redirecting in.

---

## Fix list, ordered by SEO risk

### P0 — Restore trailing-slash matching (fixes 279 URLs)

**Why it broke.** Vercel builds its route table in a fixed order: `redirects` from
`vercel.json` first, then `cleanUrls`, then trailing-slash normalization
(`getTransformedRoutes` in `@vercel/routing-utils`). Nothing in this project sets
`trailingSlash`, so the normalization routes are never emitted at all. A request for
`/mentorship/` is tested against every redirect `source` — all written slash-less —
matches none, falls through to the filesystem, and 404s. `/about/` survives only
because Astro emitted a real `about/index.html` for it.

**Fix — one rule, first in the `redirects` array of `vercel.json`:**

```json
{ "source": "/(.+)/", "destination": "/$1", "permanent": true }
```

`(.+)` requires at least one character, so `/` itself never matches and cannot loop.
Slash traffic then costs two hops (`/mentorship/` → 308 → `/mentorship` → 308 →
`/about`), which Google follows without penalty. Exclude the admin routes so the
Keystatic SPA is not normalized underneath itself — either place the rule after a
`{"source": "/keystatic/(.*)", ...}` guard or scope the pattern.

Pair it with `trailingSlash: 'never'` in `astro.config.mjs` so `Seo.astro`'s canonical
(`new URL(Astro.url.pathname, site)`) and the sitemap stop emitting the `/about/` form
that the new rule redirects away from. That moves the 19 preserved pages to the
slash-less canonical — one 308 on pages that currently 200, in exchange for 279 that
currently 404.

**If two hops is unacceptable,** duplicate each redirect with a slash-form `source`
(166 → 332 rules, well under Vercel's 1,024 limit) for a single hop. Not worth it
unless a specific high-value URL demands it.

Verify with `node scripts/audit-url-migration.mjs` against the preview deployment
before merging: the `Live /old/` column should stop showing 404. Do not assume the
Astro adapter propagates `trailingSlash` into the Vercel output config — check the
deployed behaviour, not the config.

### P1 — Recover the article URLs (22 URLs, incl. 7 indexed posts)

`src/content/articles/` does not exist, so `/articles/[slug]` builds nothing and every
old post redirects onto the `/articles` hub. Import the 14 published WP posts into the
Keystatic `articles` collection and repoint each redirect at its own article page.
Highest-value: `issue-42/43/44/45`, the 3 `from-the-archive-*` posts.

### P2 — `/payment-policy/` returns 404

An indexed, `index,follow` WP page with no successor. Either publish it (it belongs
with `/terms-privacy-legal`) or 301 it to `/terms-privacy-legal`.

### P3 — Case-sensitivity regression (8 vanity links)

Add mixed-case aliases for the 8 WP rules that had uppercase segments, or lowercase
the slug in the Vercel/Astro matcher. These are handed out in person, so a 404 is a
lost lead rather than lost ranking.

### P4 — 20 shortlinks redirect to a dead destination

14 `my.onlinebusinessautomator.com` booking widgets return 404, 5 Kit pages return 404,
and `/stanfordcom92` returns 410. Our redirect works; the far end is gone. Needs
Lorraine to supply current URLs or the entries should be deactivated.

### P5 — Housekeeping

- Add `src/pages/404.astro` with navigation back into the site.
- Set `site` to whichever host is canonical (`www` is what actually serves) so
  canonicals, `og:url` and the sitemap stop naming a redirect.
- Repoint 15 LinkedIn Learning shortlinks to `-with-lorraine-k-lee` and 10 Kit
  shortlinks to `lorraineklee.kit.com` to drop one hop each.
- Delete `review/vercel.json`; fix the two stale `slug:` fields.
- Pull the Search Console 16-month page export to close the inventory gap (§1).
