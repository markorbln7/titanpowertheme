/**
 * BF25 Interactive Hero - Premium Redesign
 * Version: 2.0.0
 */

'use strict';

class PowerSlider {
  constructor(containerElement) {
    console.log('🎯 Container received:', containerElement);
    this.container = containerElement;
    this.data = this.loadData();
    if (!this.data) {
      console.error('BF25 Hero: Failed to initialize - no data found');
      return;
    }

    this.config = this.data.config;
    this.gifts = this.data.gifts;
    this.tiers = this.data.tiers;

    this.currentValue = 0;
    this.currentTier = this.tiers[0];
    this.previousTier = this.tiers[0];

    this.elements = this.cacheDOM();

    if (!this.elements.sliderInput) {
      console.error('BF25 Hero: Slider input not found');
      return;
    }

    this.init();
  }

  loadData() {
    const dataScript = document.getElementById('bf25HeroData');
    if (!dataScript) return null;
    try {
      return JSON.parse(dataScript.textContent);
    } catch (error) {
      console.error('BF25 Hero: Failed to parse JSON data', error);
      return null;
    }
  }

  cacheDOM() {
    return {
      sliderInput: this.container.querySelector('.bf25-hero__input'),
      sliderWrapper: this.container.querySelector('.bf25-hero__slider-wrapper'),
      giftBoxes: this.container.querySelectorAll('.bf25-hero__gift-box'),
      checkpoints: this.container.querySelectorAll('.bf25-hero__checkpoint'),
      card: this.container.querySelector('.bf25-hero__card'),
      tierBadgeText: this.container.querySelector('.bf25-hero__tier-badge-text'),
      discountLabel: this.container.querySelector('.bf25-hero__discount-label'),
      pricingTotal: this.container.querySelector('[data-price-type="total"]'),
      pricingSavings: this.container.querySelector('[data-price-type="savings"]'),
      pricingPerItem: this.container.querySelector('[data-price-type="per-item"]'),
      unlocksPreview: this.container.querySelector('.bf25-hero__unlocks-current'),
      unlocksText: this.container.querySelector('.bf25-hero__unlocks-text'),
      giftsHeaderText: this.container.querySelector('.bf25-hero__gifts-header-text'),
      benefitsWrapper: this.container.querySelector('.bf25-hero__benefits-wrapper'),
      benefitsList: this.container.querySelector('.bf25-hero__benefits-list')
    };
  }

  init() {
    this.elements.sliderInput.addEventListener('input', (e) => {
      this.handleSliderInput(parseInt(e.target.value, 10));
    });

    // Focus management (Accessibility)
    this.elements.sliderInput.addEventListener('focus', () => {
      if (this.elements.sliderWrapper) {
        this.elements.sliderWrapper.classList.add('is-focused');
      }
    });

    this.elements.sliderInput.addEventListener('blur', () => {
      if (this.elements.sliderWrapper) {
        this.elements.sliderWrapper.classList.remove('is-focused');
      }
    });

    this.handleSliderInput(0);
  }

  handleSliderInput(value) {
    console.log('🎚️ Slider moved to:', value);
    console.log('📊 Current tier:', this.calculateTier(value));

    // Optimization: Exit if value didn't change
    if (this.currentValue === value) return;

    this.currentValue = value;
    this.currentTier = this.calculateTier(value);

    const tierUnlocked = this.currentTier.id > this.previousTier.id;
    const tierChanged = this.currentTier.id !== this.previousTier.id;

    this.updateVisualization();
    this.updateGiftBoxes();
    this.updateGiftsHeader();
    this.updateCheckpoints();
    this.updateTierCard();

    // Only regenerate benefits list if tier actually changed
    if (tierChanged) {
      this.updateBenefitsList();
    }

    this.updateUnlocksPreview();
    this.updatePricing();
    this.updateARIA();

    if (tierUnlocked && this.currentValue > 0) {
      this.triggerCelebration();
      this.triggerHaptics();
    }

    this.previousTier = this.currentTier;
  }

  calculateTier(value) {
    // Handle max tier correctly (max: 999 in the updated JSON)
    const tier = this.tiers.find(t => value >= t.min && value <= t.max);
    return tier || this.tiers[0];
  }

  updateVisualization() {
    const percentage = (this.currentValue / this.config.max_items) * 100;
    const section = document.getElementById('bf25-hero-section') || this.container;
    section.style.setProperty('--fill-width', `${percentage}%`);
    console.log('📊 Fill width set to:', percentage + '%');
  }

  /**
   * Update gift box unlock states. Icon switching is handled by CSS.
   */
  updateGiftBoxes() {
    this.elements.giftBoxes.forEach((box, index) => {
      const gift = this.gifts[index];
      if (!gift) return;

      const isUnlocked = this.currentTier.id >= gift.tier;
      const wasLocked = !box.classList.contains('is-unlocked');

      if (isUnlocked) {
        box.classList.add('is-unlocked');
        // Trigger unlock animation on first unlock
        if (wasLocked && this.currentTier.id === gift.tier) {
          this.triggerGiftUnlockAnimation(box);
        }
      } else {
        box.classList.remove('is-unlocked');
      }
    });
  }

