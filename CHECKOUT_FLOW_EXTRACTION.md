# BOGO CHECKOUT FLOW EXTRACTION

**Current Date:** 2025-11-14
**Branch:** bf-2025
**Issue:** User stuck on loading screen after browser back button

---

## 1. CHECKOUT BUTTON LOCATION

### Sticky Cart Checkout Button
**File:** `assets/bogo-builder.js`
**Lines:** 1607-1612, 1643

```javascript
const checkoutAction = () => {
  if (typeof proceedToCheckout === 'function') {
    console.log('Proceeding to checkout with pairs:', state.pairs);
    proceedToCheckout();
  }
};

// Button assignment (line 1643)
primaryBtn.textContent = 'Checkout →';
primaryBtn.onclick = checkoutAction;
```

**Analysis:**
- Button selector: Dynamically created sticky cart primary button (not a fixed ID)
- Event: `onclick` (inline event handler)
- Handler function: `checkoutAction` → calls `proceedToCheckout()`

### Modal Checkout Button
**File:** `assets/bogo-builder.js`
**Lines:** 1942-1950

```javascript
// ✅ BOGO-CHECKOUT-FINAL-061: Setup modal checkout button
const modalCheckoutBtn = document.getElementById('modal-checkout-btn');
if (modalCheckoutBtn) {
  modalCheckoutBtn.onclick = function() {
    console.log('Modal checkout clicked');
    closePairModal();
    proceedToCheckout();
  };
}
```

**Analysis:**
- Button selector: `#modal-checkout-btn`
- Event: `onclick`
- Handler function: Anonymous function → calls `proceedToCheckout()`

---

## 2. LOADING MODAL CODE

**File:** `assets/bogo-builder.js`
**Lines:** 6822-6903

```javascript
// Show loading overlay (BOGO-CHECKOUT-REBUY-FIX-028)
function showCheckoutLoading() {
  const overlay = document.createElement('div');
  overlay.id = 'checkout-loading';

  // Detect dev environment
  const isDev = window.location.hostname === '127.0.0.1' ||
                window.location.hostname === 'localhost' ||
                window.location.port === '9292';

  const devNotice = isDev
    ? `<p class="dev-notice" style="...">⚠️ Development mode: Redirecting to cart page</p>`
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
      <div style="...">
        <div style="..." [spinning loader]></div>
        <h3 style="...">Preparing Your Checkout...</h3>
        <p style="...">Adding ${window.bogoState?.pairs?.length || 0} BOGO pairs to cart</p>
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
```

**Elements:**
- Modal ID: `#checkout-loading`
- Text elements: Hardcoded in template strings
  - "Preparing Your Checkout..."
  - "Adding X BOGO pairs to cart"
- How shown: `document.body.appendChild(overlay)` - creates and injects into DOM
- How hidden: `overlay.remove()` - completely removes from DOM

**CSS Styling:**
**File:** `assets/bogo-builder.css`
**Lines:** 7081-7082

```css
.bogo-checkout-loading,
#checkout-loading {
  /* Inline styles handle all styling */
}
```

---

## 3. CART ADDITION LOGIC

**File:** `assets/bogo-builder.js`
**Lines:** 6569-6743

