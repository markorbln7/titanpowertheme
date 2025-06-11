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
      const qty = _this.getAttribute('data-qty')
      if(_this.classList.contains('bundle-qty-selector')) {
        document.querySelector('.add-to-cart-bundle').setAttribute('data-quantity', qty)
        let imageUrl = _this.querySelector('.bundle-qty-image').src;
        console.log(imageUrl, 'imageUrl')
      }
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

let accTriggers = document.querySelectorAll('.acc_single_overlay');
let outputContainer = document.querySelector('.js-output');
let addBundleButton = document.querySelector('.add-bundle-cables');

const state = [];

// === Klik na .acc_single_overlay ===
accTriggers.forEach(acc => {
  acc.addEventListener('click', () => {
    const panel = acc.parentNode;
    const imageUrl = panel.querySelector('img')?.getAttribute('src');
    const bundleId = acc.getAttribute('data-bundle-variant-id');

    // Toggle selected klasu
    const isNowSelected = panel.classList.toggle('selected');

    if (isNowSelected) {
      // Dodaj novu stavku iz acc (uvek qty 1)
      state.push({
        url: imageUrl,
        bundleId,
        qty: 1,
        panel // da znamo da je acc, ne qty picker
      });
    } else {
      // Ukloni samo taj acc (po referenci panela)
      const index = state.findIndex(entry => entry.panel === panel);
      if (index !== -1) state.splice(index, 1);
    }

    rebuildOutput();
  });
});

// === Klik na dugme .add-bundle-cables ===
addBundleButton?.addEventListener('click', () => {
  const qtyHolder = document.querySelector('.bundle-qty-selector.qty-1');
  const activeQtyEl = document.querySelector('.bundle-qty-selector.active');

  const imageUrl = activeQtyEl?.querySelector('.bundle-qty-image')?.getAttribute('src');
  const bundleId = qtyHolder?.getAttribute('data-product-id');
  const qty = parseInt(activeQtyEl?.getAttribute('data-qty') || '1', 10);

  if (!bundleId || !imageUrl) return;

  // Pronađi stavku u state-u sa istim bundleId, ali iz dugmeta (panel = null)
  const existing = state.find(entry => entry.bundleId === bundleId && entry.panel === null);

  if (existing) {
    existing.qty += qty;
  } else {
    state.push({
      url: imageUrl,
      bundleId,
      qty,
      panel: null
    });
  }

  rebuildOutput();
  addBundleButton.textContent = 'ADDING...';
  addBundleButton.disabled = true;

  setTimeout(() => {
    addBundleButton.textContent = 'ADD MORE CABLES';
    addBundleButton.disabled = false;
  }, 500);
});

