/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
console.log('thisss')
window.selectLogic = {
  productCount: '5x',
  productHandle: '',
  productId: '',
  phoneType: 'iPhone',
  cableLength: '4ft(1.2m)',
  addon: ''
}
const productSelectors = document.querySelectorAll('.js-product-selector')
const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const addToCarts = document.querySelectorAll('.js-atc')
const price = document.querySelector('.js-price')
const crossedPrice = document.querySelector('.js-crossed-price')
const addUpsell = document.querySelector('.js-add')
const priceDisplay = () => {
  const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
  price.innerHTML = window.prices[productSelection]
  crossedPrice.innerHTML = window.comparePrices[productSelection]
}
window.addEventListener('load', (event) => {
  priceDisplay()
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
    const _this = productSelector
    const product = _this.getAttribute('data-product')
    const productId = _this.getAttribute('data-id')
    const count = _this.getAttribute('data-count')
    productSelectors.forEach(productSelector => {
      productSelector.classList.remove('active')
    })
    _this.classList.add('active')
    console.log(productSelector.classList, 'seleectoree')
    console.log(product, 'product')
    window.selectLogic.productId = productId
    window.selectLogic.productHandle = product
    window.selectLogic.productCount = count
    console.log(window.selectLogic)
    setTimeout(() => {
      priceDisplay()
    }, '500')
  })
})
typeSelectors.forEach(typeSelector => {
  typeSelector.addEventListener('click', (e) => {
    const _this = typeSelector
    const phoneType = _this.getAttribute('data-type')
    typeSelectors.forEach(typeSelector => {
      typeSelector.classList.remove('active')
    })
    _this.classList.add('active')
    window.selectLogic.phoneType = phoneType
    console.log(window.selectLogic)
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
    console.log(window.selectLogic)
  })
})
addUpsell.addEventListener('click', (e) => {
  addUpsell.classList.toggle('added')
  if (addUpsell.classList.contains('added')) {
    const addonId = addUpsell.getAttribute('data-addon')
    window.selectLogic.addon = addonId
    console.log(window.selectLogic)
  } else {
    console.log('addon je sklonjen')
    window.selectLogic.addon = ''
    console.log(window.selectLogic)
  }
})
addToCarts.forEach(addToCart => {
  addToCart.addEventListener('click', (e) => {
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
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
    console.log(window.products, window.products[productSelection], productSelection)
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
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
})

$('.js-section-scroll').on('click', function (e) {
  e.preventDefault()
  const $section = $('#product-rev')

  $('html, body').animate({
    scrollTop: $section.offset().top + 'px'
  }, 1000)
})

const accordions = document.querySelectorAll('.accordion')

const openAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content')
  accordion.classList.add('accordion__active')
  content.style.maxHeight = content.scrollHeight + 'px'
}

const closeAccordion = (accordion) => {
  const content = accordion.querySelector('.accordion__content')
  accordion.classList.remove('accordion__active')
  content.style.maxHeight = null
}

accordions.forEach((accordion) => {
  const intro = accordion.querySelector('.accordion__intro')
  const content = accordion.querySelector('.accordion__content')

  intro.onclick = () => {
    if (content.style.maxHeight) {
      closeAccordion(accordion)
    } else {
      accordions.forEach((accordion) => closeAccordion(accordion))
      openAccordion(accordion)
    }
  }
})
