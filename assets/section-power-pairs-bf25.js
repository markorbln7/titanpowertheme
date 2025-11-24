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

// Free gifts by tier
const TIER_GIFTS = {
  1: [
    { name: '4-in-1 Cable', value: 30 }
  ],
  2: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 }
  ],
  3: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 },
    { name: '🚀 Magnetic Cable Set (Pre-Launch)', value: 60 }
  ],
  4: [
    { name: '4-in-1 Cable', value: 30 },
    { name: 'Medium Travel Case', value: 35 },
    { name: 'Magnetic Cable Set', value: 60 },
    { name: '🦶 BIGFOOT MYSTERY BOX', value: 150 }
  ]
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

        return {
          ...product,
          selectedVariantId: defaultVariant.id,
          selectedVariant: defaultVariant,
          variantSelected: !product.hasVariants, // Auto-complete if no variants
          variantSelectionComplete: !product.hasVariants
        };
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
    const buttons = document.querySelectorAll('[data-action="open-sheet"]');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const bundleId = e.currentTarget.getAttribute('data-bundle-id');
        this.open(bundleId);
      }, { passive: false }); // Need preventDefault capability
    });
    console.log(`[PowerPairs] Found ${buttons.length} CTA buttons`);
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

    // Add active classes
    this.overlay.classList.add('active');
    this.sheet.classList.add('active');
    document.body.classList.add('pp-sheet-open');

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

    // Show loading state briefly
    this.contentArea.innerHTML = `
      <div class="pp-bottom-sheet__loading">
        <div class="pp-loading-spinner"></div>
        <p>Loading ${bundle.title}...</p>
      </div>
    `;

    // Populate with actual data after brief delay
    setTimeout(() => {
      this.renderBundleContent(bundle);
    }, 300);
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
          <div class="pp-pricing-header__row">
            <span class="pp-pricing-header__emoji">💰</span>
            <span class="pp-pricing-header__current">${this.formatMoney(pricing.finalPrice)}</span>
            <span class="pp-pricing-header__crossed">${this.formatMoney(pricing.compareAtSubtotal)}</span>
            ${pricing.savings > 0 ? `
              <span class="pp-pricing-header__savings">Save ${this.formatMoney(pricing.savings)}!</span>
            ` : ''}
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
            <span class="pp-products-section-v2__count">${bundle.products.length} products</span>
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
    return products.map(product => {
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
          role="button"
          tabindex="0"
          aria-label="${statusLabel}"
          aria-pressed="${ariaPressed}"
          aria-describedby="product-price-${product.id}"
        >
          <div class="pp-variant-indicator ${indicatorClass}" role="status" aria-label="${indicatorClass === 'success' ? 'Variant selected' : 'Variant needed'}">
            ${indicatorIcon}
          </div>

          <img
            src="${product.selectedVariant.image || product.image}"
            alt="${product.title}"
            class="pp-product-compact-image"
            loading="lazy"
          >

          <div class="pp-product-compact-info">
            ${product.isBestSeller ? '<div class="pp-product-badge">BEST SELLER</div>' : ''}

            <h4 class="pp-product-compact-title">${product.title}</h4>

            ${this.renderReviewStars(product.rating, product.reviewCount)}

            ${variantText}

            <div id="product-price-${product.id}" class="pp-product-compact-price" aria-label="${product.title}, ${this.formatMoney(product.selectedVariant.price)} each, quantity ${product.quantity}">
              <span aria-hidden="true">${this.formatMoney(product.selectedVariant.price)}</span>
              <span class="pp-product-compact-quantity" aria-hidden="true"> × ${product.quantity}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Attach click listeners to product cards
   */
  attachProductCardListeners() {
    const productCards = this.contentArea.querySelectorAll('.pp-product-compact-card');

    console.log(`[PowerPairs] Found ${productCards.length} product cards`);

    productCards.forEach(card => {
      // Click listener
      card.addEventListener('click', (e) => {
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

    // Add loading state
    gridContainer.style.opacity = '0.5';
    gridContainer.style.pointerEvents = 'none';

    // Use a short timeout to ensure smooth transition
    setTimeout(() => {
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

      // Update summary section if exists
      const summaryElement = this.contentArea.querySelector('.pp-sheet-summary');
      if (summaryElement) {
        const pricing = this.calculateBundlePricing(bundle);
        summaryElement.outerHTML = this.renderSheetSummary(bundle, pricing);
      }

      // Also refresh multiplier section and CTA (pricing may have changed)
      this.refreshMultiplierSection();

      console.log('[PowerPairs] Product grid refreshed successfully');
    }, 200);
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
          <div class="pp-pill-tier">${tierIcon} Tier ${tier}</div>
          <div class="pp-pill-items">${totalItems} items</div>
        </button>
      `;
    }).join('');

    // Get tier unlock message
    const tierMessage = this.getTierUnlockMessage(pricing.achievedTier);
    const isPremiumTier = pricing.achievedTier >= 3;

    // Get free gifts for current tier
    const gifts = TIER_GIFTS[pricing.achievedTier] || [];
    const totalGiftValue = gifts.reduce((sum, g) => sum + g.value, 0);

    const giftsHTML = gifts.length > 0 ? `
      <div class="pp-free-gifts">
        <h4 class="pp-free-gifts__title">
          <span class="pp-free-gifts__icon">🎁</span>
          Your Free Gifts (${gifts.length})
        </h4>
        <ul class="pp-free-gifts__list">
          ${gifts.map(gift => `
            <li class="pp-free-gifts__item">
              <span class="pp-free-gifts__item-icon">✓</span>
              <span class="pp-free-gifts__item-name">${gift.name}</span>
              <span class="pp-free-gifts__item-value">$${gift.value} value</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    return `
      <div class="pp-sheet-multipliers">
        <h3 class="pp-sheet-multipliers__title">🔢 How many kits?</h3>
        <div class="pp-multiplier-pills">
          ${pillsHTML}
        </div>
      </div>
    `;
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
    const buttonText = isDisabled
      ? 'Select Variants First'
      : `Add ${bundle.multiplier}x Kit to Cart`;

    return `
      <div class="pp-sheet-cta-fixed">
        <button
          class="pp-sheet-cta__button-main"
          data-action="add-to-cart"
          ${isDisabled ? 'disabled' : ''}
          aria-label="${buttonText}"
        >
          <span class="pp-cta-icon">🛒</span>
          <span class="pp-cta-text">${isDisabled ? 'Select Variants First' : `Add ${pricing.totalItems} Items`}</span>
          <span class="pp-cta-price">${this.formatMoney(pricing.finalPrice)}</span>
          <span class="pp-cta-arrow">→</span>
        </button>
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

    // Update header summary
    const summaryElement = this.contentArea.querySelector('.pp-sheet-summary');
    if (summaryElement) {
      summaryElement.outerHTML = this.renderSheetSummary(bundle, pricing);
    }

    console.log('[PowerPairs] Multiplier section refreshed');
  }

  /**
   * Attach click listener to Add to Cart button
   */
  attachCTAListener() {
    const ctaContainer = document.getElementById('pp-sheet-cta-container');
    const ctaButton = ctaContainer ? ctaContainer.querySelector('[data-action="add-to-cart"]') : null;

    if (!ctaButton) {
      return;
    }

    console.log('[PowerPairs] Attaching listener to CTA button');

    ctaButton.addEventListener('click', (e) => {
      console.log('[PowerPairs] Add to Cart clicked');

      // Placeholder - will implement in Prompt 12
      this.handleAddToCart();
    });
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

    // Disable CTA button
    const ctaButton = this.contentArea.querySelector('[data-action="add-to-cart"]');
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

      // Re-enable button
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
      items.push({
        id: product.selectedVariantId,
        quantity: product.quantity * bundle.multiplier,
        properties: {
          '_bundle_id': bundle.id,
          '_bundle_title': bundle.title,
          '_bundle_tier': pricing.achievedTier,
          '_bundle_multiplier': bundle.multiplier
        }
      });
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
    // Calculate total items with multiplier
    const totalItems = bundle.baseItemCount * bundle.multiplier;

    // Determine achieved tier
    const achievedTier = this.calculateTierFromItems(totalItems);

    // Get tier discount multiplier
    const tierMultiplier = TIER_MULTIPLIERS[achievedTier] || 1;

    // Calculate compare-at subtotal (for crossed price display)
    const compareAtSubtotal = window.PPState.calculateCompareAtSubtotal(bundle.products) * bundle.multiplier;
    
    // Calculate regular subtotal (current prices)
    const subtotal = bundle.baseSubtotal * bundle.multiplier;
    
    // Calculate final price with tier discount applied to regular price
    const finalPrice = Math.round(subtotal * tierMultiplier);
    
    // Calculate savings from compare-at price
    const savings = compareAtSubtotal - finalPrice;

    // Calculate discount percentage
    const discountPercent = Math.round((1 - tierMultiplier) * 100);

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
      1: '⚡ Tier 1 Unlocked! Free 4-in-1 Cable included',
      2: '🎁 Tier 2 Unlocked! Free Cable + Travel Case',
      3: '🔥 Tier 3 Unlocked! Free Magnetic Set (Early Launch)',
      4: '💎 BIGFOOT UNLOCKED! Free Mystery Box + VIP Status'
    };

    return messages[tier] || '';
  }

  close() {
    if (!this.isOpen) return;

    console.log('🔒 Closing bottom sheet');

    // Update ARIA attributes
    this.sheet.setAttribute('aria-hidden', 'true');
    this.overlay.setAttribute('aria-hidden', 'true');

    this.sheet.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.classList.remove('pp-sheet-open');

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
    const icons = { 1: '⚡', 2: '🎁', 3: '🔥', 4: '💎' };
    return icons[tier] || '⚡';
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
