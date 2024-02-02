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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_text_with_icons_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-text-with-icons.css */ \"./src/modules/text-with-icons/section-text-with-icons.css\");\n\nconst numbersWrapper = document.querySelectorAll('.section-text-with-icons__repeater');\nconst options = {\n  root: null,\n  rootMargin: '0px',\n  threshold: 0.5\n};\nconst observer = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      animateCounters(entry.target);\n      observer.unobserve(entry.target);\n    }\n  });\n}, options);\nnumbersWrapper.forEach(section => {\n  observer.observe(section);\n});\nfunction animateCounters(section) {\n  const counters = section.querySelectorAll('.number');\n  counters.forEach(counter => {\n    const id = counter.getAttribute('id');\n    const start = parseInt(counter.getAttribute('data-start'));\n    const end = parseInt(counter.getAttribute('data-end'));\n    const duration = parseInt(counter.getAttribute('data-duration'));\n    startCounter(id, start, end, duration);\n  });\n}\nfunction startCounter(id, start, end, duration) {\n  let obj = document.getElementById(id),\n    current = start,\n    range = end - start,\n    increment = end > start ? 1 : -1,\n    step = Math.abs(Math.floor(duration / range)),\n    timer = setInterval(() => {\n      current += increment;\n      obj.textContent = current;\n      if (current == end) {\n        clearInterval(timer);\n      }\n    }, step);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvdGV4dC13aXRoLWljb25zL3NlY3Rpb24tdGV4dC13aXRoLWljb25zLmpzP2VjOGUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3NlY3Rpb24tdGV4dC13aXRoLWljb25zLmNzcydcblxuY29uc3QgbnVtYmVyc1dyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnNfX3JlcGVhdGVyJyk7XG5cbmNvbnN0IG9wdGlvbnMgPSB7XG4gICAgcm9vdDogbnVsbCxcbiAgICByb290TWFyZ2luOiAnMHB4JyxcbiAgICB0aHJlc2hvbGQ6IDAuNVxufTtcblxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMsIG9ic2VydmVyKSA9PiB7XG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgICBhbmltYXRlQ291bnRlcnMoZW50cnkudGFyZ2V0KTtcbiAgICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShlbnRyeS50YXJnZXQpO1xuICAgICAgICB9XG4gICAgfSk7XG59LCBvcHRpb25zKTtcblxubnVtYmVyc1dyYXBwZXIuZm9yRWFjaChzZWN0aW9uID0+IHtcbiAgICBvYnNlcnZlci5vYnNlcnZlKHNlY3Rpb24pO1xufSk7XG5cbmZ1bmN0aW9uIGFuaW1hdGVDb3VudGVycyhzZWN0aW9uKSB7XG4gICAgY29uc3QgY291bnRlcnMgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5udW1iZXInKTtcbiAgICBcbiAgICBjb3VudGVycy5mb3JFYWNoKGNvdW50ZXIgPT4ge1xuICAgICAgICBjb25zdCBpZCA9IGNvdW50ZXIuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgICAgICBjb25zdCBzdGFydCA9IHBhcnNlSW50KGNvdW50ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0JykpO1xuICAgICAgICBjb25zdCBlbmQgPSBwYXJzZUludChjb3VudGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQnKSk7XG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGFyc2VJbnQoY291bnRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtZHVyYXRpb24nKSk7XG4gICAgICAgIHN0YXJ0Q291bnRlcihpZCwgc3RhcnQsIGVuZCwgZHVyYXRpb24pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydENvdW50ZXIoaWQsIHN0YXJ0LCBlbmQsIGR1cmF0aW9uKSB7XG4gICAgbGV0IG9iaiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSxcbiAgICAgICAgY3VycmVudCA9IHN0YXJ0LFxuICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICBpbmNyZW1lbnQgPSBlbmQgPiBzdGFydCA/IDEgOiAtMSxcbiAgICAgICAgc3RlcCA9IE1hdGguYWJzKE1hdGguZmxvb3IoZHVyYXRpb24gLyByYW5nZSkpLFxuICAgICAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnQgKz0gaW5jcmVtZW50O1xuICAgICAgICAgICAgb2JqLnRleHRDb250ZW50ID0gY3VycmVudDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50ID09IGVuZCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzdGVwKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/text-with-icons/section-text-with-icons.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/text-with-icons.js":
/*!********************************************************!*\
  !*** ./src/scripts/entries/section/text-with-icons.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_text_with_icons_section_text_with_icons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/text-with-icons/section-text-with-icons.js */ \"./src/modules/text-with-icons/section-text-with-icons.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_text_with_icons_section_text_with_icons_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'TextWithIcons');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vdGV4dC13aXRoLWljb25zLmpzIiwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL3NjcmlwdHMvZW50cmllcy9zZWN0aW9uL3RleHQtd2l0aC1pY29ucy5qcz85NDUxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGluaXRDb21wb25lbnQgfSBmcm9tICdsaWIvY29tcG9uZW50cydcbmltcG9ydCBUZXh0V2l0aEljb25zIGZyb20gJ21vZHVsZXMvdGV4dC13aXRoLWljb25zL3NlY3Rpb24tdGV4dC13aXRoLWljb25zLmpzJyBcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChUZXh0V2l0aEljb25zLCAnVGV4dFdpdGhJY29ucycpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/text-with-icons.js\n");

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