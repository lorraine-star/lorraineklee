# End-to-end tests (Momentic)

[Momentic](https://momentic.ai) drives a real browser to test the built site.
Tests are YAML files in this folder; project config lives in
[`../momentic.config.yaml`](../momentic.config.yaml).

## Test suite

| Test | Label | Checks |
| --- | --- | --- |
| `home-smoke` | smoke | Home hero, primary CTA, book section, stats, footer nav |
| `about-smoke` | smoke | About hero, intro, primary CTAs |
| `speaking-smoke` | smoke | Speaking hero, "Book Lorraine to speak", stats |
| `book-smoke` | smoke | Book title, accolades, buy CTAs |
| `learn-smoke` | smoke | Learn hero, course CTAs, free-course offer |
| `contact-smoke` | smoke | Contact heading, press email, socials |
| `courses-smoke` | smoke | Courses heading, ratings stat, course list |
| `consulting` | smoke | Consulting hero, services list, contact CTA |
| `interviews` | smoke | Interviews hero, guest appearances list |
| `media-kit` | smoke | Media-kit hero, copy-and-paste bios, headshots |
| `speaker-bio` | smoke | Speaker-bio hero, bios, downloads |
| `articles` | smoke | Articles index heading (empty-safe) |
| `keynotes` | smoke | Keynotes hero, keynote catalog, booking CTA |
| `course-signup-form` | regression | Home free-course form submit + success state |
| `work-with-me-cta` | regression | "Work With Me" routes to the contact page |
| `keynote-detail` | regression | Representative `/keynotes/[slug]` — hero, "Book this talk", takeaways |
| `course-detail` | regression | Representative `/courses/[slug]` — hero, "Watch on LinkedIn Learning" |
| `speaking-topic-detail` | regression | Representative `/speaking/[slug]` — hero, "Book this talk", takeaways |

Every page route has at least one test. Static pages and collection index pages
run as `smoke` (per deploy); the three dynamic detail templates are covered by
one representative slug each as `regression` (run in the nightly full sweep).

Page tests `navigate:` to a relative path; the suite auto-loads the base URL
first, which sets the Vercel bypass cookie on protected previews so subsequent
same-origin navigations are authorized.

## Run locally

```bash
# Full suite against a deployment (append the bypass for protected Vercel previews)
npx momentic run \
  --url-override "https://<deployment>.vercel.app?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true"

# Just the smoke tier
npx momentic run --url-override "https://<deployment>.vercel.app?..." --labels smoke
```

Set `MOMENTIC_API_KEY` in your environment first (assertions are AI-evaluated).
Author/edit tests with the `npx momentic` CLI or MCP — see the [docs](https://momentic.ai/docs).

## CI

| Workflow | Trigger | Runs |
| --- | --- | --- |
| [`momentic.yml`](../.github/workflows/momentic.yml) | every Vercel deploy + manual | `--labels smoke` |
| [`momentic-nightly.yml`](../.github/workflows/momentic-nightly.yml) | daily 09:00 UTC + manual | full suite vs. the `main` alias |

Smoke runs on every deploy (fast); the nightly runs the full suite against the
live `main` site to catch regressions and CMS/content changes that don't trigger
a deploy.

Repo secrets:

| Secret | Required? | Where |
| --- | --- | --- |
| `MOMENTIC_API_KEY` | Yes | Momentic dashboard → Settings → API keys |
| `VERCEL_BYPASS` | For protected previews | Vercel → Settings → Deployment Protection → "Protection Bypass for Automation" |

When `VERCEL_BYPASS` is set, both workflows append it (URL-encoded) so Momentic
can load protected deployments. Optional repo variable `MOMENTIC_NIGHTLY_URL`
overrides the nightly target.

## Conventions

- One user outcome per test; kebab-case `*.test.yaml` filenames.
- `smoke` = critical paths, run on every deploy. `regression` = deeper flows,
  kept off the per-deploy path and run in the nightly full sweep.
