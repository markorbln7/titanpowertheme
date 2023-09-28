/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const productSelectors = document.querySelectorAll('.js-product-selector')
const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const addToCarts = document.querySelectorAll('.js-atc')
const atcScroll = document.querySelectorAll('.js-atc-scroll')
const price = document.querySelector('.js-price')
const crossedPrice = document.querySelector('.js-crossed-price')
const savedPrice = document.querySelector('.js-saving')
const addUpsell = document.querySelector('.js-add')
const imageChange = document.querySelector('.js-image-change')
const mainImageChange = document.querySelector('.js-main-image-change')
const discountMessageHolder = document.querySelector('.js-discount')
const originalOne = document.querySelector('.js-price-discount-one')
const discOne = document.querySelector('.js-price-original-one')
const originalTwo = document.querySelector('.js-price-discount-two')
const discTwo = document.querySelector('.js-price-original-two')
const originalThree = document.querySelector('.js-price-discount-three')
const discThree = document.querySelector('.js-price-original-three')
const pdSwitch = document.querySelector('.js-pd-switch')
const pdDisabled = document.querySelectorAll('.pd-disable')

if (pdSwitch) {
  pdSwitch.addEventListener('click', function () {
    const status = pdSwitch.checked
    if (status) {
      console.log('usao ovde')
      if (window.selectLogic.phoneType === 'Micro-USB') {
        window.selectLogic.phoneType = 'iPhone'
        document.querySelector('.pd-default-phone').classList.add('active')
      }
      if (window.selectLogic.cableLength === '10ft(3.0m)') {
        window.selectLogic.cableLength = '4ft(1.2m)'
        document.querySelector('.pd-default-length').classList.add('active')
      }
      pdDisabled.forEach(pdDisable => {
        pdDisable.classList.add('disabled')
        pdDisable.classList.remove('active')
      })
      const startCount = window.selectLogic.productCount
      window.selectLogic.productCount = 'pd-' + startCount
      const lenght = document.querySelector('.js-length-selector.active').getAttribute('data-length')
      console.log(document.querySelector('.js-length-selector.active'))
      productSelectors.forEach(productSelector => {
        const attribute = productSelector.getAttribute('data-count')
        productSelector.setAttribute('data-count', 'pd-' + attribute)
      })
      setTimeout(() => {
        priceDisplay()
        originalOne.innerHTML = window.length['pd-1x' + lenght]
        discOne.innerHTML = window.compareLength['pd-1x' + lenght]
        originalTwo.innerHTML = window.length['pd-4x' + lenght]
        discTwo.innerHTML = window.compareLength['pd-4x' + lenght]
        originalThree.innerHTML = window.length['pd-3x' + lenght]
        discThree.innerHTML = window.compareLength['pd-3x' + lenght]
      }, '500')
    } else {
      pdDisabled.forEach(pdDisable => {
        pdDisable.classList.remove('disabled')
      })
      productSelectors.forEach(productSelector => {
        const attribute = productSelector.getAttribute('data-count')
        productSelector.setAttribute('data-count', attribute.substring(3))
      })
      const newStartCount = window.selectLogic.productCount
      window.selectLogic.productCount = newStartCount.substring(3)
      const lenght = document.querySelector('.js-length-selector.active').getAttribute('data-length')
      setTimeout(() => {
        priceDisplay()
        console.log(length, 'window.length seconddd')
        originalOne.innerHTML = window.length['1x' + lenght]
        discOne.innerHTML = window.compareLength['1x' + lenght]
        originalTwo.innerHTML = window.length['4x' + lenght]
        discTwo.innerHTML = window.compareLength['4x' + lenght]
        originalThree.innerHTML = window.length['3x' + lenght]
        discThree.innerHTML = window.compareLength['3x' + lenght]
      }, '500')
    }
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
    mainImageChange.src = window.mainImages[productSelection]
  })
}

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
window.addEventListener('load', (event) => {
  originalOne.innerHTML = window.length['1x10ft(3.0m)']
  discOne.innerHTML = window.compareLength['1x10ft(3.0m)']
  originalTwo.innerHTML = window.length['4x10ft(3.0m)']
  discTwo.innerHTML = window.compareLength['4x10ft(3.0m)']
  originalThree.innerHTML = window.length['3x10ft(3.0m)']
  discThree.innerHTML = window.compareLength['3x10ft(3.0m)']
  priceDisplay()
})
function fetchProduct (el) {
  fetch('https://titanpowerplus.com/products/' + el + '.json')
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
}
productSelectors.forEach(productSelector => {
  productSelector.addEventListener('click', async (e) => {
    const _this = productSelector
    const product = _this.getAttribute('data-product')
    const productId = _this.getAttribute('data-id')
    const count = _this.getAttribute('data-count')
    const discountMessage = _this.getAttribute('data-discount')
    productSelectors.forEach(productSelector => {
      productSelector.classList.remove('active')
    })
    _this.classList.add('active')
    window.selectLogic.productId = productId
    window.selectLogic.productHandle = product
    window.selectLogic.productCount = count
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
    mainImageChange.src = window.mainImages[productSelection]
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
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
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
    lengthSelectors.forEach(lengthSelector => {
      lengthSelector.classList.remove('active')
    })
    _this.classList.add('active')
    window.selectLogic.cableLength = lenght
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
    mainImageChange.src = window.mainImages[productSelection]
    if (pdSwitch && pdSwitch.checked) {
      originalOne.innerHTML = window.length['pd-1x' + lenght]
      discOne.innerHTML = window.compareLength['pd-1x' + lenght]
      originalTwo.innerHTML = window.length['pd-4x' + lenght]
      discTwo.innerHTML = window.compareLength['pd-4x' + lenght]
      originalThree.innerHTML = window.length['pd-3x' + lenght]
      discThree.innerHTML = window.compareLength['pd-3x' + lenght]
    } else {
      originalOne.innerHTML = window.length['1x' + lenght]
      discOne.innerHTML = window.compareLength['1x' + lenght]
      originalTwo.innerHTML = window.length['4x' + lenght]
      discTwo.innerHTML = window.compareLength['4x' + lenght]
      originalThree.innerHTML = window.length['3x' + lenght]
      discThree.innerHTML = window.compareLength['3x' + lenght]
    }
    setTimeout(() => {
      priceDisplay()
    }, '500')
  })
})
addUpsell.addEventListener('click', (e) => {
  addUpsell.classList.toggle('added')
  if (addUpsell.classList.contains('added')) {
    const addonId = addUpsell.getAttribute('data-addon')
    window.selectLogic.addon = addonId
    priceDisplay()
  } else {
    window.selectLogic.addon = ''
    priceDisplay()
  }
})
addToCarts.forEach(addToCart => {
  addToCart.addEventListener('click', (e) => {
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    const bar = document.querySelector('.js-bar')
    const atcText = document.querySelector('.js-atc-text')
    const viewCart = document.querySelector('.js-view-cart')
    bar.classList.remove('hide')
    atcText.innerHTML = 'ADDING TO CART..'
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
        if (response.status === 200) {
          console.log(addToCart, 'ok')
          setTimeout(() => {
            bar.classList.add('hide')
            viewCart.classList.remove('hidden')
            atcText.innerHTML = 'ADDED TO CART'
          }, '1000')
        }
        return response.json()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
})

const distance = $('.scroll-reveal').offset().top
$(window).scroll(function () {
  const top_of_element = $('#shopify-section-footer').offset().top
  const bottom_of_element = $('#shopify-section-footer').offset().top + $('#shopify-section-footer').outerHeight()
  const bottom_of_screen = $(window).scrollTop() + $(window).innerHeight()
  const top_of_screen = $(window).scrollTop()
  if (!(bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && $(this).scrollTop() >= distance) {
    $('.atc-fixed').addClass('show')
  } else {
    $('.atc-fixed').removeClass('show')
  }
})
