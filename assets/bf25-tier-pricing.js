/**
 * BF25 Tier-Aware Pricing
 * Updates upsell card prices based on current discount tier
 */
(function() {
  'use strict';

  // Prevent duplicate initialization
  if (window.BF25TierPricing) {
    console.log('⚠️ BF25TierPricing already initialized');
    return;
  }

  // Tier multipliers (relative to base 50% OFF price)
  const TIER_MULTIPLIERS = {
    50: 1.00,   // Base - no additional discount
    60: 0.80,   // Tier 1 (4+ items) - 20% OFF
    70: 0.65,   // Tier 2 (8+ items) - 35% OFF
    80: 0.58,   // Tier 3 (12+ items) - 42% OFF
    85: 0.52    // Tier 4 (16+ items) - 48% OFF
  };

  // Get current discount from BundleManager
  const getCurrentDiscount = () => {
    const bundle = window.BF25BundleManager?.getBundle?.();
    return bundle?.computed?.discountPercent || 50;
  };

  // Get multiplier for discount percentage
  const getMultiplier = (discountPercent) => {
    return TIER_MULTIPLIERS[discountPercent] || 1.00;
  };

  // Format price from cents to display string
  const formatPrice = (cents) => {
    const amount = cents / 100;
    const currency = window.Shopify?.currency?.active || 'EUR';
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Update single price element
  const updatePriceElement = (element, discountPercent) => {
    const basePriceCents = parseInt(element.dataset.basePrice, 10);
    if (!basePriceCents || isNaN(basePriceCents)) return;

    // data-base-price is RRP/compare price
    // First apply 50% base discount, then tier multiplier
    const fiftyPercentPrice = basePriceCents * 0.5;
    const multiplier = getMultiplier(discountPercent);
    const newPriceCents = Math.round(fiftyPercentPrice * multiplier);

    element.textContent = formatPrice(newPriceCents);
    element.dataset.currentDiscount = discountPercent.toString();
  };

  // Update all tier-aware prices
  const updateAllPrices = () => {
    const discountPercent = getCurrentDiscount();
    const priceElements = document.querySelectorAll('.bf25-upsell-tier-price[data-base-price]');

    let updated = 0;
    priceElements.forEach(el => {
      updatePriceElement(el, discountPercent);
      updated++;
    });

    if (updated > 0) {
      console.log(`💰 Updated ${updated} upsell prices for ${discountPercent}% OFF (×${getMultiplier(discountPercent)})`);
    }
  };

  // Also update prices on upsell cards (data-upsell-price attribute)
  const updateCardAttributes = () => {
    const discountPercent = getCurrentDiscount();
    const multiplier = getMultiplier(discountPercent);

    document.querySelectorAll('.bf25-upsell-card[data-upsell-base-price]').forEach(card => {
      const basePriceCents = parseInt(card.dataset.upsellBasePrice, 10);
      if (basePriceCents) {
        const fiftyPercentPrice = basePriceCents * 0.5;
        const newPriceCents = Math.round(fiftyPercentPrice * multiplier);
        card.dataset.upsellPrice = newPriceCents.toString();
      }
    });
  };

  // Full update
  const update = () => {
    updateAllPrices();
    updateCardAttributes();
  };

  // Listen for bundle events
  const setupEventListeners = () => {
    // Main bundle update event
    document.addEventListener('bf25:bundleUpdated', (e) => {
      // Small delay to ensure tier calculation is complete
      setTimeout(update, 50);
    });

    // Item added event
    document.addEventListener('bf25:cart:added', () => {
      setTimeout(update, 50);
    });

    // Item removed event (if exists)
    document.addEventListener('bf25:cart:removed', () => {
      setTimeout(update, 50);
    });
  };

  // Observe for dynamically added upsell elements (modals, etc.)
  const setupMutationObserver = () => {
    const observer = new MutationObserver((mutations) => {
      let hasNewUpsells = false;

      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches?.('.bf25-upsell-card') ||
                node.querySelector?.('.bf25-upsell-card')) {
              hasNewUpsells = true;
            }
          }
        });
      });

      if (hasNewUpsells) {
        setTimeout(update, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Public API
  window.BF25TierPricing = {
    update: update,
    getMultiplier: getMultiplier,
    getCurrentDiscount: getCurrentDiscount,
    MULTIPLIERS: TIER_MULTIPLIERS,

    // Manual price calculation helper
    calculateTierPrice: (basePriceCents, discountPercent = null) => {
      const discount = discountPercent || getCurrentDiscount();
      const fiftyPercentPrice = basePriceCents * 0.5;
      const multiplier = getMultiplier(discount);
      return Math.round(fiftyPercentPrice * multiplier);
    },

    // Debug helper
    debug: () => {
      const discount = getCurrentDiscount();
      const multiplier = getMultiplier(discount);
      const elements = document.querySelectorAll('.bf25-upsell-tier-price[data-base-price]');

      console.log('💰 BF25 Tier Pricing Debug:');
      console.log(`  Current discount: ${discount}%`);
      console.log(`  Multiplier: ×${multiplier}`);
      console.log(`  Tier-aware elements: ${elements.length}`);

      elements.forEach((el, i) => {
        if (i < 5) {
          const rrp = el.dataset.basePrice / 100;
          const fiftyOff = rrp * 0.5;
          const tierPrice = fiftyOff * multiplier;
          console.log(`  ${i + 1}. RRP: €${rrp.toFixed(2)} → 50%: €${fiftyOff.toFixed(2)} → ${discount}%: €${tierPrice.toFixed(2)} (shows: ${el.textContent})`);
        }
      });
    }
  };

  // Initialize
  const initialize = () => {
    setupEventListeners();
    setupMutationObserver();

    // Initial update
    update();

    console.log('✅ BF25 Tier Pricing initialized');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    setTimeout(initialize, 100);
  }

})();