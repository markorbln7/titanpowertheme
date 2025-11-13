  console.log('%c🚀 BOGO JavaScript Loading...', 'color: #60c655; font-size: 20px; font-weight: bold;');

// ========================================
// PREVENT REBUY CART DRAWER ON BOGO CHECKOUT
// BOGO-BYPASS-CART-DRAWER-078
// ========================================

(function preventRebuyInterference() {
  // Check if this is a BOGO checkout redirect
  const isBOGOCheckout = sessionStorage.getItem('bogo-direct-checkout');

  if (isBOGOCheckout === 'true') {
    console.log('%c🛡️ BOGO direct checkout detected - preventing cart drawer', 'color: #60c655; font-weight: bold;');

    // Clear the flag
    sessionStorage.removeItem('bogo-direct-checkout');

    // Prevent Rebuy cart drawer from opening
    if (window.Rebuy) {
      console.log('Disabling Rebuy cart drawer...');
      if (window.Rebuy.SmartCart) {
        window.Rebuy.SmartCart.close = function() {};
        window.Rebuy.SmartCart.open = function() {};
      }
    }

    // Prevent any cart drawer opens for next 2 seconds
    let preventCartDrawer = true;

    setTimeout(() => {
      preventCartDrawer = false;
    }, 2000);

    // Intercept any drawer open attempts
    document.addEventListener('rebuy:cart.open', function(e) {
      if (preventCartDrawer) {
        console.log('Prevented Rebuy cart drawer from opening');
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }
})();

// ===========================================
// STARFIELD ANIMATION - GPU Accelerated
// ===========================================
(function() {
  console.log('🌌 Starfield: Initializing...');

  const canvas = document.getElementById('starfield-canvas-full');
  if (!canvas) {
    console.error('❌ Starfield canvas NOT FOUND! Element #starfield-canvas-full missing.');
    return;
  }

  console.log('✅ Canvas found:', canvas);
  console.log('Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
  console.log('Canvas position:', window.getComputedStyle(canvas).position);
  console.log('Canvas z-index:', window.getComputedStyle(canvas).zIndex);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    console.error('❌ Failed to get 2D context');
    return;
  }

  let animationId;
  let stars = [];

  function resizeCanvas() {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; // ✅ Use viewport height since canvas is fixed

    console.log(`📐 Canvas resized: ${oldWidth}x${oldHeight} → ${canvas.width}x${canvas.height}`);

    initStars();
  }

  function initStars() {
    stars = [];
    const starCount = Math.min(300, Math.floor((canvas.width * canvas.height) / 4000));

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.3,
        layer: Math.floor(Math.random() * 3)
      });
    }

    console.log(`⭐ ${starCount} stars initialized`);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      star.x -= star.speed * (star.layer + 1);

      if (star.x < 0) {
        star.x = canvas.width;
        star.y = Math.random() * canvas.height;
      }

      star.opacity += (Math.random() - 0.5) * 0.02;
      star.opacity = Math.max(0.3, Math.min(1, star.opacity));

      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animate();

  console.log('✅ Starfield animation started!');

  // Debug: Draw a test rectangle to verify canvas is working
  setTimeout(() => {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(100, 100, 100, 100);
    console.log('🔴 Test red square drawn at 100,100 (should be visible if canvas working)');
  }, 1000);
})();

// ===========================================
// COUNTDOWN TIMER - Battery Progress Bar
// ===========================================
(function() {
  const countdownText = document.getElementById('countdown-text');
  const batteryFill = document.getElementById('battery-fill');

  if (!countdownText || !batteryFill) return;

  const SALE_DURATION_MS = 72 * 60 * 60 * 1000;

  function getSaleStartTime() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const hour = now.getUTCHours();

    let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    if (dayOfWeek === 5 && hour >= 17) {
      daysUntilFriday = 7;
    }

    const nextFriday = new Date(now);
    nextFriday.setUTCDate(now.getUTCDate() + daysUntilFriday);
    nextFriday.setUTCHours(17, 0, 0, 0);

    return nextFriday.getTime();
  }

  const saleStart = getSaleStartTime();
  const saleEnd = saleStart + SALE_DURATION_MS;

  function updateCountdown() {
    const now = Date.now();
    const timeLeft = saleEnd - now;

    if (timeLeft <= 0) {
      countdownText.textContent = '⚡ SALE ENDED ⚡';
      batteryFill.style.width = '0%';
      batteryFill.classList.add('low-battery');
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    let display = '⚡ ';
    if (days > 0) {
      display += `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      display += `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      display += `${minutes}m ${seconds}s`;
    } else {
      display += `${seconds}s`;
    }
    display += ' ⚡';

    countdownText.textContent = display;

    const percentRemaining = (timeLeft / SALE_DURATION_MS) * 100;
    batteryFill.style.width = `${Math.max(0, percentRemaining)}%`;

    // ✅ BOGO-HERO-POLISH-039: Add low battery warning when < 25% time remaining
    if (percentRemaining < 25) {
      batteryFill.classList.add('low-battery');
    } else {
      batteryFill.classList.remove('low-battery');
    }

    requestAnimationFrame(() => {
      setTimeout(updateCountdown, 1000);
    });
  }

  updateCountdown();
})();

// ===========================================
// PRODUCT FILTER DROPDOWN
// ===========================================
(function() {
  const filterSelect = document.getElementById('category-filter');
  if (!filterSelect) return;

  filterSelect.addEventListener('change', function(e) {
    const selectedCategory = e.target.value;
    const products = document.querySelectorAll('.section-collections-with-nav__product');

    products.forEach(product => {
      if (selectedCategory === 'all') {
        product.style.display = 'block';
      } else {
        const productCategory = product.dataset.category;
        product.style.display = productCategory === selectedCategory ? 'block' : 'none';
      }
    });
  });
})();

// ===========================================
// BOGO PAIR SELECTION SYSTEM - Phase 2
// ===========================================
// Global state for BOGO pairs
window.bogoState = {
  pairs: [],
  currentPair: {
    slot1: null,
    slot2: null
  },
  activePairNumber: 1
};

// ✅ BOGO-INLINE-VARIANTS-044: Enhanced product click handler
function handleProductClick(event, element) {
  // Don't trigger if clicking info icon or close button
  if (event.target.closest('.product-info-icon') ||
      event.target.closest('.product-info-btn') ||
      event.target.closest('.variant-close-btn')) return;

  // If clicking inside active variant state, let those handlers work
  if (event.target.closest('.card-variant-state.active')) return;

  const productId = element.dataset.productId;
  const variantId = element.dataset.variantId;
  const hasMultipleVariants = parseInt(element.dataset.hasVariants) > 0;
  const price = parseFloat(element.dataset.price);
  const title = element.querySelector('.section-collections-with-nav__product-title')?.textContent || 'Product';

  // ✅ FIX: Get main product image with clean URL
  const productImage = element.querySelector('.section-collections-with-nav__product-image img');
  let imageSrc = '';

  if (productImage) {
    imageSrc = productImage.src.split('?')[0]; // Clean URL parameters
  }

  // Fallback to srcset or data-src
  if (!imageSrc && productImage) {
    imageSrc = productImage.dataset.src || productImage.srcset?.split(' ')[0] || '';
    imageSrc = imageSrc.split('?')[0]; // Clean fallback too
  }

  console.log('📦 Product image:', imageSrc);

  // ✅ BOGO-INLINE-VARIANTS-044: If product has variants, show inline selector
  if (hasMultipleVariants) {
    showInlineVariantSelection(element);
    return;
  }

  // Single variant - add directly to pair
  addProductToPair({
    productId: productId,
    variantId: variantId,
    price: price,
    title: title,
    image: imageSrc,
    element: element
  });
}

// ✅ BOGO-INLINE-VARIANTS-059: Show inline variant selection
function showInlineVariantSelection(card) {
  const productId = card.dataset.productId;

  const defaultState = card.querySelector('.card-default-state');
  const variantState = card.querySelector('.card-variant-state');
  const variantContainer = card.querySelector('.variant-selectors-inline');

  if (!defaultState || !variantState || !variantContainer) {
    console.error('Missing required elements');
    return;
  }

  // ✅ Get product options from window.productOptions
  const productOptions = window.productOptions?.[productId];
  if (!productOptions || productOptions.length === 0) {
    console.error('No product options found for product:', productId);
    return;
  }

  console.log('✅ Showing variant selection for product:', productId);
  console.log('Options:', productOptions);

  // Generate variant selectors
  variantContainer.innerHTML = '';

  productOptions.forEach(function(optionData) {
    const selector = document.createElement('div');
    selector.className = 'inline-variant-selector';

    const label = document.createElement('label');
    label.className = 'inline-variant-label';
    label.textContent = optionData.name;

    const select = document.createElement('select');
    select.className = 'inline-variant-select';
    select.dataset.optionName = optionData.name;
    select.dataset.optionPosition = optionData.position;

    // Add placeholder option
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = 'Select ' + optionData.name;
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    select.appendChild(placeholderOpt);

    // Add options
    optionData.values.forEach(function(value) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });

    // Listen for changes to enable add button
    select.addEventListener('change', function() {
      validateInlineVariantSelection(card);
    });

    selector.appendChild(label);
    selector.appendChild(select);
    variantContainer.appendChild(selector);
  });

  // Animate transition
  defaultState.classList.remove('active');
  setTimeout(function() {
    variantState.classList.add('active');
  }, 400);

  // ✅ BOGO-VARIANT-FIX-062: Add button click handler
  const addBtn = card.querySelector('.btn-add-variant');
  if (addBtn) {
    // Remove any existing listener
    addBtn.replaceWith(addBtn.cloneNode(true));
    const newAddBtn = card.querySelector('.btn-add-variant');

    newAddBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('🔘 Add to Pair button clicked');
      addProductWithInlineVariant(card);
    });
  }

  // ✅ BOGO-VARIANT-FIX-062: Add close button handler
  const closeBtn = card.querySelector('.variant-close-btn');
  if (closeBtn) {
    closeBtn.replaceWith(closeBtn.cloneNode(true));
    const newCloseBtn = card.querySelector('.variant-close-btn');

    newCloseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('❌ Close variant selector');
      hideInlineVariantSelection(card);
    });
  }

  console.log('✅ Variant selectors displayed');
}

// ✅ BOGO-INLINE-VARIANTS-044: Hide inline variant selection
function hideInlineVariantSelection(card) {
  const defaultState = card.querySelector('.card-default-state');
  const variantState = card.querySelector('.card-variant-state');
  const variantContainer = card.querySelector('.variant-selectors-inline');

  if (!defaultState || !variantState) return;

  // Animate back
  variantState.classList.remove('active');
  setTimeout(function() {
    defaultState.classList.add('active');

    // Clear variant selectors after animation completes
    if (variantContainer) {
      variantContainer.innerHTML = '';
    }
  }, 400);
}

// ✅ BOGO-INLINE-VARIANTS-059: Validate inline variant selection
function validateInlineVariantSelection(card) {
  const selects = card.querySelectorAll('.inline-variant-select');
  const addBtn = card.querySelector('.btn-add-variant');

  if (!addBtn) return false;

  let allSelected = true;
  selects.forEach(function(select) {
    if (!select.value || select.value === '') {
      allSelected = false;
    }
  });

  // Enable/disable add button
  addBtn.disabled = !allSelected;

  if (allSelected) {
    console.log('✅ All variants selected, enabling add button');
  }

  return allSelected;
}

// ✅ BOGO-INLINE-VARIANTS-059: Find matching variant based on selected options
function findMatchingVariantByOptions(productId, selectedOptions) {
  const variants = window.productVariants?.[productId];
  if (!variants || !Array.isArray(variants)) {
    console.error('No variants found for product:', productId);
    return null;
  }

  console.log('Finding variant for options:', selectedOptions);
  console.log('Available variants:', variants);

  // Find variant that matches all selected options
  const matchingVariant = variants.find(function(variant) {
    return selectedOptions.every(function(optionValue, index) {
      const variantOption = variant['option' + (index + 1)];
      return variantOption === optionValue;
    });
  });

  if (matchingVariant) {
    console.log('✅ Found matching variant:', matchingVariant);
  } else {
    console.warn('⚠️ No matching variant found, using first variant');
  }

  return matchingVariant || variants[0];
}

// ✅ BOGO-INLINE-VARIANTS-044: Add product with inline variant selection
// ✅ BOGO-INLINE-VARIANTS-059: Add product with inline variant selection
function addProductWithInlineVariant(card) {
  const productId = card.dataset.productId;
  const productTitle = card.dataset.productTitle;

  // Validate all options are selected
  if (!validateInlineVariantSelection(card)) {
    showNotification('⚠️ Please select all variant options', 'warning');
    return;
  }

  // Get selected variants
  const selects = card.querySelectorAll('.inline-variant-select');
  const selectedOptions = Array.from(selects).map(function(select) {
    return select.value;
  });

  console.log('Selected options:', selectedOptions);

  // Find matching variant
  const matchingVariant = findMatchingVariantByOptions(productId, selectedOptions);

  if (!matchingVariant) {
    showNotification('⚠️ Variant not available', 'warning');
    return;
  }

  // Get product image
  const productImage = card.querySelector('.product-image');
  let imageSrc = '';
  if (productImage) {
    imageSrc = productImage.src.split('?')[0];
  }

  // Use variant image if available
  if (matchingVariant.image) {
    imageSrc = matchingVariant.image;
  }

  // Build variant display title
  const variantDisplay = matchingVariant.title || selectedOptions.join(' / ');

  console.log('✅ Adding product with variant:', {
    productId,
    variantId: matchingVariant.id,
    title: productTitle + ' - ' + variantDisplay,
    price: matchingVariant.price
  });

  // Add to BOGO pair
  addProductToPair({
    productId: productId,
    variantId: matchingVariant.id,
    price: matchingVariant.price,
    title: productTitle + ' - ' + variantDisplay,
    image: imageSrc,
    element: card,
    variantTitle: variantDisplay
  });

  // Mark card as added and animate back
  card.classList.add('added');
  hideInlineVariantSelection(card);

  // Remove added class after animation
  setTimeout(function() {
    card.classList.remove('added');
  }, 2000);
}

