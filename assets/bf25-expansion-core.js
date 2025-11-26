/**
 * ═══════════════════════════════════════════════════════════════════════
 * BF25 EXPANSION MODAL - CORE ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Prompt 3: JavaScript Foundation (Simple State + Event Delegation)
 *
 * Purpose: Establish the core architecture for the dual-mode expansion modal.
 * This file contains the state management system and main controller class.
 *
 * Architecture:
 * - ModalState: Simple state object with update/subscribe methods
 * - ExpansionManager: Main controller (skeleton with placeholders)
 * - Event Delegation: Efficient handling for 27+ product cards
 *
 * Future Expansion:
 * - Prompt 5: Animation methods (animateOpen/animateClose)
 * - Prompt 6: Content population (populateContent)
 * - Prompt 7: Variant management (VariantManager class)
 * - Prompt 8: Tier calculations (TierCalculator class)
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT: Simple Object with Explicit Updates
// ═══════════════════════════════════════════════════════════════════════

/**
 * ModalState - Centralized state management using simple object pattern
 *
 * Design Decision: Using simple object with explicit update methods instead
 * of Proxy for easier debugging and better browser compatibility.
 */
class ModalState {
  constructor() {
    // Core state properties
    this.data = {
      // Modal lifecycle
      isOpen: false,
      isAnimating: false,

      // Mode (from Theme Customizer)
      mode: window.bf25Config?.mode || 'power_packs',

      // Current product
      productId: null,
      currentCard: null,

      // Variant selection (populated in Prompt 7)
      selectedVariantId: null,
      selectedOptions: {},

      // Quantity
      quantity: 1,

      // Cart progress (populated in Prompt 11)
      cartItemCount: 0,           // Total items currently in cart
      cartItems: [],              // Cart line items array
      cartFetched: false,         // Whether cart has been fetched
      cartLastUpdated: null,      // Timestamp of last cart fetch

      // Tier calculations (with cart awareness)
      nextTier: null
    };

    // Listener callbacks for state changes
    this.listeners = [];

    // Debug logging
    if (window.bf25Config?.debug) {
      console.log('🎯 ModalState initialized:', this.data);
    }
  }

  /**
   * Update a single state property and notify listeners
   */
  update(key, value) {
    const oldValue = this.data[key];
    this.data[key] = value;

    if (window.bf25Config?.debug) {
      console.log(`📝 State updated: ${key}`, { from: oldValue, to: value });
    }

    // Notify all listeners
    this.notifyListeners(key, value, oldValue);
  }

