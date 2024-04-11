"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-product-zigzag"],{

/***/ "./src/modules/product-zigzag/product-zigzag.js":
/*!******************************************************!*\
  !*** ./src/modules/product-zigzag/product-zigzag.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _product_zigzag_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./product-zigzag.css */ \"./src/modules/product-zigzag/product-zigzag.css\");\n\nconst upsellProducts = document.querySelectorAll('.upsell-product');\nupsellProducts.forEach(upsellProduct => {\n  upsellProduct.addEventListener('click', e => {\n    let _this = e.currentTarget;\n    _this.classList.toggle('active');\n  });\n});\nconst addToCartsZigs = document.querySelectorAll(\".js-add-to-cart-zig\");\naddToCartsZigs.forEach(addToCartsZig => {\n  addToCartsZig.addEventListener(\"click\", e => {\n    const _this = e.currentTarget;\n    const parentDiv = _this.closest(\".product-zigzag__content\");\n    const upsellProductSelectors = parentDiv.querySelectorAll(\".js-upsell-selector.active\");\n    const productSelector = _this.getAttribute(\"data-product\");\n    const addItems = [{\n      id: productSelector,\n      quantity: 1\n    }];\n    upsellProductSelectors.forEach(productSelector => {\n      const _this = productSelector;\n      const productId = _this.getAttribute(\"data-product-id\");\n      addItems.push({\n        id: productId,\n        quantity: 1\n      });\n    });\n    console.log(addItems, \"addItems\");\n    const formData = {\n      items: addItems\n    };\n    fetch(window.Shopify.routes.root + \"cart/add.js\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify(formData)\n    }).then(response => {\n      console.log(response.status, \"ok\");\n      return response.json();\n    }).catch(error => {\n      console.error(\"Error:\", error);\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXppZ3phZy9wcm9kdWN0LXppZ3phZy5qcyIsIm1hcHBpbmdzIjoiOztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXppZ3phZy9wcm9kdWN0LXppZ3phZy5qcz9kZGJhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9wcm9kdWN0LXppZ3phZy5jc3MnXG5cbmNvbnN0IHVwc2VsbFByb2R1Y3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnVwc2VsbC1wcm9kdWN0JylcbnVwc2VsbFByb2R1Y3RzLmZvckVhY2goKHVwc2VsbFByb2R1Y3QpID0+IHtcbiAgICB1cHNlbGxQcm9kdWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgbGV0IF90aGlzID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgICAgIF90aGlzLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpXG4gICAgfSlcbn0pXG5cbmNvbnN0IGFkZFRvQ2FydHNaaWdzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5qcy1hZGQtdG8tY2FydC16aWdcIik7XG5cbmFkZFRvQ2FydHNaaWdzLmZvckVhY2goKGFkZFRvQ2FydHNaaWcpID0+IHtcbiAgICBhZGRUb0NhcnRzWmlnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgX3RoaXMgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICBjb25zdCBwYXJlbnREaXYgPSBfdGhpcy5jbG9zZXN0KFwiLnByb2R1Y3QtemlnemFnX19jb250ZW50XCIpO1xuICAgICAgY29uc3QgdXBzZWxsUHJvZHVjdFNlbGVjdG9ycyA9IHBhcmVudERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiLmpzLXVwc2VsbC1zZWxlY3Rvci5hY3RpdmVcIik7XG4gICAgICBjb25zdCBwcm9kdWN0U2VsZWN0b3IgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb2R1Y3RcIik7XG4gICAgICBjb25zdCBhZGRJdGVtcyA9IFt7XG4gICAgICAgIGlkOiBwcm9kdWN0U2VsZWN0b3IsXG4gICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgfV07XG4gICAgICB1cHNlbGxQcm9kdWN0U2VsZWN0b3JzLmZvckVhY2goKHByb2R1Y3RTZWxlY3RvcikgPT4ge1xuICAgICAgICBjb25zdCBfdGhpcyA9IHByb2R1Y3RTZWxlY3RvcjtcbiAgICAgICAgY29uc3QgcHJvZHVjdElkID0gX3RoaXMuZ2V0QXR0cmlidXRlKFwiZGF0YS1wcm9kdWN0LWlkXCIpO1xuICAgICAgICBhZGRJdGVtcy5wdXNoKHtcbiAgICAgICAgICBpZDogcHJvZHVjdElkLFxuICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coYWRkSXRlbXMsIFwiYWRkSXRlbXNcIik7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgaXRlbXM6IGFkZEl0ZW1zLFxuICAgICAgfTtcbiAgICAgIGZldGNoKHdpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290ICsgXCJjYXJ0L2FkZC5qc1wiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzLCBcIm9rXCIpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/product-zigzag/product-zigzag.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/product-zigzag.js":
/*!*******************************************************!*\
  !*** ./src/scripts/entries/section/product-zigzag.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_product_zigzag_product_zigzag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/product-zigzag/product-zigzag.js */ \"./src/modules/product-zigzag/product-zigzag.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_product_zigzag_product_zigzag_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'ProductZigzag');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcHJvZHVjdC16aWd6YWcuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vcHJvZHVjdC16aWd6YWcuanM/MDkyYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgUHJvZHVjdFppZ3phZyBmcm9tICdtb2R1bGVzL3Byb2R1Y3QtemlnemFnL3Byb2R1Y3QtemlnemFnLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KFByb2R1Y3RaaWd6YWcsICdQcm9kdWN0WmlnemFnJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/product-zigzag.js\n");

/***/ }),

/***/ "./src/modules/product-zigzag/product-zigzag.css":
/*!*******************************************************!*\
  !*** ./src/modules/product-zigzag/product-zigzag.css ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9wcm9kdWN0LXppZ3phZy9wcm9kdWN0LXppZ3phZy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtemlnemFnL3Byb2R1Y3QtemlnemFnLmNzcz9kMWY1Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/product-zigzag/product-zigzag.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/product-zigzag.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);