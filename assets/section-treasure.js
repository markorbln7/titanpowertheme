"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-treasure"],{

/***/ "./src/modules/treasure/treasure.js":
/*!******************************************!*\
  !*** ./src/modules/treasure/treasure.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _treasure_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./treasure.css */ \"./src/modules/treasure/treasure.css\");\n\n// Set the date we're counting down to\nvar countDownDate = new Date('Nov 10, 2023 21:00:00').getTime();\n\n// Update the count down every 1 second\nvar x = setInterval(function () {\n  // Get today's date and time\n  var now = new Date().getTime();\n  // Find the distance between now and the count down date\n  var distance = countDownDate - now;\n  // Time calculations for days, hours, minutes and seconds\n  var days = Math.floor(distance / (1000 * 60 * 60 * 24));\n  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));\n  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));\n  var seconds = Math.floor(distance % (1000 * 60) / 1000);\n  if (days < 10) {\n    days = '0' + days;\n  }\n  if (minutes < 10) {\n    minutes = '0' + minutes;\n  }\n  if (seconds < 10) {\n    seconds = '0' + seconds;\n  }\n  if (hours < 10) {\n    hours = '0' + hours;\n  }\n\n  // Display the result in the element with id=\"demo\"\n  document.getElementById('demo').innerHTML = '<div class=\"number-block\">' + days + '<span>days</span>' + '</div>' + '<div class=\"number-block\">' + hours + '<span>hours</span>' + '</div>' + '<div class=\"number-block\">' + minutes + '<span>minutes</span>' + '</div>' + '<div class=\"number-block\">' + seconds + '<span>seconds</span>' + '</div>';\n  document.getElementById('demo2').innerHTML = '<div class=\"number-block\">' + days + '<span>days</span>' + '</div>' + '<div class=\"number-block\">' + hours + '<span>hours</span>' + '</div>' + '<div class=\"number-block\">' + minutes + '<span>minutes</span>' + '</div>' + '<div class=\"number-block\">' + seconds + '<span>seconds</span>' + '</div>';\n\n  // If the count down is finished, write some text\n  if (distance < 0) {\n    clearInterval(x);\n    document.getElementById('demo').innerHTML = 'EXPIRED';\n    document.getElementById('demo2').innerHTML = 'EXPIRED';\n  }\n}, 1000);\nconst imageClickHandlers = document.querySelectorAll('.js-image-click');\nimageClickHandlers.forEach(imageClickHandler => {\n  imageClickHandler.addEventListener('click', function () {\n    const urlReveal = this.parentNode.querySelector('.js-url-reveal');\n    const upperReveal = this.parentNode.querySelector('.js-upper-reveal');\n    const video = this.parentNode.querySelector('.video');\n    const imageDesktop = this.parentNode.querySelector('.js-image.desktop');\n    const imageMobile = this.parentNode.querySelector('.js-image.mobile');\n    imageDesktop.classList.add('hide');\n    imageMobile.classList.add('hide');\n    video.classList.add('reveal');\n    setTimeout(() => {\n      urlReveal.classList.add('reveal');\n      upperReveal.classList.add('reveal');\n    }, '2000');\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90cmVhc3VyZS90cmVhc3VyZS5qcyIsIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvdHJlYXN1cmUvdHJlYXN1cmUuanM/ZmU5YyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vdHJlYXN1cmUuY3NzJ1xuLy8gU2V0IHRoZSBkYXRlIHdlJ3JlIGNvdW50aW5nIGRvd24gdG9cbnZhciBjb3VudERvd25EYXRlID0gbmV3IERhdGUoJ05vdiAxMCwgMjAyMyAyMTowMDowMCcpLmdldFRpbWUoKVxuXG4vLyBVcGRhdGUgdGhlIGNvdW50IGRvd24gZXZlcnkgMSBzZWNvbmRcbnZhciB4ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAvLyBHZXQgdG9kYXkncyBkYXRlIGFuZCB0aW1lXG4gIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAvLyBGaW5kIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIG5vdyBhbmQgdGhlIGNvdW50IGRvd24gZGF0ZVxuICB2YXIgZGlzdGFuY2UgPSBjb3VudERvd25EYXRlIC0gbm93XG4gIC8vIFRpbWUgY2FsY3VsYXRpb25zIGZvciBkYXlzLCBob3VycywgbWludXRlcyBhbmQgc2Vjb25kc1xuICB2YXIgZGF5cyA9IE1hdGguZmxvb3IoZGlzdGFuY2UgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpXG4gIHZhciBob3VycyA9IE1hdGguZmxvb3IoKGRpc3RhbmNlICUgKDEwMDAgKiA2MCAqIDYwICogMjQpKSAvICgxMDAwICogNjAgKiA2MCkpXG4gIHZhciBtaW51dGVzID0gTWF0aC5mbG9vcigoZGlzdGFuY2UgJSAoMTAwMCAqIDYwICogNjApKSAvICgxMDAwICogNjApKVxuICB2YXIgc2Vjb25kcyA9IE1hdGguZmxvb3IoKGRpc3RhbmNlICUgKDEwMDAgKiA2MCkpIC8gMTAwMClcbiAgaWYgKGRheXMgPCAxMCkge1xuICAgIGRheXMgPSAnMCcgKyBkYXlzXG4gIH1cbiAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzXG4gIH1cbiAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzXG4gIH1cbiAgaWYgKGhvdXJzIDwgMTApIHtcbiAgICBob3VycyA9ICcwJyArIGhvdXJzXG4gIH1cblxuICAvLyBEaXNwbGF5IHRoZSByZXN1bHQgaW4gdGhlIGVsZW1lbnQgd2l0aCBpZD1cImRlbW9cIlxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtbycpLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwibnVtYmVyLWJsb2NrXCI+JyArIGRheXMgKyAnPHNwYW4+ZGF5czwvc3Bhbj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIm51bWJlci1ibG9ja1wiPicgKyBob3VycyArICc8c3Bhbj5ob3Vyczwvc3Bhbj4nICsgJzwvZGl2PicgKyAnPGRpdiBjbGFzcz1cIm51bWJlci1ibG9ja1wiPicgKyBtaW51dGVzICsgJzxzcGFuPm1pbnV0ZXM8L3NwYW4+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJudW1iZXItYmxvY2tcIj4nICsgc2Vjb25kcyArICc8c3Bhbj5zZWNvbmRzPC9zcGFuPicgKyAnPC9kaXY+J1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtbzInKS5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cIm51bWJlci1ibG9ja1wiPicgKyBkYXlzICsgJzxzcGFuPmRheXM8L3NwYW4+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJudW1iZXItYmxvY2tcIj4nICsgaG91cnMgKyAnPHNwYW4+aG91cnM8L3NwYW4+JyArICc8L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJudW1iZXItYmxvY2tcIj4nICsgbWludXRlcyArICc8c3Bhbj5taW51dGVzPC9zcGFuPicgKyAnPC9kaXY+JyArICc8ZGl2IGNsYXNzPVwibnVtYmVyLWJsb2NrXCI+JyArIHNlY29uZHMgKyAnPHNwYW4+c2Vjb25kczwvc3Bhbj4nICsgJzwvZGl2PidcblxuICAvLyBJZiB0aGUgY291bnQgZG93biBpcyBmaW5pc2hlZCwgd3JpdGUgc29tZSB0ZXh0XG4gIGlmIChkaXN0YW5jZSA8IDApIHtcbiAgICBjbGVhckludGVydmFsKHgpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8nKS5pbm5lckhUTUwgPSAnRVhQSVJFRCdcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVtbzInKS5pbm5lckhUTUwgPSAnRVhQSVJFRCdcbiAgfVxufSwgMTAwMClcblxuY29uc3QgaW1hZ2VDbGlja0hhbmRsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWltYWdlLWNsaWNrJylcblxuaW1hZ2VDbGlja0hhbmRsZXJzLmZvckVhY2goKGltYWdlQ2xpY2tIYW5kbGVyKSA9PiB7XG4gIGltYWdlQ2xpY2tIYW5kbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHVybFJldmVhbCA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcuanMtdXJsLXJldmVhbCcpXG4gICAgY29uc3QgdXBwZXJSZXZlYWwgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLmpzLXVwcGVyLXJldmVhbCcpXG4gICAgY29uc3QgdmlkZW8gPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLnZpZGVvJylcbiAgICBjb25zdCBpbWFnZURlc2t0b3AgPSB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLmpzLWltYWdlLmRlc2t0b3AnKVxuICAgIGNvbnN0IGltYWdlTW9iaWxlID0gdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5qcy1pbWFnZS5tb2JpbGUnKVxuICAgIGltYWdlRGVza3RvcC5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICBpbWFnZU1vYmlsZS5jbGFzc0xpc3QuYWRkKCdoaWRlJylcbiAgICB2aWRlby5jbGFzc0xpc3QuYWRkKCdyZXZlYWwnKVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdXJsUmV2ZWFsLmNsYXNzTGlzdC5hZGQoJ3JldmVhbCcpXG4gICAgICB1cHBlclJldmVhbC5jbGFzc0xpc3QuYWRkKCdyZXZlYWwnKVxuICAgIH0sICcyMDAwJylcbiAgfSlcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/treasure/treasure.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/treasure.js":
/*!*************************************************!*\
  !*** ./src/scripts/entries/section/treasure.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_treasure_treasure_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/treasure/treasure.js */ \"./src/modules/treasure/treasure.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_treasure_treasure_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'Treasure');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vdHJlYXN1cmUuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vdHJlYXN1cmUuanM/NDhhNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpbml0Q29tcG9uZW50IH0gZnJvbSAnbGliL2NvbXBvbmVudHMnXG5pbXBvcnQgVHJlYXN1cmUgZnJvbSAnbW9kdWxlcy90cmVhc3VyZS90cmVhc3VyZS5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChUcmVhc3VyZSwgJ1RyZWFzdXJlJylcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/treasure.js\n");

/***/ }),

/***/ "./src/modules/treasure/treasure.css":
/*!*******************************************!*\
  !*** ./src/modules/treasure/treasure.css ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy90cmVhc3VyZS90cmVhc3VyZS5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9tb2R1bGVzL3RyZWFzdXJlL3RyZWFzdXJlLmNzcz9jNjMzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/treasure/treasure.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/treasure.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);