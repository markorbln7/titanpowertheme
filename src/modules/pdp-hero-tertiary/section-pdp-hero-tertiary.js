import './section-pdp-hero-tertiary.css'

const allShopSections = document.querySelectorAll('.section-pdp-hero-tertiary')

if (!!allShopSections.length) {
    allShopSections.forEach((section) => {
        const checkboxes = section.querySelectorAll('.js-upsell-checkbox')

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const upsellProducts = section.querySelectorAll('.pdp-hero__upsell-wrapper')
                const upsellMessages = section.querySelectorAll('.pdp-hero__upsell-message')

                upsellProducts.forEach(el => {
                    el.classList.remove('active')
                })

                upsellMessages.forEach(el => {
                    el.classList.remove('active')
                })

                const upsellProduct = checkbox.closest('.pdp-hero__upsell-wrapper')
                const upsellMessage = checkbox.closest('.pdp-hero__upsell-wrapper').previousElementSibling

                upsellProduct.classList.add('active')
                upsellMessage.classList.add('active')

                // updateTotalPrice()
            })
        })

        //Price handle
        function updateTotalPrice() {
            var mainProductPrice = parseFloat(section.querySelector('.js-main-product-price').getAttribute('data-price'))
            var totalPrice = mainProductPrice

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    var price = parseFloat(checkbox.closest('.pdp-hero__upsell-wrapper').querySelector('.js-upsel-product-price').getAttribute('data-price'))
                    totalPrice += price
                }
            });

            // Prikazi ukupnu cenu
            var totalElement = section.querySelector('.pdp-hero__pricing-price')
            if (totalElement) {
                totalElement.textContent = totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) 
            }
        }

        // updateTotalPrice()

        // //Icons slider
        const sliderIcons = section.querySelector('.pdp-hero__icons')

        if (sliderIcons) {
            const arrowPrev = section.querySelector('.pdp-hero__arrow-prev')
            const arrowNext = section.querySelector('.pdp-hero__arrow-next')

            const pdpHeroIconsSlider = new Swiper(sliderIcons, {
                slidesPerView: 2,
                spaceBetween: 10,
                loop: true,
                watchOverflow: true,
                navigation: {
                    nextEl: arrowNext,
                    prevEl: arrowPrev
                },

                breakpoints: {
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 15
                    }
                }
            })

            const iconsElements = section.querySelectorAll('.pdp-hero__icon-container')

            if (iconsElements.length <= 4 && window.innerWidth > 1023) {
                sliderIcons.classList.add('pdp-hero__icons--no-swiper')
            }
        }

        const props = section.querySelectorAll('.pdp-hero__prop')
        if (props.length > 0) {
            props.forEach(prop => {
                const propDescription = prop.querySelector('.pdp-hero__prop-description')
                const propHeader = prop.querySelector('.pdp-hero__prop-header')

                if (propDescription && propHeader) {
                    propHeader.addEventListener('click', () => {
                        const propParent = propHeader.closest('.pdp-hero__prop')
                        propParent.classList.toggle('show')

                        propDescription.style.maxHeight = propDescription.scrollHeight + 'px'
                        !propParent.classList.contains('show')
                            ? propDescription.style.maxHeight = null
                            : propDescription.style.maxHeight = propDescription.scrollHeight + 'px'
                    })
                }
            })
        }
    })
}