# EXTRACTION SET 1: CURRENT BF25 IMPLEMENTATION

**Extraction Date:** 2025-11-24
**Purpose:** Document current BF25 Bundle Builder implementation files
**Source Files:** bf25-tier-cart.js, section-bundle-builder-bf25.js, bf25-expansion-core.js, buy-now-popup-bf25.liquid

---

## FILE 1: bf25-tier-cart.js (First 500 Lines)

**Location:** `assets/bf25-tier-cart.js`
**Purpose:** CartManager for tier-based sticky cart, gift management, performance monitoring

```javascript
/**
 * BF25 Tier-Based Sticky Cart - CartManager
 * Version: 1.0
 * Purpose: Manage cart state, tier progression, and UI updates
 */

(function() {
  'use strict';

  // ============================================
  // GIFT PRODUCT CONFIGURATION
  // ============================================
  const GIFT_PRODUCTS = {
    cable: {
      handle: 'bf25sc-free-cable',
      variantId: null, // Will be fetched dynamically
      tier: 1,
      emoji: '🔌',
      name: 'Premium Cable'
    },
    case: {
      handle: 'bf25sc-free-case',
      variantId: null,
      tier: 2,
      emoji: '📦',
      name: 'Protective Case'
    },
    magnetic: {
      handle: 'bf25sc-free-magnetic-set',
      variantId: null,
      tier: 3,
      emoji: '🧲',
      name: 'Magnetic Set'
    },
    mystery: {
      handle: 'bf25sc-free-mystery-box',
      variantId: null,
      tier: 4,
      emoji: '🎁',
      name: 'Mystery Box'
    }
  };

  // ============================================
  // TIER CONFIGURATION
  // ============================================
  const BF25_TIERS = [
    {
      id: 0,
      min: 0,
      max: 3,
      discount: "50%",
      badge: "50% OFF",
      color: "#6b7280",
      glowColor: "#a1a1aa",
      glow: "rgba(107, 114, 128, 0.3)",
      gifts: []
    },
    {
      id: 1,
      min: 4,
      max: 7,
      discount: "60%",
      badge: "🔥 60% OFF",
      color: "#60c655",
      glowColor: "#7FFF00",
      glow: "rgba(96, 198, 85, 0.5)",
      gifts: [{ name: "Cable", emoji: "🔌", value: 30 }]
    },
    {
      id: 2,
      min: 8,
      max: 11,
      discount: "70%",
      badge: "⭐ 70% OFF",
      color: "#60c655",
      glowColor: "#39FF14",
      glow: "rgba(127, 255, 0, 0.6)",
      gifts: [
        { name: "Cable", emoji: "🔌", value: 30 },
        { name: "Case", emoji: "📦", value: 35 }
      ]
    },
    {
      id: 3,
      min: 12,
      max: 15,
      discount: "80%",
      badge: "🚀 80% OFF",
      color: "#FFD700", // GOLD
      glowColor: "#FFF700",
      glow: "rgba(255, 215, 0, 0.7)",
      gifts: [
        { name: "Cable", emoji: "🔌", value: 30 },
        { name: "Case", emoji: "📦", value: 35 },
        { name: "Magnetic Set", emoji: "🧲", value: 60 }
      ],
      isDecoy: true
    },
    {
      id: 4,
      min: 16,
      max: 999,
      discount: "85%",
      badge: "💎 85% OFF",
      color: "#E0F7FF", // PLATINUM
      glowColor: "#FFFFFF",
      glow: "rgba(224, 247, 255, 0.8)",
      gifts: [
        { name: "Cable", emoji: "🔌", value: 30 },
        { name: "Case", emoji: "📦", value: 35 },
        { name: "Magnetic Set", emoji: "🧲", value: 60 },
        { name: "Mystery Box", emoji: "🎁", value: 150 }
      ]
    }
  ];

  // ============================================
  // PERFORMANCE MONITORING SYSTEM
  // ============================================

  /**
   * PerformanceMonitor - Tracks FPS, operation timing, jank detection
   * Usage: window.BF25Performance.report() for dashboard
   */
  class PerformanceMonitor {
    constructor() {
      // Singleton pattern
      if (PerformanceMonitor.instance) {
        return PerformanceMonitor.instance;
      }
      PerformanceMonitor.instance = this;

      // Performance targets (from Gemini + CKL-109)
      this.targets = {
        fps: 60,
        fpsMin: 55, // Alert threshold
        operationMax: 50, // Max ms for cart operations
        animationTarget: 1800 // Expected animation duration (ms)
      };

      // Metrics storage
      this.metrics = {
        fps: {
          samples: [],
          violations: 0
        },
        operations: {},
        jank: {
          count: 0,
          frames: []
        },
        violations: []
      };

      // FPS tracking state
      this.fpsTracking = {
        active: false,
        frameCount: 0,
        startTime: 0,
        lastFrameTime: 0
      };

      // Operation timing storage
      this.timers = new Map();

      console.log('[Performance] Monitor initialized');
    }

    /**
     * Start FPS tracking (call before animations)
     */
    startFPSTracking(label = 'animation') {
      if (this.fpsTracking.active) {
        console.warn('[Performance] FPS tracking already active');
        return;
      }

      this.fpsTracking.active = true;
      this.fpsTracking.frameCount = 0;
      this.fpsTracking.startTime = performance.now();
      this.fpsTracking.lastFrameTime = performance.now();
      this.fpsTracking.label = label;

      this.trackFrame();
      console.log(`[Performance] FPS tracking started: ${label}`);
    }

    /**
     * Track individual frame (recursive)
     */
    trackFrame() {
      if (!this.fpsTracking.active) return;

      const now = performance.now();
      const frameDuration = now - this.fpsTracking.lastFrameTime;

      // Jank detection: Frame took >16.67ms (60fps = 16.67ms per frame)
      if (frameDuration > 16.67) {
        this.metrics.jank.count++;
        this.metrics.jank.frames.push({
          duration: frameDuration,
          timestamp: now
        });

        if (frameDuration > 20) {
          console.warn(`[Performance] ⚠️ Jank detected: ${frameDuration.toFixed(1)}ms frame`);
        }
      }

      this.fpsTracking.frameCount++;
      this.fpsTracking.lastFrameTime = now;

      requestAnimationFrame(() => this.trackFrame());
    }

    /**
     * Stop FPS tracking and calculate results
     */
    stopFPSTracking() {
      if (!this.fpsTracking.active) return;

      this.fpsTracking.active = false;
      const duration = performance.now() - this.fpsTracking.startTime;
      const fps = (this.fpsTracking.frameCount / duration) * 1000;

      this.metrics.fps.samples.push({
        label: this.fpsTracking.label,
        fps: fps,
        duration: duration,
        frames: this.fpsTracking.frameCount
      });

      // Check for FPS violations
      if (fps < this.targets.fpsMin) {
        this.metrics.fps.violations++;
        this.logViolation('FPS', fps, this.targets.fps);
        console.warn(`[Performance] ✗ FPS violation: ${fps.toFixed(1)} fps (target: ${this.targets.fps})`);
      } else {
        console.log(`[Performance] ✓ FPS: ${fps.toFixed(1)} fps (${this.fpsTracking.frameCount} frames in ${duration.toFixed(0)}ms)`);
      }

      return fps;
    }

    /**
     * Start timing an operation
     */
    startOperation(name) {
      this.timers.set(name, performance.now());
    }

    /**
     * End timing an operation and check against budget
     */
    endOperation(name, target = this.targets.operationMax) {
      if (!this.timers.has(name)) {
        console.warn(`[Performance] No start timer for: ${name}`);
        return;
      }

      const startTime = this.timers.get(name);
      const duration = performance.now() - startTime;
      this.timers.delete(name);

      // Store in metrics
      if (!this.metrics.operations[name]) {
        this.metrics.operations[name] = {
          samples: [],
          violations: 0,
          target: target
        };
      }

      this.metrics.operations[name].samples.push(duration);

      // Check for violations
      if (duration > target) {
        this.metrics.operations[name].violations++;
        this.logViolation(name, duration, target);
        console.warn(`[Performance] ✗ ${name}: ${duration.toFixed(1)}ms (target: <${target}ms)`);
      } else {
        console.log(`[Performance] ✓ ${name}: ${duration.toFixed(1)}ms`);
      }

      return duration;
    }

    /**
     * Log performance violation
     */
    logViolation(metric, actual, target) {
      this.metrics.violations.push({
        metric: metric,
        actual: actual,
        target: target,
        timestamp: Date.now()
      });
    }

    /**
     * Generate performance report
     */
    report() {
      const calculateStats = (samples) => {
        if (samples.length === 0) return { avg: 0, min: 0, max: 0 };
        return {
          avg: samples.reduce((a, b) => a + b, 0) / samples.length,
          min: Math.min(...samples),
          max: Math.max(...samples),
          count: samples.length
        };
      };

      // FPS stats
      const fpsSamples = this.metrics.fps.samples.map(s => s.fps);
      const fpsStats = calculateStats(fpsSamples);

      // Operations stats
      const operations = {};
      for (const [name, data] of Object.entries(this.metrics.operations)) {
        operations[name] = {
          ...calculateStats(data.samples),
          target: data.target,
          violations: data.violations
        };
      }

      // Overall budget status
      const totalViolations = this.metrics.violations.length;
      const budgetPassed = totalViolations === 0;

      const report = {
        summary: {
          budgetPassed: budgetPassed,
          totalViolations: totalViolations,
          timestamp: new Date().toISOString()
        },
        fps: {
          ...fpsStats,
          target: this.targets.fps,
          violations: this.metrics.fps.violations
        },
        operations: operations,
        jank: {
          count: this.metrics.jank.count,
          worstFrame: this.metrics.jank.frames.length > 0
            ? Math.max(...this.metrics.jank.frames.map(f => f.duration))
            : 0
        },
        violations: this.metrics.violations.slice(-10) // Last 10 violations
      };

      // Console output
      console.group('🎯 BF25 Performance Report');
      console.log('Budget Status:', budgetPassed ? '✓ PASSED' : '✗ FAILED');
      console.log('Total Violations:', totalViolations);
      console.log('FPS:', `${fpsStats.avg.toFixed(1)} fps (min: ${fpsStats.min.toFixed(1)}, max: ${fpsStats.max.toFixed(1)})`);
      console.log('Jank Events:', this.metrics.jank.count);
      console.table(operations);
      console.groupEnd();

      return report;
    }

    /**
     * Reset all metrics
     */
    reset() {
      this.metrics = {
        fps: { samples: [], violations: 0 },
        operations: {},
        jank: { count: 0, frames: [] },
        violations: []
      };
      console.log('[Performance] Metrics reset');
    }
  }

  // Initialize global performance monitor
  window.BF25Performance = new PerformanceMonitor();

  // ============================================
  // TOAST MANAGER CLASS
  // ============================================
  class ToastManager {
    constructor() {
      if (ToastManager.instance) {
        return ToastManager.instance;
      }
      ToastManager.instance = this;

      this.container = null;
      this.activeToasts = [];
      this.maxToasts = 3;
      this.defaultDuration = 2000; // 2 seconds
      this.toastIdCounter = 0;
    }

    /**
     * Initialize toast container
     */
    init() {
      this.container = document.getElementById('bf25sc-toast-container');

      if (!this.container) {
        console.warn('[ToastManager] Toast container not found');
        return false;
      }

      console.log('[ToastManager] Initialized');
      return true;
    }

    /**
     * Show a toast notification
     * @param {string} message - Primary message text
     * @param {Object} options - Configuration options
     * @param {string} options.secondary - Secondary message (optional)
     * @param {string} options.icon - Emoji icon (default: 🎁)
     * @param {number} options.tier - Tier number for styling (1-4)
     * @param {string} options.type - Toast type: 'info', 'success', 'warning' (default: 'info')
     * @param {number} options.duration - Duration in ms (default: 2000)
     * @param {boolean} options.dismissible - Allow manual dismiss (default: true)
     */
    show(message, options = {}) {
      if (!this.container) {
        console.warn('[ToastManager] Container not initialized');
        return null;
      }

      // Enforce max toast limit
      if (this.activeToasts.length >= this.maxToasts) {
        const oldest = this.activeToasts[0];
        this.dismiss(oldest.element);
      }

      const config = {
        secondary: options.secondary || null,
        icon: options.icon || '🎁',
        tier: options.tier || 1,
        type: options.type || 'info',
        duration: options.duration || this.defaultDuration,
        dismissible: options.dismissible !== false
      };

      const toastId = `bf25sc-toast-${++this.toastIdCounter}`;
      const toast = this.createToast(toastId, message, config);

      // Insert at top (newest first)
      this.container.insertBefore(toast, this.container.firstChild);

      // Track active toast
      this.activeToasts.push({
        id: toastId,
        element: toast,
        timeoutId: null
      });

      // Trigger slide-in animation
      requestAnimationFrame(() => {
        toast.classList.add('is-visible');
      });

      // Auto-dismiss after duration
      const timeoutId = setTimeout(() => {
        this.dismiss(toast);
      }, config.duration);

      this.activeToasts[this.activeToasts.length - 1].timeoutId = timeoutId;

      console.log(`[ToastManager] Toast shown: "${message}" (${config.duration}ms)`);

      return toast;
    }

    /**
     * Create toast HTML element
     */
    createToast(id, message, config) {
      const toast = document.createElement('div');
      toast.id = id;
      toast.className = `bf25sc-toast bf25sc-toast--${config.type}`;
      toast.setAttribute('data-tier', config.tier);
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');

      const iconSpan = document.createElement('span');
      iconSpan.className = 'bf25sc-toast__icon';
      iconSpan.textContent = config.icon;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'bf25sc-toast__content';

      const primaryP = document.createElement('p');
      primaryP.className = 'bf25sc-toast__message';
      primaryP.textContent = message;
      contentDiv.appendChild(primaryP);

      if (config.secondary) {
        // [Truncated - rest of createToast method not shown in extraction]
      }

      // [Method continues...]
    }
  }

  // [Rest of file continues beyond 500 lines...]

})();
```

