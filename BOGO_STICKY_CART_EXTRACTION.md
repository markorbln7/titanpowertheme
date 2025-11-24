# BOGO STICKY CART + REVIEW MODAL - COMPLETE EXTRACTION

**Date:** 2025-11-22
**Source:** Black Friday 2024 BOGO Builder
**Purpose:** Extract for adaptation to BF25 Tier-Based Hero Section

---

## 📊 EXTRACTION SUMMARY

### File Manifest
```
sections/
  └── bogo-builder-2024.liquid (976 lines)

assets/
  ├── bogo-builder.css (8,816 lines)
  └── bogo-builder.js (7,950 lines)
```

**Total Code Volume:** 17,742 lines
**Relevant Code for Extraction:** ~2,500 lines (sticky cart + modal only)

### Component Breakdown
- ✅ **Sticky Cart V2** (Lines 514-615 in liquid, ~500 lines CSS/JS)
- ✅ **Review Modal** (Lines 761-878 in liquid, ~800 lines CSS/JS)
- ✅ **Rebuy Bypass System** (Lines 145-172 in JS)
- ✅ **State Management** (Centralized `window.bogoState` object)
- ✅ **Currency Conversion System** (Multi-currency support)

---

## 1. STICKY CART V2 COMPONENT

### 1.1 HTML Structure

**File:** `sections/bogo-builder-2024.liquid` (Lines 514-615)

```liquid
<div class="bogo-sticky-cart-v2" id="bogo-sticky-cart-v2" style="display: none;">
  <div class="sticky-cart-container">

    {%- comment -%} 1. LEFT: Status & Pair Count {%- endcomment -%}
    <div class="sticky-cart-status">
      <div class="status-pair-count" id="v2-pair-count">Start Building</div>
    </div>

    {%- comment -%} Mobile Incentive Message {%- endcomment -%}
    <div class="progress-incentive progress-incentive-mobile" id="v2-incentive-message-mobile">
      Select 2 items to activate Buy 1 Get 1 FREE!
    </div>

    {%- comment -%} 2. CENTER: Progress & Incentive Message {%- endcomment -%}
    <div class="sticky-cart-progress">
      {%- comment -%} Desktop Incentive Message {%- endcomment -%}
      <div class="progress-incentive progress-incentive-desktop" id="v2-incentive-message">
        Select 2 items to activate Buy 1 Get 1 FREE!
      </div>

      {%- comment -%} Segmented 3-step progress bar {%- endcomment -%}
      <div class="progress-bar-segmented">
        <div class="progress-segment" data-tier="1">
          <div class="segment-fill"></div>
          <div class="segment-label">
            <span class="segment-title">1 Pair</span>
            <span class="segment-benefit">Get FREE</span>
          </div>
        </div>
        <div class="progress-segment" data-tier="2">
          <div class="segment-fill"></div>
          <div class="segment-label">
            <span class="segment-title">2 Pairs</span>
            <span class="segment-benefit">+5% & Ship</span>
          </div>
        </div>
        <div class="progress-segment" data-tier="3">
          <div class="segment-fill"></div>
          <div class="segment-label">
            <span class="segment-title">3+ Pairs</span>
            <span class="segment-benefit">+10% & Cable</span>
          </div>
        </div>
      </div>
    </div>

    {%- comment -%} 3. RIGHT: Total Savings with Breakdown Tooltip {%- endcomment -%}
    <div class="sticky-cart-value">
      <div class="value-label">You Save</div>
      <div class="value-amount-wrapper">
        <div class="value-amount" id="v2-total-savings">€0.00</div>
        <button class="savings-info-btn" id="v2-savings-info" aria-label="View savings breakdown">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      {%- comment -%} Savings Breakdown Tooltip {%- endcomment -%}
      <div class="savings-tooltip" id="v2-savings-tooltip" role="tooltip" aria-hidden="true">
        <div class="savings-tooltip-arrow"></div>
        <div class="savings-tooltip-content">
          <div class="tooltip-title">Your Savings Breakdown</div>
          <div class="tooltip-items" id="v2-tooltip-breakdown">
            <div class="tooltip-item">
              <span class="tooltip-label">BOGO Discount:</span>
              <span class="tooltip-value" id="tooltip-bogo">€0.00</span>
            </div>
            <div class="tooltip-item" id="tooltip-tier-item" style="display: none;">
              <span class="tooltip-label" id="tooltip-tier-label">Tier Discount:</span>
              <span class="tooltip-value" id="tooltip-tier">€0.00</span>
            </div>
            <div class="tooltip-item" id="tooltip-shipping-item" style="display: none;">
              <span class="tooltip-label">FREE Shipping:</span>
              <span class="tooltip-value">€4.99</span>
            </div>
            <div class="tooltip-item" id="tooltip-cable-item" style="display: none;">
              <span class="tooltip-label">FREE Cable:</span>
              <span class="tooltip-value">€18.95</span>
            </div>
          </div>
          <div class="tooltip-total">
            <span class="tooltip-label">Total Saved:</span>
            <span class="tooltip-value" id="tooltip-total">€0.00</span>
          </div>
        </div>
      </div>
    </div>

    {%- comment -%} 4. FAR RIGHT: Action Buttons {%- endcomment -%}
    <div class="sticky-cart-actions">
      <button class="btn-sticky-secondary" id="v2-btn-review" style="display: none;">
        Review
      </button>
      <button class="btn-sticky-primary" id="v2-btn-primary">
        Start Building
      </button>
    </div>

  </div>
</div>
```

