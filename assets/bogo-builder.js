  console.log('%c🚀 BOGO JavaScript Loading...', 'color: #60c655; font-size: 20px; font-weight: bold;');

// ========================================
// CLEAR CART ON LOAD - ALWAYS START FRESH
// ========================================

(function clearCartImmediately() {
  const clearCart = async () => {
    try {
      const response = await fetch('/cart/clear.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ Cart cleared on BOGO page load');
      } else {
        console.warn('⚠️ Failed to clear cart:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Cart clear error:', error);
    }
  };

  // Clear immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clearCart);
  } else {
    clearCart();
  }
})();

// ========================================
// CURRENCY CONVERSION UTILITY
// Handles multi-currency for static marketing amounts
// ========================================

const BOGOCurrency = (() => {
  // Get active currency from Shopify
  const getCurrency = () => {
    return window.Shopify?.currency?.active || 
           document.querySelector('[data-currency]')?.dataset.currency ||
           'EUR';
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    const symbols = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': '$', 'AUD': '$',
      'JPY': '¥', 'CNY': '¥', 'RSD': 'RSD', 'CHF': 'CHF', 'SEK': 'kr',
      'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft'
    };
    const currency = getCurrency();
    return symbols[currency] || currency + ' ';
  };

  // Get conversion rate from EUR
  const getConversionRate = () => {
    const currency = getCurrency();
    
    // Try to get rate from Shopify Currency object
    if (window.Currency && window.Currency.rates) {
      return window.Currency.rates[currency] || 1;
    }
    
    // Try to get from page meta or data
    const rateElement = document.querySelector(`[data-currency-${currency.toLowerCase()}]`);
    if (rateElement) {
      return parseFloat(rateElement.dataset[`currency${currency.toLowerCase()}`]) || 1;
    }
    
    // Default conversion rates (approximate - update these with your store's rates)
    const rates = {
      'EUR': 1,
      'USD': 1.10,
      'GBP': 0.86,
      'RSD': 117,
      'CHF': 0.96,
      'SEK': 11.50,
      'NOK': 11.80,
      'DKK': 7.45,
      'PLN': 4.35,
      'CZK': 25.20,
      'HUF': 390,
      'AUD': 1.70,
      'CAD': 1.50,
      'JPY': 160,
      'CNY': 7.85
    };
    
    return rates[currency] || 1;
  };

  // Convert cents from EUR base to current currency
  const convertCents = (eurCents) => {
    const rate = getConversionRate();
    return Math.round(eurCents * rate);
  };

  // Format money with current currency
  const formatMoney = (cents) => {
    const currency = getCurrency();
    const symbol = getCurrencySymbol();
    const amount = cents / 100;
    
    // Format based on currency
    if (currency === 'RSD' || currency === 'JPY' || currency === 'HUF') {
      // No decimals for these currencies
      return `${symbol}${Math.round(amount)}`;
    } else if (currency === 'EUR') {
      // European format: €23,00
      return `${symbol}${amount.toFixed(2).replace('.', ',')}`;
    } else {
      // Standard format: $23.00
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

  // Convert and format from EUR cents
  const convert = (eurCents) => {
    const convertedCents = convertCents(eurCents);
    return formatMoney(convertedCents);
  };

  return {
    getCurrency,
    getCurrencySymbol,
    getConversionRate,
    convertCents,
    formatMoney,
    convert
  };
})();

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

// ========================================
// LOCALSTORAGE PERSISTENCE (BOGO-PERSIST-006)
// Save/restore BOGO state across sessions
// ========================================

const BOGO_STORAGE_KEY = 'titan-bogo-state';
const BOGO_EXPIRY_HOURS = 24;

/**
 * Save BOGO state to localStorage
 */
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

/**
 * Load BOGO state from localStorage
 * @returns {Object|null} Saved state or null if expired/invalid
 */
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

/**
 * Clear BOGO state from localStorage
 */
function clearBOGOState() {
  localStorage.removeItem(BOGO_STORAGE_KEY);
  console.log('🗑️ BOGO state cleared');
}

/**
 * Show Toast Notification (BOGO-REVIEW-MODAL-UX-024)
 * @param {string} message - Notification text
 * @param {string} type - 'success' or 'error'
 * @param {number} duration - Display duration in ms (default 3000)
 */
function showBogoToast(message, type = 'success', duration = 3000) {
  // Remove any existing toasts
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
// Fixed End Date: Monday, November 17, 2025, 5:00 PM GMT
// Auto-hides when timer reaches zero
// ===========================================
(function() {
  const countdownText = document.getElementById('countdown-text');
  const batteryFill = document.getElementById('battery-fill');

  if (!countdownText || !batteryFill) return;

  // ⚠️ FIXED END DATE: Monday, November 17, 2025, 5:00 PM GMT
  const SALE_END = new Date('2025-11-17T17:00:00Z').getTime();

  // Calculate sale start (72 hours before end date for battery percentage)
  const SALE_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours
  const SALE_START = SALE_END - SALE_DURATION_MS;

  function updateCountdown() {
    const now = Date.now();
    const timeLeft = SALE_END - now;

    if (timeLeft <= 0) {
      // ✅ Auto-hide timer when it reaches zero
      const timerContainer = countdownText.closest('.countdown-container') ||
                            countdownText.closest('.timer-container') ||
                            countdownText.parentElement;

      if (timerContainer) {
        timerContainer.style.display = 'none';
      } else {
        // Fallback: hide just the elements
        countdownText.style.display = 'none';
        if (batteryFill.parentElement) {
          batteryFill.parentElement.style.display = 'none';
        }
      }
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

    // Calculate battery percentage based on time elapsed since sale start
    const timeElapsed = now - SALE_START;
    const percentRemaining = Math.max(0, Math.min(100, ((SALE_DURATION_MS - timeElapsed) / SALE_DURATION_MS) * 100));
    batteryFill.style.width = `${percentRemaining}%`;

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

/**
 * Initialize BOGO state (BOGO-PERSIST-006)
 * Restores from localStorage if available
 */
(function initBOGOState() {
  // Try to restore saved state
  const savedState = loadBOGOState();

  if (savedState && savedState.pairs && savedState.pairs.length > 0) {
    // Restore saved state
    window.bogoState = {
      pairs: savedState.pairs,
      currentPair: savedState.currentPair || {
        slot1: null,
        slot2: null
      },
      activePairNumber: (savedState.pairs.length || 0) + 1
    };
    console.log('✅ BOGO state restored from localStorage:', window.bogoState.pairs.length, 'pairs');

    // Update sticky cart to show restored pairs
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (typeof updateStickyCart === 'function') {
          updateStickyCart();
        }
      });
    } else {
      // DOM already loaded, update immediately
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
})();

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

    // ✅ Remove visual highlights from products (use slot1/slot2 with fallback)
    const item1 = pair.slot1 || pair.product1;
    const item2 = pair.slot2 || pair.product2;

    [item1, item2].forEach(function(product) {
      if (product && product.element) {
        const remainingBadges = product.element.querySelectorAll('.pair-slot-badge');
        if (remainingBadges.length === 1) { // Only the one being removed
          product.element.classList.remove('product-selected');
          product.element.style.border = '';
          product.element.style.boxShadow = '';
        }
      }
    });

    // Remove pair from array
    state.pairs.splice(pairIndex, 1);

    // ✅ FIX: Renumber ALL remaining pairs sequentially (1, 2, 3, etc.)
    state.pairs.forEach(function(p, index) {
      const oldNumber = p.pairNumber;
      p.pairNumber = index + 1;

      // Update badges on products if number changed
      if (oldNumber !== p.pairNumber) {
        const pairItem1 = p.slot1 || p.product1;
        const pairItem2 = p.slot2 || p.product2;

        if (pairItem1 && pairItem1.element) {
          updatePairBadgeNumber(pairItem1.element, oldNumber, p.pairNumber);
        }
        if (pairItem2 && pairItem2.element) {
          updatePairBadgeNumber(pairItem2.element, oldNumber, p.pairNumber);
        }
      }
    });

    // Set next pair number
    state.activePairNumber = state.pairs.length + 1;
    console.log(`✅ Badge click removal: Pairs renumbered. Next pair: ${state.activePairNumber}`);

    // Save state
    saveBOGOState();

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

  // ✅ FIX: Save pair with PRICE-ORDERED products (expensive left, cheap right for FREE display)
  state.pairs.push({
    slot1: moreExpensive,  // ✅ More expensive on LEFT (pays)
    slot2: cheaper,        // ✅ Cheaper on RIGHT (FREE)
    product1: moreExpensive,  // Keep for backwards compatibility
    product2: cheaper,        // Keep for backwards compatibility
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

  // ✅ Save state after completing pair
  saveBOGOState();

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
// SAVINGS BREAKDOWN TOOLTIP (BOGO-V2-ADVANCED)
// ========================================
function initSavingsTooltip() {
  const infoBtn = document.getElementById('v2-savings-info');
  const tooltip = document.getElementById('v2-savings-tooltip');

  if (!infoBtn || !tooltip) return;

  let isTooltipOpen = false;

  // Toggle tooltip on click/tap
  infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isTooltipOpen = !isTooltipOpen;

    if (isTooltipOpen) {
      tooltip.classList.add('active');
      tooltip.setAttribute('aria-hidden', 'false');
      updateTooltipBreakdown(); // Populate with current data
    } else {
      tooltip.classList.remove('active');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  });

  // Close tooltip when clicking outside
  document.addEventListener('click', (e) => {
    if (isTooltipOpen && !tooltip.contains(e.target) && e.target !== infoBtn) {
      tooltip.classList.remove('active');
      tooltip.setAttribute('aria-hidden', 'true');
      isTooltipOpen = false;
    }
  });

  // Also show on hover (desktop)
  if (window.innerWidth >= 768) {
    infoBtn.addEventListener('mouseenter', () => {
      tooltip.classList.add('active');
      tooltip.setAttribute('aria-hidden', 'false');
      updateTooltipBreakdown();
    });

    const valueWrapper = infoBtn.closest('.value-amount-wrapper');
    if (valueWrapper) {
      valueWrapper.addEventListener('mouseleave', () => {
        if (!isTooltipOpen) {
          tooltip.classList.remove('active');
          tooltip.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }
}

// Update tooltip breakdown with current savings data (✅ BOGO-V2-FIXES)
function updateTooltipBreakdown() {
  const state = window.bogoState;
  if (!state) return;

  const pairCount = state.pairs?.length || 0;
  let currentTier = 0;
  if (pairCount >= 3) currentTier = 3;
  else if (pairCount >= 2) currentTier = 2;
  else if (pairCount >= 1) currentTier = 1;

  // Calculate individual savings components
  let bogoSavings = 0;
  let tierDiscount = 0;
  let orderSubtotal = 0;

  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const cleaned = priceString.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  if (pairCount > 0 && state.pairs && state.pairs.length > 0) {
    // BOGO savings - EXACT same logic as main calculation
    state.pairs.forEach(pair => {
      const price1 = parsePrice(pair.slot1?.price);
      const price2 = parsePrice(pair.slot2?.price);
      orderSubtotal += price1 + price2;
      const lowerPrice = Math.min(price1, price2);
      if (lowerPrice > 0) bogoSavings += lowerPrice * 0.5;
    });

    // Tier discount
    const discountedSubtotal = orderSubtotal - bogoSavings;
    if (currentTier === 3) {
      tierDiscount = discountedSubtotal * 0.10;
    } else if (currentTier === 2) {
      tierDiscount = discountedSubtotal * 0.05;
    }
  }

  // Update tooltip elements
  const formatMoney = (amount) => BOGOCurrency.formatMoney(Math.round(amount * 100));

  // BOGO always shows if pairs exist
  const bogoItem = document.getElementById('tooltip-bogo');
  if (bogoItem) {
    bogoItem.textContent = formatMoney(bogoSavings);
  }

  // Tier discount (show only if applicable)
  const tierItem = document.getElementById('tooltip-tier-item');
  if (tierDiscount > 0) {
    const tierLabel = document.getElementById('tooltip-tier-label');
    tierLabel.textContent = currentTier === 3 ? 'Tier 3 (10%):' : 'Tier 2 (5%):';
    document.getElementById('tooltip-tier').textContent = formatMoney(tierDiscount);
    tierItem.style.display = 'flex';
  } else {
    tierItem.style.display = 'none';
  }

  // Shipping (show if tier 2+)
  const shippingItem = document.getElementById('tooltip-shipping-item');
  shippingItem.style.display = currentTier >= 2 ? 'flex' : 'none';

  // Cable (show if tier 3)
  const cableItem = document.getElementById('tooltip-cable-item');
  cableItem.style.display = currentTier >= 3 ? 'flex' : 'none';

  // Total - MUST match main savings display
  let totalSavings = bogoSavings + tierDiscount;
  if (currentTier >= 2) totalSavings += 4.99;
  if (currentTier >= 3) totalSavings += 18.95;

  document.getElementById('tooltip-total').textContent = formatMoney(totalSavings);

  console.log('Tooltip breakdown:', {
    bogo: bogoSavings.toFixed(2),
    tier: tierDiscount.toFixed(2),
    total: totalSavings.toFixed(2)
  });
}

// ========================================
// HAPTIC FEEDBACK (Mobile) (BOGO-V2-ADVANCED)
// ========================================
function triggerHapticFeedback(type = 'light') {
  // Check if device supports haptics
  if ('vibrate' in navigator) {
    switch(type) {
      case 'light':
        navigator.vibrate(50);
        break;
      case 'medium':
        navigator.vibrate(100);
        break;
      case 'heavy':
        navigator.vibrate([50, 30, 50]);
        break;
      case 'success':
        navigator.vibrate([50, 50, 100]);
        break;
    }
  }
}

// ========================================
// CONFETTI CELEBRATION (BOGO-V2-ADVANCED)
// Triggered on Tier 3 unlock
// ========================================
function triggerStickyCartConfetti() {
  const canvas = document.getElementById('sticky-cart-confetti');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.classList.add('active');

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = 400;

  // Confetti particles
  const particles = [];
  const particleCount = 80;
  const colors = ['#60c655', '#70d665', '#FFD700', '#ffffff', '#fbbf24'];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 8 + 4;
      this.speedY = -(Math.random() * 6 + 4);
      this.speedX = (Math.random() - 0.5) * 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.gravity = 0.15;
    }

    update() {
      this.speedY += this.gravity;
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      // Fade out as it rises
      this.alpha = Math.max(0, 1 - (canvas.height - this.y) / canvas.height);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  let animationId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();

      // Remove if off screen
      if (particle.y < -20 || particle.alpha <= 0) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      canvas.classList.remove('active');
      cancelAnimationFrame(animationId);
    }
  }

  animate();
}

// ========================================
// TOUCH FEEDBACK FOR PROGRESS SEGMENTS (BOGO-V2-ADVANCED)
// ========================================
function initProgressTouchFeedback() {
  if (window.innerWidth >= 768) return; // Mobile only

  const segments = document.querySelectorAll('.progress-segment');
  segments.forEach(segment => {
    segment.addEventListener('touchstart', () => {
      segment.classList.add('tapped');
      setTimeout(() => segment.classList.remove('tapped'), 600);
    });
  });
}

// ========================================
// SIMPLE WORKING STICKY CART UPDATE
// STICKY-CART-SHOW-FIRST-PRODUCT-077
// ========================================
// ========================================
// STICKY CART V2 UPDATE LOGIC (BOGO-V2-ADVANCED)
// ✅ Calculations + Progress + Animations + Tooltip + Haptics + Confetti
// ========================================

// ========================================
// DATA MIGRATION HELPER (BOGO-CALCULATION-FIX-033)
// Converts old product1/product2 structure to slot1/slot2
// ========================================
function migratePairData(pairs) {
  if (!Array.isArray(pairs)) return [];

  return pairs.map(pair => {
    // If pair has product1/product2 but not slot1/slot2, migrate
    if ((pair.product1 || pair.product2) && !pair.slot1 && !pair.slot2) {
      console.log('✅ Migrating old pair structure:', pair.pairNumber);
      return {
        ...pair,
        slot1: pair.product1,
        slot2: pair.product2
      };
    }
    return pair;
  });
}

// ========================================
// DIAGNOSTIC: Debug BOGO State & Pricing
// ========================================
function debugBOGOState() {
  console.log('==========================================');
  console.log('🔍 BOGO STATE DIAGNOSTIC');
  console.log('==========================================');

  const state = window.bogoState;

  if (!state) {
    console.error('❌ window.bogoState is undefined!');
    return;
  }

  console.log('✅ State exists:', state);
  console.log('Pairs count:', state.pairs?.length || 0);

  if (state.pairs && state.pairs.length > 0) {
    state.pairs.forEach((pair, index) => {
      console.log(`\n--- Pair ${index + 1} ---`);
      console.log('Full pair object:', pair);

      // Check slot1
      console.log('Slot 1:', {
        exists: !!pair.slot1,
        title: pair.slot1?.title,
        price: pair.slot1?.price,
        priceType: typeof pair.slot1?.price,
        rawPrice: pair.slot1?.price,
        allKeys: Object.keys(pair.slot1 || {})
      });

      // Check slot2
      console.log('Slot 2:', {
        exists: !!pair.slot2,
        title: pair.slot2?.title,
        price: pair.slot2?.price,
        priceType: typeof pair.slot2?.price,
        rawPrice: pair.slot2?.price,
        allKeys: Object.keys(pair.slot2 || {})
      });

      // Try parsing
      if (pair.slot1?.price) {
        const cleaned = String(pair.slot1.price).replace(/[^0-9.,]/g, '').replace(',', '.');
        console.log('Slot 1 parsed:', cleaned, '→', parseFloat(cleaned));
      } else {
        console.warn('⚠️ Slot 1 price is missing or falsy');
      }

      if (pair.slot2?.price) {
        const cleaned = String(pair.slot2.price).replace(/[^0-9.,]/g, '').replace(',', '.');
        console.log('Slot 2 parsed:', cleaned, '→', parseFloat(cleaned));
      } else {
        console.warn('⚠️ Slot 2 price is missing or falsy');
      }
    });
  } else {
    console.warn('⚠️ No pairs in state');
  }

  console.log('\n==========================================');
}

// Make it globally accessible for console testing
window.debugBOGOState = debugBOGOState;

// Auto-run on state change
console.log('💡 Type debugBOGOState() in console to see state details');

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
    updateIncentiveMessage('Select 2 items to activate <strong>Buy 1 Get 1 50% OFF!</strong>');
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
    // Visual pulse animation
    stickyCartV2.style.animation = 'none';
    setTimeout(() => {
      stickyCartV2.style.animation = 'cartSlideUp 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }, 10);

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

// Ensure function is globally accessible
window.updateStickyCart = updateStickyCart;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('Initializing Sticky Cart V2 on page load');
    updateStickyCart();
  }, 100);
});

// OLD V1 STICKY CART LOGIC REMOVED (Lines 1153-1368)
// Now using V2 logic with accurate calculations and segmented progress

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
    savings.textContent = `Save ${BOGOCurrency.formatMoney(pair.savings)}`;
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

  // Prevent body scroll and hide sticky cart (BOGO-REVIEW-MODAL-MOBILE-019)
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');

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

  // Restore body scroll and show sticky cart (BOGO-REVIEW-MODAL-MOBILE-019)
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');

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
  console.log('\n========================================');
  console.log('🔍 MODAL CALCULATION DEBUG');
  console.log('========================================');

  const state = window.bogoState;
  const pairCount = state.pairs?.length || 0;

  console.log('Pairs:', pairCount);
  console.log('Raw pairs data:', JSON.stringify(state.pairs.map(p => ({
    product1: p.product1?.price,
    product2: p.product2?.price,
    slot1: p.slot1?.price,
    slot2: p.slot2?.price
  })), null, 2));

  // Helper: Parse price (could be cents number or formatted string)
  const parsePrice = (priceValue) => {
    if (!priceValue) return 0;
    // If it's already a number, assume it's in cents
    if (typeof priceValue === 'number') return priceValue;
    // If it's a string, parse it (could be "€30.95" or "3095")
    const cleaned = String(priceValue).replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned) || 0;
    // If parsed value is < 100, assume it's already in euros, multiply by 100
    return parsed < 100 ? parsed * 100 : parsed;
  };

  // Calculate retail value (full price of all items) - BOGO-CALCULATION-FIX-033
  let retailValueCents = 0;
  let bogoDiscountCents = 0;

  state.pairs.forEach(function(pair) {
    // Try slot1/slot2 first (new format), fallback to product1/product2 (old format)
    const item1 = pair.slot1 || pair.product1;
    const item2 = pair.slot2 || pair.product2;

    const price1 = parseInt(item1?.price || 0, 10);
    const price2 = parseInt(item2?.price || 0, 10);

    retailValueCents += price1 + price2;

    // BOGO FREE: 100% off cheaper item (not 50%!)
    const cheaperPrice = Math.min(price1, price2);
    if (cheaperPrice > 0) {
      bogoDiscountCents += cheaperPrice;
    }
  });

  // Calculate tier discount
  const tierPercent = pairCount >= 3 ? 0.10 : pairCount >= 2 ? 0.05 : 0;
  const subtotalAfterBogoCents = retailValueCents - bogoDiscountCents;
  const tierDiscountCents = Math.round(subtotalAfterBogoCents * tierPercent);

  console.log('💰 CALCULATION BREAKDOWN:');
  console.log('Retail value (cents):', retailValueCents, '→ €' + (retailValueCents / 100).toFixed(2));
  console.log('BOGO discount (cents):', bogoDiscountCents, '→ €' + (bogoDiscountCents / 100).toFixed(2));
  console.log('Subtotal after BOGO:', subtotalAfterBogoCents, '→ €' + (subtotalAfterBogoCents / 100).toFixed(2));
  console.log('Current tier:', pairCount >= 3 ? 3 : pairCount >= 2 ? 2 : 1);
  console.log('Tier discount (cents):', tierDiscountCents, '→ €' + (tierDiscountCents / 100).toFixed(2));

  // Shipping savings
  const shippingSavingsCents = pairCount >= 2 ? 499 : 0; // €4.99

  // Bonus cable value
  const cableSavingsCents = pairCount >= 3 ? 1895 : 0; // €18.95

  // Total savings
  const totalSavingsCents = bogoDiscountCents + tierDiscountCents + shippingSavingsCents + cableSavingsCents;

  console.log('📊 TOTAL SAVINGS CALCULATION:');
  console.log('BOGO:', bogoDiscountCents, '(€' + (bogoDiscountCents / 100).toFixed(2) + ')');
  console.log('Tier:', tierDiscountCents, '(€' + (tierDiscountCents / 100).toFixed(2) + ')');
  console.log('Shipping:', shippingSavingsCents > 0 ? shippingSavingsCents + ' (€4.99)' : '0');
  console.log('Cable:', cableSavingsCents > 0 ? cableSavingsCents + ' (€18.95)' : '0');
  console.log('TOTAL:', totalSavingsCents, '(€' + (totalSavingsCents / 100).toFixed(2) + ')');
  console.log('========================================\n');

  // Final amount to pay
  const finalAmountCents = subtotalAfterBogoCents - tierDiscountCents;

  // Savings percentage
  const savingsPercent = retailValueCents > 0 ? Math.round((totalSavingsCents / retailValueCents) * 100) : 0;

  // Helper to format cents with currency conversion
  const formatModalMoney = (cents) => BOGOCurrency.formatMoney(cents);

  // Update DOM
  const retailValueEl = document.getElementById('retail-value-total');
  const bogoDiscountEl = document.getElementById('bogo-discount');
  const tierDiscountEl = document.getElementById('tier-discount');
  const finalAmountEl = document.getElementById('final-amount');
  const savingsPercentageEl = document.getElementById('savings-percentage');

  if (retailValueEl) retailValueEl.textContent = formatModalMoney(retailValueCents);
  if (bogoDiscountEl) bogoDiscountEl.textContent = `-${formatModalMoney(bogoDiscountCents)}`;
  if (tierDiscountEl) tierDiscountEl.textContent = `-${formatModalMoney(tierDiscountCents)}`;
  if (finalAmountEl) finalAmountEl.textContent = formatModalMoney(finalAmountCents);
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
    retailValue: retailValueCents / 100,
    bogoDiscount: bogoDiscountCents / 100,
    tierDiscount: tierDiscountCents / 100,
    finalAmount: finalAmountCents / 100,
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
      nextBenefit.textContent = `👑 Add 1 more pair → Extra 5% + FREE ${BOGOCurrency.convert(1895)} Cable`;
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
  let bogoSavings = 0;

  // Add BOGO savings (one free item per pair)
  state.pairs.forEach(function(pair) {
    // Use slot1/slot2 first (new format), fallback to product1/product2 (old format)
    const item1 = pair.slot1 || pair.product1;
    const item2 = pair.slot2 || pair.product2;
    const freePrice = Math.min(
      item1?.price || 0,
      item2?.price || 0
    );
    bogoSavings += freePrice;
  });
  totalSavings += bogoSavings;

  // Add tier discount savings (MUST calculate on subtotal AFTER BOGO discount!)
  const tierPercent = pairCount >= 3 ? 0.10 : pairCount >= 2 ? 0.05 : 0;

  const retailValue = state.pairs.reduce(function(sum, pair) {
    const item1 = pair.slot1 || pair.product1;
    const item2 = pair.slot2 || pair.product2;
    return sum + (item1?.price || 0) + (item2?.price || 0);
  }, 0);

  // Tier discount is calculated on subtotal AFTER BOGO discount
  const subtotalAfterBogo = retailValue - bogoSavings;
  const tierSavings = Math.round(subtotalAfterBogo * tierPercent);
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
    savedEl.textContent = BOGOCurrency.formatMoney(totalSavings);
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

// ✅ BOGO-REVIEW-MOBILE-REDESIGN: Compact side-by-side pair cards
function createModalPairCard(pair, index) {
  const card = document.createElement('div');
  card.className = 'pair-modal__pair-card--compact';
  card.setAttribute('data-pair-index', index);

  // Compact Header with pair number and small X delete button
  const header = document.createElement('div');
  header.className = 'pair-modal__pair-header--compact';
  header.innerHTML = `
    <span class="pair-number-label">Pair ${pair.pairNumber}</span>
    <button class="pair-delete-x" onclick="deletePair(${index})" aria-label="Delete pair ${pair.pairNumber}">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;
  card.appendChild(header);

  // Side-by-side Products Container
  const products = document.createElement('div');
  products.className = 'pair-modal__pair-products--sidebyside';

  // Use slot1/slot2 (new format) with product1/product2 fallback (old format)
  const item1 = pair.slot1 || pair.product1;
  const item2 = pair.slot2 || pair.product2;

  // ✅ FIX: Determine which is cheaper/expensive by price
  let cheaperItem, expensiveItem;
  if (item1.price <= item2.price) {
    cheaperItem = item1;
    expensiveItem = item2;
  } else {
    cheaperItem = item2;
    expensiveItem = item1;
  }

  // Product 1 (Left) - MORE EXPENSIVE (pays full price)
  const product1 = createModalProductCardCompact(expensiveItem, index, 1, false);
  products.appendChild(product1);

  // Equals sign (Center)
  const equals = document.createElement('div');
  equals.className = 'pair-modal__equals-sign--compact';
  equals.textContent = '+';
  products.appendChild(equals);

  // Product 2 (Right) - CHEAPER with crossed price (FREE)
  const product2 = createModalProductCardCompact(cheaperItem, index, 2, true);
  products.appendChild(product2);

  card.appendChild(products);

  // Savings display below products
  const savings = document.createElement('div');
  savings.className = 'pair-modal__pair-savings--compact';
  const savingsAmount = BOGOCurrency.formatMoney(pair.savings);
  savings.innerHTML = `${savingsAmount} Saved!`;
  card.appendChild(savings);

  return card;
}

// ✅ BOGO-REVIEW-MOBILE-REDESIGN: Compact product card for side-by-side layout
function createModalProductCardCompact(product, pairIndex, slot, isFree) {
  const card = document.createElement('div');
  card.className = 'pair-modal__product--compact';
  card.setAttribute('data-pair-index', pairIndex);
  card.setAttribute('data-slot', slot);
  card.setAttribute('data-product-id', product.productId);

  // Free badge (absolute positioned at top)
  if (isFree) {
    const badge = document.createElement('div');
    badge.className = 'pair-modal__product-badge--compact';
    badge.textContent = 'FREE';
    card.appendChild(badge);
  }

  // Image
  const img = document.createElement('img');
  img.className = 'pair-modal__product-image--compact';
  img.src = product.image;
  img.alt = product.title;
  card.appendChild(img);

  // Title
  const title = document.createElement('div');
  title.className = 'pair-modal__product-title--compact';
  title.textContent = product.title;
  card.appendChild(title);

  // Price
  const price = document.createElement('div');
  price.className = 'pair-modal__product-price--compact';
  price.textContent = BOGOCurrency.formatMoney(product.price);
  if (isFree) {
    price.classList.add('strikethrough');
  }
  card.appendChild(price);

  return card;
}

// ✅ Keep old function for backwards compatibility (if needed elsewhere)
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
  price.textContent = BOGOCurrency.formatMoney(product.price);
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

  // ✅ Check if element is a valid DOM element
  if (typeof element === 'string' || typeof element === 'number') {
    // If it's an ID, try to find the element
    element = document.querySelector(`[data-product-id="${element}"]`);
  }
  
  // Ensure element has querySelector method (is a DOM element)
  if (!element || typeof element.querySelector !== 'function') {
    console.warn('Invalid element passed to unhighlightProduct:', element);
    return;
  }

  // ✅ FIX: Check if element is still in the DOM
  if (!document.body.contains(element)) {
    console.warn('Element no longer in DOM, skipping unhighlight:', element);
    return;
  }

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

  // ✅ Remove visual highlights from products (use slot1/slot2 with fallback)
  const item1 = pair.slot1 || pair.product1;
  const item2 = pair.slot2 || pair.product2;

  if (item1 && item1.element) {
    unhighlightProduct(item1.element, pairNumber);
  }

  if (item2 && item2.element) {
    unhighlightProduct(item2.element, pairNumber);
  }

  // Remove pair from state
  state.pairs.splice(pairIndex, 1);

  // Renumber remaining pairs
  state.pairs.forEach((p, index) => {
    const oldNumber = p.pairNumber;
    p.pairNumber = index + 1;

    // ✅ Update badges on products (use slot1/slot2 with fallback)
    const pairItem1 = p.slot1 || p.product1;
    const pairItem2 = p.slot2 || p.product2;

    // ✅ Validate and update badge for item 1
    if (pairItem1) {
      const element1 = pairItem1.element;
      // Check if element is valid DOM element with querySelector method
      if (element1 && typeof element1 === 'object' && 'querySelector' in element1 && document.body.contains(element1)) {
        updatePairBadgeNumber(element1, oldNumber, p.pairNumber);
      } else if (pairItem1.variantId) {
        // Try to find element by variant ID
        const foundElement = document.querySelector(`[data-product-id="${pairItem1.variantId}"]`);
        if (foundElement) {
          updatePairBadgeNumber(foundElement, oldNumber, p.pairNumber);
        }
      }
    }

    // ✅ Validate and update badge for item 2
    if (pairItem2) {
      const element2 = pairItem2.element;
      // Check if element is valid DOM element with querySelector method
      if (element2 && typeof element2 === 'object' && 'querySelector' in element2 && document.body.contains(element2)) {
        updatePairBadgeNumber(element2, oldNumber, p.pairNumber);
      } else if (pairItem2.variantId) {
        // Try to find element by variant ID
        const foundElement = document.querySelector(`[data-product-id="${pairItem2.variantId}"]`);
        if (foundElement) {
          updatePairBadgeNumber(foundElement, oldNumber, p.pairNumber);
        }
      }
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

  // ✅ Validate element is a DOM element, not a product ID
  if (typeof element === 'string' || typeof element === 'number') {
    console.warn('⚠️ updatePairBadgeNumber received product ID instead of element:', element);
    // Try to find the element by product ID
    const foundElement = document.querySelector(`[data-product-id="${element}"]`);
    if (foundElement) {
      element = foundElement;
    } else {
      console.warn('⚠️ Could not find element for product ID:', element);
      return;
    }
  }

  // ✅ Ensure element is still in DOM
  if (!document.body.contains(element)) {
    console.warn('⚠️ Element no longer in DOM, skipping badge update');
    return;
  }

  // ✅ Ensure element has querySelector method
  if (typeof element.querySelector !== 'function') {
    console.error('⚠️ Invalid element passed to updatePairBadgeNumber:', element);
    return;
  }

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

/**
 * Delete Single Pair (BOGO-REVIEW-MODAL-UX-024)
 * No confirmation dialog - instant deletion with toast notification
 * @param {number} pairIndex - Index of pair to delete
 */
function deletePair(pairIndex) {
  console.log('🗑️ Deleting pair:', pairIndex);

  const state = window.bogoState;
  const pair = state.pairs[pairIndex];

  if (!pair) {
    console.error('Pair not found');
    if (typeof showBogoToast === 'function') {
      showBogoToast('Error removing pair', 'error');
    }
    return;
  }

  const pairNumber = pair.pairNumber || (pairIndex + 1);

  // ✅ BOGO-CALCULATION-FIX-033: Use slot1/slot2 with product1/product2 fallback
  const item1 = pair.slot1 || pair.product1;
  const item2 = pair.slot2 || pair.product2;

  // Unhighlight both products (if elements exist)
  if (typeof unhighlightProduct === 'function') {
    if (item1?.element) unhighlightProduct(item1.element, pairNumber);
    if (item2?.element) unhighlightProduct(item2.element, pairNumber);
  }

  // Remove from state
  state.pairs.splice(pairIndex, 1);

  // ✅ FIX: Renumber ALL remaining pairs sequentially (1, 2, 3, etc.)
  state.pairs.forEach((p, index) => {
    const oldNumber = p.pairNumber;
    p.pairNumber = index + 1;

    // Update badges on products if number changed
    if (oldNumber !== p.pairNumber) {
      const pairItem1 = p.slot1 || p.product1;
      const pairItem2 = p.slot2 || p.product2;

      if (pairItem1 && pairItem1.element) {
        updatePairBadgeNumber(pairItem1.element, oldNumber, p.pairNumber);
      }
      if (pairItem2 && pairItem2.element) {
        updatePairBadgeNumber(pairItem2.element, oldNumber, p.pairNumber);
      }
    }
  });

  // Set next pair number
  state.activePairNumber = state.pairs.length + 1;
  console.log(`✅ Pairs renumbered. Next pair will be: ${state.activePairNumber}`);

  // Save state
  if (typeof saveBOGOState === 'function') {
    saveBOGOState();
  }

  // Re-render modal and update sticky cart
  if (typeof renderPairModal === 'function') {
    renderPairModal();
  }
  if (typeof updateStickyCart === 'function') {
    updateStickyCart();
  }

  // Show success notification
  if (typeof showBogoToast === 'function') {
    showBogoToast(`Pair ${pairNumber} removed`, 'success', 2500);
  }

  console.log('✅ Pair deleted:', pairIndex);
}

// Make globally accessible
window.deletePair = deletePair;

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
  // addStockDisclaimer(); // Removed: Stock disclaimer moved to filter label
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

// ✅ SINGLE LARGE IMAGE - Show only first valid product image
function setupImageCarousel(modal, productId) {
  try {
    const figure = modal.querySelector('figure');
    if (!figure || figure.dataset.carouselSetup === 'true') {
      return; // Already setup or not found
    }

    // Get all product images (main + variants, max 5)
    const images = getProductImages(productId, modal);

    // Filter and get ONLY first valid image
    const validImages = images.filter(img =>
      img && !img.includes('no-image') && !img.includes('shopifycloud')
    );

    if (validImages.length === 0) {
      console.warn('⚠️ No valid product images found');
      return;
    }

    // Mark as setup
    figure.dataset.carouselSetup = 'true';

    // Create simple image container with ONLY first image
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'carousel-images';

    const img = document.createElement('img');
    img.src = validImages[0]; // Only first image
    img.alt = 'Product image';
    img.className = 'carousel-image active';
    imagesContainer.appendChild(img);

    // Replace figure content with single image (no carousel controls)
    figure.innerHTML = '';
    figure.appendChild(imagesContainer);

    console.log('✅ Single large product image loaded');
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

// ═══════════════════════════════════════════════════════════════════
// PRODUCT-SPECIFIC REVIEWS DATABASE
// Review data will be populated in subsequent implementation steps
// ═══════════════════════════════════════════════════════════════════
const PRODUCT_REVIEWS = {

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTS 1-7: PREMIUM CABLES & MULTI-CABLES
  // ═══════════════════════════════════════════════════════════════

  // Product 1 & 2: Titan Smart Cable™ PRO + Titan PD Cable™ PRO (SHARED REVIEWS)
  '8467056656562': {
    totalReviews: 12654,
    avgRating: 4.6,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        date: "2025-11-12",
        title: "Finally stopped the replacement cycle",
        content: "I'm an electrician and I was going through cables every 6-8 weeks. Bought this in March. Still perfect. The 90° angle is genius for tight spaces in my van. Charged my phone from 12% to 68% in under 30 minutes yesterday. Worth every penny."
      },
      {
        author: "Sarah W.",
        rating: 5,
        date: "2025-11-09",
        title: "Best purchase for our family",
        content: "We have 3 teenagers. Do the math on how many cables we were buying. This one has survived 4 months of abuse between school bags, car charging, and daily bedroom use. The magnetic wind-up thing actually works - keeps it organized."
      },
      {
        author: "Rob H.",
        rating: 5,
        date: "2025-11-06",
        title: "Strong cable",
        content: "Really strong. Charges fast. Would definitely buy again."
      },
      {
        author: "Daniel K.",
        rating: 5,
        date: "2025-10-31",
        title: "Engineering quality",
        content: "I'm a mechanical engineer so I notice build quality. The stress relief at the 90° connector is properly designed - that's where cheap cables always fail. Military-grade braid isn't marketing BS, you can feel the difference. Using it daily for 5 months, zero degradation."
      },
      {
        author: "Emma L.",
        rating: 5,
        date: "2025-10-28",
        title: "Nurse life saver",
        content: "I work 12-hour shifts and my phone is my lifeline for patient updates. Old cable kept disconnecting in my pocket. This one? Rock solid connection every time. Fast charge during my 30min break gets me from 15% to 85%. Game changer."
      },
      {
        author: "Tom H.",
        rating: 5,
        date: "2025-10-22",
        title: "Good value",
        content: "Bit pricey but I've had it 6 months and it's still like new. Better than buying cheap ones every month."
      },
      {
        author: "Rachel M.",
        rating: 4,
        date: "2025-10-18",
        title: "Kids can't destroy it (somehow)",
        content: "My 9 and 11 year old have destroyed every cable we've owned. This one has survived 3 months of being yanked, bent, dropped, and used as a phone holder while gaming. Minor wear on the braid but connector is pristine. Impressed."
      },
      {
        author: "Dave P.",
        rating: 5,
        date: "2025-10-14",
        title: "Does the job",
        content: "Works great. No complaints. Charges my phone quick and seems tough."
      },
      {
        author: "Andrew S.",
        rating: 5,
        date: "2025-10-07",
        title: "The cable that ended my cable anxiety",
        content: "I used to panic buying a new cable every month wondering if this one would last. Bought 2 of these in April. Both still perfect. One lives in my car (Australian heat hasn't killed it), one at my desk. Fast charging actually works - 50% in about 20 minutes to my iPhone 15. Finally feel like I can trust a cable."
      },
      {
        author: "Linda B.",
        rating: 5,
        date: "2025-09-29",
        title: "Happy with it",
        content: "Great cable. My husband bought it and it's been really reliable. Charges fast."
      }
    ]
  },

  '8467055247538': {
    totalReviews: 12654,
    avgRating: 4.6,
    reviews: [
      {
        author: "Marcus T.",
        rating: 5,
        date: "2025-11-12",
        title: "Finally stopped the replacement cycle",
        content: "I'm an electrician and I was going through cables every 6-8 weeks. Bought this in March. Still perfect. The 90° angle is genius for tight spaces in my van. Charged my phone from 12% to 68% in under 30 minutes yesterday. Worth every penny."
      },
      {
        author: "Sarah W.",
        rating: 5,
        date: "2025-11-09",
        title: "Best purchase for our family",
        content: "We have 3 teenagers. Do the math on how many cables we were buying. This one has survived 4 months of abuse between school bags, car charging, and daily bedroom use. The magnetic wind-up thing actually works - keeps it organized."
      },
      {
        author: "Rob H.",
        rating: 5,
        date: "2025-11-06",
        title: "Strong cable",
        content: "Really strong. Charges fast. Would definitely buy again."
      },
      {
        author: "Daniel K.",
        rating: 5,
        date: "2025-10-31",
        title: "Engineering quality",
        content: "I'm a mechanical engineer so I notice build quality. The stress relief at the 90° connector is properly designed - that's where cheap cables always fail. Military-grade braid isn't marketing BS, you can feel the difference. Using it daily for 5 months, zero degradation."
      },
      {
        author: "Emma L.",
        rating: 5,
        date: "2025-10-28",
        title: "Nurse life saver",
        content: "I work 12-hour shifts and my phone is my lifeline for patient updates. Old cable kept disconnecting in my pocket. This one? Rock solid connection every time. Fast charge during my 30min break gets me from 15% to 85%. Game changer."
      },
      {
        author: "Tom H.",
        rating: 5,
        date: "2025-10-22",
        title: "Good value",
        content: "Bit pricey but I've had it 6 months and it's still like new. Better than buying cheap ones every month."
      },
      {
        author: "Rachel M.",
        rating: 4,
        date: "2025-10-18",
        title: "Kids can't destroy it (somehow)",
        content: "My 9 and 11 year old have destroyed every cable we've owned. This one has survived 3 months of being yanked, bent, dropped, and used as a phone holder while gaming. Minor wear on the braid but connector is pristine. Impressed."
      },
      {
        author: "Dave P.",
        rating: 5,
        date: "2025-10-14",
        title: "Does the job",
        content: "Works great. No complaints. Charges my phone quick and seems tough."
      },
      {
        author: "Andrew S.",
        rating: 5,
        date: "2025-10-07",
        title: "The cable that ended my cable anxiety",
        content: "I used to panic buying a new cable every month wondering if this one would last. Bought 2 of these in April. Both still perfect. One lives in my car (Australian heat hasn't killed it), one at my desk. Fast charging actually works - 50% in about 20 minutes to my iPhone 15. Finally feel like I can trust a cable."
      },
      {
        author: "Linda B.",
        rating: 5,
        date: "2025-09-29",
        title: "Happy with it",
        content: "Great cable. My husband bought it and it's been really reliable. Charges fast."
      }
    ]
  },

  // Product 3 & 4: Titan Smart Cable™ + Titan PD Cable™ (SHARED REVIEWS)
  '8273510236338': {
    totalReviews: 28112,
    avgRating: 4.7,
    reviews: [
      {
        author: "David M.",
        rating: 5,
        date: "2025-11-11",
        title: "2 years and counting",
        content: "Bought 4 of these in 2023. All 4 still working perfectly. That's it. That's the review. Best £80 I ever spent on cables."
      },
      {
        author: "Lisa K.",
        rating: 5,
        date: "2025-11-08",
        title: "Actually auto-disconnects at 100%",
        content: "I was skeptical about the auto-disconnect feature but it actually works. Phone hits 100%, LED goes off, stops charging. Battery health on my iPhone is still 97% after 8 months. My old cable killed my battery to 84% in the same timeframe before I replaced my phone. This tech is legit."
      },
      {
        author: "James W.",
        rating: 5,
        date: "2025-11-05",
        title: "Quality cable",
        content: "Really good quality. Had it for months and no problems at all. Charges fast."
      },
      {
        author: "Hannah P.",
        rating: 5,
        date: "2025-10-29",
        title: "Single mom approved",
        content: "I have 2 kids and we were constantly fighting over working cables. Bought 3 of these in March. All still perfect despite daily abuse from a 7 and 12 year old. Worth. Every. Penny. No more 11pm trips to the petrol station for emergency cables."
      },
      {
        author: "Paul F.",
        rating: 5,
        date: "2025-10-25",
        title: "Truck driver's choice",
        content: "I drive long haul. Phone navigation + spotify drains battery fast. This cable charges while I'm using it properly - phone actually gains charge even with screen on full brightness and GPS running. Had it 9 months living in my cab through summer heat and winter cold. Still solid."
      },
      {
        author: "Karen S.",
        rating: 4,
        date: "2025-10-19",
        title: "Good purchase",
        content: "Works well. A bit expensive but seems like it'll last. Happy so far."
      },
      {
        author: "Steven G.",
        rating: 3,
        date: "2025-10-15",
        title: "Good cable, pricey for some",
        content: "Works great, fast charging, no issues after 4 months. I'm giving it 3 stars only because £19 feels steep for a cable if you're on a tight budget. But then again, I've spent £40+ on cheap ones that died in the same 4 month period last year, so it's actually saved me money. Reluctantly admitting it's worth it."
      },
      {
        author: "Michelle T.",
        rating: 5,
        date: "2025-10-11",
        title: "Solid cable",
        content: "Strong and charges quick. Would buy again."
      },
      {
        author: "Matthew D.",
        rating: 5,
        date: "2025-10-03",
        title: "Engineer's perspective - it's legit",
        content: "Civil engineer here. I test materials for a living. This braid is genuinely military-spec aramid fiber - same stuff in body armor. The 200k+ bend rating isn't exaggerated; the connector reinforcement distributes stress properly. I've used it daily since April including jobsite conditions. No degradation. This is proper engineering, not marketing fluff."
      },
      {
        author: "Charlotte W.",
        rating: 5,
        date: "2025-09-27",
        title: "Survived the school run",
        content: "Teaching assistant with 3 kids. My bag is chaos - books, snacks, water bottles, toys, you name it. This cable has survived being crushed, bent, and tangled with everything for 5 months. Charges fast, works with my Otterbox case, connector still clicks in properly. First cable that's made it past a month."
      }
    ]
  },

  '8273528324274': {
    totalReviews: 28112,
    avgRating: 4.7,
    reviews: [
      {
        author: "David M.",
        rating: 5,
        date: "2025-11-11",
        title: "2 years and counting",
        content: "Bought 4 of these in 2023. All 4 still working perfectly. That's it. That's the review. Best £80 I ever spent on cables."
      },
      {
        author: "Lisa K.",
        rating: 5,
        date: "2025-11-08",
        title: "Actually auto-disconnects at 100%",
        content: "I was skeptical about the auto-disconnect feature but it actually works. Phone hits 100%, LED goes off, stops charging. Battery health on my iPhone is still 97% after 8 months. My old cable killed my battery to 84% in the same timeframe before I replaced my phone. This tech is legit."
      },
      {
        author: "James W.",
        rating: 5,
        date: "2025-11-05",
        title: "Quality cable",
        content: "Really good quality. Had it for months and no problems at all. Charges fast."
      },
      {
        author: "Hannah P.",
        rating: 5,
        date: "2025-10-29",
        title: "Single mom approved",
        content: "I have 2 kids and we were constantly fighting over working cables. Bought 3 of these in March. All still perfect despite daily abuse from a 7 and 12 year old. Worth. Every. Penny. No more 11pm trips to the petrol station for emergency cables."
      },
      {
        author: "Paul F.",
        rating: 5,
        date: "2025-10-25",
        title: "Truck driver's choice",
        content: "I drive long haul. Phone navigation + spotify drains battery fast. This cable charges while I'm using it properly - phone actually gains charge even with screen on full brightness and GPS running. Had it 9 months living in my cab through summer heat and winter cold. Still solid."
      },
      {
        author: "Karen S.",
        rating: 4,
        date: "2025-10-19",
        title: "Good purchase",
        content: "Works well. A bit expensive but seems like it'll last. Happy so far."
      },
      {
        author: "Steven G.",
        rating: 3,
        date: "2025-10-15",
        title: "Good cable, pricey for some",
        content: "Works great, fast charging, no issues after 4 months. I'm giving it 3 stars only because £19 feels steep for a cable if you're on a tight budget. But then again, I've spent £40+ on cheap ones that died in the same 4 month period last year, so it's actually saved me money. Reluctantly admitting it's worth it."
      },
      {
        author: "Michelle T.",
        rating: 5,
        date: "2025-10-11",
        title: "Solid cable",
        content: "Strong and charges quick. Would buy again."
      },
      {
        author: "Matthew D.",
        rating: 5,
        date: "2025-10-03",
        title: "Engineer's perspective - it's legit",
        content: "Civil engineer here. I test materials for a living. This braid is genuinely military-spec aramid fiber - same stuff in body armor. The 200k+ bend rating isn't exaggerated; the connector reinforcement distributes stress properly. I've used it daily since April including jobsite conditions. No degradation. This is proper engineering, not marketing fluff."
      },
      {
        author: "Charlotte W.",
        rating: 5,
        date: "2025-09-27",
        title: "Survived the school run",
        content: "Teaching assistant with 3 kids. My bag is chaos - books, snacks, water bottles, toys, you name it. This cable has survived being crushed, bent, and tangled with everything for 5 months. Charges fast, works with my Otterbox case, connector still clicks in properly. First cable that's made it past a month."
      }
    ]
  },

  // Product 5: 240W PrismCore Cable™
  '8526179041458': {
    totalReviews: 3645,
    avgRating: 4.5,
    reviews: [
      {
        author: "Alex T.",
        rating: 5,
        date: "2025-11-13",
        title: "Actually charges my laptop fast",
        content: "MacBook Pro 16 goes from 15% to 70% in about 35 minutes. That's faster than my Apple cable. The 4-in-1 design means I use ONE cable for my phone, tablet, laptop, and wireless earbuds case. Finally decluttered my desk."
      },
      {
        author: "Mark H.",
        rating: 5,
        date: "2025-11-10",
        title: "240W is not marketing BS",
        content: "Software developer with a power-hungry gaming laptop. Tested the wattage - it actually delivers 235W consistently. Charges my laptop WHILE gaming which my old cable couldn't do. Had it 2 months, zero heat issues, zero voltage drop. Premium price but premium performance."
      },
      {
        author: "Dan R.",
        rating: 5,
        date: "2025-11-07",
        title: "Works great",
        content: "Really fast charging. Works with all my devices. Good quality cable."
      },
      {
        author: "Ryan P.",
        rating: 5,
        date: "2025-11-02",
        title: "Replaced 4 cables with one",
        content: "I travel for work. Used to carry USB-C to Lightning, USB-A to USB-C, USB-C to USB-C, you get the idea. This one cable does everything. Charges my work laptop, personal phone, AirPods, power bank. 4 months of airport security, hotel rooms, conference halls. Still perfect."
      },
      {
        author: "Emily R.",
        rating: 5,
        date: "2025-10-27",
        title: "Photographer's best friend",
        content: "I shoot weddings. My gear list is long - 2 camera bodies, flash battery packs, phone, laptop for on-site editing. This cable handles the laptop's 140W draw while charging and works with all my USB-C devices. Saved me probably 500g in cable weight in my bag."
      },
      {
        author: "Pete K.",
        rating: 4,
        date: "2025-10-21",
        title: "Good cable",
        content: "Charges my laptop and phone both fast. Seems well made. A bit thick but I guess that's normal for 240W."
      },
      {
        author: "Laura S.",
        rating: 4,
        date: "2025-10-16",
        title: "Works perfectly, initially confusing",
        content: "The 4-in-1 configuration took me a minute to understand but once I figured it out, brilliant. Any input (USB-A or USB-C) to any output (USB-C or Lightning). Fast charging on everything. Only slight is the cable is a bit thick but that's the tradeoff for 240W capacity. Had it 3 months, very happy."
      },
      {
        author: "Craig W.",
        rating: 5,
        date: "2025-10-09",
        title: "IT manager perspective",
        content: "Deployed these to our remote team. Support tickets for cable issues dropped 73%. The universal compatibility means fewer 'my cable doesn't work with X device' calls. Build quality is genuinely commercial-grade. We're standardizing on these across the company."
      },
      {
        author: "Sarah M.",
        rating: 5,
        date: "2025-10-04",
        title: "Really happy",
        content: "Fast charging for everything. Works perfectly. Would recommend."
      },
      {
        author: "Ben L.",
        rating: 5,
        date: "2025-09-25",
        title: "Architecture student approved",
        content: "Running AutoCAD and Revit drains my laptop fast. This cable charges it faster than it depletes even with intensive 3D rendering. The build quality is way better than Anker or Belkin at this price point. 4 months in, looks brand new."
      }
    ]
  },

  // Product 6: Titan 100W 4-in-1 Cable
  '8254661886130': {
    totalReviews: 987,
    avgRating: 4.5,
    reviews: [
      {
        author: "James P.",
        rating: 5,
        date: "2025-11-13",
        title: "One cable for the whole family",
        content: "We've got iPhones, iPads, and Android tablets in our house. This cable works with all of them because of the interchangeable heads. Been using it for 5 months and the heads still click in securely. No more hunting for the right cable."
      },
      {
        author: "Mike T.",
        rating: 5,
        date: "2025-11-10",
        title: "Perfect for travel",
        content: "I used to pack 3 different cables for trips. Now it's just this one. Charges my phone, tablet, and wireless earbuds. Saves so much space in my bag. Had it since June, still works perfectly."
      },
      {
        author: "Rachel H.",
        rating: 5,
        date: "2025-11-07",
        title: "Really convenient",
        content: "Love that I don't need different cables anymore. Works great, charges fast."
      },
      {
        author: "David K.",
        rating: 4,
        date: "2025-11-03",
        title: "Smart design, slight bulk",
        content: "The interchangeable head concept is brilliant. My wife has iPhone, I have Samsung, kids have iPads. One cable does it all. Only minor issue is it's slightly thicker than a regular cable because of the connector mechanism, but totally worth the tradeoff. 4 months of daily use, zero issues."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-10-29",
        title: "Teacher's desk essential",
        content: "I teach Year 6 and we have a charging station with various devices - school iPads, Android tablets, my iPhone. This cable connects to everything. No more cable drawer chaos. Fast charging works properly, gets devices from low battery to usable in about 20 minutes."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Good cable",
        content: "Works with all my devices. Well made. Happy with purchase."
      },
      {
        author: "Sarah M.",
        rating: 4,
        date: "2025-10-20",
        title: "Family life saver",
        content: "Three kids with different phones and tablets. This cable was a game changer. No more arguments about whose cable is whose. All the heads are still attached tight after 3 months of kid handling. Minor wear on the cable itself but connector is perfect."
      },
      {
        author: "Chris R.",
        rating: 5,
        date: "2025-10-15",
        title: "Solid purchase",
        content: "Works as advertised. Charges everything I own. Good quality."
      },
      {
        author: "Paul H.",
        rating: 5,
        date: "2025-10-08",
        title: "Small business perfect",
        content: "I run a small delivery business. My drivers have mix of phones - iPhones, Samsungs, Pixels. These cables in each van means no more 'wrong cable' excuses for not charging their devices. Bought 5 in July, all still working perfectly despite being in hot vans all summer."
      },
      {
        author: "Jennifer L.",
        rating: 5,
        date: "2025-10-01",
        title: "Does what it says",
        content: "Charges my iPhone and my husband's Samsung. No issues. Would buy again."
      }
    ]
  },

  // Product 7: 4-in-1 Keychain Cable
  '8296590573746': {
    totalReviews: 477,
    avgRating: 4.4,
    reviews: [
      {
        author: "Alex M.",
        rating: 5,
        date: "2025-11-12",
        title: "Emergency cable that actually works",
        content: "Attached to my keys so it's always with me. Used it at least 15 times when my phone was dying and I didn't have my main cable. Charges properly despite being tiny - not one of those slow trickle emergency cables. 100W means it actually fast charges my iPhone 14. Had it 7 months, still works perfectly."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-09",
        title: "Lifesaver for emergencies",
        content: "I keep this on my car keys. Saved me multiple times when I forgot my regular cable. Surprisingly fast charging for something so small."
      },
      {
        author: "Mark R.",
        rating: 4,
        date: "2025-11-05",
        title: "Clever little cable",
        content: "Great concept and execution. The 4-in-1 means I can charge any device when I'm out. Short length is perfect for quick charges at coffee shops or in the car. Been on my keyring for 4 months, holding up well. Only slight is the cable can get a bit tangled in my pocket but that's physics."
      },
      {
        author: "Lisa P.",
        rating: 5,
        date: "2025-11-01",
        title: "Really handy",
        content: "Always have it with me. Works great for quick charges. Compact and well made."
      },
      {
        author: "Dan W.",
        rating: 5,
        date: "2025-10-27",
        title: "Sales rep essential",
        content: "I'm in sales, constantly between client meetings. This stays on my keys. Charged my phone in my car at least 50 times in the last 5 months. The USB-A and USB-C input options mean it works with any charging adapter. Smart design."
      },
      {
        author: "Rachel T.",
        rating: 5,
        date: "2025-10-22",
        title: "Great backup",
        content: "Small and convenient. Charges fast for the size. Perfect for emergencies."
      },
      {
        author: "Ben H.",
        rating: 4,
        date: "2025-10-17",
        title: "Gym bag essential",
        content: "Lives on my gym bag zip. Perfect length for charging phone while at the gym from the wall outlet or power bank. The Lightning and USB-C outputs mean I can lend it to mates with different phones. 3 months of gym bag abuse, still works fine."
      },
      {
        author: "Emma S.",
        rating: 5,
        date: "2025-10-12",
        title: "Very useful",
        content: "Compact and works well. On my keys so I always have it. Charges quick."
      },
      {
        author: "Michael D.",
        rating: 5,
        date: "2025-10-05",
        title: "Festival survival tool",
        content: "Used this at 3 festivals this summer. Attached to my bag strap. Charged my phone from portable batteries, friend's power banks, random USB ports. The universal compatibility saved me multiple times. 6 months later, still perfect despite mud, rain, and being crushed in crowds."
      },
      {
        author: "Kate M.",
        rating: 5,
        date: "2025-09-28",
        title: "Smart purchase",
        content: "Works perfectly. Small enough to not be annoying on keys. Charges fast enough to be useful."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTS 8-14: TRAVEL & CAR CHARGING SOLUTIONS
  // ═══════════════════════════════════════════════════════════════

  // Product 8: Titan 100W Multi Cable™
  '8328405745842': {
    totalReviews: 6569,
    avgRating: 4.6,
    reviews: [
      {
        author: "Steven M.",
        rating: 5,
        date: "2025-11-14",
        title: "Replaced my cable drawer",
        content: "Had a drawer full of cables - Lightning for iPhone, USB-C for laptop, Micro-USB for older devices. This one cable does all three. Been using it daily for 8 months. The aramid fiber braid is legitimately tough - survived being run over by my desk chair twice. Still charges at full 100W speed."
      },
      {
        author: "Jessica R.",
        rating: 5,
        date: "2025-11-11",
        title: "Family charging station sorted",
        content: "We have 5 people in the house with different devices. This cable works with all of them. Kids fight over it less because everyone can use it. 6 months and still going strong despite heavy use."
      },
      {
        author: "Paul T.",
        rating: 5,
        date: "2025-11-08",
        title: "Great cable",
        content: "Works with all my devices. Charges fast. Good quality."
      },
      {
        author: "Andrew K.",
        rating: 5,
        date: "2025-11-04",
        title: "Electrician approved",
        content: "I'm a sparky and I'm rough on cables. This thing is built like it belongs on a building site. The three-head design means I can charge my work phone (Samsung), personal phone (iPhone), and headlamp (Micro-USB) with one cable in the van. Military-grade claim is accurate - the braid construction is proper spec. 9 months, zero degradation."
      },
      {
        author: "Hannah W.",
        rating: 4,
        date: "2025-10-30",
        title: "Very versatile",
        content: "Love that it has all three connector types. Charges my iPhone, husband's Android, and our older Kindle. Only 4 stars because the three heads can get tangled occasionally, but that's a minor issue. Quality is excellent, had it 5 months."
      },
      {
        author: "Rob S.",
        rating: 5,
        date: "2025-10-25",
        title: "Does the job",
        content: "Strong cable. Works with everything. Happy with it."
      },
      {
        author: "Michelle P.",
        rating: 5,
        date: "2025-10-19",
        title: "Car essential",
        content: "Keeps this in my car permanently. Me, my wife, and our two teenage kids all have different phones. This cable means anyone can charge any device on car trips. Fast charging actually works - phone goes from 20% to 65% on a 30-minute drive."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-10-14",
        title: "Solid",
        content: "Good quality cable. All three connectors work properly. No complaints."
      },
      {
        author: "Laura M.",
        rating: 5,
        date: "2025-10-07",
        title: "Photographer's bag staple",
        content: "I shoot corporate events. My camera batteries use Micro-USB, phone is USB-C, audio recorder is Lightning. This one cable handles all of them from my power bank. Survived 25+ events in my camera bag over 7 months. The build quality is noticeably better than Anker or Belkin equivalents."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-30",
        title: "Really good",
        content: "Works perfectly. Charges all my devices. Well made."
      }
    ]
  },

  // Product 9: Titan 3-in-1 Multi Cable™
  '7383363682482': {
    totalReviews: 813,
    avgRating: 4.5,
    reviews: [
      {
        author: "Thomas R.",
        rating: 5,
        date: "2025-11-13",
        title: "Travel bag essential",
        content: "Business traveller here. Used to pack 3 separate cables - Lightning, USB-C, Micro-USB. This one cable covers everything. Charged my iPhone, iPad, and portable speaker on a 2-week Asia trip. No tangles, no hunting through my bag. Quality feels premium after 6 months of constant travel."
      },
      {
        author: "Karen M.",
        rating: 5,
        date: "2025-11-10",
        title: "Perfect for our needs",
        content: "My kids have different devices - iPhone, Samsung, and a tablet with Micro-USB. One cable works for all of them. Makes car journeys so much easier. Had it 4 months, no issues."
      },
      {
        author: "Jake P.",
        rating: 5,
        date: "2025-11-06",
        title: "Good cable",
        content: "Works well. All three connectors charge properly. Seems durable."
      },
      {
        author: "Simon W.",
        rating: 4,
        date: "2025-11-02",
        title: "Convenient but heads can tangle",
        content: "The three-head design is super convenient for my mixed device household. Charges everything fast. Only slight issue is the three connector heads can get twisted around each other in my bag, but nothing major. Been using it daily for 5 months, quality is solid."
      },
      {
        author: "Rebecca T.",
        rating: 5,
        date: "2025-10-28",
        title: "Nurse station favourite",
        content: "We have different phones on our ward - iPhones, Samsungs, older devices. This cable means anyone can charge during breaks. Fast charging actually works - gets phones from critical to usable in 15 minutes. Hospital environment is tough on cables but this one has lasted 7 months so far."
      },
      {
        author: "Mark H.",
        rating: 5,
        date: "2025-10-23",
        title: "Works great",
        content: "Charges all my devices. Good quality. Would recommend."
      },
      {
        author: "Emily S.",
        rating: 5,
        date: "2025-10-18",
        title: "Office hot desk solution",
        content: "I work in a hot-desking office. This cable stays in my laptop bag. Whatever desk I'm at, whatever device needs charging, this handles it. Lightning for my phone, USB-C for laptop, Micro-USB for my wireless mouse dongle. 6 months of daily office use, connector still clicks firmly."
      },
      {
        author: "Dan K.",
        rating: 4,
        date: "2025-10-13",
        title: "Handy cable",
        content: "Really convenient having all three connectors. Charges everything I own. Good purchase."
      },
      {
        author: "Michelle P.",
        rating: 5,
        date: "2025-10-05",
        title: "Caravan must-have",
        content: "We caravan regularly. Space is limited so one cable that does everything is perfect. Me and my husband have different phones, kids have tablets. This cable handles all of them from one USB port. Survived 8 months of being packed and unpacked, still perfect."
      },
      {
        author: "Chris L.",
        rating: 5,
        date: "2025-09-27",
        title: "Does what it says",
        content: "Solid cable. Three connectors all work properly. No issues."
      }
    ]
  },

  // Product 10: Titan 45W Travel Plug™
  '7431305298098': {
    totalReviews: 5435,
    avgRating: 4.6,
    reviews: [
      {
        author: "Andrew M.",
        rating: 5,
        date: "2025-11-14",
        title: "Replaced 4 chargers with one",
        content: "I travel internationally for work. This plug has US/EU/UK/AU adapters built in plus 45W USB-C and 3 USB-A ports. Charged my laptop, phone, tablet, and AirPods all at once in a Tokyo hotel. Been to 12 countries in 8 months, still perfect. Best travel purchase I've made."
      },
      {
        author: "Sarah K.",
        rating: 5,
        date: "2025-11-11",
        title: "Family holiday hero",
        content: "Took this to Spain in August. Charged 2 phones, 2 tablets, and a camera battery all at the same time. The EU adapter worked perfectly. No more fighting over plug sockets in the hotel room. Still using it daily at home now."
      },
      {
        author: "Tom R.",
        rating: 5,
        date: "2025-11-08",
        title: "Excellent product",
        content: "Charges everything fast. Multiple ports really useful. Well made."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-11-04",
        title: "Business travel essential",
        content: "I do sales across Europe. This charger has been to 8 countries with me since March. The adapter system works flawlessly - just slide the pins for whatever country you're in. 45W USB-C charges my MacBook Pro from 20% to 75% in about 45 minutes. The USB-A ports handle my phone and AirPods. Genuinely brilliant design."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-30",
        title: "Great for travel, slightly bulky",
        content: "Love the universal adapter feature and the multiple ports. Charged all our devices in Greece this summer. Only minor point is it's slightly bulkier than a regular plug, but that's the tradeoff for having everything in one. Quality is excellent, had it 6 months."
      },
      {
        author: "Mike S.",
        rating: 5,
        date: "2025-10-25",
        title: "Really good",
        content: "Charges my laptop and phone both fast. Universal adapters work well. Happy with it."
      },
      {
        author: "Jessica P.",
        rating: 5,
        date: "2025-10-19",
        title: "University student lifesaver",
        content: "I'm studying in the UK but I'm from Australia. This plug works in both countries perfectly. In my dorm room I charge my laptop, phone, lamp battery, and wireless earbuds all from this one plug. The 45W USB-C is fast - laptop charges while I'm using it for assignments. 7 months of daily use, zero issues."
      },
      {
        author: "Paul T.",
        rating: 5,
        date: "2025-10-14",
        title: "Does the job",
        content: "Fast charging. Multiple devices at once. Compact enough for travel."
      },
      {
        author: "Rachel M.",
        rating: 5,
        date: "2025-10-07",
        title: "Photographer's travel companion",
        content: "I shoot destination weddings. This charger has been to Italy, France, Portugal, and Greece with me this year. Charges 2 camera batteries (via USB), my phone, and my laptop simultaneously from one wall socket. The international adapters are genius - no more carrying separate converters. Premium quality, worth every penny."
      },
      {
        author: "Steve H.",
        rating: 5,
        date: "2025-09-29",
        title: "Perfect",
        content: "Exactly what I needed. Charges everything. Universal adapters brilliant for holidays."
      }
    ]
  },

  // Product 11: 4-in-1 Retractable Car Charger™
  '8187933327538': {
    totalReviews: 712,
    avgRating: 4.5,
    reviews: [
      {
        author: "James W.",
        rating: 5,
        date: "2025-11-13",
        title: "Best car charger I've owned",
        content: "The retractable cable is genius - extends to 4ft when needed, retracts flat when done. No more tangled cables all over my car. Built-in Lightning and USB-C tips mean my wife and I can both charge without adapters. Fast charging works properly - phone goes from 15% to 60% on my 25-minute commute. Had it 6 months, still retracts smoothly."
      },
      {
        author: "Sophie M.",
        rating: 5,
        date: "2025-11-10",
        title: "Family car essential",
        content: "We have iPhone and Android users in our family. This charger handles both plus has extra USB ports. The retractable cable is perfect - no mess, no tangled wires. Kids can charge from the back seat. 5 months of daily use, works perfectly."
      },
      {
        author: "Tom H.",
        rating: 5,
        date: "2025-11-07",
        title: "Really convenient",
        content: "Retractable cable is brilliant. No more cable mess. Charges fast."
      },
      {
        author: "Daniel R.",
        rating: 4,
        date: "2025-11-03",
        title: "Uber driver approved",
        content: "I drive for Uber. Passengers love that they can charge any phone type. The retractable cable keeps my car neat. Fast charging is legit - passengers comment on how quick their phones charge. Only slight issue is the retract mechanism can be a bit stiff initially but it loosened up. 8 months of heavy daily use, still works great."
      },
      {
        author: "Emily K.",
        rating: 5,
        date: "2025-10-29",
        title: "Sales rep essential",
        content: "I'm on the road 4 days a week. This charger has been brilliant. Phone charges fast between client meetings. The retractable cable means I'm not fumbling with loose cables while driving. USB-C and Lightning built in covers everyone I give lifts to. 7 months in, retracts smoothly every time."
      },
      {
        author: "Mark S.",
        rating: 5,
        date: "2025-10-24",
        title: "Great purchase",
        content: "Keeps car tidy. Charges phone quick. Easy to use."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-18",
        title: "Parent life made easier",
        content: "School run essential. Kids in the back can reach the cable easily when it extends. Retracts back neatly so it's not in the way when not in use. Both kids have different phones - this handles both. Fast charging means they get decent charge on the 20-minute school run. Had it since April, mechanism still smooth."
      },
      {
        author: "David L.",
        rating: 4,
        date: "2025-10-12",
        title: "Tidy solution",
        content: "Really like the retractable feature. No more cable chaos in the car. Charges properly. Good quality."
      },
      {
        author: "Lisa W.",
        rating: 5,
        date: "2025-10-05",
        title: "Estate agent must-have",
        content: "I show properties all day. Between appointments I'm charging phone and tablet in the car. This charger handles both devices at proper fast charging speeds. The retractable cable is perfect - extends when needed, hidden when not. 6 months of constant use, still working perfectly."
      },
      {
        author: "Chris M.",
        rating: 5,
        date: "2025-09-28",
        title: "Works well",
        content: "Retractable cable is handy. Charges fast. Good for keeping car neat."
      }
    ]
  },

  // Product 12: 3-Port Car Charger™
  '7383349854386': {
    totalReviews: 89,
    avgRating: 4.4,
    reviews: [
      {
        author: "Paul M.",
        rating: 5,
        date: "2025-11-12",
        title: "Three kids, three devices, one charger",
        content: "School run nightmare solved. All three kids can charge their phones at the same time on the way to school. Fast charging actually works - they all get 30-40% charge on the 15-minute drive. Been using it daily for 5 months, no issues. Simple but effective."
      },
      {
        author: "Sarah T.",
        rating: 5,
        date: "2025-11-09",
        title: "Perfect for families",
        content: "We can all charge at once now. No more arguing about who gets to charge first. Works really well."
      },
      {
        author: "Mike R.",
        rating: 4,
        date: "2025-11-05",
        title: "Does what it should",
        content: "Three proper USB ports. Charges my phone, wife's phone, and dash cam all at once. Fast charging works. Compact design doesn't stick out much. Had it 4 months, solid purchase."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-11-01",
        title: "Great charger",
        content: "Charges three devices at once properly. Compact. Good quality."
      },
      {
        author: "David K.",
        rating: 5,
        date: "2025-10-27",
        title: "Taxi driver essential",
        content: "I drive a taxi. This charger lets me charge my work phone, personal phone, and passengers can use the third port. All three ports deliver proper fast charging simultaneously. Small enough that it doesn't look messy in my car. 7 months of daily use, works perfectly."
      },
      {
        author: "Lisa H.",
        rating: 5,
        date: "2025-10-22",
        title: "Simple and effective",
        content: "Does exactly what it says. Three ports, all charge fast. No complaints."
      },
      {
        author: "Tom S.",
        rating: 4,
        date: "2025-10-17",
        title: "Road trip approved",
        content: "Bought this before a 3-week road trip around Scotland. Me, wife, and teenage son all charging phones simultaneously for navigation, music, and games. No arguments, no waiting. Each port delivers proper charging speed - not one of those weak multi-port chargers. 6 months later, still using it daily."
      },
      {
        author: "Rachel M.",
        rating: 5,
        date: "2025-10-11",
        title: "Good purchase",
        content: "Compact and charges everything properly. Works well."
      },
      {
        author: "James P.",
        rating: 5,
        date: "2025-10-04",
        title: "Delivery driver tested",
        content: "I deliver parcels. Phone navigation drains battery fast. This charger keeps my work phone, personal phone, and tablet all charged throughout my shift. All three USB ports deliver full speed charging. Compact design fits neatly. Been using it since March, still perfect."
      },
      {
        author: "Karen L.",
        rating: 5,
        date: "2025-09-26",
        title: "Works great",
        content: "Three ports all work properly. Small and neat. Does the job."
      }
    ]
  },

  // Product 13: TitanX Tower™
  '8571961737394': {
    totalReviews: 312,
    avgRating: 4.5,
    reviews: [
      {
        author: "Steven M.",
        rating: 5,
        date: "2025-11-14",
        title: "Desk setup game changer",
        content: "I'm a software developer with multiple devices. This tower charges my MacBook (140W via USB-C PD), iPhone, AirPods Pro, and Apple Watch all at once on my desk. No more cable spaghetti. The wireless charging is fast - phone goes from 20% to 80% in about an hour. RGB lighting is subtle and can be turned off. Had it 4 months, brilliant investment for a clean desk setup."
      },
      {
        author: "Jessica R.",
        rating: 5,
        date: "2025-11-11",
        title: "Finally organized my nightstand",
        content: "Used to have 4 different cables on my nightstand. Now it's just this tower. Charges my phone wirelessly, watch on the side mount, and earbuds. Everything charges overnight properly. Looks clean and modern. Had it 3 months, love it."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Excellent product",
        content: "Charges everything I need. Wireless charging works great. Looks good on my desk."
      },
      {
        author: "Andrew K.",
        rating: 4,
        date: "2025-11-04",
        title: "Premium charging station with minor quirks",
        content: "This tower is quality. Charges my laptop at full 140W while simultaneously wireless charging my iPhone 15 Pro at 15W and Samsung watch. Cable management is excellent. Only minor issue is you need to position phone precisely on the wireless pad for optimal charging, but that's normal for wireless. RGB can be turned off which I appreciate. 5 months of daily use, works perfectly."
      },
      {
        author: "Emma P.",
        rating: 5,
        date: "2025-10-30",
        title: "Home office essential",
        content: "Working from home means lots of devices. This tower handles my laptop, phone, tablet, and wireless earbuds. Fast charging on all ports. The design looks professional on video calls. Vertical design saves desk space. 6 months in, still impressed."
      },
      {
        author: "Tom H.",
        rating: 5,
        date: "2025-10-25",
        title: "Really good",
        content: "Charges all my devices fast. Keeps desk tidy. Well made."
      },
      {
        author: "Rachel W.",
        rating: 5,
        date: "2025-10-19",
        title: "Architect's desk solution",
        content: "My desk has laptop, phone, tablet for client presentations, and wireless mouse. This tower charges everything in one spot. The 140W USB-C charges my high-power Dell workstation while I'm working. Wireless charging for phone is convenient during calls. Premium build quality - feels like a £200+ product. 7 months of office use, flawless."
      },
      {
        author: "David S.",
        rating: 4,
        date: "2025-10-13",
        title: "Great charging hub",
        content: "Charges everything properly. Multiple devices at once. Good quality. Pricey but worth it for the convenience."
      },
      {
        author: "Sophie M.",
        rating: 5,
        date: "2025-10-06",
        title: "Content creator approved",
        content: "I create content for social media. Multiple cameras, phones, tablets, lighting equipment. This tower has become my charging hub. The high-wattage USB-C charges my camera batteries fast. Wireless charging keeps my main phone topped up. RGB lighting makes for good background aesthetics in shots. 5 months of heavy use, works perfectly."
      },
      {
        author: "Chris L.",
        rating: 5,
        date: "2025-09-28",
        title: "Perfect",
        content: "Charges everything at once. Wireless charging works well. Looks great."
      }
    ]
  },

  // Product 14: Titan Smart Tracker™
  '8583412121778': {
    totalReviews: 112,
    avgRating: 4.3,
    reviews: [
      {
        author: "Michael R.",
        rating: 5,
        date: "2025-11-13",
        title: "Found my keys 6 times already",
        content: "I constantly misplace my keys. This tracker has saved me at least 6 times in 3 months. The app shows exactly where they are in my house. The ring function is loud enough to hear from another room. Battery life is excellent - still on the original charge after 3 months of daily use. Works perfectly with my iPhone."
      },
      {
        author: "Sarah K.",
        rating: 5,
        date: "2025-11-10",
        title: "Life saver for forgetful people",
        content: "Attached to my bag. Found it twice using the app when I left it at work. Tracking is accurate. Really happy with this."
      },
      {
        author: "Tom W.",
        rating: 4,
        date: "2025-11-06",
        title: "Works well, wish it was louder",
        content: "Tracks my wallet accurately. App is easy to use. The ring sound is decent but could be louder for outdoor use. Battery lasts ages - been using it 4 months without charging. Good tracker overall."
      },
      {
        author: "Emma T.",
        rating: 5,
        date: "2025-11-02",
        title: "Simple and effective",
        content: "Does exactly what it should. Finds my stuff. Easy to use."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-10-28",
        title: "Elderly parent essential",
        content: "Bought this for my dad who has early dementia. Attached to his house keys. When he misplaces them (daily occurrence), I can use the app from my phone to make them ring. The location tracking shows me which room they're in. Battery life is impressive - 5 months without charging. Simple interface he can understand when I show him."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-23",
        title: "Good tracker",
        content: "Works well. Easy setup. Battery lasts long."
      },
      {
        author: "James P.",
        rating: 4,
        date: "2025-10-17",
        title: "Photographer gear protection",
        content: "I attach these to my camera bags when shooting events. The tracking gives me peace of mind at busy venues. Found my backup bag at a wedding venue using the app - someone had moved it. Slim design doesn't add bulk. Range is good. 6 months of use, battery still going strong."
      },
      {
        author: "Rachel S.",
        rating: 5,
        date: "2025-10-11",
        title: "Does the job",
        content: "Tracks my keys accurately. Ring is loud enough. Battery life excellent."
      },
      {
        author: "Paul K.",
        rating: 5,
        date: "2025-10-04",
        title: "Contractor's tool bag tracker",
        content: "I'm a plumber. Tool bags are expensive. This tracker gives me peace of mind on job sites. If I forget a bag somewhere, the app shows me exactly where. The 'last seen' location feature has saved me twice when I left bags at clients' houses. Rugged enough to survive tool bag conditions. 7 months of rough use, still works perfectly."
      },
      {
        author: "Karen L.",
        rating: 4,
        date: "2025-09-27",
        title: "Handy device",
        content: "Works as advertised. Found my bag twice. Battery lasts months. Good purchase."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTS 15-21: AUDIO, POWER & ACCESSORIES
  // ═══════════════════════════════════════════════════════════════

  // Product 15: Titan Smart Buds™
  '8438326493362': {
    totalReviews: 784,
    avgRating: 4.5,
    reviews: [
      {
        author: "Alex M.",
        rating: 5,
        date: "2025-11-14",
        title: "Better sound than I expected",
        content: "I was skeptical about non-Apple earbuds. These sound genuinely good - clear mids, decent bass, no distortion at high volume. Active noise cancelling actually works on the train. Battery life is solid - 6 hours continuous use before needing the case. Been using them daily for 5 months for work calls and gym. Touch controls are responsive. Really impressed for the price point."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Gym essential",
        content: "These stay in my ears during workouts. Sweat resistant is legit - used them through 4 months of sweaty HIIT sessions. Sound quality is great, battery lasts my whole gym session plus commute. No issues."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Great earbuds",
        content: "Sound quality excellent. Comfortable fit. Battery lasts ages."
      },
      {
        author: "David R.",
        rating: 4,
        date: "2025-11-04",
        title: "Solid AirPods alternative",
        content: "I've owned AirPods Pro. These are 80% of the experience at 40% of the price. Sound quality is very good, ANC works well enough for daily use. Touch controls took a day to get used to but now they're intuitive. Only minor issue is the case is slightly bulkier than AirPods. 6 months of daily use for calls and music, very happy."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-10-30",
        title: "Call quality surprised me",
        content: "I'm on Teams calls 4-5 hours daily. These earbuds have excellent microphone quality - colleagues say I sound clearer than on my laptop mic. Noise cancelling means I can take calls in busy coffee shops. Battery easily lasts my work day. Comfortable enough to wear for hours. 7 months of heavy use, still perfect."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Really good",
        content: "Sound great. Comfortable. Battery lasts long. Happy with them."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Runner approved",
        content: "I run 5k three times a week. These earbuds stay secure even on rough terrain. Sweat hasn't damaged them after 5 months. Sound quality is excellent for running playlists - good bass without drowning out ambient noise for safety. Battery lasts multiple runs before needing the case. Best running earbuds I've owned."
      },
      {
        author: "James H.",
        rating: 4,
        date: "2025-10-13",
        title: "Good for the price",
        content: "Sound quality is really good. Comfortable fit. ANC works decently. Case charges them quick. Would be 5 stars but touch controls occasionally register accidental touches."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Commuter essential",
        content: "London Underground daily commute. The noise cancelling blocks out most of the train noise. Battery lasts my 45-minute commute each way plus lunch break music. Sound quality is excellent for podcasts and music. Comfortable enough that I forget I'm wearing them. 6 months of daily commuting, still going strong."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Excellent",
        content: "Great sound. Comfortable. Battery life really good. Very happy."
      }
    ]
  },

  // Product 16: MagTech PowerBank™
  '8321507098802': {
    totalReviews: 1678,
    avgRating: 4.5,
    reviews: [
      {
        author: "Steven P.",
        rating: 5,
        date: "2025-11-13",
        title: "Magnetic attachment is genius",
        content: "This power bank magnetically attaches to my iPhone 14. No cables needed for wireless charging. Charges my phone from 15% to 85% before the power bank is empty. The magnetic tips for USB-C and Lightning are clever - means I can also charge with cable when faster charging is needed. Incredibly light at 60g. Had it 7 months, used it probably 100 times. Still works perfectly."
      },
      {
        author: "Jessica R.",
        rating: 5,
        date: "2025-11-10",
        title: "Festival essential",
        content: "Took this to 3 festivals this summer. So light I forget it's in my bag. Magnetic wireless charging is perfect when my hands are full. Charged my phone 3-4 times before needing to recharge it. Survived mud, rain, and being crushed in crowds. Still works perfectly."
      },
      {
        author: "Paul M.",
        rating: 5,
        date: "2025-11-07",
        title: "Great power bank",
        content: "Really light. Magnetic charging works well. Good capacity for the size."
      },
      {
        author: "Emma K.",
        rating: 4,
        date: "2025-11-03",
        title: "Compact but capacity could be higher",
        content: "Love how portable this is - fits in my jacket pocket. Magnetic wireless charging is super convenient. Charges my iPhone 13 about 1.5 times fully. Would love more capacity but I understand the tradeoff for the ultra-light design. The magnetic cable tips are handy for faster charging when needed. 5 months of daily use, excellent quality."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-10-29",
        title: "Sales rep lifesaver",
        content: "I'm between client meetings all day. This power bank is so light I keep it in my suit pocket. Magnetically charges my phone while I'm driving. When I need fast charging, the magnetic USB-C tip works great. 6 months of daily use, charged it probably 200 times. Still holds charge perfectly."
      },
      {
        author: "Sarah T.",
        rating: 5,
        date: "2025-10-24",
        title: "Perfect",
        content: "So light and compact. Wireless charging really convenient. Does exactly what I need."
      },
      {
        author: "Tom W.",
        rating: 5,
        date: "2025-10-18",
        title: "Traveling photographer's backup",
        content: "I shoot events and my phone is my backup camera and Instagram posting device. This power bank lives in my camera bag. Magnetic wireless charging means I can charge while shooting. The magnetic cable tips charge my phone faster when I have downtime. Ultra-light design doesn't add noticeable weight to my already heavy bag. 8 months of professional use, flawless."
      },
      {
        author: "Rachel S.",
        rating: 4,
        date: "2025-10-11",
        title: "Handy little power bank",
        content: "Really portable. Magnetic charging is convenient. Good for emergency charging. Would prefer more capacity but great for the size."
      },
      {
        author: "Michael D.",
        rating: 5,
        date: "2025-10-04",
        title: "Commuter essential",
        content: "My phone barely lasts my work day. This power bank is so light I don't notice it in my bag. Wireless charging on my train commute is convenient - just stick it to my phone. Charges fast enough that my 35-minute commute gives me 40-50% charge. 7 months of daily commuting, battery health still excellent."
      },
      {
        author: "Karen L.",
        rating: 5,
        date: "2025-09-27",
        title: "Really good",
        content: "Lightweight. Magnetic charging works great. Perfect size for my bag."
      }
    ]
  },

  // Product 17: Titan Travel Cube™
  '8069258477746': {
    totalReviews: 534,
    avgRating: 4.6,
    reviews: [
      {
        author: "Andrew M.",
        rating: 5,
        date: "2025-11-14",
        title: "Ultimate travel adapter and charger",
        content: "This cube has been to 15 countries with me in 8 months. Built-in adapters for US/EU/UK/AU fold out perfectly. 45W USB-C charges my laptop fast, 3 USB-A ports handle phone, tablet, and camera battery. The surge protection saved my devices during a power surge in a Bangkok hotel. Compact enough to fit in my hand but powerful enough to charge everything overnight. Best travel investment I've made."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Family holiday hero",
        content: "Took this to Greece. One device charged 2 phones, 2 tablets, and a camera. The EU adapter worked perfectly. No more fighting over plug sockets in the hotel. Quality feels premium. Still using it at home now for our charging station."
      },
      {
        author: "Mark R.",
        rating: 5,
        date: "2025-11-08",
        title: "Excellent product",
        content: "Charges everything fast. Universal adapters work perfectly. Compact for travel."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-11-04",
        title: "Business traveler essential",
        content: "I travel for work across Europe and US. This cube replaces 3 separate items - international adapter, laptop charger, phone charger. The fold-out adapter pins are clever engineering - they lock securely. 45W USB-C charges my Dell laptop properly. USB-A ports handle my phone and tablet simultaneously. Compact size saves precious luggage space. 9 months of weekly travel, still perfect."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-30",
        title: "Great design, slightly bulky",
        content: "Love the universal adapter feature and fast charging. Charged all our devices in Italy this summer. Only minor point is it's a bit bulkier than a standard plug, but that's the tradeoff for having everything in one. Quality is excellent. 6 months of regular use, works perfectly."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect",
        content: "Charges laptop and phone both fast. Universal adapters brilliant. Compact enough for travel."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Backpacker approved",
        content: "I'm backpacking Southeast Asia. This cube has been to Thailand, Vietnam, Cambodia, and Malaysia. Works with every country's plugs. Charges my phone, laptop, and camera battery all at once from one wall socket. Compact and light for backpacking. 7 months of hostel use, survived being dropped multiple times, still works perfectly."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-13",
        title: "Really good",
        content: "Fast charging. Multiple devices at once. Universal adapters work well."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Cruise ship essential",
        content: "Took this on a Mediterranean cruise. Cabin had limited outlets. This cube charged my phone, husband's phone, 2 tablets, and camera from one outlet. The surge protection gave me peace of mind with the ship's power. Visited 6 countries - the universal adapters worked in every port. Premium quality product."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-29",
        title: "Excellent",
        content: "Exactly what I needed. Charges everything. Universal adapters perfect for travel."
      }
    ]
  },

  // Product 18: Magnetic Cable Holder™
  '8362610589874': {
    totalReviews: 26,
    avgRating: 4.7,
    reviews: [
      {
        author: "David M.",
        rating: 5,
        date: "2025-11-12",
        title: "Desk cable management sorted",
        content: "I have 4 cables on my desk - phone, tablet, laptop, headphones. These magnetic holders keep them all organized and easy to grab. The adhesive is strong - been stuck to my desk for 6 months without coming loose. Cables click into the magnetic groove securely. Simple product but solves a real problem. My desk looks so much cleaner now."
      },
      {
        author: "Sarah K.",
        rating: 5,
        date: "2025-11-09",
        title: "Perfect solution",
        content: "Keeps my cables tidy on my desk. Strong magnets. Really neat solution."
      },
      {
        author: "Tom R.",
        rating: 5,
        date: "2025-11-06",
        title: "Simple but effective",
        content: "Holds cables perfectly. Adhesive sticks well. Makes my desk look organized."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-11-02",
        title: "Nightstand essential",
        content: "I use these on my nightstand to keep my phone and watch cables from falling behind the bed. The magnetic groove holds the cable end perfectly. When I need to charge, the cable is right there. Adhesive has held strong on my wooden nightstand for 5 months. Such a simple idea but makes life easier."
      },
      {
        author: "Michael P.",
        rating: 5,
        date: "2025-10-28",
        title: "Car charging solved",
        content: "Stuck these to my car dashboard. My charging cable no longer falls between the seats when I unplug my phone. The magnetic hold is strong enough to keep the cable in place even on bumpy roads. Adhesive has survived 4 months of car heat and cold. Brilliant little product."
      },
      {
        author: "Lisa H.",
        rating: 5,
        date: "2025-10-23",
        title: "Great product",
        content: "Keeps cables organized. Strong magnets. Works perfectly."
      },
      {
        author: "James T.",
        rating: 4,
        date: "2025-10-18",
        title: "Office desk game changer",
        content: "Bought a pack of 5 for my home office. Keeps all my charging cables organized and prevents them falling off the desk when unplugged. Magnets are strong enough to hold cables securely but easy to remove when needed. Adhesive has stuck well to my glass desk for 3 months. Only slight is I wish they came in different colors, but that's minor."
      },
      {
        author: "Rachel S.",
        rating: 5,
        date: "2025-10-12",
        title: "Does the job",
        content: "Simple and effective. Holds cables well. Sticks firmly."
      },
      {
        author: "Paul W.",
        rating: 5,
        date: "2025-10-05",
        title: "Kitchen counter organizer",
        content: "I charge my phone on the kitchen counter. The cable used to fall behind the counter constantly. These holders keep it accessible. Magnetic groove design is clever - cable sits in the indent and the magnet keeps it there. Adhesive has held through kitchen heat and humidity for 6 months. Small purchase, big convenience."
      },
      {
        author: "Karen M.",
        rating: 5,
        date: "2025-09-27",
        title: "Handy",
        content: "Keeps my cables organized. Strong adhesive. Good purchase."
      }
    ]
  },

  // Product 19: Titan XL Travel Case™
  '7955233112242': {
    totalReviews: 223,
    avgRating: 4.6,
    reviews: [
      {
        author: "Andrew M.",
        rating: 5,
        date: "2025-11-13",
        title: "Professional travel organization",
        content: "I travel internationally for work. This case holds 4 cables, 2 chargers, USB hub, power bank, adapters, and AirPods with room to spare. The elastic loops keep everything organized. Hard shell protects my gear in luggage. Interior mesh pocket is perfect for small items like SD cards. Quality is premium - 8 months of weekly flights, still looks new. Worth every penny."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-10",
        title: "Family trip essential",
        content: "Fits all our charging cables and adapters for family holidays. Everything stays organized. Protective case means nothing gets damaged in suitcases. Had it 5 months, excellent quality."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-07",
        title: "Great case",
        content: "Holds loads of cables and chargers. Well made. Keeps everything tidy."
      },
      {
        author: "David R.",
        rating: 5,
        date: "2025-11-03",
        title: "Photography gear organizer",
        content: "I'm a wedding photographer. This case holds all my charging gear - 6 camera battery chargers, cables, USB hub, card readers, power bank. The elastic loops are genius for keeping everything separated. Hard shell means I can throw it in my camera bag without worrying about damage. Survived 30+ weddings over 7 months. Premium build quality."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-29",
        title: "Spacious but almost too big",
        content: "This case is genuinely XL - holds way more than I expected. All my family's cables, 3 chargers, power banks, and adapters fit with room left. Quality is excellent with proper hard shell protection. Only 4 stars because it's a bit bulky for carry-on if you're traveling light. Perfect for checked luggage though. 6 months of family holidays, still perfect."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-24",
        title: "Perfect",
        content: "Holds everything I need. Protective. Well organized inside."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-18",
        title: "Digital nomad essential",
        content: "I work remotely while traveling. This case holds my laptop charger, phone cables, USB-C hub, portable SSD, power bank, and all adapters. The organization system with elastic loops means I can find what I need quickly. Hard shell has protected my gear through 12 countries in 8 months. Absolutely essential for digital nomads."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-12",
        title: "Excellent",
        content: "Really spacious. Quality materials. Keeps all cables organized."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-05",
        title: "Tech blogger approved",
        content: "I review tech products so I travel with lots of devices and cables. This XL case holds 8 charging cables, 4 power adapters, USB hubs, card readers, and miscellaneous dongles. The internal organization is excellent - multiple elastic loops and mesh pockets. Hard shell protects expensive gear. 9 months of constant travel, still looks brand new."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Great purchase",
        content: "Holds loads. Protective case. Well designed inside."
      }
    ]
  },

  // Product 20: Titan M Travel Case™
  '8142386593970': {
    totalReviews: 145,
    avgRating: 4.5,
    reviews: [
      {
        author: "Michael R.",
        rating: 5,
        date: "2025-11-14",
        title: "Perfect size for weekend trips",
        content: "The medium size is ideal for short trips. Holds 2 cables, phone charger, power bank, and AirPods perfectly. Hard shell protects everything in my backpack. Interior elastic loops keep things organized. Not too bulky - fits in my laptop bag easily. Quality is excellent - 7 months of weekly travel, zero wear. Perfect balance of capacity and portability."
      },
      {
        author: "Sarah K.",
        rating: 5,
        date: "2025-11-11",
        title: "Great travel case",
        content: "Fits my essentials perfectly. Protective. Good size for carry-on bags."
      },
      {
        author: "Tom W.",
        rating: 5,
        date: "2025-11-08",
        title: "Good quality",
        content: "Holds cables and chargers well. Compact size. Well made."
      },
      {
        author: "Emma T.",
        rating: 4,
        date: "2025-11-04",
        title: "Compact organization",
        content: "This case is perfect for business trips. Holds 2 charging cables, USB-C charger, power bank, and earbuds. The elastic loops keep everything in place. Hard shell means I can throw it in my briefcase without worry. Size is ideal - not too big, not too small. 6 months of weekly business travel, excellent condition. Would be 5 stars if it had one more mesh pocket inside."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-10-30",
        title: "Sales rep essential",
        content: "I'm on the road 3 days a week. This case holds my essential charging gear - 2 cables, wall charger, car charger, and portable battery. Fits perfectly in my briefcase side pocket. Hard shell protects everything. The organization inside means I can grab what I need quickly between meetings. 8 months of heavy use, still looks new."
      },
      {
        author: "Rachel M.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect size",
        content: "Not too big, not too small. Holds everything I need. Protective and well made."
      },
      {
        author: "Paul S.",
        rating: 5,
        date: "2025-10-19",
        title: "Daily commute organizer",
        content: "I commute to London daily. This case keeps my charging gear organized in my bag - phone cable, USB-C charger, power bank, and USB-A cable for my Kindle. Compact enough that it doesn't take much space. Hard shell means my gear stays protected in my packed commuter bag. 7 months of daily commuting, no wear on the case."
      },
      {
        author: "Lisa H.",
        rating: 5,
        date: "2025-10-13",
        title: "Good case",
        content: "Holds all my cables. Compact. Protective shell works well."
      },
      {
        author: "James P.",
        rating: 5,
        date: "2025-10-06",
        title: "University student essential",
        content: "This case lives in my uni backpack. Holds my laptop charger cable, phone cable, USB hub, and earbuds. The medium size is perfect - big enough for essentials but doesn't take up much space. Hard shell has protected my gear through 6 months of being crushed in my overstuffed backpack. Excellent quality for the price."
      },
      {
        author: "Karen L.",
        rating: 5,
        date: "2025-09-29",
        title: "Really useful",
        content: "Perfect size. Keeps cables organized. Protective case. Very happy."
      }
    ]
  },

  // Product 21: Titan Buds 2.0™
  '7689660072114': {
    totalReviews: 1221,
    avgRating: 4.6,
    reviews: [
      {
        author: "Steven M.",
        rating: 5,
        date: "2025-11-13",
        title: "Upgrade from original was worth it",
        content: "I had the original Titan Buds and these 2.0s are noticeably better. Sound quality is clearer with better bass response. Active noise cancelling is significantly improved - blocks out train noise on my commute properly. Battery life is excellent - 7 hours continuous use before needing the case. Touch controls are more responsive. Been using them daily for 6 months for work calls and music. Really impressed with the improvements."
      },
      {
        author: "Jessica R.",
        rating: 5,
        date: "2025-11-10",
        title: "Perfect for workouts",
        content: "These stay in my ears during intense workouts. Sweat resistant works - used them through 5 months of gym sessions. Sound quality is excellent. Battery lasts my whole workout plus commute. Really happy."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-07",
        title: "Excellent earbuds",
        content: "Great sound quality. Comfortable fit. Battery life impressive."
      },
      {
        author: "David K.",
        rating: 5,
        date: "2025-11-03",
        title: "Call quality is exceptional",
        content: "I'm on Zoom calls 6-7 hours daily working from home. These earbuds have the best microphone quality I've experienced - colleagues say I sound crystal clear even with my kids in the background. Noise cancelling means I can take calls while my wife is on her calls in the same room. Battery easily lasts my full work day. Comfortable enough for all-day wear. 8 months of heavy professional use, still perfect."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-29",
        title: "Great upgrade, minor case bulk",
        content: "Sound quality is noticeably better than the original Buds. ANC works well for daily use. Battery life is excellent - easily lasts my work day. Touch controls are intuitive. Only slight issue is the case is a bit bulkier than I'd like for pockets, but it charges the buds quickly. 7 months of daily use, very happy overall."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-24",
        title: "Really good",
        content: "Sound great. Comfortable. Battery lasts ages. Very happy."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-18",
        title: "Runner's choice",
        content: "I run half marathons. These earbuds stay secure even on long runs. The ambient mode is excellent for road safety - I can hear traffic while still enjoying music. Battery lasts multiple runs before needing the case. Sweat hasn't affected them after 6 months of training. Best running earbuds I've owned. Sound quality rivals my old AirPods Pro."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-12",
        title: "Great value",
        content: "Sound quality excellent. ANC works well. Comfortable for hours. Good purchase."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-05",
        title: "London commuter approved",
        content: "Tube commute daily. The noise cancelling on these 2.0s is much better than the original - blocks out most Underground noise. Sound quality is excellent for both music and podcasts. Battery lasts my commute plus lunch break music easily. Comfortable enough that I forget I'm wearing them. 7 months of daily commuting, still perfect condition."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-27",
        title: "Excellent",
        content: "Great sound. Comfortable fit. Battery life really good. Very impressed."
      }
    ]
  }
  ,

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTS 22-27: WIRELESS CHARGING & DESK ACCESSORIES
  // ═══════════════════════════════════════════════════════════════

  // Product 22: 4-in-1 Dock Pro
  '8366528299186': {
    totalReviews: 667,
    avgRating: 4.5,
    reviews: [
      {
        author: "Andrew M.",
        rating: 5,
        date: "2025-11-14",
        title: "Nightstand charging perfection",
        content: "This dock charges my iPhone 15 Pro wirelessly, Apple Watch on the side mount, AirPods Pro on the wireless pad, and has a USB-A port for my Kindle. Everything charges overnight perfectly. The design is sleek and doesn't take much space on my nightstand. Wireless charging is fast - phone goes from 20% to 100% in about 2 hours. Had it 7 months, works flawlessly every night."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Desk organization solved",
        content: "All my Apple devices charge from this one dock on my desk. No more cable mess. Wireless charging works great. Quality feels premium. Had it 5 months, excellent."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Great dock",
        content: "Charges phone, watch, and earbuds all at once. Works perfectly. Well made."
      },
      {
        author: "David R.",
        rating: 4,
        date: "2025-11-04",
        title: "Almost perfect charging solution",
        content: "This dock is excellent for Apple ecosystem users. Charges my iPhone, Apple Watch, and AirPods simultaneously. Wireless charging is reliable and fast enough for overnight charging. The USB-A port is handy for occasional needs. Design is sleek on my nightstand. Only minor issue is you need to position the phone precisely for optimal wireless charging, but that's standard for wireless chargers. 6 months of nightly use, works perfectly."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-10-30",
        title: "Home office essential",
        content: "Working from home means lots of devices. This dock keeps my phone, watch, and earbuds charged on my desk. No more hunting for cables. Wireless charging is convenient during video calls. Everything charges at decent speed. 8 months of daily use, still perfect. Premium quality product."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect",
        content: "Charges everything I need. Wireless charging works well. Looks good."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Simplified my charging routine",
        content: "I used to have 3 separate cables on my nightstand. Now it's just this dock. iPhone charges wirelessly, Apple Watch on the dedicated mount, AirPods on the pad. Everything is ready in the morning. The design is sleek and doesn't look cluttered. 7 months of nightly charging, no issues. Best nightstand upgrade I've made."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-13",
        title: "Excellent",
        content: "Charges all my Apple devices. Wireless charging convenient. Quality build."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Hotel room essential",
        content: "I travel for work constantly. This dock comes with me. One power outlet charges phone, watch, and earbuds. Much better than juggling multiple cables in hotel rooms. Compact enough for travel. Wireless charging is reliable. 6 months of weekly hotel use, still works perfectly. Worth every penny for frequent travelers."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Great purchase",
        content: "All my devices charge from one dock. Wireless charging works great. Really happy."
      }
    ]
  },

  // Product 23: Folding Wireless 3-in-1 Dock™
  '7671864852658': {
    totalReviews: 431,
    avgRating: 4.5,
    reviews: [
      {
        author: "Michael R.",
        rating: 5,
        date: "2025-11-13",
        title: "Perfect travel companion",
        content: "The folding design is genius for travel. Folds completely flat to 1.2x2 inches - fits in my laptop bag easily. Opens up to charge iPhone, Apple Watch, and AirPods wirelessly. The adjustable angles mean I can use my phone for FaceTime while it's charging. Been traveling with it for 8 months - to hotels, AirBnBs, client offices. Still works perfectly. Best travel charging solution I've found."
      },
      {
        author: "Sarah K.",
        rating: 5,
        date: "2025-11-10",
        title: "Brilliant for travel",
        content: "Folds flat in my bag. Opens up to charge everything. Wireless charging works great. Really clever design. Had it 6 months."
      },
      {
        author: "Tom W.",
        rating: 5,
        date: "2025-11-07",
        title: "Great dock",
        content: "Folds up small. Charges phone, watch, earbuds. Really convenient."
      },
      {
        author: "David H.",
        rating: 5,
        date: "2025-11-03",
        title: "Business traveler essential",
        content: "I travel 3 weeks out of the month. This folding dock has revolutionized my charging setup. Completely flat when folded - barely adds any weight or bulk to my carry-on. Opens up in hotel rooms to charge my iPhone, Apple Watch, and AirPods all wirelessly. The adjustable stand angles are perfect for bedside video calls. 9 months of constant travel, mechanism still smooth. Premium quality product."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-29",
        title: "Compact and functional",
        content: "Love the folding design for travel. Charges all my Apple devices wirelessly. The multi-angle positioning is handy. Wireless charging speed is good for overnight charging. Only minor point is positioning phone precisely for optimal charging takes a moment, but that's standard wireless charging. 7 months of weekly travel, works great."
      },
      {
        author: "Paul S.",
        rating: 5,
        date: "2025-10-24",
        title: "Perfect",
        content: "Folds flat. Charges everything wirelessly. Great for traveling."
      },
      {
        author: "Rachel T.",
        rating: 5,
        date: "2025-10-18",
        title: "Photographer's hotel room savior",
        content: "I shoot destination weddings. Hotel rooms never have enough outlets. This folding dock charges my phone, watch, and AirPods from one outlet. Folds completely flat in my camera bag - weighs almost nothing. The RGB ambient light can be turned off which I appreciate. 8 months of wedding season travel, still perfect. Brilliant design."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-12",
        title: "Really good",
        content: "Compact when folded. Charges all my devices. Wireless charging works well."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-05",
        title: "Consultant's carry-on essential",
        content: "I consult with different companies weekly. This folding dock goes everywhere with me. Folds flat in my laptop bag. Opens up at client offices or hotels to charge phone, watch, and earbuds. The adjustable angles mean I can use it as a phone stand during presentations. 7 months of constant travel, mechanism works smoothly. Can't recommend enough for frequent travelers."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-27",
        title: "Excellent",
        content: "Brilliant folding design. Charges everything. Perfect for travel."
      }
    ]
  },

  // Product 24: Titan Wireless Turbo Dock™
  '7383356342450': {
    totalReviews: 1858,
    avgRating: 4.6,
    reviews: [
      {
        author: "David M.",
        rating: 5,
        date: "2025-11-14",
        title: "Fastest wireless charging I've experienced",
        content: "This dock delivers proper 15W wireless charging. My iPhone 14 Pro goes from 15% to 75% in about 90 minutes - that's actually faster than some wired chargers I've owned. The rigid stand angle is perfect for FaceTime calls or watching videos while charging. No overheating issues even during long charging sessions. Been using it on my desk for 8 months, works flawlessly every day."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Perfect desk dock",
        content: "Charges my phone wirelessly really fast. Stand angle is great for seeing notifications. Quality feels solid. Had it 6 months, no issues."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Great dock",
        content: "Fast wireless charging. Good viewing angle. Well made."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-11-04",
        title: "Nightstand upgrade",
        content: "This dock replaced my messy cable setup on my nightstand. Just place my phone on it and it charges overnight. The 15W charging is noticeably faster than my old 5W wireless pad. Stand angle is perfect for bedside - I can see the time and notifications easily. Portrait or landscape both work. 7 months of nightly use, still charges at full speed."
      },
      {
        author: "James R.",
        rating: 4,
        date: "2025-10-30",
        title: "Fast and reliable, needs precise placement",
        content: "The 15W wireless charging is legitimately fast - phone charges from 20% to 85% in about 2 hours. Stand is stable and the angle is good for both portrait and landscape viewing. Only slight issue is you need to position phone fairly precisely on the charging pad, but once it's on correctly, it charges perfectly. 6 months of desk use, very happy with it."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect",
        content: "Charges fast. Good stand angle. Works great."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Home office essential",
        content: "Working from home means constant video calls. This dock keeps my phone charged on my desk and at the perfect angle for quick glances at notifications. The 15W fast charging means even a 30-minute break gets my phone from 30% to 70%. No more fumbling with cables during busy work days. 8 months of daily office use, works perfectly."
      },
      {
        author: "Paul H.",
        rating: 5,
        date: "2025-10-13",
        title: "Solid dock",
        content: "Fast wireless charging. Stand is stable. Good quality."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Kitchen counter perfect",
        content: "I keep this on my kitchen counter. Makes following recipes on my phone easy - good viewing angle while it charges. The 15W charging is fast enough that even quick charges while cooking give decent battery boost. Stand is weighted properly so it doesn't tip over. 7 months of kitchen use including occasional splashes, still works perfectly."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Really good",
        content: "Fast charging. Good angle. Works perfectly."
      }
    ]
  },

  // Product 25: Titan Wireless Car Charger™
  '7383387111602': {
    totalReviews: 318,
    avgRating: 4.4,
    reviews: [
      {
        author: "Steven M.",
        rating: 5,
        date: "2025-11-13",
        title: "Auto-clamping is brilliant",
        content: "The infrared auto-clamping mechanism is genius. Phone approaches the mount, arms open automatically, phone sits in, arms close securely. One-handed operation while driving is perfect. 15W wireless charging means my phone actually gains charge even with navigation and music running. Dual mounting options (dash and vent) both work well. Had it 7 months in my car, mechanism still smooth and responsive."
      },
      {
        author: "Jessica R.",
        rating: 5,
        date: "2025-11-10",
        title: "Perfect for daily commute",
        content: "Auto-clamping works really well. Charges my phone while using GPS. Easy one-handed mounting. Had it 5 months, works great."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-07",
        title: "Great car charger",
        content: "Auto-clamps phone securely. Charges fast. Easy to use while driving."
      },
      {
        author: "David K.",
        rating: 4,
        date: "2025-11-03",
        title: "Excellent function, dashboard mount preferred",
        content: "The auto-clamping feature works flawlessly - just bring phone near and it grabs it automatically. Wireless charging at 15W actually keeps phone charged during navigation. I prefer the dashboard mount over vent mount for stability. Holds my iPhone 14 Pro Max securely even on rough roads. Only minor issue is positioning for optimal wireless charging took a few tries to get right, but once set up, it's perfect. 6 months of daily commuting, mechanism still responsive."
      },
      {
        author: "Emma W.",
        rating: 5,
        date: "2025-10-29",
        title: "Sales rep essential",
        content: "I'm on the road 4 days a week. This charger has made my life so much easier. One-handed mounting while starting the car. Phone charges while I use navigation. The auto-clamping mechanism hasn't failed once in 8 months. Secure hold even on motorway speeds. Worth every penny for people who drive for work."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-24",
        title: "Perfect",
        content: "Auto-clamp works great. Charges phone fast. Really convenient."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-18",
        title: "Uber driver approved",
        content: "I drive for Uber. This charger keeps my phone topped up all day with navigation running constantly. Auto-clamping is perfect for between rides - quick one-handed mounting. Secure hold keeps phone stable even with passengers. The 15W charging is fast enough that phone never drops below 70% even on 10-hour shifts. 7 months of professional use, still works perfectly."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-12",
        title: "Really good",
        content: "Easy one-handed use. Charges fast. Holds phone securely."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-05",
        title: "Parent life made easier",
        content: "School run with three kids means I need both hands free. This auto-clamping mount is perfect - phone goes in one-handed, charges wirelessly while I deal with kids. Navigation stays visible. Secure enough that phone stays put even with kids bumping the car. 6 months of daily school runs, mechanism still works smoothly."
      },
      {
        author: "Chris W.",
        rating: 4,
        date: "2025-09-27",
        title: "Good charger",
        content: "Auto-clamp is convenient. Charges properly. Holds phone well. Slightly pricey but worth it for the convenience."
      }
    ]
  },

  // Product 26: 3-in-1 Mothership Dock™
  '7530094919858': {
    totalReviews: 269,
    avgRating: 4.6,
    reviews: [
      {
        author: "Andrew M.",
        rating: 5,
        date: "2025-11-14",
        title: "Premium charging centerpiece",
        content: "This dock is the charging hub for my entire Apple ecosystem. iPhone charges wirelessly in the center, Apple Watch on the elevated mount, AirPods on the side pad. The design is genuinely premium - looks like a £200+ product on my desk. Wireless charging is fast across all three devices. Cable management underneath keeps things tidy. Had it 8 months, works flawlessly. Best charging dock investment I've made."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Desk looks so clean now",
        content: "All my Apple devices charge from this one dock. No more cable mess. Looks premium on my desk. Quality is excellent. Had it 6 months."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Excellent dock",
        content: "Charges phone, watch, earbuds all at once. Premium design. Works perfectly."
      },
      {
        author: "David R.",
        rating: 5,
        date: "2025-11-04",
        title: "Executive desk upgrade",
        content: "I work in senior management. This dock looks professional on my desk during video calls. Charges my iPhone 15 Pro, Apple Watch Ultra, and AirPods Pro simultaneously. The elevated watch mount is clever design - easy to see time during calls. Wireless charging is reliable and fast. Premium materials feel like genuine quality. 7 months of daily office use, still looks and works like new."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-30",
        title: "Premium quality, needs space",
        content: "This is genuinely premium - the build quality and design are excellent. Charges all my Apple devices wirelessly with no issues. The layout is well thought out with proper spacing between devices. Only consideration is it takes up decent desk space, so not ideal for small desks. But if you have the space, it's worth it. 6 months of use, works perfectly."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect",
        content: "Charges everything. Looks premium. Great quality."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Home office centerpiece",
        content: "Working from home full-time. This dock is the centerpiece of my desk setup. iPhone, Apple Watch, and AirPods all charge in one beautiful spot. The design is sleek enough that it looks good on video calls. Wireless charging works perfectly across all devices. 8 months of daily use, still impressed every time I use it."
      },
      {
        author: "James H.",
        rating: 5,
        date: "2025-10-13",
        title: "Really premium",
        content: "Excellent build quality. Charges all devices perfectly. Looks great."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Architect's desk essential",
        content: "My desk needs to look professional for client video calls. This Mothership dock is both functional and aesthetic. Charges my iPhone, Apple Watch, and AirPods without the cable clutter. The premium design matches my minimalist desk setup. Wireless charging is reliable. 7 months of professional use, works flawlessly and still looks showroom new."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Excellent",
        content: "Premium quality. Charges everything wirelessly. Looks fantastic."
      }
    ]
  },

  // Product 27: XL Wireless Charge Mouse Mat™
  '8082868699314': {
    totalReviews: 87,
    avgRating: 4.5,
    reviews: [
      {
        author: "David M.",
        rating: 5,
        date: "2025-11-14",
        title: "Genius desk upgrade",
        content: "This mouse mat is brilliant. XL size covers my entire desk workspace - 80cm x 40cm gives me plenty of room for mouse movement and keyboard. The built-in wireless charging pad on the side keeps my iPhone topped up while I work. No more reaching for cables. Phone charges at 15W which is fast enough for all-day desktop use. The mat surface is smooth for mouse tracking, non-slip base keeps it firmly in place. Had it 7 months on my desk, still looks new. Best desk accessory I've bought."
      },
      {
        author: "Sophie K.",
        rating: 5,
        date: "2025-11-11",
        title: "Perfect work from home setup",
        content: "Love this mat. Huge size for my mouse and keyboard. Phone charges wirelessly on the side while I work. Really convenient. Had it 6 months."
      },
      {
        author: "Mark T.",
        rating: 5,
        date: "2025-11-08",
        title: "Great mouse mat",
        content: "Big size. Wireless charging works well. Good quality."
      },
      {
        author: "James R.",
        rating: 5,
        date: "2025-11-04",
        title: "Gamer approved",
        content: "I game competitively. This XL mat gives me tons of mouse room for low DPI gaming. The wireless charging pad is perfectly positioned - my phone charges during gaming sessions without getting in the way of mouse movement. Surface is smooth for precise tracking. Edges are stitched so no fraying after 8 months of heavy gaming use. The wireless charging is fast enough that my phone stays topped up even during long gaming sessions."
      },
      {
        author: "Emma W.",
        rating: 4,
        date: "2025-10-30",
        title: "Excellent concept, positioning matters",
        content: "This mouse mat is genuinely XL - covers my entire desk area comfortably. The wireless charging pad on the side is super convenient for keeping phone charged during work. Mat surface is high quality for smooth mouse movement. Only slight issue is you need to position phone correctly on the charging pad, but once you figure out the sweet spot, it works perfectly. 7 months of daily office use, mat still looks pristine."
      },
      {
        author: "Tom S.",
        rating: 5,
        date: "2025-10-25",
        title: "Perfect",
        content: "Huge mat. Wireless charging really handy. Works great."
      },
      {
        author: "Rachel P.",
        rating: 5,
        date: "2025-10-19",
        title: "Designer's desk essential",
        content: "I'm a graphic designer working on detailed projects. This XL mat gives me plenty of space for mouse movement. The wireless charging pad means my phone stays charged during long design sessions without cable clutter on my desk. Mat surface is excellent for precise mouse work. Non-slip base keeps everything stable. 8 months of professional use, still looks and works like new."
      },
      {
        author: "Paul H.",
        rating: 5,
        date: "2025-10-13",
        title: "Really good",
        content: "Big mouse mat. Wireless charging convenient. Good quality."
      },
      {
        author: "Lisa M.",
        rating: 5,
        date: "2025-10-06",
        title: "Programmer's workspace upgrade",
        content: "I code for 8-10 hours daily. This XL mat covers my desk perfectly - keyboard and mouse both fit comfortably. The wireless charging pad keeps my phone topped up all day so I never miss notifications. Mat surface is smooth for mouse tracking but has enough texture that my arms don't stick during long coding sessions. 7 months of heavy daily use, zero wear on the surface. Excellent investment."
      },
      {
        author: "Chris W.",
        rating: 5,
        date: "2025-09-28",
        title: "Excellent",
        content: "Huge size. Wireless charging works perfectly. Great quality mat."
      }
    ]
  }

};

// ✅ Helper: Get product reviews from PRODUCT_REVIEWS database
function getProductReviews(productId) {
  const productData = PRODUCT_REVIEWS[productId];

  if (!productData) {
    console.warn('⚠️ No reviews found for product ID:', productId);
    console.log('Available product IDs:', Object.keys(PRODUCT_REVIEWS));
    // Return empty array to prevent errors
    return [];
  }

  return productData.reviews;
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

    // Get product data for rating display
    const productData = PRODUCT_REVIEWS[productId];
    const avgRating = productData ? productData.avgRating : 4.5;
    const totalReviews = productData ? productData.totalReviews.toLocaleString() : '0';

    // Calculate stars
    const fullStars = Math.floor(avgRating);
    const hasHalf = (avgRating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    rating.innerHTML = `
      <div class="rating-stars">
        ${'<span class="star filled">★</span>'.repeat(fullStars)}
        ${hasHalf ? '<span class="star half">★</span>' : ''}
        ${'<span class="star">★</span>'.repeat(emptyStars)}
      </div>
      <span class="rating-count">${avgRating.toFixed(1)} / 5</span>
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

    // Add "X Reviews of Y" text at bottom
    if (productData && productData.totalReviews) {
      const reviewCountText = document.createElement('div');
      reviewCountText.className = 'review-total-count';
      reviewCountText.style.cssText = 'padding: 8px 12px; text-align: center; font-size: 11px; color: #6b7280; background: #f9fafb; border-radius: 0 0 12px 12px; margin-top: -12px;';
      reviewCountText.textContent = `10 Reviews of ${totalReviews}`;
      section.appendChild(reviewCountText);
    }

    return section;
  } catch (error) {
    console.error('Error creating reviews section:', error);
    // Return empty div to prevent breaking
    const fallback = document.createElement('div');
    fallback.className = 'modal-reviews-section';
    return fallback;
  }
}

// ═══════════════════════════════════════════════════════════════════
// UPDATE MODAL REVIEWS WITH PRODUCT-SPECIFIC DATA
// ═══════════════════════════════════════════════════════════════════
function updateModalReviews(productId, modal) {
  try {
    const existingSection = modal.querySelector('.modal-reviews-section');

    if (!existingSection) {
      console.warn('⚠️ Review section not found in modal');
      return;
    }

    // Generate new reviews section with product-specific data
    const newSection = createReviewsSection(productId);

    // Replace existing section
    existingSection.replaceWith(newSection);

    console.log('✅ Reviews updated for product:', productId);

    // Log review count for verification
    const productData = PRODUCT_REVIEWS[productId];
    if (productData) {
      console.log(`   📊 ${productData.reviews.length} reviews loaded (${productData.avgRating}/5 avg, ${productData.totalReviews.toLocaleString()} total)`);
    }
  } catch (error) {
    console.error('❌ Error updating modal reviews:', error);
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
        addToCartBtn.innerHTML = 'Select Variant & Add to BOGO Pair';
      } else {
        addToCartBtn.innerHTML = 'Add to BOGO Pair';
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

  // ═══════════════════════════════════════════════════════════════════
  // UPDATE REVIEWS WITH PRODUCT-SPECIFIC DATA
  // ═══════════════════════════════════════════════════════════════════
  console.log('🔄 Updating product reviews...');
  updateModalReviews(productId, modal);

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
    console.log(`🎉 ========================================`);
    console.log(`🎉 CELEBRATE CALLED WITH TIER: ${tier}`);
    console.log(`🎉 Type: ${typeof tier}, Value: ${tier}`);
    console.log(`🎉 tier === 2: ${tier === 2}`);
    console.log(`🎉 tier === 3: ${tier === 3}`);
    console.log(`🎉 ========================================`);
    
    const config = tier === 2 ? {
      icon: '⭐',
      message: 'TIER 2 UNLOCKED!',
      submessage: 'FREE Premium Shipping + Extra 5% OFF!',
      breakdown: `BOGO Savings<br>+ 5% Extra Discount<br>+ FREE Premium Shipping (${BOGOCurrency.convert(499)})`,
      buttonText: 'Add 1 More Pair for FREE Cable!'
    } : {
      icon: '👑',
      message: 'MAXIMUM SAVINGS!',
      submessage: '10% OFF + FREE Shipping + FREE Cable!',
      breakdown: `BOGO Savings<br>+ 10% Extra Discount<br>+ FREE Premium Shipping (${BOGOCurrency.convert(499)})<br>+ FREE Titan Smart Cable (${BOGOCurrency.convert(1895)})`,
      buttonText: 'Checkout Now'
    };

    this.overlay.querySelector('.badge-icon').textContent = config.icon;
    this.overlay.querySelector('.badge-tier').textContent = `Tier ${tier}`;
    this.overlay.querySelector('.celebration-message').textContent = config.message;
    this.overlay.querySelector('.celebration-submessage').textContent = config.submessage;
    this.overlay.querySelector('.savings-breakdown').innerHTML = config.breakdown;

    const savings = this.calculateTierSavings(tier);
    this.overlay.querySelector('.savings-total').textContent = BOGOCurrency.formatMoney(Math.round(savings * 100));

    // ✅ Clean button setup - clone to remove old event listeners
    const primaryBtnOld = this.overlay.querySelector('.btn-celebration-continue.primary');
    const secondaryBtnOld = this.overlay.querySelector('.btn-celebration-continue.secondary');
    
    const primaryBtn = primaryBtnOld.cloneNode(true);
    const secondaryBtn = secondaryBtnOld.cloneNode(true);
    
    primaryBtnOld.replaceWith(primaryBtn);
    secondaryBtnOld.replaceWith(secondaryBtn);

    // ✅ Set button content
    primaryBtn.textContent = config.buttonText;
    primaryBtn.type = 'button';
    secondaryBtn.textContent = 'Continue Shopping';
    secondaryBtn.type = 'button';
    
    // ✅ PRIMARY BUTTON: Check if overlay has tier-3 class
    primaryBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isTier3 = this.overlay.classList.contains('tier-3');
      console.log(`🎉 Primary button clicked. Has tier-3 class: ${isTier3}`);
      
      this.closeCelebration(tier, 'continue');
      
      if (isTier3 && typeof proceedToCheckout === 'function') {
        console.log('✅ TIER 3: Going to checkout');
        proceedToCheckout();
      } else {
        console.log('✅ TIER 2: Just closing modal');
      }
    };

    // ✅ SECONDARY BUTTON: Always just closes
    secondaryBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎉 Secondary: Closing modal');
      this.closeCelebration(tier, 'continue');
    };

    // ✅ Add hint text for closing
    let hintText = this.overlay.querySelector('.celebration-hint');
    if (!hintText) {
      hintText = document.createElement('p');
      hintText.className = 'celebration-hint';
      hintText.textContent = 'Click anywhere or press ESC to continue building';
      const content = this.overlay.querySelector('.celebration-content');
      if (content) content.appendChild(hintText);
    }

    // ✅ FIX: Click overlay to close - just close, don't open review modal
    const overlayClickHandler = (e) => {
      if (e.target === this.overlay) {
        this.closeCelebration(tier, 'continue'); // Just close, don't open review
        this.overlay.removeEventListener('click', overlayClickHandler);
      }
    };
    this.overlay.addEventListener('click', overlayClickHandler);

    // ✅ FIX: ESC key to close - just close, don't open review modal
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeCelebration(tier, 'continue'); // Just close, don't open review
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
    
    // 1. Calculate BOGO Savings (100% off cheaper item)
    let bogoSavings = state.pairs.reduce((sum, pair) => sum + pair.savings, 0);
    
    // 2. Calculate subtotal (full retail price)
    const subtotal = state.pairs.reduce((sum, pair) => sum + pair.product1.price + pair.product2.price, 0);
    
    // 3. ✅ FIX: Calculate tier discount on discounted subtotal (AFTER BOGO, not before)
    const discountedSubtotal = subtotal - bogoSavings;
    const tierPercent = tier === 2 ? 0.05 : tier === 3 ? 0.10 : 0;
    const tierSavings = discountedSubtotal * tierPercent;
    
    // 4. Add value bonuses
    const shippingSavings = tier >= 2 ? 499 : 0;
    const cableSavings = tier === 3 ? 1895 : 0;
    
    // 5. Total savings (all in cents)
    return (bogoSavings + tierSavings + shippingSavings + cableSavings) / 100;
  }

  closeCelebration(tier, action) {
    console.log(`🎉 closeCelebration called - tier: ${tier}, action: ${action}`);
    console.log('🎉 Closing celebration modal and returning to product selection');
    this.overlay.classList.remove('show');
    // ✅ Always just close and return to product selection
    // User can checkout from sticky cart when ready
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
      { text: `saved ${BOGOCurrency.convert(5200)} with BOGO`, icon: '💰' },
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

// ========================================
// CLEAR ALL PAIRS FUNCTION
// BOGO-REVIEW-MODAL-MOBILE-019
// Resets BOGO builder state completely
// ========================================

/**
 * Clear All Pairs (BOGO-REVIEW-MODAL-UX-024)
 * Removes all pairs with single confirmation and toast notification
 */
function clearAllPairs() {
  const state = window.bogoState;

  if (!state || !state.pairs || state.pairs.length === 0) {
    showBogoToast('No pairs to clear', 'error', 2000);
    return;
  }

  const pairCount = state.pairs.length;

  // Show confirmation (only for clear all, not single delete)
  const confirmed = confirm(`Remove all ${pairCount} pairs? This cannot be undone.`);

  if (!confirmed) return;

  console.log('🗑️ Clearing all pairs...');

  // Reset state
  window.bogoState = {
    pairs: [],
    currentPair: { slot1: null, slot2: null },
    activePairNumber: 1
  };

  // Clear localStorage
  if (typeof clearBOGOState === 'function') {
    clearBOGOState();
  } else {
    localStorage.removeItem('titan-bogo-state');
  }

  // Update UI
  if (typeof updateStickyCart === 'function') {
    updateStickyCart();
  }

  // Close modal if open
  const modal = document.querySelector('.pair-modal');
  if (modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Show success notification (BOGO-REVIEW-MODAL-UX-024)
  showBogoToast(`All ${pairCount} pairs cleared`, 'success', 3000);

  console.log('✅ All pairs cleared successfully');

  // Scroll to top of product selection
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// BOGO CHECKOUT - CART API METHOD
// BOGO-CHECKOUT-FIX-027
// Uses Cart API (/cart/add.js) to add items with properties
// ========================================

/**
 * Proceed to Checkout - Cart API Method (BOGO-CHECKOUT-FIX-027)
 * Adds items via AJAX, then redirects to checkout with discount codes
 *
 * Flow:
 * 1. Validate state
 * 2. Show loading overlay
 * 3. Clear existing cart
 * 4. Add all BOGO items via Cart API
 * 5. Add bonus cable (Tier 3)
 * 6. Redirect to checkout with discount codes
 */
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

  } catch (error) {
    console.error('Checkout error:', error);
    hideCheckoutLoading();
    showBogoToast('Checkout failed. Please try again or contact support.', 'error', 5000);

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
    return 'BOGO2025,TIER2-5OFF,FREE-SHIPPING-TIER2';
  } else if (pairCount >= 3) {
    return 'BOGO2025,TIER3-10OFF,FREE-SHIPPING-TIER3';
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

// ========================================
// VARIANT SWATCHES & BUTTONS
// BOGO-VARIANT-SWATCHES-020
// Visual variant selection functions
// ========================================

/**
 * Select Color Swatch
 * @param {HTMLElement} swatchEl - Clicked swatch element
 * @param {number} optionIndex - Option index (1, 2, or 3)
 */
function selectVariantSwatch(swatchEl, optionIndex) {
  // Remove selected from siblings
  const container = swatchEl.parentElement;
  container.querySelectorAll('.variant-swatch').forEach(s => {
    s.classList.remove('selected');
  });

  // Add selected to clicked swatch
  swatchEl.classList.add('selected');

  // Update hidden fallback select
  const value = swatchEl.dataset.value;
  updateFallbackSelect(optionIndex, value);

  console.log('Swatch selected:', value);
}

/**
 * Select Size/Length Button
 * @param {HTMLElement} buttonEl - Clicked button element
 * @param {number} optionIndex - Option index (1, 2, or 3)
 */
function selectVariantButton(buttonEl, optionIndex) {
  // Don't select if out of stock
  if (buttonEl.classList.contains('out-of-stock') || buttonEl.disabled) {
    return;
  }

  // Remove selected from siblings
  const container = buttonEl.parentElement;
  container.querySelectorAll('.variant-button').forEach(b => {
    b.classList.remove('selected');
  });

  // Add selected to clicked button
  buttonEl.classList.add('selected');

  // Update hidden fallback select
  const value = buttonEl.dataset.value;
  updateFallbackSelect(optionIndex, value);

  console.log('Button selected:', value);
}

/**
 * Update Fallback Select (for existing logic compatibility)
 * @param {number} optionIndex - Option index
 * @param {string} value - Selected value
 */
function updateFallbackSelect(optionIndex, value) {
  const select = document.querySelector(`.variant-selector[data-option-index="${optionIndex}"]`);

  if (select) {
    select.value = value;

    // Trigger change event for existing listeners
    const event = new Event('change', { bubbles: true });
    select.dispatchEvent(event);
  }
}

// ========================================
// INITIALIZE STICKY CART V2 ADVANCED FEATURES (BOGO-V2-ADVANCED)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('🚀 Initializing Sticky Cart V2 Advanced Features');

    // Initialize savings tooltip
    if (typeof initSavingsTooltip === 'function') {
      initSavingsTooltip();
      console.log('✅ Savings tooltip initialized');
    }

    // Initialize touch feedback (mobile)
    if (typeof initProgressTouchFeedback === 'function') {
      initProgressTouchFeedback();
      console.log('✅ Touch feedback initialized');
    }

    // Update cart to show initial state
    if (typeof updateStickyCart === 'function') {
      updateStickyCart();
      console.log('✅ Sticky cart updated');
    }

    // Initialize currency conversion for static amounts
    initStaticCurrencyConversion();
    console.log('✅ Currency conversion initialized');

    console.log('🎉 All advanced features ready!');
  }, 100);
});

// ========================================
// CURRENCY CONVERSION FOR STATIC AMOUNTS
// Converts all hardcoded EUR amounts to current currency
// ========================================

function initStaticCurrencyConversion() {
  console.log('💱 Initializing currency conversion...');
  console.log('Current currency:', BOGOCurrency.getCurrency());
  console.log('Conversion rate:', BOGOCurrency.getConversionRate());
  
  // Convert all elements with bogo-currency class
  const currencyElements = document.querySelectorAll('.bogo-currency[data-amount]');
  
  console.log(`Found ${currencyElements.length} currency elements to convert`);
  
  currencyElements.forEach(el => {
    const eurCents = parseInt(el.dataset.amount, 10);
    if (eurCents && !isNaN(eurCents)) {
      const converted = BOGOCurrency.convert(eurCents);
      el.textContent = converted;
      console.log(`Converted €${(eurCents / 100).toFixed(2)} → ${converted}`);
    }
  });
  
  console.log('✅ All static amounts converted');
}

// Listen for currency changes (if using Shopify Currency Converter)
document.addEventListener('DOMContentLoaded', () => {
  // Some currency converters trigger this event
  document.addEventListener('currency:changed', () => {
    console.log('💱 Currency changed, reinitializing...');
    initStaticCurrencyConversion();
    // Refresh sticky cart to show updated currency
    if (typeof updateStickyCart === 'function') {
      updateStickyCart();
    }
  });
});

// Re-initialize touch feedback on resize (orientation change)
window.addEventListener('resize', () => {
  if (typeof initProgressTouchFeedback === 'function') {
    initProgressTouchFeedback();
  }
});
