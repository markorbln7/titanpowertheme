# EXTRACTION SET 2: CART & CHECKOUT LOGIC

**Extraction Date:** 2025-11-24
**Purpose:** Document BOGO Builder cart/checkout flow, discount logic, and Rebuy suppression
**Source File:** `assets/bogo-builder.js` (lines 6700-7200 + keyword searches)

---

## 1. CHECKOUT SECTION (Lines 6700-7200)

**Location:** `assets/bogo-builder.js` lines 6700-7200
**Purpose:** Complete checkout flow with cart clearing, item addition, discount codes, and Rebuy suppression

```javascript
    // Note: No setTimeout delays = no race condition window for Rebuy
    console.log('✅ Immediate redirect executed');

  } catch (error) {
    console.error('Checkout error:', error);
    hideCheckoutLoading();
    showBogoToast('Checkout failed. Please try again or contact support.', 'error', 5000);

    // Clean up flags
    window.bogoDirectCheckout = false;
    sessionStorage.removeItem('bogo-direct-checkout');

    // Timeout cleanup removed (SH-CRITICAL-FIX-CHECKOUT-HIJACKING-001)
    // No timeouts exist after immediate redirect fix
  }
}

// Get discount codes based on tier
function getBOGODiscountCodes(pairCount) {
  if (pairCount === 1) {
    return 'BOGO2025';
  } else if (pairCount === 2) {
    // Tier 2: BOGO + 5% OFF + Free Premium Shipping
    return 'BOGO2025,TIER2-5OFF,FREESHIP';
  } else if (pairCount >= 3) {
    // Tier 3: BOGO + 10% OFF + Free Cable + Free Premium Shipping
    return 'BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP';
  }
  return '';
}

/**
 * Suppress Rebuy Smart Cart (BOGO-CHECKOUT-REBUY-FIX-028)
 * Multiple suppression methods for maximum effectiveness
 */
function suppressRebuy() {
  console.log('🚫 Suppressing Rebuy Smart Cart...');

  // Method 1: Set global flags
  window.bogoDirectCheckout = true;
  window.rebuyDisabled = true;
  sessionStorage.setItem('bogo-direct-checkout', 'true');
  sessionStorage.setItem('rebuy-disabled', 'true');

  // Method 2: Disable Rebuy object
  if (window.Rebuy) {
    console.log('Found Rebuy object, nullifying...');
    window._rebuyOriginalBackup = window.Rebuy;

    // Replace with no-op proxy
    window.Rebuy = new Proxy({}, {
      get: (target, prop) => {
        console.log(`Rebuy.${prop} blocked`);
        return () => {};
      },
      set: () => true
    });
  }

  // Method 3: Prevent Rebuy cart events
  const rebuyEvents = ['rebuy:cart-open', 'rebuy:cart-update', 'rebuy:checkout'];
  rebuyEvents.forEach(eventName => {
    document.addEventListener(eventName, (e) => {
      console.log(`Blocked Rebuy event: ${eventName}`);
      e.stopImmediatePropagation();
      e.preventDefault();
    }, true);
  });

  // Method 4: Disable Rebuy Smart Cart widget
  const rebuyWidget = document.querySelector('rebuy-cart, [data-rebuy-cart], .rebuy-cart');
  if (rebuyWidget) {
    console.log('Found Rebuy widget, hiding...');
    rebuyWidget.style.display = 'none';
    rebuyWidget.style.pointerEvents = 'none';
  }

  // Method 5: Add body class to signal checkout mode
  document.body.classList.add('bogo-checkout-mode');

  // Restore after 5 seconds (increased from 3)
  setTimeout(() => {
    console.log('Restoring Rebuy...');
    if (window._rebuyOriginalBackup) {
      window.Rebuy = window._rebuyOriginalBackup;
      delete window._rebuyOriginalBackup;
    }
    sessionStorage.removeItem('bogo-direct-checkout');
    sessionStorage.removeItem('rebuy-disabled');
    document.body.classList.remove('bogo-checkout-mode');
    window.bogoDirectCheckout = false;
    window.rebuyDisabled = false;
  }, 5000);
}

// Show loading overlay (BOGO-CHECKOUT-REBUY-FIX-028)
function showCheckoutLoading() {
  const overlay = document.createElement('div');
  overlay.id = 'checkout-loading';

  // Detect dev environment
  const isDev = window.location.hostname === '127.0.0.1' ||
                window.location.hostname === 'localhost' ||
                window.location.port === '9292';

  const devNotice = isDev
    ? `<p class="dev-notice" style="
        margin-top: 12px;
        padding: 8px 16px;
        background: rgba(251, 191, 36, 0.2);
        border: 1px solid rgba(251, 191, 36, 0.5);
        border-radius: 8px;
        color: #fbbf24;
        font-size: 13px;
        font-weight: 600;
      ">⚠️ Development mode: Redirecting to cart page</p>`
    : '';

  overlay.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(8px);
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 300ms ease-out;
    ">
      <div style="
        text-align: center;
        padding: 40px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(96, 198, 85, 0.5);
        border-radius: 20px;
        max-width: 400px;
      ">
        <div style="
          width: 60px;
          height: 60px;
          margin: 0 auto 24px;
          border: 4px solid rgba(96, 198, 85, 0.2);
          border-top-color: #60c655;
          border-radius: 50%;
          animation: spin 800ms linear infinite;
        "></div>
        <h3 style="
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 12px 0;
        ">Preparing Your Checkout...</h3>
        <p style="
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        ">Adding ${window.bogoState?.pairs?.length || 0} BOGO pairs to cart</p>
        ${devNotice}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Add spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

