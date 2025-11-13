"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-text-with-icons"],{

/***/ "./src/modules/text-with-icons/section-text-with-icons.js":
/*!****************************************************************!*\
  !*** ./src/modules/text-with-icons/section-text-with-icons.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_text_with_icons_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-text-with-icons.css */ \"./src/modules/text-with-icons/section-text-with-icons.css\");\n\nconst numbersWrapper = document.querySelectorAll('.section-text-with-icons__repeater');\nconst options = {\n  root: null,\n  rootMargin: '0px',\n  threshold: 0.5\n};\nconst observer = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      animateCounters(entry.target);\n      observer.unobserve(entry.target);\n    }\n  });\n}, options);\nnumbersWrapper.forEach(section => {\n  observer.observe(section);\n});\nfunction animateCounters(section) {\n  const counters = section.querySelectorAll('.number');\n  counters.forEach(counter => {\n    const id = counter.getAttribute('id');\n    const start = parseFloat(counter.getAttribute('data-start'));\n    const end = parseFloat(counter.getAttribute('data-end').replace(',', '.'));\n    const duration = parseInt(counter.getAttribute('data-duration'));\n    startCounter(id, start, end, duration);\n  });\n}\nfunction startCounter(id, start, end, duration) {\n  const obj = document.getElementById(id);\n  let current = start;\n  const range = end - start;\n  const increment = range > 0 ? 1 : -1;\n  const step = Math.abs(duration / range);\n  const timer = setInterval(() => {\n    current += increment;\n    if (range > 0 && current >= end || range < 0 && current <= end) {\n      clearInterval(timer);\n      current = end;\n    }\n    obj.textContent = current % 1 === 0 ? current : current.toFixed(1);\n  }, step);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuanM/ZWM4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuY3NzJ1xuXG5jb25zdCBudW1iZXJzV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uLXRleHQtd2l0aC1pY29uc19fcmVwZWF0ZXInKVxuXG5jb25zdCBvcHRpb25zID0ge1xuICByb290OiBudWxsLFxuICByb290TWFyZ2luOiAnMHB4JyxcbiAgdGhyZXNob2xkOiAwLjVcbn1cblxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMsIG9ic2VydmVyKSA9PiB7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICBhbmltYXRlQ291bnRlcnMoZW50cnkudGFyZ2V0KVxuICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldClcbiAgICB9XG4gIH0pXG59LCBvcHRpb25zKVxuXG5udW1iZXJzV3JhcHBlci5mb3JFYWNoKHNlY3Rpb24gPT4ge1xuICBvYnNlcnZlci5vYnNlcnZlKHNlY3Rpb24pXG59KVxuXG5mdW5jdGlvbiBhbmltYXRlQ291bnRlcnMgKHNlY3Rpb24pIHtcbiAgY29uc3QgY291bnRlcnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5udW1iZXInKVxuXG4gIGNvdW50ZXJzLmZvckVhY2goY291bnRlciA9PiB7XG4gICAgY29uc3QgaWQgPSBjb3VudGVyLmdldEF0dHJpYnV0ZSgnaWQnKVxuICAgIGNvbnN0IHN0YXJ0ID0gcGFyc2VGbG9hdChjb3VudGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zdGFydCcpKVxuICAgIGNvbnN0IGVuZCA9IHBhcnNlRmxvYXQoY291bnRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtZW5kJykucmVwbGFjZSgnLCcsICcuJykpXG4gICAgY29uc3QgZHVyYXRpb24gPSBwYXJzZUludChjb3VudGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1kdXJhdGlvbicpKVxuICAgIHN0YXJ0Q291bnRlcihpZCwgc3RhcnQsIGVuZCwgZHVyYXRpb24pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHN0YXJ0Q291bnRlciAoaWQsIHN0YXJ0LCBlbmQsIGR1cmF0aW9uKSB7XG4gIGNvbnN0IG9iaiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICBsZXQgY3VycmVudCA9IHN0YXJ0XG4gIGNvbnN0IHJhbmdlID0gZW5kIC0gc3RhcnRcbiAgY29uc3QgaW5jcmVtZW50ID0gcmFuZ2UgPiAwID8gMSA6IC0xXG4gIGNvbnN0IHN0ZXAgPSBNYXRoLmFicyhkdXJhdGlvbiAvIHJhbmdlKVxuICBjb25zdCB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBjdXJyZW50ICs9IGluY3JlbWVudFxuICAgIGlmICgocmFuZ2UgPiAwICYmIGN1cnJlbnQgPj0gZW5kKSB8fCAocmFuZ2UgPCAwICYmIGN1cnJlbnQgPD0gZW5kKSkge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcilcbiAgICAgIGN1cnJlbnQgPSBlbmRcbiAgICB9XG4gICAgb2JqLnRleHRDb250ZW50ID0gY3VycmVudCAlIDEgPT09IDAgPyBjdXJyZW50IDogY3VycmVudC50b0ZpeGVkKDEpXG4gIH0sIHN0ZXApXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/text-with-icons/section-text-with-icons.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/text-with-icons.js":
/*!********************************************************!*\
  !*** ./src/scripts/entries/section/text-with-icons.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_text_with_icons_section_text_with_icons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/text-with-icons/section-text-with-icons.js */ \"./src/modules/text-with-icons/section-text-with-icons.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_text_with_icons_section_text_with_icons_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'TextWithIcons');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vdGV4dC13aXRoLWljb25zLmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL3RleHQtd2l0aC1pY29ucy5qcz85NDUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBUZXh0V2l0aEljb25zIGZyb20gJ21vZHVsZXMvdGV4dC13aXRoLWljb25zL3NlY3Rpb24tdGV4dC13aXRoLWljb25zLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KFRleHRXaXRoSWNvbnMsICdUZXh0V2l0aEljb25zJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/text-with-icons.js\n");

/***/ }),

/***/ "./src/modules/text-with-icons/section-text-with-icons.css":
/*!*****************************************************************!*\
  !*** ./src/modules/text-with-icons/section-text-with-icons.css ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuY3NzP2Q3ZGUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/text-with-icons/section-text-with-icons.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/text-with-icons.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);