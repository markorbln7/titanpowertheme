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