**Key Components:**
- Gift product configuration (4 tiers: Cable, Case, Magnetic Set, Mystery Box)
- Tier configuration (5 tiers: 0-4 with discount percentages 50%-85%)
- PerformanceMonitor class (FPS tracking, operation timing, jank detection)
- ToastManager class (notification system with max 3 toasts)

---

## FILE 2: section-bundle-builder-bf25.js (Complete)

**Location:** `assets/section-bundle-builder-bf25.js`
**Purpose:** Modal click handlers for BF25 product cards

```javascript
/**
 * BF25 Bundle Builder - Modal Click Handlers
 * Uses data-product-id matching to link triggers to modals
 */

document.addEventListener('DOMContentLoaded', function () {
  const bundleSection = document.querySelector('.section-collections-with-nav.dark-mode[data-section="bf25"]');

  // Only run if BF25 section exists on page
  if (!bundleSection) {
    console.log('BF25 section not found on this page');
    return;
  }

  const buyNowButtons = bundleSection.querySelectorAll('.js-section-explore__buy-now, .arrow');
  const popups = document.querySelectorAll('.buy-now-popup[data-section="bf25"]');

  // Open popup helper
  function openPopup(popup) {
    popup.style.display = 'block';
    popup.style.zIndex = '1000000'; // Force z-index
    popup.classList.add('active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  // Close popup helper
  function closePopup(popup) {
    popup.style.display = 'none';
    popup.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
  }

  // Handle buy now button clicks
  buyNowButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Find the article containing this button
      const productArticle = button.closest('[data-product-id]');

      if (productArticle) {
        const productId = productArticle.getAttribute('data-product-id');

        // Find modal with matching product ID
        const popup = document.querySelector(`.buy-now-popup[data-section="bf25"][data-product-id="${productId}"]`);

        if (popup) {
          openPopup(popup);
          console.log('BF25 Modal opened for product ID:', productId);
        } else {
          console.error('BF25 Modal not found for product ID:', productId);
        }
      } else {
        console.error('Product article not found for button:', button);
      }
    });
  });

  // Handle close button clicks
  popups.forEach(popup => {
    const closeButtons = popup.querySelectorAll('.close-buy-now-popup');

    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePopup(popup);
      });
    });

    // Close on overlay click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closePopup(popup);
      }
    });
  });

  console.log('BF25 Modal handlers initialized:', {
    buttons: buyNowButtons.length,
    modals: popups.length,
    section: bundleSection
  });
});
```