function addProductToPair(productData) {
  console.log('📦 Adding product to pair:', productData);

  // ✅ CRITICAL FIX: Multi-priority image fallback system
  if (!productData.image || productData.image.includes('lightning') || productData.image === '') {
    console.warn('⚠️ Image missing or invalid, retrieving from element');

    // PRIORITY 1: Get from product card element (original image)
    if (productData.element) {
      const mainImage = productData.element.querySelector('.section-collections-with-nav__product-image img');
      if (mainImage) {
        productData.image = mainImage.src.split('?')[0]; // Clean URL
        console.log('✅ Image retrieved from card element:', productData.image);
      }
    }

    // PRIORITY 2: Get from modal if card fails
    if (!productData.image || productData.image === '') {
      const modal = document.querySelector('.buy-now-popup');
      if (modal) {
        const modalImage = modal.querySelector('figure img');
        if (modalImage) {
          productData.image = modalImage.src.split('?')[0];
          console.log('✅ Image retrieved from modal:', productData.image);
        }
      }
    }

    // PRIORITY 3: Get from data attribute if both fail
    if (!productData.image || productData.image === '') {
      if (productData.element && productData.element.dataset.image) {
        productData.image = productData.element.dataset.image.split('?')[0];
        console.log('✅ Image retrieved from data attribute:', productData.image);
      }
    }

    // FALLBACK: Use placeholder if all attempts fail
    if (!productData.image || productData.image === '') {
      console.error('❌ No image found for product, using placeholder');
      productData.image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd"/%3E%3C/svg%3E';
    }
  } else {
    console.log('✅ Valid image provided:', productData.image);
  }

  const state = window.bogoState;

  // Determine which slot to fill
  if (!state.currentPair.slot1) {
    // Fill first slot
    state.currentPair.slot1 = productData;
    highlightProduct(productData.element, 1, state.activePairNumber);
    showNotification(`${productData.title} added to Pair ${state.activePairNumber} (Slot 1) ✓`);
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

function highlightProduct(element, slotNumber, pairNumber) {
  // Add visual highlight class
  element.classList.add('product-selected');
  element.style.border = '3px solid #60c655';
  element.style.boxShadow = '0 0 20px rgba(96, 198, 85, 0.4)';

  // Create or get badge container in top-right corner
  let badgeContainer = element.querySelector('.pair-badge-container');
  if (!badgeContainer) {
    badgeContainer = document.createElement('div');
    badgeContainer.className = 'pair-badge-container';
    element.appendChild(badgeContainer);
  }

  // Create circular badge
  const badge = document.createElement('div');
  badge.className = 'pair-slot-badge';
  badge.setAttribute('data-pair', pairNumber);
  badge.innerHTML = `
    <span class="pair-badge-pair">Pair ${pairNumber}</span>
    <span class="pair-badge-slot">${slotNumber}/2</span>
  `;

  // Add click-to-remove handler
  badge.onclick = function(e) {
    e.stopPropagation();
    removePairSelection(element, pairNumber);
  };

  badgeContainer.appendChild(badge);
}

function removePairSelection(element, pairNumber) {
  // Find and animate out the badge
  const badge = element.querySelector(`.pair-slot-badge[data-pair="${pairNumber}"]`);
  if (badge) {
    badge.style.animation = 'badgePulse 300ms ease-in reverse';
    setTimeout(function() {
      badge.remove();

      // If no more badges, remove container and border
      const badgeContainer = element.querySelector('.pair-badge-container');
      if (badgeContainer && badgeContainer.children.length === 0) {
        badgeContainer.remove();
        element.classList.remove('product-selected');
        element.style.border = '';
        element.style.boxShadow = '';
      }
    }, 300);
  }

  // Update BOGO state
  const state = window.bogoState;
  const pairIndex = state.pairs.findIndex(function(p) { return p.pairNumber === pairNumber; });

  if (pairIndex !== -1) {
    const pair = state.pairs[pairIndex];

    // Remove pair from array
    state.pairs.splice(pairIndex, 1);

    // Check if either product still has other badges
    [pair.product1, pair.product2].forEach(function(product) {
      if (product && product.element) {
        const remainingBadges = product.element.querySelectorAll('.pair-slot-badge');
        if (remainingBadges.length === 1) { // Only the one being removed
          product.element.classList.remove('product-selected');
          product.element.style.border = '';
          product.element.style.boxShadow = '';
        }
      }
    });

    showNotification(`Pair ${pairNumber} removed`, 'info');
    updateStickyCart();
  }
}

function completePair() {
  const state = window.bogoState;
  const pair = state.currentPair;

  console.log('🎉 Completing pair:', pair);

  // ✅ CHECK TIER BEFORE COMPLETION
  const previousTier = getTierForCount(state.pairs.length);

  // Determine which is free (cheaper)
  const cheaper = pair.slot1.price <= pair.slot2.price ? pair.slot1 : pair.slot2;
  const moreExpensive = pair.slot1.price > pair.slot2.price ? pair.slot1 : pair.slot2;

  // Save completed pair
  state.pairs.push({
    product1: moreExpensive,
    product2: cheaper,
    savings: cheaper.price,
    pairNumber: state.activePairNumber
  });

  // ⚡ ELECTRIC CELEBRATION SEQUENCE
  celebratePairCompletion(pair.slot1.element, pair.slot2.element, state.activePairNumber);

  // Calculate tier discount
  const tierDiscount = getTierDiscount(state.pairs.length);
  const nextTierDiscount = getTierDiscount(state.pairs.length + 1);

  // Show tier message
  let tierMessage = `🎉 Pair ${state.activePairNumber} Complete! ${cheaper.title} is FREE!`;
  if (nextTierDiscount > tierDiscount) {
    tierMessage += ` Add another pair and save ${nextTierDiscount}% on entire order!`;
  }

  showNotification(tierMessage, 'success');

  // ✅ CHECK IF TIER UNLOCKED - TRIGGER CELEBRATION
  const newTier = getTierForCount(state.pairs.length);
  if (newTier > previousTier && newTier >= 2) {
    console.log(`🎯 Tier ${newTier} unlocked!`);
    setTimeout(() => {
      if (window.tierCelebrations) {
        window.tierCelebrations.celebrate(newTier);
      }
    }, 800);
  }

  // Reset for next pair
  state.currentPair = { slot1: null, slot2: null };
  state.activePairNumber++;

  // Update UI
  updateStickyCart();
}

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

function getTierDiscount(pairCount) {
  if (pairCount >= 3) return 10;
  if (pairCount >= 2) return 5;
  return 0;
}

// ========================================
// SIMPLE WORKING STICKY CART UPDATE
// STICKY-CART-SHOW-FIRST-PRODUCT-077
// ========================================
function updateStickyCart() {
  const state = window.bogoState;
  const stickyCart = document.querySelector('.bogo-sticky-cart');

  if (!stickyCart) return;

  // Count total products added (including incomplete pairs)
  const pairCount = state?.pairs?.length || 0;
  const currentPair = state?.currentPair;
  const hasIncompleteProduct = currentPair?.slot1 && !currentPair?.slot2;

  console.log('Updating sticky cart:', {
    completePairs: pairCount,
    hasIncompleteProduct: hasIncompleteProduct
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
  // UPDATE PROGRESS BAR (BOGO-PROGRESS-004)
  // ========================================
  const progressFill = document.getElementById('bogo-progress-fill');
  const milestones = document.querySelectorAll('.bogo-milestone');

  if (progressFill && milestones.length > 0) {
    // Calculate progress percentage
    let progressPercent = 0;

    if (pairCount >= 3) {
      progressPercent = 100; // Tier 3: Complete
    } else if (pairCount === 2) {
      progressPercent = 66; // Tier 2: 2/3 progress
    } else if (pairCount === 1) {
      progressPercent = 33; // Tier 1: 1/3 progress
    } else {
      progressPercent = 0; // No pairs
    }

    // Update progress fill width
    progressFill.style.width = progressPercent + '%';

    // Update milestone active states
    milestones.forEach((milestone, index) => {
      const tier = index + 1; // Tier 1, 2, 3

      if (pairCount >= tier) {
        milestone.classList.add('active');
      } else {
        milestone.classList.remove('active');
      }
    });

    console.log('Progress bar updated:', {
      pairCount: pairCount,
      progress: progressPercent + '%'
    });
  }

  // Update status message with quantified benefits (BOGO-SAVINGS-003)
  const statusEl = document.getElementById('sticky-cart-status');
  if (statusEl) {
    if (hasIncompleteProduct) {
      statusEl.textContent = 'Select 1 more product to complete pair';
    } else if (pairCount === 0) {
      statusEl.textContent = 'Select 2 products to start';
    } else if (pairCount === 1) {
      // Tier 1 → Tier 2 upsell
      statusEl.textContent = 'Add 1 more pair: Unlock 5% OFF + FREE Premium Shipping (€4.99 value)!';
    } else if (pairCount === 2) {
      // Tier 2 → Tier 3 upsell
      statusEl.textContent = 'Add 1 more pair: Get 10% OFF + FREE Titan Cable (€18.95 value)!';
    } else {
      // Tier 3 achieved
      statusEl.textContent = '🏆 Maximum savings unlocked! FREE cable included.';
    }
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
}

// ✅ BOGO-STICKY-COMPACT-047: No fade edges needed in compact design

function createPairCard(pair, isComplete) {
  const card = document.createElement('div');
  card.className = 'bogo-sticky-pair-card';

  // ✅ Add data-pair-number attribute for mobile CSS ::before badge
  card.setAttribute('data-pair-number', pair.pairNumber);

  // ✅ Label ABOVE thumbnails
  const label = document.createElement('div');
  label.className = 'bogo-sticky-pair-label';
  label.textContent = `Pair ${pair.pairNumber}`;
  card.appendChild(label);

  const thumbnails = document.createElement('div');
  thumbnails.className = 'bogo-sticky-pair-thumbnails';

  // Slot 1
  const thumb1 = document.createElement('div');
  thumb1.className = 'bogo-sticky-pair-thumbnail';
  if (pair.product1) {
    const img1 = document.createElement('img');
    img1.src = pair.product1.image;
    img1.alt = pair.product1.title;
    img1.onerror = function() {
      console.error('Failed to load image:', this.src);
      this.src = ''; // Fallback
    };
    thumb1.appendChild(img1);
  } else {
    thumb1.classList.add('empty');
  }
  thumbnails.appendChild(thumb1);

  // Slot 2
  const thumb2 = document.createElement('div');
  thumb2.className = 'bogo-sticky-pair-thumbnail';
  if (pair.product2) {
    const img2 = document.createElement('img');
    img2.src = pair.product2.image;
    img2.alt = pair.product2.title;
    img2.onerror = function() {
      console.error('Failed to load image:', this.src);
      this.src = '';
    };
    thumb2.appendChild(img2);
  } else {
    thumb2.classList.add('empty');
  }
  thumbnails.appendChild(thumb2);

  card.appendChild(thumbnails);

  // ✅ Only show total savings, NOT individual prices
  if (isComplete && pair.savings) {
    const savings = document.createElement('div');
    savings.className = 'bogo-sticky-pair-savings';
    savings.textContent = `Save €${(pair.savings / 100).toFixed(2)}`;
    card.appendChild(savings);
  }

  // ✅ ADD DELETE BUTTON (Fix #3)
  if (isComplete) {
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bogo-sticky-pair-delete';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = `Delete Pair ${pair.pairNumber}`;
    deleteBtn.onclick = function(e) {
      e.stopPropagation();
      deletePairFromSticky(pair.pairNumber);
    };
    card.appendChild(deleteBtn);
  }

  return card;
}

// ===========================================
// PAIR MANAGEMENT MODAL FUNCTIONS
// ===========================================

let draggedElement = null;
let draggedData = null;

function openPairModal() {
  console.log('📦 Opening pair management modal');

  const modal = document.getElementById('pair-management-modal');
  if (!modal) {
    console.error('Pair modal not found');
    return;
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Show modal
  modal.classList.add('active');

  // Render pairs
  renderPairModal();

  // Setup overlay click to close
  const overlay = modal.querySelector('.pair-modal__overlay');
  overlay.onclick = closePairModal;

  // Setup ESC key
  document.addEventListener('keydown', handleModalEscape);

  // ✅ BOGO-REVIEW-FIXES-040: Setup Compare Tiers button
  setTimeout(function() {
    setupCompareTiersButton();
  }, 100);

  // ✅ BOGO-CHECKOUT-FINAL-061: Setup modal checkout button
  const modalCheckoutBtn = document.getElementById('modal-checkout-btn');
  if (modalCheckoutBtn) {
    modalCheckoutBtn.onclick = function() {
      console.log('Modal checkout clicked');
      closePairModal();
      proceedToCheckout();
    };
  }
}

function closePairModal() {
  console.log('📦 Closing pair management modal');

  const modal = document.getElementById('pair-management-modal');
  if (modal) {
    modal.classList.remove('active');
  }

  // Restore body scroll
  document.body.style.overflow = '';

  // Remove ESC listener
  document.removeEventListener('keydown', handleModalEscape);
}

function handleModalEscape(e) {
  if (e.key === 'Escape') {
    closePairModal();
  }
}

// ✅ BOGO-PARTITIONED-PRICING-048: Calculate and update partitioned pricing display
function updatePartitionedPricing() {
  const state = window.bogoState;
  const pairCount = state.pairs.length;

  // Calculate retail value (full price of all items)
  let retailValue = 0;
  state.pairs.forEach(function(pair) {
    if (pair.product1) retailValue += pair.product1.price;
    if (pair.product2) retailValue += pair.product2.price;
  });

  // Calculate BOGO discount (50% of retail since every other item is free)
  const bogoDiscount = retailValue * 0.5;

  // Calculate tier discount
  const tierPercent = pairCount >= 3 ? 0.10 : pairCount >= 2 ? 0.05 : 0;
  const subtotalAfterBogo = retailValue - bogoDiscount;
  const tierDiscount = subtotalAfterBogo * tierPercent;

  // Shipping savings
  const shippingSavings = pairCount >= 2 ? 499 : 0; // €4.99 in cents

  // Bonus cable value
  const cableSavings = pairCount >= 3 ? 1895 : 0; // €18.95 in cents

  // Total savings
  const totalSavings = bogoDiscount + tierDiscount + shippingSavings + cableSavings;

  // Final amount to pay
  const finalAmount = retailValue - totalSavings;

  // Savings percentage
  const savingsPercent = retailValue > 0 ? Math.round((totalSavings / retailValue) * 100) : 0;

  // Update DOM
  const retailValueEl = document.getElementById('retail-value-total');
  const bogoDiscountEl = document.getElementById('bogo-discount');
  const tierDiscountEl = document.getElementById('tier-discount');
  const finalAmountEl = document.getElementById('final-amount');
  const savingsPercentageEl = document.getElementById('savings-percentage');

  if (retailValueEl) retailValueEl.textContent = `€${(retailValue / 100).toFixed(2)}`;
  if (bogoDiscountEl) bogoDiscountEl.textContent = `-€${(bogoDiscount / 100).toFixed(2)}`;
  if (tierDiscountEl) tierDiscountEl.textContent = `-€${(tierDiscount / 100).toFixed(2)}`;
  if (finalAmountEl) finalAmountEl.textContent = `€${(finalAmount / 100).toFixed(2)}`;
  if (savingsPercentageEl) savingsPercentageEl.textContent = `🎉 You Save ${savingsPercent}%!`;

  // Show/hide tier discount row based on tier
  const tierRow = document.querySelector('.tier-discount-row');
  const tierLabel = document.getElementById('tier-discount-label');
  if (tierRow) {
    if (pairCount >= 2) {
      tierRow.style.display = 'flex';
      if (tierLabel) {
        if (pairCount >= 3) {
          tierLabel.innerHTML = '<span class="discount-icon">👑</span> Tier 3 Bonus (10% OFF):';
        } else {
          tierLabel.innerHTML = '<span class="discount-icon">⭐</span> Tier 2 Bonus (5% OFF):';
        }
      }
    } else {
      tierRow.style.display = 'none';
    }
  }

  // Show/hide shipping row
  const shippingRow = document.querySelector('.shipping-row');
  if (shippingRow) {
    shippingRow.style.display = pairCount >= 2 ? 'flex' : 'none';
  }

  // Show/hide cable row
  const cableRow = document.querySelector('.cable-row');
  if (cableRow) {
    cableRow.style.display = pairCount >= 3 ? 'flex' : 'none';
  }

  console.log('💰 Partitioned Pricing Updated:', {
    retailValue: retailValue / 100,
    bogoDiscount: bogoDiscount / 100,
    tierDiscount: tierDiscount / 100,
    finalAmount: finalAmount / 100,
    savingsPercent
  });
}

function renderPairModal() {
  console.log('🎨 Rendering pair modal');

  const state = window.bogoState;
  const pairsGrid = document.getElementById('modal-pairs-grid');
  const checkoutCountEl = document.getElementById('modal-checkout-count');

  if (!pairsGrid) return;

  // Clear existing pairs
  pairsGrid.innerHTML = '';

  // Calculate totals
  const pairCount = state.pairs.length;
  checkoutCountEl.textContent = pairCount;

  // ✅ BOGO-PARTITIONED-PRICING-048: Update partitioned pricing
  updatePartitionedPricing();

  // ✅ Update segmented progress bar
  updateReviewProgressBar(pairCount);

  // Render each pair
  state.pairs.forEach(function(pair, index) {
    const pairCard = createModalPairCard(pair, index);
    pairsGrid.appendChild(pairCard);
  });

  // Add empty message if no pairs
  if (pairCount === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.style.cssText = `
      text-align: center;
      padding: 64px 32px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 18px;
    `;
    emptyMessage.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 16px;">🛒</div>
      <div style="font-weight: 600; margin-bottom: 8px;">No pairs created yet</div>
      <div style="font-size: 14px;">Start building your BOGO pairs to see them here!</div>
    `;
    pairsGrid.appendChild(emptyMessage);
  }
}

// ✅ NEW: Update segmented progress bar based on pair count
// ✅ BOGO-REVIEW-FIXES-040: Enhanced progress bar with savings display
function updateReviewProgressBar(pairCount) {
  console.log('📊 BOGO-REVIEW-FIXES-040: Updating progress bar:', pairCount, 'pairs');

  const segments = document.querySelectorAll('.progress-segment');
  const currentStatus = document.getElementById('progress-current-status');
  const nextBenefit = document.getElementById('progress-next-benefit');

  if (!segments.length) {
    console.warn('⚠️ Progress segments not found');
  }

  if (!currentStatus || !nextBenefit) {
    console.warn('⚠️ Status elements not found');
  }

  // ✅ UPDATE HEADER SAVINGS AND PAIR COUNT
  updateReviewHeaderSavings();

  // Reset all segments
  segments.forEach(function(segment) {
    segment.classList.remove('filled', 'partial');
  });

  // ✅ FILL SEGMENTS BASED ON PAIR COUNT
  if (pairCount >= 1) {
    segments[0]?.classList.add('filled');
    console.log('✅ Tier 1 segment filled');
  }

  if (pairCount >= 2) {
    segments[1]?.classList.add('filled');
    console.log('✅ Tier 2 segment filled');
  } else if (pairCount === 1) {
    segments[1]?.classList.add('partial');
    console.log('⏳ Tier 2 segment partial');
  }

  if (pairCount >= 3) {
    segments[2]?.classList.add('filled');
    console.log('✅ Tier 3 segment filled');
  } else if (pairCount === 2) {
    segments[2]?.classList.add('partial');
    console.log('⏳ Tier 3 segment partial');
  }

  // ✅ UPDATE STATUS TEXT
  if (currentStatus && nextBenefit) {
    if (pairCount === 0) {
      currentStatus.textContent = 'No pairs yet';
      nextBenefit.textContent = 'Build 1 pair to start saving!';
    } else if (pairCount === 1) {
      currentStatus.textContent = '✅ Tier 1 Activated - BOGO Savings';
      nextBenefit.textContent = '⭐ Add 1 more pair → FREE Premium Shipping + 5% OFF';
    } else if (pairCount === 2) {
      currentStatus.textContent = '⭐ Tier 2 Activated - 5% OFF + FREE Shipping';
      nextBenefit.textContent = '👑 Add 1 more pair → Extra 5% + FREE €18.95 Cable';
    } else {
      currentStatus.textContent = '👑 Tier 3 UNLOCKED - Maximum Savings!';
      nextBenefit.textContent = '10% OFF + Premium Shipping + Bonus Cable';
    }
  }

  console.log('✅ Progress bar update complete');
}

// ✅ NEW: Update header savings display
function updateReviewHeaderSavings() {
  const state = window.bogoState;
  const pairCount = state.pairs.length;

  // Update pair count
  const pairCountEl = document.getElementById('review-pair-count');
  if (pairCountEl) {
    pairCountEl.textContent = `${pairCount} ${pairCount === 1 ? 'Pair' : 'Pairs'} Complete`;
  }

  // Calculate total savings
  let totalSavings = 0;

  // Add BOGO savings (one free item per pair)
  state.pairs.forEach(function(pair) {
    const freePrice = Math.min(
      pair.product1?.price || 0,
      pair.product2?.price || 0
    );
    totalSavings += freePrice;
  });

  // Add tier discount savings
  const tierPercent = pairCount >= 3 ? 0.10 : pairCount >= 2 ? 0.05 : 0;

  const subtotal = state.pairs.reduce(function(sum, pair) {
    return sum + (pair.product1?.price || 0) + (pair.product2?.price || 0);
  }, 0);

  const tierSavings = subtotal * tierPercent;
  totalSavings += tierSavings;

  // Add shipping savings
  if (pairCount >= 2) {
    totalSavings += 499; // €4.99 in cents
  }

  // Add bonus cable value
  if (pairCount >= 3) {
    totalSavings += 1895; // €18.95 in cents
  }

  // Update displays
  const savedEl = document.getElementById('review-total-saved');
  if (savedEl) {
    savedEl.textContent = `€${(totalSavings / 100).toFixed(2)}`;
  }

  const discountEl = document.getElementById('review-order-discount');
  if (discountEl) {
    const discountPercent = (tierPercent * 100).toFixed(0);
    discountEl.textContent = `${discountPercent}%`;
  }

  console.log(`💰 Total savings: €${(totalSavings / 100).toFixed(2)}, Discount: ${tierPercent * 100}%`);
}

// ✅ NEW: Open comparison modal from review modal
function openComparisonFromReview() {
  console.log('🔄 Opening comparison modal from review');

  const pairModal = document.getElementById('pair-management-modal');
  const comparisonModal = document.getElementById('tier-comparison-modal');

  if (!comparisonModal) {
    console.error('Comparison modal not found');
    return;
  }

  // Lower the z-index of review modal (keep it visible in background)
  if (pairModal) {
    pairModal.style.zIndex = '9999';
  }

  // Show comparison modal on top
  comparisonModal.classList.add('active');
  comparisonModal.style.zIndex = '10001';

  // Setup close handler to restore review modal z-index
  const closeBtn = comparisonModal.querySelector('.comparison-close');
  const overlay = comparisonModal.querySelector('.comparison-overlay');

  const closeComparison = function() {
    comparisonModal.classList.remove('active');

    // Restore review modal z-index
    if (pairModal) {
      pairModal.style.zIndex = '10000';
    }
  };

  if (closeBtn) {
    closeBtn.onclick = closeComparison;
  }

  if (overlay) {
    overlay.onclick = closeComparison;
  }
}

// ✅ BOGO-REVIEW-FIXES-040: Setup Compare Tiers button event listener
function setupCompareTiersButton() {
  console.log('🔧 Setting up Compare Tiers button');

  const compareBtn = document.getElementById('btn-compare-tiers');

  if (!compareBtn) {
    console.warn('⚠️ Compare Tiers button not found');
    return;
  }

  if (compareBtn.dataset.listenerAdded === 'true') {
    console.log('ℹ️ Compare button already has listener');
    return;
  }

  console.log('✅ Adding click listener to Compare Tiers button');

  compareBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log('🔵 Compare Tiers button clicked');
    openComparisonFromReview();
  });

  compareBtn.dataset.listenerAdded = 'true';
}

function createModalPairCard(pair, index) {
  const card = document.createElement('div');
  card.className = 'pair-modal__pair-card';
  card.setAttribute('data-pair-index', index);

  // Header
  const header = document.createElement('div');
  header.className = 'pair-modal__pair-header';
  header.innerHTML = `
    <span class="pair-modal__pair-title">Pair ${pair.pairNumber}</span>
    <span class="pair-modal__pair-savings">Save €${(pair.savings / 100).toFixed(2)}</span>
    <button class="pair-modal__pair-delete" onclick="deletePair(${index})">Delete Pair</button>
  `;
  card.appendChild(header);

  // Products
  const products = document.createElement('div');
  products.className = 'pair-modal__pair-products';

  // Product 1
  const product1 = createModalProductCard(pair.product1, index, 1, false);
  products.appendChild(product1);

  // ✅ Equals sign (static, no swapping)
  const equals = document.createElement('div');
  equals.className = 'pair-modal__equals-sign';
  equals.textContent = '=';
  equals.style.cssText = `
    font-size: 32px;
    color: rgba(255, 255, 255, 0.3);
    user-select: none;
  `;
  products.appendChild(equals);

  // Product 2 (the free one)
  const product2 = createModalProductCard(pair.product2, index, 2, true);
  products.appendChild(product2);

  card.appendChild(products);

  return card;
}

function createModalProductCard(product, pairIndex, slot, isFree) {
  const card = document.createElement('div');
  card.className = 'pair-modal__product';
  card.setAttribute('data-pair-index', pairIndex);
  card.setAttribute('data-slot', slot);
  card.setAttribute('data-product-id', product.productId);

  // Image
  const img = document.createElement('img');
  img.className = 'pair-modal__product-image';
  img.src = product.image;
  img.alt = product.title;
  card.appendChild(img);

  // Free badge
  if (isFree) {
    const badge = document.createElement('div');
    badge.className = 'pair-modal__product-badge';
    badge.textContent = 'FREE';
    card.appendChild(badge);
  }

  // Title
  const title = document.createElement('div');
  title.className = 'pair-modal__product-title';
  title.textContent = product.title;
  card.appendChild(title);

  // Price
  const price = document.createElement('div');
  price.className = 'pair-modal__product-price';
  price.textContent = `€${(product.price / 100).toFixed(2)}`;
  if (isFree) {
    price.style.textDecoration = 'line-through';
    price.style.opacity = '0.6';
  }
  card.appendChild(price);

  return card;
}

// ✅ FIX 6: Unhighlight product when pair is deleted
function unhighlightProduct(element, pairNumber) {
  if (!element) return;

  console.log('🔄 Unhighlighting product for pair:', pairNumber);

  // Remove specific pair badge
  const badge = element.querySelector(`.pair-slot-badge[data-pair="${pairNumber}"]`);
  if (badge) {
    badge.remove();
  }

  // Remove badge container if empty
  const badgeContainer = element.querySelector('.pair-badge-container');
  if (badgeContainer && badgeContainer.children.length === 0) {
    badgeContainer.remove();
  }

  // Check if product still has other badges
  const remainingBadges = element.querySelectorAll('.pair-slot-badge');
  if (remainingBadges.length === 0) {
    // No more pairs - remove all selection styling
    element.classList.remove('product-selected');
    element.style.border = '';
    element.style.boxShadow = '';
    console.log('✅ Product fully unselected');
  } else {
    console.log('⚠️ Product still in other pairs:', remainingBadges.length);
  }
}

// ✅ DELETE PAIR FROM STICKY CART (Fix #3)
function deletePairFromSticky(pairNumber) {
  console.log(`🗑️ Deleting Pair ${pairNumber} from sticky cart`);

  const state = window.bogoState;

  // Find pair by pairNumber
  const pairIndex = state.pairs.findIndex(p => p.pairNumber === pairNumber);

  if (pairIndex === -1) {
    console.error('Pair not found:', pairNumber);
    return;
  }

  const pair = state.pairs[pairIndex];

  // ✅ Remove visual highlights from products
  if (pair.product1 && pair.product1.element) {
    unhighlightProduct(pair.product1.element, pairNumber);
  }

  if (pair.product2 && pair.product2.element) {
    unhighlightProduct(pair.product2.element, pairNumber);
  }

  // Remove pair from state
  state.pairs.splice(pairIndex, 1);

  // Renumber remaining pairs
  state.pairs.forEach((p, index) => {
    const oldNumber = p.pairNumber;
    p.pairNumber = index + 1;

    // Update badges on products
    if (p.product1 && p.product1.element) {
      updatePairBadgeNumber(p.product1.element, oldNumber, p.pairNumber);
    }
    if (p.product2 && p.product2.element) {
      updatePairBadgeNumber(p.product2.element, oldNumber, p.pairNumber);
    }
  });

  // Update next pair number
  state.activePairNumber = state.pairs.length + 1;

  // Update UI
  updateStickyCart();

  // Show notification
  showNotification(`Pair ${pairNumber} removed`);

  console.log('✅ Pair deleted, state updated');
}

// ✅ ENHANCED: Update pair badge with correct pair number
function updatePairBadgeNumber(element, oldNumber, newNumber) {
  if (!element) return;

  console.log(`🔄 Updating badge: Pair ${oldNumber} → ${newNumber}`);

  const badgeContainer = element.querySelector('.pair-badge-container');
  if (!badgeContainer) {
    console.warn('No badge container found on element');
    return;
  }

  const oldBadge = badgeContainer.querySelector(`[data-pair="${oldNumber}"]`);
  if (oldBadge) {
    // ✅ Update badge data attribute
    oldBadge.setAttribute('data-pair', newNumber);

    // ✅ Update pair number text
    const pairLabel = oldBadge.querySelector('.pair-badge-pair');
    if (pairLabel) {
      pairLabel.textContent = `Pair ${newNumber}`;
    }

    // ✅ Update slot text (format: "X/2")
    const slotText = oldBadge.querySelector('.pair-badge-slot');
    if (slotText) {
      // Extract the slot number (1 or 2) from current text
      const currentText = slotText.textContent;
      const slotMatch = currentText.match(/(\d+)\/2/);
      if (slotMatch) {
        const slotNumber = slotMatch[1];
        slotText.textContent = `${slotNumber}/2`; // Keep slot number, always /2
      }
    }

    console.log(`✅ Badge updated: Pair ${newNumber}`);
  } else {
    console.warn(`Badge for pair ${oldNumber} not found`);
  }
}

function deletePair(pairIndex) {
  console.log('🗑️ Deleting pair:', pairIndex);

  const state = window.bogoState;
  const pair = state.pairs[pairIndex];

  if (!pair) {
    console.error('Pair not found');
    return;
  }

  // Confirm deletion
  if (!confirm(`Delete Pair ${pair.pairNumber}? This will remove both products from this pair.`)) {
    return;
  }

  // ✅ FIX 6: Unhighlight both products using dedicated function
  unhighlightProduct(pair.product1?.element, pair.pairNumber);
  unhighlightProduct(pair.product2?.element, pair.pairNumber);

  // Remove from state
  state.pairs.splice(pairIndex, 1);

  // Re-render
  renderPairModal();
  updateStickyCart();

  showNotification(`Pair ${pair.pairNumber} deleted`, 'info');
}

// ✅ BOGO-INLINE-VARIANTS-044: Initialize inline variant controls
function initInlineVariantControls() {
  // Add event listeners to all product cards
  document.querySelectorAll('.product-card').forEach(function(card) {
    const variantCloseBtn = card.querySelector('.variant-close-btn');
    const addBtn = card.querySelector('.btn-add-variant');

    // Close button - return to default state
    if (variantCloseBtn) {
      variantCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        hideInlineVariantSelection(card);
      });
    }

    // Add to pair button
    if (addBtn) {
      addBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        addProductWithInlineVariant(card);
      });
    }
  });

  console.log('✅ Inline variant controls initialized');
}

// ✅ BOGO-STOCK-SCARCITY-045: Stock scarcity system
function initializeStockLevels() {
  const products = document.querySelectorAll('.product-card');

  products.forEach(function(card, index) {
    // Vary stock levels: some high, some low
    let stockLevel;
    if (index % 3 === 0) {
      // Low stock products (create urgency)
      stockLevel = Math.floor(Math.random() * 11) + 10; // 10-20
    } else {
      // Higher stock products
      stockLevel = Math.floor(Math.random() * 20) + 75; // 75-94
    }

    card.dataset.stockLevel = stockLevel;
    updateStockDisplay(card);
  });

  // Decrease stock randomly every 5 seconds
  setInterval(decreaseRandomStock, 5000);

  console.log('✅ Stock levels initialized');
}

function updateStockDisplay(card) {
  let stockBadge = card.querySelector('.stock-badge');

  if (!stockBadge) {
    stockBadge = document.createElement('div');
    stockBadge.className = 'stock-badge';
    const imageContainer = card.querySelector('.product-image-container');
    if (imageContainer) {
      imageContainer.appendChild(stockBadge);
    }
  }

  const stockLevel = parseInt(card.dataset.stockLevel);
  const isLow = stockLevel <= 20;

  stockBadge.className = 'stock-badge' + (isLow ? ' low-stock' : '');
  stockBadge.innerHTML = '⚡ <span class="stock-number">' + stockLevel + '</span> left';

  // Animate number change
  stockBadge.classList.add('updating');
  setTimeout(function() {
    stockBadge.classList.remove('updating');
  }, 400);
}

function decreaseRandomStock() {
  const products = Array.from(document.querySelectorAll('.product-card'));

  // Pick 1-3 random products to decrease
  const numToDecrease = Math.floor(Math.random() * 3) + 1;
  const shuffled = products.sort(function() { return 0.5 - Math.random(); });
  const selected = shuffled.slice(0, numToDecrease);

  selected.forEach(function(card) {
    const currentStock = parseInt(card.dataset.stockLevel);

    // Don't decrease below 5
    if (currentStock > 5) {
      const decrease = Math.floor(Math.random() * 2) + 1; // 1-2
      card.dataset.stockLevel = Math.max(5, currentStock - decrease);
      updateStockDisplay(card);
    }
  });
}

function addStockDisclaimer() {
  const heroSection = document.querySelector('.bogo-hero-2024');
  if (!heroSection) return;

  const disclaimer = document.createElement('div');
  disclaimer.className = 'stock-disclaimer';
  disclaimer.innerHTML = '⚠️ Limited stock available for this offer';
  heroSection.insertBefore(disclaimer, heroSection.firstChild);

  console.log('✅ Stock disclaimer added');
}

// Wire up "Review Pairs" button
document.addEventListener('DOMContentLoaded', function() {
  const reviewBtn = document.getElementById('sticky-cart-review');
  if (reviewBtn) {
    reviewBtn.onclick = openPairModal;
  }

  // ✅ BOGO-INLINE-VARIANTS-044: Initialize inline variant controls
  initInlineVariantControls();

  // ✅ BOGO-STOCK-SCARCITY-045: Initialize stock scarcity system
  addStockDisclaimer();
  initializeStockLevels();

  // ✅ Mobile Carousel Functionality
  const tierCardsContainer = document.querySelector('.tier-cards-container');
  const carouselDots = document.querySelectorAll('.carousel-dot');

  if (tierCardsContainer && carouselDots.length > 0) {
    // Update active dot based on scroll position
    let scrollTimeout;
    tierCardsContainer.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = tierCardsContainer.scrollLeft;
        const cardWidth = tierCardsContainer.querySelector('.tier-card')?.offsetWidth || 0;
        const gap = 16; // gap between cards
        const currentIndex = Math.round(scrollLeft / (cardWidth + gap));

        carouselDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }, 100); // Debounce for 100ms
    });

    // Dot click handlers
    carouselDots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        const tierCards = tierCardsContainer.querySelectorAll('.tier-card');
        if (tierCards[index]) {
          tierCards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      });
    });
  }
});

// Make functions globally accessible
window.openPairModal = openPairModal;
window.closePairModal = closePairModal;
window.deletePair = deletePair;

function openVariantSelectionModal(productElement) {
  // Open modal for variant selection
  const infoIcon = productElement.querySelector('.product-info-icon');
  if (infoIcon) {
    openProductInfoModal({ stopPropagation: () => {}, preventDefault: () => {} }, infoIcon);
  }
}

// ✅ Helper: Extract bullet points from description
function extractBulletPoints(description) {
  if (!description) return [];

  // Split by common bullet point indicators
  let bullets = description
    .split(/\n|•|・|·|‣/)
    .map(function(b) { return b.trim(); })
    .filter(function(b) { return b.length > 10; }); // Only meaningful content

  // If no clear bullets, split by periods
  if (bullets.length <= 1) {
    bullets = description
      .split(/\.\s+/)
      .map(function(s) { return s.trim(); })
      .filter(function(s) { return s.length > 20; });
  }

  return bullets.slice(0, 8); // Max 8 bullets
}

// ✅ Helper: Create scrollable description section
// ✅ BOGO-MODAL-ENHANCE-041: Removed createDescriptionSection function (Product Details section removed)

// ✅ BOGO-MODAL-ENHANCE-041: Image carousel functionality
function setupImageCarousel(modal, productId) {
  try {
    const figure = modal.querySelector('figure');
    if (!figure || figure.dataset.carouselSetup === 'true') {
      return; // Already setup or not found
    }

    // Get all product images (main + variants, max 5)
    const images = getProductImages(productId, modal);

    if (images.length <= 1) {
      // Only one image, no carousel needed
      return;
    }

    // Mark as setup
    figure.dataset.carouselSetup = 'true';

    // Create carousel structure
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    // Create images container
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'carousel-images';

    images.forEach(function(imgSrc, index) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = 'Product image';
      img.className = 'carousel-image';
      if (index === 0) img.classList.add('active');
      imagesContainer.appendChild(img);
    });

    // Create navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous image');

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next image');

    // Create dots indicator
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';

    images.forEach(function(_, index) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to image ${index + 1}`);
      dotsContainer.appendChild(dot);
    });

    // ✅ BOGO-MODAL-REDESIGN-049: Create thumbnail images
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'carousel-thumbnails';

    images.forEach(function(imgSrc, index) {
      const thumbnail = document.createElement('button');
      thumbnail.className = 'carousel-thumbnail';
      if (index === 0) thumbnail.classList.add('active');
      thumbnail.setAttribute('aria-label', `View image ${index + 1}`);

      const thumbImg = document.createElement('img');
      thumbImg.src = imgSrc;
      thumbImg.alt = `Product view ${index + 1}`;

      thumbnail.appendChild(thumbImg);
      thumbnailsContainer.appendChild(thumbnail);
    });

    // Replace figure content with carousel
    figure.innerHTML = '';
    figure.appendChild(prevBtn);
    figure.appendChild(imagesContainer);
    figure.appendChild(nextBtn);
    figure.appendChild(dotsContainer);
    figure.appendChild(thumbnailsContainer); // ✅ Add thumbnails

    // Initialize carousel state
    let currentIndex = 0;

    function showImage(index) {
      // Wrap around
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;

      currentIndex = index;

      // Update images
      const allImages = figure.querySelectorAll('.carousel-image');
      allImages.forEach(function(img, i) {
        img.classList.toggle('active', i === currentIndex);
      });

      // Update dots
      const allDots = figure.querySelectorAll('.carousel-dot');
      allDots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });

      // ✅ BOGO-MODAL-REDESIGN-049: Update thumbnails
      const allThumbnails = figure.querySelectorAll('.carousel-thumbnail');
      allThumbnails.forEach(function(thumb, i) {
        thumb.classList.toggle('active', i === currentIndex);
      });
    }

    // Navigation handlers
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    // Dots click
    const dots = figure.querySelectorAll('.carousel-dot');
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showImage(index);
      });
    });

    // ✅ BOGO-MODAL-REDESIGN-049: Thumbnail click
    const thumbnails = figure.querySelectorAll('.carousel-thumbnail');
    thumbnails.forEach(function(thumbnail, index) {
      thumbnail.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showImage(index);
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    figure.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    figure.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next image
        showImage(currentIndex + 1);
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous image
        showImage(currentIndex - 1);
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showImage(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showImage(currentIndex + 1);
      }
    });

    console.log(`✅ Carousel setup with ${images.length} images`);
  } catch (error) {
    console.error('❌ Error setting up carousel:', error);
  }
}

