import './section-pdp-hero-secondary.css'

var allShopSections = document.querySelectorAll('.section-pdp-hero-secondary');

if (!!allShopSections.length) {
    allShopSections.forEach((section) => {
        const checkboxes = section.querySelectorAll('.js-upsell-checkbox');
        const typesOptions = section.querySelector('.pdp-hero__types').querySelectorAll('.pdp-hero__option');
        const sizesOptions = section.querySelector('.pdp-hero__sizes').querySelectorAll('.pdp-hero__option');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const upsellProducts = section.querySelectorAll('.pdp-hero__upsell-wrapper');
                const upsellMessages = section.querySelectorAll('.pdp-hero__upsell-message');

                checkboxes.forEach(cb => {
                    if (cb !== checkbox) {
                        cb.checked = false;
                    }
                });

                upsellProducts.forEach(el => {
                    el.classList.remove('active');
                });

                upsellMessages.forEach(el => {
                    el.classList.remove('active');
                });

                const upsellProduct = checkbox.closest('.pdp-hero__upsell-wrapper');
                const upsellMessage = checkbox.closest('.pdp-hero__upsell-wrapper').previousElementSibling;


                upsellProduct.classList.add('active');
                upsellMessage.classList.add('active');
            });
        });

        typesOptions.forEach(option => {
            option.addEventListener('click', function () {
                typesOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });

        sizesOptions.forEach(option => {
            option.addEventListener('click', function () {
                sizesOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
            });
        });


        // //Icons slider 
        const sliderIcons = section.querySelector('.pdp-hero__icons');

        if (sliderIcons) {
            const arrowPrev = section.querySelector('.pdp-hero__arrow-prev');
            const arrowNext = section.querySelector('.pdp-hero__arrow-next');

            const pdpHeroIconsSlider = new Swiper(sliderIcons, {
                slidesPerView: 2,
                spaceBetween: 10,
                loop: true,
                watchOverflow: true,
                navigation: {
                    nextEl: arrowNext,
                    prevEl: arrowPrev,
                },

                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    },
                },
            });

            const iconsElements = section.querySelectorAll('.pdp-hero__icon-container');

            if (iconsElements.length <= 4 && window.innerWidth > 1023) {
                sliderIcons.classList.add('pdp-hero__icons--no-swiper');
            }
        }

        const props = section.querySelectorAll('.pdp-hero__prop');
        if (props.length > 0) {
            props.forEach(prop => {
                const propDescription = prop.querySelector('.pdp-hero__prop-description');
                const propHeader = prop.querySelector('.pdp-hero__prop-header');

                if (propDescription && propHeader) {
                    propHeader.addEventListener('click', () => {
                        const propParent = propHeader.closest('.pdp-hero__prop');
                        propParent.classList.toggle('show');

                        propDescription.style.maxHeight = propDescription.scrollHeight + 'px';
                        !propParent.classList.contains('show')
                            ? propDescription.style.maxHeight = null
                            : propDescription.style.maxHeight = propDescription.scrollHeight + 'px';
                    });
                }
            });
        }
    });
}

