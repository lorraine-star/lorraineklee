# End-to-end tests (Momentic)

[Momentic](https://momentic.ai) drives a real browser to smoke-test the built
site. Tests are YAML files in this folder; project config lives in
[`../momentic.config.yaml`](../momentic.config.yaml).

## Run locally

```bash
# Against the live/production site
npx momentic run --env production

# Against a specific deployment (e.g. a Vercel preview)
npx momentic run --url-override "https://<deployment>.vercel.app" --labels smoke
```

Author and edit tests interactively with the Momentic MCP server or the
`npx momentic` CLI — see the [docs](https://momentic.ai/docs).

## Coverage

Every page route has at least one test:

- **smoke** — `home-smoke.test.yaml` covers the homepage (critical path, runs
  on every deploy).
- **regression** — one test per remaining route: `about`, `book`, `consulting`,
  `contact`, `interviews`, `learn`, `media-kit`, `speaker-bio`, `speaking`,
  `articles`, `courses`, `keynotes`, plus one representative detail page for
  each dynamic template (`keynote-detail`, `course-detail`,
  `speaking-topic-detail`).

## CI

[`../.github/workflows/momentic.yml`](../.github/workflows/momentic.yml) runs
the `smoke` label against every Vercel deployment automatically. The broader
`regression` suite runs **on demand** via **Run workflow** — set the `labels`
input to `regression` (or leave it blank to run every test). Repo secrets:

| Secret | Required? | Where to get it |
| --- | --- | --- |
| `MOMENTIC_API_KEY` | Yes | Momentic dashboard → Settings → API keys |
| `VERCEL_BYPASS` | If previews are protected | Vercel → Settings → Deployment Protection → "Protection Bypass for Automation" |

When `VERCEL_BYPASS` is set, the workflow automatically appends it to the
deployment URL so Momentic can load protected previews.

## Conventions

- One user outcome per test; kebab-case `*.test.yaml` filenames.
- Label critical paths `smoke`, broader coverage `regression`.
