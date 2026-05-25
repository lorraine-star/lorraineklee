# CLAUDE.md

Project guidance for AI agents working in this repository.

## Linear workflow

- Work in this repo is tracked in Linear (issue prefix `CLI-`).
- When you start working on a Linear ticket, first check its status. If it is
  not already **In Progress**, set it to **In Progress** before doing any work.

## Global sections

- Some page sections are **shared/global** across the site. The canonical
  registry lives in the header comment of `src/pages/index.astro`.
- Each global section is tagged with `data-global-section="<id>"` — search
  for that attribute to find every instance.
- Do **not** redesign a global section in isolation. Edit the canonical
  source (a shared component or the home page) and coordinate via Linear so
  parallel worktrees don't drift.
