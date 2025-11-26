# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Shopify Theme for Consumer Electronics E-commerce**
- Stack: Shopify Liquid, JavaScript (ES6+), Tailwind CSS, Webpack
- Target: Mobile charging accessories (70% mobile traffic)
- Build system: Webpack 5 with PostCSS pipeline
- Apps: Privia (popups), Rebuy (recommendations), Shopify Currency Converter

## Development Commands

### Local Development
```bash
# Start development server (watch + serve)
npm start                    # Shopify theme serve + webpack watch

# Alternative development command
npm run start-new            # Uses shopify theme dev with specific store

# Watch only (without server)
npm run watch                # Webpack watch mode
```

### Build & Deploy
```bash
# Production build
npm run build                # Webpack production build + critical CSS split

# Critical CSS extraction (separate pass)
npm run build:critical-split # Extracts above-fold CSS to snippets/main-critical-css.liquid

# Deploy to Shopify
npm run deploy               # Build + push to theme store

# Push only (without build)
npm run push                 # Shopify theme push (ignores config/*.json)
```

### Shopify CLI Commands
```bash
# Login to store
shopify login --store titan-power-plus.myshopify.com

# Serve theme locally
shopify theme serve

# Publish theme (after push)
shopify theme publish [THEME_ID]

# Theme validation
shopify theme check
```

## Architecture Overview

### Build System

**Webpack Auto-Discovery Pattern**
- webpack.config.js recursively scans `src/scripts/entries/` for entry points
- No manual entry configuration needed - just add files following naming convention
- Special case: main.js automatically imports `src/styles/main.css` for global styles
- Section entries: `src/scripts/entries/section/<name>.js` → `section-<name>.js`
- Direct entries: `src/scripts/entries/<name>.js` → `<name>.js`

**Two-Phase Critical CSS Pipeline**
1. Main build: PostCSS with `postcss-critical-split` (output: 'rest') strips critical styles
2. Critical build: Separate PostCSS pass outputs to `snippets/main-critical-css.liquid`
- Enables inline critical CSS in `<head>` while maintaining modular development

**Asset Output**
- All compiled → `assets/` directory
- Cache busting: `[name].js?v=[timestamp]` (Shopify-friendly, no hashes)
- Commons chunk: Shared code from `node_modules/` and `src/scripts/lib/`

### Non-Standard Architectural Patterns

**1. Functional Component Initialization**
```javascript
// Components are FUNCTIONS, not classes
const initComponent = (Component, selector) => {
  document.querySelectorAll(`[data-module="${selector}"]`).forEach(element => {
    element.removeAttribute('data-module'); // One-time guard, prevents re-init
    Component(element); // Factory function pattern
  });
}
```

**2. Liquid-JavaScript Data Bridge**
```liquid
<!-- Server-rendered configuration -->
<script type="application/json" id="bf25HeroData">
{
  "config": {{ section.settings | json }},
  "tiers": [...]
}
</script>

<!-- JavaScript consumption -->
<script>
const data = JSON.parse(document.getElementById('bf25HeroData').textContent);
</script>
```
No global variables, type-safe via JSON parsing.

**3. BF25 Monolithic Architecture**
Large JavaScript files (bogo-builder.js: ~8000 lines) loaded directly to `assets/`:
- Bypass webpack module system
- Self-contained functionality
- No transpilation/minification
- Defensive duplication across files for reliability

### Key Files

**Build Configuration**
- `webpack.config.js` → Auto-discovery entry system, commons chunk config
- `postcss-tasks/` → Critical CSS split configuration

**Theme Structure**
- `layout/theme.liquid` → Main layout file
- `sections/*.liquid` → OS 2.0 sections with JSON schema
- `snippets/*.liquid` → Reusable components (no schema)
- `templates/*.liquid` → Page-level templates

**Asset Organization**
- `assets/` → Compiled CSS/JS output (Webpack generates) + monolithic BF25 files
- `src/styles/main.css` → Main stylesheet entry
- `src/scripts/lib/` → Shared utilities (utils.js, dom.js, components.js, lazy-load.js)
- `src/modules/` → Individual component modules

### Black Friday 2025 (BF25) System Architecture

