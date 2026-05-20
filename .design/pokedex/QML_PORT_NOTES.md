# QML Port Notes — Pokedex C++/QML v2

**Status**: Sprint 0 bridge document. Updated as Sprint 1 implementation begins.  
**Purpose**: map HTML+CSS prototype decisions to their QML/Qt equivalents so Sprint 1 doesn't restart the design conversation from scratch.

---

## 1. Token system → QML Singleton

CSS custom properties don't exist in QML. The equivalent is a **QML Singleton** registered via `qt_add_qml_module`.

### Pattern

```qml
// Theme.qml — registered as singleton in CMakeLists.txt
pragma Singleton
import QtQuick

QtObject {
    id: root

    // Surfaces
    readonly property color bgPrimary:   "#FAF7F2"
    readonly property color bgSecondary: "#FFFFFF"
    readonly property color bgTertiary:  "#F0EBE4"

    // Text
    readonly property color textPrimary:   "#2A2A2A"
    readonly property color textSecondary: "#5C5450"
    readonly property color textTertiary:  "#9C8F87"

    // Accent
    readonly property color accentPrimary: "#5A7A8C"
    // ...
}
```

```qml
// Usage — in any QML file
import Pokedex

Rectangle {
    color: Theme.bgPrimary
    Text { color: Theme.textPrimary }
}
```

### Mapping table (V1 FlutterDex as reference — light mode)

| CSS token | QML property | V1 value | V2 value | V3 value |
|---|---|---|---|---|
| `--color-bg-primary` | `Theme.bgPrimary` | `#FAF7F2` | `#F8F6F3` | `#0B0F12` |
| `--color-bg-secondary` | `Theme.bgSecondary` | `#FFFFFF` | `#FFFFFF` | `#11161A` |
| `--color-text-primary` | `Theme.textPrimary` | `#2A2A2A` | `#1F1F1F` | `#E8EAED` |
| `--color-text-secondary` | `Theme.textSecondary` | `#5C5450` | `#4A4540` | `#9CA3AF` |
| `--color-accent-primary` | `Theme.accentPrimary` | `#5A7A8C` | `#3651AB` | `#C084FC` |
| `--color-border-primary` | `Theme.borderPrimary` | `#E8E0D6` | `#DCD7CF` | `#1F2937` |

**Dark mode**: CSS uses `[data-theme="dark"]` on `<html>`. QML uses `property bool isDark` on the singleton, toggled at runtime. Bind component properties to `Theme.isDark ? Theme.bgPrimaryDark : Theme.bgPrimary` or use a `color` function that returns the right value.

---

## 2. Spacing scale → QML property

CSS: `--space-4: 16px`  
QML: expose the scale on `Theme` and reference it everywhere.

```qml
// Theme.qml
readonly property int sp1:  4
readonly property int sp2:  8
readonly property int sp3:  12
readonly property int sp4:  16   // base unit
readonly property int sp5:  24
readonly property int sp6:  32
readonly property int sp7:  48
readonly property int sp8:  64
```

Use: `padding: Theme.sp4` or `spacing: Theme.sp3`.

---

## 3. Typography → Qt font system

Fonts are loaded via `FontLoader` or bundled as resources in `CMakeLists.txt`.

### V1 / V2 — Plus Jakarta Sans (V1) / Inter (V2)

```qml
// In AppLoader.qml or main.qml — load once, use everywhere
FontLoader { id: fontJakarta; source: "qrc:/fonts/PlusJakartaSans-Variable.ttf" }
FontLoader { id: fontInter;   source: "qrc:/fonts/Inter-Variable.ttf" }
```

### V3 — Inter

Same as V2. V3 also uses Inter Display for hero scale — at Qt 6, Inter Display is a separate file or achieved via weight/optical-size axes if using the variable font.

### CSS → Qt font properties

| CSS | QML | Notes |
|---|---|---|
| `font-size: 16px` | `font.pixelSize: 16` | always use `pixelSize`, never `pointSize` for pixel-accurate design |
| `font-weight: 500` | `font.weight: Font.Medium` | Qt enum: `Thin=100 Light=300 Normal=400 Medium=500 DemiBold=600 Bold=700` |
| `letter-spacing: 0.04em` | `font.letterSpacing: 0.04 * font.pixelSize` | QML `letterSpacing` is in pixels, not em — compute |
| `line-height: 1.5` | `lineHeight: 1.5; lineHeightMode: Text.ProportionalHeight` | on `Text` item |
| `font-variant-numeric: tabular-nums` | `font.features: {"tnum": 1}` | Qt 6.6+ — for encounter rates, level ranges, stat numbers (V2+V3 mandatory) |
| `font-feature-settings: 'zero'` | `font.features: {"zero": 1}` | V3: slashed zero — also Qt 6.6+ |

