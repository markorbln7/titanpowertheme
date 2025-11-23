/**
 * BF25 Tier-Based Sticky Cart - CartManager
 * Version: 1.0
 * Purpose: Manage cart state, tier progression, and UI updates
 */

(function() {
  'use strict';

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

      // Check for tier change celebration (future animation hook)
      if (this.previousTier && this.previousTier.id < this.currentTier.id) {
        console.log(`[BF25 Cart] 🎉 Tier unlocked: ${this.currentTier.badge}`);
        // TODO: Trigger celebration animation in PROMPT 3
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
