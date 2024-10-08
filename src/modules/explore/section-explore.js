import './section-explore.css'

document.addEventListener('DOMContentLoaded', function () {
    const productCards = document.querySelectorAll('.section-explore__product');
    const productContents = document.querySelectorAll('.section-explore__product-content > div');
    const desktopLabel = document.querySelector('.section-explore__collection-label-desktop');
    const travelLabel = document.querySelector('.section-explore__collection-label-travel');

    let activeProduct = null; // Čuva trenutno aktivni proizvod
    let activeCard = null; // Čuva trenutno aktivnu karticu

    // Inicijalno postavi prvi desktop proizvod i desktop labelu kao aktivne
    const initialProduct = document.querySelector('.section-explore__product-content [data-product="for-desktop-1"]');
    if (initialProduct) {
        initialProduct.style.opacity = '1';
        initialProduct.style.transition = 'opacity 0.5s ease';
        desktopLabel.classList.add('active'); // Postavi desktop labelu kao aktivnu
        const initialLines = initialProduct.querySelectorAll('.animate-line'); // Animiraj linije prvog proizvoda
        initialLines.forEach(line => line.classList.add('active-line'));
        activeProduct = initialProduct; // Postavi kao aktivan proizvod

        // Prva kartica postaje aktivna
        const firstCard = document.querySelector('.section-explore__product[data-product-hover="for-desktop-1"]');
        if (firstCard) {
            firstCard.classList.add('active');
            activeCard = firstCard; // Postavi kao aktivnu karticu
        }
    }

    productCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
            // Dohvati vrednosti iz `data-product-hover` atributa
            const productIndex = card.getAttribute('data-product-hover');

            // Proveri da li je desktop ili travel proizvod
            if (productIndex.startsWith('for-desktop')) {
                desktopLabel.classList.add('active');
                travelLabel.classList.remove('active');
            } else if (productIndex.startsWith('for-travel')) {
                travelLabel.classList.add('active');
                desktopLabel.classList.remove('active');
            }

            // Sakrij trenutni aktivni proizvod ako postoji
            if (activeProduct) {
                activeProduct.style.opacity = '0';
                const activeLines = activeProduct.querySelectorAll('.animate-line');
                activeLines.forEach(line => line.classList.remove('active-line')); // Ukloni animaciju linije sa prethodnog proizvoda
            }

            // Pronađi i prikaži novi ciljani proizvod na osnovu indeksa
            const targetContent = document.querySelector(`.section-explore__product-content [data-product="${productIndex}"]`);

            if (targetContent) {
                targetContent.style.opacity = '1';
                targetContent.style.transition = 'opacity 0.5s ease';
                const targetLines = targetContent.querySelectorAll('.animate-line');
                targetLines.forEach(line => line.classList.add('active-line')); // Pokreni animaciju linija za novi proizvod
                activeProduct = targetContent; // Postavi novi aktivan proizvod
            }

            // Ukloni klasu active sa prethodne kartice
            if (activeCard) {
                activeCard.classList.remove('active');
            }

            // Dodaj klasu active novoj hoverovanoj kartici
            card.classList.add('active');
            activeCard = card; // Postavi novu aktivnu karticu
        });
    });
});



