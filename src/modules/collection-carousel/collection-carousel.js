/* eslint-disable */

import './collection-carousel.css'

const tabs = document.querySelectorAll('.b-collection-carousel__tab');
const activePanel = document.querySelector('.b-collection-carousel__products.active');


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
    let panels = document.querySelectorAll('.b-collection-carousel__products');

    panels.forEach(panel => {
        const panelIndex = panel.getAttribute('data-panel');
        if (panelIndex === tabIndex) {
            panel.classList.add('active');
            initializeSwiper(panel);
        } else {
            panel.classList.remove('active');
        }
    });
};

function initializeSwiper(panel) {
    if (panel.classList.contains('swiper-initialized')) return;
    const panelSelector = '.' + panel.classList[0];
    const newSwiper = new Swiper(panelSelector, {
        slidesPerView: 1.2,
        spaceBetween: 16,
        loop: false,
        draggable: true,

        breakpoints: {
            768: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 32,
            },
        },

        navigation: {
            nextEl: '.swiper-collection-navigation-next',
            prevEl: '.swiper-collection-navigation-prev',
        },
    });
    panel.classList.add('swiper-initialized');
}

initializeSwiper(activePanel);

// Tabs dragging logic
if (window.innerWidth > 1023) {
    const tabsBox = document.querySelector('.b-collection-carousel__tabs'),
        allTabs = tabsBox.querySelectorAll('.b-collection-carousel__tab'),
        leftShadow = document.querySelector('.b-collection-carousel__shadow--left'),
        rightShadow = document.querySelector('.b-collection-carousel__shadow--right')

    let isDragging = false;

    allTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabsBox.querySelector('.active').classList.remove('active');
            tab.classList.add('active');
        });
    });

    const dragging = (e) => {
        if (!isDragging) return;
        tabsBox.classList.add('dragging');
        tabsBox.scrollLeft -= e.movementX;
        handleIcons(tabsBox.scrollLeft)
    }

    const dragStop = () => {
        isDragging = false;
        tabsBox.classList.remove('dragging');
    }

    const handleIcons = (scrollVal) => {
        let maxScrollableWidth = tabsBox.scrollWidth - tabsBox.clientWidth;
        leftShadow.style.display = scrollVal <= 0 ? 'none' : 'block';
        rightShadow.style.display = maxScrollableWidth - scrollVal <= 1 ? 'none' : 'block';
    }

    tabsBox.addEventListener('mousedown', () => isDragging = true);
    tabsBox.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
}
const coll_increases = document.querySelectorAll('.increase')

coll_increases.forEach(increase => {
    increase.addEventListener('click', (e) => {
        const _this = e.currentTarget
        const parentDiv = _this.closest('.b-collection-carousel__product')
        const inputValue = parentDiv.querySelector('.col-quantity__amount')
        const currentInput = parentDiv.querySelector('.js-carousel-atc').getAttribute('data-qty')
        const currentInputNumber = parseInt(currentInput)
        inputValue.textContent = currentInputNumber + 1
        parentDiv.querySelector('.js-carousel-atc').setAttribute('data-qty', currentInputNumber + 1)
    })
})

const coll_decreases = document.querySelectorAll('.decrease')

coll_decreases.forEach(decrease => {
    decrease.addEventListener('click', (e) => {
        const _this = e.currentTarget
        const parentDiv = _this.closest('.b-collection-carousel__product')
        const inputValue = parentDiv.querySelector('.col-quantity__amount')
        const currentInput = parentDiv.querySelector('.js-carousel-atc').getAttribute('data-qty')
        if (currentInput == 1) return
        const currentInputNumber = parseInt(currentInput)
        inputValue.textContent = currentInputNumber - 1
        parentDiv.querySelector('.js-carousel-atc').setAttribute('data-qty', currentInputNumber - 1)
    })
})


const addToCartsCarousels = document.querySelectorAll(".js-carousel-atc");

