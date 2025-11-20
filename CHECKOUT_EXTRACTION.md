=== BOGO CHECKOUT EXTRACTION ===

## 1. MAIN CHECKOUT FUNCTION

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

  // ✅ BOGO-BACK-FIX-002: Mark checkout start in browser history (for back button detection)
  history.pushState({ bogoCheckoutStarted: true }, '', window.location.href);
  console.log('📍 Checkout state marked in browser history');

  // Show loading
  showCheckoutLoading();

  // NEW Step 0: Suppress Rebuy Immediately (BOGO-DEV-VERIFY-030)
  // Suppress before Cart API calls to prevent interference during cart updates and the final redirect.
  suppressRebuy();

  try {
    // Step 1: Clear existing cart
    await clearCart();

    // Step 2: Build items array
    const items = [];
    const pairCount = state.pairs.length;

    // Add all BOGO pairs (Preserving existing logic)
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

    // Step 3: Add bonus cable for Tier 3 (Preserving existing logic)
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

    // Step 5 & 6: Determine Destination and Build URL (BOGO-DEV-VERIFY-030)
    // Note: Old Step 5 (suppressRebuy) was moved to Step 0.

    const discountCodes = getBOGODiscountCodes(pairCount);
    const encodedDiscounts = discountCodes ? encodeURIComponent(discountCodes) : null;

    // Step 6.5: Detect if in development environment
    const isDev = window.location.hostname === '127.0.0.1' ||
                  window.location.hostname === 'localhost' ||
                  window.location.port === '9292';

    let destinationUrl;

    if (isDev) {
      // Development: Go to cart page for verification.
      console.log('⚠️ Development mode: Redirecting to /cart for verification.');
      // Use the new flag for the verification handler
      destinationUrl = '/cart?bogo_verify=true';
      if (encodedDiscounts) {
        // Use '&' because we already have '?'
        destinationUrl += `&discount=${encodedDiscounts}`;
      }
    } else {
      // Production: Go directly to checkout (Streamlined Flow).
      console.log('✅ Production mode: Redirecting directly to /checkout.');
      destinationUrl = '/checkout';
      if (encodedDiscounts) {
        // Checkout uses '?' for the first parameter
        destinationUrl += `?discount=${encodedDiscounts}`;
      }
    }

    console.log('Redirecting to:', destinationUrl);

    // Step 7: Clear BOGO state
    clearBOGOState();

    // Step 8: Navigate to checkout with fallback
    // ✅ FIX: Store timeout refs so they can be cancelled on back button (BOGO-SURGICAL-FIX-COMBINED-001)
    window.bogoCheckoutTimeout = setTimeout(() => {
      window.bogoCheckoutTimeout = null;

      // Method 1: Standard navigation
      window.location.href = destinationUrl;

      // Method 2: Fallback if Method 1 blocked (Preserving existing logic)
      window.bogoCheckoutFallbackTimeout = setTimeout(() => {
        window.bogoCheckoutFallbackTimeout = null;

        if (window.location.href.includes('bogo-bf-2025')) {
          console.warn('Primary navigation blocked, using fallback...');
          // Ensure window.top is accessible before using it
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

    // Clean up flags
    window.bogoDirectCheckout = false;
    sessionStorage.removeItem('bogo-direct-checkout');

    // ✅ FIX: Clean up pending timeouts (BOGO-SURGICAL-FIX-COMBINED-001)
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

## 2. DISCOUNT CODE FUNCTION

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

## 3. ALL NAVIGATION/REDIRECTS

6540-    showBogoToast('Please complete all pairs before checkout', 'error');
6541-    return;
6542-  }
6543-
6544-  // ✅ BOGO-BACK-FIX-002: Mark checkout start in browser history (for back button detection)
6545:  history.pushState({ bogoCheckoutStarted: true }, '', window.location.href);
6546-  console.log('📍 Checkout state marked in browser history');
6547-
6548-  // Show loading
--
6637-
6638-    const discountCodes = getBOGODiscountCodes(pairCount);
6639-    const encodedDiscounts = discountCodes ? encodeURIComponent(discountCodes) : null;
6640-
6641-    // Step 6.5: Detect if in development environment
6642:    const isDev = window.location.hostname === '127.0.0.1' ||
6643:                  window.location.hostname === 'localhost' ||
6644:                  window.location.port === '9292';
6645-
6646-    let destinationUrl;
6647-
--
6673-    // ✅ FIX: Store timeout refs so they can be cancelled on back button (BOGO-SURGICAL-FIX-COMBINED-001)
6674-    window.bogoCheckoutTimeout = setTimeout(() => {
6675-      window.bogoCheckoutTimeout = null;
6676-
6677-      // Method 1: Standard navigation
6678:      window.location.href = destinationUrl;
6679-
6680-      // Method 2: Fallback if Method 1 blocked (Preserving existing logic)
6681-      window.bogoCheckoutFallbackTimeout = setTimeout(() => {
6682-        window.bogoCheckoutFallbackTimeout = null;
6683-
6684:        if (window.location.href.includes('bogo-bf-2025')) {
6685-          console.warn('Primary navigation blocked, using fallback...');
6686-          // Ensure window.top is accessible before using it
6687-          if (window.top) {
--
6796-function showCheckoutLoading() {
6797-  const overlay = document.createElement('div');
6798-  overlay.id = 'checkout-loading';
6799-
6800-  // Detect dev environment
6801:  const isDev = window.location.hostname === '127.0.0.1' ||
6802:                window.location.hostname === 'localhost' ||
6803:                window.location.port === '9292';
6804-
6805-  const devNotice = isDev
6806-    ? `<p class="dev-notice" style="
--
7023-
7024-  console.log('Redirecting with codes:', codes);
7025-  console.log('URL:', `/checkout?discount=${codesString}`);
7026-
7027-  // Redirect
7028:  window.location.href = `/checkout?discount=${codesString}`;
7029-}
7030-
7031-// Error toast
--
7917-}
7918-
7919-// ===== REMOVE STICKY HEADER ON BOGO PAGE (SH-QUICK-FIX-TOAST-HEADER-001) =====
7920-(function() {
7921-  // Check if we're on BOGO page (multiple detection methods)
7922:  const isBOGOPage = window.location.pathname.includes('bogo') ||
7923-                     document.body.classList.contains('template-page') ||
7924-                     document.querySelector('.section-bogo-builder-2024') ||
7925-                     document.body.className.includes('bogo');

## 4. ALL CART API CALLS

5-// ========================================
6-
7-(function clearCartImmediately() {
8-  const clearCart = async () => {
9-    try {
10:      const response = await fetch('/cart/clear.js', {
11-        method: 'POST',
12-        headers: { 'Content-Type': 'application/json' }
13-      });
14-      
15-      if (response.ok) {
16-        console.log('✅ Cart cleared on BOGO page load');
17-      } else {
18-        console.warn('⚠️ Failed to clear cart:', response.status);
19-      }
20-    } catch (error) {
--
6500-}
6501-
6502-// ========================================
6503-// BOGO CHECKOUT - CART API METHOD
6504-// BOGO-CHECKOUT-FIX-027
6505:// Uses Cart API (/cart/add.js) to add items with properties
6506-// ========================================
6507-
6508-/**
6509- * Proceed to Checkout - Cart API Method (BOGO-CHECKOUT-FIX-027)
6510- * Adds items via AJAX, then redirects to checkout with discount codes
6511- *
6512- * Flow:
6513- * 1. Validate state
6514- * 2. Show loading overlay
6515- * 3. Clear existing cart
--
6614-    }
6615-
6616-    console.log('Adding items to cart via Cart API:', items);
6617-
6618-    // Step 4: Add all items to cart via Cart API
6619:    const addResponse = await fetch('/cart/add.js', {
6620-      method: 'POST',
6621-      headers: {
6622-        'Content-Type': 'application/json',
6623-      },
6624-      body: JSON.stringify({ items: items })
6625-    });
6626-
6627-    if (!addResponse.ok) {
6628-      const errorText = await addResponse.text();
6629-      throw new Error(`Cart API error: ${addResponse.status} - ${errorText}`);
--
6881-  if (overlay) overlay.remove();
6882-}
6883-
6884-// Clear cart
6885-async function clearCart() {
6886:  const response = await fetch('/cart/clear.js', {
6887-    method: 'POST',
6888-    headers: { 'Content-Type': 'application/json' }
6889-  });
6890-
6891-  if (!response.ok) {
6892-    throw new Error('Failed to clear cart');
6893-  }
6894-
6895-  return response.json();
6896-}
--
6961-    console.error('Invalid items found:', invalidItems);
6962-    throw new Error('Some items have invalid variant IDs. Please check your selections.');
6963-  }
6964-
6965-  // Add all items in one request
6966:  const response = await fetch('/cart/add.js', {
6967-    method: 'POST',
6968-    headers: { 'Content-Type': 'application/json' },
6969-    body: JSON.stringify({ items: cartItems })
6970-  });
6971-
6972-  if (!response.ok) {
6973-    const error = await response.json();
6974-    console.error('Cart API error:', error);
6975-    throw new Error(error.description || 'Failed to add items to cart');
6976-  }
--
6983-
6984-// Add bonus cable (Tier 3)
6985-async function addBonusCable() {
6986-  const BONUS_CABLE_VARIANT_ID = '43480190943410';
6987-
6988:  const response = await fetch('/cart/add.js', {
6989-    method: 'POST',
6990-    headers: { 'Content-Type': 'application/json' },
6991-    body: JSON.stringify({
6992-      items: [{
6993-        id: BONUS_CABLE_VARIANT_ID,
6994-        quantity: 1,
6995-        properties: {
6996-          '_bonus_item': 'FREE Tier 3 Bonus',
6997-          '_tier_3_bonus': 'Titan Smart Cable'
6998-        }
--
7091-  }
7092-
7093-  // STEP 2: Ensure cart is cleared (maintain Marko's design intent)
7094-  // This prevents Rebuy from adding free gifts to BOGO items
7095-  try {
7096:    await fetch('/cart/clear.js', {
7097-      method: 'POST',
7098-      headers: {
7099-        'Content-Type': 'application/json',
7100-      }
7101-    });
7102-    console.log('✅ Cart cleared on back navigation (prevents Rebuy conflicts)');
7103-  } catch (error) {
7104-    console.warn('⚠️ Failed to clear cart on back:', error);
7105-    // Continue anyway - modal is already hidden
7106-  }

## 5. ALL TIMING/DELAYS

159-    // Prevent any cart drawer opens for next 2 seconds
160-    let preventCartDrawer = true;
161-
162:    setTimeout(() => {
163-      preventCartDrawer = false;
164-    }, 2000);
165-
166-    // Intercept any drawer open attempts
167-    document.addEventListener('rebuy:cart.open', function(e) {
168-      if (preventCartDrawer) {
169-        console.log('Prevented Rebuy cart drawer from opening');
170-        e.preventDefault();
--
206-      func(...args);
207-    };
208-    clearTimeout(timeout);
209:    timeout = setTimeout(later, wait);
210-  };
211-}
212-
213-// ========================================
214-// STATE PERSISTENCE (DEBOUNCED)
215-// SH-PERFORMANCE-QUICK-WINS-001
216-// ========================================
217-
--
317-  document.body.appendChild(toast);
318-
319-  // Auto-remove after duration
320:  setTimeout(() => {
321-    toast.classList.add('hiding');
322:    setTimeout(() => toast.remove(), 300);
323-  }, duration);
324-}
325-
326-// ===========================================
327-// STARFIELD ANIMATION - GPU Accelerated
328-// ===========================================
329-(function() {
330-  console.log('🌌 Starfield: Initializing...');
--
354-    let timeout;
355-    return function executedFunction(...args) {
356-      clearTimeout(timeout);
357:      timeout = setTimeout(() => func(...args), wait);
358-    };
359-  }
360-
361-  function resizeCanvas() {
362-    const oldWidth = canvas.width;
363-    const oldHeight = canvas.height;
364-
365-    canvas.width = window.innerWidth;
--
423-  console.log('✅ Starfield animation started!');
424-
425-  // Debug: Draw a test rectangle to verify canvas is working
426:  setTimeout(() => {
427-    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
428-    ctx.fillRect(100, 100, 100, 100);
429-    console.log('🔴 Test red square drawn at 100,100 (should be visible if canvas working)');
430-  }, 1000);
431-})();
432-
433-// ===========================================
434-// COUNTDOWN TIMER - Battery Progress Bar
--
505-    }
506-  }
507-
508:  // ✅ PERF-QUICK-WINS-001: Use simple setInterval (more efficient than requestAnimationFrame + setTimeout)
509-  updateCountdown();
510:  setInterval(updateCountdown, 1000);
511-})();
512-
513-// ===========================================
514-// PRODUCT FILTER DROPDOWN
515-// ===========================================
516-(function() {
517-  const filterSelect = document.getElementById('category-filter');
518-  if (!filterSelect) return;
--
686-
687-  // Animate transition
688-  defaultState.classList.remove('active');
689:  setTimeout(function() {
690-    variantState.classList.add('active');
691-  }, 400);
692-
693-  // ✅ BOGO-VARIANT-FIX-062: Add button click handler
694-  const addBtn = card.querySelector('.btn-add-variant');
695-  if (addBtn) {
696-    // Remove any existing listener
697-    addBtn.replaceWith(addBtn.cloneNode(true));
--
730-
731-  // Animate back
732-  variantState.classList.remove('active');
733:  setTimeout(function() {
734-    defaultState.classList.add('active');
735-
736-    // Clear variant selectors after animation completes
737-    if (variantContainer) {
738-      variantContainer.innerHTML = '';
739-    }
740-  }, 400);
741-}
--
858-  hideInlineVariantSelection(card);
859-
860-  // Remove added class after animation
861:  setTimeout(function() {
862-    card.classList.remove('added');
863-  }, 2000);
864-}
865-
866-function addProductToPair(productData) {
867-  console.log('📦 Adding product to pair:', productData);
868-
869-  // ✅ CRITICAL FIX: Multi-priority image fallback system
--
971-  const badge = element.querySelector(`.pair-slot-badge[data-pair="${pairNumber}"]`);
972-  if (badge) {
973-    badge.style.animation = 'badgePulse 300ms ease-in reverse';
974:    setTimeout(function() {
975-      badge.remove();
976-
977-      // If no more badges, remove container and border
978-      const badgeContainer = element.querySelector('.pair-badge-container');
979-      if (badgeContainer && badgeContainer.children.length === 0) {
980-        badgeContainer.remove();
981-        element.classList.remove('product-selected');
982-        element.style.border = '';
--
1083-  const newTier = getTierForCount(state.pairs.length);
1084-  if (newTier > previousTier && newTier >= 2) {
1085-    console.log(`🎯 Tier ${newTier} unlocked!`);
1086:    setTimeout(() => {
1087-      if (window.tierCelebrations) {
1088-        window.tierCelebrations.celebrate(newTier);
1089-      }
1090-    }, 800);
1091-  }
1092-
1093-  // Reset for next pair
1094-  state.currentPair = { slot1: null, slot2: null };
--
1112-    element.style.animation = 'electricPulse 800ms ease-in-out';
1113-
1114-    // Remove animation after completion
1115:    setTimeout(function() {
1116-      element.style.animation = '';
1117-    }, 800);
1118-  });
1119-
1120-  // Lightning bolt effect on sticky cart
1121-  const stickyCart = document.getElementById('bogo-sticky-cart');
1122-  if (stickyCart) {
1123-    stickyCart.classList.add('celebrating');
1124-
1125:    setTimeout(function() {
1126-      stickyCart.classList.remove('celebrating');
1127-    }, 1200);
1128-  }
1129-
1130-  // Trigger haptic feedback if available (mobile)
1131-  if ('vibrate' in navigator) {
1132-    navigator.vibrate([50, 30, 50]);
1133-  }
--
1395-  segments.forEach(segment => {
1396-    segment.addEventListener('touchstart', () => {
1397-      segment.classList.add('tapped');
1398:      setTimeout(() => segment.classList.remove('tapped'), 600);
1399-    });
1400-  });
1401-}
1402-
1403-// ========================================
1404-// SIMPLE WORKING STICKY CART UPDATE
1405-// STICKY-CART-SHOW-FIRST-PRODUCT-077
1406-// ========================================
--
1637-  // ✅ BOGO-V2-POLISH: Animate pair count changes
1638-  if (pairCountEl && pairCount !== prevState.pairCount && pairCount > 0) {
1639-    pairCountEl.style.animation = 'none';
1640:    setTimeout(() => {
1641-      pairCountEl.style.animation = 'savingsPopIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
1642-    }, 10);
1643-  }
1644-
1645-  // Define button actions
1646-  const scrollToProducts = () => {
1647-    // Close modal if open
1648-    const modal = document.getElementById('pair-management-modal');
--
1744-    if (pairCount >= tier) {
1745-      if (!segment.classList.contains('active')) {
1746-        // Sequential activation with delay for visual effect
1747:        setTimeout(() => {
1748-          segment.classList.add('active');
1749-          console.log(`Segment ${tier} activated`);
1750-        }, index * 150);
1751-      }
1752-    } else {
1753-      segment.classList.remove('active');
1754-    }
1755-  });
--
1768-    // The celebration-pulse (1200ms) provides better visual feedback than cartSlideUp (500ms)
1769-    // Visual pulse animation - DISABLED to prevent animation conflict
1770-    // stickyCartV2.style.animation = 'none';
1771:    // setTimeout(() => {
1772-    //   stickyCartV2.style.animation = 'cartSlideUp 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
1773-    // }, 10);
1774-
1775-    // Haptic feedback on mobile
1776-    if (currentTier === 1) {
1777-      triggerHapticFeedback('medium');
1778-    } else if (currentTier === 2) {
1779-      triggerHapticFeedback('heavy');
1780-    } else if (currentTier === 3) {
1781-      triggerHapticFeedback('success');
1782-      // Confetti celebration for tier 3!
1783:      setTimeout(() => triggerStickyCartConfetti(), 300);
1784-    }
1785-
1786-    console.log(`🎉 Tier ${currentTier} unlocked! Haptic: ${currentTier === 3 ? 'success' : currentTier === 2 ? 'heavy' : 'medium'}`);
1787-  }
1788-
1789-  // --- 4. VISIBILITY CONTROL ---
1790-  // Show V2 cart whenever there are products OR we want to incentivize
1791-  const shouldShow = pairCount > 0 || hasIncompleteProduct || true; // Always show for incentive
--
1869-
1870-// Initialize on page load
1871-document.addEventListener('DOMContentLoaded', () => {
1872:  setTimeout(() => {
1873-    console.log('Initializing Sticky Cart V2 on page load');
1874-    updateStickyCart();
1875-  }, 100);
1876-});
1877-
1878-// OLD V1 STICKY CART LOGIC REMOVED (Lines 1153-1368)
1879-// Now using V2 logic with accurate calculations and segmented progress
1880-
--
1990-  document.addEventListener('keydown', handleModalEscape);
1991-
1992-  // ✅ BOGO-REVIEW-FIXES-040: Setup Compare Tiers button
1993:  setTimeout(function() {
1994-    setupCompareTiersButton();
1995-  }, 100);
1996-
1997-  // ✅ BOGO-CHECKOUT-FINAL-061: Setup modal checkout button
1998-  const modalCheckoutBtn = document.getElementById('modal-checkout-btn');
1999-  if (modalCheckoutBtn) {
2000-    modalCheckoutBtn.onclick = function() {
2001-      console.log('Modal checkout clicked');
--
2891-  });
2892-
2893-  // ✅ PERF-QUICK-WINS-001: Reduce stock update frequency (30s vs 5s = 80% less CPU usage)
2894:  setInterval(decreaseRandomStock, 30000);
2895-
2896-  console.log('✅ Stock levels initialized');
2897-}
2898-
2899-function updateStockDisplay(card) {
2900-  let stockBadge = card.querySelector('.stock-badge');
2901-
2902-  if (!stockBadge) {
--
2916-
2917-  // Animate number change
2918-  stockBadge.classList.add('updating');
2919:  setTimeout(function() {
2920-    stockBadge.classList.remove('updating');
2921-  }, 400);
2922-}
2923-
2924-function decreaseRandomStock() {
2925-  const products = Array.from(document.querySelectorAll('.product-card'));
2926-
2927-  // Pick 1-3 random products to decrease
--
2976-    let scrollTimeout;
2977-    tierCardsContainer.addEventListener('scroll', function() {
2978-      clearTimeout(scrollTimeout);
2979:      scrollTimeout = setTimeout(() => {
2980-        const scrollLeft = tierCardsContainer.scrollLeft;
2981-        const cardWidth = tierCardsContainer.querySelector('.tier-card')?.offsetWidth || 0;
2982-        const gap = 16; // gap between cards
2983-        const currentIndex = Math.round(scrollLeft / (cardWidth + gap));
2984-
2985-        carouselDots.forEach((dot, index) => {
2986-          dot.classList.toggle('active', index === currentIndex);
2987-        });
--
5512-  });
5513-
5514-  // Update button text for BOGO context
5515:  setTimeout(function() {
5516-    const addToCartBtn = modal.querySelector('.js-atc-bf');
5517-    if (addToCartBtn) {
5518-      const hasVariants = parseInt(productCard.dataset.hasVariants) > 0;
5519-
5520-      if (hasVariants) {
5521-        addToCartBtn.innerHTML = 'Select Variant & Add to BOGO Pair';
5522-      } else {
5523-        addToCartBtn.innerHTML = 'Add to BOGO Pair';
--
5601-      }
5602-
5603-      // Close modal
5604:      setTimeout(function() {
5605-        closeAllModals();
5606-      }, 300);
5607-    };
5608-  }
5609-
5610-  // ✅ BOGO-MODAL-ENHANCE-041: Setup image carousel
5611-  setupImageCarousel(modal, productId);
5612-
--
5800-  document.body.appendChild(toast);
5801-
5802-  // Auto-dismiss after 2.5 seconds
5803:  setTimeout(() => {
5804-    toast.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
5805-    toast.style.opacity = '0';
5806-    toast.style.transform = 'translateX(-50%) translateY(-20px) scale(0.95)';
5807:    setTimeout(() => toast.remove(), 300);
5808-  }, 2500);
5809-}
5810-
5811-// Ensure functions are globally accessible
5812-window.handleProductClick = handleProductClick;
5813-window.openProductInfoModal = openProductInfoModal;
5814-window.closeAllModals = closeAllModals;
5815-window.addProductToPair = addProductToPair;
--
5982-    document.addEventListener('keydown', escapeHandler);
5983-
5984-    this.overlay.className = `tier-celebration-overlay tier-${tier}`;
5985:    setTimeout(() => this.overlay.classList.add('show'), 100);
5986-
5987-    if (tier === 2) this.triggerConfetti();
5988-    else if (tier === 3) this.triggerFireworks();
5989-
5990-    document.querySelector('.bogo-sticky-cart')?.classList.add('celebration-pulse');
5991:    setTimeout(() => document.querySelector('.bogo-sticky-cart')?.classList.remove('celebration-pulse'), 1200);
5992-  }
5993-
5994-  calculateTierSavings(tier) {
5995-    const state = window.bogoState;
5996-    
5997-    // 1. Calculate BOGO Savings (100% off cheaper item)
5998-    let bogoSavings = state.pairs.reduce((sum, pair) => sum + pair.savings, 0);
5999-    
--
6069-    const particles = [];
6070-
6071-    for (let i = 0; i < 5; i++) {
6072:      setTimeout(() => {
6073-        fireworks.push({ x: Math.random() * this.canvas.width, y: this.canvas.height, targetY: Math.random() * this.canvas.height * 0.4 + 100, vy: -8, exploded: false });
6074-      }, i * 400);
6075-    }
6076-
6077-    const animate = () => {
6078-      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
6079-      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
6080-      fireworks.forEach(fw => {
--
6179-
6180-  // ✅ ANIMATE ONLY ON CHANGE
6181-  stockBadge.classList.add('updating');
6182:  setTimeout(() => {
6183-    stockBadge.classList.remove('updating');
6184-  }, 400);
6185-}
6186-
6187-function decreaseRandomStock() {
6188-  const products = Array.from(document.querySelectorAll('.section-collections-with-nav__product'));
6189-
6190-  // Pick 1-3 random products to decrease
--
6229-  });
6230-
6231-  // ✅ PERF-QUICK-WINS-001: Reduce stock update frequency (30s vs 5s = 80% less CPU usage)
6232:  setInterval(decreaseRandomStock, 30000);
6233-}
6234-
6235-// ========================================
6236-// ANNOUNCEMENT BAR - HIDE ON SCROLL
6237-// ========================================
6238-
6239-class AnnouncementBar {
6240-  constructor() {
--
6389-    openProductInfoModal(event, productCard);
6390-
6391-    // Optional: Scroll modal to reviews section after opening
6392:    setTimeout(() => {
6393-      const reviewsSection = document.querySelector('.product-reviews-section');
6394-      if (reviewsSection) {
6395-        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
6396-      }
6397-    }, 300);
6398-  } else {
6399-    console.error('❌ openProductInfoModal function not found');
6400-  }
--
6405-  console.log('📄 DOM loaded - initializing star ratings');
6406-
6407-  // Wait 500ms for DOM to fully render
6408:  setTimeout(() => {
6409-    populateProductRatings();
6410-  }, 500);
6411-});
6412-
6413-// Re-populate on window resize (for mobile/desktop text adjustment)
6414-let resizeTimeout;
6415-window.addEventListener('resize', function() {
6416-  clearTimeout(resizeTimeout);
6417:  resizeTimeout = setTimeout(() => {
6418-    console.log('📐 Window resized - updating rating text');
6419-    populateProductRatings();
6420-  }, 250);
6421-});
6422-
6423-// Add keyboard support for accessibility
6424-document.addEventListener('keydown', function(event) {
6425-  if (event.target.classList.contains('product-rating-display')) {
--
6671-
6672-    // Step 8: Navigate to checkout with fallback
6673-    // ✅ FIX: Store timeout refs so they can be cancelled on back button (BOGO-SURGICAL-FIX-COMBINED-001)
6674:    window.bogoCheckoutTimeout = setTimeout(() => {
6675-      window.bogoCheckoutTimeout = null;
6676-
6677-      // Method 1: Standard navigation
6678-      window.location.href = destinationUrl;
6679-
6680-      // Method 2: Fallback if Method 1 blocked (Preserving existing logic)
6681:      window.bogoCheckoutFallbackTimeout = setTimeout(() => {
6682-        window.bogoCheckoutFallbackTimeout = null;
6683-
6684-        if (window.location.href.includes('bogo-bf-2025')) {
6685-          console.warn('Primary navigation blocked, using fallback...');
6686-          // Ensure window.top is accessible before using it
6687-          if (window.top) {
6688-            window.top.location.href = destinationUrl;
6689-          }
--
6778-  document.body.classList.add('bogo-checkout-mode');
6779-
6780-  // Restore after 5 seconds (increased from 3)
6781:  setTimeout(() => {
6782-    console.log('Restoring Rebuy...');
6783-    if (window._rebuyOriginalBackup) {
6784-      window.Rebuy = window._rebuyOriginalBackup;
6785-      delete window._rebuyOriginalBackup;
6786-    }
6787-    sessionStorage.removeItem('bogo-direct-checkout');
6788-    sessionStorage.removeItem('rebuy-disabled');
6789-    document.body.classList.remove('bogo-checkout-mode');
--
7048-
7049-  document.body.appendChild(toast);
7050-
7051:  setTimeout(() => toast.remove(), 5000);
7052-}
7053-
7054-// Make function globally available
7055-window.proceedToCheckout = proceedToCheckout;
7056-
7057-console.log('%c✅ BOGO-CHECKOUT-FINAL-061: Checkout integration loaded', 'color: #60c655; font-weight: bold;');
7058-
7059-// ═══════════════════════════════════════════════════════════════════
--
7279-// DISABLED: 
7280-// DISABLED:   document.body.appendChild(toast);
7281-// DISABLED: 
7282:// DISABLED:   setTimeout(() => {
7283-// DISABLED:     toast.style.opacity = '0';
7284-// DISABLED:     toast.style.transform = 'translateY(-10px)';
7285-// DISABLED:     toast.style.transition = 'all 300ms ease';
7286:// DISABLED:     setTimeout(() => toast.remove(), 300);
7287-// DISABLED:   }, 2000);
7288-// DISABLED: }
7289-// DISABLED: 
7290-// DISABLED: // Make functions globally available
7291-// DISABLED: window.removePair = removePair;
7292-// DISABLED: window.updateStickyCartDisplay = updateStickyCartDisplay;
7293-// DISABLED: window.updateTierMessage = updateTierMessage;
7294-// DISABLED: 
--
7412-// DISABLED: 
7413-// DISABLED:   document.body.appendChild(toast);
7414-// DISABLED: 
7415:// DISABLED:   setTimeout(() => {
7416-// DISABLED:     toast.style.opacity = '0';
7417-// DISABLED:     toast.style.transform = 'translateY(-10px)';
7418-// DISABLED:     toast.style.transition = 'all 300ms ease';
7419:// DISABLED:     setTimeout(() => toast.remove(), 300);
7420-// DISABLED:   }, 2000);
7421-// DISABLED: }
7422-// DISABLED: 
7423-// DISABLED: // Make functions globally available
7424-// DISABLED: window.removePair = removePair;
7425-// DISABLED: window.updateStickyCartDisplay = updateStickyCartDisplay;
7426-// DISABLED: window.updateTierMessage = updateTierMessage;
7427-// DISABLED: 
--
7611-  
7612-  document.body.appendChild(toast);
7613-  
7614:  setTimeout(() => {
7615-    toast.style.opacity = '0';
7616-    toast.style.transform = 'translateX(20px)';
7617-    toast.style.transition = 'all 300ms ease';
7618:    setTimeout(() => toast.remove(), 300);
7619-  }, 2000);
7620-}
7621-
7622-// Update modal when variant changes
7623-function updateModalVariant(modal) {
7624-  const variantData = getSelectedVariantFromModal(modal);
7625-  
7626-  if (!variantData) return;
--
7730-// INITIALIZE STICKY CART V2 ADVANCED FEATURES (BOGO-V2-ADVANCED)
7731-// ========================================
7732-document.addEventListener('DOMContentLoaded', () => {
7733:  setTimeout(() => {
7734-    console.log('🚀 Initializing Sticky Cart V2 Advanced Features');
7735-
7736-    // Initialize savings tooltip
7737-    if (typeof initSavingsTooltip === 'function') {
7738-      initSavingsTooltip();
7739-      console.log('✅ Savings tooltip initialized');
7740-    }
7741-

## 6. CHECKOUT BUTTON HTML


## 7. LOADING SCREEN

5994-  calculateTierSavings(tier) {
5995-    const state = window.bogoState;
--
6009-    const shippingSavings = tier >= 2 ? 499 : 0;
6010-    const cableSavings = tier === 3 ? 1895 : 0;
6011-    
6012-    // 5. Total savings (all in cents)
6013-    return (bogoSavings + tierSavings + shippingSavings + cableSavings) / 100;
6014-  }
6015-
6016-  closeCelebration(tier, action) {
6017-    console.log(`🎉 closeCelebration called - tier: ${tier}, action: ${action}`);
6018-    console.log('🎉 Closing celebration modal and returning to product selection');
6019:    this.overlay.classList.remove('show');
6020-    // ✅ Always just close and return to product selection
6021-    // User can checkout from sticky cart when ready
6022-  }
6023-
6024-  triggerConfetti() {
6025-    if (!this.canvas || !this.ctx) return;
6026-    this.canvas.width = window.innerWidth;
6027-    this.canvas.height = window.innerHeight;
6028-    const particles = [];
6029-    const colors = ['#60C655', '#FFD700', '#FF6B6B', '#4ECDC4'];

## 8. BACK BUTTON DETECTION

275-  }
276-}
277-
278-/**
279- * Clear BOGO state from localStorage
280- */
281-function clearBOGOState() {
282-  // Clear localStorage
283-  localStorage.removeItem(BOGO_STORAGE_KEY);
284-
285:  // ✅ BOGO-BACK-FIX-002: Also reset in-memory state
286-  if (window.bogoState) {
287-    window.bogoState = {
288-      pairs: [],
289-      currentPair: {}
290-    };
291-  }
292-
293-  console.log('🗑️ BOGO state cleared (localStorage + memory)');
294-}
295-
--
6534-    const hasFirstProduct = pair.slot1 || pair.product1;
6535-    const hasSecondProduct = pair.slot2 || pair.product2;
6536-    return !hasFirstProduct || !hasSecondProduct;
6537-  });
6538-
6539-  if (incompletePairs.length > 0) {
6540-    showBogoToast('Please complete all pairs before checkout', 'error');
6541-    return;
6542-  }
6543-
6544:  // ✅ BOGO-BACK-FIX-002: Mark checkout start in browser history (for back button detection)
6545-  history.pushState({ bogoCheckoutStarted: true }, '', window.location.href);
6546-  console.log('📍 Checkout state marked in browser history');
6547-
6548-  // Show loading
6549-  showCheckoutLoading();
6550-
6551-  // NEW Step 0: Suppress Rebuy Immediately (BOGO-DEV-VERIFY-030)
6552-  // Suppress before Cart API calls to prevent interference during cart updates and the final redirect.
6553-  suppressRebuy();
6554-
--
6663-        destinationUrl += `?discount=${encodedDiscounts}`;
6664-      }
6665-    }
6666-
6667-    console.log('Redirecting to:', destinationUrl);
6668-
6669-    // Step 7: Clear BOGO state
6670-    clearBOGOState();
6671-
6672-    // Step 8: Navigate to checkout with fallback
6673:    // ✅ FIX: Store timeout refs so they can be cancelled on back button (BOGO-SURGICAL-FIX-COMBINED-001)
6674-    window.bogoCheckoutTimeout = setTimeout(() => {
6675-      window.bogoCheckoutTimeout = null;
6676-
6677-      // Method 1: Standard navigation
6678-      window.location.href = destinationUrl;
6679-
6680-      // Method 2: Fallback if Method 1 blocked (Preserving existing logic)
6681-      window.bogoCheckoutFallbackTimeout = setTimeout(() => {
6682-        window.bogoCheckoutFallbackTimeout = null;
6683-
--
7050-
7051-  setTimeout(() => toast.remove(), 5000);
7052-}
7053-
7054-// Make function globally available
7055-window.proceedToCheckout = proceedToCheckout;
7056-
7057-console.log('%c✅ BOGO-CHECKOUT-FINAL-061: Checkout integration loaded', 'color: #60c655; font-weight: bold;');
7058-
7059-// ═══════════════════════════════════════════════════════════════════
7060:// HANDLE BROWSER BACK BUTTON DURING CHECKOUT (BOGO-BACK-FIX-002)
7061-// Maintains Marko's design: Clear cart to prevent Rebuy conflicts
7062-// ═══════════════════════════════════════════════════════════════════
7063:window.addEventListener('popstate', async function(event) {
7064-  // ✅ CRITICAL FIX: Only run on BACK button, not during checkout redirect
7065-  // If bogoCheckoutStarted is true in state, we're IN checkout flow - don't interfere
7066-  if (event.state && event.state.bogoCheckoutStarted === true) {
7067:    console.log('✅ Checkout in progress - popstate handler ignoring (not a back button)');
7068-    return; // Exit early, let checkout complete
7069-  }
7070-
7071-  console.log('🔙 Back button detected during checkout flow');
7072-
7073-  // ✅ FIX: Cancel any pending checkout redirects (BOGO-SURGICAL-FIX-COMBINED-001)
7074-  if (window.bogoCheckoutTimeout) {
7075-    clearTimeout(window.bogoCheckoutTimeout);
7076-    window.bogoCheckoutTimeout = null;
7077-    console.log('✅ Cancelled primary checkout redirect');
