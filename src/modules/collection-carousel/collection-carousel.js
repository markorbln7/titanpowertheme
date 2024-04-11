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
        slidesPerView: 1.195,
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