---

## 4. Layout patterns → QML layout primitives

### AppShell (F3)

CSS uses a grid with `grid-template-rows: auto 1fr` + media queries for sidebar vs bottom nav.  
QML uses `StackLayout` / `SplitView` / `ColumnLayout` + `width` breakpoint checks.

```qml
// AppShell.qml — skeleton
Item {
    id: shell

    readonly property bool isDesktop: width >= 768

    // Top bar — always present
    TopBar { id: topBar; anchors { top: parent.top; left: parent.left; right: parent.right } }

    // Sidebar — desktop only
    SideNav {
        visible: shell.isDesktop
        anchors { top: topBar.bottom; left: parent.left; bottom: parent.bottom }
        width: 220
    }

    // Content area
    Item {
        anchors {
            top: topBar.bottom
            left: shell.isDesktop ? sideNav.right : parent.left
            right: parent.right
            bottom: shell.isDesktop ? parent.bottom : bottomNav.top
        }
        // StackView for navigation within the tab
    }

    // Bottom nav — mobile only
    BottomNav {
        visible: !shell.isDesktop
        anchors { bottom: parent.bottom; left: parent.left; right: parent.right }
    }
}
```

### Card list (Route browser, Pokémon browser)

CSS: `display: flex; flex-direction: column; gap: var(--space-2)`  
QML: `ListView` with a `spacing` property. **Never** use `Column` + `Repeater` for long lists — `ListView` recycles delegates.

```qml
ListView {
    spacing: Theme.sp2
    delegate: RouteCard { /* … */ }
    clip: true
}
```

### Encounter table (Route detail — the primary screen)

CSS: the encounter table is a `<ul>` with flex rows. In QML, this maps to `ListView` with `EncounterRow` as delegate. The sticky filter toggles above the list use `ColumnLayout` with the filter strip having `z: 1` and a `Rectangle` background.

### Pokémon detail tabs (Info / Moves / Locations)

CSS prototypes show all 3 tab panels stacked (no JS). In QML: `TabBar` + `StackLayout` or `SwipeView`. `SwipeView` is the more mobile-native choice (gesture-driven).

```qml
SwipeView {
    id: detailTabs
    currentIndex: tabBar.currentIndex

    InfoTab { }
    MovesTab { }
    LocationsTab { }
}

TabBar {
    id: tabBar
    currentIndex: detailTabs.currentIndex
    TabButton { text: qsTr("Info") }
    TabButton { text: qsTr("Moves") }
    TabButton { text: qsTr("Locations") }
}
```

---

## 5. TypeBadge component

HTML prototype: `.type-badge.type-fire` → computed background + text from token vars.  
QML: a small `Rectangle` + `Text` item parameterised by `typeName`.

```qml
// TypeBadge.qml
import QtQuick

Rectangle {
    id: badge

    property string typeName: "fire"  // lowercase, matches PokéAPI slug

    // Treatment differs by variant — read from Theme singleton
    // V1: pastel pill (large radius, pastel bg, deep text)
    // V2: solid block (medium radius, saturated bg, selected text)
    // V3: outline (0 bg, border in type color, type-color text)

    radius: Theme.typeBadgeRadius
    color:  Theme.typeBadgeBg(typeName)
    border.color: Theme.typeBadgeBorder(typeName)
    border.width: Theme.typeBadgeBorderWidth

    implicitWidth: label.implicitWidth + Theme.sp4
    implicitHeight: 22

    Text {
        id: label
        anchors.centerIn: parent
        text: badge.typeName.toUpperCase()
        font.pixelSize: 11
        font.weight: Font.SemiBold
        font.letterSpacing: 0.06 * font.pixelSize
        color: Theme.typeBadgeText(typeName)
    }
}
```

The `Theme.typeBadgeBg(typeName)` is a JS function on the singleton — a `function(name)` that returns the correct color per variant and dark/light mode.

---

## 6. Type color system

All 3 variants share identical canonical type colors (same hex values from PokéAPI). Only the badge treatment differs. In QML, store the 18 type colors once:

