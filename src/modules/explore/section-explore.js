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
            if(desktopLabel) {
                desktopLabel.classList.add('active');
            }
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
                    if(desktopLabel) desktopLabel.classList.add('active');
                    if (travelLabel) travelLabel.classList.remove('active');
                } else if (productIndex.startsWith('for-travel')) {
                    if (travelLabel) travelLabel.classList.add('active');
                    if(desktopLabel) desktopLabel.classList.remove('active');
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
        const buyNowButtons = section.querySelectorAll('.js-section-explore__buy-now');
        const popups = section.querySelectorAll('.buy-now-popup');

        function openPopup(popup) {
            popup.style.display = 'block';
            popup.classList.add('active');
            document.querySelector('body').style.overflow = 'hidden';
        }

        function closePopup(popup) {
            popup.style.display = 'none';
            popup.classList.remove('active');
            document.querySelector('body').style.overflow = 'auto';
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
                const popup = button.parentNode.querySelector('.buy-now-popup');
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

        function updatePlaceholders() {
            console.log('updating placeholders');
            fetch('/cart.js')
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(cart => {
                    // Example: Display cart items in a div
                    console.log(cart, 'cart');
                    document.querySelector('body').style.overflow = 'auto';
                    const output = document.querySelector('.js-output');
                    const item_count = cart.item_count;
                    const placeholders = document.querySelectorAll('.placeholder');
                    const cartItems = cart.items;
                    placeholders.forEach(placeholder => {
                        placeholder.classList.remove('filled');
                        placeholder.innerHTML = '+';
                    });
                    // Fill placeholders with cart items
                    cartItems.forEach((item, index) => {
                        console.log(item, index,placeholders.length, 'item, index');
                        if (index < placeholders.length) {
                            placeholders[index].innerHTML = `
                                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                                <div class="absolute bg-black flex items-center justify-center w-[30%] h-[30%] bottom-[5px] right-[5px]">
                                    <p class="text-white text-center">${item.quantity}</p>
                                </div>
                                <div data-id="${item.id}" class="absolute bg-[#c14444] flex items-center justify-center w-[16px] h-[16px] top-[-8px] right-[-8px] js-remove-product cursor-pointer color-white rounded-[50%]">
                                    x
                                </div>
                            `;
                        } else {
                            document.querySelector('.js-output').innerHTML += `
                            <div class="sticky-card-product w-[50px] h-[50px] bg-white flex items-center justify-center placeholder relative">
                                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                                <div class="absolute bg-black flex items-center justify-center w-[30%] h-[30%] bottom-[5px] right-[5px]">
                                    <p class="text-white text-center">${item.quantity}</p>
                                </div>
                                <div data-id="${item.id}" class="absolute bg-[#c14444] flex items-center justify-center w-[16px] h-[16px] top-[-8px] right-[-8px] js-remove-product cursor-pointer color-white rounded-[50%]">
                                    x
                                </div>
                            </div>
                            `;
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching cart:', error);
                });
                console.log('done updating placeholders');
        }
        window.addEventListener('load', updatePlaceholders);

        function removeProduct(productId) {
            console.log('removing product', productId);
            fetch(window.Shopify.routes.root + 'cart/change.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: productId,
                    quantity: 0
                })
            })
            .then(response => {
                if(response.status === 200) {
                    updatePlaceholders();
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        let removeProductButtons = document.querySelectorAll('.js-remove-product');
        document.addEventListener('click', function(event) {
            if (event.target && event.target.matches('.js-remove-product')) {
              var dataId = event.target.getAttribute('data-id'); // Retrieve the data-id attribute
              removeProduct(dataId);
            }
        });
        // console.log(removeProductButtons, 'removeProductButtons');
        // removeProductButtons.forEach(button => {
        //     button.addEventListener('click', () => {
        //         const productId = button.getAttribute('data-id');
        //         removeProduct(productId);
        //     });
        // });

        // Add to cart logic
        let addToCarts = section.querySelectorAll(".js-atc")  // Select all add to cart buttons
        addToCarts.forEach((addToCart) => {
            addToCart.addEventListener("click", (e) => {
                document.querySelector('body').style.overflow = 'auto';
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
                        if(response.status === 200) {
                            document.querySelector('.buy-now-popup.active').style.display = 'none';
                            document.querySelector('.buy-now-popup.active').classList.remove('active');
                            document.querySelector('body').style.overflow = 'auto';
                            updatePlaceholders();
                        }
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