  /**
   * Get a state property value
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Get all state data (for debugging)
   */
  getAll() {
    return { ...this.data };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners(key, newValue, oldValue) {
    this.listeners.forEach(callback => {
      try {
        callback(key, newValue, oldValue);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Reset state to defaults (used when closing modal)
   */
  reset() {
    this.data.isOpen = false;
    this.data.isAnimating = false;
    this.data.productId = null;
    this.data.currentCard = null;
    this.data.selectedVariantId = null;
    this.data.selectedOptions = {};
    this.data.quantity = 1;

    if (window.bf25Config?.debug) {
      console.log('🔄 State reset to defaults');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// VARIANT MANAGEMENT (Prompt 7)
// ═══════════════════════════════════════════════════════════════════════

/**
 * VariantManager - Handles variant selection logic and UI
 *
 * Responsibilities:
 * - Parse variant options from data
 * - Generate variant selector UI
 * - Track user selections
 * - Find matching variant ID
 * - Update modal when variant changes
 */
class VariantManager {
  constructor(expansionManager) {
    this.manager = expansionManager;
    this.state = expansionManager.state;
    this.config = expansionManager.config;

    // Current product's variants
    this.variants = null;
    this.optionNames = []; // e.g., ["Color", "Capacity"]
    this.optionValues = {}; // e.g., { "Color": ["Black", "White"], "Capacity": ["10000mAh", "20000mAh"] }

    if (this.config.debug) {
      console.log('🎨 VariantManager initialized');
    }
  }

  /**
   * Initialize variant system for a product
   * Parses variant data and generates UI
   *
   * @param {string} productId - Product ID
   * @returns {string} HTML for variant selectors
   */
  initialize(productId) {
    this.variants = window.productVariants?.[productId];

    // Handle products with no variants or single variant
    if (!this.variants || this.variants.length === 0) {
      if (this.config.debug) {
        console.log('📦 No variants for product:', productId);
      }
      return '<div class="bf25-variant-none"></div>';
    }

    if (this.variants.length === 1) {
      // Single variant - no selection needed
      if (this.config.debug) {
        console.log('📦 Single variant product - auto-selecting');
      }
      this.selectVariant(this.variants[0].id);
      return '<div class="bf25-variant-single"></div>';
    }

    // Parse option structure
    this.parseOptions();

    // Set default selections (first option of each type)
    this.setDefaultSelections();

    // Generate UI
    return this.generateUI();
  }

  /**
   * Parse variant options to understand structure
   * Example: variants[0].options = ["Black", "10000mAh"]
   * Result: optionNames = ["Color", "Capacity"]
   *         optionValues = { "Color": ["Black", "White"], "Capacity": ["10000mAh", "20000mAh"] }
   */
  parseOptions() {
    if (!this.variants || this.variants.length === 0) return;

    // Determine number of option positions
    const firstVariant = this.variants[0];
    const optionCount = firstVariant.options.length;

    // Infer option names (Color, Capacity, etc.)
    // Note: Shopify doesn't provide option names in variant data,
    // so we'll use generic names or detect from values
    this.optionNames = this.inferOptionNames(optionCount);

    // Extract unique values for each option position
    this.optionValues = {};

    for (let i = 0; i < optionCount; i++) {
      const optionName = this.optionNames[i];
      const uniqueValues = new Set();

      this.variants.forEach(variant => {
        if (variant.options[i]) {
          uniqueValues.add(variant.options[i]);
        }
      });

      this.optionValues[optionName] = Array.from(uniqueValues);
    }

    if (this.config.debug) {
      console.log('🎨 Parsed Options:', {
        names: this.optionNames,
        values: this.optionValues
      });
    }
  }

  /**
   * Infer option names from option count and values
   *
   * @param {number} count - Number of options
   * @returns {Array} Option names
   */
  inferOptionNames(count) {
    // Check first variant's option values for hints
    const firstVariant = this.variants[0];
    const names = [];

    for (let i = 0; i < count; i++) {
      const value = firstVariant.options[i];

      // Detect color names
      if (this.isColorValue(value)) {
        names.push('Color');
      }
      // Detect capacity (mAh, ft, m, etc.)
      else if (/\d+(mAh|ft|m|cm|inch|in)/.test(value)) {
        names.push('Capacity');
      }
      // Detect length
      else if (/\d+\s*(ft|feet|m|meter|cm)/.test(value)) {
        names.push('Length');
      }
      // Generic fallback
      else {
        names.push(`Option ${i + 1}`);
      }
    }

    return names;
  }

  /**
   * Check if a value is likely a color
   */
  isColorValue(value) {
    const colorNames = [
      'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange',
      'purple', 'pink', 'gray', 'grey', 'brown', 'silver', 'gold'
    ];

    return colorNames.some(color =>
      value.toLowerCase().includes(color)
    );
  }

  /**
   * Set default selections (first option of each type)
   */
  setDefaultSelections() {
    const selections = {};

    this.optionNames.forEach(name => {
      selections[name] = this.optionValues[name][0];
    });

    this.state.update('selectedOptions', selections);

    // Find and select matching variant
    this.findAndSelectVariant();
  }

  /**
   * Generate variant selector UI HTML
   */
  generateUI() {
    let html = '<div class="bf25-variant-selectors">';

    this.optionNames.forEach(optionName => {
      const values = this.optionValues[optionName];
      const selectedValue = this.state.get('selectedOptions')[optionName];
      const isColor = optionName === 'Color';

      html += `
        <div class="bf25-variant-option-group">
          <label class="bf25-variant-label bf25-text-sm bf25-text-primary">
            <span class="bf25-variant-selected-value">${selectedValue}</span>
          </label>
          <div class="bf25-variant-options ${isColor ? 'bf25-variant-swatches' : 'bf25-variant-buttons'}">
      `;

      values.forEach(value => {
        const isSelected = value === selectedValue;
        const isAvailable = this.isOptionAvailable(optionName, value);

        html += this.generateOptionButton(optionName, value, isSelected, isAvailable, isColor);
      });

      html += `
          </div>
        </div>
      `;
    });

    html += '</div>';

    return html;
  }

  /**
   * Generate individual option button HTML
   */
  generateOptionButton(optionName, value, isSelected, isAvailable, isColor) {
    const classes = [
      'bf25-variant-option',
      isSelected ? 'is-selected' : '',
      !isAvailable ? 'is-disabled' : '',
      isColor ? 'bf25-variant-swatch' : 'bf25-variant-button'
    ].filter(Boolean).join(' ');

    const dataAttrs = `
      data-option-name="${optionName}"
      data-option-value="${value}"
    `;

    // For color swatches, try to detect hex color or use name
    let colorStyle = '';
    if (isColor) {
      const colorHex = this.getColorHex(value);
      if (colorHex) {
        colorStyle = `style="background-color: ${colorHex};"`;
      }
    }

    return `
      <button
        type="button"
        class="${classes}"
        ${dataAttrs}
        ${colorStyle}
        ${!isAvailable ? 'disabled' : ''}
        aria-pressed="${isSelected}"
        aria-label="${optionName}: ${value}"
      >
        ${!isColor ? value : ''}
        ${isColor ? `<span class="bf25-swatch-label">${value}</span>` : ''}
      </button>
    `;
  }

  /**
   * Get hex color code from color name
   */
  getColorHex(colorName) {
    const colorMap = {
      'black': '#000000',
      'white': '#FFFFFF',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#00FF00',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'gray': '#808080',
      'grey': '#808080',
      'brown': '#8B4513',
      'silver': '#C0C0C0',
      'gold': '#FFD700'
    };

    const normalized = colorName.toLowerCase();
    return colorMap[normalized] || null;
  }

  /**
   * Check if an option value is available given current selections
   * This prevents selecting impossible combinations
   */
  isOptionAvailable(checkOptionName, checkValue) {
    const currentSelections = { ...this.state.get('selectedOptions') };
    currentSelections[checkOptionName] = checkValue;

    // Try to find a variant matching this combination
    return this.variants.some(variant => {
      return this.optionNames.every((name, index) => {
        return variant.options[index] === currentSelections[name];
      });
    });
  }

  /**
   * Handle option selection
   * Called when user clicks a variant button
   */
  selectOption(optionName, value) {
    const currentSelections = this.state.get('selectedOptions');

    // Update selection
    const newSelections = { ...currentSelections };
    newSelections[optionName] = value;

    this.state.update('selectedOptions', newSelections);

    if (this.config.debug) {
      console.log('🎨 Option selected:', { [optionName]: value });
      console.log('🎨 All selections:', newSelections);
    }

    // Find matching variant
    this.findAndSelectVariant();

    // Update UI
    this.updateUI();
  }

  /**
   * Find variant that matches current selections
   */
  findAndSelectVariant() {
    const selections = this.state.get('selectedOptions');

    // Find matching variant
    const matchedVariant = this.variants.find(variant => {
      return this.optionNames.every((name, index) => {
        return variant.options[index] === selections[name];
      });
    });

    if (matchedVariant) {
      this.selectVariant(matchedVariant.id, matchedVariant);
    } else {
      console.warn('⚠️ No variant found for selections:', selections);
    }
  }

  /**
   * Select a variant (update state and trigger updates)
   */
  selectVariant(variantId, variantData = null) {
    // Find variant data if not provided
    const variant = variantData || this.variants.find(v => v.id === variantId);

    if (!variant) {
      console.error('❌ Variant not found:', variantId);
      return;
    }

    // Update state
    this.state.update('selectedVariantId', variantId);

    if (this.config.debug) {
      console.log('✅ Variant selected:', {
        id: variantId,
        options: variant.options,
        price: variant.price
      });
    }

    // Trigger updates
    this.updateProductImage(variant);
    this.updateProductPrice(variant);
  }

  /**
   * Update product image when variant changes
   */
  updateProductImage(variant) {
    if (!variant.image) return;

    const modalImage = document.querySelector('.bf25-modal-product-image');
    if (!modalImage) return;

    // Smooth transition
    modalImage.style.opacity = '0.5';

    setTimeout(() => {
      modalImage.src = variant.image;
      modalImage.style.opacity = '1';
    }, 150);

    if (this.config.debug) {
      console.log('🖼️ Image updated to:', variant.image);
    }
  }

  /**
   * Update product price when variant changes
   * Note: Price calculations will be enhanced in Prompt 8
   */
  updateProductPrice(variant) {
    const priceElement = document.querySelector('.bf25-price-current');
    if (!priceElement) return;

    priceElement.textContent = variant.price;

    if (this.config.debug) {
      console.log('💰 Price updated to:', variant.price);
    }
  }

  /**
   * Update UI to reflect current selections
   * (Refreshes button states)
   */
  updateUI() {
    const selections = this.state.get('selectedOptions');

    // Update button states
    document.querySelectorAll('.bf25-variant-option').forEach(button => {
      const optionName = button.dataset.optionName;
      const optionValue = button.dataset.optionValue;

      const isSelected = selections[optionName] === optionValue;
      const isAvailable = this.isOptionAvailable(optionName, optionValue);

      // Update classes
      button.classList.toggle('is-selected', isSelected);
      button.classList.toggle('is-disabled', !isAvailable);
      button.disabled = !isAvailable;
      button.setAttribute('aria-pressed', isSelected);
    });

    // Update selected value labels
    document.querySelectorAll('.bf25-variant-option-group').forEach((group, index) => {
      const optionName = this.optionNames[index];
      const selectedValue = selections[optionName];
      const labelElement = group.querySelector('.bf25-variant-selected-value');

      if (labelElement) {
        labelElement.textContent = selectedValue;
      }
    });
  }

  /**
   * Bind variant selection events
   * Called after UI is injected into DOM
   */
  bindEvents() {
    const container = document.querySelector('.bf25-variant-selectors');
    if (!container) return;

    // Event delegation for all variant buttons
    container.addEventListener('click', (e) => {
      const button = e.target.closest('.bf25-variant-option');

      if (!button || button.disabled) return;

      const optionName = button.dataset.optionName;
      const optionValue = button.dataset.optionValue;

      this.selectOption(optionName, optionValue);
    });

    if (this.config.debug) {
      console.log('✅ Variant events bound');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TIER PRICING CALCULATOR (Prompt 8)
// ═══════════════════════════════════════════════════════════════════════

/**
 * TierCalculator - Handles progressive discount calculations
 *
 * Responsibilities:
 * - Read tier configuration from window.bf25Config
 * - Calculate which tier applies for given quantity
 * - Calculate discounted prices
 * - Calculate "next tier" incentive messaging
 * - Generate urgency/savings copy (CRO optimized)
 */
class TierCalculator {
  constructor(expansionManager) {
    this.manager = expansionManager;
    this.state = expansionManager.state;
    this.config = expansionManager.config;

    // Load tier configuration
    this.tiers = this.config.tiers || [];

    if (this.tiers.length === 0) {
      console.warn('⚠️ No tiers configured, using single-tier pricing');
      this.tiers = [{ min: 1, max: 999, discount: 0, label: "Standard" }];
    }

    if (this.config.debug) {
      console.log('💰 TierCalculator initialized');
      console.log('Tiers:', this.tiers);
    }
  }

  /**
   * Get the tier that applies for a given quantity
   *
   * @param {number} quantity - Number of items
   * @returns {Object|null} Tier object or null
   */
  getTierForQuantity(quantity) {
    // Find tier that matches quantity
    const matchedTier = this.tiers.find(tier =>
      quantity >= tier.min && quantity <= tier.max
    );

    if (matchedTier) {
      if (this.config.debug) {
        console.log(`🎯 Tier matched for quantity ${quantity}:`, matchedTier.label, `(×${matchedTier.multiplier})`);
      }
      return matchedTier;
    }

    // Default to highest tier if quantity exceeds all tiers
    if (this.tiers.length > 0) {
      const highestTier = this.tiers[this.tiers.length - 1];
      if (this.config.debug) {
        console.log(`🎯 Quantity ${quantity} exceeds all tiers, using highest:`, highestTier.label);
      }
      return highestTier;
    }

    if (this.config.debug) {
      console.warn(`⚠️ No tier found for quantity ${quantity} - no tiers configured`);
    }
    return null;
  }

  /**
   * Get the next tier (for "add X more" messaging)
   *
   * @param {number} currentQuantity - Current quantity
   * @returns {Object|null} Next tier object or null if at max tier
   */
  getNextTier(currentQuantity) {
    const currentTier = this.getTierForQuantity(currentQuantity);
    if (!currentTier) return null;

    // Find next tier (higher min value)
    return this.tiers.find(tier =>
      tier.min > currentTier.max
    ) || null;
  }

  /**
   * Calculate items needed to reach next tier
   *
   * @param {number} currentQuantity - Current quantity
   * @returns {number} Items needed (0 if at max tier)
   */
  getItemsToNextTier(currentQuantity) {
    const nextTier = this.getNextTier(currentQuantity);
    if (!nextTier) return 0;

    return nextTier.min - currentQuantity;
  }

  /**
   * Calculate base price per item (handles variants)
   *
   * @param {Object} product - Product data
   * @param {string} variantId - Selected variant ID (optional)
   * @returns {number} Price in cents
   */
  getBasePricePerItem(product, variantId = null) {
    // If variant selected, try to use variant price
    if (variantId) {
      const variants = window.productVariants?.[product.id];
      const variant = variants?.find(v => v.id === variantId);

      if (variant && variant.price) {
        // Convert formatted string "€22.95" to cents
        return this.parsePriceString(variant.price);
      }
    }

    // Fallback to base price from product data
    return product.basePrice || 0;
  }

  /**
   * Parse price string to cents
   * Handles formats: "€22.95", "$22.95", "22.95"
   *
   * @param {string} priceString - Formatted price
   * @returns {number} Price in cents
   */
  parsePriceString(priceString) {
    if (typeof priceString === 'number') return priceString;

    // Remove currency symbols and spaces
    const cleaned = priceString.replace(/[€$£¥\s]/g, '');

    // Parse to float and convert to cents
    const euros = parseFloat(cleaned);
    return Math.round(euros * 100);
  }

  /**
   * Calculate discounted price per item for a tier
   *
   * @param {number} basePrice - Base price in cents
   * @param {number} discountPercent - Discount percentage (e.g., 10 for 10%)
   * @returns {number} Discounted price in cents
   */
  calculateDiscountedPrice(basePrice, discountPercent) {
    if (discountPercent === 0) return basePrice;

    const multiplier = 1 - (discountPercent / 100);
    return Math.round(basePrice * multiplier);
  }

  /**
   * Calculate complete pricing breakdown for current state
   * This is the main method called when quantity changes
   *
   * @returns {Object} Complete pricing information
   */
  calculatePricing() {
    const quantity = this.state.get('quantity') || 1;
    const productId = this.state.get('productId');
    const variantId = this.state.get('selectedVariantId');

    if (!productId) {
      console.error('❌ No product ID for pricing calculation');
      return null;
    }

    const product = window.productData[productId];
    if (!product) {
      console.error('❌ Product not found:', productId);
      return null;
    }

    // Get base price per item (Shopify price - already discounted)
    const basePricePerItem = this.getBasePricePerItem(product, variantId);

    // Get compare price for display reference (original retail price)
    const comparePrice = product.comparePrice || basePricePerItem;

    // Get current tier
    const currentTier = this.getTierForQuantity(quantity);

    if (this.config.debug) {
      console.log('💰 Pricing Calculation (BF25-FIX-018)');
      console.log('   Quantity:', quantity);
      console.log('   Shopify Price (base):', this.formatPrice(basePricePerItem));
      console.log('   Compare Price (retail):', this.formatPrice(comparePrice));
      console.log('   Tier:', currentTier?.label);
      console.log('   Multiplier:', currentTier?.multiplier);
      console.log('   Display Label:', currentTier?.displayLabel);
    }

    // CRITICAL FIX (BF25-FIX-018): Apply tier multiplier to Shopify basePrice, NOT comparePrice
    // Tier discounts stack on top of the already-discounted Shopify price
    const multiplier = currentTier?.multiplier || 1.0;
    const discountedPricePerItem = Math.round(basePricePerItem * multiplier);

    // Calculate totals - use comparePrice for savings reference
    const baseTotal = basePricePerItem * quantity;
    const discountedTotal = discountedPricePerItem * quantity;
    const savingsTotal = (comparePrice - discountedPricePerItem) * quantity;

    // Calculate effective discount percentage for display
    // This is just for showing "You saved X%", not for calculation
    const effectiveDiscountPercent = currentTier?.multiplier !== 1.0
      ? Math.round((1 - currentTier.multiplier) * 100)
      : 0;

    const savingsPercent = baseTotal > 0
      ? Math.round((savingsTotal / baseTotal) * 100)
      : 0;

    if (this.config.debug) {
      console.log('   Base price:', this.formatPrice(basePricePerItem));
      console.log('   Final price:', this.formatPrice(discountedPricePerItem));
      console.log('   Total:', this.formatPrice(discountedTotal));
      console.log('   Savings:', this.formatPrice(savingsTotal));
    }

    // Get next tier information
    const nextTier = this.getNextTier(quantity);
    const itemsToNextTier = this.getItemsToNextTier(quantity);

    // Calculate potential next tier pricing (using multiplier on basePrice)
    let nextTierPricing = null;
    if (nextTier) {
      const nextTierQuantity = nextTier.min;
      const nextTierMultiplier = nextTier.multiplier || 1.0;
      const nextTierDiscountedPrice = Math.round(basePricePerItem * nextTierMultiplier);
      const nextTierTotal = nextTierDiscountedPrice * nextTierQuantity;
      const nextTierSavings = (comparePrice - nextTierDiscountedPrice) * nextTierQuantity;

      nextTierPricing = {
        tier: nextTier,
        itemsNeeded: itemsToNextTier,
        multiplier: nextTierMultiplier,
        displayLabel: nextTier.displayLabel,
        pricePerItem: nextTierDiscountedPrice,
        total: nextTierTotal,
        savings: nextTierSavings
      };
    }

    const result = {
      quantity,

      // Current pricing
      basePricePerItem,
      comparePrice,  // BF25-FIX-022: Include comparePrice in result
      discountedPricePerItem,
      baseTotal,
      discountedTotal,
      savingsTotal,
      savingsPercent,

      // Tier info
      currentTier,
      multiplier,
      displayLabel: currentTier?.displayLabel || '',
      discountPercent: effectiveDiscountPercent,

      // Next tier info (for urgency messaging)
      nextTier,
      itemsToNextTier,
      nextTierPricing,

      // Flags
      hasDiscount: currentTier?.multiplier !== 1.0,
      isMaxTier: !nextTier,

      // Formatted strings (for display)
      formatted: {
        basePricePerItem: this.formatPrice(basePricePerItem),
        discountedPricePerItem: this.formatPrice(discountedPricePerItem),
        baseTotal: this.formatPrice(baseTotal),
        discountedTotal: this.formatPrice(discountedTotal),
        savingsTotal: this.formatPrice(savingsTotal),
        nextTierPricePerItem: nextTierPricing
          ? this.formatPrice(nextTierPricing.pricePerItem)
          : null
      }
    };

    if (this.config.debug) {
      console.group('💰 Pricing Calculation Summary');
      console.log('Quantity:', quantity);
      console.log('Tier:', currentTier?.label);
      console.log('Multiplier:', multiplier);
      console.log('Display:', result.displayLabel);
      console.log('Price per item:', result.formatted.discountedPricePerItem);
      console.log('Total:', result.formatted.discountedTotal);
      console.log('Savings:', result.formatted.savingsTotal, `(${savingsPercent}%)`);
      if (nextTier) {
        console.log('Next tier:', nextTier.label, `(+${itemsToNextTier} items)`, `×${nextTier.multiplier}`);
      }
      console.groupEnd();
    }

    return result;
  }

  /**
   * Calculate combined quantity (cart + current selection)
   * This is the key to cart-aware tier logic
   *
   * @returns {number} Combined quantity
   */
  getCombinedQuantity() {
    const cartQuantity = this.manager.cartManager.getCartQuantity(false); // Count all items
    const modalQuantity = this.state.get('quantity') || 0;

    return cartQuantity + modalQuantity;
  }

  /**
   * Calculate cart-aware pricing
   * Shows what tier/discount applies to TOTAL (cart + selection)
   *
   * @returns {Object} Pricing with cart awareness
   */
  calculateCartAwarePricing() {
    // Get base pricing for current modal selection
    const basePricing = this.calculatePricing();

    if (!basePricing) return null;

    // Get combined quantity
    const cartQuantity = this.manager.cartManager.getCartQuantity(false);
    const modalQuantity = this.state.get('quantity');
    const combinedQuantity = cartQuantity + modalQuantity;

    // Determine tier based on COMBINED quantity
    const combinedTier = this.getTierForQuantity(combinedQuantity);
    const combinedDiscount = combinedTier?.discount || 0;

    // Get next tier based on combined quantity
    const nextTier = this.getNextTier(combinedQuantity);
    const itemsToNextTier = nextTier ? nextTier.min - combinedQuantity : 0;

    // Calculate what the combined order would cost at combined tier discount
    const combinedPricePerItem = this.calculateDiscountedPrice(
      basePricing.basePricePerItem,
      combinedDiscount
    );

    const combinedTotal = combinedPricePerItem * combinedQuantity;
    const combinedSavings = (basePricing.basePricePerItem * combinedQuantity) - combinedTotal;

    // Return enhanced pricing object
    return {
      ...basePricing,  // Include all base pricing

      // Cart awareness
      cartQuantity,
      modalQuantity,
      combinedQuantity,

      // Combined tier information
      combinedTier,
      combinedDiscount,
      combinedPricePerItem,
      combinedTotal,
      combinedSavings,

      // Next tier (based on combined)
      nextTierCombined: nextTier,
      itemsToNextTierCombined: itemsToNextTier,

      // Flags
      hasCart: cartQuantity > 0,
      willUnlockTier: combinedDiscount > basePricing.discountPercent,

      // Formatted strings
      formattedCombined: {
        combinedPricePerItem: this.formatPrice(combinedPricePerItem),
        combinedTotal: this.formatPrice(combinedTotal),
        combinedSavings: this.formatPrice(combinedSavings)
      }
    };
  }

  /**
   * Format price from cents to currency string
   *
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price (e.g., "€22.95")
   */
  formatPrice(cents) {
    if (!cents || cents === 0) return '€0.00';

    const euros = (cents / 100).toFixed(2);
    return `€${euros}`;
  }

  /**
   * Generate urgency messaging HTML (CRO optimized, cart-aware)
   * Prompt 11: Enhanced with cart awareness
   *
   * @param {Object} pricing - Cart-aware pricing data
   * @returns {string} HTML for urgency message
   */
  generateUrgencyMessage(pricing) {
    if (!pricing) return '';

    const { nextTierCombined, itemsToNextTierCombined } = pricing;

    // At max tier (16+ items, 85% OFF)
    if (!nextTierCombined) {
      return `<span class="bf25-tier-hint" style="font-size:13px; color:#60c655;">🎉 Maximum discount unlocked!</span>`;
    }

    // Has next tier to unlock
    if (nextTierCombined && itemsToNextTierCombined > 0) {
      const nextTierLabel = nextTierCombined.displayLabel ||
                           (nextTierCombined.multiplier ? Math.round((1 - nextTierCombined.multiplier) * 100) + '% OFF' : 'next tier');
      return `<span class="bf25-tier-hint" style="font-size:13px; color:rgba(255,255,255,0.8);">Add <span style="color:#60c655; font-weight:600;">${itemsToNextTierCombined}</span> more for <span style="color:#60c655; font-weight:600;">${nextTierLabel}</span></span>`;
    }

    return '';
  }

  /**
   * Generate tier progress indicator HTML
   * Visual representation of tier progress
   *
   * @param {Object} pricing - Pricing data
   * @returns {string} HTML for progress bar
   */
  generateTierProgress(pricing) {
    if (!pricing || !pricing.nextTier) return '';

    const currentTier = pricing.currentTier;
    const totalRange = currentTier.max - currentTier.min + 1;
    const progress = ((pricing.quantity - currentTier.min) / totalRange) * 100;

    return `
      <div class="bf25-tier-progress">
        <div class="bf25-tier-progress-bar">
          <div class="bf25-tier-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
        </div>
        <div class="bf25-tier-progress-labels">
          <span class="bf25-tier-current">${currentTier.label}</span>
          <span class="bf25-tier-next-label">${pricing.nextTier.label}</span>
        </div>
      </div>
    `;
  }

  /**
   * Update pricing display in modal
   * Called when quantity changes, variant changes, or cart updates
   * Prompt 11: Now uses cart-aware pricing
   */
  updatePricingDisplay() {
    const pricing = this.calculateCartAwarePricing();  // ← CHANGED: Use cart-aware pricing
    if (!pricing) return;

    // Update main price display
    this.updateMainPrice(pricing);

    // Update/add tier messaging (with cart awareness)
    this.updateTierMessaging(pricing);

    // Update tier progress indicator
    this.updateTierProgress(pricing);

    // Update cart progress indicator (NEW)
    this.updateCartProgress(pricing);
  }

  /**
   * Update main price display area
   * Updated: BF25-FIX-014 - Prominent discount badge with percentage
   * Updated: BF25-CART-AWARE-DISCOUNT-BADGE - Uses combinedTier from cart-aware pricing
   */
  updateMainPrice(pricing) {
    const priceContainer = document.querySelector('.bf25-modal-pricing');
    if (!priceContainer) return;

    // BF25-FIX-022: Get comparePrice from pricing object (passed as parameter)
    // Pricing calculation already has comparePrice from product data
    const comparePrice = pricing.comparePrice || 0;
    const basePrice = pricing.basePricePerItem || 0;

    // Debug logging for cart-aware pricing (BF25-CART-AWARE-DISCOUNT-BADGE)
    if (this.config.debug) {
      console.log('💰 Cart-Aware Pricing:', {
        cartQuantity: pricing.cartQuantity,
        modalQuantity: pricing.modalQuantity,
        combinedQuantity: pricing.combinedQuantity,
        currentTier: pricing.currentTier?.label,
        combinedTier: pricing.combinedTier?.label,
        badgeWillShow: pricing.combinedTier?.displayLabel || pricing.currentTier?.displayLabel || '50% OFF'
      });
    }

    // Debug logging for compare price (BF25-FIX-020/022)
    console.log('🔍 updateMainPrice - Compare Price Debug:', {
      pricingHasCompare: 'comparePrice' in pricing,
      comparePrice: comparePrice,
      comparePriceType: typeof comparePrice,
      comparePriceGreaterThanZero: comparePrice > 0,
      condition: comparePrice && comparePrice > 0,
      formattedCompare: this.formatPrice ? this.formatPrice(comparePrice) : 'formatPrice method missing'
    });

    // Pre-build compare price HTML to avoid template literal nesting issues
    let compareHtml = '';
    if (comparePrice > 0) {
      const formatted = this.formatPrice(comparePrice);
      compareHtml = '<span class="bf25-price-compare"><s>' + formatted + '</s></span>';
      console.log('✅ Compare price HTML generated:', compareHtml);
    } else {
      console.log('❌ Compare price not shown (value:', comparePrice, ')');
    }

    // Build new price HTML (BF25-FIX-020, BF25-INLINE-BADGE, BF25-ALWAYS-SHOW-DISCOUNT-BADGE, BF25-CART-AWARE-DISCOUNT-BADGE)
    const html = `
      <!-- Main Price Row: Discounted | Original | Inline Badge -->
      <div class="bf25-price-main-row">
        <div class="bf25-price-current-group">
          <span class="bf25-price-current">${pricing.formatted.discountedPricePerItem}</span>
          <span class="bf25-per-item">per item</span>
          ${compareHtml}
          <span class="bf25-discount-badge-inline">
            ${pricing.combinedTier?.displayLabel
              || pricing.currentTier?.displayLabel
              || '50% OFF'}
          </span>
        </div>
      </div>

      <!-- Total Row - De-emphasized -->
      <div class="bf25-total-row">
        <span class="bf25-total-label">Total:</span>
        <span class="bf25-total-amount">${pricing.formatted.discountedTotal}</span>
        ${comparePrice && comparePrice > basePrice ? `
          <span class="bf25-total-savings">
            (save ${this.formatPrice((comparePrice - pricing.discountedPricePerItem) * pricing.quantity)})
          </span>
        ` : ''}
      </div>
    `;

    priceContainer.innerHTML = html;
  }

  /**
   * Update tier messaging area
   * BF25-8.8: Also inserts quantity stepper after messaging
   */
  updateTierMessaging(pricing) {
    // DISABLED: Tier messaging now inline with stepper (BF25-8.15)
    // Remove old message container if it exists
    const messageContainer = document.querySelector('.bf25-tier-messaging');
    if (messageContainer) {
      messageContainer.remove();
    }

    // Update inline tier hint (next to stepper)
    const tierHintContainer = document.querySelector('.bf25-stepper-row');
    if (!tierHintContainer) return;

    // Find existing tier hint or create placeholder
    let tierHint = tierHintContainer.querySelector('.bf25-tier-hint');
    const newHintHTML = this.generateUrgencyMessage(pricing);

    if (tierHint) {
      // Replace existing hint
      tierHint.outerHTML = newHintHTML;
    } else if (newHintHTML) {
      // Append new hint after stepper
      tierHintContainer.insertAdjacentHTML('beforeend', newHintHTML);
    }
  }

  /**
   * Update tier progress indicator
   */
  updateTierProgress(pricing) {
    // Find or create progress container
    let progressContainer = document.querySelector('.bf25-tier-progress-container');

    if (!progressContainer) {
      // Create container after tier messaging
      const messagingSection = document.querySelector('.bf25-tier-messaging');
      if (!messagingSection) return;

      progressContainer = document.createElement('div');
      progressContainer.className = 'bf25-tier-progress-container bf25-mb-4';
      messagingSection.insertAdjacentElement('afterend', progressContainer);
    }

    // Generate and inject progress bar
    progressContainer.innerHTML = this.generateTierProgress(pricing);
  }

  /**
   * Update cart progress indicator
   * Shows "X items in cart" and combined progress
   *
   * @param {Object} pricing - Cart-aware pricing data
   */
  updateCartProgress(pricing) {
    // Find or create container
    let container = document.querySelector('.bf25-cart-progress-container');

    if (!container) {
      // Create container at top of pricing section
      const pricingSection = document.querySelector('.bf25-modal-pricing');
      if (!pricingSection) return;

      container = document.createElement('div');
      container.className = 'bf25-cart-progress-container bf25-mb-3';
      pricingSection.insertAdjacentElement('beforebegin', container);
    }

    // Generate HTML
    container.innerHTML = this.generateCartProgressHTML(pricing);
  }

  /**
   * Generate cart progress HTML
   *
   * @param {Object} pricing - Pricing data
   * @returns {string} HTML
   */
  generateCartProgressHTML(pricing) {
    if (!pricing.hasCart) {
      // No items in cart - don't show indicator
      return '';
    }

    const { cartQuantity, modalQuantity, combinedQuantity, combinedTier, nextTierCombined, itemsToNextTierCombined } = pricing;

    // Calculate progress percentage to next tier
    let progressPercent = 0;
    if (nextTierCombined) {
      const currentTierMax = combinedTier.max;
      const currentTierMin = combinedTier.min;
      const tierRange = currentTierMax - currentTierMin + 1;
      progressPercent = ((combinedQuantity - currentTierMin) / tierRange) * 100;
    } else {
      // At max tier
      progressPercent = 100;
    }

    return `
      <div class="bf25-cart-progress">
        <div class="bf25-cart-progress-header">
          <div class="bf25-cart-progress-label">
            <span class="bf25-cart-progress-icon">🛒</span>
            <span class="bf25-text-sm bf25-text-secondary">
              <strong class="bf25-text-accent">${cartQuantity}</strong> ${cartQuantity === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
          ${modalQuantity > 0 ? `
            <div class="bf25-cart-progress-addition">
              <span class="bf25-text-sm bf25-text-secondary">
                + <strong class="bf25-text-primary">${modalQuantity}</strong> now =
                <strong class="bf25-text-accent">${combinedQuantity}</strong> total
              </span>
            </div>
          ` : ''}
        </div>

        <div class="bf25-cart-progress-bar-container">
          <div class="bf25-cart-progress-bar">
            <!-- Cart portion (darker) -->
            <div class="bf25-cart-progress-fill bf25-cart-fill"
                 style="width: ${(cartQuantity / combinedQuantity) * Math.min(progressPercent, 100)}%"></div>
            <!-- Modal portion (lighter) -->
            <div class="bf25-cart-progress-fill bf25-modal-fill"
                 style="width: ${(modalQuantity / combinedQuantity) * Math.min(progressPercent, 100)}%"></div>
          </div>
        </div>

        ${combinedTier ? `
          <div class="bf25-cart-progress-tier">
            <span class="bf25-text-xs bf25-text-accent">
              ${combinedTier.label}: ${combinedTier.displayLabel || (combinedTier.multiplier ? Math.round((1 - combinedTier.multiplier) * 100) + '% OFF' : '')}
            </span>
            ${nextTierCombined && itemsToNextTierCombined > 0 ? `
              <span class="bf25-text-xs bf25-text-tertiary">
                • ${itemsToNextTierCombined} more for ${nextTierCombined.displayLabel || (nextTierCombined.multiplier ? Math.round((1 - nextTierCombined.multiplier) * 100) + '% off' : '')}
              </span>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CART MANAGEMENT (Prompt 10)
// ═══════════════════════════════════════════════════════════════════════

/**
 * CartManager - Handles Shopify Cart API integration
 *
 * Responsibilities:
 * - Add items to Shopify cart
 * - Handle cart API responses
 * - Show user feedback (success/error)
 * - Update cart count in header (if applicable)
 * - Track cart operations for analytics
 */
class CartManager {
  constructor(expansionManager) {
    this.manager = expansionManager;
    this.state = expansionManager.state;
    this.config = expansionManager.config;

    // Cart API endpoints
    this.endpoints = {
      add: '/cart/add.js',
      get: '/cart.js',
      update: '/cart/update.js',
      change: '/cart/change.js',
      clear: '/cart/clear.js'
    };

    if (this.config.debug) {
      console.log('🛒 CartManager initialized');
    }
  }

  /**
   * Add item(s) to Shopify cart
   * Main method called when user clicks "Add to Cart"
   * Enhanced with retry logic and double-click prevention (Prompt 12)
   *
   * @returns {Promise<Object>} Cart response data
   */
  async addToCart() {
    // ─────────────────────────────────────────────────────────────────
    // DOUBLE-CLICK PREVENTION (Prompt 12)
    // ─────────────────────────────────────────────────────────────────
    if (this.isAddingToCart) {
      if (this.config.debug) {
        console.warn('⚠️ Add to cart already in progress, ignoring duplicate request');
      }
      return { success: false, error: 'Request in progress' };
    }

    this.isAddingToCart = true;

    try {
      // Validate required data
      const validation = this.validateCartData();
      if (!validation.valid) {
        this.showError(validation.error);
        return { success: false, error: validation.error };
      }

      // Get current state
      const productId = this.state.get('productId');
      const variantId = this.state.get('selectedVariantId');
      const quantity = this.state.get('quantity');

      // Get product data for properties
      const product = window.productData[productId];
      const pricing = this.manager.tierCalculator.calculatePricing();

      // ─────────────────────────────────────────────────────────────────
      // BUNDLEMANAGER INTEGRATION (Virtual Cart - Instant)
      // If BundleManager is available, add to localStorage instead of API
      // ─────────────────────────────────────────────────────────────────
      if (window.BF25BundleManager) {
        return await this.addToBundleManager(productId, variantId, quantity, product, pricing);
      }

      // ─────────────────────────────────────────────────────────────────
      // FALLBACK: Original Shopify API flow (if BundleManager unavailable)
      // ─────────────────────────────────────────────────────────────────

      // Build cart item object
      const cartItem = this.buildCartItem(variantId, quantity, product, pricing);

      if (this.config.debug) {
        console.group('🛒 Adding to Cart');
        console.log('Product:', product.title);
        console.log('Variant ID:', variantId);
        console.log('Quantity:', quantity);
        console.log('Cart Item:', cartItem);
        console.groupEnd();
      }

      // ─────────────────────────────────────────────────────────────────
      // NETWORK RETRY LOGIC (Prompt 12)
      // ─────────────────────────────────────────────────────────────────
      const maxRetries = 2;
      const timeoutMs = 10000; // 10 seconds
      let lastError = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0 && this.config.debug) {
            console.log(`🔄 Retry attempt ${attempt}/${maxRetries}`);
          }

          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

          try {
            // Send request to Shopify Cart API
            const response = await fetch(this.endpoints.add, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(cartItem),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Parse response
            const data = await response.json();

            if (response.ok) {
              // Success
              if (this.config.debug) {
                console.log('✅ Cart response:', data);
              }

              // After main product added, add selected upsells
              const selectedUpsells = this.manager.getSelectedUpsells();
              if (selectedUpsells.length > 0) {
                if (this.config.debug) {
                  console.log(`🛒 Adding ${selectedUpsells.length} selected upsell(s)...`);
                }

                const product = window.productData[this.state.get('productId')];
                for (const upsell of selectedUpsells) {
                  try {
                    await fetch('/cart/add.js', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      },
                      body: JSON.stringify({
                        id: upsell.variantId,
                        quantity: 1,
                        properties: {
                          '_bf25_upsell': 'true',
                          '_added_with': product.title
                        }
                      })
                    });

                    if (this.config.debug) {
                      console.log(`✅ Upsell added: ${upsell.title}`);
                    }
                  } catch (upsellError) {
                    console.error(`[BF25 Modal] Failed to add upsell ${upsell.title}:`, upsellError);
                    // Continue with other upsells even if one fails
                  }
                }

                // Clear selections after adding
                this.manager.clearUpsellSelections();
              }

              this.handleSuccess(data);
              return { success: true, data };
            } else {
              // Error response from Shopify (don't retry for 4xx errors)
              if (this.config.debug) {
                console.error('❌ Cart error:', data);
              }

              // Don't retry for client errors (4xx)
              if (response.status >= 400 && response.status < 500) {
                this.handleError(data);
                return { success: false, error: data };
              }

              // Retry for server errors (5xx)
              lastError = data;
              if (attempt < maxRetries) {
                await this.delay(1000 * (attempt + 1)); // Exponential backoff
                continue;
              }

              this.handleError(data);
              return { success: false, error: data };
            }

          } catch (fetchError) {
            clearTimeout(timeoutId);

            // Check if error is due to abort (timeout)
            if (fetchError.name === 'AbortError') {
              lastError = {
                message: 'Request Timeout',
                description: 'The request took too long. Please try again.'
              };
            } else {
              lastError = fetchError;
            }

            // Retry on network errors
            if (attempt < maxRetries) {
              if (this.config.debug) {
                console.warn(`⚠️ Network error, will retry: ${fetchError.message}`);
              }
              await this.delay(1000 * (attempt + 1)); // Exponential backoff
              continue;
            }

            // All retries exhausted
            throw fetchError;
          }

        } catch (error) {
          // Continue to next retry or throw
          if (attempt >= maxRetries) {
            throw error;
          }
        }
      }

      // Should not reach here, but handle as error
      throw lastError || new Error('Unknown error');

    } catch (error) {
      // Final error handler after all retries exhausted
      console.error('❌ Cart request failed after retries:', error);

      this.handleError({
        message: 'Network Error',
        description: 'Unable to add to cart after multiple attempts. Please check your connection and try again.'
      });

      return { success: false, error };

    } finally {
      // Always clear the lock
      this.isAddingToCart = false;
    }
  }

  /**
   * Delay helper for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate cart data before sending
   *
   * @returns {Object} Validation result
   */
  validateCartData() {
    const variantId = this.state.get('selectedVariantId');
    const quantity = this.state.get('quantity');
    const productId = this.state.get('productId');

    // Check variant ID
    if (!variantId) {
      return {
        valid: false,
        error: {
          message: 'No Variant Selected',
          description: 'Please select a product option before adding to cart.'
        }
      };
    }

    // Check quantity
    if (!quantity || quantity < 1) {
      return {
        valid: false,
        error: {
          message: 'Invalid Quantity',
          description: 'Please select a valid quantity.'
        }
      };
    }

    // Check product data exists
    if (!productId || !window.productData[productId]) {
      return {
        valid: false,
        error: {
          message: 'Product Not Found',
          description: 'Unable to add this product. Please try again.'
        }
      };
    }

    return { valid: true };
  }

  /**
   * Build cart item object for Shopify Cart API
   *
   * @param {string} variantId - Variant ID
   * @param {number} quantity - Quantity
   * @param {Object} product - Product data
   * @param {Object} pricing - Pricing calculation
   * @returns {Object} Cart item object
   */
  buildCartItem(variantId, quantity, product, pricing) {
    // Build properties object for cart line item
    // These will be visible in cart and checkout
    const properties = {
      '_source': 'BF25 Bundle Builder',
      '_mode': this.config.mode
    };

    // Add tier information if discount applied
    if (pricing && pricing.hasDiscount) {
      properties['_tier'] = pricing.currentTier.label;
      properties['_discount'] = `${pricing.discountPercent}% OFF`;
      properties['_savings'] = pricing.formatted.savingsTotal;
    }

    // Add selected options for reference
    const selectedOptions = this.state.get('selectedOptions');
    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      Object.entries(selectedOptions).forEach(([key, value]) => {
        properties[`_option_${key}`] = value;
      });
    }

    // Return cart item in Shopify format
    return {
      items: [{
        id: variantId,
        quantity: quantity,
        properties: properties
      }]
    };
  }

  // ============================================================================
  // BUNDLEMANAGER INTEGRATION (Virtual Cart)
  // ============================================================================

  /**
   * Add item to BundleManager instead of Shopify Cart API
   * This provides instant (<10ms) operations vs 300-600ms API calls
   *
   * @param {string} productId - Shopify product ID
   * @param {string} variantId - Shopify variant ID
   * @param {number} quantity - Quantity to add
   * @param {Object} product - Product data from window.productData
   * @param {Object} pricing - Calculated pricing from tierCalculator
   * @returns {Promise} Result object with success status
   */
  async addToBundleManager(productId, variantId, quantity, product, pricing) {
    if (this.config.debug) {
      console.group('🚀 Adding to BundleManager (Instant)');
      console.log('Product:', product.title);
      console.log('Variant ID:', variantId);
      console.log('Quantity:', quantity);
      console.groupEnd();
    }

    try {
      // Find the selected variant to get variant-specific data
      // Handle cases where variants might be in different locations
      const variants = product.variants || product.product?.variants || [];

      if (!variants || variants.length === 0) {
        console.warn('[BF25 Modal] No variants array found, using fallback data');
        // Fallback: construct minimal variant data from what we have
        // Price priority: pricing calculation > product.price > selected variant price
        let fallbackPrice = 0;

        // Try pricing object first (from tier calculator)
        if (pricing && pricing.unitPrice) {
          fallbackPrice = pricing.unitPrice;
        } else if (pricing && pricing.finalPrice) {
          fallbackPrice = pricing.finalPrice;
        } else if (product.basePrice) {
          // Custom productData uses basePrice
          fallbackPrice = product.basePrice;
        } else if (product.price) {
          // Shopify product.price is in cents
          fallbackPrice = product.price;
        } else if (product.variants && product.variants[0]) {
          fallbackPrice = product.variants[0].price;
        }

        // Convert to cents if needed (Shopify stores in cents, but sometimes displayed in dollars)
        if (fallbackPrice > 0 && fallbackPrice < 100) {
          // Likely in dollars, convert to cents
          fallbackPrice = Math.round(fallbackPrice * 100);
        }

        // Look up image from window.productData (BF25-8.7)
        let fallbackImage = product.featuredImage || product.featured_image || product.image || '';

        // If no image found, try looking up by handle in productData
        if (!fallbackImage && product.handle && window.productData && window.productData[product.handle]) {
          const pdProduct = window.productData[product.handle];
          fallbackImage = pdProduct.featuredImage || pdProduct.featured_image || pdProduct.image || '';
          if (this.config.debug && fallbackImage) {
            console.log('[BF25 Modal] Got fallback image from productData by handle:', product.handle);
          }
        }

        // Try searching by variant ID
        if (!fallbackImage && variantId && window.productData) {
          for (const [handle, pdProduct] of Object.entries(window.productData)) {
            const hasVariant = pdProduct.variants?.some(v => String(v.id) === String(variantId));
            if (hasVariant) {
              fallbackImage = pdProduct.featuredImage || pdProduct.featured_image || pdProduct.image || '';
              if (this.config.debug && fallbackImage) {
                console.log('[BF25 Modal] Got fallback image by variant search:', handle);
              }
              break;
            }
          }
        }

        console.log('[BF25 Modal] Fallback price:', fallbackPrice, 'image:', fallbackImage ? 'Found' : 'Missing');

        var variant = {
          id: variantId,
          title: 'Default Title',
          price: fallbackPrice
        };

        // Store resolved image for later use
        product._resolvedImage = fallbackImage;
      } else {
        var variant = variants.find(v => String(v.id) === String(variantId));

        if (!variant) {
          console.error('[BF25 Modal] Variant not found in array:', variantId, 'Available:', variants.map(v => v.id));
          this.showError({ message: 'Variant not found', description: 'Please try selecting the product again.' });
          return { success: false, error: 'Variant not found' };
        }
      }

      // Build product data for BundleManager
      const productData = {
        variantId: String(variantId),
        productId: String(productId),
        title: product.title,
        variantTitle: variant.title !== 'Default Title' ? variant.title : '',
        // Price priority: variant.price > product.basePrice > pricing.unitPrice > 0
        price: variant.price || product.basePrice || pricing?.unitPrice || pricing?.finalPrice || 0,
        // Get image URL - use resolved image from fallback or direct properties (BF25-8.7)
        image: product._resolvedImage || product.featuredImage || product.featured_image || product.image || '',
        handle: product.handle || ''
      };

      // Add to BundleManager
      const result = window.BF25BundleManager.addItem(productData, quantity);

      if (result.success) {
        if (this.config.debug) {
          console.log('✅ Added to bundle:', result);
        }

        // Handle upsells (also add to BundleManager)
        await this.addUpsellsToBundleManager(product);

        // Call success handler with adapted data
        this.handleBundleSuccess(result, product, variant, quantity);

        return { success: true, data: result };

      } else {
        // Handle BundleManager errors
        if (this.config.debug) {
          console.error('❌ BundleManager error:', result.error);
        }

        // Show appropriate error message
        if (result.error === 'MAX_ITEMS_REACHED') {
          this.showError({
            message: 'Bundle Full',
            description: `Your bundle has reached the maximum of 16 items. Remove some items to add more.`
          });
        } else {
          this.showError({
            message: 'Could not add item',
            description: result.message || 'Please try again.'
          });
        }

        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('[BF25 Modal] BundleManager error:', error);
      this.showError({
        message: 'Error adding item',
        description: 'Please try again.'
      });
      return { success: false, error: error.message };

    } finally {
      this.isAddingToCart = false;
    }
  }

  /**
   * Add selected upsells to BundleManager
   *
   * @param {Object} mainProduct - The main product being added
   */
  async addUpsellsToBundleManager(mainProduct) {
    const selectedUpsells = this.manager.getSelectedUpsells();

    if (!selectedUpsells || selectedUpsells.length === 0) {
      return;
    }

    if (this.config.debug) {
      console.log(`🛒 Adding ${selectedUpsells.length} upsell(s) to bundle...`);
    }

    for (const upsell of selectedUpsells) {
      try {
        // Build upsell product data
        const upsellData = {
          variantId: String(upsell.variantId),
          productId: String(upsell.productId || ''),
          title: upsell.title || 'Upsell Item',
          variantTitle: upsell.variantTitle || '',
          price: upsell.price || 0,
          image: upsell.image || '',
          handle: upsell.handle || ''
        };

        const result = window.BF25BundleManager.addItem(upsellData, 1);

        if (result.success) {
          if (this.config.debug) {
            console.log(`✅ Upsell added to bundle: ${upsell.title}`);
          }
        } else {
          console.warn(`[BF25 Modal] Could not add upsell to bundle: ${upsell.title}`, result.error);
        }

      } catch (error) {
        console.error(`[BF25 Modal] Error adding upsell ${upsell.title}:`, error);
        // Continue with other upsells even if one fails
      }
    }

    // Clear upsell selections after adding
    this.manager.clearUpsellSelections();
  }

  /**
   * Handle successful BundleManager addition
   * Adapted from handleSuccess() to work with BundleManager result format
   *
   * @param {Object} result - BundleManager.addItem() result
   * @param {Object} product - Product data
   * @param {Object} variant - Selected variant
   * @param {number} quantity - Quantity added
   */
  handleBundleSuccess(result, product, variant, quantity) {
    // Build data object similar to Shopify cart response for compatibility
    const data = {
      id: result.item.variantId,
      product_id: result.item.productId,
      title: product.title,
      variant_title: variant.title,
      quantity: quantity,
      price: variant.price,
      image: product.featured_image || '',
      // Include bundle-specific data
      bundleItemCount: result.computed.itemCount,
      bundleTier: result.computed.tierReached,
      tierUnlocked: result.tierUnlocked,
      giftUnlocked: result.giftUnlocked
    };

    // Show success notification
    this.showSuccess(data);

    // Update button state temporarily
    const button = document.querySelector('.bf25-add-to-cart');
    if (button) {
      this.setButtonSuccess(button);
    }

    // Track analytics event (if analytics available)
    this.trackAddToCart(data);

    // Emit custom event for theme integration
    this.emitCartEvent('bf25:cart:added', data);

    // Show tier/gift unlock notifications
    if (result.tierUnlocked) {
      // Toast is already shown by CartManager's event listener
      // But we can add extra feedback here if desired
      if (this.config.debug) {
        console.log(`🎉 Tier ${result.tierUnlocked} unlocked!`);
      }
    }

    if (result.giftUnlocked) {
      if (this.config.debug) {
        console.log(`🎁 Gift unlocked: ${result.giftUnlocked.title}`);
      }
    }

    // Close modal after showing success feedback
    setTimeout(() => {
      if (this.manager && typeof this.manager.close === 'function') {
        this.manager.close();
      }
    }, 800);
  }

  /**
   * Handle successful cart addition
   *
   * @param {Object} data - Cart response data
   */
  handleSuccess(data) {
    // Show success notification
    this.showSuccess(data);

    // Update cart state with new data (Prompt 11)
    this.updateCartState(data);

    // Update cart count in header (if exists)
    this.updateCartCount(data.item_count);

    // Update button state temporarily
    const button = document.querySelector('.bf25-add-to-cart');
    if (button) {
      this.setButtonSuccess(button);
    }

    // Track analytics event (if analytics available)
    this.trackAddToCart(data);

    // Emit custom event for theme integration
    this.emitCartEvent('bf25:cart:added', data);

    // Close modal after showing success feedback
    // Delay allows user to see checkmark confirmation
    setTimeout(() => {
      if (this.manager && typeof this.manager.close === 'function') {
        this.manager.close();
      }
    }, 800);
  }

  /**
   * Handle cart error
   *
   * @param {Object} error - Error data
   */
  handleError(error) {
    // Show error notification
    this.showError(error);

    // Reset button state
    const button = document.querySelector('.bf25-add-to-cart');
    if (button) {
      this.manager.setButtonLoading(button, false);
    }

    // Track error for analytics
    this.trackCartError(error);
  }

  /**
   * Show success notification
   *
   * @param {Object} data - Cart data
   */
  showSuccess(data) {
    const quantity = this.state.get('quantity') || 1;
    const productId = this.state.get('productId');
    const product = productId ? window.productData[productId] : null;

    // If no product data (quick-add flow), use generic message
    if (!product) {
      this.showNotification('Item added to bundle!', 'success');
      return;
    }

    const message = quantity === 1
      ? `${product.title} added to cart!`
      : `${quantity}x ${product.title} added to cart!`;

    this.showNotification(message, 'success');
  }

  /**
   * Show error notification
   *
   * @param {Object} error - Error data
   */
  showError(error) {
    const message = error.description || error.message || 'Unable to add to cart';
    this.showNotification(message, 'error');
  }

  /**
   * Show notification (toast message)
   *
   * @param {string} message - Message text
   * @param {string} type - 'success' or 'error'
   */
  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.bf25-notification');
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `bf25-notification bf25-notification-${type}`;
    notification.innerHTML = `
      <div class="bf25-notification-icon">
        ${type === 'success' ? '✓' : '⚠'}
      </div>
      <div class="bf25-notification-message">
        ${message}
      </div>
      <button class="bf25-notification-close" aria-label="Close notification">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    // Add to modal
    const modal = document.querySelector('.bf25-modal-container');
    if (modal) {
      modal.appendChild(notification);
    } else {
      document.body.appendChild(notification);
    }

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('is-visible');
    });

    // Close button
    const closeBtn = notification.querySelector('.bf25-notification-close');
    closeBtn.addEventListener('click', () => {
      this.hideNotification(notification);
    });

    // Auto-hide after delay
    const delay = type === 'success' ? 3000 : 5000;
    setTimeout(() => {
      this.hideNotification(notification);
    }, delay);

    if (this.config.debug) {
      console.log(`📢 Notification: ${message}`);
    }
  }

  /**
   * Hide notification with animation
   *
   * @param {HTMLElement} notification - Notification element
   */
  hideNotification(notification) {
    if (!notification) return;

    notification.classList.remove('is-visible');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  /**
   * Set button to success state temporarily
   *
   * @param {HTMLElement} button - Button element
   */
  setButtonSuccess(button) {
    const text = button.querySelector('.bf25-button-text');
    const icon = button.querySelector('.bf25-button-icon');
    const loader = button.querySelector('.bf25-button-loader');

    if (text) {
      const originalText = text.textContent;
      text.textContent = 'Added!';

      if (icon) {
        icon.textContent = '✓';
      }

      if (loader) {
        loader.hidden = true;
      }

      button.classList.add('is-success');
      button.classList.remove('is-loading');

      // Revert after 2 seconds
      setTimeout(() => {
        text.textContent = originalText;
        if (icon) {
          icon.textContent = '🛒';
        }
        button.classList.remove('is-success');
      }, 2000);
    }
  }

  /**
   * Update cart count in header
   *
   * @param {number} itemCount - Total item count
   */
  updateCartCount(itemCount) {
    // Find cart count elements (common selectors)
    const selectors = [
      '.cart-count',
      '.cart-link__bubble',
      '[data-cart-count]',
      '#cart-count',
      '.header__icon--cart .count'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.textContent = itemCount;

        // Add animation class if available
        el.classList.add('updated');
        setTimeout(() => {
          el.classList.remove('updated');
        }, 300);
      });
    });

    // Update data attributes
    const cartLinks = document.querySelectorAll('[data-cart-count]');
    cartLinks.forEach(link => {
      link.dataset.cartCount = itemCount;
    });

    if (this.config.debug) {
      console.log('🛒 Cart count updated:', itemCount);
    }
  }

  /**
   * Track add to cart event (analytics)
   *
   * @param {Object} data - Cart data
   */
  trackAddToCart(data) {
    const productId = this.state.get('productId');
    const pricing = productId
      ? this.manager.tierCalculator.calculatePricing(productId)
      : null;

    if (!pricing) return;

    // Track with Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
      const product = window.productData[productId];

      gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: pricing.discountedTotal / 100,
        items: [{
          item_id: this.state.get('variantId'),
          item_name: product.title,
          quantity: this.state.get('quantity'),
          price: pricing.discountedPricePerItem / 100,
          discount: pricing.savingsTotal / 100
        }]
      });
    }

    // Track with Facebook Pixel (if available)
    if (typeof fbq !== 'undefined') {
      fbq('track', 'AddToCart', {
        content_ids: [this.state.get('variantId')],
        content_type: 'product',
        value: pricing.discountedTotal / 100,
        currency: 'EUR'
      });
    }

    // Emit custom event for other integrations
    const product = window.productData[productId];
    this.emitCartEvent('bf25:analytics:addToCart', {
      product: product,
      variant: this.state.get('variantId'),
      quantity: this.state.get('quantity'),
      pricing: pricing
    });
  }

  /**
   * Track cart error (for monitoring)
   *
   * @param {Object} error - Error data
   */
  trackCartError(error) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `Cart error: ${error.message}`,
        fatal: false
      });
    }

    this.emitCartEvent('bf25:cart:error', error);
  }

  /**
   * Emit custom cart event
   *
   * @param {string} eventName - Event name
   * @param {Object} detail - Event data
   */
  emitCartEvent(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail: detail,
      bubbles: true
    });

