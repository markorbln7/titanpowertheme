"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-image-tabs"],{

/***/ "./src/modules/image-tabs/section-image-tabs.js":
/*!******************************************************!*\
  !*** ./src/modules/image-tabs/section-image-tabs.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_image_tabs_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-image-tabs.css */ \"./src/modules/image-tabs/section-image-tabs.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var buttons = document.querySelectorAll('.image-tabs__button');\n  var imagesWrapper = document.querySelector('.image-tabs__images');\n  buttons.forEach(function (button) {\n    button.addEventListener('click', function (e) {\n      let doc = this.parentNode.parentNode.parentNode;\n      console.log(doc, 'test');\n      var panels = doc.querySelectorAll('.image-tabs__panel');\n      var images = doc.querySelectorAll('.image-tabs__images figure');\n      var tabs = doc.querySelectorAll('.image-tabs__button');\n      panels.forEach(function (panel) {\n        panel.classList.remove('active');\n      });\n      images.forEach(function (image) {\n        image.classList.remove('active');\n      });\n      tabs.forEach(function (tab) {\n        tab.classList.remove('active');\n      });\n      var tabNumber = this.getAttribute('data-tab');\n      this.classList.add('active');\n      var panel = doc.querySelector('.image-tabs__panel[data-content=\"' + tabNumber + '\"]');\n      var image = doc.querySelector('.image-tabs__images figure[data-image=\"' + tabNumber + '\"]');\n      panel.classList.add('active');\n      image.classList.add('active');\n    });\n  });\n  imagesWrapper.addEventListener('mouseenter', function () {\n    this.classList.add('is-open');\n  });\n  imagesWrapper.addEventListener('mouseleave', function () {\n    this.classList.remove('is-open');\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9pbWFnZS10YWJzL3NlY3Rpb24taW1hZ2UtdGFicy5qcyIsIm1hcHBpbmdzIjoiOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvaW1hZ2UtdGFicy9zZWN0aW9uLWltYWdlLXRhYnMuanM/MDg4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0ICcuL3NlY3Rpb24taW1hZ2UtdGFicy5jc3MnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtdGFic19fYnV0dG9uJyk7XG4gICAgdmFyIGltYWdlc1dyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtdGFic19faW1hZ2VzJyk7XG5cbiAgICBidXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IGRvYyA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkb2MsICd0ZXN0Jyk7XG4gICAgICAgICAgICB2YXIgcGFuZWxzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19wYW5lbCcpO1xuICAgICAgICAgICAgdmFyIGltYWdlcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtdGFic19faW1hZ2VzIGZpZ3VyZScpO1xuICAgICAgICAgICAgdmFyIHRhYnMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXRhYnNfX2J1dHRvbicpO1xuICAgICAgICAgICAgcGFuZWxzLmZvckVhY2goZnVuY3Rpb24gKHBhbmVsKSB7XG4gICAgICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICAgICAgICAgIGltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YWJzLmZvckVhY2goZnVuY3Rpb24gKHRhYikge1xuICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgdGFiTnVtYmVyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiJyk7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdmFyIHBhbmVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS10YWJzX19wYW5lbFtkYXRhLWNvbnRlbnQ9XCInICsgdGFiTnVtYmVyICsgJ1wiXScpO1xuICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS10YWJzX19pbWFnZXMgZmlndXJlW2RhdGEtaW1hZ2U9XCInICsgdGFiTnVtYmVyICsgJ1wiXScpO1xuICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpbWFnZXNXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xuICAgIH0pO1xuXG4gICAgaW1hZ2VzV3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgICB9KTtcblxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/image-tabs/section-image-tabs.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/image-tabs.js":
/*!***************************************************!*\
  !*** ./src/scripts/entries/section/image-tabs.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_image_tabs_section_image_tabs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/image-tabs/section-image-tabs.js */ \"./src/modules/image-tabs/section-image-tabs.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_image_tabs_section_image_tabs_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'ImageTabs');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vaW1hZ2UtdGFicy5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9zY3JpcHRzL2VudHJpZXMvc2VjdGlvbi9pbWFnZS10YWJzLmpzP2M0OWYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdENvbXBvbmVudCB9IGZyb20gJ2xpYi9jb21wb25lbnRzJ1xuaW1wb3J0IEltYWdlVGFicyBmcm9tICdtb2R1bGVzL2ltYWdlLXRhYnMvc2VjdGlvbi1pbWFnZS10YWJzLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KEltYWdlVGFicywgJ0ltYWdlVGFicycpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/image-tabs.js\n");

/***/ }),

/***/ "./src/modules/image-tabs/section-image-tabs.css":
/*!*******************************************************!*\
  !*** ./src/modules/image-tabs/section-image-tabs.css ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9pbWFnZS10YWJzL3NlY3Rpb24taW1hZ2UtdGFicy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2ltYWdlLXRhYnMvc2VjdGlvbi1pbWFnZS10YWJzLmNzcz9lZTZlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/image-tabs/section-image-tabs.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/image-tabs.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);