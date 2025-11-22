/**
 * ═══════════════════════════════════════════════════════════════════════
 * BF25 INTERACTIVE HERO - JAVASCRIPT CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Prompt: BF25-HERO-P3 (JavaScript Interactivity)
 * File: assets/bf25-hero.js
 * Purpose: Slider logic, tier calculations, gift unlock mechanics
 *
 * Architecture:
 * - ES6 class-based module (follows bf25-expansion-core.js pattern)
 * - Vanilla JavaScript (no jQuery or libraries)
 * - Single event listener for performance
 * - CSS variable manipulation for visualization updates
 * - Cached DOM queries in constructor
 *
 * Key Features:
 * - Tier detection based on slider value (0-16)
 * - Dynamic gift unlock/lock states
 * - Accurate pricing: quantity × shopify_base × tier_multiplier
 * - Savings calculation: (retail - discounted) + gift_value
 * - Real-time tier card updates
 * - Checkpoint activation at 4/8/12/16
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * PowerSlider - Main controller for BF25 Interactive Hero slider
 *
 * Responsibilities:
 * - Parse JSON configuration data
 * - Handle slider input events
 * - Calculate active tier based on slider value
 * - Update visualization fill (CSS variable)
 * - Toggle gift unlock states (class manipulation)
 * - Update tier card content and theming
 * - Calculate and display pricing with tier discounts
 * - Manage checkpoint activation states
 * - Update ARIA attributes for accessibility
 */
class PowerSlider {
  /**
   * Initialize PowerSlider controller
   * @param {HTMLElement} containerElement - The .bf25-hero section element
   */
  constructor(containerElement) {
    this.container = containerElement;

    // Load JSON data from embedded script
    this.data = this.loadData();
    if (!this.data) {
      console.error('BF25 Hero: Failed to initialize - no data found');
      return;
    }

    // Configuration shortcuts
    this.config = this.data.config;
    this.gifts = this.data.gifts;
    this.tiers = this.data.tiers;

    // Current state
    this.currentValue = 0;
    this.currentTier = this.tiers[0]; // Default to tier 0 (Explore)

    // Cache all DOM elements
    this.elements = this.cacheDOM();

    if (!this.elements.sliderInput) {
      console.error('BF25 Hero: Slider input not found');
      return;
    }

    // Initialize
    this.init();
  }

  /**
   * Load and parse JSON data from #bf25HeroData script tag
   * @returns {Object|null} Parsed data or null if error
   */
  loadData() {
    const dataScript = document.getElementById('bf25HeroData');
    if (!dataScript) {
      console.error('BF25 Hero: Data script #bf25HeroData not found');
      return null;
    }

    try {
      const data = JSON.parse(dataScript.textContent);
      console.log('✅ BF25 Hero: Data loaded successfully', data);
      return data;
    } catch (error) {
      console.error('BF25 Hero: Failed to parse JSON data', error);
      return null;
    }
  }

  /**
   * Cache all DOM elements for performance
   * @returns {Object} Object containing all cached elements
   */
  cacheDOM() {
    return {
      sliderInput: this.container.querySelector('.bf25-hero__input'),
      visualizationFill: this.container.querySelector('.bf25-hero__fill'),
      giftBoxes: this.container.querySelectorAll('.bf25-hero__gift-box'),
      checkpoints: this.container.querySelectorAll('.bf25-hero__checkpoint'),
      card: this.container.querySelector('.bf25-hero__card'),
      tierBadgeText: this.container.querySelector('.bf25-hero__tier-badge-text'),
      discountLabel: this.container.querySelector('.bf25-hero__discount-label'),
      giftListItems: this.container.querySelectorAll('.bf25-hero__gift-list-item'),
      pricingTotal: this.container.querySelector('[data-price-type="total"]'),
      pricingSavings: this.container.querySelector('[data-price-type="savings"]')
    };
  }

  /**
   * Initialize event listeners and set initial state
   */
  init() {
    // Bind slider input event
    this.elements.sliderInput.addEventListener('input', (e) => {
      this.handleSliderInput(parseInt(e.target.value, 10));
    });

    // Set initial state (value = 0)
    this.handleSliderInput(0);

    console.log('✅ BF25 Hero: PowerSlider initialized');
  }

  /**
   * Main handler for slider input changes
   * Orchestrates all UI updates
   *
   * @param {number} value - Slider value (0-16)
   */
  handleSliderInput(value) {
    this.currentValue = value;
    this.currentTier = this.calculateTier(value);

    console.log(`🎚️ Slider: ${value} items → Tier ${this.currentTier.id} (${this.currentTier.badge})`);

    // Update all UI components
    this.updateVisualization();
    this.updateGiftBoxes();
    this.updateCheckpoints();
    this.updateTierCard();
    this.updatePricing();
    this.updateARIA();
  }

  /**
   * Calculate which tier the current value falls into
   *
   * @param {number} value - Slider value (0-16)
   * @returns {Object} Active tier object
   */
  calculateTier(value) {
    const tier = this.tiers.find(t => value >= t.min && value <= t.max);
    return tier || this.tiers[0]; // Fallback to tier 0
  }

  /**
   * Update visualization fill using CSS custom property
   * Animates the 16-segment fill bar
   */
  updateVisualization() {
    const percentage = (this.currentValue / this.config.max_items) * 100;
    this.container.style.setProperty('--fill-width', `${percentage}%`);
  }

