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

window.addEventListener('load', (event) => {
  const status = pdSwitch.checked
  if (!status) {
    const startCount = window.selectLogic.productCount
    window.selectLogic.productCount = 'pd-' + startCount
    const lenght = document.querySelector('.js-length-selector.active').getAttribute('data-length')
    productSelectors.forEach(productSelector => {
      const attribute = productSelector.getAttribute('data-count')
      productSelector.setAttribute('data-count', 'pd-' + attribute)
    })
    setTimeout(() => {
      priceDisplay()
      originalOne.innerHTML = window.length['pd-1x' + lenght]
      discOne.innerHTML = window.compareLength['pd-1x' + lenght]
      originalTwo.innerHTML = window.length['pd-2x' + lenght]
      discTwo.innerHTML = window.compareLength['pd-2x' + lenght]
      originalThree.innerHTML = window.length['pd-3x' + lenght]
      discThree.innerHTML = window.compareLength['pd-3x' + lenght]
    }, '500')
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
      originalOne.innerHTML = window.length['1x' + lenght]
      discOne.innerHTML = window.compareLength['1x' + lenght]
      originalTwo.innerHTML = window.length['2x' + lenght]
      discTwo.innerHTML = window.compareLength['2x' + lenght]
      originalThree.innerHTML = window.length['3x' + lenght]
      discThree.innerHTML = window.compareLength['3x' + lenght]
    }, '500')
  }
  const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
  imageChange.src = window.images[productSelection]
  mainImageChange.src = window.mainImages[productSelection]
})
if (pdSwitch) {
  pdSwitch.addEventListener('click', function () {
    const status = pdSwitch.checked
    if (!status) {
      const startCount = window.selectLogic.productCount
      window.selectLogic.productCount = 'pd-' + startCount
      const lenght = document.querySelector('.js-length-selector.active').getAttribute('data-length')
      productSelectors.forEach(productSelector => {
        const attribute = productSelector.getAttribute('data-count')
        productSelector.setAttribute('data-count', 'pd-' + attribute)
      })
      setTimeout(() => {
        priceDisplay()
        originalOne.innerHTML = window.length['pd-1x' + lenght]
        discOne.innerHTML = window.compareLength['pd-1x' + lenght]
        originalTwo.innerHTML = window.length['pd-2x' + lenght]
        discTwo.innerHTML = window.compareLength['pd-2x' + lenght]
        originalThree.innerHTML = window.length['pd-3x' + lenght]
        discThree.innerHTML = window.compareLength['pd-3x' + lenght]
      }, '500')
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
        originalOne.innerHTML = window.length['1x' + lenght]
        discOne.innerHTML = window.compareLength['1x' + lenght]
        originalTwo.innerHTML = window.length['2x' + lenght]
        discTwo.innerHTML = window.compareLength['2x' + lenght]
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
  originalOne.innerHTML = window.length['1x4ft(1.2m)']
  discOne.innerHTML = window.compareLength['1x4ft(1.2m)']
  originalTwo.innerHTML = window.length['2x4ft(1.2m)']
  discTwo.innerHTML = window.compareLength['2x4ft(1.2m)']
  originalThree.innerHTML = window.length['3x4ft(1.2m)']
  discThree.innerHTML = window.compareLength['3x4ft(1.2m)']
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
    const sliderActive = _this.getAttribute('data-slide')
    discountMessageHolder.textContent = discountMessage
    if (sliderActive === '.three') {
      document.querySelector(sliderActive).classList.add('active')
      document.querySelector(sliderActive).classList.remove('one-behind')
      document.querySelector('.two').classList.remove('active')
      document.querySelector('.two').classList.add('one-behind')
      document.querySelector('.two').classList.add('left')
      document.querySelector('.two').classList.remove('right')
      document.querySelector('.one').classList.remove('active')
      document.querySelector('.one').classList.add('one-behind')
      document.querySelector('.one').classList.add('right')
      document.querySelector('.one').classList.remove('left')
    }
    if (sliderActive === '.two') {
      document.querySelector(sliderActive).classList.add('active')
      document.querySelector(sliderActive).classList.remove('one-behind')
      document.querySelector('.one').classList.remove('active')
      document.querySelector('.one').classList.add('one-behind')
      document.querySelector('.one').classList.add('left')
      document.querySelector('.one').classList.remove('right')
      document.querySelector('.three').classList.remove('active')
      document.querySelector('.three').classList.add('one-behind')
      document.querySelector('.three').classList.add('right')
      document.querySelector('.three').classList.remove('left')
    }
    if (sliderActive === '.one') {
      document.querySelector(sliderActive).classList.add('active')
      document.querySelector(sliderActive).classList.remove('one-behind')
      document.querySelector('.two').classList.remove('active')
      document.querySelector('.two').classList.add('one-behind')
      document.querySelector('.two').classList.add('right')
      document.querySelector('.two').classList.remove('left')
      document.querySelector('.three').classList.remove('active')
      document.querySelector('.three').classList.add('one-behind')
      document.querySelector('.three').classList.add('left')
      document.querySelector('.three').classList.remove('right')
    }
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
    if (pdSwitch && !pdSwitch.checked) {
      originalOne.innerHTML = window.length['pd-1x' + lenght]
      discOne.innerHTML = window.compareLength['pd-1x' + lenght]
      originalTwo.innerHTML = window.length['pd-2x' + lenght]
      discTwo.innerHTML = window.compareLength['pd-2x' + lenght]
      originalThree.innerHTML = window.length['pd-3x' + lenght]
      discThree.innerHTML = window.compareLength['pd-3x' + lenght]
    } else {
      originalOne.innerHTML = window.length['1x' + lenght]
      discOne.innerHTML = window.compareLength['1x' + lenght]
      originalTwo.innerHTML = window.length['2x' + lenght]
      discTwo.innerHTML = window.compareLength['2x' + lenght]
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
$('.js-atc-scroll').on('click', function (e) {
  e.preventDefault()
  const $section = $('.product-template__wrapper--content__features--name')

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

const plus = document.querySelector('.js-plus')
const minus = document.querySelector('.js-minus')
const atcQty = document.querySelector('.js-atc-qty')
const qNumber = document.querySelector('.js-qty-number')
const addMore = document.querySelector('.js-add-more-message')
const rules = {
  1: 'Add 1 more for additional 10% discount',
  2: 'Add 2 more for additional 25% discount',
  3: 'Add 1 more for additional 25% discount',
  4: 'Add 4 more for additional 50% discount',
  5: 'Add 3 more for additional 50% discount',
  6: 'Add 2 more for additional 50% discount',
  7: 'Add 1 more for additional 50% discount',
  8: 'Add 1 more and get free plug'
}

if (plus) {
  plus.addEventListener('click', function () {
    const starterQ = parseInt(atcQty.getAttribute('data-quantity'))
    const newQ = starterQ + 1
    atcQty.setAttribute('data-quantity', newQ)
    qNumber.textContent = newQ
    addMore.textContent = rules[newQ]
  })
}
if (minus) {
  minus.addEventListener('click', function () {
    const starterQ = parseInt(atcQty.getAttribute('data-quantity'))
    let newQ
    if (starterQ === 1) {
      newQ = 1
    } else {
      newQ = starterQ - 1
    }
    atcQty.setAttribute('data-quantity', newQ)
    qNumber.textContent = newQ
    addMore.textContent = rules[newQ]
  })
}

// atcQty.addEventListener('click', (e) => {
//   const productSelection = window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
//   const qty = atcQty.getAttribute('data-quantity')
//   let addItems
//   if (window.selectLogic.addon !== '') {
//     addItems = [
//       {
//         id: window.products[productSelection],
//         quantity: qty
//       },
//       {
//         id: window.selectLogic.addon,
//         quantity: 1
//       }
//     ]
//   } else {
//     addItems = [
//       {
//         id: window.products[productSelection],
//         quantity: qty
//       }
//     ]
//   }
//   console.log(window.products, window.products[productSelection], productSelection)
//   const formData = {
//     items: addItems
//   }
//   fetch(window.Shopify.routes.root + 'cart/add.js', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(formData)
//   })
//     .then(response => {
//       return response.json()
//     })
//     .catch((error) => {
//       console.error('Error:', error)
//     })
// })
