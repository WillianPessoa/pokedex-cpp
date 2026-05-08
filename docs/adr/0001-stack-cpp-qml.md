---
status: accepted
date: 2026-05-08
---

# Stack: C++ + Qt 6 + QML for desktop and mobile

## Context

The v1 prototype (PySide6/Python) at `/Users/williangomespessoa/workspace/pokedex/` validated Qt/QML as the UI layer but is explicitly considered a learning step. v2 needs a single codebase that runs natively on Linux, macOS, Windows, Android, and iOS, serves as a public engineering portfolio, and lets the project owner deepen their C++ skills.

## Decision

We will build v2 with **C++17 + Qt 6 + QML**. CMake + `qt_add_qml_module` for build. Single codebase across desktop and mobile.

## Reasoning

Three forces make this the right choice for this project:

1. **Continuity from v1 + learn C++**: the QML written for the v1 prototype ports over with minimal conceptual shift; C++ replaces only the Python-side bindings (`Q_PROPERTY`, `Q_INVOKABLE`, `signals/slots` instead of PySide decorators). The owner explicitly wants to learn C++ at depth — this is the most pragmatic vehicle.
2. **Cross-platform reach without changing framework**: Qt is one of very few stacks that delivers Linux + macOS + Windows + Android + iOS from a single codebase. Flutter cuts Linux out in practice; SwiftUI is Apple-only; Kotlin Multiplatform's desktop story is weak; Tauri's mobile support is immature (as of early 2026).
3. **Public engineering showcase**: the project will be open-source. C++/Qt/QML is a non-trivial stack that signals engineering depth. The Qt community values well-built reference projects, and there are few modern, complete examples in the Pokémon-tooling space.

## Considered alternatives

| Alternative | Why rejected |
|---|---|
| **PySide6 (keep v1 stack)** | Owner wants to learn C++; v1 explicitly framed as a stepping stone. |
| **Flutter / Dart** | Loses QML reuse from v1; Linux desktop quality is uneven; not a learning goal. |
| **Tauri (Rust + web frontend)** | Web frontend is not "native" on mobile (gestures, performance); mobile target still maturing in 2026. |
| **Rust + Slint** | Slint is too immature in 2026 for a multi-platform shipping product; small ecosystem. |
| **Swift + SwiftUI** | Apple-only; would block Linux desktop and Android, which the owner uses (mGBA on phone). |
| **Kotlin Multiplatform + Compose** | Loses QML reuse; Linux desktop story remains weak. |

## Consequences

- **Build system overhead**: CMake + Qt's QML module system is more involved than a `setup.sh` script. Mitigated by sticking to the official `qt_add_qml_module` workflow.
- **C++ learning curve will slow Sprint 1**: the owner accepts this; it is a stated goal of the project.
- **Mobile deployment** (especially iOS) requires Apple Developer Program enrollment ($99/year) and Xcode toolchain; this is a real cost not yet committed to. Linux/macOS/Windows desktop and Android can ship without it — iOS is roadmap, not MVP.
- **Performance/footprint is not the primary driver** for this decision; it's a nice-to-have. Don't over-index on micro-optimizations early — favor clarity.
