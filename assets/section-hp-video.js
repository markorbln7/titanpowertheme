"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-hp-video"],{

/***/ "./src/modules/hp-video/hp-video.js":
/*!******************************************!*\
  !*** ./src/modules/hp-video/hp-video.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hp_video_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hp-video.css */ \"./src/modules/hp-video/hp-video.css\");\n\nconst startVideo = document.querySelector('.js-video-start');\nstartVideo.addEventListener('click', function () {\n  const video = document.querySelector('.js-video');\n  video.play();\n  startVideo.classList.add('mobile-video__poster--hide');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9ocC12aWRlby9ocC12aWRlby5qcyIsIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2hwLXZpZGVvL2hwLXZpZGVvLmpzPzdlNzciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2hwLXZpZGVvLmNzcydcbmNvbnN0IHN0YXJ0VmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtdmlkZW8tc3RhcnQnKVxuXG5zdGFydFZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCB2aWRlbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy12aWRlbycpXG4gIHZpZGVvLnBsYXkoKVxuICBzdGFydFZpZGVvLmNsYXNzTGlzdC5hZGQoJ21vYmlsZS12aWRlb19fcG9zdGVyLS1oaWRlJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/hp-video/hp-video.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/hp-video.js":
/*!*************************************************!*\
  !*** ./src/scripts/entries/section/hp-video.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_hp_video_hp_video_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/hp-video/hp-video.js */ \"./src/modules/hp-video/hp-video.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_hp_video_hp_video_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'HpVideo');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vaHAtdmlkZW8uanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vaHAtdmlkZW8uanM/MzQyZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgSHBWaWRlbyBmcm9tICdtb2R1bGVzL2hwLXZpZGVvL2hwLXZpZGVvLmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpbml0Q29tcG9uZW50KEhwVmlkZW8sICdIcFZpZGVvJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/hp-video.js\n");

/***/ }),

/***/ "./src/modules/hp-video/hp-video.css":
/*!*******************************************!*\
  !*** ./src/modules/hp-video/hp-video.css ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9ocC12aWRlby9ocC12aWRlby5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL2hwLXZpZGVvL2hwLXZpZGVvLmNzcz8zOGFjIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/hp-video/hp-video.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/hp-video.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);