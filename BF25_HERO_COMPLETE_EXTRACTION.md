# BF25 INTERACTIVE HERO - COMPLETE CODE EXTRACTION

**Date:** 2025-11-22
**Purpose:** Complete code package for Gemini Deep Think design overhaul
**Current Status:** Functional MVP with basic styling
**Goal:** Premium Apple/Tesla-level aesthetic redesign

---

## 📊 FILE STATISTICS

```
Total Lines: 1,780
Total Size:  72KB

Breakdown:
  427 lines - sections/section-bf25-hero.liquid (20KB) - HTML Structure & Schema
  817 lines - assets/bf25-hero.css (32KB)             - Styling & Animations
  536 lines - assets/bf25-hero.js (20KB)              - Interactivity & Logic
```

---

## 🎨 CURRENT DESIGN ANALYSIS

### Color Scheme
```
Primary Colors:
- #0a0a0a - Background (dark charcoal)
- #60c655 - Accent (Titan green)
- #50b045 - Secondary green
- #ffffff - White text

Supporting Colors:
- #e0e0e0 - Light gray
- #999999 - Medium gray
- #6b7280 - Slate gray
- #000000 - Pure black
```

### Key Design Elements

**1. Gift Box Layout (2x2 Grid)**
- Lines 114, 134, 143, 640 in CSS
- Grid changes to 2-column on mobile

**2. 16-Segment Slider Visualization**
- Uses `repeating-linear-gradient` (lines 299, 317)
- Segmented progress fill animation

**3. State Management**
- `.is-locked` / `.is-unlocked` classes
- Visual transitions for gift unlocks
- Lock icon changes (🔒 → ✅)

**4. Responsive Breakpoints**
```css
@media (min-width: 769px)  - Desktop layouts
@media (max-width: 768px)  - Mobile adjustments
@media (prefers-reduced-motion: reduce) - Accessibility
@media (prefers-contrast: high) - High contrast mode
```

---

## 🚨 CURRENT DESIGN ISSUES

Based on BF25 Hero review, the following need improvement:

1. **Visual Hierarchy** - Lacks clear focal points
2. **Gift Box Design** - Too basic, no premium feel
3. **Slider Aesthetics** - Functional but not engaging
4. **Typography** - Default fonts, no personality
5. **Spacing & Rhythm** - Inconsistent padding/margins
6. **Glassmorphic Effects** - Missing BOGO builder's premium look
7. **Animations** - Basic transitions, no celebration moments
8. **Mobile Experience** - Cramped, needs better touch targets

---

## 📁 COMPLETE FILE CONTENTS

### FILE 1: sections/section-bf25-hero.liquid (427 lines)

