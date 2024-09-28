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
const addUpsells = document.querySelectorAll('.js-addon')
const priceDisplay = () => {
    let currency = document.querySelector(".js-currency").getAttribute("data-currency");
    const productSelection = window.selectLogic.productCount
    console.log(productSelection, 'productSelection')
    let totalPrice = parseInt(window.pricesRaw[productSelection])
    let comparePrice = parseInt(window.comparePricesRaw[productSelection])
    addUpsells.forEach(addUpsell => {
      if(addUpsell.classList.contains('added')) {
        const addonPrice = addUpsell.getAttribute('data-addon-price')
        const addonComparePrice = addUpsell.getAttribute('data-addon-compare-price')
        totalPrice += parseFloat(addonPrice)
        comparePrice += parseFloat(addonComparePrice)
      }
    })
    let finalPrice = totalPrice / 100
    let finalComparePrice = comparePrice / 100
    let savefinalPrice = finalComparePrice - finalPrice
    price.innerHTML = finalPrice + '.00 ' + currency
    crossedPrice.innerHTML = finalComparePrice + '.00 ' + currency
    savedPrice.innerHTML = savefinalPrice + '.00 ' + currency + ' SAVED'
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
let addonWrappers = document.querySelectorAll('.addon-wrapper')
let addonAdded = false
addonWrappers.forEach(addonWrapper => {
  addonWrapper.addEventListener('click', (e) => {
    addonWrapper.classList.toggle('added')
    addonWrapper.parentElement.classList.toggle('added')
    priceDisplay()
  })
})

console.log(addToCarts, 'window.selectLogic');
addToCarts.forEach(addToCart => {
    addToCart.addEventListener('click', (e) => {
      const productSelection = window.selectLogic.productCount
      const quantity = e.target.getAttribute('data-quantity')
      console.log(quantity, 'quantity')
      console.log(window.products, window.products[productSelection],productSelection, 'productSelection');
      let addItems = []
      addonWrappers.forEach(addonWrapper => {
        if(addonWrapper.classList.contains('added')) {
          const addonId = addonWrapper.parentElement.getAttribute('data-addon-id')
          addItems.push({
            id: addonId,
            quantity: 1
          })
        }
      })
      addItems.push({
        id: window.products[productSelection],
        quantity: 1
      })
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


var variantSelectorFirsts = document.querySelectorAll('.variant-selector-1');
var variantSelectorSeconds = document.querySelectorAll('.variant-selector-2');
if(variantSelectorFirsts) {
  variantSelectorFirsts.forEach(variantSelectorFirst => {
    variantSelectorFirst.addEventListener('change', function() {
      let parent = variantSelectorFirst.parentElement.parentElement;
      let variantId = variantSelectorFirst.value;
      nameFirst = variantId;
      nameSecond = parent.querySelector('.variant-selector-2').value;
      selectedName = nameFirst + ' / ' + nameSecond;
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPrice;
      parent.querySelector('.crossed').innerHTML = productComparePrice;
      parent.setAttribute('data-addon-id', productId);
      parent.setAttribute('data-addon-price', productPrice);
      parent.setAttribute('data-addon-compare-price', productComparePrice);
      priceDisplay();
    });
  })
}
if(variantSelectorSeconds) {
  variantSelectorSeconds.forEach(variantSelectorSecond => {
    variantSelectorSecond.addEventListener('change', function() {
      let parent = variantSelectorSecond.parentElement.parentElement;
      let variantId = variantSelectorSecond.value;
      nameFirst = parent.querySelector('.variant-selector-1').value;
      nameSecond = variantId;
      selectedName = nameFirst + ' / ' + nameSecond;
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productPriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price-cur');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      let productComparePriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price-cur');
      window.selectLogic.addon = productId
      parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPriceCur;
      parent.querySelector('.crossed').innerHTML = productComparePriceCur;
      parent.setAttribute('data-addon-id', productId);
      parent.setAttribute('data-addon-price', productPrice);
      parent.setAttribute('data-addon-compare-price', productComparePrice);
      priceDisplay();
    });
  })
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