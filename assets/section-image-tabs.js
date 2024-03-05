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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_image_tabs_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-image-tabs.css */ \"./src/modules/image-tabs/section-image-tabs.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  const buttons = document.querySelectorAll('.image-tabs__button');\n  const imagesWrapper = document.querySelectorAll('.image-tabs__images');\n  buttons.forEach(function (button) {\n    button.addEventListener('click', function (e) {\n      const doc = this.parentNode.parentNode.parentNode;\n      console.log(doc, 'test');\n      const panels = doc.querySelectorAll('.image-tabs__panel');\n      const images = doc.querySelectorAll('.image-tabs__images figure');\n      const tabs = doc.querySelectorAll('.image-tabs__button');\n      panels.forEach(function (panel) {\n        panel.classList.remove('active');\n      });\n      images.forEach(function (image) {\n        image.classList.remove('active');\n      });\n      tabs.forEach(function (tab) {\n        tab.classList.remove('active');\n      });\n      const tabNumber = this.getAttribute('data-tab');\n      this.classList.add('active');\n      const panel = doc.querySelector('.image-tabs__panel[data-content=\"' + tabNumber + '\"]');\n      const image = doc.querySelector('.image-tabs__images figure[data-image=\"' + tabNumber + '\"]');\n      panel.classList.add('active');\n      image.classList.add('active');\n    });\n  });\n  imagesWrapper.forEach(el => {\n    el.addEventListener('mouseenter', function () {\n      el.classList.add('is-open');\n      console.log(el);\n    });\n    el.addEventListener('mouseleave', function () {\n      el.classList.remove('is-open');\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9pbWFnZS10YWJzL3NlY3Rpb24taW1hZ2UtdGFicy5qcyIsIm1hcHBpbmdzIjoiOztBQUFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvaW1hZ2UtdGFicy9zZWN0aW9uLWltYWdlLXRhYnMuanM/MDg4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi1pbWFnZS10YWJzLmNzcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19idXR0b24nKVxuICBjb25zdCBpbWFnZXNXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXRhYnNfX2ltYWdlcycpXG5cbiAgYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uIChidXR0b24pIHtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc3QgZG9jID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZVxuICAgICAgY29uc29sZS5sb2coZG9jLCAndGVzdCcpXG4gICAgICBjb25zdCBwYW5lbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXRhYnNfX3BhbmVsJylcbiAgICAgIGNvbnN0IGltYWdlcyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtdGFic19faW1hZ2VzIGZpZ3VyZScpXG4gICAgICBjb25zdCB0YWJzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19idXR0b24nKVxuICAgICAgcGFuZWxzLmZvckVhY2goZnVuY3Rpb24gKHBhbmVsKSB7XG4gICAgICAgIHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9KVxuICAgICAgaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgIGltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9KVxuICAgICAgdGFicy5mb3JFYWNoKGZ1bmN0aW9uICh0YWIpIHtcbiAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB0YWJOdW1iZXIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS10YWInKVxuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgY29uc3QgcGFuZWwgPSBkb2MucXVlcnlTZWxlY3RvcignLmltYWdlLXRhYnNfX3BhbmVsW2RhdGEtY29udGVudD1cIicgKyB0YWJOdW1iZXIgKyAnXCJdJylcbiAgICAgIGNvbnN0IGltYWdlID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5pbWFnZS10YWJzX19pbWFnZXMgZmlndXJlW2RhdGEtaW1hZ2U9XCInICsgdGFiTnVtYmVyICsgJ1wiXScpXG4gICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgaW1hZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICB9KVxuICB9KVxuXG4gIGltYWdlc1dyYXBwZXIuZm9yRWFjaChlbCA9PiB7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKVxuICAgICAgY29uc29sZS5sb2coZWwpXG4gICAgfSlcblxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJylcbiAgICB9KVxuICB9KVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/image-tabs/section-image-tabs.js\n");

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