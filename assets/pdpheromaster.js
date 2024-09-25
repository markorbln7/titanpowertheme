console.log('window.selectLogicsssss');
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
      const imageSwitch = _this.getAttribute('data-image')
      console.log(imageSwitch, 'imageSwitch')
      mainImageChange.src = imageSwitch
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
      const quantity = e.target.getAttribute('data-quantity')
      console.log(quantity, 'quantity')
      console.log(window.products, window.products[productSelection],productSelection, 'productSelection');
      let addItems
      if (addonAdded === true) {
        addItems = [
          {
            id: window.products[productSelection],
            quantity: quantity
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
            quantity: quantity
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
if(variantSelectorFirst) {
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
}
if(variantSelectorSecond) {
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
}

let mainVariantSelector = document.querySelector('.main-variant-selector');
console.log(mainVariantSelector, 'mainVariantSelector')
if(mainVariantSelector) {
  mainVariantSelector.addEventListener('change', function() {
    let variantId = mainVariantSelector.value;
    let productId = document.querySelector("[data-title='" + variantId + "']").getAttribute('data-variant');
    let imageSwitch = document.querySelector("[data-title='" + variantId + "']").getAttribute('data-image');
    document.querySelector('.js-main-image-change').src = imageSwitch;
    window.products['1-product'] = productId;
    console.log(window.products, 'win')
  });
}


let ttplus = document.querySelectorAll('.tt-plus')
let ttminus = document.querySelectorAll('.tt-minus')
let ttquantity = document.querySelector('.tt-quantity')
let buyMore = document.querySelector('.js-buy-more')
ttplus.forEach((plus) => {
  plus.addEventListener('click', () => {
    let currentQty = ttquantity.getAttribute('data-count')
    currentQty++
    if (currentQty < 2) {
      buyMore.textContent = 'Add 2 save 10%'
      buyMore.setAttribute('data-count', 2)
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 2 && currentQty < 4) {
      buyMore.textContent = 'Add 4 save 20%'
      buyMore.setAttribute('data-count', 4)
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 4) {
      buyMore.textContent = 'Add 6 save 35%'
      buyMore.setAttribute('data-count', 6)
      buyMore.classList.remove('hidden')
    }
    if (currentQty < 6) {
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 6) {
      buyMore.classList.add('hidden')
    }
    ttquantity.setAttribute('data-count', currentQty)
    ttquantity.textContent = currentQty
    document.querySelector('.js-add-to-cart-pd').setAttribute('data-quantity', currentQty)
  })
})
ttminus.forEach((minus) => {
  minus.addEventListener('click', () => {
    let currentQty = ttquantity.getAttribute('data-count')
    currentQty--
    if (currentQty < 1) {
      currentQty = 1
    }
    if (currentQty < 2) {
      buyMore.textContent = 'Add 2 save 10%'
      buyMore.setAttribute('data-count', 2)
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 2 && currentQty < 4) {
      buyMore.textContent = 'Add 4 save 20%'
      buyMore.setAttribute('data-count', 4)
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 4) {
      buyMore.textContent = 'Add 6 save 35%'
      buyMore.setAttribute('data-count', 6)
      buyMore.classList.remove('hidden')
    }
    if (currentQty < 6) {
      buyMore.classList.remove('hidden')
    }
    if (currentQty >= 6) {
      buyMore.classList.add('hidden')
    }
    ttquantity.setAttribute('data-count', currentQty)
    ttquantity.textContent = currentQty
    document.querySelector('.js-add-to-cart-pd').setAttribute('data-quantity', currentQty)
  })
})
buyMore.addEventListener('click', (e) => {
  e.preventDefault()
  let _this = e.target
  let currentQty = _this.getAttribute('data-count')
  ttquantity.setAttribute('data-count', currentQty)
  ttquantity.textContent = currentQty
  document.querySelector('.js-add-to-cart-pd').setAttribute('data-quantity', currentQty)
  if(currentQty < 2) {
    _this.textContent = 'Add 2 save 10%'
  }
  if(currentQty >= 2 && currentQty < 4) {
    _this.textContent = 'Add 4 save 20%'
  }
  if(currentQty >= 4) {
    _this.textContent = 'Add 6 save 35%'
  }
  if (currentQty < 6) {
    _this.setAttribute('data-count', parseInt(currentQty) + 2)
  }
  let currentQtyS = ttquantity.getAttribute('data-count')
  if (currentQtyS < 6) {
    buyMore.classList.remove('hidden')
  }
  if (currentQtyS >= 6) {
    buyMore.classList.add('hidden')
  }

})