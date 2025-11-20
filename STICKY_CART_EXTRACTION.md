# BOGO Sticky Cart - Complete Implementation Extract
**Date:** 2025-01-13
**Purpose:** UX/CRO Analysis & Redesign

---

## 1. CURRENT HTML STRUCTURE

**FILE:** `sections/bogo-builder-2024.liquid` (Lines 404-479)

```html
<div class="bogo-sticky-cart" style="display: none;">
  <div class="bogo-sticky-cart__inner">

    {%- comment -%} Left: Status Message {%- endcomment -%}
    <div class="bogo-sticky-cart__left">
      <div class="bogo-sticky-cart__title">🎁 BOGO Builder</div>
      <div class="bogo-sticky-cart__status" id="sticky-cart-status">
        Select 2 products to start
      </div>
    </div>

    {%- comment -%} Center: Pair Count + Progress Bar {%- endcomment -%}
    <div class="bogo-sticky-cart__center">
      <div class="bogo-sticky-cart__pairs" id="sticky-cart-pair-count">
        0 Pairs
      </div>

      {%- comment -%} Enhanced Progress Bar (BOGO-PROGRESS-008) {%- endcomment -%}
      <div class="bogo-progress-container">
        <div class="bogo-progress-next-reward" id="progress-next-reward">
          <span class="reward-icon">🎁</span>
          <span class="reward-text">Add 1 pair for 5% OFF + Shipping</span>
        </div>

        <div class="bogo-progress-bar-enhanced">
          <div class="bogo-progress-track">
            <div class="bogo-progress-fill" id="bogo-progress-fill"></div>
          </div>

          <div class="bogo-progress-milestones">
            {%- comment -%} Tier 1 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
            <div class="bogo-milestone" data-tier="1">
              <div class="milestone-marker">
                <span class="milestone-icon">1️⃣</span>
              </div>
              <span class="milestone-label">BOGO<br>50% OFF</span>
            </div>

            {%- comment -%} Tier 2 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
            <div class="bogo-milestone" data-tier="2">
              <div class="milestone-marker">
                <span class="milestone-icon">🚚</span>
              </div>
              <span class="milestone-label">+5% OFF<br>+ SHIP</span>
            </div>

            {%- comment -%} Tier 3 - BOGO-STICKY-CART-MOBILE-016 {%- endcomment -%}
            <div class="bogo-milestone" data-tier="3">
              <div class="milestone-marker">
                <span class="milestone-icon">🎁</span>
              </div>
              <span class="milestone-label">+10% OFF<br>+ CABLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {%- comment -%} Right: Savings & Buttons {%- endcomment -%}
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
```

---

## 2. CURRENT CSS STYLES

**FILE:** `assets/bogo-builder.css` (Lines 120-123, 4600-5197)

