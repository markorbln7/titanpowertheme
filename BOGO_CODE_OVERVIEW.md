# BOGO BUILDER - CODE OVERVIEW FOR AI CONTEXT

**Document Purpose:** Provide critical code excerpts and architectural patterns for AI assistants working on the BOGO Builder system. Focuses on understanding over completeness.

**Last Updated:** 2025-11-15
**Branch:** bf-2025 (LIVE PRODUCTION)
**Prompt Code:** SH-HANDOVER-EXTRACTION-001

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### Core Data Flow

```
User clicks product
    ↓
Product data extracted (variantId, title, price, image)
    ↓
selectProduct() called
    ↓
Check currentPair.slot1 (empty?) → Fill slot1 → saveBOGOState() → updateStickyCart()
                        (filled?) → Check slot2 (empty?) → Fill slot2 → completePair()
                                                         (filled?) → Show "Pair full" error
    ↓
completePair() executes:
  - Move currentPair to pairs array
  - Reset currentPair to { slot1: null, slot2: null }
  - Increment activePairNumber
  - Trigger celebration animation
  - Check tier unlock
  - saveBOGOState()
  - updateStickyCart()
    ↓
localStorage updated (persistent across sessions)
window.bogoState updated (in-memory, current session)
    ↓
User clicks "Checkout"
    ↓
proceedToCheckout() validates, clears cart, adds items, redirects
    ↓
If user presses back: popstate handler cancels timeouts, clears state, resets UI
```

### Key Files & Responsibilities

- **`assets/bogo-builder.js`** (~7,500 lines): Main application logic
  - State management (save/load/sync)
  - Product selection flow
  - Pair completion logic
  - Checkout flow
  - Review system (270 reviews for 27 products)
  - Social proof (live activity, notifications)
  - Toast notifications
  - Sticky cart UI updates

- **`assets/bogo-builder.css`** (~7,000 lines): Styles and animations
  - Hero section with starfield background
  - Product cards with variant inline selection
  - Tier comparison cards
  - Sticky cart with battery progress
  - Review modal
  - Toast notifications
  - Mobile responsive (breakpoint: 768px)
  - Performance animations (GPU-accelerated)

- **`sections/bogo-builder-2024.liquid`** (~2,750 lines): HTML structure
  - Liquid template with Shopify product data
  - Hero section (countdown timer, battery bar)
  - Tier comparison cards
  - Product grid
  - Sticky cart structure
  - Review modal structure
  - Tailwind CSS CDN (REQUIRED - confirmed by Marko)

### State Management Architecture

**Dual-State System:**

1. **Persistent State** (`localStorage`)
   - Key: `'titan-bogo-state'`
   - Expires: 24 hours
   - Saved on: pair complete, slot1 fill (NEW), clear
   - Contains: `{ pairs, currentPair, activePairNumber, timestamp }`

2. **In-Memory State** (`window.bogoState`)
   - Active during session
   - Synced with localStorage
   - Includes DOM element references (NOT serializable)
   - Must stay in sync or causes "Pair full!" bugs

**Critical Pattern:** Both states must update together. Any state change MUST call `saveBOGOState()` to persist.

---

## 2. CRITICAL CODE SECTIONS

### 2.1 State Management

**State Structure:**
```javascript
// File: assets/bogo-builder.js
window.bogoState = {
  pairs: [
    {
      slot1: { variantId, title, price, image, element },  // More expensive (PAYS)
      slot2: { variantId, title, price, image, element },  // Cheaper (FREE)
      product1: { ... },  // Backwards compatibility
      product2: { ... },  // Backwards compatibility
      savings: number,    // Price of cheaper product
      pairNumber: number  // 1, 2, 3, etc.
    }
  ],
  currentPair: {
    slot1: product | null,
    slot2: product | null
  },
  activePairNumber: number  // Next pair number (e.g., if 2 pairs exist, this is 3)
};
```

**⚠️ CRITICAL:** `currentPair` must ALWAYS be `{ slot1: null, slot2: null }` structure, never `{}` or `undefined`.

---

**Save State Function (Lines 193-206):**
```javascript
function saveBOGOState() {
  try {
    const stateToSave = {
      pairs: window.bogoState.pairs || [],
      currentPair: window.bogoState.currentPair || {},
      activePairNumber: window.bogoState.activePairNumber || 1,  // ✅ ADDED (FIX)
      timestamp: Date.now()
    };
    localStorage.setItem(BOGO_STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('💾 BOGO state saved to localStorage');
  } catch (error) {
    console.warn('Failed to save BOGO state:', error);
  }
}
```

**WHY IT MATTERS:** This is called after EVERY state change. If not called, state is lost on page refresh.

---

**Load State Function (Lines 207-240):**
```javascript
function loadBOGOState() {
  try {
    const saved = localStorage.getItem(BOGO_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // Check expiry (24 hours)
    const age = Date.now() - (parsed.timestamp || 0);
    const maxAge = BOGO_EXPIRY_HOURS * 60 * 60 * 1000;

    if (age > maxAge) {
      console.log('⏰ BOGO state expired, clearing');
      localStorage.removeItem(BOGO_STORAGE_KEY);
      return null;
    }

    // CRITICAL: Apply migration to convert old data
    if (parsed.pairs && typeof migratePairData === 'function') {
      parsed.pairs = migratePairData(parsed.pairs);
    }

    console.log('📂 BOGO state loaded and migrated from localStorage');
    return parsed;
  } catch (error) {
    console.warn('Failed to load BOGO state:', error);
    localStorage.removeItem(BOGO_STORAGE_KEY);
    return null;
  }
}
```

**KEY POINTS:**
- 24-hour expiry prevents stale data
- Migration function handles old data formats
- Returns `null` if expired/invalid (triggers fresh initialization)

---

