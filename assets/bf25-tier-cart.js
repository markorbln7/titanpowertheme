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
      handle: 'bf25-free-cable',
      variantId: null, // Will be fetched dynamically
      tier: 1,
      emoji: '🔌',
      name: 'Premium Cable'
    },
    case: {
      handle: 'bf25-free-case',
      variantId: null,
      tier: 2,
      emoji: '📦',
      name: 'Protective Case'
    },
    magnetic: {
      handle: 'bf25-free-magnetic-set',
      variantId: null,
      tier: 3,
      emoji: '🧲',
      name: 'Magnetic Set'
    },
    mystery: {
      handle: 'bf25-free-mystery-box',
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
        console.log(`[GiftAnimator] Tier ${tier} already celebrated this session`);
        return;
      }

      console.log(`[GiftAnimator] Queueing tier ${tier} for animation`);
      this.queue.add(tier);

      if (!this.isAnimating) {
        this.processQueue();
      }
    }

    /**
     * Process animation queue
     */
    async processQueue() {
      if (this.queue.size === 0) {
        this.isAnimating = false;
        return;
      }

      // Get highest tier (jump to max strategy)
      const targetTier = Math.max(...Array.from(this.queue));
      this.queue.clear();

      console.log(`[GiftAnimator] Animating tier ${targetTier}`);
      this.isAnimating = true;

      try {
        await this.executeSequence(targetTier);

        // Mark as celebrated
        this.celebratedTiers.add(targetTier);
        this.saveCelebratedTiers();

      } catch (error) {
        console.error('[GiftAnimator] Animation error:', error);
      }

      this.isAnimating = false;
      this.processQueue(); // Process next in queue
    }

    /**
     * Execute 6-frame animation sequence
     */
    async executeSequence(tier) {
      // Find gift slot for this tier
      const checkpoint = this.getCheckpointForTier(tier);
      const slot = document.querySelector(
        `.bf25-gift-slot[data-checkpoint-value="${checkpoint}"]`
      );

      if (!slot) {
        console.error(`[GiftAnimator] No slot found for tier ${tier}`);
        return;
      }

      console.log(`[GiftAnimator] Starting 6-frame sequence for tier ${tier}`);

      // Add animating class
      slot.classList.add('is-animating');

      // FRAME 2: Wiggle (0.4s)
      slot.classList.add('is-unlocking');
      await this.wait(400);
      slot.classList.remove('is-unlocking');

      // FRAME 3: Reveal (0.4s)
      slot.classList.add('is-revealing');
      await this.wait(400);
      slot.classList.remove('is-revealing');

      // FRAME 4: Shine (1.2s)
      slot.classList.add('is-celebrating');

      // T=0.8s: Accessibility announcement
      await this.wait(800);
      this.announceGift(tier);

      await this.wait(400); // Complete shine
      slot.classList.remove('is-celebrating');

      // FRAME 5: Settle (0.3s)
      slot.classList.add('is-settling');
      await this.wait(300);
      slot.classList.remove('is-settling');

      // FRAME 6: Claimed (Final State)
      slot.dataset.state = 'claimed';
      slot.classList.remove('is-animating');

      console.log(`[GiftAnimator] ✓ Sequence complete for tier ${tier}`);
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

      const announcer = document.getElementById('bf25-cart-announcements');
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
        container: document.getElementById('bf25-sticky-cart'),
        segments: document.querySelectorAll('.bf25-progress-bar__segment'),
        tierLabels: document.querySelectorAll('.bf25-tier-label'),
        giftSlots: document.querySelectorAll('.bf25-gift-slot'),
        incentiveText: document.getElementById('bf25-incentive-text'),
        savingsAmount: document.getElementById('bf25-savings-amount'),
        btnView: document.getElementById('bf25-btn-view'),
        btnBuy: document.getElementById('bf25-btn-buy'),
        announcer: document.getElementById('bf25-cart-announcements')
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

      // Bind events
      this.bindEvents();

      // Initialize cart listeners
      this.initCartListeners();

      // Initialize GiftAnimator
      this.initGiftAnimator();

      // Initialize keyboard navigation
      this.initKeyboardNav();

      // Handle viewport changes
      this.handleViewportChange();

      // Set initial body padding (CLS prevention)
      document.body.style.paddingBottom = '65px';

      // Sync cart on load
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

      // Buy Now (Navigate to Checkout)
      if (this.elements.btnBuy) {
        this.elements.btnBuy.addEventListener('click', () => {
          window.location.href = '/checkout';
        });
      }
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    showEmptyState() {
      if (!this.elements.container) return;

      // Show container
      this.elements.container.style.display = 'flex';

      // Set Tier 0
      this.updateVisualization(0);

      console.log('[BF25 Cart] Empty state displayed');
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

      // Check for tier unlock (trigger animation + gift add)
      if (this.previousTier && this.previousTier.id < this.currentTier.id) {
        console.log(`[BF25 Cart] 🎉 Tier unlocked: ${this.currentTier.badge}`);

        // Trigger celebration animation
        if (this.giftAnimator) {
          this.giftAnimator.animate(this.currentTier.id);
        }

        // Reconcile gifts (add new tier gifts)
        this.reconcileGifts(this.currentTier);
      }

      // Check for tier downgrade (remove excess gifts)
      if (this.previousTier && this.previousTier.id > this.currentTier.id) {
        console.log(`[BF25 Cart] Tier downgraded to ${this.currentTier.id}`);
        this.reconcileGifts(this.currentTier);
      }
    }

    // ============================================
    // COLOR SYSTEM
    // ============================================
    updateColors() {
      const { color, glowColor, glow } = this.currentTier;

      if (this.elements.container) {
        // Set CSS variables
        this.elements.container.style.setProperty('--bf25-tier-color', color);
        this.elements.container.style.setProperty('--bf25-tier-glow-color', glowColor);
        this.elements.container.style.setProperty('--bf25-tier-glow', glow);

        // Set data attribute for tier-specific CSS
        this.elements.container.dataset.activeTier = this.currentTier.id;

        // Convert hex to RGB for border glow
        const rgb = this.hexToRgb(color);
        this.elements.container.style.setProperty(
          '--bf25-tier-color-rgb',
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
      this.elements.container.classList.add('is-expanded');

      if (this.elements.btnView) {
        this.elements.btnView.textContent = 'Hide ▲';
        this.elements.btnView.setAttribute('aria-expanded', 'true');
      }

      // Sync body padding (CLS prevention)
      document.body.style.transition = 'padding-bottom 0.3s ease-out';
      document.body.style.paddingBottom = '155px';

      this.announce('Cart expanded');
      console.log('[BF25 Cart] Expanded');
    }

    collapseCart() {
      this.elements.container.classList.remove('is-expanded');

      if (this.elements.btnView) {
        this.elements.btnView.textContent = 'View ▼';
        this.elements.btnView.setAttribute('aria-expanded', 'false');
      }

      // Sync body padding
      document.body.style.paddingBottom = '65px';

      this.announce('Cart collapsed');
      console.log('[BF25 Cart] Collapsed');
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
        return '<strong class="bf25-highlight">🎉 Maximum savings unlocked!</strong>';
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
        return `Add <strong class="bf25-highlight">${needed} ${moreText}</strong> → <strong class="bf25-highlight">${emoji} ${discount}</strong> + ${giftEmoji}`;
      }

      // Desktop (768px+)
      const itemsText = needed === 1 ? 'item' : 'items';
      return `Add <strong class="bf25-highlight">${needed} more ${itemsText}</strong> for <strong class="bf25-highlight">${emoji} ${discount} OFF</strong> + <strong class="bf25-highlight">${giftName}</strong>`;
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
        'bf25-free-cable',
        'bf25-free-case',
        'bf25-free-magnetic-set',
        'bf25-free-mystery-box'
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
        'bf25-free-cable',
        'bf25-free-case',
        'bf25-free-magnetic-set',
        'bf25-free-mystery-box'
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

    /**
     * Sync cart data and update UI
     */
    async syncCart() {
      console.log('[BF25 Cart] Syncing with Shopify cart...');

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

        // Show/hide cart based on items
        this.handleEmptyState(itemCount);

        // Set idle state
        this.setState('idle');

        return { itemCount, savings };

      } catch (error) {
        this.handleError(error, 'syncCart');
        this.setState('error');
        return null;
      }
    }

    /**
     * Handle empty cart state
     */
    handleEmptyState(itemCount) {
      if (!this.elements.container) return;

      if (itemCount === 0) {
        // Hide cart (or show empty message)
        this.elements.container.style.display = 'none';
        console.log('[BF25 Cart] Hidden (empty cart)');
      } else {
        // Show cart
        this.elements.container.style.display = 'flex';
        console.log('[BF25 Cart] Visible (cart has items)');
      }
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
     * Initialize GiftAnimator
     */
    initGiftAnimator() {
      this.giftAnimator = new GiftAnimator();
      console.log('[BF25 Cart] GiftAnimator initialized');
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

})();
