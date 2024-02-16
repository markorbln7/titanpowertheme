const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const productSelectors = document.querySelectorAll('.js-product-selector')
const addToCarts = document.querySelectorAll('.js-add-to-cart-pd')
const mainImageChange = document.querySelector('.js-main-image-change')
typeSelectors.forEach(typeSelector => {
    typeSelector.addEventListener('click', (e) => {
      const _this = typeSelector
      const phoneType = _this.getAttribute('data-type')
      window.selectLogic.phoneType = phoneType
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(productSelection, 'productSelection');
      mainImageChange.src = window.mainImages[productSelection]
    //   mainImageChange.src = window.mainImages[productSelection]
    //   imageChange.src = window.images[productSelection]
    //   mainImageChange.src = window.mainImages[productSelection]
    //   setTimeout(() => {
    //     priceDisplay()
    //   }, '500')
    })
})

lengthSelectors.forEach(lengthSelector => {
    lengthSelector.addEventListener('click', (e) => {
      const _this = lengthSelector
      const lenght = _this.getAttribute('data-length')
      lengthSelectors.forEach(lengthSelector => {
        lengthSelector.classList.remove('active')
      })
      _this.classList.add('active')
      window.selectLogic.cableLength = lenght
      const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
      console.log(productSelection, 'productSelection');
      mainImageChange.src = window.mainImages[productSelection]
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