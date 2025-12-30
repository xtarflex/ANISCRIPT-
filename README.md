# <img src="logo.svg" width="48" style="vertical-align: middle; margin-right: 10px;"> AniScript v1.0.0

### The Markdown Supercharger

AniScript is a high-performance animation library designed to bring life to static content through a simple, declarative DSL. It bridges the gap between raw CSS animations and easy-to-use markdown workflows.

---

## ✨ Killer Feature: Markdown Supercharger
AniScript allows you to wrap any content in sophisticated animations using a concise, readable syntax. Whether you're building a landing page, a blog, or a documentation site, AniScript adds a premium feel with almost zero overhead.

---

## 🛠 Syntax Documentation

### Single Element
The basic syntax for an animated element is:
```
:: animation-name | tag | @delay | dur:duration :: { content }
```
- **animation-name**: (Required) One of the 53 available animations (e.g., `fade-up`).
- **tag**: (Optional) `div` or `span`. Defaults to `div`.
- **@delay**: (Optional) Initial delay before animation starts (e.g., `@200ms`, `@0.5s`).
- **dur:duration**: (Optional) Total duration of the animation (e.g., `dur:1s`, `dur:800ms`).
- **{ content }**: The inner HTML or text to be animated.

**Example:**
```
:: fade-up | span | @200ms | dur:1.2s :: { Hello World! }
```

### Staggered Groups
Automatically apply cumulative delays to a group of elements:
```
[[ stagger: 100ms ]]
  :: fade-in :: { First item }
  :: fade-in :: { Second item }
  :: fade-in :: { Third item }
[[/]]
```

---

## 🎭 Available Animations (53)

AniScript comes packed with 53 hardware-accelerated animations across 9 categories:

| Category | Animations |
| :--- | :--- |
| **Fades** | `fade-in`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-sm`, `fade-up-lg`, `fade-down-sm`, `fade-down-lg`, `fade-left-sm`, `fade-right-sm` |
| **Diagonal Fades** | `fade-up-left`, `fade-up-right`, `fade-down-left`, `fade-down-right` |
| **Zooms** | `zoom-in`, `zoom-in-sm`, `zoom-in-lg`, `zoom-out`, `zoom-out-sm`, `zoom-out-lg`, `zoom-in-up`, `zoom-in-down` |
| **Slides** | `slide-in-up`, `slide-in-down`, `slide-in-left`, `slide-in-right` |
| **Flips & Rotations** | `flip-x`, `flip-y`, `rotate-in-cw`, `rotate-in-ccw`, `rotate-up`, `rotate-down` |
| **Bounces** | `bounce-in`, `bounce-up`, `bounce-down`, `bounce-left`, `bounce-right` |
| **Blur & Effects** | `blur-in`, `blur-in-sm`, `blur-in-lg`, `blur-out` |
| **Slides & Bounces** | `slide-bounce-up`, `slide-bounce-down`, `slide-bounce-left`, `slide-bounce-right` |
| **Attention Seekers** | `shake-h`, `shake-v`, `pulse`, `swing`, `jello`, `wobble`, `rubber-band` |

---

## 📦 Installation & Usage

### 1. Install
```bash
npm install aniscript
```

### 2. Import and Initialize
```javascript
import { compile, init } from 'aniscript';

// Compile DSL to HTML
const html = compile(':: fade-up :: { Animated Text }');

// Inject into DOM
document.body.innerHTML = html;

// Initialize Runtime (IntersectionObserver)
init({ threshold: 0.1 });
```

### 3. Include CSS
Ensure you include the AniScript CSS in your project:
```html
<link rel="stylesheet" href="node_modules/aniscript/dist/aniscript.css">
```

---

## ⚡ Performance First
- **Zero Layout Shifts**: Animations only use `transform`, `opacity`, and `filter`.
- **Intersection Observer**: Animations only fire when elements enter the viewport.
- **Micro-Bundle**: Lightweight core with no external dependencies.

---

## 📄 License
ISC License
