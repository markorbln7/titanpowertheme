import './section-image-tabs.css'

document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('.image-tabs__button');
    var imagesWrapper = document.querySelector('.image-tabs__images');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var panels = document.querySelectorAll('.image-tabs__panel');
            var images = document.querySelectorAll('.image-tabs__images figure');
            var tabs = document.querySelectorAll('.image-tabs__button');
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
            var panel = document.querySelector('.image-tabs__panel[data-content="' + tabNumber + '"]');
            var image = document.querySelector('.image-tabs__images figure[data-image="' + tabNumber + '"]');
            panel.classList.add('active');
            image.classList.add('active');
        });
    });

    imagesWrapper.addEventListener('mouseenter', function () {
        this.classList.add('is-open');
    });

    imagesWrapper.addEventListener('mouseleave', function () {
        this.classList.remove('is-open');
    });

});