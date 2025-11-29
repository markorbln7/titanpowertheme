/**
 * BF25 Tier-Based Sticky Cart - CartManager
 * Version: 1.0
 * Purpose: Manage cart state, tier progression, and UI updates
 */

(function() {
  'use strict';

  // ============================================
  // BF25 CROSS-PAGE REBUY PROTECTION
  // Runs on every page (including checkout)
  // Replicated from BOGO Builder pattern
  // ============================================
  (function preventRebuyInterference() {
    const isBF25Checkout = sessionStorage.getItem('bf25-direct-checkout');

    if (isBF25Checkout === 'true') {
      console.log('%c[BF25] 🛡️ Direct checkout detected - preventing cart drawer',
                  'color: #60c655; font-weight: bold;');

      // Clear the flag (one-time use)
      sessionStorage.removeItem('bf25-direct-checkout');

      // Disable Rebuy SmartCart methods
      if (window.Rebuy) {
        console.log('[BF25] Disabling Rebuy cart drawer...');
        if (window.Rebuy.SmartCart) {
          window.Rebuy.SmartCart.close = function() {};
          window.Rebuy.SmartCart.open = function() {};
        }
      }

      // Prevent cart drawer opens for 2 seconds
      let preventCartDrawer = true;
      setTimeout(() => { preventCartDrawer = false; }, 2000);

      // Intercept drawer open attempts (capture phase)
      document.addEventListener('rebuy:cart.open', function(e) {
        if (preventCartDrawer) {
          console.log('[BF25] Prevented Rebuy cart drawer from opening');
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);

      // Also block the alternate event name
      document.addEventListener('rebuy:cart-open', function(e) {
        if (preventCartDrawer) {
          console.log('[BF25] Prevented Rebuy cart-open event');
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);
    }
  })();

  // ============================================
  // GIFT VARIANT IDs (Source of Truth)
  // Now defined in inline script (sections/bf25-tier-cart.liquid)
  // This is a fallback with legacy format
  // ============================================
  const GIFT_VARIANT_MAP = window.GIFT_VARIANT_MAP || {
    CABLE: 46748253520050,     // titan-100w-4-in-1-free (Tier 1+)
    CASE: 44929561526450,      // travel-case-free (Tier 2+)
    MAGNETIC: 45338148798642,  // magnetic-cable-free (Tier 3+)
    MYSTERY: 46748228190386    // mystery-gift-free (Tier 4)
  };

  // ============================================
  // TIER CONFIGURATION
  // Core config now in window.BF25_TIERS (from inline script)
  // This extends it with UI-specific properties (colors, glows, etc.)
  // ============================================
  const BF25_TIERS = window.BF25_TIERS || [
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
      gifts: [
        { variantId: GIFT_VARIANT_MAP.CABLE, name: "Cable", emoji: "🔌", value: 30 }
      ]
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
        { variantId: GIFT_VARIANT_MAP.CABLE, name: "Cable", emoji: "🔌", value: 30 },
        { variantId: GIFT_VARIANT_MAP.CASE, name: "Case", emoji: "📦", value: 35 }
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
        { variantId: GIFT_VARIANT_MAP.CABLE, name: "Cable", emoji: "🔌", value: 30 },
        { variantId: GIFT_VARIANT_MAP.CASE, name: "Case", emoji: "📦", value: 35 },
        { variantId: GIFT_VARIANT_MAP.MAGNETIC, name: "Magnetic Set", emoji: "🧲", value: 60 }
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
        { variantId: GIFT_VARIANT_MAP.CABLE, name: "Cable", emoji: "🔌", value: 30 },
        { variantId: GIFT_VARIANT_MAP.CASE, name: "Case", emoji: "📦", value: 35 },
        { variantId: GIFT_VARIANT_MAP.MAGNETIC, name: "Magnetic Set", emoji: "🧲", value: 60 },
        { variantId: GIFT_VARIANT_MAP.MYSTERY, name: "Mystery Box", emoji: "🎁", value: 150 }
      ]
    }
  ];

  // ============================================
  // CURRENCY HELPER
  // Get currency symbol dynamically
  // ============================================
  const getCurrencySymbol = (cartData = null) => {
    // If cart data is provided, use its currency
    if (cartData && cartData.currency) {
      const currencyCode = cartData.currency;
      const symbolMap = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': '$', 'AUD': '$',
        'JPY': '¥', 'CNY': '¥', 'RSD': 'RSD', 'CHF': 'CHF', 'SEK': 'kr',
        'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft'
      };
      if (symbolMap[currencyCode]) {
        return symbolMap[currencyCode];
      }
      return currencyCode + ' ';
    }
    
    // Try BOGOCurrency first (if available)
    if (typeof BOGOCurrency !== 'undefined' && BOGOCurrency.getCurrencySymbol) {
      return BOGOCurrency.getCurrencySymbol();
    }
    
    // Try Shopify currency symbol
    if (window.Shopify?.currency?.symbol) {
      return window.Shopify.currency.symbol;
    }
    
    // Try Shopify currency active code
    if (window.Shopify?.currency?.active) {
      const currencyCode = window.Shopify.currency.active;
      const symbolMap = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'CAD': '$', 'AUD': '$',
        'JPY': '¥', 'CNY': '¥', 'RSD': 'RSD', 'CHF': 'CHF', 'SEK': 'kr',
        'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft'
      };
      if (symbolMap[currencyCode]) {
        return symbolMap[currencyCode];
      }
    }
    
    // Try cart currency
    if (window.cart?.currency?.symbol) {
      return window.cart.currency.symbol;
    }
    
    // Fallback to EUR
    return '€';
  };

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
      this.maxToasts = 1; // Only show 1 toast at a time
      this.defaultDuration = 2000; // 2 seconds
      this.toastIdCounter = 0;

      // Queue for sequential toast display
      this.queue = [];
      this.isProcessingQueue = false;

      // Pause state (for celebration coordination) - BF25-8.3
      this.isPaused = false;
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

      // Queue if paused OR already showing max toasts (BF25-8.3)
      if (this.isPaused || this.activeToasts.length >= this.maxToasts) {
        console.log('[ToastManager] Queuing toast:', message);
        this.queue.push({ message, options });
        return null;
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

      // Auto-dismiss after duration, then process queue
      const timeoutId = setTimeout(() => {
        this.dismiss(toast);
        // Process next queued toast after a small delay
        setTimeout(() => this.processQueue(), 300);
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
        const secondaryP = document.createElement('p');
        secondaryP.className = 'bf25sc-toast__secondary';
        secondaryP.innerHTML = config.secondary; // Allow HTML for <strong> tags
        contentDiv.appendChild(secondaryP);
      }

      toast.appendChild(iconSpan);
      toast.appendChild(contentDiv);

      if (config.dismissible) {
        const dismissBtn = document.createElement('button');
        dismissBtn.type = 'button';
        dismissBtn.className = 'bf25sc-toast__dismiss';
        dismissBtn.setAttribute('aria-label', 'Dismiss notification');
        dismissBtn.innerHTML = '&times;';
        dismissBtn.addEventListener('click', () => {
          this.dismiss(toast);
        });
        toast.appendChild(dismissBtn);
      }

      return toast;
    }

    /**
     * Dismiss a toast notification
     * @param {HTMLElement} toast - Toast element to dismiss
     */
    dismiss(toast) {
      if (!toast || !toast.parentElement) return;

      const toastData = this.activeToasts.find(t => t.element === toast);

      if (toastData) {
        // Clear auto-dismiss timeout
        if (toastData.timeoutId) {
          clearTimeout(toastData.timeoutId);
        }

        // Remove from tracking
        this.activeToasts = this.activeToasts.filter(t => t.element !== toast);
      }

      // Trigger fade-out animation
      toast.classList.add('is-dismissed');
      toast.classList.remove('is-visible');

      // Remove from DOM after animation
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 200); // Match CSS transition duration

      console.log('[ToastManager] Toast dismissed');
    }

    /**
     * Process queued toasts sequentially
     */
    processQueue() {
      if (this.queue.length === 0) {
        return;
      }

      // Only process if no active toasts AND not paused (BF25-8.3)
      if (this.activeToasts.length > 0 || this.isPaused) {
        return;
      }

      const next = this.queue.shift();
      console.log('[ToastManager] Processing queued toast:', next.message);
      this.show(next.message, next.options);
    }

    /**
     * Pause toast display (for celebration coordination) - BF25-8.3
     */
    pause() {
      this.isPaused = true;
      console.log('[ToastManager] Paused (celebration in progress)');
    }

    /**
     * Resume toast display and process queue - BF25-8.3
     */
    resume() {
      this.isPaused = false;
      console.log('[ToastManager] Resumed');
      // Process any queued toasts
      this.processQueue();
    }

    /**
     * Dismiss all active toasts
     */
    dismissAll() {
      const toasts = [...this.activeToasts];
      toasts.forEach(t => this.dismiss(t.element));
      console.log('[ToastManager] All toasts dismissed');
    }
  }

  // Initialize global toast manager
  window.BF25Toast = new ToastManager();

  // ============================================
  // GIFT ANIMATOR CLASS
  // ============================================
  class GiftAnimator {
    constructor() {
      this.queue = new Set();
      this.isAnimating = false;
      this.celebratedTiers = this.loadCelebratedTiers();
    }

    /**
     * Load celebrated tiers from sessionStorage
     */
    loadCelebratedTiers() {
      try {
        const stored = sessionStorage.getItem('bf25_celebrated_tiers');
        return new Set(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.warn('[GiftAnimator] Failed to load celebrated tiers:', error);
        return new Set();
      }
    }

    /**
     * Save celebrated tiers to sessionStorage
     */
    saveCelebratedTiers() {
      try {
        sessionStorage.setItem(
          'bf25_celebrated_tiers',
          JSON.stringify(Array.from(this.celebratedTiers))
        );
      } catch (error) {
        console.warn('[GiftAnimator] Failed to save celebrated tiers:', error);
      }
    }

    /**
     * Add tier to animation queue
     */
    animate(tier) {
      // Skip if already celebrated this session (BF25-8.3: check early)
      if (this.celebratedTiers.has(tier)) {
        console.log(`[GiftAnimator] Tier ${tier} already celebrated (skipping queue)`);
        return;
      }

      // Mark as celebrated IMMEDIATELY (before queue) to prevent duplicates - BF25-8.3
      this.celebratedTiers.add(tier);
      this.saveCelebratedTiers();

      console.log(`[GiftAnimator] Queueing tier ${tier} for animation`);
      this.queue.add(tier);

      // Log multi-tier queue detection
      if (this.queue.size > 1) {
        console.log(`[GiftAnimator] Multi-tier queue detected: ${Array.from(this.queue).sort().join(', ')}`);
      }

      if (!this.isAnimating) {
        this.processQueue();
      }
    }

    /**
     * Process animation queue with staged reveal (0.3s stagger)
     */
    async processQueue() {
      if (this.queue.size === 0) {
        this.isAnimating = false;
        return;
      }

      console.log(`[GiftAnimator] Processing queue with ${this.queue.size} tier(s)`);

      // CRITICAL: Get ALL tiers in queue, sorted ascending (Tier 1, 2, 3, 4)
      const tiersToAnimate = Array.from(this.queue).sort((a, b) => a - b);
      this.queue.clear();

      this.isAnimating = true;

      // Performance monitoring
      console.time('[GiftAnimator] Multi-tier sequence');
      console.log(`[GiftAnimator] Staged Reveal: ${tiersToAnimate.length} tier(s) - ${tiersToAnimate.join(', ')}`);

      // Calculate total duration for user feedback
      const totalDuration = 1.8 + ((tiersToAnimate.length - 1) * 0.3);
      console.log(`[GiftAnimator] Expected completion: ${totalDuration.toFixed(1)}s`);

      try {
        // STAGED REVEAL: Launch animations with 0.3s stagger
        const animationPromises = tiersToAnimate.map((tier, index) => {
          const staggerDelay = index * 300; // 0ms, 300ms, 600ms, 900ms...

          return new Promise((resolve) => {
            setTimeout(async () => {
              console.log(`[GiftAnimator] Starting tier ${tier} animation (stagger: ${staggerDelay}ms)`);

              try {
                await this.executeSequence(tier);
                // Already marked in animate() - BF25-8.3
                console.log(`[GiftAnimator] ✓ Tier ${tier} complete`);
                resolve();
              } catch (error) {
                console.error(`[GiftAnimator] ✗ Tier ${tier} failed:`, error);
                resolve(); // Don't block other animations
              }
            }, staggerDelay);
          });
        });

        // Wait for ALL animations to complete
        await Promise.all(animationPromises);

        // Save celebrated tiers after all complete
        this.saveCelebratedTiers();

        console.timeEnd('[GiftAnimator] Multi-tier sequence');
        console.log(`[GiftAnimator] ✓ Staged Reveal complete - ${tiersToAnimate.length} tier(s) animated`);

      } catch (error) {
        console.error('[GiftAnimator] Staged Reveal error:', error);
      }

      this.isAnimating = false;

      // Process any new unlocks that were queued during animation
      if (this.queue.size > 0) {
        console.log('[GiftAnimator] Processing additional queued tiers...');
        this.processQueue();
      }
    }

    /**
     * Execute premium gift unlock animation sequence
     * Uses CSS-driven animations from Prompt 6.1
     *
     * Timeline:
     * 0-600ms: Shake → Burst (CSS keyframe: bf25GiftUnlockBurst)
     * 300ms: Trigger electric sparks
     * 500-3500ms: Product bubble visible (CSS keyframe: bf25BubbleSequence)
     * 3500ms+: Sustained glow pulse
     */
    async executeSequence(tier) {
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (!slot) {
        console.error(`[GiftAnimator] No slot found for tier ${tier}`);
        return;
      }

      // Prevent re-triggering if animation is actively running
      if (slot.classList.contains('is-celebrating')) {
        console.log(`[GiftAnimator] Tier ${tier} already animating, skipping`);
        return;
      }

      // Simplified performance tracking (BF25-8.4 - removed FPS overhead)
      const startTime = performance.now();
      console.log(`[GiftAnimator] 🎁 Starting celebration for Tier ${tier}`);

      // ─────────────────────────────────────────────────────────────────
      // STEP 1: Populate product bubble with gift data
      // ─────────────────────────────────────────────────────────────────
      this.populateProductBubble(slot);

      // ─────────────────────────────────────────────────────────────────
      // STEP 2: Trigger CSS animation sequence (simplified - BF25-8.4)
      // Adding .is-celebrating triggers bf25GiftUnlockBurst (0.6s)
      // ─────────────────────────────────────────────────────────────────
      slot.classList.add('is-celebrating');
      slot.dataset.state = 'claimed';

      // ─────────────────────────────────────────────────────────────────
      // STEP 3: Simplified effects (BF25-8.4 - reduced complexity)
      // ─────────────────────────────────────────────────────────────────

      // Electric sparks at burst peak
      setTimeout(() => {
        this.triggerElectricSparks(slot, tier);
      }, 300);

      // Confetti for Tier 4 MAX celebration
      if (tier === 4) {
        setTimeout(() => {
          this.triggerConfetti(tier, checkpoint);
        }, 400);
      }

      // Accessibility announcement
      this.announceGift(tier);

      // ─────────────────────────────────────────────────────────────────
      // STEP 4: Cleanup after animation (600ms - BF25-8.4 simplified)
      // ─────────────────────────────────────────────────────────────────
      await this.wait(600);

      slot.classList.remove('is-celebrating');

      // Remove will-change after animation complete (BF25-8.4 performance)
      const wrapper = slot.querySelector('.bf25sc-gift-icon-wrapper');
      if (wrapper) {
        wrapper.style.willChange = 'auto';
      }

      // Performance tracking complete (BF25-8.4 - simplified)
      const duration = performance.now() - startTime;
      console.log(`[GiftAnimator] ✓ Tier ${tier} complete in ${duration.toFixed(0)}ms`);
    }

    /**
     * Populate the product bubble with gift data from slot attributes
     */
    populateProductBubble(slot) {
      const bubble = slot.querySelector('.bf25sc-product-bubble');
      if (!bubble) return;

      const name = slot.dataset.productName;
      const image = slot.dataset.productImage;

      const titleEl = bubble.querySelector('.bf25sc-bubble-title');
      if (titleEl && name) {
        titleEl.textContent = name;
      }

      const imgEl = bubble.querySelector('.bf25sc-bubble-image');
      if (imgEl && image) {
        imgEl.src = image;
        imgEl.alt = name || 'Free Gift';
      }
    }

    /**
     * Trigger electric spark particle effect (GPU-optimized)
     * Particles burst outward from the gift icon
     */
    triggerElectricSparks(slot, tier) {
      const container = slot.querySelector('.bf25sc-particle-container');
      if (!container) return;

      // Intensity scales with tier
      const sparkCounts = { 1: 12, 2: 18, 3: 25, 4: 40 };
      const sparkCount = sparkCounts[tier] || 12;
      const maxDistance = 30 + (tier * 8);

      // Get tier color for sparks
      const tierColor = getComputedStyle(slot).getPropertyValue('--bf25sc-tier-color') || '#60c655';

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'bf25sc-spark';

        // Random angle and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * maxDistance;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotation = (angle * 180 / Math.PI) + 90;

        // Set CSS custom properties for animation
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.setProperty('--rotation', `${rotation}deg`);
        spark.style.setProperty('--spark-color', tierColor);

        // Stagger start times for more natural effect
        spark.style.animationDelay = `${Math.random() * 100}ms`;

        container.appendChild(spark);
      }

      // Cleanup after animation (800ms)
      setTimeout(() => {
        container.innerHTML = '';
      }, 900);

      console.log(`[GiftAnimator] ⚡ ${sparkCount} sparks triggered for Tier ${tier}`);
    }

    /**
     * Trigger confetti burst
     */
    triggerConfetti(tier, checkpoint) {
      if (!window.BF25Confetti) {
        console.warn('[GiftAnimator] ConfettiSystem not initialized');
        return;
      }

      // Get trigger position
      const position = window.BF25Confetti.getTriggerPosition(checkpoint);
      if (!position) return;

      // Fire confetti
      window.BF25Confetti.burst(position.x, position.y, tier);
      console.log(`[GiftAnimator] Confetti triggered for tier ${tier}`);
    }

    /**
     * Get checkpoint value for tier
     */
    getCheckpointForTier(tier) {
      const checkpoints = { 1: 4, 2: 8, 3: 12, 4: 16 };
      return checkpoints[tier] || 4;
    }

    /**
     * Announce gift unlock to screen readers
     */
    announceGift(tier) {
      const tierData = BF25_TIERS.find(t => t.id === tier);
      if (!tierData) return;

      const announcer = document.getElementById('bf25sc-cart-announcements');
      if (announcer) {
        const lastGift = tierData.gifts[tierData.gifts.length - 1];
        const message = `Congratulations! ${tierData.badge} unlocked. Free ${lastGift.name} added to your cart.`;
        announcer.textContent = message;
        console.log(`[GiftAnimator] Announced: ${message}`);
      }
    }

    /**
     * Helper: Wait for duration
     */
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Reset celebrations (for testing)
     */
    reset() {
      this.celebratedTiers.clear();
      sessionStorage.removeItem('bf25_celebrated_tiers');
      console.log('[GiftAnimator] Celebrations reset');
    }
  }

  // ============================================
  // CONFETTI SYSTEM CLASS
  // ============================================
  class ConfettiSystem {
    constructor() {
      this.container = document.getElementById('bf25sc-confetti-container');
      this.pool = [];
      this.activeParticles = [];
      this.maxPoolSize = 20;

      // Detect device capabilities
      this.particleCount = this.getOptimalParticleCount();

      // Initialize pool
      this.initializePool();

      console.log(`[ConfettiSystem] Initialized with ${this.particleCount} particles`);
    }

    /**
     * Detect optimal particle count based on device
     */
    getOptimalParticleCount() {
      // Check for user preferences
      if (this.shouldReduceMotion()) {
        return 0; // No confetti for reduced motion
      }

      // Check network conditions
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const slowNetwork = connection && /2g|3g|slow-2g/.test(connection.effectiveType);
      const saveData = connection && connection.saveData;

      // Check CPU cores (proxy for device capability)
      const cores = navigator.hardwareConcurrency || 4;
      const lowPower = cores < 4;

      // Adaptive count
      if (saveData || slowNetwork || lowPower) {
        return 8; // Reduced for low-end devices
      }

      return 15; // Full count for capable devices
    }

    /**
     * Check if reduced motion is preferred
     */
    shouldReduceMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Initialize particle pool
     */
    initializePool() {
      if (!this.container || this.particleCount === 0) return;

      for (let i = 0; i < this.maxPoolSize; i++) {
        const particle = this.createParticle();
        particle.style.display = 'none';
        this.container.appendChild(particle);
        this.pool.push(particle);
      }

      console.log(`[ConfettiSystem] Pool initialized: ${this.pool.length} particles`);
    }

    /**
     * Create a single particle element
     */
    createParticle() {
      const particle = document.createElement('div');
      particle.className = 'bf25sc-confetti-particle';
      return particle;
    }

    /**
     * Get particle from pool
     */
    getParticle() {
      if (this.pool.length === 0) {
        console.warn('[ConfettiSystem] Pool exhausted, creating new particle');
        const particle = this.createParticle();
        this.container.appendChild(particle);
        return particle;
      }
      return this.pool.pop();
    }

    /**
     * Return particle to pool
     */
    returnParticle(particle) {
      particle.style.display = 'none';
      particle.style.opacity = '0';
      particle.removeAttribute('data-variant');
      particle.className = 'bf25sc-confetti-particle';

      // Remove from active list
      const index = this.activeParticles.indexOf(particle);
      if (index > -1) {
        this.activeParticles.splice(index, 1);
      }

      this.pool.push(particle);
    }

    /**
     * Fire confetti burst
     */
    burst(x, y, tier) {
      if (!this.container || this.particleCount === 0) {
        console.log('[ConfettiSystem] Skipped (reduced motion or no container)');
        return;
      }

      console.log(`[ConfettiSystem] Bursting ${this.particleCount} particles at (${x}, ${y}) for tier ${tier}`);

      for (let i = 0; i < this.particleCount; i++) {
        setTimeout(() => {
          this.createAndAnimateParticle(x, y, tier);
        }, i * 50); // Stagger by 50ms for smoother burst
      }
    }

    /**
     * Create and animate a single particle
     */
    createAndAnimateParticle(x, y, tier) {
      const particle = this.getParticle();
      if (!particle) return;

      // Random shape
      const shapes = ['square', 'circle', 'triangle'];
      const weights = [0.4, 0.35, 0.25]; // 40% square, 35% circle, 25% triangle
      const shape = this.weightedRandom(shapes, weights);

      // Random size
      const size = Math.random() * 6 + 6; // 6-12px

      // Random color variant
      const variant = Math.floor(Math.random() * 3); // 0, 1, 2

      // Random rotation
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + 360;

      // Random trajectory
      const xDrift = (Math.random() - 0.5) * 60; // ±30px
      const yPeak = -25; // Max height above trigger
      const yFinal = 15; // Settle below trigger

      // Setup particle
      particle.className = `bf25sc-confetti-particle bf25sc-confetti-particle--${shape} bf25sc-confetti-particle--tier-${tier}`;
      particle.dataset.variant = variant;
      particle.style.width = `${size}px`;
      particle.style.height = shape === 'triangle' ? 'auto' : `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.display = 'block';
      particle.style.opacity = '1';

      // Special handling for triangle
      if (shape === 'triangle') {
        const halfSize = size / 2;
        particle.style.borderLeftWidth = `${halfSize}px`;
        particle.style.borderRightWidth = `${halfSize}px`;
        particle.style.borderBottomWidth = `${size}px`;
      }

      // Add to active list
      this.activeParticles.push(particle);

      // WAAPI Animation
      const animation = particle.animate([
        {
          transform: `translate(0, 0) rotate(${rotationStart}deg)`,
          opacity: 1,
          offset: 0
        },
        {
          transform: `translate(${xDrift / 2}px, ${yPeak}px) rotate(${rotationStart + 180}deg)`,
          opacity: 1,
          offset: 0.5
        },
        {
          transform: `translate(${xDrift}px, ${yFinal}px) rotate(${rotationEnd}deg)`,
          opacity: 0,
          offset: 1
        }
      ], {
        duration: 1500,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', // Ease-Out Cubic
        fill: 'forwards'
      });

      // Cleanup on finish
      animation.onfinish = () => {
        this.returnParticle(particle);
      };
    }

    /**
     * Weighted random selection
     */
    weightedRandom(items, weights) {
      const total = weights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * total;

      for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
          return items[i];
        }
        random -= weights[i];
      }

      return items[items.length - 1];
    }

    /**
     * Clear all active particles (for cleanup)
     */
    clearAll() {
      this.activeParticles.forEach(particle => {
        this.returnParticle(particle);
      });
      this.activeParticles = [];
      console.log('[ConfettiSystem] Cleared all particles');
    }

    /**
     * Get trigger position (center of gift icon)
     */
    getTriggerPosition(checkpoint) {
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (!slot) {
        console.warn(`[ConfettiSystem] No slot found for checkpoint ${checkpoint}`);
        return null;
      }

      const rect = slot.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();

      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
      };
    }
  }

  // ============================================
  // CART MANAGER CLASS
  // ============================================
  class CartManager {
    constructor() {
      // Singleton Pattern
      if (CartManager.instance) {
        return CartManager.instance;
      }
      CartManager.instance = this;

      // State
      this.state = 'idle'; // idle | updating | syncing | animating
      this.currentTier = null;
      this.itemCount = 0;
      this.previousTier = null;

      // BundleManager Integration (Virtual Cart)
      // When true, reads from localStorage instead of Shopify API
      this.useBundleManager = false;
      this.bundleManagerReady = false;

      // Configuration
      this.tiers = BF25_TIERS;
      this.maxItems = 16;

      // Celebration Queue (BF25-8.3)
      this.celebrationQueue = [];
      this.isCelebrating = false;
      this._celebrationStarted = false; // Track first celebration delay (BF25-8.6)
      this.celebrationDuration = 3200; // 3.2s total cycle time per celebration (BF25-8.6)

      // DOM Cache
      this.elements = this.cacheDOM();

      // Initialize
      this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    cacheDOM() {
      return {
        container: document.getElementById('bf25sc-sticky-cart'),
        segments: document.querySelectorAll('.bf25sc-progress-bar__segment'),
        tierLabels: document.querySelectorAll('.bf25sc-tier-label'),
        giftSlots: document.querySelectorAll('.bf25sc-gift-slot'),
        incentiveText: document.getElementById('bf25sc-incentive-text'),
        savingsAmount: document.getElementById('bf25sc-savings-amount'),
        btnView: document.getElementById('bf25sc-btn-view'),
        btnBuy: document.getElementById('bf25sc-btn-buy'),
        announcer: document.getElementById('bf25sc-cart-announcements')
      };
    }

    init() {
      console.log('[BF25 Cart] Initializing CartManager...');

      // Validate DOM elements
      if (!this.elements.container) {
        console.error('[BF25 Cart] Container not found');
        return;
      }

      // Initialize debounce timeout
      this.syncTimeout = null;
      this.retryCount = 0;

      // Try loading from cache first for instant render (eliminates flash)
      const cachedState = this.loadCachedState();
      if (cachedState) {
        console.log('[BF25 Cart] Applying cached state for instant render');
        this.updateVisualization(cachedState.itemCount);
        if (this.elements.savingsAmount) {
          const currencySymbol = getCurrencySymbol();
          this.elements.savingsAmount.textContent = `Save ${currencySymbol}${cachedState.savings}`;
        }
        this.handleEmptyState(cachedState.itemCount);
      }

      // Bind events
      this.bindEvents();

      // Initialize cart listeners
      this.initCartListeners();

      // Initialize GiftAnimator
      this.initGiftAnimator();

      // Initialize ConfettiSystem
      this.initConfettiSystem();

      // Initialize ToastManager
      if (window.BF25Toast) {
        window.BF25Toast.init();
      }

      // Initialize keyboard navigation
      this.initKeyboardNav();

      // Handle viewport changes
      this.handleViewportChange();

      // Set initial body padding (CLS prevention)
      document.body.style.paddingBottom = '65px';

      // Initialize BundleManager integration (Virtual Cart)
      // This replaces slow API calls with instant localStorage reads
      this.initBundleManagerIntegration();

      console.log('[BF25 Cart] ✓ Ready');
    }

    // ============================================
    // BUNDLEMANAGER INTEGRATION (Virtual Cart)
    // ============================================

    /**
     * Initialize BundleManager integration for instant cart updates.
     * Falls back to Shopify API sync if BundleManager unavailable.
     */
    initBundleManagerIntegration() {
      // Check if BundleManager is available (with retry for race conditions)
      if (!window.BF25BundleManager) {
        // Retry up to 5 times with 100ms delay (covers 500ms window)
        if (!this._bundleManagerRetries) {
          this._bundleManagerRetries = 0;
        }

        if (this._bundleManagerRetries < 5) {
          this._bundleManagerRetries++;
          console.log(`[BF25 Cart] BundleManager not ready, retry ${this._bundleManagerRetries}/5...`);
          setTimeout(() => this.initBundleManagerIntegration(), 100);
          return;
        }

        // After 5 retries, fall back to Shopify API
        console.warn('[BF25 Cart] BundleManager not found after 5 retries, using Shopify API fallback');
        this.useBundleManager = false;
        this.syncCart(); // Original flow

        // Still mark as initialized and set up scroll observer
        this.markInitialized();
        this.initScrollObserver();
        return;
      }

      // Reset retry counter
      this._bundleManagerRetries = 0;

      console.log('[BF25 Cart] 🚀 BundleManager detected - enabling instant mode');
      this.useBundleManager = true;
      this.bundleManagerReady = true;

      // Listen for bundle loaded from storage (page refresh/return)
      document.addEventListener('bf25:bundleLoaded', (event) => {
        console.log('[BF25 Cart] Event: bf25:bundleLoaded', event.detail);
        const { itemCount, tierReached, giftsUnlocked } = event.detail;

        // Render cart from loaded bundle
        this.renderFromBundle();

        // Update gift slot states to "claimed" for unlocked tiers (no animation on page load)
        if (tierReached > 0) {
          this.updateGiftSlotsForTier(tierReached);

          // CRITICAL: Mark these tiers as celebrated to prevent re-animation
          if (this.giftAnimator) {
            console.log(`[BF25 Cart] Syncing celebratedTiers for loaded bundle (tier ${tierReached})`);
            for (let tier = 1; tier <= tierReached; tier++) {
              this.giftAnimator.celebratedTiers.add(tier);
            }
            this.giftAnimator.saveCelebratedTiers();
          }
        }
      });

      // Listen for bundle updates (instant re-renders)
      document.addEventListener('bf25:bundleUpdated', (event) => {
        console.log('[BF25 Cart] Event: bf25:bundleUpdated', event.detail);
        this.renderFromBundle();
      });

      // Listen for tier unlocks (trigger animations)
      document.addEventListener('bf25:tierUnlocked', (event) => {
        console.log('%c[BF25 Cart] 🎉 RECEIVED bf25:tierUnlocked', 'color: #60c655; font-weight: bold;', event.detail);
        const { tier } = event.detail;
        if (this.giftAnimator && tier > 0) {
          console.log(`[BF25 Cart] Calling giftAnimator.animate(${tier})`);
          this.giftAnimator.animate(tier);
        } else {
          console.warn('[BF25 Cart] GiftAnimator not available or tier is 0');
        }
      });

      // Listen for gift unlocks - CELEBRATION ANIMATION (BF25-8.1)
      document.addEventListener('bf25:giftUnlocked', (event) => {
        console.log('[BF25 Cart] Event: bf25:giftUnlocked', event.detail);
        const { gift } = event.detail;

        // Get gift config with image and value
        const giftConfig = window.GIFT_VARIANT_MAP?.[gift.checkpoint];
        const imageUrl = giftConfig?.image || '';
        const giftTitle = giftConfig?.title || gift.title || 'Free Gift';
        const giftValue = giftConfig?.value || giftConfig?.price || 0;

        // Get discount for this checkpoint's tier (BF25-8.6)
        const discountPercent = this.getDiscountForCheckpoint(gift.checkpoint);

        // Queue the celebration with discount info (shows one at a time)
        this.queueGiftCelebration(giftTitle, imageUrl, gift.checkpoint, giftValue, discountPercent);
      });

      // Listen for tier downgrades (logging only - toast handled by handleTierDowngrade)
      document.addEventListener('bf25:tierChanged', (event) => {
        console.log('[BF25 Cart] Event: bf25:tierChanged', event.detail);
        // Toast removed - handleTierDowngrade shows detailed message
      });

      // Listen for gift loss (logging only - toast handled by handleTierDowngrade)
      document.addEventListener('bf25:giftLost', (event) => {
        console.log('[BF25 Cart] Event: bf25:giftLost', event.detail);
        // Toast removed - handleTierDowngrade shows detailed message
      });

      // Listen for max items reached (BF25-8.5: log only, no toast - unlimited items allowed)
      document.addEventListener('bf25:maxItemsReached', (event) => {
        console.log('[BF25 Cart] Event: bf25:maxItemsReached (ignored - unlimited allowed)', event.detail);
      });

      // Check for back button from checkout (session backup exists)
      this.handleCheckoutReturn();

      // Initial render from BundleManager
      this.renderFromBundle();

      // Mark cart as initialized (prevents flash)
      this.markInitialized();

      // Set up scroll observer (show cart after hero)
      this.initScrollObserver();

      console.log('[BF25 Cart] ✓ BundleManager integration active');
    }

    /**
     * Mark cart as initialized (CSS reveals it)
     * This prevents the flash of unstyled content
     */
    markInitialized() {
      if (!this.elements.container) return;

      // Small delay to ensure first render completes
      requestAnimationFrame(() => {
        this.elements.container.classList.add('is-initialized');
        console.log('[BF25 Cart] ✓ Cart initialized (visible)');
      });
    }

    /**
     * Initialize scroll observer to show cart after scrolling past hero
     * Better UX: Users see products before cart appears
     */
    initScrollObserver() {
      // Find a target element to observe (hero section or first product grid)
      const observerTarget = document.querySelector(
        '.bf25-hero, .bf25-hero-section, [class*="hero"], .bf25-product-grid, .bf25-products-section'
      );

      // Fallback: Show cart immediately if no hero found
      if (!observerTarget) {
        console.log('[BF25 Cart] No hero section found, showing cart immediately');
        this.elements.container?.classList.add('is-scrolled');
        return;
      }

      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Show cart when hero is scrolled out of view (or mostly out)
            if (!entry.isIntersecting) {
              this.elements.container?.classList.add('is-scrolled');
              console.log('[BF25 Cart] Hero scrolled past, showing cart');
            } else {
              // Optional: Hide cart when scrolling back to top
              // Uncomment if you want this behavior:
              // this.elements.container?.classList.remove('is-scrolled');
            }
          });
        },
        {
          root: null, // viewport
          rootMargin: '-100px 0px 0px 0px', // Trigger when hero is 100px above viewport
          threshold: 0 // Any visibility change
        }
      );

      observer.observe(observerTarget);
      console.log('[BF25 Cart] ✓ Scroll observer active');

      // Store observer for cleanup if needed
      this.scrollObserver = observer;
    }

    /**
     * Handle return from checkout (back button pressed)
     * Restores bundle from sessionStorage and clears Shopify cart
     */
    async handleCheckoutReturn() {
      if (!window.BF25BundleManager) return;

      // Check if there's a session backup (indicates back from checkout)
      if (!window.BF25BundleManager.hasSessionBackup()) {
        return;
      }

      console.log('[BF25 Cart] 🔙 Detected return from checkout (back button)');

      try {
        // Restore bundle from session backup
        const restored = window.BF25BundleManager.restoreFromSession();

        if (restored) {
          // Clear Shopify cart (purchase not completed)
          await window.BF25BundleManager.clearShopifyCart();

          // Show toast
          if (window.BF25Toast) {
            window.BF25Toast.show('Welcome back! Your bundle has been restored.', {
              type: 'success',
              duration: 3000
            });
          }

          console.log('[BF25 Cart] ✓ Bundle restored, Shopify cart cleared');
        }

      } catch (error) {
        console.error('[BF25 Cart] Error handling checkout return:', error);
      }
    }

    /**
     * Render cart UI from BundleManager state (INSTANT - no API calls)
     * This replaces the slow syncCart() → fetchCart() → render flow
     */
    renderFromBundle() {
      if (!window.BF25BundleManager) {
        console.warn('[BF25 Cart] renderFromBundle called but BundleManager not available');
        return;
      }

      console.log('[BF25 Cart] Rendering from BundleManager...');
      window.BF25Performance.startOperation('bundleRender');

      try {
        // Get computed values from BundleManager (instant - localStorage)
        const computed = window.BF25BundleManager.getComputed();
        const items = window.BF25BundleManager.getItems();

        const {
          itemCount,
          tierReached,
          discountPercent,
          totalOriginalPrice,
          totalDiscountedPrice,
          totalSavings,
          totalGiftValue,
          giftsUnlocked,
          itemsToNextTier,
          itemsToNextGift,
          nextGiftCheckpoint
        } = computed;

        // Calculate savings in euros for display (guard against NaN)
        const safeSavings = (typeof totalSavings === 'number' && !isNaN(totalSavings)) ? totalSavings : 0;
        const giftValueCents = (totalGiftValue || 0);
        const totalSavingsWithGifts = safeSavings + giftValueCents;
        const savingsEuros = (totalSavingsWithGifts / 100).toFixed(0);

        console.log(`[BF25 Cart] Bundle: ${itemCount} items, Tier ${tierReached}, €${savingsEuros} savings`);

        // Update progress bar and tier visualization
        this.updateVisualization(itemCount);

        // Update data-active-tier for CSS-based button pulse
        if (this.elements.container) {
          this.elements.container.setAttribute('data-active-tier', tierReached);
        }

        // Update savings display (BOGO-style format)
        if (this.elements.savingsAmount) {
          const currencySymbol = getCurrencySymbol();
          const newText = `${currencySymbol}${savingsEuros}`;

          // Only animate if value changed
          if (this.elements.savingsAmount.textContent !== newText) {
            this.elements.savingsAmount.classList.add('is-updating');
            this.elements.savingsAmount.textContent = newText;

            // Remove animation class after it completes
            setTimeout(() => {
              this.elements.savingsAmount.classList.remove('is-updating');
            }, 400);
          } else {
            // Same value, just update text without animation
            this.elements.savingsAmount.textContent = newText;
          }
        }

        // Render products in expanded view
        this.renderBundleProducts(items, computed);

        // Show/hide cart based on items
        this.handleEmptyState(itemCount);

        // Update incentive text with progress info
        this.updateIncentiveFromBundle(computed);

        // Cache state for page reload (instant render on next visit)
        this.saveCachedState(itemCount, savingsEuros);

        // Set idle state
        this.setState('idle');

        window.BF25Performance.endOperation('bundleRender', 20); // Target: 20ms

        return { itemCount, savings: savingsEuros };

      } catch (error) {
        console.error('[BF25 Cart] Error rendering from bundle:', error);
        this.handleError(error, 'renderFromBundle');

        // Fallback to API sync if bundle render fails
        console.log('[BF25 Cart] Falling back to API sync...');
        this.useBundleManager = false;
        this.syncCart();

        return null;
      }
    }

    /**
     * Render product cards from bundle items
     * Adapted from renderProducts() to work with BundleManager item format
     */
    renderBundleProducts(items, computed) {
      const scrollContainer = document.getElementById('bf25sc-product-scroll');
      const emptyState = document.getElementById('bf25sc-expanded-empty');

      if (!scrollContainer) return;

      // Clear existing products
      scrollContainer.innerHTML = '';

      // Handle empty state
      if (items.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      // Get current discount for price display
      const discountMultiplier = 1 - (computed.discountPercent / 100);

      // Render each item
      items.forEach((item, index) => {
        // Debug logging for image resolution (BF25-8.7)
        console.log(`[BF25 Cart] Rendering product: ${item.title}`, {
          hasImage: !!item.image,
          imageUrl: item.image ? item.image.substring(0, 80) : 'MISSING'
        });

        const card = document.createElement('div');
        card.className = 'bf25sc-product-card';
        card.setAttribute('data-variant-id', item.variantId);
        card.setAttribute('data-index', index);

        // Calculate prices
        const originalPrice = (item.price * item.quantity) / 100;
        const discountedPrice = (item.price * item.quantity * discountMultiplier) / 100;

        // Build card HTML
        card.innerHTML = `
          <div class="bf25sc-product-image-container">
            ${item.image
              ? `<img src="${item.image}" alt="${item.title}" class="bf25sc-product-image" width="60" height="60">`
              : `<div class="bf25sc-product-placeholder">📦</div>`
            }
            <span class="bf25sc-product-qty-badge">${item.quantity}</span>
          </div>
          <div class="bf25sc-product-info">
            <h4 class="bf25sc-product-title">${item.title}</h4>
            ${item.variantTitle ? `<p class="bf25sc-product-variant">${item.variantTitle}</p>` : ''}
            <div class="bf25sc-product-prices">
              <span class="bf25sc-price-discounted">${getCurrencySymbol()}${discountedPrice.toFixed(2)}</span>
              <span class="bf25sc-price-original">${getCurrencySymbol()}${originalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div class="bf25sc-product-actions">
            <button type="button" class="bf25sc-product-remove" aria-label="Remove ${item.title}">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `;

        // Add remove button handler
        const removeBtn = card.querySelector('.bf25sc-product-remove');
        if (removeBtn) {
          removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleBundleRemove(item.variantId, item.title);
          });
        }

        scrollContainer.appendChild(card);
      });

      console.log(`[BF25 Cart] Rendered ${items.length} bundle products`);

      // BF25-8.0: Render gifts after products
      this.renderBundleGifts(computed);

      // BF25-8.2: If no gifts, init carousel here (otherwise handled in renderBundleGifts)
      if (!computed.giftsUnlocked || computed.giftsUnlocked.length === 0) {
        this.initProductCarousel();
      }
    }

    /**
     * Render unlocked gifts in cart panel (BF25-8.1)
     * Gift cards match product card structure EXACTLY with green glow
     * @param {Object} computed - Computed state from BundleManager
     */
    renderBundleGifts(computed) {
      const scrollContainer = document.getElementById('bf25sc-product-scroll');

      if (!scrollContainer || !computed.giftsUnlocked || computed.giftsUnlocked.length === 0) {
        return;
      }

      console.log(`[BF25 Cart] Rendering ${computed.giftsUnlocked.length} unlocked gifts`);

      // Get gift images from GIFT_VARIANT_MAP
      const giftMap = window.GIFT_VARIANT_MAP;

      // Render each unlocked gift
      computed.giftsUnlocked.forEach((gift) => {
        const card = document.createElement('div');
        // Same base class + gift modifier for green glow
        card.className = 'bf25sc-product-card bf25sc-gift-card';
        card.setAttribute('data-variant-id', gift.variantId);
        card.setAttribute('data-gift', 'true');

        // Get image from GIFT_VARIANT_MAP using checkpoint
        const giftConfig = giftMap[gift.checkpoint];
        const imageUrl = giftConfig?.image || gift.image || '';
        const giftTitle = giftConfig?.title || gift.title || 'Free Gift';
        const giftPrice = giftConfig?.price || gift.price || 0;

        // IDENTICAL structure to product cards
        card.innerHTML = `
          <div class="bf25sc-product-image-container">
            ${imageUrl
              ? `<img src="${imageUrl}" alt="${giftTitle}" class="bf25sc-product-image" width="80" height="80">`
              : `<div class="bf25sc-product-placeholder">🎁</div>`
            }
            <span class="bf25sc-product-qty-badge bf25sc-free-badge">FREE</span>
          </div>
          <div class="bf25sc-product-info">
            <div class="bf25sc-product-prices">
              <span class="bf25sc-price-free">FREE</span>
              <span class="bf25sc-price-original">${getCurrencySymbol()}${(giftPrice / 100).toFixed(2)}</span>
            </div>
          </div>
        `;
        // NO remove button for gifts (they're locked in)

        scrollContainer.appendChild(card);
      });

      console.log(`[BF25 Cart] Rendered ${computed.giftsUnlocked.length} gift(s) in cart`);

      // BF25-8.2: Initialize carousel after rendering all products and gifts
      this.initProductCarousel();
    }

    /**
     * Queue a gift celebration (shows one at a time) (BF25-8.3)
     * @param {string} giftTitle - Gift title
     * @param {string} imageUrl - Gift product image URL
     * @param {number} checkpoint - Tier checkpoint number
     * @param {number} giftValue - Gift value in cents
     */
    queueGiftCelebration(giftTitle, imageUrl, checkpoint, giftValue, discountPercent) {
      console.log(`[BF25 Cart] Queuing celebration for: ${giftTitle} (checkpoint ${checkpoint}, ${discountPercent}% OFF)`);

      this.celebrationQueue.push({
        title: giftTitle,
        image: imageUrl,
        checkpoint: checkpoint,
        value: giftValue,
        discountPercent: discountPercent
      });

      // Process queue if not already celebrating
      if (!this.isCelebrating) {
        this.processCelebrationQueue();
      }
    }

    /**
     * Get discount percentage for a gift checkpoint (BF25-8.6)
     * Checkpoint 4 = Tier 1 (60%), 8 = Tier 2 (70%), 12 = Tier 3 (80%), 16 = Tier 4 (85%)
     */
    getDiscountForCheckpoint(checkpoint) {
      const checkpointToDiscount = {
        4: 60,
        8: 70,
        12: 80,
        16: 85
      };
      return checkpointToDiscount[checkpoint] || 60;
    }

    /**
     * Process celebration queue sequentially (BF25-8.3)
     */
    async processCelebrationQueue() {
      if (this.celebrationQueue.length === 0) {
        this.isCelebrating = false;
        this._celebrationStarted = false; // Reset for next batch (BF25-8.6)
        console.log('[BF25 Cart] Celebration queue complete');
        return;
      }

      this.isCelebrating = true;

      // FIRST celebration gets delay to let modal close (BF25-8.6)
      if (!this._celebrationStarted) {
        this._celebrationStarted = true;
        console.log('[BF25 Cart] Waiting 600ms for modal to close...');
        await this.delay(600);
      }

      const celebration = this.celebrationQueue.shift();
      console.log(`[BF25 Cart] Showing celebration: ${celebration.title} (${celebration.discountPercent}% OFF)`);

      // Show this celebration with discount info
      await this.showGiftCelebration(
        celebration.title,
        celebration.image,
        celebration.checkpoint,
        celebration.value,
        celebration.discountPercent
      );

      // Wait 2.8s gap between celebrations (BF25-8.6)
      await this.delay(2800);

      // Process next in queue
      this.processCelebrationQueue();
    }

    /**
     * Utility delay function (BF25-8.3)
     */
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show premium celebration popup with backdrop (BF25-8.2/8.3/8.6)
     * Returns Promise for queue coordination
     * @param {string} giftTitle - Gift title
     * @param {string} imageUrl - Gift product image URL
     * @param {number} checkpoint - Tier checkpoint number
     * @param {number} giftValue - Gift value in cents (optional)
     * @param {number} discountPercent - Discount percentage for this tier
     */
    showGiftCelebration(giftTitle, imageUrl, checkpoint, giftValue, discountPercent) {
      return new Promise((resolve) => {
        // Pause regular toasts during celebration
        if (window.BF25Toast) {
          window.BF25Toast.pause();
        }
        // Create backdrop overlay
        const backdrop = document.createElement('div');
        backdrop.className = 'bf25sc-celebration-backdrop';
        backdrop.setAttribute('data-checkpoint', checkpoint);

        // Format gift value for display
        const valueDisplay = giftValue ? `${getCurrencySymbol()}${(giftValue / 100).toFixed(2)} value` : '';

        // Create celebration container with DISCOUNT + GIFT messaging (BF25-8.6)
        const celebration = document.createElement('div');
        celebration.className = 'bf25sc-gift-celebration';
        celebration.setAttribute('data-checkpoint', checkpoint);
        celebration.innerHTML = `
          <div class="bf25sc-celebration-content">
            <div class="bf25sc-celebration-glow"></div>

            <!-- DISCOUNT HEADLINE - Big and prominent -->
            <div class="bf25sc-celebration-discount">${discountPercent}% OFF</div>

            <!-- Plus free gift badge -->
            <div class="bf25sc-celebration-badge">+ FREE GIFT UNLOCKED!</div>

            <!-- Product image -->
            <div class="bf25sc-celebration-product">
              <img src="${imageUrl}" alt="${giftTitle}" class="bf25sc-celebration-image">
            </div>

            <!-- Gift title -->
            <div class="bf25sc-celebration-title">${giftTitle}</div>

            <!-- Gift value -->
            ${valueDisplay ? `<div class="bf25sc-celebration-value">${valueDisplay}</div>` : ''}
          </div>
        `;

        // Insert elements
        document.body.appendChild(backdrop);
        document.body.appendChild(celebration);

        // Trigger confetti
        this.triggerCelebrationConfetti();

        // Animate in (staggered for premium feel)
        requestAnimationFrame(() => {
          backdrop.classList.add('is-visible');
          setTimeout(() => {
            celebration.classList.add('is-visible');
          }, 100);
        });

        // Cleanup function
        const cleanup = () => {
          celebration.classList.remove('is-visible');
          backdrop.classList.remove('is-visible');

          setTimeout(() => {
            celebration.remove();
            backdrop.remove();

            // Resume regular toasts
            if (window.BF25Toast) {
              window.BF25Toast.resume();
            }

            resolve(); // Signal completion for queue
          }, 400);
        };

        // Auto-dismiss after 2.5s - longer for readability (BF25-8.6)
        setTimeout(cleanup, 2500);

        // Click backdrop to dismiss early
        backdrop.addEventListener('click', cleanup, { once: true });

        console.log('[BF25 Cart] Celebration shown for:', giftTitle);
      });
    }

    /**
     * Trigger confetti burst for celebration (BF25-8.2)
     */
    triggerCelebrationConfetti() {
      // Use existing confetti system if available
      if (this.confettiSystem) {
        this.confettiSystem.burst({
          particleCount: 50,
          spread: 70,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#60c655', '#7FFF00', '#ffffff', '#FFD700']
        });
      }
      // Confetti is optional - system continues without it
    }

    /**
     * Animate product flying from celebration to cart area (BF25-8.1)
     * @param {HTMLElement} celebration - Celebration element
     * @param {number} checkpoint - Tier checkpoint number
     */
    flyProductToCart(celebration, checkpoint) {
      const productImg = celebration.querySelector('.bf25sc-celebration-image');
      const cartArea = document.getElementById('bf25sc-product-scroll');

      if (!productImg || !cartArea) return;

      // Get positions
      const imgRect = productImg.getBoundingClientRect();
      const cartRect = cartArea.getBoundingClientRect();

      // Create flying clone
      const flyingProduct = productImg.cloneNode(true);
      flyingProduct.className = 'bf25sc-flying-product';
      flyingProduct.style.cssText = `
        position: fixed;
        top: ${imgRect.top}px;
        left: ${imgRect.left}px;
        width: ${imgRect.width}px;
        height: ${imgRect.height}px;
        z-index: 10001;
        pointer-events: none;
      `;
      document.body.appendChild(flyingProduct);

      // Animate to cart
      requestAnimationFrame(() => {
        flyingProduct.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        flyingProduct.style.top = `${cartRect.top + 20}px`;
        flyingProduct.style.left = `${cartRect.left + 20}px`;
        flyingProduct.style.width = '60px';
        flyingProduct.style.height = '60px';
        flyingProduct.style.opacity = '0';
      });

      // Cleanup flying element
      setTimeout(() => {
        flyingProduct.remove();
      }, 700);
    }

    /**
     * Initialize product carousel with scroll indicators and mouse drag (BF25-8.2)
     */
    initProductCarousel() {
      const scrollContainer = document.getElementById('bf25sc-product-scroll');
      if (!scrollContainer) return;

      // Ensure wrapper exists for fade indicators
      let wrapper = scrollContainer.parentElement;
      if (!wrapper.classList.contains('bf25sc-products-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'bf25sc-products-wrapper';
        scrollContainer.parentNode.insertBefore(wrapper, scrollContainer);
        wrapper.appendChild(scrollContainer);
      }

      // Update fade indicators on scroll
      const updateScrollIndicators = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

        if (scrollLeft > 10) {
          wrapper.classList.add('has-scroll-left');
        } else {
          wrapper.classList.remove('has-scroll-left');
        }

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          wrapper.classList.add('at-scroll-end');
        } else {
          wrapper.classList.remove('at-scroll-end');
        }
      };

      scrollContainer.addEventListener('scroll', updateScrollIndicators, { passive: true });

      // Initial check
      updateScrollIndicators();

      // Mouse drag scrolling for desktop
      let isMouseDown = false;
      let startX;
      let scrollLeftStart;

      scrollContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeftStart = scrollContainer.scrollLeft;
      });

      scrollContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
        scrollContainer.style.cursor = 'grab';
      });

      scrollContainer.addEventListener('mouseup', () => {
        isMouseDown = false;
        scrollContainer.style.cursor = 'grab';
      });

      scrollContainer.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll speed multiplier
        scrollContainer.scrollLeft = scrollLeftStart - walk;
      });

      // Set initial cursor
      scrollContainer.style.cursor = 'grab';

      console.log('[BF25 Cart] Product carousel initialized');
    }

    /**
     * Handle item removal via BundleManager
     */
    handleBundleRemove(variantId, title) {
      if (!window.BF25BundleManager) return;

      console.log(`[BF25 Cart] Removing from bundle: ${title} (${variantId})`);

      // Optimistic UI update - add removing class
      const card = document.querySelector(`.bf25sc-product-card[data-variant-id="${variantId}"]`);
      if (card) {
        card.classList.add('is-removing');
      }

      // Remove from BundleManager (triggers bf25:bundleUpdated event)
      const result = window.BF25BundleManager.removeItem(variantId);

      if (result.success) {
        console.log(`[BF25 Cart] ✓ Removed: ${title}`);
        // UI will update via bf25:bundleUpdated event
      } else {
        console.error(`[BF25 Cart] Failed to remove: ${result.error}`);
        // Remove the removing class if failed
        if (card) {
          card.classList.remove('is-removing');
        }
      }
    }

    /**
     * Update incentive text based on bundle progress
     */
    updateIncentiveFromBundle(computed) {
      if (!this.elements.incentiveText) return;

      const {
        itemCount,
        tierReached,
        discountPercent,
        itemsToNextGift,
        nextGiftCheckpoint,
        itemsToNextTier,
        nextTierDiscount,
        hasMaxItems
      } = computed;

      let message = '';

      if (itemCount === 0) {
        message = 'Add items to start building your bundle!';
      } else if (hasMaxItems) {
        message = `🎉 Maximum bundle! ${discountPercent}% OFF everything`;
      } else if (itemsToNextGift > 0 && itemsToNextGift <= 2) {
        // Close to next gift - emphasize gift
        message = `Add ${itemsToNextGift} more for FREE gift! 🎁`;
      } else if (itemsToNextTier > 0 && itemsToNextTier <= 2) {
        // Close to next tier - emphasize discount
        message = `Add ${itemsToNextTier} more for ${nextTierDiscount}% OFF! 🔥`;
      } else if (itemsToNextGift > 0) {
        message = `Add ${itemsToNextGift} more for your next free gift`;
      } else if (tierReached === 4) {
        message = `🏆 MAX TIER! ${discountPercent}% OFF + 4 FREE gifts`;
      } else {
        message = `${discountPercent}% OFF · ${itemsToNextTier} more for bigger savings`;
      }

      this.elements.incentiveText.textContent = message;
    }

    /**
     * Update gift slot states for existing tier (no animation)
     * Used when loading bundle from storage on page refresh
     */
    updateGiftSlotsForTier(tierReached) {
      console.log(`[BF25 Cart] Updating gift slots for tier ${tierReached}`);

      const giftSlots = document.querySelectorAll('.bf25sc-gift-slot');
      const checkpoints = [4, 8, 12, 16]; // Gift unlock checkpoints

      giftSlots.forEach((slot, index) => {
        const checkpoint = checkpoints[index];
        const tierForCheckpoint = index + 1; // Tier 1 = checkpoint 4, etc.

        if (tierForCheckpoint <= tierReached) {
          // This gift is unlocked - set to claimed state (no animation)
          slot.dataset.state = 'claimed';
          console.log(`[BF25 Cart] Gift slot ${tierForCheckpoint} set to claimed`);
        } else {
          // This gift is still locked
          slot.dataset.state = 'locked';
        }
      });
    }

    /**
     * Suppress Rebuy Smart Cart (replicated from BOGO Builder)
     * Must be called BEFORE any cart operations during checkout
     */
    suppressRebuy() {
      console.log('[BF25 Cart] 🚫 Suppressing Rebuy Smart Cart...');

      // Method 1: Set global flags
      window.bf25DirectCheckout = true;
      window.rebuyDisabled = true;
      sessionStorage.setItem('bf25-direct-checkout', 'true');
      sessionStorage.setItem('rebuy-disabled', 'true');

      // Method 2: Disable Rebuy methods directly (can't replace - it's read-only)
      if (window.Rebuy) {
        console.log('[BF25 Cart] Found Rebuy object, disabling methods...');

        try {
          // Disable SmartCart (the cart drawer)
          if (window.Rebuy.SmartCart) {
            window.Rebuy.SmartCart.open = function() {
              console.log('[BF25 Cart] Rebuy.SmartCart.open blocked');
            };
            window.Rebuy.SmartCart.close = function() {
              console.log('[BF25 Cart] Rebuy.SmartCart.close blocked');
            };
            window.Rebuy.SmartCart.show = function() {
              console.log('[BF25 Cart] Rebuy.SmartCart.show blocked');
            };
            window.Rebuy.SmartCart.toggle = function() {
              console.log('[BF25 Cart] Rebuy.SmartCart.toggle blocked');
            };
          }

          // Disable Cart methods
          if (window.Rebuy.Cart) {
            window.Rebuy.Cart.open = function() {
              console.log('[BF25 Cart] Rebuy.Cart.open blocked');
            };
            window.Rebuy.Cart.show = function() {
              console.log('[BF25 Cart] Rebuy.Cart.show blocked');
            };
          }

          // Try to disable init/refresh methods
          if (typeof window.Rebuy.init === 'function') {
            window.Rebuy.init = function() {
              console.log('[BF25 Cart] Rebuy.init blocked');
            };
          }
          if (typeof window.Rebuy.refresh === 'function') {
            window.Rebuy.refresh = function() {
              console.log('[BF25 Cart] Rebuy.refresh blocked');
            };
          }

          console.log('[BF25 Cart] ✅ Rebuy methods disabled');
        } catch (e) {
          console.warn('[BF25 Cart] Could not disable some Rebuy methods:', e.message);
          // Continue anyway - other suppression methods may work
        }
      }

      // Method 3: Prevent Rebuy cart events (capture phase)
      const rebuyEvents = [
        'rebuy:cart.open',
        'rebuy:cart-open',
        'rebuy:cart.change',
        'rebuy:cart-update',
        'rebuy:checkout'
      ];

      rebuyEvents.forEach(eventName => {
        document.addEventListener(eventName, (e) => {
          console.log(`[BF25 Cart] Blocked Rebuy event: ${eventName}`);
          e.stopImmediatePropagation();
          e.preventDefault();
          return false;
        }, { capture: true, passive: false });
      });

      // Method 4: Hide Rebuy DOM elements
      document.querySelectorAll('[data-rebuy], [data-rebuy-cart], rebuy-cart, .rebuy-cart, #rebuy-smart-cart')
        .forEach(el => {
          el.style.display = 'none';
          el.style.pointerEvents = 'none';
        });

      console.log('[BF25 Cart] ✅ Rebuy suppression complete (4 methods active)');
    }

    /**
     * Update the state of the CartManager with validation.
     * @param {string} newState - The new state (idle, updating, syncing, animating).
     */
    setState(newState) {
      const validStates = ['idle', 'updating', 'syncing', 'animating'];

      if (!validStates.includes(newState)) {
        console.error(`[BF25 Cart] Invalid state requested: ${newState}`);
        return;
      }

      const previousState = this.state;
      if (previousState !== newState) {
        this.state = newState;
        console.log(`[BF25 Cart] State transition: ${previousState} → ${newState}`);

        // Update DOM attribute for CSS hooks
        if (this.elements?.container) {
          this.elements.container.setAttribute('data-state', newState);
        }
      }
    }

    bindEvents() {
      // View Cart Toggle
      if (this.elements.btnView) {
        this.elements.btnView.addEventListener('click', () => {
          this.toggleExpansion();
        });
      }

      // Buy Now (Navigate to Checkout) - With gift validation
      if (this.elements.btnBuy) {
        this.elements.btnBuy.addEventListener('click', async () => {
          await this.handleCheckout();
        });
      }
    }

    /**
     * Handle checkout with BundleManager integration
     * Syncs bundle from localStorage → Shopify cart → Checkout
     *
     * Updated: BF25-CHECKOUT-BUNDLEMANAGER
     */
    async handleCheckout() {
      // ─────────────────────────────────────────────────────────────────
      // PREVENT DOUBLE-CLICK
      // ─────────────────────────────────────────────────────────────────
      if (this.state !== 'idle') {
        console.warn('[BF25 Cart] Checkout already in progress');
        return;
      }

      // SAFETY: Verify button element exists
      if (!this.elements?.btnBuy) {
        console.error('[BF25 Cart] Buy button element not found');
        return;
      }

      // Update state
      this.setState('syncing');

      // Store original button text for reset on error
      const originalText = this.elements.btnBuy.textContent;
      this.elements.btnBuy.textContent = 'Processing...';
      this.elements.btnBuy.disabled = true;

      // Discount code for free gifts
      const DISCOUNT_CODE = 'BF25-FREE';

      try {
        // ─────────────────────────────────────────────────────────────────
        // Step 1: Suppress Rebuy BEFORE any cart operations
        // ─────────────────────────────────────────────────────────────────
        this.suppressRebuy();

        // ─────────────────────────────────────────────────────────────────
        // Step 2: Check if using BundleManager (new flow) or legacy
        // ─────────────────────────────────────────────────────────────────
        if (this.useBundleManager && window.BF25BundleManager) {
          console.log('[BF25 Cart] 🚀 Using BundleManager checkout flow');

          // Validate bundle has items
          if (!window.BF25BundleManager.canCheckout()) {
            throw new Error('Add at least 4 items to checkout with bundle discounts.');
          }

          // Update button text
          this.elements.btnBuy.textContent = 'Syncing Bundle...';

          // Sync bundle to Shopify cart
          const syncResult = await window.BF25BundleManager.syncToShopifyCart();

          if (!syncResult.success) {
            throw new Error(syncResult.message || 'Failed to sync bundle to cart.');
          }

          console.log(`[BF25 Cart] ✓ Bundle synced: ${syncResult.itemCount} items + ${syncResult.giftCount} gifts`);

          // Update button before redirect
          this.elements.btnBuy.textContent = 'Redirecting...';

          // ─────────────────────────────────────────────────────────────────
          // Step 3: Redirect to checkout with discount code
          // ─────────────────────────────────────────────────────────────────
          console.log(`[BF25 Cart] Redirecting to checkout with code: ${DISCOUNT_CODE}`);

          // Set flag for Rebuy suppression on checkout page
          sessionStorage.setItem('bf25-direct-checkout', 'true');

          // Redirect with discount code
          window.location.href = `/discount/${DISCOUNT_CODE}?redirect=/checkout`;
          return;

        } else {
          // ─────────────────────────────────────────────────────────────────
          // LEGACY FLOW: Original Shopify cart-based checkout
          // Fallback when BundleManager is not available
          // ─────────────────────────────────────────────────────────────────
          console.log('[BF25 Cart] Using legacy checkout flow (no BundleManager)');

          // Validate cart state
          const validation = await this.validateCheckout();
          if (!validation) {
            throw new Error('Unable to validate cart. Please check your connection.');
          }

          const { cart, tier, itemCount } = validation;

          // Prevent checkout with empty bundle
          if (itemCount === 0) {
            throw new Error('Your bundle is empty. Please add items before checkout.');
          }

          // Reconcile tier gifts
          if (tier.gifts && tier.gifts.length > 0) {
            this.elements.btnBuy.textContent = 'Securing Gifts...';
          }

          await this.ensureGiftsInCart(tier, cart);

          // Update button before redirect
          this.elements.btnBuy.textContent = 'Redirecting...';

          // Set flag for Rebuy suppression
          sessionStorage.setItem('bf25-direct-checkout', 'true');

          // Redirect with discount code
          window.location.href = `/discount/${DISCOUNT_CODE}?redirect=/checkout`;
          return;
        }

      } catch (error) {
        // ─────────────────────────────────────────────────────────────────
        // ERROR HANDLING
        // ─────────────────────────────────────────────────────────────────
        console.error('[BF25 Cart] Checkout error:', error);

        // Show user-friendly error
        if (window.BF25Toast) {
          window.BF25Toast.show(error.message || 'Checkout failed. Please try again.', {
            type: 'error',
            duration: 5000
          });
        }

        // Reset button
        this.elements.btnBuy.textContent = originalText;
        this.elements.btnBuy.disabled = false;

        // Reset state
        this.setState('idle');

        // Announce error for screen readers
        this.announce(`Checkout error: ${error.message}`);
      }
    }

    /**
     * Validate cart state before checkout
     * @returns {Promise<{cart: Object, tier: Object, itemCount: number}|null>}
     */
    async validateCheckout() {
      // Fetch current cart (state already validated by caller)
      const cart = await this.fetchCart();
      if (!cart) {
        console.error('[BF25 Cart] Cannot checkout - failed to fetch cart');
        return null;
      }

      // Recalculate tier from cart
      const itemCount = this.calculateItemCount(cart);
      const tier = this.calculateTier(itemCount);

      console.log(`[BF25 Cart] Checkout validation: ${itemCount} items → Tier ${tier.id}`);

      return { cart, tier, itemCount };
    }

    /**
     * Reconcile gifts in cart: Add missing required gifts and remove invalid gifts (batched).
     * @param {Object} tier - Current tier object
     * @param {Object} cart - Current cart object
     * @returns {Promise<boolean>} - Success status (Throws error on failure)
     */
    async ensureGiftsInCart(tier, cart) {
      if (!tier) {
        throw new Error("Invalid tier provided for gift reconciliation.");
      }

      const requiredGifts = tier.gifts || [];
      const requiredGiftIds = new Set(requiredGifts.map(g => g.variantId));

      // Identify existing gifts in the cart using the property marker (more robust than handles)
      const existingGiftItems = cart.items.filter(item =>
        item.properties && item.properties._is_free_gift === 'true'
      );
      const existingGiftIds = new Set(existingGiftItems.map(item => item.variant_id));

      const itemsToAdd = [];
      const updates = {}; // For removals (using /cart/update.js)

      // 1. Identify missing gifts to add
      requiredGifts.forEach(gift => {
        if (!existingGiftIds.has(gift.variantId)) {
          itemsToAdd.push({
            id: gift.variantId,
            quantity: 1,
            properties: {
              '_gift_tier': String(tier.id),
              '_is_free_gift': 'true',
              '_source': 'BF25_BUNDLE_GIFT'
            }
          });
          console.log(`[BF25 Cart] Gift to add: ${gift.name} (${gift.variantId})`);
        }
      });

      // 2. Identify invalid gifts to remove (e.g., user downgraded tier)
      existingGiftItems.forEach(item => {
        if (!requiredGiftIds.has(item.variant_id)) {
          updates[item.key] = 0; // Set quantity to 0 for removal
          console.log(`[BF25 Cart] Gift to remove: ${item.title} (${item.variant_id})`);
        }
      });

      // 3. Perform Cart Operations
      try {
        // 3a. Remove invalid gifts (if any)
        if (Object.keys(updates).length > 0) {
          console.log(`[BF25 Cart] Removing ${Object.keys(updates).length} invalid gift(s)...`);
          const removeResponse = await fetch('/cart/update.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates })
          });

          if (!removeResponse.ok) {
            throw new Error('Failed to remove invalid gifts');
          }
        }

        // 3b. Add missing gifts (Batched - single API call)
        if (itemsToAdd.length > 0) {
          console.log(`[BF25 Cart] Adding ${itemsToAdd.length} gift(s) in batch...`);
          const addResponse = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsToAdd })
          });

          if (!addResponse.ok) {
            const errorData = await addResponse.json().catch(() => ({}));
            // Handle out of stock errors specifically
            if (errorData.description && errorData.description.includes("Inventory")) {
              throw new Error('One or more free gifts are out of stock.');
            }
            throw new Error(`Gift addition failed: ${errorData.description || addResponse.statusText}`);
          }

          console.log('[BF25 Cart] ✓ All gifts added successfully');
        }

        if (Object.keys(updates).length === 0 && itemsToAdd.length === 0) {
          console.log('[BF25 Cart] ✓ Gifts already reconciled - no changes needed');
        }

        return true;

      } catch (error) {
        console.error('[BF25 Cart] Failed to reconcile gifts:', error.message);
        // Re-throw the error so handleCheckout can display it to the user
        throw error;
      }
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    showEmptyState() {
      if (!this.elements.container) return;

      // Always show container
      this.elements.container.style.display = 'flex';

      // Set Tier 0
      this.updateVisualization(0);

      // Show empty state message
      this.handleEmptyState(0);

      console.log('[BF25SC Cart] Empty state displayed');
    }

    calculateTier(itemCount) {
      return this.tiers.find(t => itemCount >= t.min && itemCount <= t.max) || this.tiers[0];
    }

    getNextTier() {
      if (!this.currentTier) return null;
      const nextTierId = this.currentTier.id + 1;
      return this.tiers.find(t => t.id === nextTierId) || null;
    }

    // ============================================
    // MAIN UPDATE METHOD
    // ============================================
    updateVisualization(itemCount) {
      // Start performance tracking
      window.BF25Performance.startOperation('updateVisualization');

      // Cap visual progress at 16 for progress bar (BF25-8.5)
      // But store actual count for tier calculation
      this.actualItemCount = itemCount;
      this.itemCount = Math.min(itemCount, 16);

      // Store previous tier for comparison
      this.previousTier = this.currentTier;

      // Calculate new tier based on ACTUAL count (not visual cap)
      this.currentTier = this.calculateTier(this.actualItemCount);

      console.log(`[BF25 Cart] Update: ${this.actualItemCount} items → Tier ${this.currentTier.id} (${this.currentTier.badge})`);

      // Update all UI components
      this.updateColors();
      this.updateSegments();
      this.updateLabels();
      this.updateGifts();
      this.updateIncentiveMessage();
      this.updateSavings();
      this.updateARIA();

      // Check for tier unlock (API-first confirmation)
      if (this.previousTier && this.previousTier.id < this.currentTier.id) {
        console.log(`[BF25 Cart] New tier detected: ${this.previousTier.id} → ${this.currentTier.id}`);

        // API-FIRST: Handle unlock with confirmation
        // Unlock all intermediate tiers if user jumped multiple tiers
        for (let tier = this.previousTier.id + 1; tier <= this.currentTier.id; tier++) {
          this.handleTierUnlock(tier); // Async, non-blocking
        }
      }

      // Check for tier downgrade with toast notifications
      if (this.previousTier && this.previousTier.id > this.currentTier.id) {
        console.log(`[BF25 Cart] Tier downgrade detected: ${this.previousTier.id} → ${this.currentTier.id}`);

        // Notify user about each removed gift (from highest to lowest)
        for (let tier = this.previousTier.id; tier > this.currentTier.id; tier--) {
          this.handleTierDowngrade(tier, this.itemCount);
        }

        // Reconcile gifts in cart
        // Note: When using BundleManager, gifts are synced at checkout, not reconciled here
        if (!this.useBundleManager && typeof this.reconcileGifts === 'function') {
          this.reconcileGifts(this.currentTier);
        }
      }

      // End performance tracking
      window.BF25Performance.endOperation('updateVisualization', 50);
    }

    // ============================================
    // COLOR SYSTEM
    // ============================================
    updateColors() {
      const { color, glowColor, glow } = this.currentTier;

      if (this.elements.container) {
        // Set CSS variables
        this.elements.container.style.setProperty('--bf25sc-tier-color', color);
        this.elements.container.style.setProperty('--bf25sc-tier-glow-color', glowColor);
        this.elements.container.style.setProperty('--bf25sc-tier-glow', glow);

        // Set data attribute for tier-specific CSS
        this.elements.container.dataset.activeTier = this.currentTier.id;

        // Convert hex to RGB for border glow
        const rgb = this.hexToRgb(color);
        this.elements.container.style.setProperty(
          '--bf25sc-tier-color-rgb',
          `${rgb.r}, ${rgb.g}, ${rgb.b}`
        );
      }
    }

    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 96, g: 198, b: 85 }; // Fallback to green
    }

    // ============================================
    // SEGMENT FILLING
    // ============================================
    updateSegments() {
      this.elements.segments.forEach((segment, index) => {
        if (index < this.itemCount) {
          segment.classList.add('is-filled');
        } else {
          segment.classList.remove('is-filled');
        }
      });
    }

    // ============================================
    // LABEL UPDATES
    // ============================================
    updateLabels() {
      this.elements.tierLabels.forEach(label => {
        const labelValue = parseInt(label.dataset.value, 10);
        if (this.itemCount >= labelValue) {
          label.classList.add('is-reached');
        } else {
          label.classList.remove('is-reached');
        }
      });
    }

    // ============================================
    // GIFT UPDATES
    // ============================================
    updateGifts() {
      this.elements.giftSlots.forEach(slot => {
        const checkpoint = parseInt(slot.dataset.checkpointValue, 10);
        if (this.itemCount >= checkpoint) {
          slot.dataset.state = 'claimed';
        } else {
          slot.dataset.state = 'locked';
        }
      });
    }

    // ============================================
    // INCENTIVE MESSAGE
    // ============================================
    updateIncentiveMessage() {
      if (!this.elements.incentiveText) return;

      const nextTier = this.getNextTier();
      const needed = nextTier ? nextTier.min - this.actualItemCount : 0;

      // Use responsive message helper
      const message = this.getResponsiveMessage(nextTier, needed);
      this.elements.incentiveText.innerHTML = message;
    }

    // ============================================
    // SAVINGS CALCULATION
    // ============================================
    updateSavings() {
      if (!this.elements.savingsAmount) return;

      // Calculate total gift value
      const giftValue = this.currentTier.gifts.reduce((sum, gift) => sum + gift.value, 0);

      // Placeholder: Will calculate actual cart savings in PROMPT 2
      const savings = giftValue;

      const currencySymbol = getCurrencySymbol();
      this.elements.savingsAmount.textContent = `Save ${currencySymbol}${savings}`;
    }

    // ============================================
    // ACCESSIBILITY
    // ============================================
    updateARIA() {
      if (!this.elements.container) return;

      // Update container attributes
      this.elements.container.setAttribute('aria-label',
        `Cart progress: ${this.itemCount} items, ${this.currentTier.badge}`
      );

      // Update button aria-expanded
      if (this.elements.btnView) {
        const isExpanded = this.elements.btnView.getAttribute('aria-expanded') === 'true';
        this.elements.btnView.setAttribute('aria-expanded', isExpanded);
      }
    }

    announce(message) {
      if (!this.elements.announcer) return;
      this.elements.announcer.textContent = message;

      // Clear after 3 seconds
      setTimeout(() => {
        this.elements.announcer.textContent = '';
      }, 3000);
    }

    // ============================================
    // EXPANSION CONTROL
    // ============================================
    toggleExpansion() {
      const isExpanded = this.elements.container.classList.contains('is-expanded');

      if (isExpanded) {
        this.collapseCart();
      } else {
        this.expandCart();
      }
    }

    expandCart() {
      if (!this.elements.container) return;

      // CRITICAL: Prevent expand if cart is empty
      if (this.itemCount === 0) {
        console.log('[BF25SC Cart] Cannot expand - cart is empty');
        return;
      }

      console.log('[BF25 Cart] Expanding cart view');

      // Add expanded class
      this.elements.container.classList.add('is-expanded');

      // Update button
      if (this.elements.btnView) {
        this.elements.btnView.textContent = 'Hide ▲';
        this.elements.btnView.setAttribute('aria-expanded', 'true');
      }

      // Show expanded section
      const expanded = document.getElementById('bf25sc-expanded-cart');
      if (expanded) {
        expanded.style.display = 'block';
      }

      // Sync body padding (CLS prevention)
      document.body.style.transition = 'padding-bottom 0.3s ease-out';
      document.body.style.paddingBottom = '155px';

      // Announce to screen reader
      this.announce('Cart expanded. Viewing products.');
    }

    collapseCart() {
      if (!this.elements.container) return;

      console.log('[BF25 Cart] Collapsing cart view');

      // Remove expanded class
      this.elements.container.classList.remove('is-expanded');

      // Update button
      if (this.elements.btnView) {
        this.elements.btnView.textContent = 'View ▼';
        this.elements.btnView.setAttribute('aria-expanded', 'false');
      }

      // Hide expanded section (after transition)
      const expanded = document.getElementById('bf25sc-expanded-cart');
      if (expanded) {
        setTimeout(() => {
          if (!this.elements.container.classList.contains('is-expanded')) {
            expanded.style.display = 'none';
          }
        }, 300);
      }

      // Sync body padding
      document.body.style.paddingBottom = '65px';

      // Announce to screen reader
      this.announce('Cart collapsed');
    }

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    initKeyboardNav() {
      if (!this.elements.container) return;

      // Make container focusable for keyboard users
      this.elements.container.setAttribute('tabindex', '-1');

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Don't interfere with form inputs
        if (e.target.matches('input, textarea, select')) return;

        // 'V' key - Toggle cart view
        if (e.key === 'v' || e.key === 'V') {
          if (this.elements.btnView) {
            this.elements.btnView.click();
            e.preventDefault();
          }
        }

        // 'C' key - Go to checkout
        if (e.key === 'c' || e.key === 'C') {
          if (this.elements.btnBuy && e.shiftKey) {
            this.elements.btnBuy.click();
            e.preventDefault();
          }
        }

        // Escape key - Collapse cart if expanded
        if (e.key === 'Escape') {
          if (this.elements.container.classList.contains('is-expanded')) {
            this.collapseCart();
            e.preventDefault();
          }
        }
      });

      console.log('[BF25 Cart] Keyboard navigation enabled (V=toggle, Shift+C=checkout, Esc=collapse)');
    }

    // ============================================
    // RESPONSIVE MESSAGE OPTIMIZATION
    // ============================================
    getResponsiveMessage(nextTier, needed) {
      if (!nextTier) {
        return '<strong class="bf25sc-highlight">🎉 Maximum savings unlocked!</strong>';
      }

      const emoji = nextTier.badge.match(/[^\s]+/)[0];
      const discount = nextTier.discount;
      const lastGift = nextTier.gifts[nextTier.gifts.length - 1];
      const giftEmoji = lastGift ? lastGift.emoji : '';
      const giftName = lastGift ? lastGift.name : '';

      const viewportWidth = window.innerWidth;

      // Ultra-compact (<375px)
      if (viewportWidth < 375) {
        return `Add ${needed} → ${emoji} ${discount} + ${giftEmoji}`;
      }

      // Compact mobile (<768px)
      if (viewportWidth < 768) {
        const moreText = needed === 1 ? 'more' : 'more';
        return `Add <strong class="bf25sc-highlight">${needed} ${moreText}</strong> → <strong class="bf25sc-highlight">${emoji} ${discount}</strong> + ${giftEmoji}`;
      }

      // Desktop (768px+)
      const itemsText = needed === 1 ? 'item' : 'items';
      return `Add <strong class="bf25sc-highlight">${needed} more ${itemsText}</strong> for <strong class="bf25sc-highlight">${emoji} ${discount} OFF</strong> + <strong class="bf25sc-highlight">${giftName}</strong>`;
    }

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================
    measurePerformance(operation, callback) {
      const startTime = performance.now();
      const result = callback();
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 50) {
        console.warn(`[BF25 Cart] Performance: ${operation} took ${duration.toFixed(2)}ms (target: <50ms)`);
      }

      return result;
    }

    // ============================================
    // ERROR HANDLING
    // ============================================
    handleError(error, context) {
      console.error(`[BF25 Cart] Error in ${context}:`, error);

      // Set error state
      if (this.elements.container) {
        this.elements.container.dataset.state = 'error';
      }

      // Announce to screen reader
      this.announce(`Error updating cart. Please refresh the page.`);

      // Retry logic (exponential backoff)
      if (!this.retryCount) this.retryCount = 0;

      if (this.retryCount < 3) {
        this.retryCount++;
        const delay = Math.pow(2, this.retryCount) * 1000; // 2s, 4s, 8s

        console.log(`[BF25 Cart] Retrying in ${delay}ms (attempt ${this.retryCount}/3)`);

        setTimeout(() => {
          if (!this.useBundleManager) {
            this.syncCart();
          }
        }, delay);
      } else {
        console.error('[BF25 Cart] Max retries reached, giving up');
        this.retryCount = 0;
      }

      // Auto-recover after 5 seconds
      setTimeout(() => {
        if (this.elements.container) {
          this.elements.container.dataset.state = 'idle';
        }
      }, 5000);
    }

    // ============================================
    // VIEWPORT CHANGE HANDLER
    // ============================================
    handleViewportChange() {
      // Debounce resize events
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          // Re-render incentive message for new viewport
          this.updateIncentiveMessage();
          console.log('[BF25 Cart] Viewport changed, UI updated');
        }, 150);
      });
    }

    // ============================================
    // SHOPIFY CART API INTEGRATION
    // ============================================

    /**
     * Fetch current cart data from Shopify
     */
    async fetchCart() {
      try {
        const response = await fetch('/cart.js', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Cart fetch failed: ${response.status}`);
        }

        const cart = await response.json();
        console.log('[BF25 Cart] Fetched cart:', cart);
        return cart;

      } catch (error) {
        this.handleError(error, 'fetchCart');
        return null;
      }
    }

    /**
     * Calculate non-gift item count
     * Excludes items marked with _is_free_gift property.
     * @param {Object} cart - Cart object from Shopify
     * @returns {number} - Count of non-gift items
     */
    calculateItemCount(cart) {
      if (!cart || !cart.items) return 0;

      let count = 0;
      cart.items.forEach(item => {
        // Skip items marked as free gifts via properties (more robust than handle matching)
        const isGift = item.properties && item.properties._is_free_gift === 'true';

        if (!isGift) {
          count += item.quantity;
        }
      });

      return count;
    }

    /**
     * Calculate cart subtotal (excluding gifts)
     * @param {Object} cart - Cart object from Shopify
     * @returns {number} - Subtotal in euros
     */
    calculateSubtotal(cart) {
      if (!cart || !cart.items) return 0;

      let subtotal = 0;
      cart.items.forEach(item => {
        // Skip items marked as free gifts via properties
        const isGift = item.properties && item.properties._is_free_gift === 'true';

        if (!isGift) {
          subtotal += item.final_line_price;
        }
      });

      return subtotal / 100; // Convert cents to euros
    }

    /**
     * Calculate actual savings (discount + gift value)
     */
    calculateSavings(cart) {
      if (!cart || !cart.items) return 0;

      const subtotal = this.calculateSubtotal(cart);
      const itemCount = this.calculateItemCount(cart);
      const tier = this.calculateTier(itemCount);

      // Discount savings (if tier has multiplier)
      let discountSavings = 0;
      if (tier.multiplier) {
        const fullPrice = subtotal / tier.multiplier; // Reverse calculate full price
        discountSavings = fullPrice - subtotal;
      }

      // Gift value savings (handle tiers without gifts array)
      const giftValue = (tier.gifts || []).reduce((sum, gift) => sum + gift.value, 0);

      return Math.round(discountSavings + giftValue);
    }

    // ============================================
    // CART PERSISTENCE (localStorage Cache)
    // ============================================

    /**
     * Load cart state from localStorage for instant render
     */
    loadCachedState() {
      try {
        const cached = localStorage.getItem('bf25sc_cart_cache');
        if (!cached) return null;

        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;

        // Cache valid for 30 seconds
        if (age < 30000) {
          console.log('[BF25 Cart] Using cached state (age: ' + Math.round(age / 1000) + 's)');
          return data;
        }

        // Clear expired cache
        console.log('[BF25 Cart] Cache expired, clearing');
        localStorage.removeItem('bf25sc_cart_cache');
        return null;
      } catch (error) {
        console.warn('[BF25 Cart] Cache load failed:', error);
        return null;
      }
    }

    /**
     * Save cart state to localStorage
     */
    saveCachedState(itemCount, savings) {
      try {
        const data = {
          itemCount: itemCount,
          savings: savings,
          timestamp: Date.now()
        };
        localStorage.setItem('bf25sc_cart_cache', JSON.stringify(data));
        console.log('[BF25 Cart] State cached:', itemCount, 'items, €' + savings, 'savings');
      } catch (error) {
        console.warn('[BF25 Cart] Cache save failed:', error);
      }
    }

    /**
     * Sync cart data and update UI
     */
    async syncCart() {
      console.log('[BF25 Cart] Syncing with Shopify cart...');

      // Start performance tracking
      window.BF25Performance.startOperation('cartSync');

      // Set loading state
      this.setState('syncing');

      try {
        // Fetch cart
        const cart = await this.fetchCart();

        if (!cart) {
          throw new Error('Failed to fetch cart');
        }

        // Calculate counts
        const itemCount = this.calculateItemCount(cart);
        const savings = this.calculateSavings(cart);

        console.log(`[BF25 Cart] Sync complete: ${itemCount} items, €${savings} savings`);

        // Update visualization
        this.updateVisualization(itemCount);

        // Update savings display
        if (this.elements.savingsAmount) {
          const currencySymbol = getCurrencySymbol(cart);
          this.elements.savingsAmount.textContent = `Save ${currencySymbol}${savings}`;
        }

        // Render products in expanded view
        this.renderProducts(cart);

        // Show/hide cart based on items
        this.handleEmptyState(itemCount);

        // Save to cache for next page load
        this.saveCachedState(itemCount, savings);

        // Set idle state
        this.setState('idle');

        // End performance tracking
        window.BF25Performance.endOperation('cartSync', 100);

        return { itemCount, savings };

      } catch (error) {
        this.handleError(error, 'syncCart');
        this.setState('error');

        window.BF25Performance.endOperation('cartSync');

        return null;
      }
    }

    /**
     * Handle empty cart state
     */
    handleEmptyState(itemCount) {
      if (!this.elements.container) return;

      if (itemCount === 0) {
        // Show empty state
        this.elements.container.style.display = 'flex';
        this.elements.container.classList.add('is-empty');
        this.showEmptyStateMessage();

        // CRITICAL: Collapse cart if expanded
        if (this.elements.container.classList.contains('is-expanded')) {
          console.log('[BF25SC Cart] Collapsing expanded cart (empty state)');
          this.collapseCart();
        }

        // Disable buttons
        if (this.elements.btnView) {
          this.elements.btnView.disabled = true;
          this.elements.btnView.style.opacity = '0.5';
          this.elements.btnView.style.cursor = 'not-allowed';
        }

        if (this.elements.btnBuy) {
          this.elements.btnBuy.disabled = true;
          this.elements.btnBuy.style.opacity = '0.5';
          this.elements.btnBuy.style.cursor = 'not-allowed';
        }

        console.log('[BF25SC Cart] Empty state active');

      } else {
        // Show normal cart
        this.elements.container.style.display = 'flex';
        this.elements.container.classList.remove('is-empty');
        this.hideEmptyStateMessage();

        // Re-enable buttons
        if (this.elements.btnView) {
          this.elements.btnView.disabled = false;
          this.elements.btnView.style.opacity = '1';
          this.elements.btnView.style.cursor = 'pointer';
        }

        if (this.elements.btnBuy) {
          this.elements.btnBuy.disabled = false;
          this.elements.btnBuy.style.opacity = '1';
          this.elements.btnBuy.style.cursor = 'pointer';
        }

        console.log('[BF25SC Cart] Cart active (has items)');
      }
    }

    /**
     * Show empty state message
     */
    showEmptyStateMessage() {
      // Hide progress bar
      const progressWrapper = this.elements.container.querySelector('.bf25sc-sticky-cart__progress-wrapper');
      if (progressWrapper) {
        progressWrapper.style.display = 'none';
      }

      // Update incentive text
      if (this.elements.incentiveText) {
        this.elements.incentiveText.innerHTML = 'Your cart is empty - Add <strong class="bf25sc-highlight">4 items</strong> to unlock <strong class="bf25sc-highlight">🔥 60% OFF</strong>!';
      }

      // Update savings
      if (this.elements.savingsAmount) {
        const currencySymbol = getCurrencySymbol();
        this.elements.savingsAmount.textContent = `Save ${currencySymbol}0`;
      }

      // Disable buttons
      if (this.elements.btnView) {
        this.elements.btnView.disabled = true;
        this.elements.btnView.style.opacity = '0.5';
        this.elements.btnView.style.cursor = 'not-allowed';
      }

      if (this.elements.btnBuy) {
        this.elements.btnBuy.disabled = true;
        this.elements.btnBuy.style.opacity = '0.5';
        this.elements.btnBuy.style.cursor = 'not-allowed';
      }
    }

    /**
     * Hide empty state message (return to normal)
     */
    hideEmptyStateMessage() {
      // Show progress bar
      const progressWrapper = this.elements.container.querySelector('.bf25sc-sticky-cart__progress-wrapper');
      if (progressWrapper) {
        progressWrapper.style.display = 'flex';
      }

      // Enable buttons
      if (this.elements.btnView) {
        this.elements.btnView.disabled = false;
        this.elements.btnView.style.opacity = '1';
        this.elements.btnView.style.cursor = 'pointer';
      }

      if (this.elements.btnBuy) {
        this.elements.btnBuy.disabled = false;
        this.elements.btnBuy.style.opacity = '1';
        this.elements.btnBuy.style.cursor = 'pointer';
      }

      // Incentive message will be updated by updateIncentiveMessage()
    }

    /**
     * Set manager state
     */
    setState(newState) {
      this.state = newState;

      if (this.elements.container) {
        this.elements.container.dataset.state = newState;
      }

      console.log(`[BF25 Cart] State: ${newState}`);
    }

    // ============================================
    // GIFT MANAGEMENT
    // ============================================

    // Old addGiftToCart method removed - now using batched gift addition in ensureGiftsInCart

    /**
     * Handle tier unlock with API-first confirmation
     * @param {number} tier - Tier that was unlocked
     */
    async handleTierUnlock(tier) {
      console.log(`[BF25 Cart] 🎯 Tier ${tier} threshold reached - starting API-first unlock`);

      // Get tier configuration
      const tierConfig = BF25_TIERS.find(t => t.id === tier);
      if (!tierConfig || !tierConfig.gifts || tierConfig.gifts.length === 0) {
        console.error(`[BF25 Cart] No gifts configured for tier ${tier}`);
        return;
      }

      // Get the last gift for this tier (the newly unlocked one)
      const newGift = tierConfig.gifts[tierConfig.gifts.length - 1];
      if (!newGift.variantId) {
        console.error(`[BF25 Cart] Gift missing variantId for tier ${tier}`);
        return;
      }

      // Show loading indicator if API takes >500ms
      const loadingTimeout = setTimeout(() => {
        this.showLoadingIndicator(tier);
      }, 500);

      // Performance monitoring
      console.time(`[BF25 Cart] Tier ${tier} API confirmation`);

      try {
        // Skip legacy gift handling when using BundleManager
        // Gifts are added during checkout sync, not immediately
        if (this.useBundleManager) {
          console.log(`[BF25 Cart] Skipping legacy gift add (BundleManager handles gifts at checkout)`);

          // Clear loading indicator
          clearTimeout(loadingTimeout);
          this.hideLoadingIndicator(tier);

          console.timeEnd(`[BF25 Cart] Tier ${tier} API confirmation`);

          // Just trigger animation
          if (this.giftAnimator) {
            console.log(`[BF25 Cart] ✓ Triggering celebration for tier ${tier}`);
            this.giftAnimator.animate(tier);
          }
          return;
        }

        // Legacy flow: Add gift to Shopify cart immediately
        console.warn('[BF25 Cart] Using legacy flow - addGiftToCart method has been removed');
        console.warn('[BF25 Cart] Gifts should be handled by BundleManager at checkout');

        // Clear loading indicator
        clearTimeout(loadingTimeout);
        this.hideLoadingIndicator(tier);

        console.timeEnd(`[BF25 Cart] Tier ${tier} API confirmation`);

        // Trigger animation anyway
        if (this.giftAnimator) {
          this.giftAnimator.animate(tier);
        }

      } catch (error) {
        clearTimeout(loadingTimeout);
        this.hideLoadingIndicator(tier);
        console.error(`[BF25 Cart] Tier ${tier} unlock error:`, error);
      }
    }

    /**
     * Handle tier downgrade with toast notification
     * @param {number} tier - Tier that was lost
     * @param {number} currentItemCount - Current cart item count
     */
    handleTierDowngrade(tier, currentItemCount) {
      console.log(`[BF25 Cart] Handling tier ${tier} downgrade (current items: ${currentItemCount})`);

      // Get tier data
      const tierData = BF25_TIERS[tier];
      if (!tierData) {
        console.warn(`[BF25 Cart] No tier data found for tier ${tier}`);
        return;
      }

      // Get gift product info
      const giftProducts = {
        1: { title: 'Free USB-C Cable', emoji: '🔌' },
        2: { title: 'Free Protective Case', emoji: '📦' },
        3: { title: 'Free Magnetic Set', emoji: '🧲' },
        4: { title: 'Free Mystery Box', emoji: '🎁' }
      };

      const giftProduct = giftProducts[tier];
      if (!giftProduct) {
        console.warn(`[BF25 Cart] No gift product found for tier ${tier}`);
        return;
      }

      // Calculate items needed to re-unlock
      const itemsNeeded = tierData.min - currentItemCount;

      // Build toast message
      const primaryMessage = `Gift removed: ${giftProduct.title}`;
      const secondaryMessage = itemsNeeded > 0
        ? `Add <strong>${itemsNeeded}</strong> more item${itemsNeeded === 1 ? '' : 's'} to unlock <strong>${tierData.badge}</strong>`
        : null;

      // Show toast notification
      if (window.BF25Toast) {
        window.BF25Toast.show(primaryMessage, {
          secondary: secondaryMessage,
          icon: giftProduct.emoji,
          tier: tier,
          type: 'info',
          duration: 2000
        });

        console.log(`[BF25 Cart] Toast shown for tier ${tier} downgrade`);
      }

      // Remove from celebrated tiers (allow re-celebration if unlocked again)
      if (this.giftAnimator) {
        this.giftAnimator.celebratedTiers.delete(tier);
        this.giftAnimator.saveCelebratedTiers();
        console.log(`[BF25 Cart] Tier ${tier} removed from celebrated tiers`);
      }

      // Reset gift slot visual state to locked
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (slot) {
        slot.dataset.state = 'locked';
        slot.classList.remove('is-unlocked', 'is-celebrating', 'is-flashing');
        console.log(`[BF25 Cart] Gift slot ${checkpoint} reset to locked state`);
      }
    }

    /**
     * Show pulsing loading indicator on gift icon
     */
    showLoadingIndicator(tier) {
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (slot) {
        slot.classList.add('is-loading');
        console.log(`[BF25 Cart] Loading indicator shown for tier ${tier}`);
      }
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator(tier) {
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (slot) {
        slot.classList.remove('is-loading');
        console.log(`[BF25 Cart] Loading indicator hidden for tier ${tier}`);
      }
    }

    /**
     * Get checkpoint value for tier (helper)
     */
    getCheckpointForTier(tier) {
      const checkpoints = { 1: 4, 2: 8, 3: 12, 4: 16 };
      return checkpoints[tier] || 4;
    }

    /**
     * Initialize GiftAnimator
     */
    initGiftAnimator() {
      this.giftAnimator = new GiftAnimator();
      console.log('[BF25 Cart] GiftAnimator initialized');
    }

    /**
     * Initialize ConfettiSystem
     */
    initConfettiSystem() {
      window.BF25Confetti = new ConfettiSystem();
      console.log('[BF25 Cart] ConfettiSystem initialized');
    }

    // Dead code removed - old GIFT_PRODUCTS methods no longer needed
    // Gift management now uses variantId directly from BF25_TIERS configuration

    // ============================================
    // EXPANDED CART VIEW
    // ============================================

    /**
     * Render products in expanded view
     */
    renderProducts(cart) {
      const scrollContainer = document.getElementById('bf25sc-product-scroll');
      const emptyState = document.getElementById('bf25sc-expanded-empty');

      if (!scrollContainer) return;

      // Clear existing products
      scrollContainer.innerHTML = '';

      if (!cart || !cart.items || cart.items.length === 0) {
        // Show empty state
        if (emptyState) emptyState.style.display = 'flex';
        return;
      }

      // Hide empty state
      if (emptyState) emptyState.style.display = 'none';

      // Gift product handles
      const giftHandles = [
        'bf25sc-free-cable',
        'bf25sc-free-case',
        'bf25sc-free-magnetic-set',
        'bf25sc-free-mystery-box'
      ];

      // Render each product
      cart.items.forEach(item => {
        const isGift = giftHandles.some(handle =>
          item.handle && item.handle.includes(handle)
        );

        const card = this.createProductCard(item, isGift);
        scrollContainer.appendChild(card);
      });

      console.log(`[BF25 Cart] Rendered ${cart.items.length} products in expanded view`);
    }

    /**
     * Create product card element
     */
    createProductCard(item, isGift) {
      const card = document.createElement('div');
      card.className = `bf25sc-product-card${isGift ? ' bf25sc-product-card--gift' : ''}`;
      card.dataset.variantId = item.variant_id;
      card.dataset.key = item.key;

      // Thumbnail
      const thumbnail = document.createElement('img');
      thumbnail.className = 'bf25sc-product-card__thumbnail';
      thumbnail.src = item.featured_image?.url || item.image || '';
      thumbnail.alt = item.product_title || 'Product';
      thumbnail.loading = 'lazy';
      card.appendChild(thumbnail);

      // Quantity Badge
      if (!isGift) {
        const quantity = document.createElement('div');
        quantity.className = 'bf25sc-product-card__quantity';
        quantity.textContent = item.quantity;
        card.appendChild(quantity);
      }

      // FREE Badge (for gifts)
      if (isGift) {
        const badge = document.createElement('div');
        badge.className = 'bf25sc-product-card__gift-badge';
        badge.textContent = 'FREE';
        card.appendChild(badge);
      }

      // Remove Button (not for gifts)
      if (!isGift) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'bf25sc-product-card__remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${item.product_title}`);
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.removeProduct(item.key);
        });
        card.appendChild(removeBtn);
      }

      return card;
    }

    /**
     * Remove product from cart
     */
    async removeProduct(itemKey) {
      console.log(`[BF25 Cart] Removing product: ${itemKey}`);

      // Set loading state
      this.setState('syncing');

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: itemKey,
            quantity: 0
          })
        });

        if (!response.ok) {
          throw new Error(`Remove failed: ${response.status}`);
        }

        console.log(`[BF25 Cart] ✓ Product removed`);

        // Trigger cart:updated event
        document.dispatchEvent(new CustomEvent('cart:updated'));

        // Sync cart (only for legacy flow, BundleManager uses events)
        if (!this.useBundleManager) {
          await this.syncCart();
        }

      } catch (error) {
        this.handleError(error, 'removeProduct');
      }
    }

    // ============================================
    // CART EVENT LISTENERS
    // ============================================

    /**
     * Initialize cart event listeners
     */
    initCartListeners() {
      console.log('[BF25 Cart] Initializing cart listeners...');

      // Listen for Shopify theme cart updates
      document.addEventListener('cart:updated', () => {
        console.log('[BF25 Cart] Event: cart:updated');
        this.debouncedSync();
      });

      // Listen for custom events (if your theme uses them)
      document.addEventListener('cart-drawer:updated', () => {
        console.log('[BF25 Cart] Event: cart-drawer:updated');
        this.debouncedSync();
      });

      // Listen for Rebuy updates (if Rebuy is installed)
      if (window.Rebuy) {
        document.addEventListener('rebuy:cart.change', () => {
          console.log('[BF25 Cart] Event: rebuy:cart.change');
          this.debouncedSync();
        });
      }

      // Fallback: Poll every 5 seconds (safety net)
      // ONLY for legacy Shopify API flow, not BundleManager
      setInterval(() => {
        if (this.state === 'idle' && !this.useBundleManager) {
          this.syncCart();
        }
      }, 5000);

      console.log('[BF25 Cart] ✓ Listeners active');
    }

    /**
     * Debounced sync (prevents rapid API calls)
     */
    debouncedSync() {
      // Skip if using BundleManager (events handle updates)
      if (this.useBundleManager) {
        return;
      }

      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncCart();
      }, 200); // 200ms debounce
    }

    // ============================================
    // DEMO FUNCTION (For Testing)
    // ============================================
    demo() {
      console.log('[BF25 Cart] 🎬 Running demo sequence...');

      const sequence = [0, 2, 4, 6, 8, 10, 12, 14, 16];
      let index = 0;

      const interval = setInterval(() => {
        const count = sequence[index];
        this.updateVisualization(count);
        console.log(`[BF25 Cart] Demo step ${index + 1}/${sequence.length}: ${count} items`);

        index++;

        if (index >= sequence.length) {
          clearInterval(interval);
          console.log('[BF25 Cart] ✓ Demo complete');
          this.announce('Demo complete');
        }
      }, 1500);

      return interval;
    }
  }

  // ============================================
  // AUTO-INITIALIZATION
  // ============================================
  function initCartManager() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.BF25Cart = new CartManager();
      });
    } else {
      window.BF25Cart = new CartManager();
    }
  }

  // Initialize
  initCartManager();

  // ============================================
  // GLOBAL DEMO FUNCTION
  // ============================================
  window.runBF25Demo = function() {
    if (!window.BF25Cart) {
      console.error('[BF25 Cart] CartManager not initialized');
      return;
    }
    return window.BF25Cart.demo();
  };

  // ============================================
  // CONSOLE BANNER
  // ============================================
  console.log('%c🚀 BF25 Sticky Cart %cv1.0',
    'background: #60c655; color: #000; font-weight: bold; padding: 4px 8px;',
    'color: #60c655; font-weight: normal;'
  );
  console.log('%cRun: window.runBF25Demo()', 'color: #60c655;');

  // Performance monitoring commands
  console.log('%c🎯 Performance Monitoring Active', 'color: #60c655; font-weight: bold;');
  console.log('%cCommands:', 'color: #60c655;');
  console.log('  window.BF25Performance.report() - View performance dashboard');
  console.log('  window.BF25Performance.reset() - Reset metrics');

})();
