"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-pdp-hero"],{

/***/ "./src/modules/pdp-hero/section-pdp-hero.js":
/*!**************************************************!*\
  !*** ./src/modules/pdp-hero/section-pdp-hero.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero.css */ \"./src/modules/pdp-hero/section-pdp-hero.css\");\n\nconst atcButton = document.querySelector('.section-pdp-hero .js-atc');\nconst checkBox = document.getElementById('pdp-hero__checkbox');\ncheckBox.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  atcButton.dataset.quantity = quantity;\n});\natcButton.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  let addItems = [];\n  atcButton.dataset.quantity = quantity;\n  addItems = [{\n    id: atcButton.getAttribute('data-product'),\n    quantity: quantity\n  }];\n  const formData = {\n    items: addItems\n  };\n  fetch(window.Shopify.routes.root + 'cart/add.js', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(formData)\n  }).then(response => {\n    console.log(response.status, 'ok');\n    if (response.status === 200) {\n      console.log(addToCart, 'ok');\n    }\n    return response.json();\n  }).catch(error => {\n    console.error('Error:', error);\n  });\n});\nvar pdpHeroSwiper = document.querySelector('.pdp-hero__gallery-main');\nvar pdpHeroThumbsSwiper = document.querySelector('.pdp-hero__gallery-thumbs');\nvar pdpHeroThumbs = pdpHeroThumbsSwiper?.querySelectorAll('.pdp-hero__gallery-thumbs .swiper-slide');\nif (pdpHeroThumbs) {\n  var swiperThumbs = new Swiper(pdpHeroThumbsSwiper, {\n    loop: pdpHeroThumbs.length > 4,\n    slidesPerView: pdpHeroThumbs.length < 4 ? pdpHeroThumbs.length : 4,\n    spaceBetween: 10,\n    loopedSlides: 4,\n    watchSlidesProgress: true,\n    breakpoints: {\n      767: {\n        spaceBetween: 10\n      }\n    }\n  });\n}\nvar swiperPdpHero = new Swiper(pdpHeroSwiper, {\n  loop: true,\n  slidesPerView: 1,\n  loopedSlides: 4,\n  thumbs: {\n    swiper: swiperThumbs\n  }\n});\nconst descriptionWrapper = document.querySelector('.section-pdp-hero .pdp-hero__product-description');\nif (descriptionWrapper) {\n  const productDescription = document.querySelector('.section-pdp-hero .pdp-hero__product-description-wrapper');\n  const productDescriptionCollapse = document.querySelector('.pdp-hero__description-collapse');\n  productDescriptionCollapse.addEventListener('click', () => {\n    descriptionWrapper.classList.toggle('collapse-text');\n    productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n    !descriptionWrapper.classList.contains('collapse-text') ? productDescription.style.maxHeight = null : productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n    descriptionWrapper.classList.contains('collapse-text') ? productDescriptionCollapse.textContent = 'Show Less' : productDescriptionCollapse.textContent = 'Learn More';\n  });\n}\nconst props = document.querySelectorAll('.section-pdp-hero .pdp-hero__prop');\nif (props.length > 0) {\n  props.forEach(prop => {\n    const propDescription = prop.querySelector('.pdp-hero__prop-description');\n    const propHeader = prop.querySelector('.pdp-hero__prop-header');\n    if (propDescription && propHeader) {\n      propHeader.addEventListener('click', () => {\n        const propParent = propHeader.closest('.pdp-hero__prop');\n        propParent.classList.toggle('show');\n        propDescription.style.maxHeight = propDescription.scrollHeight + 'px';\n        !propParent.classList.contains('show') ? propDescription.style.maxHeight = null : propDescription.style.maxHeight = propDescription.scrollHeight + 'px';\n      });\n    }\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby9zZWN0aW9uLXBkcC1oZXJvLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFJQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvcGRwLWhlcm8vc2VjdGlvbi1wZHAtaGVyby5qcz8yOGVhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLXBkcC1oZXJvLmNzcydcblxuY29uc3QgYXRjQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tcGRwLWhlcm8gLmpzLWF0YycpO1xuY29uc3QgY2hlY2tCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGRwLWhlcm9fX2NoZWNrYm94Jyk7XG5cbmNoZWNrQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCBxdWFudGl0eSA9IGNoZWNrQm94LmNoZWNrZWQgPyAyIDogMTtcbiAgYXRjQnV0dG9uLmRhdGFzZXQucXVhbnRpdHkgPSBxdWFudGl0eTtcbn0pO1xuXG5hdGNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGNvbnN0IHF1YW50aXR5ID0gY2hlY2tCb3guY2hlY2tlZCA/IDIgOiAxO1xuICBsZXQgYWRkSXRlbXMgPSBbXTtcbiAgYXRjQnV0dG9uLmRhdGFzZXQucXVhbnRpdHkgPSBxdWFudGl0eTtcbiAgYWRkSXRlbXMgPSBbXG4gICAge1xuICAgICAgaWQ6IGF0Y0J1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZHVjdCcpLFxuICAgICAgcXVhbnRpdHk6IHF1YW50aXR5XG4gICAgfVxuICBdXG4gIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgIGl0ZW1zOiBhZGRJdGVtc1xuICB9XG4gIGZldGNoKHdpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290ICsgJ2NhcnQvYWRkLmpzJywge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKVxuICB9KVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1cywgJ29rJylcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBjb25zb2xlLmxvZyhhZGRUb0NhcnQsICdvaycpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvcjonLCBlcnJvcilcbiAgICB9KVxufSk7XG5cbnZhciBwZHBIZXJvU3dpcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19nYWxsZXJ5LW1haW4nKTtcbnZhciBwZHBIZXJvVGh1bWJzU3dpcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19nYWxsZXJ5LXRodW1icycpO1xudmFyIHBkcEhlcm9UaHVtYnMgPSBwZHBIZXJvVGh1bWJzU3dpcGVyPy5xdWVyeVNlbGVjdG9yQWxsKCcucGRwLWhlcm9fX2dhbGxlcnktdGh1bWJzIC5zd2lwZXItc2xpZGUnKTtcblxuaWYgKHBkcEhlcm9UaHVtYnMpIHtcbiAgdmFyIHN3aXBlclRodW1icyA9IG5ldyBTd2lwZXIocGRwSGVyb1RodW1ic1N3aXBlciwge1xuICAgIGxvb3A6IHBkcEhlcm9UaHVtYnMubGVuZ3RoID4gNCxcbiAgICBzbGlkZXNQZXJWaWV3OiBwZHBIZXJvVGh1bWJzLmxlbmd0aCA8IDQgPyBwZHBIZXJvVGh1bWJzLmxlbmd0aCA6IDQsXG4gICAgc3BhY2VCZXR3ZWVuOiAxMCxcbiAgICBsb29wZWRTbGlkZXM6IDQsXG4gICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICBicmVha3BvaW50czoge1xuICAgICAgNzY3OiB7XG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG52YXIgc3dpcGVyUGRwSGVybyA9IG5ldyBTd2lwZXIocGRwSGVyb1N3aXBlciwge1xuICBsb29wOiB0cnVlLFxuICBzbGlkZXNQZXJWaWV3OiAxLFxuICBsb29wZWRTbGlkZXM6IDQsXG4gIHRodW1iczoge1xuICAgIHN3aXBlcjogc3dpcGVyVGh1bWJzLFxuICB9LFxufSk7XG5cbmNvbnN0IGRlc2NyaXB0aW9uV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXBkcC1oZXJvIC5wZHAtaGVyb19fcHJvZHVjdC1kZXNjcmlwdGlvbicpO1xuaWYgKGRlc2NyaXB0aW9uV3JhcHBlcikge1xuICBjb25zdCBwcm9kdWN0RGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1wZHAtaGVybyAucGRwLWhlcm9fX3Byb2R1Y3QtZGVzY3JpcHRpb24td3JhcHBlcicpO1xuICBjb25zdCBwcm9kdWN0RGVzY3JpcHRpb25Db2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wZHAtaGVyb19fZGVzY3JpcHRpb24tY29sbGFwc2UnKTtcblxuICBwcm9kdWN0RGVzY3JpcHRpb25Db2xsYXBzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBkZXNjcmlwdGlvbldyYXBwZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2UtdGV4dCcpO1xuXG4gICAgcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IHByb2R1Y3REZXNjcmlwdGlvbi5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICFkZXNjcmlwdGlvbldyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZS10ZXh0JylcbiAgICAgID8gcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IG51bGxcbiAgICAgIDogcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IHByb2R1Y3REZXNjcmlwdGlvbi5zY3JvbGxIZWlnaHQgKyAncHgnO1xuXG4gICAgZGVzY3JpcHRpb25XcmFwcGVyLmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2UtdGV4dCcpXG4gICAgICA/IHByb2R1Y3REZXNjcmlwdGlvbkNvbGxhcHNlLnRleHRDb250ZW50ID0gJ1Nob3cgTGVzcydcbiAgICAgIDogcHJvZHVjdERlc2NyaXB0aW9uQ29sbGFwc2UudGV4dENvbnRlbnQgPSAnTGVhcm4gTW9yZSc7XG4gIH0pXG59XG5cbmNvbnN0IHByb3BzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24tcGRwLWhlcm8gLnBkcC1oZXJvX19wcm9wJyk7XG5pZiAocHJvcHMubGVuZ3RoID4gMCkge1xuICBwcm9wcy5mb3JFYWNoKHByb3AgPT4ge1xuICAgIGNvbnN0IHByb3BEZXNjcmlwdGlvbiA9IHByb3AucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19wcm9wLWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3QgcHJvcEhlYWRlciA9IHByb3AucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19wcm9wLWhlYWRlcicpO1xuXG4gICAgaWYgKHByb3BEZXNjcmlwdGlvbiAmJiBwcm9wSGVhZGVyKSB7XG4gICAgICBwcm9wSGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wUGFyZW50ID0gcHJvcEhlYWRlci5jbG9zZXN0KCcucGRwLWhlcm9fX3Byb3AnKTtcbiAgICAgICAgcHJvcFBhcmVudC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG5cbiAgICAgICAgcHJvcERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IHByb3BEZXNjcmlwdGlvbi5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgICAgICAhcHJvcFBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKVxuICAgICAgICAgID8gcHJvcERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IG51bGxcbiAgICAgICAgICA6IHByb3BEZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPSBwcm9wRGVzY3JpcHRpb24uc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero/section-pdp-hero.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/pdp-hero.js":
/*!*************************************************!*\
  !*** ./src/scripts/entries/section/pdp-hero.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_pdp_hero_section_pdp_hero_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/pdp-hero/section-pdp-hero.js */ \"./src/modules/pdp-hero/section-pdp-hero.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_pdp_hero_section_pdp_hero_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'PdpHero');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcGRwLWhlcm8uanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcGRwLWhlcm8uanM/NDVjMyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgUGRwSGVybyBmcm9tICdtb2R1bGVzL3BkcC1oZXJvL3NlY3Rpb24tcGRwLWhlcm8uanMnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGluaXRDb21wb25lbnQoUGRwSGVybywgJ1BkcEhlcm8nKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/pdp-hero.js\n");

/***/ }),

/***/ "./src/modules/pdp-hero/section-pdp-hero.css":
/*!***************************************************!*\
  !*** ./src/modules/pdp-hero/section-pdp-hero.css ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby9zZWN0aW9uLXBkcC1oZXJvLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvcGRwLWhlcm8vc2VjdGlvbi1wZHAtaGVyby5jc3M/NTE0YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero/section-pdp-hero.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/pdp-hero.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);