/* eslint-disable */
import './section-explore.css'

document.addEventListener('DOMContentLoaded', function () {
    //Select parent section
    const parentSection = document.querySelectorAll('.section-explore');
    parentSection.forEach(section => {
        // Product cards hover logic
        const productCards = section.querySelectorAll('.section-explore__product');
        const desktopLabel = section.querySelector('.section-explore__collection-label-desktop');
        const travelLabel = section.querySelector('.section-explore__collection-label-travel');

        let activeProduct = null;
        let activeCard = null;

        const initialProduct = section.querySelector('.section-explore__product-content [data-product="for-desktop-1"]');
        if (initialProduct) {
            initialProduct.style.opacity = '1';
            initialProduct.style.transition = 'opacity 0.5s ease';
            desktopLabel.classList.add('active');
            const initialLines = initialProduct.querySelectorAll('.animate-line');
            initialLines.forEach(line => line.classList.add('active-line'));
            activeProduct = initialProduct;

            const firstCard = section.querySelector('.section-explore__product[data-product-hover="for-desktop-1"]');
            if (firstCard) {
                firstCard.classList.add('active');
                activeCard = firstCard;
            }
        }

        productCards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                const productIndex = card.getAttribute('data-product-hover');

                if (productIndex.startsWith('for-desktop')) {
                    desktopLabel.classList.add('active');
                    if (travelLabel) travelLabel.classList.remove('active');
                } else if (productIndex.startsWith('for-travel')) {
                    travelLabel.classList.add('active');
                    desktopLabel.classList.remove('active');
                }

                if (activeProduct) {
                    activeProduct.style.opacity = '0';
                    const activeLines = activeProduct.querySelectorAll('.animate-line');
                    activeLines.forEach(line => line.classList.remove('active-line'));
                }

                const targetContent = section.querySelector(`.section-explore__product-content [data-product="${productIndex}"]`);

                if (targetContent) {
                    targetContent.style.opacity = '1';
                    targetContent.style.transition = 'opacity 0.5s ease';
                    const targetLines = targetContent.querySelectorAll('.animate-line');
                    targetLines.forEach(line => line.classList.add('active-line'));
                    activeProduct = targetContent;
                }

                if (activeCard) {
                    activeCard.classList.remove('active');
                }

                card.classList.add('active');
                activeCard = card;
            });
        });

        // Popup toggle logic
        const buyNowButtons = section.querySelectorAll('.section-explore__buy-now');
        const popups = section.querySelectorAll('.buy-now-popup');

        function openPopup(popup) {
            popup.style.display = 'block';
            popup.classList.add('active');
        }

        function closePopup(popup) {
            popup.style.display = 'none';
            popup.classList.remove('active');
        }

        // Function to update the state of the minus button based on quantity
        function updateQuantityButtonsState(input, minusButton) {
            const quantity = parseInt(input.value);
            if (quantity <= 1) {
                minusButton.setAttribute("disabled", true);
                minusButton.classList.add('disabled');
            } else {
                minusButton.removeAttribute("disabled");
                minusButton.classList.remove('disabled');
            }
        }

        // Reset quantity button event listeners
        function resetQuantityListeners() {
            const quantityMinusButtons = section.querySelectorAll('.buy-now-popup__quantity button[name="minus"]');
            const quantityPlusButtons = section.querySelectorAll('.buy-now-popup__quantity button[name="plus"]');

            quantityMinusButtons.forEach((button) => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            });

            quantityPlusButtons.forEach((button) => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            });
        }

        // Handling Buy Now button clicks
        buyNowButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const popup = popups[index];
                if (popup) {
                    openPopup(popup);
                    resetQuantityListeners();

                    // Add quantity control logic
                    const quantityInputs = popup.querySelectorAll('.buy-now-popup__quantity input[type="number"]');
                    const quantityMinusButtons = popup.querySelectorAll('.buy-now-popup__quantity button[name="minus"]');
                    const quantityPlusButtons = popup.querySelectorAll('.buy-now-popup__quantity button[name="plus"]');

                    quantityInputs.forEach((input, idx) => {
                        const minusButton = quantityMinusButtons[idx];
                        const plusButton = quantityPlusButtons[idx];

                        // Initially check if the minus button should be disabled
                        updateQuantityButtonsState(input, minusButton);

                        minusButton.addEventListener('click', () => {
                            let quantity = parseInt(input.value);
                            if (quantity > 1) {
                                input.value = quantity - 1;
                                const addToCartButton = popup.querySelector('.js-atc');
                                const addToCheckoutButton = popup.querySelector('.js-checkout');
                                addToCartButton.setAttribute("data-quantity", input.value);
                                addToCheckoutButton.setAttribute("data-quantity", input.value);
                            }
                            updateQuantityButtonsState(input, minusButton); // Update button state after quantity change
                        });

                        plusButton.addEventListener('click', () => {
                            let quantity = parseInt(input.value);
                            input.value = quantity + 1;
                            const addToCartButton = popup.querySelector('.js-atc');
                            const addToCheckoutButton = popup.querySelector('.js-checkout');
                            addToCartButton.setAttribute("data-quantity", input.value);
                            addToCheckoutButton.setAttribute("data-quantity", input.value);
                            updateQuantityButtonsState(input, minusButton); // Update button state after quantity change
                        });
                    });

                    // Expand description logic
                    const learnMoreButton = popup.querySelector('.buy-now-popup__expand-desc');
                    const descriptionEl = popup.querySelector('.buy-now-popup__description');
                    const descriptionInner = popup.querySelector('.buy-now-popup__description-inner');

                    if (learnMoreButton) {
                        const clonedLearnMoreButton = learnMoreButton.cloneNode(true);
                        learnMoreButton.parentNode.replaceChild(clonedLearnMoreButton, learnMoreButton);

                        clonedLearnMoreButton.addEventListener('click', () => {
                            const expanded = descriptionEl.classList.contains('expanded');

                            if (expanded) {
                                descriptionEl.classList.remove('expanded');
                                descriptionInner.style.height = '100px';
                                clonedLearnMoreButton.querySelector('span').textContent = 'Learn More';
                                descriptionInner.classList.add('with-gradient');
                            } else {
                                descriptionEl.classList.add('expanded');
                                descriptionInner.style.height = `${descriptionInner.scrollHeight}px`;
                                clonedLearnMoreButton.querySelector('span').textContent = 'Show Less';
                                descriptionInner.classList.remove('with-gradient');
                            }
                        });
                    }

                    // Upsell checkbox toggle logic
                    const upsellBoxes = popup.querySelectorAll('.buy-now-popup__upsell-box');
                    upsellBoxes.forEach((box) => {
                        const checkbox = box.querySelector('input[type="checkbox"]');

                        box.addEventListener('click', () => {
                            checkbox.checked = !checkbox.checked;
                            if (checkbox.checked) {
                                box.classList.add('active');
                            } else {
                                box.classList.remove('active');
                            }
                        });
                    });
                }
            });
        });

        // Add click event listener to close icons
        popups.forEach((popup) => {
            const closeButtons = popup.querySelectorAll('.close-buy-now-popup');
            closeButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    closePopup(popup);
                });
            })
        });

        // Add to cart logic
        let addToCarts = section.querySelectorAll(".js-atc")  // Select all add to cart buttons
        addToCarts.forEach((addToCart) => {
            addToCart.addEventListener("click", (e) => {
                let checkout = false;
                if (addToCart.classList.contains('js-checkout')) { // Check if the button is checkout
                    checkout = true;
                }
                let _this = e.target;
                let productId = _this.getAttribute("data-product-id"); // Get the product id
                let quantity = _this.getAttribute("data-quantity"); // Get the quantity
                const upsellProductSelectors = section.querySelectorAll(".js-upsell-selector.active"); // Get all active upsell products
                const addItems = []; // Create an array for items
                addItems.push({  // Add the main product to the array
                    id: productId,
                    quantity: quantity
                })
                upsellProductSelectors.forEach((upsellProductSelector) => {  // Add upsell products to the array
                    const productId = upsellProductSelector.getAttribute("data-product-id");
                    addItems.push({
                        id: productId,
                        quantity: 1,
                    });
                });
                console.log(addItems);
                const formData = { // Form data for the cart
                    items: addItems,
                };
                fetch(window.Shopify.routes.root + "cart/add.js", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })
                    .then((response) => {
                        console.log(response.status, "ok"); // Check if the response is OK
                        if (response.status === 200 && checkout) {
                            window.location.href = '/checkout';
                        }
                        return response.json();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            });
        });
    })
});
