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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero.css */ \"./src/modules/pdp-hero/section-pdp-hero.css\");\n\nvar pdpHeroSwiper = document.querySelector('.pdp-hero__gallery-main');\nvar pdpHeroThumbsSwiper = document.querySelector('.pdp-hero__gallery-thumbs');\nvar pdpHeroThumbs = pdpHeroThumbsSwiper?.querySelectorAll('.pdp-hero__gallery-thumbs .swiper-slide');\nif (pdpHeroThumbs) {\n  var swiperThumbs = new Swiper(pdpHeroThumbsSwiper, {\n    loop: pdpHeroThumbs.length > 4,\n    slidesPerView: pdpHeroThumbs.length < 4 ? pdpHeroThumbs.length : 4,\n    spaceBetween: 10,\n    loopedSlides: 4,\n    watchSlidesProgress: true,\n    breakpoints: {\n      767: {\n        spaceBetween: 10\n      }\n    }\n  });\n}\nvar swiperPdpHero = new Swiper(pdpHeroSwiper, {\n  loop: true,\n  slidesPerView: 1,\n  loopedSlides: 4,\n  thumbs: {\n    swiper: swiperThumbs\n  }\n});\nconst descriptionWrapper = document.querySelector('.section-pdp-hero .pdp-hero__product-description');\nif (descriptionWrapper) {\n  const productDescription = document.querySelector('.section-pdp-hero .pdp-hero__product-description-wrapper');\n  const productDescriptionCollapse = document.querySelector('.pdp-hero__description-collapse');\n  productDescriptionCollapse.addEventListener('click', () => {\n    descriptionWrapper.classList.toggle('collapse-text');\n    productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n    !descriptionWrapper.classList.contains('collapse-text') ? productDescription.style.maxHeight = null : productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n  });\n}\nconst atcButton = document.querySelector('.section-pdp-hero .js-atc');\nconst checkBox = document.getElementById('pdp-hero__checkbox');\ncheckBox.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  atcButton.dataset.quantity = quantity;\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby9zZWN0aW9uLXBkcC1oZXJvLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL3BkcC1oZXJvL3NlY3Rpb24tcGRwLWhlcm8uanM/MjhlYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi1wZHAtaGVyby5jc3MnXG5cbnZhciBwZHBIZXJvU3dpcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19nYWxsZXJ5LW1haW4nKTtcbnZhciBwZHBIZXJvVGh1bWJzU3dpcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBkcC1oZXJvX19nYWxsZXJ5LXRodW1icycpO1xudmFyIHBkcEhlcm9UaHVtYnMgPSBwZHBIZXJvVGh1bWJzU3dpcGVyPy5xdWVyeVNlbGVjdG9yQWxsKCcucGRwLWhlcm9fX2dhbGxlcnktdGh1bWJzIC5zd2lwZXItc2xpZGUnKTtcblxuaWYgKHBkcEhlcm9UaHVtYnMpIHtcbiAgICB2YXIgc3dpcGVyVGh1bWJzID0gbmV3IFN3aXBlcihwZHBIZXJvVGh1bWJzU3dpcGVyLCB7XG4gICAgICAgIGxvb3A6IHBkcEhlcm9UaHVtYnMubGVuZ3RoID4gNCxcbiAgICAgICAgc2xpZGVzUGVyVmlldzogcGRwSGVyb1RodW1icy5sZW5ndGggPCA0ID8gcGRwSGVyb1RodW1icy5sZW5ndGggOiA0LFxuICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxuICAgICAgICBsb29wZWRTbGlkZXM6IDQsXG4gICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgICA3Njc6IHtcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cblxudmFyIHN3aXBlclBkcEhlcm8gPSBuZXcgU3dpcGVyKHBkcEhlcm9Td2lwZXIsIHtcbiAgICBsb29wOiB0cnVlLFxuICAgIHNsaWRlc1BlclZpZXc6IDEsXG4gICAgbG9vcGVkU2xpZGVzOiA0LFxuICAgIHRodW1iczoge1xuICAgICAgICBzd2lwZXI6IHN3aXBlclRodW1icyxcbiAgICB9LFxufSk7XG5cbmNvbnN0IGRlc2NyaXB0aW9uV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXBkcC1oZXJvIC5wZHAtaGVyb19fcHJvZHVjdC1kZXNjcmlwdGlvbicpO1xuaWYgKGRlc2NyaXB0aW9uV3JhcHBlcikge1xuICAgIGNvbnN0IHByb2R1Y3REZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXBkcC1oZXJvIC5wZHAtaGVyb19fcHJvZHVjdC1kZXNjcmlwdGlvbi13cmFwcGVyJyk7XG4gICAgY29uc3QgcHJvZHVjdERlc2NyaXB0aW9uQ29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2Rlc2NyaXB0aW9uLWNvbGxhcHNlJyk7XG5cbiAgICBwcm9kdWN0RGVzY3JpcHRpb25Db2xsYXBzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZGVzY3JpcHRpb25XcmFwcGVyLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlLXRleHQnKTtcblxuICAgICAgICBwcm9kdWN0RGVzY3JpcHRpb24uc3R5bGUubWF4SGVpZ2h0ID0gcHJvZHVjdERlc2NyaXB0aW9uLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICFkZXNjcmlwdGlvbldyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZS10ZXh0JylcbiAgICAgICAgICAgID8gcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IG51bGxcbiAgICAgICAgICAgIDogcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IHByb2R1Y3REZXNjcmlwdGlvbi5zY3JvbGxIZWlnaHQgKyAncHgnO1xuICAgIH0pXG59XG5cbmNvbnN0IGF0Y0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXBkcC1oZXJvIC5qcy1hdGMnKTtcbmNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BkcC1oZXJvX19jaGVja2JveCcpO1xuXG5jaGVja0JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb25zdCBxdWFudGl0eSA9IGNoZWNrQm94LmNoZWNrZWQgPyAyIDogMTtcbiAgICBhdGNCdXR0b24uZGF0YXNldC5xdWFudGl0eSA9IHF1YW50aXR5O1xufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero/section-pdp-hero.js\n");

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