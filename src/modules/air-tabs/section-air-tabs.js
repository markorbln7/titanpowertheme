/* eslint-disable indent */
import './section-air-tabs.css'

const tabs = document.querySelectorAll('.air-tabs__nav-item');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        setActive(tab);
    })
});

const showPanels = (tab) => {
    tab.addEventListener('click', () => {
        let tabIndex = tab.getAttribute('data-tab');
        let panels = document.querySelectorAll('.air-tabs__tab-content');

        panels.forEach(panel => {
            const panelIndex = panel.getAttribute('data-panel');
            if(panelIndex === tabIndex) {
                setActive(panel);
            } 
        })
    })
}

const setActive = function (el) {
    [...el.parentElement.children].forEach(function (sib) {
        sib.classList.remove('active');
    });
    el.classList.add('active');
};

tabs.forEach(tab => {
    showPanels(tab);
});
