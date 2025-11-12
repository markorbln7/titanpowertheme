# Titan Power Theme - Complete Implementation Reference

**Document Version:** 1.0
**Last Updated:** November 11, 2025
**Purpose:** Training documentation for AI coding assistant to match existing theme patterns

---

## 1. DIRECTORY STRUCTURE OVERVIEW

```
titanpowertheme/
├── assets/           # Compiled CSS, JS, images (400+ files)
├── config/           # Theme settings JSON
├── layout/           # Theme wrapper (theme.liquid)
├── locales/          # Translation files
├── sections/         # Reusable page sections (200+ files)
├── snippets/         # Reusable components (150+ files)
├── templates/        # Page templates (180+ product variants)
├── src/              # Source files for webpack compilation
│   ├── modules/      # Feature-specific modules
│   └── scripts/      # JavaScript entry points
├── node_modules/     # Dependencies (Vue, Webpack, PostCSS)
├── package.json      # Build configuration
└── webpack.config.js # Asset compilation
```

### Key Organizational Patterns

1. **Sections Naming:**
   - `section-*.liquid` - Custom sections
   - Product pages: `section-pdp-hero-*.liquid` (15+ variants)
   - Collections: `section-collections-with-nav.liquid`, `section-explore.liquid`
   - Bundle builders: `byob-gold-v2.liquid`, `section-bundle-*.liquid`

2. **Product Template Proliferation:**
   - 180+ product templates for A/B testing and specific products
   - Naming: `product.{product-handle}.json` or `product.sl-{ID}.json`
   - Special templates: `product.bogof-*.json`, `product.bundle-*.json`

3. **Assets Organization:**
   - Section-specific: `section-{name}.css` + `section-{name}.js`
   - Component-specific: `component-{name}.css`
   - Product-specific overrides: `override*.js`, `pd*.js`

---

## 2. BUY BOX IMPLEMENTATION

### Primary Buy Box Location
**File:** [sections/main-product.liquid](sections/main-product.liquid:1-100)

### Core Components

#### A. Variant Selection
**Custom Element:** `variant-radios` (defined in `global.js`)

```liquid
<!-- Located in main-product.liquid blocks -->
{%- when 'variant_picker' -%}
  <variant-radios
    id="variant-radios-{{ section.id }}"
    class="product-form__input"
    data-section="{{ section.id }}"
    data-url="{{ product.url }}"
    {% if update_url == false %}
      data-update-url="false"
    {% endif %}
    {{ block.shopify_attributes }}
  >
```

**JavaScript Handler:** [assets/global.js](assets/global.js)
```javascript
class VariantRadios extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }

    publish(PUB_SUB_EVENTS.variantChange, {
      data: {
        sectionId: this.dataset.section,
        html: this.closest('section').innerHTML,
        variant: this.currentVariant
      }
    });
  }
}
```

#### B. Add to Cart
**Custom Element:** `product-form` (defined in [assets/product-form.js](assets/product-form.js:1-115))

```javascript
class ProductForm extends HTMLElement {
  onSubmitHandler(evt) {
    evt.preventDefault();

    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append('sections',
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append('sections_url', window.location.pathname);
    }

    fetch(`${routes.cart_add_url}`, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: formData
    })
    .then((response) => response.json())
    .then((response) => {
      if (!this.error) {
        publish(PUB_SUB_EVENTS.cartUpdate, {
          source: 'product-form',
          productVariantId: formData.get('id'),
          cartData: response
        });
      }
      this.cart.renderContents(response); // Ajax cart drawer
    });
  }
}
```

**Key Pattern:** Ajax-based cart using Shopify's `/cart/add.js` endpoint with section rendering.

#### C. Price Display
**Component:** [snippets/price.liquid](snippets/price.liquid)

```liquid
<div class="price
  {%- if price_class %} {{ price_class }}{% endif -%}
  {%- if available == false %} price--sold-out{% endif -%}
  {%- if compare_at_price > price and product.quantity_price_breaks_configured? != true %} price--on-sale{% endif -%}
  {%- if compare_at_price > price and product.quantity_price_breaks_configured? %} volume-pricing--sale-badge{% endif -%}
  {%- if product.price_varies == false and product.compare_at_price_varies %} price--no-compare{% endif -%}
  {%- if show_badges %} price--show-badge{% endif -%}
">
  <div class="price__container">
    <span class="price-item price-item--regular">
      {{ money_price }}
    </span>
    {%- if compare_at_price > price -%}
      <span class="price-item price-item--sale price-item--last">
        {{ compare_at_price | money }}
      </span>
    {%- endif -%}
  </div>
</div>
```

#### D. Inventory Status
Located in variant picker blocks, uses `variant.available` and `variant.inventory_quantity` from Liquid.