### 1.2 Key CSS Patterns

**File:** `assets/bogo-builder.css` (Lines 4710-5280)

**Layout Structure:**
```css
.bogo-sticky-cart-v2 {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 2px solid rgba(96, 198, 85, 0.3);
  z-index: 9999;
  padding: 16px 20px;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.6);
}

.sticky-cart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1600px;
  margin: 0 auto;
  gap: 20px;
}
```

**Segmented Progress Bar:**
```css
.progress-bar-segmented {
  display: flex;
  gap: 4px;
  width: 100%;
}

.progress-segment {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-segment.active .segment-fill {
  width: 100%;
  background: linear-gradient(90deg, #60c655 0%, #7ee76d 100%);
  height: 100%;
  border-radius: 4px;
  animation: fillSegment 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fillSegment {
  from { width: 0%; }
  to { width: 100%; }
}
```

**Responsive Breakpoints:**
```css
@media (max-width: 768px) {
  .bogo-sticky-cart-v2 {
    padding: 12px 16px;
  }

  .progress-incentive-desktop {
    display: none;
  }

  .progress-incentive-mobile {
    display: block;
  }
}

@media (min-width: 769px) {
  .progress-incentive-mobile {
    display: none;
  }
}
```

### 1.3 JavaScript Update Logic

**File:** `assets/bogo-builder.js` (Lines 1504-1849)