  /**
   * Update gift box unlock states
   * Toggles .is-unlocked class and changes lock icon
   */
  updateGiftBoxes() {
    this.elements.giftBoxes.forEach((box, index) => {
      const gift = this.gifts[index];
      if (!gift) return;

      const isUnlocked = this.currentTier.id >= gift.tier;

      if (isUnlocked) {
        box.classList.add('is-unlocked');
        const lockIcon = box.querySelector('.bf25-hero__gift-lock-icon');
        if (lockIcon) lockIcon.textContent = '✅';
      } else {
        box.classList.remove('is-unlocked');
        const lockIcon = box.querySelector('.bf25-hero__gift-lock-icon');
        if (lockIcon) lockIcon.textContent = '🔒';
      }
    });
  }

  /**
   * Update checkpoint states at tier boundaries (4, 8, 12, 16)
   * Adds .is-reached class when slider passes checkpoint
   */
  updateCheckpoints() {
    this.elements.checkpoints.forEach(checkpoint => {
      const checkpointValue = parseInt(checkpoint.dataset.value, 10);

      if (this.currentValue >= checkpointValue) {
        checkpoint.classList.add('is-reached');
      } else {
        checkpoint.classList.remove('is-reached');
      }
    });
  }

  /**
   * Update tier card content and theme color
   * Updates badge, discount label, gift list, and border color
   */
  updateTierCard() {
    // Update data attribute
    this.elements.card.dataset.activeTier = this.currentTier.id;

    // Update theme color (CSS custom property for dynamic border/text color)
    this.container.style.setProperty('--color-tier-current', this.currentTier.color);

    // Update badge and discount display
    if (this.elements.tierBadgeText) {
      this.elements.tierBadgeText.textContent = this.currentTier.badge;
    }

    if (this.elements.discountLabel) {
      this.elements.discountLabel.textContent = this.currentTier.display_label;
    }

    // Update gift list items
    this.updateGiftList();
  }

  /**
   * Update gift list items in tier card
   * Toggle lock/unlock states and icons
   */
  updateGiftList() {
    this.elements.giftListItems.forEach((item, index) => {
      const gift = this.gifts[index];
      if (!gift) return;

      const isUnlocked = this.currentTier.id >= gift.tier;

      if (isUnlocked) {
        item.classList.remove('is-locked');
        item.classList.add('is-unlocked');
        const icon = item.querySelector('.bf25-hero__gift-list-icon');
        if (icon) icon.textContent = '✅';
      } else {
        item.classList.add('is-locked');
        item.classList.remove('is-unlocked');
        const icon = item.querySelector('.bf25-hero__gift-list-icon');
        if (icon) icon.textContent = '🔒';
      }
    });
  }

  /**
   * Update pricing display with accurate calculations
   *
   * Formula:
   * - Estimated Total = quantity × shopify_base_price × tier_multiplier
   * - Retail Total = quantity × retail_price
   * - Gift Value = sum of all unlocked gifts
   * - Total Savings = (Retail Total - Estimated Total) + Gift Value
   */
  updatePricing() {
    // Edge case: No items selected
    if (this.currentValue === 0) {
      if (this.elements.pricingTotal) {
        this.elements.pricingTotal.textContent = '—';
      }
      if (this.elements.pricingSavings) {
        this.elements.pricingSavings.textContent = '—';
      }
      return;
    }

    // Calculate estimated total (what customer pays)
    // Formula: quantity × Shopify base price × tier multiplier
    const estimatedTotal = this.currentValue * this.config.avg_price_shopify * this.currentTier.multiplier;

    // Calculate total retail value (for savings comparison)
    const retailTotal = this.currentValue * this.config.avg_price_retail;

    // Calculate total gift value (sum of unlocked gifts)
    const giftValue = this.gifts.reduce((sum, gift) => {
      return this.currentTier.id >= gift.tier ? sum + gift.value : sum;
    }, 0);

    // Calculate total savings
    // Savings from discount + free gift value
    const totalSavings = (retailTotal - estimatedTotal) + giftValue;

    // Update display
    if (this.elements.pricingTotal) {
      this.elements.pricingTotal.textContent = this.formatPrice(estimatedTotal);
    }

    if (this.elements.pricingSavings) {
      this.elements.pricingSavings.textContent = this.formatPrice(totalSavings);
    }

    // Debug logging
    console.log('💰 Pricing:', {
      quantity: this.currentValue,
      tier: this.currentTier.display_label,
      multiplier: this.currentTier.multiplier,
      estimatedTotal: this.formatPrice(estimatedTotal),
      retailTotal: this.formatPrice(retailTotal),
      giftValue: this.formatPrice(giftValue),
      totalSavings: this.formatPrice(totalSavings)
    });
  }

  /**
   * Format price for display
   *
   * @param {number} amount - Price amount
   * @returns {string} Formatted price with currency symbol
   */
  formatPrice(amount) {
    return `${this.config.currency_symbol}${amount.toFixed(2)}`;
  }

  /**
   * Update ARIA attributes for accessibility
   * Updates slider aria-valuenow and aria-valuetext
   */
  updateARIA() {
    if (this.elements.sliderInput) {
      this.elements.sliderInput.setAttribute('aria-valuenow', this.currentValue);
      this.elements.sliderInput.setAttribute(
        'aria-valuetext',
        `${this.currentValue} items selected, ${this.currentTier.display_label}`
      );
    }
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AUTO-INITIALIZATION
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Initialize PowerSlider when DOM is ready
 * Looks for section element with ID or class
 */

function initPowerSlider() {
  const heroElement = document.getElementById('bf25-hero-section') ||
                      document.querySelector('.bf25-hero');

  if (heroElement) {
    window.bf25PowerSlider = new PowerSlider(heroElement);
  } else {
    console.warn('BF25 Hero: Section element not found');
  }
}

// Initialize on DOMContentLoaded or immediately if DOM already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPowerSlider);
} else {
  initPowerSlider();
}
