"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-pdp-hero-tertiary"],{

/***/ "./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.js":
/*!********************************************************************!*\
  !*** ./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_tertiary_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero-tertiary.css */ \"./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.css\");\n/* eslint-disable */\n\nconst allShopSections = document.querySelectorAll(\".section-pdp-hero-tertiary\");\nif (!!allShopSections.length) {\n  allShopSections.forEach(section => {\n    const checkboxes = section.querySelectorAll(\".js-upsell-checkbox\");\n    checkboxes.forEach(checkbox => {\n      checkbox.addEventListener(\"change\", function () {\n        const upsellProducts = section.querySelectorAll(\".pdp-hero__upsell-wrapper\");\n        const upsellMessages = section.querySelectorAll(\".pdp-hero__upsell-message\");\n\n        // upsellProducts.forEach(el => {\n        //     el.classList.remove('active')\n        // })\n\n        // upsellMessages.forEach(el => {\n        //     el.classList.remove('active')\n        // })\n\n        const upsellProduct = checkbox.closest(\".pdp-hero__upsell-wrapper\");\n        // const upsellMessage = checkbox.closest('.pdp-hero__upsell-wrapper').previousElementSibling\n\n        upsellProduct.classList.toggle(\"active\");\n        // upsellMessage.classList.add('active')\n\n        updateTotalPrice();\n      });\n    });\n\n    //Price handle\n    function updateTotalPrice() {\n      let currency = document.querySelector(\".section-pdp-hero-tertiary\").getAttribute(\"data-currency\");\n      let productSelectors = document.querySelectorAll(\".js-product-selector.active\");\n      let totalMainProductPrice = 0;\n      let totalMainComparePrice = 0;\n      let mainProductPrice = document.querySelector(\".js-main-product-price\");\n      let mainComparePrice = document.querySelector(\".js-price-compare-main-product\");\n      let percent = document.querySelector(\".pdp-hero__discount\");\n      productSelectors.forEach(productSelector => {\n        const productPrice = parseFloat(productSelector.getAttribute(\"data-product-price\"));\n        const productComparePrice = parseFloat(productSelector.getAttribute(\"data-product-compare-price\"));\n        totalMainProductPrice += productPrice;\n        totalMainComparePrice += productComparePrice;\n      });\n      console.log(totalMainProductPrice);\n      percent = (1 - totalMainProductPrice / totalMainComparePrice) * 100;\n      totalMainProductPrice /= 100;\n      totalMainComparePrice /= 100;\n      console.log(percent, \"percent\");\n      // mainProductPrice.innerHTML = currency + totalMainProductPrice/100\n      mainProductPrice.textContent = totalMainProductPrice.toLocaleString(\"en-US\", {\n        style: \"currency\",\n        currency: currency\n      });\n      mainComparePrice.textContent = totalMainComparePrice.toLocaleString(\"en-US\", {\n        style: \"currency\",\n        currency: currency\n      });\n      if (document.querySelector('.pdp-hero__product-info').classList.contains('percent-info')) {\n        let activeNumber = document.querySelectorAll('.js-product-selector.active').length;\n        if (activeNumber < 4) {\n          document.querySelector('.pdp-hero__discount').textContent = `50% OFF`;\n        }\n        if (activeNumber == 4) {\n          document.querySelector('.pdp-hero__discount').textContent = `60% OFF`;\n        }\n        if (activeNumber == 5) {\n          document.querySelector('.pdp-hero__discount').textContent = `65% OFF`;\n        }\n        console.log(activeNumber, 'activeNumber');\n      }\n    }\n    document.addEventListener(\"DOMContentLoaded\", function () {\n      console.log(\"DOMContentLoaded\");\n      updateTotalPrice();\n    });\n    // updateTotalPrice()\n\n    // //Icons slider\n    const sliderIcons = section.querySelector(\".pdp-hero__icons\");\n    if (sliderIcons) {\n      const arrowPrev = section.querySelector(\".pdp-hero__arrow-prev\");\n      const arrowNext = section.querySelector(\".pdp-hero__arrow-next\");\n      const pdpHeroIconsSlider = new Swiper(sliderIcons, {\n        slidesPerView: 2,\n        spaceBetween: 10,\n        loop: true,\n        watchOverflow: true,\n        navigation: {\n          nextEl: arrowNext,\n          prevEl: arrowPrev\n        },\n        breakpoints: {\n          768: {\n            slidesPerView: 3,\n            spaceBetween: 10\n          },\n          1024: {\n            slidesPerView: 4,\n            spaceBetween: 15\n          }\n        }\n      });\n      const iconsElements = section.querySelectorAll(\".pdp-hero__icon-container\");\n      if (iconsElements.length <= 4 && window.innerWidth > 1023) {\n        sliderIcons.classList.add(\"pdp-hero__icons--no-swiper\");\n      }\n    }\n    const props = section.querySelectorAll(\".pdp-hero__prop\");\n    if (props.length > 0) {\n      props.forEach(prop => {\n        const propDescription = prop.querySelector(\".pdp-hero__prop-description\");\n        const propHeader = prop.querySelector(\".pdp-hero__prop-header\");\n        if (propDescription && propHeader) {\n          propHeader.addEventListener(\"click\", () => {\n            const propParent = propHeader.closest(\".pdp-hero__prop\");\n            propParent.classList.toggle(\"show\");\n            propDescription.style.maxHeight = propDescription.scrollHeight + \"px\";\n            !propParent.classList.contains(\"show\") ? propDescription.style.maxHeight = null : propDescription.style.maxHeight = propDescription.scrollHeight + \"px\";\n          });\n        }\n      });\n    }\n  });\n  const addToCarts = document.querySelectorAll(\".js-add-to-cart-pd\");\n  addToCarts.forEach(addToCart => {\n    addToCart.addEventListener(\"click\", e => {\n      const productSelectors = document.querySelectorAll(\".js-product-selector.active\");\n      console.log(productSelectors, \"productSelectors\");\n      const addItems = [];\n      productSelectors.forEach(productSelector => {\n        const _this = productSelector;\n        const productId = _this.getAttribute(\"data-product-id\");\n        addItems.push({\n          id: productId,\n          quantity: 1\n        });\n      });\n      console.log(addItems, \"addItems\");\n      const formData = {\n        items: addItems\n      };\n      fetch(window.Shopify.routes.root + \"cart/add.js\", {\n        method: \"POST\",\n        headers: {\n          \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify(formData)\n      }).then(response => {\n        console.log(response.status, \"ok\");\n        return response.json();\n      }).catch(error => {\n        console.error(\"Error:\", error);\n      });\n    });\n  });\n  var variantSelectorSFirst = document.querySelectorAll(\".variant-selector-1\");\n  var variantSelectorSSecond = document.querySelectorAll(\".variant-selector-2\");\n  variantSelectorSFirst.forEach(variantSelectorFirst => {\n    variantSelectorFirst.addEventListener(\"change\", function (e) {\n      let _this = e;\n      console.log(_this, this, \"variantSelectorFirst\");\n      let variantId = this.value;\n      let nameFirst = variantId;\n      let nameSecond = this.parentNode.querySelector(\".variant-selector-2\").options[this.parentNode.querySelector(\".variant-selector-2\").selectedIndex].text;\n      let selectedName = nameFirst + \" / \" + nameSecond;\n      console.log(selectedName, \"selectedName\");\n      let productId = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-variant\");\n      console.log(productId, \"productId\");\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-id\", productId);\n      let productPrice = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price\");\n      let productPriceNoFormat = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price-noformat\");\n      let productComparePrice = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-compare-price\");\n      let productComparePriceNoFormat = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price-noformat\");\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-price\", productPriceNoFormat);\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-compare-price\", productComparePriceNoFormat);\n      // window.selectLogic.addon = productId\n      this.parentNode.parentNode.parentNode.querySelector(\".js-upsel-product-price\").innerHTML = productPrice;\n      this.parentNode.parentNode.parentNode.querySelector(\".js-price-discount\").innerHTML = productComparePrice;\n      setTimeout(() => {\n        updateTotalPrice();\n      }, \"1000\");\n\n      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;\n      // addUpsell.setAttribute('data-addon-id', productId);\n    });\n  });\n\n  variantSelectorSSecond.forEach(variantSelectorSecond => {\n    variantSelectorSecond.addEventListener(\"change\", function (e) {\n      let _this = e;\n      let variantId = this.value;\n      let nameSecond = variantId;\n      let nameFirst = this.parentNode.querySelector(\".variant-selector-1\").options[this.parentNode.querySelector(\".variant-selector-1\").selectedIndex].text;\n      let selectedName = nameFirst + \" / \" + nameSecond;\n      let productId = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-variant\");\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-id\", productId);\n      let productPrice = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price\");\n      let productPriceNoFormat = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price-noformat\");\n      let productComparePrice = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-compare-price\");\n      let productComparePriceNoFormat = this.parentNode.parentNode.parentNode.querySelector(\"[data-title='\" + selectedName + \"']\").getAttribute(\"data-price-noformat\");\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-price\", productPriceNoFormat);\n      this.parentNode.parentNode.parentNode.querySelector(\".js-product-selector\").setAttribute(\"data-product-compare-price\", productComparePriceNoFormat);\n      // window.selectLogic.addon = productId\n      this.parentNode.parentNode.parentNode.querySelector(\".js-upsel-product-price\").innerHTML = productPrice;\n      this.parentNode.parentNode.parentNode.querySelector(\".js-price-discount\").innerHTML = productComparePrice;\n      setTimeout(() => {\n        let currency = document.querySelector(\".section-pdp-hero-tertiary\").getAttribute(\"data-currency\");\n        let productSelectors = document.querySelectorAll(\".js-product-selector.active\");\n        let totalMainProductPrice = 0;\n        let totalMainComparePrice = 0;\n        let mainProductPrice = document.querySelector(\".js-main-product-price\");\n        let mainComparePrice = document.querySelector(\".js-price-compare-main-product\");\n        productSelectors.forEach(productSelector => {\n          const productPrice = parseFloat(productSelector.getAttribute(\"data-product-price\"));\n          const productComparePrice = parseFloat(productSelector.getAttribute(\"data-product-compare-price\"));\n          totalMainProductPrice += productPrice;\n          totalMainComparePrice += productComparePrice;\n        });\n        console.log(totalMainProductPrice);\n        totalMainProductPrice /= 100;\n        totalMainComparePrice /= 100;\n        // mainProductPrice.innerHTML = currency + totalMainProductPrice/100\n        mainProductPrice.textContent = totalMainProductPrice.toLocaleString(\"en-US\", {\n          style: \"currency\",\n          currency: currency\n        });\n        mainComparePrice.textContent = totalMainComparePrice.toLocaleString(\"en-US\", {\n          style: \"currency\",\n          currency: currency\n        });\n        console.log(totalMainProductPrice, \"mainProductPricemainProductPrice\");\n      }, \"1000\");\n      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;\n      // addUpsell.setAttribute('data-addon-id', productId);\n    });\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby10ZXJ0aWFyeS9zZWN0aW9uLXBkcC1oZXJvLXRlcnRpYXJ5LmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFFQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFHQTtBQUdBO0FBR0E7QUFHQTtBQUdBO0FBTUE7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFHQTtBQUdBO0FBR0E7QUFHQTtBQUdBO0FBR0E7QUFHQTtBQU1BO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFHQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFBQTtBQUVBO0FBRUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvcGRwLWhlcm8tdGVydGlhcnkvc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeS5qcz9kMDY2Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlICovXG5pbXBvcnQgXCIuL3NlY3Rpb24tcGRwLWhlcm8tdGVydGlhcnkuY3NzXCI7XG5cbmNvbnN0IGFsbFNob3BTZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeVwiKTtcblxuaWYgKCEhYWxsU2hvcFNlY3Rpb25zLmxlbmd0aCkge1xuICBhbGxTaG9wU2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbikgPT4ge1xuICAgIGNvbnN0IGNoZWNrYm94ZXMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuanMtdXBzZWxsLWNoZWNrYm94XCIpO1xuXG4gICAgY2hlY2tib3hlcy5mb3JFYWNoKChjaGVja2JveCkgPT4ge1xuICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHVwc2VsbFByb2R1Y3RzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgIFwiLnBkcC1oZXJvX191cHNlbGwtd3JhcHBlclwiXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHVwc2VsbE1lc3NhZ2VzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgIFwiLnBkcC1oZXJvX191cHNlbGwtbWVzc2FnZVwiXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gdXBzZWxsUHJvZHVjdHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIC8vICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgICAvLyB9KVxuXG4gICAgICAgIC8vIHVwc2VsbE1lc3NhZ2VzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAvLyAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgLy8gfSlcblxuICAgICAgICBjb25zdCB1cHNlbGxQcm9kdWN0ID0gY2hlY2tib3guY2xvc2VzdChcIi5wZHAtaGVyb19fdXBzZWxsLXdyYXBwZXJcIik7XG4gICAgICAgIC8vIGNvbnN0IHVwc2VsbE1lc3NhZ2UgPSBjaGVja2JveC5jbG9zZXN0KCcucGRwLWhlcm9fX3Vwc2VsbC13cmFwcGVyJykucHJldmlvdXNFbGVtZW50U2libGluZ1xuXG4gICAgICAgIHVwc2VsbFByb2R1Y3QuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcbiAgICAgICAgLy8gdXBzZWxsTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuXG4gICAgICAgIHVwZGF0ZVRvdGFsUHJpY2UoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy9QcmljZSBoYW5kbGVcbiAgICBmdW5jdGlvbiB1cGRhdGVUb3RhbFByaWNlKCkge1xuICAgICAgbGV0IGN1cnJlbmN5ID0gZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeVwiKVxuICAgICAgICAuZ2V0QXR0cmlidXRlKFwiZGF0YS1jdXJyZW5jeVwiKTtcbiAgICAgIGxldCBwcm9kdWN0U2VsZWN0b3JzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCIuanMtcHJvZHVjdC1zZWxlY3Rvci5hY3RpdmVcIlxuICAgICAgKTtcbiAgICAgIGxldCB0b3RhbE1haW5Qcm9kdWN0UHJpY2UgPSAwO1xuICAgICAgbGV0IHRvdGFsTWFpbkNvbXBhcmVQcmljZSA9IDA7XG4gICAgICBsZXQgbWFpblByb2R1Y3RQcmljZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuanMtbWFpbi1wcm9kdWN0LXByaWNlXCIpO1xuICAgICAgbGV0IG1haW5Db21wYXJlUHJpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBcIi5qcy1wcmljZS1jb21wYXJlLW1haW4tcHJvZHVjdFwiXG4gICAgICApO1xuICAgICAgbGV0IHBlcmNlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBkcC1oZXJvX19kaXNjb3VudFwiKTtcbiAgICAgIHByb2R1Y3RTZWxlY3RvcnMuZm9yRWFjaCgocHJvZHVjdFNlbGVjdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3RQcmljZSA9IHBhcnNlRmxvYXQoXG4gICAgICAgICAgcHJvZHVjdFNlbGVjdG9yLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1wcmljZVwiKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwcm9kdWN0Q29tcGFyZVByaWNlID0gcGFyc2VGbG9hdChcbiAgICAgICAgICBwcm9kdWN0U2VsZWN0b3IuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9kdWN0LWNvbXBhcmUtcHJpY2VcIilcbiAgICAgICAgKTtcbiAgICAgICAgdG90YWxNYWluUHJvZHVjdFByaWNlICs9IHByb2R1Y3RQcmljZTtcbiAgICAgICAgdG90YWxNYWluQ29tcGFyZVByaWNlICs9IHByb2R1Y3RDb21wYXJlUHJpY2U7XG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKHRvdGFsTWFpblByb2R1Y3RQcmljZSk7XG4gICAgICBwZXJjZW50ID0gKDEgLSB0b3RhbE1haW5Qcm9kdWN0UHJpY2UgLyB0b3RhbE1haW5Db21wYXJlUHJpY2UpICogMTAwO1xuICAgICAgdG90YWxNYWluUHJvZHVjdFByaWNlIC89IDEwMDtcbiAgICAgIHRvdGFsTWFpbkNvbXBhcmVQcmljZSAvPSAxMDA7XG4gICAgICBjb25zb2xlLmxvZyhwZXJjZW50LCBcInBlcmNlbnRcIik7XG4gICAgICAvLyBtYWluUHJvZHVjdFByaWNlLmlubmVySFRNTCA9IGN1cnJlbmN5ICsgdG90YWxNYWluUHJvZHVjdFByaWNlLzEwMFxuICAgICAgbWFpblByb2R1Y3RQcmljZS50ZXh0Q29udGVudCA9IHRvdGFsTWFpblByb2R1Y3RQcmljZS50b0xvY2FsZVN0cmluZyhcbiAgICAgICAgXCJlbi1VU1wiLFxuICAgICAgICB7IHN0eWxlOiBcImN1cnJlbmN5XCIsIGN1cnJlbmN5OiBjdXJyZW5jeSB9XG4gICAgICApO1xuICAgICAgbWFpbkNvbXBhcmVQcmljZS50ZXh0Q29udGVudCA9IHRvdGFsTWFpbkNvbXBhcmVQcmljZS50b0xvY2FsZVN0cmluZyhcbiAgICAgICAgXCJlbi1VU1wiLFxuICAgICAgICB7IHN0eWxlOiBcImN1cnJlbmN5XCIsIGN1cnJlbmN5OiBjdXJyZW5jeSB9XG4gICAgICApO1xuICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19wcm9kdWN0LWluZm8nKS5jbGFzc0xpc3QuY29udGFpbnMoJ3BlcmNlbnQtaW5mbycpKXtcbiAgICAgICAgbGV0IGFjdGl2ZU51bWJlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1wcm9kdWN0LXNlbGVjdG9yLmFjdGl2ZScpLmxlbmd0aFxuICAgICAgICBpZihhY3RpdmVOdW1iZXIgPCA0KXtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2Rpc2NvdW50JykudGV4dENvbnRlbnQgPSBgNTAlIE9GRmBcbiAgICAgICAgfVxuICAgICAgICBpZihhY3RpdmVOdW1iZXIgPT0gNCl7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19kaXNjb3VudCcpLnRleHRDb250ZW50ID0gYDYwJSBPRkZgXG4gICAgICAgIH1cbiAgICAgICAgaWYoYWN0aXZlTnVtYmVyID09IDUpe1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wZHAtaGVyb19fZGlzY291bnQnKS50ZXh0Q29udGVudCA9IGA2NSUgT0ZGYFxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZU51bWJlciwgJ2FjdGl2ZU51bWJlcicpXG4gICAgICB9XG4gICAgfVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRE9NQ29udGVudExvYWRlZFwiKTtcbiAgICAgIHVwZGF0ZVRvdGFsUHJpY2UoKTtcbiAgICB9KTtcbiAgICAvLyB1cGRhdGVUb3RhbFByaWNlKClcblxuICAgIC8vIC8vSWNvbnMgc2xpZGVyXG4gICAgY29uc3Qgc2xpZGVySWNvbnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIucGRwLWhlcm9fX2ljb25zXCIpO1xuXG4gICAgaWYgKHNsaWRlckljb25zKSB7XG4gICAgICBjb25zdCBhcnJvd1ByZXYgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIucGRwLWhlcm9fX2Fycm93LXByZXZcIik7XG4gICAgICBjb25zdCBhcnJvd05leHQgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIucGRwLWhlcm9fX2Fycm93LW5leHRcIik7XG5cbiAgICAgIGNvbnN0IHBkcEhlcm9JY29uc1NsaWRlciA9IG5ldyBTd2lwZXIoc2xpZGVySWNvbnMsIHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMixcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcbiAgICAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgICAgIG5leHRFbDogYXJyb3dOZXh0LFxuICAgICAgICAgIHByZXZFbDogYXJyb3dQcmV2LFxuICAgICAgICB9LFxuXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgNzY4OiB7XG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxuICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIDEwMjQ6IHtcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDQsXG4gICAgICAgICAgICBzcGFjZUJldHdlZW46IDE1LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgaWNvbnNFbGVtZW50cyA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCIucGRwLWhlcm9fX2ljb24tY29udGFpbmVyXCJcbiAgICAgICk7XG5cbiAgICAgIGlmIChpY29uc0VsZW1lbnRzLmxlbmd0aCA8PSA0ICYmIHdpbmRvdy5pbm5lcldpZHRoID4gMTAyMykge1xuICAgICAgICBzbGlkZXJJY29ucy5jbGFzc0xpc3QuYWRkKFwicGRwLWhlcm9fX2ljb25zLS1uby1zd2lwZXJcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcHJvcHMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGRwLWhlcm9fX3Byb3BcIik7XG4gICAgaWYgKHByb3BzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByb3BzLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgY29uc3QgcHJvcERlc2NyaXB0aW9uID0gcHJvcC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIFwiLnBkcC1oZXJvX19wcm9wLWRlc2NyaXB0aW9uXCJcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJvcEhlYWRlciA9IHByb3AucXVlcnlTZWxlY3RvcihcIi5wZHAtaGVyb19fcHJvcC1oZWFkZXJcIik7XG5cbiAgICAgICAgaWYgKHByb3BEZXNjcmlwdGlvbiAmJiBwcm9wSGVhZGVyKSB7XG4gICAgICAgICAgcHJvcEhlYWRlci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvcFBhcmVudCA9IHByb3BIZWFkZXIuY2xvc2VzdChcIi5wZHAtaGVyb19fcHJvcFwiKTtcbiAgICAgICAgICAgIHByb3BQYXJlbnQuY2xhc3NMaXN0LnRvZ2dsZShcInNob3dcIik7XG5cbiAgICAgICAgICAgIHByb3BEZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPVxuICAgICAgICAgICAgICBwcm9wRGVzY3JpcHRpb24uc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgIXByb3BQYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hvd1wiKVxuICAgICAgICAgICAgICA/IChwcm9wRGVzY3JpcHRpb24uc3R5bGUubWF4SGVpZ2h0ID0gbnVsbClcbiAgICAgICAgICAgICAgOiAocHJvcERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9XG4gICAgICAgICAgICAgICAgICBwcm9wRGVzY3JpcHRpb24uc2Nyb2xsSGVpZ2h0ICsgXCJweFwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgYWRkVG9DYXJ0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuanMtYWRkLXRvLWNhcnQtcGRcIik7XG5cbiAgYWRkVG9DYXJ0cy5mb3JFYWNoKChhZGRUb0NhcnQpID0+IHtcbiAgICBhZGRUb0NhcnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICBjb25zdCBwcm9kdWN0U2VsZWN0b3JzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgXCIuanMtcHJvZHVjdC1zZWxlY3Rvci5hY3RpdmVcIlxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKHByb2R1Y3RTZWxlY3RvcnMsIFwicHJvZHVjdFNlbGVjdG9yc1wiKTtcbiAgICAgIGNvbnN0IGFkZEl0ZW1zID0gW107XG4gICAgICBwcm9kdWN0U2VsZWN0b3JzLmZvckVhY2goKHByb2R1Y3RTZWxlY3RvcikgPT4ge1xuICAgICAgICBjb25zdCBfdGhpcyA9IHByb2R1Y3RTZWxlY3RvcjtcbiAgICAgICAgY29uc3QgcHJvZHVjdElkID0gX3RoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9kdWN0LWlkXCIpO1xuICAgICAgICBhZGRJdGVtcy5wdXNoKHtcbiAgICAgICAgICBpZDogcHJvZHVjdElkLFxuICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coYWRkSXRlbXMsIFwiYWRkSXRlbXNcIik7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgaXRlbXM6IGFkZEl0ZW1zLFxuICAgICAgfTtcbiAgICAgIGZldGNoKHdpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290ICsgXCJjYXJ0L2FkZC5qc1wiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzLCBcIm9rXCIpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHZhciB2YXJpYW50U2VsZWN0b3JTRmlyc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnZhcmlhbnQtc2VsZWN0b3ItMVwiKTtcbiAgdmFyIHZhcmlhbnRTZWxlY3RvclNTZWNvbmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnZhcmlhbnQtc2VsZWN0b3ItMlwiKTtcblxuICB2YXJpYW50U2VsZWN0b3JTRmlyc3QuZm9yRWFjaCgodmFyaWFudFNlbGVjdG9yRmlyc3QpID0+IHtcbiAgICB2YXJpYW50U2VsZWN0b3JGaXJzdC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBsZXQgX3RoaXMgPSBlO1xuICAgICAgY29uc29sZS5sb2coX3RoaXMsIHRoaXMsIFwidmFyaWFudFNlbGVjdG9yRmlyc3RcIik7XG4gICAgICBsZXQgdmFyaWFudElkID0gdGhpcy52YWx1ZTtcbiAgICAgIGxldCBuYW1lRmlyc3QgPSB2YXJpYW50SWQ7XG4gICAgICBsZXQgbmFtZVNlY29uZCA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKFwiLnZhcmlhbnQtc2VsZWN0b3ItMlwiKVxuICAgICAgICAub3B0aW9uc1tcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIudmFyaWFudC1zZWxlY3Rvci0yXCIpLnNlbGVjdGVkSW5kZXhcbiAgICAgIF0udGV4dDtcbiAgICAgIGxldCBzZWxlY3RlZE5hbWUgPSBuYW1lRmlyc3QgKyBcIiAvIFwiICsgbmFtZVNlY29uZDtcbiAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkTmFtZSwgXCJzZWxlY3RlZE5hbWVcIik7XG4gICAgICBsZXQgcHJvZHVjdElkID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLXRpdGxlPSdcIiArIHNlbGVjdGVkTmFtZSArIFwiJ11cIilcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtdmFyaWFudFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHByb2R1Y3RJZCwgXCJwcm9kdWN0SWRcIik7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1pZFwiLCBwcm9kdWN0SWQpO1xuICAgICAgbGV0IHByb2R1Y3RQcmljZSA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS10aXRsZT0nXCIgKyBzZWxlY3RlZE5hbWUgKyBcIiddXCIpXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByaWNlXCIpO1xuICAgICAgbGV0IHByb2R1Y3RQcmljZU5vRm9ybWF0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLXRpdGxlPSdcIiArIHNlbGVjdGVkTmFtZSArIFwiJ11cIilcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtcHJpY2Utbm9mb3JtYXRcIik7XG4gICAgICBsZXQgcHJvZHVjdENvbXBhcmVQcmljZSA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS10aXRsZT0nXCIgKyBzZWxlY3RlZE5hbWUgKyBcIiddXCIpXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBhcmUtcHJpY2VcIik7XG4gICAgICBsZXQgcHJvZHVjdENvbXBhcmVQcmljZU5vRm9ybWF0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLXRpdGxlPSdcIiArIHNlbGVjdGVkTmFtZSArIFwiJ11cIilcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtcHJpY2Utbm9mb3JtYXRcIik7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1wcmljZVwiLCBwcm9kdWN0UHJpY2VOb0Zvcm1hdCk7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRhdGEtcHJvZHVjdC1jb21wYXJlLXByaWNlXCIsXG4gICAgICAgICAgcHJvZHVjdENvbXBhcmVQcmljZU5vRm9ybWF0XG4gICAgICAgICk7XG4gICAgICAvLyB3aW5kb3cuc2VsZWN0TG9naWMuYWRkb24gPSBwcm9kdWN0SWRcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuanMtdXBzZWwtcHJvZHVjdC1wcmljZVwiXG4gICAgICApLmlubmVySFRNTCA9IHByb2R1Y3RQcmljZTtcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuanMtcHJpY2UtZGlzY291bnRcIlxuICAgICAgKS5pbm5lckhUTUwgPSBwcm9kdWN0Q29tcGFyZVByaWNlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHVwZGF0ZVRvdGFsUHJpY2UoKTtcbiAgICAgIH0sIFwiMTAwMFwiKTtcblxuICAgICAgLy8gYWRkVXBzZWxsLnF1ZXJ5U2VsZWN0b3IoJy5jcm9zc2VkJykuaW5uZXJIVE1MID0gcHJvZHVjdENvbXBhcmVQcmljZTtcbiAgICAgIC8vIGFkZFVwc2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYWRkb24taWQnLCBwcm9kdWN0SWQpO1xuICAgIH0pO1xuICB9KTtcbiAgdmFyaWFudFNlbGVjdG9yU1NlY29uZC5mb3JFYWNoKCh2YXJpYW50U2VsZWN0b3JTZWNvbmQpID0+IHtcbiAgICB2YXJpYW50U2VsZWN0b3JTZWNvbmQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgbGV0IF90aGlzID0gZTtcbiAgICAgIGxldCB2YXJpYW50SWQgPSB0aGlzLnZhbHVlO1xuICAgICAgbGV0IG5hbWVTZWNvbmQgPSB2YXJpYW50SWQ7XG4gICAgICBsZXQgbmFtZUZpcnN0ID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoXCIudmFyaWFudC1zZWxlY3Rvci0xXCIpXG4gICAgICAgIC5vcHRpb25zW1xuICAgICAgICB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcIi52YXJpYW50LXNlbGVjdG9yLTFcIikuc2VsZWN0ZWRJbmRleFxuICAgICAgXS50ZXh0O1xuICAgICAgbGV0IHNlbGVjdGVkTmFtZSA9IG5hbWVGaXJzdCArIFwiIC8gXCIgKyBuYW1lU2Vjb25kO1xuICAgICAgbGV0IHByb2R1Y3RJZCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS10aXRsZT0nXCIgKyBzZWxlY3RlZE5hbWUgKyBcIiddXCIpXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXZhcmlhbnRcIik7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1pZFwiLCBwcm9kdWN0SWQpO1xuICAgICAgbGV0IHByb2R1Y3RQcmljZSA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS10aXRsZT0nXCIgKyBzZWxlY3RlZE5hbWUgKyBcIiddXCIpXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByaWNlXCIpO1xuICAgICAgbGV0IHByb2R1Y3RQcmljZU5vRm9ybWF0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLXRpdGxlPSdcIiArIHNlbGVjdGVkTmFtZSArIFwiJ11cIilcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtcHJpY2Utbm9mb3JtYXRcIik7XG4gICAgICBsZXQgcHJvZHVjdENvbXBhcmVQcmljZSA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGVcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS10aXRsZT0nXCIgKyBzZWxlY3RlZE5hbWUgKyBcIiddXCIpXG4gICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbXBhcmUtcHJpY2VcIik7XG4gICAgICBsZXQgcHJvZHVjdENvbXBhcmVQcmljZU5vRm9ybWF0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgICAucXVlcnlTZWxlY3RvcihcIltkYXRhLXRpdGxlPSdcIiArIHNlbGVjdGVkTmFtZSArIFwiJ11cIilcbiAgICAgICAgLmdldEF0dHJpYnV0ZShcImRhdGEtcHJpY2Utbm9mb3JtYXRcIik7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1wcmljZVwiLCBwcm9kdWN0UHJpY2VOb0Zvcm1hdCk7XG4gICAgICB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiLmpzLXByb2R1Y3Qtc2VsZWN0b3JcIilcbiAgICAgICAgLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRhdGEtcHJvZHVjdC1jb21wYXJlLXByaWNlXCIsXG4gICAgICAgICAgcHJvZHVjdENvbXBhcmVQcmljZU5vRm9ybWF0XG4gICAgICAgICk7XG4gICAgICAvLyB3aW5kb3cuc2VsZWN0TG9naWMuYWRkb24gPSBwcm9kdWN0SWRcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuanMtdXBzZWwtcHJvZHVjdC1wcmljZVwiXG4gICAgICApLmlubmVySFRNTCA9IHByb2R1Y3RQcmljZTtcbiAgICAgIHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuanMtcHJpY2UtZGlzY291bnRcIlxuICAgICAgKS5pbm5lckhUTUwgPSBwcm9kdWN0Q29tcGFyZVByaWNlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW5jeSA9IGRvY3VtZW50XG4gICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeVwiKVxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWN1cnJlbmN5XCIpO1xuICAgICAgICBsZXQgcHJvZHVjdFNlbGVjdG9ycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgXCIuanMtcHJvZHVjdC1zZWxlY3Rvci5hY3RpdmVcIlxuICAgICAgICApO1xuICAgICAgICBsZXQgdG90YWxNYWluUHJvZHVjdFByaWNlID0gMDtcbiAgICAgICAgbGV0IHRvdGFsTWFpbkNvbXBhcmVQcmljZSA9IDA7XG4gICAgICAgIGxldCBtYWluUHJvZHVjdFByaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qcy1tYWluLXByb2R1Y3QtcHJpY2VcIik7XG4gICAgICAgIGxldCBtYWluQ29tcGFyZVByaWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBcIi5qcy1wcmljZS1jb21wYXJlLW1haW4tcHJvZHVjdFwiXG4gICAgICAgICk7XG4gICAgICAgIHByb2R1Y3RTZWxlY3RvcnMuZm9yRWFjaCgocHJvZHVjdFNlbGVjdG9yKSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvZHVjdFByaWNlID0gcGFyc2VGbG9hdChcbiAgICAgICAgICAgIHByb2R1Y3RTZWxlY3Rvci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb2R1Y3QtcHJpY2VcIilcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IHByb2R1Y3RDb21wYXJlUHJpY2UgPSBwYXJzZUZsb2F0KFxuICAgICAgICAgICAgcHJvZHVjdFNlbGVjdG9yLmdldEF0dHJpYnV0ZShcImRhdGEtcHJvZHVjdC1jb21wYXJlLXByaWNlXCIpXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0b3RhbE1haW5Qcm9kdWN0UHJpY2UgKz0gcHJvZHVjdFByaWNlO1xuICAgICAgICAgIHRvdGFsTWFpbkNvbXBhcmVQcmljZSArPSBwcm9kdWN0Q29tcGFyZVByaWNlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2codG90YWxNYWluUHJvZHVjdFByaWNlKTtcbiAgICAgICAgdG90YWxNYWluUHJvZHVjdFByaWNlIC89IDEwMDtcbiAgICAgICAgdG90YWxNYWluQ29tcGFyZVByaWNlIC89IDEwMDtcbiAgICAgICAgLy8gbWFpblByb2R1Y3RQcmljZS5pbm5lckhUTUwgPSBjdXJyZW5jeSArIHRvdGFsTWFpblByb2R1Y3RQcmljZS8xMDBcbiAgICAgICAgbWFpblByb2R1Y3RQcmljZS50ZXh0Q29udGVudCA9IHRvdGFsTWFpblByb2R1Y3RQcmljZS50b0xvY2FsZVN0cmluZyhcbiAgICAgICAgICBcImVuLVVTXCIsXG4gICAgICAgICAgeyBzdHlsZTogXCJjdXJyZW5jeVwiLCBjdXJyZW5jeTogY3VycmVuY3kgfVxuICAgICAgICApO1xuICAgICAgICBtYWluQ29tcGFyZVByaWNlLnRleHRDb250ZW50ID0gdG90YWxNYWluQ29tcGFyZVByaWNlLnRvTG9jYWxlU3RyaW5nKFxuICAgICAgICAgIFwiZW4tVVNcIixcbiAgICAgICAgICB7IHN0eWxlOiBcImN1cnJlbmN5XCIsIGN1cnJlbmN5OiBjdXJyZW5jeSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRvdGFsTWFpblByb2R1Y3RQcmljZSwgXCJtYWluUHJvZHVjdFByaWNlbWFpblByb2R1Y3RQcmljZVwiKTtcbiAgICAgIH0sIFwiMTAwMFwiKTtcbiAgICAgIC8vIGFkZFVwc2VsbC5xdWVyeVNlbGVjdG9yKCcuY3Jvc3NlZCcpLmlubmVySFRNTCA9IHByb2R1Y3RDb21wYXJlUHJpY2U7XG4gICAgICAvLyBhZGRVcHNlbGwuc2V0QXR0cmlidXRlKCdkYXRhLWFkZG9uLWlkJywgcHJvZHVjdElkKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/pdp-hero-tertiary.js":
/*!**********************************************************!*\
  !*** ./src/scripts/entries/section/pdp-hero-tertiary.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_pdp_hero_tertiary_section_pdp_hero_tertiary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/pdp-hero-tertiary/section-pdp-hero-tertiary.js */ \"./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_pdp_hero_tertiary_section_pdp_hero_tertiary_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'PdpHeroTertiary');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcGRwLWhlcm8tdGVydGlhcnkuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcGRwLWhlcm8tdGVydGlhcnkuanM/YTkyNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgUGRwSGVyb1RlcnRpYXJ5IGZyb20gJ21vZHVsZXMvcGRwLWhlcm8tdGVydGlhcnkvc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeS5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChQZHBIZXJvVGVydGlhcnksICdQZHBIZXJvVGVydGlhcnknKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/pdp-hero-tertiary.js\n");

/***/ }),

/***/ "./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.css":
/*!*********************************************************************!*\
  !*** ./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.css ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby10ZXJ0aWFyeS9zZWN0aW9uLXBkcC1oZXJvLXRlcnRpYXJ5LmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvcGRwLWhlcm8tdGVydGlhcnkvc2VjdGlvbi1wZHAtaGVyby10ZXJ0aWFyeS5jc3M/MDFlNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero-tertiary/section-pdp-hero-tertiary.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/pdp-hero-tertiary.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);