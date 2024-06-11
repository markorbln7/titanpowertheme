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


if (pdSwitch) {
    pdSwitch.addEventListener('click', function () {
      const status = pdSwitch.checked
      console.log(status, 'status')
      if (!status) {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Magtech-cable-titan-power-plus-iphone-usb-c-magnetic-magnet-cable-usb-a-type-c-lightning_usb-c-to-usb-c-pd-4-pack-iphone-usb-a.jpg?v=1718094390'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.add('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.remove('hide-product')
        })
      } else {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/Magtech-cable-titan-power-plus-iphone-usb-c-magnetic-magnet-cable-usb-a-type-c-lightning_usb-c-to-usb-c-pd-4-pack-usb-c-iphone.jpg?v=1718094275'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.remove('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.add('hide-product')
        })
      }

    })
  }