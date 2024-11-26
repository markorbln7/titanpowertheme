/* eslint-disable */
import './product-zigzag.css'

var variantSelectorSFirst = document.querySelectorAll(".zig-variant-selector-1");
var variantSelectorSSecond = document.querySelectorAll(".zig-variant-selector-2");
variantSelectorSFirst.forEach((variantSelectorFirst) => {
  variantSelectorFirst.addEventListener("change", function (e) {
    let _this = e;
    let variantId = this.value;
    let nameFirst = variantId;
    let selectedName;
    let nameSecond = "start"
    if(this.closest('.product-zigzag-section').querySelector(".zig-variant-selector-2")) {
      nameSecond = this.closest('.product-zigzag-section').querySelector(".zig-variant-selector-2")
          .options[
            this.closest('.product-zigzag-section').querySelector(".zig-variant-selector-2").selectedIndex
      ].text;
    }
    if(nameSecond !== "start") {
      selectedName = nameFirst + " / " + nameSecond;
    } else {
      selectedName = nameFirst;
    }
    console.log(selectedName, "selectedName");
    let productId = this.closest('.product-zigzag-section')
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
    this.closest('.product-zigzag-section').querySelector('.js-add-to-cart-zig').setAttribute("data-product", productId)
    console.log(productId, "productId");
  });
});

variantSelectorSSecond.forEach((variantSelectorSecond) => {
  variantSelectorSecond.addEventListener("change", function (e) {
    let variantId = this.value;
    let nameSecond = variantId;
    let nameFirst = this.closest('.product-zigzag-section').querySelector(".zig-variant-selector-1")
      .options[
        this.closest('.product-zigzag-section').querySelector(".zig-variant-selector-1").selectedIndex
    ].text;
    let selectedName = nameFirst + " / " + nameSecond;
    console.log(selectedName, "selectedName");
    let productId = this.parentNode.parentNode.parentNode
      .querySelector("[data-title='" + selectedName + "']")
      .getAttribute("data-variant");
    console.log(productId, "productId");
    this.closest('.product-zigzag-section')
      .querySelector(".js-add-to-cart-zig")
      .setAttribute("data-product", productId);
    let productPrice = this.closest('.product-zigzag-section')
      .querySelector("[data-title='" + selectedName + "']")
      .getAttribute("data-price");
    console.log(productPrice, "productPrice")
    let productPriceNoFormat = this.closest('.product-zigzag-section')
      .querySelector("[data-title='" + selectedName + "']")
      .getAttribute("data-price-noformat");
    let productComparePrice = this.closest('.product-zigzag-section')
      .querySelector("[data-title='" + selectedName + "']")
      .getAttribute("data-compare-price");
    let productComparePriceNoFormat = this.closest('.product-zigzag-section')
      .querySelector("[data-title='" + selectedName + "']")
      .getAttribute("data-price-noformat");
  //   this.closest('.b-collection-carousel__product')
  //     .querySelector(".js-product-selector")
  //     .setAttribute("data-product-price", productPriceNoFormat);
  //   this.closest('.b-collection-carousel__product')
  //     .querySelector(".js-product-selector")
  //     .setAttribute(
  //       "data-product-compare-price",
  //       productComparePriceNoFormat
  //     );
    // window.selectLogic.addon = productId
    this.closest('.product-zigzag-section').querySelector(
      ".zig-js-upsel-product-price"
    ).innerHTML = productPrice;
    this.closest('.product-zigzag-section').querySelector(
      ".zig-js-price-discount"
    ).innerHTML = productComparePrice;
    // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
    // addUpsell.setAttribute('data-addon-id', productId);
  });
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
          const giftSelectorsActive = document.querySelectorAll(`.padlock-active[data-gift]`)
          const cartTotal = cart.total_price
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
            placeholders[index].classList.add('filled');
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
  console.log(blocks, 'blocks');



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
      //const progress = (cartItemCount / blocks[0].itemCount) * 100;
      //progressBar.style.width = `${progress}%`;
    } else if (!nextBlock) {
      // Maximum discount reached
      messageContainer.textContent = `You are at your maximum discount of ${currentBlock.percentageOff}%.`;
      //progressBar.style.width = '100%';
    } else {
      // Between blocks
      const itemsLeft = nextBlock.itemCount - cartItemCount;
      messageContainer.textContent = `You get ${currentBlock.percentageOff}% off. Add ${itemsLeft} more items to get ${nextBlock.percentageOff}% off.`;
      //const progress = ((cartItemCount - currentBlock.itemCount) / (nextBlock.itemCount - currentBlock.itemCount)) * 100;
      //progressBar.style.width = `${progress}%`;
    }
    const maxItems = blocks[blocks.length - 1].itemCount;
    const progress = Math.min((cartItemCount / maxItems) * 100, 100); // Cap at 100%
    progressBar.style.width = `${progress}%`;
  }
  function fetchCartCount() {
      fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
          cartItemCount = cart.item_count;
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
      const itemCount = cart.item_count; // Total number of items in the cart
      console.log('Cart item count:', itemCount);

      // Use this value to update your tracking bar or any other UI elements
      initializeTrackingBar(itemCount); // Example: Hook into your tracking bar logic
    })
    .catch(error => {
      console.error('Error fetching cart data:', error);
    });
}

const upsellProducts = document.querySelectorAll('.upsell-product')
upsellProducts.forEach((upsellProduct) => {
    upsellProduct.addEventListener('click', (e) => {
        let _this = e.currentTarget
        _this.classList.toggle('active')
    })
})

const addToCartsZigs = document.querySelectorAll(".js-add-to-cart-zig");

addToCartsZigs.forEach((addToCartsZig) => {
    addToCartsZig.addEventListener("click", (e) => {
      let addItems = [];
      const _this = e.currentTarget;
      const parentDiv = _this.closest(".product-zigzag__content");
      const upsellProductSelectors = parentDiv.querySelectorAll(".js-upsell-selector.active");
      let productSelector = _this.getAttribute("data-product");
      let productSelectorSans = productSelector.replace(/,$/, '')
      let numbersArray = productSelectorSans.split(",").map(Number);
      console.log(numbersArray);
      // numbersArray.forEach((productSelector) => {
      //   addItems.push({
      //     id: productSelector,
      //     quantity: 1,
      //   });
      // });
      console.log(addItems, "addItems");
      upsellProductSelectors.forEach((productSelector) => {
        const _this = productSelector;
        const productId = _this.getAttribute("data-product-id");
        const productQuantity = _this.getAttribute("data-product-qty");
        addItems.push({
          id: productId,
          quantity: productQuantity,
        });
      });
      console.log(addItems, "addItems");
      const formData = {
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
          console.log(response.status, "ok");
          if(response.status === 200) {
            updatePlaceholders();
            getCartItemCount();
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });