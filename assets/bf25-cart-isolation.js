/**
 * BF25 Cart Isolation Controller
 * Version: 1.0
 *
 * Purpose: Detects existing Shopify cart items when user arrives on BF25 page.
 * Presents choice to keep existing items or start fresh.
 * Prevents accidental cart loss and checkout confusion.
 *
 * Flow:
 * 1. Check if choice already made (stored in BundleManager)
 * 2. Fetch Shopify cart
 * 3. If has non-bundle items → show choice modal
 * 4. Store choice → continue to bundle builder
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    // Items with this property are BF25 bundle items (ignore them)
    BUNDLE_PROPERTY: '_bf25_bundle',
    // Session key to prevent showing modal multiple times per session
    SESSION_KEY: 'bf25_isolation_shown',
    // Animation durations
    MODAL_FADE_IN: 300,
    MODAL_FADE_OUT: 200
  };

  // ============================================
  // CART ISOLATION CONTROLLER
  // ============================================

  class CartIsolationController {
    constructor() {
      this.modal = null;
      this.isShowing = false;
      this.resolveChoice = null; // Promise resolver

      console.log('[BF25 Isolation] Controller initialized');
    }

    // ============================================
    // MAIN ENTRY POINT
    // ============================================

    /**
     * Check for existing cart items and show modal if needed.
     * Returns a promise that resolves when user makes a choice (or no choice needed).
     *
     * @returns {Promise<string|null>} 'keep', 'clear', or null (no existing items)
     */
    async checkAndPrompt() {
      console.log('[BF25 Isolation] Checking for existing cart items...');

      // 1. Check if BundleManager has already stored a choice
      if (window.BF25BundleManager) {
        const existingChoice = window.BF25BundleManager.getExistingCartChoice();
        if (existingChoice) {
          console.log(`[BF25 Isolation] Using stored choice: ${existingChoice}`);
          return existingChoice;
        }
      }

      // 2. Check if we've already shown modal this session (prevents annoyance)
      if (sessionStorage.getItem(CONFIG.SESSION_KEY)) {
        console.log('[BF25 Isolation] Modal already shown this session, skipping');
        return null;
      }

      // 3. Fetch current Shopify cart
      const cart = await this.fetchShopifyCart();
      if (!cart) {
        console.log('[BF25 Isolation] Could not fetch cart, skipping isolation check');
        return null;
      }

      // 4. Check for existing non-bundle items
      const existingItems = this.filterNonBundleItems(cart.items || []);

      if (existingItems.length === 0) {
        console.log('[BF25 Isolation] No existing items, proceeding to bundle builder');
        return null;
      }

      console.log(`[BF25 Isolation] Found ${existingItems.length} existing item(s) in cart`);

      // 5. Show choice modal and wait for user decision
      const choice = await this.showChoiceModal(existingItems, cart);

      // 6. Store choice in BundleManager
      if (window.BF25BundleManager && choice) {
        window.BF25BundleManager.setExistingCartChoice(choice);
      }

      // 7. Mark session as shown
      sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');

      // 8. Handle "clear" choice
      if (choice === 'clear') {
        await this.clearShopifyCart();
      }

      return choice;
    }

    // ============================================
    // SHOPIFY CART OPERATIONS
    // ============================================

    /**
     * Fetch current Shopify cart
     */
    async fetchShopifyCart() {
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

        return await response.json();

      } catch (error) {
        console.error('[BF25 Isolation] Error fetching cart:', error);
        return null;
      }
    }

    /**
     * Filter out bundle items, returning only existing non-bundle items
     */
    filterNonBundleItems(items) {
      return items.filter(item => {
        // Check if item has bundle property
        const properties = item.properties || {};
        const isBundleItem = properties[CONFIG.BUNDLE_PROPERTY] === 'true';

        // Also check for gift items (they have _bf25_gift property)
        const isGiftItem = properties['_bf25_gift'] === 'true';

        // Return true if NOT a bundle/gift item (i.e., existing cart item)
        return !isBundleItem && !isGiftItem;
      });
    }

    /**
     * Clear all items from Shopify cart
     */
    async clearShopifyCart() {
      console.log('[BF25 Isolation] Clearing Shopify cart...');

      try {
        const response = await fetch('/cart/clear.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Cart clear failed: ${response.status}`);
        }

        console.log('[BF25 Isolation] ✓ Cart cleared');

        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('bf25:cartCleared', { bubbles: true }));

        return true;

      } catch (error) {
        console.error('[BF25 Isolation] Error clearing cart:', error);
        return false;
      }
    }

    // ============================================
    // MODAL DISPLAY
    // ============================================

    /**
     * Show the choice modal and return user's decision
     * @param {Array} existingItems - Non-bundle items in cart
     * @param {Object} cart - Full cart object
     * @returns {Promise<string>} 'keep' or 'clear'
     */
    showChoiceModal(existingItems, cart) {
      return new Promise((resolve) => {
        this.resolveChoice = resolve;

        // Calculate cart value for display
        const cartValue = (cart.total_price / 100).toFixed(2);
        const itemCount = existingItems.length;
        const itemText = itemCount === 1 ? 'item' : 'items';

        // Build modal HTML
        const modalHTML = `
          <div class="bf25-isolation-modal" role="dialog" aria-modal="true" aria-labelledby="bf25-isolation-title">
            <div class="bf25-isolation-overlay"></div>
            <div class="bf25-isolation-content">

              <div class="bf25-isolation-header">
                <div class="bf25-isolation-icon">🛒</div>
                <h2 id="bf25-isolation-title">You have items in your cart</h2>
                <p class="bf25-isolation-subtitle">
                  ${itemCount} ${itemText} worth €${cartValue}
                </p>
              </div>

              <div class="bf25-isolation-body">
                <p>What would you like to do with your existing cart while building your Black Friday bundle?</p>

                <div class="bf25-isolation-items-preview">
                  ${this.renderItemsPreview(existingItems.slice(0, 3))}
                  ${existingItems.length > 3 ? `<p class="bf25-isolation-more">+${existingItems.length - 3} more</p>` : ''}
                </div>
              </div>

              <div class="bf25-isolation-actions">
                <button class="bf25-isolation-btn bf25-isolation-btn--keep" data-choice="keep">
                  <span class="bf25-isolation-btn-icon">✓</span>
                  <span class="bf25-isolation-btn-text">
                    <strong>Keep Items</strong>
                    <small>Bundle adds to existing cart</small>
                  </span>
                </button>

                <button class="bf25-isolation-btn bf25-isolation-btn--clear" data-choice="clear">
                  <span class="bf25-isolation-btn-icon">✕</span>
                  <span class="bf25-isolation-btn-text">
                    <strong>Start Fresh</strong>
                    <small>Clear cart & build bundle only</small>
                  </span>
                </button>
              </div>

              <p class="bf25-isolation-note">
                💡 Your bundle items are saved separately and won't affect your regular browsing.
              </p>

            </div>
          </div>
        `;

        // Insert modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.querySelector('.bf25-isolation-modal');

        // Bind event listeners
        this.bindModalEvents();

        // Show with animation
        requestAnimationFrame(() => {
          this.modal.classList.add('is-visible');
        });

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        this.isShowing = true;
        console.log('[BF25 Isolation] Modal displayed');
      });
    }

    /**
     * Render preview of existing cart items
     */
    renderItemsPreview(items) {
      return items.map(item => `
        <div class="bf25-isolation-item">
          ${item.image
            ? `<img src="${item.image}" alt="${item.title}" class="bf25-isolation-item-image">`
            : `<div class="bf25-isolation-item-placeholder">📦</div>`
          }
          <div class="bf25-isolation-item-info">
            <span class="bf25-isolation-item-title">${item.title}</span>
            <span class="bf25-isolation-item-qty">Qty: ${item.quantity}</span>
          </div>
        </div>
      `).join('');
    }

    /**
     * Bind modal event listeners
     */
    bindModalEvents() {
      if (!this.modal) return;

      // Button clicks
      const buttons = this.modal.querySelectorAll('.bf25-isolation-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const choice = btn.dataset.choice;
          this.handleChoice(choice);
        });
      });

      // Overlay click (default to "keep")
      const overlay = this.modal.querySelector('.bf25-isolation-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => {
          this.handleChoice('keep');
        });
      }

      // ESC key (default to "keep")
      this.escHandler = (e) => {
        if (e.key === 'Escape' && this.isShowing) {
          this.handleChoice('keep');
        }
      };
      document.addEventListener('keydown', this.escHandler);

      // Focus trap - focus first button
      const firstBtn = this.modal.querySelector('.bf25-isolation-btn');
      if (firstBtn) {
        setTimeout(() => firstBtn.focus(), CONFIG.MODAL_FADE_IN);
      }
    }

    /**
     * Handle user's choice
     */
    handleChoice(choice) {
      console.log(`[BF25 Isolation] User chose: ${choice}`);

      // Hide modal
      this.hideModal();

      // Resolve promise
      if (this.resolveChoice) {
        this.resolveChoice(choice);
        this.resolveChoice = null;
      }
    }

    /**
     * Hide and remove modal
     */
    hideModal() {
      if (!this.modal) return;

      // Remove ESC handler
      if (this.escHandler) {
        document.removeEventListener('keydown', this.escHandler);
      }

      // Animate out
      this.modal.classList.remove('is-visible');
      this.modal.classList.add('is-hiding');

      // Remove from DOM after animation
      setTimeout(() => {
        if (this.modal && this.modal.parentNode) {
          this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        this.isShowing = false;

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('[BF25 Isolation] Modal closed');
      }, CONFIG.MODAL_FADE_OUT);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  // Create global instance
  window.BF25CartIsolation = new CartIsolationController();

  // Auto-run check when BundleManager is ready
  // This hooks into the initialization sequence
  const runIsolationCheck = async () => {
    // Wait for BundleManager to be ready
    if (!window.BF25BundleManager) {
      console.log('[BF25 Isolation] Waiting for BundleManager...');
      setTimeout(runIsolationCheck, 100);
      return;
    }

    // Run the isolation check
    const choice = await window.BF25CartIsolation.checkAndPrompt();

    if (choice) {
      console.log(`[BF25 Isolation] ✓ Isolation complete: ${choice}`);
    }

    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('bf25:isolationComplete', {
      detail: { choice },
      bubbles: true
    }));
  };

  // Start check when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIsolationCheck);
  } else {
    // Small delay to ensure BundleManager loads first
    setTimeout(runIsolationCheck, 50);
  }

  console.log('[BF25 Isolation] 💡 Cart isolation controller loaded');

})();