// === Rebuild Output Grid ===
function rebuildOutput() {
  outputContainer.innerHTML = '';

  state.forEach(entry => {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'sticky-card-product w-[50px] h-[50px] bg-white flex items-center justify-center relative';
    imgDiv.setAttribute('data-bundle-id', entry.bundleId);
    imgDiv.setAttribute('data-qty', entry.qty);

    imgDiv.innerHTML = `
      <img src="${entry.url}" class="w-full h-full object-contain" />
      <div class="absolute bg-[#c14444] flex items-center justify-center w-[16px] h-[16px] top-[-8px] right-[-8px] js-remove-product cursor-pointer text-white rounded-[50%]">x</div>
      <div class="absolute bg-[#444] text-white text-[10px] w-[16px] h-[16px] bottom-[-8px] right-[-8px] rounded-full flex items-center justify-center">${entry.qty}</div>
    `;

    // X dugme za ručno brisanje
    imgDiv.querySelector('.js-remove-product').addEventListener('click', (e) => {
      e.stopPropagation();
      const index = state.findIndex(s => s.bundleId === entry.bundleId && s.panel === entry.panel);
      if (index !== -1) state.splice(index, 1);

      // Ako je acc bio selektovan, skloni klasu
      if (entry.panel) {
        entry.panel.classList.remove('selected');
      }

      rebuildOutput();
    });

    outputContainer.appendChild(imgDiv);
  });

  // Placeholders
  const placeholdersToAdd = Math.max(6 - state.length, 0);
  for (let i = 0; i < placeholdersToAdd; i++) {
    const placeholder = document.createElement('div');
    placeholder.className = 'sticky-card-product w-[50px] h-[50px] bg-white flex items-center justify-center placeholder relative';
    placeholder.textContent = '+';
    outputContainer.appendChild(placeholder);
  }

  // Poruka za bundle
  const messageEl = document.querySelector('.js-bundle-message');
  if (messageEl) {
    const totalItems = state.reduce((acc, curr) => acc + curr.qty, 0); // +1 jer glavni proizvod

    const thresholds = [
      { count: 3, discount: '55%' },
      { count: 7, discount: '70%' },
      { count: 10, discount: '80%' }
    ];

    let nextTier = thresholds.find(t => totalItems < t.count);
    let achievedTier = thresholds.findLast(t => totalItems >= t.count);

    if (nextTier) {
      const remaining = nextTier.count - totalItems;
      messageEl.textContent = `Add ${remaining} more to get ${nextTier.discount} off`;
    } else if (achievedTier) {
      messageEl.textContent = `🎉 Congratulations! You got ${achievedTier.discount} off discount`;
    } else {
      messageEl.textContent = '';
    }
  }

}



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
function getVariantComparePrice(selectedOptions, productId) {
  // Filtriranje varijanti koje se poklapaju sa selektovanim opcijama
  const matchingVariantComparePrice = window.productVariants[productId].find(variant =>
    selectedOptions.every((option, index) => variant.options[index] === option)
  );
  // Vraćanje ID-a ako varijanta postoji, inače null
  return matchingVariantComparePrice ? matchingVariantComparePrice.comparePrice : null;
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
          comparePrice = getVariantComparePrice([nameFirst, nameSecond, nameThird], productId)
          image = getVariantImage([nameFirst, nameSecond, nameThird], productId)
          available = getVariantAvailable([nameFirst, nameSecond, nameThird], productId)
        } else if(nameSecond) {
          id = getVariantId([nameFirst, nameSecond], productId)
          price = getVariantPrice([nameFirst, nameSecond], productId)
          comparePrice = getVariantComparePrice([nameFirst, nameSecond], productId)
          image = getVariantImage([nameFirst, nameSecond], productId)
          available = getVariantAvailable([nameFirst, nameSecond], productId)
        } else {
          id = getVariantId([nameFirst], productId)
          price = getVariantPrice([nameFirst], productId)
          comparePrice = getVariantComparePrice([nameFirst], productId)
          image = getVariantImage([nameFirst], productId)
          available = getVariantAvailable([nameFirst], productId)
        }
        productSelector.querySelector('.js-each').innerHTML = price
        if(productSelector.querySelector('.js-each-compare')) {
          productSelector.querySelector('.js-each-compare').innerHTML = comparePrice
        }
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
      let productId;
      let productSelectore = document.querySelector('.js-product-selector.active');
      if(productSelectore.classList.contains('bundle-qty-selector')) {
        productId = document.querySelector('.qty-1').getAttribute('data-product-id');
      } else {
        productId = productSelectore.getAttribute('data-product-id')
      }
      addItems.push({
        id: productId,
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

const addToCartBtnBundle = document.querySelector('.add-to-cart-bundle');

addToCartBtnBundle?.addEventListener('click', async () => {
  if (state.length === 0) return;

  const items = state.map(entry => ({
    id: entry.bundleId,
    quantity: entry.qty,
    properties: {
      _bundle: 'true'
    }
  }));

  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ items })
    });

    if (!res.ok) throw new Error('Failed to add to cart');

    const data = await res.json();
    console.log('✅ Added to cart:', data);

    // Opcionalno: redirect na cart
    // window.location.href = '/cart';

    // Ili otvori cart drawer ako postoji
    // document.querySelector('cart-drawer')?.open(); (ako koristiš Shopify 2.0 drawer)

  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    alert('There was a problem adding items to cart.');
  }
});



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