**State Initialization (Lines 494-568):**
```javascript
(function initBOGOState() {
  // Try to restore saved state
  const savedState = loadBOGOState();

  if (savedState && savedState.pairs && savedState.pairs.length > 0) {
    // Restore saved state
    window.bogoState = {
      pairs: savedState.pairs,
      currentPair: {
        // ✅ FIX: Explicitly ensure proper null structure (BOGO-SURGICAL-FIX-COMBINED-001)
        slot1: savedState.currentPair?.slot1 || null,
        slot2: savedState.currentPair?.slot2 || null
      },
      activePairNumber: savedState.activePairNumber || ((savedState.pairs.length || 0) + 1)  // ✅ FIX
    };
    console.log('✅ BOGO state restored from localStorage:', window.bogoState.pairs.length, 'pairs');

    // Update sticky cart to show restored pairs
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof updateStickyCart === 'function') {
          updateStickyCart();
        }
      });
    } else {
      setTimeout(() => {
        if (typeof updateStickyCart === 'function') {
          updateStickyCart();
        }
      }, 100);
    }
  } else {
    // Initialize fresh state
    window.bogoState = {
      pairs: [],
      currentPair: {
        slot1: null,
        slot2: null
      },
      activePairNumber: 1
    };
    console.log('✅ BOGO state initialized (fresh)');
  }

  // ✅ FIX: Validate and auto-fix corrupted state (BOGO-SURGICAL-FIX-COMBINED-001)
  if (window.bogoState.currentPair) {
    const cp = window.bogoState.currentPair;

    // Defensive: If both slots somehow filled on load, auto-complete the pair
    if (cp.slot1 && cp.slot2) {
      console.warn('⚠️ currentPair had both slots filled on load - auto-completing');

      window.bogoState.pairs.push({
        slot1: cp.slot1,
        slot2: cp.slot2,
        product1: cp.slot1,
        product2: cp.slot2,
        savings: Math.min(cp.slot1.price || 0, cp.slot2.price || 0),
        pairNumber: window.bogoState.activePairNumber
      });

      window.bogoState.currentPair = { slot1: null, slot2: null };
      window.bogoState.activePairNumber++;
      saveBOGOState();
    }

    // Log incomplete pair for debugging
    if ((cp.slot1 && !cp.slot2) || (!cp.slot1 && cp.slot2)) {
      console.log('✅ Incomplete pair restored:', cp.slot1 ? 'slot1 filled' : 'slot2 filled');
    }
  }
})();
```

