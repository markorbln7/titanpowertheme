"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-air-tabs"],{

/***/ "./src/modules/air-tabs/section-air-tabs.js":
/*!**************************************************!*\
  !*** ./src/modules/air-tabs/section-air-tabs.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_air_tabs_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-air-tabs.css */ \"./src/modules/air-tabs/section-air-tabs.css\");\n\nconst tabs = document.querySelectorAll('.air-tabs__nav-item');\ntabs.forEach(tab => {\n  tab.addEventListener('click', () => {\n    setActive(tab);\n  });\n});\nconst showPanels = tab => {\n  tab.addEventListener('click', () => {\n    let tabIndex = tab.getAttribute('data-tab');\n    let panels = document.querySelectorAll('.air-tabs__tab-content');\n    panels.forEach(panel => {\n      const panelIndex = panel.getAttribute('data-panel');\n      if (panelIndex === tabIndex) {\n        setActive(panel);\n      }\n    });\n  });\n};\nconst setActive = function (el) {\n  [...el.parentElement.children].forEach(function (sib) {\n    sib.classList.remove('active');\n  });\n  el.classList.add('active');\n};\ntabs.forEach(tab => {\n  showPanels(tab);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9haXItdGFicy9zZWN0aW9uLWFpci10YWJzLmpzIiwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvYWlyLXRhYnMvc2VjdGlvbi1haXItdGFicy5qcz8zZjViIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9zZWN0aW9uLWFpci10YWJzLmNzcydcblxuY29uc3QgdGFicyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haXItdGFic19fbmF2LWl0ZW0nKTtcbnRhYnMuZm9yRWFjaCh0YWIgPT4ge1xuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgc2V0QWN0aXZlKHRhYik7XG4gICAgfSlcbn0pO1xuXG5jb25zdCBzaG93UGFuZWxzID0gKHRhYikgPT4ge1xuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgbGV0IHRhYkluZGV4ID0gdGFiLmdldEF0dHJpYnV0ZSgnZGF0YS10YWInKTtcbiAgICAgICAgbGV0IHBhbmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5haXItdGFic19fdGFiLWNvbnRlbnQnKTtcblxuICAgICAgICBwYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYW5lbEluZGV4ID0gcGFuZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhbmVsJyk7XG4gICAgICAgICAgICBpZihwYW5lbEluZGV4ID09PSB0YWJJbmRleCkge1xuICAgICAgICAgICAgICAgIHNldEFjdGl2ZShwYW5lbCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmNvbnN0IHNldEFjdGl2ZSA9IGZ1bmN0aW9uIChlbCkge1xuICAgIFsuLi5lbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuXS5mb3JFYWNoKGZ1bmN0aW9uIChzaWIpIHtcbiAgICAgICAgc2liLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxudGFicy5mb3JFYWNoKHRhYiA9PiB7XG4gICAgc2hvd1BhbmVscyh0YWIpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/air-tabs/section-air-tabs.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/air-tabs.js":
/*!*************************************************!*\
  !*** ./src/scripts/entries/section/air-tabs.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_air_tabs_section_air_tabs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/air-tabs/section-air-tabs.js */ \"./src/modules/air-tabs/section-air-tabs.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_air_tabs_section_air_tabs_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'AirTabs');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vYWlyLXRhYnMuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vYWlyLXRhYnMuanM/Y2FkNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgQWlyVGFicyBmcm9tICdtb2R1bGVzL2Fpci10YWJzL3NlY3Rpb24tYWlyLXRhYnMuanMnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGluaXRDb21wb25lbnQoQWlyVGFicywgJ0FpclRhYnMnKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/air-tabs.js\n");

/***/ }),

/***/ "./src/modules/air-tabs/section-air-tabs.css":
/*!***************************************************!*\
  !*** ./src/modules/air-tabs/section-air-tabs.css ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9haXItdGFicy9zZWN0aW9uLWFpci10YWJzLmNzcyIsIm1hcHBpbmdzIjoiO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvYWlyLXRhYnMvc2VjdGlvbi1haXItdGFicy5jc3M/MzU3YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/air-tabs/section-air-tabs.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/air-tabs.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);