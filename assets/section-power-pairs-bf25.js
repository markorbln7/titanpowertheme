/**
 * ═══════════════════════════════════════════════════════════
 * POWER PAIRS BF25 - JAVASCRIPT FOUNDATION
 * PROMPT 5: Bottom Sheet JavaScript Foundation
 * PROMPT 6: State Manager & Data Initialization
 * PROMPT 11: Multiplier System & Tier Jump Logic
 * PROMPT 14: Performance Optimizations
 * ═══════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  /**
   * ═══════════════════════════════════════════════════════
   * PROMPT 16: CROSS-BROWSER COMPATIBILITY
   * Polyfills, browser detection, and compatibility fixes
   * ═══════════════════════════════════════════════════════
   */

  /**
   * POLYFILLS FOR OLDER BROWSERS
   * Support for Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   */

  // Object.assign polyfill (for Safari < 9)
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // Array.from polyfill (for IE and older browsers)
  if (!Array.from) {
    Array.from = (function() {
      var toStr = Object.prototype.toString;
      var isCallable = function(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function(value) {
        var number = Number(value);
        if (isNaN(number)) return 0;
        if (number === 0 || !isFinite(number)) return number;
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      return function from(arrayLike) {
        var C = this;
        var items = Object(arrayLike);
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
        var len = toLength(items.length);
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
        var k = 0;
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        A.length = len;
        return A;
      };
    }());
  }

  // Array.find polyfill (for IE)
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  // Array.findIndex polyfill
  if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.findIndex called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    };
  }

  // String.includes polyfill
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }
      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  // Element.closest polyfill (for IE)
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // Element.matches polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // NodeList.forEach polyfill (for IE)
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  /**
   * BROWSER DETECTION UTILITIES
   */
  var BrowserDetect = {
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isFirefox: /firefox/i.test(navigator.userAgent),
    isChrome: /chrome/i.test(navigator.userAgent) && /google inc/i.test(navigator.vendor),
    isSamsung: /SamsungBrowser/i.test(navigator.userAgent),
    isEdge: /edg/i.test(navigator.userAgent),
    isMobile: /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent),
    supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    supportsPassiveEvents: (function() {
      var supportsPassive = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      return supportsPassive;
    })()
  };

  console.log('[PowerPairs Browser] Detection:', BrowserDetect);

  /**
   * iOS SCROLL LOCK
   * Prevents background scrolling when modals are open
   */
  var IOSScrollLock = {
    scrollPosition: 0,
    isLocked: false,

    lock: function() {
      if (!BrowserDetect.isIOS || this.isLocked) return;

      // Store current scroll position
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      // Apply fixed positioning to body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + this.scrollPosition + 'px';
      document.body.style.width = '100%';

      this.isLocked = true;
      console.log('[PowerPairs iOS] Scroll locked at position:', this.scrollPosition);
    },

    unlock: function() {
      if (!BrowserDetect.isIOS || !this.isLocked) return;

      // Remove fixed positioning
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');

      // Restore scroll position
      window.scrollTo(0, this.scrollPosition);

      this.isLocked = false;
      console.log('[PowerPairs iOS] Scroll unlocked, restored to:', this.scrollPosition);
    }
  };

  /**
   * TOUCH EVENT SUPPORT
   * Enhanced touch handling for mobile devices
   */
  var TouchSupport = {
    startX: 0,
    startY: 0,
    threshold: 10, // Minimum distance for swipe

    init: function() {
      if (!BrowserDetect.supportsTouch) return;

      var passiveOption = BrowserDetect.supportsPassiveEvents ? { passive: true } : false;

      // Add touch feedback to interactive elements
      var interactiveElements = document.querySelectorAll(
        '.pp-bundle-card, .pp-product-compact-card, .pp-multiplier-pill, .pp-variant-option-btn'
      );

      interactiveElements.forEach(function(el) {
        el.addEventListener('touchstart', function() {
          this.classList.add('pp-touch-active');
        }, passiveOption);

        el.addEventListener('touchend', function() {
          this.classList.remove('pp-touch-active');
        }, passiveOption);

        el.addEventListener('touchcancel', function() {
          this.classList.remove('pp-touch-active');
        }, passiveOption);
      });

      console.log('[PowerPairs Touch] Enhanced touch support initialized');
    },

    handleSwipeDown: function(element, callback) {
      var self = this;

      element.addEventListener('touchstart', function(e) {
        self.startY = e.touches[0].clientY;
      }, { passive: true });

      element.addEventListener('touchmove', function(e) {
        var currentY = e.touches[0].clientY;
        var diff = currentY - self.startY;

        // If swiping down more than threshold
        if (diff > self.threshold) {
          callback(diff);
        }
      }, { passive: true });
    }
  };

  /**
   * FEATURE DETECTION
   */
  var Features = {
    hasGrid: (function() {
      var el = document.createElement('div');
      return typeof el.style.grid !== 'undefined';
    })(),

    hasBackdropFilter: (function() {
      var el = document.createElement('div');
      return typeof el.style.backdropFilter !== 'undefined' ||
             typeof el.style.webkitBackdropFilter !== 'undefined';
    })(),

    hasCustomProperties: (function() {
      return window.CSS && window.CSS.supports && window.CSS.supports('--test', '0');
    })(),

    hasStickyPosition: (function() {
      var el = document.createElement('div');
      var prefixes = ['', '-webkit-', '-moz-', '-ms-'];
      for (var i = 0; i < prefixes.length; i++) {
        el.style.position = prefixes[i] + 'sticky';
        if (el.style.position !== '') return true;
      }
      return false;
    })(),

    hasIntersectionObserver: 'IntersectionObserver' in window,
    hasResizeObserver: 'ResizeObserver' in window,
    hasRequestIdleCallback: 'requestIdleCallback' in window
  };

  console.log('[PowerPairs Features] Support:', Features);

  // Add feature classes to document for CSS targeting
  if (!Features.hasBackdropFilter) {
    document.documentElement.classList.add('no-backdrop-filter');
  }
  if (!Features.hasGrid) {
    document.documentElement.classList.add('no-grid');
  }

  /**
   * ═══════════════════════════════════════════════════════
   * PERFORMANCE UTILITIES
   * Debounce, throttle, and optimization helpers
   * ═══════════════════════════════════════════════════════
   */

  /**
   * Debounce function - limits function execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function - ensures function runs at most once per interval
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  function throttle(func, limit = 200) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Request idle callback polyfill
   * @param {Function} callback - Function to run when idle
   */
  const requestIdleCallback = window.requestIdleCallback || function(callback) {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  };

  /**
   * Intersection Observer for lazy animations
   */
  const observeVisibility = (() => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      return (element) => {
        element.classList.add('visible');
      };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    return (element) => {
      observer.observe(element);
    };
  })();

  /**
   * Measure performance
   * @param {string} label - Performance mark label
   */
  function perfMark(label) {
    if (window.performance && performance.mark) {
      performance.mark(label);
    }
  }

  /**
   * Log performance measure
   * @param {string} name - Measure name
   * @param {string} startMark - Start mark
   * @param {string} endMark - End mark
   */
  function perfMeasure(name, startMark, endMark) {
    if (window.performance && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`[PowerPairs Perf] ${name}: ${measure.duration.toFixed(2)}ms`);
      } catch (e) {
        // Marks might not exist
      }
    }
  }

  /**
   * ═══════════════════════════════════════════════════════
   * ACCESSIBILITY UTILITIES
   * Screen reader announcements and focus management
   * ═══════════════════════════════════════════════════════
   */

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  function announceToScreenReader(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'pp-sr-alerts' : 'pp-sr-announcements';
    const region = document.getElementById(regionId);

    if (region) {
      // Clear previous message
      region.textContent = '';

      // Set new message after brief delay (ensures announcement)
      setTimeout(() => {
        region.textContent = message;
        console.log(`[PowerPairs A11y] Announced (${priority}): ${message}`);
      }, 100);

      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 5000);
    }
  }

  /**
   * Track if user is using mouse vs keyboard
   * Helps optimize focus indicators
   */
  function initInputModeTracking() {
    let usingMouse = false;

    document.addEventListener('mousedown', () => {
      usingMouse = true;
      document.body.classList.add('user-is-using-mouse');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        usingMouse = false;
        document.body.classList.remove('user-is-using-mouse');
      }
    });
  }

  /**
   * Trap focus within an element
   * @param {HTMLElement} element - Element to trap focus in
   * @returns {Function} Cleanup function
   */
  function trapFocus(element) {
    const getFocusableElements = () => {
      return element.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    };

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Initialize input mode tracking
  initInputModeTracking();

/**
 * ═══════════════════════════════════════════════════════════
 * TIER CONFIGURATION & CONSTANTS
 * ═══════════════════════════════════════════════════════════
 */

// Tier discount multipliers (applied to subtotal)
const TIER_MULTIPLIERS = {
  1: 0.91,  // 60% OFF total savings
  2: 0.76,  // 70% OFF total savings
  3: 0.65,  // 80% OFF total savings
  4: 0.57   // 85% OFF total savings
};

// Tier icons
const TIER_ICONS = {
  1: '⚡',
  2: '🎁',
  3: '🔥',
  4: '💎'
};


/**
 * ═══════════════════════════════════════════════════════════
 * POWER PAIRS STATE MANAGER
 * Centralized state management for bundle configuration
 * ═══════════════════════════════════════════════════════════
 */
class PowerPairsState {
  constructor(initialData) {
    console.log('[PowerPairs State] Initializing with data:', initialData);

    if (!initialData || !initialData.bundles) {
      console.error('[PowerPairs State] Invalid initial data');
      this.bundles = [];
      this.activeBundleId = null;
      return;
    }

    this.bundles = this.initializeBundles(initialData.bundles);
    this.activeBundleId = null;

    console.log(`[PowerPairs State] Initialized ${this.bundles.length} bundles`);
  }

  /**
   * Initialize bundles with default state
   * @param {Array} bundles - Raw bundle data from JSON
   * @returns {Array} Initialized bundles with state
   */
  initializeBundles(bundles) {
    return bundles.map(bundle => {
      console.log(`[PowerPairs State] Initializing bundle: ${bundle.id}`);

      // Process products: set default variants and selection status
      const processedProducts = bundle.products.map(product => {
        // Default to first variant
        const defaultVariant = product.variants[0];

        const processedProduct = {
          ...product,
          selectedVariantId: defaultVariant.id,
          selectedVariant: defaultVariant,
          variantSelected: !product.hasVariants, // Auto-complete if no variants
          variantSelectionComplete: !product.hasVariants,
          isSwapped: false, // Track if product has been swapped
          originalProduct: null // Store original product data for undo
        };

        return processedProduct;
      });

      // Check if all variants are selected
      const variantsComplete = this.checkVariantsComplete(processedProducts);

      // Calculate base pricing (before multiplier)
      const baseSubtotal = this.calculateBaseSubtotal(processedProducts);
      const baseItemCount = processedProducts.reduce((sum, p) => sum + p.quantity, 0);

      return {
        ...bundle,
        products: processedProducts,
        multiplier: 1, // Default multiplier
        variantsComplete: variantsComplete,
        baseSubtotal: baseSubtotal,
        baseItemCount: baseItemCount,
        currentPrice: baseSubtotal, // Will be updated with tier calculations in Prompt 11
        currentItemCount: baseItemCount
      };
    });
  }

  /**
   * Check if all products in bundle have variants selected
   * @param {Array} products - Array of products
   * @returns {boolean} True if all complete
   */
  checkVariantsComplete(products) {
    return products.every(product => product.variantSelectionComplete);
  }

  /**
   * Calculate base subtotal for bundle
   * @param {Array} products - Array of products
   * @returns {number} Subtotal in cents
   */
  calculateBaseSubtotal(products) {
    return products.reduce((sum, product) => {
      const variant = product.selectedVariant;
      if (variant) {
        return sum + (variant.price * product.quantity);
      }
      return sum;
    }, 0);
  }

  /**
   * Calculate compare-at subtotal for bundle (using product.compareAtPrice)
   * @param {Array} products - Array of products
   * @returns {number} Compare-at subtotal in cents
   */
  calculateCompareAtSubtotal(products) {
    return products.reduce((sum, product) => {
      // Use the product's compareAtPrice (set in Liquid from product.compare_at_price)
      const comparePrice = product.compareAtPrice || product.price;
      return sum + (comparePrice * product.quantity);
    }, 0);
  }

  /**
   * Set the currently active bundle
   * @param {string} bundleId - Bundle identifier
   */
  setActiveBundle(bundleId) {
    console.log(`[PowerPairs State] Setting active bundle: ${bundleId}`);
    this.activeBundleId = bundleId;
  }

  /**
   * Get the currently active bundle
   * @returns {Object|null} Active bundle or null
   */
  getActiveBundle() {
    if (!this.activeBundleId) {
      return null;
    }

    const bundle = this.bundles.find(b => b.id === this.activeBundleId);

    if (!bundle) {
      console.error(`[PowerPairs State] Bundle not found: ${this.activeBundleId}`);
      return null;
    }

    return bundle;
  }

  /**
   * Get bundle by ID
   * @param {string} bundleId - Bundle identifier
   * @returns {Object|null} Bundle or null
   */
  getBundleById(bundleId) {
    return this.bundles.find(b => b.id === bundleId) || null;
  }

  /**
   * Update selected variant for a product
   * @param {number} productId - Product ID
   * @param {number} variantId - Variant ID
   */
  updateVariant(productId, variantId) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return;
    }

    const product = bundle.products.find(p => p.id == productId);

    if (!product) {
      console.error(`[PowerPairs State] Product not found: ${productId}`);
      return;
    }

    // Find the new variant
    const newVariant = product.variants.find(v => v.id == variantId);

    if (!newVariant) {
      console.error(`[PowerPairs State] Variant not found: ${variantId}`);
      return;
    }

    console.log(`[PowerPairs State] Updating variant for ${product.title}: ${newVariant.title}`);

    // Update product state
    product.selectedVariantId = newVariant.id;
    product.selectedVariant = newVariant;
    product.variantSelectionComplete = true;

    // Recalculate bundle completion status
    bundle.variantsComplete = this.checkVariantsComplete(bundle.products);

    // Recalculate pricing
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;

    console.log(`[PowerPairs State] Bundle variants complete: ${bundle.variantsComplete}`);
  }

  /**
   * Update product quantity
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity (min 1)
   * @returns {boolean} Success status
   */
  updateProductQuantity(productId, quantity) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return false;
    }

    const product = bundle.products.find(p => p.id == productId);

    if (!product) {
      console.error(`[PowerPairs State] Product not found: ${productId}`);
      return false;
    }

    // Validate quantity (minimum 1)
    const newQuantity = Math.max(1, Math.floor(quantity));

    console.log(`[PowerPairs State] Updating quantity for ${product.title}: ${product.quantity} → ${newQuantity}`);

    // Update product quantity
    product.quantity = newQuantity;

    // Recalculate bundle totals
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.baseItemCount = bundle.products.reduce((sum, p) => sum + p.quantity, 0);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;
    bundle.currentItemCount = bundle.baseItemCount * bundle.multiplier;

    console.log('[PowerPairs State] Quantity updated successfully', {
      product: product.title,
      quantity: newQuantity,
      baseSubtotal: bundle.baseSubtotal,
      baseItemCount: bundle.baseItemCount
    });

    return true;
  }

  /**
   * Update bundle multiplier
   * @param {number} multiplier - New multiplier value
   */
  updateMultiplier(multiplier) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return;
    }

    console.log(`[PowerPairs State] Updating multiplier: ${multiplier}x`);

    bundle.multiplier = multiplier;
    bundle.currentItemCount = bundle.baseItemCount * multiplier;
    bundle.currentPrice = bundle.baseSubtotal * multiplier;
  }

  /**
   * Get all bundles
   * @returns {Array} All bundles
   */
  getAllBundles() {
    return this.bundles;
  }

  /**
   * Swap a product with a new one
   * @param {number} originalProductId - ID of product to swap out
   * @param {Object} newProductData - New product data from swap modal
   */
  swapProduct(originalProductId, newProductData) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return false;
    }

    const productIndex = bundle.products.findIndex(p => p.id == originalProductId);

    if (productIndex === -1) {
      console.error(`[PowerPairs State] Product not found: ${originalProductId}`);
      return false;
    }

    const product = bundle.products[productIndex];

    console.log(`[PowerPairs State] Swapping product: ${product.title} -> ${newProductData.title}`);

    // Store original product data - ALWAYS store it to ensure undo works
    // If already swapped, preserve the original originalProduct (don't overwrite)
    if (!product.originalProduct) {
      product.originalProduct = {
        id: product.id,
        title: product.title,
        handle: product.handle,
        image: product.image,
        price: product.price,
        compareAtPrice: product.compareAtPrice || product.price,
        variants: product.variants ? [...product.variants] : [],
        hasVariants: product.hasVariants,
        selectedVariantId: product.selectedVariantId,
        selectedVariant: product.selectedVariant ? { ...product.selectedVariant } : null,
        variantSelectionComplete: product.variantSelectionComplete,
        quantity: product.quantity,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isBestSeller: product.isBestSeller
      };
      
      console.log('[PowerPairs State] Stored original product data:', {
        id: product.originalProduct.id,
        title: product.originalProduct.title,
        hasSelectedVariant: !!product.originalProduct.selectedVariant
      });
    } else {
      console.log('[PowerPairs State] Original product data already stored, preserving it');
    }

    // Update product with new data (keeping quantity and other bundle-specific settings)
    product.id = newProductData.id;
    product.title = newProductData.title;
    product.handle = newProductData.handle;
    product.image = newProductData.image;
    product.price = newProductData.price;
    product.compareAtPrice = newProductData.compareAtPrice;
    product.variants = newProductData.variants;
    product.hasVariants = newProductData.hasVariants;
    product.selectedVariantId = newProductData.selectedVariantId;
    product.selectedVariant = newProductData.selectedVariant;
    product.variantSelectionComplete = true; // Auto-complete since we selected a product
    product.isSwapped = true;

    // Validation: Ensure swap state is correct
    if (!product.originalProduct) {
      console.error('[PowerPairs State] CRITICAL: originalProduct is missing after swap!');
      return false;
    }

    if (!product.isSwapped) {
      console.error('[PowerPairs State] CRITICAL: isSwapped flag not set after swap!');
      product.isSwapped = true; // Fix it
    }

    // Recalculate bundle completion status
    bundle.variantsComplete = this.checkVariantsComplete(bundle.products);

    // Recalculate pricing
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;

    console.log('[PowerPairs State] Product swapped successfully', {
      newProduct: {
        id: product.id,
        title: product.title,
        price: product.price
      },
      originalProduct: {
        id: product.originalProduct.id,
        title: product.originalProduct.title
      },
      isSwapped: product.isSwapped,
      hasOriginal: !!product.originalProduct,
      baseSubtotal: bundle.baseSubtotal
    });

    return true;
  }

  /**
   * Undo a product swap and restore original
   * @param {number|string} currentProductId - ID of current (swapped) product
   */
  undoSwap(currentProductId) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return false;
    }

    // Try multiple ways to find the product
    let product = null;

    // Method 1: Find by ID (try both string and number comparison)
    product = bundle.products.find(p => {
      return p.id == currentProductId || 
             p.id === currentProductId || 
             String(p.id) === String(currentProductId);
    });

    // Method 2: If not found, try to find any swapped product (fallback)
    if (!product) {
      product = bundle.products.find(p => {
        return (p.isSwapped === true || p.originalProduct) && 
               (String(p.id) === String(currentProductId) || p.id == currentProductId);
      });
    }

    if (!product) {
      console.error(`[PowerPairs State] Product not found: ${currentProductId}`, {
        searchedId: currentProductId,
        availableProducts: bundle.products.map(p => ({
          id: p.id,
          title: p.title,
          isSwapped: p.isSwapped,
          hasOriginal: !!p.originalProduct
        }))
      });
      return false;
    }

    // Enhanced validation: Check if product can be undone
    // Allow undo if originalProduct exists, even if isSwapped flag is inconsistent
    if (!product.originalProduct) {
      console.error('[PowerPairs State] Product has no original data to restore:', {
        productId: product.id,
        title: product.title,
        isSwapped: product.isSwapped,
        hasOriginal: false
      });
      return false;
    }

    // Fix inconsistent state if needed
    if (!product.isSwapped && product.originalProduct) {
      console.warn('[PowerPairs State] Fixing inconsistent swap state for:', product.title);
      product.isSwapped = true;
    }

    const original = product.originalProduct;

    // Validate original data
    if (!original.id || !original.title) {
      console.error('[PowerPairs State] Original product data is invalid:', original);
      return false;
    }

    console.log(`[PowerPairs State] Undoing swap: ${product.title} -> ${original.title}`);

    // Restore original product data
    product.id = original.id;
    product.title = original.title;
    product.handle = original.handle || product.handle;
    product.image = original.image || product.image;
    product.price = original.price;
    product.compareAtPrice = original.compareAtPrice || original.price;
    product.variants = original.variants || product.variants;
    product.hasVariants = original.hasVariants !== undefined ? original.hasVariants : product.hasVariants;
    product.selectedVariantId = original.selectedVariantId;
    product.selectedVariant = original.selectedVariant || product.selectedVariant;
    product.variantSelectionComplete = original.variantSelectionComplete !== undefined 
      ? original.variantSelectionComplete 
      : product.variantSelectionComplete;
    
    // Clear swap state
    product.isSwapped = false;
    product.originalProduct = null;

    // Recalculate bundle completion status
    bundle.variantsComplete = this.checkVariantsComplete(bundle.products);

    // Recalculate pricing
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;

    console.log('[PowerPairs State] Swap undone successfully', {
      restoredProduct: {
        id: product.id,
        title: product.title,
        price: product.price
      },
      baseSubtotal: bundle.baseSubtotal
    });

    return true;
  }

  /**
   * Remove a product from the bundle
   * @param {number|string} productId - ID of product to remove
   * @returns {Object|null} Removed product data (for undo) or null if failed
   */
  removeProduct(productId) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return null;
    }

    // Validation: Must keep at least 1 product
    if (bundle.products.length <= 1) {
      console.warn('[PowerPairs State] Cannot remove last product. Minimum 1 product required.');
      return null;
    }

    // Find product to remove
    const productIndex = bundle.products.findIndex(p => {
      return p.id == productId || 
             p.id === productId || 
             String(p.id) === String(productId);
    });

    if (productIndex === -1) {
      console.error(`[PowerPairs State] Product not found: ${productId}`);
      return null;
    }

    const product = bundle.products[productIndex];

    console.log(`[PowerPairs State] Removing product: ${product.title}`);

    // Store removed product data for undo (temporary)
    const removedProductData = {
      ...product,
      index: productIndex
    };

    // Remove product from array
    bundle.products.splice(productIndex, 1);

    // Recalculate bundle completion status
    bundle.variantsComplete = this.checkVariantsComplete(bundle.products);

    // Recalculate pricing
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.baseItemCount = bundle.products.reduce((sum, p) => sum + p.quantity, 0);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;
    bundle.currentItemCount = bundle.baseItemCount * bundle.multiplier;

    console.log('[PowerPairs State] Product removed successfully', {
      removedProduct: product.title,
      remainingProducts: bundle.products.length,
      baseSubtotal: bundle.baseSubtotal,
      baseItemCount: bundle.baseItemCount
    });

    return removedProductData;
  }

  /**
   * Add a product to the bundle
   * @param {Object} productData - Product data from swap modal
   * @returns {boolean} Success status
   */
  addProduct(productData) {
    const bundle = this.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs State] No active bundle');
      return false;
    }

    console.log(`[PowerPairs State] Adding product: ${productData.title}`);

    // Create new product object with default quantity of 1
    const newProduct = {
      id: productData.id,
      title: productData.title,
      handle: productData.handle,
      image: productData.image,
      price: productData.price,
      compareAtPrice: productData.compareAtPrice || productData.price,
      variants: productData.variants || [],
      hasVariants: productData.hasVariants || false,
      selectedVariantId: productData.selectedVariantId,
      selectedVariant: productData.selectedVariant,
      variantSelectionComplete: true, // Auto-complete since we selected a product
      quantity: 1, // Default quantity
      isSwapped: false,
      originalProduct: null,
      rating: productData.rating || 0,
      reviewCount: productData.reviewCount || 0,
      isBestSeller: productData.isBestSeller || false
    };

    // Add product to bundle
    bundle.products.push(newProduct);

    // Recalculate bundle completion status
    bundle.variantsComplete = this.checkVariantsComplete(bundle.products);

    // Recalculate pricing
    bundle.baseSubtotal = this.calculateBaseSubtotal(bundle.products);
    bundle.baseItemCount = bundle.products.reduce((sum, p) => sum + p.quantity, 0);
    bundle.currentPrice = bundle.baseSubtotal * bundle.multiplier;
    bundle.currentItemCount = bundle.baseItemCount * bundle.multiplier;

    console.log('[PowerPairs State] Product added successfully', {
      newProduct: newProduct.title,
      totalProducts: bundle.products.length,
      baseSubtotal: bundle.baseSubtotal,
      baseItemCount: bundle.baseItemCount
    });

    return true;
  }
}