// ✅ BOGO-MODAL-ENHANCE-041: Get product images (main + variants, max 5)
function getProductImages(productId, modal) {
  const images = [];

  // Get main image from modal
  const mainImg = modal.querySelector('.js-variant-image');
  if (mainImg && mainImg.src) {
    const cleanSrc = mainImg.src.split('?')[0];
    if (!images.includes(cleanSrc)) {
      images.push(cleanSrc);
    }
  }

  // Get variant images from window.productVariants if available
  if (window.productVariants && window.productVariants[productId]) {
    const variants = window.productVariants[productId];
    variants.forEach(function(variant) {
      if (variant.image && images.length < 5) {
        const cleanSrc = variant.image.split('?')[0];
        if (!images.includes(cleanSrc)) {
          images.push(cleanSrc);
        }
      }
    });
  }

  // Limit to 5 images max
  return images.slice(0, 5);
}

// ✅ Helper: Get product reviews (dummy data for demo)
function getProductReviews(productId) {
  // DUMMY DATA for demo (replace with real Shopify reviews)
  return [
    {
      author: 'Sarah M.',
      rating: 5,
      date: '2024-11-10',
      title: 'Perfect for travel!',
      content: 'This cable is exactly what I needed. The braided design is super durable and the fast charging works great with my laptop.'
    },
    {
      author: 'James K.',
      rating: 5,
      date: '2024-11-08',
      title: 'Worth every penny',
      content: 'High quality cable, charges my phone incredibly fast. The right-angle connector is perfect for gaming while charging.'
    },
    {
      author: 'Emma L.',
      rating: 4,
      date: '2024-11-05',
      title: 'Great quality',
      content: 'Really solid cable. Only wish it came in more color options, but the quality is outstanding.'
    },
    {
      author: 'Michael R.',
      rating: 5,
      date: '2024-11-02',
      title: 'Best cable I have owned',
      content: 'After going through cheap cables that break in weeks, this one is built to last. 100W charging is a game changer.'
    }
  ];
}

