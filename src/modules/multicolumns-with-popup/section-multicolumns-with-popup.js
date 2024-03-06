import './section-multicolumns-with-popup.css'

const multiColumnsWithPopupSection = document.querySelectorAll('.multicolumn-with-popup')

multiColumnsWithPopupSection.forEach((section, index) => {
    // POPUP TOGGLE
    const popupTriggers = section.querySelectorAll('.popup-trigger');

    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const slideIndex = trigger.closest('.swiper-slide').getAttribute('data-swiper-slide-index');
            const associatedPopup = section.querySelector(`.swiper-slide[data-swiper-slide-index="${slideIndex}"] .popup__overlay`);
            if (associatedPopup) {
                associatedPopup.classList.toggle('show');
            }
        });
    });
    
    section.querySelector('.swiper-multicolumns').classList.add('swiper-multicolumns-' + index)

    const multicolumnSwiper = new Swiper('.swiper-multicolumns-' + index, {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 8,
        watchOverflow: true,

        breakpoints: {
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
        },

        pagination: {
            el: ".swiper-pagination-multicolumns",
        },
    });
})