**Tier System Implementation**
```javascript
// Centralized tier configuration (duplicated across files)
const BF25_TIERS = [
  { id: 0, min: 0, max: 3, discount: "50%", color: "#6b7280" },    // Gray
  { id: 1, min: 4, max: 7, discount: "60%", color: "#60c655" },    // Green
  { id: 2, min: 8, max: 11, discount: "70%", color: "#60c655" },   // Green
  { id: 3, min: 12, max: 15, discount: "80%", color: "#FFD700" },  // Gold
  { id: 4, min: 16, max: 999, discount: "85%", color: "#E0F7FF" }  // Platinum
];
```

**Progress Bar - DOM-Based Segments**
- 16 real HTML elements (not CSS percentage)
- Individual segment control: `segment.classList.add('is-filled')`
- Enables discrete animations and accessibility
- Design system: `BF25_PROGRESS_BAR_DESIGN_SYSTEM.md`

**Dynamic Theming via CSS Custom Properties**
```javascript
// JavaScript sets tier colors
section.style.setProperty('--color-tier-current', tierColor);
section.style.setProperty('--pb-glow-color', tierGlow);

// CSS consumes variables
.is-reached { color: var(--color-tier-current); }
```

**Currency Conversion Pattern**
- Base prices stored in EUR cents
- Client-side conversion using multiple sources (Shopify Currency API, data attributes, fallbacks)
- Enables static HTML with dynamic currency display

**State Management**
- LocalStorage: 24-hour cart persistence
- SessionStorage: Checkout flow flags (prevents Rebuy interference)
- Global window properties: Cross-file coordination
- Observer pattern for modal state (explicit listeners vs Proxy)

**Key BF25 Files**
- `assets/bogo-builder.js` → Main bundle builder (8k lines, monolithic)
- `assets/bf25-tier-cart.js` → Sticky cart with tier progression
- `assets/bf25-hero.js` → Interactive hero slider
- `assets/bf25-expansion-core.js` → Modal expansion system
- `assets/bf25-tier-pricing.js` → Dynamic upsell pricing
- `sections/section-bundle-builder-bf25.liquid` → Main BF25 section
- `sections/bf25-hero-split.liquid` → Hero section with progress bar

## Critical Development Patterns

### Performance Requirements
- **Core Web Vitals targets**: LCP <2.5s, FID <100ms, CLS <0.1
- **Mobile-first**: 70% mobile traffic
- **Server-side rendering**: Use Liquid over client JavaScript
- **Image optimization**: Shopify CDN with responsive srcset
- **Script loading**: Defer/async non-critical JS
- **Critical CSS**: Inline above-fold styles in `<head>`

### Liquid Development

**Server-Side First Principle**
- Render HTML with Liquid on server
- JavaScript only for interactivity (not rendering content)
- Use Shopify filters: `money`, `image_url`, `asset_url`, `url_encode`

**Schema Best Practices**
- Section schemas in `{% schema %}` blocks
- Match visual hierarchy (top→bottom, left→right)
- Group related settings with headings
- Max 2 levels of conditional settings

### CSS Architecture

**BEM Naming Convention**
```css
.block { }                    /* Component */
.block__element { }           /* Child element */
.block--modifier { }          /* Variant */
```

**Specificity Rules**
- Target: `0 1 0` (single class)
- Maximum: `0 4 0` (parent/child)
- Never use IDs as selectors
- Avoid `!important` (comment if necessary)

**Tailwind + Custom CSS**
- Use Tailwind utilities for common patterns
- Use `@apply` for reusable component classes
- Custom CSS for complex components

**Mobile-First Media Queries**
```css
/* Default: mobile */
.grid { display: grid; grid-template-columns: 1fr; }

/* Tablet and up */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

### JavaScript Patterns

**Class-Based Components**
```javascript
class ComponentName {
  constructor(element) {
    this.element = element;
    this.#init();
  }

  // Private methods (prefix with #)
  #init() {
    this.element.addEventListener('click', this.#handleClick.bind(this));
  }

  #handleClick(event) {
    // Event handling
  }
}

// Auto-initialization via initComponent
document.querySelectorAll('[data-component="component-name"]')
  .forEach(el => new ComponentName(el));
```

**Shopify Ajax API Patterns**
```javascript
// Add to cart
await fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: variantId, quantity: 1 })
});

// Get cart state
const cart = await fetch('/cart.js').then(r => r.json());

// Update cart item
await fetch('/cart/change.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ line: lineNumber, quantity: newQuantity })
});