```css
/* Global sticky cart constraint */
.bogo-sticky-cart {
  min-height: 100px;
  max-height: 120px;
}

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

/* Sticky Cart Mobile - BOGO-MOBILE-001 */
@media (max-width: 767px) {
  .bogo-sticky-cart__inner {
    padding: 0 var(--space-md); /* 24px sides */
    gap: var(--space-sm); /* 16px between sections */
  }
}

/* Left Section */
.bogo-sticky-cart__left {
  flex-shrink: 0;
}

.bogo-sticky-cart__title {
  font-size: var(--text-lg); /* 20px */
  font-weight: 700;
  color: #60c655;
  margin-bottom: 4px;
}

/* Status Message - Prominent Display (BOGO-STICKY-CART-STATUS-025) */
.bogo-sticky-cart__status {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin: 8px 0;
  transition: color 300ms ease;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.9);
}

.bogo-sticky-cart__status strong {
  font-weight: 800;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__title {
    font-size: var(--text-base); /* 16px */
  }

  .bogo-sticky-cart__status {
    font-size: 11px; /* Mobile: Smaller for space */
    margin: 6px 0;
  }
}

/* Center Section */
.bogo-sticky-cart__center {
  flex: 1;
  text-align: center;
}

.bogo-sticky-cart__pairs {
  font-size: var(--text-lg); /* 20px */
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__pairs {
    font-size: var(--text-xl); /* 25px - readable at glance */
  }
}

/* Right Section */
.bogo-sticky-cart__right {
  display: flex;
  align-items: center;
  gap: var(--space-lg); /* 32px */
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__right {
    gap: var(--space-sm); /* 16px */
  }
}

/* Savings Display */
.bogo-sticky-cart__savings {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: var(--space-xs); /* 8px */
}

.bogo-sticky-cart__savings-label {
  font-size: var(--text-xs); /* 10px */
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bogo-sticky-cart__savings-amount {
  font-size: var(--text-xl); /* 25px */
  font-weight: 900;
  color: #60c655;
  line-height: 1;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__savings-amount {
    font-size: var(--text-2xl); /* 31px - conversion focus */
  }
}

/* Action Buttons */
.bogo-sticky-cart__actions {
  display: flex;
  gap: var(--space-sm); /* 16px */
}

.bogo-sticky-cart__btn {
  height: 44px;
  padding: 0 var(--space-md); /* 24px */
  border-radius: 12px;
  font-size: var(--text-sm); /* 13px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 300ms ease;
  border: 2px solid transparent;
}

@media (max-width: 767px) {
  .bogo-sticky-cart__btn {
    height: var(--touch-min); /* 48px - CRITICAL FIX */
    padding: 0 var(--space-md); /* 24px sides */
    font-size: var(--text-sm); /* 13px - fits in button */
    font-weight: 700;
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

/* ========================================
   ENHANCED PROGRESS BAR (BOGO-PROGRESS-FIX-010)
   Centered, compact, clear layout
   ======================================== */

.bogo-progress-container {
  width: 100%;
  max-width: 280px;
  margin: 12px auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Next Reward Indicator */
.bogo-progress-next-reward {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  margin-bottom: 8px;
  padding: 4px 10px;
  background: rgba(251, 191, 36, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.reward-icon {
  font-size: 12px;
}

.reward-text {
  font-size: 10px;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 0.02em;
}

/* Progress Bar Container */
.bogo-progress-bar-enhanced {
  position: relative;
  width: 100%;
  padding-top: 28px;
  padding-bottom: 20px;
}

/* Progress Track (BOGO-STICKY-CART-STATUS-025) */
.bogo-progress-track {
  position: relative;
  width: 100%;
  height: 10px; /* Increased from 8px for better visibility */
  background: rgba(255, 255, 255, 0.15); /* Darker for better contrast */
  border-radius: 5px;
  overflow: visible; /* Allow glow to show */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Progress Fill - Vibrant Green (BOGO-STICKY-CART-STATUS-025) */
.bogo-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #60c655 0%, #70d665 50%, #60c655 100%);
  border-radius: 5px;
  width: 0%; /* Starts at 0, updated by JS */
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(96, 198, 85, 0.7);
  z-index: 1; /* Above track */
  position: relative;
}

/* Animated stripe effect (BOGO-STICKY-CART-STATUS-025) */
.bogo-progress-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Pulsing glow when animating (BOGO-STICKY-CART-STATUS-025) */
.bogo-progress-fill.animating {
  animation: progressPulse 800ms ease-out;
}

@keyframes progressPulse {
  0% { box-shadow: 0 0 12px rgba(96, 198, 85, 0.7); }
  50% { box-shadow: 0 0 20px rgba(96, 198, 85, 1); }
  100% { box-shadow: 0 0 12px rgba(96, 198, 85, 0.7); }
}

/* Milestones Container - Above Track */
.bogo-progress-milestones {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  padding: 0 2px;
}

.bogo-milestone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}

/* Milestone Marker - Compact Size */
.milestone-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

.milestone-icon {
  font-size: 11px;
  opacity: 0.4;
  transition: opacity 400ms ease;
}

/* Active State - Clear but Not Overwhelming */
.bogo-milestone.active .milestone-marker {
  background: linear-gradient(135deg, #60c655 0%, #50b645 100%);
  border-color: #60c655;
  box-shadow:
    0 0 12px rgba(96, 198, 85, 0.7),
    0 2px 6px rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}

.bogo-milestone.active .milestone-icon {
  opacity: 1;
}

/* Milestone Labels - Below Track (BOGO-STICKY-CART-MOBILE-016) */
.milestone-label {
  position: absolute;
  top: 32px;
  font-size: 8px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  white-space: normal; /* Allow wrapping for line breaks */
  max-width: 60px;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 400ms ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.bogo-milestone.active .milestone-label {
  color: #60c655;
  text-shadow: 0 0 6px rgba(96, 198, 85, 0.6);
  font-weight: 900;
}

/* Unlocked Effect */
.bogo-milestone.unlocked .milestone-marker {
  animation: milestone-unlock 600ms ease-out;
}

@keyframes milestone-unlock {
  0% { transform: scale(1.1); }
  40% { transform: scale(1.3) rotate(8deg); }
  60% { transform: scale(1.25) rotate(-8deg); }
  100% { transform: scale(1.1); }
}

/* Mobile Adjustments (BOGO-STICKY-CART-MOBILE-016) */
@media (max-width: 767px) {
  .bogo-sticky-cart {
    height: 88px; /* Taller for better spacing */
  }

  .bogo-progress-container {
    max-width: 240px;
  }

  .reward-text {
    font-size: 9px;
  }

  .bogo-progress-track {
    height: 8px; /* Mobile: 8px for better touch feedback */
  }

  .milestone-marker {
    width: 18px;
    height: 18px;
  }

  .milestone-icon {
    font-size: 10px;
  }

  .milestone-label {
    font-size: 7px;
    top: 28px;
    max-width: 50px;
    line-height: 1.1;
  }

  /* Increase spacing between milestones */
  .bogo-progress-milestones {
    padding: 0 8px;
    justify-content: space-between;
  }

  /* Larger checkout button text */
  .bogo-sticky-cart__btn {
    height: 48px;
    padding: 0 20px;
    font-size: 14px; /* Increased from 13px */
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  /* Clearer pair count */
  .bogo-sticky-cart__pairs {
    font-size: 22px;
    font-weight: 900;
  }

  /* Savings amount more prominent */
  .bogo-sticky-cart__savings-amount {
    font-size: 24px;
    font-weight: 900;
  }
}

/* Hide reward text on very small screens */
@media (max-width: 480px) {
  .bogo-sticky-cart {
    height: 80px;
  }

  .reward-text {
    display: none;
  }

  .reward-icon {
    font-size: 14px;
  }

  .milestone-label {
    font-size: 6px;
    max-width: 45px;
  }

  /* Hide "next reward" text on very small screens */
  .bogo-progress-next-reward {
    display: none;
  }
}

/* Legacy celebration pulse */
.bogo-sticky-cart.celebration-pulse {
  animation: cartCelebratePulse 1200ms ease-out;
}

@keyframes cartCelebratePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
```