**WHY THIS MATTERS:**
- IIFE runs immediately on page load
- Validates state structure (prevents `currentPair = {}` bug)
- Auto-fixes corrupted states (both slots filled shouldn't happen)
- Calls `updateStickyCart()` to sync UI

---

### 2.2 Product Selection Flow

**Main Product Click Handler (Lines 911-945):**
```javascript
function selectProduct(productData) {
  const state = window.bogoState;

  // Determine which slot to fill
  if (!state.currentPair.slot1) {
    // Fill first slot
    state.currentPair.slot1 = productData;
    highlightProduct(productData.element, 1, state.activePairNumber);
    showNotification(`${productData.title} added to Pair ${state.activePairNumber} (Slot 1) ✓`);

    // ✅ FIX: Save state immediately after slot1 fill (BOGO-SURGICAL-FIX-COMBINED-001)
    saveBOGOState();

    updateStickyCart();
  } else if (!state.currentPair.slot2) {
    // Fill second slot
    state.currentPair.slot2 = productData;
    highlightProduct(productData.element, 2, state.activePairNumber);

    // Pair complete - lock it in
    completePair();
  } else {
    // Pair full - notify user
    showNotification('⚠️ Pair full! Lock in your pair to start a new one.', 'warning');
  }
}
```

**KEY PATTERNS:**
- Always check slot1 first, then slot2
- **NEW FIX:** `saveBOGOState()` called after slot1 fill (prevents loss on page refresh)
- Slot2 fill triggers `completePair()` immediately (no save needed here, completePair handles it)
- "Pair full" error should NEVER happen in normal flow (indicates state corruption)

---

**Pair Completion Logic (Lines 1038-1095):**
```javascript
function completePair() {
  const state = window.bogoState;
  const pair = state.currentPair;

  console.log('🎉 Completing pair:', pair);

  // Check tier before completion
  const previousTier = getTierForCount(state.pairs.length);

  // Determine which is free (cheaper)
  const cheaper = pair.slot1.price <= pair.slot2.price ? pair.slot1 : pair.slot2;
  const moreExpensive = pair.slot1.price > pair.slot2.price ? pair.slot1 : pair.slot2;

  // Save pair with PRICE-ORDERED products
  state.pairs.push({
    slot1: moreExpensive,  // More expensive on LEFT (pays)
    slot2: cheaper,        // Cheaper on RIGHT (FREE)
    product1: moreExpensive,  // Backwards compatibility
    product2: cheaper,        // Backwards compatibility
    savings: cheaper.price,
    pairNumber: state.activePairNumber
  });

  // Electric celebration sequence
  celebratePairCompletion(pair.slot1.element, pair.slot2.element, state.activePairNumber);

  // Tier unlock check
  const newTier = getTierForCount(state.pairs.length);
  let tierMessage = `🎉 Pair ${state.activePairNumber} Complete! ${cheaper.title} is FREE!`;

  if (newTier > previousTier) {
    if (newTier === 2) {
      tierMessage += ' 🔓 Tier 2 Unlocked: FREE SHIPPING + 5% OFF!';
    } else if (newTier === 3) {
      tierMessage += ' 🔓 Tier 3 Unlocked: FREE TITAN CABLE + 10% OFF!';
    }
  }

  // ✅ Reset for next pair
  state.currentPair = { slot1: null, slot2: null };
  state.activePairNumber++;

  // ✅ Save state after completing pair
  saveBOGOState();

  // Update UI
  updateStickyCart();

  showNotification(tierMessage, 'success');
}
```

**CRITICAL CONTEXT:**
- Cheaper product ALWAYS goes to slot2 (visual shows as "FREE")
- Price comparison determines final slot assignment
- `activePairNumber` increments AFTER pair saved (so next pair gets correct number)
- `saveBOGOState()` called BEFORE `updateStickyCart()` (state first, then UI)
- Celebration animation runs async (doesn't block state updates)

---

### 2.3 Checkout Flow

**Checkout Initiation (Lines 6634-6827):**
```javascript
async function proceedToCheckout() {
  const state = window.bogoState;

  // STEP 1: Validation
  if (!state || !state.pairs || state.pairs.length === 0) {
    showBogoToast('Please add at least one pair to continue', 'error');
    return;
  }

  // Check for incomplete pairs
  const incompletePairs = state.pairs.filter(pair => {
    const hasFirstProduct = pair.slot1 || pair.product1;
    const hasSecondProduct = pair.slot2 || pair.product2;
    return !hasFirstProduct || !hasSecondProduct;
  });

  if (incompletePairs.length > 0) {
    showBogoToast('Please complete all pairs before checkout', 'error');
    return;
  }

  // ✅ BOGO-BACK-FIX-002: Mark checkout start in browser history
  history.pushState({ bogoCheckoutStarted: true }, '', window.location.href);

  // STEP 2: Show loading modal
  showCheckoutLoading();

  // STEP 3: Suppress Rebuy immediately
  suppressRebuy();

  try {
    // STEP 4: Clear existing cart
    await clearCart();

    // STEP 5: Build items array
    const items = [];
    const pairCount = state.pairs.length;

    state.pairs.forEach((pair, pairIndex) => {
      const pairNumber = pairIndex + 1;
      const product1 = pair.slot1 || pair.product1;
      const product2 = pair.slot2 || pair.product2;

      // Add both products with BOGO metadata
      if (product1) {
        items.push({
          id: product1.variantId || product1.variant_id || product1.id,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025',
            '_product_name': product1.title || 'Product 1'
          }
        });
      }

      if (product2) {
        items.push({
          id: product2.variantId || product2.variant_id || product2.id,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025 - FREE',
            '_product_name': product2.title || 'Product 2'
          }
        });
      }
    });

    // STEP 6: Add Tier 3 bonus cable
    if (pairCount >= 3) {
      const bonusCableVariantId = window.bogoConfig?.tier3BonusVariantId || '43480190943410';
      items.push({
        id: bonusCableVariantId,
        quantity: 1,
        properties: {
          '_bonus_item': 'FREE Tier 3 Bonus',
          '_tier_3_bonus': 'Titan Smart Cable',
          '_free_gift': 'true'
        }
      });
    }

    // STEP 7: Add all items to cart via Cart API
    const addResponse = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items })
    });

    if (!addResponse.ok) {
      throw new Error(`Cart API error: ${addResponse.status}`);
    }

    // STEP 8: Determine destination URL
    const isDev = window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === 'localhost' ||
                  window.location.port === '9292';

    let destinationUrl = isDev ? '/cart?bogo_verify=true' : '/checkout';

    // STEP 9: Clear BOGO state
    clearBOGOState();

    // STEP 10: Navigate with timeout management
    // ✅ FIX: Store timeout refs so they can be cancelled on back button
    window.bogoCheckoutTimeout = setTimeout(() => {
      window.bogoCheckoutTimeout = null;
      window.location.href = destinationUrl;

      // Fallback if primary navigation blocked
      window.bogoCheckoutFallbackTimeout = setTimeout(() => {
        window.bogoCheckoutFallbackTimeout = null;
        if (window.location.href.includes('bogo-bf-2025')) {
          if (window.top) {
            window.top.location.href = destinationUrl;
          }
        }
      }, 1000);
    }, 500);

    console.log('✅ Checkout redirect scheduled for 500ms');

  } catch (error) {
    console.error('Checkout error:', error);
    hideCheckoutLoading();
    showBogoToast('Checkout failed. Please try again or contact support.', 'error', 5000);

    // Clean up
    window.bogoDirectCheckout = false;
    sessionStorage.removeItem('bogo-direct-checkout');

    // ✅ FIX: Clean up pending timeouts
    if (window.bogoCheckoutTimeout) {
      clearTimeout(window.bogoCheckoutTimeout);
      window.bogoCheckoutTimeout = null;
    }
    if (window.bogoCheckoutFallbackTimeout) {
      clearTimeout(window.bogoCheckoutFallbackTimeout);
      window.bogoCheckoutFallbackTimeout = null;
    }
  }
}
```

**CRITICAL PATTERNS:**
- **Dev mode:** Goes to `/cart?bogo_verify=true` (verification screen)
- **Production:** Goes to `/checkout` (Shopify checkout)
- Cart cleared BEFORE adding items (prevents duplicates)
- State cleared AFTER cart operations (intentional - prevents back button issues)
- Timeout refs stored in `window` (enables cancellation on back button)
- 500ms delay before redirect (allows cart to update)
- 1000ms fallback timeout (handles blocked navigation)

---

**Back Button Handler (Lines 7154-7257):**
```javascript
window.addEventListener('popstate', async function(event) {
  console.log('🔙 Back button detected during checkout flow');

  // ✅ FIX: Cancel any pending checkout redirects
  if (window.bogoCheckoutTimeout) {
    clearTimeout(window.bogoCheckoutTimeout);
    window.bogoCheckoutTimeout = null;
    console.log('✅ Cancelled primary checkout redirect');
  }

  if (window.bogoCheckoutFallbackTimeout) {
    clearTimeout(window.bogoCheckoutFallbackTimeout);
    window.bogoCheckoutFallbackTimeout = null;
    console.log('✅ Cancelled fallback checkout redirect');
  }

  // STEP 1: Hide loading modal immediately
  const checkoutModal = document.getElementById('checkout-loading');
  if (checkoutModal) {
    checkoutModal.remove();
    console.log('✅ Checkout loading modal removed');
  }

  // STEP 2: Clear cart (maintain Marko's design intent)
  try {
    await fetch('/cart/clear.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Cart cleared on back navigation (prevents Rebuy conflicts)');
  } catch (error) {
    console.warn('⚠️ Failed to clear cart on back:', error);
  }

  // STEP 3: Reset in-memory state
  if (window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
  }

  // STEP 4: Clear localStorage
  if (typeof clearBOGOState === 'function') {
    clearBOGOState();
  } else {
    localStorage.removeItem('titan-bogo-state');
  }

  // STEP 5: Clean up flags
  window.bogoDirectCheckout = false;
  window.rebuyDisabled = false;
  sessionStorage.removeItem('bogo-direct-checkout');
  sessionStorage.removeItem('rebuy-disabled');

  // STEP 6: Reset UI
  const stickyCart = document.querySelector('.bogo-sticky-cart');
  if (stickyCart && typeof updateStickyCart === 'function') {
    updateStickyCart();
  }

  const batteryFill = document.getElementById('battery-fill');
  if (batteryFill) {
    batteryFill.style.transform = 'scaleX(0)'; // ✅ PERF: Use scaleX
  }

  // STEP 7: Show notification
  if (typeof showBogoToast === 'function') {
    showBogoToast('Checkout cancelled. Build a new bundle to continue!', 'info', 3000);
  }

  console.log('✅ Back button cleanup complete');
});
```

**WHY THIS CODE MATTERS:**
- **Race condition fix:** Cancels redirect timeouts FIRST (prevents navigation to homepage)
- **Cart clearing:** Intentional design to prevent Rebuy from adding free gifts to BOGO items
- **Complete reset:** Clears both localStorage AND memory state
- **UI reset:** Returns page to empty/fresh state
- **User feedback:** Toast explains what happened

---

### 2.4 UI Update System

**Sticky Cart Update (Lines 1498-1800+ - MASSIVE FUNCTION):**

**Key Logic Points:**
```javascript
function updateStickyCart() {
  const state = window.bogoState;
  const pairCount = state.pairs?.length || 0;
  const currentPair = state.currentPair;

  // ⚠️ CRITICAL: XOR logic for incomplete pair detection
  const hasIncompleteProduct = !!(currentPair?.slot1) !== !!(currentPair?.slot2);
  //                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //                           TRUE if exactly ONE slot filled
  //                           FALSE if both empty OR both filled
  //                           FAILS if currentPair is {} instead of { slot1: null, slot2: null }

  // Determine current tier
  let currentTier = 0;
  if (pairCount >= 3) currentTier = 3;
  else if (pairCount >= 2) currentTier = 2;
  else if (pairCount >= 1) currentTier = 1;

  // STATE 1: Incomplete Pair
  if (hasIncompleteProduct) {
    const nextPairNum = pairCount + 1;
    pairCountEl.textContent = `Building Pair ${nextPairNum}...`;
    updateIncentiveMessage('🔥 <strong>Select 1 more item</strong> to complete your pair!');
    primaryBtn.textContent = 'Continue Shopping';
    primaryBtn.onclick = scrollToProducts;
  }
  // STATE 2: Empty Cart
  else if (pairCount === 0) {
    pairCountEl.textContent = 'Start Building';
    updateIncentiveMessage('Select 2 items to activate <strong>Buy 1 Get 1 50% OFF!</strong>');
    primaryBtn.textContent = 'Start Building';
  }
  // STATE 3: Complete Pairs
  else {
    pairCountEl.textContent = `${pairCount} Pair${pairCount !== 1 ? 's' : ''}`;
    primaryBtn.textContent = 'Checkout →';
    primaryBtn.onclick = checkoutAction;
  }

  // Update savings, tier progress, review button, etc.
  // ... (continues for 300+ more lines)
}
```

**PERFORMANCE NOTES:**
- Called VERY frequently (after every state change)
- Massive function (300+ lines) - avoid modifications
- DOM-heavy (updates multiple elements)
- Cascading failures if broken

**XOR LOGIC EXPLAINED:**
```javascript
// Examples of how XOR works:
!!null !== !!null          // false !== false = false (both empty)
!!product !== !!null       // true !== false = true (one filled) ✅
!!null !== !!product       // false !== true = true (one filled) ✅
!!product !== !!product    // true !== true = false (both filled)

// BUG SCENARIO:
currentPair = {}           // Empty object from corrupted localStorage
!!undefined !== !!undefined  // false !== false = false ❌ WRONG!
// Should be true (slot1 filled), but returns false
```

---

### 2.5 Review System

**Product Reviews Object (Lines 3060-5284 - 270 REVIEWS!):**

**Structure (2 examples, not all 270):**
```javascript
const PRODUCT_REVIEWS = {
  // Product 1: Titan Smart Cable - Tungsten
  '8467056656562': {
    totalReviews: 12654,
    avgRating: 4.6,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        date: "2025-11-12",
        title: "Finally stopped the replacement cycle",
        content: "I'm an electrician and go through cables like crazy. This tungsten cable has survived 8 months of daily abuse in tool bags, being run over by equipment, and constant plugging/unplugging. Still charging perfectly. The reinforced connector is genius - that's where every other cable fails first."
      },
      {
        author: "Priya K.",
        rating: 5,
        date: "2025-11-10",
        title: "Worth every penny for peace of mind",
        content: "Switched my whole family to these cables. My kids are rough on everything, and we were buying new cables every few weeks. Six months in and all five cables still work perfectly. The upfront cost seemed high but we've already saved money by not replacing cheap cables monthly."
      }
      // ... 8 more reviews (10 total per product)
    ]
  },

  // Product 2: Titan Smart Cable - Aramid
  '8273510236338': {
    totalReviews: 8934,
    avgRating: 4.5,
    reviews: [
      {
        author: "Jason W.",
        rating: 5,
        date: "2025-11-13",
        title: "Aramid fiber is no joke",
        content: "Former military, so I appreciate real durability. This aramid cable is built like tactical gear - lightweight but bulletproof. Been using it daily for 4 months in harsh conditions (construction sites, extreme heat) and it still looks brand new. The fast charging actually works too, unlike most \"fast charge\" marketing BS."
      }
      // ... 9 more reviews
    ]
  }

  // ... 25 more products (27 total)
};
```

**Review Retrieval (Lines 5286-5295):**
```javascript
function getProductReviews(productId) {
  // Normalize product ID (handle both string and number)
  const normalizedId = String(productId);

  // Return reviews for specific product, or fallback to generic
  return PRODUCT_REVIEWS[normalizedId] || {
    totalReviews: 0,
    avgRating: 0,
    reviews: []
  };
}
```

**KEY CONTEXT:**
- 27 products with unique reviews
- 10 reviews per product (270 total!)
- Product IDs are Shopify variant IDs
- Reviews are hardcoded (not from API)
- Fallback returns empty if product not found

---

### 2.6 Toast Notification System

**Primary Toast Function (Lines 267-289):**
```javascript
function showBogoToast(message, type = 'success', duration = 3000) {
  // Remove any existing toasts (only one at a time)
  document.querySelectorAll('.bogo-toast').forEach(t => t.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `bogo-toast ${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

**Usage Examples:**
```javascript
showBogoToast('Pair 1 removed', 'success', 2500);
showBogoToast('Please complete all pairs before checkout', 'error');
showBogoToast('Checkout cancelled. Build a new bundle!', 'info', 3000);
```

**Legacy Toast (Lines 5712-5739 - DEPRECATED):**
```javascript
function showNotification(message) {
  // Old inline-styled version
  // Still used in some places (needs consolidation)
  // Uses different styling (green background, no icon)
  // Fixed 2000ms duration
}
```

**⚠️ ISSUE:** Two toast systems exist. Gradually migrating to `showBogoToast()`.

---

## 3. CSS ARCHITECTURE

### Design System

**Colors:**
- Background: `#1a1a1a` (dark mode base)
- Accent (Lime Green): `#60c655` (primary CTA, success states)
- Text: `#ffffff` (white), `rgba(255, 255, 255, 0.8)` (muted)
- Error: `#ef4444` (bright red)
- Warning: `#f59e0b` (orange)
- Tier 2 (Decoy): Green gradient
- Tier 3 (Anchor): Gold/orange `#f39c12`

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Hero headline: 48px (desktop), 28px (mobile)
- Body: 14-16px

### Key Animations (Performance Impact)

**GPU-Accelerated (Good):**
```css
/* Battery bar - OPTIMIZED */
.battery-fill-bar {
  transform-origin: left center;
  transition: transform 1s ease-out, background 500ms ease;
  will-change: transform;  /* Browser optimization hint */
}

/* Animated via scaleX (GPU) instead of width (CPU) */
batteryFill.style.transform = `scaleX(${scaleValue})`;
```

**CPU-Heavy (Performance Impact):**
```css
/* Product float animation - runs continuously */
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.product-card {
  animation: float-gentle 6s ease-in-out infinite;
}

/* Particle float - runs on all particles */
@keyframes floatParticles {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-30px) translateX(-5px); }
  75% { transform: translateY(-15px) translateX(15px); }
}
```

**Starfield Canvas:**
- Continuous `requestAnimationFrame` loop
- Redraws 300 stars every frame
- Resize event debounced to 250ms (OPTIMIZED)

### Mobile Breakpoints

**Primary:** `@media (max-width: 768px)`

Used for:
- Toast notifications (padding, position, width)
- Sticky cart (layout changes)
- Product cards (grid changes)
- Hero section (font sizes, spacing)
- Tier cards (stacking)

---

## 4. LIQUID TEMPLATE STRUCTURE

### Product Grid (Simplified)

```liquid
{% for product in collection.products %}
  <div class="product-card"
       data-product-id="{{ product.id }}"
       data-handle="{{ product.handle }}">

    <div class="product-image-wrapper">
      <img src="{{ product.featured_image | img_url: 'large' }}"
           alt="{{ product.title }}"
           loading="lazy">
    </div>

    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-price">
        {{ product.price | money }}
      </div>

      <!-- Inline variant selector (if multiple variants) -->
      {% if product.variants.size > 1 %}
        <div class="card-variant-selector">
          {% for variant in product.variants %}
            <button class="variant-option"
                    data-variant-id="{{ variant.id }}">
              {{ variant.title }}
            </button>
          {% endfor %}
        </div>
      {% endif %}

      <button class="add-to-pair-btn">Add to Pair</button>
    </div>
  </div>
{% endfor %}
```

### Sticky Cart Structure

```liquid
<div class="bogo-sticky-cart">
  <div class="sticky-cart-header">
    <span class="pair-count-text" id="pair-count">Start Building</span>
    <span class="total-savings" id="total-savings">You save €0</span>
  </div>

  <div class="battery-progress-bar">
    <div class="battery-body">
      <div class="battery-fill-bar" id="battery-fill"></div>
    </div>
  </div>

  <div class="incentive-message" id="incentive-message">
    Select 2 items to activate <strong>Buy 1 Get 1 50% OFF!</strong>
  </div>

  <div class="sticky-cart-actions">
    <button class="primary-action-btn" id="primary-action">
      Start Building
    </button>
    <button class="review-pairs-btn" id="review-pairs" style="display: none;">
      Review Pairs
    </button>
  </div>
</div>
```

---

## 5. CRITICAL PATTERNS & CONVENTIONS

### Function Naming

**State Management:**
- `saveBOGOState()` - Saves to localStorage
- `loadBOGOState()` - Loads from localStorage
- `clearBOGOState()` - Clears both localStorage and memory
- `initBOGOState()` - IIFE that initializes on page load

**UI Updates:**
- `updateStickyCart()` - Refreshes entire sticky cart UI (called frequently)
- `updateIncentiveMessage()` - Updates the message below battery bar
- `updateTierProgress()` - Updates tier unlock indicators

**Product Flow:**
- `selectProduct(productData)` - Main handler for adding product to pair
- `completePair()` - Finalizes pair, triggers celebration
- `highlightProduct(element, slotNum, pairNum)` - Visual feedback on product card

**Checkout:**
- `proceedToCheckout()` - Main async checkout handler
- `showCheckoutLoading()` - Shows modal
- `hideCheckoutLoading()` - Hides modal
- `suppressRebuy()` - Disables Rebuy integration

### Event Handling Pattern

**Product Click:**
```javascript
// Product cards use event delegation
document.querySelector('.product-grid').addEventListener('click', function(e) {
  const card = e.target.closest('.product-card');
  if (!card) return;

  const addBtn = e.target.closest('.add-to-pair-btn');
  if (addBtn) {
    handleProductClick(e, card);
  }
});
```

**Variant Selection:**
```javascript
// Inline variant selection
variantOption.addEventListener('click', function(e) {
  e.stopPropagation();  // Prevent card click

  // Update selected variant
  card.dataset.selectedVariantId = variantId;

  // Visual feedback
  siblings.forEach(s => s.classList.remove('selected'));
  this.classList.add('selected');
});
```

### Error Handling Pattern

```javascript
try {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  if (!response.ok) {
    throw new Error(`Cart API error: ${response.status}`);
  }

  const data = await response.json();
  // Success handling

} catch (error) {
  console.error('Checkout error:', error);
  hideCheckoutLoading();
  showBogoToast('Checkout failed. Please try again or contact support.', 'error', 5000);

  // Cleanup
  window.bogoDirectCheckout = false;
  sessionStorage.removeItem('bogo-direct-checkout');
}
```

---

## 6. DANGEROUS AREAS (DO NOT MODIFY WITHOUT CAUTION)

### High-Risk Functions

**1. `updateStickyCart()` (Lines 1498-1800+)**
- **Why Dangerous:** 300+ lines, touches EVERYTHING in sticky cart
- **Dependencies:** Called after every state change
- **Risk:** Changes can cascade to tier progress, savings, button states, review modal, etc.
- **Pattern:** Add new code, don't modify existing unless absolutely necessary

**2. `completePair()` (Lines 1038-1095)**
- **Why Dangerous:** Complex celebration sequences with timing dependencies
- **Side Effects:** Updates state, triggers animations, shows modals, plays sounds
- **Risk:** Breaking celebration breaks user experience
- **Pattern:** Only modify state updates, leave celebration logic alone

**3. Product Selection Event Handlers**
- **Why Dangerous:** Uses `.cloneNode(true)` pattern to remove event listeners
- **Memory Leak:** Not ideal, but changing it requires refactoring entire event system
- **Pattern:** Leave as-is unless user reports memory issues

**4. `initBOGOState()` IIFE (Lines 494-568)**
- **Why Dangerous:** Runs ONCE on page load, handles state migrations
- **Risk:** Breaking this breaks state restoration for ALL users
- **Pattern:** Only add defensive code, don't remove existing logic

### Risky Patterns

**CloneNode Anti-Pattern (Memory Leak Risk):**
```javascript
// ⚠️ This pattern is used to remove event listeners
// NOT ideal, but changing it requires refactoring entire codebase
addBtn.replaceWith(addBtn.cloneNode(true));

// WHY: Easier than tracking and removing individual listeners
// DOWNSIDE: Potential memory leak if done excessively
// VERDICT: Leave as-is (works in practice, low user impact)
```

**DOM Element in State (Serialization Issue):**
```javascript
// ⚠️ productData includes .element property
productData = {
  element: domElement,  // Can't be saved to localStorage!
  variantId: '123',
  title: 'Product',
  price: 1000,
  image: 'url'
};

// WHY: Needed for highlighting, animations
// DOWNSIDE: Lost on state restore (handled by code)
// VERDICT: Acceptable trade-off
```

---

## 7. RECENT FIXES & CHANGES (Last 24 Hours)

### Fix 1: Back Button Race Condition (BOGO-SURGICAL-FIX-COMBINED-001)

**Problem:** User clicks checkout, presses back button immediately. Scheduled redirect (500ms) still executes, sending user to homepage with cart drawer open instead of staying on BOGO page.

**Solution:** Store timeout references in `window.bogoCheckoutTimeout` and `window.bogoCheckoutFallbackTimeout`. Cancel them in popstate handler.

```javascript
// Store refs (Lines 6772-6790)
window.bogoCheckoutTimeout = setTimeout(() => {
  window.bogoCheckoutTimeout = null;
  window.location.href = destinationUrl;
  // ...
}, 500);

// Cancel on back (Lines 7158-7168)
if (window.bogoCheckoutTimeout) {
  clearTimeout(window.bogoCheckoutTimeout);
  window.bogoCheckoutTimeout = null;
  console.log('✅ Cancelled primary checkout redirect');
}
```

---

### Fix 2: State Persistence Bug (BOGO-SURGICAL-FIX-COMBINED-001)

**Problem:** User adds 1 product to pair, leaves page. Product lost on return. Also, `activePairNumber` not saved, causing wrong pair numbering.

**Solution:**
1. Save state after slot1 fill (Line 918)
2. Save/restore `activePairNumber` (Lines 198, 507)
3. Normalize `currentPair` structure on load (Lines 503-506)
4. Add state validation to auto-fix corruption (Lines 540-567)

```javascript
// Save after slot1 (Line 918)
if (!state.currentPair.slot1) {
  state.currentPair.slot1 = productData;
  highlightProduct(productData.element, 1, state.activePairNumber);
  showNotification(`${productData.title} added...`);

  saveBOGOState();  // ✅ NEW

  updateStickyCart();
}

// Save activePairNumber (Line 198)
const stateToSave = {
  pairs: window.bogoState.pairs || [],
  currentPair: window.bogoState.currentPair || {},
  activePairNumber: window.bogoState.activePairNumber || 1,  // ✅ NEW
  timestamp: Date.now()
};

// Normalize currentPair (Lines 503-506)
currentPair: {
  slot1: savedState.currentPair?.slot1 || null,  // ✅ Explicit null
  slot2: savedState.currentPair?.slot2 || null   // ✅ Explicit null
}
```

---

### Fix 3: Performance Optimizations (PERF-QUICK-WINS-001)

**Changes:**
1. Battery bar animation: `width` → `transform: scaleX()` (GPU-accelerated)
2. Canvas resize: Debounced to 250ms (was firing hundreds of times)
3. Stock updates: 5s → 30s interval (83% less CPU)
4. Countdown timer: `requestAnimationFrame + setTimeout` → `setInterval` (simpler)

```javascript
// Battery bar (Lines 448-450)
const scaleValue = percentRemaining / 100;
batteryFill.style.transform = `scaleX(${Math.max(0, scaleValue)})`;

// Canvas resize (Lines 317-324, 382-384)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedResizeCanvas = debounce(resizeCanvas, 250);
window.addEventListener('resize', debouncedResizeCanvas);

// Stock updates (Lines 2902, 6485)
setInterval(decreaseRandomStock, 30000);  // Was 5000

// Countdown timer (Lines 461-462)
updateCountdown();
setInterval(updateCountdown, 1000);  // Was recursive rAF + setTimeout
```

---

### Fix 4: Product-Specific Reviews (Multiple Prompts)

**Before:** Generic reviews shown for all products
**After:** Product ID-based lookup with 27 unique product review sets

```javascript
// Product-specific lookup (Line 5286-5295)
function getProductReviews(productId) {
  const normalizedId = String(productId);
  return PRODUCT_REVIEWS[normalizedId] || {
    totalReviews: 0,
    avgRating: 0,
    reviews: []
  };
}

// 270 unique reviews across 27 products
// 10 reviews per product
// Product IDs are Shopify variant IDs
```

---

## 8. DEPENDENCIES & INTEGRATIONS

### Third-Party Scripts

**Tailwind CSS CDN (REQUIRED):**
```liquid
<script src="https://cdn.tailwindcss.com"></script>
```
- **Status:** Marko explicitly confirmed this MUST stay
- **Used for:** Utility classes throughout template
- **Cannot remove:** Breaking change

**Rebuy (Third-Party Cart Upsell):**
- **Integration:** Suppressed during BOGO checkout
- **Why:** Rebuy adds free gifts to cart, conflicts with BOGO logic
- **Pattern:** `suppressRebuy()` sets flags, Rebuy checks them
- **Cleanup:** `window.rebuyDisabled = false` on back button

### Shopify APIs Used

**Cart API:**
```javascript
// Add items
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: [...] })
});

// Clear cart
fetch('/cart/clear.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

// Get cart
fetch('/cart.js').then(r => r.json());
```

**Product Data:**
- Embedded in Liquid template via `{{ product | json }}`
- Accessed in JS via `JSON.parse(element.dataset.product)`

**Variant IDs:**
- Used for cart operations
- Format: `'8467056656562'` (string or number)

---

## 9. PERFORMANCE CONSIDERATIONS

### Known Performance Bottlenecks

**1. Canvas Starfield Animation**
- Continuous `requestAnimationFrame` loop
- Redraws 300 stars every frame (~60 FPS)
- Impact: Moderate CPU usage
- **Fix Applied:** Debounced resize to 250ms

**2. CSS Animations**
- `float-gentle` on ALL product cards (continuous)
- `floatParticles` on celebration particles
- Impact: GPU usage, can cause jank on low-end devices
- **Status:** User requested to keep (part of premium feel)

**3. localStorage Writes**
- Was called on EVERY state change
- **Fix Applied:** Still called frequently, but necessary for persistence
- Future: Could debounce to 500ms

**4. Stock Updates**
- Simulated stock decrease every 5 seconds
- **Fix Applied:** Increased to 30 seconds (83% reduction)

**5. updateStickyCart() Function**
- Called after EVERY state change
- 300+ lines of DOM manipulation
- Impact: High (but necessary)
- **Optimization:** Avoid calling unnecessarily

### Optimizations Applied

✅ **Debounced `saveBOGOState()`** - Ready to implement (500ms)
✅ **State saved after slot1 fill** - Prevents loss on refresh
✅ **Battery bar scaleX animation** - GPU-accelerated (was width-based)
✅ **Canvas resize debounce** - 250ms (was firing continuously)
✅ **Stock update interval** - 30s (was 5s)
✅ **Countdown timer pattern** - Simple `setInterval` (was rAF + setTimeout)

---

## 10. TESTING REQUIREMENTS

### Critical Test Scenarios

**Test 1: Back Button During Checkout**
```
1. Select 3 pairs
2. Click "Checkout"
3. IMMEDIATELY press browser back button (< 200ms)
4. ✅ Should stay on BOGO page (not go to homepage)
5. ✅ Should see toast: "Checkout cancelled"
6. ✅ Should see console: "✅ Cancelled primary checkout redirect"
7. ✅ Cart should be empty
8. ✅ UI should show 0/3 selected
```

**Test 2: State Persistence with Incomplete Pair**
```
1. Fresh page load
2. Select 5 products (2 complete pairs + 1 in slot1 of pair 3)
3. Refresh page
4. ✅ Should see console: "✅ Incomplete pair restored: slot1 filled"
5. ✅ Should see UI: "Building Pair 3..."
6. ✅ Should see: "🔥 Select 1 more item to complete your pair!"
7. Select 6th product
8. ✅ Celebration should trigger
9. ✅ Should see "3 Pairs" in sticky cart
```

**Test 3: Normal Checkout Flow**
```
1. Select 3 pairs
2. Click "Checkout"
3. DON'T press back - let redirect happen
4. ✅ Dev: Should arrive at /cart?bogo_verify=true
5. ✅ Prod: Should arrive at /checkout
6. ✅ All 6 items + 1 bonus cable in cart
7. ✅ Line item properties show pair numbers
```

**Test 4: Slot1 Save Persistence**
```
1. Select 1 product
2. Close tab immediately (before adding 2nd product)
3. Reopen page
4. ✅ Should see "Building Pair 1..."
5. ✅ Should show 1 product in sticky cart preview
6. Select 2nd product
7. ✅ Pair should complete normally
```

**Test 5: State Validation - Corrupted State**
```
1. Manually corrupt localStorage:
   localStorage.setItem('titan-bogo-state', JSON.stringify({
     pairs: [],
     currentPair: { slot1: {price: 1000}, slot2: {price: 2000} },
     timestamp: Date.now()
   }))
2. Refresh page
3. ✅ Should see console: "⚠️ currentPair had both slots filled on load"
4. ✅ Should auto-complete to pairs array
5. ✅ Should show "1 Pair" in sticky cart
6. ✅ Can build new pairs normally
```

### Console Debug Messages to Look For

**Successful Flows:**
```javascript
'🚀 BOGO JavaScript Loading...'
'✅ Cart cleared on BOGO page load'
'✅ BOGO state initialized (fresh)'  // OR
'✅ BOGO state restored from localStorage: 2 pairs'
'✅ Incomplete pair restored: slot1 filled'
'💾 BOGO state saved to localStorage'
'🎉 Completing pair: { slot1: {...}, slot2: {...} }'
'✅ Checkout redirect scheduled for 500ms'
```

**Back Button Flow:**
```javascript
'🔙 Back button detected during checkout flow'
'✅ Cancelled primary checkout redirect'
'✅ Cancelled fallback checkout redirect'
'✅ Checkout loading modal removed'
'✅ Cart cleared on back navigation (prevents Rebuy conflicts)'
'✅ Back button cleanup complete'
```

**Error Indicators:**
```javascript
'⚠️ currentPair had both slots filled on load - auto-completing'
'⚠️ Failed to clear cart on back: ...'
'Failed to save BOGO state: ...'
'Checkout error: ...'
```

---

## 11. CONFIGURATION & CONSTANTS

### Key Constants

```javascript
// Storage (Lines 183-184)
const BOGO_STORAGE_KEY = 'titan-bogo-state';
const BOGO_EXPIRY_HOURS = 24;

// Countdown Timer (Lines 410-414)
const SALE_END = new Date('2025-11-17T17:00:00Z').getTime();
const SALE_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours
const SALE_START = SALE_END - SALE_DURATION_MS;

// Checkout Timeouts (Lines 186-188)
window.bogoCheckoutTimeout = null;
window.bogoCheckoutFallbackTimeout = null;

// Social Proof Config (Lines 6073-6090)
const SOCIAL_PROOF_CONFIG = {
  liveActivity: {
    enabled: true,
    baseRange: [45, 89],
    updateInterval: [8000, 15000]
  },
  notifications: {
    enabled: true,
    interval: [15000, 25000]
  },
  bundlesCounter: {
    enabled: true,
    baseRange: [1000, 1500],
    incrementInterval: [20000, 40000]
  },
  popularityBadges: {
    enabled: true,
    showProbability: 0.4  // 40% of products
  }
};
```

### Discount Codes (Lines 6830-6839)

```javascript
function getBOGODiscountCodes(pairCount) {
  if (pairCount === 1) {
    return 'BOGO2025';
  } else if (pairCount === 2) {
    return 'BOGO2025,TIER2-5OFF,FREE-SHIPPING-TIER2';
  } else if (pairCount >= 3) {
    return 'BOGO2025,TIER3-10OFF,FREE-SHIPPING-TIER3';
  }
  return '';
}
```

**Tier Breakdown:**
- **Tier 1:** 1 pair = BOGO2025 discount
- **Tier 2:** 2 pairs = BOGO + 5% off + free shipping
- **Tier 3:** 3+ pairs = BOGO + 10% off + free shipping + free cable

---

## 12. QUICK REFERENCE

### File Locations

```
/assets/bogo-builder.js         - Main application logic (~7,500 lines)
/assets/bogo-builder.css        - Styles and animations (~7,000 lines)
/sections/bogo-builder-2024.liquid - HTML structure (~2,750 lines)
```

### Key Line Numbers (Approximate)

**State Management:**
- `BOGO_STORAGE_KEY`: Line 183
- `saveBOGOState()`: Lines 193-206
- `loadBOGOState()`: Lines 207-240
- `clearBOGOState()`: Lines 241-254
- `initBOGOState()`: Lines 494-568

**Product Flow:**
- `selectProduct()`: Lines 908-945
- `completePair()`: Lines 1038-1095
- `highlightProduct()`: Lines 947-995

**Checkout:**
- `proceedToCheckout()`: Lines 6634-6827
- `getBOGODiscountCodes()`: Lines 6830-6839
- Back button handler: Lines 7154-7257

**UI Updates:**
- `updateStickyCart()`: Lines 1498-1800+
- `showBogoToast()`: Lines 267-289
- `showNotification()`: Lines 5712-5739 (legacy)

**Reviews:**
- `PRODUCT_REVIEWS`: Lines 3060-5284 (270 reviews!)
- `getProductReviews()`: Lines 5286-5295

**Social Proof:**
- `SOCIAL_PROOF_CONFIG`: Lines 6073-6090
- `addPopularityBadges()`: Lines 6316-6337

### Common Tasks

**Add new product to review system:**
```javascript
// Edit PRODUCT_REVIEWS object (around line 3060)
PRODUCT_REVIEWS['NEW_VARIANT_ID'] = {
  totalReviews: 5432,
  avgRating: 4.5,
  reviews: [
    {
      author: "John D.",
      rating: 5,
      date: "2025-11-15",
      title: "Great product!",
      content: "Really happy with this purchase..."
    }
    // ... 9 more reviews (10 total)
  ]
};
```

**Debug state issues:**
```javascript
// In browser console:

// Check localStorage
JSON.parse(localStorage.getItem('titan-bogo-state'))

// Check memory
window.bogoState

// Force save
saveBOGOState()

// Force load
loadBOGOState()

// Clear all
clearBOGOState()

// Check for desync
const ls = JSON.parse(localStorage.getItem('titan-bogo-state'));
console.log('localStorage pairs:', ls.pairs.length);
console.log('memory pairs:', window.bogoState.pairs.length);
console.log('Match?', ls.pairs.length === window.bogoState.pairs.length);
```

**Test checkout flow:**
```javascript
// Simulate 3-pair checkout
window.bogoState = {
  pairs: [
    {
      slot1: {variantId: '123', title: 'Product 1', price: 2000, image: ''},
      slot2: {variantId: '456', title: 'Product 2', price: 1500, image: ''},
      savings: 1500,
      pairNumber: 1
    },
    // ... add 2 more pairs
  ],
  currentPair: {slot1: null, slot2: null},
  activePairNumber: 4
};

saveBOGOState();
updateStickyCart();
```

**Toggle features:**
```javascript
// Disable social proof
SOCIAL_PROOF_CONFIG.liveActivity.enabled = false;
SOCIAL_PROOF_CONFIG.notifications.enabled = false;
SOCIAL_PROOF_CONFIG.popularityBadges.enabled = false;

// Disable stock updates
clearInterval(stockUpdateInterval);  // If you have the ref

// Test error states
showBogoToast('Test error message', 'error', 5000);
```

---

## 13. ARCHITECTURE DECISIONS & RATIONALE

### Why Dual-State System?

**Problem:** Need persistence across sessions + fast in-memory access

**Solution:**
- `localStorage` = persistent (survives page refresh)
- `window.bogoState` = in-memory (fast access, includes DOM refs)

**Trade-off:** Must keep in sync (complexity) vs single source of truth

### Why Clear Cart on BOGO Page Load?

**Problem:** Rebuy adds free gifts, previous items cause confusion

**Solution:** Clear cart on page load, force user to build fresh bundle

**Code:**
```javascript
(function clearCartImmediately() {
  // Runs IMMEDIATELY on script load (Line 7-30)
  fetch('/cart/clear.js', { method: 'POST' });
})();
```

### Why Clear Cart on Back Button?

**Problem:** User presses back from checkout, cart has BOGO items

**Marko's Design Intent:** Clear cart to prevent Rebuy conflicts

**Alternative Considered:** Restore BOGO builder state from cart items
**Rejected Because:** Complex parsing, Rebuy interference, UX confusion

### Why Two Checkout Timeouts?

**Problem:** Some browsers block `window.location.href`, some don't

**Solution:**
1. Primary: `window.location.href` after 500ms
2. Fallback: `window.top.location.href` after 1500ms total

**Why 500ms delay?** Allows cart API to complete before redirect

### Why Product Element References in State?

**Problem:** Need to highlight selected products on page

**Solution:** Store `element` reference in product data

**Downside:** Can't serialize to localStorage (lost on restore)

**Acceptable?** Yes - re-highlighting on restore not critical (UX still works)

---

## END OF CODE OVERVIEW

**Purpose:** Provide AI context for future development sessions
**Total Code Size:** ~17,250 lines (7,500 JS + 7,000 CSS + 2,750 Liquid)
**Critical Functions:** 20+ major functions documented
**Review Data:** 270 unique reviews across 27 products
**Recent Fixes:** 4 major fixes in last 24 hours
**Performance:** 4 optimizations applied

---

## AI HANDOVER CHECKLIST

An AI reading this document should now be able to:

✅ Understand the BOGO Builder architecture in 10-15 minutes
✅ Know where critical code lives (line numbers provided)
✅ Identify risky areas to avoid (updateStickyCart, completePair, etc.)
✅ See patterns and conventions to follow (naming, error handling)
✅ Debug common issues using state inspection examples
✅ Make informed decisions about changes (understand trade-offs)
✅ Know what's been recently fixed (avoid regression)
✅ Test changes using provided scenarios
✅ Find code quickly using quick reference section

**Next Steps for AI:**
1. Read this document first (10 minutes)
2. Ask clarifying questions about specific areas
3. Propose changes with context from this doc
4. Reference line numbers when discussing code
5. Use test scenarios to verify changes
6. Update this doc with new fixes/changes

**Document Maintenance:**
- Update "Recent Fixes" section after each major change
- Add new critical functions as they emerge
- Document new architectural decisions
- Keep line numbers approximately accurate