  // NEW: Update the Gift Header
  updateGiftsHeader() {
    if (!this.elements.giftsHeaderText) return;

    if (this.currentTier.id === 0) {
      this.elements.giftsHeaderText.textContent = "Slide to unlock Discounts + Free Gifts";
      return;
    }

    const discount = this.currentTier.display_label;
    const unlockedCount = this.gifts.filter(g => g.tier <= this.currentTier.id).length;
    const giftText = unlockedCount === 1 ? "Free Gift" : "Free Gifts";

    this.elements.giftsHeaderText.textContent = `${discount} + ${unlockedCount} ${giftText} Unlocked!`;
  }

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

  updateTierCard() {
    this.elements.card.dataset.activeTier = this.currentTier.id;
    const section = document.getElementById('bf25-hero-section') || this.container;

    // Determine tier display color (with gold/platinum for higher tiers)
    let displayColor = this.currentTier.color;
    let glowColor = 'rgba(96, 198, 85, 0.3)'; // Default lime green glow

    // Special colors for high tiers
    if (this.currentTier.id === 3) {
      // Tier 3 (Best Deal): Gold accent
      displayColor = '#FFD700'; // Gold
      glowColor = 'rgba(255, 215, 0, 0.4)';
    } else if (this.currentTier.id === 4) {
      // Tier 4 (Bigfoot): Platinum/blue-white
      displayColor = '#E5E4E2'; // Platinum
      glowColor = 'rgba(229, 228, 226, 0.5)';
    }

    section.style.setProperty('--color-tier-current', displayColor);
    section.style.setProperty('--tier-glow-color', glowColor);

    console.log('✅ Updated tier colors:', displayColor, glowColor);

    if (this.elements.tierBadgeText) {
      // Badge text is clean (no emojis in the updated JSON)
      this.elements.tierBadgeText.textContent = this.currentTier.badge;
    }

    if (this.elements.discountLabel) {
      this.elements.discountLabel.textContent = this.currentTier.display_label;
    }
  }

  // NEW: Update the Stacking Benefits List
  updateBenefitsList() {
    if (!this.elements.benefitsList || !this.elements.benefitsWrapper) return;

    // Clear existing list
    this.elements.benefitsList.innerHTML = '';

    if (this.currentTier.id === 0) {
      // Hide the wrapper when Tier 0 (smooth collapse via CSS Grid)
      this.elements.benefitsWrapper.classList.remove('is-active');
      return;
    }

    // Show the wrapper (smooth expand via CSS Grid)
    this.elements.benefitsWrapper.classList.add('is-active');

    // 1. Add the Discount benefit (using data from JSON)
    if (this.currentTier.discount_benefit_text) {
      const discountItem = this.createBenefitItem(this.currentTier.discount_benefit_text);
      this.elements.benefitsList.appendChild(discountItem);
    }

    // 2. Add the cumulative Gift benefits (using data from JSON)
    const unlockedGifts = this.gifts.filter(g => g.tier <= this.currentTier.id);
    unlockedGifts.forEach((gift, index) => {
      if (gift.benefit_text) {
        const giftItem = this.createBenefitItem(gift.benefit_text);
        // Staggered animation delay for entrance
        giftItem.style.animationDelay = `${(index + 1) * 50}ms`;
        this.elements.benefitsList.appendChild(giftItem);
      }
    });
  }

  // NEW Helper: Create a benefit list item DOM element
  createBenefitItem(text) {
    const item = document.createElement('div');
    item.className = 'bf25-hero__benefit-item';

    // Icon (using the new SVG sprite check)
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.classList.add('bf25-hero__benefit-icon');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-benefit-check');
    icon.appendChild(use);

    // Text
    const textSpan = document.createElement('span');
    textSpan.className = 'bf25-hero__benefit-text';
    textSpan.textContent = text;

    item.appendChild(icon);
    item.appendChild(textSpan);

    return item;
  }

  updateUnlocksPreview() {
    if (!this.elements.unlocksPreview || !this.elements.unlocksText) return;

    let message = '';
    let status = 'locked';

    if (this.currentValue === 0) {
      message = 'Slide to unlock gifts + discounts';
      status = 'locked';
    } else if (this.currentValue < 4) {
      message = `Unlock ${this.gifts[0].name} at 4 items`;
      status = 'locked';
    } else if (this.currentValue >= 4 && this.currentValue < 8) {
      message = `✓ ${this.gifts[0].name} unlocked! Reach 8 for ${this.gifts[1].name}`;
      status = 'unlocking';
    } else if (this.currentValue >= 8 && this.currentValue < 12) {
      message = `✓ ${this.gifts[0].name} + ${this.gifts[1].name}! Reach 12 for ${this.gifts[2].name}`;
      status = 'unlocking';
    } else if (this.currentValue >= 12 && this.currentValue < 16) {
      message = `✓ 3 gifts unlocked! Reach 16 for ${this.gifts[3].name}`;
      status = 'unlocking';
    } else if (this.currentValue >= 16) {
      message = `🎉 All 4 premium gifts unlocked! (€275+ value)`;
      status = 'unlocking';
    }

    this.elements.unlocksText.textContent = message;
    this.elements.unlocksPreview.setAttribute('data-unlock-status', status);
  }