```javascript
async function proceedToCheckout() {
  const state = window.bogoState;

  console.log('=== BOGO CHECKOUT START (Optimized Flow BOGO-DEV-VERIFY-030) ===');
  console.log('State:', state);

  // Validation
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

  // Show loading
  showCheckoutLoading();

  // NEW Step 0: Suppress Rebuy Immediately (BOGO-DEV-VERIFY-030)
  suppressRebuy();

  try {
    // Step 1: Clear existing cart
    await clearCart();

    // Step 2: Build items array
    const items = [];
    const pairCount = state.pairs.length;

    // Add all BOGO pairs
    state.pairs.forEach((pair, pairIndex) => {
      const pairNumber = pairIndex + 1;
      const product1 = pair.slot1 || pair.product1;
      const product2 = pair.slot2 || pair.product2;

      // Add first product
      if (product1) {
        const variantId = product1.variantId || product1.variant_id || product1.id;
        if (variantId) {
          items.push({
            id: variantId,
            quantity: 1,
            properties: {
              '_pair_number': pairNumber,
              '_bogo_offer': 'Black Friday BOGO 2025',
              '_product_name': product1.title || 'Product 1'
            }
          });
        }
      }

      // Add second product
      if (product2) {
        const variantId = product2.variantId || product2.variant_id || product2.id;
        if (variantId) {
          items.push({
            id: variantId,
            quantity: 1,
            properties: {
              '_pair_number': pairNumber,
              '_bogo_offer': 'Black Friday BOGO 2025',
              '_product_name': product2.title || 'Product 2'
            }
          });
        }
      }
    });

    // Step 3: Add bonus cable for Tier 3
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

    console.log('Adding items to cart via Cart API:', items);

    // Step 4: Add all items to cart via Cart API
    const addResponse = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: items })
    });

    if (!addResponse.ok) {
      const errorText = await addResponse.text();
      throw new Error(`Cart API error: ${addResponse.status} - ${errorText}`);
    }

    const cartData = await addResponse.json();
    console.log('Items added to cart successfully:', cartData);

    // Step 5 & 6: Determine Destination and Build URL
    const discountCodes = getBOGODiscountCodes(pairCount);
    const encodedDiscounts = discountCodes ? encodeURIComponent(discountCodes) : null;

    // Step 6.5: Detect if in development environment
    const isDev = window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === 'localhost' ||
                  window.location.port === '9292';

    let destinationUrl;

    if (isDev) {
      // Development: Go to cart page for verification
      console.log('⚠️ Development mode: Redirecting to /cart for verification.');
      destinationUrl = '/cart?bogo_verify=true';
      if (encodedDiscounts) {
        destinationUrl += `&discount=${encodedDiscounts}`;
      }
    } else {
      // Production: Go directly to checkout
      console.log('✅ Production mode: Redirecting directly to /checkout.');
      destinationUrl = '/checkout';
      if (encodedDiscounts) {
        destinationUrl += `?discount=${encodedDiscounts}`;
      }
    }

    console.log('Redirecting to:', destinationUrl);

    // Step 7: Clear BOGO state
    clearBOGOState();

    // Step 8: Navigate to checkout with fallback
    setTimeout(() => {
      // Method 1: Standard navigation
      window.location.href = destinationUrl;

      // Method 2: Fallback if Method 1 blocked
      setTimeout(() => {
        if (window.location.href.includes('bogo-bf-2025')) {
          console.warn('Primary navigation blocked, using fallback...');
          if (window.top) {
            window.top.location.href = destinationUrl;
          }
        }
      }, 1000);
    }, 500);

  } catch (error) {
    console.error('Checkout error:', error);
    hideCheckoutLoading();
    showBogoToast('Checkout failed. Please try again or contact support.', 'error', 5000);

    // Clean up flags
    window.bogoDirectCheckout = false;
    sessionStorage.removeItem('bogo-direct-checkout');
  }
}
```

**Flow:**
1. Validate state and pairs
2. Show loading modal (`showCheckoutLoading()`)
3. Suppress Rebuy cart interference
4. Clear existing cart via `/cart/clear.js`
5. Build items array from pairs (includes variant IDs, quantities, properties)
6. Add bonus cable if 3+ pairs
7. Add all items to cart via `/cart/add.js` (single batch request)
8. Determine destination URL (dev vs production)
9. Clear BOGO state from localStorage
10. Navigate to checkout after 500ms delay

**API Endpoints Used:**
- `/cart/clear.js` - POST request to clear cart
- `/cart/add.js` - POST request with JSON body containing `items` array

---

## 4. CHECKOUT REDIRECT

**File:** `assets/bogo-builder.js`
**Lines:** 6718-6732

```javascript
// Step 8: Navigate to checkout with fallback
setTimeout(() => {
  // Method 1: Standard navigation
  window.location.href = destinationUrl;

  // Method 2: Fallback if Method 1 blocked (Preserving existing logic)
  setTimeout(() => {
    if (window.location.href.includes('bogo-bf-2025')) {
      console.warn('Primary navigation blocked, using fallback...');
      // Ensure window.top is accessible before using it
      if (window.top) {
        window.top.location.href = destinationUrl;
      }
    }
  }, 1000);
}, 500);
```

**Redirect Method:**
- Primary: `window.location.href = destinationUrl`
- Fallback: `window.top.location.href = destinationUrl`

**Timing:**
- Initial delay: 500ms after cart API success
- Fallback check: 1000ms after primary redirect attempt
- **Total potential delay: 1500ms before final redirect**

