import './section-pdp-hero-secondary.css'

var allShopSections = document.querySelectorAll('.section-pdp-hero-secondary');

allShopSections.forEach((section) => {
    const checkboxes = section.querySelectorAll('.js-upsell-checkbox');
    const typesOptions = section.querySelector('.pdp-hero__types').querySelectorAll('.pdp-hero__option');
    const sizesOptions = section.querySelector('.pdp-hero__sizes').querySelectorAll('.pdp-hero__option');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const upsellProducts = section.querySelectorAll('.pdp-hero__upsell-wrapper');

            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });

            upsellProducts.forEach(el => {
                el.classList.remove('active');
            });

            const upsellProduct = checkbox.closest('.pdp-hero__upsell-wrapper');
            upsellProduct.classList.add('active');
        });
    });

    typesOptions.forEach(option => {
        option.addEventListener('click', function () {
            typesOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });

    sizesOptions.forEach(option => {
        option.addEventListener('click', function () {
            sizesOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});