---

## 3. BUNDLE BUILDER IMPLEMENTATION

### Main Bundle Builder: BYOB (Build Your Own Bundle)
**File:** [sections/byob-gold-v2.liquid](sections/byob-gold-v2.liquid:1-100)
**JavaScript:** [assets/section-bundle-builder.js](assets/section-bundle-builder.js)
**CSS:** `section-bundle-builder.css`

### Bundle Architecture

#### A. Product Collection
```liquid
<div class="bundle-wrapper">
  {% for product in collections['build-your-own-bundle'].products %}
    <article class="bundle-product"
             data-product-id="{{ product.selected_or_first_available_variant.id }}"
             data-price="{{ product.price }}"
             data-title="{{ product.title }}">
      <!-- Product card with "Add to Bundle" button -->
    </article>
  {% endfor %}
</div>
```

#### B. Progress Tracker
```liquid
<div class="percent-tracker">
  {% for i in (1..10) %}
    <div class="percent-tracker__ball">
      {% if forloop.index == 5 %}<span>55</span>{% endif %}
      {% if forloop.index == 7 %}<span>65</span>{% endif %}
      {% if forloop.index == 10 %}<span>75</span>{% endif %}
    </div>
    <div class="percent-tracker__line"></div>
  {% endfor %}
</div>
```

**Purpose:** Visual indicator showing discount progression (5 items = 55%, 7 = 65%, 10 = 75%)

#### C. Bundle State Management
**Pattern:** JavaScript object tracking selected items

```javascript
// Conceptual pattern from bundle implementations
const bundleState = {
  items: [],
  totalPrice: 0,
  discountTier: 0,

  addItem(product) {
    this.items.push({
      id: product.variantId,
      title: product.title,
      price: product.price,
      quantity: 1
    });
    this.updateDiscount();
  },

  updateDiscount() {
    const itemCount = this.items.length;
    if (itemCount >= 10) this.discountTier = 0.75;
    else if (itemCount >= 7) this.discountTier = 0.65;
    else if (itemCount >= 5) this.discountTier = 0.55;
  },

  async checkout() {
    const items = this.items.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });

    window.location.href = '/cart';
  }
};
```

#### D. Gift Unlocking System
```liquid
<div class="gift-tracker">
  <div class="left-to-gift">
    <div class="js-left-to-gift">
      {{ all_products['pd'].price | money_without_trailing_zeros }}
    </div>
    <div class="left-to-gift__text">MORE</div>
  </div>
  <svg class="circle-chart">
    <circle class="circle-chart__circle"
            stroke-dashoffset="1000" />
  </svg>
</div>
```

**JavaScript:** Animates circle progress based on cart total toward next gift threshold.

---

## 4. KEY CUSTOM SECTIONS

### A. Product Detail Pages (15+ Variants)

1. **section-pdp-hero-master-light-tabs.liquid** (1,856 lines)
   - Tab-based product info
   - Custom variant selectors with swatches
   - Integrated bundle options
   - **Usage:** Main PDP for flagship products

2. **section-pdp-hero-master-light-simple.liquid** (2,100 lines)
   - Simplified layout, no tabs
   - Focus on quick add-to-cart
   - **Usage:** Accessories, lower-price items

3. **section-pdp-hero-master.liquid** (1,243 lines)
   - Original master template
   - Full feature set
   - **Usage:** Legacy products

**Common Pattern:**
```liquid
{{ 'section-pdp-hero.css' | asset_url | stylesheet_tag }}
<script src="{{ 'pdpheromasterlighttabs.js' | asset_url }}"></script>

<section class="pdp-hero">
  <div class="pdp-hero__media">
    <!-- Image gallery with Flickity slider -->
  </div>
  <div class="pdp-hero__info">
    <!-- Title, price, variant selector, ATC -->
  </div>
</section>
```

### B. Collection Display

**section-collections-with-nav.liquid**
- Navigation tabs with icons
- Product grid with popup quick-buy
- Discount badges from metafields
- **Key feature:** Buy-now popup modal (see `buy-now-popup.liquid`)

**section-explore.liquid**
- Similar to collections but with different styling
- Supports alternative product images from metafields

### C. Bundle Sections

1. **byob-gold-v2.liquid** (927 lines) - Build Your Own Bundle V2
2. **bundle-top-gold-v2.liquid** - Bundle header/hero
3. **section-bundle-variant-atc.liquid** - Variant-based bundle ATC
4. **section-bundle.liquid** - Generic bundle container

### D. Black Friday Sections

**section-bogo-black-friday.liquid** (881 lines)
- BOGO (Buy One Get One) pair builder
- Progressive discounts (1-4 pairs)
- LocalStorage state management
- Sticky checkout bar