function hideCheckoutLoading() {
  const overlay = document.getElementById('checkout-loading');
  if (overlay) overlay.remove();
}

// Clear cart
async function clearCart() {
  const response = await fetch('/cart/clear.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to clear cart');
  }

  return response.json();
}

// Add pairs to cart
async function addPairsToCart(pairs) {
  const cartItems = [];

  pairs.forEach((pair, pairIndex) => {
    const pairNumber = pairIndex + 1;

    // Get first product - flexible property checking
    const firstItem = pair.slot1 || pair.product1 || pair.item1 || pair[0];
    const secondItem = pair.slot2 || pair.product2 || pair.item2 || pair[1];

    console.log(`Processing pair ${pairNumber}:`, { firstItem, secondItem });

    // Add first product (will be paid or free depending on price)
    if (firstItem) {
      const variantId = firstItem.variantId || firstItem.id || firstItem.variant_id;

      if (variantId) {
        console.log(`Adding first item to cart - variantId: ${variantId}`);
        cartItems.push({
          id: variantId,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025'
          }
        });
      } else {
        console.error(`First item in pair ${pairNumber} has no valid variant ID:`, firstItem);
      }
    }

    // Add second product
    if (secondItem) {
      const variantId = secondItem.variantId || secondItem.id || secondItem.variant_id;

      if (variantId) {
        console.log(`Adding second item to cart - variantId: ${variantId}`);
        cartItems.push({
          id: variantId,
          quantity: 1,
          properties: {
            '_pair_number': pairNumber,
            '_bogo_offer': 'Black Friday BOGO 2025'
          }
        });
      } else {
        console.error(`Second item in pair ${pairNumber} has no valid variant ID:`, secondItem);
      }
    }
  });

  console.log('Adding items to cart:', cartItems);

  // Validate we have items to add
  if (cartItems.length === 0) {
    console.error('No valid items to add to cart');
    throw new Error('No valid items found in pairs. Please ensure all pairs have valid variants selected.');
  }

  // Validate each item has a valid variant ID
  const invalidItems = cartItems.filter(item => !item.id || item.id === 'undefined' || item.id === 'null');
  if (invalidItems.length > 0) {
    console.error('Invalid items found:', invalidItems);
    throw new Error('Some items have invalid variant IDs. Please check your selections.');
  }

  // Add all items in one request
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Cart API error:', error);
    throw new Error(error.description || 'Failed to add items to cart');
  }

  const result = await response.json();
  console.log('Cart add result:', result);

  return result;
}

// Add bonus cable (Tier 3)
async function addBonusCable() {
  const BONUS_CABLE_VARIANT_ID = '43480190943410';

  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{
        id: BONUS_CABLE_VARIANT_ID,
        quantity: 1,
        properties: {
          '_bonus_item': 'FREE Tier 3 Bonus',
          '_tier_3_bonus': 'Titan Smart Cable'
        }
      }]
    })
  });

  return response.json();
}

