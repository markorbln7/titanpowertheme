"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-home-product-block"],{

/***/ "./src/modules/home-product-block/home-product-block.js":
/*!**************************************************************!*\
  !*** ./src/modules/home-product-block/home-product-block.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _home_product_block_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home-product-block.css */ \"./src/modules/home-product-block/home-product-block.css\");\n/* eslint-disable prefer-const */\n\nconst addToCarts = document.querySelectorAll('.js-atc');\naddToCarts.forEach(addToCart => {\n  addToCart.addEventListener('click', e => {\n    const _this = e.target;\n    const prId = _this.getAttribute('data-product');\n    let addItems;\n    addItems = [{\n      id: prId,\n      quantity: 1\n    }];\n    const formData = {\n      items: addItems\n    };\n    fetch(window.Shopify.routes.root + 'cart/add.js', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify(formData)\n    }).then(response => {\n      return response.json();\n    }).catch(error => {\n      console.error('Error:', error);\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9ob21lLXByb2R1Y3QtYmxvY2svaG9tZS1wcm9kdWN0LWJsb2NrLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvaG9tZS1wcm9kdWN0LWJsb2NrL2hvbWUtcHJvZHVjdC1ibG9jay5qcz9iMTljIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIHByZWZlci1jb25zdCAqL1xuaW1wb3J0ICcuL2hvbWUtcHJvZHVjdC1ibG9jay5jc3MnXG5cbmNvbnN0IGFkZFRvQ2FydHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYXRjJylcbmFkZFRvQ2FydHMuZm9yRWFjaChhZGRUb0NhcnQgPT4ge1xuICBhZGRUb0NhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IF90aGlzID0gZS50YXJnZXRcbiAgICBjb25zdCBwcklkID0gX3RoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLXByb2R1Y3QnKVxuICAgIGxldCBhZGRJdGVtc1xuICAgIGFkZEl0ZW1zID0gW1xuICAgICAge1xuICAgICAgICBpZDogcHJJZCxcbiAgICAgICAgcXVhbnRpdHk6IDFcbiAgICAgIH1cbiAgICBdXG4gICAgY29uc3QgZm9ybURhdGEgPSB7XG4gICAgICBpdGVtczogYWRkSXRlbXNcbiAgICB9XG4gICAgZmV0Y2god2luZG93LlNob3BpZnkucm91dGVzLnJvb3QgKyAnY2FydC9hZGQuanMnLCB7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKVxuICAgIH0pXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycm9yKVxuICAgICAgfSlcbiAgfSlcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/home-product-block/home-product-block.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/home-product-block.js":
/*!***********************************************************!*\
  !*** ./src/scripts/entries/section/home-product-block.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_home_product_block_home_product_block_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/home-product-block/home-product-block.js */ \"./src/modules/home-product-block/home-product-block.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_home_product_block_home_product_block_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'HpProduct');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vaG9tZS1wcm9kdWN0LWJsb2NrLmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL2hvbWUtcHJvZHVjdC1ibG9jay5qcz8zODYxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBIcFByb2R1Y3QgZnJvbSAnbW9kdWxlcy9ob21lLXByb2R1Y3QtYmxvY2svaG9tZS1wcm9kdWN0LWJsb2NrLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KEhwUHJvZHVjdCwgJ0hwUHJvZHVjdCcpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/home-product-block.js\n");

/***/ }),

/***/ "./src/modules/home-product-block/home-product-block.css":
/*!***************************************************************!*\
  !*** ./src/modules/home-product-block/home-product-block.css ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9ob21lLXByb2R1Y3QtYmxvY2svaG9tZS1wcm9kdWN0LWJsb2NrLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvaG9tZS1wcm9kdWN0LWJsb2NrL2hvbWUtcHJvZHVjdC1ibG9jay5jc3M/YzdiYyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/home-product-block/home-product-block.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/home-product-block.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);