**Key Features:**
- Section-specific targeting (`data-section="bf25"`)
- Product ID matching between cards and modals
- Z-index override (1000000) for modal visibility
- Body scroll lock on modal open
- Close on overlay click + close button

---

## FILE 3: bf25-expansion-core.js (First 400 Lines)

**Location:** `assets/bf25-expansion-core.js`
**Purpose:** Core architecture for dual-mode expansion modal with state management

```javascript
/**
 * ═══════════════════════════════════════════════════════════════════════
 * BF25 EXPANSION MODAL - CORE ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Prompt 3: JavaScript Foundation (Simple State + Event Delegation)
 *
 * Purpose: Establish the core architecture for the dual-mode expansion modal.
 * This file contains the state management system and main controller class.
 *
 * Architecture:
 * - ModalState: Simple state object with update/subscribe methods
 * - ExpansionManager: Main controller (skeleton with placeholders)
 * - Event Delegation: Efficient handling for 27+ product cards
 *
 * Future Expansion:
 * - Prompt 5: Animation methods (animateOpen/animateClose)
 * - Prompt 6: Content population (populateContent)
 * - Prompt 7: Variant management (VariantManager class)
 * - Prompt 8: Tier calculations (TierCalculator class)
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT: Simple Object with Explicit Updates
// ═══════════════════════════════════════════════════════════════════════

/**
 * ModalState - Centralized state management using simple object pattern
 *
 * Design Decision: Using simple object with explicit update methods instead
 * of Proxy for easier debugging and better browser compatibility.
 */
class ModalState {
  constructor() {
    // Core state properties
    this.data = {
      // Modal lifecycle
      isOpen: false,
      isAnimating: false,

      // Mode (from Theme Customizer)
      mode: window.bf25Config?.mode || 'power_packs',

      // Current product
      productId: null,
      currentCard: null,

      // Variant selection (populated in Prompt 7)
      selectedVariantId: null,
      selectedOptions: {},

      // Quantity
      quantity: 1,

      // Cart progress (populated in Prompt 11)
      cartItemCount: 0,           // Total items currently in cart
      cartItems: [],              // Cart line items array
      cartFetched: false,         // Whether cart has been fetched
      cartLastUpdated: null,      // Timestamp of last cart fetch

      // Tier calculations (with cart awareness)
      nextTier: null
    };

    // Listener callbacks for state changes
    this.listeners = [];

    // Debug logging
    if (window.bf25Config?.debug) {
      console.log('🎯 ModalState initialized:', this.data);
    }
  }

  /**
   * Update a single state property and notify listeners
   */
  update(key, value) {
    const oldValue = this.data[key];
    this.data[key] = value;

    if (window.bf25Config?.debug) {
      console.log(`📝 State updated: ${key}`, { from: oldValue, to: value });
    }

    // Notify all listeners
    this.notifyListeners(key, value, oldValue);
  }

  /**
   * Get a state property value
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Get all state data (for debugging)
   */
  getAll() {
    return { ...this.data };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners(key, newValue, oldValue) {
    this.listeners.forEach(callback => {
      try {
        callback(key, newValue, oldValue);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Reset state to defaults (used when closing modal)
   */
  reset() {
    this.data.isOpen = false;
    this.data.isAnimating = false;
    this.data.productId = null;
    this.data.currentCard = null;
    this.data.selectedVariantId = null;
    this.data.selectedOptions = {};
    this.data.quantity = 1;

    if (window.bf25Config?.debug) {
      console.log('🔄 State reset to defaults');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT MANAGEMENT (Prompt 7)
// ═══════════════════════════════════════════════════════════════════════

/**
 * VariantManager - Handles variant selection logic and UI
 *
 * Responsibilities:
 * - Parse variant options from data
 * - Generate variant selector UI
 * - Track user selections
 * - Find matching variant ID
 * - Update modal when variant changes
 */
class VariantManager {
  constructor(expansionManager) {
    this.manager = expansionManager;
    this.state = expansionManager.state;
    this.config = expansionManager.config;

    // Current product's variants
    this.variants = null;
    this.optionNames = []; // e.g., ["Color", "Capacity"]
    this.optionValues = {}; // e.g., { "Color": ["Black", "White"], "Capacity": ["10000mAh", "20000mAh"] }

    if (this.config.debug) {
      console.log('🎨 VariantManager initialized');
    }
  }

  /**
   * Initialize variant system for a product
   * Parses variant data and generates UI
   *
   * @param {string} productId - Product ID
   * @returns {string} HTML for variant selectors
   */
  initialize(productId) {
    this.variants = window.productVariants?.[productId];

    // Handle products with no variants or single variant
    if (!this.variants || this.variants.length === 0) {
      if (this.config.debug) {
        console.log('📦 No variants for product:', productId);
      }
      return '<div class="bf25-variant-none"></div>';
    }

    if (this.variants.length === 1) {
      // Single variant - no selection needed
      if (this.config.debug) {
        console.log('📦 Single variant product - auto-selecting');
      }
      this.selectVariant(this.variants[0].id);
      return '<div class="bf25-variant-single"></div>';
    }

    // Parse option structure
    this.parseOptions();

    // Set default selections (first option of each type)
    this.setDefaultSelections();

    // Generate UI
    return this.generateUI();
  }

  /**
   * Parse variant options to understand structure
   * Example: variants[0].options = ["Black", "10000mAh"]
   * Result: optionNames = ["Color", "Capacity"]
   *         optionValues = { "Color": ["Black", "White"], "Capacity": ["10000mAh", "20000mAh"] }
   */
  parseOptions() {
    if (!this.variants || this.variants.length === 0) return;

    // Determine number of option positions
    const firstVariant = this.variants[0];
    const optionCount = firstVariant.options.length;

    // Infer option names (Color, Capacity, etc.)
    // Note: Shopify doesn't provide option names in variant data,
    // so we'll use generic names or detect from values
    this.optionNames = this.inferOptionNames(optionCount);

    // Extract unique values for each option position
    this.optionValues = {};

    for (let i = 0; i < optionCount; i++) {
      const optionName = this.optionNames[i];
      const uniqueValues = new Set();

      this.variants.forEach(variant => {
        if (variant.options[i]) {
          uniqueValues.add(variant.options[i]);
        }
      });

      this.optionValues[optionName] = Array.from(uniqueValues);
    }

    if (this.config.debug) {
      console.log('🎨 Parsed Options:', {
        names: this.optionNames,
        values: this.optionValues
      });
    }
  }

  /**
   * Infer option names from option count and values
   *
   * @param {number} count - Number of options
   * @returns {Array} Option names
   */
  inferOptionNames(count) {
    // Check first variant's option values for hints
    const firstVariant = this.variants[0];
    const names = [];

    for (let i = 0; i < count; i++) {
      const value = firstVariant.options[i];

      // Detect color names
      if (this.isColorValue(value)) {
        names.push('Color');
      }
      // Detect capacity (mAh, ft, m, etc.)
      else if (/\d+(mAh|ft|m|cm|inch|in)/.test(value)) {
        names.push('Capacity');
      }
      // Detect length
      else if (/\d+\s*(ft|feet|m|meter|cm)/.test(value)) {
        names.push('Length');
      }
      // Generic fallback
      else {
        names.push(`Option ${i + 1}`);
      }
    }

    return names;
  }

  /**
   * Check if a value is likely a color
   */
  isColorValue(value) {
    const colorNames = [
      'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
      'purple', 'pink', 'gray', 'grey', 'brown', 'silver', 'gold'
    ];

    return colorNames.some(color =>
      value.toLowerCase().includes(color)
    );
  }

  /**
   * Set default selections (first option of each type)
   */
  setDefaultSelections() {
    const selections = {};

    this.optionNames.forEach(name => {
      selections[name] = this.optionValues[name][0];
    });

    this.state.update('selectedOptions', selections);

    // Find and select matching variant
    this.findAndSelectVariant();
  }

  /**
   * Generate variant selector UI HTML
   */
  generateUI() {
    let html = '<div class="bf25-variant-selectors">';

    this.optionNames.forEach(optionName => {
      const values = this.optionValues[optionName];
      const selectedValue = this.state.get('selectedOptions')[optionName];
      const isColor = optionName === 'Color';

      html += `
        <div class="bf25-variant-option-group">
          <label class="bf25-variant-label bf25-text-sm bf25-text-primary">
            <span class="bf25-variant-selected-value">${selectedValue}</span>
          </label>
          <div class="bf25-variant-options ${isColor ? 'bf25-variant-swatches' : 'bf25-variant-buttons'}">
      `;

      values.forEach(value => {
        const isSelected = value === selectedValue;
        const isAvailable = this.isOptionAvailable(optionName, value);

        html += this.generateOptionButton(optionName, value, isSelected, isAvailable, isColor);
      });

      html += `
          </div>
        </div>
      `;
    });

    html += '</div>';

    return html;
  }

  /**
   * Generate individual option button HTML
   */
  generateOptionButton(optionName, value, isSelected, isAvailable, isColor) {
    const classes = [
      'bf25-variant-option',
      isSelected ? 'is-selected' : '',
      !isAvailable ? 'is-disabled' : '',
      isColor ? 'bf25-variant-swatch' : 'bf25-variant-button'
    ].filter(Boolean).join(' ');

    const dataAttrs = `
      data-option-name="${optionName}"
      data-option-value="${value}"
    `;

    // For color swatches, try to detect hex color or use name
    let colorStyle = '';
    if (isColor) {
      const colorHex = this.getColorHex(value);
      if (colorHex) {
        colorStyle = `style="background-color: ${colorHex};"`;
      }
    }

    return `
      <button
        type="button"
        class="${classes}"
        ${dataAttrs}
        ${colorStyle}
        ${!isAvailable ? 'disabled' : ''}
        aria-pressed="${isSelected}"
        aria-label="${optionName}: ${value}"
      >
        ${!isColor ? value : ''}
        ${isColor ? `<span class="bf25-swatch-label">${value}</span>` : ''}
      </button>
    `;
  }

  // [Method continues beyond line 400...]
}

// [File continues...]
```

