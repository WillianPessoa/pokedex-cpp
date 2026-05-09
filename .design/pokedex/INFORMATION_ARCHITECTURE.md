# Information Architecture: Pokedex C++/QML

> Sprint 0 / Phase 3 — Ideate output. Companion to [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md), [`../research/EMPATHY.md`](../research/EMPATHY.md), [`../research/PERSONAS.md`](../research/PERSONAS.md), and [`../../CONTEXT.md`](../../CONTEXT.md). Drives Phase 4 (Prototype) layouts.
>
> The IA is **technology-agnostic but implementable in Qt's QML primitives** (StackView for navigation stacks, SwipeView/TabBar for tabs, Drawer for the sidebar, Popup/Dialog for modals/overlays). All three Phase-4 design variants (FlutterDex, DataDex, Linear) share this IA — only visual treatment differs.

## Site Map

The product is a native desktop+mobile application with no URLs (Qt navigation, not web routing). The structure below uses **route paths as state identifiers** for documentation purposes — these are conceptual, not URLs.

- **Routes (tab)** `routes/`
  - Route browser (root) — list of Routes for the active Game
  - Route detail — encounter table for one Route `routes/{routeId}`
  - Pokémon detail (push) — when tapping an EncounterRow `routes/{routeId}/pokemon/{pokemonId}`
- **Pokémon (tab)** `pokemon/`
  - Pokémon browser (root) — list of Gen 1–9 with Type filter
  - Pokémon detail — Info / Moves / Locations tabs `pokemon/{pokemonId}`
- **Favorites (tab)** `favorites/`
  - Favorites view (root) — list of favorited Pokémon
  - Pokémon detail (push) `favorites/pokemon/{pokemonId}`
- **Settings (tab)** `settings/`
  - Settings root — Theme + Language + Default Game pickers + About (single page)
- **Global overlays** (reachable from any tab via TopBar)
  - Search overlay — global Pokémon name search `*/search`
  - Game selector modal — change active Game `*/game-selector`

The "current Game" is **app-level state**, persisted across tabs and sessions, not encoded in route paths.

## Navigation Model

| Aspect | Mobile (<768 px) | Desktop (≥768 px) |
|---|---|---|
| Primary nav | **Bottom navigation bar** with 4 destinations: Routes / Pokémon / Favorites / Settings | **Sidebar** with Game selector at top + 4 nav links |
| Game selector | TopBar icon → bottom sheet modal | Always-visible component in the sidebar |
| Search | TopBar icon → bottom sheet overlay | TopBar icon → dropdown overlay aligned right |
| Back navigation | Header back button (always present in detail screens) + Android system back | Header back button only |
| Stack model | **Per-tab independent stack** (Material/iOS pattern) — switching tabs restores each tab's last state | **Single content area** — sidebar nav resets stack to that tab's root by default; in-tab back preserves history |

### Decisions embedded

1. **"Routes" tab restores last state, including detail position.** Closing the app on Route 5 detail and reopening lands on Route 5 detail, not the browser root.
2. **Pokémon detail opened via Route detail (encounter row)** opens with **Info tab selected** by default (the user already saw the location, now wants info on the Pokémon).
3. **Pokémon detail opened via global search** opens with **Locations tab selected** by default (search intent is "where can I find this").
4. **Tap on a Locations row in Pokémon detail → cross-tab navigation**: switches active Game (if needed) and pushes Routes tab to the Route detail of the target. Filter state is preserved per Game across these switches.
5. **Settings is a single page**, not a multi-screen flow. Three pickers + About section, stacked vertically. No sub-routes.
6. **No breadcrumbs**: header back button suffices. Mobile and desktop both rely on it.

## Content Hierarchy

### Route browser

1. **TopBar** — app name + Game selector icon + global search icon
2. **Active-Game banner** ("Active: FireRed") — sticky context cue
3. **Route list** (scrollable) — each `RouteCard` shows Route name + count of distinct Pokémon obtainable; ordered in canonical in-Game order
4. **Bottom navigation** (mobile only)

### Route detail (encounter table) — *the most important screen in the product*

1. **TopBar** — back button + Route name + small subtitle showing the Game name
2. **Filter toggles** (sticky, persistent on scroll): "First encounter only" + "Dupes clause: hide already caught"
3. **Encounter table** (scrollable) — each `EncounterRow`:
   - sprite + Pokémon name (English) + level range + encounter rate (%) + encounter method icon + Pokémon types (TypeBadges)
4. **Bottom navigation** (mobile only)