// Redirect to checkout with codes
function redirectToCheckoutWithCodes(pairCount) {
  let codes = ['BOGO2025']; // Always include BOGO

  // Add tier-specific benefits
  if (pairCount >= 3) {
    // Tier 3: 10% OFF + Free Cable + Free Premium Shipping
    codes.push('TIER3-10OFF');    // 10% discount
    codes.push('FREECABLE2025');  // Free Titan Smart Cable (€14.95 value)
    codes.push('FREESHIP');       // Free premium shipping ($4.95 value)
  } else if (pairCount >= 2) {
    // Tier 2: 5% OFF + Free Premium Shipping
    codes.push('TIER2-5OFF');     // 5% discount
    codes.push('FREESHIP');       // Free premium shipping ($4.95 value)
  }

  const codesString = codes.join(',');

  console.log('Redirecting with codes:', codes);
  console.log('URL:', `/checkout?discount=${codesString}`);

  // Redirect
  window.location.href = `/checkout?discount=${codesString}`;
}

// Error toast
function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff3b30;
    color: #ffffff;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 700;
    z-index: 100001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    max-width: 300px;
  `;
  toast.textContent = `⚠️ ${message}`;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}

// Make function globally available
window.proceedToCheckout = proceedToCheckout;

console.log('%c✅ BOGO-CHECKOUT-FINAL-061: Checkout integration loaded', 'color: #60c655; font-weight: bold;');

// ═══════════════════════════════════════════════════════════════════
// HANDLE BROWSER BACK BUTTON DURING CHECKOUT (BOGO-BACK-FIX-002)
// Maintains Marko's design: Clear cart to prevent Rebuy conflicts
// ═══════════════════════════════════════════════════════════════════
window.addEventListener('popstate', async function(event) {
  // ✅ CRITICAL FIX: Only run on BACK button, not during checkout redirect
  // If bogoCheckoutStarted is true in state, we're IN checkout flow - don't interfere
  if (event.state && event.state.bogoCheckoutStarted === true) {
    console.log('✅ Checkout in progress - popstate handler ignoring (not a back button)');
    return; // Exit early, let checkout complete
  }

  console.log('🔙 Back button detected during checkout flow');

  // Timeout cancellation removed (SH-CRITICAL-FIX-CHECKOUT-HIJACKING-001)
  // No timeouts exist after immediate redirect fix
  console.log('✅ Back button detected - cart will be cleared');

  // STEP 1: Hide loading modal immediately (critical UX fix)
  const checkoutModal = document.getElementById('checkout-loading');
  if (checkoutModal) {
    checkoutModal.remove();
    console.log('✅ Checkout loading modal removed');
  }

  // STEP 2: Ensure cart is cleared (maintain Marko's design intent)
  // This prevents Rebuy from adding free gifts to BOGO items
  try {
    await fetch('/cart/clear.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Cart cleared on back navigation (prevents Rebuy conflicts)');
  } catch (error) {
    console.warn('⚠️ Failed to clear cart on back:', error);
    // Continue anyway - modal is already hidden
  }

  // STEP 3: Reset in-memory state completely
  if (window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
    console.log('✅ In-memory state reset');
  }

  // STEP 4: Clear localStorage
  if (typeof clearBOGOState === 'function') {
    clearBOGOState();
  } else {
    localStorage.removeItem('titan-bogo-state');
  }

  // STEP 5: Clean up all checkout-related flags
  window.bogoDirectCheckout = false;
  window.rebuyDisabled = false;
  sessionStorage.removeItem('bogo-direct-checkout');
  sessionStorage.removeItem('rebuy-disabled');
  document.body.classList.remove('bogo-checkout-mode');

  // STEP 6: Reset UI to empty state
  // Reset sticky cart
  const stickyCart = document.querySelector('.bogo-sticky-cart');
  if (stickyCart && typeof updateStickyCartUI === 'function') {
    updateStickyCartUI();
  }

  // Reset progress/battery displays
  const progressText = document.querySelector('[class*="progress-text"]');
  if (progressText) {
    progressText.textContent = '0/3 selected';
  }

  const batteryFill = document.getElementById('battery-fill');
  if (batteryFill) {
    batteryFill.style.transform = 'scaleX(0)'; // ✅ PERF-QUICK-WINS-001: Use scaleX
  }

  // Reset cart count displays
  const cartCounts = document.querySelectorAll('.cart-count, [class*="cart"][class*="count"]');
  cartCounts.forEach(el => {
    el.textContent = '0';
  });

  // STEP 7: Show user-friendly notification
  if (typeof showBogoToast === 'function') {
    showBogoToast('Checkout cancelled. Build a new bundle to continue!', 'info', 3000);
  }

  console.log('✅ Back button cleanup complete - user can build new bundle');
});
```

