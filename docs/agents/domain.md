# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **[CONTEXT.md](../../CONTEXT.md)** at the repo root — domain glossary for this single-context project.
- **[docs/adr/](../adr/)** — read ADRs that touch the area you're about to work in.

If any of these files don't exist yet for the slice you're touching, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

This is a **single-context repo**:

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-stack-cpp-qml.md
│   ├── 0002-data-strategy.md
│   └── ...
└── src/                ← Sprint 1+, not yet present
```

No `CONTEXT-MAP.md` exists at the root; do not look for one.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

For example:
- Use **Pokémon** (form), **Species**, and **Form** distinctly. Do not collapse them.
- Use **Encounter**, **Route**, **Game** as defined. Avoid `spawn`, `area`, `version`.
- Use **First encounter**, **Dupes clause** when discussing Nuzlocke filters. Don't drift to `first catch` or `no-dupes`.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (stack C++/QML) — but worth reopening because…_