**Destination URLs:**
- **Development:** `/cart?bogo_verify=true&discount=CODES`
- **Production:** `/checkout?discount=CODES`

---

## 5. STATE MANAGEMENT

**File:** `assets/bogo-builder.js`
**Lines:** 183-244, 485-521, 6715

### State Initialization
```javascript
// Lines 485-521
function loadBOGOState() {
  try {
    const saved = localStorage.getItem(BOGO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const age = Date.now() - parsed.timestamp;

      if (age < BOGO_EXPIRY_HOURS * 60 * 60 * 1000) {
        window.bogoState = {
          pairs: parsed.pairs || [],
          currentPair: parsed.currentPair || {}
        };
        console.log('✅ BOGO state restored from localStorage:', window.bogoState.pairs.length, 'pairs');
        return true;
      }
    }
  } catch (error) {
    console.warn('Failed to load BOGO state:', error);
  }

  // Initialize fresh state
  window.bogoState = {
    pairs: [],
    currentPair: {}
  };
  return false;
}
```

### State Saving
```javascript
// Lines 189-200
function saveBOGOState() {
  try {
    const stateToSave = {
      pairs: window.bogoState.pairs || [],
      currentPair: window.bogoState.currentPair || {},
      timestamp: Date.now()
    };
    localStorage.setItem(BOGO_STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('💾 BOGO state saved to localStorage');
  } catch (error) {
    console.warn('Failed to save BOGO state:', error);
  }
}
```

### State Clearing
```javascript
// Lines 241-244
function clearBOGOState() {
  localStorage.removeItem(BOGO_STORAGE_KEY);
  console.log('🗑️ BOGO state cleared');
}

// Called in proceedToCheckout() at line 6715
clearBOGOState();
```

**State Variables:**
- `window.bogoState` - Global state object
- `window.bogoState.pairs` - Array of BOGO pairs
- `window.bogoState.currentPair` - Current incomplete pair being built
- `localStorage['titan-bogo-state']` - Persistent storage key
- `window.bogoDirectCheckout` - Checkout flag (set during suppressRebuy)
- `sessionStorage['bogo-direct-checkout']` - Session checkout flag

**Reset Logic:**
- **Is state reset anywhere?** YES
- **Where:** Line 6715 in `proceedToCheckout()` - called BEFORE redirect
- **How:** Calls `clearBOGOState()` which removes localStorage entry
- **⚠️ PROBLEM:** State is cleared but NO in-memory reset of `window.bogoState`

---

## 6. BACK BUTTON HANDLING

**Search Results:** NO MATCHES FOUND

```bash
# Searched for:
- popstate
- window.history
- beforeunload
- onpopstate
```

**Findings:**
- **popstate listener:** ❌ NO
- **beforeunload handler:** ❌ NO
- **History manipulation:** ❌ NO

**⚠️ CRITICAL ISSUE:** There is **NO back button handling whatsoever**.

---

## 7. IDENTIFIED ISSUES

### Issue 1: Modal Not Hidden on Back Button

**Problem:**
When user presses browser back button after checkout starts, the loading modal remains visible because there's no `popstate` event listener to detect navigation backwards.

**Current code:**
```javascript
// showCheckoutLoading() creates modal (line 6822-6903)
document.body.appendChild(overlay); // Adds to DOM

// hideCheckoutLoading() removes modal (line 6905-6908)
const overlay = document.getElementById('checkout-loading');
if (overlay) overlay.remove();

// ❌ hideCheckoutLoading() is ONLY called in error handler (line 6736)
// ❌ NEVER called on successful redirect
// ❌ NO popstate listener to call it on back button
```

**Why it fails:**
1. Modal is created and added to DOM
2. Redirect happens via `window.location.href` after 500ms
3. User can press back button during this window OR after arriving at checkout
4. Browser navigates back to BOGO page
5. Page loads with modal still in DOM (if within 500ms) OR modal gets injected during the setTimeout callbacks
6. No code removes the modal on back navigation

### Issue 2: State Not Fully Reset

**Problem:**
`clearBOGOState()` only clears localStorage but doesn't reset the in-memory `window.bogoState` object.

**Current code:**
```javascript
// Line 241-244
function clearBOGOState() {
  localStorage.removeItem(BOGO_STORAGE_KEY);
  console.log('🗑️ BOGO state cleared');
  // ❌ Does NOT reset window.bogoState
}
```

