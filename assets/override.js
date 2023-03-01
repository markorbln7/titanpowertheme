/* eslint-disable no-unused-vars */
console.log('thisss')
window.selectLogic = {
  productCount: '5x',
  productHandle: '',
  productId: '',
  phoneType: 'iPhone',
  cableLength: '4ft(1.2m)'
}
const productSelectors = document.querySelectorAll('.js-product-selector')
const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const addToCart = document.querySelector('.js-atc')
const price = document.querySelector('.js-price')
const crossedPrice = document.querySelector('.js-crossed-price')
window.addEventListener('load', (event) => {
  const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
  price.innerHTML = window.prices[productSelection]
  crossedPrice.innerHTML = window.comparePrices[productSelection]
})
function fetchProduct (el) {
  fetch('https://titanpowerplus.com/products/' + el + '.json')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
}
console.log('productSelectors', productSelectors)
productSelectors.forEach(productSelector => {
  productSelector.addEventListener('click', async (e) => {
    const _this = e.target
    const product = _this.getAttribute('data-product')
    console.log(product, 'product')
    const productId = _this.getAttribute('data-id')
    const count = _this.getAttribute('data-count')
    window.selectLogic.productId = productId
    window.selectLogic.productHandle = product
    window.selectLogic.productCount = count
    console.log(window.selectLogic)
  })
})
typeSelectors.forEach(typeSelector => {
  typeSelector.addEventListener('click', (e) => {
    const _this = e.target
    const phoneType = _this.getAttribute('data-type')
    window.selectLogic.phoneType = phoneType
    console.log(window.selectLogic)
  })
})
lengthSelectors.forEach(lengthSelector => {
  lengthSelector.addEventListener('click', (e) => {
    const _this = e.target
    const lenght = _this.getAttribute('data-length')
    window.selectLogic.cableLength = lenght
    console.log(window.selectLogic)
  })
})

addToCart.addEventListener('click', (e) => {
  const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
  console.log(window.products, window.products[productSelection], productSelection)
  const formData = {
    items: [{
      id: window.products[productSelection],
      quantity: 1
    }]
  }
  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      return response.json()
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