---

## 5. JAVASCRIPT ARCHITECTURE

### A. Module System
**Build Tool:** Webpack 5
**Entry Points:** `/src/scripts/entries/section/{name}.js`
**Output:** `/assets/section-{name}.js`

**Example Entry:**
```javascript
// src/scripts/entries/section/bundle-builder.js
import { initComponent } from 'lib/components'
import BundleBuilder from 'modules/bundle-builder/bundle-builder.js'

document.addEventListener('DOMContentLoaded', () => {
  initComponent(BundleBuilder, 'BundleBuilder')
})
```

### B. Core JavaScript Files

1. **global.js** - Core utilities, VariantRadios, VariantSelects
2. **product-info.js** - ProductInfo custom element (quantity management)
3. **product-form.js** - ProductForm custom element (ATC handler)
4. **constants.js** - PubSub event constants

**PubSub Events:**
```javascript
const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  cartError: 'cart-error',
  variantChange: 'variant-change',
  quantityUpdate: 'quantity-update',
};
```

### C. Product-Specific Overrides

Pattern of override files for specific products/tests:
- `override.js`, `overridepdreversedecoy4.js`, `overridelight.js`
- `pdpherov4.js`, `pdpheronew4815.js`, `pdpherocase.js`

**Common Pattern:**
```javascript
// Variant selector change handler
variantSelectorFirst.addEventListener('change', function(e) {
  const selectedValue = e.target.value;
  updateProductInfo(selectedValue);
  updatePrice();
  updateImage();
});

function updatePrice() {
  const variant = findVariant(selectedOptions);
  document.querySelector('.js-variant-price').textContent =
    formatMoney(variant.price);
}
```

### D. Third-Party Libraries

**Included via package.json:**
- Vue 2.6.14 (used in some sections)
- Vuex 3.6.2 (state management)
- Flickity 2.2.2 (image carousels)
- Body-scroll-lock 3.1.5
- Layzr.js 2.2.0 (lazy loading)

**Loaded via CDN (in theme.liquid):**
- Swiper.js 10.x
- Rebuy Smart Cart
- Klaviyo

---

## 6. CSS ARCHITECTURE

### A. File Structure

**Base Styles:**
- `base.css` - Shopify theme base
- `main.css` - Global overrides
- `globallight.css` - Light theme variant

**Section Styles:**
- `section-{name}.css` - Section-specific styles
- `component-{name}.css` - Reusable component styles

**Product Overrides:**
- `override.css` - Global product overrides
- `pdplight.css` - Light variant styling
- `bundleoverrides.css` - Bundle-specific

### B. CSS Organization Approach

**Pattern:** Section-scoped CSS with utility classes

```css
/* section-pdp-hero.css */
.pdp-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.pdp-hero__media { /* ... */ }
.pdp-hero__info { /* ... */ }

@media (max-width: 768px) {
  .pdp-hero {
    grid-template-columns: 1fr;
  }
}
```

### C. Tailwind CSS Usage

**Loaded Conditionally:**
```liquid
{% if page.handle == 'test-sections' or page.handle == 'shop-1'
   or page.handle == 'black-friday-2024' %}
  <script src="https://cdn.tailwindcss.com"></script>
{% endif %}
```

**Used in:** BOGO builder, shop pages, newer sections

**Pattern:**
```liquid
<div class="flex items-center justify-between gap-[20px]
            md:flex-row flex-col px-[20px] py-[30px]">
```

### D. CSS Custom Properties

**Colors (from base.css):**
```css
:root {
  --color-titan-green: #60c655;
  --color-titan-greenish: #00acc1;
  --color-titan-red: #ff4444;
}
```

### E. Responsive Breakpoints

**Standard Breakpoints:**
- Mobile: < 750px
- Tablet: 750px - 989px
- Desktop: ≥ 990px
- Large desktop: ≥ 1400px

**Pattern:**
```css
@media screen and (min-width: 750px) { /* tablet */ }
@media screen and (min-width: 990px) { /* desktop */ }
```

---

## 7. METAFIELDS USAGE

### A. Custom Metafield Definitions

**Product Metafields (custom namespace):**

1. **product_description** (rich_text_field)
   - Used in: Buy-now popup, PDP hero sections
   - Purpose: Alternative product description for popups

2. **new_shop_discount** (single_line_text_field)
   - Example: "SAVE 55%"
   - Displays as badge on product cards

3. **new_shop_discount_top** (single_line_text_field)
   - Alternative discount badge (priority over new_shop_discount)

4. **new_shop_image** (file_reference)
   - Custom product image for shop pages
   - Overrides featured_image

5. **top_new_shop_image** (file_reference)
   - Alternative image when `show_alt_images` setting enabled

