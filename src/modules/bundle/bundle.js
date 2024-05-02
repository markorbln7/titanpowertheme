import './bundle.css'

// $(document).ready(function() {
//     console.log('ready')
//       $.ajax({
//         type: "POST",
//         url: '/cart/clear.js',
//         success: function(){
//           console.log('I cleared the cart!');
//         },
//         dataType: 'json'
//     });
// });

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

//TOGGLE BUNDLE
const bundleCarousel = document.querySelector('.bundle-wrap');
const bundleToggler = document.querySelector('.js-bundle-toggle');

bundleToggler.addEventListener('click', () => {
    bundleCarousel.classList.toggle('hide-bundle');
})

//ADD TO CART LOGIC
const bundleAtcButtons = document.querySelectorAll('.js-bundle-atc');

if (!!bundleAtcButtons.length) {
    bundleAtcButtons.forEach(atcButton => {
        atcButton.addEventListener('click', () => {
            let addItems = []
            // atcButton.dataset.quantity = quantity
            addItems = [
                {
                    id: atcButton.getAttribute('data-product'),
                    quantity: 1
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
                    console.log(response.status)
                    if (response.status === 200) {
                        console.log(response.status, 'ok')
                        refreshCart();
                    }
                    return response.json()
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
        })
    })
}

async function getCart() {
    const result = await fetch("/cart.json");
    if (result.status === 200) {
        return result.json();
    }
    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
}

async function refreshCart() {
    const cart = await getCart();
    // console.log(cart, 'cart')
    // console.log(cart.items, 'cart.items')
    // console.log(cart.items.reverse(), 'cart.items.reverse()')
    const bundleItems = document.querySelectorAll('.section-bundle__cart-carousel-item');
    const bundleHolder = document.querySelector('.js-holder');
    bundleHolder.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        if(cart.items[i]) {
            let free = ''
            if(cart.items[i].properties._attribution && cart.items[i].properties._attribution == "Rebuy Tiered Progress Bar") {
                free = "Free!"
            }
        bundleHolder.innerHTML += `
        <div class="swiper-slide p-[18px]">
            <div class="section-bundle__cart-carousel-item flex-col">
                <div data-product-id="${cart.items[i].product_id}" data-variant-id="${cart.items[i].variant_id}" class="js-remove">X</div>
                <div class="qty-holder">${cart.items[i].quantity > 1 ? cart.items[i].quantity : ''}</div>
                <img class="" src="${cart.items[i].image}">
                <div class="free-item">${free}</div>
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
        if(cart.items[i] && document.querySelector('.class-' + cart.items[i].product_id)) {
            let selector = document.querySelector('.class-' + cart.items[i].product_id)
            selector.querySelector('.js-qty-number').innerHTML = cart.items[i].quantity;
            selector.querySelector('.plus').setAttribute('data-quantity', cart.items[i].quantity + 1);
            selector.querySelector('.minus').setAttribute('data-quantity', cart.items[i].quantity -1 );
        }
    }
    console.log(bundleHolder, 'bundleHolder')
    console.log(cart, cart.original_total_price / 100, 'cart orginal total price')
    let itemCount = 0;
    let giftCount = 0;
    for (let d = 0; d < cart.items.length; d++) {
        if(cart.items[d].properties._source != "Rebuy") {
            itemCount += cart.items[d].quantity
            giftCount += (cart.items[d].final_price * cart.items[d].quantity)
        }
    }
    let currency = cart.currency;
    if(currency == 'USD') {
        currency = '$'
    }
    if(currency == 'EUR') {
        currency = '€'
    }

    let firstGift = document.querySelector('.gift-tracker-holder').getAttribute('data-first');
    let secondGift = document.querySelector('.gift-tracker-holder').getAttribute('data-second');

    console.log(firstGift, secondGift, giftCount , 'saberise')

    let circle = document.querySelector('.circle-chart__circle')


    if(giftCount < firstGift) {
        let currency = cart.currency;
        if(currency == 'USD') {
            currency = '$'
        }
        if(currency == 'EUR') {
            currency = '€'
        }
        circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/firstGift)*540);
        document.querySelector('.left-to-gift').innerHTML ='<img  class="max-w-[40%] mx-auto" src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/New_free_gift_titan_kit_symbol_cable_wheel.png?v=1714648077">' + ((firstGift - giftCount)/100) + currency + '<br> MORE!';
    }
    if(giftCount > firstGift) {
        let currency = cart.currency;
        if(currency == 'USD') {
            currency = '$'
        }
        if(currency == 'EUR') {
            currency = '€'
        }
        circle.setAttribute('stroke-dashoffset', 1000 - (giftCount/secondGift)*540);
        document.querySelector('.left-to-gift').innerHTML ='<img class="max-w-[40%] mx-auto" src="https://cdn.shopify.com/s/files/1/0071/1727/5191/files/New_free_gift_titan_kit_symbol_dock.png?v=1714648076">' +((secondGift - giftCount)/100) + currency +  '<br> MORE!';    }

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
    let points = document.querySelectorAll('.point');
    let allLines = document.querySelectorAll('.line');
    let allNumber = 0;
    for (let y = 0; y < allQty.length; y++) {
        allNumber += parseFloat(allQty[y].innerHTML);
    }
    points.forEach((point, index) => {
        point.style.backgroundColor = '#adadad'
    })
    allLines.forEach((allLine, index) => {
        allLine.style.backgroundColor = '#adadad'
    })
    for (let z = 0; z < allNumber; z++) {
        if(points[z]) {
            points[z].style.backgroundColor = '#60c655';
        }
    }
    let limiter = allNumber * 2 - 1;
    for (let k = 0; k < limiter; k++) {
        allLines[k].style.backgroundColor = '#60c655';
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

    cart.items.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    console.log(cart.items);

    const formattedPrice = currency + (giftCount/100).toFixed(2);

    const totalPriceElement = document.querySelector('.section-bundle__sticky-price');
    totalPriceElement.textContent = formattedPrice;

    const checkoutButton = document.querySelector('.section-bundle__sticky-checkout a');
    if (totalPrice === 0) {
        checkoutButton.setAttribute('disabled', true);
    } else {
        checkoutButton.removeAttribute('disabled');
    }
    console.log('Refreshed cart');
}

let updateCart = (itemId, q) => {
    let updateObject = {};
    let nameKey = itemId
    updateObject[nameKey] = q;
    console.log(updateObject, 'updateObject')
    jQuery.post('/cart/update.js', {updates:{...updateObject}});
}
const pluses = document.querySelectorAll('.plus')
const minuses = document.querySelectorAll('.minus')

pluses.forEach((pluse) => {
    pluse.addEventListener('click', () => {
        let itemId = pluse.parentNode.getAttribute('data-item-id');
        console.log(itemId, 'itemId')
        let quantity = pluse.getAttribute('data-quantity');
        let number = pluse.parentNode.querySelector('.js-qty-number')
        const newValue = parseInt(quantity) + 1
        number.innerHTML = quantity
        updateCart(itemId, quantity);
        pluse.setAttribute('data-quantity', newValue)
        setTimeout(() => {
            refreshCart();
        }, 1000)
    })
})

minuses.forEach((minus) => {
    minus.addEventListener('click', () => {
        let itemId = minus.parentNode.getAttribute('data-item-id');
        let quantity = minus.getAttribute('data-quantity');
        let number = minus.parentNode.querySelector('.js-qty-number')
        const newValue = parseInt(quantity) - 1
        number.innerHTML = quantity
        updateCart(itemId, quantity);
        minus.setAttribute('data-quantity', newValue)
        setTimeout(() => {
            refreshCart();
        }, 1000)
    })
})

let infoTrigers = document.querySelectorAll('.info-icon-trigger');
let closeBtn = document.querySelector('.close');
infoTrigers.forEach((infoTriger) => {
    infoTriger.addEventListener('click', (e) => {
        console.log(e.target, 'this')
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

refreshCart();

const formatCurrency = document.querySelector('.js-format-currency').value;

const priceFormatterHandler = (price) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: formatCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(price / 100);
};


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