/**
 * ═══════════════════════════════════════════════════════════
 * VARIANT MODAL MANAGER
 * Handles variant selection mini-modal
 * ═══════════════════════════════════════════════════════════
 */
class VariantModal {
  constructor() {
    this.modal = document.getElementById('pp-variant-modal');
    this.overlay = document.getElementById('pp-variant-modal-overlay');
    this.closeButton = this.modal?.querySelector('.pp-variant-modal__close');
    this.contentArea = document.getElementById('pp-variant-modal-content');

    this.currentProductId = null;
    this.isOpen = false;
    this.isProcessing = false; // Prevent rapid clicks
    this.focusableElements = [];
    this.previouslyFocusedElement = null;

    // Verify required elements exist
    if (!this.modal || !this.overlay) {
      console.error('[PowerPairs Variant Modal] Modal elements not found');
      return;
    }

    this.init();
  }

  /**
   * Initialize event listeners
   */
  init() {
    console.log('[PowerPairs Variant Modal] Initializing');

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close(), { passive: true });
    }

    // Overlay click to close
    this.overlay.addEventListener('click', () => this.close(), { passive: true });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        console.log('[PowerPairs Variant Modal] ESC key pressed');
        this.close();
      }
    }, { passive: true });

    console.log('[PowerPairs Variant Modal] Initialized');
  }

  /**
   * Open the variant modal
   * @param {number} productId - Product ID
   */
  open(productId) {
    if (this.isOpen && this.currentProductId === productId) {
      console.log('[PowerPairs Variant Modal] Already open for this product');
      return;
    }

    console.log(`[PowerPairs Variant Modal] Opening for product: ${productId}`);

    // Get product data from state
    const bundle = window.PPState.getActiveBundle();
    if (!bundle) {
      console.error('[PowerPairs Variant Modal] No active bundle');
      return;
    }

    const product = bundle.products.find(p => p.id == productId);
    if (!product) {
      console.error(`[PowerPairs Variant Modal] Product not found: ${productId}`);
      return;
    }

    // Check if product has variants
    if (!product.hasVariants) {
      console.log('[PowerPairs Variant Modal] Product has no variants, skipping modal');
      return;
    }

    // Store current product
    this.currentProductId = productId;

    // Store previously focused element
    this.previouslyFocusedElement = document.activeElement;

    // Populate content
    this.renderModalContent(product);

    // Show overlay
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');

    // Show modal
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');

    // Lock scroll on iOS (variant modal is on top of bottom sheet)
    if (!document.body.classList.contains('pp-sheet-open')) {
      IOSScrollLock.lock();
    }

    // Update state
    this.isOpen = true;

    // Focus first element (after animation)
    setTimeout(() => {
      this.trapFocus();
      this.focusFirstElement();
    }, 300);

    console.log('[PowerPairs Variant Modal] Opened successfully');
  }

  /**
   * Close the variant modal
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    console.log('[PowerPairs Variant Modal] Closing');

    // Hide modal
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');

    // Hide overlay
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');

    // Update state
    this.isOpen = false;
    this.currentProductId = null;
    this.isProcessing = false; // Reset processing flag

    // Unlock scroll on iOS (only if bottom sheet isn't open)
    if (!document.body.classList.contains('pp-sheet-open')) {
      IOSScrollLock.unlock();
    }

    // Announce closure
    announceToScreenReader('Variant selector closed', 'polite');

    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }

    console.log('[PowerPairs Variant Modal] Closed successfully');
  }

  /**
   * Render modal content
   * @param {Object} product - Product data
   */
  renderModalContent(product) {
    console.log('[PowerPairs Variant Modal] Rendering content for:', product.title);

    // Render product header
    const headerHTML = `
      <div class="pp-variant-product-header">
        <img
          src="${product.selectedVariant.image || product.image}"
          alt="${product.title}"
          class="pp-variant-product-image"
          loading="lazy"
        >
        <div class="pp-variant-product-info">
          <h3 id="pp-variant-modal-title" class="pp-variant-product-title">
            ${product.title}
          </h3>
          <div class="pp-variant-product-price">
            ${this.formatMoney(product.selectedVariant.price)}
            <span style="font-size: 14px; color: var(--pp-text-secondary);"> × ${product.quantity}</span>
          </div>
        </div>
      </div>
    `;

    // Render variant options
    const variantOptionsHTML = this.renderVariantOptions(product);

    // Note: Confirm button removed - auto-close after selection

    // Combine all sections
    this.contentArea.innerHTML = `
      ${headerHTML}
      ${variantOptionsHTML}
      <div class="pp-variant-success-feedback">
        <p class="pp-variant-success-text">Variant Selected!</p>
      </div>
      <div class="pp-variant-error-message">
        <span class="pp-variant-error-icon">⚠</span>
        <span class="pp-variant-error-text"></span>
      </div>
    `;

    // Attach event listeners
    this.attachVariantListeners();

    console.log('[PowerPairs Variant Modal] Content rendered');
  }

  /**
   * Render variant options
   * @param {Object} product - Product data
   * @returns {string} HTML string
   */
  renderVariantOptions(product) {
    const variantsHTML = product.variants.map(variant => {
      const isSelected = variant.id === product.selectedVariantId;
      const isAvailable = variant.available;

      let btnClass = 'pp-variant-option-btn';
      if (isSelected) btnClass += ' pp-variant-option-btn--selected';
      if (!isAvailable) btnClass += ' pp-variant-option-btn--unavailable';

      // Show compare-at price if available
      const showComparePrice = variant.compare_at_price && variant.compare_at_price > variant.price;

      return `
        <button
          class="${btnClass}"
          data-variant-id="${variant.id}"
          data-action="select-variant"
          ${!isAvailable ? 'disabled' : ''}
          aria-pressed="${isSelected}"
          aria-label="Select ${variant.title}${!isAvailable ? ' (Out of stock)' : ''}"
        >
          <div class="pp-variant-option-inner">
            <div class="pp-variant-option-header">
              ${variant.image && variant.image !== product.image ? `
                <img
                  src="${variant.image}"
                  alt="${variant.title}"
                  class="pp-variant-option-image"
                  loading="lazy"
                >
              ` : ''}
              <div class="pp-variant-option-label">${variant.title}</div>
            </div>
            <div class="pp-variant-option-price">
              ${showComparePrice ? `<s style="opacity: 0.6; font-size: 11px;">${this.formatMoney(variant.compare_at_price)}</s> ` : ''}
              ${this.formatMoney(variant.price)}
            </div>
          </div>
        </button>
      `;
    }).join('');

    return `
      <div class="pp-variant-options-section">
        <h4 class="pp-variant-options-title">Choose Variant</h4>
        <div class="pp-variant-options-grid">
          ${variantsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to variant buttons
   */
  attachVariantListeners() {
    // Variant option buttons
    const variantButtons = this.contentArea.querySelectorAll('[data-action="select-variant"]');

    console.log(`[PowerPairs Variant Modal] Attaching listeners to ${variantButtons.length} variant buttons`);

    variantButtons.forEach((button, index) => {
      // Click listener
      button.addEventListener('click', (e) => {
        const variantId = button.dataset.variantId;
        console.log(`[PowerPairs Variant Modal] Variant button clicked: ${variantId}`);

        // Add ripple effect
        button.classList.add('ripple');
        setTimeout(() => button.classList.remove('ripple'), 600);

        // Handle selection with auto-close
        this.handleVariantSelectionWithAutoClose(variantId, button);
      });

      // Keyboard navigation
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextButton = variantButtons[index + 1] || variantButtons[0];
          nextButton.focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevButton = variantButtons[index - 1] || variantButtons[variantButtons.length - 1];
          prevButton.focus();
        }
      });

      // Focus highlighting
      button.addEventListener('focus', () => {
        button.classList.add('pp-variant-option-btn--keyboard-focus');
      });

      button.addEventListener('blur', () => {
        button.classList.remove('pp-variant-option-btn--keyboard-focus');
      });
    });

    // Note: Confirm button removed - auto-close replaces it
  }

  /**
   * Confirm selection and refresh product grid
   */
  confirmAndRefresh() {
    console.log('[PowerPairs Variant Modal] Confirming and refreshing grid');

    // Close modal
    this.close();

    // Refresh product grid in expansion manager
    if (window.PPExpansionManager) {
      window.PPExpansionManager.refreshProductGrid();
      window.PPExpansionManager.refreshBundleCard();
    } else {
      console.error('[PowerPairs Variant Modal] ExpansionManager not found');
    }
  }

  /**
   * Handle variant selection
   * @param {number} variantId - Variant ID
   */
  handleVariantSelection(variantId) {
    console.log(`[PowerPairs Variant Modal] Variant selected: ${variantId}`);

    // Get product
    const bundle = window.PPState.getActiveBundle();
    const product = bundle.products.find(p => p.id == this.currentProductId);

    if (!product) {
      console.error('[PowerPairs Variant Modal] Product not found');
      return;
    }

    // Update visual selection in modal (highlight selected)
    const allButtons = this.contentArea.querySelectorAll('[data-action="select-variant"]');
    allButtons.forEach(btn => {
      const isThisVariant = btn.dataset.variantId == variantId;
      btn.classList.toggle('pp-variant-option-btn--selected', isThisVariant);
      btn.setAttribute('aria-pressed', isThisVariant);
    });

    // Update state
    window.PPState.updateVariant(this.currentProductId, variantId);
    console.log('[PowerPairs Variant Modal] State updated');

    // Update modal header to reflect new selection
    this.updateModalProductHeader(product);
  }

  /**
   * Update modal product header after variant selection
   * @param {Object} product - Product data
   */
  updateModalProductHeader(product) {
    const headerElement = this.contentArea.querySelector('.pp-variant-product-header');
    if (!headerElement) return;

    const imageElement = headerElement.querySelector('.pp-variant-product-image');
    const priceElement = headerElement.querySelector('.pp-variant-product-price');

    if (imageElement) {
      imageElement.src = product.selectedVariant.image || product.image;
    }

    if (priceElement) {
      priceElement.innerHTML = `
        ${this.formatMoney(product.selectedVariant.price)}
        <span style="font-size: 14px; color: var(--pp-text-secondary);"> × ${product.quantity}</span>
      `;
    }

    console.log('[PowerPairs Variant Modal] Header updated');
  }

  /**
   * Handle variant selection with auto-close
   * @param {number} variantId - Variant ID
   * @param {HTMLElement} button - The clicked button element
   */
  handleVariantSelectionWithAutoClose(variantId, button) {
    console.log(`[PowerPairs Variant Modal] Processing variant selection with auto-close: ${variantId}`);

    // Prevent multiple rapid clicks
    if (this.isProcessing) {
      console.log('[PowerPairs Variant Modal] Already processing, ignoring click');
      announceToScreenReader('Processing your selection', 'polite');
      return;
    }

    this.isProcessing = true;

    // Get product from state
    const bundle = window.PPState.getActiveBundle();
    const product = bundle.products.find(p => p.id == this.currentProductId);

    if (!product) {
      console.error('[PowerPairs Variant Modal] Product not found');
      this.showError('Product not found. Please try again.');
      announceToScreenReader('Error: Product not found', 'assertive');
      this.isProcessing = false;
      return;
    }

    // Get variant details for announcement
    const variant = product.variants.find(v => v.id == variantId);
    if (variant) {
      announceToScreenReader(
        `${variant.title} selected for ${product.title}. Price: ${this.formatMoney(variant.price)}`,
        'polite'
      );
    }

    try {
      // Add selection animation to clicked button
      button.classList.add('pp-variant-option-btn--selecting');

      // Update visual selection in modal
      const allButtons = this.contentArea.querySelectorAll('[data-action="select-variant"]');
      allButtons.forEach(btn => {
        const isThisVariant = btn.dataset.variantId == variantId;
        btn.classList.toggle('pp-variant-option-btn--selected', isThisVariant);
        btn.setAttribute('aria-pressed', isThisVariant);
      });

      // Update state
      window.PPState.updateVariant(this.currentProductId, variantId);
      console.log('[PowerPairs Variant Modal] State updated successfully');

      // Update modal header
      this.updateModalProductHeader(product);

      // Show success feedback
      this.showSuccessFeedback();

      // Auto-close after brief delay (visual confirmation)
      setTimeout(() => {
        this.confirmAndRefresh();
        this.isProcessing = false;
      }, 800); // 800ms allows user to see success feedback

    } catch (error) {
      console.error('[PowerPairs Variant Modal] Error during variant selection:', error);
      this.showError('Failed to update variant. Please try again.');
      this.isProcessing = false;
    }
  }

  /**
   * Show success feedback overlay (auto-hides after 800ms)
   */
  showSuccessFeedback() {
    const successOverlay = this.contentArea.querySelector('.pp-variant-success-feedback');

    if (successOverlay) {
      successOverlay.classList.add('active');

      console.log('[PowerPairs Variant Modal] Success feedback displayed');

      // Auto-hide after 800ms
      setTimeout(() => {
        successOverlay.classList.remove('active');
      }, 800);
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const errorElement = this.contentArea.querySelector('.pp-variant-error-message');
    const errorTextElement = this.contentArea.querySelector('.pp-variant-error-text');

    if (errorElement && errorTextElement) {
      errorTextElement.textContent = message;
      errorElement.classList.add('active');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        errorElement.classList.remove('active');
      }, 3000);

      console.log('[PowerPairs Variant Modal] Error displayed:', message);
    }
  }

  /**
   * Trap focus within modal
   */
  trapFocus() {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.modal.querySelectorAll(focusableSelectors.join(','))
    );

    console.log(`[PowerPairs Variant Modal] Trapped focus on ${this.focusableElements.length} elements`);
  }

  /**
   * Focus first focusable element
   */
  focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  /**
   * Format money
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price
   */
  formatMoney(cents) {
    // Use Shopify's formatMoney if available
    if (window.Shopify && window.Shopify.formatMoney) {
      const format = window.theme && window.theme.moneyFormat ? window.theme.moneyFormat : '{{amount}}';
      return window.Shopify.formatMoney(cents, format);
    }
    
    // Manual fallback using theme money format
    if (window.theme && window.theme.moneyFormat) {
      const amount = (cents / 100).toFixed(2);
      return window.theme.moneyFormat.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
    }
    
    console.error('[PowerPairs] Currency formatting not available');
    return '';
  }
}

/**
 * ═══════════════════════════════════════════════════════════
 * SWAP MODAL MANAGER
 * Handles product swap functionality with full-screen modal
 * ═══════════════════════════════════════════════════════════
 */
class SwapModal {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.closeButton = null;
    this.contentArea = null;
    this.gridContainer = null;
    this.loadMoreButton = null;
    
    this.currentProductId = null;
    this.mode = 'swap'; // 'swap' or 'add'
    this.isOpen = false;
    this.isLoading = false;
    this.productsData = [];
    this.displayedCount = 0;
    this.productsPerLoad = 20;
    this.previouslyFocusedElement = null;

    this.createModalStructure();
    this.init();
  }

  /**
   * Create modal DOM structure
   */
  createModalStructure() {
    console.log('[PowerPairs Swap] Creating modal structure');

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'pp-swap-modal-overlay';
    this.overlay.id = 'pp-swap-modal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'pp-swap-modal';
    this.modal.id = 'pp-swap-modal';
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-labelledby', 'pp-swap-modal-title');
    this.modal.setAttribute('aria-hidden', 'true');

    // Modal HTML structure
    this.modal.innerHTML = `
      <div class="pp-swap-modal__header">
        <h2 id="pp-swap-modal-title" class="pp-swap-modal__title">
          Choose Replacement Product
        </h2>
        <button class="pp-swap-modal__close" aria-label="Close swap modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="pp-swap-modal__body">
        <div class="pp-swap-modal__loading">
          <div class="pp-loading-spinner"></div>
          <p>Loading products...</p>
        </div>
        <div id="pp-swap-products-grid" class="pp-swap-products-grid"></div>
        <div class="pp-swap-load-more-container">
          <button id="pp-swap-load-more" class="pp-swap-load-more-btn" style="display: none;">
            Load More Products
          </button>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.modal);

    // Store references
    this.closeButton = this.modal.querySelector('.pp-swap-modal__close');
    this.contentArea = this.modal.querySelector('.pp-swap-modal__body');
    this.gridContainer = document.getElementById('pp-swap-products-grid');
    this.loadMoreButton = document.getElementById('pp-swap-load-more');

    console.log('[PowerPairs Swap] Modal structure created');
  }

  /**
   * Initialize event listeners
   */
  init() {
    console.log('[PowerPairs Swap] Initializing');

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close(), { passive: true });
    }

    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close(), { passive: true });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        console.log('[PowerPairs Swap] ESC key pressed');
        this.close();
      }
    }, { passive: true });

    // Load more button
    if (this.loadMoreButton) {
      this.loadMoreButton.addEventListener('click', () => this.loadMoreProducts());
    }

    console.log('[PowerPairs Swap] Initialized');
  }

  /**
   * Open the swap modal
   * @param {number|null} productId - Product ID to swap (null for add mode)
   * @param {string} mode - 'swap' or 'add'
   */
  async open(productId = null, mode = 'swap') {
    if (this.isOpen) {
      console.log('[PowerPairs Swap] Modal already open');
      return;
    }

    this.mode = mode;
    this.currentProductId = productId;

    console.log(`[PowerPairs Swap] Opening modal in ${mode} mode${productId ? ` for product: ${productId}` : ''}`);

    this.previouslyFocusedElement = document.activeElement;

    // Show overlay and modal
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');

    // Lock scroll
    document.body.classList.add('pp-swap-modal-open');
    IOSScrollLock.lock();

    this.isOpen = true;

    // Load products if not already loaded
    if (this.productsData.length === 0) {
      await this.loadProducts();
    } else {
      // Just render existing products
      this.renderProducts();
    }

    // Focus first element
    setTimeout(() => {
      this.focusFirstElement();
      const message = mode === 'add' 
        ? 'Add product modal opened. Browse products to add to bundle.'
        : 'Product swap modal opened. Browse replacement products.';
      announceToScreenReader(message, 'polite');
    }, 300);
  }

  /**
   * Close the swap modal
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    console.log('[PowerPairs Swap] Closing modal');

    // Hide modal
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');

    // Hide overlay
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');

    // Unlock scroll
    document.body.classList.remove('pp-swap-modal-open');
    IOSScrollLock.unlock();

    this.isOpen = false;
    this.currentProductId = null;

    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }

    announceToScreenReader('Swap modal closed', 'polite');
  }

  /**
   * Load products from Shopify collection
   */
  async loadProducts() {
    console.log('[PowerPairs Swap] Loading products from collection');
    
    // Show loading state
    this.showLoading(true);
    this.isLoading = true;

    try {
      // Fetch collection products
      const response = await fetch('/collections/build-your-own-bundle/products.json?limit=250');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      
      console.log(`[PowerPairs Swap] Fetched ${data.products.length} products`);

      // Process and store products
      this.productsData = data.products.map(product => {
        // Get first available variant
        const firstVariant = product.variants.find(v => v.available) || product.variants[0];
        
        // Parse prices - Shopify returns prices as cents (integers)
        // But products.json returns them as strings like "19.99", so we need to convert to cents
        const parsePrice = (priceString) => {
          if (!priceString) return 0;
          // Convert string price to cents (multiply by 100)
          const priceFloat = parseFloat(priceString);
          return Math.round(priceFloat * 100);
        };
        
        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          price: parsePrice(firstVariant.price),
          compareAtPrice: parsePrice(firstVariant.compare_at_price) || parsePrice(firstVariant.price),
          image: product.images[0]?.src || product.featured_image || '',
          variants: product.variants.map(v => ({
            id: v.id,
            title: v.title,
            price: parsePrice(v.price),
            compare_at_price: parsePrice(v.compare_at_price),
            available: v.available,
            image: v.featured_image || product.images[0]?.src || ''
          })),
          hasVariants: product.variants.length > 1,
          selectedVariantId: firstVariant.id,
          selectedVariant: {
            id: firstVariant.id,
            title: firstVariant.title,
            price: parsePrice(firstVariant.price),
            compare_at_price: parsePrice(firstVariant.compare_at_price),
            available: firstVariant.available,
            image: firstVariant.featured_image || product.images[0]?.src || ''
          }
        };
      });

      // Hide loading
      this.showLoading(false);
      this.isLoading = false;

      // Render initial products
      this.displayedCount = 0;
      this.renderProducts();

      console.log('[PowerPairs Swap] Products loaded successfully');

    } catch (error) {
      console.error('[PowerPairs Swap] Error loading products:', error);
      
      this.showLoading(false);
      this.isLoading = false;
      
      // Show error message
      this.gridContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <p style="color: var(--pp-accent-warning); font-size: 18px; margin-bottom: 12px;">⚠️ Failed to load products</p>
          <p style="color: var(--pp-text-secondary); margin-bottom: 20px;">${error.message}</p>
          <button onclick="window.PPSwapModal.loadProducts()" style="padding: 12px 24px; background: var(--pp-accent-primary); color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Try Again
          </button>
        </div>
      `;
      
      announceToScreenReader('Failed to load products. Please try again.', 'assertive');
    }
  }

  /**
   * Render products in grid
   */
  renderProducts() {
    console.log('[PowerPairs Swap] Rendering products');

    // Calculate how many more products to show
    const endIndex = Math.min(
      this.displayedCount + this.productsPerLoad,
      this.productsData.length
    );

    // Get products to display
    const productsToShow = this.productsData.slice(0, endIndex);

    console.log(`[PowerPairs Swap] Displaying ${productsToShow.length} of ${this.productsData.length} products`);

    // Generate HTML for product cards
    const cardsHTML = productsToShow.map(product => {
      const showComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;
      
      return `
        <div
          class="pp-swap-product-card"
          data-product-id="${product.id}"
          data-action="select-swap-product"
          role="button"
          tabindex="0"
          aria-label="Select ${product.title}, ${this.formatMoney(product.price)}"
        >
          <img
            src="${product.image}"
            alt="${product.title}"
            class="pp-swap-product-card__image"
            loading="lazy"
          >
          <h3 class="pp-swap-product-card__title">${product.title}</h3>
          <div class="pp-swap-product-card__price">
            ${showComparePrice ? `<s style="opacity: 0.6; font-size: 13px; margin-right: 6px;">${this.formatMoney(product.compareAtPrice)}</s>` : ''}
            ${this.formatMoney(product.price)}
          </div>
        </div>
      `;
    }).join('');

    // Update grid
    this.gridContainer.innerHTML = cardsHTML;

    // Update displayed count
    this.displayedCount = endIndex;

    // Show/hide load more button
    if (this.displayedCount < this.productsData.length) {
      this.loadMoreButton.style.display = 'block';
      this.loadMoreButton.textContent = `Load More Products (${this.productsData.length - this.displayedCount} remaining)`;
    } else {
      this.loadMoreButton.style.display = 'none';
    }

    // Attach click listeners
    this.attachProductCardListeners();
  }

  /**
   * Load more products
   */
  loadMoreProducts() {
    if (this.isLoading || this.displayedCount >= this.productsData.length) {
      return;
    }

    console.log('[PowerPairs Swap] Loading more products');

    // Calculate new end index
    const newEndIndex = Math.min(
      this.displayedCount + this.productsPerLoad,
      this.productsData.length
    );

    // Get additional products
    const additionalProducts = this.productsData.slice(this.displayedCount, newEndIndex);

    console.log(`[PowerPairs Swap] Adding ${additionalProducts.length} more products`);

    // Generate HTML for new cards
    const cardsHTML = additionalProducts.map(product => {
      const showComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;
      
      return `
        <div
          class="pp-swap-product-card"
          data-product-id="${product.id}"
          data-action="select-swap-product"
          role="button"
          tabindex="0"
          aria-label="Select ${product.title}, ${this.formatMoney(product.price)}"
        >
          <img
            src="${product.image}"
            alt="${product.title}"
            class="pp-swap-product-card__image"
            loading="lazy"
          >
          <h3 class="pp-swap-product-card__title">${product.title}</h3>
          <div class="pp-swap-product-card__price">
            ${showComparePrice ? `<s style="opacity: 0.6; font-size: 13px; margin-right: 6px;">${this.formatMoney(product.compareAtPrice)}</s>` : ''}
            ${this.formatMoney(product.price)}
          </div>
        </div>
      `;
    }).join('');

    // Append new cards
    this.gridContainer.insertAdjacentHTML('beforeend', cardsHTML);

    // Update displayed count
    this.displayedCount = newEndIndex;

    // Update load more button
    if (this.displayedCount < this.productsData.length) {
      this.loadMoreButton.textContent = `Load More Products (${this.productsData.length - this.displayedCount} remaining)`;
    } else {
      this.loadMoreButton.style.display = 'none';
    }

    // Attach listeners to new cards
    this.attachProductCardListeners();

    announceToScreenReader(`Loaded ${additionalProducts.length} more products`, 'polite');
  }

  /**
   * Attach click listeners to product cards in swap modal
   */
  attachProductCardListeners() {
    const productCards = this.gridContainer.querySelectorAll('[data-action="select-swap-product"]');

    productCards.forEach(card => {
      // Remove existing listeners to avoid duplicates
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);

      // Click listener
      newCard.addEventListener('click', () => {
        const productId = newCard.dataset.productId;
        this.handleProductSelection(productId);
      });

      // Keyboard support
      newCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const productId = newCard.dataset.productId;
          this.handleProductSelection(productId);
        }
      });
    });

    console.log(`[PowerPairs Swap] Attached listeners to ${productCards.length} product cards`);
  }

  /**
   * Handle product selection (swap)
   * @param {number} productId - Selected product ID
   */
  handleProductSelection(productId) {
    console.log(`[PowerPairs Swap] Product selected: ${productId}`);
    
    // Find product data
    const selectedProduct = this.productsData.find(p => p.id == productId);
    
    if (!selectedProduct) {
      console.error('[PowerPairs Swap] Product not found');
      announceToScreenReader('Error: Product not found', 'assertive');
      return;
    }

    console.log('[PowerPairs Swap] Selected product:', selectedProduct.title);

    let success = false;
    let successMessage = '';

    // Handle based on mode
    if (this.mode === 'add') {
      // Add product to bundle
      success = window.PPState.addProduct(selectedProduct);
      successMessage = `Added ${selectedProduct.title} to bundle. Price: ${this.formatMoney(selectedProduct.price)}`;
    } else {
      // Swap product
      success = window.PPState.swapProduct(this.currentProductId, selectedProduct);
      successMessage = `Swapped to ${selectedProduct.title}. Price: ${this.formatMoney(selectedProduct.price)}`;
    }

    if (!success) {
      console.error(`[PowerPairs Swap] Failed to ${this.mode} product`);
      announceToScreenReader(`Failed to ${this.mode} product. Please try again.`, 'assertive');
      return;
    }

    // Announce success
    announceToScreenReader(successMessage, 'polite');

    // Visual feedback - highlight selected card briefly
    const selectedCard = this.gridContainer.querySelector(`[data-product-id="${productId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('pp-swap-product-card--selected');
    }

    // Close modal after brief delay
    setTimeout(() => {
      this.close();

      // Refresh the product grid in expansion manager
      if (window.PPExpansionManager) {
        window.PPExpansionManager.refreshProductGrid();
        window.PPExpansionManager.refreshMultiplierSection();
        window.PPExpansionManager.refreshPricingHeader();
        window.PPExpansionManager.refreshBundleCard();
      }
    }, 600);
  }

  /**
   * Show/hide loading state
   * @param {boolean} show - Show or hide loading
   */
  showLoading(show) {
    const loadingElement = this.contentArea.querySelector('.pp-swap-modal__loading');
    if (loadingElement) {
      loadingElement.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Focus first focusable element
   */
  focusFirstElement() {
    const focusableElements = this.modal.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  /**
   * Format money
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price
   */
  formatMoney(cents) {
    if (window.Shopify && window.Shopify.formatMoney) {
      const format = window.theme && window.theme.moneyFormat ? window.theme.moneyFormat : '{{amount}}';
      return window.Shopify.formatMoney(cents, format);
    }
    
    if (window.theme && window.theme.moneyFormat) {
      const amount = (cents / 100).toFixed(2);
      return window.theme.moneyFormat.replace('{{amount}}', amount).replace('{{amount_no_decimals}}', Math.round(cents / 100));
    }
    
    console.error('[PowerPairs Swap] Currency formatting not available');
    return '';
  }
}

/**
 * ═══════════════════════════════════════════════════════════
 * EXPANSION MANAGER
 * Handles bottom sheet open/close and content rendering
 * ═══════════════════════════════════════════════════════════
 */
class ExpansionManager {
  constructor() {
    perfMark('pp-expansion-manager-start');

    this.sheet = document.getElementById('pp-bottom-sheet');
    this.overlay = document.getElementById('pp-bottom-sheet-overlay');
    this.closeBtn = document.querySelector('[data-action="close-sheet"]');
    this.contentArea = document.querySelector('.pp-sheet-body');
    this.currentBundleId = null;
    this.isOpen = false;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;

    // Verify required elements exist
    if (!this.sheet || !this.overlay) {
      console.error('[PowerPairs] Bottom sheet elements not found');
      return;
    }

    // Debounced methods for performance
    this.debouncedRefreshProductGrid = debounce(() => {
      this.refreshProductGrid();
    }, 150);

    this.debouncedRefreshMultiplierSection = debounce(() => {
      this.refreshMultiplierSection();
    }, 150);

    this.init();

    perfMark('pp-expansion-manager-end');
    perfMeasure('pp-expansion-manager-init', 'pp-expansion-manager-start', 'pp-expansion-manager-end');
  }

  init() {
    console.log('[PowerPairs] Initializing ExpansionManager');

    // Bind event listeners
    this.bindEvents();

    // Find all "View & Customize" buttons
    this.bindBundleButtons();

    console.log('[PowerPairs] ExpansionManager initialized');
  }

  bindEvents() {
    // Close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close(), { passive: true });
    }

    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close(), { passive: true });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => this.handleKeyDown(e), { passive: true });
  }

  bindBundleButtons() {
    // Bind "View & Customize" buttons
    const buttons = document.querySelectorAll('[data-action="open-sheet"]');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const bundleId = e.currentTarget.getAttribute('data-bundle-id');
        this.open(bundleId);
      }, { passive: false });
    });
    console.log(`[PowerPairs] Found ${buttons.length} CTA buttons`);

    // Bind "Quick Add" buttons
    const quickAddButtons = document.querySelectorAll('[data-action="quick-add-bundle"]');
    quickAddButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation(); // Prevent other handlers
        const bundleId = e.currentTarget.getAttribute('data-bundle-id');
        this.handleQuickAdd(bundleId, button);
        return false; // Additional safety
      }, { passive: false, capture: true }); // Use capture phase to intercept first
    });
    console.log(`[PowerPairs] Found ${quickAddButtons.length} Quick Add buttons`);
  }

  open(bundleId) {
    if (!this.sheet || !this.overlay) {
      console.error('[PowerPairs] Bottom sheet elements not found');
      announceToScreenReader('Error: Unable to open customization panel', 'assertive');
      return;
    }

    console.log(`[PowerPairs] Opening sheet for: ${bundleId}`);

    // Store previously focused element
    this.previouslyFocusedElement = document.activeElement;

    // Set active bundle in state
    if (window.PPState) {
      window.PPState.setActiveBundle(bundleId);
    }

    this.currentBundleId = bundleId;
    this.isOpen = true;

    // Update ARIA attributes
    this.overlay.setAttribute('aria-hidden', 'false');
    this.sheet.setAttribute('aria-hidden', 'false');

    // Store scroll position before locking
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Add active classes
    this.overlay.classList.add('active');
    this.sheet.classList.add('active');
    document.body.classList.add('pp-sheet-open');

    // Set body position to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Lock scroll on iOS
    IOSScrollLock.lock();

    // Populate content from state
    this.populateContent(bundleId);

    // Set up focus trap
    this.setupFocusTrap();

    // Focus first element and announce
    if (this.firstFocusable) {
      setTimeout(() => {
        this.firstFocusable.focus();

        // Get bundle title for announcement
        const bundle = window.PPState?.getBundleById(bundleId);
        const bundleTitle = bundle?.title || 'Bundle';
        const productCount = bundle?.products?.length || 0;

        announceToScreenReader(
          `${bundleTitle} customization opened. ${productCount} products available. Use Tab to navigate.`,
          'polite'
        );
      }, 100);
    }
  }

  populateContent(bundleId) {
    console.log(`[PowerPairs] Populating content for: ${bundleId}`);

    // Check if state exists
    if (!window.PPState) {
      console.error('[PowerPairs] State not initialized');
      this.contentArea.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--pp-text-secondary);">
          <p>Error: State not initialized</p>
        </div>
      `;
      return;
    }

    // Get bundle data from state
    const bundle = window.PPState.getBundleById(bundleId);

    if (!bundle) {
      console.error(`[PowerPairs] Bundle not found: ${bundleId}`);
      this.contentArea.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--pp-text-secondary);">
          <p>Error: Bundle not found</p>
        </div>
      `;
      return;
    }

    console.log('[PowerPairs] Bundle data loaded:', bundle);

    // Render bundle content immediately (no loading state)
    this.renderBundleContent(bundle);
  }

  /**
   * Render bundle content using state data
   * @param {Object} bundle - Bundle data from state
   */
  renderBundleContent(bundle) {
    perfMark('pp-render-bundle-start');

    console.log('[PowerPairs] Rendering bundle content');

    // Set active bundle in state
    window.PPState.setActiveBundle(bundle.id);

    // Count incomplete variants
    const incompleteCount = bundle.products.filter(p => !p.variantSelectionComplete).length;
    const allComplete = bundle.variantsComplete;

    // Calculate current pricing
    const pricing = this.calculateBundlePricing(bundle);
    
    console.log('[PowerPairs] Pricing calculated:', {
      compareAtSubtotal: pricing.compareAtSubtotal,
      subtotal: pricing.subtotal,
      finalPrice: pricing.finalPrice,
      savings: pricing.savings,
      discountPercent: pricing.discountPercent,
      achievedTier: pricing.achievedTier
    });

    // Generate variant status message
    const statusMessage = this.renderVariantStatusMessage(incompleteCount, allComplete);

    // Generate product grid
    const productGridHTML = this.renderProductGrid(bundle.products);

    // Generate multiplier controls
    const multipliersHTML = this.renderMultipliers(bundle, pricing);

    // Generate CTA section
    const ctaHTML = this.renderCTA(bundle, pricing, allComplete);

    // Render complete content structure - REDESIGNED
    this.contentArea.innerHTML = `
      <div class="pp-sheet-header-custom">
        <h2 style="font-size: 26px; font-weight: 700; margin: 0; color: var(--pp-text-primary);">${bundle.title}</h2>
        <button class="pp-sheet-close" data-action="close-sheet" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="pp-sheet-content-wrapper">

        <div class="pp-pricing-header">
          ${pricing.savings > 0 ? `
            <div class="pp-pricing-header__savings-row">
              <span class="pp-pricing-header__savings">Save ${this.formatMoney(pricing.savings)}!</span>
            </div>
          ` : ''}
          <div class="pp-pricing-header__row">
            <span class="pp-pricing-header__emoji">💰</span>
            <span class="pp-pricing-header__current">${this.formatMoney(pricing.subtotal)}</span>
            <span class="pp-pricing-header__crossed">${this.formatMoney(pricing.compareAtSubtotal)}</span>
          </div>
          <div class="pp-pricing-header__tier">
            <span class="pp-pricing-header__tier-icon">⚡</span>
            <span>Tier ${pricing.achievedTier || bundle.tier || 1}: Unlock ${pricing.discountPercent}% OFF (${pricing.totalItems} items)</span>
          </div>
        </div>

        ${statusMessage}

        <div class="pp-products-section-v2">
          <div class="pp-products-section-v2__header">
            <h3 class="pp-products-section-v2__title">📦 Your Bundle</h3>
            <span class="pp-products-section-v2__count">${bundle.baseItemCount} items</span>
          </div>
          <div class="pp-products-grid-v2">
            ${productGridHTML}
          </div>
        </div>

        ${multipliersHTML}

      </div>
    `;

    // Render CTA in separate container (outside pp-sheet-body)
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    if (ctaContainer) {
      ctaContainer.innerHTML = ctaHTML;
    }

    // Re-attach close button listener
    const closeBtn = this.contentArea.querySelector('[data-action="close-sheet"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Attach click listeners to product cards
    this.attachProductCardListeners();

    // Attach multiplier listeners
    this.attachMultiplierListeners();

    // Attach CTA listener
    this.attachCTAListener();

    perfMark('pp-render-bundle-end');
    perfMeasure('pp-render-bundle', 'pp-render-bundle-start', 'pp-render-bundle-end');

    // Setup lazy loading for new images
    requestIdleCallback(() => {
      this.setupLazyLoading();
    });

    // Animate visible elements
    requestIdleCallback(() => {
      const animatedElements = this.contentArea.querySelectorAll('.pp-animate-on-visible');
      animatedElements.forEach(element => observeVisibility(element));
    });

    console.log('[PowerPairs] Content rendered successfully');
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      console.log('[PowerPairs Perf] Using native lazy loading');
      return;
    }

    // Fallback: Intersection Observer
    console.log('[PowerPairs Perf] Using IntersectionObserver for lazy loading');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observe all lazy images
    const lazyImages = this.contentArea.querySelectorAll('.pp-lazy-load');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /**
   * Render sheet header section
   * @param {Object} bundle - Bundle data
   * @returns {string} HTML string
   */
  renderSheetHeader(bundle) {
    return `
      <div class="pp-sheet-header">
        <h2 id="pp-sheet-title" class="pp-sheet-title">
          ${bundle.title}
        </h2>

        <div class="pp-sheet-tier-badge">
          ${bundle.tierBadgeText}
        </div>

        ${this.renderSheetSummary(bundle)}
      </div>
    `;
  }

  /**
   * Render sheet summary section
   * @param {Object} bundle - Bundle data
   * @param {Object} pricing - Pricing details (optional)
   * @returns {string} HTML string
   */
  renderSheetSummary(bundle, pricing = null) {
    // Calculate pricing if not provided
    if (!pricing) {
      pricing = this.calculateBundlePricing(bundle);
    }

    return `
      <div class="pp-sheet-summary">
        <div class="pp-sheet-summary__item">
          <span class="pp-sheet-summary__label">Items</span>
          <span class="pp-sheet-summary__value">${pricing.totalItems}</span>
        </div>
        <div class="pp-sheet-summary__item">
          <span class="pp-sheet-summary__label">Total Price</span>
          <span class="pp-sheet-summary__price">${this.formatMoney(pricing.finalPrice)}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render variant status message
   * @param {number} incompleteCount - Number of products needing variant selection
   * @param {boolean} allComplete - Whether all variants are selected
   * @returns {string} HTML string
   */
  renderVariantStatusMessage(incompleteCount, allComplete) {
    if (allComplete) {
      return '';
    }

    return `
      <div class="pp-variant-status-message">
        <span class="pp-variant-status-message__icon">⚠</span>
        <span>${incompleteCount} product${incompleteCount > 1 ? 's' : ''} need${incompleteCount === 1 ? 's' : ''} variant selection (tap to choose)</span>
      </div>
    `;
  }

  /**
   * Render product grid
   * @param {Array} products - Array of product objects
   * @returns {string} HTML string
   */
  renderProductGrid(products) {
    return products.map((product, index) => {
      const indicatorClass = product.variantSelectionComplete ? 'success' : 'warning';
      const indicatorIcon = product.variantSelectionComplete ? '✓' : '!';
      const cardStateClass = product.variantSelectionComplete ?
        'pp-product-compact-card--complete' :
        'pp-product-compact-card--incomplete';

      // Format variant text
      let variantText = '';
      if (product.hasVariants && product.selectedVariant) {
        const variantClass = product.variantSelectionComplete ?
          'pp-product-compact-variant--selected' :
          'pp-product-compact-variant';
        variantText = `<div class="${variantClass}">Variant: ${product.selectedVariant.title}</div>`;
      }

      const statusLabel = product.variantSelectionComplete ?
        `Variant selected for ${product.title}` :
        `Select variant for ${product.title}`;
      const ariaPressed = product.variantSelectionComplete ? 'true' : 'false';

      return `
        <div
          class="pp-product-compact-card ${cardStateClass}"
          data-product-id="${product.id}"
          data-product-index="${index}"
          data-action="select-variant-card"
          role="button"
          tabindex="0"
          aria-label="${statusLabel}"
          aria-pressed="${ariaPressed}"
          aria-describedby="product-price-${product.id}"
        >
          <div class="pp-variant-indicator ${indicatorClass}" role="status" aria-label="${indicatorClass === 'success' ? 'Variant selected' : 'Variant needed'}">
            ${indicatorIcon}
          </div>

          <button
            class="pp-remove-product-btn"
            data-action="remove-product"
            data-product-id="${product.id}"
            data-product-index="${index}"
            aria-label="Remove ${product.title} from bundle"
            title="Remove product"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="pp-product-compact-image-wrapper">
            <img
              src="${product.selectedVariant.image || product.image}"
              alt="${product.title}"
              class="pp-product-compact-image"
              loading="lazy"
            >
            ${product.isSwapped ? `
              <button
                class="pp-undo-swap-btn"
                data-action="undo-swap"
                data-product-id="${product.id}"
                data-product-index="${index}"
                aria-label="Undo swap and restore ${product.originalProduct?.title || 'original product'}"
                title="Undo swap"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 7v6h6"></path>
                  <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
                </svg>
              </button>
            ` : `
              <button
                class="pp-swap-indicator"
                data-action="swap-product"
                data-product-id="${product.id}"
                data-product-index="${index}"
                aria-label="Swap ${product.title} with another product"
                title="Swap product"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 3h5v5"></path>
                  <path d="M8 21H3v-5"></path>
                  <path d="M21 3l-7 7M3 21l7-7"></path>
                </svg>
              </button>
            `}
          </div>

          <div class="pp-product-compact-info">
            ${product.isBestSeller ? '<div class="pp-product-badge">BEST SELLER</div>' : ''}

            <h4 class="pp-product-compact-title">${product.title}</h4>

            ${this.renderReviewStars(product.rating, product.reviewCount)}

            ${variantText}

            <div class="pp-product-compact-price-row">
              <div id="product-price-${product.id}" class="pp-product-compact-price" aria-label="${product.title}, ${this.formatMoney(product.selectedVariant.price)} each, quantity ${product.quantity}">
                <span aria-hidden="true">${this.formatMoney(product.selectedVariant.price)}</span>
              </div>
              
              <div class="pp-product-compact-qty-selector" data-product-id="${product.id}" data-product-index="${index}">
                <button
                  class="pp-qty-btn pp-qty-btn--minus"
                  data-action="decrease-qty"
                  aria-label="Decrease quantity for ${product.title}"
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <input
                  class="pp-qty-input"
                  type="number"
                  min="1"
                  max="99"
                  value="${product.quantity}"
                  aria-label="Quantity for ${product.title}"
                  data-product-id="${product.id}"
                />
                <button
                  class="pp-qty-btn pp-qty-btn--plus"
                  data-action="increase-qty"
                  aria-label="Increase quantity for ${product.title}"
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('') + `
      <div
        class="pp-add-product-tile"
        data-action="add-product"
        role="button"
        tabindex="0"
        aria-label="Add product to bundle"
      >
        <div class="pp-add-product-icon">➕</div>
        <div class="pp-add-product-text">Add Product</div>
      </div>
    `;
  }

  /**
   * Attach click listeners to product cards
   */
  attachProductCardListeners() {
    const productCards = this.contentArea.querySelectorAll('.pp-product-compact-card');

    console.log(`[PowerPairs] Found ${productCards.length} product cards`);

    productCards.forEach(card => {
      // Click listener for card (variant selection)
      card.addEventListener('click', (e) => {
        // Check if click is on swap button, undo button, remove button, or quantity selector
        const swapButton = e.target.closest('.pp-swap-indicator');
        const undoButton = e.target.closest('.pp-undo-swap-btn');
        const removeButton = e.target.closest('.pp-remove-product-btn');
        const qtySelector = e.target.closest('.pp-product-compact-qty-selector');
        
        if (swapButton || undoButton || removeButton || qtySelector) {
          return; // Let button handlers handle it
        }

        const productId = card.dataset.productId;
        console.log(`[PowerPairs] Product card clicked: ${productId}`);

        // Open variant modal
        if (window.PPVariantModal) {
          window.PPVariantModal.open(productId);
        } else {
          console.error('[PowerPairs] Variant modal not initialized');
        }
      });

      // Keyboard support (Enter/Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Attach swap button listeners
    this.attachSwapButtonListeners();

    // Attach remove button listeners
    this.attachRemoveButtonListeners();

    // Attach quantity selector listeners
    this.attachQuantitySelectorListeners();

    // Attach add product tile listener
    this.attachAddProductTileListener();
  }

  /**
   * Attach click listeners to quantity selectors
   */
  attachQuantitySelectorListeners() {
    const qtySelectors = this.contentArea.querySelectorAll('.pp-product-compact-qty-selector');

    console.log(`[PowerPairs] Found ${qtySelectors.length} quantity selectors`);

    qtySelectors.forEach(selector => {
      const productId = selector.dataset.productId;
      const minusBtn = selector.querySelector('.pp-qty-btn--minus');
      const plusBtn = selector.querySelector('.pp-qty-btn--plus');
      const input = selector.querySelector('.pp-qty-input');

      // Prevent card click when interacting with quantity selector
      selector.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Minus button
      if (minusBtn) {
        minusBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          const currentQty = parseInt(input.value) || 1;
          const newQty = Math.max(1, currentQty - 1);
          
          this.handleQuantityChange(productId, newQty, input);
        });
      }

      // Plus button
      if (plusBtn) {
        plusBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          
          const currentQty = parseInt(input.value) || 1;
          const newQty = Math.min(99, currentQty + 1);
          
          this.handleQuantityChange(productId, newQty, input);
        });
      }

      // Input change
      if (input) {
        input.addEventListener('change', (e) => {
          e.stopPropagation();
          
          const newQty = Math.max(1, Math.min(99, parseInt(input.value) || 1));
          
          this.handleQuantityChange(productId, newQty, input);
        });

        // Prevent card click on input focus
        input.addEventListener('focus', (e) => {
          e.stopPropagation();
        });
      }
    });
  }

  /**
   * Handle quantity change
   * @param {number} productId - Product ID
   * @param {number} newQuantity - New quantity
   * @param {HTMLElement} inputElement - Input element to update
   */
  handleQuantityChange(productId, newQuantity, inputElement) {
    console.log(`[PowerPairs] Quantity change: product ${productId}, quantity ${newQuantity}`);

    // Update state
    const success = window.PPState.updateProductQuantity(productId, newQuantity);

    if (!success) {
      console.error('[PowerPairs] Failed to update quantity in state');
      return;
    }

    // Update input value
    if (inputElement) {
      inputElement.value = newQuantity;
    }

    // Get updated bundle
    const bundle = window.PPState.getActiveBundle();
    if (!bundle) {
      console.error('[PowerPairs] No active bundle after quantity update');
      return;
    }

    // Recalculate pricing
    const pricing = this.calculateBundlePricing(bundle);

    // Update product card display
    this.updateProductCardQuantity(productId, newQuantity, pricing);

    // Update pricing header
    this.refreshPricingHeader();

    // Update multiplier section
    this.refreshMultiplierSection();

    // Update bundle card on main page
    this.refreshBundleCard();
    
    // Update U5 progress tracker
    this.updateU5ProgressTracker();

    console.log('[PowerPairs] Quantity updated successfully');
  }

  /**
   * Update product card quantity display
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @param {Object} pricing - Updated pricing
   */
  updateProductCardQuantity(productId, quantity, pricing) {
    const card = this.contentArea.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    // Quantity is now handled by the qty-selector input, no need to update separate display

    // Update price display
    const bundle = window.PPState.getActiveBundle();
    if (bundle) {
      const product = bundle.products.find(p => p.id == productId);
      if (product && product.selectedVariant) {
        const priceElement = card.querySelector('.pp-product-compact-price span:first-child');
        if (priceElement) {
          priceElement.textContent = this.formatMoney(product.selectedVariant.price);
        }

        // Update aria-label
        const priceContainer = card.querySelector('.pp-product-compact-price');
        if (priceContainer) {
          priceContainer.setAttribute('aria-label', `${product.title}, ${this.formatMoney(product.selectedVariant.price)} each, quantity ${quantity}`);
        }
      }
    }
  }

  /**
   * Attach click listener to add product tile
   */
  attachAddProductTileListener() {
    const addTile = this.contentArea.querySelector('[data-action="add-product"]');
    
    if (!addTile) {
      return;
    }

    addTile.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log('[PowerPairs] Add product tile clicked');

      // Open swap modal in add mode
      if (window.PPSwapModal) {
        window.PPSwapModal.open(null, 'add'); // null productId means add mode
      } else {
        console.error('[PowerPairs] Swap modal not initialized');
        announceToScreenReader('Add product feature not available. Please try again.', 'assertive');
      }
    });

    // Keyboard support
    addTile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        addTile.click();
      }
    });
  }

  /**
   * Attach click listeners to remove product buttons
   */
  attachRemoveButtonListeners() {
    const removeButtons = this.contentArea.querySelectorAll('[data-action="remove-product"]');

    console.log(`[PowerPairs] Found ${removeButtons.length} remove buttons`);

    removeButtons.forEach(button => {
      // Remove any existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();

        const productId = newButton.dataset.productId;
        const productIndex = newButton.dataset.productIndex;
        
        console.log(`[PowerPairs] Remove button clicked for product: ${productId}`);

        // Get bundle
        const bundle = window.PPState.getActiveBundle();
        if (!bundle) {
          console.error('[PowerPairs] No active bundle');
          return;
        }

        // Validation: Must keep at least 1 product
        if (bundle.products.length <= 1) {
          announceToScreenReader('Cannot remove last product. Bundle must have at least 1 product.', 'assertive');
          return;
        }

        // Find product
        const product = bundle.products.find(p => {
          return p.id == productId || 
                 p.id === productId || 
                 String(p.id) === String(productId);
        });

        if (!product) {
          console.error('[PowerPairs] Product not found for removal');
          announceToScreenReader('Product not found. Please try again.', 'assertive');
          return;
        }

        // Remove product
        const removedProductData = window.PPState.removeProduct(productId);

        if (removedProductData) {
          announceToScreenReader(`${product.title} removed from bundle.`, 'polite');
          
          // Show undo notification
          this.showUndoRemoveNotification(removedProductData);
          
          // Refresh UI
          this.refreshProductGrid();
          this.refreshMultiplierSection();
          this.refreshPricingHeader();
          this.refreshBundleCard();
        } else {
          console.error('[PowerPairs] Failed to remove product');
          announceToScreenReader('Failed to remove product. Please try again.', 'assertive');
        }
      });
    });
  }

  /**
   * Show undo notification for removed product
   * @param {Object} removedProductData - Data of removed product
   */
  showUndoRemoveNotification(removedProductData) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'pp-undo-remove-notification';
    notification.innerHTML = `
      <span class="pp-undo-remove-text">${removedProductData.title} removed</span>
      <button class="pp-undo-remove-btn" data-product-data='${JSON.stringify(removedProductData)}'>
        Undo
      </button>
    `;

    // Add to content area
    this.contentArea.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('active');
    }, 100);

    // Attach undo button listener
    const undoBtn = notification.querySelector('.pp-undo-remove-btn');
    undoBtn.addEventListener('click', () => {
      this.handleUndoRemove(removedProductData);
      notification.remove();
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  /**
   * Handle undo remove action
   * @param {Object} removedProductData - Data of removed product
   */
  handleUndoRemove(removedProductData) {
    console.log('[PowerPairs] Undoing product removal:', removedProductData.title);

    // Add product back using addProduct method
    const success = window.PPState.addProduct(removedProductData);

    if (success) {
      announceToScreenReader(`${removedProductData.title} restored to bundle.`, 'polite');
      
      // Refresh UI
      this.refreshProductGrid();
      this.refreshMultiplierSection();
      this.refreshPricingHeader();
      this.refreshBundleCard();
    } else {
      console.error('[PowerPairs] Failed to undo remove');
      announceToScreenReader('Failed to restore product. Please try again.', 'assertive');
    }
  }

  /**
   * Attach click listeners to swap and undo buttons
   */
  attachSwapButtonListeners() {
    const swapButtons = this.contentArea.querySelectorAll('[data-action="swap-product"]');
    const undoButtons = this.contentArea.querySelectorAll('[data-action="undo-swap"]');

    console.log(`[PowerPairs] Found ${swapButtons.length} swap buttons and ${undoButtons.length} undo buttons`);

    // Swap buttons - use event delegation to avoid stale listeners
    swapButtons.forEach(button => {
      // Remove any existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();

        const productId = newButton.dataset.productId;
        console.log(`[PowerPairs] Swap button clicked for product: ${productId}`);

        // Open swap modal with the current product ID
        if (window.PPSwapModal) {
          window.PPSwapModal.open(productId);
        } else {
          console.warn('[PowerPairs] Swap modal not yet initialized');
          announceToScreenReader('Product swap feature coming soon', 'polite');
        }
      });
    });

    // Undo buttons - use event delegation to avoid stale listeners
    undoButtons.forEach(button => {
      // Remove any existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      newButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();

        const swappedProductId = newButton.dataset.productId;
        const productIndex = newButton.dataset.productIndex;
        
        console.log(`[PowerPairs] Undo swap button clicked:`, {
          swappedProductId,
          productIndex,
          button: newButton
        });

        // Get the bundle
        const bundle = window.PPState.getActiveBundle();
        if (!bundle) {
          console.error('[PowerPairs] No active bundle');
          announceToScreenReader('Error: Bundle not found. Please try again.', 'assertive');
          return;
        }

        // Try multiple methods to find the product
        let product = null;
        let foundIndex = -1;

        // Method 1: Use product index if available (most reliable)
        if (productIndex !== undefined && productIndex !== null) {
          const index = parseInt(productIndex, 10);
          if (!isNaN(index) && index >= 0 && index < bundle.products.length) {
            product = bundle.products[index];
            foundIndex = index;
            console.log(`[PowerPairs] Found product by index: ${index}`, product);
          }
        }

        // Method 2: Find by ID (fallback)
        if (!product && swappedProductId) {
          foundIndex = bundle.products.findIndex(p => {
            // Try both string and number comparison
            return p.id == swappedProductId || 
                   p.id === swappedProductId || 
                   String(p.id) === String(swappedProductId);
          });
          
          if (foundIndex !== -1) {
            product = bundle.products[foundIndex];
            console.log(`[PowerPairs] Found product by ID: ${swappedProductId} at index ${foundIndex}`, product);
          }
        }

        // Method 3: Find any swapped product with originalProduct (last resort)
        if (!product) {
          foundIndex = bundle.products.findIndex(p => {
            return p.isSwapped === true && p.originalProduct !== null;
          });
          
          if (foundIndex !== -1) {
            product = bundle.products[foundIndex];
            console.log(`[PowerPairs] Found swapped product by fallback at index ${foundIndex}`, product);
          }
        }

        // Validate product found
        if (!product || foundIndex === -1) {
          console.error('[PowerPairs] Product not found for undo:', {
            swappedProductId,
            productIndex,
            availableProducts: bundle.products.map((p, i) => ({
              index: i,
              id: p.id,
              title: p.title,
              isSwapped: p.isSwapped,
              hasOriginal: !!p.originalProduct
            }))
          });
          announceToScreenReader('Failed to find product. Please try again.', 'assertive');
          return;
        }

        // Enhanced validation: Check if product can be undone
        const canUndo = product.isSwapped === true || 
                       (product.originalProduct !== null && product.originalProduct !== undefined);

        if (!canUndo) {
          console.warn('[PowerPairs] Product cannot be undone:', {
            product: product.title,
            isSwapped: product.isSwapped,
            hasOriginal: !!product.originalProduct,
            productData: product
          });
          announceToScreenReader('This product has not been swapped or cannot be undone.', 'polite');
          return;
        }

        // If isSwapped is false but originalProduct exists, fix the state
        if (!product.isSwapped && product.originalProduct) {
          console.warn('[PowerPairs] Fixing inconsistent swap state for:', product.title);
          product.isSwapped = true;
        }

        console.log('[PowerPairs] Undoing swap for product:', {
          index: foundIndex,
          currentTitle: product.title,
          originalTitle: product.originalProduct?.title,
          isSwapped: product.isSwapped
        });

        // Perform undo - try multiple methods
        let undoSuccess = false;

        // Try by ID first
        if (swappedProductId) {
          undoSuccess = window.PPState.undoSwap(swappedProductId);
        }

        // If that failed, try by index
        if (!undoSuccess && foundIndex !== -1) {
          // Use the product's current ID
          undoSuccess = window.PPState.undoSwap(product.id);
        }

        // If still failed, try direct restoration
        if (!undoSuccess && product.originalProduct) {
          console.log('[PowerPairs] Attempting direct restoration...');
          undoSuccess = window.PPState.undoSwap(product.id);
        }

        if (undoSuccess) {
          const originalTitle = product.originalProduct?.title || 'Original product';
          announceToScreenReader(`Swap undone. ${originalTitle} restored.`, 'polite');
          
          // Refresh UI
          this.refreshProductGrid();
          this.refreshMultiplierSection();
          this.refreshPricingHeader();
          this.refreshBundleCard();
          
          console.log('[PowerPairs] Undo successful');
        } else {
          console.error('[PowerPairs] All undo methods failed');
          announceToScreenReader('Failed to undo swap. Please refresh the page and try again.', 'assertive');
        }
      });
    });
  }

  /**
   * Refresh product grid after variant selection
   */
  refreshProductGrid() {
    console.log('[PowerPairs] Refreshing product grid');

    const bundle = window.PPState.getActiveBundle();
    if (!bundle) {
      console.error('[PowerPairs] No active bundle');
      return;
    }

    // Find the product grid container
    const gridContainer = this.contentArea.querySelector('.pp-products-grid-v2');
    if (!gridContainer) {
      console.error('[PowerPairs] Product grid not found');
      return;
    }

    // Find the status message container
    const statusContainer = this.contentArea.querySelector('.pp-variant-status-message');
    
    // Find the products count element
    const countElement = this.contentArea.querySelector('.pp-products-section-v2__count');

    // Add loading state
    gridContainer.style.opacity = '0.5';
    gridContainer.style.pointerEvents = 'none';

    // Use a short timeout to ensure smooth transition
    setTimeout(() => {
      // Recalculate baseItemCount to ensure it's accurate
      bundle.baseItemCount = bundle.products.reduce((sum, p) => sum + p.quantity, 0);
      
      // Update products count
      if (countElement) {
        countElement.textContent = `${bundle.baseItemCount} items`;
      }
      
      // Update status message
      const incompleteCount = bundle.products.filter(p => !p.variantSelectionComplete).length;
      const allComplete = bundle.variantsComplete;

      if (statusContainer) {
        const newStatusMessage = this.renderVariantStatusMessage(incompleteCount, allComplete);
        statusContainer.outerHTML = newStatusMessage;
      }

      // Re-render product grid
      const newProductGridHTML = this.renderProductGrid(bundle.products);
      gridContainer.innerHTML = newProductGridHTML;

      // Remove loading state
      gridContainer.style.opacity = '1';
      gridContainer.style.pointerEvents = 'auto';

      // Re-attach event listeners
      this.attachProductCardListeners();

      // Re-attach add product tile listener
      this.attachAddProductTileListener();

      // Update summary section if exists
      const summaryElement = this.contentArea.querySelector('.pp-sheet-summary');
      if (summaryElement) {
        const pricing = this.calculateBundlePricing(bundle);
        summaryElement.outerHTML = this.renderSheetSummary(bundle, pricing);
      }

      // Update pricing header (after swap)
      this.refreshPricingHeader();

      // Also refresh multiplier section and CTA (pricing may have changed)
      this.refreshMultiplierSection();

      // Update bundle card on main page
      this.refreshBundleCard();

      console.log('[PowerPairs] Product grid refreshed successfully');
    }, 200);
  }

  /**
   * Refresh pricing header after product changes
   */
  refreshPricingHeader() {
    const bundle = window.PPState.getActiveBundle();
    if (!bundle) {
      console.error('[PowerPairs] No active bundle to refresh pricing header');
      return;
    }

    const pricingHeader = this.contentArea.querySelector('.pp-pricing-header');
    if (!pricingHeader) {
      console.warn('[PowerPairs] Pricing header not found');
      return;
    }

    // Recalculate pricing (this also recalculates baseSubtotal internally)
    const pricing = this.calculateBundlePricing(bundle);

    // Manual calculation check for debugging
    const manualSum = bundle.products.reduce((sum, product) => {
      if (product.selectedVariant && product.selectedVariant.price) {
        const productTotal = product.selectedVariant.price * product.quantity;
        return sum + productTotal;
      }
      return sum;
    }, 0);

    console.log('[PowerPairs Pricing Header Refresh]', {
      manualSum: manualSum,
      bundleBaseSubtotal: bundle.baseSubtotal,
      pricingSubtotal: pricing.subtotal,
      multiplier: bundle.multiplier,
      expectedSubtotal: manualSum * bundle.multiplier,
      match: Math.abs(manualSum * bundle.multiplier - pricing.subtotal) < 1 // Allow 1 cent difference for rounding
    });

    // Update current price (subtotal before tier discount)
    const currentPriceElement = pricingHeader.querySelector('.pp-pricing-header__current');
    if (currentPriceElement) {
      currentPriceElement.textContent = this.formatMoney(pricing.subtotal);
    }

    // Update crossed price
    const crossedPriceElement = pricingHeader.querySelector('.pp-pricing-header__crossed');
    if (crossedPriceElement) {
      crossedPriceElement.textContent = this.formatMoney(pricing.compareAtSubtotal);
    }

    // Update savings row (new structure: savings on top, prices below)
    const savingsRow = pricingHeader.querySelector('.pp-pricing-header__savings-row');
    if (pricing.savings > 0) {
      const savingsHTML = `<span class="pp-pricing-header__savings">Save ${this.formatMoney(pricing.savings)}!</span>`;
      if (savingsRow) {
        savingsRow.innerHTML = savingsHTML;
      } else {
        // Insert savings row before price row
        const priceRow = pricingHeader.querySelector('.pp-pricing-header__row');
        if (priceRow) {
          priceRow.insertAdjacentHTML('beforebegin', `<div class="pp-pricing-header__savings-row">${savingsHTML}</div>`);
        }
      }
    } else if (savingsRow) {
      // Remove savings row if it's 0 or negative
      savingsRow.remove();
    }

    // Update tier info
    const tierElement = pricingHeader.querySelector('.pp-pricing-header__tier span:last-child');
    if (tierElement) {
      tierElement.textContent = `Tier ${pricing.achievedTier || bundle.tier || 1}: Unlock ${pricing.discountPercent}% OFF (${pricing.totalItems} items)`;
    }

    console.log('[PowerPairs] Pricing header refreshed:', {
      finalPrice: pricing.finalPrice,
      compareAtSubtotal: pricing.compareAtSubtotal,
      savings: pricing.savings
    });
  }



  /**
   * Update bundle card on main page with current bundle information
   */
  refreshBundleCard() {
    const bundle = window.PPState.getActiveBundle();
    if (!bundle) {
      console.warn('[PowerPairs] No active bundle to refresh card');
      return;
    }

    // Find bundle card by data-bundle-id
    const bundleCard = document.querySelector(`.pp-bundle-card[data-bundle-id="${bundle.id}"]`);
    if (!bundleCard) {
      console.warn(`[PowerPairs] Bundle card not found for bundle: ${bundle.id}`);
      return;
    }

    // Calculate current pricing
    const pricing = this.calculateBundlePricing(bundle);

    // Update item count
    const itemCountElement = bundleCard.querySelector('.pp-bundle-card__item-count');
    if (itemCountElement) {
      itemCountElement.textContent = bundle.baseItemCount;
    }

    // Update current price
    const priceElement = bundleCard.querySelector('.pp-bundle-card__price');
    if (priceElement) {
      priceElement.textContent = this.formatMoney(pricing.subtotal);
    }

    // Update compare price
    const comparePriceElement = bundleCard.querySelector('.pp-bundle-card__compare-price');
    if (pricing.compareAtSubtotal > pricing.subtotal) {
      if (comparePriceElement) {
        comparePriceElement.textContent = this.formatMoney(pricing.compareAtSubtotal);
        comparePriceElement.style.display = '';
      } else {
        // Create compare price element if it doesn't exist
        const pricesContainer = bundleCard.querySelector('.pp-bundle-card__prices');
        if (pricesContainer) {
          const newComparePrice = document.createElement('span');
          newComparePrice.className = 'pp-bundle-card__compare-price';
          newComparePrice.textContent = this.formatMoney(pricing.compareAtSubtotal);
          pricesContainer.appendChild(newComparePrice);
        }
      }
    } else if (comparePriceElement) {
      comparePriceElement.style.display = 'none';
    }

    // Update savings
    const savingsElement = bundleCard.querySelector('.pp-bundle-card__savings');
    if (pricing.savings > 0) {
      if (savingsElement) {
        savingsElement.textContent = `Save ${this.formatMoney(pricing.savings)}`;
        savingsElement.style.display = '';
      } else {
        // Create savings element if it doesn't exist
        const pricingContainer = bundleCard.querySelector('.pp-bundle-card__pricing');
        if (pricingContainer) {
          const newSavings = document.createElement('div');
          newSavings.className = 'pp-bundle-card__savings';
          newSavings.textContent = `Save ${this.formatMoney(pricing.savings)}`;
          pricingContainer.appendChild(newSavings);
        }
      }
    } else if (savingsElement) {
      savingsElement.style.display = 'none';
    }


    console.log('[PowerPairs] Bundle card refreshed:', {
      bundleId: bundle.id,
      itemCount: bundle.baseItemCount,
      multiplier: bundle.multiplier,
      totalItems: bundle.baseItemCount * bundle.multiplier,
      price: pricing.subtotal,
      comparePrice: pricing.compareAtSubtotal,
      savings: pricing.savings
    });
  }

  /**
   * Render multiplier controls
   * @param {Object} bundle - Bundle data
   * @param {Object} pricing - Pricing details
   * @returns {string} HTML string
   */
  renderMultipliers(bundle, pricing) {
    // Parse multipliers from bundle settings (comma-separated string)
    const availableMultipliers = bundle.multipliers.map(m => parseInt(m));

    // Generate multiplier pills with tier info
    const pillsHTML = availableMultipliers.map(multiplier => {
      const totalItems = bundle.baseItemCount * multiplier;
      const tier = this.calculateTierFromItems(totalItems);
      const tierIcon = this.getTierIcon(tier);
      const isActive = multiplier === bundle.multiplier;

      return `
        <button
          class="pp-multiplier-pill ${isActive ? 'active' : ''}"
          data-multiplier="${multiplier}"
          data-action="select-multiplier"
          aria-pressed="${isActive}"
        >
          <div class="pp-pill-multiplier">${multiplier}x</div>
          <div class="pp-pill-tier">Tier ${tier}</div>
          <div class="pp-pill-items">${totalItems} items</div>
        </button>
      `;
    }).join('');

    // Get tier unlock message
    const tierMessage = this.getTierUnlockMessage(pricing.achievedTier);
    const isPremiumTier = pricing.achievedTier >= 3;

    return `
      <div class="pp-sheet-multipliers">
        <h3 class="pp-sheet-multipliers__title">How many kits?</h3>
        <div class="pp-multiplier-pills">
          ${pillsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Generate U5 Progress Tracker HTML
   * @returns {string} HTML string for the tracker
   */
  generateU5ProgressTracker() {
    // Get quantities from BundleManager + modal
    const cartQty = window.BF25BundleManager?.bundle?.computed?.itemCount || 0;
    const bundle = window.PPState.getActiveBundle();
    const modalQty = bundle ? bundle.baseItemCount * bundle.multiplier : 0;
    const totalQty = cartQty + modalQty;
    
    console.log('[PowerPairs] Generating U5 tracker:', { cartQty, modalQty, totalQty });

    // Calculate progress (max 16 for visual, but no cap on actual items)
    const progressPercent = Math.min((totalQty / 16) * 100, 100);

    // Determine tier thresholds
    const thresholds = [4, 8, 12, 16];
    const tierDiscounts = ['60%', '70%', '80%', '85%'];

    // Find current tier and next tier
    let currentTierIndex = -1;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalQty >= thresholds[i]) {
        currentTierIndex = i;
        break;
      }
    }

    const currentDiscount = currentTierIndex >= 0 ? tierDiscounts[currentTierIndex] : '50%';
    const nextTierIndex = currentTierIndex + 1;
    const nextThreshold = nextTierIndex < thresholds.length ? thresholds[nextTierIndex] : null;
    const nextDiscount = nextTierIndex < thresholds.length ? tierDiscounts[nextTierIndex] : null;
    const itemsToNext = nextThreshold ? nextThreshold - totalQty : 0;

    // Generate marker and gift states
    const markerStates = thresholds.map((threshold, i) => {
      if (totalQty >= threshold) return 'unlocked';
      if (i === nextTierIndex) return 'next';
      return '';
    });

    // Gift SVG template
    const giftSVG = `<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="3" y="6" width="18" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="21"/></svg>`;

    // Build tier text
    let tierText = `<span class="pp-u5-current">${currentDiscount} OFF</span>`;
    if (nextThreshold && itemsToNext > 0) {
      tierText += ` · +<strong>${itemsToNext}</strong> → ${nextDiscount}`;
    } else if (totalQty >= 16) {
      tierText = `<span class="pp-u5-current" style="color:#7ddf71;">MAX 85% OFF</span>`;
    }

    // Build count text
    const countText = cartQty > 0
      ? `<strong>${totalQty}</strong> items (${cartQty} cart + ${modalQty} now)`
      : `<strong>${totalQty}</strong> item${totalQty !== 1 ? 's' : ''}`;

    return `
      <div class="pp-u5-tracker" data-total-qty="${totalQty}">
        <div class="pp-u5-header">
          <span class="pp-u5-count">${countText}</span>
          <span class="pp-u5-tier">${tierText}</span>
        </div>
        <div class="pp-u5-track">
          <div class="pp-u5-bar">
            <div class="pp-u5-bar-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="pp-u5-markers">
            ${thresholds.map((t, i) => `<div class="pp-u5-marker ${markerStates[i]}"></div>`).join('')}
          </div>
          <div class="pp-u5-gifts">
            ${thresholds.map((t, i) => `<div class="pp-u5-gift ${markerStates[i]}">${giftSVG}</div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Update U5 Progress Tracker (called on quantity change)
   */
  updateU5ProgressTracker() {
    const container = document.querySelector('.pp-u5-tracker');
    if (!container) return;

    const oldTotal = parseInt(container.dataset.totalQty) || 0;

    // Get new quantities
    const cartQty = window.BF25BundleManager?.bundle?.computed?.itemCount || 0;
    const bundle = window.PPState.getActiveBundle();
    const modalQty = bundle ? bundle.baseItemCount * bundle.multiplier : 0;
    const newTotal = cartQty + modalQty;

    // Check if we crossed a threshold (for jolt animation)
    const thresholds = [4, 8, 12, 16];
    let crossedThreshold = null;
    for (const t of thresholds) {
      if (oldTotal < t && newTotal >= t) {
        crossedThreshold = t;
        break;
      }
    }

    // Re-render the tracker
    const newHTML = this.generateU5ProgressTracker();
    container.outerHTML = newHTML;

    // Trigger jolt animation if threshold crossed
    if (crossedThreshold) {
      const thresholdIndex = thresholds.indexOf(crossedThreshold);
      setTimeout(() => {
        const gifts = document.querySelectorAll('.pp-u5-gift');
        const markers = document.querySelectorAll('.pp-u5-marker');
        if (gifts[thresholdIndex]) {
          gifts[thresholdIndex].classList.add('just-unlocked');
          setTimeout(() => gifts[thresholdIndex].classList.remove('just-unlocked'), 500);
        }
        if (markers[thresholdIndex]) {
          markers[thresholdIndex].style.animation = 'pp-jolt 0.5s ease-out';
          setTimeout(() => markers[thresholdIndex].style.animation = '', 500);
        }
      }, 50);
    }
  }

  /**
   * Render CTA section
   * @param {Object} bundle - Bundle data
   * @param {Object} pricing - Pricing details
   * @param {boolean} allComplete - Whether all variants selected
   * @returns {string} HTML string
   */
  renderCTA(bundle, pricing, allComplete) {
    const isDisabled = !allComplete;
    const trackerHTML = this.generateU5ProgressTracker();

    return `
      <div class="pp-sheet-cta-fixed">
        ${trackerHTML}
        <div class="pp-action-buttons">
          <button
            class="pp-sheet-cta__button-deal"
            data-action="add-to-deal"
            ${isDisabled ? 'disabled' : ''}
            aria-label="Add to the Deal"
          >
            <span class="pp-cta-text">ADD TO DEAL</span>
          </button>
          <button
            class="pp-sheet-cta__button-main"
            data-action="add-to-cart"
            ${isDisabled ? 'disabled' : ''}
            aria-label="Buy Now"
          >
            <span class="pp-cta-text">BUY NOW</span>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Attach click listeners to multiplier buttons
   */
  attachMultiplierListeners() {
    const multiplierButtons = this.contentArea.querySelectorAll('[data-action="select-multiplier"]');

    console.log(`[PowerPairs] Attaching listeners to ${multiplierButtons.length} multiplier buttons`);
    
    // Debug: Log each button
    multiplierButtons.forEach((button, index) => {
      const multiplier = button.dataset.multiplier;
      console.log(`[PowerPairs] Button ${index + 1}: ${multiplier}x`, {
        element: button,
        disabled: button.disabled,
        visible: button.offsetParent !== null
      });
    });

    multiplierButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const multiplier = parseInt(button.dataset.multiplier);
        console.log(`[PowerPairs] Multiplier clicked: ${multiplier}x`);

        this.handleMultiplierChange(multiplier, button);
      });

      // Keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
  }

  /**
   * Handle multiplier change
   * @param {number} multiplier - Selected multiplier
   * @param {HTMLElement} button - Clicked button element
   */
  handleMultiplierChange(multiplier, button) {
    console.log(`[PowerPairs] Changing multiplier to: ${multiplier}x`);

    // Get active bundle
    const bundle = window.PPState.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs] No active bundle');
      return;
    }

    // Update state
    window.PPState.updateMultiplier(multiplier);

    // Add tier unlock animation
    button.classList.add('pp-multiplier-pill--tier-unlock');
    setTimeout(() => button.classList.remove('pp-multiplier-pill--tier-unlock'), 500);

    // Recalculate pricing
    const pricing = this.calculateBundlePricing(bundle);

    console.log('[PowerPairs] Multiplier updated:', {
      multiplier,
      totalItems: pricing.totalItems,
      achievedTier: pricing.achievedTier,
      finalPrice: pricing.finalPrice
    });

    // Refresh multiplier section and CTA
    this.refreshMultiplierSection();
    
    // Update bundle card on main page
    this.refreshBundleCard();
    
    // Update U5 progress tracker
    this.updateU5ProgressTracker();
  }

  /**
   * Refresh multiplier section and CTA
   */
  refreshMultiplierSection() {
    console.log('[PowerPairs] Refreshing multiplier section');

    const bundle = window.PPState.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs] No active bundle to refresh');
      return;
    }

    const pricing = this.calculateBundlePricing(bundle);
    const allComplete = bundle.variantsComplete;

    console.log('[PowerPairs] Refresh state:', {
      bundleId: bundle.id,
      allComplete,
      variantsComplete: bundle.variantsComplete,
      products: bundle.products.map(p => ({
        title: p.title,
        hasVariant: !!p.selectedVariant,
        complete: p.variantSelectionComplete
      }))
    });

    // Update multipliers section
    const multipliersElement = this.contentArea.querySelector('.pp-sheet-multipliers');
    if (multipliersElement) {
      multipliersElement.outerHTML = this.renderMultipliers(bundle, pricing);
      this.attachMultiplierListeners(); // Re-attach listeners
      console.log('[PowerPairs] Multipliers section updated');
    } else {
      console.warn('[PowerPairs] Multipliers element not found');
    }

    // Update CTA section
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    if (ctaContainer) {
      ctaContainer.innerHTML = this.renderCTA(bundle, pricing, allComplete);
      this.attachCTAListener(); // Re-attach listener
      console.log('[PowerPairs] CTA updated - disabled:', !allComplete);
    } else {
      console.warn('[PowerPairs] CTA element not found for refresh');
    }
    
    // Update U5 progress tracker
    this.updateU5ProgressTracker();

    // Update header summary
    const summaryElement = this.contentArea.querySelector('.pp-sheet-summary');
    if (summaryElement) {
      summaryElement.outerHTML = this.renderSheetSummary(bundle, pricing);
    }

    console.log('[PowerPairs] Multiplier section refreshed');
  }

  /**
   * Attach click listeners to CTA buttons
   */
  attachCTAListener() {
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    if (!ctaContainer) {
      return;
    }

    // Add to Deal button (adds to sticky cart and closes modal)
    const dealButton = ctaContainer.querySelector('[data-action="add-to-deal"]');
    if (dealButton) {
      console.log('[PowerPairs] Attaching listener to Add to Deal button');
      
      dealButton.addEventListener('click', (e) => {
        console.log('[PowerPairs] Add to Deal clicked');
        this.handleAddToDeal();
      });
    }

    // Add to Cart button (goes to checkout)
    const ctaButton = ctaContainer.querySelector('[data-action="add-to-cart"]');
    if (ctaButton) {
      console.log('[PowerPairs] Attaching listener to Add to Cart button');

      ctaButton.addEventListener('click', (e) => {
        console.log('[PowerPairs] Add to Cart clicked');
        this.handleAddToCart();
      });
    }
  }

  /**
   * Handle add to deal (adds to sticky cart and closes modal)
   * Updated to use BundleManager like bf25-expansion-core.js
   */
  async handleAddToDeal() {
    console.log('[PowerPairs] Add to Deal initiated');

    const bundle = window.PPState.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs] No active bundle');
      this.showError('Bundle not found. Please try again.');
      return;
    }

    // Double-check variants are complete
    if (!bundle.variantsComplete) {
      console.error('[PowerPairs] Variants not complete');
      this.showError('Please select all product variants first.');
      return;
    }

    // Calculate final pricing
    const pricing = this.calculateBundlePricing(bundle);

    // Show loading overlay
    this.showLoadingOverlay('Adding to deal...', 'Preparing your bundle');

    // Disable both buttons
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    const dealButton = ctaContainer ? ctaContainer.querySelector('[data-action="add-to-deal"]') : null;
    const ctaButton = ctaContainer ? ctaContainer.querySelector('[data-action="add-to-cart"]') : null;
    
    if (dealButton) {
      dealButton.classList.add('pp-sheet-cta__button--loading');
      dealButton.disabled = true;
    }
    if (ctaButton) {
      ctaButton.disabled = true;
    }

    try {
      // ─────────────────────────────────────────────────────────────────
      // BUNDLEMANAGER INTEGRATION (Virtual Cart - Instant)
      // If BundleManager is available, add to localStorage instead of API
      // ─────────────────────────────────────────────────────────────────
      if (window.BF25BundleManager) {
        console.log('[PowerPairs] Using BundleManager for instant add');
        
        // Add each product in the bundle to BundleManager
        for (const product of bundle.products) {
          // Get product data from window.productData if available
          const productData = window.productData?.[product.id] || null;
          
          // Build product data for BundleManager
          const bundleManagerData = {
            variantId: String(product.selectedVariantId),
            productId: String(product.id),
            title: product.title,
            variantTitle: product.selectedVariant?.title || '',
            // Price priority: selectedVariant price > product price > 0
            price: product.selectedVariant?.price || product.price || productData?.basePrice || 0,
            // Get image URL
            image: product.image || productData?.featuredImage || productData?.featured_image || '',
            handle: product.handle || productData?.handle || ''
          };

          // Add with quantity * multiplier
          const quantity = product.quantity * bundle.multiplier;
          const result = window.BF25BundleManager.addItem(bundleManagerData, quantity);

          if (!result.success) {
            console.error('[PowerPairs] Failed to add product to BundleManager:', product.title, result.error);
            // Continue with other products even if one fails
            if (result.error === 'MAX_ITEMS_REACHED') {
              throw new Error('Bundle has reached maximum items. Remove some items to add more.');
            }
          }
        }

        console.log('[PowerPairs] Items added to BundleManager successfully');

        // Hide loading overlay
        this.hideLoadingOverlay();

        // Show brief success message
        announceToScreenReader(`Added ${pricing.totalItems} items to deal`, 'polite');

        // Close modal after brief delay
        setTimeout(() => {
          this.close();
        }, 500);

        return;
      }

      // ─────────────────────────────────────────────────────────────────
      // FALLBACK: Original Shopify API flow (if BundleManager unavailable)
      // ─────────────────────────────────────────────────────────────────
      console.log('[PowerPairs] Using Shopify API (BundleManager not available)');

      // Prepare cart items
      const cartItems = this.prepareCartItems(bundle, pricing);

      console.log('[PowerPairs] Adding items to deal:', cartItems);

      // Add items to cart (sticky cart will update automatically)
      await this.addItemsToCart(cartItems);

      console.log('[PowerPairs] Items added to deal successfully');

      // Hide loading overlay
      this.hideLoadingOverlay();

      // Show brief success message
      announceToScreenReader(`Added ${pricing.totalItems} items to deal`, 'polite');

      // Close modal after brief delay
      setTimeout(() => {
        this.close();
      }, 500);

    } catch (error) {
      console.error('[PowerPairs] Add to deal failed:', error);
      this.hideLoadingOverlay();
      this.showError(error.message || 'Failed to add to deal. Please try again.');

      // Re-enable buttons
      if (dealButton) {
        dealButton.classList.remove('pp-sheet-cta__button--loading');
        dealButton.disabled = false;
      }
      if (ctaButton) {
        ctaButton.disabled = false;
      }
    }
  }

  /**
   * Handle quick add from bundle card (adds all items without opening modal)
   * @param {string} bundleId - Bundle ID
   * @param {HTMLElement} button - Clicked button element
   */
  async handleQuickAdd(bundleId, button) {
    console.log('[PowerPairs] Quick Add initiated for bundle:', bundleId);

    // Check if state exists
    if (!window.PPState) {
      console.error('[PowerPairs] State not initialized');
      this.showQuickAddError(button, 'Bundle system not ready. Please try again.');
      return;
    }

    // Get bundle from state
    const bundle = window.PPState.getBundleById(bundleId);

    if (!bundle) {
      console.error('[PowerPairs] Bundle not found:', bundleId);
      this.showQuickAddError(button, 'Bundle not found. Please try again.');
      return;
    }

    // Set as active bundle to ensure we have the latest state (including swaps)
    window.PPState.setActiveBundle(bundleId);

    // Get the active bundle again to ensure we have latest state
    const activeBundle = window.PPState.getActiveBundle();

    if (!activeBundle) {
      console.error('[PowerPairs] Failed to set active bundle');
      this.showQuickAddError(button, 'Failed to load bundle. Please try again.');
      return;
    }

    // Check if variants are complete
    // If not complete, skip products without variants (don't open modal for Quick Add)
    if (!activeBundle.variantsComplete) {
      console.log('[PowerPairs] Variants not complete, skipping incomplete products for Quick Add');
      // Filter out products without selected variants
      activeBundle.products = activeBundle.products.filter(product => product.selectedVariantId);
      
      if (activeBundle.products.length === 0) {
        this.showQuickAddError(button, 'Please select product variants first. Use "View & Customize" to choose options.');
        return;
      }
      
      // Recalculate variantsComplete after filtering
      activeBundle.variantsComplete = activeBundle.products.every(p => p.selectedVariantId);
    }

    // Calculate final pricing
    const pricing = this.calculateBundlePricing(activeBundle);

    // Show loading state on button
    const originalText = button.querySelector('.pp-bundle-card__cta-text')?.textContent || 'Quick Add';
    button.disabled = true;
    button.classList.add('pp-bundle-card__cta--loading');
    if (button.querySelector('.pp-bundle-card__cta-text')) {
      button.querySelector('.pp-bundle-card__cta-text').textContent = 'Adding...';
    }

    try {
      // ─────────────────────────────────────────────────────────────────
      // BUNDLEMANAGER INTEGRATION (Virtual Cart - Instant)
      // If BundleManager is available, add to localStorage instead of API
      // ─────────────────────────────────────────────────────────────────
      if (window.BF25BundleManager) {
        console.log('[PowerPairs] Using BundleManager for quick add');
        
        // Add each product in the bundle to BundleManager
        for (const product of activeBundle.products) {
          // Skip products without selected variants
          if (!product.selectedVariantId) {
            console.warn('[PowerPairs] Skipping product without variant:', product.title);
            continue;
          }
          
          // Get product data from window.productData if available
          const productData = window.productData?.[product.id] || null;
          
          // Build product data for BundleManager
          const bundleManagerData = {
            variantId: String(product.selectedVariantId),
            productId: String(product.id),
            title: product.title,
            variantTitle: product.selectedVariant?.title || '',
            // Price priority: selectedVariant price > product price > 0
            price: product.selectedVariant?.price || product.price || productData?.basePrice || 0,
            // Get image URL
            image: product.image || productData?.featuredImage || productData?.featured_image || '',
            handle: product.handle || productData?.handle || ''
          };

          // Add with quantity * multiplier
          const quantity = product.quantity * activeBundle.multiplier;
          const result = window.BF25BundleManager.addItem(bundleManagerData, quantity);

          if (!result.success) {
            console.error('[PowerPairs] Failed to add product to BundleManager:', product.title, result.error);
            // Continue with other products even if one fails
            if (result.error === 'MAX_ITEMS_REACHED') {
              throw new Error('Bundle has reached maximum items. Remove some items to add more.');
            }
          }
        }

        console.log('[PowerPairs] Items quick added to BundleManager successfully');
      } else {
        // ─────────────────────────────────────────────────────────────────
        // FALLBACK: Original Shopify API flow (if BundleManager unavailable)
        // ─────────────────────────────────────────────────────────────────
        console.log('[PowerPairs] Using Shopify API for quick add (BundleManager not available)');

        // Prepare cart items (this handles swapped products automatically)
        const cartItems = this.prepareCartItems(activeBundle, pricing);

        console.log('[PowerPairs] Quick adding items to cart:', cartItems);

        // Add items to cart (sticky cart will update automatically)
        await this.addItemsToCart(cartItems);

        console.log('[PowerPairs] Items quick added successfully');
      }

      // Show success state
      if (button.querySelector('.pp-bundle-card__cta-text')) {
        button.querySelector('.pp-bundle-card__cta-text').textContent = 'Added!';
      }
      button.classList.add('pp-bundle-card__cta--success');

      // Announce to screen reader
      announceToScreenReader(`Added ${pricing.totalItems} items to cart`, 'polite');

      // Reset button after delay
      setTimeout(() => {
        button.disabled = false;
        button.classList.remove('pp-bundle-card__cta--loading', 'pp-bundle-card__cta--success');
        if (button.querySelector('.pp-bundle-card__cta-text')) {
          button.querySelector('.pp-bundle-card__cta-text').textContent = originalText;
        }
      }, 2000);

    } catch (error) {
      console.error('[PowerPairs] Quick add failed:', error);
      this.showQuickAddError(button, error.message || 'Failed to add items. Please try again.');
    }
  }

  /**
   * Show error state on quick add button
   * @param {HTMLElement} button - Button element
   * @param {string} message - Error message
   */
  showQuickAddError(button, message) {
    const originalText = button.querySelector('.pp-bundle-card__cta-text')?.textContent || 'Quick Add';
    button.disabled = false;
    button.classList.remove('pp-bundle-card__cta--loading');
    button.classList.add('pp-bundle-card__cta--error');

    if (button.querySelector('.pp-bundle-card__cta-text')) {
      button.querySelector('.pp-bundle-card__cta-text').textContent = 'Error';
    }

    // Show error message (you could use a toast notification here)
    console.error('[PowerPairs] Quick Add Error:', message);

    // Reset button after delay
    setTimeout(() => {
      button.classList.remove('pp-bundle-card__cta--error');
      if (button.querySelector('.pp-bundle-card__cta-text')) {
        button.querySelector('.pp-bundle-card__cta-text').textContent = originalText;
      }
    }, 3000);
  }

  /**
   * Handle add to cart
   */
  async handleAddToCart() {
    console.log('[PowerPairs] Add to Cart initiated');

    const bundle = window.PPState.getActiveBundle();

    if (!bundle) {
      console.error('[PowerPairs] No active bundle');
      this.showError('Bundle not found. Please try again.');
      return;
    }

    // Double-check variants are complete
    if (!bundle.variantsComplete) {
      console.error('[PowerPairs] Variants not complete');
      this.showError('Please select all product variants first.');
      return;
    }

    // Calculate final pricing
    const pricing = this.calculateBundlePricing(bundle);

    // Show loading overlay
    this.showLoadingOverlay('Adding to cart...', 'Preparing your bundle');

    // Disable both buttons
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    const dealButton = ctaContainer ? ctaContainer.querySelector('[data-action="add-to-deal"]') : null;
    const ctaButton = ctaContainer ? ctaContainer.querySelector('[data-action="add-to-cart"]') : null;
    
    if (dealButton) {
      dealButton.disabled = true;
    }
    if (ctaButton) {
      ctaButton.classList.add('pp-sheet-cta__button--loading');
      ctaButton.disabled = true;
    }

    try {
      // Prepare cart items
      const cartItems = this.prepareCartItems(bundle, pricing);

      console.log('[PowerPairs] Adding items to cart:', cartItems);

      // Add items to cart
      await this.addItemsToCart(cartItems);

      // Generate and apply discount code
      const discountCode = this.generateDiscountCode(pricing.achievedTier, pricing.totalItems);

      console.log('[PowerPairs] Generated discount code:', discountCode);

      // Show success
      this.showSuccessOverlay(bundle, pricing, discountCode);

      // Redirect to checkout after delay
      setTimeout(() => {
        this.redirectToCheckout(discountCode);
      }, 3000);

    } catch (error) {
      console.error('[PowerPairs] Add to cart failed:', error);
      this.hideLoadingOverlay();
      this.showError(error.message || 'Failed to add to cart. Please try again.');

      // Re-enable buttons
      if (dealButton) {
        dealButton.disabled = false;
      }
      if (ctaButton) {
        ctaButton.classList.remove('pp-sheet-cta__button--loading');
        ctaButton.disabled = false;
      }
    }
  }

  /**
   * Prepare cart items from bundle
   * @param {Object} bundle - Bundle data
   * @param {Object} pricing - Pricing details
   * @returns {Array} Cart items array
   */
  prepareCartItems(bundle, pricing) {
    const items = [];

    // Add bundle products with multiplier
    bundle.products.forEach(product => {
      const cartItem = {
        id: product.selectedVariantId,
        quantity: product.quantity * bundle.multiplier,
        properties: {
          '_bundle_id': bundle.id,
          '_bundle_title': bundle.title,
          '_bundle_tier': pricing.achievedTier,
          '_bundle_multiplier': bundle.multiplier
        }
      };

      // Add swap tracking if product was swapped
      if (product.isSwapped && product.originalProduct) {
        cartItem.properties['_swapped'] = 'true';
        cartItem.properties['_original_product_id'] = product.originalProduct.id;
        cartItem.properties['_original_product_title'] = product.originalProduct.title;
      }

      items.push(cartItem);
    });

    console.log(`[PowerPairs] Prepared ${items.length} bundle items`);

    return items;
  }

  /**
   * Add items to Shopify cart
   * @param {Array} items - Cart items
   * @returns {Promise}
   */
  async addItemsToCart(items) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ items })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to add items to cart');
    }

    const data = await response.json();
    console.log('[PowerPairs] Items added to cart successfully:', data);

    return data;
  }

  /**
   * Generate discount code based on tier
   * @param {number} tier - Tier level
   * @param {number} itemCount - Total item count
   * @returns {string} Discount code
   */
  generateDiscountCode(tier, itemCount) {
    // Format: BF25-TIER{N}-{X}ITEMS
    return `BF25-TIER${tier}-${itemCount}ITEMS`;
  }

  /**
   * Redirect to checkout with discount code
   * @param {string} discountCode - Discount code to apply
   */
  redirectToCheckout(discountCode) {
    console.log(`[PowerPairs] Redirecting to checkout with code: ${discountCode}`);

    // Build checkout URL with discount
    const checkoutUrl = `/checkout?discount=${encodeURIComponent(discountCode)}`;

    // Redirect
    window.location.href = checkoutUrl;
  }

  /**
   * Show loading overlay
   * @param {string} title - Loading title
   * @param {string} subtitle - Loading subtitle
   */
  showLoadingOverlay(title = 'Loading...', subtitle = '') {
    // Create overlay if doesn't exist
    let overlay = this.sheet.querySelector('.pp-loading-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pp-loading-overlay';
      overlay.innerHTML = `
        <div class="pp-loading-overlay__spinner"></div>
        <div class="pp-loading-overlay__text"></div>
        <div class="pp-loading-overlay__subtext"></div>
      `;
      this.sheet.appendChild(overlay);
    }

    // Update text
    const textElement = overlay.querySelector('.pp-loading-overlay__text');
    const subtextElement = overlay.querySelector('.pp-loading-overlay__subtext');

    if (textElement) textElement.textContent = title;
    if (subtextElement) subtextElement.textContent = subtitle;

    // Show overlay
    overlay.classList.add('active');

    console.log('[PowerPairs] Loading overlay shown');
  }

  /**
   * Hide loading overlay
   */
  hideLoadingOverlay() {
    const overlay = this.sheet.querySelector('.pp-loading-overlay');

    if (overlay) {
      overlay.classList.remove('active');
      console.log('[PowerPairs] Loading overlay hidden');
    }
  }

  /**
   * Show success overlay
   * @param {Object} bundle - Bundle data
   * @param {Object} pricing - Pricing details
   * @param {string} discountCode - Applied discount code
   */
  showSuccessOverlay(bundle, pricing, discountCode) {
    // Hide loading first
    this.hideLoadingOverlay();

    // Create overlay if doesn't exist
    let overlay = this.sheet.querySelector('.pp-success-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pp-success-overlay';
      this.sheet.appendChild(overlay);
    }

    // Build success content
    overlay.innerHTML = `
      <div class="pp-success-icon">✓</div>
      <h3 class="pp-success-title">Added to Cart!</h3>
      <p class="pp-success-message">
        ${bundle.multiplier}x ${bundle.title}
      </p>
      <div class="pp-success-details">
        <div class="pp-success-detail-item">
          <strong>${pricing.totalItems} items</strong> • ${this.formatMoney(pricing.finalPrice)}
        </div>
        <div class="pp-success-detail-item">
          ${pricing.discountPercent}% OFF with code: <strong>${discountCode}</strong>
        </div>
      </div>
      <p class="pp-success-countdown">
        Redirecting to checkout in <span id="pp-countdown">3</span>s...
      </p>
    `;

    // Show overlay
    overlay.classList.add('active');

    // Start countdown
    this.startCountdown();

    console.log('[PowerPairs] Success overlay shown');
  }

  /**
   * Start countdown timer
   */
  startCountdown() {
    let count = 3;
    const countdownElement = document.getElementById('pp-countdown');

    const interval = setInterval(() => {
      count--;
      if (countdownElement) {
        countdownElement.textContent = count;
      }

      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  /**
   * Show error overlay
   * @param {string} message - Error message
   */
  showError(message) {
    // Hide loading first
    this.hideLoadingOverlay();

    // Create overlay if doesn't exist
    let overlay = this.sheet.querySelector('.pp-error-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pp-error-overlay';
      this.sheet.appendChild(overlay);
    }

    // Build error content
    overlay.innerHTML = `
      <div class="pp-error-content">
        <div class="pp-error-icon">⚠</div>
        <h3 class="pp-error-title">Oops! Something went wrong</h3>
        <p class="pp-error-message">${message}</p>
        <button class="pp-error-retry-btn" onclick="this.closest('.pp-error-overlay').classList.remove('active')">
          Try Again
        </button>
      </div>
    `;

    // Show overlay
    overlay.classList.add('active');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 5000);

    console.log('[PowerPairs] Error shown:', message);
  }

  /**
   * Format price from cents to currency
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price
   */
  formatMoney(cents) {
    // Validate input
    if (typeof cents !== 'number' || isNaN(cents)) {
      console.error('[PowerPairs] formatMoney: Invalid input', cents);
      return '';
    }

    // Use Shopify's formatMoney if available
    if (window.Shopify && window.Shopify.formatMoney) {
      // Get format string, ensuring it doesn't contain unprocessed Liquid syntax
      let format = '{{amount}}';
      if (window.theme && window.theme.moneyFormat && typeof window.theme.moneyFormat === 'string') {
        // Remove any unprocessed Liquid syntax (like {{ liquid variable }})
        format = window.theme.moneyFormat.replace(/\{\{[^}]+\}\}/g, (match) => {
          // Only keep valid Shopify money format placeholders
          if (match === '{{amount}}' || match === '{{amount_no_decimals}}' || 
              match === '{{amount_with_comma_separator}}' || match === '{{amount_no_decimals_with_comma_separator}}') {
            return match;
          }
          // Remove any other Liquid syntax
          return '';
        });
        // If format is empty after cleaning, use default
        if (!format || format.trim() === '') {
          format = '{{amount}}';
        }
      }
      return window.Shopify.formatMoney(cents, format);
    }
    
    // Manual fallback using theme money format
    if (window.theme && window.theme.moneyFormat && typeof window.theme.moneyFormat === 'string') {
      const amount = (cents / 100).toFixed(2);
      let format = window.theme.moneyFormat;
      
      // Remove any unprocessed Liquid syntax before replacing placeholders
      format = format.replace(/\{\{[^}]+\}\}/g, (match) => {
        // Only keep valid Shopify money format placeholders
        if (match === '{{amount}}' || match === '{{amount_no_decimals}}' || 
            match === '{{amount_with_comma_separator}}' || match === '{{amount_no_decimals_with_comma_separator}}') {
          return match;
        }
        // Remove any other Liquid syntax
        return '';
      });
      
      // Replace valid placeholders
      format = format.replace('{{amount}}', amount);
      format = format.replace('{{amount_no_decimals}}', Math.round(cents / 100));
      format = format.replace('{{amount_with_comma_separator}}', amount.replace('.', ','));
      format = format.replace('{{amount_no_decimals_with_comma_separator}}', Math.round(cents / 100).toString());
      
      return format;
    }
    
    // Ultimate fallback: simple format
    const amount = (cents / 100).toFixed(2);
    return `$${amount}`;
  }

  /**
   * Render review stars for a product
   * Added in Prompt 13
   * @param {number} rating - Rating from 0 to 5
   * @param {number} count - Number of reviews
   * @returns {string} HTML string
   */
  renderReviewStars(rating = 0, count = 0) {
    if (!rating || rating === 0) {
      return '';
    }

    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    let starsHTML = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="pp-review-star">★</span>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="pp-review-star pp-review-star--empty">★</span>';
    }

    return `
      <div class="pp-product-reviews">
        <div class="pp-review-stars">
          ${starsHTML}
        </div>
        ${count > 0 ? `<span class="pp-review-count">(${count})</span>` : ''}
      </div>
    `;
  }

  /**
   * Calculate tier from item count
   * @param {number} itemCount - Total item count
   * @returns {number} Tier level (1-4)
   */
  calculateTierFromItems(itemCount) {
    if (itemCount >= 16) return 4;
    if (itemCount >= 12) return 3;
    if (itemCount >= 8) return 2;
    if (itemCount >= 4) return 1;
    return 0; // Below minimum
  }

  /**
   * Calculate bundle price with tier discounts
   * @param {Object} bundle - Bundle data
   * @returns {Object} Pricing details
   */
  calculateBundlePricing(bundle) {
    // Recalculate baseSubtotal to ensure it's always accurate
    // This fixes any potential sync issues between state and display
    bundle.baseSubtotal = window.PPState.calculateBaseSubtotal(bundle.products);
    
    // Recalculate baseItemCount to ensure it's always accurate
    bundle.baseItemCount = bundle.products.reduce((sum, p) => sum + p.quantity, 0);
    
    // Calculate total items with multiplier
    const totalItems = bundle.baseItemCount * bundle.multiplier;

    // Determine achieved tier
    const achievedTier = this.calculateTierFromItems(totalItems);

    // Get tier discount multiplier
    const tierMultiplier = TIER_MULTIPLIERS[achievedTier] || 1;

    // Calculate compare-at subtotal (for crossed price display)
    const compareAtSubtotal = window.PPState.calculateCompareAtSubtotal(bundle.products) * bundle.multiplier;
    
    // Calculate regular subtotal (current prices) - BEFORE tier discount
    const subtotal = bundle.baseSubtotal * bundle.multiplier;
    
    // Calculate final price with tier discount applied to regular price
    const finalPrice = Math.round(subtotal * tierMultiplier);
    
    // Calculate savings: simply crossed minus current (no tier discount logic)
    const savings = compareAtSubtotal - subtotal;

    // Calculate discount percentage
    const discountPercent = Math.round((1 - tierMultiplier) * 100);

    // Debug logging
    console.log('[PowerPairs Pricing Debug]', {
      baseSubtotal: bundle.baseSubtotal,
      multiplier: bundle.multiplier,
      subtotal: subtotal,
      tierMultiplier: tierMultiplier,
      finalPrice: finalPrice,
      compareAtSubtotal: compareAtSubtotal,
      productsPrices: bundle.products.map(p => ({
        title: p.title,
        variantPrice: p.selectedVariant.price,
        quantity: p.quantity,
        total: p.selectedVariant.price * p.quantity
      }))
    });

    return {
      totalItems,
      achievedTier,
      compareAtSubtotal,  // Original compare-at price (for crossed display)
      subtotal,           // Current price before tier discount
      finalPrice,         // Final price with tier discount
      savings,            // Total savings from compare-at
      discountPercent,
      tierMultiplier
    };
  }

  /**
   * Get tier unlock message
   * @param {number} tier - Tier level
   * @returns {string} Message text
   */
  getTierUnlockMessage(tier) {
    const messages = {
      1: 'Tier 1 Unlocked! Free 4-in-1 Cable included',
      2: 'Tier 2 Unlocked! Free Cable + Travel Case',
      3: 'Tier 3 Unlocked! Free Magnetic Set (Early Launch)',
      4: 'BIGFOOT UNLOCKED! Free Mystery Box + VIP Status'
    };

    return messages[tier] || '';
  }

  close() {
    if (!this.isOpen) return;

    console.log('[PowerPairs] Closing bottom sheet');

    // Store scroll position before removing fixed positioning
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Update ARIA attributes
    this.sheet.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');

    this.sheet.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.classList.remove('pp-sheet-open');

    // Restore body styles
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('height');
    document.body.style.removeProperty('overflow');

    // Restore scroll position
    if (scrollY > 0) {
      window.scrollTo(0, scrollY);
    }

    // Unlock scroll on iOS
    IOSScrollLock.unlock();

    this.isOpen = false;
    this.currentBundleId = null;

    // Restore focus to previously focused element
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;

      // Announce closure
      announceToScreenReader('Bundle customization closed', 'polite');
    }
  }

  handleKeyDown(e) {
    if (!this.isOpen) return;

    // ESC key closes sheet
    if (e.key === 'Escape') {
      this.close();
      return;
    }

    // TAB key cycles focus
    if (e.key === 'Tab') {
      this.trapFocus(e);
    }
  }

  setupFocusTrap() {
    // Find all focusable elements within the sheet
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    this.focusableElements = Array.from(
      this.sheet.querySelectorAll(focusableSelectors)
    );

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    console.log(`🎯 Focus trap set up with ${this.focusableElements.length} elements`);
  }

  trapFocus(e) {
    if (!this.firstFocusable || !this.lastFocusable) return;

    // If SHIFT + TAB on first element, go to last
    if (e.shiftKey && document.activeElement === this.firstFocusable) {
      e.preventDefault();
      this.lastFocusable.focus();
      return;
    }

    // If TAB on last element, go to first
    if (!e.shiftKey && document.activeElement === this.lastFocusable) {
      e.preventDefault();
      this.firstFocusable.focus();
      return;
    }
  }

  /**
   * Get tier icon emoji
   * @param {number} tier - Tier number
   * @returns {string} Tier icon
   */
  getTierIcon(tier) {
    return '';
  }
}