6. **custom_url** (url)
   - Custom link destination instead of product.url

7. **first_upsell_product** (product_reference)
   - Upsell product 1 in buy-now popup

8. **second_upsell_product** (product_reference)
   - Upsell product 2 in buy-now popup

9. **ticks** (rich_text_field)
   - Feature checkmarks/bullets
   - Rendered via metafield_tag

**Variant Metafields:**

10. **popup_image** (file_reference)
    - Custom image for variant in popup
    - Falls back to variant.image

### B. Metafield Usage Patterns

**Standard Pattern:**
```liquid
{% assign product_description =
   product.metafields.custom.product_description | metafield_tag %}

{% if product.metafields.custom.new_shop_discount_top
      and section.settings.show_alt_images == true %}
  <div class="discount_message">
    {{ product.metafields.custom.new_shop_discount_top }}
  </div>
{% else %}
  {% if product.metafields.custom.new_shop_discount %}
    <div class="discount_message">
      {{ product.metafields.custom.new_shop_discount }}
    </div>
  {% endif %}
{% endif %}
```

**Variant Image Selection:**
```liquid
{% for variant in product.variants %}
  {% if variant.metafields.custom.popup_image %}
    {% assign images = variant.metafields.custom.popup_image | img_url: 'master' %}
  {% else %}
    {% assign images = variant.image.src | img_url: 'master' %}
  {% endif %}
{% endfor %}
```

**Storing in JavaScript:**
```liquid
<script>
window.productVariants = window.productVariants || {};
window.productVariants[{{ product.id }}] = [
  {% for variant in product.variants %}
  {
    id: '{{ variant.id }}',
    options: [{% for option in variant.options %}'{{ option | escape }}'{% unless forloop.last %}, {% endunless %}{% endfor %}],
    image: '{{ images }}',
    price: '{{ variant.price | money }}',
    compare_at_price: '{{ variant.compare_at_price | money }}'
  }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
];
</script>
```

---

## 8. COMPONENT INTERCONNECTIONS

### A. Section-to-Section Communication

**PubSub Pattern:**
```javascript
// Publisher (variant selector)
publish(PUB_SUB_EVENTS.variantChange, {
  data: {
    sectionId: this.dataset.section,
    html: this.closest('section').innerHTML,
    variant: this.currentVariant
  }
});

// Subscriber (product info component)
subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
  if (event.data.sectionId !== this.dataset.section) return;
  this.updateQuantityRules(event.data.sectionId, event.data.html);
});
```

### B. Liquid-to-JavaScript Data Passing

**Pattern 1: Data Attributes**
```liquid
<product-form data-product-id="{{ product.id }}"
              data-section-id="{{ section.id }}">
```

**Pattern 2: Global Objects**
```liquid
<script>
window.theme = window.theme || {};
window.theme.product = {
  id: {{ product.id }},
  title: "{{ product.title | escape }}",
  variants: {{ product.variants | json }}
};
</script>
```

**Pattern 3: Inline Script Blocks**
```liquid
{% for product in collection.products %}
<script>
window.productVariants[{{ product.id }}] = {{ product.variants | json }};
</script>
{% endfor %}
```

### C. Cart Update Flow

```
User clicks "Add to Cart"
     ↓
product-form.onSubmitHandler()
     ↓
POST /cart/add.js with sections
     ↓
publish(PUB_SUB_EVENTS.cartUpdate)
     ↓
cart-drawer.renderContents(response)
     ↓
Updates mini cart icon count
```

### D. Variant Change Flow

```
User selects variant option
     ↓
variant-radios.onChange()
     ↓
this.updateOptions() - build selected array
     ↓
this.updateMasterId() - find matching variant
     ↓
this.updateMedia() - change main image
     ↓
this.renderProductInfo() - fetch section HTML
     ↓
publish(PUB_SUB_EVENTS.variantChange)
     ↓
Subscribers update (price, inventory, etc.)
```

---

## 9. THIRD-PARTY APP INTEGRATION

### A. Rebuy Smart Cart
**Location:** [layout/theme.liquid:89](layout/theme.liquid:89)

```liquid
<script async src="https://cdn.rebuyengine.com/onsite/js/rebuy.js?shop={{ shop.permanent_domain }}"></script>
{% render 'rebuy-smartcart-extensions' %}
```

**Purpose:**
- Smart cart drawer with upsells
- Product recommendations
- Cart modifications handled via Rebuy API

**Integration Point:** Replaces default cart drawer when enabled

### B. Klaviyo Email Marketing
**Location:** [layout/theme.liquid:91](layout/theme.liquid:91)

```liquid
<script async data-src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=HXhrVm"></script>
```