**Key Components:**
- ModalState class (simple state object with subscribe/update pattern)
- State properties (modal lifecycle, product data, variants, cart, tiers)
- VariantManager class (variant parsing, UI generation, option detection)
- Option inference logic (color detection, capacity detection, generic fallback)

---

## FILE 4: buy-now-popup-bf25.liquid (Complete)

**Location:** `snippets/buy-now-popup-bf25.liquid`
**Purpose:** White-background modal template for BF25 product quick-view

```liquid
{% assign first_upsell_product = all_products[upsell_product_one] %}
{% assign second_upsell_product = all_products[upsell_product_two] %}

<aside class="buy-now-popup fixed inset-0 bottom-0 left-0 right-0 top-0 z-[1000] bg-black bg-opacity-60 close-buy-now-popup" data-section="bf25" data-product-id="{{ product_id_attr }}">
    <div class="buy-now-popup__wrapper absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-[70vh] max-h-[860px] w-[80vw] max-w-[1280px] py-[70px] rounded-xl bg-[#fff]">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6948" width="32" height="32" class="close-buy-now-popup absolute right-[16px] top-[16px] z-[2] h-[25px] w-[25px] cursor-pointer fill-[#999]">
            <path d="M557.311759 513.248864l265.280473-263.904314c12.54369-12.480043 12.607338-32.704421 0.127295-45.248112-12.512727-12.576374-32.704421-12.607338-45.248112-0.127295L512.127295 467.904421 249.088241 204.063755c-12.447359-12.480043-32.704421-12.54369-45.248112-0.063647-12.512727 12.480043-12.54369 32.735385-0.063647 45.280796l262.975407 263.775299-265.151458 263.744335c-12.54369 12.480043-12.607338 32.704421-0.127295 45.248112 6.239161 6.271845 14.463432 9.440452 22.687703 9.440452 8.160624 0 16.319527-3.103239 22.560409-9.311437l265.216826-263.807983 265.440452 266.240344c6.239161 6.271845 14.432469 9.407768 22.65674 9.407768 8.191587 0 16.352211-3.135923 22.591372-9.34412 12.512727-12.480043 12.54369-32.704421 0.063647-45.248112L557.311759 513.248864z" p-id="6949"></path>
        </svg>
        <div class="buy-now-popup__product-body flex h-full px-[70px] overflow-y-auto">
            <figure class="max-h-[432px] h-full w-[47%] mr-[5%] relative">
                {% if badge_text %}
                  <div class="absolute left-[10px] top-[10px]">
                    <div class="discount_message relative flex bg-[#60c655] rounded-tl-[20px] md:text-[18px] text-[14px] color-white p-[6px] font-bold pr-[10px]">
                      <div>{{ badge_text }}</div>
                      <div class="absolute right-[-25px] md:right-[-40px] md:w-[60px] w-[40px] md:top-[-15px] top-[-8px]"><img width="100" height="auto" src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/lightning_bolt.png?v=1730972558"></div>
                    </div>
                  </div>
                {% endif %}
                <img src="{{ product_image | img_url: 'master' }}" alt="{{product_image.alt}}" height="432" width="432" class="h-full w-full object-cover js-variant-image"/>
            </figure>
            <div class="buy-now-popup__content flex-1">
                <a href="{{ product.url }}" class="text-[21px] pb-[6px] border-b border-solid border-[#e5e5e5] leading-[1.2] font-bold color-black">{{ title }}</a>
                <div class="flex items-center mt-[12px]">
                    <span class="mr-[8px] text-[21px] text-[#60c655] font-bold js-variant-price">{{ price | money }}</span> <span class="crossed text-[#999] js-variant-compare-price">{{ compare_at_price | money }}</span>
                </div>
                {% if description != blank %}
                    <div class="buy-now-popup__description pb-[24px] overflow-hidden">
                        <div class="buy-now-popup__description-inner h-[100px] with-gradient overflow-hidden">
                            <div>{{ description }}</div>
                        </div>
                        <p class="buy-now-popup__expand-desc text-black text-[16px] pt-[14px] pointer flex items-center gap-[6px] color-[#60c655] color-titan-green">
                           <span> Learn More</span>
                            <svg class="text-black w-[16px] h-[16px]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5772" width="32" height="32">
                                <path d="M225.408 368.384L496 640.641l270.592-272.257-48.64-49.024L496 542.592 274.176 319.36l-48.768 49.024z m0 0z" fill="#60c655" p-id="5773"></path>
                            </svg>
                        </p>
                    </div>
                {% endif %}
                {% if product.variants.size > 1 %}
                  <!-- Visual Variant Selectors (BOGO-VARIANT-SWATCHES-020) -->
                  <div class="variant-selectors-visual">
                    {% for option in product.options_with_values %}
                      {% if option.name != 'Title' or option.values[0] != 'Default Title' %}
                        <div class="variant-option-group">
                          <label class="variant-option-label">{{ option.name }}:</label>

                          {% assign option_lower = option.name | downcase %}
                          {% if option_lower contains 'color' or option_lower contains 'colour' %}
                            <!-- Color Swatches -->
                            <div class="variant-swatches" data-option-index="{{ forloop.index }}">
                              {% for value in option.values %}
                                {% assign color_slug = value | downcase | replace: ' ', '' %}
                                <div class="variant-swatch {% if forloop.first %}selected{% endif %}"
                                     data-value="{{ value }}"
                                     data-color="{{ color_slug }}"
                                     title="{{ value }}"
                                     onclick="selectVariantSwatch(this, {{ forloop.index }})">
                                </div>
                              {% endfor %}
                            </div>

                          {% else %}
                            <!-- Size/Length Buttons -->
                            <div class="variant-buttons" data-option-index="{{ forloop.index }}">
                              {% for value in option.values %}
                                <button class="variant-button {% if forloop.first %}selected{% endif %}"
                                        data-value="{{ value }}"
                                        type="button"
                                        onclick="selectVariantButton(this, {{ forloop.index }})">
                                  {{ value }}
                                </button>
                              {% endfor %}
                            </div>

                          {% endif %}
                        </div>
                      {% endif %}
                    {% endfor %}
                  </div>

                  <!-- Hidden fallback selects for compatibility -->
                  <div class="variant-selectors-fallback">
                    {% for option in product.options_with_values %}
                      {% if option.name != 'Title' or option.values[0] != 'Default Title' %}
                        <select class="variant-selector" data-option-index="{{ forloop.index }}">
                          {% for value in option.values %}
                            <option value="{{ value }}">{{ value }}</option>
                          {% endfor %}
                        </select>
                      {% endif %}
                    {% endfor %}
                  </div>
                {% endif %}
                {% if grid_1 %}
                  <div class="grid-images flex gap-[10px] mb-[20px] cursor-pointer md:max-w-[100%]">
                      <div data-image-qty="{{ grid_1_text }}" class="grid-images__single js-grid-image w-[33%]">
                          <img class="w-full" width="100" height="auto" src="{{ grid_1 | img_url: 'master' }}" alt="">
                      </div>
                      <div data-image-qty="{{ grid_2_text }}" class="grid-images__single js-grid-image w-[33%]">
                        <img class="w-full" width="100" height="auto" src="{{ grid_2 | img_url: 'master' }}" alt="">
                    </div>
                    <div data-image-qty="{{ grid_3_text }}" class="grid-images__single js-grid-image w-[33%]">
                      <img class="w-full" width="100" height="auto" src="{{ grid_3 | img_url: 'master' }}" alt="">
                  </div>
                  </div>
                {% endif %}
                <div class="buy-now-popup__quantity">
                    <h4 class="text-[16px] font-semibold">Quantity</h4>
                    <div class="buy-now-popup__quantity mt-[8px] mb-[24px] flex items-center gap-[20px]">
                        <quantity-input class="quantity cart-quantity">
                            <button class="quantity__button" name="minus" type="button">
                              {% render 'icon-minus' %}
                            </button>
                            <input
                              class="quantity__input"
                              type="number"
                              value="1"
                              min="1"
                            >
                            <button class="quantity__button" name="plus" type="button">
                              {% render 'icon-plus' %}
                            </button>
                          </quantity-input>
                          {% if grid_1 %}
                            <div data-count="4" class="js-buy-more">
                              Add 4 Save 55%
                            </div>
                          {% endif %}
                    </div>
                </div>

                {% if upsell_product_one or upsell_product_two %}
                    <div class="buy-now-popup__upsell">
                      <h4 class="text-[16px] font-semibold">You May Also Like:</h4>
                      <div class="mt-[10px]">
                        {% if upsell_product_one %}
                          <div class="mb-4 last:mb-0">
                            <div data-product-id="{{first_upsell_product.selected_or_first_available_variant.id}}"
                                class="js-upsell-selector buy-now-popup__upsell-box relative flex items-center py-[20px] pr-[16px] pl-[50px] border-2 border-[#ddd] cursor-pointer mb-[2px] rounded-[6px] box-border">
                              <label class="buy-now-popup__checkbox">
                                <input type="checkbox" />
                                <span class="custom-checkbox"></span>
                              </label>
                              <figure class="relative mr-[16px]">
                                <img src="{{ first_upsell_product.featured_image | img_url: 'master' }}" alt="{{first_upsell_product.title}}" height="60" width="60" class="h-[60px] w-[60px] object-contain"/>
                              </figure>
                              <div class="w-full">
                                <h4 class="mt-[4px] text-[16px] font-medium text-[#000] mb-[6px] leading-[1]">{{ first_upsell_product.title }}</h4>
                                <div class="flex w-full flex-wrap items-center justify-between">
                                  <div class="flex items-center flex-wrap">
                                    <div class="font-semibold mr-[6px] text-[#000] leading-[1]">{{ first_upsell_product.price | money }}</div>
                                    {% if first_upsell_product.compare_at_price != blank %}
                                        <div class="text-[14px] font-semibold text-[#777777] line-through">{{ first_upsell_product.compare_at_price | money }}</div>
                                    {% endif %}
                                    {% if first_upsell_product.compare_at_price > first_upsell_product.price  %}
                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
                                        Save {{ first_upsell_product.compare_at_price | minus: first_upsell_product.price | money }}
                                      </div>
                                    {% endif %}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {% endif %}
                        {% if upsell_product_two %}
                          <div class="mb-4 last:mb-0">
                            <div data-product-id="{{second_upsell_product.selected_or_first_available_variant.id}}"
                                class="js-upsell-selector buy-now-popup__upsell-box relative flex items-center py-[20px] pr-[16px] pl-[50px] border-2 border-[#ddd] cursor-pointer rounded-[6px] box-border">
                              <label class="buy-now-popup__checkbox">
                                <input type="checkbox" />
                                <span class="custom-checkbox"></span>
                              </label>
                              <figure class="relative mr-[16px]">
                                <img src="{{ second_upsell_product.featured_image | img_url: 'master' }}" alt="{{second_upsell_product.title}}" height="60" width="60" class="h-[60px] w-[60px] object-contain"/>
                              </figure>
                              <div class="w-full">
                                <h4 class="mt-[4px] text-[16px] font-medium text-[#000] mb-[6px] leading-[1]">{{ second_upsell_product.title }}</h4>
                                <div class="flex w-full flex-wrap items-center justify-between">
                                  <div class="flex items-center flex-wrap">
                                    <div class="font-semibold mr-[6px] text-[#000] leading-[1]">{{ second_upsell_product.price | money }}</div>
                                    {% if second_upsell_product.compare_at_price != blank %}
                                        <div class="text-[14px] font-semibold text-[#777777] line-through">{{ second_upsell_product.compare_at_price | money }}</div>
                                    {% endif %}
                                    {% if second_upsell_product.compare_at_price > second_upsell_product.price %}
                                      <div class="ml-1 flex-none text-[10px] font-medium titan-red">
                                        Save {{ second_upsell_product.compare_at_price | minus: second_upsell_product.price | money }}
                                      </div>
                                    {% endif %}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        {% endif %}
                      </div>
                    </div>
                {% endif %}
            </div>
        </div>
        <div class="buy-now-popup__footer absolute bg-white bottom-0 left-0 z-[1] flex items-center rounded-b-[20px] justify-end w-full p-[13px_72px] shadow-[0_-4px_8px_rgba(0,_0,_0,_0.08)]">
            <div class="buy-now-popup__price mr-[20px] text-right flex items-center">
                <span class="mr-[8px] text-[21px] text-[#60c655] font-bold js-variant-price-2">{{ price | money }}</span>
                <span class="text-[#999] font-medium text-[16px] crossed js-variant-compare-price-2">{{ compare_at_price | money }}</span>
            </div>
            <div class="flex items-center justify-end gap-[10px]">
                <button data-product-id="{{ product_id}}" data-quantity="{{ quantity }}"
                    class="js-atc-bf buy-now-popup__atc min-w-[200px] h-[46px] bg-[#60c655]  text-[16px] text-white font-semibold rounded-[20px] leading-[46px]"
                >
                    Add To Cart
                </button>
                <button data-product-id="{{ product_id}}"
                    class="absolute left-[-40000px] js-checkout js-atc-bf buy-now-popup__atc min-w-[200px] h-[46px] bg-[#60c655]  text-[16px] text-white font-semibold rounded-[20px] leading-[46px]">
                    Buy Now
                </button>
            </div>
        </div>
    </div>
</aside>
```

