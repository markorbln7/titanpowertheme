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
      discOne.innerHTML = window.prices['2x' + selectedType]
      originalOne.innerHTML = window.comparePrices['2x' + selectedType]
      discTwo.innerHTML = window.prices['4x' + selectedType]
      originalTwo.innerHTML = window.comparePrices['4x' + selectedType]
      discThree.innerHTML = window.prices['6x' + selectedType]
      originalThree.innerHTML = window.comparePrices['6x' + selectedType]
      discFour.innerHTML = window.prices['pd2x' + selectedType]
      originalFour.innerHTML = window.comparePrices['pd2x' + selectedType]
      discFive.innerHTML = window.prices['pd4x' + selectedType]
      originalFive.innerHTML = window.comparePrices['pd4x' + selectedType]
      discSix.innerHTML = window.prices['pd6x' + selectedType]
      originalSix.innerHTML = window.comparePrices['pd6x' + selectedType]
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
let infoTriggers = document.querySelectorAll('.js-info-trigger')
let closeBtns = document.querySelectorAll('.close');
let returnToOrders = document.querySelectorAll('.js-return')
let SelectOrders = document.querySelectorAll('.js-add')
infoTriggers.forEach(infoTrigger => {
    infoTrigger.addEventListener('click', (e) => {
      let panel = infoTrigger.parentNode.querySelector('.product-popup')
      document.querySelector('body').classList.add('no-scroll')
      document.querySelector('html').classList.add('no-scroll')
      panel.classList.add('active')
    })
})
closeBtns.forEach(closeBtn => {
  closeBtn.addEventListener('click', (e) => {
    closeBtn.parentNode.parentNode.classList.remove('active');
    closeBtn.parentNode.classList.remove('active');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
  })
})
returnToOrders.forEach(returnToOrder => {
  returnToOrder.addEventListener('click', (e) => {
    returnToOrder.parentNode.parentNode.parentNode.classList.remove('active');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
  })
})
SelectOrders.forEach(SelectOrder => {
  SelectOrder.addEventListener('click', (e) => {
    SelectOrder.parentNode.parentNode.parentNode.classList.remove('active');
    SelectOrder.parentNode.parentNode.parentNode.parentNode.classList.add('selected');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
  })
})
let overlayCls = document.querySelectorAll('.product-popup');
overlayCls.forEach(overlayCl => {
  overlayCl.addEventListener('click', (e) => {
    console.log(e.target.classList, 'overlayCl');
      if(e.target.classList.contains('product-popup')) {
          e.target.classList.remove('active');
          document.querySelector('body').classList.remove('no-scroll')
          document.querySelector('html').classList.remove('no-scroll')
      }
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
            quantity: document.querySelector('.js-add-to-cart-pd').getAttribute('data-quantity')
          }
        ]
      } else {
        addItems = [
          {
            id: window.products[productSelection],
            quantity: document.querySelector('.js-add-to-cart-pd').getAttribute('data-quantity')
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

let ttplus = document.querySelectorAll('.tt-plus')
let ttminus = document.querySelectorAll('.tt-minus')
let ttquantity = document.querySelector('.tt-quantity')
let buyMore = document.querySelector('.js-buy-more')
if(ttquantity) {
  ttplus.forEach((plus) => {
    plus.addEventListener('click', () => {
      let currentQty = ttquantity.getAttribute('data-count')
      currentQty++
      if (currentQty < 2 && buyMore) {
        buyMore.textContent = 'Add 2 save 10%'
        buyMore.setAttribute('data-count', 2)
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 2 && currentQty < 4 && buyMore) {
        buyMore.textContent = 'Add 4 save 20%'
        buyMore.setAttribute('data-count', 4)
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 4 && buyMore) {
        buyMore.textContent = 'Add 8 save 35%'
        buyMore.setAttribute('data-count', 8)
        buyMore.classList.remove('hidden')
      }
      if (currentQty < 8 && buyMore) {
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 8 && buyMore) {
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
      if (currentQty < 1 && buyMore) {
        currentQty = 1
      }
      if (currentQty < 2 && buyMore) {
        buyMore.textContent = 'Add 2 save 10%'
        buyMore.setAttribute('data-count', 2)
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 2 && currentQty < 4 && buyMore) {
        buyMore.textContent = 'Add 4 save 20%'
        buyMore.setAttribute('data-count', 4)
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 4 && buyMore) {
        buyMore.textContent = 'Add 8 save 35%'
        buyMore.setAttribute('data-count', 8)
        buyMore.classList.remove('hidden')
      }
      if (currentQty < 8 && buyMore) {
        buyMore.classList.remove('hidden')
      }
      if (currentQty >= 8 && buyMore) {
        buyMore.classList.add('hidden')
      }
      ttquantity.setAttribute('data-count', currentQty)
      ttquantity.textContent = currentQty
      document.querySelector('.js-add-to-cart-pd').setAttribute('data-quantity', currentQty)
    })
  })
  if(buyMore) {
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
        _this.textContent = 'Add 8 save 35%'
      }
      if (currentQty < 8) {
        _this.setAttribute('data-count', parseInt(currentQty) * 2)
      }
      let currentQtyS = ttquantity.getAttribute('data-count')
      if (currentQtyS < 8) {
        buyMore.classList.remove('hidden')
      }
      if (currentQtyS >= 8) {
        buyMore.classList.add('hidden')
      }
      console.log(currentQty, 'currentQty')
    })
  }
}