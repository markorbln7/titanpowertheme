import './product-zigzag.css'

var variantSelectorSFirst = document.querySelectorAll(".zig-variant-selector-1");
variantSelectorSFirst.forEach((variantSelectorFirst) => {
  variantSelectorFirst.addEventListener("change", function (e) {
    let _this = e;
    let variantId = this.value;
    let nameFirst = variantId;
    let selectedName = nameFirst;
    console.log(selectedName, "selectedName");
    let productId = this.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
    this.parentNode.parentNode.querySelector('.js-add-to-cart-zig').setAttribute("data-product", productId)
    console.log(productId, "productId");
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