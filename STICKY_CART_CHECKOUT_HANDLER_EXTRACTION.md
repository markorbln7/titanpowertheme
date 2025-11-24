# STICKY CART CHECKOUT HANDLER EXTRACTION

**Purpose:** Understand current checkout flow to add free gift logic
**Date:** 2025-11-24
**File Analyzed:** `assets/bf25-tier-cart.js`

---

## EXTRACTION 1: Checkout Button Handler (Lines 1185-1200)

**Command:** `grep -n -B10 -A40 "checkout|Checkout|/checkout" assets/bf25-tier-cart.js`

**Results:**

```javascript
bindEvents() {
  // View Cart Toggle
  if (this.elements.btnView) {
    this.elements.btnView.addEventListener('click', () => {
      this.toggleExpansion();
    });
  }

  // Buy Now (Navigate to Checkout)
  if (this.elements.btnBuy) {
    this.elements.btnBuy.addEventListener('click', () => {
      window.location.href = '/checkout';
    });
  }
}
```

**Keyboard Shortcut (Lines 1517-1523):**

```javascript
// 'C' key - Go to checkout
if (e.key === 'c' || e.key === 'C') {
  if (this.elements.btnBuy && e.shiftKey) {
    this.elements.btnBuy.click();
    e.preventDefault();
  }
}
```

**Finding:**
- Checkout button: `this.elements.btnBuy`
- Simple redirect: `window.location.href = '/checkout'`
- **NO gift logic before checkout**
- **NO cart validation before checkout**
- Keyboard shortcut: Shift+C triggers checkout

---

## EXTRACTION 2: Cart Data Access (Lines 1095-1148, 1221-1247)

**Command:** `grep -n -B5 -A15 "getCart|cart\.items|itemCount|cartData" assets/bf25-tier-cart.js`

### Cart State Management (Lines 1095-1112)

```javascript
constructor() {
  // Singleton pattern
  if (CartManager.instance) {
    return CartManager.instance;
  }
  CartManager.instance = this;

  // State
  this.state = 'idle'; // idle | updating | syncing | animating
  this.currentTier = null;
  this.itemCount = 0;
  this.previousTier = null;

  // Configuration
  this.tiers = BF25_TIERS;
  this.maxItems = 16;

  // DOM Cache
  this.elements = this.cacheDOM();

  // Initialize
  this.init();
}
```

### Cart Fetching (Lines 1646-1659)

```javascript
async fetchCart() {
  try {
    const response = await fetch('/cart.js', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Cart fetch failed: ${response.status}`);
    }

    // Returns full cart object with items array
    return await response.json();
  } catch (error) {
    console.error('[BF25 Cart] Fetch error:', error);
    return null;
  }
}
```

### Item Count Calculation (Lines 1221-1247)

```javascript
calculateTier(itemCount) {
  return this.tiers.find(t => itemCount >= t.min && itemCount <= t.max) || this.tiers[0];
}

updateVisualization(itemCount) {
  // Start performance tracking
  window.BF25Performance.startOperation('updateVisualization');

  // Clamp to max items
  this.itemCount = Math.min(itemCount, this.maxItems);

  // Store previous tier for comparison
  this.previousTier = this.currentTier;

  // Calculate new tier
  this.currentTier = this.calculateTier(this.itemCount);

  console.log(`[BF25 Cart] Update: ${this.itemCount} items → Tier ${this.currentTier.id} (${this.currentTier.badge})`);

  // Update all UI components
  this.updateColors();
  this.updateSegments();
  this.updateLabels();
  this.updateGifts();
  this.updateIncentiveMessage();
  this.updateSavings();
  this.updateARIA();

  // Check for tier unlock...
}
```

**Finding:**
- Cart data accessed via `fetch('/cart.js')`
- Item count stored in `this.itemCount`
- Current tier stored in `this.currentTier`
- Full cart object has `cart.items` array

---

## EXTRACTION 3: Tier Calculation (Lines 1221-1246, 1731-1749)

**Command:** `grep -n -B5 -A20 "calculateTier|getCurrentTier|tierLevel" assets/bf25-tier-cart.js`

### Tier Lookup (Lines 1221-1223)

```javascript
calculateTier(itemCount) {
  return this.tiers.find(t => itemCount >= t.min && itemCount <= t.max) || this.tiers[0];
}
```

### Savings Calculation (Lines 1731-1749)

```javascript
/**
 * Calculate actual savings (discount + gift value)
 */
calculateSavings(cart) {
  if (!cart || !cart.items) return 0;

  const subtotal = this.calculateSubtotal(cart);
  const itemCount = this.calculateItemCount(cart);
  const tier = this.calculateTier(itemCount);

  // Discount savings (if tier has multiplier)
  let discountSavings = 0;
  if (tier.multiplier) {
    const fullPrice = subtotal / tier.multiplier; // Reverse calculate full price
    discountSavings = fullPrice - subtotal;
  }

  // Gift value savings
  const giftValue = tier.gifts.reduce((sum, gift) => sum + gift.value, 0);

  return Math.round(discountSavings + giftValue);
}
```

**Finding:**
- Simple tier lookup by item count range
- No separate `getCurrentTier()` method - uses `this.currentTier`
- Savings = discount savings + gift value
- Tier has `gifts` array with `value` property

---

## EXTRACTION 4: Existing Gift Logic

**Command:** `grep -n -B5 -A15 "gift|free|bonus|8660340179122|8363826348210|8472093786290|8660337950898" assets/bf25-tier-cart.js`

### Gift Product Configuration (Lines 10-42)

```javascript
// ============================================
// GIFT PRODUCT CONFIGURATION
// ============================================
const GIFT_PRODUCTS = {
  cable: {
    handle: 'bf25sc-free-cable',
    variantId: null, // Will be fetched dynamically
    tier: 1,
    emoji: '🔌',
    name: 'Premium Cable'
  },
  case: {
    handle: 'bf25sc-free-case',
    variantId: null,
    tier: 2,
    emoji: '📦',
    name: 'Protective Case'
  },
  magnetic: {
    handle: 'bf25sc-free-magnetic-set',
    variantId: null,
    tier: 3,
    emoji: '🧲',
    name: 'Magnetic Set'
  },
  mystery: {
    handle: 'bf25sc-free-mystery-box',
    variantId: null,
    tier: 4,
    emoji: '🎁',
    name: 'Mystery Box'
  }
};
```

### Tier Configuration with Gifts (Lines 47-116)

```javascript
const BF25_TIERS = [
  {
    id: 0,
    min: 0,
    max: 3,
    discount: "50%",
    badge: "50% OFF",
    color: "#6b7280",
    glowColor: "#a1a1aa",
    glow: "rgba(107, 114, 128, 0.3)",
    gifts: []  // Tier 0: No gifts
  },
  {
    id: 1,
    min: 4,
    max: 7,
    discount: "60%",
    badge: "🔥 60% OFF",
    color: "#60c655",
    glowColor: "#7FFF00",
    glow: "rgba(96, 198, 85, 0.5)",
    gifts: [{ name: "Cable", emoji: "🔌", value: 30 }]  // Tier 1: Cable
  },
  {
    id: 2,
    min: 8,
    max: 11,
    discount: "70%",
    badge: "⭐ 70% OFF",
    color: "#60c655",
    glowColor: "#39FF14",
    glow: "rgba(127, 255, 0, 0.6)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 }
    ]  // Tier 2: Cable + Case
  },
  {
    id: 3,
    min: 12,
    max: 15,
    discount: "80%",
    badge: "🚀 80% OFF",
    color: "#FFD700", // GOLD
    glowColor: "#FFF700",
    glow: "rgba(255, 215, 0, 0.7)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 },
      { name: "Magnetic Set", emoji: "🧲", value: 60 }
    ],  // Tier 3: Cable + Case + Magnetic
    isDecoy: true  // Note: Marked as decoy tier
  },
  {
    id: 4,
    min: 16,
    max: 999,
    discount: "85%",
    badge: "💎 85% OFF",
    color: "#E0F7FF", // PLATINUM
    glowColor: "#FFFFFF",
    glow: "rgba(224, 247, 255, 0.8)",
    gifts: [
      { name: "Cable", emoji: "🔌", value: 30 },
      { name: "Case", emoji: "📦", value: 35 },
      { name: "Magnetic Set", emoji: "🧲", value: 60 },
      { name: "Mystery Box", emoji: "🎁", value: 150 }
    ]  // Tier 4: All gifts
  }
];
```

### Gift Detection in Cart (Lines 1672-1699, 1707-1726)

```javascript
/**
 * Calculate non-gift item count
 * Excludes any items with 'BF25-Gift' tag or in gift list
 */
calculateItemCount(cart) {
  if (!cart || !cart.items) return 0;

  // Gift product handles (to be excluded from count)
  const giftHandles = [
    'bf25sc-free-cable',
    'bf25sc-free-case',
    'bf25sc-free-magnetic-set',
    'bf25sc-free-mystery-box'
  ];

  let count = 0;
  cart.items.forEach(item => {
    // Skip gift items
    const isGift = giftHandles.some(handle =>
      item.handle && item.handle.includes(handle)
    );

    if (!isGift) {
      count += item.quantity;
    }
  });

  return count;
}

/**
 * Calculate cart subtotal (excluding gifts)
 */
calculateSubtotal(cart) {
  if (!cart || !cart.items) return 0;

  const giftHandles = [
    'bf25sc-free-cable',
    'bf25sc-free-case',
    'bf25sc-free-magnetic-set',
    'bf25sc-free-mystery-box'
  ];

  let subtotal = 0;
  cart.items.forEach(item => {
    const isGift = giftHandles.some(handle =>
      item.handle && item.handle.includes(handle)
    );

    if (!isGift) {
      subtotal += item.final_line_price;
    }
  });

  return subtotal / 100; // Convert cents to euros
}
```

### Add Gift to Cart (Lines 1994-2047)

```javascript
/**
 * Add a specific gift product to cart via Shopify API
 * @param {string} handle - Product handle (e.g., 'bf25sc-free-cable')
 * @param {number} tier - Tier number for logging
 * @returns {Promise<boolean>} - Success status
 */
