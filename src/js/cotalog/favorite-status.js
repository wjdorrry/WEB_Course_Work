// import {FAVORITES_URL} from "../api/api.js";
// export default async function checkFavoritesStatus(productId) {
//     try {
//         const response = await fetch(`${FAVORITES_URL}?productId=${productId}`);
//         const favorites = await response.json();
//         return favorites.some(item => item.productId === productId);
//     } catch (error) {
//         console.error('Error checking favorites status:', error);
//         return false;
//     }
// }
export default function checkFavoritesStatus(productId) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || !Array.isArray(user.favorites)) return false;
    return user.favorites.some(p => p.id === productId);
}