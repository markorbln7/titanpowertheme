const pdSelector = document.querySelector('.js-pd-selector')
const nonpdSelector = document.querySelector('.js-non-pd-selector')
const pdSwitch = document.querySelector('.js-pd-switch')
console.log(pdSelector,'pdSelector')
pdSelector.addEventListener('click', (e) => {
    pdSelector.classList.add('active')
    nonpdSelector.classList.remove('active')
    let pdProducts = document.querySelectorAll('.pd-product')
    let nonPdProducts = document.querySelectorAll('.non-pd-product')
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4packIphoneUSBa.jpg?v=1711219882'
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
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/4packIponeUSBc.jpg?v=1711219882'
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
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/LightningtoTypeC_1_673a2e4c-6c6e-4134-8a41-bc98437845c7.jpg?v=1732304579'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.add('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.remove('hide-product')
        })
        console.log(disabledButton.classList, 'disabledButton')
        disabledButton.disabled = true
      } else {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/2_L.jpg?v=1732305024'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.remove('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.add('hide-product')
        })
        disabledButton.disabled = false
      }

    })
  }