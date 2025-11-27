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
    cards.forEach((card, index) => {
      const diff = index - state.activeIndex;
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

  // Info icon - open modal
  section.querySelectorAll('.js-ppc-info-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.dataset.productId;
      // Use existing modal system
      if (window.openProductModal) {
        window.openProductModal(productId);
      } else if (window.bf25OpenModal) {
        window.bf25OpenModal(productId);
      } else {
        // Fallback: trigger existing buy-now button for this product
        const existingBtn = document.querySelector(`.bf25-product-card[data-product-id="${productId}"] .js-section-explore__buy-now`);
        if (existingBtn) existingBtn.click();
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
  // MANUALLY TRIGGER REVIEW/STOCK POPULATION
  // ============================================

  // Wait for DOM and other scripts to initialize
  setTimeout(() => {
    // Find all our cards and trigger the existing population logic
    section.querySelectorAll('.ppc-card-wrapper').forEach(card => {
      const productId = card.dataset.productId;
      if (!productId) return;

      // Check if productData exists in window
      const productData = window.productData?.[productId];

      // Populate reviews
      const ratingCount = card.querySelector('.bf25-rating-count');
      if (ratingCount && productData) {
        const reviews = productData.reviewCount || productData.totalReviews || 0;
        ratingCount.textContent = `${reviews.toLocaleString()} reviews`;
      }

      // Populate stock using the existing stock display logic
      const stockPlaceholder = card.querySelector('.bf25-stock-placeholder');
      if (stockPlaceholder) {
        // Generate random-ish stock number like the other cards do
        const baseStock = Math.floor(Math.random() * 80) + 20; // 20-100
        stockPlaceholder.innerHTML = `<span class="ppc-stock-dot"></span> ${baseStock} left`;

        // Or if we have actual stock data
        if (productData && productData.stockLevel !== undefined) {
          const stock = productData.stockLevel > 100 ? Math.floor(Math.random() * 80) + 20 : productData.stockLevel;
          stockPlaceholder.innerHTML = `${stock} left`;
        }
      }
    });

    console.log('[PPC] Manually populated reviews and stock');
  }, 1000);

})();
