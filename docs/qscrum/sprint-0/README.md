# Sprint 0 — Design Thinking Kickoff

**Start**: 2026-05-08

**Goal**: produce a brief, IA, design tokens, navigable HTML+CSS prototypes, and a prioritized QSCRUM backlog for Sprint 1, **without writing a line of C++/QML**.

## Deliverables (Sprint 0 DoD)

- [x] **Phase 1 — Empathize**:
  - [x] `.design/research/EMPATHY.md` — v1 ethnography + `/grill-me` session
  - [x] `.design/research/PERSONAS.md` — 2–3 personas with JTBD
  - [ ] (optional) `.design/research/COMPETITIVE.md` — Bulbapedia, HOME, Serebii
- [x] **Phase 2 — Define**:
  - [x] `CONTEXT.md` populated (`/grill-with-docs`)
  - [x] `.design/pokedex/DESIGN_BRIEF.md` (`/design-brief`)
  - [x] `docs/adr/0001-stack-cpp-qml.md`
  - [ ] PRD published as a GitHub Project issue (`/to-prd`) — pending GitHub repo setup
- [x] **Phase 3 — Ideate**:
  - [x] `.design/pokedex/INFORMATION_ARCHITECTURE.md` (`/information-architecture`)
  - [x] `.design/pokedex/DESIGN_TOKENS_V{1,2,3}.css` — 3 variant token files, light + dark, AA validated
- [x] **Phase 4 — Prototype**:
  - [x] `.design/pokedex/TASKS.md` (`/brief-to-tasks`) — 24 tasks, all F+V tasks marked done (2026-05-19)
  - [x] `prototypes/index.html` — navigable index of all 3 variants (2026-05-19)
  - [x] `prototypes/v1-flutterdex/*.html` — 6 screens (route-detail, pokemon-detail, pokemon-browser, route-browser, settings, favorites)
  - [x] `prototypes/v2-datadex/*.html` — 6 screens
  - [x] `prototypes/v3-linear/*.html` — 6 screens (most complete variant)
  - [x] `prototypes/_shared/` — appshell, typebadge, states
  - [x] `prototypes/styles/` — tokens + reset + shell CSS
- [x] **Phase 5 — Test (partial)**:
  - [x] `.design/pokedex/DESIGN_REVIEW.md` — visual review across 3 variants, 8 screens captured (2026-05-19)
  - [ ] `.design/pokedex/USER_TEST.md` — qualitative walkthrough with ≥2 real users (pending)
  - [ ] **Facebook community survey** (quantitative) — pending
  - [ ] `.design/pokedex/TASKS.md` revised after testing
  - [ ] Issues created in the GitHub Project with DoR applied (`/to-issues`)
- [x] **Bridge**:
  - [x] `.design/pokedex/QML_PORT_NOTES.md` — token mapping, layout patterns, TypeBadge, motion, sprites (2026-05-19)

## Out of scope for Sprint 0

- Writing C++/QML code
- Deciding internal architecture (models, repositories, services) — Sprint 1
- CMake / build pipeline setup — Sprint 1
- PokéAPI provider / cache strategy — Sprint 1

These move to the Sprint 1 backlog and are derived from brief decisions.

## Retrospective (filled 2026-05-19)

- **Worked well**: design-thinking-first discipline held. 3 parallel variants give Phase 5 real signal to compare — not just aesthetic preference but UX hypothesis testing (V1=card/warm vs V3=tabular/clinical). Token system is clean enough that QML port should be a direct mapping exercise. V3 Linear emerged as the most polished and differentiated prototype with no prompting.
- **Got in the way**: TASKS.md checkboxes were never updated as work progressed — caused ambiguity at Sprint 0 close about what was actually done. Fix: update tasks in real-time, not at retrospective.
- **Would change**: deliver `prototypes/index.html` earlier (should have been R4, but it's a useful navigation tool from day 1 of prototype phase). Also: Phase 5 user testing blocks Sprint 1 start — consider time-boxing the wait to 1 week max and defaulting to V3 if no signal arrives.
