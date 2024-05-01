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
    console.log(cart, 'cart')
    console.log(cart.items, 'cart.items')
    console.log(cart.items.reverse(), 'cart.items.reverse()')
    const bundleItems = document.querySelectorAll('.section-bundle__cart-carousel-item');
    const bundleHolder = document.querySelector('.js-holder');
    bundleHolder.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        if(cart.items[i]) {
        bundleHolder.innerHTML += `
        <div class="swiper-slide p-[10px]">
            <div class="section-bundle__cart-carousel-item flex-col">
                <div data-variant-id="${cart.items[i].variant_id}" class="js-remove">X</div>
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
    }
    console.log(bundleHolder, 'bundleHolder')
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
    setTimeout(() => {
        document.querySelectorAll('.js-remove').forEach((remove) => {
            remove.addEventListener('click', () => {
                console.log('remove start')
                let itemId = remove.getAttribute('data-variant-id');
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
    }, 2000)
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
        let itemId = pluse.getAttribute('data-item-id');
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
        let itemId = minus.getAttribute('data-item-id');
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

refreshCart();