**Why it fails:**
If user presses back button, `window.bogoState` still exists in memory with the old pairs data. This could cause:
- UI showing incorrect pair counts
- Double-checkout if user clicks checkout again
- State inconsistency between localStorage and memory

### Issue 3: Redirect Timing Creates Back Button Window

**Problem:**
The 500ms delay before redirect creates a window where:
- Loading modal is visible
- User can press back button
- Modal remains stuck because redirect hasn't happened yet

**Current code:**
```javascript
// Line 6718-6732
setTimeout(() => {
  window.location.href = destinationUrl;

  setTimeout(() => {
    if (window.location.href.includes('bogo-bf-2025')) {
      window.top.location.href = destinationUrl;
    }
  }, 1000);
}, 500); // ⚠️ 500ms window where modal is visible but page hasn't redirected
```

**Why it fails:**
During the 500ms delay:
1. Loading modal is visible
2. Cart items are already added
3. State is already cleared
4. User presses back button
5. Modal never gets removed
6. State is gone, so UI might break

### Issue 4: Rebuy Suppression Auto-Restores

**Problem:**
The Rebuy suppression automatically restores after 5 seconds, which could interfere if the checkout process takes longer or user returns.

**Current code:**
```javascript
// Lines 6806-6818
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
}, 5000); // ⚠️ Hardcoded 5 second restore
```

**Why it could fail:**
If checkout takes > 5 seconds or user returns within 5 seconds, Rebuy might interfere again.

---

## 8. PROPOSED FIX STRATEGY

### Option 1: Add popstate Listener + Hide Modal + Reset State

**Pros:**
- Clean solution
- Handles all back button scenarios
- Preserves cart if user wants to continue
- Minimal code changes
- No risk of data loss

**Cons:**
- Cart items remain (user might not expect this)
- Requires understanding popstate events

**Implementation:**
```javascript
// Add near end of file
window.addEventListener('popstate', function(event) {
  console.log('🔙 Back button detected - cleaning up checkout');

  // Hide loading modal if present
  hideCheckoutLoading();

  // Reset in-memory state
  window.bogoState = {
    pairs: [],
    currentPair: {}
  };

  // Clear localStorage
  clearBOGOState();

  // Clean up checkout flags
  window.bogoDirectCheckout = false;
  sessionStorage.removeItem('bogo-direct-checkout');

  // Update UI to reflect empty state
  if (typeof updateStickyCartUI === 'function') {
    updateStickyCartUI();
  }

  // Show notification
  showBogoToast('Checkout cancelled. You can start building again.', 'info');
});
```

### Option 2: Add popstate Listener + Hide Modal + Clear Cart + Reset State

**Pros:**
- Complete cleanup
- User starts fresh
- No confusion about cart state
- Matches expected behavior (back = cancel)

**Cons:**
- User loses cart items (might frustrate some users)
- Requires additional Cart API call
- Slightly more complex

**Implementation:**
```javascript
window.addEventListener('popstate', async function(event) {
  console.log('🔙 Back button detected - full cleanup');

  // Hide loading modal
  hideCheckoutLoading();

  // Clear cart
  try {
    await fetch('/cart/clear.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Cart cleared on back navigation');
  } catch (error) {
    console.warn('Failed to clear cart:', error);
  }

  // Reset state
  window.bogoState = { pairs: [], currentPair: {} };
  clearBOGOState();
  window.bogoDirectCheckout = false;
  sessionStorage.removeItem('bogo-direct-checkout');

  // Update UI
  if (typeof updateStickyCartUI === 'function') {
    updateStickyCartUI();
  }

  // Notify user
  showBogoToast('Checkout cancelled. Cart cleared.', 'info');
});
```

### Option 3: Prevent Back Navigation During Checkout (NOT RECOMMENDED)

**Pros:**
- Prevents the issue entirely
- Simple implementation

**Cons:**
- Bad UX - users expect back button to work
- Can't actually prevent back button in modern browsers
- Creates frustration

**RECOMMENDED:** ❌ DO NOT USE THIS APPROACH

---

## 9. RECOMMENDED FIX

**Use Option 1: Hide Modal + Reset State (Preserve Cart)**