  updatePricing() {
    if (this.currentValue === 0) {
        this.setPricingText('—', '—', '—');
        return;
    }

    const avgShopifyPrice = Number(this.config.avg_price_shopify) || 0;
    const avgRetailPrice = Number(this.config.avg_price_retail) || 0;

    const estimatedTotal = this.currentValue * avgShopifyPrice * this.currentTier.multiplier;
    const perItemPrice = estimatedTotal / this.currentValue;

    const retailTotal = this.currentValue * avgRetailPrice;

    // Calculate gift value safely
    const giftValue = this.gifts.reduce((sum, gift) => {
        const value = typeof gift.value === 'number' ? gift.value : 0;
        return this.currentTier.id >= gift.tier ? sum + value : sum;
    }, 0);

    const totalSavings = (retailTotal - estimatedTotal) + giftValue;

    this.setPricingText(
      this.formatPrice(estimatedTotal),
      this.formatPrice(totalSavings),
      this.formatPrice(perItemPrice)
    );
  }

  setPricingText(total, savings, perItem) {
    if (this.elements.pricingTotal) this.elements.pricingTotal.textContent = total;
    if (this.elements.pricingSavings) this.elements.pricingSavings.textContent = savings;
    if (this.elements.pricingPerItem) this.elements.pricingPerItem.textContent = perItem;
  }

  formatPrice(amount) {
    // Ensure amount is a number before calling toFixed
    const numericAmount = typeof amount === 'number' ? amount : 0;
    return `${this.config.currency_symbol}${numericAmount.toFixed(2)}`;
  }

  updateARIA() {
    if (!this.elements.sliderInput) return;

    if (this.currentValue === 0) {
        this.elements.sliderInput.setAttribute('aria-valuenow', 0);
        this.elements.sliderInput.setAttribute('aria-valuetext', '0 items selected. Slide to explore savings.');
        return;
    }

    // Badge text is clean (no emojis in the updated JSON)
    const cleanBadge = this.currentTier.badge;

    const unlockedGifts = this.gifts.filter(g => g.tier <= this.currentTier.id);
    const giftNames = unlockedGifts.map(g => g.name).join(', ');

    // Recalculate savings for ARIA (must match updatePricing)
    const retailTotal = this.currentValue * this.config.avg_price_retail;
    const estimatedTotal = this.currentValue * this.config.avg_price_shopify * this.currentTier.multiplier;
    const giftValue = unlockedGifts.reduce((sum, g) => sum + (typeof g.value === 'number' ? g.value : 0), 0);
    const totalSavings = (retailTotal - estimatedTotal) + giftValue;

    let announcement = `${this.currentValue} items selected. Tier ${this.currentTier.id}: ${cleanBadge}, ${this.currentTier.display_label}. `;
    if (unlockedGifts.length > 0) {
        announcement += `${unlockedGifts.length} free gift${unlockedGifts.length > 1 ? 's' : ''} unlocked: ${giftNames}. `;
    }
    announcement += `Estimated savings ${this.config.currency_symbol}${totalSavings.toFixed(2)}.`;

    this.elements.sliderInput.setAttribute('aria-valuenow', this.currentValue);
    this.elements.sliderInput.setAttribute('aria-valuetext', announcement);
  }

  /* CELEBRATION & ANIMATION METHODS */

  triggerCelebration() {
    const checkpoint = Array.from(this.elements.checkpoints).find(
      cp => parseInt(cp.dataset.tier, 10) === this.currentTier.id
    );
    if (checkpoint) this.triggerAnimation(checkpoint, 'animate-celebration');
  }

  triggerGiftUnlockAnimation(giftBox) {
    if (giftBox) this.triggerAnimation(giftBox, 'animate-unlock');
  }

  // Helper function to manage animation classes efficiently
  triggerAnimation(element, className) {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth; // Force reflow
    element.classList.add(className);
    element.addEventListener('animationend', () => {
        element.classList.remove(className);
    }, { once: true });
  }

  triggerHaptics() {
    if (navigator.vibrate) {
      // Define vibration patterns: [vibrate_ms, pause_ms, vibrate_ms, ...]
      let pattern;
      switch (this.currentTier.id) {
        case 1:
          pattern = [50]; // Light tick (T1)
          break;
        case 2:
          pattern = [50, 30, 50]; // Double tick (T2)
          break;
        case 3:
          pattern = [100]; // Stronger buzz (T3)
          break;
        case 4:
          pattern = [100, 50, 150]; // Strong celebration (T4 Bigfoot)
          break;
        default:
          return; // No vibration for T0
      }
      navigator.vibrate(pattern);
    }
  }
}

/* AUTO-INITIALIZATION */
function initPowerSlider() {
  const heroElement = document.getElementById('bf25-hero-section');
  if (heroElement) {
    window.bf25PowerSlider = new PowerSlider(heroElement);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPowerSlider);
} else {
  initPowerSlider();
}
