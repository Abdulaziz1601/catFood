"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const border = document.querySelectorAll('.nav__item');

    function removeBorders() {
        border.forEach(element => {
            if (element.classList.contains('nav__item_active') && element) {
                element.classList.remove('nav__item_active');
            }
        });
    }

    border.forEach(element => {
        element.addEventListener('click', () => {
            removeBorders();
            element.classList.add('nav__item_active');
        })
    });

    beforeEffectslider({
        Selector: "#beforeEffectslider", // Element that the slider will be build in
        BeforeImage: "../img/example/before.png", // Before Image
        AfterImage: "../img/example/after.png",// After Image,
        Border: {
            width: 0
        },
        LineColor: 'transparent', //Line size
        Buttons: false,
    });
});