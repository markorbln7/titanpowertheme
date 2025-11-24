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

**Webpack Entry Point System**
- Auto-discovers entry files from `src/scripts/entries/`
- Main entry: `src/scripts/entries/main.js` → includes `src/styles/main.css`
- Section entries: `src/scripts/entries/section/*.js` → compiles to `section-*.js`
- Naming convention: `section-<name>.js` entry → `section-<name>.js` + `section-<name>.css` output

**CSS Pipeline (PostCSS)**
- Main CSS: `src/styles/main.css` → compiled via webpack
- Critical CSS split: `postcss-critical-split` → outputs `snippets/main-critical-css.liquid`
- PostCSS plugins: autoprefixer, cssnano, postcss-mixins, postcss-preset-env

**Asset Output**
- All compiled assets → `assets/` directory
- Filenames include cache-busting: `[name].js?v=[timestamp]`

### File Structure Pattern

**Sections (Shopify OS 2.0)**
```
sections/section-<name>.liquid    → Liquid template with {% schema %}
src/scripts/entries/section/<name>.js    → Entry point
src/modules/<module-name>/<module-name>.js    → Module logic
src/modules/<module-name>/<module-name>.css   → Module styles
```

**Module Initialization Pattern**
```javascript
// Entry file: src/scripts/entries/section/<name>.js
import { initComponent } from '@scripts/lib/components'
import ModuleName from '@modules/<module-name>/<module-name>'

initComponent(ModuleName, 'module-name')  // Class-based component
// OR
initVueComponent(VueComponent, 'ComponentName', 'component-name')  // Vue component
```

**Component Registration**
- `initComponent(Class, selector)` → finds elements with data-component="selector" and instantiates
- `initVueComponent(Component, name, selector)` → mounts Vue component to data-component="selector"

### Key Files

**Build Configuration**
- `webpack.config.js` → Main build config, auto-scans src/scripts/entries/
- `postcss-tasks/` → Critical CSS split configuration

**Theme Structure**
- `layout/theme.liquid` → Main layout file
- `sections/*.liquid` → OS 2.0 sections with JSON schema
- `snippets/*.liquid` → Reusable components (no schema)
- `templates/*.liquid` → Page-level templates

**Asset Organization**
- `assets/` → Compiled CSS/JS output (Webpack generates)
- `src/styles/main.css` → Main stylesheet entry
- `src/scripts/lib/` → Shared utilities (utils.js, dom.js, components.js, lazy-load.js)
- `src/modules/` → Individual component modules

### Black Friday 2025 (BF25) Features

**BF25 Hero Section** (`sections/section-bf25-hero.liquid`)
- Interactive progress bar with tier-based discounts
- DOM-based segment filling (16 segments)
- Tier theming system (gray → green → gold → platinum)
- JavaScript: `assets/bf25-hero.js` (PowerSlider class)
- CSS: `assets/bf25-hero.css` (animations, tier theming)
- Design system documented in: `BF25_PROGRESS_BAR_DESIGN_SYSTEM.md`

**BF25 Bundle Builder** (`sections/section-bundle-builder-bf25.liquid`)
- Dark mode product grid
- Mobile: 2-column layout (below 640px)
- Desktop: 4-column → 3-column → 2-column responsive
- CSS: `assets/section-bundle-builder-bf25.css`
- JavaScript: `assets/bogo-builder.js`, `assets/bf25-expansion-core.js`

**BF25 Modal System**
- White background modal for product quick-view
- Black text on white (comprehensive color overrides)
- Z-index management to prevent overlay issues
- Data attribute: `data-section="bf25"` for scoping

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

## Tier System Architecture (BF25)

### Tier Configuration
```javascript
// 5 tiers: 0 (gray), 1-2 (green), 3 (gold), 4 (platinum)
const tiers = [
  { id: 0, min: 0, max: 3, color: '#6b7280' },      // Gray
  { id: 1, min: 4, max: 7, color: '#60c655' },      // Green
  { id: 2, min: 8, max: 11, color: '#60c655' },     // Green (brighter)
  { id: 3, min: 12, max: 15, color: '#FFD700' },    // Gold
  { id: 4, min: 16, max: 999, color: '#E0F7FF' }    // Platinum/Ice Blue
];
```

### Dynamic CSS Variables
```javascript
// Set by JavaScript based on current tier
section.style.setProperty('--color-tier-current', tierColor);
section.style.setProperty('--pb-glow-color', tierGlow);
section.style.setProperty('--color-tier-glow', tierBrightColor);
```

### Tier Theming
- All reached checkpoints/labels match current tier color
- Benefits list icons match current tier color
- Card border and glow effects use tier color
- Progress bar segments fill with animated tier gradient

### Discrete Segment Filling
```javascript
// DOM-based approach (16 real HTML elements)
segments.forEach((segment, index) => {
  if (index < currentValue) {
    segment.classList.add('is-filled');
  } else {
    segment.classList.remove('is-filled');
  }
});
```

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

### Third-Party App Integration
- **Privia**: Popup management (lazy load when needed)
- **Rebuy**: Product recommendations
- **Currency Converter**: Multi-currency support
- Load third-party scripts async/defer to prevent blocking

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
