"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });

        return await res.json();
    };
    const getCheckedCheckboxes = (form, name) => {
        const checkedMore = [];
        form.querySelectorAll(`input[name=${name}]:checked`).forEach(element => {
            checkedMore.push(element.value)
        });
        return checkedMore;
    }

    function showThanksModal(selector, text) {
        const thanksModal = document.querySelector(selector);
        thanksModal.querySelector('.thanks-modal__inner span').innerHTML = text;
        thanksModal.classList.remove('hide');
        thanksModal.classList.add('show');


        setTimeout(() => {
            thanksModal.classList.remove('show');
            thanksModal.classList.add('hide');
            thanksModal.querySelector('.thanks-modal__inner span').innerHTML = '';
        }, 4000);
    }

    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const checked = getCheckedCheckboxes(form, 'more');

        const formData = new FormData(form);

        const json = JSON.stringify({ ...Object.fromEntries(formData.entries()), 'more': checked }, null, 4);

        postData('https://my-json-server.typicode.com/Abdulaziz1601/catFood/feedback', json)
            .then(data => {
                console.log(data);
            })
            .catch(() => {
            })
            .finally(() => {
                form.reset(); //Deletes text after sending it to server or We can clear their values incrementally, It is same 
                showThanksModal('.thanks-modal', "Thanks for response")

            });
    })

});