/**
 * ═══════════════════════════════════════════════════════════
 * DEFERRED INITIALIZATION
 * Initialize after page load to improve initial load time
 * ═══════════════════════════════════════════════════════════
 */
function initPowerPairs() {
  perfMark('pp-init-start');

  console.log('[PowerPairs] DOM ready - initializing...');

  // Check if we're on a page with the Power Pairs section
  const section = document.getElementById('PowerPairsBF25');

  if (!section) {
    console.log('[PowerPairs] Section not found on this page');
    return;
  }

  console.log('[PowerPairs] Section found - initializing state and managers');

  // Parse JSON data
  const dataElement = document.getElementById('PowerPairsData');

  if (!dataElement) {
    console.error('[PowerPairs] Data element not found');
    return;
  }

  let rawData;
  try {
    rawData = JSON.parse(dataElement.textContent);
    console.log('[PowerPairs] Successfully parsed JSON data');
  } catch (error) {
    console.error('[PowerPairs] Failed to parse JSON data:', error);
    return;
  }

  // Create global state instance
  window.PPState = new PowerPairsState(rawData);

  // Create global variant modal instance
  window.PPVariantModal = new VariantModal();

  // Create global swap modal instance
  window.PPSwapModal = new SwapModal();

  // Create global expansion manager instance
  window.PPExpansionManager = new ExpansionManager();

  // Initialize touch support for mobile devices
  TouchSupport.init();

  perfMark('pp-init-end');
  perfMeasure('pp-total-init', 'pp-init-start', 'pp-init-end');

  console.log('[PowerPairs] Initialization complete');
  console.log('[PowerPairs] State:', window.PPState);

  // Report Core Web Vitals if available
  if ('PerformanceObserver' in window) {
    reportWebVitals();
  }
}

/**
 * Report Core Web Vitals
 */
function reportWebVitals() {
  try {
    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('[PowerPairs Perf] LCP:', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('[PowerPairs Perf] FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS
    let clsScore = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          console.log('[PowerPairs Perf] CLS:', clsScore);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.log('[PowerPairs Perf] Web Vitals monitoring not available');
  }
}

// Initialize based on document ready state
if (document.readyState === 'loading') {
  // Document still loading, wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initPowerPairs);
} else {
  // Document already loaded, initialize immediately
  // But defer to next frame to not block initial render
  requestIdleCallback(initPowerPairs);
}

})();

