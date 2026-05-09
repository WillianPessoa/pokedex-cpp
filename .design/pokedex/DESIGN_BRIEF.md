# Design Brief: Pokedex C++/QML — Encounter Encyclopedia for Challenge Runs

> Sprint 0 / Phase 2 — Define output. Companion to [`CONTEXT.md`](../../CONTEXT.md), [`docs/adr/0001-stack-cpp-qml.md`](../../docs/adr/0001-stack-cpp-qml.md), [`docs/adr/0002-data-strategy.md`](../../docs/adr/0002-data-strategy.md), and [`.design/research/EMPATHY.md`](../research/EMPATHY.md), [`.design/research/PERSONAS.md`](../research/PERSONAS.md). This brief drives Phase 3 (Ideate) and Phase 4 (Prototype).

## Problem

A Pokémon player running a Nuzlocke or Genlock or Randomizer run pauses the game on every new Route to consult external Pokedex sites. The available tools are wrong for the moment: browser sites (Bulbapedia, PokemonDB) are slow and ad-heavy on mobile; none surface a "first encounter only" filter native to the rules they're playing under; encounter tables are not scoped cleanly by Game version. The player has to mentally filter, drill through tabs, and lose flow with the run.

## Solution

A native desktop+mobile app that opens straight into the Route browser of the last Game played, surfaces encounter tables in two taps, and respects challenge-run rules natively (first-encounter filter, dupes clause). Pokémon look-up exists as a parallel entry point for users who already know what they want. The product feels like a strategic instrument the player picks up between battles — not an encyclopedia they scroll through.

## Experience Principles

1. **Speed over depth.**
   *In practice*: encounter table appears in ≤2 taps from app launch; deep info (movepool, breeding, EV yield) lives one layer down, accessed only on demand. Microcopy direct, empty states short. Skeletons over spinners.

2. **Rules over features.**
   *In practice*: Nuzlocke vocabulary is native, not bolted-on — "First encounter", "Dupes clause", "Run", "Ruleset" are first-class. Game selector is prominent; encounter rate is shown on every row. Filters that match a real ruleset are surfaced; generic "filter by anything" UIs are avoided.

3. **Player flow over engagement.**
   *In practice*: zero onboarding flow, zero notifications, zero daily streaks. App opens directly to last-used Route browser. Settings are minimal. Theme, language, default Game are persistent and out of the way. The user is in the game, not in the app.

## Aesthetic Direction

This brief commits to **three parallel design variants**, prototyped side-by-side in Phase 4 and validated against each other in Phase 5. Each variant tests a different aesthetic hypothesis. The winner — or a hybrid — becomes the production direction in Sprint 1.

### Variant 1 — FlutterDex-inspired (primary exploration)

