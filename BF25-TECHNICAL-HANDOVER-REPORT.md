# BF25 Black Friday Virtual Cart System - Technical Handover Report

**Date**: 2025-11-25
**System Version**: BF25-8.10b (latest)
**Purpose**: Complete technical documentation for AI assistant or developer continuation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Key Code Extractions](#2-key-code-extractions)
3. [Custom Events Reference](#3-custom-events-reference)
4. [Celebration Flow Diagram](#4-celebration-flow-diagram)
5. [Key Timing Values](#5-key-timing-values)
6. [Product Data Flow](#6-product-data-flow)
7. [Image Resolution Logic](#7-image-resolution-logic)
8. [Known Quirks & Gotchas](#8-known-quirks--gotchas)
9. [File Quick Reference](#9-file-quick-reference)
10. [Debug Commands](#10-debug-commands)

---

## 1. Architecture Overview

### System Purpose
The BF25 Virtual Cart is a localStorage-based cart system that provides instant UI updates without waiting for Shopify Cart API calls. It implements tier-based discounts (50% → 85% OFF) with gift unlocks at checkpoints (4, 8, 12, 16 items).

### Class Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Interaction                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│  ExpansionManager (bf25-expansion-core.js)                      │
│  - Modal control & UI rendering                                 │
│  - Entry point for all user actions                             │
│  - Coordinates TierCalculator + CartManager                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
┌──────────────────┐    ┌─────────────────────┐
│ TierCalculator   │    │   CartManager       │
│ (Pricing Logic)  │    │   (UI Updates)      │
│                  │    │                     │
│ - Cart-aware     │    │ - Reads from        │
│   pricing        │    │   BundleManager     │
│ - Combined qty   │    │ - Sticky cart UI    │
│ - Tier matching  │    │ - Celebration queue │
└──────────────────┘    └──────────┬──────────┘
                                   │
                                   ↓
                        ┌──────────────────────┐
                        │   BundleManager      │
                        │   (Storage)          │
                        │                      │
                        │ - localStorage       │
                        │ - Tier calculation   │
                        │ - Event dispatching  │
                        └──────────────────────┘
```

### Communication Flow

1. **User adds item** → ExpansionManager.addToBundleManager()
2. **ExpansionManager** → BundleManager.addItem()
3. **BundleManager** → Calculates tiers, dispatches events
4. **CartManager** → Listens for bf25:bundleUpdated, updates sticky cart UI
5. **CartManager** → Queues celebrations, shows sequentially

### Singleton Pattern

```javascript
// BundleManager uses singleton to ensure single source of truth
if (window.BF25BundleManager) {
  return window.BF25BundleManager;
}
window.BF25BundleManager = this;
```

---

## 2. Key Code Extractions

### 2.1 BundleManager Configuration (bf25-bundle-manager.js:52-59)

```javascript
const CONFIG = {
  STORAGE_KEY: 'bf25_bundle',
  SCHEMA_VERSION: 1,
  EXPIRATION_DAYS: 7,
  MAX_ITEMS: 999,  // Effectively unlimited (BF25-8.5)
  ANIMATION_SESSION_KEY: 'bf25_celebrated_tiers'
};
```

**Why Important**: Controls core behavior. MAX_ITEMS changed from 16→999 for unlimited items support.

### 2.2 Tier Definitions (section-bundle-builder-bf25.liquid:348-382)

```javascript
tiers: [
  {
    min: 1,
    max: 3,
    multiplier: 1.0,        // 100% of base price = 50% OFF
    displayLabel: "50% OFF",
    label: "Standard"
  },
  {
    min: 4,
    max: 7,
    multiplier: 0.91,       // 91% of base price = 60% OFF
    displayLabel: "60% OFF",
    label: "Better Deal"
  },
  {
    min: 8,
    max: 11,
    multiplier: 0.76,       // 76% of base price = 70% OFF
    displayLabel: "70% OFF",
    label: "Great Deal"
  },
  {
    min: 12,
    max: 15,
    multiplier: 0.65,       // 65% of base price = 80% OFF
    displayLabel: "80% OFF",
    label: "Best Deal"
  },
  {
    min: 16,
    max: 999,
    multiplier: 0.57,       // 57% of base price = 85% OFF
    displayLabel: "85% OFF",
    label: "Bigfoot Unlock"
  }
]
```

**Source of Truth**: All tier calculations reference this config. Loaded into ExpansionManager on init.

### 2.3 Event Dispatching (bf25-bundle-manager.js:345-359)

```javascript
_detectAndDispatchTransitions(prevState, currentState) {
  const prevTier = prevState.tierReached || 0;
  const currentTier = currentState.tierReached || 0;

  // TIER UNLOCKS (handle multi-tier jumps)
  if (currentTier > prevTier) {
    console.log(`[BF25 BundleManager] 🔥 Tier progression: ${prevTier} → ${currentTier}`);

    // Dispatch event for EACH tier jumped (for animation queue)
    for (let tier = prevTier + 1; tier <= currentTier; tier++) {
      console.log(`%c[BF25 BundleManager] 🎉 DISPATCHING bf25:tierUnlocked for Tier ${tier}`,
        'color: #60c655; font-weight: bold;');
      this._dispatchEvent('bf25:tierUnlocked', {
        tier: tier,
        // ...event details
      });
    }
  }
}
```

**Multi-Tier Jump Handling**: If user jumps from Tier 0 → Tier 2 (adds 8 items), dispatches TWO events (Tier 1 + Tier 2) so CartManager queues both celebrations.

### 2.4 Celebration Queue System (bf25-tier-cart.js:1270-1280, 1876-1910)

```javascript
// Initialization
this.celebrationQueue = [];
this.isCelebrating = false;
this._celebrationStarted = false; // Track first celebration delay (BF25-8.6)
this.celebrationDuration = 3200; // 3.2s total cycle time per celebration

// Queue Processing
async processCelebrationQueue() {
  if (this.celebrationQueue.length === 0) {
    this.isCelebrating = false;
    this._celebrationStarted = false; // Reset for next batch
    return;
  }

  this.isCelebrating = true;

  // FIRST celebration gets delay to let modal close (BF25-8.6)
  if (!this._celebrationStarted) {
    this._celebrationStarted = true;
    console.log('[BF25 Cart] Waiting 600ms for modal to close...');
    await this.delay(600);
  }

  const celebration = this.celebrationQueue.shift();
  console.log(`[BF25 Cart] Showing celebration: ${celebration.title} (${celebration.discountPercent}% OFF)`);

  // Show this celebration with discount info
  await this.showGiftCelebration(
    celebration.title,
    celebration.image,
    celebration.checkpoint,
    celebration.value,
    celebration.discountPercent
  );

  // Wait 2.8s gap between celebrations (BF25-8.6)
  await this.delay(2800);

  // Process next in queue (recursive)
  this.processCelebrationQueue();
}
```

**Sequential Coordination**: Uses async/await + Promise to show celebrations one at a time. First celebration waits 600ms for modal to close smoothly.

### 2.5 Celebration HTML Template (bf25-tier-cart.js:1943-1967)

```javascript
celebration.innerHTML = `
  <div class="bf25sc-celebration-content">
    <div class="bf25sc-celebration-glow"></div>

    <!-- DISCOUNT HEADLINE - Big and prominent (BF25-8.6) -->
    <div class="bf25sc-celebration-discount">${discountPercent}% OFF</div>

    <!-- Plus free gift badge -->
    <div class="bf25sc-celebration-badge">+ FREE GIFT UNLOCKED!</div>

    <!-- Product image -->
    <div class="bf25sc-celebration-product">
      <img src="${imageUrl}" alt="${giftTitle}" class="bf25sc-celebration-image">
    </div>

    <!-- Gift title -->
    <div class="bf25sc-celebration-title">${giftTitle}</div>

    <!-- Gift value -->
    ${valueDisplay ? `<div class="bf25sc-celebration-value">${valueDisplay}</div>` : ''}
  </div>
`;
```

**Discount Prominence**: 48px green discount headline appears ABOVE gift badge to emphasize tier unlock (BF25-8.6).

### 2.6 Cart-Aware Pricing (bf25-expansion-core.js:935-994)

```javascript
calculateCartAwarePricing() {
  // Get base pricing for current modal selection
  const basePricing = this.calculatePricing();
  if (!basePricing) return null;

  // Get combined quantity (cart + modal)
  const cartQuantity = this.manager.cartManager.getCartQuantity(false);
  const modalQuantity = this.state.get('quantity');
  const combinedQuantity = cartQuantity + modalQuantity;

  // Determine tier based on COMBINED quantity
  const combinedTier = this.getTierForQuantity(combinedQuantity);
  const combinedDiscount = combinedTier?.discount || 0;

  // Get next tier based on combined quantity
  const nextTier = this.getNextTier(combinedQuantity);
  const itemsToNextTier = nextTier ? nextTier.min - combinedQuantity : 0;

  // Calculate what the combined order would cost at combined tier discount
  const combinedPricePerItem = this.calculateDiscountedPrice(
    basePricing.basePricePerItem,
    combinedDiscount
  );

  const combinedTotal = combinedPricePerItem * combinedQuantity;
  const combinedSavings = (basePricing.basePricePerItem * combinedQuantity) - combinedTotal;

  // Return enhanced pricing object
  return {
    ...basePricing,  // Include all base pricing

    // Cart awareness
    cartQuantity,
    modalQuantity,
    combinedQuantity,

    // Combined tier information
    combinedTier,
    combinedDiscount,
    combinedPricePerItem,
    combinedTotal,
    combinedSavings,

    // Next tier (based on combined)
    nextTierCombined: nextTier,
    itemsToNextTierCombined: itemsToNextTier,

    // Flags
    hasCart: cartQuantity > 0,
    willUnlockTier: combinedDiscount > basePricing.discountPercent
  };
}
```

**Critical**: Badge/messaging uses `combinedTier` to show "Add 1 more for 70% OFF" when user has 7 items in cart + 1 in modal = 8 total = unlocks Tier 2.

### 2.7 Reading from BundleManager (bf25-expansion-core.js:2370-2398)

```javascript
getCartQuantity(bf25Only = false) {
  // PRIMARY: Read from BundleManager (virtual cart) - BF25-FIX-CART-AWARE-USE-BUNDLEMANAGER
  if (window.BF25BundleManager) {
    const itemCount = window.BF25BundleManager.bundle?.computed?.itemCount || 0;

    if (this.config?.debug) {
      console.log('🛒 getCartQuantity from BundleManager:', itemCount);
    }

    return itemCount;
  }

  // FALLBACK: Read from Shopify cart state (legacy)
  const cartItems = this.state.get('cartItems');

  if (!cartItems || cartItems.length === 0) {
    return 0;
  }

  if (bf25Only) {
    // Only count items from BF25 Builder
    return cartItems
      .filter(item => item.properties?._source === 'BF25 Bundle Builder')
      .reduce((total, item) => total + item.quantity, 0);
  } else {
    // Count all items
    return this.state.get('cartItemCount') || 0;
  }
}
```

**Always Read BundleManager First**: Cart-aware pricing must read from localStorage virtual cart, NOT Shopify API (which is slow/stale).

### 2.8 Dual-Mode Quantity Controls (bf25-expansion-core.js:3908-3918)

```javascript
generateQuantityControls() {
  if (this.config.debug) {
    console.log('🎮 generateQuantityControls: Rendering pack buttons + stepper');
  }

  // Generate BOTH controls (always show both for dual-mode layout)
  const packButtonsHTML = this.generatePowerPacksUI();
  const stepperHTML = this.generateIndividualProductsUI();

  return packButtonsHTML + stepperHTML;
}
```

**BF25-RESTORE-QUANTITY-STEPPER**: Returns BOTH pack buttons (4, 8, 12) AND quantity stepper (+/- buttons). Both visible and functional simultaneously.

### 2.9 Event Binding (bf25-expansion-core.js:4998-5010)

```javascript
bindQuantityEvents() {
  // Always bind ALL event systems (dual-mode layout shows both controls)
  this.bindLiquidPackButtonEvents();    // Liquid template pack buttons
  this.bindPowerPacksEvents();          // JS-generated tier buttons
  this.bindIndividualProductsEvents();  // Quantity stepper

  // Bind action button events (Add to Cart, etc.)
  this.bindActionButtonEvents();

  if (this.config.debug) {
    console.log('✅ All quantity events bound (pack + tier + stepper)');
  }
}
```

**BF25-FIX-BIND-ALL-QUANTITY-EVENTS**: Always binds all three event systems, not mode-dependent. Ensures pack buttons and stepper both work.

### 2.10 GIFT_VARIANT_MAP (bf25-tier-cart.liquid:68-97)

```liquid
<!-- Gift icon slots at checkpoints (4, 8, 12, 16) -->
{% if i == 4 or i == 8 or i == 12 or i == 16 %}
{% assign gift_tier = 1 %}
{% assign gift_name = "100W 4-in-1 Cable" %}
{% assign gift_value = 30 %}
{% assign gift_image = "https://cdn.shopify.com/.../cable-gift.png" %}
{% if i == 8 %}
  {% assign gift_tier = 2 %}
  {% assign gift_name = "Premium Travel Case" %}
  {% assign gift_value = 35 %}
  {% assign gift_image = "https://cdn.shopify.com/.../case-gift.png" %}
{% elsif i == 12 %}
  {% assign gift_tier = 3 %}
  {% assign gift_name = "Magnetic Cable Organizer" %}
  {% assign gift_value = 60 %}
  {% assign gift_image = "https://cdn.shopify.com/.../magnetic-gift.png" %}
{% elsif i == 16 %}
  {% assign gift_tier = 4 %}
  {% assign gift_name = "Mystery Power Gift" %}
  {% assign gift_value = 150 %}
  {% assign gift_image = "https://cdn.shopify.com/.../mystery-gift.png" %}
{% endif %}

<div class="bf25sc-gift-slot"
     data-checkpoint-value="{{ i }}"
     data-state="locked"
     data-tier="{{ gift_tier }}"
     data-product-name="{{ gift_name }}"
     data-product-image="{{ gift_image }}"
     data-product-value="{{ gift_value }}">
```

**Gift Configuration**: Each checkpoint (4, 8, 12, 16) has gift metadata embedded in DOM. JavaScript reads from `data-*` attributes.

### 2.11 Progress Bar Structure (bf25-tier-cart.liquid:60-143)

```liquid
<!-- 16-Segment Structure (Flexbox Layout) -->
<div class="bf25sc-progress-bar__segments">
  {% for i in (1..16) %}
  <div
    class="bf25sc-progress-bar__segment"
    data-segment="{{ i }}"
    data-checkpoint="{% if i == 4 or i == 8 or i == 12 or i == 16 %}true{% else %}false{% endif %}"
  >
    <!-- Gift icon slots at checkpoints (4, 8, 12, 16) -->
    {% if i == 4 or i == 8 or i == 12 or i == 16 %}
      <div class="bf25sc-gift-slot" ...>
        <!-- Gift icon SVG with lightning bolt -->
        <!-- Lock overlay -->
        <!-- Product bubble -->
        <!-- Value flash -->
      </div>
    {% endif %}
  </div>
  {% endfor %}
</div>
```

**16 Real DOM Elements**: Each segment is an actual HTML element. JavaScript adds `.is-filled` class to light them up. Visual cap at 16 while `actualItemCount` tracks beyond.

---

## 3. Custom Events Reference

| Event Name | Dispatched By | Listened By | Payload | Purpose |
|------------|---------------|-------------|---------|---------|
| `bf25:bundleUpdated` | BundleManager | CartManager, ExpansionManager | `{ bundle, itemCount, tierReached }` | Notify all components that cart state changed |
| `bf25:tierUnlocked` | BundleManager | CartManager | `{ tier, itemCount, giftUnlocked, checkpoint }` | Queue tier celebration (multi-tier jumps dispatch multiple events) |
| `bf25:giftUnlocked` | BundleManager | CartManager | `{ giftName, checkpoint, tierReached }` | Queue gift celebration |
| `bf25:bundleLoaded` | BundleManager | CartManager | `{ bundle, itemCount, tierReached, giftsUnlocked }` | Restore UI state from localStorage on page load |
| `bf25:bundleExpired` | BundleManager | (none) | `{ expiredAt, itemCount }` | Log expired bundle (7 days) |
| `bf25:itemAdded` | BundleManager | CartManager | `{ product, quantity, bundle }` | Show "Added to cart" toast |
| `bf25:itemRemoved` | BundleManager | CartManager | `{ productId, variantId, bundle }` | Update UI after removal |

### Event Timing Flow

```
User clicks "Add to Cart"
  ↓
ExpansionManager.addToBundleManager()
  ↓
BundleManager.addItem()
  ↓
BundleManager._saveBundle()
  ↓
BundleManager._detectAndDispatchTransitions()
  ↓
┌─────────────────────────┬─────────────────────────┐
│ bf25:tierUnlocked       │ bf25:bundleUpdated      │
│ (if tier increased)     │ (always)                │
└────────┬────────────────┴───────────┬─────────────┘
         ↓                            ↓
CartManager.handleTierUnlocked()   CartManager.updateVisualization()
         ↓
celebrationQueue.push()
         ↓
processCelebrationQueue()
```

---

## 4. Celebration Flow Diagram

```
USER ADDS ITEMS
      ↓
BundleManager Detects Tier Jump (0 → 2)
      ↓
Dispatch TWO Events:
  - bf25:tierUnlocked (tier: 1)
  - bf25:tierUnlocked (tier: 2)
      ↓
CartManager.handleTierUnlocked() x2
      ↓
celebrationQueue = [
  { title: "4+ Items", discount: 60, checkpoint: 4 },
  { title: "8+ Items", discount: 70, checkpoint: 8 }
]
      ↓
processCelebrationQueue() starts
      ↓
[First Celebration]
  1. Check _celebrationStarted flag (false)
  2. Wait 600ms (modal close delay)
  3. Set _celebrationStarted = true
  4. Show celebration #1 (60% OFF)
  5. Animate for 3200ms (2500ms visible + 700ms fade)
  6. Wait 2800ms gap
      ↓
[Second Celebration]
  1. Check _celebrationStarted flag (true)
  2. Skip delay
  3. Show celebration #2 (70% OFF)
  4. Animate for 3200ms
  5. Wait 2800ms gap
      ↓
Queue empty → Reset _celebrationStarted = false
```

**Critical Timing**:
- First celebration: 600ms delay + 3200ms show + 2800ms gap = 6600ms total
- Subsequent celebrations: 3200ms show + 2800ms gap = 6000ms each

---

## 5. Key Timing Values

### Celebration System (bf25-tier-cart.js)

```javascript
// Line 1274: Total cycle time
this.celebrationDuration = 3200; // milliseconds

// Line 1890: First celebration delay (modal close)
await this.delay(600);

// Line 1906: Gap between celebrations
await this.delay(2800);
```

### CSS Animation Durations (bf25-tier-cart.css)

```css
/* Line 3056: Celebration entrance */
@keyframes bf25CelebrationSlideIn {
  0% { transform: translateY(100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.bf25sc-gift-celebration {
  animation: bf25CelebrationSlideIn 0.4s ease-out;
}

/* Line 3148: Jolt animation (gift unlock) */
@keyframes bf25CelebrationJolt {
  0% { transform: rotate(0deg); }
  15% { transform: rotate(-8deg); }
  30% { transform: rotate(8deg); }
  45% { transform: rotate(-8deg); }
  60% { transform: rotate(4deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}
/* Duration: 500ms */
```

### Modal Timing (bf25-expansion-core.js)

```javascript
// Modal fade-in (CSS transition)
.bf25-modal-overlay {
  transition: opacity 0.3s ease;
}

// Modal content slide-up (CSS transition)
.bf25-modal-content {
  transition: transform 0.4s ease-out, opacity 0.3s ease;
}
```

### Debounce Values (bf25-bundle-manager.js)

```javascript
// Line 308: Save bundle debounce
this._saveTimeout = setTimeout(() => {
  this._saveToStorage();
}, 100); // 100ms debounce
```

---

## 6. Product Data Flow

### Source: window.productData

```javascript
// Set by section-bundle-builder-bf25.liquid during page load
window.productData = {
  "product-handle-1": {
    title: "Product Name",
    price: 5999, // cents
    compare_at_price: 11999,
    available: true,
    featured_image: "https://...",
    url: "/products/...",
    variants: [
      {
        id: 40123456,
        title: "Variant Title",
        price: 5999,
        available: true,
        featured_image: "https://...",
        options: ["Red", "Large"] // Array format, not object!
      }
    ]
  }
};
```

**CRITICAL**: Variants use `options: ["value1", "value2"]` array format, NOT `options: { "Color": "Red" }` object format.

### Flow Through System

```
Page Load
  ↓
section-bundle-builder-bf25.liquid
  ↓
<script> window.productData = { ... } </script>
  ↓
ExpansionManager reads product via handle
  ↓
Finds matching variant by options array
  ↓
Passes to BundleManager.addItem({
  productId,
  variantId,
  handle,
  title,
  price,
  image,
  options: ["Red", "Large"]
})
  ↓
Stored in localStorage as bf25_bundle.items[]
  ↓
CartManager renders from BundleManager.bundle.items
```

---

## 7. Image Resolution Logic

### Three-Method Fallback Chain (bf25-expansion-core.js)

```javascript
// Method 1: Lookup by product handle in window.productData
const product = window.productData?.[upsell.handle];
if (product?.variants) {
  // Find variant by ID or first available
  const variant = product.variants.find(v => v.id === upsell.variantId)
                  || product.variants[0];
  imageUrl = variant?.featured_image || product.featured_image;
}

// Method 2: If no variants array, use product featured_image
if (!imageUrl && product?.featured_image) {
  imageUrl = product.featured_image;
}

// Method 3: DOM fallback (find img element with matching handle)
if (!imageUrl) {
  const imgElement = document.querySelector(`img[data-product-handle="${upsell.handle}"]`);
  if (imgElement) {
    imageUrl = imgElement.src || imgElement.dataset.src;
  }
}

// Final fallback: placeholder
if (!imageUrl) {
  imageUrl = 'https://via.placeholder.com/300x300?text=Product+Image';
}
```

### Debug Logging

```javascript
if (!product?.variants) {
  console.warn('[BF25 Modal] No variants array found, using fallback data', {
    handle: upsell.handle,
    productData: product
  });
}
```

**Common Issue**: Upsells showing placeholder boxes (📦) = `window.productData` missing variants array for that product.

---

## 8. Known Quirks & Gotchas

### 1. **Cart Quantity Must Read BundleManager First**
**Location**: bf25-expansion-core.js:2370-2398
**Issue**: If getCartQuantity() reads from Shopify cart API instead of BundleManager, cart-aware pricing shows stale data
**Fix**: Always check `window.BF25BundleManager.bundle?.computed?.itemCount` first

### 2. **Variant Matching Uses Array Format**
**Location**: All product data flows
**Issue**: `options: { "Color": "Red" }` will NOT match. Must use `options: ["Red", "Large"]`
**Fix**: Always pass options as array in correct order

### 3. **First Celebration Needs Modal Close Delay**
**Location**: bf25-tier-cart.js:1886-1891
**Issue**: Without delay, celebration appears while modal is still closing (jarring UX)
**Fix**: 600ms delay before first celebration only (uses `_celebrationStarted` flag)

### 4. **Progress Bar Visual Cap at 16**
**Location**: bf25-tier-cart.js:2619-2628
**Issue**: Only 16 DOM segments exist, but users can add 20+ items
**Fix**: Fill max 16 segments visually, track actual count in `actualItemCount` variable for tier calculation

### 5. **Pack Buttons Need Manual Sync**
**Location**: bf25-expansion-core.js:4902-4904
**Issue**: Two separate button systems (.js-pack-btn and .bf25-tier-button) don't auto-sync
**Fix**: Call both `updateTierButtonSelection()` AND `updatePackButtonSelection()` on quantity change

### 6. **Quantity Stepper Visibility Overrides**
**Location**: bf25-modal-design.css:3769-3784
**Issue**: Old CSS rules hide stepper with `display: none` or `visibility: hidden`
**Fix**: Added `!important` overrides to force visibility

### 7. **Discount Badge Shows Internal Label**
**Location**: section-bundle-builder-bf25.liquid:353
**Issue**: First tier showed "Standard" instead of "50% OFF"
**Fix**: Changed `displayLabel` from "Standard" to "50% OFF" in tier config

### 8. **Event Binding Must Always Bind All Systems**
**Location**: bf25-expansion-core.js:4998-5010
**Issue**: If binding is mode-dependent, pack buttons don't work in dual-mode layout
**Fix**: Always call all three: bindLiquidPackButtonEvents(), bindPowerPacksEvents(), bindIndividualProductsEvents()

### 9. **TierCalculator Methods Need this.manager Prefix**
**Location**: bf25-expansion-core.js:1250, 1254
**Issue**: Calling `getTierForQuantity()` instead of `this.manager.getTierForQuantity()` throws error
**Fix**: TierCalculator accesses parent methods via `this.manager` reference

### 10. **Duplicate Stepper Creation**
**Location**: bf25-expansion-core.js:3908-3918
**Issue**: Stepper was being created twice (once in generateQuantityControls(), once in updateTierMessaging())
**Fix**: Removed dynamic injection, only create in generateQuantityControls()

### 11. **Celebration Queue Requires Sequential Processing**
**Location**: bf25-tier-cart.js:1876-1910
**Issue**: Showing multiple celebrations simultaneously creates overlapping animations
**Fix**: Use async/await with Queue pattern, process one at a time

### 12. **Storage Fallback Chain**
**Location**: bf25-bundle-manager.js:469-485
**Issue**: Some browsers block localStorage (private mode, security policies)
**Fix**: Try localStorage → sessionStorage → in-memory object fallback

---

## 9. File Quick Reference

| File | Lines | Purpose | Key Sections |
|------|-------|---------|--------------|
| `assets/bf25-bundle-manager.js` | 1374 | Virtual cart storage, tier calculation | CONFIG (52-59), addItem (260-340), event dispatching (345-359) |
| `assets/bf25-tier-cart.js` | 3874 | Sticky cart UI, celebration queue | BF25_TIERS (77-140), queue (1270-1280), processCelebrationQueue (1876-1910) |
| `assets/bf25-expansion-core.js` | 6034 | Modal logic, pricing, event binding | TierCalculator (628+), CartManager (1378+), ExpansionManager (2430+) |
| `assets/bf25-tier-cart.css` | 3413 | Sticky cart styles, animations | Jolt animations (3148-3198), orphaned text fix (3341-3350) |
| `assets/bf25-modal-design.css` | ~3800 | Modal styles, badge, stepper | Inline badge (1496-1519), stepper dark theme (2448-2520), visibility overrides (3769-3784) |
| `sections/section-bundle-builder-bf25.liquid` | ~1200 | Product grid, tier config | Tier definitions (348-382), productData output (line ~800) |
| `sections/bf25-tier-cart.liquid` | ~400 | Sticky cart HTML structure | GIFT_VARIANT_MAP (68-97), 16 segments (60-143) |
| `snippets/buy-now-popup-bf25.liquid` | ~600 | Modal HTML template | Pack buttons (110-165), quantity stepper (154-180) |
| `sections/bf-promo-discount-2025.liquid` | 284 | Promo tier display | Hardcoded tiers with gifts (151-177) |

---

## 10. Debug Commands

### Console Inspection

```javascript
// View current bundle state
window.BF25BundleManager.getBundle()

// View item count
window.BF25BundleManager.bundle.computed.itemCount

// View current tier
window.BF25BundleManager.bundle.computed.tierReached

// View gifts unlocked
window.BF25BundleManager.bundle.computed.giftsUnlocked

// View celebration queue
window.BF25CartManager.celebrationQueue

// Check if celebrating
window.BF25CartManager.isCelebrating

// View all items
window.BF25BundleManager.bundle.items
```

### Manual Testing

```javascript
// Add 8 items to trigger Tier 2
for (let i = 0; i < 8; i++) {
  window.BF25BundleManager.addItem({
    productId: 7000000000000 + i,
    variantId: 40000000000000 + i,
    handle: `test-product-${i}`,
    title: `Test Product ${i}`,
    price: 5999,
    quantity: 1,
    options: ['Test']
  });
}

// Clear bundle
window.BF25BundleManager.clearBundle()

// Manually trigger celebration
window.BF25CartManager.handleTierUnlocked({
  detail: { tier: 2, checkpoint: 8, giftUnlocked: true }
})
```

### localStorage Inspection

```javascript
// View raw storage
JSON.parse(localStorage.getItem('bf25_bundle'))

// View celebrated tiers
JSON.parse(sessionStorage.getItem('bf25_celebrated_tiers'))

// Clear storage
localStorage.removeItem('bf25_bundle')
sessionStorage.removeItem('bf25_celebrated_tiers')
```

### Cart Quantity Debug

```javascript
// Check cart quantity source
if (window.BF25BundleManager) {
  console.log('BundleManager count:', window.BF25BundleManager.bundle?.computed?.itemCount);
}

// Check CartManager's getCartQuantity()
console.log('CartManager count:', window.BF25CartManager.getCartQuantity());

// Check if cart-aware pricing is working
const pricing = window.BF25ExpansionManager.tierCalculator.calculateCartAwarePricing();
console.log('Cart-aware pricing:', pricing);
```

### Event Listener Debug

```javascript
// Listen for all BF25 events
['bundleUpdated', 'tierUnlocked', 'giftUnlocked', 'bundleLoaded', 'itemAdded'].forEach(eventName => {
  document.addEventListener(`bf25:${eventName}`, (e) => {
    console.log(`🔔 Event: bf25:${eventName}`, e.detail);
  });
});
```

### Performance Monitoring

```javascript
// Count active animations
document.querySelectorAll('[style*="animation"]').length

// Count will-change declarations
document.querySelectorAll('[style*="will-change"]').length

// Measure FPS (open Chrome DevTools > Rendering > Frame Rendering Stats)
```

---

## Final Notes

### Critical Files to Preserve

1. **bf25-bundle-manager.js**: Core storage logic, DO NOT modify CONFIG without testing all flows
2. **section-bundle-builder-bf25.liquid**: Tier definitions source of truth
3. **bf25-tier-cart.js**: Celebration queue timing, DO NOT change timing values without UX review

### Breaking Changes to Avoid

- Changing tier min/max values without updating GIFT_VARIANT_MAP
- Modifying CONFIG.STORAGE_KEY (will lose all saved carts)
- Removing `_celebrationStarted` flag (breaks first celebration delay)
- Changing variant options format from array to object
- Removing BundleManager priority in getCartQuantity()

### Performance Constraints

- Max 10 active animations at once (reduced from 56 in BF25-8.4)
- Max 3200ms celebration duration (UX tested optimal)
- 600ms modal close delay required for smooth UX
- 2800ms gap between celebrations prevents fatigue

### Testing Checklist

- [ ] Add 1 item → Shows 50% OFF badge
- [ ] Add 4 items → 60% OFF celebration appears after 600ms
- [ ] Add 8 items → Two celebrations queue (60% + 70%)
- [ ] Open modal with 7 items in cart → Shows "Add 1 more for 70% OFF"
- [ ] Pack buttons (4, 8, 12) update quantity stepper
- [ ] Quantity stepper +/- updates pack button selection
- [ ] Upsells show product images, not placeholders
- [ ] Visual progress bar caps at 16, actual count tracks beyond
- [ ] localStorage persists across page refresh
- [ ] Celebration queue processes sequentially, not overlapping

---

**End of Technical Handover Report**
Generated: 2025-11-25
System Version: BF25-8.10b
