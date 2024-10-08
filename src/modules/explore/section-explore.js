import './section-explore.css'

document.addEventListener('DOMContentLoaded', function () {
    const productCards = document.querySelectorAll('.section-explore__product');
    const productContents = document.querySelectorAll('.section-explore__product-content > div');
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
});



