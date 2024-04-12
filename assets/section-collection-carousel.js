"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-collection-carousel"],{

/***/ "./src/modules/collection-carousel/collection-carousel.js":
/*!****************************************************************!*\
  !*** ./src/modules/collection-carousel/collection-carousel.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _collection_carousel_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-carousel.css */ \"./src/modules/collection-carousel/collection-carousel.css\");\n\nconst tabs = document.querySelectorAll('.b-collection-carousel__tab');\nconst activePanel = document.querySelector('.b-collection-carousel__products.active');\ntabs.forEach(tab => {\n  tab.addEventListener('click', () => {\n    setActive(tab);\n    showPanel(tab);\n  });\n});\nconst setActive = function (el) {\n  [...el.parentElement.children].forEach(function (sib) {\n    sib.classList.remove('active');\n  });\n  el.classList.add('active');\n};\nconst showPanel = tab => {\n  let tabIndex = tab.getAttribute('data-tab');\n  let panels = document.querySelectorAll('.b-collection-carousel__products');\n  panels.forEach(panel => {\n    const panelIndex = panel.getAttribute('data-panel');\n    if (panelIndex === tabIndex) {\n      panel.classList.add('active');\n      initializeSwiper(panel);\n    } else {\n      panel.classList.remove('active');\n    }\n  });\n};\nfunction initializeSwiper(panel) {\n  if (panel.classList.contains('swiper-initialized')) return;\n  const panelSelector = '.' + panel.classList[0];\n  const newSwiper = new Swiper(panelSelector, {\n    slidesPerView: 1.2,\n    spaceBetween: 16,\n    loop: false,\n    draggable: true,\n    breakpoints: {\n      768: {\n        slidesPerView: 4,\n        slidesPerGroup: 1,\n        spaceBetween: 32\n      }\n    },\n    navigation: {\n      nextEl: '.swiper-collection-navigation-next',\n      prevEl: '.swiper-collection-navigation-prev'\n    }\n  });\n  panel.classList.add('swiper-initialized');\n}\ninitializeSwiper(activePanel);\n\n// Tabs dragging logic\nif (window.innerWidth > 1023) {\n  const tabsBox = document.querySelector('.b-collection-carousel__tabs'),\n    allTabs = tabsBox.querySelectorAll('.b-collection-carousel__tab'),\n    leftShadow = document.querySelector('.b-collection-carousel__shadow--left'),\n    rightShadow = document.querySelector('.b-collection-carousel__shadow--right');\n  let isDragging = false;\n  allTabs.forEach(tab => {\n    tab.addEventListener('click', () => {\n      tabsBox.querySelector('.active').classList.remove('active');\n      tab.classList.add('active');\n    });\n  });\n  const dragging = e => {\n    if (!isDragging) return;\n    tabsBox.classList.add('dragging');\n    tabsBox.scrollLeft -= e.movementX;\n    handleIcons(tabsBox.scrollLeft);\n  };\n  const dragStop = () => {\n    isDragging = false;\n    tabsBox.classList.remove('dragging');\n  };\n  const handleIcons = scrollVal => {\n    let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;\n    leftShadow.style.display = scrollVal <= 0 ? 'none' : 'block';\n    rightShadow.style.display = maxScrollableWidth - scrollVal <= 1 ? 'none' : 'block';\n  };\n  tabsBox.addEventListener('mousedown', () => isDragging = true);\n  tabsBox.addEventListener('mousemove', dragging);\n  document.addEventListener('mouseup', dragStop);\n}\nconst coll_increases = document.querySelectorAll('.increase');\ncoll_increases.forEach(increase => {\n  increase.addEventListener('click', e => {\n    const _this = e.currentTarget;\n    const parentDiv = _this.closest('.b-collection-carousel__product');\n    const inputValue = parentDiv.querySelector('.col-quantity__amount');\n    const currentInput = parentDiv.querySelector('.js-carousel-atc').getAttribute('data-qty');\n    const currentInputNumber = parseInt(currentInput);\n    inputValue.textContent = currentInputNumber + 1;\n    parentDiv.querySelector('.js-carousel-atc').setAttribute('data-qty', currentInputNumber + 1);\n  });\n});\nconst coll_decreases = document.querySelectorAll('.decrease');\ncoll_decreases.forEach(decrease => {\n  decrease.addEventListener('click', e => {\n    const _this = e.currentTarget;\n    const parentDiv = _this.closest('.b-collection-carousel__product');\n    const inputValue = parentDiv.querySelector('.col-quantity__amount');\n    const currentInput = parentDiv.querySelector('.js-carousel-atc').getAttribute('data-qty');\n    if (currentInput == 1) return;\n    const currentInputNumber = parseInt(currentInput);\n    inputValue.textContent = currentInputNumber - 1;\n    parentDiv.querySelector('.js-carousel-atc').setAttribute('data-qty', currentInputNumber - 1);\n  });\n});\nconst addToCartsCarousels = document.querySelectorAll(\".js-carousel-atc\");\naddToCartsCarousels.forEach(addToCartsCarousel => {\n  addToCartsCarousel.addEventListener(\"click\", e => {\n    const _this = e.currentTarget;\n    const productSelector = _this.getAttribute(\"data-product-id\");\n    const qty = _this.getAttribute(\"data-qty\");\n    const addItems = [{\n      id: productSelector,\n      quantity: qty\n    }];\n    console.log(addItems, \"addItems\");\n    const formData = {\n      items: addItems\n    };\n    fetch(window.Shopify.routes.root + \"cart/add.js\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify(formData)\n    }).then(response => {\n      console.log(response.status, \"ok\");\n      return response.json();\n    }).catch(error => {\n      console.error(\"Error:\", error);\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9uLWNhcm91c2VsL2NvbGxlY3Rpb24tY2Fyb3VzZWwuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvY29sbGVjdGlvbi1jYXJvdXNlbC9jb2xsZWN0aW9uLWNhcm91c2VsLmpzPzQ3YmMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2NvbGxlY3Rpb24tY2Fyb3VzZWwuY3NzJ1xuXG5jb25zdCB0YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmItY29sbGVjdGlvbi1jYXJvdXNlbF9fdGFiJyk7XG5jb25zdCBhY3RpdmVQYW5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iLWNvbGxlY3Rpb24tY2Fyb3VzZWxfX3Byb2R1Y3RzLmFjdGl2ZScpO1xuXG5cbnRhYnMuZm9yRWFjaCh0YWIgPT4ge1xuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgc2V0QWN0aXZlKHRhYik7XG4gICAgICAgIHNob3dQYW5lbCh0YWIpO1xuICAgIH0pO1xufSk7XG5cbmNvbnN0IHNldEFjdGl2ZSA9IGZ1bmN0aW9uIChlbCkge1xuICAgIFsuLi5lbC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuXS5mb3JFYWNoKGZ1bmN0aW9uIChzaWIpIHtcbiAgICAgICAgc2liLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuY29uc3Qgc2hvd1BhbmVsID0gKHRhYikgPT4ge1xuICAgIGxldCB0YWJJbmRleCA9IHRhYi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFiJyk7XG4gICAgbGV0IHBhbmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iLWNvbGxlY3Rpb24tY2Fyb3VzZWxfX3Byb2R1Y3RzJyk7XG5cbiAgICBwYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICAgIGNvbnN0IHBhbmVsSW5kZXggPSBwYW5lbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGFuZWwnKTtcbiAgICAgICAgaWYgKHBhbmVsSW5kZXggPT09IHRhYkluZGV4KSB7XG4gICAgICAgICAgICBwYW5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIGluaXRpYWxpemVTd2lwZXIocGFuZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVTd2lwZXIocGFuZWwpIHtcbiAgICBpZiAocGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzd2lwZXItaW5pdGlhbGl6ZWQnKSkgcmV0dXJuO1xuICAgIGNvbnN0IHBhbmVsU2VsZWN0b3IgPSAnLicgKyBwYW5lbC5jbGFzc0xpc3RbMF07XG4gICAgY29uc3QgbmV3U3dpcGVyID0gbmV3IFN3aXBlcihwYW5lbFNlbGVjdG9yLCB7XG4gICAgICAgIHNsaWRlc1BlclZpZXc6IDEuMixcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAxNixcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcblxuICAgICAgICBicmVha3BvaW50czoge1xuICAgICAgICAgICAgNzY4OiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogNCxcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDMyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAgICAgICBuZXh0RWw6ICcuc3dpcGVyLWNvbGxlY3Rpb24tbmF2aWdhdGlvbi1uZXh0JyxcbiAgICAgICAgICAgIHByZXZFbDogJy5zd2lwZXItY29sbGVjdGlvbi1uYXZpZ2F0aW9uLXByZXYnLFxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHBhbmVsLmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1pbml0aWFsaXplZCcpO1xufVxuXG5pbml0aWFsaXplU3dpcGVyKGFjdGl2ZVBhbmVsKTtcblxuLy8gVGFicyBkcmFnZ2luZyBsb2dpY1xuaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTAyMykge1xuICAgIGNvbnN0IHRhYnNCb3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYi1jb2xsZWN0aW9uLWNhcm91c2VsX190YWJzJyksXG4gICAgICAgIGFsbFRhYnMgPSB0YWJzQm94LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iLWNvbGxlY3Rpb24tY2Fyb3VzZWxfX3RhYicpLFxuICAgICAgICBsZWZ0U2hhZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmItY29sbGVjdGlvbi1jYXJvdXNlbF9fc2hhZG93LS1sZWZ0JyksXG4gICAgICAgIHJpZ2h0U2hhZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmItY29sbGVjdGlvbi1jYXJvdXNlbF9fc2hhZG93LS1yaWdodCcpXG5cbiAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgYWxsVGFicy5mb3JFYWNoKHRhYiA9PiB7XG4gICAgICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRhYnNCb3gucXVlcnlTZWxlY3RvcignLmFjdGl2ZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRyYWdnaW5nID0gKGUpID0+IHtcbiAgICAgICAgaWYgKCFpc0RyYWdnaW5nKSByZXR1cm47XG4gICAgICAgIHRhYnNCb3guY2xhc3NMaXN0LmFkZCgnZHJhZ2dpbmcnKTtcbiAgICAgICAgdGFic0JveC5zY3JvbGxMZWZ0IC09IGUubW92ZW1lbnRYO1xuICAgICAgICBoYW5kbGVJY29ucyh0YWJzQm94LnNjcm9sbExlZnQpXG4gICAgfVxuXG4gICAgY29uc3QgZHJhZ1N0b3AgPSAoKSA9PiB7XG4gICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgdGFic0JveC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsZUljb25zID0gKHNjcm9sbFZhbCkgPT4ge1xuICAgICAgICBsZXQgbWF4U2Nyb2xsYWJsZVdpZHRoID0gdGFic0JveC5zY3JvbGxXaWR0aCAtIHRhYnNCb3guY2xpZW50V2lkdGg7XG4gICAgICAgIGxlZnRTaGFkb3cuc3R5bGUuZGlzcGxheSA9IHNjcm9sbFZhbCA8PSAwID8gJ25vbmUnIDogJ2Jsb2NrJztcbiAgICAgICAgcmlnaHRTaGFkb3cuc3R5bGUuZGlzcGxheSA9IG1heFNjcm9sbGFibGVXaWR0aCAtIHNjcm9sbFZhbCA8PSAxID8gJ25vbmUnIDogJ2Jsb2NrJztcbiAgICB9XG5cbiAgICB0YWJzQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IGlzRHJhZ2dpbmcgPSB0cnVlKTtcbiAgICB0YWJzQm94LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWdnaW5nKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZHJhZ1N0b3ApO1xufVxuY29uc3QgY29sbF9pbmNyZWFzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5jcmVhc2UnKVxuXG5jb2xsX2luY3JlYXNlcy5mb3JFYWNoKGluY3JlYXNlID0+IHtcbiAgICBpbmNyZWFzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IF90aGlzID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgICAgIGNvbnN0IHBhcmVudERpdiA9IF90aGlzLmNsb3Nlc3QoJy5iLWNvbGxlY3Rpb24tY2Fyb3VzZWxfX3Byb2R1Y3QnKVxuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gcGFyZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJy5jb2wtcXVhbnRpdHlfX2Ftb3VudCcpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IHBhcmVudERpdi5xdWVyeVNlbGVjdG9yKCcuanMtY2Fyb3VzZWwtYXRjJykuZ2V0QXR0cmlidXRlKCdkYXRhLXF0eScpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dE51bWJlciA9IHBhcnNlSW50KGN1cnJlbnRJbnB1dClcbiAgICAgICAgaW5wdXRWYWx1ZS50ZXh0Q29udGVudCA9IGN1cnJlbnRJbnB1dE51bWJlciArIDFcbiAgICAgICAgcGFyZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYXJvdXNlbC1hdGMnKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcXR5JywgY3VycmVudElucHV0TnVtYmVyICsgMSlcbiAgICB9KVxufSlcblxuY29uc3QgY29sbF9kZWNyZWFzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGVjcmVhc2UnKVxuXG5jb2xsX2RlY3JlYXNlcy5mb3JFYWNoKGRlY3JlYXNlID0+IHtcbiAgICBkZWNyZWFzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IF90aGlzID0gZS5jdXJyZW50VGFyZ2V0XG4gICAgICAgIGNvbnN0IHBhcmVudERpdiA9IF90aGlzLmNsb3Nlc3QoJy5iLWNvbGxlY3Rpb24tY2Fyb3VzZWxfX3Byb2R1Y3QnKVxuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gcGFyZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJy5jb2wtcXVhbnRpdHlfX2Ftb3VudCcpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IHBhcmVudERpdi5xdWVyeVNlbGVjdG9yKCcuanMtY2Fyb3VzZWwtYXRjJykuZ2V0QXR0cmlidXRlKCdkYXRhLXF0eScpXG4gICAgICAgIGlmIChjdXJyZW50SW5wdXQgPT0gMSkgcmV0dXJuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dE51bWJlciA9IHBhcnNlSW50KGN1cnJlbnRJbnB1dClcbiAgICAgICAgaW5wdXRWYWx1ZS50ZXh0Q29udGVudCA9IGN1cnJlbnRJbnB1dE51bWJlciAtIDFcbiAgICAgICAgcGFyZW50RGl2LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYXJvdXNlbC1hdGMnKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcXR5JywgY3VycmVudElucHV0TnVtYmVyIC0gMSlcbiAgICB9KVxufSlcblxuXG5jb25zdCBhZGRUb0NhcnRzQ2Fyb3VzZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5qcy1jYXJvdXNlbC1hdGNcIik7XG5cbmFkZFRvQ2FydHNDYXJvdXNlbHMuZm9yRWFjaCgoYWRkVG9DYXJ0c0Nhcm91c2VsKSA9PiB7XG4gICAgYWRkVG9DYXJ0c0Nhcm91c2VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgY29uc3QgX3RoaXMgPSBlLmN1cnJlbnRUYXJnZXQ7XG4gICAgICBjb25zdCBwcm9kdWN0U2VsZWN0b3IgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXByb2R1Y3QtaWRcIik7XG4gICAgICBjb25zdCBxdHkgPSBfdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXF0eVwiKTtcbiAgICAgIGNvbnN0IGFkZEl0ZW1zID0gW3tcbiAgICAgICAgaWQ6IHByb2R1Y3RTZWxlY3RvcixcbiAgICAgICAgcXVhbnRpdHk6IHF0eSxcbiAgICAgIH1dO1xuICAgICAgY29uc29sZS5sb2coYWRkSXRlbXMsIFwiYWRkSXRlbXNcIik7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgaXRlbXM6IGFkZEl0ZW1zLFxuICAgICAgfTtcbiAgICAgIGZldGNoKHdpbmRvdy5TaG9waWZ5LnJvdXRlcy5yb290ICsgXCJjYXJ0L2FkZC5qc1wiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLFxuICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzLCBcIm9rXCIpO1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/modules/collection-carousel/collection-carousel.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/collection-carousel.js":
/*!************************************************************!*\
  !*** ./src/scripts/entries/section/collection-carousel.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_collection_carousel_collection_carousel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/collection-carousel/collection-carousel.js */ \"./src/modules/collection-carousel/collection-carousel.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_collection_carousel_collection_carousel_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'CollectionCarousel');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vY29sbGVjdGlvbi1jYXJvdXNlbC5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9zY3JpcHRzL2VudHJpZXMvc2VjdGlvbi9jb2xsZWN0aW9uLWNhcm91c2VsLmpzPzcwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdENvbXBvbmVudCB9IGZyb20gJ2xpYi9jb21wb25lbnRzJ1xuaW1wb3J0IENvbGxlY3Rpb25DYXJvdXNlbCBmcm9tICdtb2R1bGVzL2NvbGxlY3Rpb24tY2Fyb3VzZWwvY29sbGVjdGlvbi1jYXJvdXNlbC5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChDb2xsZWN0aW9uQ2Fyb3VzZWwsICdDb2xsZWN0aW9uQ2Fyb3VzZWwnKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/collection-carousel.js\n");

/***/ }),

/***/ "./src/modules/collection-carousel/collection-carousel.css":
/*!*****************************************************************!*\
  !*** ./src/modules/collection-carousel/collection-carousel.css ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9uLWNhcm91c2VsL2NvbGxlY3Rpb24tY2Fyb3VzZWwuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9jb2xsZWN0aW9uLWNhcm91c2VsL2NvbGxlY3Rpb24tY2Fyb3VzZWwuY3NzP2Y1NDEiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/collection-carousel/collection-carousel.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/collection-carousel.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);