**Core Update Function:**
```javascript
function updateStickyCart() {
  const state = window.bogoState;
  const stickyCartV2 = document.getElementById('bogo-sticky-cart-v2');

  if (!stickyCartV2 || !state) return;

  // Track previous state for animations
  if (!window.bogoCartPrevState) {
    window.bogoCartPrevState = { pairCount: 0, currentTier: 0, totalSavings: 0 };
  }
  const prevState = window.bogoCartPrevState;

  // Data collection
  const pairCount = state.pairs?.length || 0;
  const currentPair = state.currentPair;
  const hasIncompleteProduct = !!(currentPair?.slot1) !== !!(currentPair?.slot2);

  // Determine current tier
  let currentTier = 0;
  if (pairCount >= 3) currentTier = 3;
  else if (pairCount >= 2) currentTier = 2;
  else if (pairCount >= 1) currentTier = 1;

  // Calculate savings (ALL PRICES IN CENTS)
  let totalSavingsCents = 0;
  let bogoSavingsCents = 0;
  let tierDiscountCents = 0;

  if (pairCount > 0 && state.pairs) {
    // 1. BOGO Savings (100% off cheaper item)
    state.pairs.forEach(pair => {
      const item1 = pair.slot1 || pair.product1;
      const item2 = pair.slot2 || pair.product2;
      const price1 = parseInt(item1?.price || 0, 10);
      const price2 = parseInt(item2?.price || 0, 10);

      const cheaperPrice = Math.min(price1, price2);
      if (cheaperPrice > 0) {
        bogoSavingsCents += cheaperPrice;
      }
    });

    totalSavingsCents += bogoSavingsCents;

    // 2. Tier Discounts
    const retailCents = state.pairs.reduce((sum, pair) => {
      const item1 = pair.slot1 || pair.product1;
      const item2 = pair.slot2 || pair.product2;
      return sum + parseInt(item1?.price || 0, 10) + parseInt(item2?.price || 0, 10);
    }, 0);

    const discountedSubtotal = retailCents - bogoSavingsCents;

    if (currentTier === 3) {
      tierDiscountCents = Math.round(discountedSubtotal * 0.10);
      totalSavingsCents += tierDiscountCents;
    } else if (currentTier === 2) {
      tierDiscountCents = Math.round(discountedSubtotal * 0.05);
      totalSavingsCents += tierDiscountCents;
    }

    // 3. Value Adds
    const SHIPPING_VALUE_CENTS = 499;  // €4.99
    const CABLE_VALUE_CENTS = 1895;     // €18.95

    if (currentTier >= 2) totalSavingsCents += SHIPPING_VALUE_CENTS;
    if (currentTier >= 3) totalSavingsCents += CABLE_VALUE_CENTS;
  }

  // Update Savings Display
  const savingsEl = document.getElementById('v2-total-savings');
  if (savingsEl) {
    const formattedSavings = BOGOCurrency.formatMoney(totalSavingsCents);
    savingsEl.textContent = formattedSavings;
  }

  // Update UI based on cart state
  const pairCountEl = document.getElementById('v2-pair-count');
  const incentiveMsgEl = document.getElementById('v2-incentive-message');
  const primaryBtn = document.getElementById('v2-btn-primary');
  const reviewBtn = document.getElementById('v2-btn-review');

  if (hasIncompleteProduct) {
    // Incomplete Pair
    pairCountEl.textContent = `Building Pair ${pairCount + 1}...`;
    incentiveMsgEl.innerHTML = '🔥 <strong>Select 1 more item</strong> to complete your pair!';
    primaryBtn.textContent = 'Continue Shopping';
    reviewBtn.style.display = pairCount > 0 ? 'block' : 'none';

  } else if (pairCount === 0) {
    // Empty Cart
    pairCountEl.textContent = 'Start Building';
    incentiveMsgEl.innerHTML = 'Select 2 items to activate <strong>Buy 1 Get 1 FREE!</strong>';
    primaryBtn.textContent = 'Start Building';
    reviewBtn.style.display = 'none';

  } else {
    // Complete Pairs Exist
    pairCountEl.textContent = `${pairCount} Pair${pairCount !== 1 ? 's' : ''}`;
    primaryBtn.textContent = 'Checkout →';
    reviewBtn.style.display = 'block';

    // Tier-based incentive messaging
    if (currentTier === 1) {
      incentiveMsgEl.innerHTML = '🚚 <strong>Add 1 pair</strong> for +5% OFF & FREE Premium Shipping!';
    } else if (currentTier === 2) {
      incentiveMsgEl.innerHTML = '🎁 <strong>Add 1 pair</strong> for +10% OFF & FREE Titan Cable (€18.95)!';
    } else if (currentTier >= 3) {
      incentiveMsgEl.innerHTML = '👑 <strong>Max Tier Unlocked!</strong> Keep adding pairs for more savings!';
    }
  }

  // Update Segmented Progress Bar
  const segments = document.querySelectorAll('.bogo-sticky-cart-v2 .progress-segment');
  segments.forEach((segment, index) => {
    const tier = index + 1;
    if (pairCount >= tier) {
      if (!segment.classList.contains('active')) {
        setTimeout(() => {
          segment.classList.add('active');
        }, index * 150); // Stagger animation
      }
    } else {
      segment.classList.remove('active');
    }
  });

  // Celebrate tier unlock
  if (currentTier > prevState.currentTier && currentTier > 0) {
    // Haptic feedback
    if (currentTier === 1) triggerHapticFeedback('medium');
    else if (currentTier === 2) triggerHapticFeedback('heavy');
    else if (currentTier === 3) {
      triggerHapticFeedback('success');
      setTimeout(() => triggerStickyCartConfetti(), 300);
    }
  }

  // Show/hide cart
  const shouldShow = pairCount > 0 || hasIncompleteProduct || true; // Always show
  stickyCartV2.style.display = shouldShow ? 'block' : 'none';

  // Update previous state
  window.bogoCartPrevState = { pairCount, currentTier, totalSavingsCents };
}
```

---

## 2. REVIEW MODAL COMPONENT

### 2.1 HTML Structure

**File:** `sections/bogo-builder-2024.liquid` (Lines 761-878)