**Reasoning:**
1. **Better UX:** User's selections are preserved if they accidentally hit back
2. **Simpler:** No need to call Cart API again
3. **Safer:** No risk of clearing cart unintentionally
4. **Standard pattern:** Many e-commerce sites preserve cart on back navigation
5. **Easy recovery:** User can review pairs modal and proceed again

**However, add a twist:**
- Check if user is ON the checkout page or cart page
- If they're on those pages and press back, DO clear cart
- If they press back during the loading window, just hide modal and reset state

---

## 10. CODE TO MODIFY

### File 1: `assets/bogo-builder.js`

#### Change 1: Add popstate Event Listener
**Location:** End of file (after line 7076)
**Function:** New global listener
**Change needed:** Add complete back button handler

```javascript
// ✅ BOGO-BACK-BUTTON-FIX: Handle back button during checkout
window.addEventListener('popstate', function(event) {
  console.log('🔙 Back button detected');

  // Hide loading modal if present
  const checkoutModal = document.getElementById('checkout-loading');
  if (checkoutModal) {
    console.log('Removing checkout loading modal');
    checkoutModal.remove();
  }

  // Reset in-memory state
  if (window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
  }

  // Clear localStorage
  if (typeof clearBOGOState === 'function') {
    clearBOGOState();
  }

  // Clean up checkout flags
  window.bogoDirectCheckout = false;
  sessionStorage.removeItem('bogo-direct-checkout');
  sessionStorage.removeItem('rebuy-disabled');
  document.body.classList.remove('bogo-checkout-mode');

  // Update UI to reflect empty state
  if (typeof updateStickyCartUI === 'function') {
    updateStickyCartUI();
  }

  // Show notification
  if (typeof showBogoToast === 'function') {
    showBogoToast('Checkout cancelled. You can build a new bundle.', 'info');
  }
});
```

#### Change 2: Improve clearBOGOState to Reset Memory
**Location:** Lines 241-244
**Function:** `clearBOGOState()`
**Change needed:** Also reset in-memory state

```javascript
function clearBOGOState() {
  localStorage.removeItem(BOGO_STORAGE_KEY);

  // ✅ BOGO-BACK-BUTTON-FIX: Also reset in-memory state
  if (window.bogoState) {
    window.bogoState = {
      pairs: [],
      currentPair: {}
    };
  }

  console.log('🗑️ BOGO state cleared (localStorage + memory)');
}
```

#### Change 3: Add Cleanup to hideCheckoutLoading
**Location:** Lines 6905-6908
**Function:** `hideCheckoutLoading()`
**Change needed:** Ensure complete cleanup

```javascript
function hideCheckoutLoading() {
  const overlay = document.getElementById('checkout-loading');
  if (overlay) {
    overlay.remove();
    console.log('✅ Checkout loading modal removed');
  }

  // ✅ BOGO-BACK-BUTTON-FIX: Clean up any stray checkout flags
  document.body.classList.remove('bogo-checkout-mode');
}
```

---

## 11. TESTING CHECKLIST

After fix is applied:

### Happy Path Testing
- [ ] Click checkout button → loading modal shows
- [ ] Cart items added successfully (check browser Network tab)
- [ ] Redirect to checkout works
- [ ] Checkout page loads correctly
- [ ] Discount codes applied correctly

### Back Button Testing (CRITICAL)
- [ ] **Test 1:** Click checkout, immediately press back
  - [ ] Modal disappears
  - [ ] No JavaScript errors
  - [ ] UI shows empty state
  - [ ] Can build new bundle

- [ ] **Test 2:** Click checkout, wait for redirect, press back from checkout page
  - [ ] Returns to BOGO page
  - [ ] No stuck loading modal
  - [ ] UI shows empty state
  - [ ] Can build new bundle

- [ ] **Test 3:** Click checkout, press back during 500ms delay
  - [ ] Modal disappears
  - [ ] Page is interactive
  - [ ] No errors

- [ ] **Test 4:** Build 2 pairs, checkout, back button, build 1 pair, checkout
  - [ ] Only 1 pair goes to cart (not 3)
  - [ ] State properly reset

### Edge Cases
- [ ] Press back button multiple times rapidly
- [ ] Forward button after back button
- [ ] Mobile browser back gesture
- [ ] Mobile Safari specifically
- [ ] Chrome on Android

### State Management
- [ ] localStorage cleared after back button
- [ ] window.bogoState reset after back button
- [ ] sessionStorage flags cleared
- [ ] No memory leaks from multiple checkouts

