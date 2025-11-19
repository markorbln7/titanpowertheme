# BOGO BUILDER - PERFORMANCE AUDIT CODE EXTRACTION
**Date:** 2024-11-15
**Branch:** bf-2025 (LIVE PRODUCTION)
**Purpose:** Performance & Speed Optimization Analysis

---

## FILE 1: JAVASCRIPT PERFORMANCE-CRITICAL CODE
**Source:** assets/bogo-builder.js

### Heavy Animation Functions

### Celebration Functions
function celebratePairCompletion(element1, element2, pairNumber) {
  console.log('⚡ Starting electric celebration');

  // Electric pulse on both products
  [element1, element2].forEach(function(element, index) {
    if (!element) return;

    // Add electric pulse animation
    element.style.animation = 'electricPulse 800ms ease-in-out';

    // Remove animation after completion
    setTimeout(function() {
      element.style.animation = '';
    }, 800);
  });

  // Lightning bolt effect on sticky cart
  const stickyCart = document.getElementById('bogo-sticky-cart');
  if (stickyCart) {
    stickyCart.classList.add('celebrating');

    setTimeout(function() {
      stickyCart.classList.remove('celebrating');
    }, 1200);
  }

  // Trigger haptic feedback if available (mobile)
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
}

### Tier Celebrations

### Electric Effects

