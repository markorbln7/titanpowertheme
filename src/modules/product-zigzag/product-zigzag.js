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
      const _this = e.currentTarget;
      const parentDiv = _this.closest(".product-zigzag__content");
      const upsellProductSelectors = parentDiv.querySelectorAll(".js-upsell-selector.active");
      const productSelector = _this.getAttribute("data-product");
      const addItems = [{
        id: productSelector,
        quantity: 1,
      }];
      upsellProductSelectors.forEach((productSelector) => {
        const _this = productSelector;
        const productId = _this.getAttribute("data-product-id");
        addItems.push({
          id: productId,
          quantity: 1,
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
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });