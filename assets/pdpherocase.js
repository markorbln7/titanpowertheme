const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const productSelectors = document.querySelectorAll('.js-product-selector')
const addToCarts = document.querySelectorAll('.js-add-to-cart-pd')
const mainImageChange = document.querySelector('.js-main-image-change')
const price = document.querySelector('.js-price')
const crossedPrice = document.querySelector('.js-crossed-price')
const savedPrice = document.querySelector('.js-saving')
const originalOne = document.querySelector('.js-price-discount-1')
const discOne = document.querySelector('.js-price-original-1')
const originalTwo = document.querySelector('.js-price-discount-2')
const discTwo = document.querySelector('.js-price-original-2')
const originalThree = document.querySelector('.js-price-discount-3')
const discThree = document.querySelector('.js-price-original-3')
const addUpsell = document.querySelector('.js-addon')
const priceDisplay = () => {
    if (addUpsell.classList.contains('added')) {
        const productSelection = window.selectLogic.productCount
        console.log(productSelection, 'productSelection')
        price.innerHTML = window.jointPrice[productSelection]
        crossedPrice.innerHTML = window.jointComparePrice[productSelection]
        savedPrice.innerHTML = window.jointSavePrices[productSelection] + ' SAVED'
    } else {
        const productSelection = window.selectLogic.productCount
        console.log(productSelection, 'productSelection')
        price.innerHTML = window.prices[productSelection]
        crossedPrice.innerHTML = window.comparePrices[productSelection]
        savedPrice.innerHTML = window.savePrices[productSelection] + ' SAVED'
    }
}
typeSelectors.forEach(typeSelector => {
    typeSelector.addEventListener('click', (e) => {
      const _this = typeSelector
      const phoneType = _this.getAttribute('data-type')
      window.selectLogic.phoneType = phoneType
      const productSelection = window.selectLogic.productCount
      console.log(productSelection, 'productSelection');
      // mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
    })
})

lengthSelectors.forEach(lengthSelector => {
    lengthSelector.addEventListener('click', (e) => {
      const _this = lengthSelector
      const lenght = _this.getAttribute('data-length')
      const phoneType = document.querySelector('.js-type-selector.active').getAttribute('data-type')
      const selectedType = phoneType + '/' + lenght
      console.log(selectedType, 'phoneType');
      console.log(window.prices)
      discOne.innerHTML = window.prices['4x' + selectedType]
      originalOne.innerHTML = window.comparePrices['4x' + selectedType]
      discTwo.innerHTML = window.prices['3x' + selectedType]
      originalTwo.innerHTML = window.comparePrices['3x' + selectedType]
      discThree.innerHTML = window.prices[selectedType]
      originalThree.innerHTML = window.comparePrices[selectedType]
      window.selectLogic.cableLength = lenght
      const productSelection = window.selectLogic.productCount
      console.log(productSelection, 'productSelection');
      // mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
    })
})

productSelectors.forEach(productSelector => {
    productSelector.addEventListener('click', async (e) => {
      const _this = productSelector
      const count = _this.getAttribute('data-count')
      window.selectLogic.productCount = count
      const productSelection = window.selectLogic.productCount
      console.log(productSelection, 'productSelection');
      console.log(window.mainImages[productSelection], 'window.mainImages[productSelection]');
      // mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
    })
})
window.selectLogic.addon = addUpsell.getAttribute('data-addon-id')
let addonWrapper = document.querySelector('.addon-wrapper')
let addonAdded = false
addonWrapper.addEventListener('click', (e) => {
    addonWrapper.classList.toggle('added')
    if (addonWrapper.classList.contains('added')) {
      addonAdded = true
      console.log(window.selectLogic.addon, addonAdded, 'addonAdded')
    } else {
      addonAdded = false
      console.log(window.selectLogic.addon, addonAdded, 'addonAdded')
    }
})

console.log(addToCarts, 'window.selectLogic');
addToCarts.forEach(addToCart => {
    addToCart.addEventListener('click', (e) => {
      const productSelection = window.selectLogic.productCount
      console.log(window.products, window.products[productSelection],productSelection, 'productSelection');
      let addItems
      if (addonAdded === true) {
        addItems = [
          {
            id: window.products[productSelection],
            quantity: 1
          },
          {
            id: window.selectLogic.addon,
            quantity: 1
          }
        ]
      } else {
        addItems = [
          {
            id: window.products[productSelection],
            quantity: 1
          }
        ]
      }
      const formData = {
        items: addItems
      }
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          console.log(response.status, 'ok')
          return response.json()
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    })
})


let nameFirst = '3 x iPhone';
let nameSecond = '4ft (1.2m)';
let selectedName = nameFirst + ' / ' + nameSecond;
var variantSelectorFirst = document.querySelector('.variant-selector-1');
var variantSelectorSecond = document.querySelector('.variant-selector-2');
console.log(variantSelectorSecond, variantSelectorFirst);
variantSelectorFirst.addEventListener('change', function() {
  let variantId = variantSelectorFirst.value;
  nameFirst = variantId;
  selectedName = nameFirst + ' / ' + nameSecond;
  let productId = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
  let productPrice = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
  let productComparePrice = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
  window.selectLogic.addon = productId
  addUpsell.querySelector('.pdp-hero__pricing-price').innerHTML = productPrice;
  addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
  addUpsell.setAttribute('data-addon-id', productId);
});
variantSelectorSecond.addEventListener('change', function() {
  let variantId = variantSelectorSecond.value;
  nameSecond = variantId;
  selectedName = nameFirst + ' / ' + nameSecond;
  let productId = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
  let productPrice = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
  let productComparePrice = document.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
  window.selectLogic.addon = productId
  addUpsell.querySelector('.pdp-hero__pricing-price').innerHTML = productPrice;
  addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
  addUpsell.setAttribute('data-addon-id', productId);
});