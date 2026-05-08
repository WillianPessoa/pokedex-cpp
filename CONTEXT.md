# Pokedex C++/QML — Context

Domain glossary and shared vocabulary for the v2 Pokedex. The product is an **encounter encyclopedia for challenge runs** (Nuzlocke, Genlock, Randomizer/ROMhack), anchored on FireRed/LeafGreen, running on desktop (PC) and mobile in parallel.

This file evolves during `/grill-with-docs` sessions in Phase 2 (Define). Keep terms tight and opinionated; flag ambiguities.

## Language

### Core entities

**Encounter**:
A possible appearance of a **Pokémon** in a specific **Route** of a specific **Game**, with associated metadata (rate, method, level range). The richest entity in the schema and the one that powers the primary JTBD ("encounter check on a new route").
_Avoid_: spawn, sighting (too generic).

**Route**:
A named in-game location where wild **Pokémon** can appear. In FireRed/LeafGreen, includes Routes 1–25, but also caves, forests, surfing zones, fishing spots — anywhere encounters happen.
_Avoid_: area (PokéAPI uses `location-area`, but for users "route" is the canonical word), zone, map.

**Game**:
A specific Pokémon game cartridge/version that constrains which **Encounters**, **Pokémon**, and **Routes** are valid. FireRed and LeafGreen are *different* Games even though they share most data — encounter tables differ.
_Avoid_: version (overloaded with software version), title.

**Species**:
A canonical Pokémon identity, generation-agnostic. Charizard is one **Species**, regardless of mega/gigantamax/regional variants. There are 1025+ Species across Gen 1–9.
_Avoid_: creature, monster, mon.

**Pokémon**:
A specific *form* of a **Species**. Charizard, Mega Charizard X, and Gigantamax Charizard are three different **Pokémon** of the same **Species**. Likewise, Vulpix and Alolan Vulpix are different **Pokémon** of the same Species. Encounters reference a specific **Pokémon**, not just a Species — Alolan Vulpix encounters in USUM differ from Kantonian Vulpix encounters in FRLG.
_Avoid_: form (use "form" only as the modifier — "Alolan form of Vulpix" — never as the noun).

**Form**:
The variant identifier of a **Pokémon** within its **Species**. Examples: `default`, `mega-x`, `mega-y`, `alolan`, `galarian`, `hisuian`, `paldean`, `gmax`. A **Species** has at least one **Pokémon** with `default` form.

### Run vocabulary

**Run**:
A single playthrough of a **Game** under a chosen **Ruleset**. Distinct from a casual playthrough — the term carries the connotation of self-imposed constraints.
_Avoid_: playthrough (too generic), session.

**Ruleset**:
The set of constraints a **Run** is played under. Common rulesets: Classic Nuzlocke, Genlock, Randomizer, ROMhack. Mostly relevant for the optional save-file-reader roadmap.
_Avoid_: mode, challenge.

**First encounter (Nuzlocke rule)**:
The first wild **Pokémon** the player meets on a given **Route**. Under Classic Nuzlocke, this is the only Pokémon they may catch on that Route. Critical filter for the primary JTBD.
_Avoid_: first catch (catch is the user action, encounter is the appearance).

**Dupes clause**:
Optional Nuzlocke rule: if the **First encounter** is a Pokémon already in the player's party or PC, they may re-roll. Determines whether the encounter table should hide already-caught species in a UI filter.
_Avoid_: duplicate clause, no-dupes.

### Personal data (MVP)

**Favorite**:
A **Pokémon** the user has bookmarked locally for quick access. Persists across sessions in local SQLite. Not synced to any cloud service.
_Avoid_: bookmark, starred (stay consistent — UI uses ★).

**Preference**:
A user-controlled UI setting persisted locally. MVP includes: theme (light/dark/system), language (EN/PT-BR/ES/…), default Game.
_Avoid_: setting (overlap with platform meaning), config.

## Relationships

- A **Game** has many **Routes**.
- A **Route** has many **Encounters**.
- An **Encounter** references one **Pokémon** (specific form, not species).
- A **Pokémon** belongs to one **Species**; a **Species** has one or more **Pokémon** (forms).
- A **Pokémon** appears in many **Encounters** across many **Games** and **Routes**.
- A **Run** is bound to one **Game** and one **Ruleset**.
- A **First encounter** is the first **Encounter** realized by the player on a **Route** during a **Run**.

## Navigation entry points (UI)

The product offers **two parallel home entry points** (decision recorded 2026-05-08):

1. **Route browser** — list **Routes** of the selected **Game**; primary path for the encounter-check JTBD.
2. **Pokémon browser** — list **Pokémon**; secondary path for users who already know the Pokémon they want.

Both reach the same data; the distinction is the navigation root, not the schema. Route browser is the *featured* entry point given the primary JTBD, but Pokémon browser is not subordinate.

## Example dialogue

> **Newcomer:** "I want to know what spawns on Route 1 in FireRed."
> **Expert:** "You want **Encounters** for **Route 1** in the **Game** FireRed. The product opens on the **Route browser**, you select FireRed as the active **Game**, tap Route 1, and see all **Encounters**."
> **Newcomer:** "And if I'm doing a Nuzlocke?"
> **Expert:** "Toggle the **First encounter** filter. The encounter list narrows to the methods that produce a **First encounter** under Classic Nuzlocke rules. If you also enable **Dupes clause**, **Pokémon** species already caught in your active **Run** are dimmed."

## Flagged ambiguities

- **"Type"**: overloaded between *Pokémon type* (Fire, Water, Grass…) and *move type*. The two are the same enum, but the modifier matters in conversation. Use **Pokémon type** and **move type** explicitly when ambiguous.

## Product decisions (locked during /grill-with-docs)

- **Two parallel home entry points**: Route browser + Pokémon browser. Both reach the same data; neither subordinate. Tension to resolve in Phase 3 (Information Architecture), especially on mobile (375px).
- **MVP scope**: All Gen 1–9 covered for **Pokémon/Species/Form** data (static catalog, bundled). **Encounter tables** scoped per game; FireRed/LeafGreen is the anchor; other games' encounter tables expand in roadmap and are fetched on-demand. Schema separates `Pokémon` (form) from `Species` from day 1.
- **UI internationalization**: Multi-language from day 1 via Qt Linguist (`qsTr()` + `.ts` files). Launch languages: **English (default), Portuguese (BR), Spanish**. Other languages welcomed as community contributions. Pokémon names stay in English canonically across all locales (Pikachu = Pikachu); types, menus, labels, and messages translate.
- **Personal persistence in MVP**: Level 1 only — **Favorites** + UI **Preferences** (theme, language, default game). Stored in local SQLite. No **Run tracking**, no save file reading in MVP — both belong to roadmap. **Run** and **Ruleset** terms are documented in the glossary so the schema can accommodate them later, but the MVP UI does not surface them.

## Technical decisions (locked)

- **Stack**: C++17 + Qt 6 + QML for desktop and mobile. See [ADR 0001](docs/adr/0001-stack-cpp-qml.md).
- **Data strategy**: bundled static catalog + on-demand encounter tables + build-time scraping pipeline. See [ADR 0002](docs/adr/0002-data-strategy.md).
