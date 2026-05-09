# Build Tasks: Pokedex C++/QML v2 — HTML+CSS prototypes (Phase 4)

Generated from: [.design/pokedex/DESIGN_BRIEF.md](DESIGN_BRIEF.md)
Date: 2026-05-08

## Scope

Phase 4 produces **5 screens × 3 design variants = 15 prototype HTML files**, plus shared foundation. The output is plain HTML + CSS (no JavaScript framework). Each prototype HTML contains both mobile (375px) and desktop (1280px) layouts on the same page via media queries. Output goes to `/prototypes/`.

Each task below is a **vertical slice**: structure + styling + interaction in one ticket, verifiable by opening the resulting HTML in a browser at 375px and 1280px. Sizes: **S** ≤2h · **M** half day · **L** 1 day · **XL** >1 day (split it).

Each task can become a GitHub issue and must satisfy [DoR](../../docs/qscrum/DEFINITION_OF_READY.md) before entering a sprint, [DoD](../../docs/qscrum/DEFINITION_OF_DONE.md) before closing. PRD story references point to issue [#1](https://github.com/WillianPessoa/pokedex-cpp/issues/1).

---

## Foundation (build these first; everything else depends on them)

- [ ] **F1 — Set up `prototypes/styles/` with tokens and base reset** _(S, New)_
  - Copy `DESIGN_TOKENS_V1_FLUTTERDEX.css`, `DESIGN_TOKENS_V2_DATADEX.css`, `DESIGN_TOKENS_V3_LINEAR.css` into `prototypes/styles/` (or symlink — discuss with maintainer; copy preferred for portability).
  - Create `prototypes/styles/reset.css` with a minimal modern reset (box-sizing, margin/padding zero, body line-height, image responsive default, button reset).
  - **Acceptance**: Open any of the 3 token files via `<link>` in a test HTML — variables resolve in the browser inspector.
  - **Dependencies**: none.

- [ ] **F2 — Configure sprite placeholder strategy** _(S, New)_
  - Decide and document: prototypes reference Pokémon sprites from PokéAPI's public CDN (e.g. `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`). For 10 sample Pokémon (Pikachu, Bulbasaur, Charmander, Squirtle, Geodude, Eevee, Magikarp, Onix, Pidgey, Rattata), document the URLs in a `prototypes/_shared/sprites.md` file.
  - Add `loading="lazy"` and a placeholder `<div>` fallback for offline preview.
  - Note: production C++/QML uses bundled sprite extraction (per ADR 0002) — the prototype's CDN approach is acceptable because prototypes are throwaway.
  - **Acceptance**: a test HTML loading 3 sprites renders them at 375px and 1280px without layout shift.
  - **Dependencies**: F1.

- [ ] **F3 — Build the AppShell HTML/CSS pattern (mobile + desktop)** _(M, New)_
  - Reusable HTML structure that wraps every screen: TopBar (logo, Game-selector trigger, search icon), content area (placeholder), BottomNav (mobile) with 4 destinations (Routes, Pokémon, Favorites, Settings), Sidebar (desktop) with Game selector at top + 4 nav links.
  - Implement as a self-contained HTML file (`prototypes/_shared/appshell.html`) **variant-agnostic** — visual is driven by whichever token file is linked at build time. Document the swap pattern.
  - Mobile (≤767px) = bottom nav visible, sidebar hidden. Desktop (≥768px) = sidebar visible, bottom nav hidden. CSS via `prefers-color-scheme` and `@media (min-width: 768px)`.
  - **Acceptance**: open the AppShell in browser at 375px → bottom nav with 4 items shown, top bar present, content area visible. Resize to 1280px → sidebar visible on left with Game selector + 4 links, top bar adapts. Both light and dark themes render correctly when toggling `[data-theme]` on `<html>`.
  - **Dependencies**: F1.

- [ ] **F4 — Build shared TypeBadge HTML/CSS component pattern** _(S, New)_
  - Reusable type-badge markup (one HTML class + per-type modifier classes for the 18 types). Used in every screen by every variant.
  - Three CSS treatments scoped per variant — use `.type-badge` base + `[data-variant="v1"]`/`v2`/`v3` qualifier in the same stylesheet, OR demonstrate that the variant-specific tokens automatically drive the look.
  - **Acceptance**: a test HTML renders 18 type badges at small (~12px label) and large (~20px label) sizes in all 3 variants. Visual treatment matches each variant's token decisions: V1 pastel pill, V2 solid block, V3 outline.
  - **Dependencies**: F1.

- [ ] **F5 — Build shared LoadingState (skeleton) and EmptyState patterns** _(S, New)_
  - Skeleton: animated shimmer placeholder for list rows (RouteCard, PokemonCard, EncounterRow). Variant-agnostic; tokens drive colors.
  - EmptyState: centered concise message + small icon (or no icon — use `?` placeholder for now). Microcopy from IA empty-state map: "No matches", "No Encounters match this filter — toggle filters or pick another Route", etc.
  - Both must respect `prefers-reduced-motion` (skeleton becomes static, no shimmer).
  - **Acceptance**: a test HTML shows skeleton placeholders animating in light + dark; empty states render correctly with sample microcopy.
  - **Dependencies**: F1.

---

## V1 — FlutterDex (Scandinavian, Confident-warm) — risk-first variant

Lowest visual risk, builds confidence in the IA before tackling V2's sprite-driven cards or V3's dark-first discipline. Within V1, Route detail comes first because it's the JTBD-1 heart.

- [ ] **V1-1 — Build V1 Route detail (encounter table) screen** _(L, New)_
  - File: `prototypes/v1-flutterdex/route-detail.html`. Links V1 tokens.
  - Renders: TopBar with back button + Route name + Game subtitle. **Sticky filter toggles** (First encounter only / Dupes clause: hide already caught) below TopBar. Scrollable EncounterRows showing sprite + Pokémon name + level range + encounter rate (%) + method icon + TypeBadges.
  - Sample data: 8–10 encounters for Route 1 of FireRed (e.g. Pidgey 5–7 50%, Rattata 4–7 50%). Hardcoded in HTML, no JS needed.
  - States visible in the same page (separate sections or stack): default loaded list, with filter toggled (animated 150ms cross-fade described via comment), empty (no matches under filter), Game-not-cached loading state.
  - **Acceptance**: matches PRD Stories 5–10. At 375px: rows readable, filter toggles sticky on scroll, encounter rate visible without truncation. At 1280px: same content with desktop sidebar nav, Encounter table can be wider but not stretched edge-to-edge.
  - **PRD link**: stories 5, 6, 7, 8, 9, 10.
  - **Dependencies**: F1, F3, F4, F5.

- [ ] **V1-2 — Build V1 Pokémon detail with Info / Moves / Locations tabs + TypeEffectiveness section** _(L, New)_
  - File: `prototypes/v1-flutterdex/pokemon-detail.html`. Links V1 tokens.
  - Renders: TopBar with back button + FavoriteToggle. Hero section with large sprite + Pokémon name + national Pokédex number + Pokémon types as TypeBadges. TabBar (3 tabs: Info / Moves / Locations).
  - **Info tab content** (default): Base stats (label + numeric — no animated bars in MVP), Abilities, **TypeEffectiveness section at the bottom** showing Weak 4× / Weak 2× / Resist ½× / Resist ¼× / Immune (use Pikachu's actual effectiveness: Weak 2× Ground; Resist ½× Flying, Steel; Resist 0× Ground? — verify with PokéAPI canon).
  - **Moves tab content**: list grouped by learn method (Level-up / TM-HM / Egg / Tutor) with sample moves.
  - **Locations tab content**: list of (Game, Route, rate, level range, method) tuples grouped by Game header. Sample: Pikachu in FireRed Viridian Forest 5%.
  - Show all 3 tabs as separate sections within the page (collapsible or stacked) so reviewer can see content without JavaScript-driven tabs.
  - **Acceptance**: matches PRD Stories 14–17. TypeEffectiveness visible without computing mentally. Tabs visually distinct. Hero sprite legible. Mobile + desktop both work.
  - **PRD link**: stories 14, 15, 16, 17 + the new Phase-3 Type Effectiveness clarification.
  - **Dependencies**: F1, F3, F4.

- [ ] **V1-3 — Build V1 Pokémon browser with Type filter** _(M, New)_
  - File: `prototypes/v1-flutterdex/pokemon-browser.html`. Links V1 tokens.
  - Renders: TopBar with search icon + filter icon. Sticky type filter chips section (collapsible, collapsed by default — render two states: collapsed and expanded). Pokémon grid/list (use 20 sample Pokémon from Gen 1).
  - Each PokemonCard: sprite + name + Pokémon types as TypeBadges + FavoriteToggle (star icon visible).
  - Mobile: list/single column. Desktop: grid 4 columns (or 5).
  - **Acceptance**: matches PRD Stories 11–13. Type filter chips look familiar (every type has a chip). PokemonCards readable at 375px without crowding.
  - **PRD link**: stories 11, 12, 13, 19, 20 (FavoriteToggle).
  - **Dependencies**: F1, F3, F4.

- [ ] **V1-4 — Build V1 Route browser** _(M, New)_
  - File: `prototypes/v1-flutterdex/route-browser.html`. Links V1 tokens.
  - Renders: TopBar with Game-selector icon + search icon. Active-Game persistent banner ("Active: FireRed"). Scrollable list of RouteCards (use 12 sample Routes from FireRed: Route 1, 2, 3, Viridian Forest, Mt. Moon, Route 4, Cerulean City, Route 5, Route 6, S.S. Anne, etc.).
  - Each RouteCard: Route name + count of distinct Pokémon obtainable + small TypeBadges preview (top 2-3 types).
  - **Acceptance**: matches PRD Stories 1–4. Mobile single-column, desktop grid or list with more breathing room.
  - **PRD link**: stories 1, 2, 3, 4.
  - **Dependencies**: F1, F3, F4.

- [ ] **V1-5 — Build V1 Settings page** _(S, New)_
  - File: `prototypes/v1-flutterdex/settings.html`. Links V1 tokens.
  - Renders: header "Settings". Three pickers stacked vertically: Theme (segmented control: Light / Dark / System), Language (dropdown: English / Português (BR) / Español), Default Game (dropdown of supported Games). About section with version + repo link.
  - **Acceptance**: matches PRD Stories 23–29. All controls visible on mobile without scrolling beyond reasonable. Pickers usable.
  - **PRD link**: stories 23, 24, 25, 26, 27, 28, 29.
  - **Dependencies**: F1, F3.

---

## V2 — DataDex (Scandinavian + Swiss, Confident-pragmatic) — medium risk

Adds the **sprite-driven runtime card colors** (the variant's signature). Place those colors via inline `style="--card-color-primary: #...; --card-color-secondary: #...;"` per Pokémon — for prototype, hardcoded values per sample Pokémon are fine. Type badges are bold blocks.

- [ ] **V2-1 — Build V2 Route detail (encounter table) screen** _(L, New)_
  - File: `prototypes/v2-datadex/route-detail.html`. Links V2 tokens.
  - Same structure as V1-1 but: bold-block TypeBadges, tighter row spacing (information density), tabular-nums on encounter rate (%), Inter typography, sharper hairline borders.
  - **Acceptance**: matches PRD Stories 5–10. Visual treatment differs from V1; product still reads as the same product.
  - **PRD link**: stories 5, 6, 7, 8, 9, 10.
  - **Dependencies**: F1, F3, F4, F5, V1-1 (reference).

- [ ] **V2-2 — Build V2 Pokémon detail with sprite-color cards in hero + TypeEffectiveness** _(L, New)_
  - File: `prototypes/v2-datadex/pokemon-detail.html`. Links V2 tokens.
  - Same content as V1-2 but: hero card uses **sprite-extracted colors** via `--card-color-primary` and `--card-color-secondary` (hardcoded per sample for prototype). Bold-block TypeBadges. Tabular-nums on stats. TabBar treatment per V2 (sharper, less rounded).
  - **Acceptance**: hero card has visible sprite-driven gradient. Otherwise same content matrix as V1-2.
  - **PRD link**: stories 14, 15, 16, 17 + Phase-3 Type Effectiveness clarification.
  - **Dependencies**: F1, F3, F4, V1-2 (reference).

- [ ] **V2-3 — Build V2 Pokémon browser with sprite-color cards** _(M, New)_
  - File: `prototypes/v2-datadex/pokemon-browser.html`. Links V2 tokens.
  - Same content as V1-3 but: PokemonCards use sprite-extracted color background (signature of DataDex). Bold-block TypeBadges. Tighter grid.
  - **Acceptance**: matches PRD Stories 11–13. Sprite-driven color is visually distinct from V1's flat cards.
  - **PRD link**: stories 11, 12, 13, 19, 20.
  - **Dependencies**: F1, F3, F4, V1-3 (reference).

- [ ] **V2-4 — Build V2 Route browser** _(M, New)_
  - File: `prototypes/v2-datadex/route-browser.html`. Links V2 tokens.
  - Same content as V1-4 but: data-rich rows, bold-block badges, more density, tabular-nums on counts.
  - **Acceptance**: matches PRD Stories 1–4. Differentiates from V1 visibly.
  - **PRD link**: stories 1, 2, 3, 4.
  - **Dependencies**: F1, F3, F4, V1-4 (reference).

- [ ] **V2-5 — Build V2 Settings page** _(S, New)_
  - File: `prototypes/v2-datadex/settings.html`. Links V2 tokens.
  - Same content as V1-5 but: V2 typography (Inter), tighter spacing.
  - **Acceptance**: matches PRD Stories 23–29.
  - **PRD link**: stories 23, 24, 25, 26, 27, 28, 29.
  - **Dependencies**: F1, F3, V1-5 (reference).

---

## V3 — Linear (Swiss + dark-first, Confident-clinical) — highest aesthetic risk

Dark-first means default theme is dark. Outline-style TypeBadges. Smallest border-radius. Near-monochrome palette + violet accent. This variant tests whether Pokémon UI can shed the "kid app" inheritance.

- [ ] **V3-1 — Build V3 Route detail (encounter table) screen** _(L, New)_
  - File: `prototypes/v3-linear/route-detail.html`. Links V3 tokens. **Default theme = dark** (no `[data-theme]` attribute needed; it's the default in V3).
  - Same content as V1-1/V2-1 but: outline-only TypeBadges, near-black canvas, violet accent on filter toggles, Inter Display for hero / Inter for body, tabular-nums + slashed-zero on rate, very subtle shadows.
  - Add a light-mode demonstration section at the bottom of the page (toggle `[data-theme="light"]` on a sub-element) so the reviewer can see the fallback.
  - **Acceptance**: matches PRD Stories 5–10. Reads as a strategic instrument, not as Pokémon merch. Dark mode is the dominant impression.
  - **PRD link**: stories 5, 6, 7, 8, 9, 10.
  - **Dependencies**: F1, F3, F4, F5, V1-1 (reference).

- [ ] **V3-2 — Build V3 Pokémon detail with TypeEffectiveness** _(L, New)_
  - File: `prototypes/v3-linear/pokemon-detail.html`. Links V3 tokens. Default dark.
  - Same content as V1-2/V2-2 but: outline TypeBadges, no sprite-driven hero gradient (V3 keeps the canvas monochrome, sprite stands on its own), TabBar with subtle violet underline for active tab, tight typographic hierarchy.
  - **Acceptance**: matches PRD Stories 14–17 + TypeEffectiveness clarification. Visually distinct from V1 and V2.
  - **PRD link**: stories 14, 15, 16, 17.
  - **Dependencies**: F1, F3, F4, V1-2 (reference).

- [ ] **V3-3 — Build V3 Pokémon browser with Type filter** _(M, New)_
  - File: `prototypes/v3-linear/pokemon-browser.html`. Links V3 tokens. Default dark.
  - Same content as V1-3/V2-3 but: outline TypeBadges, monochrome card surfaces (no sprite color signature here), denser grid.
  - **Acceptance**: matches PRD Stories 11–13.
  - **PRD link**: stories 11, 12, 13, 19, 20.
  - **Dependencies**: F1, F3, F4, V1-3 (reference).

- [ ] **V3-4 — Build V3 Route browser** _(M, New)_
  - File: `prototypes/v3-linear/route-browser.html`. Links V3 tokens. Default dark.
  - Same content as V1-4/V2-4 but: monochrome rows, accent only on the active Game banner.
  - **Acceptance**: matches PRD Stories 1–4.
  - **PRD link**: stories 1, 2, 3, 4.
  - **Dependencies**: F1, F3, F4, V1-4 (reference).

- [ ] **V3-5 — Build V3 Settings page** _(S, New)_
  - File: `prototypes/v3-linear/settings.html`. Links V3 tokens. Default dark.
  - Same content as V1-5/V2-5 but: V3 typography, near-monochrome surfaces, violet on focus.
  - **Acceptance**: matches PRD Stories 23–29.
  - **PRD link**: stories 23, 24, 25, 26, 27, 28, 29.
  - **Dependencies**: F1, F3, V1-5 (reference).

---

## Review (after all 15 screens are built)

- [ ] **R1 — Run `/design-review` against all 3 variants** _(M)_
  - Use the design-review skill to critique each variant against the brief. Generates `DESIGN_REVIEW.md` with priorities (must-fix / should-fix / nice).
  - Capture screenshots at 375px and 1280px for each of the 15 prototypes (45 total) into `.design/pokedex/screenshots/{v1,v2,v3}/`.
  - **Acceptance**: `DESIGN_REVIEW.md` exists with structured findings for all 3 variants. Screenshots present.
  - **Dependencies**: all V1, V2, V3 tasks.

- [ ] **R2 — Manual accessibility pass per variant** _(M)_
  - For each variant: validate WCAG AA contrast (use a contrast checker against the actual rendered colors), verify keyboard navigation works (tab order, focus rings, Esc closes overlays), confirm `prefers-reduced-motion` disables animations, inspect screen-reader semantics on EncounterRow / TypeBadge / Sprite.
  - Findings logged in `DESIGN_REVIEW.md` under an "Accessibility" subsection.
  - **Acceptance**: each variant has an a11y findings section. Any AA failures are noted as must-fix.
  - **Dependencies**: R1.

- [ ] **R3 — Cross-browser sanity check** _(S)_
  - Open each prototype in Chrome, Safari, Firefox at both viewports. Note any layout breaks, font fallback issues, or `prefers-color-scheme` differences.
  - **Acceptance**: a small browser-compat note appended to `DESIGN_REVIEW.md`. No need to fix everything; just document.
  - **Dependencies**: R1.

- [ ] **R4 — Prepare Phase 5 testing artifacts** _(M)_
  - Build a single HTML index page (`prototypes/index.html`) listing the 15 prototypes with thumbnails or labels, organized by variant. This is what gets shared with the 2–3 community testers in Phase 5.
  - Draft the Phase-5 user-test script (task scenarios derived from the JTBDs in `EMPATHY.md` + the 5 user flows in `INFORMATION_ARCHITECTURE.md`). Save as `.design/pokedex/USER_TEST_SCRIPT.md`.
  - Draft the Facebook community survey (5–10 questions validating JTBD ranking and persona P2 hypothesis). Save as `.design/pokedex/COMMUNITY_SURVEY.md`.
  - **Acceptance**: index.html opens and links to all 15 prototypes. USER_TEST_SCRIPT.md and COMMUNITY_SURVEY.md exist with concrete questions.
  - **Dependencies**: R1.

---

## Summary

- **5 Foundation tasks** (F1–F5)
- **15 build tasks** (V1-1..5, V2-1..5, V3-1..5) — 5 screens × 3 variants
- **4 review tasks** (R1–R4)
- **Total: 24 tasks**

**Estimated total**: ~30–40 person-hours assuming familiarity with HTML+CSS. Solo QSCRUM with 13-pt sprints could fit Phase 4 in 2 sprints if all tasks are sized right, with R1–R4 spilling into the start of Phase 5.

**Visual checkpoint after V1**: pause and review V1's 5 screens before starting V2. If V1 already needs significant rework, fix V1 before duplicating mistakes into V2 and V3.
