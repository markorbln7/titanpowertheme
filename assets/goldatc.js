$(document).ready(function() {
    console.log('ready')
      $.ajax({
        type: "POST",
        url: '/cart/clear.js',
        success: function(){
          console.log('I cleared the cart!');
        },
        dataType: 'json'
    });
});

  const increases = document.querySelectorAll('.increase')
let updateCart = (itemId, q) => {
    let updateObject = {};
    let nameKey = itemId
    updateObject[nameKey] = q;
    console.log(updateObject, 'updateObject')
    jQuery.post('/cart/update.js', {updates:{...updateObject}}); 
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
        const variantId = inputSelector.getAttribute('data-variant-id')
        updateCart(variantId, newValue)
        setTimeout(() => {
            let getCart = () => {
                fetch(window.Shopify.routes.root + 'cart.js')
                    .then(
                            response => response.json(),
                        )
                        .then(
                            data => { 
                                let bar = document.querySelector(".js-info-bar");
                                let currency = data.currency;
                                if(currency == 'USD') {
                                    currency = '$'
                                }
                                let itemCount = 0;
                                let giftCount = 0;
                                for (let i = 0; i < data.items.length; i++) {
                                    if(data.items[i].properties._source != "Rebuy") {
                                        itemCount += data.items[i].quantity
                                        giftCount += (data.items[i].final_price * data.items[i].quantity)
                                    }
                                }
                                console.log(giftCount, itemCount, 'itemCount')
                                for (let i = 0; i < itemCount; i++) {
                                    console.log(i, 'iiiiiiiii')
                                    let dataSelectorVariable = `[data-${i+1}]`
                                    let dataLineVariable = `[data-line-${i}]`
                                    let globeClass = document.querySelector(dataSelectorVariable)
                                    let lineClass = document.querySelector(dataLineVariable)
                                    if (lineClass) {
                                        lineClass.classList.add('active')
                                    }
                                    setTimeout(() => {
                                        globeClass.classList.add('active')
                                    }, "1000");
                                }
                                
                                
                                
                                if(itemCount < 2) {
                                    ToGoal = 3
                                    percent = '55%'
                                }
                                if(itemCount > 2 && itemCount < 5) {
                                    ToGoal = 6
                                    percent = '60%'
                                }
                                if(itemCount > 5 && itemCount < 10) {
                                    ToGoal = 10
                                    percent = '70%'
                                }
                                let leftItems = ToGoal - itemCount;
                                if(leftItems > 0) {
                                    bar.innerHTML = `You have ${itemCount} items, </br> add ${leftItems} more for ${percent} off!`
                                } else {
                                    bar.innerHTML = `You unlocked full 70% OFF discount!!`
                                }

                                let firstGift = document.querySelector('.js-first-gift').getAttribute('data-gift')
                                let secondGift = document.querySelector('.js-second-gift').getAttribute('data-gift')
                                let thirdGift = document.querySelector('.js-third-gift').getAttribute('data-gift')
                                let fourthGift = document.querySelector('.js-fourth-gift').getAttribute('data-gift')
                                let giftChange = document.querySelector('.js-left-to-gift')
                                let jsImageChange = document.querySelector('.js-image-change')
                                let circle = document.querySelector('.circle-chart__circle')

                                if(giftCount < firstGift) {
                                    let giftLeft = firstGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-first-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/firstGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if(giftCount > firstGift && giftCount < secondGift) {
                                    let giftLeft = secondGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-second-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/secondGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if(giftCount > secondGift && giftCount < thirdGift) {
                                    let giftLeft = thirdGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-third-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/thirdGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if (giftCount > thirdGift && giftCount < fourthGift) {
                                    let giftLeft = fourthGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-fourth-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/fourthGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else {
                                    document.querySelector('.gift-tracker').classList.add('hide')
                                }
                            
                                
                                return data 
                            });
            }
            getCart();
        }, "1000");
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
      const variantId = inputSelector.getAttribute('data-variant-id')
      updateCart(variantId, newValue)
      setTimeout(() => {
        let getCart = () => {
            fetch(window.Shopify.routes.root + 'cart.js')
                .then(response => response.json())
                    .then(
                        data => { 
                            let bar = document.querySelector(".js-info-bar");
                            let currency = data.currency;
                            if(currency == 'USD') {
                                currency = '$'
                            }
                            let itemCount = 0;
                            let giftCount = 0;
                                for (let i = 0; i < data.items.length; i++) {
                                    if(data.items[i].properties._source != "Rebuy") {
                                        itemCount += data.items[i].quantity
                                        giftCount += (data.items[i].final_price * data.items[i].quantity)
                                    }
                                }
                            console.log(giftCount, itemCount, 'itemCount')
                            let dataSelectorVariable = `[data-${itemCount+1}]`
                            let dataLineVariable = `[data-line-${itemCount}]`
                            let globeClass = document.querySelector(dataSelectorVariable)
                            let lineClass = document.querySelector(dataLineVariable)
                            globeClass.classList.remove('active')
                            if(lineClass) {
                                lineClass.classList.remove('active')
                            }
                            if(itemCount < 2) {
                                ToGoal = 3
                                percent = '55%'
                            }
                            if(itemCount > 2 && itemCount < 5) {
                                ToGoal = 6
                                percent = '60%'
                            }
                            if(itemCount > 5 && itemCount < 10) {
                                ToGoal = 10
                                percent = '70%'
                            }
                            let leftItems = ToGoal - itemCount;
                            if(leftItems > 0) {
                                bar.innerHTML = `You have ${itemCount} items, </br> add ${leftItems} more for ${percent} off!`
                            } else {
                                bar.innerHTML = `You unlocked full 70% OFF discount!!`
                            }

                            let firstGift = document.querySelector('.js-first-gift').getAttribute('data-gift')
                            let secondGift = document.querySelector('.js-second-gift').getAttribute('data-gift')
                            let thirdGift = document.querySelector('.js-third-gift').getAttribute('data-gift')
                            let fourthGift = document.querySelector('.js-fourth-gift').getAttribute('data-gift')
                            let giftChange = document.querySelector('.js-left-to-gift')
                            let jsImageChange = document.querySelector('.js-image-change')
                            let circle = document.querySelector('.circle-chart__circle')
                            if(giftCount == 0) {
                                giftChange.innerHTML = `${currency}${firstGift/100}}`
                                jsImageChange.src = document.querySelector('.js-first-gift').getAttribute('data-image')
                            }
                            if(giftCount < firstGift) {
                                let giftLeft = firstGift - giftCount
                                giftChange.innerHTML = `${currency}${giftLeft/100}`
                                jsImageChange.src = document.querySelector('.js-first-gift').getAttribute('data-image')
                                circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/firstGift)*540)
                                document.querySelector('.gift-tracker').classList.remove('hide')
                            } else if(giftCount > firstGift && giftCount < secondGift) {
                                let giftLeft = secondGift - giftCount
                                giftChange.innerHTML = `${currency}${giftLeft/100}`
                                jsImageChange.src = document.querySelector('.js-second-gift').getAttribute('data-image')
                                circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/secondGift)*540)
                                document.querySelector('.gift-tracker').classList.remove('hide')
                            } else if(giftCount > secondGift && giftCount < thirdGift) {
                                let giftLeft = thirdGift - giftCount
                                giftChange.innerHTML = `${currency}${giftLeft/100}`
                                jsImageChange.src = document.querySelector('.js-third-gift').getAttribute('data-image')
                                circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/thirdGift)*540)
                                document.querySelector('.gift-tracker').classList.remove('hide')
                            } else if (giftCount > thirdGift && giftCount < fourthGift) {
                                let giftLeft = fourthGift - giftCount
                                giftChange.innerHTML = `${currency}${giftLeft/100}`
                                jsImageChange.src = document.querySelector('.js-fourth-gift').getAttribute('data-image')
                                circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/fourthGift)*540)
                                document.querySelector('.gift-tracker').classList.remove('hide')
                            } else {
                                document.querySelector('.gift-tracker').classList.add('hide')
                            }
                            return data 
                        });
        }
        getCart();
    }, "1000");
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
    })
  })


