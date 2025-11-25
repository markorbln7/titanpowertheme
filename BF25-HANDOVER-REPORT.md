# BF25 Bundle Builder - Technical Handover Report

**Generated:** 2025-11-25 20:29:32
**Branch:** bf-2025-dev
**Codebase:** Titan Power Plus - Shopify Theme
**Purpose:** Comprehensive technical documentation for continued BF25 development

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tier System Configuration](#2-tier-system-configuration)
3. [Modal System](#3-modal-system)
4. [Cart-Aware Pricing](#4-cart-aware-pricing)
5. [Event Binding System](#5-event-binding-system)
6. [Quick-Add System](#6-quick-add-system)
7. [BundleManager (Virtual Cart)](#7-bundlemanager-virtual-cart)
8. [CSS Patterns](#8-css-patterns)
9. [Key HTML Structure](#9-key-html-structure)
10. [Known Issues & Gotchas](#10-known-issues--gotchas)
11. [Debug Commands](#11-debug-commands)
12. [File Reference](#12-file-reference)

---

## 1. Architecture Overview

### Class Hierarchy

The BF25 system consists of four main classes that work together:

```javascript
// Line 628: assets/bf25-expansion-core.js
class TierCalculator {
  constructor(manager) {
    this.manager = manager;  // Reference to ExpansionManager
    this.state = manager.state;
    this.config = manager.config;
  }
  // Handles: tier calculation, pricing logic, discount calculations
}

// Line 1378: assets/bf25-expansion-core.js
class CartManager {
  constructor(manager) {
    this.manager = manager;  // Reference to ExpansionManager
    this.state = manager.state;
    this.config = manager.config;
  }
  // Handles: virtual cart UI, celebrations, cart visualization
}

// Line 2430: assets/bf25-expansion-core.js
class ExpansionManager {
  constructor(config) {
    this.config = config;
    this.state = new StateManager();
    this.tierCalculator = new TierCalculator(this);
    this.cartManager = new CartManager(this);
  }
  // Handles: modal logic, event binding, product selection, quick-add
}

// Line 69: assets/bf25-bundle-manager.js
class BundleManager {
  constructor() {
    // Singleton pattern
    this.bundle = { items: [], computed: { itemCount: 0 } };
    this.storage = localStorage; // or sessionStorage/memory fallback
  }
  // Handles: virtual cart storage, localStorage persistence, events
}
```

### Relationship Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ExpansionManager                         │
│  (Modal Logic, Event Binding, Product Selection)            │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ TierCalculator   │  │  CartManager     │                │
│  │ (Pricing Logic)  │  │  (Cart UI)       │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ reads from
                            ▼
                  ┌──────────────────────┐
                  │   BundleManager      │
                  │  (Virtual Cart)      │
                  │  localStorage        │
                  └──────────────────────┘
```

### Global Window Variables

```javascript
// Exposed on window for cross-component access
window.bf25Expansion      // ExpansionManager instance
window.BF25BundleManager  // BundleManager singleton
window.bf25Config         // Configuration object
window.productData        // All products indexed by handle
window.productOptions     // Product options (colors, sizes, etc.)
window.productVariants    // Product variants with IDs
```

### Virtual Cart vs Shopify Cart

**Virtual Cart (BundleManager):**
- Stores items in `localStorage` under key `bf25_bundle`
- Does NOT use Shopify Cart API
- Items only added to real Shopify cart on checkout
- Allows unlimited items, tier-based discounts, gift unlocks
- Structure:
  ```javascript
  {
    items: [
      {
        variantId: 123456,
        quantity: 2,
        product: { title, image, price }
      }
    ],
    computed: {
      itemCount: 2,
      totalValue: 5000,
      currentTier: { min: 1, max: 3, discount: 0 }
    }
  }
  ```

**Why Virtual Cart?**
1. **Performance:** No server calls on item add/remove
2. **Flexibility:** Can manipulate quantities without Shopify rate limits
3. **Tier Logic:** Calculate discounts client-side before checkout
4. **User Experience:** Instant feedback, no loading spinners

---

## 2. Tier System Configuration

### Tier Structure

Located in `sections/section-bundle-builder-bf25.liquid` (lines 348-382):

```javascript
tiers: [
  {
    min: 1,
    max: 3,
    multiplier: 1.0,        // No discount (base price * 1.0)
    displayLabel: "50% OFF", // Shown in badge (user-facing)
    label: "Standard",      // Internal name
    badge: null
  },
  {
    min: 4,
    max: 7,
    multiplier: 0.91,       // 9% additional off (60% total)
    displayLabel: "60% OFF",
    label: "Better Deal",
    badge: "⚡ FREE: 4-in-1 Cable"
  },
  {
    min: 8,
    max: 11,
    multiplier: 0.76,       // 24% additional off (70% total)
    displayLabel: "70% OFF",
    label: "Great Deal",
    badge: "🎁 FREE: Cable + Travel Case"
  },
  {
    min: 12,
    max: 15,
    multiplier: 0.65,       // 35% additional off (80% total)
    displayLabel: "80% OFF",
    label: "Best Deal",
    badge: "🔥 FREE: Cables + Cases + Pre-Launch Set"
  },
  {
    min: 16,
    max: 999,
    multiplier: 0.57,       // 43% additional off (85% total)
    displayLabel: "85% OFF",
    label: "Bigfoot Unlock",
    badge: "💎 FREE: Mystery Box + VIP Status"
  }
]
```

### Tier Calculation Logic

**getTierForQuantity()** - Determines which tier applies:

```javascript
// ExpansionManager calls TierCalculator
const tier = this.tierCalculator.getTierForQuantity(quantity);

// Logic:
// - Finds tier where quantity >= min AND quantity <= max
// - Returns tier object with all properties
// - Used for: discount calculation, badge display, gift unlocks
```

### Combined Quantity (Cart-Aware)

**Key Innovation:** Tier based on CART + MODAL combined:

```javascript
// getCartQuantity() reads from BundleManager
const cartQuantity = this.manager.cartManager.getCartQuantity(false);
const modalQuantity = this.state.get('quantity');
const combinedQuantity = cartQuantity + modalQuantity;

// Tier calculated from combined total
const tier = this.getTierForQuantity(combinedQuantity);
```

**Example:**
- User has 5 items in cart (BundleManager)
- Opens modal, selects 1 item
- Combined quantity = 6 → Tier 2 (60% OFF)
- Message shows: "Add 2 more items to unlock 70% OFF"

---

## 3. Modal System

### Main Quantity Controls Method

**generateQuantityControls()** - Returns BOTH pack buttons + stepper (dual-mode):

```javascript
// Line 3896-3910: assets/bf25-expansion-core.js
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

**Why Both?**
- **Pack Buttons:** Quick tier selection (4, 8, 12 items)
- **Stepper:** Precise quantity control (+/- buttons)
- **User Choice:** Some prefer clicking "8 ITEMS", others prefer "+++ clicking"

### Cart-Aware Pricing Calculation

**calculateCartAwarePricing()** - Combines cart + modal:

```javascript
// Line 935-990: assets/bf25-expansion-core.js
calculateCartAwarePricing() {
  // Get base pricing for current modal selection
  const basePricing = this.calculatePricing();
  if (!basePricing) return null;

  // Get combined quantity
  const cartQuantity = this.manager.cartManager.getCartQuantity(false);
  const modalQuantity = this.state.get('quantity');
  const combinedQuantity = cartQuantity + modalQuantity;

  // Determine tier based on COMBINED quantity
  const combinedTier = this.getTierForQuantity(combinedQuantity);

  return {
    ...basePricing,
    cartQuantity,
    modalQuantity,
    combinedQuantity,
    combinedTier,
    itemsToNextTierCombined: nextTier.min - combinedQuantity
  };
}
```

---

## 4. Cart-Aware Pricing

### Reading from BundleManager

**getCartQuantity()** - PRIMARY method for cart quantity:

```javascript
// Line 2370-2398: assets/bf25-expansion-core.js
getCartQuantity(bf25Only = false) {
  // PRIMARY: Read from BundleManager (virtual cart)
  if (window.BF25BundleManager) {
    const itemCount = window.BF25BundleManager.bundle?.computed?.itemCount || 0;
    return itemCount;
  }

  // FALLBACK: Read from Shopify cart state (legacy)
  const cartItems = this.state.get('cartItems');
  return cartItems?.length || 0;
}
```

---

## 5. Event Binding System

### Master Binding Method

**bindQuantityEvents()** - Binds ALL control systems (dual-mode):

```javascript
// Line 4998-5010: assets/bf25-expansion-core.js
bindQuantityEvents() {
  // Always bind ALL event systems
  this.bindLiquidPackButtonEvents();    // Liquid template pack buttons
  this.bindPowerPacksEvents();          // JS-generated tier buttons
  this.bindIndividualProductsEvents();  // Quantity stepper
  this.bindActionButtonEvents();

  if (this.config.debug) {
    console.log('✅ All quantity events bound (pack + tier + stepper)');
  }
}
```

---

## 10. Known Issues & Gotchas

### 1. Variant Matching Format ⚠️ CRITICAL

**Problem:** `window.productVariants` stores options as **array**, not object properties.

```javascript
// ✓ CORRECT format:
{
  id: 123456,
  options: ["Black", "Large"]  // ← Array with indices
}

// ✗ WRONG:
{
  id: 123456,
  option1: "Black"  // ← Doesn't exist
}
```

### 2. 93 Pack Buttons on Page ⚠️

**Problem:** `.js-pack-btn` selector appears 93 times (Liquid template repeats).

**Solution:** Use event delegation on container (1 listener vs 93).

### 3. BundleManager vs Shopify Cart ⚠️

**Problem:** Must read from `BF25BundleManager`, not Shopify cart state.

**Why:** Virtual cart is source of truth. Shopify cart is empty until checkout.

### 4. displayLabel vs label ⚠️

```javascript
{
  label: "Standard",        // Internal name
  displayLabel: "50% OFF"   // Shown to user
}
```

Always use `displayLabel` for user-facing text.

---

## 11. Debug Commands

### Console Debugging

```javascript
// Check BundleManager state
window.BF25BundleManager.bundle
window.BF25BundleManager.bundle.computed.itemCount

// Check cart quantity
window.bf25Expansion.cartManager.getCartQuantity(false)

// Calculate cart-aware pricing
window.bf25Expansion.tierCalculator.calculateCartAwarePricing()

// Enable debug mode
window.bf25Config.debug = true
```

---

## 12. File Reference

### Core JavaScript Files

| File | Purpose | Key Classes |
|------|---------|------------|
| `assets/bf25-bundle-manager.js` | Virtual cart storage | `BundleManager` |
| `assets/bf25-expansion-core.js` | Modal logic, pricing | `ExpansionManager`, `TierCalculator`, `CartManager` |
| `assets/bf25-tier-cart.js` | Virtual cart UI | Cart rendering, celebrations |

### Key Line Numbers

**assets/bf25-expansion-core.js:**
- Line 628: `class TierCalculator`
- Line 935-990: `calculateCartAwarePricing()`
- Line 1378: `class CartManager`
- Line 2370-2398: `getCartQuantity()`
- Line 2430: `class ExpansionManager`
- Line 3896-3910: `generateQuantityControls()`
- Line 4998-5010: `bindQuantityEvents()`

---

**Report Generated:** 2025-11-25 20:29:32
**Branch:** bf-2025-dev
**Total Classes:** 4 (ExpansionManager, TierCalculator, CartManager, BundleManager)
**Tier Levels:** 5 (50%, 60%, 70%, 80%, 85% OFF)
