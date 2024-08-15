/* eslint-disable */
import './bundle.css'

const tabs = document.querySelectorAll('.section-bundle__collection-tab');
// const cartSample = {
//     "items":[]
// }
let cartSample = {
    "items":[]
}

const generateCart = () => {
    let activeProduct = document.querySelectorAll('.active-item')
    cartSample = {
        "items":[]
    }
    let totalQty = 0;
    activeProduct.forEach((product) => {
        let image = product.getAttribute('data-image')
        let id = product.getAttribute('data-item-id')
        let quantity = product.getAttribute('data-item-qty')
        let price = product.getAttribute('data-item-price')
        let comparePrice = product.getAttribute('data-item-compare-price')
        cartSample.items.push({
            "type":"product",
            "id":id,
            "quantity":quantity,
            "variant_id":42160297509042,
            "comparePrice":comparePrice,
            "price":price,
            "image":image
        })
    })
    let firstGift = parseInt(document.querySelector('.first-gift').getAttribute('data-gift-ammount'))
    let firstGiftImage = document.querySelector('.first-gift img').src
    let secondGift = parseInt(document.querySelector('.second-gift').getAttribute('data-gift-ammount'))
    let secondGiftImage = document.querySelector('.second-gift img').src
    cartSample.items.forEach(item => {
        totalQty += parseInt(item.price * item.quantity);
    });
    if(totalQty >= firstGift) {
        cartSample.items.push({
            "type":"gift",
            "quantity":1,
            "variant_id":42160297509042,
            "comparePrice":0,
            "price":0,
            "image":firstGiftImage
        })
    }
    if(totalQty >= secondGift) {
        cartSample.items.push({
            "type":"gift",
            "quantity":1,
            "variant_id":42160297509042,
            "comparePrice":0,
            "price":0,
            "image":secondGiftImage
        })
    }
    console.log(firstGift,secondGift,totalQty, 'totalQty')
    return cartSample;
}

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

//TOGGLE BUNDLE
const bundleCarousel = document.querySelector('.bundle-wrap');
const bundleToggler = document.querySelector('.js-bundle-toggle');

bundleToggler.addEventListener('click', () => {
    bundleCarousel.classList.toggle('hide-bundle');
    if (bundleCarousel.classList.contains('hide-bundle')) {
        bundleToggler.textContent = 'SHOW BUNDLE';
    } else {
        bundleToggler.textContent = 'HIDE BUNDLE';
    }
});

//ADD TO CART LOGIC
const bundleAtcButtons = document.querySelectorAll('.js-atc');

if (bundleAtcButtons) {
    bundleAtcButtons.forEach(atcButton => {
        atcButton.addEventListener('click', (e) => {
            let overlayBundle = document.querySelector('.bundle-overlay');
            overlayBundle.classList.add('show');
            let idSelectors = document.querySelectorAll('.js-id-selector');
            e.preventDefault();
            let addItems = []
            idSelectors.forEach((idSelector) => {
                let id = idSelector.getAttribute('data-item-id');
                let quantity = idSelector.getAttribute('data-item-qty');
                if(quantity > 0) {
                    addItems.push({
                        id: id,
                        quantity: quantity
                    })
                }
            })
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
                    if (response.status === 200) {
                        console.log(response.status, 'ok')
                        overlayBundle.classList.remove('show');
                    }
                    return response.json()
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
        })
    })
}