### updateStickyCart Function
function updateStickyCart() {
  const state = window.bogoState;
  const stickyCartV2 = document.getElementById('bogo-sticky-cart-v2');

  // Force hide old cart
  const oldStickyCart = document.querySelector('.bogo-sticky-cart');
  if (oldStickyCart) oldStickyCart.style.display = 'none';

  if (!stickyCartV2 || !state) return;

  console.log('=== STICKY CART V2 UPDATE START ===');

  // --- TRACK PREVIOUS STATE FOR ANIMATIONS ---
  if (!window.bogoCartPrevState) {
    window.bogoCartPrevState = { pairCount: 0, currentTier: 0, totalSavings: 0 };
  }
  const prevState = window.bogoCartPrevState;

  // --- DATA COLLECTION ---
  const pairCount = state.pairs?.length || 0;
  const currentPair = state.currentPair;

  // Check for incomplete pair (exactly one slot filled using XOR)
  const hasIncompleteProduct = !!(currentPair?.slot1) !== !!(currentPair?.slot2);

  // Determine current tier
  let currentTier = 0;
  if (pairCount >= 3) currentTier = 3;
  else if (pairCount >= 2) currentTier = 2;
  else if (pairCount >= 1) currentTier = 1;

  console.log('Cart State:', {
    completePairs: pairCount,
    hasIncomplete: hasIncompleteProduct,
    currentTier: currentTier,
    slot1: !!currentPair?.slot1,
    slot2: !!currentPair?.slot2
  });

  // --- 1. ACCURATE SAVINGS CALCULATION (BOGO-CALCULATION-FIX-033) ---
  let totalSavingsCents = 0;
  let totalRetailCents = 0;
  let bogoSavingsCents = 0;
  let tierDiscountCents = 0;

  if (pairCount > 0 && state.pairs && state.pairs.length > 0) {
    // 1.1 Calculate BOGO Savings (100% off cheaper item = FREE)
    state.pairs.forEach(pair => {
      // CRITICAL: Use fallbacks for both old and new data
      const item1 = pair.slot1 || pair.product1;
      const item2 = pair.slot2 || pair.product2;

      // Prices are stored as integer cents (11295 = €112.95)
      const price1 = parseInt(item1?.price || 0, 10);
      const price2 = parseInt(item2?.price || 0, 10);

      console.log('Pair calculation:', {
        item1: item1?.title,
        item2: item2?.title,
        price1Cents: price1,
        price2Cents: price2,
        price1Euro: (price1 / 100).toFixed(2),
        price2Euro: (price2 / 100).toFixed(2)
      });

      totalRetailCents += price1 + price2;

      // BOGO FREE: 100% off cheaper item (not 50%!)
      const cheaperPrice = Math.min(price1, price2);
      if (cheaperPrice > 0) {
        bogoSavingsCents += cheaperPrice;
        console.log('BOGO savings for this pair:', (cheaperPrice / 100).toFixed(2));
      }
    });

    console.log('Total BOGO Savings (cents):', bogoSavingsCents);
    console.log('Total BOGO Savings (€):', (bogoSavingsCents / 100).toFixed(2));

    totalSavingsCents += bogoSavingsCents;

    // 1.2 Tier Discounts (on subtotal after BOGO)
    const discountedSubtotalCents = totalRetailCents - bogoSavingsCents;

    if (currentTier === 3) {
      tierDiscountCents = Math.round(discountedSubtotalCents * 0.10);
      totalSavingsCents += tierDiscountCents;
      console.log('Tier 3 Discount (10%):', (tierDiscountCents / 100).toFixed(2));
    } else if (currentTier === 2) {
      tierDiscountCents = Math.round(discountedSubtotalCents * 0.05);
      totalSavingsCents += tierDiscountCents;
      console.log('Tier 2 Discount (5%):', (tierDiscountCents / 100).toFixed(2));
    }

    // 1.3 Value Adds (in cents)
    const SHIPPING_VALUE_CENTS = 499;  // €4.99
    const CABLE_VALUE_CENTS = 1895;     // €18.95

    if (currentTier >= 2) {
      totalSavingsCents += SHIPPING_VALUE_CENTS;
      console.log('Added Shipping: €4.99');
    }
    if (currentTier >= 3) {
      totalSavingsCents += CABLE_VALUE_CENTS;
      console.log('Added Cable: €18.95');
    }
  }

  console.log('===== SAVINGS BREAKDOWN =====');
  console.log('BOGO Savings (€):', (bogoSavingsCents / 100).toFixed(2));
  console.log('Tier Discount (€):', (tierDiscountCents / 100).toFixed(2));
  console.log('TOTAL SAVINGS (€):', (totalSavingsCents / 100).toFixed(2));
  console.log('============================');

  // Update Savings Display (convert cents to current currency)
  const savingsEl = document.getElementById('v2-total-savings');
  if (savingsEl) {
    const formattedSavings = BOGOCurrency.formatMoney(totalSavingsCents);
    savingsEl.textContent = formattedSavings;
  }

  // --- 2. UPDATE STATUS & MESSAGING ---
  const pairCountEl = document.getElementById('v2-pair-count');
  const incentiveMsgEl = document.getElementById('v2-incentive-message'); // Desktop version
  const incentiveMsgElMobile = document.getElementById('v2-incentive-message-mobile'); // Mobile version
  const primaryBtn = document.getElementById('v2-btn-primary');
  const reviewBtn = document.getElementById('v2-btn-review');
  
  // ✅ Helper function to update both desktop AND mobile incentive messages
  const updateIncentiveMessage = (htmlContent) => {
    if (incentiveMsgEl) incentiveMsgEl.innerHTML = htmlContent;
    if (incentiveMsgElMobile) incentiveMsgElMobile.innerHTML = htmlContent;
  };

  // ✅ BOGO-V2-POLISH: Animate pair count changes
  if (pairCountEl && pairCount !== prevState.pairCount && pairCount > 0) {
    pairCountEl.style.animation = 'none';
    setTimeout(() => {
      pairCountEl.style.animation = 'savingsPopIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 10);
  }

  // Define button actions
  const scrollToProducts = () => {
    // Close modal if open
    const modal = document.getElementById('pair-management-modal');
    if (modal && modal.classList.contains('active')) {
      if (typeof closePairModal === 'function') closePairModal();
    }
    // Scroll to products
    const productGrid = document.querySelector('.section-collections-with-nav__wrapper');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const checkoutAction = () => {
    if (typeof proceedToCheckout === 'function') {
      console.log('Proceeding to checkout with pairs:', state.pairs);
      proceedToCheckout();
    }
  };

  const reviewAction = () => {
    if (typeof openPairModal === 'function') {
      openPairModal();
    }
  };

  // Update UI based on cart state
  if (hasIncompleteProduct) {
    // STATE: Incomplete Pair
    const nextPairNum = pairCount + 1;
    pairCountEl.textContent = `Building Pair ${nextPairNum}...`;
    updateIncentiveMessage('🔥 <strong>Select 1 more item</strong> to complete your pair!');
    primaryBtn.textContent = 'Continue Shopping';
    primaryBtn.onclick = scrollToProducts;
    reviewBtn.style.display = pairCount > 0 ? 'block' : 'none';
    reviewBtn.onclick = reviewAction;

  } else if (pairCount === 0) {
    // STATE: Empty Cart
    pairCountEl.textContent = 'Start Building';
    updateIncentiveMessage('Select 2 items to activate <strong>Buy 1 Get 1 FREE!</strong>');
    primaryBtn.textContent = 'Start Building';
    primaryBtn.onclick = scrollToProducts;
    reviewBtn.style.display = 'none';

  } else {
    // STATE: Complete Pairs Exist
    pairCountEl.textContent = `${pairCount} Pair${pairCount !== 1 ? 's' : ''}`;
    primaryBtn.textContent = 'Checkout →';
    primaryBtn.onclick = checkoutAction;
    reviewBtn.style.display = 'block';
    reviewBtn.onclick = reviewAction;

    // ✅ BOGO-V2-FIXES: Update Incentive Message Based on Tier (supports 4+ pairs)
    if (currentTier === 1) {
      updateIncentiveMessage('🚚 <strong>Add 1 pair</strong> for +5% OFF & FREE Premium Shipping!');
    } else if (currentTier === 2) {
      updateIncentiveMessage(`🎁 <strong>Add 1 pair</strong> for +10% OFF & FREE Titan Cable (${BOGOCurrency.convert(1895)})!`);
    } else if (currentTier >= 3) {
      // Change messaging for 3+ pairs
      if (pairCount === 3) {
        updateIncentiveMessage('👑 <strong>Max Tier Unlocked!</strong> Keep adding pairs for more savings!');
      } else {
        updateIncentiveMessage(`👑 <strong>${pairCount} Pairs Built!</strong> Amazing value unlocked! 🎉`);
      }
    }
  }

  // ✅ BOGO-V2-ADVANCED: Update ARIA labels for accessibility
  if (primaryBtn) {
    primaryBtn.setAttribute('aria-label',
      pairCount === 0 ? 'Start building your BOGO bundle' :
      hasIncompleteProduct ? 'Continue shopping to complete pair' :
      'Proceed to checkout with ' + pairCount + ' pair' + (pairCount !== 1 ? 's' : '')
    );
  }

  if (reviewBtn && reviewBtn.style.display === 'block') {
    reviewBtn.setAttribute('aria-label', 'Review your ' + pairCount + ' BOGO pair' + (pairCount !== 1 ? 's' : ''));
  }

  // Update savings ARIA live region
  if (savingsEl) {
    savingsEl.setAttribute('aria-live', 'polite');
    savingsEl.setAttribute('aria-atomic', 'true');
  }

  console.log('UI Updated:', {
    pairCount: pairCountEl.textContent,
    primaryBtn: primaryBtn.textContent
  });

  // --- 3. UPDATE SEGMENTED PROGRESS BAR ---
  const segments = document.querySelectorAll('.bogo-sticky-cart-v2 .progress-segment');

  segments.forEach((segment, index) => {
    const tier = index + 1;

    if (pairCount >= tier) {
      if (!segment.classList.contains('active')) {
        // Sequential activation with delay for visual effect
        setTimeout(() => {
          segment.classList.add('active');
          console.log(`Segment ${tier} activated`);
        }, index * 150);
      }
    } else {
      segment.classList.remove('active');
    }
  });

  // ✅ BOGO-V2-POLISH: Add .has-pairs class for enhanced glow
  if (pairCount > 0) {
    stickyCartV2.classList.add('has-pairs');
  } else {
    stickyCartV2.classList.remove('has-pairs');
  }

  // ✅ BOGO-V2-ADVANCED: Pulse cart + haptics + confetti on tier unlock
  if (currentTier > prevState.currentTier && currentTier > 0) {
    // ⚠️ FIX (SH-STICKY-CART-ANIMATION-FIX-001): Removed cartSlideUp animation
    // It conflicts with celebration-pulse animation applied in tier celebration modal (line 5920)
    // The celebration-pulse (1200ms) provides better visual feedback than cartSlideUp (500ms)
    // Visual pulse animation - DISABLED to prevent animation conflict
    // stickyCartV2.style.animation = 'none';
    // setTimeout(() => {
    //   stickyCartV2.style.animation = 'cartSlideUp 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
    // }, 10);

    // Haptic feedback on mobile
    if (currentTier === 1) {
      triggerHapticFeedback('medium');
    } else if (currentTier === 2) {
      triggerHapticFeedback('heavy');
    } else if (currentTier === 3) {
      triggerHapticFeedback('success');
      // Confetti celebration for tier 3!
      setTimeout(() => triggerStickyCartConfetti(), 300);
    }

    console.log(`🎉 Tier ${currentTier} unlocked! Haptic: ${currentTier === 3 ? 'success' : currentTier === 2 ? 'heavy' : 'medium'}`);
  }

  // --- 4. VISIBILITY CONTROL ---
  // Show V2 cart whenever there are products OR we want to incentivize
  const shouldShow = pairCount > 0 || hasIncompleteProduct || true; // Always show for incentive
  stickyCartV2.style.display = shouldShow ? 'block' : 'none';

  // ✅ DIAGNOSTIC: Auto-run debug on every update
  console.log('=== CALLING DEBUG ===');
  debugBOGOState();

  // --- UPDATE TOOLTIP BREAKDOWN ---
  const tooltipBogo = document.getElementById('tooltip-bogo');
  const tooltipTier = document.getElementById('tooltip-tier');
  const tooltipTierItem = document.getElementById('tooltip-tier-item');
  const tooltipTierLabel = document.getElementById('tooltip-tier-label');
  const tooltipShippingItem = document.getElementById('tooltip-shipping-item');
  const tooltipCableItem = document.getElementById('tooltip-cable-item');
  const tooltipTotal = document.getElementById('tooltip-total');

  if (tooltipBogo && tooltipTotal) {
    const formatMoney = (cents) => BOGOCurrency.formatMoney(cents);

    // Calculate component savings
    let bogoOnlyCents = 0;
    if (pairCount > 0) {
      state.pairs.forEach(pair => {
        const item1 = pair.slot1 || pair.product1;
        const item2 = pair.slot2 || pair.product2;
        const price1 = parseInt(item1?.price || 0, 10);
        const price2 = parseInt(item2?.price || 0, 10);
        bogoOnlyCents += Math.min(price1, price2);
      });
    }

    const retailCents = state.pairs.reduce((sum, pair) => {
      const item1 = pair.slot1 || pair.product1;
      const item2 = pair.slot2 || pair.product2;
      return sum + parseInt(item1?.price || 0, 10) + parseInt(item2?.price || 0, 10);
    }, 0);

    const subtotalAfterBogo = retailCents - bogoOnlyCents;
    let tierDiscountCents = 0;
    if (currentTier === 3) tierDiscountCents = Math.round(subtotalAfterBogo * 0.10);
    else if (currentTier === 2) tierDiscountCents = Math.round(subtotalAfterBogo * 0.05);

    // Update tooltip
    tooltipBogo.textContent = formatMoney(bogoOnlyCents);

    if (currentTier >= 2) {
      tooltipTierItem.style.display = 'block';
      tooltipTier.textContent = formatMoney(tierDiscountCents);
      tooltipTierLabel.textContent = currentTier === 3 ? 'Tier 3 Bonus (10%):' : 'Tier 2 Bonus (5%):';
    } else {
      tooltipTierItem.style.display = 'none';
    }

    if (tooltipShippingItem) tooltipShippingItem.style.display = currentTier >= 2 ? 'block' : 'none';
    if (tooltipCableItem) tooltipCableItem.style.display = currentTier >= 3 ? 'block' : 'none';

    tooltipTotal.textContent = formatMoney(totalSavingsCents);

    console.log('✅ Tooltip updated:', formatMoney(totalSavingsCents));
  }

  console.log('=== STICKY CART V2 UPDATE COMPLETE ===\n');

  // --- 5. UPDATE PREVIOUS STATE ---
  window.bogoCartPrevState = {
    pairCount: pairCount,
    currentTier: currentTier,
    totalSavings: totalSavingsCents
  };

  // --- 6. SAVE STATE TO LOCALSTORAGE ---
  if (typeof saveBOGOState === 'function') {
    saveBOGOState();
  }
}

### populateProductRatings Function
function populateProductRatings() {
  const ratingDisplays = document.querySelectorAll('.product-rating-display');

  console.log(`⭐ Populating ratings for ${ratingDisplays.length} products`);

  ratingDisplays.forEach(display => {
    const productId = display.dataset.productId;

    if (!productId) {
      console.warn('⚠️ Rating display missing product ID');
      return;
    }

    // Get product data directly from PRODUCT_REVIEWS object
    const productData = PRODUCT_REVIEWS[productId];

    if (!productData || !productData.reviews || productData.reviews.length === 0) {
      // No reviews - hide the rating display
      display.classList.add('no-reviews');
      console.log(`📝 No reviews for product ${productId}`);
      return;
    }

    const avgRating = productData.avgRating || 0;
    const totalReviews = productData.totalReviews || 0;

    // Update star fill percentage
    const starsFilled = display.querySelector('.stars-filled');
    if (starsFilled) {
      const percentage = (avgRating / 5) * 100;
      starsFilled.style.width = `${percentage}%`;
    }

    // Update review count text
    const ratingCount = display.querySelector('.rating-count');
    if (ratingCount) {
      // Desktop: Show full text
      let countText = `${totalReviews.toLocaleString()} review${totalReviews !== 1 ? 's' : ''}`;

      // Mobile: Shorter format
      if (window.innerWidth <= 768) {
        countText = `(${totalReviews.toLocaleString()})`;
      }

      ratingCount.textContent = countText;
    }

    // Add aria-label for accessibility
    display.setAttribute('aria-label', `Rated ${avgRating} out of 5 stars, ${totalReviews} reviews. Click to view all reviews.`);

    // Remove loading state
    display.removeAttribute('data-loading');

    console.log(`✅ Rating populated for product ${productId}: ${avgRating}⭐ (${totalReviews} reviews)`);
  });

  console.log('✅ All product ratings populated');
}

### Event Listener Setup
27:    document.addEventListener('DOMContentLoaded', clearCart);
167:    document.addEventListener('rebuy:cart.open', function(e) {
384:  window.addEventListener('resize', debouncedResizeCanvas);
485:  filterSelect.addEventListener('change', function(e) {
643:    select.addEventListener('change', function() {
665:    newAddBtn.addEventListener('click', function(e) {
678:    newCloseBtn.addEventListener('click', function(e) {
1119:  infoBtn.addEventListener('click', (e) => {
1134:  document.addEventListener('click', (e) => {
1144:    infoBtn.addEventListener('mouseenter', () => {
1152:      valueWrapper.addEventListener('mouseleave', () => {
1361:    segment.addEventListener('touchstart', () => {
1836:document.addEventListener('DOMContentLoaded', () => {
1955:  document.addEventListener('keydown', handleModalEscape);
2376:  compareBtn.addEventListener('click', function(e) {
2821:      variantCloseBtn.addEventListener('click', function(e) {
2829:      addBtn.addEventListener('click', function(e) {
2922:document.addEventListener('DOMContentLoaded', function() {
2942:    tierCardsContainer.addEventListener('scroll', function() {
2958:      dot.addEventListener('click', function() {
5663:document.addEventListener('keydown', function(e) {
5815:    btn.addEventListener('click', () => {
5826:  if (closeBtn) closeBtn.addEventListener('click', closeModal);
5827:  if (overlay) overlay.addEventListener('click', closeModal);
5830:    startBtn.addEventListener('click', () => {
5938:    this.overlay.addEventListener('click', overlayClickHandler);
5947:    document.addEventListener('keydown', escapeHandler);
6267:    closeBtn.addEventListener('click', (e) => {
6272:    element.addEventListener('click', () => {
6375:document.addEventListener('DOMContentLoaded', function() {
6540:    window.addEventListener('scroll', () => {
6576:document.addEventListener('DOMContentLoaded', function() {
6689:document.addEventListener('DOMContentLoaded', function() {
6700:window.addEventListener('resize', function() {
6709:document.addEventListener('keydown', function(event) {
7045:    document.addEventListener(eventName, (e) => {
7341:window.addEventListener('popstate', async function(event) {
7717:    document.addEventListener('DOMContentLoaded', moveStickyCartToBody);
7962:  window.addEventListener('scroll', checkScroll);
8045:document.addEventListener('DOMContentLoaded', () => {
8103:document.addEventListener('DOMContentLoaded', () => {
8105:  document.addEventListener('currency:changed', () => {
8116:window.addEventListener('resize', () => {

### State Persistence Functions
function saveBOGOState() {
  try {
    const stateToSave = {
      pairs: window.bogoState.pairs || [],
      currentPair: window.bogoState.currentPair || {},
      activePairNumber: window.bogoState.activePairNumber || 1,  // ✅ FIX: Save pair number (BOGO-SURGICAL-FIX-COMBINED-001)
      timestamp: Date.now()
    };
    localStorage.setItem(BOGO_STORAGE_KEY, JSON.stringify(stateToSave));
    console.log('💾 BOGO state saved to localStorage');
  } catch (error) {
    console.warn('Failed to save BOGO state:', error);
  }
}
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

    // CRITICAL: Apply migration to convert old data (BOGO-CALCULATION-FIX-033)
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

### Initialization (IIFE)
(function initBOGOState() {
  // ✅ ALWAYS START FRESH: Clear any saved state on page load
  // User requirement: Don't persist state across navigation - fresh start every time
  // This prevents UI sync bugs from incomplete pairs being restored
  console.log('🔄 Clearing any saved BOGO state - fresh start on page load');

  // Clear localStorage immediately
  if (typeof clearBOGOState === 'function') {
    clearBOGOState();
  } else {
    // Fallback if function doesn't exist
    localStorage.removeItem('titan-bogo-state');
  }

  // Always initialize fresh state (skip restoration logic)
  window.bogoState = {
    pairs: [],
    currentPair: {
      slot1: null,
      slot2: null
    },
    activePairNumber: 1
  };

  console.log('✅ BOGO state initialized (fresh - persistence disabled)');
  console.log('📝 Note: State will NOT persist across page navigations');

  // No validation needed - state is always fresh
})();

---

## FILE 2: CSS PERFORMANCE-CRITICAL CODE
**Source:** assets/bogo-builder.css

### GPU-Accelerated Animations
  @keyframes floatParticles {
    0%, 100% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
  }

  .bogo-hero-content {
    position: relative;
    z-index: 10; /* ✅ BOGO-HERO-POLISH-039: Ensure content stays above starfield */
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Premium badge at top */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 32px;
    background: linear-gradient(135deg, #60c655 0%, #50b645 100%);
    border: 3px solid #60c655;
    border-radius: 50px;
    margin-bottom: 32px;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
    position: relative; /* ✅ PERF-OPTIMIZATION: Required for ::after pseudo-element */
    /* box-shadow moved to ::after pseudo-element for GPU acceleration */
  }

  /* ✅ PERF-OPTIMIZATION (SH-CSS-GLOW-OPTIMIZATION-001): GPU-accelerated glow animation */
  .hero-headline--sale::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 8px 40px rgba(96, 198, 85, 0.6); /* Static max glow */
    z-index: -1;
    animation: badgeGlow-opacity 2000ms ease-in-out infinite;
    pointer-events: none;
    will-change: opacity;
  }

  @keyframes badgeGlow-opacity {
    0%, 100% {
      opacity: 0.67; /* 0.4/0.6 = 0.67 to match original min intensity */
    }
    50% {
      opacity: 1; /* Full max glow */
    }
  }

  .bf-badge {
    max-width: 400px;
    width: 100%;
    height: auto;
    margin: 0 auto 0px;
    display: block;
    filter: drop-shadow(0 10px 30px rgba(96, 198, 85, 0.3));
  }

  .hero-headline {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
    font-size: var(--text-4xl); /* Fluid 36-52px */
    font-weight: 900;
    text-transform: uppercase;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: var(--line-tight);
    margin-bottom: var(--space-sm); /* 16px */
  }

  /* Fire emoji enhancement */
  .hero-headline .emoji {
    display: inline-block;
    animation: flicker 1500ms ease-in-out infinite;
  }

  @keyframes flicker {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.3);
    }
  }

  /* ========================================
     PROFESSIONAL "FREE" GRADIENT EFFECT
     ======================================== */

  .free-gradient {
    /* Subtle neon green gradient */
    background: linear-gradient(
      90deg,
      #4CAF50 0%,
      #60c655 20%,
      #7FFF00 40%,
      #39FF14 50%,
      #7FFF00 60%,
      #60c655 80%,
      #4CAF50 100%
    );
    background-size: 200% 100%;

    /* Apply gradient to text */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    /* Make it bold and stand out */
    font-weight: 900;
    font-size: 1.2em;
    letter-spacing: 0.05em;

    /* VERY subtle glow - just a hint */
    filter: drop-shadow(0 0 3px rgba(96, 198, 85, 0.4));

    /* Smooth energy flow animation */
    animation: energyFlow 3000ms linear infinite;

    /* Smooth rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    position: relative;
    display: inline-block;
  }

  /* Energy flow animation - moves gradient horizontally */
  @keyframes energyFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  /* Accessibility: Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .free-gradient {
      animation: none;
      background-position: 50% 50%;
      filter: drop-shadow(0 0 2px rgba(96, 198, 85, 0.3));
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .free-gradient {
      font-size: 1.15em;
      filter: drop-shadow(0 0 2px rgba(96, 198, 85, 0.3));
    }
  }

  @media (max-width: 480px) {
    .free-gradient {
      font-size: 1.1em;
      letter-spacing: 0.03em;
    }
  }

  /* Subtitle - CLEAR HIERARCHY with brand color */
  .hero-subheadline {
    font-size: var(--text-xl); /* 24px */
    font-weight: 600;
    color: #60c655;
    margin-bottom: var(--space-lg); /* 32px */
    line-height: 1.3;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  {%- comment -%} ========================================
      COUNTDOWN TIMER - PREMIUM INTEGRATION
      CKL-113: Depth, blur, purposeful animation
      ======================================== {%- endcomment -%}
  .countdown-container {
    display: inline-flex;
    align-items: center;
    gap: 14px; /* ✅ Reduced from 16px */
    background: rgba(26, 26, 26, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 2px solid rgba(96, 198, 85, 0.4);
    border-radius: 16px;
    padding: 20px 40px; /* ✅ Reduced from 24px 48px */
    margin-bottom: 40px; /* ✅ Reduced from 48px */
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }


### Glow Effects
.section-collections-with-nav__wrapper,
.bogo-hero-content,
.filter-container {
  max-width: 1570px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* Vertical spacing for grid wrapper */
.section-collections-with-nav__wrapper {
  padding-top: var(--space-lg) !important; /* 32px */
--
  }

  /* ✅ PERF-OPTIMIZATION (SH-CSS-GLOW-OPTIMIZATION-001): GPU-accelerated glow animation */
  .hero-headline--sale::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 8px 40px rgba(96, 198, 85, 0.6); /* Static max glow */
    z-index: -1;
    animation: badgeGlow-opacity 2000ms ease-in-out infinite;
    pointer-events: none;
    will-change: opacity;
  }

  @keyframes badgeGlow-opacity {
    0%, 100% {
      opacity: 0.67; /* 0.4/0.6 = 0.67 to match original min intensity */
    }
    50% {
      opacity: 1; /* Full max glow */
    }
  }

  .bf-badge {
    max-width: 400px;
    width: 100%;
    height: auto;
    margin: 0 auto 0px;
    display: block;
    filter: drop-shadow(0 10px 30px rgba(96, 198, 85, 0.3));
  }

  .hero-headline {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
    font-size: var(--text-4xl); /* Fluid 36-52px */
    font-weight: 900;
    text-transform: uppercase;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: var(--line-tight);
--
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.3);
    }
  }

  /* ========================================
     PROFESSIONAL "FREE" GRADIENT EFFECT
     ======================================== */

  .free-gradient {
    /* Subtle neon green gradient */
    background: linear-gradient(
--
    letter-spacing: 0.05em;

    /* VERY subtle glow - just a hint */
    filter: drop-shadow(0 0 3px rgba(96, 198, 85, 0.4));

    /* Smooth energy flow animation */
    animation: energyFlow 3000ms linear infinite;

    /* Smooth rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    position: relative;
    display: inline-block;
--
      animation: none;
      background-position: 50% 50%;
      filter: drop-shadow(0 0 2px rgba(96, 198, 85, 0.3));
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .free-gradient {
      font-size: 1.15em;
      filter: drop-shadow(0 0 2px rgba(96, 198, 85, 0.3));

### Transform & Transition Rules
  /* Reset any inherited zoom/scale */
  zoom: 1;
  transform: none;
  font-size: 16px; /* Standard web base */
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}
--
/* Tier Cards - Reduced Scale (BOGO-VIEWPORT-012) */
.tier-card.most-popular {
  transform: scale(1.03) !important; /* Reduced from 1.05 */
}

@media (max-width: 1024px) {
  .tier-card.most-popular {
    transform: scale(1.01) !important;
  }
}

/* Hero Section - Comfortable Sizing (BOGO-VIEWPORT-012) */
.bogo-hero-2024 {
--
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
    position: relative; /* ✅ PERF-OPTIMIZATION: Required for ::after pseudo-element */
    /* box-shadow moved to ::after pseudo-element for GPU acceleration */
  }

--
    animation: badgeGlow-opacity 2000ms ease-in-out infinite;
    pointer-events: none;
    will-change: opacity;
  }

  @keyframes badgeGlow-opacity {
    0%, 100% {
      opacity: 0.67; /* 0.4/0.6 = 0.67 to match original min intensity */
--
    font-size: var(--text-4xl); /* Fluid 36-52px */
    font-weight: 900;
    text-transform: uppercase;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: var(--line-tight);
    margin-bottom: var(--space-sm); /* 16px */
  }
--
  @keyframes flicker {
    0%, 100% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.3);
    }
  }

  /* ========================================
--
    0%, 100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  .countdown-timer {
    display: flex;
--
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 3px; /* ✅ Reduced from 4px */
  }

  /* ✅ BOGO-HERO-POLISH-039: Battery-shaped countdown timer */
--
                inset 0 2px 8px rgba(255, 255, 255, 0.2);
    transform-origin: left center; /* Scale from left (PERF-QUICK-WINS-001) */
    transition: transform 1s ease-out, background 500ms ease; /* GPU-accelerated (PERF-QUICK-WINS-001) */
    will-change: transform; /* Browser optimization hint (PERF-QUICK-WINS-001) */
    z-index: 1;
    animation: energyPulse 2s ease-in-out infinite;
  }

  /* Low battery warning state */
--
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px; /* Reduced from 28px */
    font-weight: 800;

### Box Shadow Rules
    border-radius: inherit;
    box-shadow: 0 8px 40px rgba(96, 198, 85, 0.6); /* Static max glow */
    z-index: -1;
    animation: badgeGlow-opacity 2000ms ease-in-out infinite;
    pointer-events: none;
--
    margin-bottom: 40px; /* ✅ Reduced from 48px */
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
--
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
                inset 0 2px 8px rgba(0, 0, 0, 0.4),
                0 0 30px rgba(96, 198, 85, 0.3);
  }
--
    border-radius: 0 8px 8px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
                0 0 30px rgba(96, 198, 85, 0.3);
  }

--
    background: linear-gradient(90deg, #60c655 0%, #7ed957 50%, #60c655 100%);
    box-shadow: 0 0 30px rgba(96, 198, 85, 0.6),
                inset 0 2px 8px rgba(255, 255, 255, 0.2);
    transform-origin: left center; /* Scale from left (PERF-QUICK-WINS-001) */
    transition: transform 1s ease-out, background 500ms ease; /* GPU-accelerated (PERF-QUICK-WINS-001) */
--
    background: linear-gradient(90deg, #ff4444 0%, #ff6666 50%, #ff4444 100%);
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.6),
                inset 0 2px 8px rgba(255, 255, 255, 0.2);
    animation: lowBatteryPulse 1s ease-in-out infinite;
  }
--
    padding: 48px;
    box-shadow:
      0 16px 64px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
--
    transform: translateX(8px);
    box-shadow: 0 8px 32px rgba(96, 198, 85, 0.2);
  }

  /* Tier 1 - Base offer */
--
    background: rgba(96, 198, 85, 0.08);
    box-shadow: 0 4px 24px rgba(96, 198, 85, 0.2);
  }

  .tier-item-3::after {
--
    letter-spacing: 0.05em;
    box-shadow: 0 4px 12px rgba(96, 198, 85, 0.4);
  }

  .tier-main-text {
--
    backdrop-filter: blur(10px);
    box-shadow: 0 0 40px rgba(96, 198, 85, 0.2),
                inset 0 2px 8px rgba(0, 0, 0, 0.3);
  }

--
    border-color: rgba(96, 198, 85, 0.6);
    box-shadow: 0 12px 40px rgba(96, 198, 85, 0.3);
  }

  .tier-card:hover::before {
--
    border-radius: inherit;
    box-shadow: 0 16px 48px rgba(96, 198, 85, 0.6); /* Static max glow */
    z-index: -1;
    animation: tier-pulse-opacity 3s ease-in-out infinite;
    pointer-events: none;
--
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

---

## FILE 3: LIQUID TEMPLATE RENDERING
**Source:** sections/bogo-builder-2024.liquid

### Product Grid Loop

### Script Loading

{% if page.handle == 'test-sections' or page.handle == 'shop-1' or page.handle == 'anniversary' or page.handle == '4thjulysale' or page.handle == 'shop' or page.handle == 'titan-shop' or page.handle == 'black-friday-2024' or page.handle == 'chirstmas-2024' or page.handle == 'christmas-2024' %}
  <script src="https://cdn.tailwindcss.com"></script>
{% endif %}


<section class="section-collections-with-nav section-explore dark-mode">
  {%- comment -%} Full Section Starfield Background {%- endcomment -%}
--
          </article>

          <script>
            // ✅ BOGO-INLINE-VARIANTS-059: Store variant data
            window.productVariants = window.productVariants || {};
            window.productVariants[{{ product.id }}] = [
              {% for variant in product.variants %}
                {% if variant.metafields.custom.popup_image %}
--
  <!-- BOGO JAVASCRIPT - CRITICAL: MUST BE INSIDE SECTION -->
  <!-- ========================================== -->
<script src="{{ 'bogo-builder.js' | asset_url }}" defer></script>

<script src="{{ 'section-collections-with-nav.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'section-bf.js' | asset_url }}" defer="defer"></script>

</section>

{%- comment -%} ========================================
    MODALS - OUTSIDE SECTION FOR PROPER Z-INDEX

---

## CURRENT PERFORMANCE METRICS

### Known Issues:
- Starfield background uses 200 animated elements
- Multiple box-shadow effects on hover
- Frequent DOM updates in updateStickyCart()
- localStorage writes on every state change

### Previous Optimizations Applied:
1. GPU acceleration on 4 glow animations (will-change: filter)
2. Debounced window resize handlers
3. Removed Tailwind JIT compilation (using CDN)
4. Lazy initialization (500ms delay)

### Core Web Vitals Targets:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

---

## CONSTRAINTS & REQUIREMENTS

### Must Keep:
- All celebration animations (core to UX)
- Star ratings social proof
- Sticky cart functionality
- State persistence
- Review modal

### Can Optimize:
- Animation performance
- DOM manipulation efficiency
- Event listener patterns
- CSS delivery
- JavaScript loading sequence

### Tech Stack:
- Shopify Liquid templates
- Vanilla JavaScript (no jQuery)
- Tailwind CSS v3.4.1 (CDN - core utilities only)
- localStorage for state
- No build process

---

