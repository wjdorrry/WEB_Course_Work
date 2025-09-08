import loadProducts from './pagination.js';
import toggleFavorite from './favorite.js';
import toggleCart from './cart.js';
import checkFavoritesStatus from './favorite-status.js'
import checkCartStatus from './cart-status.js'
import {totalPages} from "./pagination.js";
const catalog = document.getElementById("catalog");

export default async function renderCatalog(items) {
    console.log('Rendering catalog with items:', items);
    if (!items || items.length === 0) {
        catalog.innerHTML = '<p class="no-products">Товары не найдены</p>';
        return;
    }

    try {
        const fragment = document.createDocumentFragment();
        await Promise.all(items.map(async (item) => {
            const [isFavorite, inCart] = await Promise.all([
                checkFavoritesStatus(item.id),
                checkCartStatus(item.id)
            ]);

            const productElement = document.createElement('div');
            productElement.className = 'catalog-item';
            catalog.innerHTML += `
                <div class="catalog-cart">
                    <img src="${item.image}" alt="product" class="catalog-cart__img">
                    <div class="catalog-cart__text-wrapper">
                        <p class="catalog-cart__name">${item.name}</p>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <p class="catalog-cart__price">${item.price} руб</p>
                            <p class="catalog-cart__price">Рейтинг: ${item.rating}</p>
                        </div>
                    </div>
                    <p class="catalog-cart__description">${item.description}</p>
                    <div class="catalog-cart__buttons">
                        <button class="btn-catalog ${isFavorite ? 'active' : ''}" data-id="${item.id}" data-type="favorite">
                            ${isFavorite ? 'Убрать из избранного' : 'В избранное'}
                        </button>
                        <button class="btn-catalog ${inCart ? 'active' : ''}" data-id="${item.id}" data-type="cart">
                            ${inCart ? 'Убрать из корзины' : 'В корзину'}
                        </button>
                    </div>
                </div>
            `;
        }));

        document.querySelectorAll('[data-type="favorite"]').forEach(button => {
            const productId = button.getAttribute('data-id');
            const product = items.find(item => item.id == productId);
            button.addEventListener('click', () => toggleFavorite(product));
        });

        document.querySelectorAll('[data-type="cart"]').forEach(button => {
            const productId = button.getAttribute('data-id');
            const product = items.find(item => item.id == productId);
            button.addEventListener('click', () => toggleCart(product));
        });
    } catch (error) {
        console.error('Error rendering catalog:', error);
        catalog.innerHTML = '<p class="error">Ошибка отображения товаров</p>';
    }
}

function initCatalog() {
    console.log('Catalog initialized');
    loadProducts(totalPages);
}

document.addEventListener('DOMContentLoaded', initCatalog);


