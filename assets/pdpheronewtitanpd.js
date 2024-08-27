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
const originalFour = document.querySelector('.js-price-discount-4')
const discFour = document.querySelector('.js-price-original-4')
const originalFive = document.querySelector('.js-price-discount-5')
const discFive = document.querySelector('.js-price-original-5')
const originalSix = document.querySelector('.js-price-discount-6')
const discSix = document.querySelector('.js-price-original-6')
const addUpsell = document.querySelector('.js-addon')
const priceDisplay = () => {
    if (addUpsell.classList.contains('added')) {
        const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
        console.log(productSelection, 'productSelection')
        price.innerHTML = window.jointPrice[productSelection]
        crossedPrice.innerHTML = window.jointComparePrice[productSelection]
        savedPrice.innerHTML = window.jointSavePrices[productSelection] + ' SAVED'
    } else {
        const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
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
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(productSelection, 'productSelection');
      mainImageChange.src = window.mainImages[productSelection]
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
      discFour.innerHTML = window.prices['pd4x' + selectedType]
      originalFour.innerHTML = window.comparePrices['pd4x' + selectedType]
      discFive.innerHTML = window.prices['pd3x' + selectedType]
      originalFive.innerHTML = window.comparePrices['pd3x' + selectedType]
      discSix.innerHTML = window.prices['pd' + selectedType]
      originalSix.innerHTML = window.comparePrices['pd' + selectedType]
      window.selectLogic.cableLength = lenght
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(productSelection, 'productSelection');
      mainImageChange.src = window.mainImages[productSelection]
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
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(productSelection, 'productSelection');
      console.log(window.mainImages[productSelection], 'window.mainImages[productSelection]');
      mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
    })
})

addUpsell.addEventListener('click', (e) => {
    addUpsell.classList.toggle('added')
    if (addUpsell.classList.contains('added')) {
      const addonId = addUpsell.getAttribute('data-addon-id')
      window.selectLogic.addon = addonId
      priceDisplay()
    } else {
      window.selectLogic.addon = ''
      priceDisplay()
    }
})
let accTrigger = document.querySelectorAll('.acc_single_overlay')
accTrigger.forEach(acc => {
    acc.addEventListener('click', (e) => {
      let panel = acc.parentNode
      panel.classList.toggle('selected')
    })
})

console.log(addToCarts, 'window.selectLogic');
addToCarts.forEach(addToCart => {
    addToCart.addEventListener('click', (e) => {
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(window.products, window.products[productSelection],productSelection, 'productSelection');
      let addItems
      if (window.selectLogic.addon !== '') {
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
      let accSelector = document.querySelectorAll('.selected')
      console.log(accSelector, 'accSelector');
      accSelector.forEach(acc => {
          let product = acc.getAttribute('data-product-id')
          console.log(product, 'productacc');
          addItems.push({
            id: product,
            quantity: 1
          })
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