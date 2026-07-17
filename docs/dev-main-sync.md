# Keeping `main` and `dev` in sync

## Why they drift

Two independent commit streams feed the two long-lived branches:

- **`main`** receives **content** commits. Keystatic Cloud (`keystatic-cloud[bot]`)
  commits every client content edit straight to `main`, because `main` is the
  production branch the live site deploys from.
- **`dev`** receives **code** commits. Feature work flows `feature -> dev` via PR.

Nothing merges the two back together automatically, so `main` accumulates content
`dev` never sees and `dev` accumulates code `main` never sees. Left alone, the two
diverge further every week and every eventual `dev -> main` release becomes a
bigger, more conflict-prone merge (see CLI-166).

## The rule going forward

`main` is the source of truth for **content**; `dev` is the source of truth for
**code**. To reconcile:

1. **Before every release, sync `main -> dev` first.** Merge `origin/main` into
   `dev` and resolve any content-file conflicts **field-by-field**:
   - keep `dev`'s new Keystatic schema fields (the editability structure), and
   - take **`main`'s value** for any field that exists on both (that is the
     client's live edit) — including image paths.
   This makes `dev` a superset of `main`, so the subsequent `dev -> main` release
   PR is conflict-free.
2. **Release `dev -> main`** via PR. Because step 1 already folded main into dev,
   the PR carries only new code and merges cleanly.
3. **`npm run validate:content` gates both directions.** The CLI-165 guard
   (`.github/workflows/validate-content.yml` + `scripts/validate-keystatic-images.mjs`)
   now lives on `dev` and `main`, so a reintroduced outside-folder or missing-file
   image path fails CI before merge, on either branch.

## Cadence

- **Always** run the `main -> dev` sync (step 1) immediately before opening a
  release PR.
- **Additionally**, run it on a light recurring cadence (e.g. weekly) so drift
  stays small and each sync is a handful of content-value conflicts, not a
  structural reconciliation.

## Root-cause alternative (larger change)

The drift disappears entirely if content and code stop landing on different
branches. Option: **point Keystatic Cloud at `dev`** (or a dedicated `content`
branch) instead of `main`. Then every edit lands where code integrates, and
`main` only ever advances through releases. Trade-off: client content edits would
no longer go live the instant they are saved — they would wait for the next
`dev -> main` release. Only adopt this if that publish delay is acceptable; today
Keystatic targets `main` specifically so edits publish immediately.

## Caveat the guard does NOT cover

`validate:content` passes on an **empty** image field. So an accidental *drop* of
the Speaking hero image (unsetting it) is NOT caught by CI. After any merge that
touches `speaking/index.yaml`, verify the deployed Speaking page actually renders
its hero image, not just that CI is green.
