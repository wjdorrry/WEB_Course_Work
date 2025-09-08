// import {FAVORITES_URL} from "../api/api.js";

// document.addEventListener('DOMContentLoaded', async () => {
//     await loadFavorites();
// });
//
// async function loadFavorites() {
//     try {
//         const response = await fetch(FAVORITES_URL);
//         if (!response.ok) throw new Error('Ошибка загрузки избранного');
//
//         const favorites = await response.json();
//         const container = document.getElementById('favoritesContainer');
//
//         if (!favorites || favorites.length === 0) {
//             container.innerHTML = '<p class="no-favorites">У вас пока нет избранных товаров</p>';
//             return;
//         }
//
//         container.innerHTML = '';
//
//         favorites.forEach(item => {
//             const favoriteElement = document.createElement('div');
//             favoriteElement.className = 'favorites-item';
//             favoriteElement.innerHTML = `
//                 <div class="catalog-cart">
//                     <img src="${item.image}" alt="product" class="catalog-cart__img">
//                     <div class="catalog-cart__text-wrapper">
//                         <p class="catalog-cart__name">${item.name}</p>
//                         <div style="display: flex; flex-direction: column; gap: 10px;">
//                             <p class="catalog-cart__price">${item.price} руб</p>
//                             <p class="catalog-cart__price">Рейтинг: ${item.rating}</p>
//                         </div>
//                     </div>
//                     <p class="catalog-cart__description">${item.description}</p>
//                     <div class="catalog-cart__buttons">
//                          <button class="remove-favorite" data-id="${item.productId}">Удалить из избранного</button>
//                     </div>
//                 </div>
//                 `;
//             container.appendChild(favoriteElement);
//         });
//
//         document.querySelectorAll('.remove-favorite').forEach(button => {
//             button.addEventListener('click', async (e) => {
//                 const productId = e.target.getAttribute('data-id');
//                 await removeFromFavorites(productId);
//                 await loadFavorites();
//             });
//         });
//
//     } catch (error) {
//         console.error('Error loading favorites:', error);
//         document.getElementById('favoritesContainer').innerHTML =
//             '<p class="error">Ошибка загрузки избранных товаров</p>';
//     }
// }
//
// async function removeFromFavorites(productId) {
//     try {
//         const response = await fetch(`${FAVORITES_URL}?productId=${productId}`);
//         const favorites = await response.json();
//         const favoriteItem = favorites.find(item => item.productId === productId);
//
//         if (favoriteItem) {
//             const deleteResponse = await fetch(`${FAVORITES_URL}/${favoriteItem.id}`, {
//                 method: 'DELETE'
//             });
//
//             if (!deleteResponse.ok) {
//                 throw new Error('Ошибка при удалении из избранного');
//             }
//         }
//     } catch (error) {
//         console.error('Error removing from favorites:', error);
//         alert('Не удалось удалить товар из избранного');
//     }
// }
import toggleFavorite from "./favorite.js";

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Пожалуйста, войдите в аккаунт.");
        return;
    }

    loadFavorites(user.id);
});

function loadFavorites() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || !user.favorites) return;

    const container = document.getElementById('favoritesContainer');
    if (!user.favorites.length) {
        container.innerHTML = '<p class="no-favorites">У вас пока нет избранных товаров</p>';
        return;
    }

    container.innerHTML = '';

    user.favorites.forEach(item => {
        const el = document.createElement('div');
        el.className = 'favorites-item';
        el.innerHTML = `
            <div class="catalog-cart">
                <img src="${item.image}" class="catalog-cart__img" alt="product">
                <div class="catalog-cart__text-wrapper">
                    <p class="catalog-cart__name">${item.name}</p>
                    <p class="catalog-cart__price">${item.price} руб</p>
                    <p class="catalog-cart__price">Рейтинг: ${item.rating}</p>
                </div>
                <p class="catalog-cart__description">${item.description}</p>
                <div class="catalog-cart__buttons">
                    <button class="remove-favorite" data-id="${item.id}" data-type="favorite">Удалить из избранного</button>
                </div>
            </div>
        `;
        container.appendChild(el);
    });

    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', async e => {
            const id = e.target.getAttribute('data-id');
            const product = user.favorites.find(p => p.id === id);
            await toggleFavorite(product);
            window.location.reload();
        });
    });
}

// function removeFromFavorites(userId, productId) {
//     const key = `favorites_${userId}`;
//     let favorites = JSON.parse(localStorage.getItem(key)) || [];
//
//     favorites = favorites.filter(p => p.productId !== productId);
//     localStorage.setItem(key, JSON.stringify(favorites));
// }