// ✅ Helper: Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ✅ Helper: Create review card
function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';

  // Review header
  const reviewHeader = document.createElement('div');
  reviewHeader.className = 'review-header';

  const author = document.createElement('div');
  author.className = 'review-author';
  author.textContent = review.author;

  const stars = document.createElement('div');
  stars.className = 'review-stars';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = i <= review.rating ? 'star filled' : 'star';
    star.textContent = '★';
    stars.appendChild(star);
  }

  const date = document.createElement('div');
  date.className = 'review-date';
  date.textContent = formatDate(review.date);

  reviewHeader.appendChild(author);
  reviewHeader.appendChild(stars);
  reviewHeader.appendChild(date);
  card.appendChild(reviewHeader);

  // Review title
  if (review.title) {
    const title = document.createElement('div');
    title.className = 'review-title';
    title.textContent = review.title;
    card.appendChild(title);
  }

  // Review content
  const content = document.createElement('div');
  content.className = 'review-content';
  content.textContent = review.content;
  card.appendChild(content);

  return card;
}

// ✅ Helper: Create scrollable reviews section
function createReviewsSection(productId) {
  try {
    const section = document.createElement('div');
    section.className = 'modal-reviews-section';

    // Section header with rating summary
    const header = document.createElement('div');
    header.className = 'section-header reviews-header';

    const title = document.createElement('h3');
    title.textContent = 'Customer Reviews';

    const rating = document.createElement('div');
    rating.className = 'reviews-rating-summary';
    rating.innerHTML = `
      <div class="rating-stars">
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star half">★</span>
      </div>
      <span class="rating-count">4.5 / 5</span>
    `;

    header.appendChild(title);
    header.appendChild(rating);
    section.appendChild(header);

    // Scrollable reviews area
    const scrollArea = document.createElement('div');
    scrollArea.className = 'reviews-scroll-area';

    // Get reviews
    const reviews = getProductReviews(productId);

    if (reviews && reviews.length > 0) {
      reviews.forEach(function(review) {
        const reviewCard = createReviewCard(review);
        scrollArea.appendChild(reviewCard);
      });
    } else {
      const noReviews = document.createElement('div');
      noReviews.className = 'no-reviews';
      noReviews.textContent = 'No reviews yet. Be the first to review!';
      scrollArea.appendChild(noReviews);
    }

    section.appendChild(scrollArea);

    return section;
  } catch (error) {
    console.error('Error creating reviews section:', error);
    // Return empty div to prevent breaking
    const fallback = document.createElement('div');
    fallback.className = 'modal-reviews-section';
    return fallback;
  }
}

function openProductInfoModal(event, iconElement) {
  event.stopPropagation();
  event.preventDefault();

  console.log('🔍 Opening modal...');
  console.log('Icon element:', iconElement);

  // Close any existing modals first
  closeAllModals();

  const productCard = iconElement.closest('.section-collections-with-nav__product');
  if (!productCard) {
    console.error('❌ Product card not found');
    return;
  }

  const productId = productCard.dataset.productId;
  console.log('Product ID:', productId);

  // Find overlay (parent that contains modal)
  let overlay = productCard.querySelector('.buy-now-popup-overlay');

  if (!overlay) {
    console.error('❌ Overlay not found. Check "Activate Popups" toggle.');
    alert('Please enable "Activate Popups" in section settings.');
    return;
  }

  console.log('✅ Overlay found:', overlay);

  // Find modal inside overlay
  const modal = overlay.querySelector('.buy-now-popup__wrapper');

  if (!modal) {
    console.error('❌ Modal not found inside overlay');
    return;
  }

  console.log('✅ Modal found:', modal);

  // Move ENTIRE overlay (with modal inside) to body
  if (overlay.parentElement !== document.body) {
    console.log('📦 Moving overlay with modal to body');
    document.body.appendChild(overlay);
  }

  // Activate overlay (which shows both overlay and modal)
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  console.log('=== MODAL DEBUG ===');
  console.log('✅ Modal opened');
  console.log('Overlay element:', overlay);
  console.log('Overlay classes:', overlay.className);
  console.log('Modal element:', modal);
  console.log('Modal computed display:', window.getComputedStyle(modal).display);
  console.log('Modal computed position:', window.getComputedStyle(modal).position);
  console.log('Modal computed visibility:', window.getComputedStyle(modal).visibility);
  console.log('Modal computed opacity:', window.getComputedStyle(modal).opacity);
  console.log('Modal computed width:', window.getComputedStyle(modal).width);
  console.log('Modal computed height:', window.getComputedStyle(modal).height);
  console.log('Overlay computed display:', window.getComputedStyle(overlay).display);
  console.log('Overlay computed position:', window.getComputedStyle(overlay).position);
  console.log('=== END MODAL DEBUG ===');

  // ========================================
  // AUTO-SELECT FIRST VARIANTS
  // MODAL-VARIANT-AUTOSELECT-CLOSE-076
  // ========================================
  const variantSelectors = modal.querySelectorAll('.variant-selector');
  console.log('Found variant selectors:', variantSelectors.length);

  variantSelectors.forEach((selector, index) => {
    const options = selector.querySelectorAll('option');
    console.log(`Selector ${index + 1} options:`, options.length);

    // Skip the first option (placeholder) and select the second option (first actual variant)
    if (options.length > 1) {
      const firstVariant = options[1];
      selector.value = firstVariant.value;

      console.log(`Auto-selected: ${firstVariant.value} for option ${index + 1}`);

      // Trigger change event to update product
      const event = new Event('change', { bubbles: true });
      selector.dispatchEvent(event);
    }
  });

  // Update button text for BOGO context
  setTimeout(function() {
    const addToCartBtn = modal.querySelector('.js-atc-bf');
    if (addToCartBtn) {
      const hasVariants = parseInt(productCard.dataset.hasVariants) > 0;

      if (hasVariants) {
        addToCartBtn.innerHTML = '<span style="font-size: 24px; font-weight: 700;">✓</span> Select Variant & Add to BOGO Pair';
      } else {
        addToCartBtn.innerHTML = '<span style="font-size: 24px; font-weight: 700;">✓</span> Add to BOGO Pair';
      }
    }
  }, 50);

  // Setup close button
  const closeBtn = modal.querySelector('.close-buy-now-popup');
  if (closeBtn) {
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCloseBtn.onclick = function(e) {
      console.log('❌ Close button clicked');
      e.preventDefault();
      e.stopPropagation();
      closeAllModals();
    };
  }

  // Setup BOGO pair selection button
  const bogoBtn = modal.querySelector('.js-atc-bf');
  if (bogoBtn) {
    console.log('✅ BOGO button found');

    // Clone to remove old handlers
    const newBogoBtn = bogoBtn.cloneNode(true);
    bogoBtn.parentNode.replaceChild(newBogoBtn, bogoBtn);

    newBogoBtn.onclick = function(e) {
      console.log('🎯 BOGO button clicked');
      e.preventDefault();
      e.stopPropagation();

      // Get product data
      const productId = productCard.dataset.productId;
      const productTitle = modal.querySelector('.buy-now-popup__content > a')?.textContent || 'Product';
      const productPrice = parseFloat(productCard.dataset.price);

      // ✅ FIX: Get image from modal with clean URL
      const modalImage = modal.querySelector('figure img');
      let productImage = modalImage ? modalImage.src.split('?')[0] : '';

      // Fallback to product card
      if (!productImage) {
        const cardImage = productCard.querySelector('.section-collections-with-nav__product-image img');
        productImage = cardImage ? cardImage.src.split('?')[0] : '';
      }

      // Get selected variants
      const variantSelects = modal.querySelectorAll('.variant-selector');
      let selectedVariantId = productCard.dataset.variantId;
      let variantText = '';

      if (variantSelects.length > 0) {
        const selectedOptions = Array.from(variantSelects).map(select => select.value);
        variantText = selectedOptions.join(' / ');
        console.log('Selected variants:', selectedOptions);
      }

      // Create product data object
      const productData = {
        productId: productId,
        variantId: selectedVariantId,
        title: productTitle,
        variantText: variantText,
        price: productPrice,
        image: productImage,
        element: productCard
      };

      console.log('📦 Adding to BOGO pair:', productData);

      // Add to pair
      if (typeof window.addProductToPair === 'function') {
        window.addProductToPair(productData);
      } else {
        console.log('✓ Product selected for BOGO');
        highlightProduct(productCard, 1);
      }

      // Close modal
      setTimeout(function() {
        closeAllModals();
      }, 300);
    };
  }

  // ✅ BOGO-MODAL-ENHANCE-041: Setup image carousel
  setupImageCarousel(modal, productId);

  // ✅ Setup Learn More button functionality
  const learnMoreBtn = modal.querySelector('.buy-now-popup__expand-desc');
  if (learnMoreBtn) {
    const descriptionInner = modal.querySelector('.buy-now-popup__description-inner');

    // Clone to remove old handlers
    const newLearnMoreBtn = learnMoreBtn.cloneNode(true);
    learnMoreBtn.parentNode.replaceChild(newLearnMoreBtn, learnMoreBtn);

    newLearnMoreBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = descriptionInner.classList.contains('expanded');

      if (isExpanded) {
        // Collapse
        descriptionInner.classList.remove('expanded');
        newLearnMoreBtn.classList.remove('expanded');
        newLearnMoreBtn.innerHTML = newLearnMoreBtn.innerHTML.replace('Show Less', 'Learn More');
      } else {
        // Expand
        descriptionInner.classList.add('expanded');
        newLearnMoreBtn.classList.add('expanded');
        newLearnMoreBtn.innerHTML = newLearnMoreBtn.innerHTML.replace('Learn More', 'Show Less');
      }
    };
  }

  // ✅ BOGO-MODAL-FIX-COMPLETE-068: Setup overlay click-to-close
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      console.log('🖱️ Clicked outside - closing');
      closeAllModals();
    }
  };

  console.log('✅ Modal setup complete');
}

