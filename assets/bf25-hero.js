/**
 * BF25 Interactive Hero - Premium Redesign
 * Version: 2.0.0
 */

'use strict';

class PowerSlider {
  constructor(containerElement) {
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
      pricingSavings: this.container.querySelector('[data-price-type="savings"]')
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
    this.currentValue = value;
    this.currentTier = this.calculateTier(value);

    const tierUnlocked = this.currentTier.id > this.previousTier.id;

    this.updateVisualization();
    this.updateGiftBoxes();
    this.updateCheckpoints();
    this.updateTierCard();
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
    this.container.style.setProperty('--fill-width', `${percentage}%`);
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
    // Update the color variable (used for the border and badge text)
    this.container.style.setProperty('--color-tier-current', this.currentTier.color);

    if (this.elements.tierBadgeText) {
      // Badge text is clean (no emojis in the updated JSON)
      this.elements.tierBadgeText.textContent = this.currentTier.badge;
    }

    if (this.elements.discountLabel) {
      this.elements.discountLabel.textContent = this.currentTier.display_label;
    }
  }

  updatePricing() {
    if (this.currentValue === 0) {
        this.setPricingText('—', '—');
        return;
    }

    const estimatedTotal = this.currentValue * this.config.avg_price_shopify * this.currentTier.multiplier;
    const retailTotal = this.currentValue * this.config.avg_price_retail;

    // Calculate gift value safely
    const giftValue = this.gifts.reduce((sum, gift) => {
        const value = typeof gift.value === 'number' ? gift.value : 0;
        return this.currentTier.id >= gift.tier ? sum + value : sum;
    }, 0);

    const totalSavings = (retailTotal - estimatedTotal) + giftValue;

    this.setPricingText(this.formatPrice(estimatedTotal), this.formatPrice(totalSavings));
  }

  setPricingText(total, savings) {
    if (this.elements.pricingTotal) this.elements.pricingTotal.textContent = total;
    if (this.elements.pricingSavings) this.elements.pricingSavings.textContent = savings;
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
      navigator.vibrate(50);
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
