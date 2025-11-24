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
      // Skip if already celebrated this session
      if (this.celebratedTiers.has(tier)) {
        console.log(`[GiftAnimator] Tier ${tier} already celebrated (skipping)`);
        return;
      }

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
                this.celebratedTiers.add(tier);
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
     * Execute 6-frame animation sequence
     */
    async executeSequence(tier) {
      // Find gift slot for this tier
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25sc-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (!slot) {
        console.error(`[GiftAnimator] No slot found for tier ${tier}`);
        return;
      }

      // Performance monitoring
      window.BF25Performance.startOperation(`giftAnimation-tier${tier}`);
      window.BF25Performance.startFPSTracking(`tier-${tier}-unlock`);
      console.time(`[GiftAnimator] Tier ${tier} animation`);
      console.log(`[GiftAnimator] Starting optimized sequence for tier ${tier} (1.8s target)`);

      // Add animating class
      slot.classList.add('is-animating');

      // FRAME 2: Energize (0.3s) - OPTIMIZED from 0.4s
      slot.classList.add('is-unlocking');
      await this.wait(300);
      slot.classList.remove('is-unlocking');

      // FRAME 3: Morph/Burst (0.3s) - OPTIMIZED from 0.4s
      slot.classList.add('is-revealing');
      await this.wait(300);
      slot.classList.remove('is-revealing');

      // FRAME 4: Celebration Peak + Value Flash (0.9s total) - UNCHANGED
      slot.classList.add('is-celebrating');

      // Brief pause before Value Flash
      await this.wait(100);

      // Trigger Value Flash + Announcement
      this.announceGift(tier);
      slot.classList.add('is-flashing');
      console.log(`[GiftAnimator] Value Flash + Confetti triggered for tier ${tier}`);

      // Stagger confetti slightly after Value Flash
      await this.wait(200);
      this.triggerConfetti(tier, checkpoint);

      // Wait for Value Flash to complete (900ms total for Frame 4)
      await this.wait(600);

      slot.classList.remove('is-celebrating');
      slot.classList.remove('is-flashing');

      // FRAME 5: Settle (0.3s) - UNCHANGED
      slot.classList.add('is-settling');
      await this.wait(300);
      slot.classList.remove('is-settling');

      // FRAME 6: Claimed (instant)
      slot.dataset.state = 'claimed';
      slot.classList.remove('is-animating');

      console.timeEnd(`[GiftAnimator] Tier ${tier} animation`);

      // Stop performance tracking
      const fps = window.BF25Performance.stopFPSTracking();
      const duration = window.BF25Performance.endOperation(`giftAnimation-tier${tier}`, 1800);

      console.log(`[GiftAnimator] ✓ Complete - FPS: ${fps.toFixed(1)}, Duration: ${duration.toFixed(0)}ms`);
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

      // Configuration
      this.tiers = BF25_TIERS;
      this.maxItems = 16;

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
          this.elements.savingsAmount.textContent = `Save €${cachedState.savings}`;
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

      // Sync cart on load (will update cached data with fresh API data)
      this.syncCart();

      console.log('[BF25 Cart] ✓ Ready');
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
     * Handle checkout with gift validation and addition
     */
    async handleCheckout() {
      // Prevent double-click
      if (this.state !== 'idle') {
        console.warn('[BF25 Cart] Checkout already in progress');
        return;
      }

      // Update state
      this.setState('syncing');

      // Verify button element exists
      if (!this.elements?.btnBuy) {
        console.error('[BF25 Cart] Buy button element not found');
        this.setState('idle');
        return;
      }

      // Show loading indicator
      const originalText = this.elements.btnBuy.textContent;
      this.elements.btnBuy.textContent = 'Processing...';
      this.elements.btnBuy.disabled = true;

      try {
        // Step 1: Validate cart state
        const validation = await this.validateCheckout();
        if (!validation) {
          throw new Error('Checkout validation failed');
        }

        const { cart, tier } = validation;

        // Step 2: Ensure tier gifts are in cart
        const giftsAdded = await this.ensureGiftsInCart(tier, cart);
        if (!giftsAdded) {
          throw new Error('Failed to add tier gifts');
        }

        // Step 3: Navigate to checkout
        console.log('[BF25 Cart] Proceeding to checkout');
        window.location.href = '/checkout';

      } catch (error) {
        console.error('[BF25 Cart] Checkout error:', error);

        // Show error toast to user
        if (window.BF25Toast) {
          window.BF25Toast.show(
            'Unable to proceed to checkout. Please try again.',
            'error',
            5000
          );
        }

        // Reset button state
        this.elements.btnBuy.textContent = originalText;
        this.elements.btnBuy.disabled = false;
        this.setState('idle');
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
     * Ensure all tier gifts are in cart before checkout
     * @param {Object} tier - Current tier object
     * @param {Object} cart - Current cart object
     * @returns {Promise<boolean>} - Success status
     */
    async ensureGiftsInCart(tier, cart) {
      // No gifts for this tier
      if (!tier || !tier.gifts || tier.gifts.length === 0) {
        console.log('[BF25 Cart] No gifts required for this tier');
        return true;
      }

      // Map gift names to handles
      const giftHandleMap = {
        'cable': 'bf25sc-free-cable',
        'case': 'bf25sc-free-case',
        'magnetic': 'bf25sc-free-magnetic-set',
        'magnetic set': 'bf25sc-free-magnetic-set',
        'mystery': 'bf25sc-free-mystery-box',
        'mystery box': 'bf25sc-free-mystery-box'
      };

      // Check which tier gifts are missing
      const missingGifts = [];

      for (const gift of tier.gifts) {
        const giftName = gift.name.toLowerCase();
        let handle = null;

        // Find matching handle
        for (const [key, value] of Object.entries(giftHandleMap)) {
          if (giftName.includes(key)) {
            handle = value;
            break;
          }
        }

        if (!handle) {
          console.warn(`[BF25 Cart] Unknown gift name: ${gift.name}`);
          continue;
        }

        // Check if gift is already in cart
        const giftInCart = cart.items.some(item =>
          item.handle && item.handle.includes(handle)
        );

        if (!giftInCart) {
          missingGifts.push({ handle, name: gift.name });
        }
      }

      // Add missing gifts
      if (missingGifts.length > 0) {
        console.log(`[BF25 Cart] Adding ${missingGifts.length} missing gift(s) before checkout:`, missingGifts.map(g => g.name));

        for (const gift of missingGifts) {
          const success = await this.addGiftToCart(gift.handle, tier.id);
          if (!success) {
            console.error(`[BF25 Cart] Failed to add gift: ${gift.name} (${gift.handle})`);
            return false;
          }
        }

        console.log('[BF25 Cart] All missing gifts added successfully');
      } else {
        console.log('[BF25 Cart] All tier gifts already in cart');
      }

      return true;
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

      // Clamp to max items
      this.itemCount = Math.min(itemCount, this.maxItems);

      // Store previous tier for comparison
      this.previousTier = this.currentTier;

      // Calculate new tier
      this.currentTier = this.calculateTier(this.itemCount);

      console.log(`[BF25 Cart] Update: ${this.itemCount} items → Tier ${this.currentTier.id} (${this.currentTier.badge})`);

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
        this.reconcileGifts(this.currentTier);
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
      const needed = nextTier ? nextTier.min - this.itemCount : 0;

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

      this.elements.savingsAmount.textContent = `Save €${savings}`;
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
          this.syncCart();
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
     * Excludes any items with 'BF25-Gift' tag or in gift list
     */
    calculateItemCount(cart) {
      if (!cart || !cart.items) return 0;

      // Gift product handles (to be excluded from count)
      const giftHandles = [
        'bf25sc-free-cable',
        'bf25sc-free-case',
        'bf25sc-free-magnetic-set',
        'bf25sc-free-mystery-box'
      ];

      let count = 0;
      cart.items.forEach(item => {
        // Skip gift items
        const isGift = giftHandles.some(handle =>
          item.handle && item.handle.includes(handle)
        );

        if (!isGift) {
          count += item.quantity;
        }
      });

      return count;
    }

    /**
     * Calculate cart subtotal (excluding gifts)
     */
    calculateSubtotal(cart) {
      if (!cart || !cart.items) return 0;

      const giftHandles = [
        'bf25sc-free-cable',
        'bf25sc-free-case',
        'bf25sc-free-magnetic-set',
        'bf25sc-free-mystery-box'
      ];

      let subtotal = 0;
      cart.items.forEach(item => {
        const isGift = giftHandles.some(handle =>
          item.handle && item.handle.includes(handle)
        );

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

      // Gift value savings
      const giftValue = tier.gifts.reduce((sum, gift) => sum + gift.value, 0);

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
          this.elements.savingsAmount.textContent = `Save €${savings}`;
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
        this.elements.savingsAmount.textContent = 'Save €0';
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

    /**
     * Add a specific gift product to cart via Shopify API
     * @param {string} handle - Product handle (e.g., 'bf25sc-free-cable')
     * @param {number} tier - Tier number for logging
     * @returns {Promise<boolean>} - Success status
     */
    async addGiftToCart(handle, tier) {
      console.log(`[BF25 Cart] API: Adding gift for tier ${tier} (${handle})`);

      const maxRetries = 3;
      const baseDelay = 100; // Start with 100ms

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Fetch product to get variant ID
          const productResponse = await fetch(`/products/${handle}.js`);

          if (!productResponse.ok) {
            throw new Error(`Product fetch failed: ${productResponse.status}`);
          }

          const product = await productResponse.json();

          if (!product.variants || product.variants.length === 0) {
            throw new Error('No variants found for gift product');
          }

          const variantId = product.variants[0].id;

          // Add to cart with quantity 1
          const addResponse = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: variantId,
              quantity: 1,
              properties: {
                '_gift_tier': tier,
                '_is_free_gift': 'true'
              }
            })
          });

          if (!addResponse.ok) {
            const errorData = await addResponse.json();
            throw new Error(`Cart add failed: ${errorData.description || addResponse.status}`);
          }

          const result = await addResponse.json();
          console.log(`[BF25 Cart] ✓ Gift added successfully (tier ${tier}): ${result.product_title}`);

          return true; // Success!

        } catch (error) {
          console.warn(`[BF25 Cart] Gift add attempt ${attempt}/${maxRetries} failed:`, error.message);

          if (attempt < maxRetries) {
            // Exponential backoff: 100ms, 300ms, 900ms
            const delay = baseDelay * Math.pow(3, attempt - 1);
            console.log(`[BF25 Cart] Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            // All retries exhausted
            console.error(`[BF25 Cart] ✗ Failed to add gift after ${maxRetries} attempts`);
            return false;
          }
        }
      }

      return false;
    }

    /**
     * Handle tier unlock with API-first confirmation
     * @param {number} tier - Tier that was unlocked
     */
    async handleTierUnlock(tier) {
      console.log(`[BF25 Cart] 🎯 Tier ${tier} threshold reached - starting API-first unlock`);

      // Get gift handle for this tier
      const giftHandles = {
        1: 'bf25sc-free-cable',
        2: 'bf25sc-free-case',
        3: 'bf25sc-free-magnetic-set',
        4: 'bf25sc-free-mystery-box'
      };

      const handle = giftHandles[tier];
      if (!handle) {
        console.error(`[BF25 Cart] No gift handle configured for tier ${tier}`);
        return;
      }

      // Show loading indicator if API takes >500ms
      const loadingTimeout = setTimeout(() => {
        this.showLoadingIndicator(tier);
      }, 500);

      // Performance monitoring
      console.time(`[BF25 Cart] Tier ${tier} API confirmation`);

      try {
        // API-FIRST: Add gift to cart
        const success = await this.addGiftToCart(handle, tier);

        // Clear loading indicator
        clearTimeout(loadingTimeout);
        this.hideLoadingIndicator(tier);

        console.timeEnd(`[BF25 Cart] Tier ${tier} API confirmation`);

        if (success) {
          // API CONFIRMED: Now celebrate!
          console.log(`[BF25 Cart] ✓ API confirmed - triggering celebration for tier ${tier}`);

          if (this.giftAnimator) {
            this.giftAnimator.animate(tier);
          }

          // Sync cart to update UI with new gift
          await this.syncCart();

        } else {
          // API FAILED: Silent degradation
          console.warn(`[BF25 Cart] ✗ API failed - no celebration for tier ${tier}`);

          // Update incentive message to encourage retry
          if (this.elements.incentiveText) {
            const tierData = BF25_TIERS[tier];
            this.elements.incentiveText.innerHTML =
              `Add items to unlock <strong class="bf25sc-highlight">${tierData.badge}</strong>`;
          }
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

    /**
     * Get required gifts for current tier
     */
    getRequiredGifts(tier) {
      const giftKeys = {
        1: ['cable'],
        2: ['cable', 'case'],
        3: ['cable', 'case', 'magnetic'],
        4: ['cable', 'case', 'magnetic', 'mystery']
      };
      return giftKeys[tier] || [];
    }

    /**
     * Fetch product variant ID by handle
     */
    async fetchVariantId(handle) {
      try {
        const response = await fetch(`/products/${handle}.js`);
        if (!response.ok) return null;

        const product = await response.json();
        return product.variants && product.variants[0]
          ? product.variants[0].id
          : null;

      } catch (error) {
        console.error(`[BF25 Cart] Failed to fetch variant for ${handle}:`, error);
        return null;
      }
    }

    /**
     * Add gift to cart
     */
    async addGiftToCart(giftKey) {
      const gift = GIFT_PRODUCTS[giftKey];
      if (!gift) {
        console.error(`[BF25 Cart] Unknown gift: ${giftKey}`);
        return false;
      }

      console.log(`[BF25 Cart] Adding gift: ${gift.name}`);

      try {
        // Fetch variant ID if not cached
        if (!gift.variantId) {
          gift.variantId = await this.fetchVariantId(gift.handle);
          if (!gift.variantId) {
            console.error(`[BF25 Cart] Variant not found for ${gift.handle}`);
            return false;
          }
        }

        // Add to cart
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: gift.variantId,
            quantity: 1,
            properties: {
              '_bf25_gift': 'true',
              '_bf25_tier': gift.tier
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to add gift: ${response.status}`);
        }

        console.log(`[BF25 Cart] ✓ Gift added: ${gift.name}`);
        return true;

      } catch (error) {
        console.error(`[BF25 Cart] Error adding gift ${gift.name}:`, error);
        return false;
      }
    }

    /**
     * Remove gift from cart
     */
    async removeGiftFromCart(giftKey) {
      const gift = GIFT_PRODUCTS[giftKey];
      if (!gift) return false;

      console.log(`[BF25 Cart] Removing gift: ${gift.name}`);

      try {
        // Fetch current cart
        const cart = await this.fetchCart();
        if (!cart) return false;

        // Find gift item
        const giftItem = cart.items.find(item =>
          item.handle === gift.handle ||
          (item.properties && item.properties._bf25_gift === 'true')
        );

        if (!giftItem) {
          console.log(`[BF25 Cart] Gift not in cart: ${gift.name}`);
          return false;
        }

        // Remove via cart update
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: giftItem.key,
            quantity: 0
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to remove gift: ${response.status}`);
        }

        console.log(`[BF25 Cart] ✓ Gift removed: ${gift.name}`);
        return true;

      } catch (error) {
        console.error(`[BF25 Cart] Error removing gift ${gift.name}:`, error);
        return false;
      }
    }

    /**
     * Reconcile gifts (add missing, remove excess)
     */
    async reconcileGifts(currentTier) {
      console.log(`[BF25 Cart] Reconciling gifts for tier ${currentTier.id}`);

      const requiredGifts = this.getRequiredGifts(currentTier.id);
      const cart = await this.fetchCart();
      if (!cart) return;

      // Find which gifts are currently in cart
      const currentGifts = cart.items
        .filter(item =>
          Object.values(GIFT_PRODUCTS).some(g => g.handle === item.handle)
        )
        .map(item => {
          const giftEntry = Object.entries(GIFT_PRODUCTS).find(
            ([key, g]) => g.handle === item.handle
          );
          return giftEntry ? giftEntry[0] : null;
        })
        .filter(Boolean);

      console.log(`[BF25 Cart] Required: [${requiredGifts}], Current: [${currentGifts}]`);

      // Add missing gifts
      for (const giftKey of requiredGifts) {
        if (!currentGifts.includes(giftKey)) {
          await this.addGiftToCart(giftKey);
          await this.wait(300); // Throttle API calls
        }
      }

      // Remove excess gifts
      for (const giftKey of currentGifts) {
        if (!requiredGifts.includes(giftKey)) {
          await this.removeGiftFromCart(giftKey);
          await this.wait(300);
        }
      }

      console.log('[BF25 Cart] ✓ Gift reconciliation complete');
    }

    /**
     * Helper: Wait
     */
    wait(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

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

        // Sync cart
        await this.syncCart();

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
      setInterval(() => {
        if (this.state === 'idle') {
          this.syncCart();
        }
      }, 5000);

      console.log('[BF25 Cart] ✓ Listeners active');
    }

    /**
     * Debounced sync (prevents rapid API calls)
     */
    debouncedSync() {
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
