/* eslint-disable */
import './section-collections-with-nav.css';

document.addEventListener('DOMContentLoaded', function () {
  const parentSection = document.querySelector('.section-collections-with-nav');

  const collectionLinks = parentSection.querySelectorAll('.collection-link');

  collectionLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      collectionLinks.forEach(link => {
        link.closest('li').classList.remove('active');
      });

      this.closest('li').classList.add('active');

      const targetSection = parentSection.querySelector(`${this.getAttribute('href')}`);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Quantity control logic
  const quantityInputs = parentSection.querySelectorAll('.quantity__input');
  const quantityMinusButtons = parentSection.querySelectorAll('.quantity__button[name="minus"]');
  const quantityPlusButtons = parentSection.querySelectorAll('.quantity__button[name="plus"]');

  quantityMinusButtons.forEach((minusButton, index) => {
    minusButton.addEventListener('click', () => {
      const input = quantityInputs[index];
      let quantity = parseInt(input.value);
      if (quantity > 1) {
        const addToCartButton = minusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');
        addToCartButton.setAttribute('data-quantity', input.value);
      }
    });
  });

  quantityPlusButtons.forEach((plusButton, index) => {
    plusButton.addEventListener('click', () => {
      const input = quantityInputs[index];
      let quantity = parseInt(input.value);
      const addToCartButton = plusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');
      addToCartButton.setAttribute('data-quantity', input.value);
    });
  });


  // Variant selector
  document.querySelectorAll('.section-collections-with-nav__product').forEach(productElement => {
    const productId = productElement.getAttribute('data-product-id');
    const selectors = productElement.querySelectorAll('.variant-selectors select');
    const addToCartButton = productElement.querySelector('.js-atc');

    function getVariantId(selectedOptions) {
      const productVariants = window.productVariants[productId];
      const variant = productVariants.find(variant =>
        variant.options.every((option, index) => option === selectedOptions[index])
      );
      return variant ? variant.id : '';
    }

    function updateAddToCartButton() {
      let selectedOptions = [];
      selectors.forEach(selector => {
        selectedOptions.push(selector.value);
      });

      const variantId = getVariantId(selectedOptions);

      addToCartButton.setAttribute('data-product-id', variantId);
    }

    selectors.forEach(selector => {
      selector.addEventListener('change', updateAddToCartButton);
    });

    updateAddToCartButton();
  });

  // Add to cart logic
  const addToCartButtons = parentSection.querySelectorAll('.js-atc');

  addToCartButtons.forEach((addToCartButton) => {
    addToCartButton.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-product-id');
      const quantity = e.target.getAttribute('data-quantity');

      const formData = {
        items: [
          {
            id: productId,
            quantity: quantity,
          },
        ],
      };

      fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log('Product added to cart successfully');
          }
          return response.json();
        })
        .catch((error) => {
          console.error('Error adding to cart:', error);
        });
    });
  });
});