---

## 2. DISCOUNT/GIFT/TIER KEYWORDS (First 50 Matches)

**Search Command:** `grep -n "discount\|gift\|tier\|free"`
**Purpose:** Locate all discount calculation, tier logic, and gift management code

```
1053:  // Determine which is free (cheaper)
1070:  // Calculate tier discount
1071:  const tierDiscount = getTierDiscount(state.pairs.length);
1074:  // Show tier message
1075:  let tierMessage = `🎉 Pair ${state.activePairNumber} Complete! ${cheaper.title} is FREE!`;
1076:  if (nextTierDiscount > tierDiscount) {
1077:    tierMessage += ` Add another pair and save ${nextTierDiscount}% on entire order!`;
1080:  showNotification(tierMessage, 'success');
1087:      if (window.tierCelebrations) {
1088:        window.tierCelebrations.celebrate(newTier);
1210:  let tierDiscount = 0;
1229:    // Tier discount
1230:    const discountedSubtotal = orderSubtotal - bogoSavings;
1232:      tierDiscount = discountedSubtotal * 0.10;
1234:      tierDiscount = discountedSubtotal * 0.05;
1247:  // Tier discount (show only if applicable)
1248:  const tierItem = document.getElementById('tooltip-tier-item');
1249:  if (tierDiscount > 0) {
1250:    const tierLabel = document.getElementById('tooltip-tier-label');
1251:    tierLabel.textContent = currentTier === 3 ? 'Tier 3 (10%):' : 'Tier 2 (5%):';
1252:    document.getElementById('tooltip-tier').textContent = formatMoney(tierDiscount);
1253:    tierItem.style.display = 'flex';
1255:    tierItem.style.display = 'none';
1258:  // Shipping (show if tier 2+)
1262:  // Cable (show if tier 3)
1267:  let totalSavings = bogoSavings + tierDiscount;
1275:    tier: tierDiscount.toFixed(2),
1529:  // Determine current tier
1547:  let tierDiscountCents = 0;
1585:    const discountedSubtotalCents = totalRetailCents - bogoSavingsCents;
1588:      tierDiscountCents = Math.round(discountedSubtotalCents * 0.10);
1589:      totalSavingsCents += tierDiscountCents;
1590:      console.log('Tier 3 Discount (10%):', (tierDiscountCents / 100).toFixed(2));
1592:      tierDiscountCents = Math.round(discountedSubtotalCents * 0.05);
1593:      totalSavingsCents += tierDiscountCents;
1594:      console.log('Tier 2 Discount (5%):', (tierDiscountCents / 100).toFixed(2));
1613:  console.log('Tier Discount (€):', (tierDiscountCents / 100).toFixed(2));
1742:    const tier = index + 1;
1744:    if (pairCount >= tier) {
1749:          console.log(`Segment ${tier} activated`);
1764:  // ✅ BOGO-V2-ADVANCED: Pulse cart + haptics + confetti on tier unlock
1767:    // It conflicts with celebration-pulse animation applied in tier celebration modal (line 5920)
1782:      // Confetti celebration for tier 3!
1800:  const tooltipTier = document.getElementById('tooltip-tier');
1801:  const tooltipTierItem = document.getElementById('tooltip-tier-item');
1802:  const tooltipTierLabel = document.getElementById('tooltip-tier-label');
1829:    let tierDiscountCents = 0;
1830:    if (currentTier === 3) tierDiscountCents = Math.round(subtotalAfterBogo * 0.10);
1831:    else if (currentTier === 2) tierDiscountCents = Math.round(subtotalAfterBogo * 0.05);
1838:      tooltipTier.textContent = formatMoney(tierDiscountCents);
```

