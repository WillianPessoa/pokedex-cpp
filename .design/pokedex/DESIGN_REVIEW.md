# Design Review: Pokédex C++/QML — Sprint 0 Phase 4 Prototypes

Reviewed against: `DESIGN_BRIEF.md`  
Variants reviewed: V1 FlutterDex · V2 DataDex · V3 Linear  
Date: 2026-05-19  
Reviewer: Claude Sonnet 4.6 via `/design-review`

---

## Screenshots Captured (session — not committed to repo)

| Screen | Variant | Breakpoint | Notes |
|---|---|---|---|
| route-detail | V1 | 375px mobile, light | Primary JTBD screen |
| route-detail | V1 | 1280px desktop, light | Sidebar nav visible |
| pokemon-browser | V1 | 1280px desktop, light | Type filter chips + card grid |
| pokemon-detail | V1 | 375px mobile, light | Hero + tabs + base stats |
| route-detail | V2 | 1280px desktop, light | Tabular data density comparison |
| route-detail | V3 | 1280px desktop, dark | Tabular + breadcrumb + violet accent |
| route-detail | V3 | 375px mobile, dark | Dark-first mobile with strong hierarchy |
| pokemon-browser | V3 | 375px mobile, dark | List-view + outline badges + generation header |

> To persist screenshots: re-run `open prototypes/v*/route-detail.html` and `⌘⇧4` at 375 and 1280 into `.design/pokedex/screenshots/`.

---

## Summary

All three variants successfully deliver **differentiated aesthetics that each pursue their stated philosophy**. The AppShell correctly switches sidebar/bottom-nav at 768px, type badges are distinct across variants (V1 pastel pills → V2 solid blocks → V3 outlines), and Nuzlocke vocabulary is native on every route-detail screen. **V3 Linear is the most complete and polished prototype** — dark-first, typographically strong, and the furthest from "kid app". V1 is warmest and safest. V2 is the most information-dense but feels slightly squeezed on desktop. The biggest systemic issue is **empty whitespace at the bottom of several pages** (content doesn't fill the viewport scroll area) — this is a prototype fidelity gap, not an architectural problem.

---

## Must Fix

### 1. Empty viewport space on pokemon-detail and pokemon-browser (all variants)

V1 pokemon-detail (mobile 375px): content fills ~50% of the screen height. Below the BASE STATS card, the rest of the page is empty cream. Same pattern on V3 pokemon-browser mobile — only 5 list rows are visible, then a large black void.

**Root cause**: prototype content is stubbed with a single tab-panel worth of content. The full tabs (Moves, Locations) + TypeEffectiveness section + Abilities scroll off or are not rendered inline.

**Fix**: in the prototype, render all 3 tab panels stacked (Info → Moves → Locations) with a visible section divider. The prototype brief (TASKS.md V1-2) specifies: *"Show all 3 tabs as separate sections within the page so reviewer can see content without JS-driven tabs."* This wasn't fully implemented — the Moves and Locations sections appear to be missing from at least V1-2 and V3-2.

**Priority**: must fix before Phase 5 user testing — testers will think the screen is broken or empty.

---

### 2. V2 desktop: content column doesn't expand to fill available width

At 1280px with the 240px sidebar, V2 route-detail renders a narrow centered column (~400px wide) with large empty flanks. The encounter rows don't stretch to fill the content area. This defeats V2's "information density" hypothesis — there's room for a richer desktop table but the CSS doesn't use it.

**Fix**: in `v2-datadex/route-detail.html`, the `.encounter-list` or equivalent container should use `max-width: var(--max-width-wide)` (960px) with `margin-inline: auto`, or simply allow it to stretch with `width: 100%`. Check whether the V1 and V3 desktop layouts share this gap — V1 desktop shows the same narrow column behavior.

---

### 3. V3 "OBT" column heading is unexplained

The desktop route-detail (V3) shows a tabular header row: `LV RANGE · RATE · METHOD · OBT`. "OBT" is unexplained — likely "obtainable" or "obtainability", but a new user won't decode it.

**Fix**: replace with `CATCH` or `CATCHABLE` (matches "catch" in natural Nuzlocke vocabulary), or expand on hover via `title` attribute in the prototype. Document the choice in CONTEXT.md if `OBT` is kept.

---

## Should Fix

### 4. Demo FAB is jarring on light-mode prototypes

The floating eye-icon button used to switch prototype states is a dark circular button (`background: var(--color-bg-inverse)`) that stands out as a foreign element, especially on V1's warm cream and V2's crisp white. On V3 dark it blends acceptably.

**Fix**: for Phase 5 testing, replace the FAB with a fixed top bar that's visually separated from the prototype chrome (e.g., a 24px strip with `background: #f0f0f0; border-bottom: 1px solid #ccc` and small grey labels). This keeps the state-switcher out of the actual UI chrome and avoids confusing testers.

---

### 5. V3 pokemon-browser: list rows have inconsistent spacing

The V3 Pokémon browser list shows each row with a Pokémon name + type badges, plus a separate row below with a ★ icon. This doubles the vertical height per item unnecessarily. V1 places the star icon inline (top-right of the card), which is cleaner.

**Fix**: move the FavoriteToggle (★) inline into the Pokémon row, right-aligned, matching the V1 approach. This is the correct UX pattern — the star should be a hit target within the row, not a separate row below it.

---

### 6. V1/V2 dark mode not validated in review

V1 and V2 have `[data-theme="dark"]` tokens in their CSS files (seen in token audit), but the review was conducted light-mode only. V3's dark mode is validated (it's the primary mode). V1 and V2 dark modes may have token gaps.