```qml
// TypeColors.qml — singleton (shared, variant-agnostic)
pragma Singleton
import QtQuick

QtObject {
    function color(typeName) {
        const map = {
            "normal":   "#A8A77A",
            "fire":     "#EE8130",
            "water":    "#6390F0",
            "electric": "#F7D02C",
            "grass":    "#7AC74C",
            "ice":      "#96D9D6",
            "fighting": "#C22E28",
            "poison":   "#A33EA1",
            "ground":   "#E2BF65",
            "flying":   "#A98FF3",
            "psychic":  "#F95587",
            "bug":      "#A6B91A",
            "rock":     "#B6A136",
            "ghost":    "#735797",
            "dragon":   "#6F35FC",
            "dark":     "#705746",
            "steel":    "#B7B7CE",
            "fairy":    "#D685AD"
        }
        return map[typeName] ?? "#A8A77A"
    }
}
```

---

## 7. Motion / animation

CSS uses `transition: color 150ms ease` or `@keyframes` for skeleton shimmer.  
QML equivalents:

| CSS | QML |
|---|---|
| `transition: background 150ms ease` | `Behavior on color { ColorAnimation { duration: 150 } }` |
| `transition: opacity 200ms` | `Behavior on opacity { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }` |
| `@keyframes shimmer` (skeleton) | `SequentialAnimation { loops: Animation.Infinite; ... }` on a `Rectangle` with `opacity` |
| `prefers-reduced-motion` | check `Qt.styleHints.showShortcutsInContextMenus` — or expose a user `Preference` for reduced motion and disable `Behavior` blocks when set |

---

## 8. Sprite loading

Prototype: `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/..." loading="lazy">`.  
Production (per ADR 0002): bundled sprite extraction at build time → sprites shipped as Qt resources.

```qml
Image {
    source: "qrc:/sprites/pokemon/" + pokemonId + ".png"
    // fallback:
    onStatusChanged: if (status === Image.Error) source = "qrc:/sprites/fallback.png"
    fillMode: Image.PreserveAspectFit
    smooth: true
    mipmap: true   // avoids aliasing at smaller sizes
}
```

Animated sprites (GIF for shiny / special): `AnimatedImage` (already used in v1 Python app). Note: `AnimatedImage` in Qt 6 only supports GIF and APNG.

---

## 9. What V3 (Linear) needs extra attention

V3 is dark-first. In Qt, dark mode is the **default theme** when `Theme.isDark` defaults to `true`. The light mode derivation is secondary. Key V3 specifics:

- **Border radius**: `2–6px` everywhere. No pills. Set `Theme.radiusSm: 2`, `Theme.radiusMd: 4`, `Theme.radiusLg: 6`.
- **Shadows**: QML `layer.effect: DropShadow` with `radius: 4; samples: 8; color: Qt.rgba(0,0,0,0.25)` for dark mode. Near-invisible — match the `box-shadow: 0 1px 3px rgba(0,0,0,0.3)` from the prototype.
- **Tabular nums + slashed zero**: mandatory on all numerical data. Requires Qt 6.6+ font features.
- **Accent**: single violet (`#C084FC` dark / `#7C3AED` light). Never mix with other colors.

---

## 10. Variant selection strategy for Sprint 1

Sprint 1 starts C++ code before Phase 5 user testing is complete. Suggested approach:

1. **Build variant-agnostic components** (AppShell, TypeBadge, RouteBrowser, PokémonBrowser, EncounterRow) driven by the `Theme` singleton.
2. **Default to V1 tokens** for initial development — lowest visual risk, fastest to validate architecture.
3. **Token-swap to V3 or V2** once Phase 5 testing reveals the winner. This should require changing only which token values are loaded into `Theme`, not rebuilding components.

This is only possible if component code references **no hardcoded hex values** — every color, radius, and spacing goes through `Theme`.

---

## Open questions (to resolve in Sprint 1)

- [ ] Which variant wins Phase 5 testing? (determines which token set becomes production)
- [ ] `Theme` singleton: one file with all 3 variant token sets + a `variant` property, or 3 separate singleton files? (preference: one file, variant enum, to avoid import proliferation)
- [ ] Reduced-motion preference: expose as a `Preference` entity in MVP or defer?
- [ ] V2 sprite-color extraction: `QImage` pixel sampling at app startup, or pre-computed at build time and bundled as a JSON sidecar? (pre-computed is simpler, avoids main-thread stall)
