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

  let state = {
    activeIndex: 2,
    totalCards: 0,
    isAnimating: false,
    isDragging: false,
    startX: 0,
    currentX: 0
  };

  const cards = section.querySelectorAll('.ppc-card-wrapper');
  const dots = section.querySelectorAll('.ppc-dot');
  const prevBtn = section.querySelector('.js-ppc-nav-prev');
  const nextBtn = section.querySelector('.js-ppc-nav-next');

  if (cards.length === 0) return;
  state.totalCards = cards.length;

  function updatePositions() {
    const totalCards = state.totalCards;

    cards.forEach((card, index) => {
      // Calculate shortest distance considering wrap-around
      let diff = index - state.activeIndex;

      // Adjust diff for infinite loop visual
      if (diff > totalCards / 2) {
        diff -= totalCards;
      } else if (diff < -totalCards / 2) {
        diff += totalCards;
      }

      const isActive = diff === 0;

      const translateX = diff * CONFIG.translateX;
      const translateZ = isActive ? CONFIG.translateZ : -Math.abs(diff) * 50;
      const rotateY = diff * CONFIG.rotateY;
      const scale = isActive ? CONFIG.scaleActive : CONFIG.scaleInactive;

      // Always show at least 2 cards on each side
      let opacity = Math.abs(diff) > 2 ? 0.3 : 1 - (Math.abs(diff) * 0.15);
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
      index = state.totalCards - 1; // Go to last card
    } else if (index >= state.totalCards) {
      index = 0; // Go to first card
    }

    state.isAnimating = true;
    state.activeIndex = index;
    updatePositions();

    setTimeout(() => { state.isAnimating = false; }, 500);
  }

  function navigate(direction) {
    goTo(state.activeIndex + direction);
  }

  // Arrow navigation
  if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goTo(index));
  });

  // Click adjacent cards to navigate
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking interactive elements
      if (e.target.closest('.js-ppc-flip-trigger') ||
          e.target.closest('.bf25-product-info-icon') ||
          e.target.closest('.ppc-info-icon') ||
          e.target.closest('.ppc-card-back') ||
          e.target.closest('.ppc-flip-cta') ||
          e.target.closest('button') ||
          e.target.closest('select')) {
        return;
      }
      // Only navigate if clicking on non-active card
      if (index !== state.activeIndex) goTo(index);
    });
  });

  // Touch support
  track.addEventListener('touchstart', (e) => {
    state.isDragging = true;
    state.startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (state.isDragging) state.currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    const diff = state.startX - state.currentX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  });

  // Mouse drag
  track.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    state.startX = e.clientX;
    track.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (state.isDragging) state.currentX = e.clientX;
  });

  document.addEventListener('mouseup', () => {
    if (!state.isDragging) return;
    state.isDragging = false;
    track.style.cursor = 'grab';
    const diff = state.startX - state.currentX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
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
        // Fallback: generate realistic review count
        const fallbackReviews = Math.floor(Math.random() * 5000) + 8000; // 8000-13000
        ratingCount.textContent = `${fallbackReviews.toLocaleString()} reviews`;
      }
    });
  }

  // Function to populate stock display (matching bogo-builder.js logic)
  function populateStock() {
    section.querySelectorAll('.ppc-card-wrapper').forEach((card, index) => {
      const stockPlaceholder = card.querySelector('.bf25-stock-placeholder');
      if (!stockPlaceholder) return;

      // Match the stock generation logic from bogo-builder.js
      let stockLevel;
      const random = Math.random();

      if (random < 0.15) {
        // 15% low stock (10-19)
        stockLevel = Math.floor(Math.random() * 10) + 10;
      } else if (random < 0.35) {
        // 20% medium stock (20-50)
        stockLevel = Math.floor(Math.random() * 31) + 20;
      } else {
        // 65% high stock (51-99)
        stockLevel = Math.floor(Math.random() * 49) + 51;
      }

      // Store stock level on card for later updates
      card.dataset.stockLevel = stockLevel;

      // Determine color class
      let colorClass = '';
      let dotHtml = '<span class="ppc-stock-dot"></span> ';

      if (stockLevel <= 15) {
        colorClass = 'stock-low';
        stockPlaceholder.style.color = '#ef4444';
      } else if (stockLevel <= 30) {
        colorClass = 'stock-medium';
        stockPlaceholder.style.color = '#fb923c';
      } else {
        colorClass = 'stock-high';
        stockPlaceholder.style.color = '#60c655';
      }

      stockPlaceholder.className = `ppc-stock-text bf25-stock-placeholder ${colorClass}`;
      stockPlaceholder.innerHTML = `${dotHtml}${stockLevel} left`;
    });

    console.log('[PPC] Stock levels populated');
  }

  // Decrease stock periodically (matching bogo-builder.js behavior)
  function decreaseRandomStock() {
    const cards = section.querySelectorAll('.ppc-card-wrapper');
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    if (randomCard) {
      const currentStock = parseInt(randomCard.dataset.stockLevel) || 50;
      if (currentStock > 5) {
        const decrease = Math.floor(Math.random() * 2) + 1; // 1-2
        const newStock = Math.max(5, currentStock - decrease);
        randomCard.dataset.stockLevel = newStock;

        const stockPlaceholder = randomCard.querySelector('.bf25-stock-placeholder');
        if (stockPlaceholder) {
          // Update color based on new stock level
          let colorClass = '';
          if (newStock <= 15) {
            colorClass = 'stock-low';
            stockPlaceholder.style.color = '#ef4444';
          } else if (newStock <= 30) {
            colorClass = 'stock-medium';
            stockPlaceholder.style.color = '#fb923c';
          } else {
            colorClass = 'stock-high';
            stockPlaceholder.style.color = '#60c655';
          }

          stockPlaceholder.className = `ppc-stock-text bf25-stock-placeholder ${colorClass}`;
          stockPlaceholder.innerHTML = `<span class="ppc-stock-dot"></span> ${newStock} left`;
        }
      }
    }
  }

  // Initialize reviews and stock after a delay
  setTimeout(() => {
    populateReviews();
    populateStock();

    // Start periodic stock decreases (every 30 seconds like bogo-builder)
    setInterval(decreaseRandomStock, 30000);
  }, 500);

})();
