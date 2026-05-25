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

## CI

[`../.github/workflows/momentic.yml`](../.github/workflows/momentic.yml) runs
the `smoke` label against every Vercel deployment (and on demand via
**Run workflow**). It needs one repo secret:

| Secret | Where to get it |
| --- | --- |
| `MOMENTIC_API_KEY` | Momentic dashboard → Settings → API keys |

If preview deployments are protected, also add `VERCEL_BYPASS` — see the note
at the bottom of the workflow file.

## Conventions

- One user outcome per test; kebab-case `*.test.yaml` filenames.
- Label critical paths `smoke`, broader coverage `regression`.