**Key Findings:**
- **Line 1071:** `getTierDiscount()` function calculates tier percentage
- **Lines 1232-1234:** Tier 3 = 10% discount, Tier 2 = 5% discount (applied to subtotal AFTER BOGO)
- **Lines 1247-1255:** Dynamic tooltip showing tier discount breakdown
- **Lines 1588-1594:** Tier discount calculation in cents for precise pricing
- **Lines 1829-1831:** Tier discount applied to `subtotalAfterBogo`
- **Line 1087:** `window.tierCelebrations.celebrate(newTier)` triggers celebration animation

---

## 3. REBUY SUPPRESSION LOGIC (First 100 Lines)

**Search Command:** `grep -n -A5 "Rebuy\|rebuy"`
**Purpose:** Document complete Rebuy suppression strategy

```
140:(function preventRebuyInterference() {
141-  // Check if this is a BOGO checkout redirect
142-  const isBOGOCheckout = sessionStorage.getItem('bogo-direct-checkout');
143-
144-  if (isBOGOCheckout === 'true') {
145-    console.log('%c🛡️ BOGO direct checkout detected - preventing cart drawer', 'color: #60c655; font-weight: bold;');
--
150:    // Prevent Rebuy cart drawer from opening
151:    if (window.Rebuy) {
152:      console.log('Disabling Rebuy cart drawer...');
153:      if (window.Rebuy.SmartCart) {
154:        window.Rebuy.SmartCart.close = function() {};
155:        window.Rebuy.SmartCart.open = function() {};
156-      }
157-    }
158-
159-    // Prevent any cart drawer opens for next 2 seconds
160-    let preventCartDrawer = true;
--
167:    document.addEventListener('rebuy:cart.open', function(e) {
168-      if (preventCartDrawer) {
169:        console.log('Prevented Rebuy cart drawer from opening');
170-        e.preventDefault();
171-        e.stopPropagation();
172-        return false;
173-      }
174-    }, true);
--
6552:  // NEW Step 0: Suppress Rebuy Immediately (BOGO-DEV-VERIFY-030)
6553-  // Suppress before Cart API calls to prevent interference during cart updates and the final redirect.
6554:  suppressRebuy();
6555-
6556-  try {
6557-    // Step 1: Clear existing cart
6558-    await clearCart();
6559-
--
6637:    // Note: Old Step 5 (suppressRebuy) was moved to Step 0.
6638-
6639-    const discountCodes = getBOGODiscountCodes(pairCount);
6640-    const encodedDiscounts = discountCodes ? encodeURIComponent(discountCodes) : null;
6641-
6642-    // Step 6.5: Detect if in development environment
--
6674:    // Removed 500ms + 1000ms delays that created race condition with Rebuy.
6675:    // Root cause: Rebuy detected cart:change events and hijacked navigation during the delay window.
6676:    // Solution: Redirect immediately after cart operations complete, before Rebuy can react.
6677-
6678-    console.log('🚀 IMMEDIATE redirect to:', destinationUrl);
6679-
6680:    // Aggressive inline Rebuy suppression (belt and suspenders approach)
6681:    // Hide/disable any Rebuy elements that might interfere during redirect
6682-    try {
6683:      document.querySelectorAll('[data-rebuy], [data-rebuy-cart], rebuy-cart, .rebuy-cart').forEach(el => {
6684-        el.style.display = 'none';
6685-        el.style.pointerEvents = 'none';
6686-      });
6687-    } catch (e) {
6688-      // Ignore errors - this is belt-and-suspenders, main fix is immediate redirect
--
6701:    // Note: No setTimeout delays = no race condition window for Rebuy
6702-    console.log('✅ Immediate redirect executed');
6703-
6704-  } catch (error) {
6705-    console.error('Checkout error:', error);
6706-    hideCheckoutLoading();
--
6733: * Suppress Rebuy Smart Cart (BOGO-CHECKOUT-REBUY-FIX-028)
6734- * Multiple suppression methods for maximum effectiveness
6735- */
6736:function suppressRebuy() {
6737:  console.log('🚫 Suppressing Rebuy Smart Cart...');
6738-
6739-  // Method 1: Set global flags
6740-  window.bogoDirectCheckout = true;
6741:  window.rebuyDisabled = true;
6742-  sessionStorage.setItem('bogo-direct-checkout', 'true');
6743:  sessionStorage.setItem('rebuy-disabled', 'true');
6744-
6745:  // Method 2: Disable Rebuy object
6746:  if (window.Rebuy) {
6747:    console.log('Found Rebuy object, nullifying...');
6748:    window._rebuyOriginalBackup = window.Rebuy;
6749-
6750-    // Replace with no-op proxy
6751:    window.Rebuy = new Proxy({}, {
6752-      get: (target, prop) => {
6753:        console.log(`Rebuy.${prop} blocked`);
6754-        return () => {};
6755-      },
6756-      set: () => true
6757-    });
6758-  }
--
6760:  // Method 3: Prevent Rebuy cart events
6761:  const rebuyEvents = ['rebuy:cart-open', 'rebuy:cart-update', 'rebuy:checkout'];
6762:  rebuyEvents.forEach(eventName => {
6763-    document.addEventListener(eventName, (e) => {
6764:      console.log(`Blocked Rebuy event: ${eventName}`);
6765-      e.stopImmediatePropagation();
```