```liquid
<div id="pair-management-modal" class="pair-modal">
  <div class="pair-modal__overlay"></div>

  <div class="pair-modal__container">

    {%- comment -%} COMPACT HEADER {%- endcomment -%}
    <div class="pair-modal__header--compact">
      <button class="pair-modal__close" onclick="closePairModal()">×</button>

      {%- comment -%} Title {%- endcomment -%}
      <div class="pair-modal__title-compact">
        <h2 class="pair-modal__title-text">Your BOGO Pairs</h2>
      </div>

      {%- comment -%} Total Saved {%- endcomment -%}
      <div class="pair-modal__savings-compact">
        <div class="savings-label-small">TOTAL SAVED</div>
        <div class="savings-amount-compact" id="review-total-saved">€0.00</div>
        <div class="savings-discount-small">
          Order Discount: <span id="review-order-discount">0%</span>
        </div>
      </div>

      {%- comment -%} Pair Count {%- endcomment -%}
      <div class="pair-count-compact" id="review-pair-count">0 Pairs</div>
    </div>

    {%- comment -%} Tier Status Banner {%- endcomment -%}
    <div class="pair-modal__tier-progress">
      <div class="tier-status-banner">
        <span class="tier-icon">👑</span>
        <span class="tier-text" id="progress-current-status">Start Building</span>
      </div>
      <div class="tier-benefits-compact" id="progress-next-benefit">
        Select 2 items to unlock BOGO
      </div>
      <button class="compare-tiers-link" id="btn-compare-tiers">
        Compare Tiers →
      </button>
    </div>

    {%- comment -%} Partitioned Pricing Display {%- endcomment -%}
    <div class="partitioned-pricing">
      <div class="pricing-row retail-value">
        <span class="pricing-label">Full Retail Value:</span>
        <span class="pricing-amount" id="retail-value-total">€0.00</span>
      </div>

      <div class="pricing-divider"></div>

      <div class="pricing-row discount">
        <span class="pricing-label">
          <span class="discount-icon">💰</span>
          BOGO Discount:
        </span>
        <span class="pricing-amount savings" id="bogo-discount">-€0.00</span>
      </div>

      <div class="pricing-row discount tier-discount-row" style="display: none;">
        <span class="pricing-label">
          <span class="discount-icon">⭐</span>
          <span id="tier-discount-label">Tier Bonus:</span>
        </span>
        <span class="pricing-amount savings" id="tier-discount">-€0.00</span>
      </div>

      <div class="pricing-row discount shipping-row" style="display: none;">
        <span class="pricing-label">
          <span class="discount-icon">🚚</span>
          FREE Premium Shipping:
        </span>
        <span class="pricing-amount savings">-€4.99</span>
      </div>

      <div class="pricing-row discount cable-row" style="display: none;">
        <span class="pricing-label">
          <span class="discount-icon">🎁</span>
          FREE Titan Smart Cable:
        </span>
        <span class="pricing-amount savings">-€18.95</span>
      </div>

      <div class="pricing-divider final"></div>

      <div class="pricing-row final-total">
        <span class="pricing-label">You Pay:</span>
        <span class="pricing-amount final" id="final-amount">€0.00</span>
      </div>
    </div>

    {%- comment -%} Section Heading {%- endcomment -%}
    <div class="pair-modal__section-heading">
      <h3>BUY 1 GET 1 PAIRS</h3>
    </div>

    {%- comment -%} Pairs Grid {%- endcomment -%}
    <div class="pair-modal__pairs-grid" id="modal-pairs-grid">
      {%- comment -%} Dynamically populated by JavaScript {%- endcomment -%}
    </div>

    {%- comment -%} Footer Actions {%- endcomment -%}
    <div class="pair-modal__footer">
      <button class="pair-modal__btn-secondary" onclick="closePairModal()">
        Continue Shopping
      </button>
      <button class="pair-modal__btn-primary" id="modal-checkout-btn">
        Checkout (<span id="modal-checkout-count">0</span> Pairs) →
      </button>
    </div>

  </div>
</div>
```

### 2.2 Pair Rendering Logic

**File:** `assets/bogo-builder.js` (Lines 1884-2000)

