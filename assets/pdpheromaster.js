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
    const productSelection = window.selectLogic.productCount
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
      const productSelection = window.selectLogic.productCount
      // mainImageChange.src = window.mainImages[productSelection]
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
      discOne.innerHTML = window.prices['4x' + selectedType]
      originalOne.innerHTML = window.comparePrices['4x' + selectedType]
      discTwo.innerHTML = window.prices['3x' + selectedType]
      originalTwo.innerHTML = window.comparePrices['3x' + selectedType]
      discThree.innerHTML = window.prices[selectedType]
      originalThree.innerHTML = window.comparePrices[selectedType]
      window.selectLogic.cableLength = lenght
      const productSelection = window.selectLogic.productCount
      // mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
    })
})

productSelectors.forEach(productSelector => {
    productSelector.addEventListener('click', async (e) => {
      const _this = productSelector
      const count = _this.getAttribute('data-count')
      const imageSwitch = _this.getAttribute('data-variant-image')
      console.log(imageSwitch, 'imageSwitch')
      mainImageChange.src = imageSwitch
      window.selectLogic.productCount = count
      const productSelection = window.selectLogic.productCount
      // mainImageChange.src = window.mainImages[productSelection]
      setTimeout(() => {
        priceDisplay()
      }, '500')
      let activeProduct = document.querySelector('.js-product-selector.active')
    })
})
let addonWrappers = document.querySelectorAll('.addon-wrapper')
let addonAdded = false
addonWrappers.forEach(addonWrapper => {
  addonWrapper.addEventListener('click', (e) => {
    addonWrapper.classList.toggle('added')
    addonWrapper.parentElement.classList.toggle('added')
    priceDisplay()
  })
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
let overlayClsTT = document.querySelectorAll('.product-popup');
overlayClsTT.forEach(overlayCl => {
  overlayCl.addEventListener('click', (e) => {
    console.log(e.target.classList, 'overlayCl');
      if(e.target.classList.contains('product-popup')) {
          e.target.classList.remove('active');
          document.querySelector('body').classList.remove('no-scroll')
          document.querySelector('html').classList.remove('no-scroll')
      }
  })
})

function getVariantId(selectedOptions, productId) {
  // Filtriranje varijanti koje se poklapaju sa selektovanim opcijama
  const matchingVariant = window.productVariants[productId].find(variant =>
    selectedOptions.every((option, index) => variant.options[index] === option)
  );
  // Vraćanje ID-a ako varijanta postoji, inače null
  return matchingVariant ? matchingVariant.id : null;
}
function getVariantPrice(selectedOptions, productId) {
  // Filtriranje varijanti koje se poklapaju sa selektovanim opcijama
  const matchingVariantPrice = window.productVariants[productId].find(variant =>
    selectedOptions.every((option, index) => variant.options[index] === option)
  );
  // Vraćanje ID-a ako varijanta postoji, inače null
  return matchingVariantPrice ? matchingVariantPrice.price : null;
}
function getVariantImage(selectedOptions, productId) {
  // Filtriranje varijanti koje se poklapaju sa selektovanim opcijama
  const matchingVariantImage = window.productVariants[productId].find(variant =>
    selectedOptions.every((option, index) => variant.options[index] === option)
  );
  // Vraćanje ID-a ako varijanta postoji, inače null
  return matchingVariantImage ? matchingVariantImage.image : null;
}
function getVariantAvailable(selectedOptions, productId) {
  // Filtriranje varijanti koje se poklapaju sa selektovanim opcijama
  const matchingVariantAvailable = window.productVariants[productId].find(variant =>
    selectedOptions.every((option, index) => variant.options[index] === option)
  );
  // Vraćanje ID-a ako varijanta postoji, inače null
  return matchingVariantAvailable ? matchingVariantAvailable.available : null;
}


let varSelect = document.querySelectorAll('.js-var-select')
if(varSelect) {
  varSelect.forEach(varS => {
    varS.addEventListener('click', (e) => {
      let nameSecond
      let nameThird
      let _this = e.target
      let productSelectors = document.querySelectorAll('.js-product-selector')
      e.target.parentNode.querySelector('.js-var-select.active')?.classList.remove('active');
      _this.classList.add('active')
      let variantName = _this.getAttribute('data-selector')
      let nameFirst = document.querySelector('.option-1.active').getAttribute('data-selector')
      if(document.querySelector('.option-2.active')) {
        nameSecond = document.querySelector('.option-2.active').getAttribute('data-selector')
      }
      if(document.querySelector('.option-3.active')) {
        nameThird = document.querySelector('.option-3.active').getAttribute('data-selector')
      }
      productSelectors.forEach(productSelector => {
        let productId = productSelector.getAttribute('data-product-selector-id')
        let id;
        let price;
        let image;
        let available;
        if(nameThird) {
          id = getVariantId([nameFirst, nameSecond, nameThird], productId)
          price = getVariantPrice([nameFirst, nameSecond, nameThird], productId)
          image = getVariantImage([nameFirst, nameSecond, nameThird], productId)
          available = getVariantAvailable([nameFirst, nameSecond, nameThird], productId)
        } else if(nameSecond) {
          id = getVariantId([nameFirst, nameSecond], productId)
          price = getVariantPrice([nameFirst, nameSecond], productId)
          image = getVariantImage([nameFirst, nameSecond], productId)
          available = getVariantAvailable([nameFirst, nameSecond], productId)
        } else {
          id = getVariantId([nameFirst], productId)
          price = getVariantPrice([nameFirst], productId)
          image = getVariantImage([nameFirst], productId)
          available = getVariantAvailable([nameFirst], productId)
        }
        productSelector.querySelector('.js-each').innerHTML = price
        mainImageChange.src = image

        const jsonData = window.productVariants[productId]
        const result = jsonData.find(item => item.options.includes(variantName));
        console.log(id, 'uddd')
        productSelector.setAttribute('data-product-id', id)
        productSelector.setAttribute('data-variant-image', image)
        if(!available) {
          document.querySelector('.js-add-to-cart-pd').classList.add('disabled')
          document.querySelector('.js-add-to-cart-pd').innerHTML = 'OUT OF STOCK'
        } else {
          document.querySelector('.js-add-to-cart-pd').classList.remove('disabled')
          document.querySelector('.js-add-to-cart-pd').innerHTML = 'ADD TO CART'
        }
      })
      let mainImage = document.querySelector('.js-main-image-change')
      let activeImage = document.querySelector('.js-product-selector.active').getAttribute('data-variant-image')
      mainImage.src = activeImage
    })
  })
}

addToCarts.forEach(addToCart => {
    addToCart.addEventListener('click', (e) => {
      if(addToCart.classList.contains('disabled')) {
        return
      }
      const productSelection = window.selectLogic.productCount
      const quantity = e.target.getAttribute('data-quantity')
      let addItems = []
      addonWrappers.forEach(addonWrapper => {
        if(addonWrapper.classList.contains('added')) {
          const addonId = addonWrapper.parentElement.getAttribute('data-addon-id')
          addItems.push({
            id: addonId,
            quantity: 1
          })
        }
      })
      addItems.push({
        id: document.querySelector('.js-product-selector.active').getAttribute('data-product-id'),
        quantity: quantity
      })
      let accSelector = document.querySelectorAll('.selected')

      accSelector.forEach(acc => {
          let product = acc.getAttribute('data-variant-id')
          console.log(acc, product, 'product selected')
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


var variantSelectorFirsts = document.querySelectorAll('.variant-selector-1');
var variantSelectorSeconds = document.querySelectorAll('.variant-selector-2');
var pdvariantSelectorFirsts = document.querySelectorAll('.pd-variant-selector-1');
var pdvariantSelectorSeconds = document.querySelectorAll('.pd-variant-selector-2');
if(variantSelectorFirsts) {
  variantSelectorFirsts.forEach(variantSelectorFirst => {
    variantSelectorFirst.addEventListener('change', function() {
      let parent = variantSelectorFirst.parentElement.parentElement;
      let variantId = variantSelectorFirst.value;
      nameFirst = variantId;
      let nameSecond;
      if(parent.querySelector('.variant-selector-2')) {
        nameSecond = parent.querySelector('.variant-selector-2').value;
      }
      if(parent.querySelector('.pd-variant-selector-2')) {
        selectedName = nameFirst + ' / ' + nameSecond;
      } else {
        selectedName = nameFirst;
      }
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPrice;
      parent.querySelector('.crossed').innerHTML = productComparePrice;
      parent.setAttribute('data-addon-id', productId);
      parent.setAttribute('data-addon-price', productPrice);
      parent.setAttribute('data-addon-compare-price', productComparePrice);
      priceDisplay();
    });
  })
}
if(pdvariantSelectorFirsts) {
  pdvariantSelectorFirsts.forEach(variantSelectorFirst => {
    variantSelectorFirst.addEventListener('change', function() {
      let parent = variantSelectorFirst.parentElement.parentElement;
      let variantId = variantSelectorFirst.value;
      nameFirst = variantId;
      let nameSecond;
      if(parent.querySelector('.variant-selector-2')) {
        nameSecond = parent.querySelector('.variant-selector-2').value;
      }
      if(parent.querySelector('.pd-variant-selector-2')) {
        selectedName = nameFirst + ' / ' + nameSecond;
      } else {
        selectedName = nameFirst;
      }
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      // parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPrice;
      // parent.querySelector('.crossed').innerHTML = productComparePrice;
      parent.setAttribute('data-product-id', productId);
      parent.setAttribute('data-product-price', productPrice);
      parent.setAttribute('data-product-compare-price', productComparePrice);
      priceDisplay();
    });
  })
}
if(variantSelectorSeconds) {
  variantSelectorSeconds.forEach(variantSelectorSecond => {
    variantSelectorSecond.addEventListener('change', function() {
      let parent = variantSelectorSecond.parentElement.parentElement;
      let variantId = variantSelectorSecond.value;
      nameFirst = parent.querySelector('.variant-selector-1').value;
      nameSecond = variantId;
      selectedName = nameFirst + ' / ' + nameSecond;
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productPriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price-cur');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      let productComparePriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price-cur');
      window.selectLogic.addon = productId
      parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPriceCur;
      parent.querySelector('.crossed').innerHTML = productComparePriceCur;
      parent.setAttribute('data-addon-id', productId);
      parent.setAttribute('data-addon-price', productPrice);
      parent.setAttribute('data-addon-compare-price', productComparePrice);
      priceDisplay();
    });
  })
}
if(pdvariantSelectorSeconds) {
  pdvariantSelectorSeconds.forEach(variantSelectorSecond => {
    variantSelectorSecond.addEventListener('change', function() {
      let parent = variantSelectorSecond.parentElement.parentElement;
      let variantId = variantSelectorSecond.value;
      nameFirst = parent.querySelector('.pd-variant-selector-1').value;
      nameSecond = variantId;
      selectedName = nameFirst + ' / ' + nameSecond;
      let productId = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-variant');
      let productPrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price');
      let productPriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-price-cur');
      let productComparePrice = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price');
      let productComparePriceCur = parent.querySelector("[data-title='" + selectedName + "']").getAttribute('data-compare-price-cur');
      window.selectLogic.addon = productId
      // parent.querySelector('.pdp-hero__pricing-price').innerHTML = productPriceCur;
      // parent.querySelector('.crossed').innerHTML = productComparePriceCur;
      parent.setAttribute('data-product-id', productId);
      parent.setAttribute('data-product-price', productPrice);
      parent.setAttribute('data-product-compare-price', productComparePrice);
      priceDisplay();
    });
  })
}

let mainVariantSelector = document.querySelector('.main-variant-selector');
if(mainVariantSelector) {
  mainVariantSelector.addEventListener('change', function() {
    let variantId = mainVariantSelector.value;
    let productId = document.querySelector("[data-title='" + variantId + "']").getAttribute('data-variant');
    let imageSwitch = document.querySelector("[data-title='" + variantId + "']").getAttribute('data-image');
    document.querySelector('.js-main-image-change').src = imageSwitch;
    window.products['1-product'] = productId;
  });
}


let ttplus = document.querySelectorAll('.tt-plus')
let ttminus = document.querySelectorAll('.tt-minus')
let ttquantity = document.querySelector('.tt-quantity')
let buyMore = document.querySelector('.js-buy-more')
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
  })
}

let gridImages = document.querySelectorAll('.js-grid-image')
gridImages.forEach(gridImage => {
  gridImage.addEventListener('click', (e) => {
    let _this = gridImage
    let imageQty = _this.getAttribute('data-image-qty')
    ttquantity.setAttribute('data-count', imageQty)
    ttquantity.textContent = imageQty
    document.querySelector('.js-add-to-cart-pd').setAttribute('data-quantity', imageQty)
    if (imageQty < 1 && buyMore) {
      imageQty = 1
    }
    if (imageQty < 2 && buyMore) {
      buyMore.textContent = 'Add 2 save 10%'
      buyMore.setAttribute('data-count', 2)
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 2 && imageQty < 4 && buyMore) {
      buyMore.textContent = 'Add 4 save 20%'
      buyMore.setAttribute('data-count', 4)
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 4 && buyMore) {
      buyMore.textContent = 'Add 8 save 35%'
      buyMore.setAttribute('data-count', 8)
      buyMore.classList.remove('hidden')
    }
    if (imageQty < 8 && buyMore) {
      buyMore.classList.remove('hidden')
    }
    if (imageQty >= 8 && buyMore) {
      buyMore.classList.add('hidden')
    }
  })
})