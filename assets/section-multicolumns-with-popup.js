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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_multicolumns_with_popup_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-multicolumns-with-popup.css */ \"./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.css\");\n\nconst multiColumnsWithPopupSection = document.querySelectorAll('.multicolumn-with-popup');\nmultiColumnsWithPopupSection.forEach((section, index) => {\n  // POPUP TOGGLE\n  const popupTriggers = section.querySelectorAll('.popup-trigger');\n  const closeMulti = document.querySelector('.close');\n  popupTriggers.forEach(trigger => {\n    trigger.addEventListener('click', e => {\n      const associatedPopup = document.querySelector('.multi-column-overlay');\n      const popupImage = e.target.getAttribute('data-popup-image');\n      console.log(e.target.getAttribute('data-popup-image'), 'popupImage');\n      if (associatedPopup) {\n        associatedPopup.classList.toggle('show');\n        associatedPopup.querySelector('.popup-image').src = popupImage;\n        document.querySelector('body').classList.add('no-scroll');\n        document.querySelector('html').classList.add('no-scroll');\n      }\n    });\n  });\n  closeMulti.addEventListener('click', e => {\n    const associatedPopup = document.querySelector('.multi-column-overlay');\n    associatedPopup.classList.toggle('show');\n    document.querySelector('body').classList.remove('no-scroll');\n    document.querySelector('html').classList.remove('no-scroll');\n  });\n  section.querySelector('.swiper-multicolumns').classList.add('swiper-multicolumns-' + index);\n  const multicolumnSwiper = new Swiper('.swiper-multicolumns-' + index, {\n    slidesPerView: 1,\n    loop: true,\n    spaceBetween: 8,\n    watchOverflow: true,\n    breakpoints: {\n      768: {\n        slidesPerView: 3,\n        spaceBetween: 30\n      }\n    },\n    pagination: {\n      el: \".swiper-pagination-multicolumns\",\n      clickable: true\n    }\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC9zZWN0aW9uLW11bHRpY29sdW1ucy13aXRoLXBvcHVwLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvbXVsdGljb2x1bW5zLXdpdGgtcG9wdXAvc2VjdGlvbi1tdWx0aWNvbHVtbnMtd2l0aC1wb3B1cC5qcz84MGQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLW11bHRpY29sdW1ucy13aXRoLXBvcHVwLmNzcydcblxuY29uc3QgbXVsdGlDb2x1bW5zV2l0aFBvcHVwU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tdWx0aWNvbHVtbi13aXRoLXBvcHVwJylcblxubXVsdGlDb2x1bW5zV2l0aFBvcHVwU2VjdGlvbi5mb3JFYWNoKChzZWN0aW9uLCBpbmRleCkgPT4ge1xuICAgIC8vIFBPUFVQIFRPR0dMRVxuICAgIGNvbnN0IHBvcHVwVHJpZ2dlcnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cC10cmlnZ2VyJyk7XG4gICAgY29uc3QgY2xvc2VNdWx0aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZScpXG5cbiAgICBwb3B1cFRyaWdnZXJzLmZvckVhY2godHJpZ2dlciA9PiB7XG4gICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXNzb2NpYXRlZFBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm11bHRpLWNvbHVtbi1vdmVybGF5Jyk7XG4gICAgICAgICAgICBjb25zdCBwb3B1cEltYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXBvcHVwLWltYWdlJylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1wb3B1cC1pbWFnZScpLCdwb3B1cEltYWdlJylcbiAgICAgICAgICAgIGlmIChhc3NvY2lhdGVkUG9wdXApIHtcbiAgICAgICAgICAgICAgICBhc3NvY2lhdGVkUG9wdXAuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgICAgICAgICAgIGFzc29jaWF0ZWRQb3B1cC5xdWVyeVNlbGVjdG9yKCcucG9wdXAtaW1hZ2UnKS5zcmMgPSBwb3B1cEltYWdlO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5jbGFzc0xpc3QuYWRkKCduby1zY3JvbGwnKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LmFkZCgnbm8tc2Nyb2xsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNsb3NlTXVsdGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBjb25zdCBhc3NvY2lhdGVkUG9wdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubXVsdGktY29sdW1uLW92ZXJsYXknKTtcbiAgICAgICAgYXNzb2NpYXRlZFBvcHVwLmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKVxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykuY2xhc3NMaXN0LnJlbW92ZSgnbm8tc2Nyb2xsJyk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKS5jbGFzc0xpc3QucmVtb3ZlKCduby1zY3JvbGwnKTtcbiAgICB9KVxuXG4gICAgc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLW11bHRpY29sdW1ucycpLmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1tdWx0aWNvbHVtbnMtJyArIGluZGV4KVxuXG4gICAgY29uc3QgbXVsdGljb2x1bW5Td2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyLW11bHRpY29sdW1ucy0nICsgaW5kZXgsIHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiA4LFxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxuXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgICA3Njg6IHtcbiAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcbiAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAzMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgZWw6IFwiLnN3aXBlci1wYWdpbmF0aW9uLW11bHRpY29sdW1uc1wiLFxuICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgfSk7XG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/multicolumns-with-popup/section-multicolumns-with-popup.js\n");

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