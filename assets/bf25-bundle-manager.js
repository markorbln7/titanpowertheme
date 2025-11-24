/**
 * BF25 Virtual Cart - BundleManager
 * Version: 1.0
 *
 * Purpose: Manages BF25 bundle state in localStorage for instant operations.
 * The bundle is ISOLATED to the BF25 page - items only sync to Shopify at checkout.
 *
 * Architecture:
 * - Single source of truth for bundle state
 * - Persists 7 days (sliding window)
 * - Syncs across browser tabs
 * - Falls back gracefully if storage unavailable
 *
 * Dependencies: Requires BF25_TIERS and GIFT_VARIANT_MAP from bf25-tier-cart.js
 */

(function() {
  'use strict';

  // ============================================
  // DEPENDENCY CHECK
  // ============================================

  // Wait for dependencies with retry logic
  let dependencyRetries = 0;
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 100; // ms

  function checkDependencies() {
    if (typeof BF25_TIERS !== 'undefined' && typeof GIFT_VARIANT_MAP !== 'undefined') {
      initializeBundleManager();
      return;
    }

    dependencyRetries++;
    if (dependencyRetries < MAX_RETRIES) {
      console.log(`[BF25 BundleManager] Waiting for dependencies... (${dependencyRetries}/${MAX_RETRIES})`);
      setTimeout(checkDependencies, RETRY_DELAY);
    } else {
      console.error('[BF25 BundleManager] CRITICAL: Dependencies not found after ' + MAX_RETRIES + ' retries. BF25_TIERS and GIFT_VARIANT_MAP must be defined.');
    }
  }

  function initializeBundleManager() {
    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
      STORAGE_KEY: 'bf25_bundle',
      SCHEMA_VERSION: 1,
      EXPIRATION_DAYS: 7,
      MAX_ITEMS: 16
    };

    // Reference to tier configuration
    const TIERS = BF25_TIERS;
    const GIFTS = GIFT_VARIANT_MAP;

    // ============================================
    // BUNDLE MANAGER CLASS
    // ============================================

    class BundleManager {
      constructor() {
        // Singleton pattern
        if (BundleManager.instance) {
          return BundleManager.instance;
        }
        BundleManager.instance = this;

        // Configuration
        this.config = CONFIG;
        this.tiers = TIERS;
        this.gifts = GIFTS;

        // Storage provider (determined at init)
        this.storage = null;
        this.storageName = null;

        // Current bundle state
        this.bundle = null;

        // Initialize
        this._initStorage();
        this._loadBundle();
        this._setupTabSync();

        console.log(`[BF25 BundleManager] ✓ Initialized | Storage: ${this.storageName} | Items: ${this.bundle.computed.itemCount}`);
      }

      // ============================================
      // STORAGE INITIALIZATION
      // ============================================

      /**
       * Determine best available storage provider
       * Priority: localStorage > sessionStorage > memory
       */
      _initStorage() {
        const testKey = '__bf25_storage_test__';

        // Test localStorage
        try {
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);
          this.storage = localStorage;
          this.storageName = 'localStorage';
          return;
        } catch (e) {
          console.warn('[BF25 BundleManager] localStorage unavailable:', e.message);
        }

        // Test sessionStorage (Safari private mode fallback)
        try {
          sessionStorage.setItem(testKey, 'test');
          sessionStorage.removeItem(testKey);
          this.storage = sessionStorage;
          this.storageName = 'sessionStorage';
          console.warn('[BF25 BundleManager] Using sessionStorage fallback. Bundle will not persist across sessions.');
          return;
        } catch (e) {
          console.warn('[BF25 BundleManager] sessionStorage unavailable:', e.message);
        }

        // In-memory fallback (last resort)
        console.error('[BF25 BundleManager] All storage unavailable. Using in-memory fallback. Bundle will be lost on page refresh.');
        this.storage = this._createMemoryStorage();
        this.storageName = 'memory';

        // Notify user
        this._dispatchEvent('bf25:storageUnavailable', {
          message: 'Your browser storage is unavailable. Your bundle will not be saved if you leave this page.'
        });
      }

      /**
       * Create in-memory storage fallback
       */
      _createMemoryStorage() {
        const data = {};
        return {
          getItem: (key) => data[key] || null,
          setItem: (key, value) => { data[key] = String(value); },
          removeItem: (key) => { delete data[key]; }
        };
      }

      // ============================================
      // BUNDLE SCHEMA & INITIALIZATION
      // ============================================

      /**
       * Create a fresh empty bundle with proper schema
       */
      _createEmptyBundle() {
        const now = new Date();

        return {
          // Schema version for future migrations
          version: this.config.SCHEMA_VERSION,

          // Timestamps
          createdAt: now.toISOString(),
          expiresAt: this._calculateExpiration(now).toISOString(),
          lastActivity: now.toISOString(),

          // Bundle items (products only - gifts added at checkout)
          items: [],

          // Computed values (recalculated on every change)
          computed: {
            itemCount: 0,
            tierReached: 0,
            tierBadge: '50% OFF',
            discountPercent: 50,
            giftsUnlocked: [],
            totalOriginalPrice: 0,    // cents
            totalDiscountedPrice: 0,  // cents
            totalSavings: 0,          // cents (discount + gift value)
            totalGiftValue: 0         // cents
          },

          // User's choice about existing cart items
          // 'keep' = add bundle on top, 'clear' = replace, null = not asked yet
          existingCartChoice: null
        };
      }

      /**
       * Calculate expiration date (7 days from given date)
       */
      _calculateExpiration(fromDate) {
        return new Date(fromDate.getTime() + this.config.EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
      }

      /**
       * Check if bundle has expired
       */
      _isExpired(bundle) {
        if (!bundle || !bundle.expiresAt) return false;
        return new Date() > new Date(bundle.expiresAt);
      }

      /**
       * Refresh expiration (sliding window - resets on activity)
       */
      _refreshExpiration() {
        this.bundle.expiresAt = this._calculateExpiration(new Date()).toISOString();
      }

      // ============================================
      // BUNDLE LOADING & SAVING
      // ============================================

      /**
       * Load bundle from storage (or create new if none/invalid/expired)
       */
      _loadBundle() {
        try {
          const rawData = this.storage.getItem(this.config.STORAGE_KEY);

          // No saved bundle - create new
          if (!rawData) {
            this.bundle = this._createEmptyBundle();
            return;
          }

          const savedBundle = JSON.parse(rawData);

          // Validate schema version
          if (!savedBundle || savedBundle.version !== this.config.SCHEMA_VERSION) {
            console.warn('[BF25 BundleManager] Invalid schema version, creating new bundle.');
            this.bundle = this._createEmptyBundle();
            return;
          }

          // Check expiration
          if (this._isExpired(savedBundle)) {
            console.log('[BF25 BundleManager] Bundle expired, creating new bundle.');
            this._dispatchEvent('bf25:bundleExpired', {
              expiredAt: savedBundle.expiresAt,
              itemCount: savedBundle.computed?.itemCount || 0
            });
            this.bundle = this._createEmptyBundle();
            return;
          }

          // Valid bundle - use it
          this.bundle = savedBundle;

          // Recalculate computed values (in case tier config changed)
          this.bundle.computed = this._calculateComputed(this.bundle.items);

          // Refresh expiration (sliding window)
          this._refreshExpiration();

          // Save refreshed state
          this._saveToStorage();

        } catch (error) {
          console.error('[BF25 BundleManager] Error loading bundle:', error);
          this.bundle = this._createEmptyBundle();
        }
      }

      /**
       * Save current bundle state to storage and dispatch update event
       * @param {boolean} recalculate - Recalculate computed values (default: true)
       * @param {boolean} notify - Dispatch update event (default: true)
       */
      _saveBundle(recalculate = true, notify = true) {
        if (!this.bundle) return;

        // Update computed values
        if (recalculate) {
          this.bundle.computed = this._calculateComputed(this.bundle.items);
        }

        // Update activity timestamp
        this.bundle.lastActivity = new Date().toISOString();

        // Persist to storage
        this._saveToStorage();

        // Notify listeners
        if (notify) {
          this._dispatchEvent('bf25:bundleUpdated', {
            bundle: this.getBundle(),
            itemCount: this.bundle.computed.itemCount,
            tierReached: this.bundle.computed.tierReached
          });
        }
      }

      /**
       * Low-level save to storage provider
       */
      _saveToStorage() {
        try {
          this.storage.setItem(this.config.STORAGE_KEY, JSON.stringify(this.bundle));
        } catch (error) {
          console.error('[BF25 BundleManager] Failed to save bundle:', error);

          // Storage might be full - try to notify user
          if (error.name === 'QuotaExceededError') {
            this._dispatchEvent('bf25:storageFull', {
              message: 'Storage is full. Please clear some browser data.'
            });
          }
        }
      }

      // ============================================
      // TAB SYNCHRONIZATION
      // ============================================

      /**
       * Set up cross-tab synchronization via storage events
       */
      _setupTabSync() {
        // Only localStorage triggers cross-tab events
        if (this.storageName !== 'localStorage') return;

        window.addEventListener('storage', (event) => {
          // Only react to our storage key
          if (event.key !== this.config.STORAGE_KEY) return;

          // Key was deleted in another tab
          if (!event.newValue) {
            console.log('[BF25 BundleManager] Bundle cleared in another tab.');
            this.bundle = this._createEmptyBundle();
            this._dispatchEvent('bf25:bundleUpdated', {
              bundle: this.getBundle(),
              source: 'tabSync'
            });
            return;
          }

          // Key was updated in another tab
          try {
            const newBundle = JSON.parse(event.newValue);

            // Avoid unnecessary updates
            if (JSON.stringify(newBundle) === JSON.stringify(this.bundle)) return;

            console.log('[BF25 BundleManager] Syncing from another tab.');
            this.bundle = newBundle;

            // Ensure computed values are fresh
            this.bundle.computed = this._calculateComputed(this.bundle.items);

            this._dispatchEvent('bf25:bundleUpdated', {
              bundle: this.getBundle(),
              source: 'tabSync'
            });
          } catch (error) {
            console.error('[BF25 BundleManager] Failed to parse tab sync data:', error);
          }
        });

        console.log('[BF25 BundleManager] Tab sync enabled.');
      }

      // ============================================
      // EVENT DISPATCHING
      // ============================================

      /**
       * Dispatch custom event for UI updates
       */
      _dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
          detail,
          bubbles: true
        });
        document.dispatchEvent(event);

        // Debug logging in development
        if (window.BF25_DEBUG) {
          console.log(`[BF25 Event] ${eventName}`, detail);
        }
      }

      // ============================================
      // CALCULATION ENGINE (Placeholder - Prompt 1.2)
      // ============================================

      /**
       * Calculate all computed values from items
       * CRITICAL: This runs on every save - must be fast
       */
      _calculateComputed(items) {
        // Placeholder - full implementation in Prompt 1.2
        const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        return {
          itemCount: itemCount,
          tierReached: 0,
          tierBadge: '50% OFF',
          discountPercent: 50,
          giftsUnlocked: [],
          totalOriginalPrice: 0,
          totalDiscountedPrice: 0,
          totalSavings: 0,
          totalGiftValue: 0
        };
      }

      // ============================================
      // PUBLIC API - GETTERS
      // ============================================

      /**
       * Get a deep copy of the current bundle (prevents external mutation)
       */
      getBundle() {
        return JSON.parse(JSON.stringify(this.bundle));
      }

      /**
       * Get just the computed values (for quick UI reads)
       */
      getComputed() {
        return { ...this.bundle.computed };
      }

      /**
       * Get items array
       */
      getItems() {
        return [...this.bundle.items];
      }

      /**
       * Check if bundle has items
       */
      hasItems() {
        return this.bundle.computed.itemCount > 0;
      }

      /**
       * Check if user can checkout (reached Tier 1 = 4+ items)
       */
      canCheckout() {
        return this.bundle.computed.itemCount >= 4;
      }

      /**
       * Get storage type being used
       */
      getStorageType() {
        return this.storageName;
      }

      // ============================================
      // PUBLIC API - MODIFIERS (Placeholder - Prompt 1.2)
      // ============================================

      addItem(productData, quantity = 1) {
        console.log('[BF25 BundleManager] addItem - Placeholder (Prompt 1.2)');
        return false;
      }

      removeItem(variantId) {
        console.log('[BF25 BundleManager] removeItem - Placeholder (Prompt 1.2)');
        return false;
      }

      updateQuantity(variantId, quantity) {
        console.log('[BF25 BundleManager] updateQuantity - Placeholder (Prompt 1.2)');
        return false;
      }

      clearBundle() {
        this.bundle = this._createEmptyBundle();
        this._saveBundle(false, true);
        console.log('[BF25 BundleManager] Bundle cleared.');
      }

      // ============================================
      // PUBLIC API - ISOLATION (Placeholder - Prompt 3.2)
      // ============================================

      setExistingCartChoice(choice) {
        if (choice === 'keep' || choice === 'clear') {
          this.bundle.existingCartChoice = choice;
          this._saveBundle(false, false);
          console.log(`[BF25 BundleManager] Existing cart choice set: ${choice}`);
        }
      }

      getExistingCartChoice() {
        return this.bundle.existingCartChoice;
      }

      // ============================================
      // PUBLIC API - CHECKOUT (Placeholder - Prompt 4.1)
      // ============================================

      async syncToShopifyCart() {
        console.log('[BF25 BundleManager] syncToShopifyCart - Placeholder (Prompt 4.1)');
        return false;
      }
    }

    // ============================================
    // INITIALIZE SINGLETON & EXPOSE GLOBALLY
    // ============================================

    window.BF25BundleManager = new BundleManager();

    // Expose debug helper
    window.BF25_DEBUG = window.BF25_DEBUG || false;
    window.debugBF25Bundle = function() {
      console.group('🎁 BF25 Bundle Debug');
      console.log('Bundle:', window.BF25BundleManager.getBundle());
      console.log('Storage:', window.BF25BundleManager.getStorageType());
      console.log('Can Checkout:', window.BF25BundleManager.canCheckout());
      console.groupEnd();
      return window.BF25BundleManager.getBundle();
    };

    console.log('[BF25 BundleManager] 💡 Type debugBF25Bundle() in console to inspect state');
  }

  // Start dependency check
  checkDependencies();

})();