async addGiftToCart(handle, tier) {
  console.log(`[BF25 Cart] API: Adding gift for tier ${tier} (${handle})`);

  const maxRetries = 3;
  const baseDelay = 100; // Start with 100ms

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Fetch product to get variant ID
      const productResponse = await fetch(`/products/${handle}.js`);

      if (!productResponse.ok) {
        throw new Error(`Product fetch failed: ${productResponse.status}`);
      }

      const product = await productResponse.json();

      if (!product.variants || product.variants.length === 0) {
        throw new Error('No variants found for gift product');
      }

      const variantId = product.variants[0].id;

      // Add to cart with quantity 1
      const addResponse = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
          properties: {
            '_gift_tier': tier,
            '_is_free_gift': 'true'
          }
        })
      });

      if (!addResponse.ok) {
        throw new Error(`Cart add failed: ${addResponse.status}`);
      }

      console.log(`[BF25 Cart] ✅ Gift added successfully (${handle})`);
      return true;

    } catch (error) {
      console.error(`[BF25 Cart] Gift add attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return false;
}
```

**Finding:**
✅ **Comprehensive gift system already exists**
- Gift handles defined in `GIFT_PRODUCTS`
- Each tier has `gifts` array
- `addGiftToCart()` method adds gifts via `/cart/add.js`
- Gifts have `_gift_tier` and `_is_free_gift` properties
- Gift detection works via handle matching
- **NO automatic gift addition on checkout**

---

## EXTRACTION 5: Cart API Calls (Lines 1646-1655, 2023-2033, 2314-2324, 2368-2377, 2548-2549)

**Command:** `grep -n -B3 -A10 "fetch.*cart|/cart/add|/cart/update|/cart/clear" assets/bf25-tier-cart.js`

### Cart Fetch (Lines 1646-1659)

```javascript
async fetchCart() {
  try {
    const response = await fetch('/cart.js', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Cart fetch failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[BF25 Cart] Fetch error:', error);
    return null;
  }
}
```

### Cart Add (Lines 2023-2033)

```javascript
const addResponse = await fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: variantId,
    quantity: 1,
    properties: {
      '_gift_tier': tier,
      '_is_free_gift': 'true'
    }
  })
});
```

### Cart Change/Update (Lines 2368-2377)

```javascript
// Remove via cart update
const response = await fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: giftItem.key,
    quantity: 0
  })
});
```

**Finding:**
- **GET** `/cart.js` - Fetch full cart
- **POST** `/cart/add.js` - Add items with properties
- **POST** `/cart/change.js` - Update/remove items by key

---

## CRITICAL FINDINGS

### 1. Checkout Flow (INCOMPLETE)

**Current Implementation:**
```javascript
// Buy Now button handler (Line 1198)
this.elements.btnBuy.addEventListener('click', () => {
  window.location.href = '/checkout';
});
```

**Issues:**
❌ No gift validation before checkout
❌ No check if current tier's gifts are in cart
❌ Direct redirect with no pre-checkout logic
❌ Gifts might not be added if user goes straight to checkout

---

### 2. Gift System (COMPLETE BUT UNUSED AT CHECKOUT)

**What Exists:**
✅ Gift product handles defined (`GIFT_PRODUCTS`)
✅ Tier-to-gift mapping in `BF25_TIERS`
✅ `addGiftToCart(handle, tier)` method with retry logic
✅ Gift detection in `calculateItemCount()` and `calculateSubtotal()`
✅ Gift properties: `_gift_tier`, `_is_free_gift`

**What's Missing:**
❌ Checkout button doesn't trigger gift addition
❌ No validation that tier gifts are in cart before checkout
❌ No loading state during gift addition

---

### 3. Current State Access

**Available Data:**
```javascript
// In CartManager instance
this.currentTier       // Current tier object (id, gifts, etc.)
this.itemCount         // Non-gift item count
this.state             // 'idle' | 'updating' | 'syncing' | 'animating'

// Methods
await this.fetchCart()              // Get full cart object
this.calculateTier(itemCount)       // Get tier for count
await this.addGiftToCart(handle, tier)  // Add gift
```

---

## RECOMMENDED CHECKOUT FLOW

### Step 1: Validate Cart State

```javascript
async validateCheckout() {
  // Prevent checkout if already processing
  if (this.state !== 'idle') {
    console.warn('[BF25 Cart] Cannot checkout - operation in progress');
    return false;
  }

  // Fetch current cart
  const cart = await this.fetchCart();
  if (!cart) {
    console.error('[BF25 Cart] Cannot checkout - failed to fetch cart');
    return false;
  }

  // Recalculate tier from cart
  const itemCount = this.calculateItemCount(cart);
  const tier = this.calculateTier(itemCount);

  return { cart, tier, itemCount };
}
```

---

### Step 2: Ensure Gifts Are Added

```javascript
async ensureGiftsInCart(tier, cart) {
  if (!tier || !tier.gifts || tier.gifts.length === 0) {
    return true; // No gifts for this tier
  }

  const giftHandles = [
    'bf25sc-free-cable',
    'bf25sc-free-case',
    'bf25sc-free-magnetic-set',
    'bf25sc-free-mystery-box'
  ];

  // Check which tier gifts are missing
  const missingGifts = [];

  for (const gift of tier.gifts) {
    // Map gift name to handle
    const giftName = gift.name.toLowerCase();
    let handle = null;

    if (giftName.includes('cable')) handle = 'bf25sc-free-cable';
    else if (giftName.includes('case')) handle = 'bf25sc-free-case';
    else if (giftName.includes('magnetic')) handle = 'bf25sc-free-magnetic-set';
    else if (giftName.includes('mystery')) handle = 'bf25sc-free-mystery-box';

    if (!handle) continue;

    // Check if gift is already in cart
    const giftInCart = cart.items.some(item =>
      item.handle && item.handle.includes(handle)
    );

    if (!giftInCart) {
      missingGifts.push(handle);
    }
  }

  // Add missing gifts
  if (missingGifts.length > 0) {
    console.log(`[BF25 Cart] Adding ${missingGifts.length} missing gifts before checkout`);

    for (const handle of missingGifts) {
      const success = await this.addGiftToCart(handle, tier.id);
      if (!success) {
        console.error(`[BF25 Cart] Failed to add gift: ${handle}`);
        return false;
      }
    }
  }

  return true;
}
```

---

### Step 3: Update Checkout Button Handler

```javascript
bindEvents() {
  // View Cart Toggle
  if (this.elements.btnView) {
    this.elements.btnView.addEventListener('click', () => {
      this.toggleExpansion();
    });
  }

  // Buy Now (Navigate to Checkout) - UPDATED
  if (this.elements.btnBuy) {
    this.elements.btnBuy.addEventListener('click', async () => {
      // Prevent double-click
      if (this.state !== 'idle') return;

      // Update state
      this.setState('syncing');

      // Show loading indicator
      const originalText = this.elements.btnBuy.textContent;
      this.elements.btnBuy.textContent = 'Processing...';
      this.elements.btnBuy.disabled = true;

      try {
        // Step 1: Validate cart
        const validation = await this.validateCheckout();
        if (!validation) {
          throw new Error('Checkout validation failed');
        }

        const { cart, tier } = validation;

        // Step 2: Ensure gifts are added
        const giftsAdded = await this.ensureGiftsInCart(tier, cart);
        if (!giftsAdded) {
          throw new Error('Failed to add tier gifts');
        }

        // Step 3: Navigate to checkout
        window.location.href = '/checkout';

      } catch (error) {
        console.error('[BF25 Cart] Checkout error:', error);

        // Show error to user
        if (window.BF25Toast) {
          window.BF25Toast.show(
            'Unable to proceed to checkout. Please try again.',
            'error',
            5000
          );
        }

        // Reset button
        this.elements.btnBuy.textContent = originalText;
        this.elements.btnBuy.disabled = false;
        this.setState('idle');
      }
    });
  }
}
```

---

## IMPLEMENTATION SUMMARY

### Required Changes

**File:** `assets/bf25-tier-cart.js`

**Line 1198 (Current):**
```javascript
this.elements.btnBuy.addEventListener('click', () => {
  window.location.href = '/checkout';
});
```

**Replace with:**
```javascript
this.elements.btnBuy.addEventListener('click', async () => {
  await this.handleCheckout();
});
```

**Add new method (after bindEvents):**
```javascript
async handleCheckout() {
  // Full implementation from Step 3 above
}
```

**Add helper methods:**
```javascript
async validateCheckout() {
  // Full implementation from Step 1 above
}

async ensureGiftsInCart(tier, cart) {
  // Full implementation from Step 2 above
}
```

---

## TESTING CHECKLIST

### Scenario 1: Tier 0 (No Gifts)
1. Add 1-3 items to cart
2. Click "Buy Now"
3. **Expected:** Direct checkout (no gift logic)

### Scenario 2: Tier 1 (Cable)
1. Add 4-7 items to cart
2. Click "Buy Now"
3. **Expected:** Cable added → redirect to checkout

### Scenario 3: Tier 4 (All Gifts)
1. Add 16+ items to cart
2. Click "Buy Now"
3. **Expected:** All 4 gifts added → redirect to checkout
4. **Verify:** Checkout shows gifts with price $0

### Scenario 4: Gifts Already in Cart
1. Add items to unlock tier
2. Gifts already added via tier unlock animation
3. Click "Buy Now"
4. **Expected:** No duplicate gifts → direct checkout

### Scenario 5: Error Handling
1. Disconnect network
2. Click "Buy Now"
3. **Expected:** Error toast, button resets, no redirect

---

## NEXT STEPS

1. **Add `handleCheckout()` method** to CartManager class
2. **Add `validateCheckout()` helper** for cart validation
3. **Add `ensureGiftsInCart()` helper** for gift reconciliation
4. **Update `bindEvents()` button handler** to call `handleCheckout()`
5. **Test all scenarios** above
6. **Add loading state UI** (button text + disabled state)
7. **Add error toasts** for failed checkout attempts