function createModalOverlay() {
  let overlay = document.querySelector('.buy-now-popup__overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'buy-now-popup__overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9998;
    `;
    document.body.appendChild(overlay);
  }
  return overlay;
}

function closeAllModals() {
  console.log('🚪 Closing all modals...');

  // Hide all overlays (new class name)
  document.querySelectorAll('.buy-now-popup-overlay').forEach(function(overlay) {
    overlay.classList.remove('active');
  });

  // Also hide old overlay class if exists
  document.querySelectorAll('.buy-now-popup__overlay').forEach(function(overlay) {
    overlay.classList.remove('active');
  });

  // Restore body scroll
  document.body.style.overflow = '';

  console.log('✅ All modals closed');
}

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

function showNotification(message) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(96, 198, 85, 0.95);
    color: white;
    padding: 16px 32px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    font-size: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease-out;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Ensure functions are globally accessible
window.handleProductClick = handleProductClick;
window.openProductInfoModal = openProductInfoModal;
window.closeAllModals = closeAllModals;
window.addProductToPair = addProductToPair;
window.updateStickyCart = updateStickyCart;

console.log('%c✅ BOGO JavaScript Loaded Successfully!', 'color: #60c655; font-size: 20px; font-weight: bold;');
console.log('%cGlobal functions:', 'color: yellow; font-weight: bold;', {
  handleProductClick: typeof window.handleProductClick,
  openProductInfoModal: typeof window.openProductInfoModal,
  closeAllModals: typeof window.closeAllModals
});

// Test that functions are callable
if (typeof window.handleProductClick === 'function') {
  console.log('%c✅ handleProductClick is defined and callable', 'color: green;');
} else {
  console.error('%c❌ handleProductClick is NOT defined!', 'color: red; font-size: 16px;');
}

if (typeof window.openProductInfoModal === 'function') {
  console.log('%c✅ openProductInfoModal is defined and callable', 'color: green;');
} else {
  console.error('%c❌ openProductInfoModal is NOT defined!', 'color: red; font-size: 16px;');
}

// ========================================
// TIER COMPARISON MODAL
// ========================================
(function() {
  const modal = document.getElementById('tier-comparison-modal');
  const openBtns = document.querySelectorAll('.btn-compare-tiers, .btn-compare-from-review');
  const closeBtn = document.querySelector('.comparison-close');
  const overlay = document.querySelector('.comparison-overlay');
  const startBtn = document.querySelector('.btn-start-building');

  // Add event listener to all compare buttons
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      closeModal();
      const productGrid = document.querySelector('.products');
      if (productGrid) productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

// ========================================
// TIER CELEBRATION SYSTEM
// ========================================
class TierCelebrations {
  constructor() {
    this.overlay = document.getElementById('tier-celebration-overlay');
    this.canvas = document.getElementById('celebration-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  celebrate(tier) {
    console.log(`🎉 Celebrating Tier ${tier} unlock!`);
    const config = tier === 2 ? {
      icon: '⭐',
      message: 'TIER 2 UNLOCKED!',
      submessage: 'FREE Premium Shipping + Extra 5% OFF!',
      breakdown: 'BOGO Savings<br>+ 5% Extra Discount<br>+ FREE Premium Shipping (€4.99)',
      buttonText: 'Add 1 More Pair for FREE Cable!'
    } : {
      icon: '👑',
      message: 'MAXIMUM SAVINGS!',
      submessage: '10% OFF + FREE Shipping + FREE Cable!',
      breakdown: 'BOGO Savings<br>+ 10% Extra Discount<br>+ FREE Premium Shipping (€4.99)<br>+ FREE Titan Smart Cable (€18.95)',
      buttonText: 'Checkout Now'
    };

    this.overlay.querySelector('.badge-icon').textContent = config.icon;
    this.overlay.querySelector('.badge-tier').textContent = `Tier ${tier}`;
    this.overlay.querySelector('.celebration-message').textContent = config.message;
    this.overlay.querySelector('.celebration-submessage').textContent = config.submessage;
    this.overlay.querySelector('.savings-breakdown').innerHTML = config.breakdown;

    const savings = this.calculateTierSavings(tier);
    this.overlay.querySelector('.savings-total').textContent = `€${savings.toFixed(2)}`;

    // ✅ UPDATE: Two buttons - Checkout and Review Pairs
    const primaryBtn = this.overlay.querySelector('.btn-celebration-continue.primary');
    const secondaryBtn = this.overlay.querySelector('.btn-celebration-continue.secondary');

    primaryBtn.textContent = config.buttonText;
    primaryBtn.onclick = () => this.closeCelebration(tier, 'checkout');

    secondaryBtn.textContent = 'Review Pairs';
    secondaryBtn.onclick = () => this.closeCelebration(tier, 'review');

    // ✅ BOGO-CELEBRATION-CLOSE-046: Add hint text
    let hintText = this.overlay.querySelector('.celebration-hint');
    if (!hintText) {
      hintText = document.createElement('p');
      hintText.className = 'celebration-hint';
      hintText.textContent = 'Click anywhere to continue shopping';
      const content = this.overlay.querySelector('.celebration-content');
      if (content) content.appendChild(hintText);
    }

    // ✅ BOGO-CELEBRATION-CLOSE-046: Click overlay to close
    const overlayClickHandler = (e) => {
      if (e.target === this.overlay) {
        this.closeCelebration(tier, 'review');
        this.overlay.removeEventListener('click', overlayClickHandler);
      }
    };
    this.overlay.addEventListener('click', overlayClickHandler);

    // ✅ BOGO-CELEBRATION-CLOSE-046: ESC key to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeCelebration(tier, 'review');
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    this.overlay.className = `tier-celebration-overlay tier-${tier}`;
    setTimeout(() => this.overlay.classList.add('show'), 100);

    if (tier === 2) this.triggerConfetti();
    else if (tier === 3) this.triggerFireworks();

    document.querySelector('.bogo-sticky-cart')?.classList.add('celebration-pulse');
    setTimeout(() => document.querySelector('.bogo-sticky-cart')?.classList.remove('celebration-pulse'), 1200);
  }

  calculateTierSavings(tier) {
    const state = window.bogoState;
    let bogoSavings = state.pairs.reduce((sum, pair) => sum + pair.savings, 0);
    const subtotal = state.pairs.reduce((sum, pair) => sum + pair.product1.price + pair.product2.price, 0);
    const tierPercent = tier === 2 ? 0.05 : tier === 3 ? 0.10 : 0;
    const tierSavings = subtotal * tierPercent;
    const shippingSavings = tier >= 2 ? 499 : 0;
    const cableSavings = tier === 3 ? 1895 : 0;
    return (bogoSavings + tierSavings + shippingSavings + cableSavings) / 100;
  }

  closeCelebration(tier, action) {
    this.overlay.classList.remove('show');

    setTimeout(() => {
      if (action === 'checkout') {
        // ✅ BOGO-CHECKOUT-FINAL-061: Proceed to checkout
        proceedToCheckout();
      } else if (action === 'review') {
        // Open pair management modal
        const reviewBtn = document.getElementById('sticky-cart-review');
        if (reviewBtn) {
          reviewBtn.click(); // Trigger review modal
        }
      }
    }, 500);
  }

  triggerConfetti() {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#60C655', '#FFD700', '#FF6B6B', '#4ECDC4'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let active = false;
      particles.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.rotation += 5;
        if (p.y < this.canvas.height) active = true;
      });
      if (active) requestAnimationFrame(animate);
    };
    animate();
  }

  triggerFireworks() {
    if (!this.canvas || !this.ctx) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const fireworks = [];
    const particles = [];

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        fireworks.push({ x: Math.random() * this.canvas.width, y: this.canvas.height, targetY: Math.random() * this.canvas.height * 0.4 + 100, vy: -8, exploded: false });
      }, i * 400);
    }

    const animate = () => {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      fireworks.forEach(fw => {
        if (!fw.exploded) {
          fw.y += fw.vy;
          this.ctx.fillStyle = '#FFD700';
          this.ctx.fillRect(fw.x - 2, fw.y - 2, 4, 4);
          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            this.createExplosion(fw.x, fw.y, particles);
          }
        }
      });
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.01;
        if (p.alpha > 0) {
          this.ctx.save();
          this.ctx.globalAlpha = p.alpha;
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
          this.ctx.restore();
        }
      });
      if (particles.some(p => p.alpha > 0) || fireworks.some(fw => !fw.exploded)) requestAnimationFrame(animate);
    };
    animate();
  }

  createExplosion(x, y, particles) {
    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#60C655', '#4ECDC4'];
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      const speed = Math.random() * 3 + 2;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }
  }
}

window.tierCelebrations = new TierCelebrations();

// Helper function to get tier from pair count
function getTierForCount(pairCount) {
  if (pairCount >= 3) return 3;
  if (pairCount >= 2) return 2;
  return 1;
}

// ========================================
// BOGO-SOCIAL-PROOF-050: SOCIAL PROOF SYSTEM
// ========================================

// Configuration
const SOCIAL_PROOF_CONFIG = {
  liveActivity: {
    enabled: true,
    baseRange: [15, 35],
    updateInterval: [8000, 15000]
  },
  notifications: {
    enabled: false, // ✅ DISABLED: "Person from location added X pairs" notifications
    showInterval: [15000, 25000],
    displayDuration: 8000,
    maxVisible: 1
  },
  bundlesCounter: {
    enabled: true,
    baseRange: [1000, 1500],
    incrementInterval: [20000, 40000]
  },
  popularityBadges: {
    enabled: true,
    showProbability: 0.4
  }
};

// Live Activity Counter
class LiveActivityCounter {
  constructor() {
    this.baseCount = this.getRandomBase();
    this.currentCount = this.baseCount;
    this.element = document.getElementById('live-users');
    if (this.element && SOCIAL_PROOF_CONFIG.liveActivity.enabled) {
      this.init();
    }
  }

  getRandomBase() {
    const [min, max] = SOCIAL_PROOF_CONFIG.liveActivity.baseRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  init() {
    this.updateDisplay();
    setInterval(() => {
      this.fluctuateCount();
    }, this.getRandomInterval());
  }

  getRandomInterval() {
    const [min, max] = SOCIAL_PROOF_CONFIG.liveActivity.updateInterval;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  fluctuateCount() {
    const change = Math.floor(Math.random() * 6) - 2; // -2 to +3
    this.currentCount = Math.max(10, Math.min(45, this.currentCount + change));
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.element) {
      this.element.style.transform = 'scale(1.2)';
      this.element.style.color = '#FFD700';

      setTimeout(() => {
        this.element.textContent = this.currentCount;
      }, 150);

      setTimeout(() => {
        this.element.style.transform = 'scale(1)';
        this.element.style.color = '#60c655';
      }, 300);
    }
  }
}

// Social Proof Notifications
class SocialProofNotifications {
  constructor() {
    this.container = document.getElementById('social-proof-notifications');
    if (!this.container || !SOCIAL_PROOF_CONFIG.notifications.enabled) return;

    this.notifications = this.generateNotifications();
    this.currentIndex = 0;
    this.isRunning = true;
    this.init();
  }

  generateNotifications() {
    const names = [
      'Emma L.', 'James K.', 'Sarah M.', 'Michael R.', 'Lisa T.',
      'David W.', 'Jennifer H.', 'Robert P.', 'Maria G.', 'John D.',
      'Sophie B.', 'Thomas C.', 'Anna F.', 'Chris M.', 'Rachel S.'
    ];

    const actions = [
      { text: 'just completed a Tier 2 bundle', icon: '⭐' },
      { text: 'unlocked Tier 3 savings', icon: '👑' },
      { text: 'added 3 pairs to their bundle', icon: '🎁' },
      { text: 'saved €52 with BOGO', icon: '💰' },
      { text: 'is building a bundle now', icon: '🔥' },
      { text: 'unlocked FREE Premium Shipping', icon: '🚚' },
      { text: 'got a FREE Titan Smart Cable', icon: '🎉' }
    ];

    const locations = [
      'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford',
      'London', 'Manchester', 'Berlin', 'Paris', 'Amsterdam',
      'Brussels', 'Vienna', 'Stockholm', 'Copenhagen'
    ];

    return Array.from({ length: 20 }, () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const minutesAgo = Math.floor(Math.random() * 15) + 1;

      return {
        name: `${name} from ${location}`,
        action: action.text,
        icon: action.icon,
        time: `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`
      };
    });
  }

  init() {
    setTimeout(() => {
      this.showNext();
    }, 5000);

    this.interval = setInterval(() => {
      if (this.isRunning) {
        this.showNext();
      }
    }, this.getRandomInterval());
  }

  getRandomInterval() {
    const [min, max] = SOCIAL_PROOF_CONFIG.notifications.showInterval;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  showNext() {
    const notification = this.notifications[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
    this.show(notification);
  }

  show(notification) {
    const element = document.createElement('div');
    element.className = 'social-proof-notification';
    element.innerHTML = `
      <div class="notification-icon">${notification.icon}</div>
      <div class="notification-content">
        <div class="notification-name">${notification.name}</div>
        <div class="notification-action">${notification.action}</div>
        <div class="notification-time">${notification.time}</div>
      </div>
      <button class="notification-close">×</button>
    `;

    this.container.appendChild(element);

    const closeBtn = element.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide(element);
    });

    element.addEventListener('click', () => {
      this.hide(element);
    });

    setTimeout(() => {
      this.hide(element);
    }, SOCIAL_PROOF_CONFIG.notifications.displayDuration);
  }

  hide(element) {
    element.style.animation = 'slideOutLeft 400ms ease-out';
    setTimeout(() => {
      element.remove();
    }, 400);
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
  }
}

// Total Bundles Counter
class TotalBundlesCounter {
  constructor() {
    this.element = document.getElementById('total-bundles');
    if (!this.element || !SOCIAL_PROOF_CONFIG.bundlesCounter.enabled) return;

    this.baseCount = this.getTodayBase();
    this.currentCount = this.baseCount;
    this.init();
  }

  getTodayBase() {
    const [min, max] = SOCIAL_PROOF_CONFIG.bundlesCounter.baseRange;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const seed = dayOfYear * 1234567;
    const random = Math.sin(seed) * 10000;
    return Math.floor(Math.abs(random) % (max - min)) + min;
  }

  init() {
    this.updateDisplay();
    setInterval(() => {
      this.incrementCount();
    }, this.getRandomInterval());
  }

  getRandomInterval() {
    const [min, max] = SOCIAL_PROOF_CONFIG.bundlesCounter.incrementInterval;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  incrementCount() {
    const increase = Math.floor(Math.random() * 3) + 1;
    this.currentCount += increase;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.element) {
      const formatted = this.currentCount.toLocaleString('en-US');
      this.element.style.transform = 'scale(1.15)';

      setTimeout(() => {
        this.element.textContent = formatted;
      }, 150);

      setTimeout(() => {
        this.element.style.transform = 'scale(1)';
      }, 300);
    }
  }
}

// ✅ BOGO-PREMIUM-BADGE-FINAL-056: Minimal text-glow "POPULAR" badge
function addPopularityBadges() {
  if (!SOCIAL_PROOF_CONFIG.popularityBadges.enabled) return;

  const productCards = document.querySelectorAll('.product-card');

  // ✅ Minimal text-glow badge - no icon, just glowing text
  const popularBadge = { type: 'premium', text: 'POPULAR', probability: 0.4 };

  productCards.forEach((card, index) => {
    const random = Math.random();

    // ✅ Show "POPULAR" badge on ~40% of products
    if (random < popularBadge.probability) {
      const badgeElement = document.createElement('div');
      badgeElement.className = 'popularity-badge-premium';
      badgeElement.textContent = popularBadge.text;

      // ✅ Append to card
      card.appendChild(badgeElement);
    }
  });
}

// Initialize all social proof systems
document.addEventListener('DOMContentLoaded', function() {
  if (SOCIAL_PROOF_CONFIG.liveActivity.enabled) {
    new LiveActivityCounter();
  }

  if (SOCIAL_PROOF_CONFIG.notifications.enabled) {
    window.socialProofSystem = new SocialProofNotifications();

    // Pause notifications when modals are open
    const observer = new MutationObserver(function(mutations) {
      const modalOpen = document.querySelector('.buy-now-popup__wrapper.active, .tier-celebration-overlay.show, .tier-comparison-modal.active');

      if (modalOpen && window.socialProofSystem) {
        window.socialProofSystem.pause();
      } else if (window.socialProofSystem) {
        window.socialProofSystem.resume();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  }

  if (SOCIAL_PROOF_CONFIG.bundlesCounter.enabled) {
    new TotalBundlesCounter();
  }

  if (SOCIAL_PROOF_CONFIG.popularityBadges.enabled) {
    setTimeout(addPopularityBadges, 500);
  }

  console.log('%c✅ BOGO-SOCIAL-PROOF-050: Social proof system loaded', 'color: #60c655; font-weight: bold;');
});

// Easy toggle function
window.toggleSocialProof = function(enabled) {
  const indicator = document.querySelector('.live-activity-indicator');
  if (indicator) {
    indicator.style.display = enabled ? 'flex' : 'none';
  }

  if (window.socialProofSystem) {
    if (enabled) {
      window.socialProofSystem.resume();
    } else {
      window.socialProofSystem.pause();
    }
  }
};

// ========================================
// BOGO-GLOW-STOCK-FIX-051: STOCK BADGES
// Minimal circles with smart animations
// ========================================

function updateStockDisplay(card) {
  let stockBadge = card.querySelector('.stock-badge-circle');

  if (!stockBadge) {
    stockBadge = document.createElement('div');
    stockBadge.className = 'stock-badge-circle';
    const stockNumber = document.createElement('span');
    stockNumber.className = 'stock-number';
    stockBadge.appendChild(stockNumber);

    const imageContainer = card.querySelector('.section-collections-with-nav__product-image');
    if (imageContainer) {
      imageContainer.appendChild(stockBadge);
    }
  }

  const stockLevel = parseInt(card.dataset.stockLevel);
  const stockNumber = stockBadge.querySelector('.stock-number');

  // ✅ APPLY CORRECT COLOR CLASS
  stockBadge.classList.remove('medium-stock', 'low-stock');

  if (stockLevel <= 19) {
    stockBadge.classList.add('low-stock');
  } else if (stockLevel <= 49) {
    stockBadge.classList.add('medium-stock');
  }
  // else: default green (high stock)

  // Update data attribute for CSS
  stockBadge.setAttribute('data-stock-level', stockLevel);

  // Update number
  stockNumber.textContent = stockLevel;

  // ✅ ANIMATE ONLY ON CHANGE
  stockBadge.classList.add('updating');
  setTimeout(() => {
    stockBadge.classList.remove('updating');
  }, 400);
}

function decreaseRandomStock() {
  const products = Array.from(document.querySelectorAll('.section-collections-with-nav__product'));

  // Pick 1-3 random products to decrease
  const numToDecrease = Math.floor(Math.random() * 3) + 1;
  const shuffled = products.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, numToDecrease);

  selected.forEach(card => {
    const currentStock = parseInt(card.dataset.stockLevel);

    // Don't decrease below 5
    if (currentStock > 5) {
      const decrease = Math.floor(Math.random() * 2) + 1; // 1-2
      card.dataset.stockLevel = Math.max(5, currentStock - decrease);
      updateStockDisplay(card);
    }
  });
}

// Initialize stock levels
function initializeStockLevels() {
  const products = document.querySelectorAll('.section-collections-with-nav__product');

  products.forEach((card, index) => {
    // Vary stock levels: some high, some medium, some low
    let stockLevel;
    const random = Math.random();

    if (random < 0.15) {
      // 15% low stock (10-19)
      stockLevel = Math.floor(Math.random() * 10) + 10;
    } else if (random < 0.35) {
      // 20% medium stock (20-49)
      stockLevel = Math.floor(Math.random() * 30) + 20;
    } else {
      // 65% high stock (50-94)
      stockLevel = Math.floor(Math.random() * 45) + 50;
    }

    card.dataset.stockLevel = stockLevel;
    updateStockDisplay(card);
  });

  // Decrease stock randomly every 5 seconds
  setInterval(decreaseRandomStock, 5000);
}

// ========================================
// ANNOUNCEMENT BAR - HIDE ON SCROLL
// ========================================

class AnnouncementBar {
  constructor() {
    this.bar = document.getElementById('stock-announcement');
    if (!this.bar) return;

    this.lastScrollTop = 0;
    this.scrollThreshold = 50; // Hide after 50px scroll
    this.isHidden = false;

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // ✅ HIDE when scrolling down past threshold
    if (scrollTop > this.scrollThreshold && scrollTop > this.lastScrollTop) {
      if (!this.isHidden) {
        this.hide();
      }
    }
    // ✅ SHOW when scrolling back to top
    else if (scrollTop < this.scrollThreshold) {
      if (this.isHidden) {
        this.show();
      }
    }

    this.lastScrollTop = scrollTop;
  }

  hide() {
    this.bar.classList.add('hidden');
    this.isHidden = true;
  }

  show() {
    this.bar.classList.remove('hidden');
    this.isHidden = false;
  }
}

// Initialize stock badges and announcement bar
document.addEventListener('DOMContentLoaded', function() {
  initializeStockLevels();
  new AnnouncementBar();

  console.log('%c✅ BOGO-GLOW-STOCK-FIX-051: Stock badges and announcement bar loaded', 'color: #60c655; font-weight: bold;');
});

// ========================================
// CHECKOUT INTEGRATION - FINAL VERSION
// ========================================

// Main checkout function
// ========================================
// BOGO CHECKOUT - BYPASS CART DRAWER
// Goes directly to Shopify checkout URL
// BOGO-BYPASS-CART-DRAWER-078
// ========================================

async function proceedToCheckout() {
  const state = window.bogoState;

  console.log('=== BOGO CHECKOUT START ===');
  console.log('State:', state);

  // Validation
  if (!state || !state.pairs || state.pairs.length === 0) {
    alert('Please add at least one pair to continue');
    return;
  }

  // Check for incomplete pairs (flexible property checking)
  const incompletePairs = state.pairs.filter(pair => {
    const hasFirstProduct = pair.slot1 || pair.product1 || pair.item1 || pair[0];
    const hasSecondProduct = pair.slot2 || pair.product2 || pair.item2 || pair[1];
    return !hasFirstProduct || !hasSecondProduct;
  });

  if (incompletePairs.length > 0) {
    alert('Please complete all pairs before checkout');
    return;
  }

  console.log('Validation passed, building checkout URL...');

  // Show loading
  showCheckoutLoading();

  try {
    // ========================================
    // BUILD DIRECT CHECKOUT URL
    // ========================================

    const checkoutItems = [];

    // Add all BOGO pairs
    state.pairs.forEach((pair, pairIndex) => {
      const pairNumber = pairIndex + 1;

      // Get products with flexible property names
      const product1 = pair.slot1 || pair.product1 || pair.item1 || pair[0];
      const product2 = pair.slot2 || pair.product2 || pair.item2 || pair[1];

      // Add first product
      if (product1) {
        const variantId = product1.variantId || product1.variant_id || product1.id;
        if (variantId) {
          checkoutItems.push({
            id: variantId,
            quantity: 1,
            properties: {
              '_pair_number': pairNumber,
              '_bogo_offer': 'Black Friday BOGO 2025'
            }
          });
        }
      }

      // Add second product
      if (product2) {
        const variantId = product2.variantId || product2.variant_id || product2.id;
        if (variantId) {
          checkoutItems.push({
            id: variantId,
            quantity: 1,
            properties: {
              '_pair_number': pairNumber,
              '_bogo_offer': 'Black Friday BOGO 2025'
            }
          });
        }
      }
    });

    // Add bonus cable for Tier 3 (if applicable)
    if (state.pairs.length >= 3) {
      const bonusCableVariantId = '43480190943410'; // Titan Smart Cable variant ID
      checkoutItems.push({
        id: bonusCableVariantId,
        quantity: 1,
        properties: {
          '_bonus_item': 'FREE Tier 3 Bonus',
          '_tier_3_bonus': 'Titan Smart Cable'
        }
      });
    }

    console.log('Checkout items:', checkoutItems);

    // ========================================
    // BUILD CHECKOUT URL WITH LINE ITEMS
    // ========================================

    // Build line items string for URL
    const lineItems = checkoutItems.map(item => {
      const properties = item.properties ?
        Object.entries(item.properties)
          .map(([key, val]) => `${encodeURIComponent(key)}:${encodeURIComponent(val)}`)
          .join(',') : '';

      return properties ?
        `${item.id}:${item.quantity}[${properties}]` :
        `${item.id}:${item.quantity}`;
    }).join(',');

    // Get discount codes
    const discountCodes = getBOGODiscountCodes(state.pairs.length);
    const discountParam = discountCodes ? `&discount=${encodeURIComponent(discountCodes)}` : '';

    // Build final checkout URL
    const checkoutUrl = `/cart/${lineItems}?checkout=true${discountParam}`;

    console.log('Direct checkout URL:', checkoutUrl);

    // ========================================
    // PREVENT REBUY INTERFERENCE
    // ========================================

    // Flag to tell Rebuy/cart drawer to ignore this navigation
    window.bogoDirectCheckout = true;
    sessionStorage.setItem('bogo-direct-checkout', 'true');

    // Disable any cart drawer listeners temporarily
    if (window.Rebuy) {
      console.log('Temporarily disabling Rebuy...');
      const rebuyOriginal = window.Rebuy;
      window.Rebuy = null;
      setTimeout(() => {
        window.Rebuy = rebuyOriginal;
      }, 1000);
    }

    // ========================================
    // REDIRECT TO CHECKOUT
    // ========================================

    console.log('Redirecting to checkout...');

    // Small delay to ensure flags are set
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 100);

  } catch (error) {
    console.error('Checkout error:', error);
    hideCheckoutLoading();
    alert('Error processing your order. Please try again or contact support.');

    // Clean up flags
    window.bogoDirectCheckout = false;
    sessionStorage.removeItem('bogo-direct-checkout');
  }
}

// Get discount codes based on tier
function getBOGODiscountCodes(pairCount) {
  if (pairCount === 1) {
    return 'BOGO2025';
  } else if (pairCount === 2) {
    return 'BOGO2025,TIER2-5OFF';
  } else if (pairCount >= 3) {
    return 'BOGO2025,TIER3-10OFF';
  }
  return '';
}

// Show loading overlay
function showCheckoutLoading() {
  const overlay = document.createElement('div');
  overlay.id = 'checkout-loading';
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
        ">Building Your Order...</h3>
        <p style="
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        ">Applying BOGO discounts</p>
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

  // Add tier discount
  if (pairCount >= 3) {
    codes.push('TIER3-10OFF');
  } else if (pairCount === 2) {
    codes.push('TIER2-5OFF');
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


// DISABLED: // ========================================
// DISABLED: // STICKY CART - REMOVE PAIR & UPDATE
// DISABLED: // BOGO-STICKY-CART-REDESIGN-069
// DISABLED: // ========================================
// DISABLED: 
// DISABLED: function removePair(pairIndex) {
// DISABLED:   const state = window.bogoState;
// DISABLED: 
// DISABLED:   if (!state || !state.pairs || !state.pairs[pairIndex]) {
// DISABLED:     console.error('Pair not found:', pairIndex);
// DISABLED:     return;
// DISABLED:   }
// DISABLED: 
// DISABLED:   // Confirm removal
// DISABLED:   const confirmed = confirm(`Remove Pair ${pairIndex + 1} from your cart?`);
// DISABLED: 
// DISABLED:   if (!confirmed) return;
// DISABLED: 
// DISABLED:   console.log('Removing pair:', pairIndex);
// DISABLED: 
// DISABLED:   // Remove from state
// DISABLED:   state.pairs.splice(pairIndex, 1);
// DISABLED: 
// DISABLED:   // Update UI
// DISABLED:   updateStickyCartDisplay();
// DISABLED:   if (typeof renderPairModal === 'function') {
// DISABLED:     renderPairModal();
// DISABLED:   }
// DISABLED: 
// DISABLED:   // Show feedback
// DISABLED:   showToast(`Pair ${pairIndex + 1} removed`);
// DISABLED: 
// DISABLED:   // If no pairs left, hide sticky cart
// DISABLED:   if (state.pairs.length === 0) {
// DISABLED:     document.querySelector('.bogo-sticky-cart').style.display = 'none';
// DISABLED:   }
// DISABLED: }
// DISABLED: 
// DISABLED: // Update sticky cart display with new design
// DISABLED: function updateStickyCartDisplay() {
// DISABLED:   const state = window.bogoState;
// DISABLED:   const container = document.querySelector('.pairs-preview-container');
// DISABLED: 
// DISABLED:   if (!container) return;
// DISABLED: 
// DISABLED:   // Clear existing pairs
// DISABLED:   container.innerHTML = '';
// DISABLED: 
// DISABLED:   // Render each pair
// DISABLED:   state.pairs.forEach((pair, index) => {
// DISABLED:     const pairBox = document.createElement('div');
// DISABLED:     pairBox.className = 'pair-preview-box';
// DISABLED:     pairBox.dataset.pairIndex = index;
// DISABLED: 
// DISABLED:     // Get images
// DISABLED:     const img1 = pair.slot1?.image || '';
// DISABLED:     const img2 = pair.slot2?.image || '';
// DISABLED:     const title1 = pair.slot1?.title || 'Product 1';
// DISABLED:     const title2 = pair.slot2?.title || 'Product 2';
// DISABLED: 
// DISABLED:     pairBox.innerHTML = `
// DISABLED:       <span class="pair-number">${index + 1}</span>
// DISABLED:       <button class="remove-pair-btn" onclick="removePair(${index})">
// DISABLED:         <span class="remove-icon">✕</span>
// DISABLED:       </button>
// DISABLED:       <div class="pair-products">
// DISABLED:         ${img1 ? `<img src="${img1}" alt="${title1}" class="pair-product-thumb">` : '<div class="pair-product-thumb"></div>'}
// DISABLED:         ${img2 ? `<img src="${img2}" alt="${title2}" class="pair-product-thumb">` : '<div class="pair-product-thumb"></div>'}
// DISABLED:       </div>
// DISABLED:       <span class="pair-fraction">${index + 1}/${state.pairs.length}</span>
// DISABLED:     `;
// DISABLED: 
// DISABLED:     container.appendChild(pairBox);
// DISABLED:   });
// DISABLED: 
// DISABLED:   // Update tier message
// DISABLED:   updateTierMessage();
// DISABLED: }
// DISABLED: 
// DISABLED: // Update tier message based on pair count
// DISABLED: function updateTierMessage() {
// DISABLED:   const state = window.bogoState;
// DISABLED:   const pairCount = state.pairs.length;
// DISABLED:   const tierText = document.getElementById('sticky-tier-message');
// DISABLED: 
// DISABLED:   if (!tierText) return;
// DISABLED: 
// DISABLED:   if (pairCount === 0) {
// DISABLED:     tierText.textContent = 'Select 2 products to create your first BOGO pair!';
// DISABLED:   } else if (pairCount === 1) {
// DISABLED:     tierText.textContent = 'Add 1 more pair for Tier 2 (5% OFF + Free Shipping)';
// DISABLED:   } else if (pairCount === 2) {
// DISABLED:     tierText.textContent = 'Add 1 more pair for Tier 3 (10% OFF + FREE Cable)';
// DISABLED:   } else {
// DISABLED:     tierText.textContent = '🎉 Tier 3 Unlocked: 10% OFF + FREE Cable + Free Shipping!';
// DISABLED:   }
// DISABLED: }
// DISABLED: 
// DISABLED: // Show toast notification
// DISABLED: function showToast(message) {
// DISABLED:   const toast = document.createElement('div');
// DISABLED:   toast.style.cssText = `
// DISABLED:     position: fixed;
// DISABLED:     top: 20px;
// DISABLED:     right: 20px;
// DISABLED:     background: #000000;
// DISABLED:     color: #ffffff;
// DISABLED:     padding: 16px 24px;
// DISABLED:     border-radius: 8px;
// DISABLED:     border: 2px solid #60c655;
// DISABLED:     font-weight: 700;
// DISABLED:     z-index: 10000;
// DISABLED:     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
// DISABLED:   `;
// DISABLED:   toast.textContent = message;
// DISABLED: 
// DISABLED:   document.body.appendChild(toast);
// DISABLED: 
// DISABLED:   setTimeout(() => {
// DISABLED:     toast.style.opacity = '0';
// DISABLED:     toast.style.transform = 'translateY(-10px)';
// DISABLED:     toast.style.transition = 'all 300ms ease';
// DISABLED:     setTimeout(() => toast.remove(), 300);
// DISABLED:   }, 2000);
// DISABLED: }
// DISABLED: 
// DISABLED: // Make functions globally available
// DISABLED: window.removePair = removePair;
// DISABLED: window.updateStickyCartDisplay = updateStickyCartDisplay;
// DISABLED: window.updateTierMessage = updateTierMessage;
// DISABLED: 
// DISABLED: console.log('%c✅ BOGO-STICKY-CART-REDESIGN-069: Enhanced sticky cart loaded', 'color: #60c655; font-weight: bold;');

// DISABLED: // ========================================
// DISABLED: // STICKY CART - REMOVE PAIR & UPDATE
// DISABLED: // BOGO-STICKY-CART-REDESIGN-069
// DISABLED: // ========================================
// DISABLED: 
// DISABLED: function removePair(pairIndex) {
// DISABLED:   const state = window.bogoState;
// DISABLED: 
// DISABLED:   if (!state || !state.pairs || !state.pairs[pairIndex]) {
// DISABLED:     console.error('Pair not found:', pairIndex);
// DISABLED:     return;
// DISABLED:   }
// DISABLED: 
// DISABLED:   // Confirm removal
// DISABLED:   const confirmed = confirm(`Remove Pair ${pairIndex + 1} from your cart?`);
// DISABLED: 
// DISABLED:   if (!confirmed) return;
// DISABLED: 
// DISABLED:   console.log('Removing pair:', pairIndex);
// DISABLED: 
// DISABLED:   // Remove from state
// DISABLED:   state.pairs.splice(pairIndex, 1);
// DISABLED: 
// DISABLED:   // Update UI
// DISABLED:   updateStickyCartDisplay();
// DISABLED:   if (typeof renderPairModal === 'function') {
// DISABLED:     renderPairModal();
// DISABLED:   }
// DISABLED: 
// DISABLED:   // Show feedback
// DISABLED:   showToast(`Pair ${pairIndex + 1} removed`);
// DISABLED: 
// DISABLED:   // If no pairs left, hide sticky cart
// DISABLED:   if (state.pairs.length === 0) {
// DISABLED:     document.querySelector('.bogo-sticky-cart').style.display = 'none';
// DISABLED:   }
// DISABLED: }
// DISABLED: 
// DISABLED: // Update sticky cart display with new design
// DISABLED: function updateStickyCartDisplay() {
// DISABLED:   const state = window.bogoState;
// DISABLED:   const container = document.querySelector('.pairs-preview-container');
// DISABLED: 
// DISABLED:   if (!container) return;
// DISABLED: 
// DISABLED:   // Clear existing pairs
// DISABLED:   container.innerHTML = '';
// DISABLED: 
// DISABLED:   // Render each pair
// DISABLED:   state.pairs.forEach((pair, index) => {
// DISABLED:     const pairBox = document.createElement('div');
// DISABLED:     pairBox.className = 'pair-preview-box';
// DISABLED:     pairBox.dataset.pairIndex = index;
// DISABLED: 
// DISABLED:     // Get images
// DISABLED:     const img1 = pair.slot1?.image || '';
// DISABLED:     const img2 = pair.slot2?.image || '';
// DISABLED:     const title1 = pair.slot1?.title || 'Product 1';
// DISABLED:     const title2 = pair.slot2?.title || 'Product 2';
// DISABLED: 
// DISABLED:     pairBox.innerHTML = `
// DISABLED:       <span class="pair-number">${index + 1}</span>
// DISABLED:       <button class="remove-pair-btn" onclick="removePair(${index})">
// DISABLED:         <span class="remove-icon">✕</span>
// DISABLED:       </button>
// DISABLED:       <div class="pair-products">
// DISABLED:         ${img1 ? `<img src="${img1}" alt="${title1}" class="pair-product-thumb">` : '<div class="pair-product-thumb"></div>'}
// DISABLED:         ${img2 ? `<img src="${img2}" alt="${title2}" class="pair-product-thumb">` : '<div class="pair-product-thumb"></div>'}
// DISABLED:       </div>
// DISABLED:       <span class="pair-fraction">${index + 1}/${state.pairs.length}</span>
// DISABLED:     `;
// DISABLED: 
// DISABLED:     container.appendChild(pairBox);
// DISABLED:   });
// DISABLED: 
// DISABLED:   // Update tier message
// DISABLED:   updateTierMessage();
// DISABLED: }
// DISABLED: 
// DISABLED: // Update tier message based on pair count
// DISABLED: function updateTierMessage() {
// DISABLED:   const state = window.bogoState;
// DISABLED:   const pairCount = state.pairs.length;
// DISABLED:   const tierText = document.getElementById('sticky-tier-message');
// DISABLED: 
// DISABLED:   if (!tierText) return;
// DISABLED: 
// DISABLED:   if (pairCount === 0) {
// DISABLED:     tierText.textContent = 'Select 2 products to create your first BOGO pair!';
// DISABLED:   } else if (pairCount === 1) {
// DISABLED:     tierText.textContent = 'Add 1 more pair for Tier 2 (5% OFF + Free Shipping)';
// DISABLED:   } else if (pairCount === 2) {
// DISABLED:     tierText.textContent = 'Add 1 more pair for Tier 3 (10% OFF + FREE Cable)';
// DISABLED:   } else {
// DISABLED:     tierText.textContent = '🎉 Tier 3 Unlocked: 10% OFF + FREE Cable + Free Shipping!';
// DISABLED:   }
// DISABLED: }
// DISABLED: 
// DISABLED: // Show toast notification
// DISABLED: function showToast(message) {
// DISABLED:   const toast = document.createElement('div');
// DISABLED:   toast.style.cssText = `
// DISABLED:     position: fixed;
// DISABLED:     top: 20px;
// DISABLED:     right: 20px;
// DISABLED:     background: #000000;
// DISABLED:     color: #ffffff;
// DISABLED:     padding: 16px 24px;
// DISABLED:     border-radius: 8px;
// DISABLED:     border: 2px solid #60c655;
// DISABLED:     font-weight: 700;
// DISABLED:     z-index: 10000;
// DISABLED:     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
// DISABLED:   `;
// DISABLED:   toast.textContent = message;
// DISABLED: 
// DISABLED:   document.body.appendChild(toast);
// DISABLED: 
// DISABLED:   setTimeout(() => {
// DISABLED:     toast.style.opacity = '0';
// DISABLED:     toast.style.transform = 'translateY(-10px)';
// DISABLED:     toast.style.transition = 'all 300ms ease';
// DISABLED:     setTimeout(() => toast.remove(), 300);
// DISABLED:   }, 2000);
// DISABLED: }
// DISABLED: 
// DISABLED: // Make functions globally available
// DISABLED: window.removePair = removePair;
// DISABLED: window.updateStickyCartDisplay = updateStickyCartDisplay;
// DISABLED: window.updateTierMessage = updateTierMessage;
// DISABLED: 
// DISABLED: console.log('%c✅ BOGO-STICKY-CART-REDESIGN-069: Enhanced sticky cart loaded', 'color: #60c655; font-weight: bold;');

// ========================================
// FIX STICKY CART POSITIONING
// Move cart to body level to enable true position: fixed
// STICKY-CART-FIXED-POSITION-074
// ========================================

(function initializeStickyCart() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveStickyCartToBody);
  } else {
    moveStickyCartToBody();
  }
  
  function moveStickyCartToBody() {
    const stickyCart = document.querySelector('.bogo-sticky-cart');
    
    if (!stickyCart) {
      console.warn('Sticky cart not found in DOM');
      return;
    }
    
    console.log('Moving sticky cart to body level...');
    console.log('Cart current parent:', stickyCart.parentElement);
    
    // Only move if not already a direct child of body
    if (stickyCart.parentElement !== document.body) {
      // Move to body
      document.body.appendChild(stickyCart);
      console.log('✅ Sticky cart moved to body level');
      console.log('Cart new parent:', stickyCart.parentElement);
      
      // Force reflow to ensure styles apply
      stickyCart.style.display = 'none';
      void stickyCart.offsetHeight; // Force reflow
      stickyCart.style.display = 'block';
      
      // Verify position
      const computed = window.getComputedStyle(stickyCart);
      console.log('Cart position:', computed.position);
      console.log('Cart bottom:', computed.bottom);
      console.log('Cart z-index:', computed.zIndex);
    } else {
      console.log('✅ Sticky cart already at body level');
    }
  }
})();