- **Philosophy**: Scandinavian
- **Reference**: [FlutterDex](https://github.com/scitbiz/flutter_pokedex)
- **Tone**: Confident-warm
- **Why**: cards are the strongest visual moment in Pokémon UIs FlutterDex executed cleanly. Rounded, gradient-accented, sprite-led. Friendly without being childish. Lowest-effort variant to build because it's the simplest.

### Variant 2 — DataDex-inspired

- **Philosophy**: Scandinavian + Swiss accents
- **Reference**: DataDex (mobile)
- **Tone**: Confident-pragmatic
- **Why**: data-rich, type-color-driven, tab navigation in detail. Cards extract primary/secondary colors from the sprite (per the project owner's prior research notes in v1's `referencias-visuais.md`). Type badges are bold color blocks (Swiss accent), encounter rate gets typographic emphasis. More information density than V1.

### Variant 3 — Linear-inspired

- **Philosophy**: Swiss with Scandinavian softening
- **References**: [Linear](https://linear.app), [Strava](https://strava.com)
- **Tone**: Confident-clinical
- **Why**: dark-mode-first, sharp typographic hierarchy, monochrome with a single accent. Strategic-tool feel borrowed from Linear's interface. Tests whether Pokémon UIs can shed the "kid app" inheritance and stand alongside professional software.

### Shared aesthetic constraints (all variants)

- **Tone (one word)**: **Confident**. Calm, competent, unflashy. Not warm-cute, not cold-clinical. Microcopy direct.
- **Anti-references**: [Serebii.net](https://serebii.net) (cluttered, dated), [Bulbapedia](https://bulbapedia.bulbagarden.net) (plain-text wiki overload), [Pokémon HOME](https://home.pokemon.com) (cartoonish, infantile), generic AI dashboards (purple gradients, Inter, evenly-distributed palettes).
- **Pokémon names** stay in English across all locales (Pikachu = Pikachu).
- **Type badges** must be instantly identifiable across all variants — exact treatment varies by variant but recognition does not.

## Existing Patterns

The pokedex-cpp repository has no UI code yet — all variants are net-new. The project's predecessor (v1, PySide6/Python at [`/Users/williangomespessoa/workspace/pokedex/`](../../../pokedex/)) is **reference-only**: its `Theme.qml` and `CardStyle.qml` singletons were valid concepts and inform mental models, but no code is ported. v1 stays untouched.

- **Typography**: TBD in `/design-tokens` (Phase 3). Each variant will pick its own pairing — likely Plus Jakarta Sans / Nunito (Variant 1), Inter / IBM Plex (Variant 3); Variant 2 to be decided.
- **Colors**: TBD in `/design-tokens`. All variants share Pokémon type colors (Fire `#EE8130`, Water `#6390F0`, Grass `#7AC74C`, etc. — canonical PokéAPI palette). Variants differ in surface/text colors and dark-mode handling.
- **Spacing**: TBD in `/design-tokens`. Likely 4/8/16/24/32 base across all variants; density varies by philosophy.
- **Components**: see Component Inventory below — all marked **New**.

## Component Inventory

All components are **new** (no v1 code is ported). The list below covers the MVP for the *prototype phase* (Phase 4 HTML+CSS); the production phase (C++/QML) maps these to QML primitives later.

| Component | Status | Notes |
|---|---|---|
| **Layout shell** | | |
| AppShell | New | Top-level container; differs mobile vs desktop |
| TopBar | New | App title, Game selector, search trigger, settings icon |
| BottomNav | New | Mobile only: Routes / Pokémon / Favorites / Settings |
| SidebarNav | New | Desktop only: full Game list, navigation links, search |
| **Browsers** | | |
| RouteBrowser | New | List of Routes for selected Game |
| RouteCard | New | One Route — name, encounter count, type previews |
| PokemonBrowser | New | Filterable list of Pokémon (Gen 1–9) |
| PokemonCard | New | One Pokémon — sprite, name, types; treatment varies by variant |
| **Detail screens** | | |
| RouteDetail | New | The encounter table; receives Nuzlocke filters |
| EncounterRow | New | One encounter — sprite, Pokémon name, level range, rate, types, method |
| PokemonDetail | New | Pokémon info + tabs (Info / Moves / Locations) |
| TabBar | New | Tabs within PokemonDetail |
| **Filters / Controls** | | |
| GameSelector | New | Modal/dropdown to pick the active Game |
| TypeFilterChip | New | Clickable type chip (Fire/Water/etc.) |
| NuzlockeFilterToggle | New | Switch: "First encounter only" |
| DupesClauseToggle | New | Switch: "Hide already-caught" |
| SearchInput | New | Global Pokémon search |
| **Atomic** | | |
| TypeBadge | New | Pokémon type indicator; bold blocks (V1, V2) or refined (V3) |
| Sprite | New | Lazy-loaded image with fallback |
| FavoriteToggle | New | ★ / ☆ |
| ThemeSwitcher | New | Theme picker (Light / Dark / System) — also hosts language picker in MVP, no separate atomic |
| **Feedback states** | | |
| LoadingState | New | Skeleton (preferred) or spinner |
| EmptyState | New | Concise message + lightweight illustration; also covers error states in MVP (no separate ErrorState atomic) |

**Cut from MVP** (will not appear in prototypes): StatBar (animated stat bars — show as text + number for now), separate ErrorState component (folded into EmptyState), separate LanguageSwitcher component (lives inside Settings panel).

## Key Interactions

### A. Encounter check (≤2 taps — primary JTBD)

1. User opens app. App lands on the Route browser of the last selected Game (Game state persisted).
2. User taps a Route name. Route detail screen appears with encounter table fully rendered within ~200 ms (data is local SQLite for cached Games).
3. (Optional) Apply Nuzlocke filters via toggles persistent at the top of the encounter table.

### B. Nuzlocke filter toggle

- Two toggles live persistently at the top of Route detail: **"First encounter only"** and **"Dupes clause: hide caught"**.
- Tapping a toggle re-filters the encounter list with a 150 ms cross-fade — the list does not re-render from scratch, animation focuses on changing rows.
- Filter state is per-Game, persisted to local SQLite. The next time the user opens that Game's Route detail, filters are restored.

### C. Global Pokémon search

- TopBar exposes a search icon. Tap → focused input opens (bottom sheet on mobile, dropdown on desktop).
- As the user types, search debounces 200 ms and shows up to 8 matches: sprite + name + types.
- Tap a result → PokémonDetail opens with the **Locations tab pre-selected** (the most likely answer for "where can I find this Pokémon"). User can tab to Info or Moves from there.

### D. Theme + Language switch

- Settings screen contains two stacked pickers: **Theme** (Light / Dark / System) and **Language** (EN / PT-BR / ES, with room for community translations).
- Theme change applies instantly (no app restart). Language change applies instantly via Qt Linguist.
- Both settings persist to local SQLite immediately, no Save button.

## Responsive Behavior

- **Each prototype HTML file contains both mobile and desktop layouts**, switched by media queries on the same DOM. No separate files per breakpoint.
- **Mobile (375px baseline)**: bottom navigation, single-column content, sheets for modals, full-width touch targets (≥44×44 px).
- **Desktop (1280px baseline)**: sidebar navigation, two-column content where useful (list + detail panel side-by-side in some screens), click targets can be smaller.
- **Breakpoint**: desktop layout activates at **min-width: 768px**. No tablet-specific layout — the desktop scales down acceptably between 768 px and 1024 px, fully visible at 1280+ px.
- **Body text**: 16 px on mobile (prevents iOS zoom-on-focus). Can scale up on desktop where comfortable line lengths permit.
- **Density**: each variant chooses its own — V1 looser, V3 denser. All maintain ≥44 px touch targets on mobile.

## Accessibility Requirements

- **Contrast**: WCAG **AA** for all text (4.5:1 normal, 3:1 large). Validated during `/design-tokens` step against light and dark palettes per variant.
- **Keyboard navigation**: complete on desktop. Logical tab order, visible focus rings, Esc closes modals/sheets, Enter activates focused interactive elements.
- **Screen readers**: encounter rows expose `role="row"` with proper labelling (encounter Pokémon name + level + rate). Type badges have `aria-label` (visible glyph + invisible text). Sprites have `alt` text or `aria-hidden` if purely decorative.
- **Motion**: `prefers-reduced-motion` disables all transitions/animations. Filter cross-fades become instant cuts.
- **Focus management**: when navigation transitions (e.g., search result → PokémonDetail), focus moves to the new screen's main heading.

## Out of Scope

This brief explicitly does **not** cover, and the MVP does **not** include, the following:

- **Run tracker**: creating/managing Runs, marking Pokémon caught/dead, badge progress. Belongs to roadmap.
- **Save file reading**: parsing FRLG/HG-SS/Emerald save binaries to populate Run state automatically. Belongs to distant roadmap.
- **Lore / flavor text**: Pokédex entry text per game. Editorial content; not the strategic-tool focus.
- **Breeding details**: egg groups, hatch counter, gender ratio. Encyclopedia-grade content; out of MVP.
- **Stat math**: EV yield, IV calculator, competitive stat math. Belongs to a competitive-focused tool, not this product.
- **Evolution chain as primary navigation**: appears within PokémonDetail when relevant, but is not a browser entry point.
- **Login / cloud sync / sharing**: the product is local-first. No accounts.
- **In-app purchases / monetization**: free, open-source, no commerce.
- **Daily streaks / gamification**: explicitly contrary to "Player flow over engagement".
- **Push notifications**: same reason.
- **Tablet-specific layouts**: desktop layout scales between 768 px and 1280 px; no dedicated tablet tier.
- **ROMhack-specific data**: encounter tables for Radical Red / Unbound / etc. The vanilla games are MVP scope; ROMhacks roadmap.
- **Pokémon comparator**: side-by-side comparison of 2–6 Pokémon. Was in v1 plan; cut from MVP to keep prototype scope manageable.
- **Sprite color extraction**: V2 variant suggests cards using sprite-derived colors (per v1 research). The *extraction pipeline* is out of MVP for the prototype phase — Phase 4 prototypes can use placeholder colors. Production C++/QML implements extraction in Sprint 1+.
- **Team-based recommendation engine**: "best counters from my team" — when the user opens a Pokémon detail of an opponent, surface highest-damage Pokémon from the user's caught set with recommended moves. Requires moveset dataset, damage estimator, ranking UI, and "Team" as a first-class entity (extends Favorites). Roadmap, post Run tracker.

> **In scope clarification (added Phase 3, 2026-05-08)**: Type effectiveness *for an individual Pokémon* IS in MVP — surfaced as a section at the bottom of the Info tab in Pokémon detail. Only a top-level **Type matchup matrix browser** (browse-anywhere chart) is out of MVP scope.