async function refreshCart() {
    const cart = cartSample;
    const bundleItems = document.querySelectorAll('.section-bundle__cart-carousel-item');
    const bundleHolder = document.querySelector('.js-holder');
    bundleHolder.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        if(cart.items[i]) {
        bundleHolder.innerHTML += `
        <div class="swiper-slide p-[18px]">
            <div class="section-bundle__cart-carousel-item flex-col">

                <div class="qty-holder">${cart.items[i].quantity > 1 ? cart.items[i].quantity : ''}</div>
                <img class="" src="${cart.items[i].image}">
            </div>
        </div>
        `} else {
            bundleHolder.innerHTML += `
            <div class="swiper-slide">
                <div class="section-bundle__cart-carousel-item">
                    <div class="col-quantity__button increase  p dm-sans-normal color-white text-center">+</div>
                </div>
            </div>
            `
        }
        // if(cart.items[i] && document.querySelector('.class-' + cart.items[i].product_id)) {
        //     let selector = document.querySelector('.class-' + cart.items[i].product_id)
        //     selector.querySelector('.js-qty-number').innerHTML = cart.items[i].quantity;
        //     selector.querySelector('.plus').setAttribute('data-quantity', cart.items[i].quantity + 1);
        //     selector.querySelector('.minus').setAttribute('data-quantity', cart.items[i].quantity -1 );
        // }
    }

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
    let allQty = document.querySelectorAll('.js-qty-number');
    let qty = 0;
    cart.items.forEach(item => {
        if(item.type !== 'gift') {
            qty += parseInt(item.quantity);
        }
    });
    let points = document.querySelectorAll('.point');
    let allLines = document.querySelectorAll('.line');
    let allNumber = 0;
    for (let y = 0; y < allQty.length; y++) {
        allNumber += parseFloat(allQty[y].innerHTML);
    }
    points.forEach((point, index) => {
        if(point) {
            point.style.backgroundColor = '#adadad'
        }
    })
    allLines.forEach((allLine, index) => {
        if(allLine) {
            allLine.style.backgroundColor = '#adadad'
        }
    })
    for (let z = 0; z < qty; z++) {
        if(points[z]) {
            points[z].style.backgroundColor = '#60c655';
        }
    }
    let limiter = qty * 2 - 1;
    for (let k = 0; k < limiter; k++) {
        if(allLines[k]) {
            allLines[k].style.backgroundColor = '#60c655';
        }
    }

    setTimeout(() => {
        document.querySelectorAll('.js-remove').forEach((remove) => {
            remove.addEventListener('click', () => {
                let itemId = remove.getAttribute('data-variant-id');
                let productId = remove.getAttribute('data-product-id');
                fetch(window.Shopify.routes.root + 'cart/change.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: itemId,
                        quantity: 0
                    })
                })
                    .then(response => {
                        console.log(response.status)
                        if (response.status === 200) {
                            console.log(response.status, 'okkkk')
                            let selector = document.querySelector('.class-' + productId)
                            selector.querySelector('.js-qty-number').innerHTML = 0;
                            selector.querySelector('.plus').setAttribute('data-quantity', 1);
                            selector.querySelector('.minus').setAttribute('data-quantity', 0 );
                            refreshCart();
                        }
                        return response.json()
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                    })
            })
        })
    }, 2000)
    let totalPrice = 0;
    let comparePrice = 0;
    let totalQty = 0;

    cart.items.forEach(item => {
        if(item.type !== 'gift') {
            console.log(item.type, 'gift')
            totalQty += parseInt(item.quantity);
            totalPrice += item.price * item.quantity;
            comparePrice += item.comparePrice * item.quantity;
        }
    });

    console.log(totalQty, 'duzina')
    if(totalQty >= 5) {
        totalPrice = totalPrice * 0.9;
    }
    if(totalQty >= 7) {
        totalPrice = totalPrice * 0.7;
    }
    if(totalQty > 10) {
        totalPrice = totalPrice * 0.6;
    }
    async function getCart() {
        const result = await fetch("/cart.json");
        if (result.status === 200) {
            return result.json();
        }
        throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
    }
    let cartSymbol = await getCart();
    let currencySymbol = cartSymbol.currency;
    if(currencySymbol == 'USD') {
        currencySymbol = '$'
    }
    if(currencySymbol == 'EUR') {
        currencySymbol = '€'
    }
    if(currencySymbol == 'GBP') {
        currencySymbol = '£'
    }
    const formattedPrice = currencySymbol + (totalPrice/100).toFixed(2)
    const formattedPriceCompare = currencySymbol + (comparePrice/100).toFixed(2)
    const totalPriceElement = document.querySelector('.section-bundle__sticky-price');
    const totalPriceElementCompare = document.querySelector('.section-bundle__sticky-price-compare');
    totalPriceElement.textContent = formattedPrice;
    if(comparePrice > 0) {
        totalPriceElementCompare.textContent = formattedPriceCompare;
    }
    else {
        totalPriceElementCompare.textContent = '';
    }

    console.log('Refreshed cart');
}
const pluses = document.querySelectorAll('.plus')
const minuses = document.querySelectorAll('.minus')

