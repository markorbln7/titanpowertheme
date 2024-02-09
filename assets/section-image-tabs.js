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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_image_tabs_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-image-tabs.css */ \"./src/modules/image-tabs/section-image-tabs.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var buttons = document.querySelectorAll('.image-tabs__button');\n  var imagesWrapper = document.querySelectorAll('.image-tabs__images');\n  console.log(imagesWrapper);\n  buttons.forEach(function (button) {\n    button.addEventListener('click', function (e) {\n      let doc = this.parentNode.parentNode.parentNode;\n      console.log(doc, 'test');\n      var panels = doc.querySelectorAll('.image-tabs__panel');\n      var images = doc.querySelectorAll('.image-tabs__images figure');\n      var tabs = doc.querySelectorAll('.image-tabs__button');\n      panels.forEach(function (panel) {\n        panel.classList.remove('active');\n      });\n      images.forEach(function (image) {\n        image.classList.remove('active');\n      });\n      tabs.forEach(function (tab) {\n        tab.classList.remove('active');\n      });\n      var tabNumber = this.getAttribute('data-tab');\n      this.classList.add('active');\n      var panel = doc.querySelector('.image-tabs__panel[data-content=\"' + tabNumber + '\"]');\n      var image = doc.querySelector('.image-tabs__images figure[data-image=\"' + tabNumber + '\"]');\n      panel.classList.add('active');\n      image.classList.add('active');\n    });\n  });\n  imagesWrapper.forEach(el => {\n    el.addEventListener('mouseenter', function () {\n      el.classList.add('is-open');\n      console.log(el);\n    });\n    el.addEventListener('mouseleave', function () {\n      el.classList.remove('is-open');\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9pbWFnZS10YWJzL3NlY3Rpb24taW1hZ2UtdGFicy5qcyIsIm1hcHBpbmdzIjoiOztBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9pbWFnZS10YWJzL3NlY3Rpb24taW1hZ2UtdGFicy5qcz8wODhlIl0sInNvdXJjZXNDb250ZW50IjpbIlxuXG5pbXBvcnQgJy4vc2VjdGlvbi1pbWFnZS10YWJzLmNzcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19idXR0b24nKTtcbiAgICB2YXIgaW1hZ2VzV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19pbWFnZXMnKTtcbiAgICBjb25zb2xlLmxvZyhpbWFnZXNXcmFwcGVyKTtcblxuICAgIGJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoYnV0dG9uKSB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgZG9jID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRvYywgJ3Rlc3QnKTtcbiAgICAgICAgICAgIHZhciBwYW5lbHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlLXRhYnNfX3BhbmVsJyk7XG4gICAgICAgICAgICB2YXIgaW1hZ2VzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWFnZS10YWJzX19pbWFnZXMgZmlndXJlJyk7XG4gICAgICAgICAgICB2YXIgdGFicyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2UtdGFic19fYnV0dG9uJyk7XG4gICAgICAgICAgICBwYW5lbHMuZm9yRWFjaChmdW5jdGlvbiAocGFuZWwpIHtcbiAgICAgICAgICAgICAgICBwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhYnMuZm9yRWFjaChmdW5jdGlvbiAodGFiKSB7XG4gICAgICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciB0YWJOdW1iZXIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS10YWInKTtcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB2YXIgcGFuZWwgPSBkb2MucXVlcnlTZWxlY3RvcignLmltYWdlLXRhYnNfX3BhbmVsW2RhdGEtY29udGVudD1cIicgKyB0YWJOdW1iZXIgKyAnXCJdJyk7XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2MucXVlcnlTZWxlY3RvcignLmltYWdlLXRhYnNfX2ltYWdlcyBmaWd1cmVbZGF0YS1pbWFnZT1cIicgKyB0YWJOdW1iZXIgKyAnXCJdJyk7XG4gICAgICAgICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIGltYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGltYWdlc1dyYXBwZXIuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbCk7XG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/modules/image-tabs/section-image-tabs.js\n");

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