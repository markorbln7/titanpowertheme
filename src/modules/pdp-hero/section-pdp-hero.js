import './section-pdp-hero.css'

const atcButton = document.querySelector('.section-pdp-hero .js-atc');
const checkBox = document.getElementById('pdp-hero__checkbox');

checkBox.addEventListener('click', () => {
  const quantity = checkBox.checked ? 2 : 1;
  atcButton.dataset.quantity = quantity;
});

atcButton.addEventListener('click', () => {
  const quantity = checkBox.checked ? 2 : 1;
  let addItems = [];
  atcButton.dataset.quantity = quantity;
  addItems = [
    {
      id: atcButton.getAttribute('data-product'),
      quantity: quantity
    }
  ]
  const formData = {
    items: addItems
  }
  fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      console.log(response.status, 'ok')
      if (response.status === 200) {
        console.log(addToCart, 'ok')
      }
      return response.json()
    })
    .catch((error) => {
      console.error('Error:', error)
    })
});

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

    descriptionWrapper.classList.contains('collapse-text')
      ? productDescriptionCollapse.textContent = 'Show Less'
      : productDescriptionCollapse.textContent = 'Learn More';
  })
}

const props = document.querySelectorAll('.section-pdp-hero .pdp-hero__prop');
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
