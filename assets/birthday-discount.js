const allShopSections = document.querySelectorAll(".section-pdp-hero-tertiary");

if (!!allShopSections.length) {
  allShopSections.forEach((section) => {
    const checkboxes = section.querySelectorAll(".js-upsell-checkbox");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const upsellProducts = section.querySelectorAll(
          ".pdp-hero__upsell-wrapper"
        );
        const upsellMessages = section.querySelectorAll(
          ".pdp-hero__upsell-message"
        );

        // upsellProducts.forEach(el => {
        //     el.classList.remove('active')
        // })

        // upsellMessages.forEach(el => {
        //     el.classList.remove('active')
        // })

        const upsellProduct = checkbox.closest(".pdp-hero__upsell-wrapper");
        // const upsellMessage = checkbox.closest('.pdp-hero__upsell-wrapper').previousElementSibling

        upsellProduct.classList.toggle("active");
        // upsellMessage.classList.add('active')

        updateTotalPrice();
      });
    });

    //Price handle
    function updateTotalPrice() {
      let currency = document
        .querySelector(".section-pdp-hero-tertiary")
        .getAttribute("data-currency");
      let productSelectors = document.querySelectorAll(
        ".js-product-selector.active"
      );
      let totalMainProductPrice = 0;
      let totalMainComparePrice = 0;
      let mainProductPrice = document.querySelector(".js-main-product-price");
      let mainComparePrice = document.querySelector(
        ".js-price-compare-main-product"
      );
      let percent = document.querySelector(".pdp-hero__discount");
      productSelectors.forEach((productSelector) => {
        const productPrice = parseFloat(
          productSelector.getAttribute("data-product-price")
        );
        const productComparePrice = parseFloat(
          productSelector.getAttribute("data-product-compare-price")
        );
        totalMainProductPrice += productPrice;
        totalMainComparePrice += productComparePrice;
      });
      console.log(totalMainProductPrice);
      percent = (1 - totalMainProductPrice / totalMainComparePrice) * 100;
      totalMainProductPrice /= 100;
      totalMainComparePrice /= 100;
      console.log(percent, "percent");
      // mainProductPrice.innerHTML = currency + totalMainProductPrice/100
      mainProductPrice.textContent = totalMainProductPrice.toLocaleString(
        "en-US",
        { style: "currency", currency: currency }
      );
      mainComparePrice.textContent = totalMainComparePrice.toLocaleString(
        "en-US",
        { style: "currency", currency: currency }
      );
      if(document.querySelector('.pdp-hero__product-info').classList.contains('percent-info')){
        let activeNumber = document.querySelectorAll('.js-product-selector.active').length
        if(activeNumber <= 4){
        let selectProducts = document.querySelectorAll('.js-product-selector')
            selectProducts.forEach((productSelector) => {
                    const productPrice = parseFloat(
                        productSelector.getAttribute("data-product-price")
                    );
                    let totalProductPrice = (productPrice * 0.5) / 100;
                    productSelector.querySelector('.js-upsel-product-price').textContent = totalProductPrice.toLocaleString(
                        "en-US",
                        { style: "currency", currency: currency }
                        );

            });
          document.querySelector('.pdp-hero__discount').textContent = `55% OFF`
          totalMainProductPrice = totalMainProductPrice * 0.45
          mainProductPrice.textContent = totalMainProductPrice.toLocaleString(
            "en-US",
            { style: "currency", currency: currency }
          );
        }
        if(activeNumber > 4 && activeNumber <= 6){
        let selectProducts = document.querySelectorAll('.js-product-selector')
        selectProducts.forEach((productSelector) => {
          selectProducts.forEach((productSelector) => {
            const productPrice = parseFloat(
                productSelector.getAttribute("data-product-price")
            );
            let totalProductPrice = (productPrice * 0.4) / 100;
            productSelector.querySelector('.js-upsel-product-price').textContent = totalProductPrice.toLocaleString(
                "en-US",
                { style: "currency", currency: currency }
                );

          });
        });
          document.querySelector('.pdp-hero__discount').textContent = `60% OFF`
          totalMainProductPrice = totalMainProductPrice * 0.4
          mainProductPrice.textContent = totalMainProductPrice.toLocaleString(
            "en-US",
            { style: "currency", currency: currency }
          );
        }
        if(activeNumber == 7){
            let selectProducts = document.querySelectorAll('.js-product-selector')
            selectProducts.forEach((productSelector) => {
              selectProducts.forEach((productSelector) => {
                const productPrice = parseFloat(
                    productSelector.getAttribute("data-product-price")
                );
                let totalProductPrice = (productPrice * 0.35) / 100;
                productSelector.querySelector('.js-upsel-product-price').textContent = totalProductPrice.toLocaleString(
                    "en-US",
                    { style: "currency", currency: currency }
                    );

        });
            });
          document.querySelector('.pdp-hero__discount').textContent = `70% OFF`
          totalMainProductPrice = totalMainProductPrice * 0.3
          mainProductPrice.textContent = totalMainProductPrice.toLocaleString(
            "en-US",
            { style: "currency", currency: currency }
          );
        }
        console.log(activeNumber, 'activeNumber')
      }
    }
    document.addEventListener("DOMContentLoaded", function () {
      console.log("DOMContentLoaded");
      updateTotalPrice();
    });
    // updateTotalPrice()

    // //Icons slider
    const sliderIcons = section.querySelector(".pdp-hero__icons");

    if (sliderIcons) {
      const arrowPrev = section.querySelector(".pdp-hero__arrow-prev");
      const arrowNext = section.querySelector(".pdp-hero__arrow-next");

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

      const iconsElements = section.querySelectorAll(
        ".pdp-hero__icon-container"
      );

      if (iconsElements.length <= 4 && window.innerWidth > 1023) {
        sliderIcons.classList.add("pdp-hero__icons--no-swiper");
      }
    }

    const props = section.querySelectorAll(".pdp-hero__prop");
    if (props.length > 0) {
      props.forEach((prop) => {
        const propDescription = prop.querySelector(
          ".pdp-hero__prop-description"
        );
        const propHeader = prop.querySelector(".pdp-hero__prop-header");

        if (propDescription && propHeader) {
          propHeader.addEventListener("click", () => {
            const propParent = propHeader.closest(".pdp-hero__prop");
            propParent.classList.toggle("show");

            propDescription.style.maxHeight =
              propDescription.scrollHeight + "px";
            !propParent.classList.contains("show")
              ? (propDescription.style.maxHeight = null)
              : (propDescription.style.maxHeight =
                  propDescription.scrollHeight + "px");
          });
        }
      });
    }
  });
  const addToCarts = document.querySelectorAll(".js-add-to-cart-pd");

  addToCarts.forEach((addToCart) => {
    addToCart.addEventListener("click", (e) => {
      const productSelectors = document.querySelectorAll(
        ".js-product-selector.active"
      );
      console.log(productSelectors, "productSelectors");
      const addItems = [];
      productSelectors.forEach((productSelector) => {
        const _this = productSelector;
        const productId = _this.getAttribute("data-product-id");
        addItems.push({
          id: productId,
          quantity: 1,
        });
      });
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

  var variantSelectorSFirst = document.querySelectorAll(".variant-selector-1");
  var variantSelectorSSecond = document.querySelectorAll(".variant-selector-2");

  variantSelectorSFirst.forEach((variantSelectorFirst) => {
    variantSelectorFirst.addEventListener("change", function (e) {
      let _this = e;
      console.log(_this, this, "variantSelectorFirst");
      let variantId = this.value;
      let nameFirst = variantId;
    //   let nameSecond = this.parentNode.querySelector(".variant-selector-2")
    //     .options[
    //     this.parentNode.querySelector(".variant-selector-2").selectedIndex
    //   ].text;
      let selectedName = nameFirst;
      console.log(selectedName, "selectedName");
      let productId = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
      console.log(productId, "productId");
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute("data-product-id", productId);
      let productPrice = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price");
      let productPriceNoFormat = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
      let productComparePrice = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-compare-price");
      let productComparePriceNoFormat = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute("data-product-price", productPriceNoFormat);
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute(
          "data-product-compare-price",
          productComparePriceNoFormat
        );
      // window.selectLogic.addon = productId
      // this.parentNode.parentNode.parentNode.querySelector(
      //   ".js-upsel-product-price"
      // ).innerHTML = productPrice;
      // this.parentNode.parentNode.parentNode.querySelector(
      //   ".js-price-discount"
      // ).innerHTML = productComparePrice;


      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
      // addUpsell.setAttribute('data-addon-id', productId);
    });
  });
  variantSelectorSSecond.forEach((variantSelectorSecond) => {
    variantSelectorSecond.addEventListener("change", function (e) {
      let _this = e;
      let variantId = this.value;
      let nameSecond = variantId;
      let nameFirst = this.parentNode.querySelector(".variant-selector-1")
        .options[
        this.parentNode.querySelector(".variant-selector-1").selectedIndex
      ].text;
      let selectedName = nameFirst + " / " + nameSecond;
      let productId = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-variant");
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute("data-product-id", productId);
      let productPrice = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price");
      let productPriceNoFormat = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
      let productComparePrice = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-compare-price");
      let productComparePriceNoFormat = this.parentNode.parentNode.parentNode
        .querySelector("[data-title='" + selectedName + "']")
        .getAttribute("data-price-noformat");
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute("data-product-price", productPriceNoFormat);
      this.parentNode.parentNode.parentNode
        .querySelector(".js-product-selector")
        .setAttribute(
          "data-product-compare-price",
          productComparePriceNoFormat
        );
      // window.selectLogic.addon = productId
      this.parentNode.parentNode.parentNode.querySelector(
        ".js-upsel-product-price"
      ).innerHTML = productPrice;
      this.parentNode.parentNode.parentNode.querySelector(
        ".js-price-discount"
      ).innerHTML = productComparePrice;
      setTimeout(() => {
        let currency = document
          .querySelector(".section-pdp-hero-tertiary")
          .getAttribute("data-currency");
        let productSelectors = document.querySelectorAll(
          ".js-product-selector.active"
        );
        let totalMainProductPrice = 0;
        let totalMainComparePrice = 0;
        let mainProductPrice = document.querySelector(".js-main-product-price");
        let mainComparePrice = document.querySelector(
          ".js-price-compare-main-product"
        );
        productSelectors.forEach((productSelector) => {
          const productPrice = parseFloat(
            productSelector.getAttribute("data-product-price")
          );
          const productComparePrice = parseFloat(
            productSelector.getAttribute("data-product-compare-price")
          );
          totalMainProductPrice += productPrice;
          totalMainComparePrice += productComparePrice;
        });
        console.log(totalMainProductPrice);
        totalMainProductPrice /= 100;
        totalMainComparePrice /= 100;
        // mainProductPrice.innerHTML = currency + totalMainProductPrice/100
        mainProductPrice.textContent = totalMainProductPrice.toLocaleString(
          "en-US",
          { style: "currency", currency: currency }
        );
        mainComparePrice.textContent = totalMainComparePrice.toLocaleString(
          "en-US",
          { style: "currency", currency: currency }
        );
        console.log(totalMainProductPrice, "mainProductPricemainProductPrice");
      }, "1000");
      // addUpsell.querySelector('.crossed').innerHTML = productComparePrice;
      // addUpsell.setAttribute('data-addon-id', productId);
    });
  });
}