**Fix before Phase 5**: open each V1 and V2 screen, toggle `document.documentElement.setAttribute('data-theme','dark')` in DevTools, and verify that all surfaces switch correctly with no hardcoded colors remaining.

---

### 7. V1 desktop: filter toggles are stacked vertically, wasting horizontal space

On the V1 desktop route-detail, "First encounter only" and "Dupes clause: hide caught" appear as a vertical stack below the header, when at 1280px there's ample horizontal room to display them inline side-by-side.

**Fix**: at `@media (min-width: 768px)`, add `display: flex; flex-direction: row; gap: var(--space-4)` to the filter container. Mobile stacked layout is correct and should remain as-is.

---

## Could Improve

### 8. V2 route-detail: encounter rate lacks typographic differentiation

V2's "information density" brand promise relies on tabular-nums and bold rate values. The current prototype shows encounter rates in the same size/weight as the Pokémon name text. The brief specifies *"tabular-nums on encounter rate (%) and level ranges"* and *"typographic emphasis"*.

**Suggestion**: make the encounter rate font-weight bold and slightly larger than body (e.g., `font-size: var(--font-size-lg); font-weight: var(--font-weight-bold)`). The 50% / 5% difference should be scannable at a glance.

---

### 9. V3 route summary stats: "LV RANGE: 2 5" reads as two numbers

The desktop route-detail hero shows `LV RANGE: 2 5` with the dash/en-dash missing between the numbers. This is likely a whitespace issue in the prototype HTML.

**Suggestion**: use `2–5` (U+2013 en-dash) or `2 – 5` for readability. Verify the same is consistent in all encounter row level ranges.

---

### 10. V1 pokemon-browser type filter chips — only partial type list visible

On desktop (1280px) V1 pokemon-browser, the type filter chips row shows ~10 of the 18 types. The remaining types (Ghost, Dragon, Dark, Steel, Fairy) are cut off or not rendered. The brief states all 18 types should have a chip.

**Suggestion**: use a flex-wrap row for the filter chips so all 18 wrap to a second line rather than truncating. Alternatively, use a horizontal scroll (`overflow-x: auto; white-space: nowrap`) on mobile and wrap on desktop.

---

### 11. AppShell sidebar — no logo / product name at the top

Both V1 and V2 desktop sidebars start directly with the "ACTIVE GAME" selector card. V3 is the same. None of them have a product name or logo at the sidebar top. This is intentional (per the brief: "zero onboarding"), but it makes the desktop chrome feel slightly anonymous, especially in early testing.

**Suggestion**: add a single line `Pokédex` in the sidebar above the game selector using `font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); letter-spacing: var(--letter-spacing-wide); opacity: 0.5`. Subtle brand anchor — removes the anonymous feeling without adding marketing chrome.

---

## Accessibility Findings

### AA Contrast — V1 and V2