**Key Suppression Methods:**

1. **Page Load Prevention (Lines 140-174):**
   - Checks `sessionStorage.getItem('bogo-direct-checkout')`
   - Disables `window.Rebuy.SmartCart.open()` and `.close()`
   - Intercepts `rebuy:cart.open` event for 2 seconds

2. **Pre-Checkout Suppression (Line 6554):**
   - Called BEFORE cart operations
   - Prevents race conditions during cart updates

3. **Inline DOM Suppression (Lines 6683-6686):**
   - Hides all `[data-rebuy]`, `rebuy-cart`, `.rebuy-cart` elements
   - Sets `pointer-events: none` to disable interaction

4. **suppressRebuy() Function (Lines 6736-6758):**
   - **Method 1:** Global flags (`window.bogoDirectCheckout`, `window.rebuyDisabled`)
   - **Method 2:** Replace `window.Rebuy` with no-op Proxy
   - **Method 3:** Block events (`rebuy:cart-open`, `rebuy:cart-update`, `rebuy:checkout`)
   - **Method 4:** Hide widget DOM elements
   - **Method 5:** Add `bogo-checkout-mode` body class

5. **Restoration (Lines 6781-6793):**
   - Restore Rebuy after 5 seconds
   - Clean up sessionStorage and body class

---

## CHECKOUT FLOW DIAGRAM

```
BOGO CHECKOUT SEQUENCE
═══════════════════════════════════════════════

User Clicks "Checkout"
        ↓
Step 0: suppressRebuy()
        ├─ Set global flags
        ├─ Nullify Rebuy object (Proxy)
        ├─ Block Rebuy events
        ├─ Hide Rebuy widgets
        └─ Add body class
        ↓
Step 1: clearCart()
        └─ POST /cart/clear.js
        ↓
Step 2: Build cartItems array
        ├─ Iterate pairs
        ├─ Add slot1 (variantId, quantity: 1)
        ├─ Add slot2 (variantId, quantity: 1)
        └─ Attach properties:
            ├─ _pair_number
            └─ _bogo_offer
        ↓
Step 3: Validate cartItems
        ├─ Check length > 0
        ├─ Validate variant IDs
        └─ Filter invalid items
        ↓
Step 4: addPairsToCart()
        └─ POST /cart/add.js
            └─ { items: cartItems }
        ↓
Step 5: getBOGODiscountCodes(pairCount)
        ├─ 1 pair: 'BOGO2025'
        ├─ 2 pairs: 'BOGO2025,TIER2-5OFF,FREESHIP'
        └─ 3+ pairs: 'BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP'
        ↓
Step 6: Inline DOM suppression
        └─ Hide all [data-rebuy] elements
        ↓
Step 7: IMMEDIATE redirect
        └─ window.location.replace(/checkout?discount=...)
        ↓
CRITICAL: No setTimeout delays
          = No race condition window for Rebuy
```

---

## TIER DISCOUNT LOGIC

### Tier Thresholds
```javascript
// Based on pair count
1 pair  = Tier 1 (BOGO only, no extra discount)
2 pairs = Tier 2 (BOGO + 5% OFF + Free Shipping)
3+ pairs = Tier 3 (BOGO + 10% OFF + Free Cable + Free Shipping)
```

