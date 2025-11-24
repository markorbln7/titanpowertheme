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
       *
       * Calculation flow:
       * 1. Count total items
       * 2. Determine tier (highest where itemCount >= threshold)
       * 3. Calculate prices based on tier discount
       * 4. Determine unlocked gifts
       * 5. Sum total savings (discount + gift value)
       */
      _calculateComputed(items) {
        // ─────────────────────────────────────────────────────
        // 1. COUNT ITEMS
        // ─────────────────────────────────────────────────────
        const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // ─────────────────────────────────────────────────────
        // 2. DETERMINE TIER
        // Find highest tier where itemCount >= min threshold
        // BF25_TIERS is ordered: [0, 4, 8, 12, 16] items
        // ─────────────────────────────────────────────────────
        let tierReached = 0;
        let discountPercent = 50; // Base discount (0-3 items)
        let tierBadge = '50% OFF';

        // Iterate through tiers to find highest reached
        for (let i = 0; i < this.tiers.length; i++) {
          const tier = this.tiers[i];
          if (itemCount >= tier.min) {
            tierReached = i;
            discountPercent = tier.discount;
            tierBadge = tier.badge || `${tier.discount}% OFF`;
          } else {
            // Tiers are ordered, so stop once we exceed threshold
            break;
          }
        }

        // ─────────────────────────────────────────────────────
        // 3. CALCULATE PRICES
        // All values in cents (Shopify standard)
        // ─────────────────────────────────────────────────────
        const totalOriginalPrice = items.reduce((sum, item) => {
          return sum + ((item.price || 0) * (item.quantity || 0));
        }, 0);

        // Apply tier discount
        const discountMultiplier = 1 - (discountPercent / 100);
        const totalDiscountedPrice = Math.round(totalOriginalPrice * discountMultiplier);
        const discountAmount = totalOriginalPrice - totalDiscountedPrice;

        // ─────────────────────────────────────────────────────
        // 4. DETERMINE UNLOCKED GIFTS
        // Gifts unlock at checkpoints: 4, 8, 12, 16 items
        // GIFT_VARIANT_MAP structure: { 4: {...}, 8: {...}, ... }
        // ─────────────────────────────────────────────────────
        const giftCheckpoints = [4, 8, 12, 16];
        const giftsUnlocked = [];
        let totalGiftValue = 0;

        for (const checkpoint of giftCheckpoints) {
          if (itemCount >= checkpoint && this.gifts[checkpoint]) {
            const gift = this.gifts[checkpoint];
            giftsUnlocked.push({
              checkpoint: checkpoint,
              variantId: gift.variantId || gift.variant_id,
              title: gift.title || gift.name || `Gift at ${checkpoint} items`,
              price: gift.price || 0,
              image: gift.image || null
            });
            totalGiftValue += gift.price || 0;
          }
        }

        // ─────────────────────────────────────────────────────
        // 5. TOTAL SAVINGS
        // Savings = discount amount + value of free gifts
        // ─────────────────────────────────────────────────────
        const totalSavings = discountAmount + totalGiftValue;

        // ─────────────────────────────────────────────────────
        // 6. PROGRESS TO NEXT TIER/GIFT
        // Useful for progress bar and "add X more" messaging
        // ─────────────────────────────────────────────────────
        let itemsToNextTier = 0;
        let nextTierDiscount = null;
        let itemsToNextGift = 0;
        let nextGiftCheckpoint = null;

        // Find next tier
        for (const tier of this.tiers) {
          if (tier.min > itemCount) {
            itemsToNextTier = tier.min - itemCount;
            nextTierDiscount = tier.discount;
            break;
          }
        }

        // Find next gift checkpoint
        for (const checkpoint of giftCheckpoints) {
          if (checkpoint > itemCount) {
            itemsToNextGift = checkpoint - itemCount;
            nextGiftCheckpoint = checkpoint;
            break;
          }
        }

        return {
          // Core counts
          itemCount,

          // Tier info
          tierReached,
          tierBadge,
          discountPercent,

          // Gift info
          giftsUnlocked,
          totalGiftValue,

          // Price calculations (all in cents)
          totalOriginalPrice,
          totalDiscountedPrice,
          totalSavings,

          // Progress tracking
          itemsToNextTier,
          nextTierDiscount,
          itemsToNextGift,
          nextGiftCheckpoint,

          // Quick access booleans
          hasReachedTier1: itemCount >= 4,
          hasMaxItems: itemCount >= this.config.MAX_ITEMS
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

      /**
       * Add a product to the bundle
       * @param {Object} productData - Product information
       * @param {string} productData.variantId - Shopify variant ID (required)
       * @param {string} productData.productId - Shopify product ID
       * @param {string} productData.title - Product title
       * @param {string} productData.variantTitle - Variant title (e.g., "Black / USB-C")
       * @param {number} productData.price - Price in cents
       * @param {string} productData.image - Product image URL
       * @param {string} productData.handle - Product handle for URLs
       * @param {number} quantity - Quantity to add (default: 1)
       * @returns {Object} Result with success status and details
       */
      addItem(productData, quantity = 1) {
        // ─────────────────────────────────────────────────────
        // VALIDATION
        // ─────────────────────────────────────────────────────
        if (!productData || !productData.variantId) {
          console.error('[BF25 BundleManager] addItem failed: variantId required');
          return {
            success: false,
            error: 'MISSING_VARIANT_ID',
            message: 'Product variant ID is required'
          };
        }

        // Normalize variant ID to string
        const variantId = String(productData.variantId);
        quantity = Math.max(1, Math.floor(quantity)); // Ensure positive integer

        // ─────────────────────────────────────────────────────
        // CHECK MAX ITEMS
        // ─────────────────────────────────────────────────────
        const currentCount = this.bundle.computed.itemCount;
        const newTotal = currentCount + quantity;

        if (newTotal > this.config.MAX_ITEMS) {
          const canAdd = this.config.MAX_ITEMS - currentCount;
          console.warn(`[BF25 BundleManager] Max items (${this.config.MAX_ITEMS}) would be exceeded. Can add ${canAdd} more.`);

          this._dispatchEvent('bf25:maxItemsReached', {
            maxItems: this.config.MAX_ITEMS,
            currentCount,
            attemptedAdd: quantity,
            canAdd
          });

          // If can't add any, return error
          if (canAdd <= 0) {
            return {
              success: false,
              error: 'MAX_ITEMS_REACHED',
              message: `Bundle is full (${this.config.MAX_ITEMS} items maximum)`,
              maxItems: this.config.MAX_ITEMS
            };
          }

          // Otherwise, add what we can
          quantity = canAdd;
        }

        // ─────────────────────────────────────────────────────
        // CHECK IF ITEM EXISTS (Update vs Add)
        // ─────────────────────────────────────────────────────
        const existingIndex = this.bundle.items.findIndex(
          item => String(item.variantId) === variantId
        );

        const previousTier = this.bundle.computed.tierReached;
        const previousGiftCount = this.bundle.computed.giftsUnlocked.length;

        if (existingIndex !== -1) {
          // UPDATE existing item quantity
          this.bundle.items[existingIndex].quantity += quantity;
          console.log(`[BF25 BundleManager] Updated quantity: ${productData.title} (now ${this.bundle.items[existingIndex].quantity})`);
        } else {
          // ADD new item
          const newItem = {
            variantId: variantId,
            productId: String(productData.productId || ''),
            title: productData.title || 'Unknown Product',
            variantTitle: productData.variantTitle || '',
            price: Math.max(0, parseInt(productData.price, 10) || 0),
            image: productData.image || '',
            handle: productData.handle || '',
            quantity: quantity,
            addedAt: new Date().toISOString()
          };

          this.bundle.items.push(newItem);
          console.log(`[BF25 BundleManager] Added item: ${newItem.title} (qty: ${quantity})`);
        }

        // ─────────────────────────────────────────────────────
        // REFRESH EXPIRATION & SAVE
        // ─────────────────────────────────────────────────────
        this._refreshExpiration();
        this._saveBundle(true, true);

        // ─────────────────────────────────────────────────────
        // CHECK FOR TIER/GIFT UNLOCKS
        // ─────────────────────────────────────────────────────
        const newTier = this.bundle.computed.tierReached;
        const newGiftCount = this.bundle.computed.giftsUnlocked.length;

        // Dispatch tier unlock event
        if (newTier > previousTier) {
          console.log(`[BF25 BundleManager] 🎉 Tier ${newTier} unlocked!`);
          this._dispatchEvent('bf25:tierUnlocked', {
            tier: newTier,
            discountPercent: this.bundle.computed.discountPercent,
            tierBadge: this.bundle.computed.tierBadge
          });
        }

        // Dispatch gift unlock event
        if (newGiftCount > previousGiftCount) {
          const newGift = this.bundle.computed.giftsUnlocked[newGiftCount - 1];
          console.log(`[BF25 BundleManager] 🎁 Gift unlocked: ${newGift.title}`);
          this._dispatchEvent('bf25:giftUnlocked', {
            gift: newGift,
            totalGifts: newGiftCount
          });
        }

        return {
          success: true,
          action: existingIndex !== -1 ? 'updated' : 'added',
          item: existingIndex !== -1 ? this.bundle.items[existingIndex] : this.bundle.items[this.bundle.items.length - 1],
          computed: this.getComputed(),
          tierUnlocked: newTier > previousTier ? newTier : null,
          giftUnlocked: newGiftCount > previousGiftCount ? this.bundle.computed.giftsUnlocked[newGiftCount - 1] : null
        };
      }

      /**
       * Remove a product entirely from the bundle
       * @param {string|number} variantId - Shopify variant ID
       * @returns {Object} Result with success status and details
       */
      removeItem(variantId) {
        // Normalize variant ID
        variantId = String(variantId);

        // Find item index
        const index = this.bundle.items.findIndex(
          item => String(item.variantId) === variantId
        );

        if (index === -1) {
          console.warn(`[BF25 BundleManager] removeItem: variant ${variantId} not found`);
          return {
            success: false,
            error: 'ITEM_NOT_FOUND',
            message: 'Item not found in bundle'
          };
        }

        // Store previous state for comparison
        const previousTier = this.bundle.computed.tierReached;
        const previousGiftCount = this.bundle.computed.giftsUnlocked.length;
        const removedItem = { ...this.bundle.items[index] };

        // Remove the item
        this.bundle.items.splice(index, 1);
        console.log(`[BF25 BundleManager] Removed: ${removedItem.title}`);

        // Save and recalculate
        this._saveBundle(true, true);

        // Check for tier/gift downgrades
        const newTier = this.bundle.computed.tierReached;
        const newGiftCount = this.bundle.computed.giftsUnlocked.length;

        if (newTier < previousTier) {
          console.log(`[BF25 BundleManager] ⬇️ Tier dropped to ${newTier}`);
          this._dispatchEvent('bf25:tierChanged', {
            previousTier,
            newTier,
            direction: 'down'
          });
        }

        if (newGiftCount < previousGiftCount) {
          console.log(`[BF25 BundleManager] ⬇️ Gift lost (now ${newGiftCount})`);
          this._dispatchEvent('bf25:giftLost', {
            previousCount: previousGiftCount,
            newCount: newGiftCount
          });
        }

        return {
          success: true,
          removedItem,
          computed: this.getComputed()
        };
      }

      /**
       * Update quantity of an existing item
       * @param {string|number} variantId - Shopify variant ID
       * @param {number} quantity - New quantity (0 removes item)
       * @returns {Object} Result with success status and details
       */
      updateQuantity(variantId, quantity) {
        // Normalize inputs
        variantId = String(variantId);
        quantity = Math.max(0, Math.floor(quantity));

        // If quantity is 0, remove the item
        if (quantity === 0) {
          return this.removeItem(variantId);
        }

        // Find item
        const index = this.bundle.items.findIndex(
          item => String(item.variantId) === variantId
        );

        if (index === -1) {
          console.warn(`[BF25 BundleManager] updateQuantity: variant ${variantId} not found`);
          return {
            success: false,
            error: 'ITEM_NOT_FOUND',
            message: 'Item not found in bundle'
          };
        }

        // Calculate what the new total would be
        const currentItemQty = this.bundle.items[index].quantity;
        const otherItemsQty = this.bundle.computed.itemCount - currentItemQty;
        const newTotal = otherItemsQty + quantity;

        // Check max items
        if (newTotal > this.config.MAX_ITEMS) {
          const maxAllowed = this.config.MAX_ITEMS - otherItemsQty;
          console.warn(`[BF25 BundleManager] Quantity capped at ${maxAllowed} (max ${this.config.MAX_ITEMS} total)`);
          quantity = maxAllowed;

          this._dispatchEvent('bf25:maxItemsReached', {
            maxItems: this.config.MAX_ITEMS,
            requestedQty: quantity,
            allowedQty: maxAllowed
          });
        }

        // Store previous state
        const previousTier = this.bundle.computed.tierReached;
        const previousGiftCount = this.bundle.computed.giftsUnlocked.length;
        const previousQty = this.bundle.items[index].quantity;

        // Update quantity
        this.bundle.items[index].quantity = quantity;
        console.log(`[BF25 BundleManager] Updated: ${this.bundle.items[index].title} (${previousQty} → ${quantity})`);

        // Save and recalculate
        this._refreshExpiration();
        this._saveBundle(true, true);

        // Check for tier/gift changes
        const newTier = this.bundle.computed.tierReached;
        const newGiftCount = this.bundle.computed.giftsUnlocked.length;

        // Dispatch tier change events
        if (newTier !== previousTier) {
          const direction = newTier > previousTier ? 'up' : 'down';
          console.log(`[BF25 BundleManager] ${direction === 'up' ? '🎉' : '⬇️'} Tier ${direction} to ${newTier}`);

          if (direction === 'up') {
            this._dispatchEvent('bf25:tierUnlocked', {
              tier: newTier,
              discountPercent: this.bundle.computed.discountPercent,
              tierBadge: this.bundle.computed.tierBadge
            });
          } else {
            this._dispatchEvent('bf25:tierChanged', {
              previousTier,
              newTier,
              direction
            });
          }
        }

        // Dispatch gift change events
        if (newGiftCount > previousGiftCount) {
          const newGift = this.bundle.computed.giftsUnlocked[newGiftCount - 1];
          this._dispatchEvent('bf25:giftUnlocked', { gift: newGift, totalGifts: newGiftCount });
        } else if (newGiftCount < previousGiftCount) {
          this._dispatchEvent('bf25:giftLost', { previousCount: previousGiftCount, newCount: newGiftCount });
        }

        return {
          success: true,
          item: this.bundle.items[index],
          previousQty,
          newQty: quantity,
          computed: this.getComputed()
        };
      }

      /**
       * Find an item in the bundle by variant ID
       * @param {string|number} variantId - Shopify variant ID
       * @returns {Object|null} Item object or null if not found
       */
      findItem(variantId) {
        variantId = String(variantId);
        const item = this.bundle.items.find(
          item => String(item.variantId) === variantId
        );
        return item ? { ...item } : null;
      }

      /**
       * Check if a variant is already in the bundle
       * @param {string|number} variantId - Shopify variant ID
       * @returns {boolean}
       */
      hasItem(variantId) {
        return this.findItem(variantId) !== null;
      }

      /**
       * Get quantity of a specific variant in bundle
       * @param {string|number} variantId - Shopify variant ID
       * @returns {number} Quantity (0 if not in bundle)
       */
      getItemQuantity(variantId) {
        const item = this.findItem(variantId);
        return item ? item.quantity : 0;
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
      const bm = window.BF25BundleManager;
      const computed = bm.getComputed();

      console.group('🎁 BF25 Bundle Debug');
      console.log('Storage:', bm.getStorageType());
      console.log('─────────────────────────────');
      console.log('Items:', computed.itemCount, '/', bm.config.MAX_ITEMS);
      console.log('Tier:', computed.tierReached, `(${computed.tierBadge})`);
      console.log('─────────────────────────────');
      console.log('Original Price:', '€' + (computed.totalOriginalPrice / 100).toFixed(2));
      console.log('Discounted:', '€' + (computed.totalDiscountedPrice / 100).toFixed(2));
      console.log('You Save:', '€' + (computed.totalSavings / 100).toFixed(2));
      console.log('─────────────────────────────');
      console.log('Gifts Unlocked:', computed.giftsUnlocked.length);
      computed.giftsUnlocked.forEach(g => console.log('  🎁', g.title));
      console.log('─────────────────────────────');
      console.log('Progress:', computed.itemsToNextGift ? `${computed.itemsToNextGift} more for next gift` : 'All gifts unlocked!');
      console.log('Can Checkout:', bm.canCheckout() ? '✅ Yes' : '❌ Need 4+ items');
      console.groupEnd();

      return bm.getBundle();
    };

    // Quick test helper
    window.testBF25Add = function(title = 'Test Product', price = 1999) {
      return window.BF25BundleManager.addItem({
        variantId: 'test-' + Date.now(),
        productId: 'test-product',
        title: title,
        variantTitle: 'Default',
        price: price,
        image: '',
        handle: 'test-product'
      }, 1);
    };

    console.log('[BF25 BundleManager] 💡 Debug helpers:');
    console.log('  debugBF25Bundle() - View bundle state');
    console.log('  testBF25Add("Product Name", 1999) - Add test item');
  }

  // Start dependency check
  checkDependencies();

})();
