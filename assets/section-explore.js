"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-explore"],{

/***/ "./src/modules/explore/section-explore.js":
/*!************************************************!*\
  !*** ./src/modules/explore/section-explore.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_explore_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-explore.css */ \"./src/modules/explore/section-explore.css\");\n/* eslint-disable */\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  //Select parent section\n  const parentSection = document.querySelectorAll('.section-explore');\n  parentSection.forEach(section => {\n    // Product cards hover logic\n    const productCards = section.querySelectorAll('.section-explore__product');\n    const desktopLabel = section.querySelector('.section-explore__collection-label-desktop');\n    const travelLabel = section.querySelector('.section-explore__collection-label-travel');\n    let activeProduct = null;\n    let activeCard = null;\n    const initialProduct = section.querySelector('.section-explore__product-content [data-product=\"for-desktop-1\"]');\n    if (initialProduct) {\n      initialProduct.style.opacity = '1';\n      initialProduct.style.transition = 'opacity 0.5s ease';\n      if (desktopLabel) {\n        desktopLabel.classList.add('active');\n      }\n      const initialLines = initialProduct.querySelectorAll('.animate-line');\n      initialLines.forEach(line => line.classList.add('active-line'));\n      activeProduct = initialProduct;\n      const firstCard = section.querySelector('.section-explore__product[data-product-hover=\"for-desktop-1\"]');\n      if (firstCard) {\n        firstCard.classList.add('active');\n        activeCard = firstCard;\n      }\n    }\n    productCards.forEach(card => {\n      card.addEventListener('mouseenter', () => {\n        const productIndex = card.getAttribute('data-product-hover');\n        if (productIndex.startsWith('for-desktop')) {\n          if (desktopLabel) desktopLabel.classList.add('active');\n          if (travelLabel) travelLabel.classList.remove('active');\n        } else if (productIndex.startsWith('for-travel')) {\n          if (travelLabel) travelLabel.classList.add('active');\n          if (desktopLabel) desktopLabel.classList.remove('active');\n        }\n        if (activeProduct) {\n          activeProduct.style.opacity = '0';\n          const activeLines = activeProduct.querySelectorAll('.animate-line');\n          activeLines.forEach(line => line.classList.remove('active-line'));\n        }\n        const targetContent = section.querySelector(`.section-explore__product-content [data-product=\"${productIndex}\"]`);\n        if (targetContent) {\n          targetContent.style.opacity = '1';\n          targetContent.style.transition = 'opacity 0.5s ease';\n          const targetLines = targetContent.querySelectorAll('.animate-line');\n          targetLines.forEach(line => line.classList.add('active-line'));\n          activeProduct = targetContent;\n        }\n        if (activeCard) {\n          activeCard.classList.remove('active');\n        }\n        card.classList.add('active');\n        activeCard = card;\n      });\n    });\n\n    // Popup toggle logic\n    const buyNowButtons = section.querySelectorAll('.js-section-explore__buy-now');\n    const popups = section.querySelectorAll('.buy-now-popup');\n    function openPopup(popup) {\n      popup.style.display = 'block';\n      popup.classList.add('active');\n      document.querySelector('body').style.overflow = 'hidden';\n    }\n    function closePopup(popup) {\n      popup.style.display = 'none';\n      popup.classList.remove('active');\n      document.querySelector('body').style.overflow = 'auto';\n    }\n\n    // Function to update the state of the minus button based on quantity\n    function updateQuantityButtonsState(input, minusButton) {\n      const quantity = parseInt(input.value);\n      if (quantity <= 1) {\n        minusButton.setAttribute(\"disabled\", true);\n        minusButton.classList.add('disabled');\n      } else {\n        minusButton.removeAttribute(\"disabled\");\n        minusButton.classList.remove('disabled');\n      }\n    }\n\n    // Reset quantity button event listeners\n    function resetQuantityListeners() {\n      const quantityMinusButtons = section.querySelectorAll('.buy-now-popup__quantity button[name=\"minus\"]');\n      const quantityPlusButtons = section.querySelectorAll('.buy-now-popup__quantity button[name=\"plus\"]');\n      quantityMinusButtons.forEach(button => {\n        const newButton = button.cloneNode(true);\n        button.parentNode.replaceChild(newButton, button);\n      });\n      quantityPlusButtons.forEach(button => {\n        const newButton = button.cloneNode(true);\n        button.parentNode.replaceChild(newButton, button);\n      });\n    }\n\n    // Handling Buy Now button clicks\n    buyNowButtons.forEach((button, index) => {\n      button.addEventListener('click', () => {\n        const popup = popups[index];\n        if (popup) {\n          openPopup(popup);\n          resetQuantityListeners();\n\n          // Add quantity control logic\n          const quantityInputs = popup.querySelectorAll('.buy-now-popup__quantity input[type=\"number\"]');\n          const quantityMinusButtons = popup.querySelectorAll('.buy-now-popup__quantity button[name=\"minus\"]');\n          const quantityPlusButtons = popup.querySelectorAll('.buy-now-popup__quantity button[name=\"plus\"]');\n          quantityInputs.forEach((input, idx) => {\n            const minusButton = quantityMinusButtons[idx];\n            const plusButton = quantityPlusButtons[idx];\n\n            // Initially check if the minus button should be disabled\n            updateQuantityButtonsState(input, minusButton);\n            minusButton.addEventListener('click', () => {\n              let quantity = parseInt(input.value);\n              if (quantity > 1) {\n                input.value = quantity - 1;\n                const addToCartButton = popup.querySelector('.js-atc');\n                const addToCheckoutButton = popup.querySelector('.js-checkout');\n                addToCartButton.setAttribute(\"data-quantity\", input.value);\n                addToCheckoutButton.setAttribute(\"data-quantity\", input.value);\n              }\n              updateQuantityButtonsState(input, minusButton); // Update button state after quantity change\n            });\n\n            plusButton.addEventListener('click', () => {\n              let quantity = parseInt(input.value);\n              input.value = quantity + 1;\n              const addToCartButton = popup.querySelector('.js-atc');\n              const addToCheckoutButton = popup.querySelector('.js-checkout');\n              addToCartButton.setAttribute(\"data-quantity\", input.value);\n              addToCheckoutButton.setAttribute(\"data-quantity\", input.value);\n              updateQuantityButtonsState(input, minusButton); // Update button state after quantity change\n            });\n          });\n\n          // Expand description logic\n          const learnMoreButton = popup.querySelector('.buy-now-popup__expand-desc');\n          const descriptionEl = popup.querySelector('.buy-now-popup__description');\n          const descriptionInner = popup.querySelector('.buy-now-popup__description-inner');\n          if (learnMoreButton) {\n            const clonedLearnMoreButton = learnMoreButton.cloneNode(true);\n            learnMoreButton.parentNode.replaceChild(clonedLearnMoreButton, learnMoreButton);\n            clonedLearnMoreButton.addEventListener('click', () => {\n              const expanded = descriptionEl.classList.contains('expanded');\n              if (expanded) {\n                descriptionEl.classList.remove('expanded');\n                descriptionInner.style.height = '100px';\n                clonedLearnMoreButton.querySelector('span').textContent = 'Learn More';\n                descriptionInner.classList.add('with-gradient');\n              } else {\n                descriptionEl.classList.add('expanded');\n                descriptionInner.style.height = `${descriptionInner.scrollHeight}px`;\n                clonedLearnMoreButton.querySelector('span').textContent = 'Show Less';\n                descriptionInner.classList.remove('with-gradient');\n              }\n            });\n          }\n\n          // Upsell checkbox toggle logic\n          const upsellBoxes = popup.querySelectorAll('.buy-now-popup__upsell-box');\n          upsellBoxes.forEach(box => {\n            const checkbox = box.querySelector('input[type=\"checkbox\"]');\n            box.addEventListener('click', () => {\n              checkbox.checked = !checkbox.checked;\n              if (checkbox.checked) {\n                box.classList.add('active');\n              } else {\n                box.classList.remove('active');\n              }\n            });\n          });\n        }\n      });\n    });\n\n    // Add click event listener to close icons\n    popups.forEach(popup => {\n      const closeButtons = popup.querySelectorAll('.close-buy-now-popup');\n      closeButtons.forEach(button => {\n        button.addEventListener('click', () => {\n          closePopup(popup);\n        });\n      });\n    });\n\n    // Add to cart logic\n    let addToCarts = section.querySelectorAll(\".js-atc\"); // Select all add to cart buttons\n    addToCarts.forEach(addToCart => {\n      addToCart.addEventListener(\"click\", e => {\n        let checkout = false;\n        if (addToCart.classList.contains('js-checkout')) {\n          // Check if the button is checkout\n          checkout = true;\n        }\n        let _this = e.target;\n        let productId = _this.getAttribute(\"data-product-id\"); // Get the product id\n        let quantity = _this.getAttribute(\"data-quantity\"); // Get the quantity\n        const upsellProductSelectors = section.querySelectorAll(\".js-upsell-selector.active\"); // Get all active upsell products\n        const addItems = []; // Create an array for items\n        addItems.push({\n          // Add the main product to the array\n          id: productId,\n          quantity: quantity\n        });\n        upsellProductSelectors.forEach(upsellProductSelector => {\n          // Add upsell products to the array\n          const productId = upsellProductSelector.getAttribute(\"data-product-id\");\n          addItems.push({\n            id: productId,\n            quantity: 1\n          });\n        });\n        console.log(addItems);\n        const formData = {\n          // Form data for the cart\n          items: addItems\n        };\n        fetch(window.Shopify.routes.root + \"cart/add.js\", {\n          method: \"POST\",\n          headers: {\n            \"Content-Type\": \"application/json\"\n          },\n          body: JSON.stringify(formData)\n        }).then(response => {\n          console.log(response.status, \"ok\"); // Check if the response is OK\n          if (response.status === 200) {\n            document.querySelector('.buy-now-popup.active').classList.remove('active');\n            document.querySelector('body').style.overflow = 'auto';\n          }\n          if (response.status === 200 && checkout) {\n            window.location.href = '/checkout';\n          }\n          return response.json();\n        }).catch(error => {\n          console.error(\"Error:\", error);\n        });\n      });\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9leHBsb3JlL3NlY3Rpb24tZXhwbG9yZS5qcyIsIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2V4cGxvcmUvc2VjdGlvbi1leHBsb3JlLmpzPzI2NWUiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCAnLi9zZWN0aW9uLWV4cGxvcmUuY3NzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIC8vU2VsZWN0IHBhcmVudCBzZWN0aW9uXG4gICAgY29uc3QgcGFyZW50U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uLWV4cGxvcmUnKTtcbiAgICBwYXJlbnRTZWN0aW9uLmZvckVhY2goc2VjdGlvbiA9PiB7XG4gICAgICAgIC8vIFByb2R1Y3QgY2FyZHMgaG92ZXIgbG9naWNcbiAgICAgICAgY29uc3QgcHJvZHVjdENhcmRzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbi1leHBsb3JlX19wcm9kdWN0Jyk7XG4gICAgICAgIGNvbnN0IGRlc2t0b3BMYWJlbCA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tZXhwbG9yZV9fY29sbGVjdGlvbi1sYWJlbC1kZXNrdG9wJyk7XG4gICAgICAgIGNvbnN0IHRyYXZlbExhYmVsID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1leHBsb3JlX19jb2xsZWN0aW9uLWxhYmVsLXRyYXZlbCcpO1xuXG4gICAgICAgIGxldCBhY3RpdmVQcm9kdWN0ID0gbnVsbDtcbiAgICAgICAgbGV0IGFjdGl2ZUNhcmQgPSBudWxsO1xuXG4gICAgICAgIGNvbnN0IGluaXRpYWxQcm9kdWN0ID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1leHBsb3JlX19wcm9kdWN0LWNvbnRlbnQgW2RhdGEtcHJvZHVjdD1cImZvci1kZXNrdG9wLTFcIl0nKTtcbiAgICAgICAgaWYgKGluaXRpYWxQcm9kdWN0KSB7XG4gICAgICAgICAgICBpbml0aWFsUHJvZHVjdC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICAgICAgaW5pdGlhbFByb2R1Y3Quc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuNXMgZWFzZSc7XG4gICAgICAgICAgICBpZihkZXNrdG9wTGFiZWwpIHtcbiAgICAgICAgICAgICAgICBkZXNrdG9wTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsTGluZXMgPSBpbml0aWFsUHJvZHVjdC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0ZS1saW5lJyk7XG4gICAgICAgICAgICBpbml0aWFsTGluZXMuZm9yRWFjaChsaW5lID0+IGxpbmUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlLWxpbmUnKSk7XG4gICAgICAgICAgICBhY3RpdmVQcm9kdWN0ID0gaW5pdGlhbFByb2R1Y3Q7XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0Q2FyZCA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tZXhwbG9yZV9fcHJvZHVjdFtkYXRhLXByb2R1Y3QtaG92ZXI9XCJmb3ItZGVza3RvcC0xXCJdJyk7XG4gICAgICAgICAgICBpZiAoZmlyc3RDYXJkKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RDYXJkLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZUNhcmQgPSBmaXJzdENhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9kdWN0Q2FyZHMuZm9yRWFjaCgoY2FyZCkgPT4ge1xuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJbmRleCA9IGNhcmQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3QtaG92ZXInKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0SW5kZXguc3RhcnRzV2l0aCgnZm9yLWRlc2t0b3AnKSkge1xuICAgICAgICAgICAgICAgICAgICBpZihkZXNrdG9wTGFiZWwpIGRlc2t0b3BMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYXZlbExhYmVsKSB0cmF2ZWxMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2R1Y3RJbmRleC5zdGFydHNXaXRoKCdmb3ItdHJhdmVsJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYXZlbExhYmVsKSB0cmF2ZWxMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGVza3RvcExhYmVsKSBkZXNrdG9wTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlUHJvZHVjdC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVMaW5lcyA9IGFjdGl2ZVByb2R1Y3QucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGUtbGluZScpO1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVMaW5lcy5mb3JFYWNoKGxpbmUgPT4gbGluZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUtbGluZScpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRDb250ZW50ID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKGAuc2VjdGlvbi1leHBsb3JlX19wcm9kdWN0LWNvbnRlbnQgW2RhdGEtcHJvZHVjdD1cIiR7cHJvZHVjdEluZGV4fVwiXWApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldENvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q29udGVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDb250ZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjVzIGVhc2UnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRMaW5lcyA9IHRhcmdldENvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGUtbGluZScpO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMaW5lcy5mb3JFYWNoKGxpbmUgPT4gbGluZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUtbGluZScpKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlUHJvZHVjdCA9IHRhcmdldENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZUNhcmQgPSBjYXJkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFBvcHVwIHRvZ2dsZSBsb2dpY1xuICAgICAgICBjb25zdCBidXlOb3dCdXR0b25zID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc2VjdGlvbi1leHBsb3JlX19idXktbm93Jyk7XG4gICAgICAgIGNvbnN0IHBvcHVwcyA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbCgnLmJ1eS1ub3ctcG9wdXAnKTtcblxuICAgICAgICBmdW5jdGlvbiBvcGVuUG9wdXAocG9wdXApIHtcbiAgICAgICAgICAgIHBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgcG9wdXAuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jykuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlUG9wdXAocG9wdXApIHtcbiAgICAgICAgICAgIHBvcHVwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBwb3B1cC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5zdHlsZS5vdmVyZmxvdyA9ICdhdXRvJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIG1pbnVzIGJ1dHRvbiBiYXNlZCBvbiBxdWFudGl0eVxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVRdWFudGl0eUJ1dHRvbnNTdGF0ZShpbnB1dCwgbWludXNCdXR0b24pIHtcbiAgICAgICAgICAgIGNvbnN0IHF1YW50aXR5ID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKHF1YW50aXR5IDw9IDEpIHtcbiAgICAgICAgICAgICAgICBtaW51c0J1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBtaW51c0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaW51c0J1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICBtaW51c0J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgcXVhbnRpdHkgYnV0dG9uIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICBmdW5jdGlvbiByZXNldFF1YW50aXR5TGlzdGVuZXJzKCkge1xuICAgICAgICAgICAgY29uc3QgcXVhbnRpdHlNaW51c0J1dHRvbnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXktbm93LXBvcHVwX19xdWFudGl0eSBidXR0b25bbmFtZT1cIm1pbnVzXCJdJyk7XG4gICAgICAgICAgICBjb25zdCBxdWFudGl0eVBsdXNCdXR0b25zID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuYnV5LW5vdy1wb3B1cF9fcXVhbnRpdHkgYnV0dG9uW25hbWU9XCJwbHVzXCJdJyk7XG5cbiAgICAgICAgICAgIHF1YW50aXR5TWludXNCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0J1dHRvbiA9IGJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0J1dHRvbiwgYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBxdWFudGl0eVBsdXNCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0J1dHRvbiA9IGJ1dHRvbi5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYnV0dG9uLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0J1dHRvbiwgYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxpbmcgQnV5IE5vdyBidXR0b24gY2xpY2tzXG4gICAgICAgIGJ1eU5vd0J1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvcHVwID0gcG9wdXBzW2luZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAocG9wdXApIHtcbiAgICAgICAgICAgICAgICAgICAgb3BlblBvcHVwKHBvcHVwKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRRdWFudGl0eUxpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEFkZCBxdWFudGl0eSBjb250cm9sIGxvZ2ljXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1YW50aXR5SW5wdXRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnLmJ1eS1ub3ctcG9wdXBfX3F1YW50aXR5IGlucHV0W3R5cGU9XCJudW1iZXJcIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVhbnRpdHlNaW51c0J1dHRvbnMgPSBwb3B1cC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV5LW5vdy1wb3B1cF9fcXVhbnRpdHkgYnV0dG9uW25hbWU9XCJtaW51c1wiXScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWFudGl0eVBsdXNCdXR0b25zID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbCgnLmJ1eS1ub3ctcG9wdXBfX3F1YW50aXR5IGJ1dHRvbltuYW1lPVwicGx1c1wiXScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5SW5wdXRzLmZvckVhY2goKGlucHV0LCBpZHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1pbnVzQnV0dG9uID0gcXVhbnRpdHlNaW51c0J1dHRvbnNbaWR4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsdXNCdXR0b24gPSBxdWFudGl0eVBsdXNCdXR0b25zW2lkeF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluaXRpYWxseSBjaGVjayBpZiB0aGUgbWludXMgYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUXVhbnRpdHlCdXR0b25zU3RhdGUoaW5wdXQsIG1pbnVzQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHF1YW50aXR5ID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWFudGl0eSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBxdWFudGl0eSAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkZFRvQ2FydEJ1dHRvbiA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJy5qcy1hdGMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWRkVG9DaGVja291dEJ1dHRvbiA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJy5qcy1jaGVja291dCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0NhcnRCdXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1xdWFudGl0eVwiLCBpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRvQ2hlY2tvdXRCdXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1xdWFudGl0eVwiLCBpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVF1YW50aXR5QnV0dG9uc1N0YXRlKGlucHV0LCBtaW51c0J1dHRvbik7IC8vIFVwZGF0ZSBidXR0b24gc3RhdGUgYWZ0ZXIgcXVhbnRpdHkgY2hhbmdlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcGx1c0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcXVhbnRpdHkgPSBwYXJzZUludChpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBxdWFudGl0eSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWRkVG9DYXJ0QnV0dG9uID0gcG9wdXAucXVlcnlTZWxlY3RvcignLmpzLWF0YycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFkZFRvQ2hlY2tvdXRCdXR0b24gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKCcuanMtY2hlY2tvdXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0NhcnRCdXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1xdWFudGl0eVwiLCBpbnB1dC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkVG9DaGVja291dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLXF1YW50aXR5XCIsIGlucHV0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVRdWFudGl0eUJ1dHRvbnNTdGF0ZShpbnB1dCwgbWludXNCdXR0b24pOyAvLyBVcGRhdGUgYnV0dG9uIHN0YXRlIGFmdGVyIHF1YW50aXR5IGNoYW5nZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEV4cGFuZCBkZXNjcmlwdGlvbiBsb2dpY1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWFybk1vcmVCdXR0b24gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKCcuYnV5LW5vdy1wb3B1cF9fZXhwYW5kLWRlc2MnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb25FbCA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJy5idXktbm93LXBvcHVwX19kZXNjcmlwdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbklubmVyID0gcG9wdXAucXVlcnlTZWxlY3RvcignLmJ1eS1ub3ctcG9wdXBfX2Rlc2NyaXB0aW9uLWlubmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYXJuTW9yZUJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xvbmVkTGVhcm5Nb3JlQnV0dG9uID0gbGVhcm5Nb3JlQnV0dG9uLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlYXJuTW9yZUJ1dHRvbi5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjbG9uZWRMZWFybk1vcmVCdXR0b24sIGxlYXJuTW9yZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lZExlYXJuTW9yZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRlZCA9IGRlc2NyaXB0aW9uRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdleHBhbmRlZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGFuZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uRWwuY2xhc3NMaXN0LnJlbW92ZSgnZXhwYW5kZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25Jbm5lci5zdHlsZS5oZWlnaHQgPSAnMTAwcHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWRMZWFybk1vcmVCdXR0b24ucXVlcnlTZWxlY3Rvcignc3BhbicpLnRleHRDb250ZW50ID0gJ0xlYXJuIE1vcmUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbklubmVyLmNsYXNzTGlzdC5hZGQoJ3dpdGgtZ3JhZGllbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ2V4cGFuZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uSW5uZXIuc3R5bGUuaGVpZ2h0ID0gYCR7ZGVzY3JpcHRpb25Jbm5lci5zY3JvbGxIZWlnaHR9cHhgO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZWRMZWFybk1vcmVCdXR0b24ucXVlcnlTZWxlY3Rvcignc3BhbicpLnRleHRDb250ZW50ID0gJ1Nob3cgTGVzcyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnd2l0aC1ncmFkaWVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBzZWxsIGNoZWNrYm94IHRvZ2dsZSBsb2dpY1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cHNlbGxCb3hlcyA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXktbm93LXBvcHVwX191cHNlbGwtYm94Jyk7XG4gICAgICAgICAgICAgICAgICAgIHVwc2VsbEJveGVzLmZvckVhY2goKGJveCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSBib3gucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gIWNoZWNrYm94LmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCBjbGljayBldmVudCBsaXN0ZW5lciB0byBjbG9zZSBpY29uc1xuICAgICAgICBwb3B1cHMuZm9yRWFjaCgocG9wdXApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlQnV0dG9ucyA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbG9zZS1idXktbm93LXBvcHVwJyk7XG4gICAgICAgICAgICBjbG9zZUJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKHBvcHVwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEFkZCB0byBjYXJ0IGxvZ2ljXG4gICAgICAgIGxldCBhZGRUb0NhcnRzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiLmpzLWF0Y1wiKSAgLy8gU2VsZWN0IGFsbCBhZGQgdG8gY2FydCBidXR0b25zXG4gICAgICAgIGFkZFRvQ2FydHMuZm9yRWFjaCgoYWRkVG9DYXJ0KSA9PiB7XG4gICAgICAgICAgICBhZGRUb0NhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWNrb3V0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGFkZFRvQ2FydC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWNoZWNrb3V0JykpIHsgLy8gQ2hlY2sgaWYgdGhlIGJ1dHRvbiBpcyBjaGVja291dFxuICAgICAgICAgICAgICAgICAgICBjaGVja291dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBfdGhpcyA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0SWQgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb2R1Y3QtaWRcIik7IC8vIEdldCB0aGUgcHJvZHVjdCBpZFxuICAgICAgICAgICAgICAgIGxldCBxdWFudGl0eSA9IF90aGlzLmdldEF0dHJpYnV0ZShcImRhdGEtcXVhbnRpdHlcIik7IC8vIEdldCB0aGUgcXVhbnRpdHlcbiAgICAgICAgICAgICAgICBjb25zdCB1cHNlbGxQcm9kdWN0U2VsZWN0b3JzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFwiLmpzLXVwc2VsbC1zZWxlY3Rvci5hY3RpdmVcIik7IC8vIEdldCBhbGwgYWN0aXZlIHVwc2VsbCBwcm9kdWN0c1xuICAgICAgICAgICAgICAgIGNvbnN0IGFkZEl0ZW1zID0gW107IC8vIENyZWF0ZSBhbiBhcnJheSBmb3IgaXRlbXNcbiAgICAgICAgICAgICAgICBhZGRJdGVtcy5wdXNoKHsgIC8vIEFkZCB0aGUgbWFpbiBwcm9kdWN0IHRvIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICBpZDogcHJvZHVjdElkLFxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHVwc2VsbFByb2R1Y3RTZWxlY3RvcnMuZm9yRWFjaCgodXBzZWxsUHJvZHVjdFNlbGVjdG9yKSA9PiB7ICAvLyBBZGQgdXBzZWxsIHByb2R1Y3RzIHRvIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0SWQgPSB1cHNlbGxQcm9kdWN0U2VsZWN0b3IuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9kdWN0LWlkXCIpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9kdWN0SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWRkSXRlbXMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0geyAvLyBGb3JtIGRhdGEgZm9yIHRoZSBjYXJ0XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBhZGRJdGVtcyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZldGNoKHdpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290ICsgXCJjYXJ0L2FkZC5qc1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSksXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXMsIFwib2tcIik7IC8vIENoZWNrIGlmIHRoZSByZXNwb25zZSBpcyBPS1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnV5LW5vdy1wb3B1cC5hY3RpdmUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jykuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDAgJiYgY2hlY2tvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvY2hlY2tvdXQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/explore/section-explore.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/explore.js":
/*!************************************************!*\
  !*** ./src/scripts/entries/section/explore.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_explore_section_explore_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/explore/section-explore.js */ \"./src/modules/explore/section-explore.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_explore_section_explore_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'Explore');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vZXhwbG9yZS5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9zY3JpcHRzL2VudHJpZXMvc2VjdGlvbi9leHBsb3JlLmpzPzliODYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdENvbXBvbmVudCB9IGZyb20gJ2xpYi9jb21wb25lbnRzJ1xuaW1wb3J0IEV4cGxvcmUgZnJvbSAnbW9kdWxlcy9leHBsb3JlL3NlY3Rpb24tZXhwbG9yZS5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChFeHBsb3JlLCAnRXhwbG9yZScpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/explore.js\n");

/***/ }),

/***/ "./src/modules/explore/section-explore.css":
/*!*************************************************!*\
  !*** ./src/modules/explore/section-explore.css ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9leHBsb3JlL3NlY3Rpb24tZXhwbG9yZS5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2V4cGxvcmUvc2VjdGlvbi1leHBsb3JlLmNzcz9mOTMyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/explore/section-explore.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/explore.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);