**Key Features:**
- White background (`bg-[#fff]`) with rounded corners
- Centered modal (50/50 translate positioning)
- Z-index: 1000 (overlay)
- 70vh height, max 860px
- 80vw width, max 1280px
- 47/53 split (image left, content right)
- Visual variant selectors (color swatches + size buttons)
- Hidden fallback selects for compatibility
- Quantity input with +/- buttons
- Upsell products with checkboxes
- Sticky footer with pricing and CTA
- Data attribute: `data-section="bf25"` for scoping

---

## ARCHITECTURE SUMMARY

### Component Relationships

```
BF25 Bundle Builder Architecture
├── Sticky Cart (bf25-tier-cart.js)
│   ├── CartManager (tier calculation, gift unlocking)
│   ├── PerformanceMonitor (FPS, operation timing, jank)
│   └── ToastManager (notifications, max 3 toasts)
│
├── Modal System
│   ├── Click Handlers (section-bundle-builder-bf25.js)
│   │   └── Product ID matching
│   ├── Core Architecture (bf25-expansion-core.js)
│   │   ├── ModalState (state management)
│   │   └── VariantManager (variant UI, option inference)
│   └── Modal Template (buy-now-popup-bf25.liquid)
│       ├── Visual variant selectors
│       ├── Upsell products
│       └── Sticky footer CTA
│
└── Data Flow
    ├── Product cards → data-product-id → Modal match
    ├── ModalState → Listeners → UI updates
    └── Cart API → CartManager → Tier updates
```

