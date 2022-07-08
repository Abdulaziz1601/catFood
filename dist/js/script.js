// beforeEffectslider({
//     Selector: "#beforeEffectslider", // Element that the slider will be build in
//     BeforeImage: "../img/example/before.png", // Before Image
//     AfterImage: "../img/example/after.png",// After Image,
//     Border: {
//         width: 0
//     },
//     LineColor: 'transparent', //Line size
//     Buttons: false,
// });

"use strict";
document.addEventListener("DOMContentLoaded", () => {
    // Services
    async function getResource(url) {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //Throws (Shows) an Error if smth happens
        }
        return await res.json();
    }

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

    const getProducts = async () => await getResource('http://localhost:3001/products');

    const getProduct = async (id) => await getResource(`http://localhost:3001/products/${id}`);

    const getAdditionals = async () => await getResource('http://localhost:3001/additionals');

    const getAdditional = async (id) => await getResource(`http://localhost:3001/additionals/${id}`);

    const searchFromAll = async (productName) => {
        return await Promise.all([getProducts(), getAdditionals()])
            .then(data => {
                const arr = [];
                data.forEach(item => arr.push(...item));
                return arr;
            })
            .then(data =>  data.find(item =>  item.name.toLowerCase() === productName).id);
    };

    // catalog fetching
    let count = 3;
    const productsContainer = document.querySelector('.products__wrapper'),
        modal = document.querySelector('.modal');

    productsContainer.innerHTML = '<div class="lds-ring cat__spinner"><div></div><div></div><div></div><div></div></div>';

    const renderProducts = (count) => {
        productsContainer.classList.add('products__wrapper_waiting');
        getProducts().then(data => {
            const arr = data.slice(0, count);
            productsContainer.classList.remove('products__wrapper_waiting');
            productsContainer.innerHTML = '';
            arr.forEach(({ id, img, name, weight, taste, price, }) => {
                productsContainer.innerHTML += `
                    <div class="products__item" data-pid=${id}>
                    <div class="products__item-img"><img src=${img} alt=""></div>
                    <div class="products__item-wrapper">
                        <div class="products__item-title">${name}</div>
                        <div class="products__item-descr">
                            <div>
                                <dt>Масса</dt>
                                <dd>${weight}</dd>
                            </div>
                            <div>
                                <dt>Вкус</dt>
                                <dd>${taste}</dd>
                            </div>
                            <div>
                                <dt>Цена</dt>
                                <dd>${price}</dd>
                            </div>
                        </div>
                        <button class="btn products__item-btn">заказать</button>
                    </div>
                </div>
                `;
            });
            if (count < data.length) {
                productsContainer.innerHTML += `
                <div class="products__more">
                    <div class="products__more-img">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="31" x2="31" y2="60" stroke="#D3D3D3" stroke-width="2" />
                            <line x1="60" y1="31" y2="31" stroke="#D3D3D3" stroke-width="2" />
                        </svg>
                    </div>
                    <div class="products__more-title">Показать еще 100500 товаров</div>
                    <div class="products__more-descr">
                        На самом деле вкусов
                        гораздо больше!
                    </div>
                    <button class="products__more-btn">показать все</button>    
                </div>
                `;
            } else {
                productsContainer.innerHTML += `
                    <div class="products__more">
                        <div class="products__more-title products__more-title_center">No More</div>
                    </div>
                `;
            }
            return data;
        })
            .then(({ length }) => {
                if (count < length) {
                    const productsMore = document.querySelector('.products__more-btn');
                    productsMore.addEventListener('click', () => {
                        count += 4;
                        renderProducts(count);
                    });
                }
            })
            .then(() => {
                const productsBtns = document.querySelectorAll('[data-pid] .products__item-btn');
                productsBtns.forEach(p => {
                    p.addEventListener('click', () => {
                        const id = p.parentElement.parentElement.getAttribute('data-pid');
                        getProduct(id)
                            .then(({ name }) => {
                                openModal(name, modal);
                            });
                    });
                });
            });
    };
    renderProducts(count);

    // Modal
    function openModal(productName, modal) {
        modal.querySelector('.modal__title').innerHTML = `Your order <span> ${productName} </span>`;
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    const close = document.querySelectorAll('[data-close]');

    close.forEach(element => {
        element.addEventListener('click', () => {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    modal.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(modal.querySelector('form')),
              p_name = modal.querySelector('.modal__title span').textContent.toLowerCase().trim(),
              p_id = await searchFromAll(p_name),
              json = JSON.stringify({
                    ...Object.fromEntries(formData.entries()),
                    pid: p_id
              });

        postData('http://localhost:3001/reply', json)
            .then(data => {
                console.log(data);
            })
            .catch((e) => console.log("Something went wrong" + e))
            .finally(() => {
                e.target.reset();
            });
    });
    // Additional Products
    const moreProducts = document.querySelector('.more__products');
    moreProducts.innerHTML = '<div class="lds-ring center"><div></div><div></div><div></div><div></div></div>';
    function renderAdditionals() {
        getAdditionals().then(data => {
            moreProducts.innerHTML = '';
            data.forEach(({ id, name, weight, price }) => {
                moreProducts.innerHTML += `
                    <div class="more__products-item " data-aid=${id}>
                    <div class="more__products-inner">
                        <div class="more__products-title">
                            ${name}
                        </div>
                        <div class="more__products-count">
                            ${weight}
                        </div>
                        <div class="more__products-price">
                            ${price}
                        </div>
                    </div>
                    <button class="btn btn_medium more__products-btn">
                        заказать
                    </button>
                </div>
                `;
            });

            return data;
        })
            .then(() => {
                const btns = document.querySelectorAll('[data-aid] .more__products-btn');
                btns.forEach(p => {
                    p.addEventListener('click', () => {
                        const id = p.parentElement.getAttribute('data-aid');
                        getAdditional(id)
                            .then(({ name }) => {
                                openModal(name, modal);
                            });
                    });
                });
            });
    }

    renderAdditionals();
});
