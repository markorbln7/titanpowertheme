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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_collections_with_nav_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-collections-with-nav.css */ \"./src/modules/collections-with-nav/section-collections-with-nav.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  const collectionLinks = document.querySelectorAll('.collection-link');\n  collectionLinks.forEach(link => {\n    link.addEventListener('click', function (event) {\n      event.preventDefault();\n      collectionLinks.forEach(link => {\n        link.closest('li').classList.remove('active');\n      });\n      this.closest('li').classList.add('active');\n      const targetSection = document.querySelector(`${this.getAttribute('href')}`);\n      console.log(targetSection);\n      if (targetSection) {\n        targetSection.scrollIntoView({\n          behavior: 'smooth'\n        });\n      }\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9ucy13aXRoLW5hdi9zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2LmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9ucy13aXRoLW5hdi9zZWN0aW9uLWNvbGxlY3Rpb25zLXdpdGgtbmF2LmpzPzZkM2YiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3NlY3Rpb24tY29sbGVjdGlvbnMtd2l0aC1uYXYuY3NzJ1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25MaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xsZWN0aW9uLWxpbmsnKTtcbiAgXG4gICAgY29sbGVjdGlvbkxpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb2xsZWN0aW9uTGlua3MuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgICAgICBsaW5rLmNsb3Nlc3QoJ2xpJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICBcbiAgICAgICAgdGhpcy5jbG9zZXN0KCdsaScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICBcbiAgICAgICAgY29uc3QgdGFyZ2V0U2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7dGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0U2VjdGlvbik7XG4gICAgICAgIGlmICh0YXJnZXRTZWN0aW9uKSB7XG4gICAgICAgICAgdGFyZ2V0U2VjdGlvbi5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/collections-with-nav/section-collections-with-nav.js\n");

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