---

## 3. CURRENT JAVASCRIPT LOGIC

**FILE:** `assets/bogo-builder.js` (Lines 923-1171)

```javascript
function updateStickyCart() {
  const state = window.bogoState;
  const stickyCart = document.querySelector('.bogo-sticky-cart');

  if (!stickyCart) return;

  // Count total products added (including incomplete pairs)
  const pairCount = state?.pairs?.length || 0;
  const currentPair = state?.currentPair;

  // BOGO-STICKY-CART-STATUS-025: Check BOTH slots for incomplete products
  const hasIncompleteProduct = (currentPair?.slot1 && !currentPair?.slot2) ||
                                (currentPair?.slot2 && !currentPair?.slot1);

  console.log('Updating sticky cart:', {
    completePairs: pairCount,
    hasIncompleteProduct: hasIncompleteProduct,
    slot1: !!currentPair?.slot1,
    slot2: !!currentPair?.slot2
  });

  // Update pair count display
  const pairCountEl = document.getElementById('sticky-cart-pair-count');
  if (pairCountEl) {
    if (hasIncompleteProduct) {
      // Show "Building Pair 1..." when first product added
      pairCountEl.textContent = `Building Pair ${pairCount + 1}...`;
    } else {
      pairCountEl.textContent = `${pairCount} Pair${pairCount !== 1 ? 's' : ''}`;
    }
  }

  // ========================================
  // PROGRESS BAR UPDATE (BOGO-PROGRESS-BAR-FIX-014)
  // Fixed: Fill per product, not per pair
  // ========================================
  const progressFill = document.getElementById('bogo-progress-fill');
  const milestones = document.querySelectorAll('.bogo-milestone');

  if (progressFill && milestones.length > 0) {
    // Count ALL products across all pairs (BOGO-STICKY-CART-STATUS-025)
    let totalProducts = 0;

    if (state?.pairs && state.pairs.length > 0) {
      state.pairs.forEach(pair => {
        if (pair.slot1?.variantId) totalProducts++;
        if (pair.slot2?.variantId) totalProducts++;
      });
    }

    // BOGO-STICKY-CART-STATUS-025: Include incomplete pair products
    if (state?.currentPair) {
      if (state.currentPair.slot1?.variantId) totalProducts++;
      if (state.currentPair.slot2?.variantId) totalProducts++;
    }

    // Calculate progress: Each product = 16.67% (6 products = 100%)
    let progressPercent = Math.min((totalProducts / 6) * 100, 100);

    // Apply fill width
    progressFill.style.width = progressPercent + '%';

    // Add glow animation when products added
    if (totalProducts > 0) {
      progressFill.classList.add('animating');
      setTimeout(() => progressFill.classList.remove('animating'), 600);
    }

    // Update milestones based on COMPLETE PAIRS
    const completePairs = state?.pairs?.length || 0;

    milestones.forEach((milestone, index) => {
      const tierNumber = index + 1;

      if (completePairs >= tierNumber) {
        if (!milestone.classList.contains('active')) {
          milestone.classList.add('active');
          milestone.classList.add('unlocked');
          setTimeout(() => milestone.classList.remove('unlocked'), 600);
        }
      } else {
        milestone.classList.remove('active');
      }
    });

    console.log('Progress bar:', {
      products: totalProducts,
      pairs: completePairs,
      fillPercent: progressPercent.toFixed(1) + '%'
    });
  }

  // ========================================
  // UPDATE NEXT REWARD TEXT (BOGO-PROGRESS-FIX-010)
  // ========================================
  const nextRewardEl = document.getElementById('progress-next-reward');

  if (nextRewardEl) {
    const completePairs = state?.pairs ? state.pairs.length : 0;

    if (hasIncompleteProduct || completePairs === 0) {
      nextRewardEl.innerHTML = '<span class="reward-icon">🎁</span><span class="reward-text">Build your first BOGO pair!</span>';
      nextRewardEl.style.display = 'flex';
    } else if (completePairs === 1) {
      nextRewardEl.innerHTML = '<span class="reward-icon">🚚</span><span class="reward-text">Add 1 pair: 5% OFF + FREE Shipping (€4.99)</span>';
      nextRewardEl.style.display = 'flex';
    } else if (completePairs === 2) {
      nextRewardEl.innerHTML = '<span class="reward-icon">🎁</span><span class="reward-text">Add 1 pair: 10% OFF + FREE Cable (€18.95)</span>';
      nextRewardEl.style.display = 'flex';
    } else {
      nextRewardEl.style.display = 'none';
    }
  }

  // ========================================
  // STICKY CART STATUS MESSAGES (BOGO-STICKY-CART-STATUS-025)
  // Dynamic messaging based on complete pairs + incomplete products
  // ========================================
  const statusEl = document.getElementById('sticky-cart-status');
  if (statusEl) {
    const nextPairNumber = pairCount + 1;

    if (hasIncompleteProduct) {
      // Incomplete pair - urgent call to action
      statusEl.innerHTML = `🔥 Complete pair ${nextPairNumber}: <strong>Select 1 more product!</strong>`;
      statusEl.style.color = '#fbbf24';
    } else if (pairCount === 0) {
      // No pairs built yet
      statusEl.innerHTML = '🎁 <strong>Build your first BOGO pair!</strong> Select 2 products';
      statusEl.style.color = 'rgba(255, 255, 255, 0.9)';
    } else if (pairCount === 1) {
      // Tier 1 achieved - upsell to Tier 2
      statusEl.innerHTML = '💚 <strong>Add 1 more pair</strong> for 5% OFF + Free Shipping!';
      statusEl.style.color = '#60c655';
    } else if (pairCount === 2) {
      // Tier 2 achieved - upsell to Tier 3
      statusEl.innerHTML = '🎁 <strong>Add 1 more pair</strong> for 10% OFF + FREE Cable (€18.95)!';
      statusEl.style.color = '#f39c12';
    } else if (pairCount >= 3 && pairCount < 10) {
      // Tier 3 achieved - encouragement
      statusEl.innerHTML = `🏆 <strong>${pairCount} pairs built!</strong> Amazing savings unlocked 🎉`;
      statusEl.style.color = '#60c655';
    } else {
      // 10+ pairs - celebration
      statusEl.innerHTML = `🔥 <strong>${pairCount} pairs!</strong> You're a BOGO champion! 👑`;
      statusEl.style.color = '#60c655';
    }

    console.log('Status updated:', {
      completePairs: pairCount,
      hasIncompleteProduct,
      message: statusEl.textContent
    });
  }

  // ========================================
  // CALCULATE TOTAL SAVINGS (BOGO-SAVINGS-003)
  // Includes: BOGO + Tier Discounts + Shipping + Bonus
  // ========================================
  const savingsEl = document.getElementById('sticky-cart-savings');
  if (savingsEl && state?.pairs) {
    let totalSavings = 0;
    let orderSubtotal = 0;

    if (state.pairs.length > 0) {
      // Step 1: Calculate BOGO savings and order subtotal
      state.pairs.forEach(pair => {
        const price1 = parseFloat(pair.slot1?.price?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);
        const price2 = parseFloat(pair.slot2?.price?.replace(/[^0-9.,]/g, '').replace(',', '.') || 0);

        // Add both items to subtotal
        orderSubtotal += price1 + price2;

        // BOGO savings: 50% off cheaper item
        const lowerPrice = Math.min(price1, price2);
        totalSavings += lowerPrice * 0.5;
      });

      // Step 2: Add tier discount savings
      if (pairCount >= 3) {
        // Tier 3: 10% off total order
        totalSavings += orderSubtotal * 0.10;
      } else if (pairCount >= 2) {
        // Tier 2: 5% off total order
        totalSavings += orderSubtotal * 0.05;
      }

      // Step 3: Add premium shipping value (2+ pairs)
      if (pairCount >= 2) {
        totalSavings += 4.99; // Premium shipping value
      }

      // Step 4: Add bonus cable value (3+ pairs)
      if (pairCount >= 3) {
        totalSavings += 18.95; // Titan Smart Cable value
      }
    }

    savingsEl.textContent = `€${totalSavings.toFixed(2)}`;
  }

  // Show/hide buttons
  const reviewBtn = document.getElementById('sticky-cart-review');
  const checkoutBtn = document.getElementById('sticky-cart-checkout');

  // ========================================
  // KEY FIX: Show cart if ANY products exist
  // ========================================
  const hasAnyProducts = pairCount > 0 || hasIncompleteProduct;

  if (hasAnyProducts) {
    // Show cart
    stickyCart.style.display = 'block';

    // Only show buttons if at least one complete pair exists
    if (reviewBtn) {
      reviewBtn.style.display = pairCount > 0 ? 'block' : 'none';
    }
    if (checkoutBtn) {
      checkoutBtn.style.display = pairCount > 0 ? 'block' : 'none';
    }

    // Add checkout click handler
    if (checkoutBtn && pairCount > 0) {
      checkoutBtn.onclick = function() {
        console.log('Checkout clicked with pairs:', state.pairs);
        proceedToCheckout();
      };
    }

    // Add review click handler
    if (reviewBtn && pairCount > 0) {
      reviewBtn.onclick = function() {
        openPairModal();
      };
    }
  } else {
    // Hide cart if no products at all
    stickyCart.style.display = 'none';
  }

  console.log('Sticky cart visibility:', hasAnyProducts ? 'visible' : 'hidden');
  console.log('Sticky cart updated successfully');

  // ========================================
  // SAVE STATE TO LOCALSTORAGE (BOGO-PERSIST-006)
  // ========================================
  saveBOGOState();
}
```

---

## 4. CURRENT ISSUES DOCUMENTED

### **Critical Issues:**

1. **❌ Savings Calculation Inaccurate**
   - **Problem:** Only shows €4.99 (shipping value) instead of actual product discounts
   - **Location:** Lines 1082-1122 in `updateStickyCart()`
   - **Impact:** Users don't see real savings, reduces conversion motivation

2. **❌ Redundant Status Messages**
   - **Problem:** "Add 1 more pair" message appears in BOTH:
     - Left section (`.bogo-sticky-cart__status`)
     - Center section (`.bogo-progress-next-reward`)
   - **Location:** Lines 1041-1076 and 1018-1035
   - **Impact:** Visual clutter, wasted space

3. **❌ Progress Bar Doesn't Fill Incrementally**
   - **Problem:** Progress calculation is `(totalProducts / 6) * 100`
   - **Expected:** Should fill to milestone markers (33%, 66%, 100%)
   - **Location:** Line 980
   - **Impact:** Progress bar overshoots milestones, confusing UX

4. **❌ Mobile Layout Breakdown**
   - **Problem:** At 0 pairs on mobile, text becomes unreadable (6-7px font)
   - **Locations:**
     - `.milestone-label` → 6px on <480px screens
     - `.bogo-sticky-cart__status` → 11px on mobile
   - **Impact:** Illegible text, poor mobile UX

5. **❌ Tablet Responsive Issues**
   - **Problem:** Text overlaps, cart gets pushed out of viewport
   - **Breakpoint:** 768-1024px (no specific handling)
   - **Impact:** Broken layout on iPads and tablets

### **Secondary Issues:**

6. **🔸 "BOGO Builder" Label Wastes Space**
   - Takes up valuable left section real estate
   - Unnecessary branding in cart

7. **🔸 "2 Pairs" Positioning**
   - Awkwardly placed above progress bar
   - Should be integrated into layout better

8. **🔸 Emoji Color Mismatch**
   - Uses blue emoji (🎁) that doesn't match green brand (#60c655)
   - Inconsistent with theme

9. **🔸 Checkout Button Text Too Small**
   - 13px on desktop, 14px on mobile
   - Should be more prominent for conversion

10. **🔸 Milestone Numbers Don't Update**
    - Progress bar fills but milestone markers stay static
    - Should animate or indicate progress

---

## 5. SCREEN SIZE ANALYSIS

### **Desktop (1920px+):**
- ✅ Height: 120px (adequate)
- ⚠️ Redundancies: Both status messages visible
- ⚠️ Wasted space: "BOGO Builder" label
- ⚠️ Savings: Inaccurate calculation

### **Laptop (1280-1920px):**
- ✅ Layout holds
- ⚠️ Same redundancy issues as desktop

### **Tablet (768-1024px):**
- ❌ Text overlaps in center section
- ❌ Progress bar labels collide
- ❌ Right section buttons get squished
- ❌ No specific breakpoint handling

### **Mobile (375-768px):**
- ❌ Height: 80px → too cramped
- ❌ Left section hidden on <480px
- ❌ Progress text hidden
- ❌ Milestone labels: 7px (barely readable)
- ❌ Status message: 11px (hard to read)

### **Mobile 0 Pairs State:**
- ❌ **CRITICAL:** Text becomes 6-7px
- ❌ Completely illegible
- ❌ Poor first impression for new users

---

## 6. TECHNICAL CONTEXT

### **CSS Variables Used:**
```css
--text-xs: 0.64rem;    /* 10px */
--text-sm: 0.8rem;     /* 13px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.25rem;    /* 20px */
--text-xl: 1.5rem;     /* 24px */
--text-2xl: 1.875rem;  /* 30px */
--space-xs: 0.5rem;    /* 8px */
--space-sm: 1rem;      /* 16px */
--space-md: 1.5rem;    /* 24px */
--space-lg: 2rem;      /* 32px */
--touch-min: 48px;     /* iOS touch target minimum */
```

### **Key State Variables:**
```javascript
window.bogoState = {
  pairs: [],           // Complete pairs array
  currentPair: {       // Incomplete pair being built
    slot1: null,
    slot2: null
  }
}
```

### **Progress Calculation Logic:**
- **Current:** `(totalProducts / 6) * 100`
- **Issue:** Fills past milestones (which are at 33%, 66%, 100%)
- **Milestone Activation:** Based on complete pairs, not products

---

## 7. REDESIGN RECOMMENDATIONS

### **High Priority:**

1. **Simplify Layout**
   - Remove "BOGO Builder" label
   - Consolidate status + reward messages into ONE location
   - Use vertical stacking on mobile (<768px)

2. **Fix Savings Calculation**
   - Include BOGO 50% discount per pair
   - Add tier discount percentages (5%, 10%)
   - Show real product savings, not just shipping

3. **Fix Progress Bar**
   - Align fill to milestone positions (33%, 66%, 100%)
   - OR: Switch to discrete step indicator (1→2→3)
   - Update milestone numbers dynamically

4. **Responsive Overhaul**
   - Add tablet breakpoint (768-1024px)
   - Increase mobile font sizes (minimum 12px)
   - Stack layout vertically on mobile
   - Expand mobile height to 100px

5. **Button Prominence**
   - Increase Checkout button size (min 16px text)
   - Make it more visually prominent (larger, brighter)

### **Nice to Have:**

6. Replace blue emojis with green alternatives or icons
7. Animate milestone unlocks more clearly
8. Add haptic feedback on mobile tier unlocks
9. Show product thumbnails in cart (currently only in review modal)

---

## 8. FILES TO MODIFY

1. **`sections/bogo-builder-2024.liquid`** (Lines 404-479)
   - Simplify HTML structure
   - Remove redundant status message
   - Consolidate messaging

2. **`assets/bogo-builder.css`** (Lines 4600-5197)
   - Add tablet breakpoint
   - Increase mobile font sizes
   - Simplify layout for <768px

3. **`assets/bogo-builder.js`** (Lines 923-1171)
   - Fix savings calculation logic
   - Fix progress bar percentage alignment
   - Consolidate status message generation

---

## END OF EXTRACTION

**Next Steps:**
- Share with UX/CRO team for analysis
- Prototype redesign mockups
- Implement fixes in order of priority
- A/B test changes before full rollout
