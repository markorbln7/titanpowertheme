"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkshopify_base_2_0"] = self["webpackChunkshopify_base_2_0"] || []).push([["section-header-new"],{

/***/ "./src/modules/header/section-header.js":
/*!**********************************************!*\
  !*** ./src/modules/header/section-header.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _section_header_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./section-header.css */ \"./src/modules/header/section-header.css\");\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  const navItemsWithChildren = document.querySelectorAll('.section-header__nav-item.has-children');\n  const headerTogglers = document.querySelectorAll('.menu-toggler');\n  const headerNav = document.querySelector('.section-header__nav');\n  const megaMenu = document.querySelector('.mega-menu');\n  const menuItems = headerNav.querySelectorAll('.section-header__nav-item');\n  function calculateMenuHeight(items) {\n    let totalHeight = 0;\n    items.forEach(function (item) {\n      totalHeight += item.offsetHeight;\n    });\n    const padding = 40;\n    return totalHeight * 2 + padding;\n  }\n  if (headerNav) {\n    const navWrapper = document.querySelector('.section-header__wrapper');\n    headerTogglers.forEach(function (toggler) {\n      toggler.addEventListener('click', function () {\n        const isActive = headerNav.classList.contains('menu-active');\n        if (!isActive) {\n          const navHeight = calculateMenuHeight(menuItems);\n          headerNav.style.height = `${navHeight}px`;\n          navWrapper.classList.add('active');\n          headerNav.classList.add('menu-active');\n          headerTogglers.forEach(function (toggle) {\n            toggle.classList.add('active');\n          });\n        } else {\n          headerNav.style.height = '0';\n          navWrapper.classList.remove('active');\n          headerNav.classList.remove('menu-active');\n          megaMenu.classList.remove('active');\n          headerTogglers.forEach(function (toggle) {\n            toggle.classList.remove('active');\n          });\n          const activeChildren = headerNav.querySelector('.inner-children.active');\n          if (activeChildren) activeChildren.classList.remove('active');\n        }\n      });\n    });\n  }\n  if (window.innerWidth > 1023) {\n    navItemsWithChildren.forEach(function (navItem) {\n      const megaMenu = navItem.querySelector('.mega-menu');\n      navItem.addEventListener('mouseenter', function () {\n        if (megaMenu) {\n          megaMenu.classList.add('active');\n          navItem.classList.add('hovered');\n          headerTogglers.forEach(function (toggler) {\n            toggler.classList.add('active');\n          });\n        }\n      });\n      navItem.addEventListener('mouseleave', function () {\n        if (megaMenu) {\n          megaMenu.classList.remove('active');\n          headerTogglers.forEach(function (toggler) {\n            toggler.classList.remove('active');\n          });\n          navItem.classList.remove('hovered');\n        }\n      });\n    });\n  }\n  if (window.innerWidth <= 1023) {\n    navItemsWithChildren.forEach(function (navItem) {\n      const megaMenu = navItem.querySelector('.mega-menu');\n      const megaMenuItems = megaMenu.querySelector('.mobile-items');\n      const backButton = navItem.querySelector('.back-button');\n      const megaMenuLinks = megaMenu.querySelectorAll('.mega-menu__links');\n      navItem.addEventListener('click', function (e) {\n        megaMenu.classList.add('active');\n        megaMenuItems.classList.add('active');\n        const navHeight = calculateMenuHeight(megaMenuLinks);\n        headerNav.style.height = `${navHeight}px`;\n        if (e.target.classList.contains('mega-menu__links-title')) {\n          const childrenLinksParent = e.target.closest('.mega-menu__links').querySelector('.inner-children');\n          const childrenLinks = childrenLinksParent.querySelectorAll('li');\n          const navHeight = calculateMenuHeight(childrenLinks);\n          headerNav.style.height = `${navHeight}px`;\n          childrenLinksParent.classList.add('active');\n          const childrenBackButton = childrenLinksParent.querySelector('.children-back-button');\n          if (childrenBackButton) {\n            childrenBackButton.addEventListener('click', function (event) {\n              event.stopPropagation();\n              const navHeight = calculateMenuHeight(megaMenuLinks);\n              headerNav.style.height = `${navHeight}px`;\n              childrenLinksParent.classList.remove('active');\n            });\n          }\n        }\n      });\n      backButton.addEventListener('click', function (e) {\n        e.stopPropagation();\n        if (megaMenuItems.classList.contains('active')) {\n          const navHeight = calculateMenuHeight(menuItems);\n          headerNav.style.height = `${navHeight}px`;\n          megaMenu.classList.remove('active');\n          megaMenuItems.classList.remove('active');\n        }\n      });\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9oZWFkZXIvc2VjdGlvbi1oZWFkZXIuanMiLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaG9waWZ5LWJhc2UtMi4wLy4vc3JjL21vZHVsZXMvaGVhZGVyL3NlY3Rpb24taGVhZGVyLmpzPzQ3ZjYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3NlY3Rpb24taGVhZGVyLmNzcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBuYXZJdGVtc1dpdGhDaGlsZHJlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWN0aW9uLWhlYWRlcl9fbmF2LWl0ZW0uaGFzLWNoaWxkcmVuJyk7XG4gICAgY29uc3QgaGVhZGVyVG9nZ2xlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubWVudS10b2dnbGVyJyk7XG4gICAgY29uc3QgaGVhZGVyTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24taGVhZGVyX19uYXYnKTtcbiAgICBjb25zdCBtZWdhTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZWdhLW1lbnUnKTtcbiAgICBjb25zdCBtZW51SXRlbXMgPSBoZWFkZXJOYXYucXVlcnlTZWxlY3RvckFsbCgnLnNlY3Rpb24taGVhZGVyX19uYXYtaXRlbScpO1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlTWVudUhlaWdodChpdGVtcykge1xuICAgICAgICBsZXQgdG90YWxIZWlnaHQgPSAwO1xuXG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHRvdGFsSGVpZ2h0ICs9IGl0ZW0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBwYWRkaW5nID0gNDA7XG4gICAgICAgIHJldHVybiAodG90YWxIZWlnaHQgKiAyKSArIHBhZGRpbmc7XG4gICAgfVxuXG4gICAgaWYgKGhlYWRlck5hdikge1xuICAgICAgICBjb25zdCBuYXZXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlY3Rpb24taGVhZGVyX193cmFwcGVyJyk7XG4gICAgICAgIGhlYWRlclRvZ2dsZXJzLmZvckVhY2goZnVuY3Rpb24gKHRvZ2dsZXIpIHtcbiAgICAgICAgICAgIHRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBoZWFkZXJOYXYuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZW51LWFjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXZIZWlnaHQgPSBjYWxjdWxhdGVNZW51SGVpZ2h0KG1lbnVJdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlck5hdi5zdHlsZS5oZWlnaHQgPSBgJHtuYXZIZWlnaHR9cHhgO1xuXG4gICAgICAgICAgICAgICAgICAgIG5hdldyYXBwZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QuYWRkKCdtZW51LWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJUb2dnbGVycy5mb3JFYWNoKGZ1bmN0aW9uICh0b2dnbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyTmF2LnN0eWxlLmhlaWdodCA9ICcwJztcbiAgICAgICAgICAgICAgICAgICAgbmF2V3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ21lbnUtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIG1lZ2FNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlclRvZ2dsZXJzLmZvckVhY2goZnVuY3Rpb24gKHRvZ2dsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVDaGlsZHJlbiA9IGhlYWRlck5hdi5xdWVyeVNlbGVjdG9yKCcuaW5uZXItY2hpbGRyZW4uYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDaGlsZHJlbikgYWN0aXZlQ2hpbGRyZW4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gMTAyMykge1xuICAgICAgICBuYXZJdGVtc1dpdGhDaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChuYXZJdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBtZWdhTWVudSA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLm1lZ2EtbWVudScpO1xuXG4gICAgICAgICAgICBuYXZJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1lZ2FNZW51KSB7XG4gICAgICAgICAgICAgICAgICAgIG1lZ2FNZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBuYXZJdGVtLmNsYXNzTGlzdC5hZGQoJ2hvdmVyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyVG9nZ2xlcnMuZm9yRWFjaChmdW5jdGlvbiAodG9nZ2xlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChtZWdhTWVudSkge1xuICAgICAgICAgICAgICAgICAgICBtZWdhTWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyVG9nZ2xlcnMuZm9yRWFjaChmdW5jdGlvbiAodG9nZ2xlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgbmF2SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcmVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSAxMDIzKSB7XG4gICAgICAgIG5hdkl0ZW1zV2l0aENoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKG5hdkl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IG1lZ2FNZW51ID0gbmF2SXRlbS5xdWVyeVNlbGVjdG9yKCcubWVnYS1tZW51Jyk7XG4gICAgICAgICAgICBjb25zdCBtZWdhTWVudUl0ZW1zID0gbWVnYU1lbnUucXVlcnlTZWxlY3RvcignLm1vYmlsZS1pdGVtcycpO1xuICAgICAgICAgICAgY29uc3QgYmFja0J1dHRvbiA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLmJhY2stYnV0dG9uJyk7XG4gICAgICAgICAgICBjb25zdCBtZWdhTWVudUxpbmtzID0gbWVnYU1lbnUucXVlcnlTZWxlY3RvckFsbCgnLm1lZ2EtbWVudV9fbGlua3MnKTtcblxuICAgICAgICAgICAgbmF2SXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbWVnYU1lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbWVnYU1lbnVJdGVtcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZIZWlnaHQgPSBjYWxjdWxhdGVNZW51SGVpZ2h0KG1lZ2FNZW51TGlua3MpO1xuICAgICAgICAgICAgICAgIGhlYWRlck5hdi5zdHlsZS5oZWlnaHQgPSBgJHtuYXZIZWlnaHR9cHhgO1xuXG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbWVnYS1tZW51X19saW5rcy10aXRsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuTGlua3NQYXJlbnQgPSBlLnRhcmdldC5jbG9zZXN0KCcubWVnYS1tZW51X19saW5rcycpLnF1ZXJ5U2VsZWN0b3IoJy5pbm5lci1jaGlsZHJlbicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbkxpbmtzID0gY2hpbGRyZW5MaW5rc1BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYXZIZWlnaHQgPSBjYWxjdWxhdGVNZW51SGVpZ2h0KGNoaWxkcmVuTGlua3MpO1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJOYXYuc3R5bGUuaGVpZ2h0ID0gYCR7bmF2SGVpZ2h0fXB4YDtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5MaW5rc1BhcmVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZHJlbkJhY2tCdXR0b24gPSBjaGlsZHJlbkxpbmtzUGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaGlsZHJlbi1iYWNrLWJ1dHRvbicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbkJhY2tCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuQmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdkhlaWdodCA9IGNhbGN1bGF0ZU1lbnVIZWlnaHQobWVnYU1lbnVMaW5rcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyTmF2LnN0eWxlLmhlaWdodCA9IGAke25hdkhlaWdodH1weGA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbkxpbmtzUGFyZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAobWVnYU1lbnVJdGVtcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdkhlaWdodCA9IGNhbGN1bGF0ZU1lbnVIZWlnaHQobWVudUl0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyTmF2LnN0eWxlLmhlaWdodCA9IGAke25hdkhlaWdodH1weGA7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVnYU1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIG1lZ2FNZW51SXRlbXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSk7XG5cblxuXG5cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/header/section-header.js\n");

/***/ }),