### UI Testing
- [ ] Sticky cart updates correctly after back button
- [ ] Pair count shows 0 after back
- [ ] "Start Building" button shows after back
- [ ] Product selection works after back

### Cross-Browser Testing
- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] Firefox desktop
- [ ] Chrome mobile
- [ ] Safari iOS
- [ ] Samsung Internet

---

## 12. ADDITIONAL FINDINGS

### Discount Code System
**File:** `assets/bogo-builder.js`
**Lines:** 6746-6755

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

**Note:** These codes are appended to checkout URL and should be verified in Shopify admin.

### Clear Cart Function
**File:** `assets/bogo-builder.js`
**Lines:** 6911-6922

```javascript
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
```

**Note:** This is used to clear cart BEFORE adding BOGO items. Works correctly.

### Rebuy Suppression System
**File:** `assets/bogo-builder.js`
**Lines:** 6761-6819

Very comprehensive Rebuy suppression with 5 methods:
1. Global flags
2. Proxy object replacement
3. Event blocking
4. Widget hiding
5. Body class addition

**Potential issue:** 5-second auto-restore might not align with user journey.

---

## 13. ROOT CAUSE ANALYSIS

**Primary Root Cause:**
No `popstate` event listener exists to detect back button navigation.

**Contributing Factors:**
1. Loading modal is created with `appendChild()` but only removed in error handler
2. `clearBOGOState()` doesn't reset in-memory state
3. 500ms delay before redirect creates window for back button
4. State clearing happens BEFORE redirect (user can back out after state is gone)

**Why User Gets Stuck:**
```
1. User clicks "Checkout"
2. showCheckoutLoading() creates modal
3. Modal covers entire screen (z-index: 100000)
4. Cart API calls execute (async)
5. clearBOGOState() removes localStorage
6. setTimeout(..., 500) waits
7. USER PRESSES BACK BUTTON ← CRITICAL MOMENT
8. Browser navigates back to BOGO page
9. Modal is still in DOM
10. No code removes it
11. User sees "Preparing Your Checkout..." forever
12. Can't interact with page (modal blocks clicks)
13. STUCK
```

**Visual Timeline:**
```
0ms    - Checkout clicked
1ms    - Modal added to DOM
10ms   - Cart clearing
50ms   - Cart adding items
200ms  - State cleared
500ms  - Redirect scheduled
[USER PRESSES BACK DURING THIS WINDOW]
????   - Back to BOGO page
????   - Modal still visible
????   - No cleanup code runs
```

---

## 14. SUCCESS METRICS

After implementing the fix:

**Must Have:**
- ✅ 0% of users report stuck loading screen
- ✅ Back button works 100% of the time
- ✅ No JavaScript errors in console
- ✅ State properly resets on back navigation

**Nice to Have:**
- ✅ Toast notification informs user of cancellation
- ✅ UI smoothly transitions back to empty state
- ✅ User can immediately build new bundle
- ✅ No flashing or visual glitches

**Metrics to Monitor:**
- Checkout abandonment rate (should not increase)
- Time on BOGO page after back button (should be normal)
- Support tickets about "stuck" state (should be 0)

---

## 15. IMPLEMENTATION PRIORITY

**CRITICAL - Implement Immediately:**
1. Add popstate event listener (Fix #1)
2. Update clearBOGOState to reset memory (Fix #2)

**HIGH - Implement Soon:**
3. Improve hideCheckoutLoading cleanup (Fix #3)

**MEDIUM - Consider for Future:**
4. Reduce redirect delay from 500ms to 200ms
5. Add visual feedback during 500ms delay
6. Consider showing "cancelling..." state on back

**LOW - Nice to Have:**
7. Analytics tracking for back button usage
8. A/B test cart preservation vs clearing
9. User preference for "remember my bundle"

---

## END OF EXTRACTION

**Next Steps:**
1. Review this extraction document
2. Confirm fix strategy (Option 1 recommended)
3. Create Prompt 2: BOGO-BACK-BUTTON-FIX implementation
4. Test thoroughly on staging
5. Deploy to production with monitoring

**Estimated Fix Complexity:** LOW
**Estimated Fix Time:** 15-30 minutes
**Risk Level:** LOW (adding new code, not modifying existing)
**Testing Required:** HIGH (back button is critical UX)