pluses.forEach((pluse) => {
    pluse.addEventListener('click', () => {
        let parentElement = pluse.parentNode;
        parentElement.classList.add('active-item')
        let past = parentElement.querySelector('.minus')
        let now = parentElement
        let future = parentElement.querySelector('.plus')
        let nowNumber = now.getAttribute('data-item-qty')
        let futureNumber = future.getAttribute('data-quantity')
        let pastNumber = past.getAttribute('data-quantity')
        nowNumber = parseInt(nowNumber) + 1
        futureNumber = parseInt(futureNumber) + 1
        pastNumber = parseInt(pastNumber) + 1
        now.setAttribute('data-item-qty', nowNumber)
        now.querySelector('.js-qty-number').innerHTML = nowNumber
        past.setAttribute('data-quantity', pastNumber)
        future.setAttribute('data-quantity', futureNumber)
        let image = parentElement.getAttribute('data-image')
        let id = parentElement.getAttribute('data-item-id')
        generateCart();
        refreshCart();
    })
})

minuses.forEach((minus) => {
    minus.addEventListener('click', () => {
        let parentElement = minus.parentNode;
        let past = parentElement.querySelector('.minus')
        let now = parentElement
        let future = parentElement.querySelector('.plus')
        let nowNumber = now.getAttribute('data-item-qty')
        let futureNumber = future.getAttribute('data-quantity')
        let pastNumber = past.getAttribute('data-quantity')
        if(nowNumber > 0) {
            nowNumber = parseInt(nowNumber) - 1
        }
        if(futureNumber > 0) {
            futureNumber = parseInt(futureNumber) - 1
        }
        if(futureNumber > 0) {
            pastNumber
        }
        if(nowNumber < 1) {
            parentElement.classList.remove('active-item')
        }
        now.setAttribute('data-item-qty', nowNumber)
        now.querySelector('.js-qty-number').innerHTML = nowNumber
        past.setAttribute('data-quantity', pastNumber)
        future.setAttribute('data-quantity', futureNumber)
        generateCart();
        refreshCart();
        // updateCart(itemId, quantity);
        // minus.setAttribute('data-quantity', newValue)
        // setTimeout(() => {
        //     refreshCart();
        // }, 1000)
    })
})

let infoTrigers = document.querySelectorAll('.info-icon-trigger');
let closeBtn = document.querySelector('.close');
infoTrigers.forEach((infoTriger) => {
    infoTriger.addEventListener('click', (e) => {
        let infoImage = e.target.getAttribute('data-image');
        document.querySelector('.info-image').src = infoImage;
        document.querySelector('.product-overlay').classList.add('show');
        document.querySelector('body').classList.add('no-scroll')
        document.querySelector('html').classList.add('no-scroll')
    })
})
closeBtn.addEventListener('click', (e) => {
    document.querySelector('.product-overlay').classList.remove('show');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
})

let infoPlayTrigers = document.querySelectorAll('.js-video-trig');
let closePlayBtn = document.querySelector('.close-play');
infoPlayTrigers.forEach((infoTriger) => {
    infoTriger.addEventListener('click', (e) => {
        let infoVideo = e.target.getAttribute('data-video');
        document.querySelector('.info-video').src = infoVideo;
        document.querySelector('.product-play-overlay').classList.add('show');
        document.querySelector('body').classList.add('no-scroll')
        document.querySelector('html').classList.add('no-scroll')
        setTimeout(() => {
            document.querySelector('.info-video').play();
        }, 300)
    })
})
closePlayBtn.addEventListener('click', (e) => {
    document.querySelector('.product-play-overlay').classList.remove('show');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
    document.querySelector('.info-video').pause();
})

