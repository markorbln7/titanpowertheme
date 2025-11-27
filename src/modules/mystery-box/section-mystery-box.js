/**
 * Mystery Box Section - Add to Deal with BundleManager Integration
 */

(function () {
  'use strict'

  function init () {
    const sections = document.querySelectorAll('[data-section-type="mystery-box"]')

    sections.forEach(function (section) {
      const addToDealButtons = section.querySelectorAll('[data-action="add-to-deal"]')
      const buyNowButtons = section.querySelectorAll('[data-action="buy-now"]')

      addToDealButtons.forEach(function (button) {
        button.addEventListener('click', handleAddToDeal)
      })

      buyNowButtons.forEach(function (button) {
        button.addEventListener('click', handleBuyNow)
      })
    })
  }

  function handleAddToDeal (event) {
    event.preventDefault()

    const button = event.currentTarget
    const variantId = button.dataset.variantId
    const productId = button.dataset.productId
    const textElement = button.querySelector('[data-button-text]')

    if (!variantId) {
      console.error('[MysteryBox] No variant ID found')
      return
    }

    if (!productId) {
      console.error('[MysteryBox] No product ID found')
      return
    }

    // Show loading state
    button.disabled = true
    const originalText = textElement.textContent
    textElement.textContent = 'Adding...'

    // ─────────────────────────────────────────────────────────────────
    // BUNDLEMANAGER INTEGRATION (Virtual Cart - Instant)
    // If BundleManager is available, add to localStorage instead of API
    // ─────────────────────────────────────────────────────────────────
    if (window.BF25BundleManager) {
      console.log('[MysteryBox] Using BundleManager for instant add to deal')

      // Get product data from window.productData
      const product = window.productData[productId]
      const variants = window.productVariants[productId] || []
      const variant = variants.find(function (v) {
        return String(v.id) === String(variantId)
      })

      if (!product) {
        console.error('[MysteryBox] Product data not found:', productId)
        textElement.textContent = 'Error'
        button.disabled = false
        setTimeout(function () {
          textElement.textContent = originalText
        }, 2000)
        return
      }

      // Build product data for BundleManager
      const productData = {
        variantId: String(variantId),
        productId: String(productId),
        title: product.title,
        variantTitle: variant && variant.title !== 'Default Title' ? variant.title : '',
        // Price priority: variant.price > product.basePrice > 0
        price: variant ? variant.price : (product.basePrice || 0),
        // Get image URL
        image: product.featuredImage || product.featured_image || product.image || '',
        handle: product.handle || ''
      }

      // Add to BundleManager
      const result = window.BF25BundleManager.addItem(productData, 1)

      if (result.success) {
        console.log('[MysteryBox] ✅ Added to deal:', result)
        textElement.textContent = 'Added to Deal!'

        // Dispatch cart updated event for other components
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { variantId: variantId, quantity: 1 }
        }))

        // Dispatch bundle updated event for sticky cart
        document.dispatchEvent(new CustomEvent('bundle:updated', {
          detail: { bundle: result.bundle }
        }))

        // Reset button after 2 seconds
        setTimeout(function () {
          button.disabled = false
          textElement.textContent = originalText
        }, 2000)
      } else {
        // Handle BundleManager errors
        console.error('[MysteryBox] ❌ BundleManager error:', result.error)

        let errorMessage = 'Error'
        if (result.error === 'MAX_ITEMS_REACHED') {
          errorMessage = 'Bundle Full'
        } else if (result.message) {
          errorMessage = result.message
        }

        textElement.textContent = errorMessage

        // Reset button after 2 seconds
        setTimeout(function () {
          button.disabled = false
          textElement.textContent = originalText
        }, 2000)
      }
    } else {
      // Fallback to regular cart API if BundleManager is not available
      console.log('[MysteryBox] BundleManager not available, using regular cart API')

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
          console.error('[MysteryBox] Add to cart error:', error)
          textElement.textContent = 'Error'

          // Reset button after 2 seconds
          setTimeout(function () {
            button.disabled = false
            textElement.textContent = originalText
          }, 2000)
        })
    }
  }

  function handleBuyNow (event) {
    event.preventDefault()

    const button = event.currentTarget
    const variantId = button.dataset.variantId

    if (!variantId) {
      console.error('No variant ID found')
      return
    }

    // Show loading state
    button.disabled = true
    const originalText = button.textContent
    button.textContent = 'Processing...'

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
        // Redirect to checkout
        window.location.href = '/checkout'
      })
      .catch(function (error) {
        // Error
        console.error('Buy now error:', error)
        button.textContent = 'Error - Try Again'
        button.disabled = false

        // Reset button after 3 seconds
        setTimeout(function () {
          button.textContent = originalText
        }, 3000)
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