const stickySection = document.querySelector('.js-output-outer');
const topTrigger = document.querySelector('.js-scroll');
const bottomTrigger = document.querySelector('.footer');

let isAboveTop = false;
let isBelowFooter = false;

function updateStickyVisibility() {
  if (!isAboveTop && !isBelowFooter) {
    stickySection.classList.remove('hidden');
  } else {
    stickySection.classList.add('hidden');
  }
}

const observerOptions = {
  root: null,
  threshold: 0,
};

const topObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    isAboveTop = !entry.isIntersecting && entry.boundingClientRect.top > 0;
    updateStickyVisibility();
  });
}, observerOptions);

const bottomObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    isBelowFooter = entry.isIntersecting;
    updateStickyVisibility();
  });
}, observerOptions);

if (topTrigger) topObserver.observe(topTrigger);
if (bottomTrigger) bottomObserver.observe(bottomTrigger);

document.querySelector('.js-output-outer')?.addEventListener('click', (e) => {
  if (e.target.closest('.js-simulate')) {
    const addToCartBtn = document.querySelector('.add-to-cart-bundle');
    if (addToCartBtn) {
      addToCartBtn.click();
    } else {
      console.warn('Add to Cart dugme nije pronađeno.');
    }
  }
});

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('.js-info-trigger-outer');
  if (!trigger) return;

  const popupId = trigger.getAttribute('data-popup-open');
  if (!popupId) return;

  const popup = document.querySelector(`.js-popup-outer[data-popup="${popupId}"]`);
  if (!popup) return;

  popup.classList.add('active'); // ili bilo koja klasa za prikaz
});

document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.js-add');
  if (!addBtn) return;

  const popup = addBtn.closest('.js-popup-outer');
  if (!popup) return;

  const popupId = popup.getAttribute('data-popup');
  if (!popupId) return;

  // Nađi acc_single_overlay koji ima taj popup-id
  const accTrigger = document.querySelector(`.acc_single_overlay[data-popup-id="${popupId}"]`);
  if (accTrigger) {
    accTrigger.click();
    popup.classList.remove('active');
  } else {
    console.warn('Nema acc_single_overlay sa odgovarajućim data-popup-id:', popupId);
  }
});

let toggleBundle = document.querySelector('.js-toggle-bundle');
let toggleProduct = document.querySelector('.js-toggle-product');

console.log('toggleBundle', toggleBundle);

toggleBundle.addEventListener('click', (e) => {
  console.log('toggleBundle clicked');
  let allBundles = document.querySelectorAll('.bundle-display');
  let allProducts = document.querySelectorAll('.product-display');
  allBundles.forEach(bundle => {
    bundle.classList.remove('hidden');
  });
  allProducts.forEach(product => {
    product.classList.add('hidden');
  });

  toggleBundle.classList.add('selected-tab');
  toggleProduct.classList.remove('selected-tab');
  let extraAdds = document.querySelectorAll('.pdp-hero__extra-add');
  extraAdds.forEach(extraAdd => {
    extraAdd.classList.remove('active');
  });
  let target = document.querySelector('.qty-1');
  if (target) {
    target.classList.add('active');
  }
});

toggleProduct.addEventListener('click', (e) => {
  let allBundles = document.querySelectorAll('.bundle-display');
  let allProducts = document.querySelectorAll('.product-display');
  let allCollections =  document.querySelectorAll('.collection-trigger');
  allBundles.forEach(bundle => {
    bundle.classList.add('hidden');
  });
  allProducts.forEach(product => {
    product.classList.remove('hidden');
  });

  toggleProduct.classList.add('selected-tab');
  toggleBundle.classList.remove('selected-tab');
  let extraAdds = document.querySelectorAll('.pdp-hero__extra-add');
  extraAdds.forEach(extraAdd => {
    extraAdd.classList.remove('active');
  });
  allCollections.forEach(allCollections => {
    allCollections.classList.remove('selected');
  });
  let target = document.querySelector('.pdp-hero__extra-add[data-count="3-product"]');
  if (target) {
    target.classList.add('active');
  }
});
