# 🚀 Getting Started with AniScript (v1.1.1)

Welcome to **AniScript**, the lightweight animation DSL designed to make your web content dynamic with minimal code. This guide will help you set up and use AniScript in your project, whether you're using a modern build pipeline or a simple static website.

---

## 🛠 Choose Your Installation Path

### Option 1: Modern Build (NPM/Yarn/PNPM)
Recommended for frameworks like React, Vue, Svelte, or Next.js.

1.  **Install the package**:
    ```bash
    npm install aniscript
    ```

2.  **Import in your main JavaScript/TypeScript file**:
    ```javascript
    import { compile, init } from 'aniscript';

    // Compile your AniScript DSL string to HTML
    const rawDSL = ":: fade-up | h1 | @200ms :: { Hello AniScript }";
    const html = compile(rawDSL);

    // Inject into the DOM
    document.querySelector('#app').innerHTML = html;

    // Initialize the observer
    init({ threshold: 0.15 });
    ```

3.  **Include the CSS**:
    Import the styles at the top of your main CSS or JS file:
    ```javascript
    import 'aniscript/dist/aniscript.css';
    ```

---

### Option 2: Direct Script (CDN)
Perfect for static sites (like GitHub Pages) or testing.

1.  **Link the assets** in your `<head>`:
    ```html
    <link rel="stylesheet" href="https://unpkg.com/aniscript/dist/aniscript.css">
    ```

2.  **Add the script** before your closing `</body>` tag:
    ```html
    <script type="module">
      import { compile, init } from 'https://unpkg.com/aniscript/src/index.js';

      document.body.innerHTML += compile(":: bounce-in :: { 💖 No Build Tool Required! }");
      init();
    </script>
    ```

---

## 🏗 Understanding the Workflow

AniScript works in three stages:

1.  **Creation** (DSL): You write simple, readable character strings.
2.  **Compilation** (HTML): AniScript turns that DSL into semantic HTML with `data-ani-*` attributes.
3.  **Runtime** (JS/CSS): The library detects when those elements enter the viewport and triggers the CSS animations.

### The "Manual" Shortcut
If you don't want to use the compiler, you can write the HTML manually! 

```html
<div data-ani="fade-up" data-ani-delay="200ms" class="ani-paused">
  This will animate when seen!
</div>
```

---

## 💡 Pro Tips

*   **Initial State**: The runtime handles adding `ani-paused` classes, but for complex layouts, it's best to ensure your elements are hidden initially (`opacity: 0`) if they aren't using the DSL.
*   **Initialization**: Only call `init()` **once** per page load. If you add elements dynamically, you might need a re-scan (coming in v1.2!).
*   **Customization**: You can customize the `IntersectionObserver` via the `init()` options:
    ```javascript
    init({
      threshold: 0.5,      // Fires when 50% visible
      rootMargin: '100px'  // Pre-loads 100px before entry
    });
    ```

---

### Need More?
Check the [API Reference](https://github.com/xtarflex/ANISCRIPT-/blob/master/docs/API_REFERENCE.md) for a list of all 53 animations, or see the [Architecture Spec](https://github.com/xtarflex/ANISCRIPT-/blob/master/SPEC.md) for technical details.