    document.dispatchEvent(event);

    if (this.config.debug) {
      console.log(`📡 Event emitted: ${eventName}`, detail);
    }
  }

  /**
   * Fetch current cart state from Shopify
   * Called on modal open to get cart-aware data
   *
   * @returns {Promise<Object>} Cart data
   */
  async fetchCart() {
    try {
      const response = await fetch('/cart.js', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const cart = await response.json();

      if (this.config.debug) {
        console.group('🛒 Cart Fetched');
        console.log('Item count:', cart.item_count);
        console.log('Items:', cart.items);
        console.groupEnd();
      }

      // Update state
      this.state.update('cartItemCount', cart.item_count);
      this.state.update('cartItems', cart.items);
      this.state.update('cartFetched', true);
      this.state.update('cartLastUpdated', Date.now());

      return cart;

    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);

      // Set safe defaults
      this.state.update('cartItemCount', 0);
      this.state.update('cartItems', []);
      this.state.update('cartFetched', false);

      return null;
    }
  }

  /**
   * Get total quantity of BF25 items in cart (optional filtering)
   * Can filter to only count BF25 Builder items
   *
   * @param {boolean} bf25Only - Only count BF25 Builder items
   * @returns {number} Total quantity
   */
  getCartQuantity(bf25Only = false) {
    // PRIMARY: Read from BundleManager (virtual cart) - BF25-FIX-CART-AWARE-USE-BUNDLEMANAGER
    if (window.BF25BundleManager) {
      const itemCount = window.BF25BundleManager.bundle?.computed?.itemCount || 0;

      if (this.config?.debug) {
        console.log('🛒 getCartQuantity from BundleManager:', itemCount);
      }

      return itemCount;
    }

    // FALLBACK: Read from Shopify cart state (legacy)
    const cartItems = this.state.get('cartItems');

    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    if (bf25Only) {
      // Only count items from BF25 Builder
      return cartItems
        .filter(item => item.properties?._source === 'BF25 Bundle Builder')
        .reduce((total, item) => total + item.quantity, 0);
    } else {
      // Count all items
      return this.state.get('cartItemCount') || 0;
    }
  }

  /**
   * Update cart state after successful add
   *
   * @param {Object} cartResponse - Response from add to cart
   */
  updateCartState(cartResponse) {
    if (cartResponse && cartResponse.item_count) {
      this.state.update('cartItemCount', cartResponse.item_count);
      this.state.update('cartItems', cartResponse.items);
      this.state.update('cartLastUpdated', Date.now());

      // Trigger tier recalculation with new cart state
      this.manager.tierCalculator.updatePricingDisplay();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN CONTROLLER: ExpansionManager
// ═══════════════════════════════════════════════════════════════════════

/**
 * ExpansionManager - Main controller for the expansion modal system
 *
 * Responsibilities:
 * - Manage modal lifecycle (open/close)
 * - Handle user interactions (clicks, keyboard)
 * - Coordinate with sub-managers (added in future prompts)
 * - Orchestrate animations (Prompt 5)
 */
class ExpansionManager {
  constructor() {
    // Initialize state
    this.state = new ModalState();

    // DOM references
    this.container = document.getElementById('bf25-modal-container');
    this.overlay = document.getElementById('bf25-modal-overlay');
    this.content = this.container?.querySelector('.bf25-modal-content');
    this.closeBtn = this.container?.querySelector('.bf25-modal-close');

    // Configuration
    this.config = window.bf25Config || {};

    // CRITICAL DEBUG: Mode tracking
    console.log('═══════════════════════════════════════');
    console.log('🚀 BF25Expansion initialized');
    console.log('📍 Mode from config:', this.config.mode);
    console.log('🔧 Full config:', this.config);
    console.log('═══════════════════════════════════════');

    // Validate DOM elements exist
    if (!this.container || !this.overlay || !this.content) {
      console.error('❌ BF25: Required DOM elements not found. Modal system disabled.');
      return;
    }

    // Sub-managers
    this.variantManager = new VariantManager(this);  // Prompt 7 - IMPLEMENTED
    this.tierCalculator = new TierCalculator(this);  // Prompt 8 - IMPLEMENTED
    this.cartManager = new CartManager(this);        // Prompt 10 - IMPLEMENTED

    // Initialize
    this.init();

    // Debug
    if (this.config.debug) {
      console.group('🚀 ExpansionManager Initialized');
      console.log('Mode:', this.config.mode);
      console.log('Tiers:', this.config.tiers);
      console.log('DOM elements:', {
        container: !!this.container,
        overlay: !!this.overlay,
        content: !!this.content,
        closeBtn: !!this.closeBtn
      });
      console.groupEnd();
    }
  }

  /**
   * Initialize event listeners and subscriptions
   */
  init() {
    this.bindEvents();
    this.subscribeToState();
    this.initializeBrowserFixes(); // Prompt 12

    if (this.config.debug) {
      console.log('✅ Event listeners bound');
    }
  }

  /**
   * Bind all event listeners using delegation where possible
   */
  bindEvents() {
    // ─────────────────────────────────────────────────────────────────
    // Product Card Clicks (Event Delegation for Performance) - BF25-QUICK-ADD-001
    // ─────────────────────────────────────────────────────────────────
    // Using delegation on document to handle all 27+ cards efficiently
    // ENHANCED: Use capture phase and stop propagation to prevent duplicate handlers
    // ROUTE PRIORITY:
    // 1. Info icon → Open modal with full product details
    // 2. Plus button → Quick-add flow (direct add OR show variant overlay)
    // 3. Variant overlay elements → Handle variant selection (don't open modal)
    // 4. Card body → Open modal (default behavior)
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.bf25-product-card');

      // Ignore if not a card or already animating
      if (!card || this.state.get('isAnimating')) {
        return;
      }

      // ═══════════════════════════════════════════════════════════════
      // PRIORITY 1: Info Icon Click → Always Open Modal
      // ═══════════════════════════════════════════════════════════════
      const infoIcon = e.target.closest('.bf25-product-info-icon');
      if (infoIcon) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (this.config.debug) {
          console.log('ℹ️ Info icon clicked → Opening modal');
        }

        this.handleCardClick(card);
        return;
      }

      // ═══════════════════════════════════════════════════════════════
      // PRIORITY 2: Plus Button Click → Quick-Add Flow
      // ═══════════════════════════════════════════════════════════════
      const plusButton = e.target.closest('.bf25-quick-add-trigger');
      if (plusButton) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (this.config.debug) {
          console.log('➕ Plus button clicked → Quick-add flow');
        }

        this.handleQuickAdd(card);
        return;
      }

      // ═══════════════════════════════════════════════════════════════
      // PRIORITY 3: Variant Overlay Clicks → Let Overlay Handle
      // ═══════════════════════════════════════════════════════════════
      const variantOverlay = card.querySelector('.bf25-card-variant-state:not([hidden])');
      if (variantOverlay) {
        // Variant overlay is showing - let its own handlers deal with clicks
        // Don't open modal, don't interfere
        if (this.config.debug) {
          console.log('🎨 Click inside active variant overlay → Ignoring');
        }
        return; // Don't prevent default - let variant buttons work
      }

      // ═══════════════════════════════════════════════════════════════
      // PRIORITY 4: Card Body Click → Open Modal (Default Behavior)
      // ═══════════════════════════════════════════════════════════════
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (this.config.debug) {
        console.log('🎯 Card body clicked → Opening modal:', {
          target: e.target.className,
          card: card.className,
          productId: card.dataset.productId
        });
      }

      this.handleCardClick(card);
    }, true); // true = capture phase (fires before other handlers)

    // ─────────────────────────────────────────────────────────────────
    // Keyboard Navigation (Enter/Space on cards)
    // ─────────────────────────────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
      const card = e.target.closest('.bf25-product-card');

      if (card && (e.key === 'Enter' || e.key === ' ')) {
        if (this.state.get('isAnimating')) return;

        e.preventDefault();
        this.handleCardClick(card);
      }
    });

    // ─────────────────────────────────────────────────────────────────
    // Close Handlers
    // ─────────────────────────────────────────────────────────────────

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Overlay click
    this.overlay?.addEventListener('click', () => this.close());

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.get('isOpen')) {
        this.close();
      }
    });
  }

  /**
   * Subscribe to state changes for reactive updates
   */
  subscribeToState() {
    this.state.subscribe((key, newValue, oldValue) => {
      // React to quantity changes → recalculate pricing and update input
      if (key === 'quantity' && this.state.get('isOpen')) {
        // Update input element visually
        const input = document.querySelector('.bf25-quantity-input');
        if (input && input.value !== String(newValue)) {
          input.value = newValue;
        }

        // Update pricing display
        this.tierCalculator.updatePricingDisplay();

        if (this.config.debug) {
          console.log('🔢 Quantity updated:', newValue);
        }
      }

      // React to variant changes → recalculate pricing
      if (key === 'selectedVariantId' && this.state.get('isOpen')) {
        this.tierCalculator.updatePricingDisplay();
      }

      if (this.config.debug) {
        console.log(`🔔 State change: ${key} = ${newValue}`);
      }
    });
  }

  /**
   * Handle product card click
   * Enhanced with robust product ID reading and validation
   */
  handleCardClick(card) {
    // ROBUST PRODUCT ID READING
    // Try multiple methods to ensure we get the ID
    let productId = card.dataset.productId ||
                    card.getAttribute('data-product-id');

    // If card is a child element, traverse up to find the card with ID
    if (!productId) {
      const cardWithId = card.closest('[data-product-id]');
      if (cardWithId) {
        productId = cardWithId.dataset.productId ||
                   cardWithId.getAttribute('data-product-id');
        card = cardWithId; // Update card reference to actual card element
      }
    }

    // Clean Shopify GID format if present (e.g., "gid://shopify/Product/12345")
    if (productId && productId.includes('gid://')) {
      productId = productId.split('/').pop();
    }

    if (!productId) {
      console.error('❌ Card missing data-product-id:', card);
      console.log('   Clicked element:', card);
      console.log('   Card classes:', card.className);
      this.showErrorModal('Invalid Product', 'This product card is missing required data.');
      return;
    }

    // Verify product data exists
    if (!window.productData?.[productId]) {
      console.error('❌ Product data not found for ID:', productId);
      console.log('   Available product IDs:', Object.keys(window.productData || {}));
      this.showErrorModal('Product Not Found', 'This product is no longer available.');
      return;
    }

    if (this.config.debug) {
      console.log('🖱️ Card clicked:', {
        productId,
        clickedElement: card.className,
        hasProductData: !!window.productData[productId]
      });
    }

    this.open(card, productId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // FLIP ANIMATION HELPERS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Calculate the transform difference between two DOMRect objects
   * This is the "Invert" step of FLIP
   *
   * @param {DOMRect} first - Starting position/size
   * @param {DOMRect} last - Ending position/size
   * @returns {Object} Transform deltas
   */
  calculateInvert(first, last) {
    return {
      deltaX: first.left - last.left,
      deltaY: first.top - last.top,
      scaleX: first.width / last.width,
      scaleY: first.height / last.height
    };
  }

  /**
   * Get border-radius values from computed styles
   * Needed because border-radius animates during morph
   *
   * @param {HTMLElement} element - Element to measure
   * @returns {string} Border-radius value
   */
  getBorderRadius(element) {
    return getComputedStyle(element).borderRadius;
  }

  /**
   * Get modal dimensions based on viewport size
   * Handles desktop vs mobile sizing
   *
   * @returns {Object} Width and height for final modal state
   */
  getModalDimensions() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else {
      // Desktop: constrained size
      const maxWidth = 800;
      const width = Math.min(window.innerWidth * 0.9, maxWidth);
      const height = window.innerHeight * 0.9;

      return { width, height };
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MODAL LIFECYCLE METHODS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Open the modal for a specific product
   *
   * @param {HTMLElement} card - The clicked product card
   * @param {string} productId - The product ID
   */
  open(card, productId) {
    try {
      // Prevent multiple simultaneous opens
      if (this.state.get('isAnimating') || this.state.get('isOpen')) {
        if (this.config.debug) {
          console.warn('⚠️ Modal already open or animating');
        }
        return;
      }

      // ─────────────────────────────────────────────────────────────────
      // CRITICAL: Force close theme search/modals
      // ─────────────────────────────────────────────────────────────────
      const themeModals = document.querySelectorAll('details-modal[open], details[open]');
      themeModals.forEach(modal => {
        modal.removeAttribute('open');
      });

      // Close search specifically
      const searchDetails = document.querySelector('.header__search details');
      if (searchDetails) {
        searchDetails.open = false;
      }

      // Force close Power Pairs bottom sheet
      const ppSheet = document.querySelector('#pp-bottom-sheet, .pp-bottom-sheet, [data-sheet="power-pairs"]');
      if (ppSheet) {
        ppSheet.style.display = 'none';
        ppSheet.style.visibility = 'hidden';
        ppSheet.style.opacity = '0';
        ppSheet.classList.remove('is-active', 'is-visible', 'is-open');
        if (this.config.debug) {
          console.log('🚫 Closed Power Pairs sheet');
        }
      }

      if (this.config.debug) {
        console.log('🚫 Closed theme modals:', themeModals.length);
      }

      // ─────────────────────────────────────────────────────────────────
      // DATA VALIDATION (Prompt 12)
      // ─────────────────────────────────────────────────────────────────
      const validatedProduct = this.validateProductData(productId);
      if (!validatedProduct) {
        // Error modal already shown by validateProductData
        return;
      }

      // Store trigger element for focus restoration
      this.triggerElement = document.activeElement;

      // ─────────────────────────────────────────────────────────────────
      // STATE INITIALIZATION - CRITICAL: Must set before populateContent
      // ─────────────────────────────────────────────────────────────────
      this.state.update('isAnimating', true);
      this.state.update('currentCard', card);
      this.state.update('productId', productId);  // MUST SET THIS

      // Set default quantity based on mode
      // Power packs: Default to middle tier (8 items)
      // Individual: Default to 1
      const defaultQuantity = this.config.mode === 'power_packs' ? 8 : 1;
      this.state.update('quantity', defaultQuantity);

      // If product has variants, select first available variant
      if (window.productVariants && window.productVariants[productId]) {
        const variants = window.productVariants[productId];
        const firstAvailable = variants.find(v => v.available !== false) || variants[0];

        if (firstAvailable) {
          this.state.update('selectedVariantId', firstAvailable.id);

          if (this.config.debug) {
            console.log('🔧 Selected first variant:', firstAvailable.id);
          }
        }
      }

      if (this.config.debug) {
        console.log('🔧 State initialized:', {
          productId,
          quantity: defaultQuantity,
          mode: this.config.mode,
          hasVariants: !!(window.productVariants && window.productVariants[productId]),
          selectedVariantId: this.state.get('selectedVariantId')
        });
      }

      // Fetch current cart state (async, non-blocking) - Prompt 11
      this.cartManager.fetchCart().then(() => {
        // Cart fetched, pricing will auto-update via state subscription
        if (this.config.debug) {
          console.log('✅ Cart fetched on modal open');
        }
      }).catch(error => {
        console.error('⚠️ Cart fetch failed, continuing without cart data');
      });

      if (this.config.debug) {
        console.group('🚀 Opening Modal');
        console.log('Product ID:', productId);
        console.log('Product Data:', window.productData[productId]);
        console.log('Card Element:', card);
        console.groupEnd();
      }

      // ─────────────────────────────────────────────────────────────────
      // CONTENT POPULATION (Prompt 6 - IMPLEMENTED)
      // ─────────────────────────────────────────────────────────────────
      this.populateContent(productId);

      // ─────────────────────────────────────────────────────────────────
      // FLIP ANIMATION (Prompt 5 - IMPLEMENTED)
      // ─────────────────────────────────────────────────────────────────
      this.animateOpen();

      // Update state
      this.state.update('isOpen', true);

      // ─────────────────────────────────────────────────────────────────
      // ACCESSIBILITY SETUP (Prompt 12)
      // ─────────────────────────────────────────────────────────────────
      // Initialize focus trap after animation completes
      setTimeout(() => {
        this.initializeFocusTrap();
        this.announceToScreenReader(`Product details opened for ${validatedProduct.title}`, 'polite');
      }, 350); // Wait for animation to complete

      // Note: isAnimating will be set to false by animation completion

    } catch (error) {
      console.error('❌ Fatal error in open():', error);
      this.showErrorModal(
        'Unexpected Error',
        'An unexpected error occurred while opening the product details. Please try again.'
      );
      // Reset state on error
      this.state.update('isAnimating', false);
      this.state.update('isOpen', false);
    }
  }

  /**
   * Close the modal
   */
  close() {
    try {
      // Prevent closing if not open
      if (!this.state.get('isOpen')) {
        return;
      }

      // Prevent multiple simultaneous closes
      if (this.state.get('isAnimating')) {
        if (this.config.debug) {
          console.warn('⚠️ Modal animating, ignoring close request');
        }
        return;
      }

      // ─────────────────────────────────────────────────────────────────
      // CRITICAL: Lock scroll position before any DOM changes
      // ─────────────────────────────────────────────────────────────────
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Prevent browser scroll restoration during animation
      if ('scrollRestoration' in history) {
        this.previousScrollRestoration = history.scrollRestoration;
        history.scrollRestoration = 'manual';
      }

      if (this.config.debug) {
        console.log('🔒 Locking scroll at:', { x: scrollX, y: scrollY });
      }

      this.state.update('isAnimating', true);

      if (this.config.debug) {
        console.log('🚪 Closing Modal');
      }

      // Clear upsell selections when modal closes
      this.clearUpsellSelections();

      // ─────────────────────────────────────────────────────────────────
      // MEMORY CLEANUP (Prompt 12)
      // ─────────────────────────────────────────────────────────────────

      // Clear countdown timer interval
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }

      // Remove focus trap event listener
      if (this.focusTrapHandler) {
        document.removeEventListener('keydown', this.focusTrapHandler);
        this.focusTrapHandler = null;
      }

      // Clear any pending notification timeouts
      if (this.notificationTimeouts) {
        this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.notificationTimeouts = [];
      }

      // ─────────────────────────────────────────────────────────────────
      // ACCESSIBILITY CLEANUP (Prompt 12)
      // ─────────────────────────────────────────────────────────────────
      this.announceToScreenReader('Product details closed', 'polite');

      // ─────────────────────────────────────────────────────────────────
      // REVERSE FLIP ANIMATION (Prompt 5 - IMPLEMENTED)
      // ─────────────────────────────────────────────────────────────────
      this.animateClose();

      // ─────────────────────────────────────────────────────────────────
      // FOCUS RESTORATION (Prompt 12)
      // ─────────────────────────────────────────────────────────────────
      // Restore focus after animation completes
      setTimeout(() => {
        this.restoreFocus();

        // Re-enable theme modals after BF25 closes
        const themeModals = document.querySelectorAll('details-modal');
        themeModals.forEach(modal => {
          modal.style.pointerEvents = '';
        });

        if (this.config.debug) {
          console.log('✅ Re-enabled theme modals');
        }
      }, 350); // Wait for animation to complete

      // Reset state (will happen after animation completes)
      // The animateClose method handles state.reset() on completion

    } catch (error) {
      console.error('❌ Error in close():', error);
      // Ensure cleanup happens even if error occurs
      if (this.countdownInterval) clearInterval(this.countdownInterval);
      if (this.focusTrapHandler) document.removeEventListener('keydown', this.focusTrapHandler);
      this.state.update('isAnimating', false);
      this.state.update('isOpen', false);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUICK-ADD FUNCTIONALITY (BF25-QUICK-ADD-001)
  // Added: Part 5 - Nine methods for direct add-to-bundle from product cards
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * 1. Handle quick-add click on plus button
   * Routes to direct add OR variant overlay based on product type
   *
   * @param {HTMLElement} card - Product card element
   */
  handleQuickAdd(card) {
    const productId = card.dataset.productId;
    const hasVariants = card.dataset.hasVariants === 'true';
    const defaultVariantId = card.dataset.defaultVariantId;

    if (this.config.debug) {
      console.log('🚀 Quick-Add Flow Started:', {
        productId,
        hasVariants,
        defaultVariantId
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Path 1: Single-Variant Product → Direct Add (1 quantity)
    // ─────────────────────────────────────────────────────────────────
    if (!hasVariants || hasVariants === 'false') {
      if (this.config.debug) {
        console.log('✅ Single variant → Direct add');
      }
      this.quickAddToBundle(card, productId, defaultVariantId);
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // Path 2: Multi-Variant Product → Show Variant Overlay
    // ─────────────────────────────────────────────────────────────────
    if (this.config.debug) {
      console.log('🎨 Multi-variant → Show selector overlay');
    }
    this.showVariantOverlay(card);
  }

  /**
   * 2. Show variant selector overlay on card
   * Generates UI dynamically from window.productData
   *
   * @param {HTMLElement} card - Product card element
   */
  showVariantOverlay(card) {
    const productId = card.dataset.productId;
    const variantState = card.querySelector('.bf25-card-variant-state');

    if (!variantState) {
      console.error('❌ No variant state element found in card');
      return;
    }

    // Get product data from window.productData
    const productData = window.productData?.[productId];
    if (!productData) {
      console.error('❌ No product data found for ID:', productId);
      return;
    }

    if (this.config.debug) {
      console.log('🎨 Showing variant overlay for:', productData.title);
    }

    // Get options from window.productOptions (generated in Liquid)
    const options = window.productOptions?.[productId];
    const variants = window.productVariants?.[productId];

    if (!options || !variants) {
      console.error('❌ No variant data found:', { productId, options, variants });
      optionsContainer.innerHTML = '<p class="bf25-variant-error">Variant data not available</p>';
      return;
    }

    if (this.config.debug) {
      console.log('📦 Variant data:', { options, variants });
    }

    // Generate variant selector UI
    const optionsHTML = this.generateVariantSelectorUI(
      productId,
      options,
      variants
    );

    // Inject UI into container
    const optionsContainer = variantState.querySelector('.bf25-variant-options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = optionsHTML;
    }

    // Show overlay (remove hidden attribute for CSS transition)
    variantState.removeAttribute('hidden');

    // Bind event handlers for overlay
    this.bindVariantOverlayEvents(card, productId);

    // Announce to screen readers
    this.announceToScreenReader(`Variant selection opened for ${productData.title}`, 'polite');
  }

  /**
   * 3. Hide variant overlay and clear selections
   *
   * @param {HTMLElement} card - Product card element
   */
  hideVariantOverlay(card) {
    const variantState = card.querySelector('.bf25-card-variant-state');

    if (!variantState) {
      return;
    }

    if (this.config.debug) {
      console.log('🎨 Hiding variant overlay');
    }

    // Hide overlay (set hidden attribute for CSS transition)
    variantState.setAttribute('hidden', '');

    // Clear selections
    const pills = variantState.querySelectorAll('.bf25-variant-pill');
    pills.forEach(pill => pill.classList.remove('is-selected'));

    // Reset add button
    const addBtn = variantState.querySelector('.bf25-variant-add-btn');
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.classList.remove('is-loading', 'is-success');
    }

    // Clear options container
    const optionsContainer = variantState.querySelector('.bf25-variant-options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
    }
  }

  /**
   * 4. Generate variant selector UI HTML
   * Creates option groups with pills for each value
   *
   * @param {string} productId - Product ID
   * @param {Array} options - Product options (e.g., [{name: "Color", values: ["Red", "Blue"]}])
   * @param {Array} variants - Product variants array
   * @returns {string} HTML string for variant selector
   */
  generateVariantSelectorUI(productId, options, variants) {
    if (!options || options.length === 0) {
      return '<p class="bf25-variant-error">No options available</p>';
    }

    let html = '';

    options.forEach((option, optionIndex) => {
      // Skip if no values
      if (!option.values || option.values.length === 0) {
        return;
      }

      html += `
        <div class="bf25-variant-option-group" data-option-position="${optionIndex + 1}">
          <label class="bf25-variant-option-label">${option.name}</label>
          <div class="bf25-variant-pills">
      `;

      option.values.forEach((value) => {
        html += `
          <button
            type="button"
            class="bf25-variant-pill"
            data-option-name="${option.name}"
            data-option-value="${value}"
            data-option-position="${optionIndex + 1}"
            aria-label="Select ${value}"
          >
            ${value}
          </button>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * 5. Bind event handlers for variant overlay elements
   * Handles pill clicks, close button, add button
   *
   * @param {HTMLElement} card - Product card element
   * @param {string} productId - Product ID
   */
  bindVariantOverlayEvents(card, productId) {
    const variantState = card.querySelector('.bf25-card-variant-state');

    if (!variantState) {
      return;
    }

    // Initialize selections storage on card element
    if (!card._variantSelections) {
      card._variantSelections = {};
    }

    // ─────────────────────────────────────────────────────────────────
    // Close Button
    // ─────────────────────────────────────────────────────────────────
    const closeBtn = variantState.querySelector('.bf25-variant-close');
    if (closeBtn) {
      // Remove any existing listeners
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

      newCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideVariantOverlay(card);
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Variant Pills (Option Selection)
    // ─────────────────────────────────────────────────────────────────
    const pills = variantState.querySelectorAll('.bf25-variant-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const optionPosition = pill.dataset.optionPosition;
        const optionValue = pill.dataset.optionValue;

        // Deselect other pills in same option group
        const group = pill.closest('.bf25-variant-option-group');
        const groupPills = group.querySelectorAll('.bf25-variant-pill');
        groupPills.forEach(p => p.classList.remove('is-selected'));

        // Select this pill
        pill.classList.add('is-selected');

        // Store the selection using position as key
        const optionKey = `option${optionPosition}`;
        card._variantSelections[optionKey] = optionValue;

        if (this.config.debug) {
          console.log('🎨 Variant option selected:', {
            position: optionPosition,
            value: optionValue,
            allSelections: card._variantSelections
          });
        }

        // Validate if all options selected
        this.validateVariantSelection(card, productId);
      });
    });

    // ─────────────────────────────────────────────────────────────────
    // Add to Bundle Button
    // ─────────────────────────────────────────────────────────────────
    const addBtn = variantState.querySelector('.bf25-variant-add-btn');
    if (addBtn) {
      // Remove any existing listeners
      const newAddBtn = addBtn.cloneNode(true);
      addBtn.parentNode.replaceChild(newAddBtn, addBtn);

      newAddBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (newAddBtn.disabled || newAddBtn.classList.contains('is-loading')) {
          return;
        }

        this.addSelectedVariantToBundle(card, productId);
      });
    }
  }

  /**
   * 6. Validate if all variant options are selected
   * Enables/disables add button based on selection state
   *
   * @param {HTMLElement} card - Product card element
   * @param {string} productId - Product ID
   * @returns {boolean} True if all options selected
   */
  validateVariantSelection(card, productId) {
    const variantState = card.querySelector('.bf25-card-variant-state');
    const addBtn = variantState?.querySelector('.bf25-variant-add-btn');

    if (!variantState || !addBtn) {
      return false;
    }

    // Get all option groups
    const optionGroups = variantState.querySelectorAll('.bf25-variant-option-group');

    // Check if each group has a selection
    let allSelected = true;
    optionGroups.forEach(group => {
      const selectedPill = group.querySelector('.bf25-variant-pill.is-selected');
      if (!selectedPill) {
        allSelected = false;
      }
    });

    // Enable/disable add button
    addBtn.disabled = !allSelected;

    if (this.config.debug && allSelected) {
      console.log('✅ All variant options selected');
    }

    return allSelected;
  }

  /**
   * 7. Find matching variant ID based on selected options
   * Matches by option1, option2, option3 values
   *
   * @param {string} productId - Product ID
   * @param {Object} selections - Selected options {option1: "Red", option2: "Large"}
   * @returns {string|null} Variant ID or null if no match
   */
  findMatchingVariant(productId, selections) {
    const variants = window.productVariants?.[productId];

    if (!variants) {
      console.error('❌ No variants found for:', productId);
      return null;
    }

    if (this.config.debug) {
      console.log('🔍 Finding variant for:', { productId, selections, variantsCount: variants.length });
    }

    // Find variant matching all selected options
    // variants have options: [value1, value2, value3] array
    // selections have {option1: value1, option2: value2, option3: value3}
    const matchingVariant = variants.find(variant => {
      // Check each option position
      if (selections.option1 && variant.options[0] !== selections.option1) {
        return false;
      }
      if (selections.option2 && variant.options[1] !== selections.option2) {
        return false;
      }
      if (selections.option3 && variant.options[2] !== selections.option3) {
        return false;
      }
      return true;
    });

    if (matchingVariant) {
      if (this.config.debug) {
        console.log('✅ Found matching variant:', {
          variantId: matchingVariant.id,
          title: matchingVariant.title,
          options: matchingVariant.options,
          selections
        });
      }
      return matchingVariant.id;
    }

    console.warn('⚠️ No matching variant found for selections:', selections);
    return null;
  }

  /**
   * 8. Add selected variant to bundle (with loading states)
   * Gets selections, finds variant, adds to bundle, shows success
   *
   * @param {HTMLElement} card - Product card element
   * @param {string} productId - Product ID
   */
  async addSelectedVariantToBundle(card, productId) {
    const variantState = card.querySelector('.bf25-card-variant-state');
    const addBtn = variantState?.querySelector('.bf25-variant-add-btn');

    if (!variantState || !addBtn) {
      return;
    }

    // Get selected options
    const selections = {};
    const selectedPills = variantState.querySelectorAll('.bf25-variant-pill.is-selected');

    selectedPills.forEach(pill => {
      const position = pill.dataset.optionPosition;
      const value = pill.dataset.optionValue;
      selections[`option${position}`] = value;
    });

    if (this.config.debug) {
      console.log('🎯 Adding variant with selections:', selections);
    }

    // Find matching variant
    const variantId = this.findMatchingVariant(productId, selections);

    if (!variantId) {
      console.error('❌ Could not find matching variant');
      return;
    }

    // Show loading state
    addBtn.classList.add('is-loading');
    addBtn.disabled = true;
    addBtn.textContent = 'Adding...';

    try {
      // Use existing addToBundleManager method
      await this.quickAddToBundle(card, productId, variantId);

      // Success state
      addBtn.classList.remove('is-loading');
      addBtn.classList.add('is-success');
      addBtn.textContent = 'Added! ✓';

      // Hide overlay after 800ms
      setTimeout(() => {
        this.hideVariantOverlay(card);

        // Reset button state after hiding
        setTimeout(() => {
          addBtn.classList.remove('is-success');
          addBtn.textContent = 'Add to Bundle';
        }, 300);
      }, 800);

    } catch (error) {
      console.error('❌ Error adding variant to bundle:', error);

      // Error state
      addBtn.classList.remove('is-loading');
      addBtn.textContent = 'Error - Try Again';
      addBtn.disabled = false;

      // Reset after 2s
      setTimeout(() => {
        addBtn.textContent = 'Add to Bundle';
      }, 2000);
    }
  }

  /**
   * 9. Quick add to bundle (uses existing addToBundleManager method)
   * Adds 1 quantity, shows success animation on card
   *
   * @param {HTMLElement} card - Product card element
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   */
  async quickAddToBundle(card, productId, variantId) {
    if (this.config.debug) {
      console.log('➕ Quick-adding to bundle:', { productId, variantId });
    }

    try {
      // Get product data from window.productData
      const product = window.productData[productId];

      if (!product) {
        console.error('❌ Product data not found for ID:', productId);
        alert('Could not find product data. Please refresh and try again.');
        return false;
      }

      // Use existing method from modal flow with ALL required parameters
      // Parameters: productId, variantId, quantity, product, pricing
      const result = await this.cartManager.addToBundleManager(
        productId,
        variantId,
        1,        // Quantity: always 1 for quick-add
        product,  // Product object from window.productData
        null      // Pricing: let addToBundleManager calculate
      );

      if (result.success) {
        // Success feedback on plus button
        const plusButton = card.querySelector('.bf25-quick-add-trigger');
        if (plusButton) {
          plusButton.textContent = '✓';
          plusButton.style.backgroundColor = '#60c655';
          plusButton.style.color = '#000';

          setTimeout(() => {
            plusButton.textContent = '+';
            plusButton.style.backgroundColor = '';
            plusButton.style.color = '';
          }, 1200);
        }

        // Success animation on card
        card.classList.add('bf25-quick-add-success');
        setTimeout(() => {
          card.classList.remove('bf25-quick-add-success');
        }, 600);

        if (this.config.debug) {
          console.log('✅ Quick-add successful');
        }

        return true;
      } else {
        console.error('❌ Quick-add failed:', result.error);

        if (result.error === 'MAX_ITEMS_REACHED') {
          alert('Bundle is full (16 items max). Remove items to add more.');
        } else {
          alert('Could not add item. Please try again.');
        }

        return false;
      }

    } catch (error) {
      console.error('❌ Quick-add failed:', error);
      alert('Error adding item. Please try again.');
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // END QUICK-ADD FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Animate modal open using FLIP technique
   *
   * FLIP Breakdown:
   * - First: Measure card position/size
   * - Last: Position modal at final state (centered/fullscreen)
   * - Invert: Apply transform to make modal appear at card position
   * - Play: Animate transform to identity (final position)
   *
   * Performance: Uses Web Animations API for GPU acceleration
   * Only animates transform and opacity (no layout properties)
   */
  animateOpen() {
    const card = this.state.get('currentCard');

    if (!card) {
      console.error('❌ No card reference for animation');
      return;
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 1: FIRST - Measure card's current position/size
    // ─────────────────────────────────────────────────────────────────
    const firstRect = card.getBoundingClientRect();
    const firstRadius = this.getBorderRadius(card);

    if (this.config.debug) {
      console.log('🎬 FLIP Animation Start');
      console.log('First (Card):', {
        x: firstRect.left,
        y: firstRect.top,
        width: firstRect.width,
        height: firstRect.height,
        radius: firstRadius
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: LAST - Show modal at final position/size
    // ─────────────────────────────────────────────────────────────────

    // Remove hidden attribute and add classes
    this.container.hidden = false;
    this.overlay.hidden = false;
    this.container.classList.add('is-active');
    this.overlay.classList.add('is-visible');

    // Lock body scroll
    this.lockBodyScroll(true);

    // Force layout calculation
    void this.container.offsetHeight;

    // Measure final position/size
    const lastRect = this.container.getBoundingClientRect();
    const lastRadius = this.getBorderRadius(this.container);

    if (this.config.debug) {
      console.log('Last (Modal):', {
        x: lastRect.left,
        y: lastRect.top,
        width: lastRect.width,
        height: lastRect.height,
        radius: lastRadius
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: INVERT - Calculate transform to appear at First position
    // ─────────────────────────────────────────────────────────────────
    const invert = this.calculateInvert(firstRect, lastRect);

    if (this.config.debug) {
      console.log('Invert:', {
        deltaX: invert.deltaX,
        deltaY: invert.deltaY,
        scaleX: invert.scaleX,
        scaleY: invert.scaleY
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 4: PLAY - Animate from Inverted to Identity
    // ─────────────────────────────────────────────────────────────────

    // Container animation (morph shape and position)
    const containerAnimation = this.container.animate([
      {
        // Start: At card position (inverted)
        transformOrigin: 'top left',
        transform: `translate(${invert.deltaX}px, ${invert.deltaY}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        borderRadius: firstRadius,
        opacity: 0.8
      },
      {
        // End: At final modal position (centered via CSS)
        transformOrigin: 'center center',
        transform: 'translate(-50%, -50%)',
        borderRadius: lastRadius,
        opacity: 1
      }
    ], {
      duration: this.config.animation.duration,
      easing: this.config.animation.easing,
      fill: 'forwards'
    });

    // Overlay animation (fade in)
    this.overlay.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: this.config.animation.duration,
      easing: this.config.animation.easing,
      fill: 'forwards'
    });

    // Handle animation completion
    containerAnimation.onfinish = () => {
      if (this.config.debug) {
        console.log('✅ Open animation complete');
      }

      // Hide original card to prevent visual artifacts
      card.style.visibility = 'hidden';

      // Trigger content reveal animations (CSS-based, from Prompt 4)
      this.container.classList.add('is-loaded');

      // Animation complete
      this.state.update('isAnimating', false);
    };

    // Handle animation errors
    containerAnimation.oncancel = () => {
      if (this.config.debug) {
        console.warn('⚠️ Open animation cancelled');
      }
      this.state.update('isAnimating', false);
    };
  }

  /**
   * Animate modal close using reverse FLIP
   *
   * Same FLIP principle but reversed:
   * - Measure current modal position (Last)
   * - Measure target card position (First)
   * - Calculate invert
   * - Animate from identity to inverted (reverses the opening)
   */
  animateClose() {
    const card = this.state.get('currentCard');

    if (!card) {
      console.error('❌ No card reference for close animation');
      return;
    }

    // Remove content reveal class
    this.container.classList.remove('is-loaded');

    // ─────────────────────────────────────────────────────────────────
    // STEP 1: Measure LAST (current modal position)
    // ─────────────────────────────────────────────────────────────────
    const lastRect = this.container.getBoundingClientRect();
    const lastRadius = this.getBorderRadius(this.container);

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: Measure FIRST (target card position)
    // ─────────────────────────────────────────────────────────────────

    // Make card visible for measurement (but not visually shown yet)
    card.style.visibility = 'visible';

    const firstRect = card.getBoundingClientRect();
    const firstRadius = this.getBorderRadius(card);

    if (this.config.debug) {
      console.log('🎬 Close Animation Start');
      console.log('Returning to card at:', {
        x: firstRect.left,
        y: firstRect.top,
        width: firstRect.width,
        height: firstRect.height
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: Calculate invert (reverse direction)
    // ─────────────────────────────────────────────────────────────────
    const invert = this.calculateInvert(firstRect, lastRect);

    // ─────────────────────────────────────────────────────────────────
    // STEP 4: Animate from current position to card position
    // ─────────────────────────────────────────────────────────────────

    // Container animation (reverse morph)
    const containerAnimation = this.container.animate([
      {
        // Start: At modal position (centered)
        transformOrigin: 'center center',
        transform: 'translate(-50%, -50%)',
        borderRadius: lastRadius,
        opacity: 1
      },
      {
        // End: At card position (inverted)
        transformOrigin: 'top left',
        transform: `translate(${invert.deltaX}px, ${invert.deltaY}px) scale(${invert.scaleX}, ${invert.scaleY})`,
        borderRadius: firstRadius,
        opacity: 0.8
      }
    ], {
      duration: this.config.animation.duration,
      easing: this.config.animation.easing,
      fill: 'forwards'
    });

    // Overlay animation (fade out)
    this.overlay.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: this.config.animation.duration,
      easing: this.config.animation.easing,
      fill: 'forwards'
    });

    // Handle animation completion
    containerAnimation.onfinish = () => {
      if (this.config.debug) {
        console.log('✅ Close animation complete');
      }

      // Hide modal
      this.container.hidden = true;
      this.overlay.hidden = true;
      this.container.classList.remove('is-active');
      this.overlay.classList.remove('is-visible');

      // Unlock body scroll
      this.lockBodyScroll(false);

      // Return focus to card (accessibility)
      card.focus();

      // Reset state
      this.state.reset();

      // Animation complete
      this.state.update('isAnimating', false);
    };

    // Handle animation errors
    containerAnimation.oncancel = () => {
      if (this.config.debug) {
        console.warn('⚠️ Close animation cancelled');
      }

      // Cleanup anyway
      this.container.hidden = true;
      this.overlay.hidden = true;
      this.container.classList.remove('is-active');
      this.overlay.classList.remove('is-visible');
      this.lockBodyScroll(false);
      this.state.update('isAnimating', false);
    };
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Lock/unlock body scroll (iOS-compatible method)
   *
   * @param {boolean} lock - True to lock, false to unlock
   */
  lockBodyScroll(lock) {
    if (lock) {
      // Store current scroll position
      this.scrollY = window.pageYOffset;
      this.scrollX = window.pageXOffset;

      // Lock scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollY}px`;
      document.body.style.width = '100%';

      if (this.config.debug) {
        console.log('🔒 Body scroll locked at:', { x: this.scrollX, y: this.scrollY });
      }
    } else {
      // Unlock scroll - Optimized for atomic restoration (BF25-SCROLL-FIX)

      const targetX = this.scrollX || 0;
      // Use the reliable fallback: parse the current 'top' value
      const bodyTop = document.body.style.top;
      const scrollFromTop = bodyTop ? parseInt(bodyTop, 10) * -1 : (this.scrollY || 0);

      // --- CRITICAL FIX: Disable smooth scrolling during restoration ---

      // 1. Temporarily disable smooth scrolling globally
      const htmlEl = document.documentElement;
      const originalScrollBehavior = htmlEl.style.scrollBehavior;
      htmlEl.style.scrollBehavior = 'auto'; // 'auto' means instant jump

      // 2. Remove fixed positioning (triggers reflow)
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // 3. IMMEDIATE restore scroll using explicit 'instant' behavior
      // This provides explicit instruction to the browser
      window.scrollTo({
        top: scrollFromTop,
        left: targetX,
        behavior: 'instant'
      });

      // 4. Restore original scroll behavior after execution cycle
      // setTimeout(0) ensures instant scroll completes first
      setTimeout(() => {
        htmlEl.style.scrollBehavior = originalScrollBehavior;
      }, 0);

      // --- END CRITICAL FIX ---

      // Restore scroll restoration behavior
      if ('scrollRestoration' in history && this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        this.previousScrollRestoration = null;
      }

      // Clear stored values
      this.scrollX = undefined;
      this.scrollY = undefined;

      if (this.config.debug) {
        console.log('✅ Scroll restored to:', { x: targetX, y: scrollFromTop }, '(instant, no smooth)');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // QUANTITY CONTROL (Prompt 9 - Dual Mode UI)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Generate quantity control UI based on mode
   * BF25-RESTORE-QUANTITY-STEPPER: Returns BOTH pack buttons AND stepper
   *
   * @returns {string} HTML for quantity controls
   */
  generateQuantityControls() {
    if (this.config.debug) {
      console.log('🎮 generateQuantityControls: Rendering stepper + pack buttons (swapped order)');
    }

    // Generate BOTH controls (stepper first, then pack buttons)
    const packButtonsHTML = this.generatePowerPacksUI();
    const stepperHTML = this.generateIndividualProductsUI();

    // SWAPPED ORDER: Stepper appears ABOVE pack buttons
    return stepperHTML + packButtonsHTML;
  }

  /**
   * Generate Power Packs mode UI (Tier button selectors)
   * Simplifies choice to 3 pre-set tier quantities
   */
  generatePowerPacksUI() {
    if (this.config.debug) {
      console.log('🎯 generatePowerPacksUI called');
      console.log('   Total tiers available:', this.config.tiers?.length);
      console.log('   Tiers:', this.config.tiers);
    }

    // Generate tier quantities from config (tiers 2, 3, 4)
    const tierOptions = [
      { quantity: this.config.tiers[1].min, tier: this.tierCalculator.getTierForQuantity(this.config.tiers[1].min) },
      { quantity: this.config.tiers[2].min, tier: this.tierCalculator.getTierForQuantity(this.config.tiers[2].min), popular: true },
      { quantity: this.config.tiers[3].min, tier: this.tierCalculator.getTierForQuantity(this.config.tiers[3].min) }
    ];

    if (this.config.debug) {
      console.log('   Tier options created:', tierOptions);
    }

    // Get current quantity
    const currentQuantity = this.state.get('quantity') || 8;

    if (this.config.debug) {
      console.log('   Current quantity:', currentQuantity);
    }

    let html = '<div class="bf25-quantity-controls bf25-power-packs-mode">';

    // Section label
    html += `
      <label class="bf25-quantity-label bf25-text-sm bf25-text-secondary">
        Choose Your Pack:
      </label>
    `;

    // Tier buttons
    html += '<div class="bf25-tier-buttons">';

    tierOptions.forEach(option => {
      const isSelected = currentQuantity === option.quantity;
      const tier = option.tier;

      html += `
        <button
          type="button"
          class="bf25-tier-button ${isSelected ? 'is-selected' : ''} ${option.popular ? 'is-popular' : ''}"
          data-quantity="${option.quantity}"
          aria-pressed="${isSelected}"
        >
          ${option.popular ? '<span class="bf25-tier-button-badge">MOST POPULAR</span>' : ''}

          <span class="bf25-tier-button-quantity">${option.quantity}</span>
          <span class="bf25-tier-button-label">Items</span>

          ${tier && tier.multiplier !== 1.0 ? `
            <span class="bf25-tier-button-discount">
              ${tier.displayLabel}
            </span>
          ` : ''}

          ${isSelected ? '<span class="bf25-tier-button-check">✓</span>' : ''}
        </button>
      `;
    });

    html += '</div></div>';

    return html;
  }

  /**
   * Generate Individual Products mode UI (Quantity stepper)
   * Traditional quantity input with +/- controls
   */
  generateIndividualProductsUI() {
    const currentQuantity = this.state.get('quantity') || 1;
    const minQuantity = 1;
    const maxQuantity = 99;

    // Get tier hint for inline display
    const pricing = this.tierCalculator.calculateCartAwarePricing(
      this.state.get('selectedProduct'),
      currentQuantity
    );
    const tierHint = this.tierCalculator.generateUrgencyMessage(pricing);

    return `
      <div class="bf25-quantity-controls bf25-individual-mode">
        <label class="bf25-quantity-label bf25-text-sm bf25-text-secondary">
          Quantity:
        </label>

        <div class="bf25-stepper-row" style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div class="bf25-quantity-stepper">
            <button
              type="button"
              class="bf25-quantity-button bf25-quantity-minus"
              aria-label="Decrease quantity"
              ${currentQuantity <= minQuantity ? 'disabled' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <input
              type="number"
              class="bf25-quantity-input"
              value="${currentQuantity}"
              min="${minQuantity}"
              max="${maxQuantity}"
              aria-label="Quantity"
            />

            <button
              type="button"
              class="bf25-quantity-button bf25-quantity-plus"
              aria-label="Increase quantity"
              ${currentQuantity >= maxQuantity ? 'disabled' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          ${tierHint}
        </div>
      </div>
    `;
  }

  /**
   * Generate action buttons (Add to Deal)
   * Updated: BF25-FIX-013 - Changed to "ADD TO DEAL"
   */
  generateActionButtons() {
    return `
      <div class="bf25-action-buttons">
        <button
          type="button"
          class="bf25-button bf25-add-to-cart"
          data-action="add-to-cart"
        >
          <span class="bf25-button-text">ADD TO DEAL</span>
          <span class="bf25-button-loader" hidden>
            <svg class="bf25-spinner" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="50" stroke-dashoffset="0">
                <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </span>
        </button>

        <!-- Optional: Buy Now button (commented out for now, can enable later) -->
        <!--
        <button
          type="button"
          class="bf25-button bf25-buy-now"
          data-action="buy-now"
        >
          <span class="bf25-button-text">Buy Now</span>
        </button>
        -->
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════
  // ENHANCED UX FEATURES (Prompt 11.5)
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Generate trust signals (reviews, ratings, badges)
   *
   * @param {Object} product - Product data
   * @returns {string} HTML
   */
  generateTrustSignals(product) {
    if (!this.config.enhancedFeatures?.showReviews && !this.config.enhancedFeatures?.showTrustBadges) {
      return '';
    }

    let html = '<div class="bf25-trust-signals">';

    // Star rating and review count
    if (this.config.enhancedFeatures?.showReviews && product.reviewCount) {
      html += `
        <div class="bf25-reviews">
          ${this.generateStarRating(product.rating || 0)}
          <span class="bf25-review-count bf25-text-sm bf25-text-secondary">
            ${product.reviewCount} reviews
          </span>
        </div>
      `;
    }

    // Trust badges
    if (this.config.enhancedFeatures?.showTrustBadges) {
      html += `
        <div class="bf25-trust-badges">
          <div class="bf25-trust-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="currentColor"/>
            </svg>
            <span class="bf25-text-xs">Premium Quality</span>
          </div>
          <div class="bf25-trust-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L9.5 3.5L13 5L10 8L10.5 12L8 10.5L5.5 12L6 8L3 5L6.5 3.5L8 0Z" fill="currentColor"/>
            </svg>
            <span class="bf25-text-xs">Fast Shipping</span>
          </div>
          <div class="bf25-trust-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
              <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="bf25-text-xs">30-Day Guarantee</span>
          </div>
        </div>
      `;
    }

    html += '</div>';

    return html;
  }

  /**
   * Generate star rating visualization
   *
   * @param {number} rating - Rating out of 5
   * @returns {string} HTML
   */
  generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '<div class="bf25-star-rating" aria-label="' + rating + ' out of 5 stars">';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      html += `
        <svg class="bf25-star bf25-star-full" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="currentColor"/>
        </svg>
      `;
    }

    // Half star
    if (hasHalfStar) {
      html += `
        <svg class="bf25-star bf25-star-half" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stop-color="currentColor"/>
              <stop offset="50%" stop-color="transparent"/>
            </linearGradient>
          </defs>
          <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="url(#half-fill)" stroke="currentColor" stroke-width="1"/>
        </svg>
      `;
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      html += `
        <svg class="bf25-star bf25-star-empty" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" stroke="currentColor" stroke-width="1"/>
        </svg>
      `;
    }

    html += '<span class="bf25-rating-value bf25-text-sm bf25-text-primary">' + rating.toFixed(1) + '</span>';
    html += '</div>';

    return html;
  }

  /**
   * Generate scarcity and urgency elements
   *
   * @param {Object} product - Product data
   * @returns {string} HTML
   */
  generateScarcityElements(product) {
    if (!this.config.enhancedFeatures?.showStockLevels && !this.config.enhancedFeatures?.showCountdown) {
      return '';
    }

    let html = '<div class="bf25-scarcity-elements">';

    // Stock level indicator (only if low stock)
    if (this.config.enhancedFeatures?.showStockLevels && product.stockLevel && product.stockLevel < 20) {
      html += `
        <div class="bf25-stock-indicator bf25-stock-low">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M8 4V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="8" cy="12" r="1" fill="currentColor"/>
          </svg>
          <span class="bf25-text-sm">Only <strong>${product.stockLevel}</strong> left at this price</span>
        </div>
      `;
    }

    // Black Friday countdown (if enabled and within date range)
    if (this.config.enhancedFeatures?.showCountdown) {
      const countdown = this.calculateCountdown();
      if (countdown) {
        html += `
          <div class="bf25-countdown" data-end-date="${countdown.endDate}">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
              <path d="M8 4V8L11 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="bf25-text-sm">
              Offer ends in <strong class="bf25-countdown-value">${countdown.display}</strong>
            </span>
          </div>
        `;
      }
    }

    html += '</div>';

    return html;
  }

  /**
   * Calculate Black Friday countdown
   *
   * @returns {Object|null} Countdown data
   */
  calculateCountdown() {
    // Black Friday 2025 end date (you can configure this)
    const endDate = new Date('2025-11-30T23:59:59');
    const now = new Date();

    if (now > endDate) {
      return null; // Expired
    }

    const diff = endDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let display = '';
    if (days > 0) {
      display = `${days}d ${hours}h`;
    } else if (hours > 0) {
      display = `${hours}h ${minutes}m`;
    } else {
      display = `${minutes}m`;
    }

    return {
      endDate: endDate.toISOString(),
      days,
      hours,
      minutes,
      display
    };
  }

  /**
   * Start countdown timer updates
   */
  startCountdownTimer() {
    const countdownEl = document.querySelector('.bf25-countdown');
    if (!countdownEl) return;

    const endDateStr = countdownEl.dataset.endDate;
    if (!endDateStr) return;

    // Update every minute
    this.countdownInterval = setInterval(() => {
      const endDate = new Date(endDateStr);
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        clearInterval(this.countdownInterval);
        countdownEl.innerHTML = '<span class="bf25-text-sm bf25-text-error">Offer expired</span>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      let display = '';
      if (days > 0) {
        display = `${days}d ${hours}h`;
      } else if (hours > 0) {
        display = `${hours}h ${minutes}m`;
      } else {
        display = `${minutes}m`;
      }

      const valueEl = countdownEl.querySelector('.bf25-countdown-value');
      if (valueEl) {
        valueEl.textContent = display;
      }
    }, 60000); // Update every minute
  }

  /**
   * Generate product features list
   *
   * @param {Object} product - Product data
   * @returns {string} HTML
   */
  generateProductFeatures(product) {
    if (!this.config.enhancedFeatures?.showFeatures || !product.features || product.features.length === 0) {
      return '';
    }

    let html = '<div class="bf25-product-features">';
    html += '<h4 class="bf25-features-title bf25-text-sm bf25-text-secondary">Key Features:</h4>';
    html += '<ul class="bf25-features-list">';

    product.features.forEach(feature => {
      html += `
        <li class="bf25-feature-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="bf25-text-sm">${feature}</span>
        </li>
      `;
    });

    html += '</ul></div>';

    return html;
  }

  /**
   * Generate shipping information
   *
   * @param {Object} product - Product data
   * @returns {string} HTML
   */
  generateShippingInfo(product) {
    if (!this.config.enhancedFeatures?.showShipping) {
      return '';
    }

    const shipsWithin = product.shipsWithin || '2-3 business days';

    return `
      <div class="bf25-shipping-info">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 4H11V11H1V4Z" stroke="currentColor" stroke-width="2"/>
          <path d="M11 6H13L15 8V11H11V6Z" stroke="currentColor" stroke-width="2"/>
          <circle cx="4" cy="13" r="1.5" stroke="currentColor" stroke-width="1"/>
          <circle cx="12" cy="13" r="1.5" stroke="currentColor" stroke-width="1"/>
        </svg>
        <span class="bf25-text-sm bf25-text-secondary">
          <strong class="bf25-text-accent">Free shipping</strong> • Ships within ${shipsWithin}
        </span>
      </div>
    `;
  }

  /**
   * Enable keyboard shortcuts
   */
  enableKeyboardShortcuts() {
    if (!this.config.enhancedFeatures?.enableKeyboardShortcuts) {
      return;
    }

    document.addEventListener('keydown', (e) => {
      // Only handle when modal is open
      if (!this.state.get('isOpen')) return;

      // ESC - Close modal (already handled, but reinforce)
      if (e.key === 'Escape') {
        this.close();
        return;
      }

      // Enter - Add to cart
      if (e.key === 'Enter' && !e.target.matches('input, textarea')) {
        const addBtn = document.querySelector('.bf25-add-to-cart');
        if (addBtn && !addBtn.disabled) {
          addBtn.click();
        }
        return;
      }

      // Number keys (1-9) - Quick quantity select (Individual mode only)
      if (this.config.mode === 'individual_products' && /^[1-9]$/.test(e.key) && !e.target.matches('input')) {
        const quantity = parseInt(e.key);
        this.updateQuantity(quantity);
        return;
      }

      // Arrow Up/Down - Adjust quantity (Individual mode)
      if (this.config.mode === 'individual_products' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const current = this.state.get('quantity');
        const newQty = e.key === 'ArrowUp' ? current + 1 : current - 1;
        this.updateQuantity(newQty);
        return;
      }

      // Tab through tier buttons (Power Packs mode)
      // (Handled by native browser tab navigation)
    });

    if (this.config.debug) {
      console.log('⌨️ Keyboard shortcuts enabled');
    }
  }

  /**
   * Initialize enhanced UX features after modal loads
   */
  initializeEnhancements() {
    // Start countdown timer if present
    this.startCountdownTimer();

    // Enable keyboard shortcuts
    this.enableKeyboardShortcuts();

    if (this.config.debug) {
      console.log('✨ Enhanced features initialized');
    }
  }

  // ============================================================================
  // DATA VALIDATION & ERROR HANDLING
  // ============================================================================

  /**
   * Validate product data before opening modal
   * Ensures product exists and has all required fields
   *
   * @param {string} productId - Product ID to validate
   * @returns {Object|null} - Validated product object or null if invalid
   */
  validateProductData(productId) {
    try {
      // Enhanced validation with detailed debugging
      if (!productId) {
        console.error('❌ Product ID is null/undefined/empty');
        console.log('   Type:', typeof productId, 'Value:', productId);
        this.showErrorModal('Invalid Product', 'No product ID provided.');
        return null;
      }

      if (!window.productData) {
        console.error('❌ window.productData not initialized');
        this.showErrorModal('Configuration Error', 'Product data not loaded.');
        return null;
      }

      // Check if product exists in window.productData
      let product = window.productData[productId];

      if (!product) {
        console.error('❌ Product not found in data:', productId);
        console.log('   Product ID type:', typeof productId);
        console.log('   Available IDs:', Object.keys(window.productData).slice(0, 5), '...');
        console.log('   First available ID type:', typeof Object.keys(window.productData)[0]);

        // Try type coercion (string vs number)
        const stringId = String(productId);
        const numberId = Number(productId);

        if (window.productData[stringId]) {
          console.warn('⚠️ Found product with string coercion');
          product = window.productData[stringId];
        } else if (window.productData[numberId]) {
          console.warn('⚠️ Found product with number coercion');
          product = window.productData[numberId];
        } else {
          this.showErrorModal(
            'Product Not Found',
            'The selected product could not be loaded. Please refresh the page and try again.'
          );
          return null;
        }
      }

      // Validate required fields
      const requiredFields = ['id', 'title', 'featuredImage', 'basePrice'];
      const missingFields = requiredFields.filter(field => !product[field]);

      if (missingFields.length > 0) {
        console.error('❌ Product missing required fields:', missingFields);
        console.log('   Product data:', product);
        this.showErrorModal(
          'Invalid Product Data',
          'This product is missing required information. Please contact support.'
        );
        return null;
      }

      // Validate price is a number
      if (typeof product.basePrice !== 'number' || product.basePrice <= 0) {
        console.error('❌ Invalid product price:', product.basePrice);
        this.showErrorModal(
          'Invalid Product Price',
          'This product has an invalid price. Please contact support.'
        );
        return null;
      }

      return product;

    } catch (error) {
      console.error('❌ Error validating product data:', error);
      this.showErrorModal(
        'Validation Error',
        'An unexpected error occurred while loading the product. Please try again.'
      );
      return null;
    }
  }

  /**
   * Validate variant data structure
   * Ensures variants array exists and has valid structure
   *
   * @param {string} productId - Product ID to validate variants for
   * @returns {boolean} - True if valid, false otherwise
   */
  validateVariantData(productId) {
    try {
      const product = window.productData?.[productId];

      if (!product) {
        return false;
      }

      // If no variants, that's okay (single variant product)
      if (!product.variants || product.variants.length === 0) {
        if (this.config.debug) {
          console.log('ℹ️ Product has no variants (single variant product)');
        }
        return true;
      }

      // Validate each variant has required fields
      const requiredVariantFields = ['id', 'title', 'price', 'available'];

      for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];
        const missingFields = requiredVariantFields.filter(field =>
          variant[field] === undefined || variant[field] === null
        );

        if (missingFields.length > 0) {
          console.error('❌ Variant missing required fields:', {
            variantIndex: i,
            missingFields
          });
          this.showErrorModal(
            'Invalid Variant Data',
            'One or more product variants have missing information. Please contact support.'
          );
          return false;
        }

        // Validate price is a number
        if (typeof variant.price !== 'number' || variant.price < 0) {
          console.error('❌ Invalid variant price:', variant.price);
          this.showErrorModal(
            'Invalid Variant Price',
            'One or more product variants have an invalid price. Please contact support.'
          );
          return false;
        }
      }

      return true;

    } catch (error) {
      console.error('❌ Error validating variant data:', error);
      this.showErrorModal(
        'Validation Error',
        'An unexpected error occurred while validating product variants. Please try again.'
      );
      return false;
    }
  }

  /**
   * Show error modal as a fallback when product modal cannot open
   * Creates a simple overlay with error message and auto-close
   *
   * @param {string} title - Error title
   * @param {string} message - Error message
   */
  showErrorModal(title, message) {
    // Remove any existing error modal
    const existingModal = document.querySelector('.bf25-error-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create error modal
    const errorModal = document.createElement('div');
    errorModal.className = 'bf25-error-modal';
    errorModal.setAttribute('role', 'alertdialog');
    errorModal.setAttribute('aria-labelledby', 'bf25-error-title');
    errorModal.setAttribute('aria-describedby', 'bf25-error-message');
    errorModal.innerHTML = `
      <div class="bf25-error-modal__overlay"></div>
      <div class="bf25-error-modal__content">
        <div class="bf25-error-modal__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 id="bf25-error-title" class="bf25-error-modal__title">${title}</h2>
        <p id="bf25-error-message" class="bf25-error-modal__message">${message}</p>
        <button class="bf25-error-modal__button" aria-label="Close error dialog">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(errorModal);
    document.body.style.overflow = 'hidden';

    // Focus the close button for accessibility
    const closeButton = errorModal.querySelector('.bf25-error-modal__button');
    setTimeout(() => closeButton.focus(), 100);

    // Close handler
    const closeErrorModal = () => {
      errorModal.classList.add('bf25-error-modal--closing');
      setTimeout(() => {
        errorModal.remove();
        document.body.style.overflow = 'auto';
      }, 300);
    };

    // Add event listeners
    closeButton.addEventListener('click', closeErrorModal);
    errorModal.querySelector('.bf25-error-modal__overlay').addEventListener('click', closeErrorModal);

    // ESC key handler
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeErrorModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Auto-close after 10 seconds
    setTimeout(closeErrorModal, 10000);

    if (this.config.debug) {
      console.log('🚨 Error modal shown:', title);
    }
  }

  // ============================================================================
  // FOCUS MANAGEMENT & ACCESSIBILITY
  // ============================================================================

  /**
   * Initialize focus trap when modal opens
   * Prevents focus from leaving modal while open (WCAG requirement)
   */
  initializeFocusTrap() {
    const modal = document.querySelector('.bf25-expansion-modal');
    if (!modal) return;

    // Get all focusable elements within modal
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const getFocusableElements = () => {
      return Array.from(modal.querySelectorAll(focusableSelectors));
    };

    // Tab key handler for focus trap
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element -> go to last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> go to first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    // Store handler for cleanup
    this.focusTrapHandler = handleTabKey;
    document.addEventListener('keydown', this.focusTrapHandler);

    // Focus first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Prefer focusing close button first
      const closeButton = modal.querySelector('.bf25-close-button');
      if (closeButton) {
        closeButton.focus();
      } else {
        focusableElements[0].focus();
      }
    }

    if (this.config.debug) {
      console.log('🔒 Focus trap initialized');
    }
  }

  /**
   * Restore focus to element that triggered modal
   * Called when modal closes (WCAG requirement)
   */
  restoreFocus() {
    if (this.triggerElement && typeof this.triggerElement.focus === 'function') {
      try {
        this.triggerElement.focus();
        if (this.config.debug) {
          console.log('↩️ Focus restored to trigger element');
        }
      } catch (error) {
        console.error('❌ Error restoring focus:', error);
      }
    }
    this.triggerElement = null;
  }

  /**
   * Announce message to screen readers
   * Creates/updates ARIA live region for accessibility
   *
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announceToScreenReader(message, priority = 'polite') {
    // Get or create live region
    let liveRegion = document.getElementById('bf25-sr-announcements');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'bf25-sr-announcements';
      liveRegion.className = 'bf25-sr-only';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }

    // Update priority if different
    if (liveRegion.getAttribute('aria-live') !== priority) {
      liveRegion.setAttribute('aria-live', priority);
    }

    // Clear previous message and announce new one
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);

    if (this.config.debug) {
      console.log('📢 Screen reader announcement:', message);
    }
  }

  // ============================================================================
  // BROWSER COMPATIBILITY FIXES
  // ============================================================================

  /**
   * Initialize browser-specific fixes and polyfills
   * Handles Safari quirks, iOS Safari issues, and passive event listeners
   */
  initializeBrowserFixes() {
    // ─────────────────────────────────────────────────────────────────
    // iOS SAFARI 100VH FIX
    // ─────────────────────────────────────────────────────────────────
    // Mobile Safari includes URL bar in 100vh, causing layout issues
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on load
    setViewportHeight();

    // Update on resize and orientation change (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setViewportHeight, 100);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });

    // ─────────────────────────────────────────────────────────────────
    // SAFARI SMOOTH SCROLL FIX
    // ─────────────────────────────────────────────────────────────────
    // Safari doesn't support CSS scroll-behavior: smooth in some versions
    if ('scrollBehavior' in document.documentElement.style === false) {
      // Polyfill not needed for modal, just note it
      if (this.config.debug) {
        console.log('ℹ️ Browser does not support smooth scroll (Safari)');
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // PASSIVE EVENT LISTENERS (Performance)
    // ─────────────────────────────────────────────────────────────────
    // Improve scroll performance by marking touch listeners as passive
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
          return true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {
      // Passive not supported
    }

    this.supportsPassive = supportsPassive;

    if (this.config.debug) {
      console.log('🔧 Browser compatibility fixes initialized:', {
        viewportHeight: '--vh CSS variable set',
        passiveListeners: supportsPassive,
        userAgent: navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'
      });
    }
  }

  /**
   * Update quantity value
   * Validates and updates state, triggers tier recalculation
   *
   * @param {number} newQuantity - New quantity value
   */
  updateQuantity(newQuantity) {
    // Validate
    const minQuantity = 1;
    const maxQuantity = 99;
    const validQuantity = Math.max(minQuantity, Math.min(maxQuantity, parseInt(newQuantity) || 1));

    // Update state
    this.state.update('quantity', validQuantity);

    // Update quantity stepper (always visible now with dual controls)
    const input = document.querySelector('.bf25-quantity-input');
    if (input) {
      input.value = validQuantity;
    }

    // Update stepper button disabled states
    this.updateStepperButtons();

    // Update BOTH button selection systems (BF25-PACK-BUTTON-QUANTITY-SYNC)
    this.updateTierButtonSelection();   // .bf25-tier-button (if present)
    this.updatePackButtonSelection();   // .js-pack-btn (Liquid template buttons)

    if (this.config.debug) {
      console.log('📦 Quantity updated:', validQuantity);
    }
  }

  /**
   * Update stepper button disabled states (Individual mode)
   */
  updateStepperButtons() {
    const quantity = this.state.get('quantity');
    const minusBtn = document.querySelector('.bf25-quantity-minus');
    const plusBtn = document.querySelector('.bf25-quantity-plus');

    if (minusBtn) {
      minusBtn.disabled = quantity <= 1;
    }

    if (plusBtn) {
      plusBtn.disabled = quantity >= 99;
    }
  }

  /**
   * Update tier button selection (Power Packs mode)
   */
  updateTierButtonSelection() {
    const currentQuantity = this.state.get('quantity');

    document.querySelectorAll('.bf25-tier-button').forEach(button => {
      const buttonQuantity = parseInt(button.dataset.quantity);
      const isSelected = buttonQuantity === currentQuantity;

      // Update selected class and aria attribute
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', isSelected);

      // Update checkmark visibility
      let checkmark = button.querySelector('.bf25-tier-button-check');

      if (isSelected) {
        // Add checkmark if not present
        if (!checkmark) {
          checkmark = document.createElement('span');
          checkmark.className = 'bf25-tier-button-check';
          checkmark.textContent = '✓';
          button.appendChild(checkmark);
        }
      } else {
        // Remove checkmark if present
        if (checkmark) {
          checkmark.remove();
        }
      }
    });

    if (this.config.debug) {
      console.log('✅ Tier button selection updated:', currentQuantity);
    }
  }

  /**
   * Update pack button selection (Liquid template pack buttons)
   * Syncs .js-pack-btn buttons with current quantity
   */
  updatePackButtonSelection() {
    const currentQuantity = this.state.get('quantity');

    document.querySelectorAll('.js-pack-btn').forEach(button => {
      const buttonQuantity = parseInt(button.dataset.quantity);
      const isSelected = buttonQuantity === currentQuantity;

      // Update selected state
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', isSelected);

      // Checkmark is already in Liquid template, just toggle visibility
      const checkmark = button.querySelector('.pack-checkmark');
      if (checkmark) {
        checkmark.style.opacity = isSelected ? '1' : '0';
      }
    });

    if (this.config.debug) {
      console.log('✅ Pack button selection updated:', currentQuantity);
    }
  }

  /**
   * Bind quantity control events
   * Called after UI is injected
   * BF25-FIX-BIND-ALL-QUANTITY-EVENTS: Always bind all event systems for dual-mode layout
   */
  bindQuantityEvents() {
    // Always bind ALL event systems (dual-mode layout shows both controls)
    this.bindLiquidPackButtonEvents();    // Liquid template pack buttons
    this.bindPowerPacksEvents();          // JS-generated tier buttons
    this.bindIndividualProductsEvents();  // Quantity stepper

    // Bind action button events (Add to Cart, etc.)
    this.bindActionButtonEvents();

    if (this.config.debug) {
      console.log('✅ All quantity events bound (pack + tier + stepper)');
    }
  }

  /**
   * Bind Power Packs mode events
   */
  bindPowerPacksEvents() {
    const container = document.querySelector('.bf25-tier-buttons');
    if (!container) return;

    // Event delegation for tier buttons
    container.addEventListener('click', (e) => {
      const button = e.target.closest('.bf25-tier-button');
      if (!button) return;

      const quantity = parseInt(button.dataset.quantity);
      this.updateQuantity(quantity);
    });

    if (this.config.debug) {
      console.log('✅ Power Packs events bound');
    }
  }

  /**
   * Bind Individual Products mode events
   */
  bindIndividualProductsEvents() {
    const input = document.querySelector('.bf25-quantity-input');
    const minusBtn = document.querySelector('.bf25-quantity-minus');
    const plusBtn = document.querySelector('.bf25-quantity-plus');

    // Minus button
    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        const current = this.state.get('quantity');
        this.updateQuantity(current - 1);
      });
    }

    // Plus button
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        const current = this.state.get('quantity');
        this.updateQuantity(current + 1);
      });
    }

    // Input field
    if (input) {
      // Debounce input changes
      let inputTimeout;
      input.addEventListener('input', (e) => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          this.updateQuantity(e.target.value);
        }, 300);
      });

      // Handle blur (validate immediately)
      input.addEventListener('blur', (e) => {
        this.updateQuantity(e.target.value);
      });

      // Prevent non-numeric input
      input.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Enter') {
          e.preventDefault();
        }
      });
    }

    if (this.config.debug) {
      console.log('✅ Individual Products events bound');
    }
  }

  /**
   * Bind Liquid pack button events (.js-pack-btn)
   * Syncs pack buttons with quantity stepper (BF25-PACK-BUTTON-QUANTITY-SYNC)
   */
  bindLiquidPackButtonEvents() {
    const container = document.querySelector('.bf25-pack-buttons');
    if (!container) {
      if (this.config.debug) {
        console.log('ℹ️ No .bf25-pack-buttons container found');
      }
      return;
    }

    // Event delegation for pack buttons
    container.addEventListener('click', (e) => {
      const button = e.target.closest('.js-pack-btn');
      if (!button) return;

      const quantity = parseInt(button.dataset.quantity);
      if (!isNaN(quantity)) {
        this.updateQuantity(quantity);
      }
    });

    if (this.config.debug) {
      console.log('✅ Liquid pack button events bound');
    }
  }

  /**
   * Bind action button events (Add to Cart, Buy Now)
   * Prompt 10 - IMPLEMENTED
   */
  bindActionButtonEvents() {
    const addToCartBtn = document.querySelector('.bf25-add-to-cart');
    const buyNowBtn = document.querySelector('.bf25-buy-now');

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async () => {
        // Prevent multiple simultaneous clicks
        if (addToCartBtn.classList.contains('is-loading')) {
          return;
        }

        if (this.config.debug) {
          console.log('🛒 Add to Cart clicked');
        }

        // Show loading state
        this.setButtonLoading(addToCartBtn, true);

        // Add to cart via CartManager
        const result = await this.cartManager.addToCart();

        // Reset loading state if error (success handler keeps button in success state temporarily)
        if (!result.success) {
          this.setButtonLoading(addToCartBtn, false);
        }
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        if (this.config.debug) {
          console.log('⚡ Buy Now clicked');
          console.log('📦 [Prompt 10 will handle checkout logic]');
        }

        alert('Buy Now functionality will be implemented in Prompt 10');
      });
    }

    if (this.config.debug) {
      console.log('✅ Action button events bound');
    }
  }

  /**
   * Set button loading state
   * Shows spinner, disables button
   *
   * @param {HTMLElement} button - Button element
   * @param {boolean} loading - Loading state
   */
  setButtonLoading(button, loading) {
    const text = button.querySelector('.bf25-button-text');
    const icon = button.querySelector('.bf25-button-icon');
    const loader = button.querySelector('.bf25-button-loader');

    if (loading) {
      button.classList.add('is-loading');
      button.disabled = true;
      if (text) text.hidden = true;
      if (icon) icon.hidden = true;
      if (loader) loader.hidden = false;
    } else {
      button.classList.remove('is-loading');
      button.disabled = false;
      if (text) text.hidden = false;
      if (icon) icon.hidden = false;
      if (loader) loader.hidden = true;
    }
  }

  /**
   * Bind description toggle events
   * Updated: BF25-FIX-012
   */
  bindDescriptionEvents() {
    const toggle = this.container.querySelector('.bf25-description-toggle');
    const wrapper = this.container.querySelector('.bf25-description-wrapper');

    if (!toggle || !wrapper) {
      if (this.config.debug) {
        console.log('ℹ️ No description to bind events');
      }
      return;
    }

    toggle.addEventListener('click', () => {
      const isExpanded = wrapper.classList.contains('expanded');

      if (isExpanded) {
        // Collapse
        wrapper.classList.remove('expanded');
        toggle.setAttribute('aria-expanded', 'false');
        const textSpan = toggle.querySelector('.bf25-toggle-text');
        if (textSpan) textSpan.textContent = 'Learn More';

        // Rotate arrow back
        const arrow = toggle.querySelector('.bf25-description-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        wrapper.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
        const textSpan = toggle.querySelector('.bf25-toggle-text');
        if (textSpan) textSpan.textContent = 'Show Less';

        // Rotate arrow
        const arrow = toggle.querySelector('.bf25-description-arrow');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
      }

      if (this.config.debug) {
        console.log('📝 Description toggled:', isExpanded ? 'collapsed' : 'expanded');
      }
    });

    if (this.config.debug) {
      console.log('✅ Description toggle bound');
    }
  }

  /**
   * Bind upsell card toggle events
   * Updated: BF25-UPSELL-TOGGLE - Changed from navigation to selection toggle
   */
  bindUpsellEvents() {
    const upsellCards = this.container.querySelectorAll('.bf25-upsell-card');

    // Initialize selected upsells tracking
    if (!this.selectedUpsells) {
      this.selectedUpsells = new Map();
    }

    upsellCards.forEach(card => {
      // Click handler for entire card
      card.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleUpsellSelection(card);
      });

      // Keyboard accessibility (Enter/Space to toggle)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleUpsellSelection(card);
        }
      });
    });

    if (this.config.debug && upsellCards.length > 0) {
      console.log(`✅ ${upsellCards.length} upsell cards bound for toggle selection`);
    }
  }

  /**
   * Toggle upsell selection state
   * @param {HTMLElement} card - The upsell card element
   */
  toggleUpsellSelection(card) {
    const variantId = card.dataset.variantId;
    const productId = card.dataset.productId;
    const title = card.dataset.upsellTitle;
    const price = parseInt(card.dataset.upsellPrice, 10);
    const handle = card.dataset.handle || card.dataset.productHandle;

    if (!variantId) {
      console.error('[BF25 Modal] No variant ID for upsell:', title);
      return;
    }

    const isSelected = card.classList.contains('is-selected');

    if (isSelected) {
      // Deselect
      card.classList.remove('is-selected');
      card.setAttribute('aria-checked', 'false');
      this.selectedUpsells.delete(variantId);

      if (this.config.debug) {
        console.log(`❌ Upsell deselected: ${title}`);
      }
    } else {
      // Select - look up image from window.productData (BF25-8.7)
      let imageUrl = '';

      // Method 1: Look up by handle in productData
      if (handle && window.productData && window.productData[handle]) {
        const productData = window.productData[handle];
        imageUrl = productData.featuredImage || productData.featured_image || productData.image || '';
        if (this.config.debug && imageUrl) {
          console.log(`[BF25 Modal] Found upsell image in productData by handle: ${handle}`);
        }
      }

      // Method 2: Search productData by variant ID
      if (!imageUrl && variantId && window.productData) {
        for (const [pdHandle, product] of Object.entries(window.productData)) {
          const hasVariant = product.variants?.some(v => String(v.id) === String(variantId));
          if (hasVariant) {
            imageUrl = product.featuredImage || product.featured_image || product.image || '';
            if (this.config.debug && imageUrl) {
              console.log(`[BF25 Modal] Found upsell image by variant search: ${pdHandle}`);
            }
            break;
          }
        }
      }

      // Method 3: Get image from card DOM
      if (!imageUrl) {
        const imgElement = card.querySelector('img');
        if (imgElement && imgElement.src) {
          imageUrl = imgElement.src;
          if (this.config.debug) {
            console.log('[BF25 Modal] Got upsell image from DOM element');
          }
        }
      }

      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
      this.selectedUpsells.set(variantId, {
        variantId: parseInt(variantId, 10),
        productId: parseInt(productId, 10),
        title: title,
        price: price,
        image: imageUrl,  // Now includes image (BF25-8.7)
        handle: handle || ''
      });

      if (this.config.debug) {
        console.log(`✅ Upsell selected: ${title}`, { image: imageUrl ? 'Found' : 'Missing' });
      }
    }

    // Emit event for analytics
    this.emitCartEvent('bf25:upsell:toggled', {
      variantId,
      title,
      selected: !isSelected,
      totalSelected: this.selectedUpsells.size
    });

    if (this.config.debug) {
      console.log(`📦 Selected upsells (${this.selectedUpsells.size}):`,
        Array.from(this.selectedUpsells.values()).map(u => u.title)
      );
    }
  }

  /**
   * Get all selected upsells for cart addition
   * @returns {Array} Array of selected upsell objects
   */
  getSelectedUpsells() {
    return Array.from(this.selectedUpsells?.values() || []);
  }

  /**
   * Clear all upsell selections (called when modal closes)
   */
  clearUpsellSelections() {
    if (this.selectedUpsells) {
      this.selectedUpsells.clear();
    }

    // Reset visual state
    const selectedCards = this.container?.querySelectorAll('.bf25-upsell-card.is-selected');
    selectedCards?.forEach(card => {
      card.classList.remove('is-selected');
      card.setAttribute('aria-checked', 'false');
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // CONTENT GENERATION HELPERS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Format price from cents to currency string
   *
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price (e.g., "€22.95")
   */
  formatPrice(cents) {
    if (!cents || cents === 0) return '€0.00';

    const euros = (cents / 100).toFixed(2);
    return `€${euros}`;
  }

  /**
   * Create review stars HTML with rating and count
   * Based on BOGO feature extraction (Document: BOGO_FEATURE_EXTRACTION_REPORT.md)
   *
   * @param {number} rating - Star rating (0-5)
   * @param {number} count - Number of reviews
   * @returns {string} HTML for star display
   */
  createReviewStars(rating, count) {
    if (!rating || rating === 0) {
      return '<div class="bf25-reviews-empty bf25-text-tertiary bf25-text-sm">No reviews yet</div>';
    }

    // Calculate full stars, half stars, empty stars
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '<div class="bf25-reviews-stars">';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="bf25-star bf25-star-full" aria-hidden="true">★</span>';
    }

    // Half star
    if (hasHalfStar) {
      starsHTML += '<span class="bf25-star bf25-star-half" aria-hidden="true">⯪</span>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="bf25-star bf25-star-empty" aria-hidden="true">☆</span>';
    }

    starsHTML += '</div>';

    // Add rating text and count
    const ratingText = `
    <div class="bf25-reviews-info">
      <span class="bf25-text-md bf25-text-accent">${rating.toFixed(1)}</span>
      <span class="bf25-text-sm bf25-text-secondary">
        (${count.toLocaleString()} ${count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  `;

    return `
    <div class="bf25-reviews-container">
      ${starsHTML}
      ${ratingText}
    </div>
  `;
  }

  /**
   * Creates compact review summary for modal header (stars + count, clickable)
   * @param {string} productId - Product ID to fetch reviews for
   * @returns {string} HTML string
   */
  createCompactReviewSummary(productId) {
    // Get review data from PRODUCT_REVIEWS (same source as full reviews)
    const reviewData = window.PRODUCT_REVIEWS?.[productId];

    if (!reviewData || !reviewData.avgRating || reviewData.totalReviews === 0) {
      return ''; // Don't show if no reviews
    }

    const rating = reviewData.avgRating;
    const count = reviewData.totalReviews;

    // Calculate star fill percentage (e.g., 4.5 = 90%)
    const fillPercent = (rating / 5) * 100;

    return `
      <div class="bf25-compact-review-summary"
           role="button"
           tabindex="0"
           aria-label="Rated ${rating.toFixed(1)} out of 5 stars, ${count} reviews. Click to view reviews."
           onclick="document.querySelector('.bf25-modal-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })"
           onkeydown="if(event.key==='Enter') document.querySelector('.bf25-modal-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">
        <div class="bf25-compact-stars" aria-hidden="true">
          <span class="bf25-stars-empty">★★★★★</span>
          <span class="bf25-stars-filled" style="width: ${fillPercent}%;">★★★★★</span>
        </div>
        <span class="bf25-compact-rating">${rating.toFixed(1)}</span>
        <span class="bf25-compact-count">(${count.toLocaleString()} reviews)</span>
      </div>
    `;
  }

  /**
   * Get reviews from BOGO database
   * Falls back to empty if not found
   *
   * @param {string} productId - Product ID
   * @returns {Object|null} Review data or null
   */
  getBogoReviews(productId) {
    // Access BOGO's PRODUCT_REVIEWS object (defined in bogo-builder.js)
    if (typeof window.PRODUCT_REVIEWS === 'undefined') {
      console.warn('⚠️ BOGO reviews not loaded - is bogo-builder.js included?');
      return null;
    }

    const reviewData = window.PRODUCT_REVIEWS[productId];

    if (!reviewData) {
      if (this.config.debug) {
        console.log(`ℹ️ No reviews found for product ${productId} in BOGO database`);
      }
      return null;
    }

    return reviewData;
  }

  /**
   * Create full review cards like BOGO system
   * Matches BOGO's createReviewsSection() function
   *
   * @param {string} productId - Product ID
   * @returns {string} HTML for reviews section
   */
  createBogoReviewsSection(productId) {
    const reviewData = this.getBogoReviews(productId);

    if (!reviewData) {
      return '<div class="bf25-reviews-empty bf25-text-tertiary bf25-text-sm">No reviews yet</div>';
    }

    const { totalReviews, avgRating, reviews } = reviewData;

    // Generate star HTML
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = (avgRating % 1) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="bf25-star bf25-filled">★</span>';
    }
    if (hasHalfStar) {
      starsHTML += '<span class="bf25-star bf25-half">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="bf25-star">★</span>';
    }

    // Generate review cards HTML
    const reviewCardsHTML = reviews.map(review => {
      const reviewStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

      return `
        <div class="bf25-review-card">
          <div class="bf25-review-header">
            <div class="bf25-review-author">${review.author}</div>
            <div class="bf25-review-stars">${reviewStars}</div>
            <div class="bf25-review-date">${review.date}</div>
          </div>
          <div class="bf25-review-title bf25-text-md bf25-mb-2">${review.title}</div>
          <div class="bf25-review-content bf25-text-sm bf25-text-secondary">${review.content}</div>
        </div>
      `;
    }).join('');

    // Complete reviews section HTML (matches BOGO structure)
    return `
      <div class="bf25-modal-reviews-section">
        <div class="bf25-reviews-header bf25-mb-3">
          <h3 class="bf25-text-md bf25-mb-2">Customer Reviews</h3>
          <div class="bf25-reviews-rating-summary bf25-mb-3">
            <div class="bf25-rating-stars bf25-mb-1">
              ${starsHTML}
            </div>
            <div class="bf25-text-sm bf25-text-secondary">
              ${avgRating.toFixed(1)} / 5
            </div>
          </div>
        </div>
        <div class="bf25-reviews-scroll-area">
          ${reviewCardsHTML}
        </div>
        <div class="bf25-review-total-count bf25-text-xs bf25-text-tertiary bf25-text-center bf25-mt-2">
          ${reviews.length} Reviews of ${totalReviews.toLocaleString()}
        </div>
      </div>
    `;
  }

  /**
   * Create badges HTML (Best Seller only)
   * Based on BOGO feature extraction
   * Updated: BF25-FIX-013 - Removed discount badge from image
   *
   * @param {Object} product - Product data from window.productData
   * @returns {string} HTML for badges
   */
  createBadges(product) {
    let badgesHTML = '<div class="bf25-badges-container">';

    // Best Seller Badge
    if (product.isBestseller) {
      badgesHTML += `
      <div class="bf25-badge bf25-badge-bestseller">
        <span class="bf25-badge-icon">🏆</span>
        <span class="bf25-badge-text">BEST SELLER</span>
      </div>
    `;
    }

    // Discount Badge - REMOVED (BF25-FIX-013)
    // Discount is now shown inline with price instead

    badgesHTML += '</div>';

    return badgesHTML;
  }

  /**
   * Get product image URL with fallback
   * Tries variant image first, then featured image, then placeholder
   *
   * @param {Object} product - Product data
   * @param {Array} variants - Variant data
   * @returns {string} Image URL
   */
  getProductImage(product, variants) {
    const isValidImage = (url) => {
      if (!url) return false;
      // Filter out Shopify's no-image placeholder
      if (url.includes('no-image') || url.includes('placeholder')) return false;
      return true;
    };

    // Try variant image first (most specific)
    if (variants && variants[0] && variants[0].image && isValidImage(variants[0].image)) {
      return variants[0].image;
    }

    // Try featured image
    if (product.featuredImage && isValidImage(product.featuredImage)) {
      return product.featuredImage;
    }

    // Try popup image
    if (product.popupImage && isValidImage(product.popupImage)) {
      return product.popupImage;
    }

    // Try main image property
    if (product.image && isValidImage(product.image)) {
      return product.image;
    }

    // Return null if no valid image (we'll render SVG placeholder instead)
    return null;
  }

  /**
   * Create stock indicator HTML with color-coded urgency
   * Based on BOGO feature extraction
   *
   * @param {number} stockLevel - Available stock quantity
   * @returns {string} HTML for stock indicator
   */
  createStockIndicator(stockLevel) {
    let status, color, message;

    if (stockLevel > 20) {
      status = 'in-stock';
      color = 'bf25-text-accent';
      message = 'In Stock';
    } else if (stockLevel > 5) {
      status = 'low-stock';
      color = 'bf25-text-warning';
      message = `Only ${stockLevel} left!`;
    } else {
      status = 'very-low';
      color = 'bf25-text-danger';
      message = `Only ${stockLevel} left - Order soon!`;
    }

    return `
    <div class="bf25-stock ${status}">
      <span class="bf25-stock-icon ${color}">●</span>
      <span class="bf25-stock-text bf25-text-sm ${color}">${message}</span>
    </div>
  `;
  }

  /**
   * Populate modal content dynamically from product data
   *
   * This method builds the complete modal HTML using data from:
   * - window.productData (metadata, descriptions, reviews)
   * - window.productVariants (variant images, options, pricing)
   *
   * @param {string} productId - The product ID to display
   */
  populateContent(productId) {
    // ─────────────────────────────────────────────────────────────────
    // STEP 1: Fetch data from both sources
    // ─────────────────────────────────────────────────────────────────
    const product = window.productData?.[productId];
    const variants = window.productVariants?.[productId];

    // Validation
    if (!product) {
      console.error('❌ Product data not found for ID:', productId);
      this.content.innerHTML = `
      <div class="bf25-error-state">
        <p class="bf25-text-lg bf25-text-secondary">Product information unavailable</p>
        <p class="bf25-text-sm bf25-text-tertiary">Please try another product</p>
      </div>
    `;
      return;
    }

    if (this.config.debug) {
      console.group('📝 Populating Content');
      console.log('Product:', product.title);
      console.log('Has variants:', !!variants);
      console.log('Variants count:', variants?.length || 0);
      console.groupEnd();
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: Get product image
    // ─────────────────────────────────────────────────────────────────
    const imageUrl = this.getProductImage(product, variants);

    // ─────────────────────────────────────────────────────────────────
    // STEP 2.5: Pre-build initial compare price HTML (BF25-FIX-021)
    // ─────────────────────────────────────────────────────────────────
    let initialCompareHtml = '';
    if (product.comparePrice && product.comparePrice > 0) {
      initialCompareHtml = '<span class="bf25-price-compare"><s>' + this.formatPrice(product.comparePrice) + '</s></span>';
      console.log('🔍 Initial compare price HTML:', initialCompareHtml, '(value:', product.comparePrice, ')');
    } else {
      console.log('❌ No initial compare price (value:', product.comparePrice, ')');
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: Build complete modal HTML
    // ─────────────────────────────────────────────────────────────────
    const html = `
    <div class="bf25-modal-layout">

      <!-- Product Image Section -->
      <div class="bf25-modal-image-section bf25-reveal-stagger-1">
        ${this.createBadges(product)}

        <div class="bf25-modal-image-container">
          ${imageUrl ? `
            <img
              src="${imageUrl}"
              alt="${product.title}"
              class="bf25-modal-product-image"
              loading="eager"
              width="600"
              height="600"
              style="opacity: 1;"
            />
          ` : `
            <div class="bf25-image-placeholder">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="12" fill="rgba(255,255,255,0.05)"/>
                <path d="M60 45L70 60H50L60 45Z" fill="rgba(255,255,255,0.2)"/>
                <circle cx="60" cy="75" r="5" fill="rgba(255,255,255,0.2)"/>
              </svg>
              <p style="color: rgba(255,255,255,0.3); margin-top: 16px; font-size: 14px;">No image available</p>
            </div>
          `}
        </div>
      </div>

      <!-- Product Details Section -->
      <div class="bf25-modal-details-section">

        <!-- Title -->
        <h2
          id="bf25-modal-title"
          class="bf25-modal-title bf25-text-xl bf25-leading-tight bf25-tracking-tighter bf25-mb-3"
        >
          ${product.title}
        </h2>

        <!-- Description Section (Moved up - BF25-FIX-012) -->
        ${(() => {
          const description = product.description;

          if (!description || typeof description !== 'string' || description === '[object Object]' || description.trim().length === 0) {
            return '';
          }

          return `
            <div class="bf25-description-wrapper bf25-mb-4">
              <div class="bf25-description-inner">
                <div class="bf25-description-content">
                  ${description}
                </div>
              </div>
              <button class="bf25-description-toggle" type="button" aria-expanded="false">
                <span class="bf25-toggle-text">Learn More</span>
                <svg class="bf25-description-arrow" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="M225.408 368.384L496 640.641l270.592-272.257-48.64-49.024L496 542.592 274.176 319.36l-48.768 49.024z m0 0z" fill="#60c655"></path>
                </svg>
              </button>
            </div>
          `;
        })()}

        <!-- Variant Selectors (Moved after description - BF25-FIX-016) -->
        <div class="bf25-variant-section bf25-mb-4 bf25-reveal-stagger-2">
          ${this.variantManager.initialize(productId)}
        </div>

        <!-- Price Display (Updated BF25-FIX-021: Pre-built compare price) -->
        <div class="bf25-modal-pricing bf25-mb-5 bf25-reveal-stagger-1">
          <!-- Main Price Row: Discounted | Original -->
          <div class="bf25-price-main-row">
            <div class="bf25-price-current-group">
              <span class="bf25-price-current">${this.formatPrice(product.comparePrice || product.basePrice)}</span>
              <span class="bf25-per-item">per item</span>
              ${initialCompareHtml}
            </div>
          </div>
        </div>

        <!-- Quantity Controls (Tier Buttons) - Moved up per BF25-FIX-007 -->
        <div class="bf25-quantity-section bf25-mb-5 bf25-reveal-stagger-2">
          ${this.generateQuantityControls()}
        </div>

        <!-- Upsells Section -->
        ${(() => {
          const upsells = product.upsells;

          if (!upsells || upsells.length === 0) {
            return '';
          }

          const upsellCards = upsells.map(upsell => {
            // Calculate discount percentage
            const discount = upsell.comparePrice > upsell.price
              ? Math.round(((upsell.comparePrice - upsell.price) / upsell.comparePrice) * 100)
              : 0;

            // Format prices
            const price = this.formatPrice(upsell.price);
            const comparePrice = upsell.comparePrice > upsell.price
              ? this.formatPrice(upsell.comparePrice)
              : '';

            // Use variantId if available, fallback to id (product ID)
            const variantId = upsell.variantId || upsell.variant_id || upsell.id;

            return `
              <div class="bf25-upsell-card"
                   data-product-id="${upsell.id}"
                   data-variant-id="${variantId}"
                   data-upsell-title="${upsell.title}"
                   data-upsell-price="${upsell.price}"
                   role="checkbox"
                   aria-checked="false"
                   tabindex="0">
                <div class="bf25-upsell-checkbox">
                  <svg class="bf25-upsell-check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="bf25-upsell-image">
                  ${discount > 0 ? `<span class="bf25-upsell-badge">${discount}% OFF</span>` : ''}
                  <img src="${upsell.image}" alt="${upsell.title}" loading="lazy">
                </div>
                <div class="bf25-upsell-info">
                  <h4 class="bf25-upsell-title bf25-text-sm bf25-text-primary">${upsell.title}</h4>
                  <div class="bf25-upsell-price">
                    <span class="bf25-text-md bf25-text-accent">${price}</span>
                    ${comparePrice ? `<span class="bf25-text-sm bf25-text-tertiary" style="text-decoration: line-through;">${comparePrice}</span>` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('');

          return `
            <div class="bf25-upsells-section bf25-mb-4 bf25-reveal-stagger-2">
              <h3 class="bf25-upsells-title bf25-text-md bf25-text-primary bf25-mb-3">Pairs Well With</h3>
              <div class="bf25-upsells-grid">
                ${upsellCards}
              </div>
            </div>
          `;
        })()}

        <!-- Reviews (Moved to bottom - BF25-REV-006) -->
        <div class="bf25-modal-reviews bf25-mb-4 bf25-reveal-stagger-3">
          ${this.createBogoReviewsSection(product.id)}
        </div>

      </div>

    </div>

    <!-- Fixed Footer with Add to Cart (BF25-FIX-007) -->
    <div class="bf25-modal-footer-fixed">
      ${this.generateActionButtons()}
    </div>
  `;

    // ─────────────────────────────────────────────────────────────────
    // STEP 4: Inject HTML into modal
    // ─────────────────────────────────────────────────────────────────
    this.content.innerHTML = html;

    // ─────────────────────────────────────────────────────────────────
    // STEP 5: Bind variant selection events
    // ─────────────────────────────────────────────────────────────────
    this.variantManager.bindEvents();

    // ─────────────────────────────────────────────────────────────────
    // STEP 6: Calculate and display tier pricing
    // ─────────────────────────────────────────────────────────────────
    this.tierCalculator.updatePricingDisplay();

    // ─────────────────────────────────────────────────────────────────
    // STEP 7: Bind quantity control events
    // ─────────────────────────────────────────────────────────────────
    this.bindQuantityEvents();

    // ─────────────────────────────────────────────────────────────────
    // STEP 8: Bind description toggle events
    // ─────────────────────────────────────────────────────────────────
    this.bindDescriptionEvents();

    // ─────────────────────────────────────────────────────────────────
    // STEP 9: Bind upsell add button events
    // ─────────────────────────────────────────────────────────────────
    this.bindUpsellEvents();

    if (this.config.debug) {
      console.log('✅ Content populated');
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT CARD REVIEWS POPULATION
// Added: BF25-REV-006
// ═══════════════════════════════════════════════════════════════════════

/**
 * Populate review stars on product cards
 * Uses BOGO review data to show stars and count
 */
function populateCardReviews() {
  // Get all product cards
  const cards = document.querySelectorAll('.bf25-product-card');

  if (!cards.length) {
    if (window.bf25Config?.debug) {
      console.log('ℹ️ No BF25 product cards found for review population');
    }
    return;
  }

  // Check if BOGO reviews are available
  if (typeof window.PRODUCT_REVIEWS === 'undefined') {
    console.warn('⚠️ BOGO reviews not loaded - cannot populate card reviews');
    return;
  }

  let populatedCount = 0;

  cards.forEach(card => {
    const productId = card.dataset.productId;
    const reviewData = window.PRODUCT_REVIEWS[productId];

    if (!reviewData) {
      // Hide reviews for products without data
      const ratingDisplay = card.querySelector('.bf25-product-rating-display');
      if (ratingDisplay) {
        ratingDisplay.style.display = 'none';
      }
      return;
    }

    const { totalReviews, avgRating } = reviewData;

    // Calculate star width percentage (e.g., 4.7 = 94%)
    const starPercentage = (avgRating / 5) * 100;

    // Update stars filled width
    const starsFilled = card.querySelector('.stars-filled');
    if (starsFilled) {
      starsFilled.style.width = `${starPercentage}%`;
    }

    // Update review count text
    const ratingCount = card.querySelector('.bf25-rating-count');
    if (ratingCount) {
      ratingCount.textContent = `${totalReviews.toLocaleString()} reviews`;
    }

    // Update aria-label for accessibility
    const ratingDisplay = card.querySelector('.bf25-product-rating-display');
    if (ratingDisplay) {
      ratingDisplay.setAttribute('aria-label',
        `Rated ${avgRating} out of 5 stars, ${totalReviews.toLocaleString()} reviews. Click to view details.`
      );
    }

    populatedCount++;
  });

  if (window.bf25Config?.debug) {
    console.log(`⭐ Populated reviews on ${populatedCount} product cards`);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Initialize the expansion manager when DOM is ready
 */
function initBF25Expansion() {
  // Validate required globals exist
  if (!window.bf25Config) {
    console.error('❌ BF25: window.bf25Config not found. Ensure Prompt 1 is complete.');
    return;
  }

  if (!window.productData) {
    console.error('❌ BF25: window.productData not found. Ensure Prompt 1 is complete.');
    return;
  }

  // Create global instance
  window.bf25Expansion = new ExpansionManager();

  if (window.bf25Config.debug) {
    console.log('✅ BF25 Expansion Modal System Ready');
    console.log('📊 Products available:', Object.keys(window.productData).length);
    console.log('🎯 Mode:', window.bf25Config.mode);
  }

  // Populate product card reviews after small delay to ensure PRODUCT_REVIEWS loaded
  setTimeout(populateCardReviews, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBF25Expansion);
} else {
  // DOM already loaded
  initBF25Expansion();
}
