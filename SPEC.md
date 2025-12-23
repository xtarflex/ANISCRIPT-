# AniScript Technical Specification

## 1. Project Definition
AniScript is a dual-module animation library consisting of:
- **Module A (Compiler)**: Node.js based recursive descent parser transforming custom DSL to HTML.
- **Module B (Runtime)**: Browser JS for handling animation state and "Option B" inline style logic.
- **Module C (Styles)**: Pure CSS keyframes.

## 2. Assumptions
- **Default Duration**: `1s` (unless specified).
- **Default Delay**: `500ms`.
- **Default Tag**: `div`.
- **Default Easing**: `ease-out`.
- **Environment**:
  - Compiler: Node.js (Build time/SSG).
  - Runtime: Modern Browsers (ES6+, IntersectionObserver).
- **Stagger Logic**: Stagger delays are cumulative based on the DOM order within the stagger container.

## 3. Module A: Compiler (Node.js)
Transforms `.ani` syntax (or string input) into HTML with specific data attributes.

### 3.1 Syntax
**Single Element:**
```
:: animation-name | tag | @delay | dur:duration :: { content }
```
- `animation-name`: Required identifier (e.g., `fade-up`).
- `tag`: Optional tag selection (`div` or `span`). Defaults to `div`.
- `@delay`: Optional delay (e.g., `@200ms`, `@0.5s`).
- `dur:duration`: Optional duration (e.g., `dur:1s`, `dur:500ms`).
- `{ content }`: Inner HTML content.

**Stagger Container:**
```
[[ stagger: 100ms ]]
  :: fade-up :: { Item 1 }
  :: fade-up :: { Item 2 }
[[/]]
```
- `[[ stagger: time ]]`: Opens a stagger group.
- `[[/]]`: Closes the group.

### 3.2 Output HTML
The compiler generates a wrapper (`div` or `span`) for each animation block.

**Single Element:**
```html
<div data-ani="animation-name" data-ani-delay="delay" data-ani-duration="duration">
  content
</div>
```

**Stagger Container:**
```html
<div data-ani-stagger="100ms">
   ... children ...
</div>
```

## 4. Module B: Runtime (Browser JS)
### 4.1 Logic (Option B: Inline Styles)
The runtime is responsible for reading attributes and applying inline styles for timing, ensuring the CSS handles the visual transition.

**Initialization (`ANI.init()`):**
1.  **Scan**: Query all elements with `data-ani` and `data-ani-stagger`.
2.  **Stagger Calculation**:
    - For elements inside a `[data-ani-stagger]` container, calculate the cumulative delay.
    - Formula: `param_delay + (index * stagger_value)`.
3.  **Apply Styles**:
    - Set `element.style.animationDelay = calculated_delay`.
    - Set `element.style.animationDuration = duration` (if present).
4.  **Observer Setup**:
    - Initialize `IntersectionObserver`.
    - Target all `[data-ani]` elements.

### 4.2 State Management
- **Initial State**: Elements start with class `.ani-paused`.
    - `[data-ani].ani-paused { opacity: 0; }`
- **Trigger**: Observer detects element enters viewport (threshold config, e.g., 0.1).
- **Action**:
    - Remove `.ani-paused`.
    - Add `.ani-running`.
- **CSS Trigger**: The presence of `.ani-running` triggers the CSS animation name.

## 5. Module C: Styles (CSS)
Contains the actual animation keyframes.

### 5.1 Selectors
Selectors combine the data attribute and the running class.
```css
[data-ani="fade-up"].ani-running {
  animation-name: fadeUp;
  animation-fill-mode: forwards; /* Maintain final state */
}
```

### 5.2 Keyframes
Must use hardware-accelerated properties (`transform`, `opacity`). 

**Supported Animations:**
- **Fade**: `fade-in`, `fade-up`, `fade-down`, `fade-left`, `fade-right`.
- **Fade (Variations)**: `fade-up-sm`, `fade-up-lg`, `fade-down-sm`, `fade-down-lg`.
- **Zoom**: `zoom-in`, `zoom-in-sm`, `zoom-in-lg`, `zoom-out`, `zoom-out-sm`, `zoom-out-lg`.
- **Flip**: `flip-x`, `flip-y`.
- **Rotate**: `rotate-in-cw`, `rotate-in-ccw`.
- **Slide (Full)**: `slide-in-up`, `slide-in-down`, `slide-in-left`, `slide-in-right`.

## 8. Edge Case & Error Behavior
### 8.1 Syntax Errors
- **Unclosed Blocks `{ ... }**: The parser must throw an error if a content block is not closed before EOF or the next instruction.
- **Unclosed Stagger `[[ ... ]]`: The parser must throw an error if a stagger block is not closed.

### 8.2 Parameter Handling
- **Duplicate Parameters**: If multiple values for the same parameter (e.g., two delays) are provided, the **last one wins**.
- **Unknown Modifiers**: Any tokens that don't match the `animation-name`, `tag`, `@delay`, or `dur:duration` patterns should be ignored by the compiler.

### 8.3 Hierarchy
- **Nested Animations**: Supported. Inner animations behave as standard elements and inherit timing if inside a stagger container.
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translate3d(0, 20px, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
```

## 6. Project Structure (Monorepo)
```
aniscript/
├── src/
│   ├── compiler/
│   │   ├── index.js      # Main entry
│   │   ├── parser.js     # Recursive descent logic
│   │   └── lexer.js      # Tokenizer
│   ├── runtime/
│   │   ├── index.js      # Browser entry
│   │   └── observer.js   # IntersectionObserver logic
│   └── css/
│       ├── core.css      # Base classes (.ani-paused, etc.)
│       └── animations.css# Keyframe definitions
├── tests/
│   └── fixtures.json     # Data-driven test cases
├── package.json
├── SPEC.md
└── DEV_LOG.md
```

## 7. API Surface
### Compiler API
```javascript
import { compile } from './src/compiler';
const html = compile(myAniString);
```

### Runtime API
```javascript
import AniScript from './src/runtime';
AniScript.init({
  threshold: 0.1, // IntersectionObserver threshold
  rootMargin: '0px'
});
```
