import './section-explore.css'

document.addEventListener('DOMContentLoaded', function () {
    //Product cards hover logic
    const productCards = document.querySelectorAll('.section-explore__product');
    const desktopLabel = document.querySelector('.section-explore__collection-label-desktop');
    const travelLabel = document.querySelector('.section-explore__collection-label-travel');

    let activeProduct = null;
    let activeCard = null;

    const initialProduct = document.querySelector('.section-explore__product-content [data-product="for-desktop-1"]');
    if (initialProduct) {
        initialProduct.style.opacity = '1';
        initialProduct.style.transition = 'opacity 0.5s ease';
        desktopLabel.classList.add('active');
        const initialLines = initialProduct.querySelectorAll('.animate-line');
        initialLines.forEach(line => line.classList.add('active-line'));
        activeProduct = initialProduct;

        const firstCard = document.querySelector('.section-explore__product[data-product-hover="for-desktop-1"]');
        if (firstCard) {
            firstCard.classList.add('active');
            activeCard = firstCard;
        }
    }

    productCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            const productIndex = card.getAttribute('data-product-hover');

            if (productIndex.startsWith('for-desktop')) {
                desktopLabel.classList.add('active');
                travelLabel.classList.remove('active');
            } else if (productIndex.startsWith('for-travel')) {
                travelLabel.classList.add('active');
                desktopLabel.classList.remove('active');
            }

            if (activeProduct) {
                activeProduct.style.opacity = '0';
                const activeLines = activeProduct.querySelectorAll('.animate-line');
                activeLines.forEach(line => line.classList.remove('active-line'));
            }

            const targetContent = document.querySelector(`.section-explore__product-content [data-product="${productIndex}"]`);

            if (targetContent) {
                targetContent.style.opacity = '1';
                targetContent.style.transition = 'opacity 0.5s ease';
                const targetLines = targetContent.querySelectorAll('.animate-line');
                targetLines.forEach(line => line.classList.add('active-line'));
                activeProduct = targetContent;
            }

            if (activeCard) {
                activeCard.classList.remove('active');
            }

            card.classList.add('active');
            activeCard = card;
        });
    });

    // Poppup toggle logic
    const buyNowButtons = document.querySelectorAll('.section-explore__buy-now');
    const popups = document.querySelectorAll('.buy-now-popup');

    function openPopup(popup) {
        popup.style.display = 'block';
        popup.classList.add('active');
    }

    function closePopup(popup) {
        popup.style.display = 'none';
        popup.classList.remove('active');
    }

    buyNowButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const popup = popups[index]; 
            if (popup) {
                openPopup(popup);

                // Expand description logic
                const learnMoreButton = popup.querySelector('.buy-now-popup__expand-desc');
                const descriptionEl = popup.querySelector('.buy-now-popup__description');
                const descriptionInner = popup.querySelector('.buy-now-popup__description-inner');

                if (learnMoreButton) {
                    learnMoreButton.addEventListener('click', () => {
                        const expanded = descriptionEl.classList.contains('expanded');

                        if (expanded) {
                            descriptionEl.classList.remove('expanded');
                            descriptionInner.style.height = '100px';
                            learnMoreButton.querySelector('span').textContent = 'Learn More';
                            descriptionInner.classList.add('with-gradient');
                        } else {
                            descriptionEl.classList.add('expanded');
                            descriptionInner.style.height = `${descriptionInner.scrollHeight}px`;
                            learnMoreButton.querySelector('span').textContent = 'Show Less';
                            descriptionInner.classList.remove('with-gradient');
                        }
                    });

                }

                // Upsell checkbox toggle logic
                const upsellBoxes = popup.querySelectorAll('.buy-now-popup__upsell-box');
                upsellBoxes.forEach((box) => {
                    const checkbox = box.querySelector('input[type="checkbox"]');

                    box.addEventListener('click', () => {
                        checkbox.checked = !checkbox.checked;
                        if (checkbox.checked) {
                            box.classList.add('active');
                        } else {
                            box.classList.remove('active');
                        }
                    });
                });
            }
        });
    });

    // Add click event listener to close icons
    popups.forEach((popup) => {
        const closeButtons = popup.querySelectorAll('.close-buy-now-popup');
        closeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                closePopup(popup); 
            });
        })
    });
});