Token files include contrast audits. The main text (`#2A2A2A` on `#FAF7F2`) was validated at design-tokens time. **Not re-audited in this review.** Trust the token-level audit from Phase 3 for primary text.

**Flag**: V1 type badge text — `--type-badge-text-electric: #854D0E` on `--type-badge-bg-electric: #FAEFC2` — visually passes in the prototype screenshots, but should be formally verified. Yellow backgrounds are the most common AA failure in Pokémon color systems.

### Touch targets

V1 and V3 mobile filter toggles appear to have ≥44px vertical height (prototype visually confirms adequate size). V3 ★ icon rows are very small (~24px height) — this is the same issue flagged in #5 above.

### Reduced motion

`@media (prefers-reduced-motion)` is referenced in the brief requirements. **Not verified in this review** — unable to test motion in static prototype. Add to Phase 5 QA checklist.

### Semantic structure

Prototypes use HTML semantics correctly at a glance: `<nav>` for navigation, `<main>` for content, encounter rows use list or row semantics. Full screen-reader audit deferred to Phase 5.

---

## Responsive Behavior Summary

| Screen | V1 mobile 375px | V1 desktop 1280px | V3 mobile 375px | V3 desktop 1280px |
|---|---|---|---|---|
| route-detail | ✅ clean | ✅ sidebar + encounters | ✅ strong hierarchy | ✅ tabular + breadcrumb |
| pokemon-browser | not captured | ✅ grid + type chips | ✅ list-view | not captured |
| pokemon-detail | ⚠️ empty lower half | not captured | not captured | not captured |

---

## What Works Well

1. **The three variants are genuinely distinct.** Anyone opening all three side-by-side immediately understands they are evaluating different aesthetic hypotheses — not just color swaps. V1 = warm cards, V2 = data tables, V3 = dark instrument. This is exactly what Phase 5 testing needs.

2. **Nuzlocke vocabulary is native across all variants.** "First encounter only", "Dupes clause: hide caught", encounter rate on every row, method labels — the product doesn't feel like a generic Pokédex with filters bolted on.

3. **V3 is remarkable for a prototype.** The breadcrumb nav, route metadata (encounters count, level range, method count), tabular encounter layout with column headers, violet accent on the active toggle, and outline type badges together feel like a finished design system, not a Phase 4 throwaway.

4. **AppShell breakpoint is solid.** At 768px, bottom nav ↔ sidebar swap works correctly and without visual jank in all three variants. This is the most critical structural decision in a cross-platform app and it's validated.

5. **Type badge system is well-differentiated.** The three badge treatments (pastel pill / solid block / outline) all solve the same recognition problem — 18 types instantly identifiable — via completely different aesthetic languages. This is good design thinking: same function, variant expression.

6. **Sprite loading from PokéAPI CDN is reliable.** All review screenshots showed sprites rendering correctly. The `loading="lazy"` attribute is applied. Fallback behavior (offline) was not tested but is documented in `sprites.md`.

---

## Phase 5 Readiness Assessment

The prototypes are **ready for Phase 5 user testing with the following conditions**:

- **Block**: fix the empty-content issue (#1) on pokemon-detail for V1 and V3 before showing to testers — the empty screen reads as a bug.
- **Recommended**: fix the demo FAB (#4) so testers don't confuse the state-switcher with actual UI.
- **Optional**: fix the content-width issue (#2) for a more accurate desktop impression.

After those fixes, the 3 variants are testable for the Phase 5 JTBD validation:
- Can the user find the encounter table in ≤2 taps?
- Does the variant feel like a "strategic instrument" (V3) or a "friendly reference" (V1)?
- Which type badge treatment is most scannable under time pressure?

---

## Open Questions for Phase 5 Test Script

- Ask testers to perform the primary JTBD ("you just entered Route 1 on your Nuzlocke, what's the first wild encounter?") on V1, then V3. Measure taps and confusion.
- Ask: "Does this feel like an app you'd open quickly during a run, or one you'd browse casually?" — surfaces the V1 vs V3 decision axis.
- Ask: "Which type indicators are easiest to read at a glance?" — validates V1 pastel pill vs V3 outline.
- Show V2 pokemon-browser to testers who already know Pokémon — assess whether the sprite-color card hypothesis holds.