console.log('%c✅ STICKY-CART-FIXED-POSITION-074: Sticky cart positioning initialized', 'color: #60c655; font-weight: bold;');

// ========================================
// GET SELECTED VARIANT FROM MODAL
// MODAL-VARIANT-AUTOSELECT-CLOSE-076
// ========================================

function getSelectedVariantFromModal(modal) {
  const variantSelectors = modal.querySelectorAll('.variant-selector');
  const productTitle = modal.querySelector('.modal-product-title')?.textContent || 'Product';
  const productImage = modal.querySelector('.carousel-image.active')?.src || 
                       modal.querySelector('.modal-product-image')?.src || '';
  const productPrice = modal.querySelector('.modal-price')?.textContent || '€0,00';
  const productUrl = modal.querySelector('.modal-product-title')?.href || '';
  
  // Get product ID from modal data or URL
  const productId = modal.dataset.productId || extractProductIdFromUrl(productUrl);
  
  console.log('Getting variant from modal:', {
    title: productTitle,
    image: productImage,
    price: productPrice,
    url: productUrl,
    productId: productId
  });
  
  // If no variant selectors, return basic product data
  if (variantSelectors.length === 0) {
    return {
      variantId: productId,
      title: productTitle,
      image: productImage,
      price: productPrice,
      url: productUrl,
      options: {}
    };
  }
  
  // Build selected options object
  const selectedOptions = {};
  let allSelected = true;
  
  variantSelectors.forEach(selector => {
    const optionName = selector.dataset.optionName || selector.name;
    const optionValue = selector.value;
    
    console.log(`Option "${optionName}": "${optionValue}"`);
    
    if (!optionValue || optionValue === '' || optionValue === optionName) {
      console.warn(`Option "${optionName}" not selected`);
      allSelected = false;
    } else {
      selectedOptions[optionName] = optionValue;
    }
  });
  
  // Check if all required variants are selected
  if (!allSelected) {
    console.error('Not all variants selected');
    return null;
  }
  
  // Find matching variant ID based on selected options
  const variantId = findVariantIdByOptions(productId, selectedOptions);
  
  return {
    variantId: variantId || productId,
    title: productTitle,
    image: productImage,
    price: productPrice,
    url: productUrl,
    options: selectedOptions,
    optionsText: Object.entries(selectedOptions)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ')
  };
}

