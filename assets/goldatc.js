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
                                let itemCount = 0;
                                for (let i = 0; i < data.items.length; i++) {
                                    if(data.items[i].properties._source != "Rebuy") {
                                        itemCount += data.items[i].quantity
                                    }
                                }
                                console.log(itemCount, 'itemCount')
                                let dataSelectorVariable = `[data-${itemCount}]`
                                let dataLineVariable = `[data-line-${itemCount-1}]`
                                let globeClass = document.querySelector(dataSelectorVariable)
                                let lineClass = document.querySelector(dataLineVariable)
                                if (lineClass) {
                                    lineClass.classList.add('active')
                                }
                                setTimeout(() => {
                                    globeClass.classList.add('active')
                                }, "1000");
                                
                                
                                if(itemCount < 4) {
                                    ToGoal = 5
                                    percent = '55%'
                                }
                                if(itemCount > 4 && itemCount < 7) {
                                    ToGoal = 8
                                    percent = '70%'
                                }
                                if(itemCount > 7 && itemCount < 14) {
                                    ToGoal = 14
                                    percent = '80%'
                                }
                                let leftItems = ToGoal - itemCount;
                                bar.innerHTML = `You have ${itemCount} items, add ${leftItems} more for ${percent} off!`
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
                            let itemCount = 0;
                            for (let i = 0; i < data.items.length; i++) {
                                if(data.items[i].properties._source != "Rebuy") {
                                    itemCount += data.items[i].quantity
                                }
                            }
                            console.log(itemCount, 'itemCount')
                            let dataSelectorVariable = `[data-${itemCount+1}]`
                            let dataLineVariable = `[data-line-${itemCount}]`
                            let globeClass = document.querySelector(dataSelectorVariable)
                            let lineClass = document.querySelector(dataLineVariable)
                            globeClass.classList.remove('active')
                            lineClass.classList.remove('active')
                            if(itemCount < 4) {
                                ToGoal = 5
                                percent = '55%'
                            }
                            if(itemCount > 4 && itemCount < 7) {
                                ToGoal = 8
                                percent = '70%'
                            }
                            if(itemCount > 7 && itemCount < 14) {
                                ToGoal = 14
                                percent = '80%'
                            }
                            let leftItems = ToGoal - itemCount;
                            bar.innerHTML = `You have ${itemCount} items, add ${leftItems} more for ${percent} off!`
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