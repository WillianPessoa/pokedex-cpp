---
status: accepted
date: 2026-05-08
---

# Data strategy: bundled static catalog + on-demand encounter tables + build-time scraping

## Context

The product covers Gen 1–9 (Species, Pokémon forms, Types, Moves, Abilities — the *catalog*) plus per-game encounter tables. Catalog is large (~50–100MB compressed across Gen 1–9) but rarely changes. Encounter tables are smaller per game but plentiful (~25 mainline games × ~50 routes), and PokéAPI coverage is uneven for Gen 8–9 — Sword/Shield is partial, Scarlet/Violet is sparse, requiring scraping from Bulbapedia/Serebii to complete.

We need a strategy that keeps the app responsive offline, doesn't bloat the binary, and isolates the brittleness of scraping away from runtime.

## Decision

Three-layer data approach:

1. **Static catalog bundled with the app**: Species, Pokémon (forms), Types, Moves, Abilities, base stats, sprites — embedded as a compressed dataset in the Qt resource bundle, generated from PokéAPI's [public data dumps](https://github.com/PokeAPI/pokeapi/tree/master/data) at build time. App reads from bundle synchronously; no network needed for catalog.

2. **Encounter tables fetched on-demand, per game**: when the user selects a Game whose encounters aren't yet cached locally, the app fetches encounter tables for that Game from a hosted JSON file (or PokéAPI directly), persists to local SQLite, and serves from cache thereafter. First-time use of a new Game requires internet; thereafter offline.

3. **Scraping confined to a build pipeline, never runtime**: a separate Python script (lives outside the C++/QML app, e.g. `tools/dataset-builder/`) consumes PokéAPI dumps + scrapes Bulbapedia/Serebii where PokéAPI gaps exist (Gen 8–9 encounters), produces clean JSON dumps committed to a separate dataset repo or release artifact. The app **never** scrapes at runtime.

## Reasoning

- **Catalog is stable, encounters expand**: the catalog rarely changes (a new gen every 3 years); encounter tables expand per game added to MVP roadmap. Bundling catalog + fetching encounters matches the change frequency of each.
- **App stays light**: bundling everything (the rejected "full bundle" option) would ship 300MB+ binaries; this approach stays under ~100MB while keeping the most-used data offline.
- **Scraping is brittle**: Bulbapedia/Serebii layouts change, terms-of-service vary, runtime scraping would mean random app crashes when their HTML changes. Confining scraping to the build pipeline keeps the app deterministic — when scraping breaks, the dataset build fails, not the app.
- **Reproducibility for the open-source audience (Persona P3)**: a separate dataset builder is a teachable artifact in its own right.

## Considered alternatives

| Alternative | Why rejected |
|---|---|
| **PokéAPI live + cache (like v1)** | First-run-offline broken; dependency on PokéAPI uptime; runtime scraping for Gen 8–9 was a rabbit hole. |
| **Full static bundle (zero network)** | App weight (300MB+) penalises mobile install; data updates require a full app release. |
| **Defer the decision** | Architecture stays ambiguous through `/design-brief` and Phase 3 IA work — multiplies rework. |

## Consequences

- **Build pipeline is its own project**: `tools/dataset-builder/` exists; CI builds and publishes datasets on tag. Documented as a deliverable in Sprint 1+ planning.
- **First-time fetch per Game requires internet**: acceptable; the user explicitly noted phone-emulator usage where Wi-Fi is typically present. Pre-fetching on first install for the anchor game (FRLG) eliminates this for the primary use case.
- **Dataset versioning**: the bundle is versioned; the app must check compatibility on launch (older app + newer schema = graceful failure, prompt to update).
- **Scraping ethics & terms**: respect `robots.txt`, rate-limit aggressively in the build pipeline, attribute Bulbapedia/Serebii in the project README. Document this as a non-negotiable in the dataset-builder README.