// Helper: Extract product ID from URL
function extractProductIdFromUrl(url) {
  const match = url.match(/\/products\/([^/?]+)/);
  return match ? match[1] : null;
}

// Helper: Find variant ID by selected options
function findVariantIdByOptions(productId, selectedOptions) {
  const modal = document.querySelector('.buy-now-popup__wrapper');
  
  if (modal && modal.dataset.variantData) {
    try {
      const variants = JSON.parse(modal.dataset.variantData);
      
      // Find variant that matches all selected options
      const matchingVariant = variants.find(variant => {
        return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
          const variantOption = variant.options?.find(opt => 
            opt.name?.toLowerCase() === optionName.toLowerCase()
          );
          return variantOption?.value?.toLowerCase() === optionValue.toLowerCase();
        });
      });
      
      if (matchingVariant) {
        console.log('Found matching variant:', matchingVariant.id);
        return matchingVariant.id;
      }
    } catch (e) {
      console.error('Error parsing variant data:', e);
    }
  }
  
  console.warn('Could not find variant ID, using product ID as fallback');
  return null;
}

// Show success toast
function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #60c655;
    color: #ffffff;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 300ms ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Update modal when variant changes
function updateModalVariant(modal) {
  const variantData = getSelectedVariantFromModal(modal);
  
  if (!variantData) return;
  
  console.log('Updating modal with variant:', variantData);
  
  // Update image if variant has specific image
  if (variantData.image) {
    const mainImage = modal.querySelector('.carousel-image.active');
    if (mainImage && variantData.image !== mainImage.src) {
      mainImage.src = variantData.image;
    }
  }
  
  // Update price if variant has specific price
  if (variantData.price) {
    const priceElements = modal.querySelectorAll('.modal-price, .js-variant-price, .js-variant-price-2');
    priceElements.forEach(el => {
      if (el) el.textContent = variantData.price;
    });
  }
  
  console.log('Modal updated with new variant');
}

console.log('%c✅ MODAL-VARIANT-AUTOSELECT-CLOSE-076: Variant auto-selection initialized', 'color: #60c655; font-weight: bold;');

// ========================================
// SHOW LIVE ACTIVITY AFTER SCROLLING PAST COUNTER
// ========================================

(function initLiveActivityScroll() {
  const liveActivity = document.querySelector('.live-activity-indicator');
  const counterContent = document.querySelector('.counter-content');
  
  if (!liveActivity || !counterContent) {
    console.log('Live activity or counter not found');
    return;
  }
  
  // Hide live activity initially
  liveActivity.style.opacity = '0';
  liveActivity.style.pointerEvents = 'none';
  
  function checkScroll() {
    const counterRect = counterContent.getBoundingClientRect();
    const counterPassed = counterRect.bottom < 0; // Counter is above viewport
    
    if (counterPassed) {
      // Show live activity
      liveActivity.style.opacity = '1';
      liveActivity.style.pointerEvents = 'auto';
    } else {
      // Hide live activity
      liveActivity.style.opacity = '0';
      liveActivity.style.pointerEvents = 'none';
    }
  }
  
  // Check on scroll
  window.addEventListener('scroll', checkScroll);
  
  // Check initially
  checkScroll();
  
  console.log('✅ Live activity scroll trigger initialized');
})();
