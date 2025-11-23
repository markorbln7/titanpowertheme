/**
 * Mystery Box Section - Simple Add to Cart
 */

(function () {
  'use strict'

  function init () {
    const sections = document.querySelectorAll('[data-section-type="mystery-box"]')

    sections.forEach(function (section) {
      const addToCartButtons = section.querySelectorAll('[data-action="add-to-cart"]')

      addToCartButtons.forEach(function (button) {
        button.addEventListener('click', handleAddToCart)
      })
    })
  }

  function handleAddToCart (event) {
    event.preventDefault()

    const button = event.currentTarget
    const variantId = button.dataset.variantId
    const textElement = button.querySelector('[data-button-text]')

    if (!variantId) {
      console.error('No variant ID found')
      return
    }

    // Show loading state
    button.disabled = true
    const originalText = textElement.textContent
    textElement.textContent = 'Adding...'

    // Add to cart
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to add to cart')
        }
        return response.json()
      })
      .then(function () {
        // Success
        textElement.textContent = 'Added!'

        // Dispatch cart updated event for other components
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { variantId: variantId, quantity: 1 }
        }))

        // Reset button after 2 seconds
        setTimeout(function () {
          button.disabled = false
          textElement.textContent = originalText
        }, 2000)
      })
      .catch(function (error) {
        // Error
        console.error('Add to cart error:', error)
        textElement.textContent = 'Error'

        // Reset button after 2 seconds
        setTimeout(function () {
          button.disabled = false
          textElement.textContent = originalText
        }, 2000)
      })
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // Reinitialize on theme editor section reload
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function () {
      init()
    })
  }
})()
