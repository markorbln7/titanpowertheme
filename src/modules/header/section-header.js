/* eslint-disable */
import './section-header.css'

document.addEventListener('DOMContentLoaded', function () {
    const navItemsWithChildren = document.querySelectorAll('.section-header__nav-item.has-children');
    const headerTogglers = document.querySelectorAll('.menu-toggler');
    const headerNav = document.querySelector('.section-header__nav');
    const megaMenu = document.querySelector('.mega-menu');
    const menuItems = headerNav.querySelectorAll('.section-header__nav-item');

    function calculateMenuHeight(items) {
        let totalHeight = 0;

        items.forEach(function (item) {
            totalHeight += item.offsetHeight;
        });

        const padding = 40;
        return (totalHeight * 2) + padding;
    }

    if (headerNav) {
        const navWrapper = document.querySelector('.section-header__wrapper');
        window.onscroll = function () {
            if (window.scrollY > 0) {
                navWrapper.classList.add('scrolled');
            } else {
                navWrapper.classList.remove('scrolled');
            }
        };
        headerTogglers.forEach(function (toggler) {
            toggler.addEventListener('click', function () {
                const isActive = headerNav.classList.contains('menu-active');

                if (!isActive) {
                    console.log('active')
                    const navHeight = calculateMenuHeight(menuItems);
                    console.log(navHeight, 'navHeight');
                    headerNav.style.height = 'auto';

                    navWrapper.classList.add('active');
                    headerNav.classList.add('menu-active');
                    headerTogglers.forEach(function (toggle) {
                        toggle.classList.add('active');
                    });
                } else {
                    console.log('passive')
                    headerNav.style.height = '0';
                    navWrapper.classList.remove('active');
                    headerNav.classList.remove('menu-active');
                    megaMenu.classList.remove('active');

                    headerTogglers.forEach(function (toggle) {
                        toggle.classList.remove('active');
                    });

                    const activeChildren = headerNav.querySelector('.inner-children.active');
                    activeChildren.parentNode.classList.remove('active-children');
                    if (activeChildren) activeChildren.classList.remove('active');
                }
            });
        });
    }


    if (window.innerWidth > 1023) {
        navItemsWithChildren.forEach(function (navItem) {
            const megaMenu = navItem.querySelector('.mega-menu');

            navItem.addEventListener('mouseenter', function () {
                if (megaMenu) {
                    megaMenu.classList.add('active');
                    navItem.classList.add('hovered');
                    headerTogglers.forEach(function (toggler) {
                        toggler.classList.add('active');
                    })
                }
            });

            navItem.addEventListener('mouseleave', function () {
                if (megaMenu) {
                    megaMenu.classList.remove('active');
                    headerTogglers.forEach(function (toggler) {
                        toggler.classList.remove('active');
                    })
                    navItem.classList.remove('hovered');
                }
            });
        });
    }

    if (window.innerWidth <= 1023) {
        navItemsWithChildren.forEach(function (navItem) {
            const megaMenu = navItem.querySelector('.mega-menu');
            const megaMenuItems = megaMenu.querySelector('.mobile-items');
            const backButton = navItem.querySelector('.back-button');
            const megaMenuLinks = megaMenu.querySelectorAll('.mega-menu__links');

            navItem.addEventListener('click', function (e) {
                console.log(megaMenuLinks, 'megaMenuLinks');
                megaMenu.classList.add('active');
                megaMenuItems.classList.add('active');

                const navHeight = calculateMenuHeight(megaMenuLinks);
                headerNav.style.height = 'auto';

                if (e.target.classList.contains('mega-menu__links-title')) {
                    const childrenLinksParent = e.target.closest('.mega-menu__links').querySelector('.inner-children');
                    const childrenLinks = childrenLinksParent.querySelectorAll('li');
                    const navHeight = calculateMenuHeight(childrenLinks);
                    headerNav.style.height = 'auto';
                    childrenLinksParent.classList.add('active');
                    childrenLinksParent.parentNode.classList.add('active-children');

                    const childrenBackButton = childrenLinksParent.querySelector('.children-back-button');

                    if (childrenBackButton) {
                        childrenBackButton.addEventListener('click', function (event) {
                            event.stopPropagation();
                            const navHeight = calculateMenuHeight(megaMenuLinks);
                            headerNav.style.height = 'auto';

                            childrenLinksParent.classList.remove('active');
                            childrenLinksParent.parentNode.classList.remove('active-children');
                        });
                    }
                }
            });

            backButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (megaMenuItems.classList.contains('active')) {
                    const navHeight = calculateMenuHeight(menuItems);
                    headerNav.style.height = `${navHeight}px`;

                    megaMenu.classList.remove('active');
                    megaMenuItems.classList.remove('active');
                }
            });
        });
    }

});





