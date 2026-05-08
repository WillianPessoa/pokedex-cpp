# PERSONAS — Pokedex C++/QML

**Sample size**: 1 real user (project owner) + 2 hypothesized personas grounded in the same Brazilian Facebook communities. Hypothesized personas are flagged as such — they represent design hypotheses to validate in Phase 5.

---

## P1 — The Challenge Runner (real, primary)

> "I'm not playing to win. I'm playing under self-imposed rules to make every encounter matter."

- **Background**: Pokémon player since the original Game Boy. Has cycled through Game Boy, GBA, DS, 3DS, and now plays mostly through emulators (PC and phone) and ROMhacks.
- **Communities**: active in Brazilian Facebook groups focused on retro Pokémon games, ROMs, and challenge runs.
- **Plays**: Classic Nuzlocke, Genlock, Randomizer/ROMhack runs. **Anchor game**: FireRed/LeafGreen.
- **Devices**: PC emulator (mGBA / VBA) + phone emulator (My Boy / mGBA mobile), in parallel.
- **Tooling today**: PokemonDB and Bulbapedia in browser tabs. Pauses the game on every new route to look things up.

### Jobs to be done

- **JTBD-1 (primary)**: *When I enter a new route in a Nuzlocke run, I want to instantly see which Pokémon can be encountered there in this specific game with a "first encounter only" filter, so I can decide whether to engage with that route.*
- **JTBD-2**: *When an unknown opponent appears mid-battle, I want a 1-tap weakness/resistance check, so I don't lose tempo.*
- **JTBD-3**: *Before a gym leader, I want to scan their team composition and movesets, so I can pre-build my team.*

### Pains
- Browser-based Pokedex sites are slow and ad-heavy on mobile
- No tool surfaces "first encounter only" — has to mentally filter
- Existing tools don't scope by game version cleanly

### Gains they'd value
- ≤2-tap path from app open to encounter table
- Offline-first
- The product *speaks Nuzlocker* — language, rules, defaults all assume challenge-run usage

---

## P2 — The Casual Comebacker *(hypothesized — validate in Phase 5)*

> "I haven't played in years. I want to fire up FireRed again and not feel lost."

- **Background**: nostalgic player returning to Pokémon after years away. Remembers the games but doesn't remember every Pokémon, type chart, or encounter table.
- **Communities**: lurks in the same Facebook retro-Pokémon groups.
- **Plays**: a single, slow, casual Nuzlocke or normal playthrough. Not deep into the metagame.
- **Devices**: more likely on phone than PC — playing in bed, in transit, in short sessions.

### Jobs to be done
- **JTBD-1**: *When I see a Pokémon I don't remember, I want a quick visual + type + tier lookup, so I can decide if it's worth catching.*
- **JTBD-2**: *I want to track my run progress somewhere visible, so I feel a sense of accomplishment between sessions.*

### Pains
- Forgets type matchups; chart is dense
- Doesn't know which Pokémon are "good" anymore
- Wants something light, not encyclopedia-deep

### Gains they'd value
- Visual-first browsing (sprites, types, friendly tier indicators)
- Optional run tracker (catches, deaths, badge progress)

### Why this persona is hypothetical
The project owner is in P1, not P2. P2 is plausible based on the size and demographics of the targeted Facebook groups (many returning players post in them), but no first-hand interview supports it yet. **Validate in Phase 5** through community survey and prototype walkthroughs.

---

## P3 — The Curious Engineer *(hypothesized — secondary, project-as-portfolio audience)*

> "I'm reading this codebase to see how someone built a real Qt/QML app from scratch."

- **Background**: developer learning Qt/QML/C++. Found the repo through GitHub, the Facebook groups, or a community link.
- **Plays**: maybe Pokémon, maybe not. The product is a means to read code and see patterns.
- **Devices**: doesn't actually use the running app much — they read the source.

### Jobs to be done
- **JTBD-1**: *When I land on this repo, I want to understand the architecture in 5 minutes, so I can decide if it's worth deep-reading.*
- **JTBD-2**: *I want to find concrete examples of: QML singletons, C++ ↔ QML bridges, SQLite migrations in Qt, and HTTP cache patterns, so I can apply them to my own work.*

### Pains
- Most Qt sample projects are toys; few are end-to-end with persistence + networking + real UI
- Documentation in OSS Qt apps is rare or stale

### Gains they'd value
- Clear README with architecture diagram
- ADRs explaining decisions, not just code
- CONTEXT.md with vocabulary so they don't need to guess

### Why this persona shapes the project
P3 doesn't drive UI decisions, but they drive **documentation, naming, and code organization** decisions. The product owner explicitly wants this audience served — it's a stated goal.

---

## Persona priority for design

| Phase | Whose needs dominate |
|---|---|
| Define (brief) | **P1** primary; P2 explicitly mentioned but *not* designed for; P3 noted in "out of scope for UI" |
| Ideate (IA, tokens) | **P1** dominates; P2 informs nothing in MVP |
| Prototype | **P1** flows are the prototype's full scope |
| Test (Phase 5) | **P1** validation is qualitative; **P2** is the survey hypothesis to confirm or kill |
| Code documentation | **P3** considerations apply throughout — README, ADRs, CONTEXT.md, comments at module boundaries |

**One-line summary**: The product is designed for P1. P3 is served through code/docs hygiene. P2 is a hypothesis we'll validate but not build for in MVP.