addToCartsCarousels.forEach((addToCartsCarousel) => {
    addToCartsCarousel.addEventListener("click", (e) => {
      const _this = e.currentTarget;
      const productSelector = _this.getAttribute("data-product-id");
      const qty = _this.getAttribute("data-qty");
      const addItems = [{
        id: productSelector,
        quantity: qty,
      }];
      console.log(addItems, "addItems");
      const formData = {
        items: addItems,
      };
      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          console.log(response.status, "ok");
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});

var variantSelectorSFirstCarousel = document.querySelectorAll(".carousel-variant-selector-1");
var variantSelectorSSecondCarousel = document.querySelectorAll(".carousel-variant-selector-2");
variantSelectorSFirstCarousel.forEach((variantSelectorFirst) => {
    variantSelectorFirst.addEventListener("change", function (e) {
      let _this = e;
      console.log(_this, this, "variantSelectorFirst");
      let variantId = this.value;
      let nameFirst = variantId;
      let selectedName
      let nameSecond = "start"
      if(this.closest('.b-collection-carousel__product').querySelector(".carousel-variant-selector-2")) {
        nameSecond = this.closest('.b-collection-carousel__product').querySelector(".carousel-variant-selector-2")
            .options[
                this.closest('.b-collection-carousel__product').querySelector(".carousel-variant-selector-2").selectedIndex
        ].text;
      }
      if(nameSecond !== "start") {
        selectedName = nameFirst + " / " + nameSecond;
      } else {
        selectedName = nameFirst;
      }
      console.log(selectedName, "selectedName");
      let productId = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
      console.log(productId, "productId");
      this.closest('.b-collection-carousel__product')
        .querySelector(".js-carousel-atc")
        .setAttribute("data-product-id", productId);
    //   let productPrice = this.closest('.b-collection-carousel__product')
    //     .querySelector("[data-title='" + selectedName + "']")
    //     .getAttribute("data-price");
    //   let productPriceNoFormat = this.closest('.b-collection-carousel__product')
    //     .querySelector("[data-title='" + selectedName + "']")
    //     .getAttribute("data-price-noformat");
    //   let productComparePrice = this.closest('.b-collection-carousel__product')
    //     .querySelector("[data-title='" + selectedName + "']")
    //     .getAttribute("data-compare-price");
    //   let productComparePriceNoFormat = this.closest('.b-collection-carousel__product')
    //     .querySelector("[data-title='" + selectedName + "']")
    //     .getAttribute("data-price-noformat");
    //     this.closest('.b-collection-carousel__product')
    //     .querySelector(".js-product-selector")
    //     .setAttribute("data-product-price", productPriceNoFormat);
    //     this.closest('.b-collection-carousel__product')
    //     .querySelector(".js-product-selector")
    //     .setAttribute(
    //       "data-product-compare-price",
    //       productComparePriceNoFormat
    //     );
    //   // window.selectLogic.addon = productId
    //   this.closest('.b-collection-carousel__product').querySelector(
    //     ".js-upsel-product-price"
    //   ).innerHTML = productPrice;
    //   this.closest('.b-collection-carousel__product').querySelector(
    //     ".js-price-discount"
    //   ).innerHTML = productComparePrice;

      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
      // addUpsell.setAttribute('data-addon-id', productId);
    });
  });

variantSelectorSSecondCarousel.forEach((variantSelectorSecond) => {
    variantSelectorSecond.addEventListener("change", function (e) {
      let variantId = this.value;
      let nameSecond = variantId;
      let nameFirst = this.closest('.b-collection-carousel__product').querySelector(".carousel-variant-selector-1")
        .options[
            this.closest('.b-collection-carousel__product').querySelector(".carousel-variant-selector-1").selectedIndex
      ].text;
      let selectedName = nameFirst + " / " + nameSecond;
      console.log(selectedName, "selectedName");
      let productId = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
      console.log(productId, "productId");
      this.closest('.b-collection-carousel__product')
        .querySelector(".js-carousel-atc")
        .setAttribute("data-product-id", productId);
      let productPrice = this.closest('.b-collection-carousel__product')
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price");
      console.log(productPrice, "productPrice")
      let productPriceNoFormat = this.closest('.b-collection-carousel__product')
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
      let productComparePrice = this.closest('.b-collection-carousel__product')
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-compare-price");
      let productComparePriceNoFormat = this.closest('.b-collection-carousel__product')
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
    //   this.closest('.b-collection-carousel__product')
    //     .querySelector(".js-product-selector")
    //     .setAttribute("data-product-price", productPriceNoFormat);
    //   this.closest('.b-collection-carousel__product')
    //     .querySelector(".js-product-selector")
    //     .setAttribute(
    //       "data-product-compare-price",
    //       productComparePriceNoFormat
    //     );
      // window.selectLogic.addon = productId
      this.closest('.b-collection-carousel__product').querySelector(
        ".car-js-upsel-product-price"
      ).innerHTML = productPrice;
      this.closest('.b-collection-carousel__product').querySelector(
        ".car-js-price-discount"
      ).innerHTML = productComparePrice;
      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
      // addUpsell.setAttribute('data-addon-id', productId);
    });
  });