### Discount Calculation Order
```javascript
// Step 1: Calculate order subtotal (retail prices)
orderSubtotal = sum of all product prices

// Step 2: Calculate BOGO savings (free items)
bogoSavings = sum of cheaper items in each pair

// Step 3: Calculate tier discount (applied to subtotal AFTER BOGO)
discountedSubtotal = orderSubtotal - bogoSavings

if (pairCount >= 3) {
  tierDiscount = discountedSubtotal * 0.10  // 10%
} else if (pairCount >= 2) {
  tierDiscount = discountedSubtotal * 0.05  // 5%
} else {
  tierDiscount = 0
}

// Step 4: Calculate total savings
totalSavings = bogoSavings + tierDiscount + shippingSavings + cableSavings
```

### Discount Codes Applied
```javascript
// Tier 1 (1 pair)
discount_codes = 'BOGO2025'

// Tier 2 (2 pairs)
discount_codes = 'BOGO2025,TIER2-5OFF,FREESHIP'
// TIER2-5OFF → 5% discount
// FREESHIP → Free premium shipping (€4.99 value)

// Tier 3 (3+ pairs)
discount_codes = 'BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP'
// TIER3-10OFF → 10% discount
// FREECABLE2025 → Free Titan Smart Cable (€18.95 value)
// FREESHIP → Free premium shipping (€4.99 value)
```

---

## CART PROPERTIES

**Item Properties Attached:**
```javascript
{
  id: variantId,           // Shopify variant ID
  quantity: 1,              // Always 1 per item
  properties: {
    '_pair_number': 1,                     // Which pair (1, 2, 3...)
    '_bogo_offer': 'Black Friday BOGO 2025' // Offer label
  }
}
```

**Bonus Cable Properties (Tier 3):**
```javascript
{
  id: '43480190943410',  // Specific variant ID for bonus cable
  quantity: 1,
  properties: {
    '_bonus_item': 'FREE Tier 3 Bonus',
    '_tier_3_bonus': 'Titan Smart Cable'
  }
}
```

---

## CRITICAL TIMING FIX

**Problem:** Race Condition with Rebuy
- Old code had `setTimeout(redirect, 500)` + `setTimeout(cleanup, 1000)`
- Rebuy detected `cart:change` events during these delays
- Rebuy hijacked navigation and opened cart drawer

**Solution:** Immediate Redirect (SH-CRITICAL-FIX-CHECKOUT-HIJACKING-001)
```javascript
// BEFORE (Race condition)
suppressRebuy();
await addToCart();
setTimeout(() => {
  window.location.href = checkoutUrl;  // ⚠️ 500ms delay
}, 500);

// AFTER (No race condition)
suppressRebuy();
await addToCart();
window.location.replace(checkoutUrl);  // ✅ IMMEDIATE
```

**Key Change:** `window.location.replace()` instead of `.href` with delay
**Result:** Rebuy has no time window to intercept navigation

---

## BROWSER BACK BUTTON HANDLING

**Problem:** User presses back during checkout loading
**Solution:** `popstate` event listener (Lines 7064-7200)

**Cleanup Steps:**
1. Remove checkout loading modal
2. Clear cart (`/cart/clear.js`)
3. Reset `window.bogoState`
4. Clear `localStorage`
5. Clean up sessionStorage flags
6. Remove body classes
7. Reset UI elements (progress bar, cart count)
8. Show toast notification

**State Check:** Skip cleanup if `event.state.bogoCheckoutStarted === true` (checkout in progress)

---

## TESTING COMMANDS

```javascript
// Check current tier
console.log(window.bogoState.pairs.length);

// Test discount code generation
getBOGODiscountCodes(1);  // Should return 'BOGO2025'
getBOGODiscountCodes(2);  // Should return 'BOGO2025,TIER2-5OFF,FREESHIP'
getBOGODiscountCodes(3);  // Should return 'BOGO2025,TIER3-10OFF,FREECABLE2025,FREESHIP'

// Check Rebuy suppression state
console.log(window.bogoDirectCheckout);        // Should be false (normal)
console.log(window.rebuyDisabled);             // Should be false (normal)
console.log(sessionStorage.getItem('bogo-direct-checkout')); // Should be null

// Trigger checkout (test environment only)
proceedToCheckout();  // Should redirect to /cart (dev) or /checkout (prod)
```

---

**End of Extraction Set 2**
Generated: 2025-11-24
Total: Checkout flow (500 lines) + 50 discount/tier matches + 100 Rebuy suppression lines
