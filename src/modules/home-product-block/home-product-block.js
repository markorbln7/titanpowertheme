/* eslint-disable prefer-const */
import './home-product-block.css'

const addToCarts = document.querySelectorAll('.js-atc')
addToCarts.forEach(addToCart => {
  addToCart.addEventListener('click', (e) => {
    const _this = e.target
    const prId = _this.getAttribute('data-product')
    let addItems
    addItems = [
      {
        id: prId,
        quantity: 1
      }
    ]
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
  })
})
