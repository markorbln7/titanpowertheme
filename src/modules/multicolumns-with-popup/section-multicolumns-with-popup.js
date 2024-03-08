import './section-multicolumns-with-popup.css'

const multiColumnsWithPopupSection = document.querySelectorAll('.multicolumn-with-popup')

multiColumnsWithPopupSection.forEach((section, index) => {
    // POPUP TOGGLE
    const popupTriggers = section.querySelectorAll('.popup-trigger');
    const closeMulti = document.querySelector('.close')

    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const associatedPopup = document.querySelector('.multi-column-overlay');
            const popupImage = e.target.getAttribute('data-popup-image')
            console.log(e.target.getAttribute('data-popup-image'),'popupImage')
            if (associatedPopup) {
                associatedPopup.classList.toggle('show');
                associatedPopup.querySelector('.popup-image').src = popupImage;
                document.querySelector('body').classList.add('no-scroll');
                document.querySelector('html').classList.add('no-scroll');
            }
        });
    });
    closeMulti.addEventListener('click', (e) => {
        const associatedPopup = document.querySelector('.multi-column-overlay');
        associatedPopup.classList.toggle('show')
        document.querySelector('body').classList.remove('no-scroll');
        document.querySelector('html').classList.remove('no-scroll');
    })

    section.querySelector('.swiper-multicolumns').classList.add('swiper-multicolumns-' + index)

    const multicolumnSwiper = new Swiper('.swiper-multicolumns-' + index, {
        slidesPerView: 1,
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
            clickable: true
        },
    });
})
