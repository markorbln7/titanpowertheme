const pdSelector = document.querySelector('.js-pd-selector')
const nonpdSelector = document.querySelector('.js-non-pd-selector')
const pdSwitch = document.querySelector('.js-pd-switch')
console.log(pdSelector,'pdSelector')
pdSelector.addEventListener('click', (e) => {
    pdSelector.classList.add('active')
    nonpdSelector.classList.remove('active')
    let pdProducts = document.querySelectorAll('.pd-product')
    let nonPdProducts = document.querySelectorAll('.non-pd-product')
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/USBC_-_IPHONE_ebcadb15-1557-450b-9e1d-aa7aaad2d7b4.jpg?v=1720009806'
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
    document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/USBA_-_IPHONE_60bf8f46-e595-4de8-814b-9da059d389da.jpg?v=1720009868'
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
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/USBA_-_IPHONE_60bf8f46-e595-4de8-814b-9da059d389da.jpg?v=1720009868'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.add('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.remove('hide-product')
        })
      } else {
        let pdProducts = document.querySelectorAll('.pd-product')
        let nonPdProducts = document.querySelectorAll('.non-pd-product')
        document.querySelector('.js-main-image-change').src = 'https://cdn.shopify.com/s/files/1/0071/1727/5191/files/USBC_-_IPHONE_ebcadb15-1557-450b-9e1d-aa7aaad2d7b4.jpg?v=1720009806'
        pdProducts.forEach(pdProduct => {
            pdProduct.classList.remove('hide-product')
        })
        nonPdProducts.forEach(nonPdProduct => {
            nonPdProduct.classList.add('hide-product')
        })
      }

    })
  }