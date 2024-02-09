"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-faq"],{

/***/ "./src/modules/faq/section-faq.js":
/*!****************************************!*\
  !*** ./src/modules/faq/section-faq.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_faq_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-faq.css */ \"./src/modules/faq/section-faq.css\");\n\nconst accordions = document.querySelectorAll('.faq__accordion');\nif (accordions && accordions.length) {\n  accordions.forEach(accordion => {\n    const accordionBtn = accordion.querySelector('.faq__accordion-header');\n    accordionBtn.addEventListener('click', () => {\n      toggleAccordion(accordion);\n    });\n  });\n}\nfunction toggleAccordion(accordion) {\n  const panel = accordion.querySelector('.faq__accordion-panel');\n  accordion.classList.toggle('open-accordion');\n  panel.style.maxHeight = panel.scrollHeight + 'px';\n  !accordion.classList.contains('open-accordion') ? panel.style.maxHeight = null : panel.style.maxHeight = panel.scrollHeight + 'px';\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9mYXEvc2VjdGlvbi1mYXEuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9mYXEvc2VjdGlvbi1mYXEuanM/YWEzYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi1mYXEuY3NzJ1xuXG5jb25zdCBhY2NvcmRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZhcV9fYWNjb3JkaW9uJyk7XG5cbmlmIChhY2NvcmRpb25zICYmIGFjY29yZGlvbnMubGVuZ3RoKSB7XG4gICAgYWNjb3JkaW9ucy5mb3JFYWNoKGFjY29yZGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IGFjY29yZGlvbkJ0biA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yKCcuZmFxX19hY2NvcmRpb24taGVhZGVyJyk7XG4gICAgICAgIGFjY29yZGlvbkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRvZ2dsZUFjY29yZGlvbihhY2NvcmRpb24pO1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUFjY29yZGlvbihhY2NvcmRpb24pIHtcbiAgICBjb25zdCBwYW5lbCA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yKCcuZmFxX19hY2NvcmRpb24tcGFuZWwnKTtcbiAgICBhY2NvcmRpb24uY2xhc3NMaXN0LnRvZ2dsZSgnb3Blbi1hY2NvcmRpb24nKTtcblxuICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgIWFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW4tYWNjb3JkaW9uJykgXG4gICAgICAgID8gcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gbnVsbCBcbiAgICAgICAgOiBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBwYW5lbC5zY3JvbGxIZWlnaHQgKyAncHgnOyAgICAgIFxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/faq/section-faq.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/faq.js":
/*!********************************************!*\
  !*** ./src/scripts/entries/section/faq.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_faq_section_faq_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/faq/section-faq.js */ \"./src/modules/faq/section-faq.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_faq_section_faq_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'Faq');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vZmFxLmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL2ZhcS5qcz8zZDMxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBGYXEgZnJvbSAnbW9kdWxlcy9mYXEvc2VjdGlvbi1mYXEuanMnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGluaXRDb21wb25lbnQoRmFxLCAnRmFxJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/faq.js\n");

/***/ }),

/***/ "./src/modules/faq/section-faq.css":
/*!*****************************************!*\
  !*** ./src/modules/faq/section-faq.css ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9mYXEvc2VjdGlvbi1mYXEuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9mYXEvc2VjdGlvbi1mYXEuY3NzP2ZmYzYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/faq/section-faq.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/faq.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);