let overlayCls = document.querySelector('.product-play-overlay');
overlayCls.addEventListener('click', (e) => {
    if(e.target.classList.contains('product-play-overlay')) {
        document.querySelector('.product-play-overlay').classList.remove('show');
        document.querySelector('body').classList.remove('no-scroll')
        document.querySelector('html').classList.remove('no-scroll')
        document.querySelector('.info-video').pause();
    }
})

let overlayClsImage = document.querySelector('.product-overlay');
overlayClsImage.addEventListener('click', (e) => {
    document.querySelector('.product-overlay').classList.remove('show');
    document.querySelector('body').classList.remove('no-scroll')
    document.querySelector('html').classList.remove('no-scroll')
})

refreshCart();

const distanceTracker = $('.bundle-wrap').offset().top
$(window).scroll(function () {
    const top_of_element = $('#shopify-section-footer').offset().top
    const bottom_of_element = $('#shopify-section-footer').offset().top + $('#shopify-section-footer').outerHeight()
    const bottom_of_screen = $(window).scrollTop() + $(window).innerHeight()
    const top_of_screen = $(window).scrollTop()
    if (!(bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element) && $(this).scrollTop() >= distanceTracker) {
      $('.section-bundle__tracker').addClass('tracker-fixed')
    } else {
      $('.section-bundle__tracker').removeClass('tracker-fixed')
    }
})

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product').forEach(productElement => {
      const productId = productElement.getAttribute('data-product-id');
      const selectors = productElement.querySelectorAll('.variant-selectors select');
      const addToCartButton = productElement.querySelector('.js-id-selector');
      const price = productElement.querySelector('.js-regular-price');
      const comparePrice = productElement.querySelector('.js-compare-price');
      const idSelector = productElement.querySelector('.js-id-selector');

      function getVariantId(selectedOptions) {
        const productVariants = window.productVariants[productId];
        const variant = productVariants.find(variant =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
        return variant ? variant.id : '';
      }
      function getVariantPrice(selectedOptions) {
        const productVariants = window.productVariants[productId];
        const variant = productVariants.find(variant =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
        return variant ? variant.priceMoney : '';
      }
      function getVariantPriceRaw(selectedOptions) {
        const productVariants = window.productVariants[productId];
        const variant = productVariants.find(variant =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
        return variant ? variant.priceRaw : '';
      }
      function getVariantComparePrice(selectedOptions) {
        const productVariants = window.productVariants[productId];
        const variant = productVariants.find(variant =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
        return variant ? variant.comparepriceMoney : '';
      }
      function getVariantComparePriceRaw(selectedOptions) {
        const productVariants = window.productVariants[productId];
        const variant = productVariants.find(variant =>
          variant.options.every((option, index) => option === selectedOptions[index])
        );
        return variant ? variant.comparepriceRaw : '';
      }

      function updateAddToCartButton() {
        let selectedOptions = [];
        selectors.forEach(selector => {
          selectedOptions.push(selector.value);
        });

        const variantId = getVariantId(selectedOptions);
        const variantPrice = getVariantPrice(selectedOptions);
        const variantComparePrice = getVariantComparePrice(selectedOptions);
        const variantPriceRaw = getVariantPriceRaw(selectedOptions);
        const variantComparePriceRaw = getVariantComparePriceRaw(selectedOptions);

        if(variantPrice) {
            price.textContent = variantPrice;
        }

        if(variantComparePrice) {
            comparePrice.textContent = variantComparePrice;
        }

        if(variantId) {
            addToCartButton.setAttribute('data-item-id', variantId);
        }
        if(variantPriceRaw) {
            idSelector.setAttribute('data-item-price', variantPriceRaw);
        }
        if(variantComparePriceRaw) {
            idSelector.setAttribute('data-item-compare-price', variantComparePriceRaw);
        }
      }

      selectors.forEach(selector => {
        selector.addEventListener('change', updateAddToCartButton);
      });

      updateAddToCartButton();
    });
  });
