import './section-pdp-hero.css'

var pdpHeroSwiper = document.querySelector('.pdp-hero__gallery-main');
var pdpHeroThumbsSwiper = document.querySelector('.pdp-hero__gallery-thumbs');
var pdpHeroThumbs = pdpHeroThumbsSwiper?.querySelectorAll('.pdp-hero__gallery-thumbs .swiper-slide');

if (pdpHeroThumbs) {
    var swiperThumbs = new Swiper(pdpHeroThumbsSwiper, {
        loop: pdpHeroThumbs.length > 4,
        slidesPerView: pdpHeroThumbs.length < 4 ? pdpHeroThumbs.length : 4,
        spaceBetween: 10,
        loopedSlides: 4,
        watchSlidesProgress: true,
        breakpoints: {
            767: {
                spaceBetween: 10,
            },
        },
    });
}

var swiperPdpHero = new Swiper(pdpHeroSwiper, {
    loop: true,
    slidesPerView: 1,
    loopedSlides: 4,
    thumbs: {
        swiper: swiperThumbs,
    },
});

const descriptionWrapper = document.querySelector('.section-pdp-hero .pdp-hero__product-description');
if (descriptionWrapper) {
    const productDescription = document.querySelector('.section-pdp-hero .pdp-hero__product-description-wrapper');
    const productDescriptionCollapse = document.querySelector('.pdp-hero__description-collapse');

    productDescriptionCollapse.addEventListener('click', () => {
        descriptionWrapper.classList.toggle('collapse-text');

        productDescription.style.maxHeight = productDescription.scrollHeight + 'px';
        !descriptionWrapper.classList.contains('collapse-text')
            ? productDescription.style.maxHeight = null
            : productDescription.style.maxHeight = productDescription.scrollHeight + 'px';
    })
}

const atcButton = document.querySelector('.section-pdp-hero .js-atc');
const checkBox = document.getElementById('pdp-hero__checkbox');

checkBox.addEventListener('click', () => {
    const quantity = checkBox.checked ? 2 : 1;
    atcButton.dataset.quantity = quantity;
});