### Pokémon browser

1. **TopBar** — global search icon + filter icon
2. **Type filter chips** (sticky, collapsible — collapsed by default to save mobile space)
3. **Pokémon list / grid** (scrollable) — each `PokemonCard` shows sprite + name + types; ordered by national Pokédex number
4. **Bottom navigation** (mobile only)

### Pokémon detail

1. **TopBar** — back button + FavoriteToggle (★/☆)
2. **Hero section** — large sprite + Pokémon name + national Pokédex number + Pokémon types as TypeBadges
3. **Tab bar** — Info / Moves / Locations (3 tabs)
4. **Tab content** (changes per tab):
   - **Info tab** — vertical stack: Base stats (label + numeric value) → Abilities → **TypeEffectiveness section at the bottom** (Weak 4× / Weak 2× / Resist ½× / Resist ¼× / Immune); user must scroll to see effectiveness, accepted trade-off
   - **Moves tab** — list grouped by learn method (level-up / TM/HM / egg / tutor)
   - **Locations tab** — list of `(Game, Route, encounter rate, level range, method)` tuples grouped by Game; tapping a row navigates cross-tab to Routes tab Route detail
5. **Bottom navigation** (mobile only)

### Settings (single page)

1. **Header** — "Settings"
2. **Theme picker** — segmented control: Light / Dark / System
3. **Language picker** — dropdown: English / Português (BR) / Español / (community)
4. **Default Game picker** — dropdown of supported Games
5. **About section** — version, link to repo, license
6. **Bottom navigation** (mobile only)

### Favorites view

1. **TopBar** — "Favorites"
2. **List of favorited Pokémon** (scrollable) — same `PokemonCard` style as Pokémon browser
3. **Empty state** if zero Favorites
4. **Bottom navigation** (mobile only)

### Search overlay (modal — bottom sheet on mobile, dropdown on desktop)

1. **Search input** — autofocus on open
2. **Results list** (up to 8) — sprite + name + types per row
3. **Empty state** if zero matches

### Game selector modal

1. **Header** — "Select Game"
2. **List of supported Games** (Gen 1–9 mainline)
3. **Active Game** highlighted
4. **Cached Games** marked with offline-ready indicator (✓)

## User Flows

### Flow 1 — Encounter check on a new Route during a Nuzlocke run *(JTBD-1, primary)*

1. User opens app → **Routes tab is active** by default; Route browser of last selected Game renders
2. User scans the list, **taps Route X**
3. Route detail loads encounter table within ≤200 ms (Game cached)
4. (Optional) User toggles **"First encounter only"** if running Classic Nuzlocke
5. (Optional) User toggles **"Dupes clause"** if applying Dupes
6. User reads encounter table, decides whether to engage in the active Game
7. App backgrounded; state preserved per the per-tab stack model

**Branch — Game not cached**:
- 3a. Loading state ("Fetching FireRed Encounter tables…") visible
- 3b. Online: fetch → cache → render
- 3b'. Offline: empty state explaining the Game requires internet on first load

### Flow 2 — Type matchup mid-battle *(JTBD-2, secondary)*

1. User mid-battle in the Game; an unknown opponent appears
2. User opens app (current tab irrelevant)
3. **Tap search icon** in TopBar → overlay opens (bottom sheet on mobile, dropdown on desktop)
4. User types opponent's name (e.g. "Geodude")
5. Results render within ~200 ms
6. **Tap "Geodude"** → Pokémon detail opens with **Locations tab selected** (search default)
7. User switches to **Info tab** and scrolls to the **TypeEffectiveness section at the bottom**
8. User reads weaknesses/resistances directly (no mental computation required — *type effectiveness is computed and shown*)
9. App backgrounded; user returns to Game

> Future enhancement (roadmap, post-Run-tracker): a "Recommendation engine" suggesting best counters from the user's team. Out of MVP scope. See [DESIGN_BRIEF.md](DESIGN_BRIEF.md) Out of Scope section.

### Flow 3 — Find a specific Pokémon by name *(global search)*

1. User on any screen
2. **Tap search icon** in TopBar → overlay opens
3. User types the Pokémon's name
4. **Tap result** → Pokémon detail opens with **Locations tab selected** (the most likely answer for "where can I find this")
5. User reads locations, decides

### Flow 4 — Setup the app fresh on a new device *(first launch)*