// Section rendering (update HTML without reload)
const response = await fetch(`/?sections=${sectionId}`);
```

**ES6+ Standards**
- Use `const` over `let`, never `var`
- Prefer `for (const item of items)` over `forEach()`
- Async/await over promise chains
- Zero external dependencies (use native browser features)

### Accessibility Requirements

**WCAG 2.2 AA Compliance**
- Color contrast: 4.5:1 for text
- Touch targets: 44x44px minimum on mobile
- Keyboard navigation: All interactive elements focusable
- Tab order: Only use `tabindex="0"`, avoid hijacking
- ARIA labels: For icons and non-text interactive elements
- Alt text: All images must have descriptive alt

**Semantic HTML**
```html
<!-- Use native HTML features -->
<details class="accordion">
  <summary class="accordion__trigger">Title</summary>
  <div class="accordion__content">Content</div>
</details>

<!-- Semantic elements over divs -->
<article class="product-card">
  <header><h3>{{ product.title }}</h3></header>
  <figure><img src="{{ product.image | image_url }}" alt="{{ product.title }}"></figure>
</article>
```

## Creating New Components

### Section + Module Pattern

**1. Create Section File**
```bash
sections/section-<name>.liquid
```
Include at top:
```liquid
{{ 'section-<name>.css' | asset_url | stylesheet_tag }}
<script src="{{ 'section-<name>.js' | asset_url }}" defer></script>
```

**2. Create Entry Point**
```bash
src/scripts/entries/section/<name>.js
```
Content:
```javascript
import { initComponent } from '@scripts/lib/components'
import ModuleName from '@modules/<module-name>/<module-name>'

console.log('Loading section <name>')
initComponent(ModuleName, '<module-name>')
```

**3. Create Module Files**
```bash
src/modules/<module-name>/<module-name>.js   # Logic
src/modules/<module-name>/<module-name>.css  # Styles
```

In JS file:
```javascript
import './<module-name>.css'

class ModuleName {
  constructor(element) {
    this.element = element;
    this.#init();
  }

  #init() {
    // Initialization logic
  }
}

export default ModuleName
```

**4. Build**
```bash
npm run build  # Or npm run watch for development
```

Webpack auto-discovers the new entry and compiles:
- `section-<name>.js` → `assets/section-<name>.js`
- CSS imported in module → `assets/section-<name>.css`

## Important Reminders

### Code Quality Standards
From `.cursorrules`:
- Server-side first: Render with Liquid, not client JavaScript
- Performance obsessed: Maintain Core Web Vitals targets
- Mobile-first: Default to mobile breakpoints
- Semantic HTML: Use modern features (`<details>`, `<summary>`)
- Zero external dependencies: Native browser features + Shopify APIs

### Common Pitfalls to Avoid
- ❌ Client-side rendering what could be server-side
- ❌ Loading all JS on all pages (use conditional loading)
- ❌ Inline styles (use CSS variables)
- ❌ Large unoptimized images
- ❌ Complex CSS selectors (keep specificity low)
- ❌ Missing alt text on images
- ❌ Forgetting mobile breakpoints
- ❌ Modifying monolithic BF25 files without understanding dependencies

### Third-Party App Integration
- **Privia**: Popup management (lazy load when needed)
- **Rebuy**: Product recommendations (defensive blocking in BF25 checkout)
- **Currency Converter**: Multi-currency support (client-side conversion)
- Load third-party scripts async/defer to prevent blocking

### Known Technical Debt
- **Duplicated tier configurations** across multiple BF25 files
- **Monolithic JavaScript files** (bogo-builder.js ~8000 lines)
- **Global namespace pollution** (multiple window.* properties)
- **BF25 files bypass webpack** (no transpilation/minification)

## Testing & Validation

```bash
# Shopify theme validation
shopify theme check

# Performance testing
# - Google Lighthouse (target: Performance 90+, Accessibility 100)
# - Core Web Vitals in Chrome DevTools
# - Mobile performance on throttled 3G

# Browser testing
# - Chrome, Firefox, Safari (desktop + mobile)
# - iOS Safari (primary mobile browser)
```

## Additional Resources

- Design system documentation: `BF25_PROGRESS_BAR_DESIGN_SYSTEM.md`
- Cursor rules: `.cursorrules` (comprehensive Shopify + performance standards)
- Shopify docs: https://shopify.dev/themes
- Liquid reference: https://shopify.dev/docs/api/liquid