/* eslint-disable */
import './bf.css'
console.log('bf.js loaded');

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
                                const addToCartButton = popup.querySelector('.js-atc-bf');
                                const addToCheckoutButton = popup.querySelector('.js-checkout');
                                addToCartButton.setAttribute("data-quantity", input.value);
                                addToCheckoutButton.setAttribute("data-quantity", input.value);
                            }
                            updateQuantityButtonsState(input, minusButton); // Update button state after quantity change
                        });

                        plusButton.addEventListener('click', () => {
                            let quantity = parseInt(input.value);
                            input.value = quantity + 1;
                            const addToCartButton = popup.querySelector('.js-atc-bf');
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
            fetch('/cart.js')
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(cart => {
                    // Example: Display cart items in a div
                    document.querySelector('body').style.overflow = 'auto';
                    const output = document.querySelector('.js-output');
                    const item_count = cart.item_count;
                    const placeholders = document.querySelectorAll('.placeholder');
                    const cartItems = cart.items;
                    placeholders.forEach(placeholder => {
                        placeholder.classList.remove('filled');
                        placeholder.innerHTML = '+';
                    });
                    const giftSelectorsActive = document.querySelectorAll(`.padlock-active[data-gift]`)
                    const cartTotal = cart.total_price;
                    if(giftSelectorsActive) {
                        giftSelectorsActive.forEach(gift => {
                            gift.classList.remove('is-active')
                            gift.querySelector('.gift-overlay').classList.remove('is-active')
                            gift.querySelector('.top-note').classList.remove('is-active')
                            if(gift.querySelector('.conf')) {
                                gift.querySelector('.conf').classList.remove('is-active')
                            }
                            let giftNumber = gift.getAttribute('data-money')
                            if (cartTotal >= giftNumber) {
                                gift.classList.add('is-active')
                                gift.querySelector('.gift-overlay').classList.add('is-active')
                                gift.querySelector('.top-note').classList.add('is-active')
                                if(gift.querySelector('.conf')) {
                                    gift.querySelector('.conf').classList.add('is-active')
                                }
                            }
                        })
                    }
                    // Fill placeholders with cart items
                    cartItems.forEach((item, index) => {
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
        function initializeTrackingBar() {
            const messageContainer = document.querySelector('[data-tracking-bar-message]');
            const progressBar = document.querySelector('[data-progress-bar]');
            const blocks = Array.from(document.querySelectorAll('[data-tracking-bar-blocks] li')).map((block) => ({
              itemCount: parseInt(block.getAttribute('data-item-count'), 10),
              percentageOff: parseInt(block.getAttribute('data-percentage-off'), 10),
            }));

            let cartItemCount = 0;



            function updateTrackingBar() {
              let currentBlock = null;
              let nextBlock = null;

              // Determine the current and next discount blocks
              for (let i = 0; i < blocks.length; i++) {
                if (cartItemCount >= blocks[i].itemCount) {
                  currentBlock = blocks[i];
                } else {
                  nextBlock = blocks[i];
                  break;
                }
              }

              // Update message and progress bar
              if (!currentBlock) {
                // Before the first block
                const itemsLeft = blocks[0].itemCount - cartItemCount;
                messageContainer.textContent = `Add ${itemsLeft} more items to save ${blocks[0].percentageOff}%.`;
                // const progress = (cartItemCount / blocks[0].itemCount) * 100;
                // progressBar.style.width = `${progress}%`;
              } else if (!nextBlock) {
                // Maximum discount reached
                messageContainer.textContent = `You are at your maximum discount of ${currentBlock.percentageOff}%.`;
                // progressBar.style.width = '100%';
              } else {
                // Between blocks
                const itemsLeft = nextBlock.itemCount - cartItemCount;
                messageContainer.textContent = `You get ${currentBlock.percentageOff}% off. Add ${itemsLeft} more items to get ${nextBlock.percentageOff}% off.`;
                const progress = ((cartItemCount - currentBlock.itemCount) / (nextBlock.itemCount - currentBlock.itemCount)) * 100;
                // progressBar.style.width = `${progress}%`;
              }
              const maxItems = blocks[blocks.length - 1].itemCount;
              const progress = Math.min((cartItemCount / maxItems) * 100, 100); // Cap at 100%
              progressBar.style.width = `${progress}%`;
            }
            function fetchCartCount() {
                fetch('/cart.js')
                  .then(response => response.json())
                  .then(cart => {

                    let cartItemCountMinus = 0;
                    cart.items.forEach(item => {
                        if(item.properties._attribution) {
                            cartItemCountMinus += item.quantity;
                        }
                    });
                    cartItemCount = cart.item_count - cartItemCountMinus;
                    document.querySelector('.js-gift-unlocked').innerHTML = cartItemCountMinus + 1;
                    updateTrackingBar();
                  })
                  .catch(error => console.error('Error fetching cart data:', error));
            }



            // Initial setup
            fetchCartCount();
          }

        function getCartItemCount() {
            fetch('/cart.js')
              .then(response => response.json())
              .then(cart => {
                let itemsCount = 0;
                cart.items.forEach(item => {
                    if(item.properties._attribution) {
                        itemsCount += item.quantity;
                    }
                });

                // Use this value to update your tracking bar or any other UI elements
                initializeTrackingBar(8888888); // Example: Hook into your tracking bar logic
              })
              .catch(error => {
                console.error('Error fetching cart data:', error);
              });
        }
        window.addEventListener('load', getCartItemCount);
        window.addEventListener('load', updatePlaceholders);
        document.addEventListener('rebuy:cart.change', (event) => {
            updatePlaceholders();
            getCartItemCount();
        });

        function removeProduct(productId) {
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
                    getCartItemCount();
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

        // Add to cart logic
        let addToCarts = section.querySelectorAll(".js-atc-bf")  // Select all add to cart buttons
        addToCarts.forEach((addToCart) => {
            addToCart.addEventListener("click", (e) => {
                document.querySelector('body').style.overflow = 'auto';
                $('html').addClass('hide-drawer');
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
                console.log(addItems, 'addItems');
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
                            getCartItemCount();
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

let gridImages = document.querySelectorAll('.js-grid-image')
gridImages.forEach(gridImage => {
  gridImage.addEventListener('click', (e) => {
    let _this = gridImage
    let imageQty = _this.getAttribute('data-image-qty')
    let ttquantity = gridImage.parentNode.parentNode.querySelector('.quantity__input')
    let buyMore = gridImage.parentNode.parentNode.querySelector('.js-buy-more')
    let atc = gridImage.parentNode.parentNode.parentNode.parentNode.querySelector('.js-atc-bf')
    atc.setAttribute('data-quantity', imageQty)
    gridImage.parentNode.parentNode.querySelector('.quantity__button').classList.remove('disabled')
    ttquantity.value = imageQty
    if (imageQty < 1 && buyMore) {
      imageQty = 1
    }
    if (imageQty < 4 && buyMore) {
      buyMore.textContent = 'Add 4 save 55%%'
      buyMore.setAttribute('data-count', 4)
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 4 && imageQty < 6 && buyMore) {
      buyMore.textContent = 'Add 6 save 65%'
      buyMore.setAttribute('data-count', 6)
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 6 && buyMore) {
      buyMore.textContent = 'Add 10 save 75%'
      buyMore.setAttribute('data-count', 10)
      buyMore.classList.remove('hidden')
    }
    if (imageQty < 10 && buyMore) {
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 10 && buyMore) {
      buyMore.classList.add('hidden')
    }
  })
})
function initializeStickyTrackingBar() {
    const trackingBar = document.querySelector('[data-tracking-bar]');
    const headerBar = document.querySelector('.header-wrapper');
    const stickyClass = 'sticky-bar';
    const stickyHeaderClass = 'sticky-header';

    function handleStickyBehavior() {
      const scrollPosition = window.scrollY; // Current vertical scroll position
      const viewportHeight = window.innerHeight; // Viewport height

      if (scrollPosition > 40 || viewportHeight < 40) {
        if(trackingBar) {
            trackingBar.classList.add(stickyClass);
            if(headerBar)
            headerBar.classList.add(stickyHeaderClass);
        }
      } else {
        if(trackingBar) {
            trackingBar.classList.remove(stickyClass);
            if(headerBar)
            headerBar.classList.remove(stickyHeaderClass);
        }
      }
    }

    // Attach scroll and resize event listeners
    window.addEventListener('scroll', handleStickyBehavior);
    window.addEventListener('resize', handleStickyBehavior);

    // Initial check
    handleStickyBehavior();
}
initializeStickyTrackingBar();

$('html').addClass('hide-drawer');

setTimeout(() => {
    let closeRebuy = document.querySelector('.rebuy-cart__flyout-close');
    console.log(closeRebuy, 'closeRebuy');
    closeRebuy.addEventListener('click', () => {
        $('html').addClass('hide-drawer');
        Rebuy.SmartCart.hide()
    })
}, 4000);


let openRebuys = document.querySelectorAll('.js-rebuy');
console.log(openRebuys, 'openRebuy');
openRebuys.forEach(openRebuy => {
    openRebuy.addEventListener('click', () => {
        $('html').removeClass('hide-drawer');
        Rebuy.SmartCart.show()
    })
});


const targetDiv = document.querySelector('.sticky-card-wrap'); // The div to which the class will be added
const triggerDiv = document.querySelector('.section-collections-with-nav'); // The div being monitored
const customClass = 'show-cart'; // The class to add to the target div

if (targetDiv && triggerDiv) {
    const triggerOffset = triggerDiv.offsetTop + triggerDiv.offsetHeight; // Calculate when the trigger has fully passed

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;

      if (scrollPosition >= triggerOffset) {
        // If the trigger div has fully passed
        targetDiv.classList.add(customClass);
      } else if (window.scrollY < triggerDiv.offsetTop) {
        // If scrolling back above the trigger div
        targetDiv.classList.remove(customClass);
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Initial check in case the page is already scrolled
    handleScroll();
  } else {
    console.warn('Target or trigger element not found.');
  }

