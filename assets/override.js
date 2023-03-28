/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
console.log('thisss')
window.selectLogic = {
  productCount: '3x',
  productHandle: '',
  productId: '',
  phoneType: 'iPhone',
  cableLength: '10ft(3.0m)',
  addon: ''
}
const productSelectors = document.querySelectorAll('.js-product-selector')
const typeSelectors = document.querySelectorAll('.js-type-selector')
const lengthSelectors = document.querySelectorAll('.js-length-selector')
const addToCarts = document.querySelectorAll('.js-atc')
const price = document.querySelector('.js-price')
const crossedPrice = document.querySelector('.js-crossed-price')
const addUpsell = document.querySelector('.js-add')
const imageChange = document.querySelector('.js-image-change')
// const swiper2 = new Swiper('.mySwiperSecond', {
//   slidesPerView: 3,
//   spaceBetween: 30,
//   centeredSlides: true,
//   loop: true
// })
// swiper2.slideTo(1, '100', true)
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
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
    const sliderActive = _this.getAttribute('data-slide')
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
    console.log(window.images[productSelection], productSelection, 'productSelectionproductSelectionproductSelectionproductSelection')
    imageChange.src = window.images[productSelection]
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
    const productSelection = window.selectLogic.productCount + window.selectLogic.phoneType + '/' + window.selectLogic.cableLength
    imageChange.src = window.images[productSelection]
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
