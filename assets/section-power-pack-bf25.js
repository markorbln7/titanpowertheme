/**
 * Power Pack Coverflow - BF25
 * Complete refactored version with all integrations
 */
(function() {
  'use strict';

  const section = document.querySelector('.power-pack-section');
  if (!section) return;

  const track = section.querySelector('.ppc-coverflow-track');
  if (!track) return;

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    translateX: 160,
    translateZ: 100,
    rotateY: -45,
    scaleActive: 1.1,
    scaleInactive: 0.8,
    animationLock: 500,
    swipeThreshold: 50
  };

  // ============================================
  // STATE
  // ============================================
  const state = {
    activeIndex: 0,
    totalCards: 0,
    isAnimating: false,
    isDragging: false,
    startX: 0,
    currentX: 0
  };

  const FAKE_STOCK = {};

  // ============================================
  // ELEMENTS
  // ============================================
  const cards = section.querySelectorAll('.ppc-card-wrapper');
  const dots = section.querySelectorAll('.ppc-dot');
  const prevBtn = section.querySelector('.js-ppc-nav-prev');
  const nextBtn = section.querySelector('.js-ppc-nav-next');

  if (cards.length === 0) return;
  state.totalCards = cards.length;

  // Find initial active card
  cards.forEach((card, index) => {
    if (card.classList.contains('active')) {
      state.activeIndex = index;
    }
  });

  // ============================================
  // CORE COVERFLOW LOGIC
  // ============================================
  function updatePositions() {
    const totalCards = state.totalCards;

    cards.forEach((card, index) => {
      // Calculate shortest distance for infinite loop
      let diff = index - state.activeIndex;

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

      // Opacity for infinite loop visual (Issue 15)
      let opacity;
      if (Math.abs(diff) <= 2) {
        opacity = 1 - (Math.abs(diff) * 0.15);
      } else if (Math.abs(diff) <= 4) {
        opacity = 0.3;
      } else {
        opacity = 0;
      }

      const brightness = isActive ? 1 : 0.7;
      const zIndex = isActive ? 10 : 10 - Math.abs(diff);

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = `brightness(${brightness})`;
      card.style.zIndex = zIndex;

      card.classList.toggle('active', isActive);

      // Flip back inactive cards
      if (!isActive) {
        const flipCard = card.querySelector('.ppc-flip-card');
        if (flipCard) flipCard.classList.remove('flipped');
      }
    });

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === state.activeIndex);
    });
  }

  function goTo(index) {
    if (state.isAnimating) return;

    // Infinite loop
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
    }, CONFIG.animationLock);
  }

  function navigate(direction) {
    goTo(state.activeIndex + direction);
  }

  // ============================================
  // NAVIGATION EVENT LISTENERS
  // ============================================
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

  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(index);
    });
  });

  // Card click - navigate to non-active cards only
  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      // If click reaches here (wasn't stopped), check if non-active card
      if (index !== state.activeIndex) {
        goTo(index);
      }
    });
  });

  // ============================================
  // DRAG/SWIPE SUPPORT
  // ============================================
  function handleDragStart(clientX) {
    state.isDragging = true;
    state.startX = clientX;
    state.currentX = clientX;
    if (track) track.style.cursor = 'grabbing';
  }

  function handleDragMove(clientX) {
    if (state.isDragging) state.currentX = clientX;
  }

  function handleDragEnd() {
    if (!state.isDragging) return;
    state.isDragging = false;
    if (track) track.style.cursor = 'grab';

    const diff = state.startX - state.currentX;
    if (Math.abs(diff) > CONFIG.swipeThreshold) {
      navigate(diff > 0 ? 1 : -1);
    }
  }

  if (track) {
    track.style.cursor = 'grab';

    // Touch events
    track.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchmove', (e) => handleDragMove(e.touches[0].clientX), { passive: true });
    track.addEventListener('touchend', handleDragEnd);

    // Mouse events
    track.addEventListener('mousedown', (e) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    });
    track.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
    track.addEventListener('mouseup', handleDragEnd);
    track.addEventListener('mouseleave', handleDragEnd);
  }

  // ============================================
  // FLIP CARD HANDLERS (Issue 1 & 3)
  // ============================================
  function initializeFlipHandlers() {
    section.querySelectorAll('.js-ppc-flip-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        const wrapper = btn.closest('.ppc-card-wrapper');
        if (wrapper && wrapper.classList.contains('active')) {
          const flipCard = wrapper.querySelector('.ppc-flip-card');
          if (flipCard) {
            flipCard.classList.toggle('flipped');
          }
        }
      });
    });
  }

  // ============================================
  // INTERACTION HANDLERS (Issue 3)
  // ============================================
  function initializeInteractionHandlers() {
    // Stop propagation for variant dropdowns
    section.querySelectorAll('.js-ppc-variant-select').forEach(select => {
      select.addEventListener('click', (e) => e.stopPropagation());
      select.addEventListener('mousedown', (e) => e.stopPropagation());
      select.addEventListener('change', (e) => {
        e.stopPropagation();
        // Handle variant change logic here if needed
      });
    });

    // Stop propagation for entire back face
    section.querySelectorAll('.ppc-card-back').forEach(back => {
      back.addEventListener('click', (e) => e.stopPropagation());
    });

    // Pack selection buttons (Issue 16)
    section.querySelectorAll('.js-ppc-pack-select').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();

        const cardWrapper = button.closest('.ppc-card-wrapper');
        if (!cardWrapper) return;

        // Deselect others
        cardWrapper.querySelectorAll('.js-ppc-pack-select').forEach(btn => {
          btn.classList.remove('selected');
        });

        // Select clicked
        button.classList.add('selected');
        cardWrapper.dataset.selectedQuantity = button.dataset.quantity;
      });
    });

    // Set default pack selection
    cards.forEach(card => {
      const defaultBtn = card.querySelector('.js-ppc-pack-select.popular') ||
                         card.querySelector('.js-ppc-pack-select');
      if (defaultBtn) {
        defaultBtn.classList.add('selected');
        card.dataset.selectedQuantity = defaultBtn.dataset.quantity;
      }
    });

    // Add to Bundle button
    section.querySelectorAll('.js-ppc-add-bundle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const wrapper = btn.closest('.ppc-card-wrapper');
        if (!wrapper) return;

        const productId = wrapper.dataset.productId;
        const quantity = parseInt(wrapper.dataset.selectedQuantity) || 4;

        // Get selected variant
        const variantSelect = wrapper.querySelector('.js-ppc-variant-select');
        const variantId = variantSelect ? variantSelect.value : wrapper.dataset.variantId;

        // Add to BundleManager if available
        if (window.BF25BundleManager && typeof window.BF25BundleManager.addItem === 'function') {
          const productData = {
            id: productId,
            variantId: variantId,
            title: wrapper.dataset.productTitle,
            price: parseFloat(wrapper.dataset.productPrice) || 0
          };
          window.BF25BundleManager.addItem(productData, quantity);
        }

        // Visual feedback
        btn.textContent = 'ADDED ✓';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'ADD TO BUNDLE';
          btn.disabled = false;
        }, 2000);
      });
    });
  }

  // ============================================
  // MODAL INTEGRATION (Issue 4)
  // ============================================
  function initializeModalIntegration() {
    section.querySelectorAll('.bf25-product-info-icon, .ppc-info-icon').forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = icon.closest('.bf25-product-card');
        if (card && window.bf25Expansion && typeof window.bf25Expansion.handleCardClick === 'function') {
          window.bf25Expansion.handleCardClick(card);
        } else {
          console.warn('PPC: BF25 Modal system not available');
        }
      });
    });
  }

  // ============================================
  // REVIEW POPULATION (Issue 5)
  // ============================================
  function populateReviews() {
    if (!window.PRODUCT_REVIEWS) {
      console.warn('PPC: PRODUCT_REVIEWS not available');
      return;
    }

    section.querySelectorAll('.bf25-rating-count').forEach(element => {
      const productId = element.getAttribute('data-product-id');
      if (productId && window.PRODUCT_REVIEWS[productId]) {
        const reviewData = window.PRODUCT_REVIEWS[productId];
        const count = reviewData.totalReviews || reviewData.count || 0;
        const formattedCount = count.toLocaleString('en-US');
        element.textContent = `${formattedCount} reviews`;
      } else {
        element.textContent = '★★★★★';
      }
    });
  }

  // ============================================
  // FAKE STOCK SYSTEM (Issue 6)
  // ============================================
  function generateFakeStock(productId) {
    if (FAKE_STOCK[productId]) return FAKE_STOCK[productId];

    const rand = Math.random();
    let stock;

    // Distribution: 15% low (10-19), 20% medium (20-50), 65% high (51-99)
    if (rand < 0.15) {
      stock = Math.floor(Math.random() * 10) + 10;
    } else if (rand < 0.35) {
      stock = Math.floor(Math.random() * 31) + 20;
    } else {
      stock = Math.floor(Math.random() * 49) + 51;
    }

    FAKE_STOCK[productId] = stock;
    return stock;
  }

  function updateStockDisplay(element, stock) {
    let colorClass = 'ppc-stock-high';
    if (stock < 20) colorClass = 'ppc-stock-low';
    else if (stock < 51) colorClass = 'ppc-stock-medium';

    element.innerHTML = `<span class="ppc-stock-dot"></span><span class="ppc-stock-number">${stock} left</span>`;
    element.className = `ppc-stock-line ${colorClass}`;
  }

  function initializeFakeStock() {
    const stockElements = section.querySelectorAll('.ppc-stock-line[data-product-id]');

    stockElements.forEach((element) => {
      const productId = element.getAttribute('data-product-id');
      if (!productId) return;

      const stock = generateFakeStock(productId);
      updateStockDisplay(element, stock);
    });

    // Decrease stock periodically
    setInterval(() => {
      const productIds = Object.keys(FAKE_STOCK);
      if (productIds.length === 0) return;

      const randomId = productIds[Math.floor(Math.random() * productIds.length)];

      if (FAKE_STOCK[randomId] > 10) {
        FAKE_STOCK[randomId] -= Math.floor(Math.random() * 3) + 1;
        if (FAKE_STOCK[randomId] < 10) FAKE_STOCK[randomId] = 10;

        section.querySelectorAll(`.ppc-stock-line[data-product-id="${randomId}"]`).forEach(el => {
          updateStockDisplay(el, FAKE_STOCK[randomId]);
        });
      }
    }, 15000);
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    updatePositions();
    initializeFlipHandlers();
    initializeInteractionHandlers();
    initializeModalIntegration();

    // Delay data population to ensure external scripts loaded
    setTimeout(() => {
      populateReviews();
      initializeFakeStock();
    }, 500);
  }

  // Run on DOM ready or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();