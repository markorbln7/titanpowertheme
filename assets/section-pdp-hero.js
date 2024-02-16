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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero.css */ \"./src/modules/pdp-hero/section-pdp-hero.css\");\n\nconst atcButton = document.querySelector('.section-pdp-hero .js-atc');\nconst checkBox = document.getElementById('pdp-hero__checkbox');\ncheckBox.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  atcButton.dataset.quantity = quantity;\n});\natcButton.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  let addItems = [];\n  atcButton.dataset.quantity = quantity;\n  addItems = [{\n    id: atcButton.getAttribute('data-product'),\n    quantity: quantity\n  }];\n  const formData = {\n    items: addItems\n  };\n  fetch(window.Shopify.routes.root + 'cart/add.js', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(formData)\n  }).then(response => {\n    console.log(response.status, 'ok');\n    if (response.status === 200) {\n      console.log(addToCart, 'ok');\n    }\n    return response.json();\n  }).catch(error => {\n    console.error('Error:', error);\n  });\n});\nvar pdpHeroSwiper = document.querySelector('.pdp-hero__gallery-main');\nvar pdpHeroThumbsSwiper = document.querySelector('.pdp-hero__gallery-thumbs');\nvar pdpHeroThumbs = pdpHeroThumbsSwiper?.querySelectorAll('.pdp-hero__gallery-thumbs .swiper-slide');\nif (pdpHeroThumbs) {\n  var swiperThumbs = new Swiper(pdpHeroThumbsSwiper, {\n    loop: pdpHeroThumbs.length > 4,\n    slidesPerView: pdpHeroThumbs.length < 4 ? pdpHeroThumbs.length : 4,\n    spaceBetween: 10,\n    loopedSlides: 4,\n    watchSlidesProgress: true,\n    breakpoints: {\n      767: {\n        spaceBetween: 10\n      }\n    }\n  });\n}\nvar swiperPdpHero = new Swiper(pdpHeroSwiper, {\n  loop: true,\n  slidesPerView: 1,\n  loopedSlides: 4,\n  thumbs: {\n    swiper: swiperThumbs\n  }\n});\nconst descriptionWrapper = document.querySelector('.section-pdp-hero .pdp-hero__product-description');\nif (descriptionWrapper) {\n  const productDescription = document.querySelector('.section-pdp-hero .pdp-hero__product-description-wrapper');\n  const productDescriptionCollapse = document.querySelector('.pdp-hero__description-collapse');\n  productDescriptionCollapse.addEventListener('click', () => {\n    descriptionWrapper.classList.toggle('collapse-text');\n    productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n    !descriptionWrapper.classList.contains('collapse-text') ? productDescription.style.maxHeight = null : productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby9zZWN0aW9uLXBkcC1oZXJvLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL3BkcC1oZXJvL3NlY3Rpb24tcGRwLWhlcm8uanM/MjhlYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi1wZHAtaGVyby5jc3MnXG5cbmNvbnN0IGF0Y0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXBkcC1oZXJvIC5qcy1hdGMnKTtcbmNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BkcC1oZXJvX19jaGVja2JveCcpO1xuXG5jaGVja0JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29uc3QgcXVhbnRpdHkgPSBjaGVja0JveC5jaGVja2VkID8gMiA6IDE7XG4gIGF0Y0J1dHRvbi5kYXRhc2V0LnF1YW50aXR5ID0gcXVhbnRpdHk7XG59KTtcblxuYXRjQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBjb25zdCBxdWFudGl0eSA9IGNoZWNrQm94LmNoZWNrZWQgPyAyIDogMTtcbiAgbGV0IGFkZEl0ZW1zID0gW107XG4gIGF0Y0J1dHRvbi5kYXRhc2V0LnF1YW50aXR5ID0gcXVhbnRpdHk7XG4gIGFkZEl0ZW1zID0gW1xuICAgIHtcbiAgICAgIGlkOiBhdGNCdXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3QnKSxcbiAgICAgIHF1YW50aXR5OiBxdWFudGl0eVxuICAgIH1cbiAgXVxuICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICBpdGVtczogYWRkSXRlbXNcbiAgfVxuICBmZXRjaCh3aW5kb3cuU2hvcGlmeS5yb3V0ZXMucm9vdCArICdjYXJ0L2FkZC5qcycsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSlcbiAgfSlcbiAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXMsICdvaycpXG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgY29uc29sZS5sb2coYWRkVG9DYXJ0LCAnb2snKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6JywgZXJyb3IpXG4gICAgfSlcbn0pO1xuXG52YXIgcGRwSGVyb1N3aXBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wZHAtaGVyb19fZ2FsbGVyeS1tYWluJyk7XG52YXIgcGRwSGVyb1RodW1ic1N3aXBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wZHAtaGVyb19fZ2FsbGVyeS10aHVtYnMnKTtcbnZhciBwZHBIZXJvVGh1bWJzID0gcGRwSGVyb1RodW1ic1N3aXBlcj8ucXVlcnlTZWxlY3RvckFsbCgnLnBkcC1oZXJvX19nYWxsZXJ5LXRodW1icyAuc3dpcGVyLXNsaWRlJyk7XG5cbmlmIChwZHBIZXJvVGh1bWJzKSB7XG4gIHZhciBzd2lwZXJUaHVtYnMgPSBuZXcgU3dpcGVyKHBkcEhlcm9UaHVtYnNTd2lwZXIsIHtcbiAgICBsb29wOiBwZHBIZXJvVGh1bWJzLmxlbmd0aCA+IDQsXG4gICAgc2xpZGVzUGVyVmlldzogcGRwSGVyb1RodW1icy5sZW5ndGggPCA0ID8gcGRwSGVyb1RodW1icy5sZW5ndGggOiA0LFxuICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgbG9vcGVkU2xpZGVzOiA0LFxuICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgYnJlYWtwb2ludHM6IHtcbiAgICAgIDc2Nzoge1xuICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn1cblxudmFyIHN3aXBlclBkcEhlcm8gPSBuZXcgU3dpcGVyKHBkcEhlcm9Td2lwZXIsIHtcbiAgbG9vcDogdHJ1ZSxcbiAgc2xpZGVzUGVyVmlldzogMSxcbiAgbG9vcGVkU2xpZGVzOiA0LFxuICB0aHVtYnM6IHtcbiAgICBzd2lwZXI6IHN3aXBlclRodW1icyxcbiAgfSxcbn0pO1xuXG5jb25zdCBkZXNjcmlwdGlvbldyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1wZHAtaGVybyAucGRwLWhlcm9fX3Byb2R1Y3QtZGVzY3JpcHRpb24nKTtcbmlmIChkZXNjcmlwdGlvbldyYXBwZXIpIHtcbiAgY29uc3QgcHJvZHVjdERlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tcGRwLWhlcm8gLnBkcC1oZXJvX19wcm9kdWN0LWRlc2NyaXB0aW9uLXdyYXBwZXInKTtcbiAgY29uc3QgcHJvZHVjdERlc2NyaXB0aW9uQ29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2Rlc2NyaXB0aW9uLWNvbGxhcHNlJyk7XG5cbiAgcHJvZHVjdERlc2NyaXB0aW9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgZGVzY3JpcHRpb25XcmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlLXRleHQnKTtcblxuICAgIHByb2R1Y3REZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPSBwcm9kdWN0RGVzY3JpcHRpb24uc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgICAhZGVzY3JpcHRpb25XcmFwcGVyLmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2UtdGV4dCcpXG4gICAgICA/IHByb2R1Y3REZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPSBudWxsXG4gICAgICA6IHByb2R1Y3REZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPSBwcm9kdWN0RGVzY3JpcHRpb24uc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcbiAgfSlcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero/section-pdp-hero.js\n");

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