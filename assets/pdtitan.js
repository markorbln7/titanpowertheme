const pdSelector = document.querySelector('.js-pd-selector')
const nonpdSelector = document.querySelector('.js-non-pd-selector')
const pdSwitch = document.querySelector('.js-pd-switch')
console.log(pdSelector,'pdSelector')
pdSelector.addEventListener('click', (e) => {
    pdSelector.classList.add('active')
    nonpdSelector.classList.remove('active')
    let pdProducts = document.querySelectorAll('.pd-product')
    let nonPdProducts = document.querySelectorAll('.non-pd-product')
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4packIponeUSBc.jpg?v=1711219882'
    pdProducts.forEach(pdProduct => {
        pdProduct.classList.remove('hide-product')
    })
    nonPdProducts.forEach(nonPdProduct => {
        nonPdProduct.classList.add('hide-product')
    })
})


nonpdSelector.addEventListener('click', (e) => {
    pdSelector.classList.remove('active')
    nonpdSelector.classList.add('active')
    let pdProducts = document.querySelectorAll('.pd-product')
    let nonPdProducts = document.querySelectorAll('.non-pd-product')
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4packIphoneUSBa.jpg?v=1711219882'
    pdProducts.forEach(pdProduct => {
        pdProduct.classList.add('hide-product')
    })
    nonPdProducts.forEach(nonPdProduct => {
        nonPdProduct.classList.remove('hide-product')
    })
})

let disabledButton = document.querySelector('.special');

if (pdSwitch) {
    pdSwitch.addEventListener('click', function () {
      const status = pdSwitch.checked
      console.log(status, 'status')
      if (!status) {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/1titan-smart-cable-titan-power-plus-type-c-iphone-cord-charger-lead-fast-pd-strong-durable-4-iphone.jpg?v=1718145334'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.add('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.remove('hide-product')
        })
        console.log(disabledButton.classList, 'disabledButton')
        disabledButton.disabled = false
      } else {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/titan-smart-cable-titan-power-plus-type-c-iphone-cord-charger-lead-fast-pd-strong-durable-4-iphone-pd_65a29169-31a9-443e-b52e-54e757958f0c.jpg?v=1718145063'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.remove('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.add('hide-product')
        })
        disabledButton.disabled = true
      }

    })
  }