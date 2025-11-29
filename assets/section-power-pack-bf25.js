/**
 * Power Pack Section - BF25
 * Carousel and interaction logic for bestseller products
 * Inherits modal functionality from bundle builder
 */

const POWER_PACK_CONFIG = {
  sectionSelector: '.power-pack-section',
  cardSelector: '.power-pack-card',
  // Configuration for Power Pack specific features
};

document.addEventListener('DOMContentLoaded', function () {
  // Support both original and Power Pack sections
  const bundleSection = document.querySelector('.power-pack-section, .section-collections-with-nav.dark-mode[data-section="bf25"]');

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

/* ============================================
   POWER PACK COVERFLOW ENGINE
   Prefix: ppc- (avoids conflict with Power Pairs pp-)
   ============================================ */

(function() {
  'use strict';

  const section = document.querySelector('.power-pack-section');
  if (!section) return;

  const track = section.querySelector('.ppc-coverflow-track');
  if (!track) return;

  const CONFIG = {
    translateX: 170,
    translateZ: 100,
    rotateY: -50,
    scaleActive: 1.1,
    scaleInactive: 0.8,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const cards = section.querySelectorAll('.ppc-card-wrapper');
  const dots = section.querySelectorAll('.ppc-dot');
  const prevBtn = section.querySelector('.js-ppc-nav-prev');
  const nextBtn = section.querySelector('.js-ppc-nav-next');

  if (cards.length === 0) return;

  // Start centered instead of at index 0 or 2
  let state = {
    activeIndex: Math.floor(cards.length / 2), // Start centered
    totalCards: cards.length,
    isAnimating: false,
    isDragging: false,
    startX: 0,
    currentX: 0,
    hasMoved: false  // Track if actual drag movement occurred
  };

  function updatePositions() {
    const totalCards = state.totalCards;

    cards.forEach((card, index) => {
      // Calculate shortest distance for infinite loop visual
      let diff = index - state.activeIndex;

      // Wrap-around calculation for infinite loop
      if (diff > totalCards / 2) {
        diff -= totalCards;
      } else if (diff < -totalCards / 2) {
        diff += totalCards;
      }

      const isActive = index === state.activeIndex;

      const translateX = diff * CONFIG.translateX;
      const translateZ = isActive ? CONFIG.translateZ : -CONFIG.translateZ;
      const rotateY = diff * CONFIG.rotateY;
      const scale = isActive ? CONFIG.scaleActive : CONFIG.scaleInactive;

      let opacity = Math.abs(diff) > 2 ? 0 : 1 - (Math.abs(diff) * 0.2);
      let brightness = isActive ? 1 : 0.7;
      const zIndex = isActive ? 10 : 10 - Math.abs(diff);

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = `brightness(${brightness})`;
      card.style.zIndex = zIndex;
      card.style.transition = CONFIG.transition;

      card.classList.toggle('active', isActive);

      if (!isActive) {
        const flipCard = card.querySelector('.ppc-flip-card');
        if (flipCard) flipCard.classList.remove('flipped');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === state.activeIndex);
    });
  }

  function goTo(index) {
    if (state.isAnimating) return;

    // Infinite loop - wrap around
    if (index < 0) {
      index = state.totalCards - 1;
    } else if (index >= state.totalCards) {
      index = 0;
    }

    state.isAnimating = true;
    state.activeIndex = index;
    updatePositions();

    setTimeout(() => {
      state.isAnimating = false;
    }, 500);
  }

  function navigate(direction) {
    goTo(state.activeIndex + direction);
  }


  // Arrow navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(1);
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(index);
    });
  });

  // Improved card click handler
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // If this card is flipped, block all navigation
      const flipCard = card.querySelector('.ppc-flip-card');
      if (flipCard && flipCard.classList.contains('flipped')) {
        return;
      }

      // Don't navigate if clicking on interactive elements
      if (e.target.closest('.ppc-card-back') ||
          e.target.closest('.ppc-pack-btn') ||
          e.target.closest('.ppc-variant-dropdown') ||
          e.target.closest('select') ||
          e.target.closest('button') ||
          e.target.closest('.ppc-info-icon') ||
          e.target.closest('.bf25-product-info-icon') ||
          e.target.closest('.js-ppc-flip-trigger') ||
          e.target.closest('.ppc-flip-cta')) {
        return;
      }

      // Don't navigate if clicking on the active card (front side)
      if (index === state.activeIndex) {
        return;
      }

      // Navigate to clicked card
      goTo(index);
    });
  });

  // Touch support
  track.addEventListener('touchstart', (e) => {
    state.isDragging = true;
    state.startX = e.touches[0].clientX;
    state.currentX = e.touches[0].clientX; // Initialize
    state.hasMoved = false;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (state.isDragging) {
      state.currentX = e.touches[0].clientX;
      if (Math.abs(state.startX - state.currentX) > 10) {
        state.hasMoved = true;
      }
    }
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!state.isDragging) return;
    state.isDragging = false;

    // Only navigate if there was actual swipe movement
    if (state.hasMoved) {
      const diff = state.startX - state.currentX;
      if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? 1 : -1);
      }
    }

    state.hasMoved = false;
  });

  // Mouse drag
  track.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.startX = e.clientX;
    state.currentX = e.clientX; // Initialize to same position - no movement yet
    state.hasMoved = false; // Track if actual movement occurred
    track.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (state.isDragging) {
      state.currentX = e.clientX;
      // Only count as moved if we've dragged more than 10px
      if (Math.abs(state.startX - state.currentX) > 10) {
        state.hasMoved = true;
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    track.style.cursor = 'grab';

    // Only navigate if there was actual dragging movement
    if (state.hasMoved) {
      const diff = state.startX - state.currentX;
      if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? 1 : -1);
      }
    }

    // Reset movement flag
    state.hasMoved = false;
  });

  // Keyboard
  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Initialize positions
  updatePositions();
  track.style.cursor = 'grab';

  /* ============================================
     CARD FLIP & PACK SELECTION
     ============================================ */

  const selectedPacks = new Map();

  // Flip triggers (ADD PACKS button)
  section.querySelectorAll('.js-ppc-flip-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.ppc-card-wrapper');
      if (!card.classList.contains('active')) return;
      const flipCard = card.querySelector('.ppc-flip-card');
      if (flipCard) flipCard.classList.add('flipped');
    });

    // iOS Safari fix - add touch support
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.click(); // Trigger the existing click handler
    }, { passive: false });
  });

  // Back buttons
  section.querySelectorAll('.js-ppc-flip-back').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const flipCard = btn.closest('.ppc-flip-card');
      if (flipCard) flipCard.classList.remove('flipped');
    });
  });

  // Info icon - open modal using bf25Expansion
  section.querySelectorAll('.bf25-product-info-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const card = btn.closest('.ppc-card-wrapper');
      const productId = btn.dataset.productId || card?.dataset.productId;

      if (!productId) {
        console.error('[PPC] No product ID found for info icon');
        return;
      }

      // Use the BF25 Expansion modal system
      if (window.bf25Expansion && window.bf25Expansion.handleCardClick) {
        console.log('[PPC] Opening modal via bf25Expansion for product:', productId);
        // Pass the card element or create a dummy one with product ID
        const modalCard = card || btn.closest('[data-product-id]') || btn;
        modalCard.dataset.productId = productId; // Ensure it has the ID
        window.bf25Expansion.handleCardClick(modalCard);
      } else {
        console.warn('[PPC] bf25Expansion not found, modal cannot open');
      }
    });
  });

  // Pack selection
  section.querySelectorAll('.js-ppc-pack-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const grid = btn.closest('.ppc-pack-grid');
      const card = btn.closest('.ppc-card-wrapper');
      const productId = card.dataset.productId;
      const quantity = parseInt(btn.dataset.quantity);

      grid.querySelectorAll('.ppc-pack-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      selectedPacks.set(productId, { quantity, variantId: card.dataset.variantId });

      const addBtn = card.querySelector('.ppc-add-to-bundle');
      if (addBtn) addBtn.disabled = false;
    });
  });

  // Variant selection
  section.querySelectorAll('.js-ppc-variant-select').forEach(select => {
    select.addEventListener('change', (e) => {
      e.stopPropagation();
      const card = select.closest('.ppc-card-wrapper');
      const productId = card.dataset.productId;

      // Get all selected options
      const selects = card.querySelectorAll('.js-ppc-variant-select');
      const selectedOptions = Array.from(selects).map(s => s.value);

      // Find matching variant from window.productVariants if available
      if (window.productVariants && window.productVariants[productId]) {
        const variants = window.productVariants[productId];
        const match = variants.find(v =>
          selectedOptions.every((opt, i) => v.options && v.options[i] === opt)
        );
        if (match) {
          card.dataset.variantId = match.id;
        }
      }
    });
  });

  // Add to bundle
  section.querySelectorAll('.js-ppc-add-to-bundle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      const card = btn.closest('.ppc-card-wrapper');
      const productId = card.dataset.productId;
      const variantId = card.dataset.variantId;
      const productHandle = card.dataset.productHandle;
      const selection = selectedPacks.get(productId);

      if (!selection) {
        console.warn('[PPC] No pack selected');
        return;
      }

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = 'Adding...';

      // Get product title from card
      const titleEl = card.querySelector('.ppc-product-title');
      const productTitle = titleEl ? titleEl.textContent.trim() : 'Product';

      // Get price from card
      const priceEl = card.querySelector('.ppc-price-current');
      const priceText = priceEl ? priceEl.textContent : '0';
      const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')) * 100;

      // Build productData object that BundleManager expects
      const productData = {
        variantId: String(variantId),
        productId: String(productId),
        title: productTitle,
        handle: productHandle,
        price: price,
        compareAtPrice: price * 2, // Approximate
        image: card.querySelector('.ppc-product-image img')?.src || '',
        vendor: 'Titan Power Plus'
      };

      console.log('[PPC] Adding to bundle:', productData, 'qty:', selection.quantity);

      // Try BundleManager first
      if (window.BF25BundleManager && typeof window.BF25BundleManager.addItem === 'function') {
        try {
          const result = window.BF25BundleManager.addItem(productData, selection.quantity);

          if (result && result.success !== false) {
            btn.textContent = '✓ Added!';
            console.log('[PPC] Successfully added to bundle');

            setTimeout(() => {
              btn.textContent = originalText;
              btn.disabled = false;
              // Reset selection
              card.querySelectorAll('.ppc-pack-btn').forEach(b => b.classList.remove('selected'));
              selectedPacks.delete(productId);
              // Flip back
              const flipCard = card.querySelector('.ppc-flip-card');
              if (flipCard) flipCard.classList.remove('flipped');
            }, 1500);
          } else {
            throw new Error(result?.message || 'Add failed');
          }
        } catch (err) {
          console.error('[PPC] BundleManager error:', err);
          // Fallback to cart
          addToCartFallback(variantId, selection.quantity, btn, card, originalText, productId);
        }
      } else {
        // Fallback to direct cart add
        addToCartFallback(variantId, selection.quantity, btn, card, originalText, productId);
      }
    });
  });

  // Fallback function for direct cart add
  function addToCartFallback(variantId, quantity, btn, card, originalText, productId) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: parseInt(variantId),
        quantity: quantity
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Cart add failed');
      return res.json();
    })
    .then(() => {
      btn.textContent = '✓ Added!';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        card.querySelectorAll('.ppc-pack-btn').forEach(b => b.classList.remove('selected'));
        selectedPacks.delete(productId);
        const flipCard = card.querySelector('.ppc-flip-card');
        if (flipCard) flipCard.classList.remove('flipped');
      }, 1500);
    })
    .catch((err) => {
      console.error('[PPC] Cart add failed:', err);
      btn.textContent = 'Error - Retry';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    });
  }


  console.log('PPC Coverflow initialized:', { cards: cards.length, activeIndex: state.activeIndex });

  // ============================================
  // POPULATE REVIEWS & STOCK FROM BF25 DATA
  // ============================================

  // Function to populate reviews from window.PRODUCT_REVIEWS
  function populateReviews() {
    if (!window.PRODUCT_REVIEWS) {
      console.warn('[PPC] window.PRODUCT_REVIEWS not found, retrying...');
      setTimeout(populateReviews, 500);
      return;
    }

    section.querySelectorAll('.ppc-card-wrapper').forEach((card, index) => {
      const productId = card.dataset.productId;
      if (!productId) return;

      // Get review data from PRODUCT_REVIEWS
      const reviewData = window.PRODUCT_REVIEWS[productId];
      const ratingCount = card.querySelector('.bf25-rating-count');

      if (ratingCount && reviewData) {
        const totalReviews = reviewData.totalReviews || 0;
        ratingCount.textContent = `${totalReviews.toLocaleString()} reviews`;
        console.log(`[PPC] Product ${productId}: ${totalReviews} reviews`);
      } else if (ratingCount) {
        // Fallback - if no data, show stars only
        ratingCount.textContent = '';
      }
    });
  }

  // Function to populate stock from BF25 stock system
  function populateStock() {
    // Import or get stock function from bf25 system
    if (window.bf25Utils && window.bf25Utils.getStock) {
      section.querySelectorAll('.bf25-stock-placeholder').forEach(placeholder => {
        const cardId = placeholder.dataset.cardId;
        const stock = window.bf25Utils.getStock(cardId);

        if (stock) {
          const { quantity, className } = stock;
          placeholder.innerHTML = `<span class="bf25-stock-dot ${className}"></span><span>${quantity} left</span>`;
          placeholder.classList.add(className);
        }
      });
    } else {
      // Fallback fake stock (temporary for testing) - all above 30
      section.querySelectorAll('.bf25-stock-placeholder').forEach(placeholder => {
        const randomStock = Math.floor(Math.random() * 64) + 31; // 31-94
        const stockClass = randomStock <= 50 ? 'stock-medium' : 'stock-high';
        placeholder.innerHTML = `<span class="bf25-stock-dot ${stockClass}"></span><span>${randomStock} left</span>`;
        placeholder.classList.add(stockClass);
      });
    }
  }

  // Populate data after a short delay
  setTimeout(() => {
    populateReviews();
    populateStock();
  }, 100);

  // Re-populate if data arrives late
  window.addEventListener('bf25DataLoaded', () => {
    populateReviews();
    populateStock();
  });

})();

