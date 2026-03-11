# 📝 RELEASE NOTES - AniScript v1.1.0

## [v1.1.0] - 2026-03-10

This release focuses on performance stability, accessibility, and professional developer tooling.

### ✨ Highlights

#### ♿ Accessibility First
Added support for the `prefers-reduced-motion` media query. AniScript now automatically respects OS-level accessibility settings, ensuring a safe experience for users with motion sensitivity.

#### ⚡ Performance & Stability
- **Memory Leak Fix**: Resolved a critical issue where `IntersectionObserver` instances were accumulating on repeated script initializations.
- **Improved UX**: The default animation delay has been changed from `500ms` to `0ms`, eliminating the perceived "blank flash" when elements enter the viewport.

#### 🛠 Developer Experience
- **Jest Integration**: Migrated to Jest for more robust automated testing and code coverage reporting.
- **Strict Mode**: The compiler now supports a `{ strict: true }` option for better integration with build pipelines.
- **Robust Parsing**: Refactored the internal lookahead heuristic to be much more stable and future-proof.

---

# 📝 RELEASE NOTES - AniScript v1.0.0

We are proud to announce the first stable release of **AniScript**, the Markdown Supercharger!

## Highlights

### 🚀 The Markdown Supercharger
AniScript v1.0.0 introduces a powerful, declarative DSL for web animations. It combines the simplicity of markdown-like syntax with the performance of hardware-accelerated CSS animations.

### 🧠 Dual-Module Architecture
- **Compiler**: A robust recursive descent parser that transforms `:: syntax ::` into semantic HTML.
- **Runtime**: A smart `IntersectionObserver` based engine that handles stagger logic, delay calculations, and viewport-aware triggers.

### 🎭 53 Premium Animations
Out of the box, AniScript includes 53 carefully crafted animations:
- **Fades & Zooms**: Smooth entry and exit effects.
- **Attention Seekers**: Shakes, pulses, and bounces to draw focus.
- **Special Effects**: Motion blurs, flips, and rotations for a premium aesthetic.

### ⚡ Performance & Hardware Acceleration
Every animation in AniScript is optimized for 60FPS. By strictly adhering to `transform`, `opacity`, and `filter` properties, we ensure zero layout thrashing and smooth performance even on low-end devices.

## What's New in v1.0.0
- **Recursive Parsing**: Nest animations inside each other without breaking the layout.
- **Stagger Containers**: Easily create complex entrance sequences for lists and grids.
- **Wait/Delay Support**: Fine-grained control over when animations start.
- **Intersection Observer**: Built-in lazy-triggering for better performance and user experience.
- **Error Resiliency**: Inline error reporting in the compiler for easy debugging.

## How to Get Started
1. Install via npm: `npm install aniscript`
2. Check the `README.md` for full syntax documentation and the complete animation list.

---
*Built with passion for high-performance web experiences.*