**Purpose:**
- Email capture popups
- Browse abandonment
- Back-in-stock notifications

### C. Zipify Pages (Landing Page Builder)
**Files:** Multiple `*.zipifypages.liquid` files

**Pattern:**
```liquid
{%- render 'header-scripts.zipifypages', apprxhbl: zp_apprxhbl, renderctx: 'thm' -%}
{%- render 'page-footer.zipifypages', renderctx: 'thm', ocuapp: oneclickupsellapp -%}
```

**Templates:**
- `product.zipifypages-*.json` (50+ variants)
- `page.zipifypages.json`
- Allows visual page building with custom sections

### D. Shoplift (Anti-Fraud)
**Location:** [layout/theme.liquid:8-10](layout/theme.liquid:8-10)

```liquid
<!-- Start of Shoplift scripts -->
{% render 'shoplift' %}
<!-- End of Shoplift scripts -->
```

### E. Loox Reviews
**Snippet:** `loox-all-reviews.liquid`
**Page:** `page.loox-all-reviews.liquid`

**Integration:** Reviews widget on product pages

### F. Custom Integrations in Snippets

- `additional-third-party-scripts.liquid` - Centralized third-party loader
- `footer-scripts.liquid` - Additional tracking scripts
- `gsf-conversion-pixels.liquid` - Conversion tracking

---

## 10. CRITICAL CODE PATTERNS

### A. Variant Selection Code (Complete Example)

**Liquid Setup:**
```liquid
<!-- In section file -->
<variant-radios
  id="variant-radios-{{ section.id }}"
  data-section="{{ section.id }}"
  data-url="{{ product.url }}">

  {% for option in product.options_with_values %}
    <fieldset class="variant-radios__group">
      <legend>{{ option.name }}</legend>
      {% for value in option.values %}
        <input type="radio"
               id="{{ section.id }}-{{ option.position }}-{{ forloop.index0 }}"
               name="{{ option.name }}"
               value="{{ value | escape }}"
               form="{{ product_form_id }}"
               {% if option.selected_value == value %}checked{% endif %}>
        <label for="{{ section.id }}-{{ option.position }}-{{ forloop.index0 }}">
          {{ value }}
        </label>
      {% endfor %}
    </fieldset>
  {% endfor %}

  <script type="application/json">
    {{ product.variants | json }}
  </script>
</variant-radios>
```

**JavaScript (from global.js):**
```javascript
class VariantRadios extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
    this.variantData = JSON.parse(
      this.querySelector('[type="application/json"]').textContent
    );
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();

    if (!this.currentVariant) {
      this.setUnavailable();
      return;
    }

    this.updateURL();
    this.updateVariantInput();
    this.renderProductInfo();

    publish(PUB_SUB_EVENTS.variantChange, {
      data: {
        sectionId: this.dataset.section,
        variant: this.currentVariant
      }
    });
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll('input[type="radio"]:checked'),
      (input) => input.value
    );
  }

  updateMasterId() {
    this.currentVariant = this.variantData.find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const destination = document.getElementById(`price-${this.dataset.section}`);
        const source = html.getElementById(`price-${this.dataset.section}`);
        if (source && destination) destination.innerHTML = source.innerHTML;
      });
  }
}

customElements.define('variant-radios', VariantRadios);
```

### B. Add-to-Cart Code (Complete Example)

**Liquid Form:**
```liquid
<product-form data-hide-errors="false">
  <form method="post"
        action="/cart/add"
        id="product-form-{{ section.id }}"
        accept-charset="UTF-8"
        enctype="multipart/form-data">

    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">

    <quantity-input class="quantity">
      <button class="quantity__button" name="minus" type="button">-</button>
      <input class="quantity__input" type="number" name="quantity" value="1" min="1">
      <button class="quantity__button" name="plus" type="button">+</button>
    </quantity-input>

    <button type="submit" name="add">
      <span>Add to cart</span>
      <div class="loading-overlay__spinner hidden">
        <svg><!-- spinner --></svg>
      </div>
    </button>
  </form>
</product-form>
```

**JavaScript (product-form.js):**
```javascript
class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cart = document.querySelector('cart-drawer');
    this.submitButton = this.querySelector('[type="submit"]');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();

    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.classList.add('loading');
    this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

    const formData = new FormData(this.form);

    // Request cart sections to update
    if (this.cart) {
      formData.append('sections', this.cart.getSectionsToRender().map(s => s.id));
      formData.append('sections_url', window.location.pathname);
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: formData
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        // Error handling
        publish(PUB_SUB_EVENTS.cartError, {
          source: 'product-form',
          productVariantId: formData.get('id'),
          errors: response.description
        });
        return;
      }

      // Success
      publish(PUB_SUB_EVENTS.cartUpdate, {
        source: 'product-form',
        productVariantId: formData.get('id'),
        cartData: response
      });

      this.cart.renderContents(response);
    })
    .finally(() => {
      this.submitButton.classList.remove('loading');
      this.submitButton.removeAttribute('aria-disabled');
      this.querySelector('.loading-overlay__spinner').classList.add('hidden');
    });
  }
}

customElements.define('product-form', ProductForm);
```