// Initialize Power Pack on DOM load (backup)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Any additional initialization if needed
  });
}
/* ============================================
   iOS Fix: Re-attach flip handlers after delay
   Catches elements that load late on iOS Safari
   ============================================ */
(function iosFlipFix() {
  function attachFlipHandlers() {
    document.querySelectorAll('.js-ppc-flip-trigger').forEach(btn => {
      // Remove existing to prevent duplicates
      btn.removeEventListener('click', btn._flipHandler);
      btn.removeEventListener('touchend', btn._touchHandler);
      
      btn._flipHandler = function(e) {
        e.preventDefault();
        const card = this.closest('.ppc-flip-card');
        if (card) card.classList.add('flipped');
      };
      
      btn._touchHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.click();
      };
      
      btn.addEventListener('click', btn._flipHandler);
      btn.addEventListener('touchend', btn._touchHandler, { passive: false });
    });
  }
  
  // Run after various delays to catch late-loading elements
  setTimeout(attachFlipHandlers, 500);
  setTimeout(attachFlipHandlers, 1500);
  setTimeout(attachFlipHandlers, 3000);
})();

/* ============================================
   iOS Event Delegation Fix
   Uses event delegation for reliable touch/click on iOS
   ============================================ */
(function() {
  const section = document.querySelector('.power-pack-section, .ppc-section, [data-section-type="power-pack"]');
  if (!section) return;

  // Delegate click events
  section.addEventListener('click', function(e) {
    const flipTrigger = e.target.closest('.js-ppc-flip-trigger, .ppc-flip-cta');
    if (flipTrigger) {
      e.preventDefault();
      const card = flipTrigger.closest('.ppc-flip-card');
      if (card && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
      }
    }
  }, true);

  // Delegate touch events for iOS
  section.addEventListener('touchend', function(e) {
    const flipTrigger = e.target.closest('.js-ppc-flip-trigger, .ppc-flip-cta');
    if (flipTrigger) {
      e.preventDefault();
      const card = flipTrigger.closest('.ppc-flip-card');
      if (card && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
      }
    }
  }, { passive: false, capture: true });
})();
