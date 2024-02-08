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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero.css */ \"./src/modules/pdp-hero/section-pdp-hero.css\");\n\nvar pdpHeroSwiper = document.querySelector('.pdp-hero__gallery-main');\nvar pdpHeroThumbsSwiper = document.querySelector('.pdp-hero__gallery-thumbs');\nvar pdpHeroThumbs = pdpHeroThumbsSwiper?.querySelectorAll('.pdp-hero__gallery-thumbs .swiper-slide');\nif (pdpHeroThumbs) {\n  var swiperThumbs = new Swiper(pdpHeroThumbsSwiper, {\n    loop: pdpHeroThumbs.length > 4,\n    slidesPerView: pdpHeroThumbs.length < 4 ? pdpHeroThumbs.length : 4,\n    spaceBetween: 10,\n    loopedSlides: 4,\n    watchSlidesProgress: true,\n    breakpoints: {\n      767: {\n        spaceBetween: 10\n      }\n    }\n  });\n}\nvar swiperPdpHero = new Swiper(pdpHeroSwiper, {\n  loop: true,\n  slidesPerView: 1,\n  loopedSlides: 4,\n  thumbs: {\n    swiper: swiperThumbs\n  }\n});\nconst descriptionWrapper = document.querySelector('.section-pdp-hero .pdp-hero__product-description');\nconst productDescription = document.querySelector('.section-pdp-hero .pdp-hero__product-description-wrapper');\nconst productDescriptionCollapse = document.querySelector('.pdp-hero__description-collapse');\nproductDescriptionCollapse.addEventListener('click', () => {\n  descriptionWrapper.classList.toggle('collapse-text');\n  productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n  !descriptionWrapper.classList.contains('collapse-text') ? productDescription.style.maxHeight = null : productDescription.style.maxHeight = productDescription.scrollHeight + 'px';\n});\nconst atcButton = document.querySelector('.section-pdp-hero .js-atc');\nconst checkBox = document.getElementById('pdp-hero__checkbox');\natcButton.addEventListener('click', () => {\n  const quantity = checkBox.checked ? 2 : 1;\n  atcButton.dataset.quantity = quantity;\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby9zZWN0aW9uLXBkcC1oZXJvLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvcGRwLWhlcm8vc2VjdGlvbi1wZHAtaGVyby5qcz8yOGVhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLXBkcC1oZXJvLmNzcydcblxudmFyIHBkcEhlcm9Td2lwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2dhbGxlcnktbWFpbicpO1xudmFyIHBkcEhlcm9UaHVtYnNTd2lwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2dhbGxlcnktdGh1bWJzJyk7XG52YXIgcGRwSGVyb1RodW1icyA9IHBkcEhlcm9UaHVtYnNTd2lwZXI/LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wZHAtaGVyb19fZ2FsbGVyeS10aHVtYnMgLnN3aXBlci1zbGlkZScpO1xuXG5pZiAocGRwSGVyb1RodW1icykge1xuICAgIHZhciBzd2lwZXJUaHVtYnMgPSBuZXcgU3dpcGVyKHBkcEhlcm9UaHVtYnNTd2lwZXIsIHtcbiAgICAgICAgbG9vcDogcGRwSGVyb1RodW1icy5sZW5ndGggPiA0LFxuICAgICAgICBzbGlkZXNQZXJWaWV3OiBwZHBIZXJvVGh1bWJzLmxlbmd0aCA8IDQgPyBwZHBIZXJvVGh1bWJzLmxlbmd0aCA6IDQsXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgICAgIGxvb3BlZFNsaWRlczogNCxcbiAgICAgICAgd2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcbiAgICAgICAgICAgIDc2Nzoge1xuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pO1xufVxuXG52YXIgc3dpcGVyUGRwSGVybyA9IG5ldyBTd2lwZXIocGRwSGVyb1N3aXBlciwge1xuICAgIGxvb3A6IHRydWUsXG4gICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICBsb29wZWRTbGlkZXM6IDQsXG4gICAgdGh1bWJzOiB7XG4gICAgICAgIHN3aXBlcjogc3dpcGVyVGh1bWJzLFxuICAgIH0sXG59KTtcblxuY29uc3QgZGVzY3JpcHRpb25XcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tcGRwLWhlcm8gLnBkcC1oZXJvX19wcm9kdWN0LWRlc2NyaXB0aW9uJyk7XG5jb25zdCBwcm9kdWN0RGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1wZHAtaGVybyAucGRwLWhlcm9fX3Byb2R1Y3QtZGVzY3JpcHRpb24td3JhcHBlcicpO1xuY29uc3QgcHJvZHVjdERlc2NyaXB0aW9uQ29sbGFwc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX2Rlc2NyaXB0aW9uLWNvbGxhcHNlJyk7XG5cbnByb2R1Y3REZXNjcmlwdGlvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGRlc2NyaXB0aW9uV3JhcHBlci5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZS10ZXh0Jyk7XG5cbiAgICBwcm9kdWN0RGVzY3JpcHRpb24uc3R5bGUubWF4SGVpZ2h0ID0gcHJvZHVjdERlc2NyaXB0aW9uLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgIWRlc2NyaXB0aW9uV3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNlLXRleHQnKVxuICAgICAgICA/IHByb2R1Y3REZXNjcmlwdGlvbi5zdHlsZS5tYXhIZWlnaHQgPSBudWxsXG4gICAgICAgIDogcHJvZHVjdERlc2NyaXB0aW9uLnN0eWxlLm1heEhlaWdodCA9IHByb2R1Y3REZXNjcmlwdGlvbi5zY3JvbGxIZWlnaHQgKyAncHgnO1xufSlcblxuXG5jb25zdCBhdGNCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1wZHAtaGVybyAuanMtYXRjJyk7XG5jb25zdCBjaGVja0JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwZHAtaGVyb19fY2hlY2tib3gnKTtcblxuYXRjQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHF1YW50aXR5ID0gY2hlY2tCb3guY2hlY2tlZCA/IDIgOiAxO1xuICAgIGF0Y0J1dHRvbi5kYXRhc2V0LnF1YW50aXR5ID0gcXVhbnRpdHk7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero/section-pdp-hero.js\n");

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