### C. Price Update Code

**Liquid Price Component:**
```liquid
<!-- snippets/price.liquid -->
<div class="price {% if compare_at_price > price %}price--on-sale{% endif %}">
  <div class="price__container">
    <div class="price__regular">
      <span class="visually-hidden">{{ 'products.product.price.regular_price' | t }}</span>
      <span class="price-item price-item--regular">
        {{ price | money_with_currency }}
      </span>
    </div>

    {%- if compare_at_price > price -%}
      <div class="price__sale">
        <span class="visually-hidden">{{ 'products.product.price.sale_price' | t }}</span>
        <span class="price-item price-item--sale price-item--last">
          {{ compare_at_price | money_with_currency }}
        </span>
      </div>

      <div class="unit-price">
        <span>You save {{ compare_at_price | minus: price | money_with_currency }}</span>
      </div>
    {%- endif -%}
  </div>
</div>
```

**JavaScript Price Update (variant change):**
```javascript
// In variant change handler
renderProductInfo() {
  const variantId = this.currentVariant.id;
  const sectionId = this.dataset.section;

  fetch(`${this.dataset.url}?variant=${variantId}&section_id=${sectionId}`)
    .then(response => response.text())
    .then(responseText => {
      const html = new DOMParser().parseFromString(responseText, 'text/html');

      // Update price
      const priceDestination = document.getElementById(`price-${sectionId}`);
      const priceSource = html.getElementById(`price-${sectionId}`);
      if (priceSource && priceDestination) {
        priceDestination.innerHTML = priceSource.innerHTML;
      }

      // Update SKU
      const skuDestination = document.getElementById(`sku-${sectionId}`);
      const skuSource = html.getElementById(`sku-${sectionId}`);
      if (skuSource && skuDestination) {
        skuDestination.innerHTML = skuSource.innerHTML;
      }

      // Update inventory
      const inventoryDestination = document.getElementById(`inventory-${sectionId}`);
      const inventorySource = html.getElementById(`inventory-${sectionId}`);
      if (inventorySource && inventoryDestination) {
        inventoryDestination.innerHTML = inventorySource.innerHTML;
      }
    });
}
```

### D. Custom Liquid Patterns Worth Noting

**1. Conditional Asset Loading:**
```liquid
{% if page.handle == 'black-friday-2024' %}
  <script src="https://cdn.tailwindcss.com"></script>
  {{ 'section-bf.css' | asset_url | stylesheet_tag }}
  {{ 'section-bf.js' | asset_url | script_tag }}
{% endif %}
```

**2. Product Loop with Metafield Fallbacks:**
```liquid
{% for product in collection.products %}
  {% if product.metafields.custom.new_shop_image %}
    {% assign product_image = product.metafields.custom.new_shop_image %}
  {% else %}
    {% assign product_image = product.featured_image %}
  {% endif %}

  <img src="{{ product_image | image_url: width: 500 }}" alt="{{ product.title }}">
{% endfor %}
```

**3. Variant Data JSON Embedding:**
```liquid
<script>
window.productVariants = window.productVariants || {};
window.productVariants[{{ product.id }}] = [
  {% for variant in product.variants %}
  {
    id: '{{ variant.id }}',
    options: [
      {% for option in variant.options %}
      '{{ option | escape }}'{% unless forloop.last %}, {% endunless %}
      {% endfor %}
    ],
    price: {{ variant.price }},
    compare_at_price: {{ variant.compare_at_price | default: 0 }},
    available: {{ variant.available | json }},
    featured_image: '{{ variant.featured_image.src | image_url: width: 800 }}'
  }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
];
</script>
```

**4. Section Settings with Defaults:**
```liquid
{% assign heading = section.settings.heading | default: "Default Heading" %}
{% assign show_badges = section.settings.show_badges | default: true %}
```

---

## 11. POTENTIAL ISSUES / TECH DEBT

### A. Template Proliferation
**Issue:** 180+ product templates created for A/B testing
**Impact:**
- Difficult to maintain consistency
- Changes must be replicated across many files
- Performance impact (theme file size)

**Recommendation:** Consolidate to 5-10 base templates using dynamic sections

### B. Duplicate JavaScript Patterns
**Issue:** Multiple files with similar variant selection logic (override*.js, pd*.js)
**Impact:** Bug fixes must be applied in multiple places