```liquid
{% if section.settings.enable_section %}
{{ 'bf25-hero.css' | asset_url | stylesheet_tag }}

{%- comment -%}
═══════════════════════════════════════════════════════════════════════
BF25 INTERACTIVE HERO SECTION - "POWER SLIDER"
═══════════════════════════════════════════════════════════════════════

Prompt: BF25-HERO-P1 (HTML Foundation)
Purpose: Interactive tier exploration hero for Black Friday 2025 campaign
Architecture: 6-prompt sequential build (this is Prompt 1 of 6)

Flow:
1. [P1] HTML structure + JSON data (THIS FILE)
2. [P2] CSS styling (glassmorphic design, 16-segment visualization)
3. [P3] JavaScript interactivity (slider logic, tier calculations)
4. [P4] Animations (gift unlocks, tier transitions)
5. [P5] Mobile optimizations (70% traffic priority)
6. [P6] Accessibility + performance (WCAG 2.2 AA, Lighthouse 90+)

═══════════════════════════════════════════════════════════════════════
{%- endcomment -%}

<section class="bf25-hero" id="bf25-hero-section">
  <div class="bf25-hero__container">

    {%- comment -%} ═══ HEADER ═══ {%- endcomment -%}
    <header class="bf25-hero__header">
      <h1 class="bf25-hero__heading">
        {{ section.settings.heading | default: "Build Your Black Friday Deal" }}
      </h1>
      <h2 class="bf25-hero__subheading">
        {{ section.settings.subheading | default: "Slide to unlock bigger discounts + premium gifts" }}
      </h2>
    </header>

    {%- comment -%} ═══ MAIN INTERACTIVE MODULE ═══ {%- endcomment -%}
    <div class="bf25-hero__module">

      {%- comment -%} ─── GIFT BOXES (4 Premium Gifts) ─── {%- endcomment -%}
      <div class="bf25-hero__gifts">

        {%- comment -%} Gift 1: 4-in-1 Cable (Tier 1, unlocks at 4 items) {%- endcomment -%}
        <div class="bf25-hero__gift-box" data-gift-id="cable" data-tier="1">
          <div class="bf25-hero__gift-image-wrapper">
            <img
              src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4_in_1_top_image_a895a2f4-c7a7-4e8f-889a-883407938d24.png?v=1763844565"
              alt="4-in-1 Cable"
              class="bf25-hero__gift-image"
              width="120"
              height="120"
              loading="lazy"
            >
            <div class="bf25-hero__gift-lock-icon" aria-hidden="true">🔒</div>
          </div>
          <div class="bf25-hero__gift-info">
            <span class="bf25-hero__gift-label">4-in-1 Cable</span>
            <span class="bf25-hero__gift-value">€30 value</span>
          </div>
        </div>

        {%- comment -%} Gift 2: Travel Case + Shipping (Tier 2, unlocks at 8 items) {%- endcomment -%}
        <div class="bf25-hero__gift-box" data-gift-id="case" data-tier="2">
          <div class="bf25-hero__gift-image-wrapper">
            <img
              src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Accessories_c231b53b-fd86-4714-b7bf-20dd5b47963e.png?v=1763844578"
              alt="Travel Case + Free Shipping"
              class="bf25-hero__gift-image"
              width="120"
              height="120"
              loading="lazy"
            >
            <div class="bf25-hero__gift-lock-icon" aria-hidden="true">🔒</div>
          </div>
          <div class="bf25-hero__gift-info">
            <span class="bf25-hero__gift-label">Case + Shipping</span>
            <span class="bf25-hero__gift-value">€35 value</span>
          </div>
        </div>

        {%- comment -%} Gift 3: Pre-Launch Set (Tier 3, unlocks at 12 items) {%- endcomment -%}
        <div class="bf25-hero__gift-box" data-gift-id="prelaunch" data-tier="3">
          <div class="bf25-hero__gift-image-wrapper">
            <img
              src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Untitled-3.png?v=1763847726"
              alt="Pre-Launch Set"
              class="bf25-hero__gift-image"
              width="120"
              height="120"
              loading="lazy"
            >
            <div class="bf25-hero__gift-lock-icon" aria-hidden="true">🔒</div>
          </div>
          <div class="bf25-hero__gift-info">
            <span class="bf25-hero__gift-label">Pre-Launch Set</span>
            <span class="bf25-hero__gift-value">€120 value</span>
          </div>
        </div>

        {%- comment -%} Gift 4: Mystery Box (Tier 4, unlocks at 16 items) {%- endcomment -%}
        <div class="bf25-hero__gift-box" data-gift-id="mystery" data-tier="4">
          <div class="bf25-hero__gift-image-wrapper">
            <img
              src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Accessories_c231b53b-fd86-4714-b7bf-20dd5b47963e.png?v=1763844578"
              alt="Mystery Gift Box"
              class="bf25-hero__gift-image"
              width="120"
              height="120"
              loading="lazy"
            >
            <div class="bf25-hero__gift-lock-icon" aria-hidden="true">🔒</div>
          </div>
          <div class="bf25-hero__gift-info">
            <span class="bf25-hero__gift-label">Mystery Box</span>
            <span class="bf25-hero__gift-value">€90 value</span>
          </div>
        </div>

      </div>

      {%- comment -%} ─── POWER SLIDER (0-16 items with 16-segment visualization) ─── {%- endcomment -%}
      <div class="bf25-hero__slider-wrapper">
        <div class="bf25-hero__visualization">
          <div class="bf25-hero__track"></div>
          <div class="bf25-hero__fill"></div>

          {%- comment -%} Checkpoint markers at 4, 8, 12, 16 {%- endcomment -%}
          <div class="bf25-hero__checkpoints">
            <div class="bf25-hero__checkpoint" data-tier="1" style="left: 25%;">
              <div class="bf25-hero__checkpoint-icon">⚡</div>
              <div class="bf25-hero__checkpoint-label">4</div>
            </div>
            <div class="bf25-hero__checkpoint" data-tier="2" style="left: 50%;">
              <div class="bf25-hero__checkpoint-icon">🎁</div>
              <div class="bf25-hero__checkpoint-label">8</div>
            </div>
            <div class="bf25-hero__checkpoint" data-tier="3" style="left: 75%;">
              <div class="bf25-hero__checkpoint-icon">🔥</div>
              <div class="bf25-hero__checkpoint-label">12</div>
            </div>
            <div class="bf25-hero__checkpoint" data-tier="4" style="left: 100%;">
              <div class="bf25-hero__checkpoint-icon">💎</div>
              <div class="bf25-hero__checkpoint-label">16</div>
            </div>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="16"
          step="1"
          value="0"
          class="bf25-hero__input"
          id="bf25-hero-slider"
          aria-label="Select number of items (0 to 16)"
          aria-valuemin="0"
          aria-valuemax="16"
          aria-valuenow="0"
          aria-valuetext="0 items selected. Slide to explore savings."
        >
      </div>

      {%- comment -%} ─── TIER CARD (Dynamic display based on slider value) ─── {%- endcomment -%}
      <div class="bf25-hero__card" data-active-tier="0">
        <div class="bf25-hero__card-header">
          <div class="bf25-hero__tier-badge">
            <span class="bf25-hero__tier-badge-text">SELECT ITEMS</span>
          </div>
          <div class="bf25-hero__discount-display">
            <span class="bf25-hero__discount-label">START EXPLORING</span>
          </div>
        </div>

        <div class="bf25-hero__card-body">
          <div class="bf25-hero__gift-list">
            <div class="bf25-hero__gift-list-item is-locked" data-gift="cable">
              <span class="bf25-hero__gift-list-icon">🔒</span>
              <span class="bf25-hero__gift-list-text">4-in-1 Cable</span>
            </div>
            <div class="bf25-hero__gift-list-item is-locked" data-gift="case">
              <span class="bf25-hero__gift-list-icon">🔒</span>
              <span class="bf25-hero__gift-list-text">Travel Case + Shipping</span>
            </div>
            <div class="bf25-hero__gift-list-item is-locked" data-gift="prelaunch">
              <span class="bf25-hero__gift-list-icon">🔒</span>
              <span class="bf25-hero__gift-list-text">Pre-Launch Set</span>
            </div>
            <div class="bf25-hero__gift-list-item is-locked" data-gift="mystery">
              <span class="bf25-hero__gift-list-icon">🔒</span>
              <span class="bf25-hero__gift-list-text">Mystery Box</span>
            </div>
          </div>
        </div>

        <div class="bf25-hero__card-footer">
          <div class="bf25-hero__pricing">
            <div class="bf25-hero__pricing-row">
              <span class="bf25-hero__pricing-label">Estimated Total:</span>
              <span class="bf25-hero__pricing-value">—</span>
            </div>
            <div class="bf25-hero__pricing-row bf25-hero__pricing-row--savings">
              <span class="bf25-hero__pricing-label">Total Savings:</span>
              <span class="bf25-hero__pricing-value bf25-hero__pricing-value--savings">—</span>
            </div>
          </div>

          <a href="{{ section.settings.cta_url | default: '#bf25-products' }}" class="bf25-hero__cta-button">
            {{ section.settings.cta_text | default: "Start Building Your Deal" }}
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

{%- comment -%}
═══════════════════════════════════════════════════════════════════════
JSON DATA STRUCTURE - Embedded for JavaScript access
═══════════════════════════════════════════════════════════════════════

This data will be parsed by bf25-hero.js (Prompt 3) to drive interactivity.
Includes: tier structure, gift data, pricing config, currency settings.
═══════════════════════════════════════════════════════════════════════
{%- endcomment -%}

<script type="application/json" id="bf25HeroData">
{
  "config": {
    "max_items": 16,
    "currency_symbol": "{{ cart.currency.symbol | default: '€' }}",
    "avg_price_retail": {{ section.settings.avg_price_retail | default: 40.00 | json }},
    "avg_price_shopify": {{ section.settings.avg_price_shopify | default: 20.00 | json }}
  },
  "gifts": [
    {
      "id": "cable",
      "name": "4-in-1 Cable",
      "value": 30.00,
      "tier": 1,
      "label": "Cable",
      "image_url": "https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4_in_1_top_image_a895a2f4-c7a7-4e8f-889a-883407938d24.png?v=1763844565"
    },
    {
      "id": "case",
      "name": "Travel Case + Free Shipping",
      "value": 35.00,
      "tier": 2,
      "label": "Case + Shipping",
      "image_url": "https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Accessories_c231b53b-fd86-4714-b7bf-20dd5b47963e.png?v=1763844578"
    },
    {
      "id": "prelaunch",
      "name": "Pre-Launch Set",
      "value": 120.00,
      "tier": 3,
      "label": "Pre-Launch Set",
      "image_url": "https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Untitled-3.png?v=1763847726"
    },
    {
      "id": "mystery",
      "name": "Mystery Gift Box",
      "value": 90.00,
      "tier": 4,
      "label": "Mystery Box",
      "image_url": "https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Accessories_c231b53b-fd86-4714-b7bf-20dd5b47963e.png?v=1763844578"
    }
  ],
  "tiers": [
    {
      "id": 0,
      "range": [0, 0],
      "multiplier": 1.0,
      "badge": "SELECT ITEMS",
      "display_label": "START EXPLORING",
      "color": "#999999",
      "icon": "🎯"
    },
    {
      "id": 1,
      "range": [1, 3],
      "multiplier": 1.0,
      "badge": "STANDARD",
      "display_label": "Full Price",
      "color": "#6b7280",
      "icon": "📦"
    },
    {
      "id": 2,
      "range": [4, 7],
      "multiplier": 0.91,
      "badge": "🔥 TIER 1",
      "display_label": "60% OFF",
      "color": "#60c655",
      "icon": "⚡"
    },
    {
      "id": 3,
      "range": [8, 11],
      "multiplier": 0.76,
      "badge": "⭐ TIER 2",
      "display_label": "75% OFF",
      "color": "#50b045",
      "icon": "🎁"
    },
    {
      "id": 4,
      "range": [12, 15],
      "multiplier": 0.65,
      "badge": "🚀 TIER 3",
      "display_label": "80% OFF",
      "color": "#60c655",
      "icon": "🔥"
    },
    {
      "id": 5,
      "range": [16, 16],
      "multiplier": 0.57,
      "badge": "💎 MAX TIER",
      "display_label": "85% OFF",
      "color": "#9D4EDD",
      "icon": "💎"
    }
  ]
}
</script>

{%- comment -%} JavaScript will be added in Prompt 3 {%- endcomment -%}
<script src="{{ 'bf25-hero.js' | asset_url }}" defer></script>

{% endif %}

{%- comment -%}
═══════════════════════════════════════════════════════════════════════
SHOPIFY THEME CUSTOMIZER SCHEMA
═══════════════════════════════════════════════════════════════════════
{%- endcomment -%}

{% schema %}
{
  "name": "BF25 Interactive Hero",
  "tag": "section",
  "class": "bf25-hero-section",
  "settings": [
    {
      "type": "header",
      "content": "📱 Content Settings"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Main Headline",
      "default": "Build Your Black Friday Deal",
      "info": "Large H1 text (24-48px responsive)"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subtitle",
      "default": "Slide to unlock bigger discounts + premium gifts",
      "info": "Secondary text below headline (14-18px responsive)"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "CTA Button Text",
      "default": "Start Building Your Deal →",
      "info": "Text displayed on the call-to-action button"
    },
    {
      "type": "text",
      "id": "cta_url",
      "label": "CTA Button Link",
      "default": "#bf25-products",
      "info": "Can use anchor links like #products or full URLs"
    },
    {
      "type": "header",
      "content": "💰 Pricing Configuration"
    },
    {
      "type": "paragraph",
      "content": "These values calculate estimated totals and savings. Retail price is compare_at_price. Base price has tier multipliers applied (0.91, 0.76, 0.65, 0.57 for tiers 1-4)."
    },
    {
      "type": "number",
      "id": "avg_price_retail",
      "label": "Average Retail Price",
      "default": 40,
      "info": "Original retail price used for savings calculation (e.g., €40)"
    },
    {
      "type": "number",
      "id": "avg_price_shopify",
      "label": "Average Base Price",
      "default": 20,
      "info": "Shopify price that tier multipliers apply to (e.g., €20)"
    },
    {
      "type": "header",
      "content": "🔧 Advanced Settings"
    },
    {
      "type": "checkbox",
      "id": "enable_section",
      "label": "Enable Hero Section",
      "default": true,
      "info": "Toggle section visibility on/off"
    }
  ],
  "presets": [
    {
      "name": "BF25 Interactive Hero",
      "category": "Promotional"
    }
  ]
}
{% endschema %}
```

---

