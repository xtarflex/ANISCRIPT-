# 📖 AniScript API Reference (v1.0.0)

This reference lists all 53 built-in animations, how to use staggered groups, and the supported parameters.

---

## 🛠 DSL Parameters

AniScript uses a concise format for all animations:

```
:: name | tag | @delay | dur:duration :: { content }
```

- **name**: (Required) Animation name (see the tables below).
- **tag**: (Optional) HTML element tag (`div` or `span`). Defaults to `div`.
- **@delay**: (Optional) Initial delay (e.g., `@100ms`, `@0.5s`).
- **dur:duration**: (Optional) Animation duration (e.g., `dur:1.5s`, `dur:300ms`).
- **{ content }**: (Required) Inner HTML or text.

---

## 🎭 Animations (53)

AniScript animations are categorized for easy selection. All animations are performance-optimized (GPU-accelerated).

### 1. Fades (11)
Subtle and smooth entry/exit animations.

| Name | Effect Description |
| :--- | :--- |
| `fade-in` | Simple opacity transition. |
| `fade-up`, `fade-up-sm`, `fade-up-lg` | Fade in while moving upwards. |
| `fade-down`, `fade-down-sm`, `fade-down-lg` | Fade in while moving downwards. |
| `fade-left`, `fade-left-sm` | Fade in while moving from the right. |
| `fade-right`, `fade-right-sm` | Fade in while moving from the left. |

### 2. Diagonal Fades (4)
For a dynamic, corner-entry feel.

| Name | Direction |
| :--- | :--- |
| `fade-up-left` | From bottom-right to top-left. |
| `fade-up-right` | From bottom-left to top-right. |
| `fade-down-left` | From top-right to bottom-left. |
| `fade-down-right` | From top-left to bottom-right. |

### 3. Zooms (8)
Scaling animations for focus.

| Name | Type |
| :--- | :--- |
| `zoom-in`, `zoom-in-sm`, `zoom-in-lg` | Scaled from 0 or small to 1. |
| `zoom-out`, `zoom-out-sm`, `zoom-out-lg` | Scaled from large to 1. |
| `zoom-in-up`, `zoom-in-down` | Zoom in with vertical motion. |

### 4. Slides (4)
Direct motion from outside the container.

| Name | Movement |
| :--- | :--- |
| `slide-in-up` / `down` | Direct vertical entry. |
| `slide-in-left` / `right` | Direct horizontal entry. |

### 5. Flips & Rotations (6)
3D-style transitions.

| Name | Axis |
| :--- | :--- |
| `flip-x` | Vertical flip. |
| `flip-y` | Horizontal flip. |
| `rotate-in-cw` / `ccw` | Clockwise / counter-clockwise entrance. |
| `rotate-up` / `down` | Rotated entry from vertical edge. |

### 6. Bounces (5)
Playful, elastic movements.

| Name | Direction |
| :--- | :--- |
| `bounce-in` | Standard bounce entry. |
| `bounce-up` / `down` | Bounce from top/bottom. |
| `bounce-left` / `right` | Bounce from sides. |

### 7. Blur & Effects (4)
Text-heavy or "premium" blur reveals.

| Name | Effect |
| :--- | :--- |
| `blur-in`, `blur-in-sm`, `blur-in-lg` | Start blurry and sharpen. |
| `blur-out` | Dissolve with blur. |

### 8. Slides & Bounces (4)
Combination for higher energy.

- `slide-bounce-up`, `slide-bounce-down`, `slide-bounce-left`, `slide-bounce-right`

### 9. Attention Seekers (7)
Great for CTAs and highlighting features.

- `shake-h`: Horizontal shake.
- `shake-v`: Vertical shake.
- `pulse`: Subtle growth and shrink.
- `swing`: Pendulum-like rotation.
- `jello`: "Wobbly" distortion effect.
- `wobble`: Side-to-side rotation + slide.
- `rubber-band`: Elastic stretch.

---

## ⚡ Stagger Groups

Automatically apply cumulative delays to children without manual math:

```
[[ stagger: 200ms ]]
  :: fade-up :: { Child A }
  :: fade-up :: { Child B }
  :: fade-up :: { Child C }
[[/]]
```

- Each subsequent child adds `200ms` of delay.
- The first child starts at `@0ms` (or its own `@delay`).
- The second child starts at `200ms` + its own `@delay`.
- The third child starts at `400ms` + its own `@delay`.

---

## 🔧 Troubleshooting

1.  **"Animation not firing?"**: Ensure `init()` is called after the elements are in the DOM.
2.  **"Styles not loading?"**: Ensure you are linking `dist/aniscript.css`.
3.  **"Stuttering?"**: Ensure your animations are limited to `transform`, `opacity`, or `filter`.