```javascript
function createPairCard(pair, index) {
  const card = document.createElement('div');
  card.className = 'pair-modal__pair-card--compact';
  card.dataset.pairIndex = index;

  const label = document.createElement('div');
  label.className = 'pair-modal__pair-header--compact';
  label.textContent = `Pair ${index + 1}`;
  card.appendChild(label);

  const thumbnails = document.createElement('div');
  thumbnails.className = 'pair-modal__pair-products--sidebyside';

  // Product 1
  const thumb1 = document.createElement('div');
  thumb1.className = 'pair-modal__product--compact';
  if (pair.slot1 && pair.slot1.image) {
    const img1 = document.createElement('img');
    img1.src = pair.slot1.image;
    img1.alt = pair.slot1.title;
    img1.className = 'pair-modal__product-image--compact';
    thumb1.appendChild(img1);

    const title1 = document.createElement('div');
    title1.className = 'pair-modal__product-title--compact';
    title1.textContent = pair.slot1.title;
    thumb1.appendChild(title1);

    const price1 = document.createElement('div');
    price1.className = 'pair-modal__product-price--compact';
    price1.textContent = BOGOCurrency.formatMoney(pair.slot1.price);
    thumb1.appendChild(price1);
  }
  thumbnails.appendChild(thumb1);

  // Equals sign
  const equals = document.createElement('div');
  equals.className = 'pair-modal__equals-sign--compact';
  equals.textContent = '+';
  thumbnails.appendChild(equals);

  // Product 2
  const thumb2 = document.createElement('div');
  thumb2.className = 'pair-modal__product--compact';
  if (pair.slot2 && pair.slot2.image) {
    const img2 = document.createElement('img');
    img2.src = pair.slot2.image;
    img2.alt = pair.slot2.title;
    img2.className = 'pair-modal__product-image--compact';
    thumb2.appendChild(img2);

    const title2 = document.createElement('div');
    title2.className = 'pair-modal__product-title--compact';
    title2.textContent = pair.slot2.title;
    thumb2.appendChild(title2);

    const price2 = document.createElement('div');
    price2.className = 'pair-modal__product-price--compact strikethrough';
    price2.textContent = 'FREE';
    thumb2.appendChild(price2);

    const badge = document.createElement('div');
    badge.className = 'pair-modal__product-badge--compact';
    badge.textContent = '100% OFF';
    thumb2.appendChild(badge);
  }
  thumbnails.appendChild(thumb2);

  card.appendChild(thumbnails);

  // Savings display
  if (pair.slot1 && pair.slot2) {
    const savings = document.createElement('div');
    savings.className = 'pair-modal__pair-savings--compact';
    const cheaperPrice = Math.min(
      parseInt(pair.slot1.price, 10),
      parseInt(pair.slot2.price, 10)
    );
    savings.textContent = `You Save: ${BOGOCurrency.formatMoney(cheaperPrice)}`;
    card.appendChild(savings);
  }

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'pair-modal__pair-delete';
  deleteBtn.textContent = '×';
  deleteBtn.onclick = () => removePair(index);
  card.appendChild(deleteBtn);

  return card;
}
```

---

## 3. REBUY BYPASS MECHANISM

**File:** `assets/bogo-builder.js` (Lines 145-172)

```javascript
// Prevent Rebuy cart drawer from opening during BOGO checkout
console.log('%c🛡️ BOGO direct checkout detected - preventing cart drawer',
  'color: #60c655; font-weight: bold;');

// Method 1: Disable Rebuy cart drawer
try {
  console.log('Disabling Rebuy cart drawer...');
  if (window.Rebuy && window.Rebuy.SmartCart) {
    window.Rebuy.SmartCart.disabled = true;
  }
} catch(e) {
  console.warn('Rebuy not found or already disabled');
}

// Method 2: Prevent any cart drawer opens for next 2 seconds
window.bogoPreventCartOpen = true;
setTimeout(() => {
  window.bogoPreventCartOpen = false;
}, 2000);

// Method 3: Intercept Rebuy events
document.addEventListener('rebuy:cart.open', function(e) {
  if (window.bogoPreventCartOpen) {
    console.log('Prevented Rebuy cart drawer from opening');
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }
}, true);
```

**CSS Override:**
```css
/* Hide Rebuy cart during BOGO builder */
body.bogo-builder-active .rebuy-cart,
body.bogo-builder-active #rebuy-cart {
  display: none !important;
  pointer-events: none !important;
}
```

---

## 4. STATE MANAGEMENT

### 4.1 State Structure

```javascript
window.bogoState = {
  currentPair: {
    slot1: null,  // { id, title, price, image, variantId }
    slot2: null
  },
  pairs: [],  // Array of completed pairs
  tierLevel: 0,  // 0, 1, 2, or 3
  totalSavings: 0  // In cents
};
```

### 4.2 State Update Pattern

