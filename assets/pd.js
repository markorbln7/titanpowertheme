const pdSelector = document.querySelector('.js-pd-selector')
const nonpdSelector = document.querySelector('.js-non-pd-selector')
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