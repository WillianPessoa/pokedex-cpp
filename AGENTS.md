# Agent guidance — Pokedex C++/QML

This file orients AI coding agents (Claude Code, Cursor, Cody, etc.) working in this repo. Humans should read [README.md](README.md) first.

## Quick orientation

- **Project**: native desktop+mobile Pokedex written in C++17 + Qt 6 + QML, focused on encounter encyclopedia for challenge runs (Nuzlocke, Genlock, Randomizer/ROMhack). Predecessor (PySide6) lives outside this repo as a reference only.
- **Status**: Sprint 0 — Design Thinking kickoff. No production code yet. Phase 1 (Empathize) and most of Phase 2 (Define) complete; HTML+CSS prototypes (Phase 4) not started.
- **Method**: solo QSCRUM with explicit DoR/DoD in [docs/qscrum/](docs/qscrum/). Tracker = GitHub Issues + GitHub Projects.
- **Language for project artifacts**: English (docs, code, commits, issues, PRs). Conversation with the maintainer happens in Portuguese.

## Where to look for context

- [CONTEXT.md](CONTEXT.md) — domain glossary and the canonical vocabulary. Use these terms; avoid the listed aliases.
- [docs/adr/](docs/adr/) — Architecture Decision Records. Honour them; if you'd contradict one, surface it.
- [.design/research/](.design/research/) — empathy map and personas (Phase 1).
- [.design/pokedex/](.design/pokedex/) — design brief and the Phase 3+ artifacts (IA, tokens, prototypes) as they get produced.

## Agent skills

### Issue tracker

GitHub Issues, accessed via the `gh` CLI. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

### Triage labels

Five canonical roles using the default Matt Pocock vocabulary. See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context repo: one [CONTEXT.md](CONTEXT.md) + [docs/adr/](docs/adr/) at the root. See [docs/agents/domain.md](docs/agents/domain.md).