```javascript
function addProductToPair(productData) {
  const state = window.bogoState;

  // Add to first empty slot
  if (!state.currentPair.slot1) {
    state.currentPair.slot1 = productData;
  } else if (!state.currentPair.slot2) {
    state.currentPair.slot2 = productData;

    // Pair is complete - move to pairs array
    state.pairs.push({
      slot1: state.currentPair.slot1,
      slot2: state.currentPair.slot2
    });

    // Reset current pair
    state.currentPair = { slot1: null, slot2: null };
  }

  // Update UI
  updateStickyCart();
  updatePairModal();
}
```

---

## 5. CRITICAL INSIGHTS

### What Makes This Implementation Exceptional

1. **Glassmorphic Design**: `backdrop-filter: blur(20px)` with dark gradients creates premium feel
2. **Segmented Progress Bar**: Visual tier progression (1/3, 2/3, 3/3) with stagger animations
3. **Cents-Based Calculations**: All prices stored as integers (11295 = €112.95) for precision
4. **Multi-Currency Support**: `BOGOCurrency.formatMoney()` converts cents to any currency
5. **State Persistence**: Single source of truth (`window.bogoState`) syncs cart + modal
6. **Haptic Feedback**: Progressive intensity (medium → heavy → success) on tier unlocks
7. **Tooltip Breakdown**: Savings itemization (BOGO + Tier + Shipping + Gifts)
8. **Responsive Design**: Mobile-first with separate desktop/mobile incentive messages

### Components That Can Be Reused As-Is

- ✅ Segmented progress bar structure
- ✅ Glassmorphic styling patterns
- ✅ Savings breakdown tooltip
- ✅ Modal overlay and animation system
- ✅ Rebuy bypass mechanism
- ✅ Currency conversion system
- ✅ Haptic feedback pattern

### Components That Need Adaptation

- ❌ **BOGO Pair Logic** → Remove entirely (replace with tier-based cart)
- ❌ **Progress Tracker** → Change from "pairs" to "items" (4/8/12/16)
- ❌ **Savings Calculation** → Remove "cheaper item FREE" logic, use tier multipliers
- ❌ **Modal Product Display** → Change from "pairs" to "individual items" list
- ❌ **State Structure** → Remove `currentPair.slot1/slot2`, use simple items array

### Gotchas & Dependencies

- ⚠️ **Currency System Required**: Must include `BOGOCurrency` object for multi-currency
- ⚠️ **State Must Initialize**: `window.bogoState` must exist before `updateStickyCart()` runs
- ⚠️ **Z-Index Conflicts**: Modal MUST be outside `<section>` tag for proper stacking
- ⚠️ **Cents vs Euros**: All internal calculations use cents, only format to € on display
- ⚠️ **Animation Re-triggering**: Remove class, force reflow with `void element.offsetWidth`, re-add

---

## 6. RECOMMENDED APPROACH

### Option A: Adapt Existing Code ❌
**Pros:**
- Proven, battle-tested implementation
- Animations and styling already perfect

**Cons:**
- BOGO logic deeply intertwined with UI
- State structure incompatible (pairs vs items)
- Would require extensive refactoring (20+ hours)

**Effort:** 20-25 hours

### Option B: Build New Section (Reference Existing) ✅ **RECOMMENDED**
**Pros:**
- Clean architecture from the start
- Tier-based logic simpler than BOGO pairs
- Can cherry-pick best patterns (progress bar, tooltip, glassmorphic CSS)
- No technical debt from BOGO removal

**Cons:**
- Requires writing new code
- Must recreate animations (but with reference)

**Effort:** 8-12 hours

**Recommendation:** **Option B** because:
1. BOGO pair logic is fundamentally different from tier-based cart
2. State management for "items" is simpler than "pairs"
3. Can reuse CSS patterns and animation keyframes without refactoring
4. Cleaner codebase for future maintenance
5. BF25 Hero section already follows this pattern (power slider architecture)

---

## 7. NEXT STEPS

1. ✅ **Extract complete** - Use this document as reference
2. ⏭️ **Map BOGO → Tier mechanics**:
   - Pairs (1-3) → Items (4-16)
   - Slot1 + Slot2 → Individual items array
   - Tier discounts (5%, 10%) → Multipliers (0.91, 0.76, 0.65, 0.57)
3. ⏭️ **Design new state structure**:
   ```javascript
   window.bf25CartState = {
     items: [],  // Array of { id, title, price, qty, image }
     totalItems: 0,
     currentTier: 0,
     totalSavings: 0
   };
   ```
4. ⏭️ **Create build strategy** with Gemini (new chat session)
5. ⏭️ **Execute rebuild** in sequential prompts

---

**END OF EXTRACTION**
