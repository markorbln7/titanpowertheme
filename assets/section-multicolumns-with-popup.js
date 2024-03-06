"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-multicolumns-with-popup"],{

/***/ "./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.js":
/*!********************************************************************************!*\
  !*** ./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_multicolumns_with_popup_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-multicolumns-with-popup.css */ \"./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.css\");\n\nconst multiColumnsWithPopupSection = document.querySelectorAll('.multicolumn-with-popup');\nmultiColumnsWithPopupSection.forEach((section, index) => {\n  // POPUP TOGGLE\n  const popupTriggers = section.querySelectorAll('.popup-trigger');\n  popupTriggers.forEach(trigger => {\n    trigger.addEventListener('click', () => {\n      const slideIndex = trigger.closest('.swiper-slide').getAttribute('data-swiper-slide-index');\n      const associatedPopup = section.querySelector(`.swiper-slide[data-swiper-slide-index=\"${slideIndex}\"] .popup__overlay`);\n      if (associatedPopup) {\n        associatedPopup.classList.toggle('show');\n      }\n    });\n  });\n  section.querySelector('.swiper-multicolumns').classList.add('swiper-multicolumns-' + index);\n  const multicolumnSwiper = new Swiper('.swiper-multicolumns-' + index, {\n    slidesPerView: 1,\n    loop: true,\n    spaceBetween: 8,\n    watchOverflow: true,\n    breakpoints: {\n      768: {\n        slidesPerView: 3,\n        spaceBetween: 30\n      }\n    },\n    pagination: {\n      el: \".swiper-pagination-multicolumns\"\n    }\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC9zZWN0aW9uLW11bHRpY29sdW1ucy13aXRoLXBvcHVwLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAvc2VjdGlvbi1tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC5qcz84MGQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLW11bHRpY29sdW1ucy13aXRoLXBvcHVwLmNzcydcblxuY29uc3QgbXVsdGlDb2x1bW5zV2l0aFBvcHVwU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tdWx0aWNvbHVtbi13aXRoLXBvcHVwJylcblxubXVsdGlDb2x1bW5zV2l0aFBvcHVwU2VjdGlvbi5mb3JFYWNoKChzZWN0aW9uLCBpbmRleCkgPT4ge1xuICAgIC8vIFBPUFVQIFRPR0dMRVxuICAgIGNvbnN0IHBvcHVwVHJpZ2dlcnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cC10cmlnZ2VyJyk7XG5cbiAgICBwb3B1cFRyaWdnZXJzLmZvckVhY2godHJpZ2dlciA9PiB7XG4gICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbGlkZUluZGV4ID0gdHJpZ2dlci5jbG9zZXN0KCcuc3dpcGVyLXNsaWRlJykuZ2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1zbGlkZS1pbmRleCcpO1xuICAgICAgICAgICAgY29uc3QgYXNzb2NpYXRlZFBvcHVwID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKGAuc3dpcGVyLXNsaWRlW2RhdGEtc3dpcGVyLXNsaWRlLWluZGV4PVwiJHtzbGlkZUluZGV4fVwiXSAucG9wdXBfX292ZXJsYXlgKTtcbiAgICAgICAgICAgIGlmIChhc3NvY2lhdGVkUG9wdXApIHtcbiAgICAgICAgICAgICAgICBhc3NvY2lhdGVkUG9wdXAuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItbXVsdGljb2x1bW5zJykuY2xhc3NMaXN0LmFkZCgnc3dpcGVyLW11bHRpY29sdW1ucy0nICsgaW5kZXgpXG5cbiAgICBjb25zdCBtdWx0aWNvbHVtblN3aXBlciA9IG5ldyBTd2lwZXIoJy5zd2lwZXItbXVsdGljb2x1bW5zLScgKyBpbmRleCwge1xuICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBzcGFjZUJldHdlZW46IDgsXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXG5cbiAgICAgICAgYnJlYWtwb2ludHM6IHtcbiAgICAgICAgICAgIDc2ODoge1xuICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxuICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICBlbDogXCIuc3dpcGVyLXBhZ2luYXRpb24tbXVsdGljb2x1bW5zXCIsXG4gICAgICAgIH0sXG4gICAgfSk7XG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/multicolumns-with-popup.js":
/*!****************************************************************!*\
  !*** ./src/scripts/entries/section/multicolumns-with-popup.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_multicolumns_with_popup_section_multicolumns_with_popup_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/multicolumns-with-popup/section-multicolumns-with-popup.js */ \"./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_multicolumns_with_popup_section_multicolumns_with_popup_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'MultiColumnsWithPopup');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAuanM/NjlkOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgTXVsdGlDb2x1bW5zV2l0aFBvcHVwIGZyb20gJ21vZHVsZXMvbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAvc2VjdGlvbi1tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChNdWx0aUNvbHVtbnNXaXRoUG9wdXAsICdNdWx0aUNvbHVtbnNXaXRoUG9wdXAnKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/multicolumns-with-popup.js\n");

/***/ }),

/***/ "./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.css":
/*!*********************************************************************************!*\
  !*** ./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.css ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC9zZWN0aW9uLW11bHRpY29sdW1ucy13aXRoLXBvcHVwLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAvc2VjdGlvbi1tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC5jc3M/NTU5MiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/multicolumns-with-popup.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);