// import loadProducts from './pagination.js';
// import {FAVORITES_URL} from "../api/api.js";
// import {currentPage, currentFilter} from './pagination.js';
// import checkFavoritesStatus from './favorite-status.js'


// export default async function toggleFavorite(product) {
//     try {
//         const isFavorite = await checkFavoritesStatus(product.id);
//
//         if (isFavorite) {
//
//             const response = await fetch(`${FAVORITES_URL}?productId=${product.id}`);
//             const favorites = await response.json();
//             const favoriteItem = favorites.find(item => item.productId === product.id);
//
//             if (favoriteItem) {
//                 await fetch(`${FAVORITES_URL}/${favoriteItem.id}`, {
//                     method: 'DELETE'
//                 });
//             }
//         } else {
//
//             await fetch(FAVORITES_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     productId: product.id,
//                     ...product
//                 })
//             });
//         }
//
//         loadProducts(currentPage, currentFilter);
//     } catch (error) {
//         console.error('Error toggling favorite:', error);
//     }
// }

import { USERS_URL } from "../api/api.js";

export default async function toggleFavorite(product) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Вы не авторизованы");
        return;
    }

    let updatedFavorites = [...(user.favorites || [])];
    const index = updatedFavorites.findIndex(p => p.id === product.id);

    const button = document.querySelector(`[data-id="${product.id}"][data-type="favorite"]`);
    if (index !== -1) {
        updatedFavorites.splice(index, 1);
        if (button) {
            button.classList.remove('active');
            button.textContent = 'В избранное';
        }
    } else {
        updatedFavorites.push(product);
        if (button) {
            button.classList.add('active');
            button.textContent = 'Убрать из избранного';
        }
    }

    const updatedUser = { ...user, favorites: updatedFavorites };

    try {
        const response = await fetch(`${USERS_URL}/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ favorites: updatedFavorites })
        });

        if (!response.ok) {
            throw new Error("Ошибка при обновлении избранного");
        }

        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    } catch (error) {
        console.error('Ошибка при изменении состояния избранного:', error);
        alert("Произошла ошибка при обновлении избранного");
    }
}