### Key Patterns

1. **Singleton Pattern**: PerformanceMonitor, ToastManager use singleton instances
2. **Observer Pattern**: ModalState uses subscribe/notify for state changes
3. **Product ID Matching**: Cards and modals linked via `data-product-id` attribute
4. **Section Scoping**: BF25-specific elements use `data-section="bf25"` to avoid conflicts
5. **Fallback Variant Selectors**: Visual swatches + hidden `<select>` for compatibility
6. **Z-Index Management**: Modal at 1000, forced override to 1000000 in JS
7. **Body Scroll Lock**: `overflow: hidden` + `modal-open` class during modal open

---

## TESTING COMMANDS

```bash
# Check BF25 console logs
# Open browser console on BF25 page, filter for:
# - "BF25 Modal opened"
# - "[Performance]"
# - "[ToastManager]"
# - "🎯 ModalState initialized"

# Test modal system
# 1. Click product card → Modal should open
# 2. Check data-product-id matches between card and modal
# 3. Test variant selection → Price should update
# 4. Test close button + overlay click
# 5. Verify body scroll lock

# Test performance monitor
window.BF25Performance.report()
# Should show FPS, operations, jank stats

# Test state management
window.modalState?.getAll()
# Should show current modal state
```

---

**End of Extraction Set 1**
Generated: 2025-11-24
Total: 4 files extracted (bf25-tier-cart.js, section-bundle-builder-bf25.js, bf25-expansion-core.js, buy-now-popup-bf25.liquid)
