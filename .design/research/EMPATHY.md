# EMPATHY MAP — Pokedex C++/QML

**Source**: `/grill-me` interview session (2026-05-08) + ethnography of v1 codebase, journals, and architecture decisions at `/Users/williangomespessoa/workspace/pokedex/`.

**Sample size**: N=1 (project owner). Quantitative validation deferred to **Phase 5 — Test** (see [validation plan](#validation-plan-phase-5)).

---

## Primary user

**Project owner** — Pokémon player since the original Game Boy era (Game Boy → GBA → DS → 3DS → ROMs/emulators). Active member of Brazilian Facebook communities focused on Pokémon retro games, ROMs, and challenge runs.

The product also doubles as:
- **Engineering portfolio** — public, open-source codebase showcasing applied software engineering
- **Community contribution** — code as reference/example for other community members learning Qt/C++

---

## Context of use

### Game platforms (parallel, not exclusive)

| Where they play | Pokedex placement |
|---|---|
| **PC emulator** (mGBA / VBA) | Pokedex desktop window next to the emulator |
| **Phone emulator** (My Boy / mGBA mobile) | Pokedex mobile app — same device as the game (split-screen or app overlay) |
| Physical GBA/DS/3DS or Steam Deck | Phone Pokedex on the side |

**Implication**: the product needs both desktop and mobile to serve a single workflow. They aren't different audiences — they're the same person at different moments.

### Anchor game

**FireRed/LeafGreen** (Generation 3 engine). Reasons:
- Massive Nuzlocker community
- Stable, well-documented save format
- ROMhack base for several major hacks (Radical Red, etc.)
- Locations data for FireRed/LeafGreen is fully covered in PokéAPI's `/location-area/` endpoint

### Run types they do

- Classic Nuzlocke
- Genlock (one game per generation, sequential)
- Randomizer / ROMhack runs

All three are relevant. **Randomizer runs** are the most dependent on external Pokedex consultation because everything is unknown.

---

## Jobs to be done (JTBD)

### Primary JTBD

> **When I enter a new route in a Nuzlocke run, I want to instantly see which Pokémon can be encountered there in this specific game (with a "first encounter only" filter), so I can decide whether to engage with the route's grass and which Pokémon I'm willing to lock in as that route's catch.**

Frequency: **every new route** of a typical run. This is high-frequency consultation. UX requirement: ≤2 taps from app open to encounter table on screen.

### Secondary JTBDs (in priority order)

1. **Type matchup mid-battle** — quickly check weaknesses/resistances when an unknown opponent appears
2. **Movepool / level-up moves** — check at which level a specific Pokémon learns a move, to plan grinding
3. **Gym leader / boss prep** — review the leader's team, types, movesets before a major fight

### Aspirational JTBDs (roadmap, not MVP)

- **Save file reader**: read a Nuzlocke save file and surface a personalized dashboard — what the player has caught, what's dead, run stats, generated logs of the run.

---

## Pain points with existing tools

Inferred from the v1 architecture, the v1 visual references journal (US-17), and what the user consults externally during runs.

| Pain | Evidence |
|---|---|
| **Browser-based encyclopedias (Bulbapedia, PokemonDB) are slow on mobile** | Splash pages, ads, dense layout, multi-tap drilldown — wrong tool when you need info in seconds during a run |
| **No "first encounter only" filter anywhere** | Nuzlocke rule is core to a huge community, and zero existing tools surface it natively. Player has to mentally filter dupes |
| **Encounter tables not tied to specific game version** | FireRed ≠ LeafGreen ≠ Yellow ≠ Crystal. Existing tools either bury this info or show generic data |
| **No offline-first behavior** | When playing on a phone away from Wi-Fi, every Pokedex query is a network round trip |
| **No app speaks Nuzlocker culture** | Tools are built for catalog/lore browsing, not for active strategic decisions during a run |

---

## Wants & feelings

### Says
- "I want to demonstrate engineering skill through this project."
- "The code will serve as an example for the community."
- "I play Nuzlocke, Genlock, and Randomizer runs."

### Thinks
- A specialized Pokedex for **challenge runs** is the gap nobody filled.
- The community will appreciate a tool that respects the rules of the runs they actually do.

### Does
- Plays ROMs and emulators on PC and phone simultaneously
- Pauses the game on every new route to consult external Pokedex sites
- Plans surveys/interviews in Facebook communities anonymously or under pseudonym

### Feels
- **Frustrated** by tools that treat all players the same (catalog browsers, not strategy supporters)
- **Eager** to validate the idea with the community before committing to features
- **Ambitious** — engineering portfolio + community gift + personal tool, all in one

---

## What v1 (PySide6 prototype) taught us

The v1 lives at `/Users/williangomespessoa/workspace/pokedex/`. Reading its code, journals, and design-decisions doc:

### What v1 got right (carry forward)
- **Offline-first via SQLite** — proven cache strategy (disk → API → save)
- **QML for UI** — the conceptual investment ports cleanly to C++
- **Theme & CardStyle as singletons** — clean global UI state
- **Separation of `PokemonModel` (list) from `PokemonDetail` (single)** — pragmatic and worked

### What v1 missed (gap to close in v2)
- **No location/encounter data at all** — the v1 schema only models pokemon/types/abilities/stats. The encounter table — the *primary JTBD of v2* — does not exist in v1.
- **No game-version awareness** — v1 treats all data as global. v2 must scope encounters by game (Red/Blue/Yellow/FireRed/LeafGreen/etc.).
- **No "first encounter" or run-tracking concepts** — Nuzlocke logic is absent.
- **No mobile target tested** — v1 is desktop-only, even though target was always desktop+mobile.

### What v1 explicitly deferred (and v2 must address consciously)
- **Light/dark per theme** (v1 Sprint 11 US-32) — must be in v2 from day one
- **Sprite color extraction for cards** (v1 Sprint 9 US-21) — nice to have, not core
- **Type effectiveness widget** (v1 Sprint 10 US-25) — directly serves the secondary JTBD "type matchup mid-battle"
- **Pokédex entries / breeding / EV yield** (v1 Sprint 10 US-24, US-26) — far future, not aligned with strategy-during-run focus

---

## What this means for the brief

The v2 product is **not a generic Pokedex**. It is an **encounter encyclopedia for challenge runs**, with:

1. Encounter tables scoped by game version, with Nuzlocke-aware filters (first-encounter-only, dupes-excluded)
2. Type matchup as a fast secondary tool
3. Movepool & gym prep as supporting features
4. Save file reading as long-term roadmap, not MVP

The brief should explicitly **deprioritize**: full Pokémon entries, breeding/EV yield/competitive stat math, lore/flavor text, evolution chains as primary navigation. Those exist in PokemonDB and Bulbapedia and are not where v2 wins.

---

## Validation plan — Phase 5

Quantitative and qualitative validation is deferred to **Phase 5 — Test**, when there is a working HTML+CSS prototype to react to.

### Planned instruments

1. **HTML+CSS prototype walkthrough** with 2–3 community members (qualitative, in-depth, video call or in person)
   - Anonymous or pseudonym, posted to Facebook communities
   - Task scenarios derived from the JTBDs above
   - Recorded in `.design/pokedex/USER_TEST.md`

2. **Facebook community survey** (quantitative, broader reach)
   - Distributed in retro-Pokémon / Nuzlocke / ROMhack groups
   - Validates JTBD ranking, anchor-game choice, and platform balance (PC vs phone usage during runs)
   - Distributed under pseudonym
   - Results inform the Sprint 1+ backlog (which features the community ranks highest)

Both instruments are tasks owned by Phase 5, not Phase 1.
