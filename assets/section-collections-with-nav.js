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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_collections_with_nav_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-collections-with-nav.css */ \"./src/modules/collections-with-nav/section-collections-with-nav.css\");\n/* eslint-disable */\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  const parentSection = document.querySelector('.section-collections-with-nav');\n  const collectionLinks = parentSection.querySelectorAll('.collection-link');\n  collectionLinks.forEach(link => {\n    link.addEventListener('click', function (event) {\n      event.preventDefault();\n      collectionLinks.forEach(link => {\n        link.closest('li').classList.remove('active');\n      });\n      this.closest('li').classList.add('active');\n      const targetSection = parentSection.querySelector(`${this.getAttribute('href')}`);\n      if (targetSection) {\n        targetSection.scrollIntoView({\n          behavior: 'smooth'\n        });\n      }\n    });\n  });\n\n  // Quantity control logic\n  const quantityInputs = parentSection.querySelectorAll('.quantity__input');\n  const quantityMinusButtons = parentSection.querySelectorAll('.quantity__button[name=\"minus\"]');\n  const quantityPlusButtons = parentSection.querySelectorAll('.quantity__button[name=\"plus\"]');\n  quantityMinusButtons.forEach((minusButton, index) => {\n    minusButton.addEventListener('click', () => {\n      const input = quantityInputs[index];\n      let quantity = parseInt(input.value);\n      if (quantity > 1) {\n        const addToCartButton = minusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');\n        addToCartButton.setAttribute('data-quantity', input.value);\n      }\n    });\n  });\n  quantityPlusButtons.forEach((plusButton, index) => {\n    plusButton.addEventListener('click', () => {\n      const input = quantityInputs[index];\n      let quantity = parseInt(input.value);\n      const addToCartButton = plusButton.closest('.section-collections-with-nav__product').querySelector('.js-atc');\n      addToCartButton.setAttribute('data-quantity', input.value);\n    });\n  });\n  console.log('ovo radi ili ne radi');\n\n  // Variant selector\n  document.querySelectorAll('.section-collections-with-nav__product').forEach(productElement => {\n    console.log('productElement', productElement);\n    const productId = productElement.getAttribute('data-product-id');\n    const selectors = productElement.querySelectorAll('.variant-selectors select');\n    const addToCartButton = productElement.querySelector('.js-atc');\n    function getVariantId(selectedOptions) {\n      const productVariants = window.productVariants[productId];\n      const variant = productVariants.find(variant => variant.options.every((option, index) => option === selectedOptions[index]));\n      return variant ? variant.id : '';\n    }\n    function updateAddToCartButton() {\n      let selectedOptions = [];\n      selectors.forEach(selector => {\n        selectedOptions.push(selector.value);\n      });\n      const variantId = getVariantId(selectedOptions);\n      addToCartButton.setAttribute('data-product-id', variantId);\n    }\n    selectors.forEach(selector => {\n      selector.addEventListener('change', updateAddToCartButton);\n      console.log('selector', selector);\n    });\n  });\n\n  // Add to cart logic\n  const addToCartButtons = parentSection.querySelectorAll('.js-atc');\n  addToCartButtons.forEach(addToCartButton => {\n    addToCartButton.addEventListener('click', e => {\n      const productId = e.target.getAttribute('data-product-id');\n      const quantity = e.target.getAttribute('data-quantity');\n      const formData = {\n        items: [{\n          id: productId,\n          quantity: quantity\n        }]\n      };\n      fetch(`${window.Shopify.routes.root}cart/add.js`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(formData)\n      }).then(response => {\n        if (response.status === 200) {\n          console.log('Product added to cart successfully');\n          // Optionally, show a confirmation to the user\n        }\n\n        return response.json();\n      }).catch(error => {\n        console.error('Error adding to cart:', error);\n      });\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9ucy13aXRoLW5hdi9zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2LmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2NvbGxlY3Rpb25zLXdpdGgtbmF2L3NlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXYuanM/NmQzZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0ICcuL3NlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXYuY3NzJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgcGFyZW50U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2Jyk7XG5cbiAgY29uc3QgY29sbGVjdGlvbkxpbmtzID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuY29sbGVjdGlvbi1saW5rJyk7XG5cbiAgY29sbGVjdGlvbkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29sbGVjdGlvbkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICAgIGxpbmsuY2xvc2VzdCgnbGknKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNsb3Nlc3QoJ2xpJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICAgIGNvbnN0IHRhcmdldFNlY3Rpb24gPSBwYXJlbnRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoYCR7dGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gKTtcbiAgICAgIGlmICh0YXJnZXRTZWN0aW9uKSB7XG4gICAgICAgIHRhcmdldFNlY3Rpb24uc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFF1YW50aXR5IGNvbnRyb2wgbG9naWNcbiAgY29uc3QgcXVhbnRpdHlJbnB1dHMgPSBwYXJlbnRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWFudGl0eV9faW5wdXQnKTtcbiAgY29uc3QgcXVhbnRpdHlNaW51c0J1dHRvbnMgPSBwYXJlbnRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5xdWFudGl0eV9fYnV0dG9uW25hbWU9XCJtaW51c1wiXScpO1xuICBjb25zdCBxdWFudGl0eVBsdXNCdXR0b25zID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcucXVhbnRpdHlfX2J1dHRvbltuYW1lPVwicGx1c1wiXScpO1xuXG4gIHF1YW50aXR5TWludXNCdXR0b25zLmZvckVhY2goKG1pbnVzQnV0dG9uLCBpbmRleCkgPT4ge1xuICAgIG1pbnVzQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBxdWFudGl0eUlucHV0c1tpbmRleF07XG4gICAgICBsZXQgcXVhbnRpdHkgPSBwYXJzZUludChpbnB1dC52YWx1ZSk7XG4gICAgICBpZiAocXVhbnRpdHkgPiAxKSB7XG4gICAgICAgIGNvbnN0IGFkZFRvQ2FydEJ1dHRvbiA9IG1pbnVzQnV0dG9uLmNsb3Nlc3QoJy5zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2X19wcm9kdWN0JykucXVlcnlTZWxlY3RvcignLmpzLWF0YycpO1xuICAgICAgICBhZGRUb0NhcnRCdXR0b24uc2V0QXR0cmlidXRlKCdkYXRhLXF1YW50aXR5JywgaW5wdXQudmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBxdWFudGl0eVBsdXNCdXR0b25zLmZvckVhY2goKHBsdXNCdXR0b24sIGluZGV4KSA9PiB7XG4gICAgcGx1c0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gcXVhbnRpdHlJbnB1dHNbaW5kZXhdO1xuICAgICAgbGV0IHF1YW50aXR5ID0gcGFyc2VJbnQoaW5wdXQudmFsdWUpO1xuICAgICAgY29uc3QgYWRkVG9DYXJ0QnV0dG9uID0gcGx1c0J1dHRvbi5jbG9zZXN0KCcuc2VjdGlvbi1jb2xsZWN0aW9ucy13aXRoLW5hdl9fcHJvZHVjdCcpLnF1ZXJ5U2VsZWN0b3IoJy5qcy1hdGMnKTtcbiAgICAgIGFkZFRvQ2FydEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtcXVhbnRpdHknLCBpbnB1dC52YWx1ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKCdvdm8gcmFkaSBpbGkgbmUgcmFkaScpXG5cbiAgLy8gVmFyaWFudCBzZWxlY3RvclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbi1jb2xsZWN0aW9ucy13aXRoLW5hdl9fcHJvZHVjdCcpLmZvckVhY2gocHJvZHVjdEVsZW1lbnQgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdwcm9kdWN0RWxlbWVudCcsIHByb2R1Y3RFbGVtZW50KTtcbiAgICBjb25zdCBwcm9kdWN0SWQgPSBwcm9kdWN0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdC1pZCcpO1xuICAgIGNvbnN0IHNlbGVjdG9ycyA9IHByb2R1Y3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52YXJpYW50LXNlbGVjdG9ycyBzZWxlY3QnKTtcbiAgICBjb25zdCBhZGRUb0NhcnRCdXR0b24gPSBwcm9kdWN0RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYXRjJyk7XG5cbiAgICBmdW5jdGlvbiBnZXRWYXJpYW50SWQoc2VsZWN0ZWRPcHRpb25zKSB7XG4gICAgICBjb25zdCBwcm9kdWN0VmFyaWFudHMgPSB3aW5kb3cucHJvZHVjdFZhcmlhbnRzW3Byb2R1Y3RJZF07XG4gICAgICBjb25zdCB2YXJpYW50ID0gcHJvZHVjdFZhcmlhbnRzLmZpbmQodmFyaWFudCA9PlxuICAgICAgICB2YXJpYW50Lm9wdGlvbnMuZXZlcnkoKG9wdGlvbiwgaW5kZXgpID0+IG9wdGlvbiA9PT0gc2VsZWN0ZWRPcHRpb25zW2luZGV4XSlcbiAgICAgICk7XG4gICAgICByZXR1cm4gdmFyaWFudCA/IHZhcmlhbnQuaWQgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVBZGRUb0NhcnRCdXR0b24oKSB7XG4gICAgICBsZXQgc2VsZWN0ZWRPcHRpb25zID0gW107XG4gICAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICAgIHNlbGVjdGVkT3B0aW9ucy5wdXNoKHNlbGVjdG9yLnZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB2YXJpYW50SWQgPSBnZXRWYXJpYW50SWQoc2VsZWN0ZWRPcHRpb25zKTtcblxuICAgICAgYWRkVG9DYXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9kdWN0LWlkJywgdmFyaWFudElkKTtcbiAgICB9XG5cbiAgICBzZWxlY3RvcnMuZm9yRWFjaChzZWxlY3RvciA9PiB7XG4gICAgICBzZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVBZGRUb0NhcnRCdXR0b24pO1xuICAgICAgY29uc29sZS5sb2coJ3NlbGVjdG9yJywgc2VsZWN0b3IpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBBZGQgdG8gY2FydCBsb2dpY1xuICBjb25zdCBhZGRUb0NhcnRCdXR0b25zID0gcGFyZW50U2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYXRjJyk7XG5cbiAgYWRkVG9DYXJ0QnV0dG9ucy5mb3JFYWNoKChhZGRUb0NhcnRCdXR0b24pID0+IHtcbiAgICBhZGRUb0NhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgcHJvZHVjdElkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3QtaWQnKTtcbiAgICAgIGNvbnN0IHF1YW50aXR5ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXF1YW50aXR5Jyk7XG5cbiAgICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBwcm9kdWN0SWQsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdHksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH07XG5cbiAgICAgIGZldGNoKGAke3dpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290fWNhcnQvYWRkLmpzYCwge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKSxcbiAgICAgIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb2R1Y3QgYWRkZWQgdG8gY2FydCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHNob3cgYSBjb25maXJtYXRpb24gdG8gdGhlIHVzZXJcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFkZGluZyB0byBjYXJ0OicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/collections-with-nav/section-collections-with-nav.js\n");

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