"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-bundle"],{

/***/ "./src/modules/bundle/bundle.js":
/*!**************************************!*\
  !*** ./src/modules/bundle/bundle.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bundle_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bundle.css */ \"./src/modules/bundle/bundle.css\");\n\nconst tabs = document.querySelectorAll('.section-bundle__collection-tab');\ntabs.forEach(tab => {\n  tab.addEventListener('click', () => {\n    setActive(tab);\n    showPanel(tab);\n  });\n});\nconst setActive = function (el) {\n  [...el.parentElement.children].forEach(function (sib) {\n    sib.classList.remove('active');\n  });\n  el.classList.add('active');\n};\nconst showPanel = tab => {\n  let tabIndex = tab.getAttribute('data-tab');\n  let panels = document.querySelectorAll('.section-bundle__products-holder');\n  panels.forEach(panel => {\n    const panelIndex = panel.getAttribute('data-panel');\n    if (panelIndex === tabIndex) {\n      panel.classList.add('active');\n    } else {\n      panel.classList.remove('active');\n    }\n  });\n};\n\n//SWIPER FOR BUNDLE CART CAROUSEL\n\nvar swiper = new Swiper('.section-bundle__cart-carousel', {\n  spaceBetween: 8,\n  slidesPerView: 4,\n  slidesPerGroup: 4,\n  breakpoints: {\n    768: {\n      slidesPerView: 6,\n      slidesPerGroup: 6,\n      draggable: false\n    }\n  },\n  navigation: {\n    nextEl: '.section-bundle__cart-carousel .swiper-button-next',\n    prevEl: '.section-bundle__cart-carousel .swiper-button-prev'\n  },\n  scrollbar: {\n    el: '.section-bundle__cart-carousel .swiper-scrollbar',\n    draggable: true\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9idW5kbGUvYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2J1bmRsZS9idW5kbGUuanM/MTVmMSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vYnVuZGxlLmNzcydcblxuY29uc3QgdGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uLWJ1bmRsZV9fY29sbGVjdGlvbi10YWInKTtcblxudGFicy5mb3JFYWNoKHRhYiA9PiB7XG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBzZXRBY3RpdmUodGFiKTtcbiAgICAgICAgc2hvd1BhbmVsKHRhYik7XG4gICAgfSk7XG59KTtcblxuY29uc3Qgc2V0QWN0aXZlID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgWy4uLmVsLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5dLmZvckVhY2goZnVuY3Rpb24gKHNpYikge1xuICAgICAgICBzaWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfSk7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5jb25zdCBzaG93UGFuZWwgPSAodGFiKSA9PiB7XG4gICAgbGV0IHRhYkluZGV4ID0gdGFiLmdldEF0dHJpYnV0ZSgnZGF0YS10YWInKTtcbiAgICBsZXQgcGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24tYnVuZGxlX19wcm9kdWN0cy1ob2xkZXInKTtcblxuICAgIHBhbmVscy5mb3JFYWNoKHBhbmVsID0+IHtcbiAgICAgICAgY29uc3QgcGFuZWxJbmRleCA9IHBhbmVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYW5lbCcpO1xuICAgICAgICBpZiAocGFuZWxJbmRleCA9PT0gdGFiSW5kZXgpIHtcbiAgICAgICAgICAgIHBhbmVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8vU1dJUEVSIEZPUiBCVU5ETEUgQ0FSVCBDQVJPVVNFTFxuXG52YXIgc3dpcGVyID0gbmV3IFN3aXBlcignLnNlY3Rpb24tYnVuZGxlX19jYXJ0LWNhcm91c2VsJywge1xuICAgIHNwYWNlQmV0d2VlbjogOCxcbiAgICBzbGlkZXNQZXJWaWV3OiA0LFxuICAgIHNsaWRlc1Blckdyb3VwOiA0LFxuICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICA3Njg6IHtcbiAgICAgICAgc2xpZGVzUGVyVmlldzogNixcbiAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDYsXG4gICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbmF2aWdhdGlvbjoge1xuICAgICAgbmV4dEVsOiAnLnNlY3Rpb24tYnVuZGxlX19jYXJ0LWNhcm91c2VsIC5zd2lwZXItYnV0dG9uLW5leHQnLFxuICAgICAgcHJldkVsOiAnLnNlY3Rpb24tYnVuZGxlX19jYXJ0LWNhcm91c2VsIC5zd2lwZXItYnV0dG9uLXByZXYnXG4gICAgfSxcbiAgICBzY3JvbGxiYXI6IHtcbiAgICAgIGVsOiAnLnNlY3Rpb24tYnVuZGxlX19jYXJ0LWNhcm91c2VsIC5zd2lwZXItc2Nyb2xsYmFyJyxcbiAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICB9XG4gfSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/bundle/bundle.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/bundle.js":
/*!***********************************************!*\
  !*** ./src/scripts/entries/section/bundle.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_bundle_bundle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/bundle/bundle.js */ \"./src/modules/bundle/bundle.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_bundle_bundle_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'Bundle');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL2J1bmRsZS5qcz8xODcwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBCdW5kbGUgZnJvbSAnbW9kdWxlcy9idW5kbGUvYnVuZGxlLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KEJ1bmRsZSwgJ0J1bmRsZScpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/bundle.js\n");

/***/ }),

/***/ "./src/modules/bundle/bundle.css":
/*!***************************************!*\
  !*** ./src/modules/bundle/bundle.css ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9idW5kbGUvYnVuZGxlLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvYnVuZGxlL2J1bmRsZS5jc3M/MGM0YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/bundle/bundle.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/bundle.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);