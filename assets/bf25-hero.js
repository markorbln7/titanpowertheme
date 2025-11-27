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

    // Define Energy Flow gradients for each tier
    this.gradientMap = this.defineGradients();

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

  // Define the "Energy Flow" gradients for each tier
  defineGradients() {
    // Green (Tiers 1, 2) - User provided gradient
    const green = 'linear-gradient(90deg, #4CAF50 0%, #60c655 20%, #7FFF00 40%, #39FF14 50%, #7FFF00 60%, #60c655 80%, #4CAF50 100%)';

    // Gold (Tier 3) - Sophisticated gold energy flow
    const gold = 'linear-gradient(90deg, #DAA520 0%, #FFD700 20%, #FFEE58 40%, #FFFFE0 50%, #FFEE58 60%, #FFD700 80%, #DAA520 100%)';

    // Platinum/Ice Blue (Tier 4) - Premium frozen energy
    const platinum = 'linear-gradient(90deg, #B0E0E6 0%, #E0F7FF 20%, #FFFFFF 40%, #F0FFFF 50%, #FFFFFF 60%, #E0F7FF 80%, #B0E0E6 100%)';

    // Gray (Tier 0)
    const gray = 'linear-gradient(90deg, #6b7280 0%, #a1a1aa 50%, #6b7280 100%)';

    // Map Tiers to Styles
    return {
      0: { gradient: gray, glow: 'rgba(107, 114, 128, 0.3)', color: '#6b7280' },
      1: { gradient: green, glow: 'rgba(96, 198, 85, 0.5)', color: '#60c655' },
      2: { gradient: green, glow: 'rgba(127, 255, 0, 0.6)', color: '#60c655' },
      3: { gradient: gold, glow: 'rgba(255, 215, 0, 0.7)', color: '#FFD700' },
      4: { gradient: platinum, glow: 'rgba(224, 247, 255, 0.8)', color: '#E0F7FF' }
    };
  }

  cacheDOM() {
    return {
      sliderInput: this.container.querySelector('.bf25-hero__input'),
      sliderWrapper: this.container.querySelector('.bf25-hero__slider-wrapper'),
      giftBoxes: this.container.querySelectorAll('.bf25-hero__gift-box'),
      checkpoints: this.container.querySelectorAll('.bf25-hero__checkpoint'),
      discountLabels: this.container.querySelectorAll('.bf25-hero__discount-label-item'),
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

    // Hide drag indicator on first touch/click
    const dragIndicator = document.getElementById('bf25-drag-indicator');
    if (dragIndicator) {
      this.elements.sliderInput.addEventListener('pointerdown', () => {
        dragIndicator.classList.add('is-hidden');
      }, { once: true });
    }

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

    // Hide drag indicator after first interaction
    const dragIndicator = document.getElementById('bf25-drag-indicator');
    if (dragIndicator && value > 0) {
      dragIndicator.classList.add('is-hidden');
    }

    // Optimization: Exit if value didn't change
    if (this.currentValue === value) return;

    this.currentValue = value;
    this.currentTier = this.calculateTier(value);

    // Add tier to slider wrapper for styling
    if (this.elements.sliderWrapper) {
      this.elements.sliderWrapper.dataset.activeTier = this.currentTier.id;
    }

    const tierUnlocked = this.currentTier.id > this.previousTier.id;
    const tierChanged = this.currentTier.id !== this.previousTier.id;

    this.updateVisualization();
    this.updateGiftBoxes();
    this.updateGiftsHeader();
    this.updateCheckpoints();
    this.updateDiscountLabels();
    this.updateTierCard();

    // Only regenerate benefits list if tier actually changed
    if (tierChanged) {
      this.updateBenefitsList();
    }
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
    const section = document.getElementById('bf25-hero-section') || this.container;

    // Determine tier color and glow
    let color, glow, glowColor;

    switch(this.currentTier.id) {
      case 0:
        color = '#6b7280'; // Gray
        glow = 'rgba(107, 114, 128, 0.3)';
        glowColor = '#a1a1aa'; // Lighter gray for animation
        break;
      case 1:
        color = '#60c655'; // Green
        glow = 'rgba(96, 198, 85, 0.5)';
        glowColor = '#7FFF00'; // Brighter green
        break;
      case 2:
        color = '#60c655'; // Brighter green
        glow = 'rgba(127, 255, 0, 0.6)';
        glowColor = '#39FF14'; // Neon green
        break;
      case 3:
        color = '#FFD700'; // Gold
        glow = 'rgba(255, 215, 0, 0.7)';
        glowColor = '#FFF700'; // Bright gold
        break;
      case 4:
        color = '#E0F7FF'; // Platinum/Ice Blue
        glow = 'rgba(224, 247, 255, 0.8)';
        glowColor = '#FFFFFF'; // Pure white
        break;
      default:
        color = '#6b7280';
        glow = 'rgba(107, 114, 128, 0.3)';
        glowColor = '#a1a1aa';
    }

    // Set tier colors globally
    section.style.setProperty('--color-tier-current', color);
    section.style.setProperty('--pb-glow-color', glow);
    section.style.setProperty('--color-tier-glow', glowColor);

    // Fill segments individually (DOM approach)
    const segments = this.container.querySelectorAll('.progress-bar__segment');
    segments.forEach((segment, index) => {
      // Segments are 0-indexed, values are 1-16
      if (index < this.currentValue) {
        segment.classList.add('is-filled');
      } else {
        segment.classList.remove('is-filled');
      }
    });
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

          // Special celebration for mystery box
          if (box.classList.contains('bf25-hero__gift-box--mystery')) {
            this.triggerMysteryBoxCelebration(box);
          }
        }
      } else {
        box.classList.remove('is-unlocked');
      }
    });
  }

  /**
   * Trigger spectacular celebration animation for mystery box unlock
   */
  triggerMysteryBoxCelebration(box) {
    // Add celebration class for one-time animation
    box.classList.add('is-celebrating');

    // Remove celebration class after animation completes
    setTimeout(() => {
      box.classList.remove('is-celebrating');
    }, 1000); // Match unlockCelebration animation duration
  }

  // NEW: Update the Gift Header
  updateGiftsHeader() {
    if (!this.elements.giftsHeaderText) return;

    const unlockedCount = this.gifts.filter(g => this.currentTier.id >= g.tier).length;
    const totalGifts = this.gifts.length;

    // Set data-tier for CSS styling
    this.elements.giftsHeaderText.dataset.tier = this.currentTier.id;

    if (unlockedCount === 0) {
      this.elements.giftsHeaderText.textContent = 'Slide to unlock Discounts + Free Gifts';
    } else if (unlockedCount === totalGifts) {
      // Remove confetti emoji, keep only present
      const totalValue = this.gifts.reduce((sum, g) => sum + g.value, 0);
      this.elements.giftsHeaderText.textContent =
        `🎁 All ${totalGifts} premium gifts unlocked! (€${totalValue.toFixed(0)}+ value)`;
    } else {
      this.elements.giftsHeaderText.textContent =
        `${this.currentTier.display_label} + ${unlockedCount} FREE GIFT${unlockedCount > 1 ? 'S' : ''} UNLOCKED!`;
    }
  }

  updateCheckpoints() {
    this.elements.checkpoints.forEach(checkpoint => {
      const checkpointValue = parseInt(checkpoint.dataset.value, 10);

      // Mark as reached if we've passed this checkpoint
      if (this.currentValue >= checkpointValue) {
        checkpoint.classList.add('is-reached');
      } else {
        checkpoint.classList.remove('is-reached');
      }

      // NEW: Mark current checkpoint as active
      if (this.currentValue === checkpointValue) {
        checkpoint.classList.add('is-active');
      } else {
        checkpoint.classList.remove('is-active');
      }
    });
  }

  // Update Discount Labels (Above bar)
  updateDiscountLabels() {
    this.elements.discountLabels.forEach(label => {
      const labelValue = parseInt(label.dataset.value, 10);
      if (this.currentValue >= labelValue) {
        label.classList.add('is-reached');
      } else {
        label.classList.remove('is-reached');
      }
    });
  }

  updateTierCard() {
    this.elements.card.dataset.activeTier = this.currentTier.id;
    // Note: Colors now handled globally in updateVisualization()

    if (this.elements.tierBadgeText) {
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
      const discountItem = this.createBenefitItem(
        this.currentTier.discount_benefit_text,
        null,
        this.currentTier.id // Pass tier ID
      );
      this.elements.benefitsList.appendChild(discountItem);
    }

    // 2. Add the cumulative Gift benefits (using data from JSON)
    const unlockedGifts = this.gifts.filter(g => g.tier <= this.currentTier.id);
    unlockedGifts.forEach((gift, index) => {
      if (gift.benefit_text) {
        const giftItem = this.createBenefitItem(
          gift.benefit_text,
          gift.special_class,
          gift.tier // Pass tier that unlocked this gift
        );
        // Staggered animation delay for entrance
        giftItem.style.animationDelay = `${(index + 1) * 50}ms`;
        this.elements.benefitsList.appendChild(giftItem);
      }
    });
  }

  // NEW Helper: Create a benefit list item DOM element
  createBenefitItem(text, specialClass = null, unlockTier = null) {
    const item = document.createElement('div');
    item.className = 'bf25-hero__benefit-item';
    if (specialClass) {
      item.classList.add(`bf25-hero__benefit-item--${specialClass}`);
    }
    if (unlockTier !== null) {
      item.dataset.tier = unlockTier; // Track which tier unlocked this
    }

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
    // Celebrate the checkpoint (below bar)
    const checkpoint = Array.from(this.elements.checkpoints).find(
      cp => parseInt(cp.dataset.tier, 10) === this.currentTier.id
    );
    if (checkpoint) this.triggerAnimation(checkpoint, 'animate-celebration');

    // Celebrate the discount label (above bar)
    const discountLabel = Array.from(this.elements.discountLabels).find(
      dl => parseInt(dl.dataset.tier, 10) === this.currentTier.id
    );
    if (discountLabel) this.triggerAnimation(discountLabel, 'animate-celebration');
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

// ═══════════════════════════════════════════════════════════════════════
// V4 SCROLL HINT - Shows after slider interaction
// ═══════════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  const section = document.getElementById('bf25-hero-section');
  if (!section) return;

  const container = section.querySelector('.bf25-hero__container');
  const slider = section.querySelector('.bf25-hero__input');
  if (!container || !slider) return;

  // Create scroll hint element
  const hint = document.createElement('div');
  hint.className = 'bf25-hero__scroll-hint';
  hint.innerHTML = `
    <p class="bf25-hero__scroll-hint__text">Scroll to start building</p>
    <div class="bf25-hero__scroll-hint__arrow">↓</div>
  `;
  container.appendChild(hint);

  // Show hint when slider value > 0
  slider.addEventListener('input', function() {
    if (parseInt(this.value, 10) > 0) {
      hint.classList.add('is-visible');
    } else {
      hint.classList.remove('is-visible');
    }
  });
})();

// ═══════════════════════════════════════════════════════════════════════
// STICKY CART OBSERVER - Shows cart after scrolling past hero section
// ═══════════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  function initStickyCartObserver() {
    // Find the hero section to observe
    const heroSection = document.querySelector('.bf25-hero-split, .bf25-hero');
    const stickyCart = document.querySelector('.bf25-sticky-cart');

    if (!heroSection || !stickyCart) {
      console.log('Sticky cart observer: Missing hero section or sticky cart');
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When hero section is completely out of view (scrolled past)
        if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
          document.body.classList.add('show-sticky-cart');
        } else {
          document.body.classList.remove('show-sticky-cart');
        }
      });
    }, {
      // Small negative margin to trigger slightly before hero is completely out of view
      rootMargin: '-100px 0px 0px 0px',
      threshold: 0
    });

    // Start observing the hero section
    observer.observe(heroSection);

    console.log('Sticky cart observer initialized');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyCartObserver);
  } else {
    initStickyCartObserver();
  }
})();
