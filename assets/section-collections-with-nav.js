"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-collections-with-nav"],{

/***/ "./src/modules/collections-with-nav/section-collections-with-nav.js":
/*!**************************************************************************!*\
  !*** ./src/modules/collections-with-nav/section-collections-with-nav.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_collections_with_nav_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-collections-with-nav.css */ \"./src/modules/collections-with-nav/section-collections-with-nav.css\");\n/* eslint-disable */\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  const parentSection = document.querySelector('.section-collections-with-nav');\n  const collectionLinks = parentSection.querySelectorAll('.collection-link');\n  collectionLinks.forEach(link => {\n    link.addEventListener('click', function (event) {\n      event.preventDefault();\n      collectionLinks.forEach(link => {\n        link.closest('li').classList.remove('active');\n      });\n      this.closest('li').classList.add('active');\n      const targetSection = document.querySelector(`${this.getAttribute('href')}`);\n      if (targetSection) {\n        targetSection.scrollIntoView({\n          behavior: 'smooth'\n        });\n      }\n    });\n  });\n\n  // Quantity control logic\n  const quantityInputs = parentSection.querySelectorAll('.quantity__input');\n  const quantityMinusButtons = parentSection.querySelectorAll('.quantity__button[name=\"minus\"]');\n  const quantityPlusButtons = parentSection.querySelectorAll('.quantity__button[name=\"plus\"]');\n  quantityMinusButtons.forEach((minusButton, index) => {\n    minusButton.addEventListener('click', () => {\n      const input = quantityInputs[index];\n      let quantity = parseInt(input.value);\n      if (quantity > 1) {\n        const addToCartButton = minusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');\n        addToCartButton.setAttribute('data-quantity', input.value);\n      }\n    });\n  });\n  quantityPlusButtons.forEach((plusButton, index) => {\n    plusButton.addEventListener('click', () => {\n      const input = quantityInputs[index];\n      let quantity = parseInt(input.value);\n      const addToCartButton = plusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');\n      addToCartButton.setAttribute('data-quantity', input.value);\n    });\n  });\n\n  // Variant selector\n  document.querySelectorAll('.section-collections-with-nav__product').forEach(productElement => {\n    const productId = productElement.getAttribute('data-product-id');\n    const selectors = productElement.querySelectorAll('.variant-selectors select');\n    const addToCartButtonS = productElement.querySelectorAll('.js-atc');\n    function getVariantId(selectedOptions) {\n      const productVariants = window.productVariants[productId];\n      const variant = productVariants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]));\n      return variant ? variant.id : '';\n    }\n    function getVariantImage(selectedOptions) {\n      const productVariants = window.productVariants[productId];\n      const variant = productVariants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]));\n      return variant ? variant.image : '';\n    }\n    function getVariantPrice(selectedOptions) {\n      const productVariants = window.productVariants[productId];\n      const variant = productVariants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]));\n      return variant ? variant.price : '';\n    }\n    function getVariantComparePrice(selectedOptions) {\n      const productVariants = window.productVariants[productId];\n      const variant = productVariants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]));\n      return variant ? variant.compare_at_price : '';\n    }\n    function updateAddToCartButton() {\n      let selectedOptions = [];\n      selectors.forEach(selector => {\n        selectedOptions.push(selector.value);\n      });\n      const variantId = getVariantId(selectedOptions);\n      const getImage = getVariantImage(selectedOptions);\n      const getPrice = getVariantPrice(selectedOptions);\n      const getComparePrice = getVariantComparePrice(selectedOptions);\n      const priceContainer = productElement.querySelector('.js-variant-price');\n      const comparePriceContainer = productElement.querySelector('.js-variant-compare-price');\n      const priceContainer2 = productElement.querySelector('.js-variant-price-2');\n      const comparePriceContainer2 = productElement.querySelector('.js-variant-compare-price-2');\n      priceContainer.innerHTML = getPrice;\n      comparePriceContainer.innerHTML = getComparePrice;\n      priceContainer2.innerHTML = getPrice;\n      comparePriceContainer2.innerHTML = getComparePrice;\n      const imageContainer = productElement.querySelector('.js-variant-image');\n      imageContainer.src = getImage;\n      console.log(getImage, 'image');\n      addToCartButtonS.forEach(addToCartButton => {\n        addToCartButton.setAttribute('data-product-id', variantId);\n      });\n    }\n    selectors.forEach(selector => {\n      selector.addEventListener('change', updateAddToCartButton);\n    });\n  });\n\n  // Add to cart logic\n  const addToCartButtons = parentSection.querySelectorAll('.js-atc');\n  addToCartButtons.forEach(addToCartButton => {\n    addToCartButton.addEventListener('click', e => {\n      const productId = e.target.getAttribute('data-product-id');\n      const quantity = e.target.getAttribute('data-quantity');\n      const formData = {\n        items: [{\n          id: productId,\n          quantity: quantity\n        }]\n      };\n      fetch(`${window.Shopify.routes.root}cart/add.js`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(formData)\n      }).then(response => {\n        if (response.status === 200) {\n          console.log('Product added to cart successfully');\n        }\n        return response.json();\n      }).catch(error => {\n        console.error('Error adding to cart:', error);\n      });\n    });\n  });\n});\nwindow.onscroll = function () {\n  makeSticky();\n};\n\n// Get the navigation element\nvar navbar = document.querySelector(\".tp-sticky\");\n\n// Get the offset position of the navbar\nvar stickyOffset = navbar.offsetTop;\nconsole.log(window.pageYOffset, stickyOffset, 'offset');\n// Add or remove the sticky class based on scroll position\nfunction makeSticky() {\n  if (window.pageYOffset >= stickyOffset) {\n    navbar.classList.add(\"sticky\");\n  } else {\n    navbar.classList.remove(\"sticky\");\n  }\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9ucy13aXRoLW5hdi9zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2LmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2NvbGxlY3Rpb25zLXdpdGgtbmF2L3NlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXYuanM/NmQzZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0ICcuL3NlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXYuY3NzJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgcGFyZW50U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2Jyk7XG5cbiAgY29uc3QgY29sbGVjdGlvbkxpbmtzID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuY29sbGVjdGlvbi1saW5rJyk7XG5cbiAgY29sbGVjdGlvbkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29sbGVjdGlvbkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgIGxpbmsuY2xvc2VzdCgnbGknKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNsb3Nlc3QoJ2xpJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke3RoaXMuZ2V0QXR0cmlidXRlKCdocmVmJyl9YCk7XG4gICAgICBpZiAodGFyZ2V0U2VjdGlvbikge1xuICAgICAgICB0YXJnZXRTZWN0aW9uLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvLyBRdWFudGl0eSBjb250cm9sIGxvZ2ljXG4gIGNvbnN0IHF1YW50aXR5SW5wdXRzID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcucXVhbnRpdHlfX2lucHV0Jyk7XG4gIGNvbnN0IHF1YW50aXR5TWludXNCdXR0b25zID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcucXVhbnRpdHlfX2J1dHRvbltuYW1lPVwibWludXNcIl0nKTtcbiAgY29uc3QgcXVhbnRpdHlQbHVzQnV0dG9ucyA9IHBhcmVudFNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbCgnLnF1YW50aXR5X19idXR0b25bbmFtZT1cInBsdXNcIl0nKTtcblxuICBxdWFudGl0eU1pbnVzQnV0dG9ucy5mb3JFYWNoKChtaW51c0J1dHRvbiwgaW5kZXgpID0+IHtcbiAgICBtaW51c0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gcXVhbnRpdHlJbnB1dHNbaW5kZXhdO1xuICAgICAgbGV0IHF1YW50aXR5ID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xuICAgICAgaWYgKHF1YW50aXR5ID4gMSkge1xuICAgICAgICBjb25zdCBhZGRUb0NhcnRCdXR0b24gPSBtaW51c0J1dHRvbi5jbG9zZXN0KCcuc2VjdGlvbi1jb2xsZWN0aW9ucy13aXRoLW5hdl9fcHJvZHVjdCcpLnF1ZXJ5U2VsZWN0b3IoJy5qcy1hdGMnKTtcbiAgICAgICAgYWRkVG9DYXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1xdWFudGl0eScsIGlucHV0LnZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcXVhbnRpdHlQbHVzQnV0dG9ucy5mb3JFYWNoKChwbHVzQnV0dG9uLCBpbmRleCkgPT4ge1xuICAgIHBsdXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHF1YW50aXR5SW5wdXRzW2luZGV4XTtcbiAgICAgIGxldCBxdWFudGl0eSA9IHBhcnNlSW50KGlucHV0LnZhbHVlKTtcbiAgICAgIGNvbnN0IGFkZFRvQ2FydEJ1dHRvbiA9IHBsdXNCdXR0b24uY2xvc2VzdCgnLnNlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXZfX3Byb2R1Y3QnKS5xdWVyeVNlbGVjdG9yKCcuanMtYXRjJyk7XG4gICAgICBhZGRUb0NhcnRCdXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLXF1YW50aXR5JywgaW5wdXQudmFsdWUpO1xuICAgIH0pO1xuICB9KTtcblxuXG4gIC8vIFZhcmlhbnQgc2VsZWN0b3JcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXZfX3Byb2R1Y3QnKS5mb3JFYWNoKHByb2R1Y3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSBwcm9kdWN0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdC1pZCcpO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHByb2R1Y3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52YXJpYW50LXNlbGVjdG9ycyBzZWxlY3QnKTtcbiAgICBjb25zdCBhZGRUb0NhcnRCdXR0b25TID0gcHJvZHVjdEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWF0YycpO1xuXG4gICAgZnVuY3Rpb24gZ2V0VmFyaWFudElkKHNlbGVjdGVkT3B0aW9ucykge1xuICAgICAgY29uc3QgcHJvZHVjdFZhcmlhbnRzID0gd2luZG93LnByb2R1Y3RWYXJpYW50c1twcm9kdWN0SWRdO1xuICAgICAgY29uc3QgdmFyaWFudCA9IHByb2R1Y3RWYXJpYW50cy5maW5kKHZhcmlhbnQgPT5cbiAgICAgICAgdmFyaWFudC5vcHRpb25zLmV2ZXJ5KChvcHRpb24sIGluZGV4KSA9PiBvcHRpb24gPT09IHNlbGVjdGVkT3B0aW9uc1tpbmRleF0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIHZhcmlhbnQgPyB2YXJpYW50LmlkIDogJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmFyaWFudEltYWdlKHNlbGVjdGVkT3B0aW9ucykge1xuICAgICAgY29uc3QgcHJvZHVjdFZhcmlhbnRzID0gd2luZG93LnByb2R1Y3RWYXJpYW50c1twcm9kdWN0SWRdO1xuICAgICAgY29uc3QgdmFyaWFudCA9IHByb2R1Y3RWYXJpYW50cy5maW5kKHZhcmlhbnQgPT5cbiAgICAgICAgdmFyaWFudC5vcHRpb25zLmV2ZXJ5KChvcHRpb24sIGluZGV4KSA9PiBvcHRpb24gPT09IHNlbGVjdGVkT3B0aW9uc1tpbmRleF0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIHZhcmlhbnQgPyB2YXJpYW50LmltYWdlIDogJyc7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFZhcmlhbnRQcmljZShzZWxlY3RlZE9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IHByb2R1Y3RWYXJpYW50cyA9IHdpbmRvdy5wcm9kdWN0VmFyaWFudHNbcHJvZHVjdElkXTtcbiAgICAgIGNvbnN0IHZhcmlhbnQgPSBwcm9kdWN0VmFyaWFudHMuZmluZCh2YXJpYW50ID0+XG4gICAgICAgIHZhcmlhbnQub3B0aW9ucy5ldmVyeSgob3B0aW9uLCBpbmRleCkgPT4gb3B0aW9uID09PSBzZWxlY3RlZE9wdGlvbnNbaW5kZXhdKVxuICAgICAgKTtcbiAgICAgIHJldHVybiB2YXJpYW50ID8gdmFyaWFudC5wcmljZSA6ICcnO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRWYXJpYW50Q29tcGFyZVByaWNlKHNlbGVjdGVkT3B0aW9ucykge1xuICAgICAgY29uc3QgcHJvZHVjdFZhcmlhbnRzID0gd2luZG93LnByb2R1Y3RWYXJpYW50c1twcm9kdWN0SWRdO1xuICAgICAgY29uc3QgdmFyaWFudCA9IHByb2R1Y3RWYXJpYW50cy5maW5kKHZhcmlhbnQgPT5cbiAgICAgICAgdmFyaWFudC5vcHRpb25zLmV2ZXJ5KChvcHRpb24sIGluZGV4KSA9PiBvcHRpb24gPT09IHNlbGVjdGVkT3B0aW9uc1tpbmRleF0pXG4gICAgICApO1xuICAgICAgcmV0dXJuIHZhcmlhbnQgPyB2YXJpYW50LmNvbXBhcmVfYXRfcHJpY2UgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVBZGRUb0NhcnRCdXR0b24oKSB7XG4gICAgICBsZXQgc2VsZWN0ZWRPcHRpb25zID0gW107XG4gICAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICAgIHNlbGVjdGVkT3B0aW9ucy5wdXNoKHNlbGVjdG9yLnZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2YXJpYW50SWQgPSBnZXRWYXJpYW50SWQoc2VsZWN0ZWRPcHRpb25zKTtcbiAgICAgIGNvbnN0IGdldEltYWdlID0gZ2V0VmFyaWFudEltYWdlKHNlbGVjdGVkT3B0aW9ucyk7XG4gICAgICBjb25zdCBnZXRQcmljZSA9IGdldFZhcmlhbnRQcmljZShzZWxlY3RlZE9wdGlvbnMpO1xuICAgICAgY29uc3QgZ2V0Q29tcGFyZVByaWNlID0gZ2V0VmFyaWFudENvbXBhcmVQcmljZShzZWxlY3RlZE9wdGlvbnMpO1xuICAgICAgY29uc3QgcHJpY2VDb250YWluZXIgPSBwcm9kdWN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdmFyaWFudC1wcmljZScpO1xuICAgICAgY29uc3QgY29tcGFyZVByaWNlQ29udGFpbmVyID0gcHJvZHVjdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXZhcmlhbnQtY29tcGFyZS1wcmljZScpO1xuICAgICAgY29uc3QgcHJpY2VDb250YWluZXIyID0gcHJvZHVjdEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXZhcmlhbnQtcHJpY2UtMicpO1xuICAgICAgY29uc3QgY29tcGFyZVByaWNlQ29udGFpbmVyMiA9IHByb2R1Y3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy12YXJpYW50LWNvbXBhcmUtcHJpY2UtMicpO1xuICAgICAgcHJpY2VDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0UHJpY2U7XG4gICAgICBjb21wYXJlUHJpY2VDb250YWluZXIuaW5uZXJIVE1MID0gZ2V0Q29tcGFyZVByaWNlO1xuICAgICAgcHJpY2VDb250YWluZXIyLmlubmVySFRNTCA9IGdldFByaWNlO1xuICAgICAgY29tcGFyZVByaWNlQ29udGFpbmVyMi5pbm5lckhUTUwgPSBnZXRDb21wYXJlUHJpY2U7XG4gICAgICBjb25zdCBpbWFnZUNvbnRhaW5lciA9IHByb2R1Y3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy12YXJpYW50LWltYWdlJyk7XG4gICAgICBpbWFnZUNvbnRhaW5lci5zcmMgPSBnZXRJbWFnZTtcbiAgICAgIGNvbnNvbGUubG9nKGdldEltYWdlLCAnaW1hZ2UnKVxuICAgICAgYWRkVG9DYXJ0QnV0dG9uUy5mb3JFYWNoKGFkZFRvQ2FydEJ1dHRvbiA9PiB7XG4gICAgICAgIGFkZFRvQ2FydEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdC1pZCcsIHZhcmlhbnRJZCk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHNlbGVjdG9ycy5mb3JFYWNoKHNlbGVjdG9yID0+IHtcbiAgICAgIHNlbGVjdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUFkZFRvQ2FydEJ1dHRvbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIEFkZCB0byBjYXJ0IGxvZ2ljXG4gIGNvbnN0IGFkZFRvQ2FydEJ1dHRvbnMgPSBwYXJlbnRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hdGMnKTtcblxuICBhZGRUb0NhcnRCdXR0b25zLmZvckVhY2goKGFkZFRvQ2FydEJ1dHRvbikgPT4ge1xuICAgIGFkZFRvQ2FydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBjb25zdCBwcm9kdWN0SWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdC1pZCcpO1xuICAgICAgY29uc3QgcXVhbnRpdHkgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcXVhbnRpdHknKTtcblxuICAgICAgY29uc3QgZm9ybURhdGEgPSB7XG4gICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6IHByb2R1Y3RJZCxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcblxuICAgICAgZmV0Y2goYCR7d2luZG93LlNob3BpZnkucm91dGVzLnJvb3R9Y2FydC9hZGQuanNgLCB7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUHJvZHVjdCBhZGRlZCB0byBjYXJ0IHN1Y2Nlc3NmdWxseScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWRkaW5nIHRvIGNhcnQ6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICBtYWtlU3RpY2t5KCk7XG59O1xuXG4vLyBHZXQgdGhlIG5hdmlnYXRpb24gZWxlbWVudFxudmFyIG5hdmJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudHAtc3RpY2t5XCIpO1xuXG4vLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXG52YXIgc3RpY2t5T2Zmc2V0ID0gbmF2YmFyLm9mZnNldFRvcDtcbmNvbnNvbGUubG9nKHdpbmRvdy5wYWdlWU9mZnNldCwgc3RpY2t5T2Zmc2V0LCAnb2Zmc2V0Jylcbi8vIEFkZCBvciByZW1vdmUgdGhlIHN0aWNreSBjbGFzcyBiYXNlZCBvbiBzY3JvbGwgcG9zaXRpb25cbmZ1bmN0aW9uIG1ha2VTdGlja3koKSB7XG4gIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPj0gc3RpY2t5T2Zmc2V0KSB7XG4gICAgbmF2YmFyLmNsYXNzTGlzdC5hZGQoXCJzdGlja3lcIik7XG4gIH0gZWxzZSB7XG4gICAgbmF2YmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJzdGlja3lcIik7XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/collections-with-nav/section-collections-with-nav.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/collections-with-nav.js":
/*!*************************************************************!*\
  !*** ./src/scripts/entries/section/collections-with-nav.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_collections_with_nav_section_collections_with_nav_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/collections-with-nav/section-collections-with-nav.js */ \"./src/modules/collections-with-nav/section-collections-with-nav.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_collections_with_nav_section_collections_with_nav_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'CollectionsWithNav');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vY29sbGVjdGlvbnMtd2l0aC1uYXYuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vY29sbGVjdGlvbnMtd2l0aC1uYXYuanM/OWNhOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgQ29sbGVjdGlvbnNXaXRoTmF2IGZyb20gJ21vZHVsZXMvY29sbGVjdGlvbnMtd2l0aC1uYXYvc2VjdGlvbi1jb2xsZWN0aW9ucy13aXRoLW5hdi5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChDb2xsZWN0aW9uc1dpdGhOYXYsICdDb2xsZWN0aW9uc1dpdGhOYXYnKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/collections-with-nav.js\n");

/***/ }),

/***/ "./src/modules/collections-with-nav/section-collections-with-nav.css":
/*!***************************************************************************!*\
  !*** ./src/modules/collections-with-nav/section-collections-with-nav.css ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9ucy13aXRoLW5hdi9zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2LmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvY29sbGVjdGlvbnMtd2l0aC1uYXYvc2VjdGlvbi1jb2xsZWN0aW9ucy13aXRoLW5hdi5jc3M/NWZkMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/collections-with-nav/section-collections-with-nav.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/collections-with-nav.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);