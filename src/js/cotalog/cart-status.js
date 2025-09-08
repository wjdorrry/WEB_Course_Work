import {USERS_URL} from "../api/api.js";

// export default async function checkCartStatus(productId) {
//     try {
//         const response = await fetch(`${CART_URL}?productId=${productId}`);
//         const cartItems = await response.json();
//         return cartItems.some(item => item.productId === productId);
//     } catch (error) {
//         console.error('Error checking cart status:', error);
//         return false;
//     }
// }

export default async function checkCartStatus(productId) {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        const response = await fetch(`${USERS_URL}/${user.id}`);
        const userData = await response.json();

        return userData.cart?.some(item => item.id === productId) || false;
    } catch (error) {
        console.error('Ошибка при проверке статуса корзины:', error);
        return false;
    }
}