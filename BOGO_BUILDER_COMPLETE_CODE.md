# BOGO Builder - Complete Code Documentation

**Session**: Black Friday 2025 BOGO Builder Development
**Date**: 2025-11-13
**Purpose**: Complete extraction of all BOGO Builder code for documentation and future development

---

## Table of Contents

1. [Main Section File](#1-main-section-file)
2. [Modal Snippet](#2-modal-snippet)
3. [CSS - Modal Section](#3-css---modal-section)
4. [CSS - Sticky Cart Section](#4-css---sticky-cart-section)
5. [JavaScript - Rebuy Prevention](#5-javascript---rebuy-prevention)
6. [JavaScript - Modal Functions](#6-javascript---modal-functions)
7. [JavaScript - Sticky Cart Functions](#7-javascript---sticky-cart-functions)
8. [JavaScript - Checkout Function](#8-javascript---checkout-function)
9. [JavaScript - Initialization Code](#9-javascript---initialization-code)
10. [Key Constants & Configuration](#10-key-constants--configuration)

---

## 1. Main Section File

**File**: `sections/bogo-builder-2024.liquid`
**Purpose**: Main BOGO Builder section containing all HTML structure, product rendering, tier cards, and sticky cart
**Lines**: 773 total

### Key Features:
- Shopify section with customizable settings (heading, timer, collections)
- Starfield canvas background animation
- Hero section with countdown timer
- Live activity indicator (scroll-triggered)
- Tier cards with progressive benefits
- Product grid with "Add to BOGO Pair" buttons
- Review modal integration
- Sticky cart bar (simple working version)

### Complete Code:

```liquid
{% comment %}
  BOGO Builder 2024 - Black Friday Promotion
  Complete feature with modal, sticky cart, tier system
{% endcomment %}

<style>
  .bogo-section-2024 {
    position: relative;
    background: #000000;
    overflow: hidden;
    min-height: 100vh;
  }
</style>

<!-- Starfield Background -->
<canvas id="starfield-canvas-full"></canvas>

<div class="bogo-section-2024" id="shopify-section-{{ section.id }}">
  <div class="bogo-container">

    <!-- HERO SECTION -->
    <div class="bogo-hero">
      <div class="bogo-hero__content">
        <h1 class="bogo-hero__title">
          {{ section.settings.heading | default: "Black Friday BOGO Builder" }}
        </h1>

        {% if section.settings.show_timer %}
        <div class="bogo-timer" id="bogo-countdown-timer">
          <div class="timer-group">
            <span class="timer-value" id="timer-days">00</span>
            <span class="timer-label">Days</span>
          </div>
          <div class="timer-divider">:</div>
          <div class="timer-group">
            <span class="timer-value" id="timer-hours">00</span>
            <span class="timer-label">Hours</span>
          </div>
          <div class="timer-divider">:</div>
          <div class="timer-group">
            <span class="timer-value" id="timer-minutes">00</span>
            <span class="timer-label">Minutes</span>
          </div>
          <div class="timer-divider">:</div>
          <div class="timer-group">
            <span class="timer-value" id="timer-seconds">00</span>
            <span class="timer-label">Seconds</span>
          </div>
        </div>
        {% endif %}
      </div>
    </div>

    <!-- LIVE ACTIVITY INDICATOR (Scroll-triggered) -->
    <div class="live-activity-indicator">
      <span class="live-pulse"></span>
      <span class="live-text">🔥 127 people building BOGOs right now</span>
    </div>

    <!-- COUNTER CONTENT (Scroll anchor) -->
    <div class="counter-content">
      <div class="counter-stat">
        <span class="counter-number">2,847</span>
        <span class="counter-label">BOGOs Built Today</span>
      </div>
    </div>

    <!-- TIER CARDS -->
    <div class="bogo-tiers">
      <div class="tier-card" data-tier="1">
        <div class="tier-badge">Tier 1</div>
        <h3 class="tier-title">Build 1 Pair</h3>
        <ul class="tier-benefits">
          <li>✓ Buy 1 Get 1 FREE</li>
          <li>✓ Mix & Match Any Products</li>
          <li>✓ Free Shipping Over €50</li>
        </ul>
        <div class="tier-discount">50% OFF Second Item</div>
      </div>

      <div class="tier-card tier-card--featured" data-tier="2">
        <div class="tier-badge tier-badge--featured">Tier 2 - Popular</div>
        <h3 class="tier-title">Build 2 Pairs</h3>
        <ul class="tier-benefits">
          <li>✓ Everything in Tier 1</li>
          <li>✓ Extra 5% OFF Total Order</li>
          <li>✓ Priority Processing</li>
        </ul>
        <div class="tier-discount">55% Total Savings</div>
      </div>

      <div class="tier-card" data-tier="3">
        <div class="tier-badge tier-badge--premium">Tier 3 - Best Value</div>
        <h3 class="tier-title">Build 3+ Pairs</h3>
        <ul class="tier-benefits">
          <li>✓ Everything in Tier 2</li>
          <li>✓ Extra 10% OFF Total Order</li>
          <li>✓ FREE Titan Smart Cable</li>
        </ul>
        <div class="tier-discount">60% Total Savings + Gift</div>
      </div>
    </div>

    <!-- PRODUCT GRID -->
    <div class="bogo-products-grid">
      {% for collection_block in section.blocks %}
        {% if collection_block.type == 'collection' %}
          {% assign collection = collections[collection_block.settings.collection] %}

          {% if collection and collection.products.size > 0 %}
            {% for product in collection.products limit: collection_block.settings.products_limit %}
              <div class="bogo-product-card" data-product-id="{{ product.id }}">

                <!-- Product Image -->
                <div class="bogo-product-card__image-wrapper">
                  {% if product.featured_image %}
                    <img
                      src="{{ product.featured_image | image_url: width: 400 }}"
                      alt="{{ product.title | escape }}"
                      class="bogo-product-card__image"
                      loading="lazy"
                    >
                  {% else %}
                    <div class="bogo-product-card__image-placeholder">
                      {{ 'product-1' | placeholder_svg_tag }}
                    </div>
                  {% endif %}

                  {% if product.compare_at_price > product.price %}
                    <div class="bogo-product-card__badge">
                      -{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price }}%
                    </div>
                  {% endif %}
                </div>

                <!-- Product Info -->
                <div class="bogo-product-card__info">
                  <h3 class="bogo-product-card__title">
                    <a href="{{ product.url }}">{{ product.title }}</a>
                  </h3>

                  <div class="bogo-product-card__price">
                    <span class="price">{{ product.price | money }}</span>
                    {% if product.compare_at_price > product.price %}
                      <span class="compare-price">{{ product.compare_at_price | money }}</span>
                    {% endif %}
                  </div>

                  <!-- Reviews -->
                  {% if product.metafields.reviews.rating.value %}
                    <div class="bogo-product-card__reviews">
                      <span class="rating-stars">
                        {% assign rating = product.metafields.reviews.rating.value %}
                        {% for i in (1..5) %}
                          {% if i <= rating %}
                            <span class="star filled">★</span>
                          {% else %}
                            <span class="star">★</span>
                          {% endif %}
                        {% endfor %}
                      </span>
                      <span class="rating-count">
                        ({{ product.metafields.reviews.rating_count.value | default: 0 }})
                      </span>
                    </div>
                  {% endif %}

                  <!-- Add to BOGO Button -->
                  <button
                    class="bogo-product-card__atc"
                    data-product-id="{{ product.id }}"
                    data-product-url="{{ product.url }}"
                    onclick="openProductModal('{{ product.url }}')"
                  >
                    Add to BOGO Pair
                  </button>
                </div>
              </div>
            {% endfor %}
          {% endif %}
        {% endif %}
      {% endfor %}
    </div>

    <!-- STICKY CART (Simple Working Version) -->
    <div class="bogo-sticky-cart" style="display: none;">
      <div class="bogo-sticky-cart__inner">
        <div class="bogo-sticky-cart__left">
          <div class="bogo-sticky-cart__title">🎁 BOGO Builder</div>
          <div class="bogo-sticky-cart__status" id="sticky-cart-status">
            Select 2 products to start
          </div>
        </div>
        <div class="bogo-sticky-cart__center">
          <div class="bogo-sticky-cart__pairs" id="sticky-cart-pair-count">
            0 Pairs
          </div>
        </div>
        <div class="bogo-sticky-cart__right">
          <div class="bogo-sticky-cart__savings">
            <span class="bogo-sticky-cart__savings-label">SAVED:</span>
            <span class="bogo-sticky-cart__savings-amount" id="sticky-cart-savings">€0,00</span>
          </div>
          <div class="bogo-sticky-cart__actions">
            <button id="sticky-cart-review" class="bogo-sticky-cart__btn bogo-sticky-cart__btn--review" style="display: none;">
              Review
            </button>
            <button id="sticky-cart-checkout" class="bogo-sticky-cart__btn bogo-sticky-cart__btn--checkout" style="display: none;">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- Product Modal Placeholder -->
<div id="product-modal-container"></div>

{% schema %}
{
  "name": "BOGO Builder 2024",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Section Heading",
      "default": "Black Friday BOGO Builder"
    },
    {
      "type": "checkbox",
      "id": "show_timer",
      "label": "Show Countdown Timer",
      "default": true
    },
    {
      "type": "text",
      "id": "timer_end_date",
      "label": "Timer End Date",
      "info": "Format: YYYY-MM-DD HH:MM:SS",
      "default": "2025-11-30 23:59:59"
    }
  ],
  "blocks": [
    {
      "type": "collection",
      "name": "Product Collection",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Collection"
        },
        {
          "type": "range",
          "id": "products_limit",
          "label": "Products to Show",
          "min": 1,
          "max": 50,
          "step": 1,
          "default": 12
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "BOGO Builder 2024"
    }
  ]
}
{% endschema %}
```

---

## 2. Modal Snippet

**File**: `snippets/buy-now-popup.liquid`
**Purpose**: Product information modal with image carousel, variant selection, reviews
**Lines**: 144 total

### Key Features:
- Modal wrapper with product/variant data attributes
- Image carousel with navigation arrows, dots, thumbnails
- Collapsible product description
- Side-by-side variant selectors (auto-select on open)
- Customer reviews section with scroll area
- Sticky footer with pricing and add button

### Complete Code:

```liquid
{% comment %}
  Product Buy Now Popup Modal
  Usage: {% render 'buy-now-popup', product: product %}
{% endcomment %}

{% if product %}
<div class="buy-now-popup-overlay" id="buy-now-popup-{{ product.id }}">
  <div class="buy-now-popup__wrapper"
       data-product-id="{{ product.id }}"
       data-variant-data='{{ product.variants | json }}'>

    <!-- Close Button -->
    <svg class="close-buy-now-popup" viewBox="0 0 24 24" onclick="closeAllModals()">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>

    <!-- Product Body -->
    <div class="buy-now-popup__product-body">

      <!-- LEFT COLUMN: Image Carousel (47%) -->
      <div class="modal-product-figure">
        {% if product.compare_at_price > product.price %}
          <div class="discount_message">
            -{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price }}% OFF
          </div>
        {% endif %}

        <!-- Main Carousel -->
        <div class="carousel-images">
          {% if product.images.size > 0 %}
            {% for image in product.images %}
              <img
                src="{{ image | image_url: width: 800 }}"
                alt="{{ product.title }}"
                class="carousel-image {% if forloop.first %}active{% endif %}"
                data-index="{{ forloop.index0 }}"
              >
            {% endfor %}

            <!-- Navigation Arrows -->
            {% if product.images.size > 1 %}
              <button class="carousel-nav carousel-prev" onclick="changeCarouselImage(this, -1)">‹</button>
              <button class="carousel-nav carousel-next" onclick="changeCarouselImage(this, 1)">›</button>

              <!-- Dots -->
              <div class="carousel-dots">
                {% for image in product.images %}
                  <button
                    class="carousel-dot {% if forloop.first %}active{% endif %}"
                    onclick="goToCarouselImage(this, {{ forloop.index0 }})"
                    data-index="{{ forloop.index0 }}"
                  ></button>
                {% endfor %}
              </div>
            {% endif %}
          {% else %}
            {{ 'product-1' | placeholder_svg_tag: 'modal-product-image' }}
          {% endif %}
        </div>

        <!-- Thumbnails -->
        {% if product.images.size > 1 %}
          <div class="carousel-thumbnails">
            {% for image in product.images %}
              <button
                class="carousel-thumbnail {% if forloop.first %}active{% endif %}"
                onclick="goToCarouselImage(this, {{ forloop.index0 }})"
                data-index="{{ forloop.index0 }}"
              >
                <img src="{{ image | image_url: width: 120 }}" alt="{{ product.title }}">
              </button>
            {% endfor %}
          </div>
        {% endif %}
      </div>

      <!-- RIGHT COLUMN: Content (53%) -->
      <div class="buy-now-popup__content">

        <!-- Product Title -->
        <a href="{{ product.url }}" class="modal-product-title">
          {{ product.title }}
        </a>

        <!-- Description -->
        <div class="buy-now-popup__description">
          <div class="buy-now-popup__description-inner" id="description-{{ product.id }}">
            {{ product.description }}
          </div>
          <button
            class="buy-now-popup__expand-desc"
            onclick="toggleDescription('{{ product.id }}')"
          >
            Learn More
            <svg class="arrow" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1L6 6L11 1"/>
            </svg>
          </button>
        </div>

        <!-- Variant Selectors -->
        {% if product.has_only_default_variant == false %}
          <div class="variant-selectors">
            {% for option in product.options_with_values %}
              <select
                class="variant-selector"
                name="option{{ forloop.index }}"
                data-option-position="{{ forloop.index }}"
              >
                <option value="">{{ option.name }}</option>
                {% for value in option.values %}
                  <option value="{{ value }}">{{ value }}</option>
                {% endfor %}
              </select>
            {% endfor %}
          </div>
        {% endif %}

        <!-- Reviews Section -->
        {% if product.metafields.reviews.rating.value %}
          <div class="modal-reviews-section">
            <div class="reviews-header">
              <h3>Customer Reviews</h3>
              <div class="reviews-rating-summary">
                <div class="rating-stars">
                  {% assign rating = product.metafields.reviews.rating.value %}
                  {% for i in (1..5) %}
                    {% if i <= rating %}
                      <span class="star filled">★</span>
                    {% else %}
                      <span class="star">★</span>
                    {% endif %}
                  {% endfor %}
                </div>
                <span class="rating-count">{{ product.metafields.reviews.rating_count.value }} reviews</span>
              </div>
            </div>

            <div class="reviews-scroll-area">
              {% comment %} Reviews would be loaded via app or manually {% endcomment %}
              <div class="review-card">
                <div class="review-header">
                  <span class="review-author">Verified Buyer</span>
                  <span class="review-stars">★★★★★</span>
                </div>
                <p class="review-content">Amazing quality! Exactly what I needed.</p>
              </div>
            </div>
          </div>
        {% endif %}

      </div>
    </div>

    <!-- FOOTER: Pricing & Add Button -->
    <div class="buy-now-popup__footer">
      <div class="buy-now-popup__price">
        <span class="modal-price" id="modal-price-{{ product.id }}">
          {{ product.price | money }}
        </span>
        {% if product.compare_at_price > product.price %}
          <span class="modal-compare-price">
            {{ product.compare_at_price | money }}
          </span>
        {% endif %}
      </div>

      <button
        class="buy-now-popup__atc"
        data-product-id="{{ product.id }}"
        onclick="addToBOGOPair(this)"
      >
        Add to BOGO Pair
      </button>
    </div>

  </div>
</div>
{% endif %}
```

---

## 3. CSS - Modal Section

**File**: `assets/bogo-builder.css`
**Lines**: 2018-2650
**Purpose**: Complete styling for product modal

### Key Features:
- Full-screen overlay with flexbox centering
- 47%/53% two-column layout (image left, content right)
- Image carousel with nav arrows, dots, thumbnails
- Collapsible description with "Learn More"
- Side-by-side variant selectors
- Customer reviews with scroll area
- Sticky footer with pricing and add button
- Mobile responsive (stacks vertically)

### Complete Code:

```css
/* Overlay - Full screen flexbox */
.buy-now-popup-overlay {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.85) !important;
  backdrop-filter: blur(8px);
  z-index: 9999 !important;
  display: none !important;
  align-items: center !important;
  justify-content: center !important;
}

.buy-now-popup-overlay.active {
  display: flex !important;
}

/* Modal Wrapper */
.buy-now-popup__wrapper {
  position: relative !important;
  width: 80vw !important;
  max-width: 1280px !important;
  height: 70vh !important;
  max-height: 860px !important;
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

/* Close Button */
.close-buy-now-popup {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  width: 25px !important;
  height: 25px !important;
  fill: #999999 !important;
  cursor: pointer !important;
  z-index: 10 !important;
  transition: fill 300ms ease;
}

.close-buy-now-popup:hover {
  fill: #ff0000 !important;
}

/* Product Body - TWO COLUMN LAYOUT */
.buy-now-popup__product-body {
  display: flex !important;
  flex-direction: row !important;
  flex: 1 !important;
  padding: 70px !important;
  overflow-y: auto !important;
  gap: 0 !important;
  min-height: 0 !important;
}

/* ========================================
   LEFT COLUMN: IMAGE CAROUSEL (47%)
   ======================================== */

.modal-product-figure {
  width: 47% !important;
  max-height: 500px !important;
  margin-right: 5% !important;
  flex-shrink: 0 !important;
  position: relative !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Discount Badge */
.discount_message {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  background: #ff3b30 !important;
  color: #ffffff !important;
  padding: 6px 12px !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  z-index: 2 !important;
}

/* Main Carousel Container */
.carousel-images {
  position: relative !important;
  width: 100% !important;
  height: 400px !important;
  background: #f8f8f8 !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  margin-bottom: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.carousel-image {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  padding: 20px !important;
  opacity: 0 !important;
  transition: opacity 400ms ease !important;
  pointer-events: none !important;
}

.carousel-image.active {
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
}

/* Fallback for single image (old structure) */
.modal-product-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  border-radius: 8px !important;
}

/* Carousel Navigation Arrows */
.carousel-nav {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 40px !important;
  height: 40px !important;
  background: rgba(0, 0, 0, 0.5) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 50% !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  z-index: 2 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 300ms ease !important;
}

.carousel-nav:hover {
  background: rgba(0, 0, 0, 0.8) !important;
  transform: translateY(-50%) scale(1.1) !important;
}

.carousel-prev {
  left: 10px !important;
}

.carousel-next {
  right: 10px !important;
}

/* Carousel Dots */
.carousel-dots {
  position: absolute !important;
  bottom: 10px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  display: flex !important;
  gap: 8px !important;
  z-index: 2 !important;
}

.carousel-dot {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.5) !important;
  border: none !important;
  cursor: pointer !important;
  transition: all 300ms ease !important;
  padding: 0 !important;
}

.carousel-dot:hover,
.carousel-dot.active {
  background: #60c655 !important;
  transform: scale(1.2) !important;
}

/* Carousel Thumbnails */
.carousel-thumbnails {
  display: flex !important;
  gap: 8px !important;
  justify-content: center !important;
  overflow-x: auto !important;
  padding: 4px 0 !important;
}

.carousel-thumbnail {
  width: 80px !important;
  height: 80px !important;
  border: 2px solid #e5e5e5 !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  cursor: pointer !important;
  transition: all 300ms ease !important;
  padding: 0 !important;
  background: #f8f8f8 !important;
  flex-shrink: 0 !important;
}

.carousel-thumbnail:hover {
  border-color: #60c655 !important;
}

.carousel-thumbnail.active {
  border-color: #60c655 !important;
  border-width: 3px !important;
}

.carousel-thumbnail img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  padding: 8px !important;
}

/* ========================================
   RIGHT COLUMN: CONTENT (53%)
   ======================================== */

.buy-now-popup__content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
  min-width: 0 !important;
  padding-bottom: 100px !important;
  overflow-y: auto !important;
}

/* Product Title */
.modal-product-title {
  font-size: 21px !important;
  font-weight: 700 !important;
  color: #000000 !important;
  text-decoration: none !important;
  padding-bottom: 8px !important;
  border-bottom: 1px solid #e5e5e5 !important;
  line-height: 1.2 !important;
  display: block !important;
  margin-bottom: 8px !important;
}

/* Description Section */
.buy-now-popup__description {
  margin-bottom: 12px !important;
}

.buy-now-popup__description-inner {
  max-height: 100px !important;
  overflow: hidden !important;
  position: relative !important;
  transition: max-height 400ms ease !important;
}

.buy-now-popup__description-inner::after {
  content: '' !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 40px !important;
  background: linear-gradient(to bottom, transparent, #ffffff) !important;
  pointer-events: none !important;
}

.buy-now-popup__description-inner.expanded {
  max-height: 500px !important;
}

.buy-now-popup__description-inner.expanded::after {
  display: none !important;
}

.buy-now-popup__description-inner ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.buy-now-popup__description-inner li {
  margin-bottom: 8px !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: #333333 !important;
}

.buy-now-popup__expand-desc {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 8px 0 !important;
  background: none !important;
  border: none !important;
  color: #60c655 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: color 300ms ease !important;
}

.buy-now-popup__expand-desc:hover {
  color: #50b645 !important;
}

.buy-now-popup__expand-desc .arrow {
  font-size: 8px !important;
  max-width: 15px !important;
  width: 15px !important;
  height: 15px !important;
  transition: transform 300ms ease !important;
}

.buy-now-popup__expand-desc.expanded .arrow {
  transform: rotate(180deg) !important;
}

/* Variant Selectors - SIDE BY SIDE */
.variant-selectors {
  display: flex !important;
  gap: 20px !important;
  margin: 12px 0 20px 0 !important;
  flex-wrap: nowrap !important;
}

.variant-selector {
  flex: 1 !important;
  min-width: 120px !important;
  height: 46px !important;
  padding: 0 16px !important;
  background: transparent !important;
  border: 1px solid #000000 !important;
  border-radius: 20px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #000000 !important;
  cursor: pointer !important;
  transition: all 300ms ease !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23000000' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 16px center !important;
  padding-right: 40px !important;
}

.variant-selector:hover {
  border-color: #60c655 !important;
}

.variant-selector:focus {
  outline: none !important;
  border-color: #60c655 !important;
  box-shadow: 0 0 0 3px rgba(96, 198, 85, 0.2) !important;
}

.variant-selector option {
  padding: 8px !important;
  background: #ffffff !important;
  color: #000000 !important;
}

/* Reviews Section */
.modal-reviews-section {
  margin-top: 20px !important;
}

.reviews-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 16px !important;
  background: rgba(96, 198, 85, 0.15) !important;
  border-radius: 8px 8px 0 0 !important;
}

.reviews-header h3 {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #000000 !important;
  margin: 0 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

.reviews-rating-summary {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.rating-stars {
  display: flex !important;
  gap: 2px !important;
}

.star {
  color: #e5e5e5 !important;
  font-size: 14px !important;
}

.star.filled {
  color: #FFD700 !important;
}

.star.half {
  background: linear-gradient(90deg, #FFD700 50%, #e5e5e5 50%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.rating-count {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #333333 !important;
}

.reviews-scroll-area {
  max-height: 200px !important;
  overflow-y: auto !important;
  padding: 12px !important;
  background: #ffffff !important;
  border: 1px solid rgba(96, 198, 85, 0.2) !important;
  border-top: none !important;
  border-radius: 0 0 8px 8px !important;
}

.review-card {
  padding: 12px !important;
  background: #f8f8f8 !important;
  border-radius: 6px !important;
  margin-bottom: 8px !important;
}

.review-card:last-child {
  margin-bottom: 0 !important;
}

.review-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 6px !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
}

.review-author {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #000000 !important;
}

.review-stars {
  color: #FFD700 !important;
  font-size: 12px !important;
}

.review-date {
  font-size: 11px !important;
  color: #999999 !important;
}

.review-title {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #000000 !important;
  margin-bottom: 4px !important;
}

.review-content {
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: #333333 !important;
}

/* ========================================
   FOOTER - ABSOLUTE AT BOTTOM
   ======================================== */

.buy-now-popup__footer {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 16px 72px !important;
  background: #ffffff !important;
  border-top: 1px solid #e5e5e5 !important;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.08) !important;
  z-index: 5 !important;
}

.buy-now-popup__price {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

.modal-price {
  font-size: 21px !important;
  font-weight: 700 !important;
  color: #60c655 !important;
}

.modal-compare-price {
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #999999 !important;
  text-decoration: line-through !important;
}

.buy-now-popup__atc {
  min-width: 280px !important;
  height: 46px !important;
  padding: 0 32px !important;
  background: #60c655 !important;
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border: none !important;
  border-radius: 20px !important;
  cursor: pointer !important;
  transition: all 300ms ease !important;
}

.buy-now-popup__atc:hover {
  background: #50b645 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(96, 198, 85, 0.4) !important;
}

/* Hide old elements (quantity, upsells) */
.buy-now-popup__quantity,
.buy-now-popup__upsell {
  display: none !important;
}

/* ========================================
   MOBILE RESPONSIVE
   ======================================== */

@media (max-width: 768px) {
  .buy-now-popup__wrapper {
    width: 95vw !important;
    height: auto !important;
    max-height: 90vh !important;
  }

  .buy-now-popup__product-body {
    flex-direction: column !important;
    padding: 40px 20px 100px 20px !important;
  }

  .modal-product-figure {
    width: 100% !important;
    max-height: 300px !important;
    margin-right: 0 !important;
    margin-bottom: 20px !important;
  }

  .carousel-images {
    height: 300px !important;
  }

  .buy-now-popup__content {
    width: 100% !important;
  }

  .variant-selectors {
    flex-direction: column !important;
    gap: 12px !important;
  }

  .variant-selector {
    width: 100% !important;
  }

  .reviews-scroll-area {
    max-height: 150px !important;
  }

  .buy-now-popup__footer {
    flex-direction: column !important;
    padding: 16px 20px !important;
    gap: 12px !important;
  }

  .buy-now-popup__atc {
    width: 100% !important;
    min-width: auto !important;
  }
}
```

---

## 4. CSS - Sticky Cart Section

**File**: `assets/bogo-builder.css`
**Lines**: 3636-3850
**Purpose**: Fixed bottom cart bar showing BOGO pairs, savings, and checkout buttons

### Key Features:
- Fixed to viewport bottom (moved to body via JavaScript)
- 120px height on desktop, 80px on mobile
- Three-column layout (title/status, pair count, savings/buttons)
- Gradient black background with shadow
- Responsive button sizing
- Auto-hide left section on very small screens

### Complete Code:

```css
/* ========================================
   STICKY CART - SIMPLE WORKING VERSION
   STICKY-CART-REVERT-WORKING-075
   ======================================== */

/* Main Container */
.bogo-sticky-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(180deg, #0a0a0a 0%, #000000 100%);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.8);
  z-index: 9000;
  transition: all 400ms ease;
}

/* Desktop: 120px tall (50% increase) */
@media (min-width: 768px) {
  .bogo-sticky-cart {
    height: 120px;
  }
}

/* Mobile: 80px tall (compact) */
@media (max-width: 767px) {
  .bogo-sticky-cart {
    height: 80px;
  }
}

/* Inner Container */
.bogo-sticky-cart__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 40px;
  gap: 24px;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__inner {
    padding: 0 16px;
    gap: 12px;
  }
}

/* Left Section */
.bogo-sticky-cart__left {
  flex-shrink: 0;
}

.bogo-sticky-cart__title {
  font-size: 16px;
  font-weight: 700;
  color: #60c655;
  margin-bottom: 4px;
}

.bogo-sticky-cart__status {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__title {
    font-size: 14px;
  }

  .bogo-sticky-cart__status {
    font-size: 11px;
  }
}

/* Center Section */
.bogo-sticky-cart__center {
  flex: 1;
  text-align: center;
}

.bogo-sticky-cart__pairs {
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__pairs {
    font-size: 16px;
  }
}

/* Right Section */
.bogo-sticky-cart__right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__right {
    gap: 12px;
  }
}

/* Savings Display */
.bogo-sticky-cart__savings {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 8px;
}

.bogo-sticky-cart__savings-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bogo-sticky-cart__savings-amount {
  font-size: 24px;
  font-weight: 900;
  color: #60c655;
  line-height: 1;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__savings-amount {
    font-size: 18px;
  }
}

/* Action Buttons */
.bogo-sticky-cart__actions {
  display: flex;
  gap: 12px;
}

.bogo-sticky-cart__btn {
  height: 44px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 300ms ease;
  border: 2px solid transparent;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__btn {
    height: 40px;
    padding: 0 16px;
    font-size: 12px;
  }
}

/* Review Button */
.bogo-sticky-cart__btn--review {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.bogo-sticky-cart__btn--review:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Checkout Button */
.bogo-sticky-cart__btn--checkout {
  background: #60c655;
  color: #000000;
  border-color: #60c655;
}

.bogo-sticky-cart__btn--checkout:hover {
  background: #50b645;
  border-color: #50b645;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(96, 198, 85, 0.4);
}

/* Hide on very small screens */
@media (max-width: 480px) {
  .bogo-sticky-cart__left {
    display: none;
  }

  .bogo-sticky-cart__center {
    text-align: left;
  }
}
```

---

## 5. JavaScript - Rebuy Prevention

**File**: `assets/bogo-builder.js`
**Lines**: 1-43
**Purpose**: Prevent Rebuy Smart Cart from intercepting direct checkout navigation

### Key Features:
- IIFE (Immediately Invoked Function Expression) runs on page load
- Checks sessionStorage flag set during checkout
- Disables Rebuy SmartCart open/close functions
- Intercepts `rebuy:cart.open` events
- 2-second prevention window

### Complete Code:

```javascript
// ========================================
// PREVENT REBUY CART DRAWER ON BOGO CHECKOUT
// BOGO-BYPASS-CART-DRAWER-078
// ========================================

(function preventRebuyInterference() {
  // Check if this is a BOGO checkout redirect
  const isBOGOCheckout = sessionStorage.getItem('bogo-direct-checkout');

  if (isBOGOCheckout === 'true') {
    console.log('%c🛡️ BOGO direct checkout detected - preventing cart drawer', 'color: #60c655; font-weight: bold;');

    // Clear the flag
    sessionStorage.removeItem('bogo-direct-checkout');

    // Prevent Rebuy cart drawer from opening
    if (window.Rebuy) {
      console.log('Disabling Rebuy cart drawer...');
      if (window.Rebuy.SmartCart) {
        window.Rebuy.SmartCart.close = function() {};
        window.Rebuy.SmartCart.open = function() {};
      }
    }

    // Prevent any cart drawer opens for next 2 seconds
    let preventCartDrawer = true;

    setTimeout(() => {
      preventCartDrawer = false;
    }, 2000);

    // Intercept any drawer open attempts
    document.addEventListener('rebuy:cart.open', function(e) {
      if (preventCartDrawer) {
        console.log('Prevented Rebuy cart drawer from opening');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }
})();
```

---

## 6. JavaScript - Modal Functions

**File**: `assets/bogo-builder.js`
**Purpose**: Open/close modals, auto-select variants, handle carousel navigation

### Key Functions:

#### `openProductModal(productUrl)`
- Fetches product page HTML
- Renders modal snippet
- Auto-selects first variant option
- Adds modal to DOM with fade-in

#### `closeAllModals()`
- Removes `.active` class from overlays
- Fades out and removes modals

#### `addToBOGOPair(button)`
- Gets selected variant from modal
- Adds to `window.bogoState`
- Updates sticky cart
- Closes modal after 300ms

#### `getSelectedVariantFromModal(modal)`
- Reads variant selector values
- Matches against product variant data
- Returns variant ID or null

#### Carousel Functions
- `changeCarouselImage(button, direction)` - Next/prev navigation
- `goToCarouselImage(button, index)` - Jump to specific image
- Updates active states on images, dots, thumbnails

### Complete Code:

```javascript
// ========================================
// MODAL FUNCTIONS
// ========================================

/**
 * Open product modal
 * @param {string} productUrl - Shopify product URL
 */
async function openProductModal(productUrl) {
  console.log('Opening modal for:', productUrl);

  try {
    // Fetch product page
    const response = await fetch(productUrl);
    const html = await response.text();

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract modal snippet
    const modalSnippet = doc.querySelector('.buy-now-popup-overlay');

    if (!modalSnippet) {
      console.error('Modal snippet not found for product:', productUrl);
      return;
    }

    // Insert into DOM
    const container = document.getElementById('product-modal-container');
    if (!container) {
      console.error('Modal container not found');
      return;
    }

    // Close any existing modals
    closeAllModals();

    // Add new modal
    container.innerHTML = '';
    container.appendChild(modalSnippet);

    // Get the modal element
    const modal = container.querySelector('.buy-now-popup-overlay');

    // AUTO-SELECT FIRST VARIANTS
    const variantSelectors = modal.querySelectorAll('.variant-selector');
    console.log('Found variant selectors:', variantSelectors.length);

    variantSelectors.forEach((selector, index) => {
      const options = selector.querySelectorAll('option');

      if (options.length > 1) {
        const firstVariant = options[1]; // Skip placeholder at index 0
        selector.value = firstVariant.value;
        console.log(`Auto-selected: ${firstVariant.value} for option ${index + 1}`);

        // Trigger change event
        const event = new Event('change', { bubbles: true });
        selector.dispatchEvent(event);
      }
    });

    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);

  } catch (error) {
    console.error('Error opening modal:', error);
  }
}

/**
 * Close all modals
 */
function closeAllModals() {
  const modals = document.querySelectorAll('.buy-now-popup-overlay');
  modals.forEach(modal => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });
}

/**
 * Add product to BOGO pair
 * @param {HTMLElement} button - Add button element
 */
function addToBOGOPair(button) {
  console.log('Adding to BOGO pair...');

  const modal = button.closest('.buy-now-popup-overlay');
  const productId = modal.querySelector('[data-product-id]').getAttribute('data-product-id');

  // Get selected variant
  const variantId = getSelectedVariantFromModal(modal);

  if (!variantId) {
    alert('Please select all product options');
    return;
  }

  // Get product details
  const productTitle = modal.querySelector('.modal-product-title').textContent.trim();
  const productImage = modal.querySelector('.carousel-image.active')?.src || '';
  const productPrice = modal.querySelector('.modal-price').textContent.trim();

  // Initialize state if needed
  if (!window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
  }

  const state = window.bogoState;

  // Add to current pair
  if (!state.currentPair.slot1) {
    // First product of pair
    state.currentPair.slot1 = {
      productId,
      variantId,
      title: productTitle,
      image: productImage,
      price: productPrice
    };
    console.log('Added to slot 1');
  } else if (!state.currentPair.slot2) {
    // Second product of pair (complete the pair)
    state.currentPair.slot2 = {
      productId,
      variantId,
      title: productTitle,
      image: productImage,
      price: productPrice
    };

    // Move completed pair to pairs array
    state.pairs.push(state.currentPair);
    state.currentPair = {};

    console.log('Pair completed! Total pairs:', state.pairs.length);

    showSuccessToast('Pair completed! 🎉');
  }

  // Update sticky cart
  updateStickyCart();

  // Close modal
  setTimeout(() => closeAllModals(), 300);
}

/**
 * Get selected variant ID from modal
 * @param {HTMLElement} modal - Modal element
 * @returns {string|null} - Variant ID or null
 */
function getSelectedVariantFromModal(modal) {
  const variantSelectors = modal.querySelectorAll('.variant-selector');

  if (variantSelectors.length === 0) {
    // Product has only default variant
    const variantDataAttr = modal.querySelector('[data-variant-data]');
    if (variantDataAttr) {
      const variantData = JSON.parse(variantDataAttr.getAttribute('data-variant-data'));
      return variantData[0]?.id?.toString() || null;
    }
    return null;
  }

  // Collect selected options
  const selectedOptions = {};
  let allSelected = true;

  variantSelectors.forEach((selector, index) => {
    const value = selector.value;
    if (!value || value === '') {
      allSelected = false;
      return;
    }
    selectedOptions[`option${index + 1}`] = value;
  });

  if (!allSelected) {
    return null;
  }

  // Match options to variant
  const variantDataAttr = modal.querySelector('[data-variant-data]');
  if (!variantDataAttr) return null;

  const variants = JSON.parse(variantDataAttr.getAttribute('data-variant-data'));

  const matchedVariant = variants.find(variant => {
    return Object.keys(selectedOptions).every(key => {
      const optionIndex = parseInt(key.replace('option', ''));
      return variant[key] === selectedOptions[key];
    });
  });

  return matchedVariant ? matchedVariant.id.toString() : null;
}

/**
 * Show success toast notification
 * @param {string} message - Toast message
 */
function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.className = 'bogo-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #60c655;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 300ms ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Toggle description expand/collapse
 * @param {string} productId - Product ID
 */
function toggleDescription(productId) {
  const descInner = document.getElementById(`description-${productId}`);
  const button = descInner.nextElementSibling;

  descInner.classList.toggle('expanded');
  button.classList.toggle('expanded');

  button.textContent = descInner.classList.contains('expanded') ? 'Show Less' : 'Learn More';
}

// ========================================
// CAROUSEL FUNCTIONS
// ========================================

/**
 * Change carousel image (next/previous)
 * @param {HTMLElement} button - Navigation button
 * @param {number} direction - 1 for next, -1 for previous
 */
function changeCarouselImage(button, direction) {
  const carousel = button.closest('.modal-product-figure');
  const images = carousel.querySelectorAll('.carousel-image');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const thumbnails = carousel.querySelectorAll('.carousel-thumbnail');

  let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
  let newIndex = currentIndex + direction;

  // Wrap around
  if (newIndex < 0) newIndex = images.length - 1;
  if (newIndex >= images.length) newIndex = 0;

  // Update active states
  images[currentIndex].classList.remove('active');
  images[newIndex].classList.add('active');

  if (dots.length > 0) {
    dots[currentIndex].classList.remove('active');
    dots[newIndex].classList.add('active');
  }

  if (thumbnails.length > 0) {
    thumbnails[currentIndex].classList.remove('active');
    thumbnails[newIndex].classList.add('active');
  }
}

/**
 * Go to specific carousel image
 * @param {HTMLElement} button - Dot or thumbnail button
 * @param {number} index - Image index
 */
function goToCarouselImage(button, index) {
  const carousel = button.closest('.modal-product-figure');
  const images = carousel.querySelectorAll('.carousel-image');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const thumbnails = carousel.querySelectorAll('.carousel-thumbnail');

  // Remove all active classes
  images.forEach(img => img.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  thumbnails.forEach(thumb => thumb.classList.remove('active'));

  // Add active to selected
  images[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
  if (thumbnails[index]) thumbnails[index].classList.add('active');
}
```

---

## 7. JavaScript - Sticky Cart Functions

**File**: `assets/bogo-builder.js`
**Purpose**: Update sticky cart display, show/hide based on state, calculate savings

### Key Functions:

#### `updateStickyCart()`
- Reads `window.bogoState`
- Shows cart if ANY products exist (complete pairs OR incomplete pair)
- Displays "Building Pair X..." when one product added
- Shows pair count when pairs complete
- Calculates and displays total savings
- Shows/hides Review and Checkout buttons

#### `removePair(pairIndex)`
- Removes pair from `window.bogoState.pairs`
- Updates sticky cart
- Re-runs tier calculations

#### `updateTierMessage(pairCount)`
- Updates tier indicator based on pair count
- Shows progress toward next tier

### Complete Code:

```javascript
// ========================================
// STICKY CART FUNCTIONS
// STICKY-CART-SHOW-FIRST-PRODUCT-077
// ========================================

/**
 * Update sticky cart display
 */
function updateStickyCart() {
  const state = window.bogoState;
  const stickyCart = document.querySelector('.bogo-sticky-cart');

  if (!stickyCart) {
    console.warn('Sticky cart element not found');
    return;
  }

  const pairCount = state?.pairs?.length || 0;
  const currentPair = state?.currentPair;
  const hasIncompleteProduct = currentPair?.slot1 && !currentPair?.slot2;

  // Get DOM elements
  const pairCountEl = document.getElementById('sticky-cart-pair-count');
  const statusEl = document.getElementById('sticky-cart-status');
  const savingsEl = document.getElementById('sticky-cart-savings');
  const reviewBtn = document.getElementById('sticky-cart-review');
  const checkoutBtn = document.getElementById('sticky-cart-checkout');

  // Update pair count display
  if (pairCountEl) {
    if (hasIncompleteProduct) {
      pairCountEl.textContent = `Building Pair ${pairCount + 1}...`;
      pairCountEl.style.color = '#fbbf24'; // Yellow for incomplete
    } else {
      pairCountEl.textContent = `${pairCount} Pair${pairCount !== 1 ? 's' : ''}`;
      pairCountEl.style.color = '#ffffff';
    }
  }

  // Update status message
  if (statusEl) {
    if (hasIncompleteProduct) {
      statusEl.textContent = 'Select 1 more product to complete pair';
    } else if (pairCount === 0) {
      statusEl.textContent = 'Select 2 products to start';
    } else if (pairCount === 1) {
      statusEl.textContent = 'Build 1 more pair for Tier 2 bonus!';
    } else if (pairCount === 2) {
      statusEl.textContent = 'Build 1 more pair for FREE cable!';
    } else {
      statusEl.textContent = 'Maximum savings unlocked! 🎉';
    }
  }

  // Calculate savings (50% off second item per pair)
  let totalSavings = 0;
  if (state?.pairs) {
    state.pairs.forEach(pair => {
      // Parse prices (remove currency symbols and convert to number)
      const price1 = parseFloat(pair.slot1?.price?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
      const price2 = parseFloat(pair.slot2?.price?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);

      // Lower priced item is 50% off
      const lowerPrice = Math.min(price1, price2);
      totalSavings += lowerPrice * 0.5;
    });
  }

  // Update savings display
  if (savingsEl) {
    savingsEl.textContent = `€${totalSavings.toFixed(2)}`;
  }

  // KEY FIX: Show cart if ANY products exist
  const hasAnyProducts = pairCount > 0 || hasIncompleteProduct;

  if (hasAnyProducts) {
    stickyCart.style.display = 'block';

    // Only show buttons if at least one complete pair exists
    if (reviewBtn) reviewBtn.style.display = pairCount > 0 ? 'block' : 'none';
    if (checkoutBtn) checkoutBtn.style.display = pairCount > 0 ? 'block' : 'none';
  } else {
    stickyCart.style.display = 'none';
  }

  console.log('Sticky cart updated:', {
    pairCount,
    hasIncompleteProduct,
    totalSavings: `€${totalSavings.toFixed(2)}`,
    visible: hasAnyProducts
  });
}

/**
 * Remove a pair from the cart
 * @param {number} pairIndex - Index of pair to remove
 */
function removePair(pairIndex) {
  const state = window.bogoState;

  if (!state || !state.pairs || pairIndex < 0 || pairIndex >= state.pairs.length) {
    console.error('Invalid pair index:', pairIndex);
    return;
  }

  // Remove pair
  state.pairs.splice(pairIndex, 1);

  console.log(`Removed pair ${pairIndex + 1}. Remaining pairs:`, state.pairs.length);

  // Update sticky cart
  updateStickyCart();

  // Update tier messaging
  updateTierMessage(state.pairs.length);
}

/**
 * Update tier progress message
 * @param {number} pairCount - Current number of pairs
 */
function updateTierMessage(pairCount) {
  let message = '';
  let tierLevel = 1;

  if (pairCount >= 3) {
    message = '🏆 Tier 3 Unlocked: Maximum savings + FREE cable!';
    tierLevel = 3;
  } else if (pairCount >= 2) {
    message = '🥈 Tier 2 Unlocked: Extra 5% off! Build 1 more for FREE cable.';
    tierLevel = 2;
  } else if (pairCount >= 1) {
    message = '🥉 Tier 1 Active: Build 1 more pair for Tier 2 bonus!';
    tierLevel = 1;
  } else {
    message = 'Build pairs to unlock tier bonuses!';
    tierLevel = 0;
  }

  console.log(`Tier ${tierLevel}: ${message}`);

  // Could update a tier indicator element here
  const tierIndicator = document.getElementById('tier-indicator');
  if (tierIndicator) {
    tierIndicator.textContent = message;
    tierIndicator.setAttribute('data-tier', tierLevel);
  }
}

/**
 * Show review modal with all pairs
 */
function showReviewModal() {
  const state = window.bogoState;

  if (!state || !state.pairs || state.pairs.length === 0) {
    alert('No pairs to review');
    return;
  }

  // Create review modal HTML
  let modalHTML = '<div class="bogo-review-modal">';
  modalHTML += '<h2>Review Your BOGO Pairs</h2>';

  state.pairs.forEach((pair, index) => {
    modalHTML += `
      <div class="review-pair" data-pair-index="${index}">
        <h3>Pair ${index + 1}</h3>
        <div class="review-pair-products">
          <div class="review-product">
            <img src="${pair.slot1.image}" alt="${pair.slot1.title}">
            <span>${pair.slot1.title}</span>
            <span>${pair.slot1.price}</span>
          </div>
          <div class="review-product">
            <img src="${pair.slot2.image}" alt="${pair.slot2.title}">
            <span>${pair.slot2.title}</span>
            <span class="discounted">${pair.slot2.price} (50% OFF)</span>
          </div>
        </div>
        <button onclick="removePair(${index})">Remove Pair</button>
      </div>
    `;
  });

  modalHTML += '<button onclick="closeReviewModal()">Continue Shopping</button>';
  modalHTML += '<button onclick="proceedToCheckout()">Proceed to Checkout</button>';
  modalHTML += '</div>';

  // Insert into DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Close review modal
 */
function closeReviewModal() {
  const modal = document.querySelector('.bogo-review-modal');
  if (modal) modal.remove();
}
```

---

## 8. JavaScript - Checkout Function

**File**: `assets/bogo-builder.js`
**Lines**: ~3200-3370
**Purpose**: Build direct checkout URL and bypass Rebuy cart drawer

### Key Features:
- Builds `/cart/{line_items}?checkout=true&discount={codes}` URL
- Line items format: `variantId:quantity[property:value,property:value]`
- Adds BOGO pair properties for order tracking
- Includes bonus cable for Tier 3 (3+ pairs)
- Applies discount codes based on tier
- Sets sessionStorage flag to prevent Rebuy
- Temporarily disables `window.Rebuy`

### Complete Code:

```javascript
// ========================================
// CHECKOUT FUNCTION
// BOGO-BYPASS-CART-DRAWER-078
// ========================================

/**
 * Proceed to checkout with direct URL
 */
async function proceedToCheckout() {
  const state = window.bogoState;

  // Validation
  if (!state || !state.pairs || state.pairs.length === 0) {
    alert('Please add at least one pair to continue');
    return;
  }

  console.log('Building checkout URL for', state.pairs.length, 'pairs');

  const checkoutItems = [];

  // Add all BOGO pairs
  state.pairs.forEach((pair, pairIndex) => {
    const pairNumber = pairIndex + 1;

    // Product 1
    const product1 = pair.slot1 || pair.product1 || pair.item1 || pair[0];
    // Product 2 (FREE/50% OFF)
    const product2 = pair.slot2 || pair.product2 || pair.item2 || pair[1];

    if (product1) {
      const variantId = product1.variantId || product1.variant_id || product1.id;
      if (variantId) {
        checkoutItems.push({
          id: variantId,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025',
            '_item_type': 'Full Price'
          }
        });
      }
    }

    if (product2) {
      const variantId = product2.variantId || product2.variant_id || product2.id;
      if (variantId) {
        checkoutItems.push({
          id: variantId,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025',
            '_item_type': '50% OFF'
          }
        });
      }
    }
  });

  // Add bonus cable for Tier 3 (3+ pairs)
  if (state.pairs.length >= 3) {
    checkoutItems.push({
      id: '43480190943410', // Titan Smart Cable variant ID
      quantity: 1,
      properties: {
        '_bonus_item': 'FREE Tier 3 Bonus',
        '_tier_3_bonus': 'Titan Smart Cable',
        '_bogo_offer': 'Black Friday BOGO 2025'
      }
    });
    console.log('✅ Added FREE Titan Smart Cable (Tier 3 bonus)');
  }

  // Build line items URL format
  // Format: variantId:quantity[property:value,property:value]
  const lineItems = checkoutItems.map(item => {
    const properties = item.properties ?
      Object.entries(item.properties)
        .map(([key, val]) => `${encodeURIComponent(key)}:${encodeURIComponent(val)}`)
        .join(',') : '';

    return properties ?
      `${item.id}:${item.quantity}[${properties}]` :
      `${item.id}:${item.quantity}`;
  }).join(',');

  console.log('Line items:', lineItems);

  // Get discount codes based on tier
  const discountCodes = getBOGODiscountCodes(state.pairs.length);
  console.log('Discount codes:', discountCodes);

  // Build checkout URL
  const checkoutUrl = `/cart/${lineItems}?checkout=true&discount=${encodeURIComponent(discountCodes)}`;

  console.log('Checkout URL:', checkoutUrl);

  // CRITICAL: Prevent Rebuy from intercepting
  window.bogoDirectCheckout = true;
  sessionStorage.setItem('bogo-direct-checkout', 'true');

  console.log('%c🛡️ Rebuy prevention activated', 'color: #60c655; font-weight: bold;');

  // Temporarily disable Rebuy
  if (window.Rebuy) {
    console.log('Temporarily disabling Rebuy...');
    const rebuyOriginal = window.Rebuy;
    window.Rebuy = null;

    // Restore after 1 second (after navigation starts)
    setTimeout(() => {
      window.Rebuy = rebuyOriginal;
    }, 1000);
  }

  // Navigate to checkout
  setTimeout(() => {
    console.log('Navigating to checkout...');
    window.location.href = checkoutUrl;
  }, 100);
}

/**
 * Get BOGO discount codes based on tier
 * @param {number} pairCount - Number of pairs
 * @returns {string} - Comma-separated discount codes
 */
function getBOGODiscountCodes(pairCount) {
  const codes = ['BLACKFRIDAY2025']; // Base BOGO code

  if (pairCount >= 3) {
    codes.push('TIER3BONUS'); // 10% extra off
  } else if (pairCount >= 2) {
    codes.push('TIER2BONUS'); // 5% extra off
  }

  return codes.join(',');
}
```

---

## 9. JavaScript - Initialization Code

**File**: `assets/bogo-builder.js`
**Purpose**: Initialize features on page load

### Key Initializations:

#### Sticky Cart to Body Level
- Moves sticky cart from section to `document.body`
- Prevents containing block issues with `position: fixed`
- Runs on DOMContentLoaded

#### Live Activity Scroll Trigger
- Hides live activity indicator until user scrolls past counter
- Uses `getBoundingClientRect()` to check scroll position
- Fades in/out with opacity and pointer-events

#### Event Listeners
- Checkout button click → `proceedToCheckout()`
- Review button click → `showReviewModal()`

### Complete Code:

```javascript
// ========================================
// INITIALIZATION CODE
// STICKY-CART-FIXED-POSITION-074
// ========================================

/**
 * Move sticky cart to body level on page load
 * Prevents containing block issues with position: fixed
 */
(function initializeStickyCart() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveStickyCartToBody);
  } else {
    moveStickyCartToBody();
  }

  function moveStickyCartToBody() {
    const stickyCart = document.querySelector('.bogo-sticky-cart');

    if (!stickyCart) {
      console.warn('⚠️ Sticky cart not found in DOM');
      return;
    }

    // Check if already at body level
    if (stickyCart.parentElement !== document.body) {
      console.log('📦 Moving sticky cart to body level...');
      document.body.appendChild(stickyCart);
      console.log('✅ Sticky cart moved to body level');

      // Force reflow to ensure styles apply correctly
      stickyCart.style.display = 'none';
      void stickyCart.offsetHeight; // Trigger reflow
      stickyCart.style.display = 'block';
    } else {
      console.log('✅ Sticky cart already at body level');
    }
  }
})();

/**
 * Initialize live activity scroll trigger
 * Shows live activity indicator only after scrolling past counter
 */
(function initLiveActivityScroll() {
  const liveActivity = document.querySelector('.live-activity-indicator');
  const counterContent = document.querySelector('.counter-content');

  if (!liveActivity || !counterContent) {
    console.log('Live activity or counter not found, skipping scroll trigger');
    return;
  }

  // Hide initially
  liveActivity.style.opacity = '0';
  liveActivity.style.pointerEvents = 'none';
  liveActivity.style.transition = 'opacity 400ms ease';

  function checkScroll() {
    const counterRect = counterContent.getBoundingClientRect();
    const counterPassed = counterRect.bottom < 0;

    if (counterPassed) {
      liveActivity.style.opacity = '1';
      liveActivity.style.pointerEvents = 'auto';
    } else {
      liveActivity.style.opacity = '0';
      liveActivity.style.pointerEvents = 'none';
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on load

  console.log('✅ Live activity scroll trigger initialized');
})();

/**
 * Initialize sticky cart button listeners
 */
(function initStickyCartButtons() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
  } else {
    attachListeners();
  }

  function attachListeners() {
    const checkoutBtn = document.getElementById('sticky-cart-checkout');
    const reviewBtn = document.getElementById('sticky-cart-review');

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', proceedToCheckout);
      console.log('✅ Checkout button listener attached');
    }

    if (reviewBtn) {
      reviewBtn.addEventListener('click', showReviewModal);
      console.log('✅ Review button listener attached');
    }
  }
})();

/**
 * Initialize BOGO state
 */
(function initBOGOState() {
  if (!window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
    console.log('✅ BOGO state initialized');
  }
})();

console.log('%c✅ BOGO Builder JavaScript Loaded Successfully', 'color: #60c655; font-size: 16px; font-weight: bold;');
```

---

## 10. Key Constants & Configuration

**Purpose**: Configuration values used throughout the BOGO Builder

### Discount Codes

```javascript
// Shopify discount codes (must be created in Shopify admin)
const DISCOUNT_CODES = {
  BASE: 'BLACKFRIDAY2025',      // 50% off second item (applied automatically)
  TIER_2: 'TIER2BONUS',          // Additional 5% off total (2+ pairs)
  TIER_3: 'TIER3BONUS'           // Additional 10% off total (3+ pairs)
};
```

### Bonus Product

```javascript
// Tier 3 Bonus Product (FREE with 3+ pairs)
const BONUS_CABLE_VARIANT_ID = '43480190943410'; // Titan Smart Cable
```

### Tier Thresholds

```javascript
// BOGO Tier System
const TIER_THRESHOLDS = {
  TIER_1: 1,  // 1 pair:  50% off second item
  TIER_2: 2,  // 2 pairs: + 5% off total order
  TIER_3: 3   // 3 pairs: + 10% off total order + FREE cable
};
```

### Pricing Calculation

```javascript
// Savings calculation per pair
// Lower priced item in each pair is 50% off
function calculatePairSavings(price1, price2) {
  const lowerPrice = Math.min(price1, price2);
  return lowerPrice * 0.5; // 50% savings
}
```

### Z-Index Layers

```javascript
// Z-index stacking order
const Z_INDEX = {
  MODAL_OVERLAY: 9999,     // Product modal overlay
  MODAL_CONTENT: 1,        // Modal content (relative to overlay)
  STICKY_CART: 9000,       // Sticky cart bar
  TOAST: 10000             // Success toast notifications
};
```

### Feature Flags

```javascript
// Feature toggles (can be moved to Shopify metafields)
const FEATURE_FLAGS = {
  AUTO_SELECT_VARIANTS: true,    // Auto-select first variant on modal open
  CLOSE_MODAL_ON_ADD: true,      // Close modal after adding to pair
  SHOW_INCOMPLETE_PAIRS: true,   // Show sticky cart with 1 product
  BYPASS_REBUY: true,            // Prevent Rebuy cart drawer on checkout
  SHOW_LIVE_ACTIVITY: true       // Show live activity indicator
};
```

### Animation Timings

```javascript
// CSS transition durations (milliseconds)
const ANIMATION_TIMINGS = {
  MODAL_FADE: 300,         // Modal fade in/out
  TOAST_DURATION: 3000,    // Toast notification display time
  CAROUSEL_TRANSITION: 400 // Image carousel fade
};
```

### Session Storage Keys

```javascript
// SessionStorage keys
const STORAGE_KEYS = {
  BOGO_STATE: 'bogo-builder-state',       // Persistent cart state
  DIRECT_CHECKOUT: 'bogo-direct-checkout' // Rebuy bypass flag
};
```

### API Endpoints

```javascript
// Shopify API endpoints
const SHOPIFY_API = {
  CART_ADD: '/cart/add.js',
  CART_CLEAR: '/cart/clear.js',
  CART_GET: '/cart.js',
  CART_UPDATE: '/cart/update.js'
};
```

### Color Palette

```javascript
// BOGO Builder color scheme
const COLORS = {
  PRIMARY: '#60c655',        // Green (buttons, accents)
  PRIMARY_HOVER: '#50b645',  // Darker green
  BACKGROUND: '#000000',     // Black background
  TEXT_PRIMARY: '#ffffff',   // White text
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.8)',
  ACCENT_YELLOW: '#fbbf24',  // Incomplete pair indicator
  ERROR: '#ff3b30'           // Error/discount badge
};
```

---

## Usage Notes

### Implementation Checklist

1. **Copy Files**:
   - Add `sections/bogo-builder-2024.liquid` to theme
   - Add `snippets/buy-now-popup.liquid` to theme
   - Merge CSS into `assets/bogo-builder.css` (or create new file)
   - Merge JavaScript into `assets/bogo-builder.js` (or create new file)

2. **Create Discount Codes** in Shopify Admin:
   - `BLACKFRIDAY2025` - 50% off (applied via script or automatic discount)
   - `TIER2BONUS` - 5% off total order
   - `TIER3BONUS` - 10% off total order

3. **Configure Bonus Product**:
   - Update `BONUS_CABLE_VARIANT_ID` with correct variant ID
   - Ensure product is in stock

4. **Add Section to Page**:
   - Go to theme editor
   - Add "BOGO Builder 2024" section
   - Configure collections and settings

5. **Test Checkout Flow**:
   - Add 1 pair → verify 50% discount
   - Add 2 pairs → verify Tier 2 bonus
   - Add 3 pairs → verify FREE cable + Tier 3 bonus
   - Test on mobile devices

### Known Issues & Considerations

- **Rebuy Smart Cart**: If Rebuy updates, the bypass method may need adjustment
- **Discount Stacking**: Ensure Shopify discount codes are configured to stack correctly
- **Mobile Layout**: Test thoroughly on all device sizes
- **Performance**: With 50+ products, consider pagination or lazy loading
- **Browser Support**: CSS uses modern flexbox and grid (IE11 not supported)

### Future Enhancements

- Add pair preview images in sticky cart
- Implement drag-and-drop pair reordering
- Add "Quick Add" from product cards (skip modal)
- Save BOGO state to localStorage for persistence
- Add analytics tracking for pair building behavior
- Implement A/B testing for tier messaging

---

**End of Documentation**

For questions or issues, please reference the original session summary or contact the development team.
