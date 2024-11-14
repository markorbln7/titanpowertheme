/* eslint-disable */
import './section-pdp-hero-master.css'

const allShopSections = document.querySelectorAll('.section-pdp-hero-secondary')

if (allShopSections.length) {
  allShopSections.forEach((section) => {
    const checkboxes = section.querySelectorAll('.js-upsell-checkbox')
    const typesOptions = section.querySelector('.pdp-hero__types').querySelectorAll('.pdp-hero__option')
    const sizesOptions = section.querySelector('.pdp-hero__sizes').querySelectorAll('.pdp-hero__option')

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const upsellProducts = section.querySelectorAll('.pdp-hero__upsell-wrapper')
        const upsellMessages = section.querySelectorAll('.pdp-hero__upsell-message')

        checkboxes.forEach(cb => {
          if (cb !== checkbox) {
            cb.checked = false
          }
        })

        upsellProducts.forEach(el => {
          el.classList.remove('active')
        })
        if(upsellMessages) {
          upsellMessages.forEach(el => {
            el.classList.remove('active')
          })
        }

        const upsellProduct = checkbox.closest('.pdp-hero__upsell-wrapper')
        const upsellMessage = checkbox.parentNode
        const giftUnlockerNumber = upsellMessage.getAttribute('data-gift')
        const giftSelectorsActive = document.querySelectorAll(`.gift_card[data-gift]`)
        const giftTitlesActive = document.querySelectorAll(`.gift_title[data-gift]`)

        giftSelectorsActive.forEach(gift => {
          gift.classList.remove('is-active')
          gift.querySelector('.gift-overlay').classList.remove('is-active')
          gift.querySelector('.top-note').classList.remove('is-active')
          if(gift.querySelector('.conf')) {
            gift.querySelector('.conf').classList.remove('is-active')
          }
          let giftNumber = gift.getAttribute('data-gift')
          if (giftNumber <= giftUnlockerNumber) {
            gift.classList.add('is-active')
            gift.querySelector('.gift-overlay').classList.add('is-active')
            gift.querySelector('.top-note').classList.add('is-active')
            if(gift.querySelector('.conf')) {
              gift.querySelector('.conf').classList.add('is-active')
            }
          }
        })
        giftTitlesActive.forEach(gift => {
          gift.classList.remove('is-active')
          let giftNumber = gift.getAttribute('data-gift')
          if (giftNumber <= giftUnlockerNumber) {
            gift.classList.add('is-active')
          }
        })


        // if(upsellProduct) upsellProduct.classList.add('active')
        if(upsellMessage) upsellMessage.classList.add('active')
      })
    })

    typesOptions.forEach(option => {
      option.addEventListener('click', function () {
        typesOptions.forEach(opt => {
          opt.classList.remove('active')
        })
        option.classList.add('active')
      })
    })

    sizesOptions.forEach(option => {
      option.addEventListener('click', function () {
        sizesOptions.forEach(opt => {
          opt.classList.remove('active')
        })
        option.classList.add('active')
      })
    })

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