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
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });