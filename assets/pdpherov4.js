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
  const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
  console.log(productSelection, 'productSelection');
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
  console.log(totalPrice, comparePrice, 'totalPrice')
  let finalPrice = totalPrice / 100
  let finalComparePrice = comparePrice / 100
  let savefinalPrice = finalComparePrice - finalPrice
  price.innerHTML = finalPrice.toLocaleString("en-US",{ style: "currency", currency: currency })
  crossedPrice.innerHTML = finalComparePrice.toLocaleString("en-US",{ style: "currency", currency: currency })
  savedPrice.innerHTML = savefinalPrice.toLocaleString("en-US",{ style: "currency", currency: currency }) + ' SAVED'
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
      discOne.innerHTML = window.prices['5x' + selectedType]
      originalOne.innerHTML = window.comparePrices['5x' + selectedType]
      discTwo.innerHTML = window.prices[selectedType]
      originalTwo.innerHTML = window.comparePrices[selectedType]
      // discThree.innerHTML = window.prices[selectedType]
      // originalThree.innerHTML = window.comparePrices[selectedType]
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
addUpsells.forEach(addUpsell => {
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
})

console.log(addToCarts, 'window.selectLogic');
addToCarts.forEach(addToCart => {
    addToCart.addEventListener('click', (e) => {
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(window.products, window.products[productSelection],productSelection, 'productSelection');
      let addItems = []
      addUpsells.forEach(addUpsell => {
        if(addUpsell.classList.contains('added')) {
          const addonId = addUpsell.getAttribute('data-addon-id')
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