1. User installs and opens app for the first time
2. App launches → **Routes tab** active → Route browser of the **factory-default Game (FireRed)** renders
3. Encounter tables not yet cached → **loading state** visible, fetch fires
4. **Online branch**: cache populates → Routes render
5. **Offline branch**: empty state explains "FireRed Encounter tables require an internet connection on first load. Switch to Pokémon tab to browse the catalog offline."
6. User explores, eventually opens **Settings**
7. Settings shows defaults: Theme = Dark (mobile factory default), Language = English, Default Game = FireRed
8. User customizes; changes persist immediately via PreferencesRepository

### Flow 5 — Switch active Game preserving filter state *(multi-Game player)*

1. User is on Routes → **Route 5 detail of FireRed**, with "First encounter only" toggled on
2. User wants to consult **LeafGreen** instead (same series, different encounter tables)
3. **Mobile**: tap Game selector icon in TopBar → bottom sheet with Game list opens
4. **Desktop**: select a different Game in the persistent sidebar selector
5. User taps "LeafGreen"
6. Routes tab **resets to Route browser root** for LeafGreen (Routes don't translate 1:1 across Games)
7. **Filter state persists per Game**: when the user later switches back to FireRed, "First encounter only" is still on
8. User explores LeafGreen, may toggle filters independently
9. Switch back to FireRed → its filter state is restored

**Decision**: switching Game does *not* attempt to preserve in-Route position. Reset to browser root each time. Cleaner mental model.

## Naming Conventions

The IA inherits the canonical vocabulary defined in [`CONTEXT.md`](../../CONTEXT.md). UI labels follow it strictly.

| Concept | Label in UI | Rationale |
|---|---|---|
| Encounter | "Encounter" | Canonical from the glossary; we never write "spawn" or "appearance". |
| Route | "Route" | Even when the location is technically a cave or surfing zone, we surface "Route" as the canonical label for consistency. Sub-types appear within the Route detail (e.g. "Cave", "Surf") as method indicators on each `EncounterRow`. |
| Game | "Game" (e.g. "FireRed") | Each Game's user-facing name is the standard franchise spelling. |
| Species / Pokémon (form) | Both shown as "Pokémon" in UI | The technical distinction matters in the schema, not in the UI. UI uses Pokémon names directly (Pikachu, Alolan Vulpix). |
| Pokémon type | "Type" within "Type effectiveness", "Filter by type" | The qualifier "Pokémon" is implicit in context; we use plain "Type" in UI labels. |
| Move type | Surfaced via colored pill on each move row | Same enum as Pokémon types; coloring is enough disambiguation. |
| First encounter rule | "First encounter only" (toggle label) | Matches the canonical glossary term. |
| Dupes clause | "Dupes clause" with subtitle "hide already caught" | First-line: glossary term. Second-line: plain-English clarification for newcomers (P2). |
| Favorite | "Favorite" / star icon ★ | Glossary term; UI surfaces the star, not the word, after activation. |
| Theme / Language / Default Game | Plain words | Standard product UX terms. |
| Encounter rate | "{n}%" rendered numerically | No "rate" word; the value plus "%" is self-explanatory. |
| Level range | "Lv {min}–{max}" | "Lv" abbreviation matches Game in-screen convention; en-dash separates. |

## Component Reuse Map

Components defined in the design brief; this map shows where they appear and what variation each context requires.

| Component | Used on | Behavior differences |
|---|---|---|
| `TopBar` | Every screen | Title and right-side icons vary by screen (search + Game selector for browsers; back + favorite for detail screens) |
| `BottomNav` | All tabs (mobile only) | Active tab highlighted; persists across screens within a tab |
| `SidebarNav` | All tabs (desktop only) | Game selector + 4 nav links; active link highlighted |
| `RouteCard` | Route browser | Static — no variant |
| `PokemonCard` | Pokémon browser, Favorites view, Search overlay results | Sizes vary: full card (browser), compact card (search results) |
| `EncounterRow` | Route detail; Pokémon detail Locations tab | Same row layout; in Locations tab grouped by Game header |
| `TypeBadge` | EncounterRow, PokemonCard, Pokémon detail hero, TypeEffectiveness section | Always identical visual; only count of badges differs |
| `FavoriteToggle` | PokemonCard, Pokémon detail TopBar | Same icon (★/☆) and same toggle behavior; placement differs |
| `GameSelector` | TopBar (mobile); Sidebar (desktop) | Mobile triggers a modal; desktop is the persistent component |
| `SearchInput` | Search overlay | Single instance |
| `NuzlockeFilterToggle` | Route detail | Two togglable switches stacked or side-by-side; sticky position |
| `TabBar` | Pokémon detail | Three tabs |
| `LoadingState` (skeleton) | Any list-based screen during fetch | Skeletons match the shape of the missing content (RouteCards, EncounterRows, PokemonCards) |
| `EmptyState` | Any list when no data | Concise message + lightweight illustration; absorbs error states in MVP (no separate `ErrorState` component) |
| `Sprite` | Wherever a Pokémon is rendered | Async-loaded; placeholder before load |
| `ThemeSwitcher` | Settings | Single instance |

## Content Growth Plan

| Section | Growth pattern | IA accommodation |
|---|---|---|
| **Catalog (Species, Pokémon, Forms, Types, Moves, Abilities)** | Bounded — grows once per generation (~3 years) | Bundled with the app; updated by app release |
| **Encounter tables per Game** | Grows as we add new Games to MVP coverage | Per-Game lazy fetch + local cache. Game selector modal lists supported Games; cached vs uncached indicated |
| **Favorites** | Grows over time per user; bounded by user behavior | Linear list in Favorites view; if it grows past comfort, sorting + Type filter inherited from Pokémon browser |
| **Preferences** | Bounded — small set, doesn't grow | Single-page Settings |
| **Languages** | Grows via community contributions | Language picker fetches translation pack metadata; new locales appear automatically |

The **Run tracker** (roadmap) will introduce a new top-level destination in the navigation. When it lands, BottomNav grows to 5 tabs OR Favorites is folded into a "Library" combined destination. IA decision deferred to that sprint.

## Navigation Routes (state paths)

Conceptual paths used in code/state, not URLs. Documented for clarity:

- Pattern: `/{tab}/{screen}/{id?}/{sub?}`
- Examples:
  - `/routes/` — Route browser of active Game
  - `/routes/route-1/` — Route detail
  - `/routes/route-1/pokemon/pikachu/` — Pokémon detail pushed from a Route's encounter
  - `/pokemon/charizard/` — Pokémon detail from Pokémon browser
  - `/pokemon/charizard/locations` — Pokémon detail with Locations tab pre-selected
  - `/favorites/pokemon/pikachu/` — Pokémon detail from Favorites
  - `/settings/`
  - `/{tab}/search` — Search overlay (preserves origin tab)
  - `/{tab}/game-selector` — Game selector modal (preserves origin tab)

The active Game is held in `Preferences` (PreferencesRepository) and is **not** part of the path. Switching Game changes the data shown for the same path skeleton.

## Empty / Loading / Error State Map

| Screen | Loading | Empty | Error |
|---|---|---|---|
| Route browser | Skeleton RouteCards (5–6 placeholders) | "No Routes for this Game" (rare; indicates bug) | "Failed to load Routes — retry" |
| Route detail (Game cached) | Skeleton EncounterRows (4–5 placeholders) | "No Encounters match this filter — toggle filters or pick another Route" | "Failed to load Encounters — retry" |
| Route detail (Game not cached, online) | "Fetching FireRed Encounter tables…" + spinner | n/a | "Couldn't reach the network. Switch to Pokémon tab to browse the catalog offline." |
| Route detail (Game not cached, offline) | n/a | "FireRed Encounter tables not yet downloaded. Connect to the internet on first load." | n/a |
| Pokémon browser | Skeleton PokemonCards (8–9 placeholders) | "No Pokémon match this filter" | n/a (catalog is bundled) |
| Pokémon detail Info | Skeleton (~200 ms) | n/a | n/a |
| Pokémon detail Moves | Skeleton moves | "No moves data available for this Pokémon" (rare) | n/a |
| Pokémon detail Locations | Skeleton location rows | "This Pokémon doesn't appear in any cached Game's encounter tables. Cache more Games to see locations." | n/a |
| Settings | Instant render | n/a | n/a |
| Favorites view | Instant render | "No Favorites yet — tap ★ on any Pokémon to add" | n/a |
| Search overlay | Debounced 200 ms (no skeleton — empty input) | "No Pokémon match '{query}'" | n/a |
| Game selector modal | Instant render | n/a | n/a |

### Microcopy principles (from Design Brief)

- **"Speed over depth"**: skeletons over spinners (visual continuity).
- **"Player flow over engagement"**: empty states are short and direct, no heavy illustrations or playful tone.
- **Tone "Confident"**: "No matches" beats "Unfortunately we couldn't find anything."

### Reduced motion

When `prefers-reduced-motion` is set (system-level preference): skeleton placeholders are static (no shimmer animation); filter toggle cross-fade becomes an instant cut.
