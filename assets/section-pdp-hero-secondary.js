"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-pdp-hero-secondary"],{

/***/ "./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.js":
/*!**********************************************************************!*\
  !*** ./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_pdp_hero_secondary_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-pdp-hero-secondary.css */ \"./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.css\");\n\nvar allShopSections = document.querySelectorAll('.section-pdp-hero-secondary');\nallShopSections.forEach(section => {\n  const checkboxes = section.querySelectorAll('.js-upsell-checkbox');\n  const typesOptions = section.querySelector('.pdp-hero__types').querySelectorAll('.pdp-hero__option');\n  const sizesOptions = section.querySelector('.pdp-hero__sizes').querySelectorAll('.pdp-hero__option');\n  checkboxes.forEach(checkbox => {\n    checkbox.addEventListener('change', function () {\n      const upsellProducts = section.querySelectorAll('.pdp-hero__upsell-wrapper');\n      checkboxes.forEach(cb => {\n        if (cb !== checkbox) {\n          cb.checked = false;\n        }\n      });\n      upsellProducts.forEach(el => {\n        el.classList.remove('active');\n      });\n      const upsellProduct = checkbox.closest('.pdp-hero__upsell-wrapper');\n      upsellProduct.classList.add('active');\n    });\n  });\n  typesOptions.forEach(option => {\n    option.addEventListener('click', function () {\n      typesOptions.forEach(opt => {\n        opt.classList.remove('active');\n      });\n      option.classList.add('active');\n    });\n  });\n  sizesOptions.forEach(option => {\n    option.addEventListener('click', function () {\n      sizesOptions.forEach(opt => {\n        opt.classList.remove('active');\n      });\n      option.classList.add('active');\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby1zZWNvbmRhcnkvc2VjdGlvbi1wZHAtaGVyby1zZWNvbmRhcnkuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL3BkcC1oZXJvLXNlY29uZGFyeS9zZWN0aW9uLXBkcC1oZXJvLXNlY29uZGFyeS5qcz9jZTgxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLXBkcC1oZXJvLXNlY29uZGFyeS5jc3MnXG5cbnZhciBhbGxTaG9wU2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbi1wZHAtaGVyby1zZWNvbmRhcnknKTtcblxuYWxsU2hvcFNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24pID0+IHtcbiAgICBjb25zdCBjaGVja2JveGVzID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdXBzZWxsLWNoZWNrYm94Jyk7XG4gICAgY29uc3QgdHlwZXNPcHRpb25zID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcucGRwLWhlcm9fX3R5cGVzJykucXVlcnlTZWxlY3RvckFsbCgnLnBkcC1oZXJvX19vcHRpb24nKTtcbiAgICBjb25zdCBzaXplc09wdGlvbnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5wZHAtaGVyb19fc2l6ZXMnKS5xdWVyeVNlbGVjdG9yQWxsKCcucGRwLWhlcm9fX29wdGlvbicpO1xuXG4gICAgY2hlY2tib3hlcy5mb3JFYWNoKGNoZWNrYm94ID0+IHtcbiAgICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgdXBzZWxsUHJvZHVjdHMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wZHAtaGVyb19fdXBzZWxsLXdyYXBwZXInKTtcblxuICAgICAgICAgICAgY2hlY2tib3hlcy5mb3JFYWNoKGNiID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgIT09IGNoZWNrYm94KSB7XG4gICAgICAgICAgICAgICAgICAgIGNiLmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdXBzZWxsUHJvZHVjdHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdXBzZWxsUHJvZHVjdCA9IGNoZWNrYm94LmNsb3Nlc3QoJy5wZHAtaGVyb19fdXBzZWxsLXdyYXBwZXInKTtcbiAgICAgICAgICAgIHVwc2VsbFByb2R1Y3QuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdHlwZXNPcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgb3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHlwZXNPcHRpb25zLmZvckVhY2gob3B0ID0+IHtcbiAgICAgICAgICAgICAgICBvcHQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzaXplc09wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzaXplc09wdGlvbnMuZm9yRWFjaChvcHQgPT4ge1xuICAgICAgICAgICAgICAgIG9wdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/pdp-hero-secondary.js":
/*!***********************************************************!*\
  !*** ./src/scripts/entries/section/pdp-hero-secondary.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_pdp_hero_secondary_section_pdp_hero_secondary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/pdp-hero-secondary/section-pdp-hero-secondary.js */ \"./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_pdp_hero_secondary_section_pdp_hero_secondary_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'PdpHeroSecondary');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcGRwLWhlcm8tc2Vjb25kYXJ5LmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL3BkcC1oZXJvLXNlY29uZGFyeS5qcz82M2EzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBQZHBIZXJvU2Vjb25kYXJ5IGZyb20gJ21vZHVsZXMvcGRwLWhlcm8tc2Vjb25kYXJ5L3NlY3Rpb24tcGRwLWhlcm8tc2Vjb25kYXJ5LmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KFBkcEhlcm9TZWNvbmRhcnksICdQZHBIZXJvU2Vjb25kYXJ5Jylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/pdp-hero-secondary.js\n");

/***/ }),

/***/ "./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.css":
/*!***********************************************************************!*\
  !*** ./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.css ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wZHAtaGVyby1zZWNvbmRhcnkvc2VjdGlvbi1wZHAtaGVyby1zZWNvbmRhcnkuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9wZHAtaGVyby1zZWNvbmRhcnkvc2VjdGlvbi1wZHAtaGVyby1zZWNvbmRhcnkuY3NzPzBlNmUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/pdp-hero-secondary/section-pdp-hero-secondary.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/pdp-hero-secondary.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);