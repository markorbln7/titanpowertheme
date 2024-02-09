

import './section-image-tabs.css'

document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.image-tabs__button');
    var imagesWrapper = document.querySelectorAll('.image-tabs__images');
    console.log(imagesWrapper);

    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            let doc = this.parentNode.parentNode.parentNode;
            console.log(doc, 'test');
            var panels = doc.querySelectorAll('.image-tabs__panel');
            var images = doc.querySelectorAll('.image-tabs__images figure');
            var tabs = doc.querySelectorAll('.image-tabs__button');
            panels.forEach(function (panel) {
                panel.classList.remove('active');
            });
            images.forEach(function (image) {
                image.classList.remove('active');
            });
            tabs.forEach(function (tab) {
                tab.classList.remove('active');
            });

            var tabNumber = this.getAttribute('data-tab');
            this.classList.add('active');
            var panel = doc.querySelector('.image-tabs__panel[data-content="' + tabNumber + '"]');
            var image = doc.querySelector('.image-tabs__images figure[data-image="' + tabNumber + '"]');
            panel.classList.add('active');
            image.classList.add('active');
        });
    });

    imagesWrapper.forEach(el => {
        el.addEventListener('mouseenter', function () {
            el.classList.add('is-open');
            console.log(el);
        });
    
        el.addEventListener('mouseleave', function () {
            el.classList.remove('is-open');
        });
    });
});