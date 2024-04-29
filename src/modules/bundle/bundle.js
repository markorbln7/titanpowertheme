import './bundle.css'

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
    const bundleItems = document.querySelectorAll('.section-bundle__cart-carousel-item');

    for (let i = 0; i < cart.items.length; i++) {
        if (!bundleItems[i].querySelector('.bundle-item-added')) {
            const newItem = document.createElement('div');
            newItem.classList.add('bundle-item-added');
            newItem.innerHTML = `
                <figure class="cart-mini-item-image">
                    <img src="${cart.items[i].featured_image.url}" alt="${cart.items[i].title}">
                </figure>
                <h5>${cart.items[i].title}</h5>`;

            bundleItems[i].appendChild(newItem);
            const parent = newItem.closest('.section-bundle__cart-carousel-item');
            parent.classList.add('added');

            console.log(bundleItems[i]);

            console.log(i);
        }
    }

    console.log('Refreshed cart');
}

refreshCart();










