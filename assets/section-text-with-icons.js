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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_text_with_icons_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-text-with-icons.css */ \"./src/modules/text-with-icons/section-text-with-icons.css\");\n\nconst numbersWrapper = document.querySelectorAll('.section-text-with-icons__repeater');\nconst options = {\n  root: null,\n  rootMargin: '0px',\n  threshold: 0.5\n};\nconst observer = new IntersectionObserver((entries, observer) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      animateCounters(entry.target);\n      observer.unobserve(entry.target);\n    }\n  });\n}, options);\nnumbersWrapper.forEach(section => {\n  observer.observe(section);\n});\nfunction animateCounters(section) {\n  const counters = section.querySelectorAll('.number');\n  counters.forEach(counter => {\n    const id = counter.getAttribute('id');\n    const start = parseFloat(counter.getAttribute('data-start'));\n    const end = parseFloat(counter.getAttribute('data-end').replace(',', '.'));\n    const duration = parseInt(counter.getAttribute('data-duration'));\n    startCounter(id, start, end, duration);\n  });\n}\nfunction startCounter(id, start, end, duration) {\n  let obj = document.getElementById(id),\n    current = start,\n    range = end - start,\n    increment = range > 0 ? 1 : -1,\n    step = Math.abs(duration / range),\n    timer = setInterval(() => {\n      current += increment;\n      if (range > 0 && current >= end || range < 0 && current <= end) {\n        clearInterval(timer);\n        current = end;\n      }\n      obj.textContent = current % 1 === 0 ? current : current.toFixed(1);\n    }, step);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy90ZXh0LXdpdGgtaWNvbnMvc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuanM/ZWM4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vc2VjdGlvbi10ZXh0LXdpdGgtaWNvbnMuY3NzJ1xuXG5jb25zdCBudW1iZXJzV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uLXRleHQtd2l0aC1pY29uc19fcmVwZWF0ZXInKTtcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICByb290OiBudWxsLFxuICAgIHJvb3RNYXJnaW46ICcwcHgnLFxuICAgIHRocmVzaG9sZDogMC41XG59O1xuXG5jb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcywgb2JzZXJ2ZXIpID0+IHtcbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgIGFuaW1hdGVDb3VudGVycyhlbnRyeS50YXJnZXQpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0sIG9wdGlvbnMpO1xuXG5udW1iZXJzV3JhcHBlci5mb3JFYWNoKHNlY3Rpb24gPT4ge1xuICAgIG9ic2VydmVyLm9ic2VydmUoc2VjdGlvbik7XG59KTtcblxuZnVuY3Rpb24gYW5pbWF0ZUNvdW50ZXJzKHNlY3Rpb24pIHtcbiAgICBjb25zdCBjb3VudGVycyA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbCgnLm51bWJlcicpO1xuXG4gICAgY291bnRlcnMuZm9yRWFjaChjb3VudGVyID0+IHtcbiAgICAgICAgY29uc3QgaWQgPSBjb3VudGVyLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBwYXJzZUZsb2F0KGNvdW50ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXN0YXJ0JykpOyBcbiAgICAgICAgY29uc3QgZW5kID0gcGFyc2VGbG9hdChjb3VudGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1lbmQnKS5yZXBsYWNlKCcsJywgJy4nKSk7IFxuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlSW50KGNvdW50ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWR1cmF0aW9uJykpO1xuICAgICAgICBzdGFydENvdW50ZXIoaWQsIHN0YXJ0LCBlbmQsIGR1cmF0aW9uKTtcbiAgICB9KTtcbn1cblxuXG5mdW5jdGlvbiBzdGFydENvdW50ZXIoaWQsIHN0YXJ0LCBlbmQsIGR1cmF0aW9uKSB7XG4gICAgbGV0IG9iaiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSxcbiAgICAgICAgY3VycmVudCA9IHN0YXJ0LFxuICAgICAgICByYW5nZSA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICBpbmNyZW1lbnQgPSByYW5nZSA+IDAgPyAxIDogLTEsXG4gICAgICAgIHN0ZXAgPSBNYXRoLmFicyhkdXJhdGlvbiAvIHJhbmdlKSxcbiAgICAgICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50ICs9IGluY3JlbWVudDtcbiAgICAgICAgICAgIGlmICgocmFuZ2UgPiAwICYmIGN1cnJlbnQgPj0gZW5kKSB8fCAocmFuZ2UgPCAwICYmIGN1cnJlbnQgPD0gZW5kKSkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBlbmQ7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqLnRleHRDb250ZW50ID0gY3VycmVudCAlIDEgPT09IDAgPyBjdXJyZW50IDogY3VycmVudC50b0ZpeGVkKDEpOyBcbiAgICAgICAgfSwgc3RlcCk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/text-with-icons/section-text-with-icons.js\n");

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