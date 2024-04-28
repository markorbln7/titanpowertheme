import './bundle.css'

const tabs = document.querySelectorAll('.section-bundle__collection-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActive(tab);
        showPanel(tab);
    });
});

const setActive = function (el) {
    [...el.parentElement.children].forEach(function (sib) {
        sib.classList.remove('active');
    });
    el.classList.add('active');
};

const showPanel = (tab) => {
    let tabIndex = tab.getAttribute('data-tab');
    let panels = document.querySelectorAll('.section-bundle__products-holder');

    panels.forEach(panel => {
        const panelIndex = panel.getAttribute('data-panel');
        if (panelIndex === tabIndex) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
};

//SWIPER FOR BUNDLE CART CAROUSEL

var swiper = new Swiper('.section-bundle__cart-carousel', {
    spaceBetween: 8,
    slidesPerView: 4,
    slidesPerGroup: 4,
    breakpoints: {
      768: {
        slidesPerView: 6,
        slidesPerGroup: 6,
        draggable: false,
      },
    },
    navigation: {
      nextEl: '.section-bundle__cart-carousel .swiper-button-next',
      prevEl: '.section-bundle__cart-carousel .swiper-button-prev'
    },
    scrollbar: {
      el: '.section-bundle__cart-carousel .swiper-scrollbar',
      draggable: true,
    }
 });