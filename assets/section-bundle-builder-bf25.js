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

// ============================================
// DYNAMIC TIER PRICING FOR PRODUCT CARDS
// Updates prices and badges when tier changes
// ============================================

(function() {
  'use strict';

  const TIER_MULTIPLIERS = { 0: 1.0, 1: 0.85, 2: 0.70, 3: 0.60, 4: 0.54 };
  const TIER_DISCOUNTS = { 0: "50%", 1: "60%", 2: "70%", 3: "80%", 4: "85%" };

  let currentTier = 0;

  // Format price using Shopify's money format
  function formatMoney(cents) {
    if (window.theme?.moneyFormat) {
      const amount = (cents / 100).toFixed(2);
      return window.theme.moneyFormat.replace(/\{\{[^}]*\}\}/g, amount);
    }
    // Fallback
    const symbol = window.Shopify?.currency?.active === 'USD' ? '$' : '€';
    return `${symbol}${(cents / 100).toFixed(2).replace('.', ',')}`;
  }

  // Update all product card prices based on tier
  function updateCardPrices(tier) {
    if (tier === currentTier) return;
    currentTier = tier;

    const multiplier = TIER_MULTIPLIERS[tier] || 1.0;
    const discountText = TIER_DISCOUNTS[tier] || "50%";

    console.log(`[BF25 Cards] Updating prices for Tier ${tier} (${discountText} OFF, multiplier: ${multiplier})`);

    // Update all price elements
    document.querySelectorAll('.section-collections-with-nav__product-price[data-base-price]').forEach(priceEl => {
      const basePrice = parseInt(priceEl.dataset.basePrice, 10);
      if (!isNaN(basePrice)) {
        const newPrice = Math.round(basePrice * multiplier);
        priceEl.innerHTML = formatMoney(newPrice);
      }
    });

    // Update all discount badges
    document.querySelectorAll('.bf25-discount-text[data-discount-badge]').forEach(badge => {
      badge.textContent = `${discountText} OFF`;
    });

    console.log(`[BF25 Cards] ✓ Updated ${document.querySelectorAll('.section-collections-with-nav__product-price[data-base-price]').length} prices`);
  }

  // Listen for tier changes
  document.addEventListener('bf25:tierUnlocked', (e) => {
    updateCardPrices(e.detail.tier);
  });

  document.addEventListener('bf25:tierDowngraded', (e) => {
    updateCardPrices(e.detail.currentTier);
  });

  document.addEventListener('bf25:tierChanged', (e) => {
    updateCardPrices(e.detail.currentTier || e.detail.tier || 0);
  });

  // Initialize on page load - check current tier from BundleManager
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const bundle = window.BF25BundleManager?.getBundle?.();
      if (bundle?.computed?.tierReached) {
        updateCardPrices(bundle.computed.tierReached);
      }
    }, 500);
  });

  console.log('[BF25 Cards] Dynamic tier pricing initialized');
})();
