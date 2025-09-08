import loadProducts from './pagination.js';
import {USERS_URL} from "../api/api.js";
import {currentPage, currentFilter} from './pagination.js';
// import checkCartStatus from './cart-status.js'

// export default async function toggleCart(product) {
//     try {
//         const inCart = await checkCartStatus(product.id);
//
//         if (inCart) {
//             const response = await fetch(`${CART_URL}?productId=${product.id}`);
//             const cartItems = await response.json();
//             const cartItem = cartItems.find(item => item.productId === product.id);
//
//             if (cartItem) {
//                 await fetch(`${CART_URL}/${cartItem.id}`, {
//                     method: 'DELETE'
//                 });
//             }
//         } else {
//             await fetch(CART_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     productId: product.id,
//                     ...product,
//                     quantity: 1
//                 })
//             });
//         }
//
//         // Обновляем отображение
//         loadProducts(currentPage, currentFilter);
//     } catch (error) {
//         console.error('Error toggling cart:', error);
//     }
// }
import updateCartBadge from './initcart.js';
export default async function toggleCart(product) {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) {
            alert("Вы не авторизованы");
            return;
        }

        const response = await fetch(`${USERS_URL}/${user.id}`);
        const userData = await response.json();

        const cart = userData.cart || [];
        const existingItem = cart.find(item => item.id === product.id);

        let updatedCart;
        if (existingItem) {
            updatedCart = cart.filter(item => item.id !== product.id);
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        await fetch(`${USERS_URL}/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: updatedCart })
        });

        loadProducts(currentPage, currentFilter);
        await updateCartBadge(); // ← вызов тут
    } catch (error) {
        console.error('Ошибка при обновлении корзины:', error);
    }
}