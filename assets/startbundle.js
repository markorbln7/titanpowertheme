const pos = document.querySelectorAll('.po')
const titleArray = []
let optionNames = document.querySelectorAll('.js-option-name')
const popUpControler = document.querySelector('.product-popup__wrapper')
const popUpLoadControler = document.querySelector('.product-addtocart')
const popUpAnimationControler = document.querySelector('.product-popup__animation')
const close = document.querySelector('.close')
const increases = document.querySelectorAll('.increase')
const decreases = document.querySelectorAll('.decrease')
let calculatePrice = function () {
    let price = 0
    const pricesSelectors = document.querySelectorAll('.js-variant-selector.selected')
    console.log(pricesSelectors, 'pricesSelectors')
    pricesSelectors.forEach((pricesSelector) => {
        pricenumber = pricesSelector.getAttribute('data-price')
        console.log(parseFloat(pricenumber), 'pricenumberfloat')
        let priceqy = pricesSelector.getAttribute('data-quantity')
        price = (parseFloat(pricenumber) * parseFloat(priceqy))  + price
    })
    document.querySelector('.saved-price').innerHTML = price
    console.log(price, 'price')
}
increases.forEach((increas) => {
  increas.addEventListener('click', (e) => {
    const _this = e.target
    const parentSelector = _this.parentNode.parentNode
    const mainWrapper = _this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    console.log(mainWrapper, parentSelector, 'parentSelector')
    const inputSelector = parentSelector.querySelector('.js-variant-selector')
    const inputValue = parentSelector.querySelector('.c-quantity__amount')
    const value = inputSelector.getAttribute('data-quantity')
    const newValue = parseInt(value) + 1
    inputSelector.setAttribute('data-quantity', newValue)
    inputValue.innerHTML = newValue
    if(newValue > 0) {
      mainWrapper.classList.add('selected')
      inputSelector.classList.add('selected')
      mainWrapper.querySelector('.decrease').classList.remove('gray')
      mainWrapper.querySelector('.c-quantity__amount').classList.remove('op')
    }
    const bar = document.querySelector(".bar");
    selectedItems = document.querySelectorAll('.js-variant-selector.selected')
            let numberOfSelected = 0
            selectedItems.forEach((selectedItem) => {
               selectedNumber = selectedItem.getAttribute('data-quantity')
               numberOfSelected = numberOfSelected + parseInt(selectedNumber)
            })
            //let numberOfSelected = document.querySelectorAll('.js-variant-selector.selected').length
            let leftToGift = 14 - numberOfSelected;
            console.log(leftToGift,'leftToGift')
            if(leftToGift === 14) {
              bar.style.setProperty("--progress", "15%");
              infoBar.innerHTML = `ADD 5 AND SAVE 55%`
      }
      if(leftToGift === 13) {
              bar.style.setProperty("--progress", "30%");
              infoBar.innerHTML = `ADD 4 AND SAVE 55%`
      }
        if(leftToGift === 12) {
                bar.style.setProperty("--progress", "55%");
                infoBar.innerHTML = `ADD 3 AND SAVE 55%`
        }
        if(leftToGift === 11) {
                bar.style.setProperty("--progress", "75%");
                infoBar.innerHTML = `ADD 2 MORE AND SAVE 55%`
        }
        if(leftToGift === 10) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `ADD 1 MORE AND SAVE 55%`
        }
        if(leftToGift === 9) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 3 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 8) {
            bar.style.setProperty("--progress", "75%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 2 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 7) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 1 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 6) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 6 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 5) {
            bar.style.setProperty("--progress", "60%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 5 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 4) {
            bar.style.setProperty("--progress", "70%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 4 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 3) {
            bar.style.setProperty("--progress", "80%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 3 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 2) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 2 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 1) {
            bar.style.setProperty("--progress", "95%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 1 MORE AND SAVE 80%</span>`
        }
        if(leftToGift <= 0) {
            bar.style.setProperty("--progress", "100%");
            infoBar.innerHTML = `YOU SAVED 80%!!`
        }
  })
})
decreases.forEach((decrease) => {
  decrease.addEventListener('click', (e) => {
    const _this = e.target
    const parentSelector = _this.parentNode.parentNode
    const mainWrapper = _this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    console.log(parentSelector, 'parentSelector')
    const inputSelector = parentSelector.querySelector('.js-variant-selector')
    const inputValue = parentSelector.querySelector('.c-quantity__amount')
    const value = inputSelector.getAttribute('data-quantity')
    let newValue = parseInt(value) - 1
    if(newValue == 0) {
      mainWrapper.classList.remove('selected')
      inputSelector.classList.remove('selected')
      mainWrapper.querySelector('.decrease').classList.add('gray')
      mainWrapper.querySelector('.c-quantity__amount').classList.add('op')
    }
    if(newValue < 0) {
      return
    }
    inputSelector.setAttribute('data-quantity', newValue)
    inputValue.innerHTML = newValue
    const bar = document.querySelector(".bar");
    selectedItems = document.querySelectorAll('.js-variant-selector.selected')
            let numberOfSelected = 0
            selectedItems.forEach((selectedItem) => {
               selectedNumber = selectedItem.getAttribute('data-quantity')
               numberOfSelected = numberOfSelected + parseInt(selectedNumber)
            })
            //let numberOfSelected = document.querySelectorAll('.js-variant-selector.selected').length
            let leftToGift = 14 - numberOfSelected;
            console.log(leftToGift,'leftToGift')
            if(leftToGift === 14) {
              bar.style.setProperty("--progress", "15%");
              infoBar.innerHTML = `ADD 5 AND SAVE 55%`
      }
      if(leftToGift === 13) {
              bar.style.setProperty("--progress", "30%");
              infoBar.innerHTML = `ADD 4 AND SAVE 55%`
      }
        if(leftToGift === 12) {
                bar.style.setProperty("--progress", "55%");
                infoBar.innerHTML = `ADD 3 AND SAVE 55%`
        }
        if(leftToGift === 11) {
                bar.style.setProperty("--progress", "75%");
                infoBar.innerHTML = `ADD 2 MORE AND SAVE 55%`
        }
        if(leftToGift === 10) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `ADD 1 MORE AND SAVE 55%`
        }
        if(leftToGift === 9) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 3 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 8) {
            bar.style.setProperty("--progress", "75%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 2 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 7) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 1 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 6) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 6 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 5) {
            bar.style.setProperty("--progress", "60%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 5 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 4) {
            bar.style.setProperty("--progress", "70%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 4 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 3) {
            bar.style.setProperty("--progress", "80%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 3 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 2) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 2 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 1) {
            bar.style.setProperty("--progress", "95%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 1 MORE AND SAVE 80%</span>`
        }
        if(leftToGift <= 0) {
            bar.style.setProperty("--progress", "100%");
            infoBar.innerHTML = `YOU SAVED 80%!!`
        }
  })
})
close.addEventListener('click', (e) => {
  popUpControler.classList.toggle('hidden')
  body.classList.toggle('overflow-hidden')
})

pos.forEach((po) => {
  const name = po.getAttribute('data-value')
  const position = po.getAttribute('data-position')
  titleArray[position] = name
  po.addEventListener('click', (e) => {
    let variantName = ''
    const _this = e.target
    const divSelector = _this.parentNode.parentNode.parentNode.parentNode
    const parentSelector = divSelector.parentNode
    const siblings = _this.parentNode.parentNode.children
    console.log(siblings, 'RODJACI')
    for (let i = 0; i < siblings.length; i++) {
      siblings[i].classList.remove('active')
    }
    _this.parentNode.classList.add('active')
    const position = _this.getAttribute('data-position')
    const name = _this.getAttribute('data-value')
    const nameSelector = _this.parentNode.parentNode.parentNode
    const variantSelector = _this.parentNode.parentNode
    let setOptionName = nameSelector.querySelector('.js-option-name')
    variantSelector.classList.remove('open')
    document.querySelector('body').classList.remove('no-scroll');
    setOptionName.innerHTML = name
    console.log(nameSelector, name, 'NAME')
    const active = parentSelector.querySelectorAll('.active')
    console.log(active, 'ACTIVE')
    if (active.length > 1) {
      console.log('VISE OD 1')
      for (let i = 0; i < active.length; i++) {
        const name = active[i].getAttribute('data-value')
        const position = active[i].getAttribute('data-position')
        titleArray[position] = name
      }
    } else {
      console.log('SAMO 1')
      titleArray[position] = name
    }
    console.log(titleArray, 'titleArray')

    console.log(titleArray, 'titleArray')
    for (let i = 0; i < titleArray.length; i++) {
      variantName += `${titleArray[i]} / `
    }
    const variantSelectorName = variantName.slice(0, -3)
    const selectedVariant = divSelector.querySelector(`[data-title="${variantSelectorName}"]`)
    console.log(variantSelectorName, selectedVariant)
    const selectedVariantId = selectedVariant.getAttribute('data-variant')
    const selectedVariantImage = selectedVariant.getAttribute('data-variant-image')
    const imageSelector = divSelector.parentNode.parentNode.parentNode.querySelector('.bundle-wrapper__product--image img')
    const selectedVariantPrice = selectedVariant.getAttribute('data-price')
    const selectedVariantComparePrice = selectedVariant.getAttribute('data-compare-price')
    const buttonSelector = divSelector.querySelector('.js-variant-selector')
    const priceSelector = divSelector.querySelector('.js-price')
    const comparePriceSelector = divSelector.querySelector('.js-red-price')
    buttonSelector.setAttribute('data-variant-id', selectedVariantId)
    console.log(selectedVariantImage, 'selectedVariantImage')
    if(!selectedVariantImage.includes('no-image')){
      imageSelector.setAttribute('src', selectedVariantImage)
    }
    priceSelector.innerHTML = selectedVariantPrice
    comparePriceSelector.innerHTML = selectedVariantComparePrice
    console.log('selectedVariantId', selectedVariantId)
    console.log(titleArray, 'titleArray')
  })
})
const addToCart = document.querySelector('.js-add-to-cart')
const addToCartSticky = document.querySelector('.js-add-to-cart-sticky')
let addItems = (selector) => {
  const variantsPickers = document.querySelectorAll('.js-variant-selector.selected')
  const productIds = []
  let addItems = []
  if(selector) {
    productIds.push('43165644488882')
  }
  variantsPickers.forEach((variantsPicker) => {
    productIds.push(variantsPicker.getAttribute('data-variant-id'))
  })
  console.log(productIds, 'productIds')
  productIds.forEach((productId) => {
    const item = {
      id: productId,
      quantity: 1
    }
    addItems.push(item)
  })
  console.log(addItems, 'addItems')
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
}
let addItemsCheckout = (selector) => {
  const variantsPickers = document.querySelectorAll('.js-variant-selector.selected')
  const productIds = []
  let addItems = []
  if(selector) {
    productIds.push('43165644488882')
  }
  variantsPickers.forEach((variantsPicker) => {
    productIds.push(variantsPicker.getAttribute('data-quantity') + variantsPicker.getAttribute('data-variant-id'))
  })
  console.log(productIds, 'productIds')
  productIds.forEach((productId) => {
    const item = {
      id: productId.substring(1),
      quantity: productId.slice(0, 1)
    }
    addItems.push(item)
  })
  console.log(addItems, 'addItems')
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
}
addToCart.addEventListener('click', (e) => {
  let numberOfSelected = document.querySelectorAll('.js-variant-selector.selected').length
  addItemsCheckout()
})
addToCartSticky.addEventListener('click', (e) => {
  let numberOfSelected = document.querySelectorAll('.js-variant-selector.selected').length
  addItemsCheckout()
})
const infoBar = document.querySelector('.js-info-bar')
const variantClicks = document.querySelectorAll('.js-variant-selector')
variantClicks.forEach(variantClick => {
    variantClick.addEventListener('click', (e) => {
        const bar = document.querySelector(".bar");
        console.log('click')
        const _this = e.target
        _this.closest(".bundle-wrapper__product").classList.toggle('selected');
        if(_this.value === 'added') {
            _this.classList.remove('selected')
            _this.value = '+ add to kit'
            selectedItems = document.querySelectorAll('.js-variant-selector.selected')
            let numberOfSelected = 0
            selectedItems.forEach((selectedItem) => {
               selectedNumber = selectedItem.getAttribute('data-quantity')
               numberOfSelected = numberOfSelected + parseInt(selectedNumber)
            })
            //let numberOfSelected = document.querySelectorAll('.js-variant-selector.selected').length
            let leftToGift = 14 - numberOfSelected;
            console.log(leftToGift,'leftToGift')
            if(leftToGift === 14) {
              bar.style.setProperty("--progress", "15%");
              infoBar.innerHTML = `ADD 5 AND SAVE 55%`
      }
      if(leftToGift === 13) {
              bar.style.setProperty("--progress", "30%");
              infoBar.innerHTML = `ADD 4 AND SAVE 55%`
      }
        if(leftToGift === 12) {
                bar.style.setProperty("--progress", "55%");
                infoBar.innerHTML = `ADD 3 AND SAVE 55%`
        }
        if(leftToGift === 11) {
                bar.style.setProperty("--progress", "75%");
                infoBar.innerHTML = `ADD 2 MORE AND SAVE 55%`
        }
        if(leftToGift === 10) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `ADD 1 MORE AND SAVE 55%`
        }
        if(leftToGift === 9) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 3 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 8) {
            bar.style.setProperty("--progress", "75%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 2 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 7) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 1 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 6) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 6 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 5) {
            bar.style.setProperty("--progress", "60%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 5 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 4) {
            bar.style.setProperty("--progress", "70%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 4 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 3) {
            bar.style.setProperty("--progress", "80%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 3 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 2) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 2 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 1) {
            bar.style.setProperty("--progress", "95%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 1 MORE AND SAVE 80%</span>`
        }
        if(leftToGift <= 0) {
            bar.style.setProperty("--progress", "100%");
            infoBar.innerHTML = `YOU SAVED 80%!!`
        }
            
            return
        }
        _this.classList.add('selected')
        _this.value = 'added'
        selectedItems = document.querySelectorAll('.js-variant-selector.selected')
          let numberOfSelected = 0
          selectedItems.forEach((selectedItem) => {
              selectedNumber = selectedItem.getAttribute('data-quantity')
              numberOfSelected = numberOfSelected + parseInt(selectedNumber)
          })
          let leftToGift = 14 - numberOfSelected;
          console.log(leftToGift,'leftToGift')
          if(leftToGift === 14) {
            bar.style.setProperty("--progress", "15%");
            infoBar.innerHTML = `ADD 5 AND SAVE 55%`
    }
    if(leftToGift === 13) {
            bar.style.setProperty("--progress", "30%");
            infoBar.innerHTML = `ADD 4 AND SAVE 55%`
    }
      if(leftToGift === 12) {
              bar.style.setProperty("--progress", "55%");
              infoBar.innerHTML = `ADD 3 AND SAVE 55%`
      }
      if(leftToGift === 11) {
              bar.style.setProperty("--progress", "75%");
              infoBar.innerHTML = `ADD 2 MORE AND SAVE 55%`
      }
      if(leftToGift === 10) {
          bar.style.setProperty("--progress", "90%");
          infoBar.innerHTML = `ADD 1 MORE AND SAVE 55%`
      }
      if(leftToGift === 9) {
          bar.style.setProperty("--progress", "50%");
          infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 3 MORE AND SAVE 70%</span>`
      }
      if(leftToGift === 8) {
          bar.style.setProperty("--progress", "75%");
          infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 2 MORE AND SAVE 70%</span>`
      }
      if(leftToGift === 7) {
          bar.style.setProperty("--progress", "90%");
          infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 1 MORE AND SAVE 70%</span>`
      }
      if(leftToGift === 6) {
          bar.style.setProperty("--progress", "50%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 6 MORE AND SAVE 80%</span>`
      }
      if(leftToGift === 5) {
          bar.style.setProperty("--progress", "60%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 5 MORE AND SAVE 80%</span>`
      }
      if(leftToGift === 4) {
          bar.style.setProperty("--progress", "70%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 4 MORE AND SAVE 80%</span>`
      }
      if(leftToGift === 3) {
          bar.style.setProperty("--progress", "80%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 3 MORE AND SAVE 80%</span>`
      }
      if(leftToGift === 2) {
          bar.style.setProperty("--progress", "90%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 2 MORE AND SAVE 80%</span>`
      }
      if(leftToGift === 1) {
          bar.style.setProperty("--progress", "95%");
          infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 1 MORE AND SAVE 80%</span>`
      }
      if(leftToGift <= 0) {
          bar.style.setProperty("--progress", "100%");
          infoBar.innerHTML = `YOU SAVED 80%!!`
      }

        
        console.log(leftToGift, numberOfSelected, 'numberOfSelected')
    })
});

console.log(optionNames, 'optionNames')
optionNames.forEach((optionName) => {
    optionName.addEventListener('click', (e) => {
        const _this = e.target
        _this.nextSibling.nextSibling.classList.toggle('open');
        document.querySelector('body').classList.toggle('no-scroll');
    })
}) 
console.log($('.hero_image'), 'hero_image')
$('.hero_image').on('click', function (e) {
  e.preventDefault()
  const $section = $('.js-info-bar')

  $('html, body').animate({
    scrollTop: $section.offset().top + 'px'
  }, 1000)
})

const distance = $('.sticky-div').offset().top
$(window).scroll(function () {
  const top_of_element = $('#shopify-section-footer').offset().top
  const bottom_of_element = $('#shopify-section-footer').offset().top + $('#shopify-section-footer').outerHeight()
  const bottom_of_screen = $(window).scrollTop() + $(window).innerHeight()
  const top_of_screen = $(window).scrollTop()
  if (!(bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && $(this).scrollTop() >= distance) {
    $('.sticky-div').addClass('lightsticky')
  } else {
    $('.sticky-div').removeClass('lightsticky')
  }
})


const startBundles = document.querySelectorAll('.js-start-bundles')
const bundleProductsSelectors = document.querySelectorAll('.bundle-wrapper__product')

startBundles.forEach((startBundle) => {
    startBundle.addEventListener('click', (e) => {  
        console.log('click')
        const _this = e.target
        const arrayString = _this.getAttribute('data-ids')
        const array = arrayString.split(',')
        const newArray = []
        for (let i = 0; i < array.length; i++) {
          let id = array[i].slice(1)
          let q = parseInt(array[i].slice(0, 1))
          bundleProductsSelectors.forEach((bundleProductsSelector) => {
            let productIdSelector = bundleProductsSelector.getAttribute('data-product-id')
            if( id == productIdSelector ) {
              bundleProductsSelector.classList.add('selected')
              bundleProductsSelector.querySelector('.js-variant-selector').classList.add('selected')
              bundleProductsSelector.querySelector('.decrease').classList.remove('gray')
              bundleProductsSelector.querySelector('.c-quantity__amount').classList.remove('op')
              let oldQuantity = bundleProductsSelector.querySelector('.js-variant-selector').getAttribute('data-quantity')
              let newQuantity = parseInt(oldQuantity) + q
              bundleProductsSelector.querySelector('.js-variant-selector').setAttribute('data-quantity', newQuantity)
              bundleProductsSelector.querySelector('.c-quantity__amount').innerHTML = newQuantity
              
            }
          })
        }
        console.log(array, newArray, 'array')
        const bar = document.querySelector(".bar");
        // bundleProductsSelectors.forEach((bundleProductsSelector) => {
        //     let productIdSelector = bundleProductsSelector.getAttribute('data-product-id')
        //     if(array.includes(productIdSelector)) {
        //         bundleProductsSelector.classList.add('selected')
        //         bundleProductsSelector.querySelector('.js-variant-selector').classList.add('selected')
        //         let oldQuantity = bundleProductsSelector.querySelector('.js-variant-selector').getAttribute('data-quantity')
        //         let newQuantity = parseInt(oldQuantity) + 1
        //         bundleProductsSelector.querySelector('.js-variant-selector').setAttribute('data-quantity', newQuantity)
        //         bundleProductsSelector.querySelector('.c-quantity__amount').innerHTML = newQuantity
                
        //     }
        // })
        selectedItems = document.querySelectorAll('.js-variant-selector.selected')
        let numberOfSelected = 0
        selectedItems.forEach((selectedItem) => {
            selectedNumber = selectedItem.getAttribute('data-quantity')
            numberOfSelected = numberOfSelected + parseInt(selectedNumber)
        })
        console.log(selectedItems,'selectedItems')
        let leftToGift = 14 - numberOfSelected;
        console.log(leftToGift,'leftToGift')
        if(leftToGift === 14) {
            bar.style.setProperty("--progress", "15%");
            infoBar.innerHTML = `ADD 5 AND SAVE 55%`
        }
        if(leftToGift === 13) {
                bar.style.setProperty("--progress", "30%");
                infoBar.innerHTML = `ADD 4 AND SAVE 55%`
        }
        if(leftToGift === 12) {
                bar.style.setProperty("--progress", "55%");
                infoBar.innerHTML = `ADD 3 AND SAVE 55%`
        }
        if(leftToGift === 11) {
                bar.style.setProperty("--progress", "75%");
                infoBar.innerHTML = `ADD 2 MORE AND SAVE 55%`
        }
        if(leftToGift === 10) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `ADD 1 MORE AND SAVE 55%`
        }
        if(leftToGift === 9) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 3 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 8) {
            bar.style.setProperty("--progress", "75%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 2 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 7) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 55%! <span class="color-white">ADD 1 MORE AND SAVE 70%</span>`
        }
        if(leftToGift === 6) {
            bar.style.setProperty("--progress", "50%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 6 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 5) {
            bar.style.setProperty("--progress", "60%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 5 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 4) {
            bar.style.setProperty("--progress", "70%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 4 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 3) {
            bar.style.setProperty("--progress", "80%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 3 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 2) {
            bar.style.setProperty("--progress", "90%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 2 MORE AND SAVE 80%</span>`
        }
        if(leftToGift === 1) {
            bar.style.setProperty("--progress", "95%");
            infoBar.innerHTML = `YOU SAVED 70%! <span class="color-white">ADD 1 MORE AND SAVE 80%</span>`
        }
        if(leftToGift <= 0) {
            bar.style.setProperty("--progress", "100%");
            infoBar.innerHTML = `YOU SAVED 80%!!`
        }
          const $section = $('.selected')

          $('html, body').animate({
            scrollTop: $section.offset().top + 'px'
          }, 1000)
    })
})
    

const bundleTabs = document.querySelectorAll('.js-bundle-tab')
const singleTabs = document.querySelectorAll('.bundle-tab__tabs--content')

console.log(bundleTabs, 'bundleTabs')

bundleTabs.forEach((bundleTab) => {
    bundleTab.addEventListener('click', (e) => {
        let _this = e.target
        console.log(singleTabs, 'singleTabs')
        singleTabs.forEach((singleTab) => {
            singleTab.classList.remove('active')
        })
        bundleTabs.forEach((bundleTab) => {
            bundleTab.classList.remove('active')
        })
        _this.classList.add('active')
        let activeSelector = _this.getAttribute('data-tab')
        document.querySelector(activeSelector).classList.add('active')
    })
})