/***/ "./src/scripts/entries/section/header-new.js":
/*!***************************************************!*\
  !*** ./src/scripts/entries/section/header-new.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lib_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/components */ \"./src/scripts/lib/components.js\");\n/* harmony import */ var modules_header_section_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! modules/header/section-header.js */ \"./src/modules/header/section-header.js\");\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,lib_components__WEBPACK_IMPORTED_MODULE_0__.initComponent)(modules_header_section_header_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"], 'Header');\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc2NyaXB0cy9lbnRyaWVzL3NlY3Rpb24vaGVhZGVyLW5ldy5qcyIsIm1hcHBpbmdzIjoiOzs7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2hvcGlmeS1iYXNlLTIuMC8uL3NyYy9zY3JpcHRzL2VudHJpZXMvc2VjdGlvbi9oZWFkZXItbmV3LmpzPzhmYjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdENvbXBvbmVudCB9IGZyb20gJ2xpYi9jb21wb25lbnRzJ1xuaW1wb3J0IEhlYWRlciBmcm9tICdtb2R1bGVzL2hlYWRlci9zZWN0aW9uLWhlYWRlci5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaW5pdENvbXBvbmVudChIZWFkZXIsICdIZWFkZXInKVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/scripts/entries/section/header-new.js\n");

/***/ }),

/***/ "./src/modules/header/section-header.css":
/*!***********************************************!*\
  !*** ./src/modules/header/section-header.css ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbW9kdWxlcy9oZWFkZXIvc2VjdGlvbi1oZWFkZXIuY3NzIiwibWFwcGluZ3MiOiI7QUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob3BpZnktYmFzZS0yLjAvLi9zcmMvbW9kdWxlcy9oZWFkZXIvc2VjdGlvbi1oZWFkZXIuY3NzP2YxN2YiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/modules/header/section-header.css\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["commons"], function() { return __webpack_exec__("./src/scripts/entries/section/header-new.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);