**Examples:**
- `override.js`, `overridelight.js`, `overridepack.js`
- `pdpherov4.js`, `pdpheronew4815.js`, `pdpherocase.js`

**Recommendation:** Create shared module for variant selection logic

### C. Inconsistent CSS Methodology
**Issue:** Mix of BEM-like naming, utility classes, and Tailwind
**Examples:**
```css
/* BEM-style */
.bundle-wrapper__buttonAdd { }

/* Utility-like */
.f { display: flex; }
.aic { align-items: center; }

/* Tailwind (loaded conditionally) */
class="flex items-center gap-[20px]"
```

**Impact:** Harder to maintain, potential class name conflicts

**Recommendation:** Standardize on one methodology (suggest Tailwind for new sections)

### D. Global Namespace Pollution
**Issue:** Multiple global objects/variables
```javascript
window.theme = { /* ... */ }
window.productVariants = { /* ... */ }
window.bundleState = { /* ... */ }
```

**Recommendation:** Namespace under single object: `window.TitanTheme = {}`

### E. Metafield Dependency
**Issue:** Heavy reliance on metafields for critical UI elements
**Impact:**
- Breaks if metafields not set
- No validation in theme code
- Hard to debug missing content

**Example:**
```liquid
{% if product.metafields.custom.new_shop_discount_top %}
  <!-- Show badge -->
{% endif %}
```

**Recommendation:** Add default fallbacks and validation

### F. Performance Concerns

1. **Synchronous Script Loading:**
   ```liquid
   {{ 'main.js' | asset_url | script_tag }}
   <!-- Blocks rendering -->
   ```
   **Fix:** Use `defer` attribute

2. **Large Section Files:**
   - `section-pdp-hero-master-light-tabs.liquid` (1,856 lines)
   - Makes theme editor slow
   - **Fix:** Break into smaller snippets

3. **Unoptimized Images:**
   - Many hardcoded CDN URLs
   - Not using Shopify's image optimization
   - **Fix:** Use `image_url` filter with size parameters

### G. Deprecated Patterns

1. **img_url Filter (deprecated):**
   ```liquid
   {{ product.image | img_url: 'master' }}
   ```
   **Should be:**
   ```liquid
   {{ product.image | image_url: width: 800 }}
   ```

2. **money Filter (no currency):**
   ```liquid
   {{ product.price | money }}
   ```
   **Should be:**
   ```liquid
   {{ product.price | money_with_currency }}
   ```

---

## 12. CONSUMER ELECTRONICS SPECIFIC CUSTOMIZATIONS

### A. Technical Specifications Display
**Pattern:** Rich text metafield rendered as table

```liquid
<!-- In PDP sections -->
<div class="product-specs">
  {{ product.metafields.custom.technical_specs | metafield_tag }}
</div>
```

**Metafield Type:** `rich_text_field` with HTML table

### B. Warranty Information
**Pattern:** Prominent "Lifetime Warranty" badges

```liquid
<div class="warranty-badge">
  <img src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/warranty-icon.png">
  <span>Lifetime Warranty</span>
</div>
```

**Location:** Product cards, buy boxes, footer sections

### C. Cable Compatibility Matrix
**Pattern:** Visual grid showing device compatibility

**Sections:** `compare-table-cable.liquid`, `compare-table-cable-pro.liquid`

```liquid
<table class="compare-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Titan Cable</th>
      <th>Titan Cable Pro</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>iPhone Compatible</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

### D. Power Output Specifications
**Pattern:** Wattage prominently displayed

```liquid
<div class="power-specs">
  <span class="power-number">100</span>
  <span class="power-unit">W</span>
  <span class="power-label">Max Output</span>
</div>
```

### E. Cable Length Variants
**Pattern:** Length as first variant option

```liquid
{% for option in product.options_with_values %}
  {% if option.name == 'Length' %}
    <div class="length-selector">
      {% for value in option.values %}
        <button class="length-option" data-length="{{ value }}">
          {{ value }}
        </button>
      {% endfor %}
    </div>
  {% endif %}
{% endfor %}
```

### F. Charging Speed Highlights
**Common Copy:** "Charge 50% in 20 minutes", "Fast charge all devices"

**Pattern:** Icon + text feature blocks

```liquid
<div class="features-grid">
  <div class="feature">
    <img src="lightning-icon.png">
    <h4>Fast Charging</h4>
    <p>50% charge in 20 minutes</p>
  </div>
  <!-- ... -->
</div>
```

### G. Multi-Device Support
**Pattern:** "Works with iPhone, Android, iPad, MacBook"

**Visual:** Device icons in grid

```liquid
<div class="compatible-devices">
  {% for device in section.blocks %}
    <div class="device-icon">
      <img src="{{ device.settings.icon | image_url }}">
      <span>{{ device.settings.device_name }}</span>
    </div>
  {% endfor %}