const startBundles = document.querySelectorAll('.js-start-bundles')
const bundleProductsSelectors = document.querySelectorAll('.bundle-wrapper__product')

startBundles.forEach((startBundle) => {
    startBundle.addEventListener('click', (e) => {  
        console.log('click')
        const _this = e.target
        const arrayString = _this.getAttribute('data-ids')
        const array = arrayString.split(',')
        console.log(array, 'array')
        const newArray = []
        let updateObject = {};
        for (let i = 0; i < array.length; i++) {
            let id = array[i].slice(1)
            let q = parseInt(array[i].slice(0, 1))
            let idSelector = document.querySelector("[data-product-id='" + id + "']")
            let productIdSelector = idSelector.querySelector('.js-variant-selector').getAttribute('data-variant-id')
            console.log(productIdSelector, idSelector, 'idSelector')
            let nameKey = productIdSelector;
            updateObject[nameKey] = q;
            console.log(updateObject, 'updateObject')
            jQuery.post('/cart/update.js', {updates:{...updateObject}}); 
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
        setTimeout(() => {
            let getCart = () => {
                fetch(window.Shopify.routes.root + 'cart.js')
                    .then(
                            response => response.json(),
                        )
                        .then(
                            data => { 
                                let bar = document.querySelector(".js-info-bar");
                                let currency = data.currency;
                                if(currency == 'USD') {
                                    currency = '$'
                                }
                                if(currency == 'EUR') {
                                    currency = '€'
                                }
                                let itemCount = 0;
                                let giftCount = 0;
                                for (let i = 0; i < data.items.length; i++) {
                                    if(data.items[i].properties._source != "Rebuy") {
                                        itemCount += data.items[i].quantity
                                        giftCount += (data.items[i].final_price * data.items[i].quantity)
                                    }
                                }
                                console.log(giftCount, itemCount, 'itemCount')
                                for (let i = 0; i < itemCount; i++) {
                                    console.log(i, 'iiiiiiiii')
                                    let dataSelectorVariable = `[data-${i+1}]`
                                    let dataLineVariable = `[data-line-${i}]`
                                    let globeClass = document.querySelector(dataSelectorVariable)
                                    let lineClass = document.querySelector(dataLineVariable)
                                    if (lineClass) {
                                        lineClass.classList.add('active')
                                    }
                                    setTimeout(() => {
                                        globeClass.classList.add('active')
                                    }, "1000");
                                }
                                
                                let ToGoal
                                if(itemCount < 2) {
                                    ToGoal = 3
                                    percent = '55%'
                                }
                                if(itemCount > 2 && itemCount < 5) {
                                    ToGoal = 6
                                    percent = '60%'
                                }
                                if(itemCount > 5 && itemCount < 10) {
                                    ToGoal = 10
                                    percent = '70%'
                                }
                                let leftItems = ToGoal - itemCount;
                                if(leftItems > 0) {
                                    bar.innerHTML = `You have ${itemCount} items, </br> add ${leftItems} more for ${percent} off!`
                                } else {
                                    bar.innerHTML = `You unlocked full 70% OFF discount!!`
                                }

                                let firstGift = document.querySelector('.js-first-gift').getAttribute('data-gift')
                                let secondGift = document.querySelector('.js-second-gift').getAttribute('data-gift')
                                let thirdGift = document.querySelector('.js-third-gift').getAttribute('data-gift')
                                let fourthGift = document.querySelector('.js-fourth-gift').getAttribute('data-gift')
                                let giftChange = document.querySelector('.js-left-to-gift')
                                let jsImageChange = document.querySelector('.js-image-change')
                                let circle = document.querySelector('.circle-chart__circle')

                                if(giftCount < firstGift) {
                                    let giftLeft = firstGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-first-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/firstGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if(giftCount > firstGift && giftCount < secondGift) {
                                    let giftLeft = secondGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-second-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/secondGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if(giftCount > secondGift && giftCount < thirdGift) {
                                    let giftLeft = thirdGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-third-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/thirdGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else if (giftCount > thirdGift && giftCount < fourthGift) {
                                    let giftLeft = fourthGift - giftCount
                                    giftChange.innerHTML = `${currency}${giftLeft/100}`
                                    jsImageChange.src = document.querySelector('.js-fourth-gift').getAttribute('data-image')
                                    circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/fourthGift)*540)
                                    document.querySelector('.gift-tracker').classList.remove('hide')
                                } else {
                                    document.querySelector('.gift-tracker').classList.add('hide')
                                }
                            
                                
                                return data 
                            });
            }
            getCart();
        }, "1000");
    })
})