</div>
```

---

## 13. BUILD & DEPLOYMENT

### A. Build System
**Tool:** Webpack 5
**Config:** [webpack.config.js](webpack.config.js)

**Key Scripts (package.json):**
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "watch": "webpack --mode development --watch",
    "deploy": "shopify theme push"
  }
}
```

**PostCSS Processing:**
- Autoprefixer
- CSS Nano (minification)
- PostCSS Preset Env (modern CSS features)
- PostCSS Nested (SCSS-like nesting)

### B. Asset Compilation
**Source:** `/src/` → **Output:** `/assets/`

**Entry Points:**
```javascript
// webpack.config.js (simplified)
entry: {
  'section-bundle-builder': './src/scripts/entries/section/bundle-builder.js',
  'section-pdp-hero': './src/scripts/entries/section/pdp-hero.js',
  // ... 30+ entries
}
```

### C. Shopify CLI Workflow
```bash
# Development
shopify theme dev

# Push to theme
shopify theme push

# Pull from theme
shopify theme pull
```

---

## 14. QUICK REFERENCE: COMMON TASKS

### A. Add New Product Section
1. Create `sections/section-{name}.liquid`
2. Create `src/modules/{name}/{name}.js` and `{name}.css`
3. Create entry: `src/scripts/entries/section/{name}.js`
4. Run `npm run build`
5. Add schema to section file

### B. Add Product Metafield
1. Define in Shopify Admin → Settings → Custom Data
2. Use in Liquid: `{{ product.metafields.custom.{field_name} }}`
3. Pass to JS if needed via data attribute

### C. Create Bundle Variant
1. Duplicate `byob-gold-v2.liquid` → `byob-{name}.liquid`
2. Update collection handle in Liquid
3. Modify discount tier logic in inline `<script>`
4. Update CSS class names if needed

### D. Add Variant Selector
1. Use `<variant-radios>` custom element (preferred)
2. Or create custom selector with change listener
3. Call `publish(PUB_SUB_EVENTS.variantChange, data)`
4. Update price via section rendering

---

## 15. CODING STYLE GUIDE

### A. Liquid Formatting
```liquid
{%- comment -%}
  Use dash trim for clean HTML output
{%- endcomment -%}

{%- liquid
  assign price = product.price
  assign compare_price = product.compare_at_price
  assign on_sale = false
  if compare_price > price
    assign on_sale = true
  endif
-%}

<div class="price {% if on_sale %}price--on-sale{% endif %}">
  {{ price | money_with_currency }}
</div>
```

### B. JavaScript Formatting
```javascript
// Use Web Components for interactive elements
class ProductWidget extends HTMLElement {
  constructor() {
    super();
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.querySelector('button').addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    event.preventDefault();
    // Logic here
  }
}

customElements.define('product-widget', ProductWidget);
```

### C. CSS Formatting
```css
/* BEM-style for components */
.product-card { }
.product-card__image { }
.product-card__title { }
.product-card--featured { }

/* Mobile-first responsive */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 750px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 990px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 16. SUMMARY: KEY TAKEAWAYS FOR AI ASSISTANT

### When Building New Features:

1. **Use Custom Elements** for interactive components (follow `product-form.js` pattern)
2. **Use PubSub Events** for component communication (see `constants.js`)
3. **Ajax Cart Pattern** - Always use `/cart/add.js` with section rendering
4. **Metafields First** - Check for custom metafields before hardcoding content
5. **Mobile-First CSS** - Start with mobile layout, add desktop breakpoints
6. **Tailwind on New Sections** - Use Tailwind for utility styling on new sections
7. **Defer JavaScript** - Always use `defer` attribute on script tags
8. **Image Optimization** - Use `image_url` filter with width parameter
9. **Section Scoped IDs** - Use `{{ section.id }}` in all ID attributes
10. **Test with Variants** - All products have variants, even if just "Default"

### File Naming Conventions:
- Sections: `section-{name}.liquid` or `{feature}.liquid`
- Assets: `section-{name}.js`, `section-{name}.css`
- Snippets: `{name}.liquid` (kebab-case)
- Templates: `{type}.{suffix}.json`

### Common Gotchas:
- Don't use `img_url` (deprecated), use `image_url`
- Always check `variant.available` before allowing add-to-cart
- Cart drawer may be Rebuy, check for `cart-drawer` element
- Metafields may not exist, always provide fallback
- Product URLs may be custom via metafield

---

**End of Documentation**

This document should be updated as the theme evolves. Last review: November 11, 2025.
