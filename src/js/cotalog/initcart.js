// import {CART_URL} from "../api/api.js";
//
// let cartData = [];
//
// document.addEventListener('DOMContentLoaded', async () => {
//     await loadCart();
// });
//
// async function loadCart() {
//     try {
//         const response = await fetch(CART_URL);
//         if (!response.ok) throw new Error('Ошибка загрузки корзины');
//
//         cartData = await response.json();
//         renderCart();
//     } catch (error) {
//         console.error('Error loading cart:', error);
//         document.getElementById('cartContainer').innerHTML =
//             '<p class="error">Ошибка загрузки корзины</p>';
//     }
// }
//
// function renderCart() {
//     const container = document.getElementById('cartContainer');
//     const totalContainer = document.getElementById('cartTotal');
//
//     if (!cartData || cartData.length === 0) {
//         container.innerHTML = '<p class="no-items">Ваша корзина пуста</p>';
//         totalContainer.innerHTML = '';
//         return;
//     }
//
//     container.innerHTML = '';
//     let total = 0;
//
//     cartData.forEach(item => {
//         const cartItem = document.createElement('div');
//         cartItem.className = 'catalog-cart';
//         cartItem.innerHTML = `
//             <img src="${item.image}" alt="product" class="catalog-cart__img">
//             <div class="catalog-cart__text-wrapper">
//                 <p class="catalog-cart__name">${item.name}</p>
//                 <div style="display: flex; flex-direction: column; gap: 10px;">
//                     <p class="catalog-cart__price">${item.price} руб</p>
//                     <p class="catalog-cart__price">Рейтинг: ${item.rating}</p>
//                 </div>
//             </div>
//             <p class="catalog-cart__description">${item.description}</p>
//             <div style="display: flex; gap:15px; align-items: center">
//                 <div class="cart-item__quantity">
//                     <button class="quantity-btn minus" data-id="${item.id}">-</button>
//                     <span class="quantity">${item.quantity}</span>
//                     <button class="quantity-btn plus" data-id="${item.id}">+</button>
//                 </div>
//                 <div class="cart-item__subtotal">
//                     ${item.price * item.quantity} руб
//                 </div>
//                 <button class="remove-btn" data-id="${item.id}">×</button>
//             </div>
//         `;
//         container.appendChild(cartItem);
//         total += item.price * item.quantity;
//     });
//
//     totalContainer.innerHTML = `
//         <div class="total-sum">
//             <strong>Итого: ${total} руб</strong>
//         </div>
//         <button class="checkout-btn" ${cartData.length === 0 ? 'disabled' : ''}>Оформить заказ</button>
//     `;
//
//     addEventListeners();
// }
//
// async function checkout() {
//     if (!cartData || cartData.length === 0) {
//         alert('Корзина пуста, нечего оформлять');
//         return;
//     }
//
//     if (confirm('Подтвердить оформление заказа?')) {
//         try {
//             const deletePromises = cartData.map(item =>
//                 fetch(`${CART_URL}/${item.id}`, { method: 'DELETE' })
//             );
//
//             await Promise.all(deletePromises);
//
//             cartData = [];
//
//             renderCart();
//
//         } catch (error) {
//             console.error('Error during checkout:', error);
//             alert('Не удалось оформить заказ');
//         }
//     }
// }
//
//
// function addEventListeners() {
//     document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
//         btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), -1));
//     });
//
//     document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
//         btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), 1));
//     });
//
//     document.querySelectorAll('.remove-btn').forEach(btn => {
//         btn.addEventListener('click', () => removeItem(btn.getAttribute('data-id')));
//     });
//
//     document.querySelector('.checkout-btn')?.addEventListener('click', checkout);
// }
//
// async function changeQuantity(itemId, change) {
//     try {
//         const item = cartData.find(item => item.id === itemId);
//         if (!item) return;
//
//         const newQuantity = item.quantity + change;
//
//         if (newQuantity < 1) {
//             await removeItem(itemId);
//             return;
//         }
//
//         const response = await fetch(`${CART_URL}/${itemId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ quantity: newQuantity })
//         });
//
//         if (!response.ok) throw new Error('Ошибка обновления количества');
//
//         await loadCart();
//     } catch (error) {
//         console.error('Error changing quantity:', error);
//         alert('Не удалось изменить количество');
//     }
// }
//
// async function removeItem(itemId) {
//     try {
//         const response = await fetch(`${CART_URL}/${itemId}`, {
//             method: 'DELETE'
//         });
//
//         if (!response.ok) throw new Error('Ошибка удаления товара');
//
//         await loadCart();
//     } catch (error) {
//         console.error('Error removing item:', error);
//         alert('Не удалось удалить товар');
//     }
// }

import {USERS_URL, ORDERS_URL} from "../api/api.js";

let cartData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCart();
    await updateCartBadge();
});

async function loadCart() {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!user) throw new Error('Пользователь не авторизован');

        const response = await fetch(`${USERS_URL}/${user.id}`);
        if (!response.ok) throw new Error('Ошибка загрузки пользователя');

        const userData = await response.json();
        cartData = userData.cart || [];

        renderCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        document.getElementById('cartContainer').innerHTML =
            '<p class="error">Ошибка загрузки корзины</p>';
    }
}

function renderCart() {
    const container = document.getElementById('cartContainer');
    const totalContainer = document.getElementById('cartTotal');

    if (!cartData || cartData.length === 0) {
        container.innerHTML = '<p class="no-items">Ваша корзина пуста</p>';
        totalContainer.innerHTML = '';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cartData.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'catalog-cart';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="product" class="catalog-cart__img">
            <div class="catalog-cart__text-wrapper">
                <p class="catalog-cart__name">${item.name}</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <p class="catalog-cart__price">${item.price} руб</p>
                    <p class="catalog-cart__price">Рейтинг: ${item.rating}</p>
                </div>
            </div>
            <p class="catalog-cart__description">${item.description}</p>
            <div style="display: flex; gap:15px; align-items: center">
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item__subtotal">
                    ${item.price * item.quantity} руб
                </div>
                <button class="remove-btn" data-id="${item.id}">×</button>
            </div>
        `;
        container.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    totalContainer.innerHTML = `
        <div class="total-sum">
            <strong>Итого: ${total} руб</strong>
        </div>
        <button class="checkout-btn" ${cartData.length === 0 ? 'disabled' : ''}>Оформить заказ</button>
    `;

    addEventListeners();
}

async function checkout() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user || !cartData.length) {
        alert('Вы не авторизованы или корзина пуста');
        return;
    }

    if (!confirm('Подтвердить оформление заказа?')) return;

    try {
        const orderPayload = {
            userId: user.id,
            nickname: user.nickname,
            items: cartData.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            date: new Date().toISOString()
        };

        await fetch(ORDERS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload)
        });

        await fetch(`${USERS_URL}/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: [] })
        });

        cartData = [];
        renderCart();
        alert("Заказ успешно оформлен!");
        await updateCartBadge(); // ← вызов тут
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Не удалось оформить заказ');
    }
}

function addEventListeners() {
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), -1));
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => changeQuantity(btn.getAttribute('data-id'), 1));
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn.getAttribute('data-id')));
    });

    document.querySelector('.checkout-btn')?.addEventListener('click', checkout);
}

async function changeQuantity(itemId, change) {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        const response = await fetch(`${USERS_URL}/${user.id}`);
        const userData = await response.json();

        const updatedCart = userData.cart.map(item => {
            if (item.id === itemId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(Boolean);

        await fetch(`${USERS_URL}/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: updatedCart })
        });

        loadCart();
        await updateCartBadge(); // ← вызов тут
    } catch (error) {
        console.error('Ошибка изменения количества:', error);
    }
}

async function removeItem(itemId) {
    try {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        const response = await fetch(`${USERS_URL}/${user.id}`);
        const userData = await response.json();

        const updatedCart = userData.cart.filter(item => item.id !== itemId);

        await fetch(`${USERS_URL}/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: updatedCart })
        });

        loadCart();
        await updateCartBadge(); // ← вызов тут
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
    }
}

export default async function updateCartBadge() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const badge = document.getElementById('cart-count-badge');

    if (!user || !badge) return;

    try {
        const response = await fetch(`${USERS_URL}/${user.id}`);
        const userData = await response.json();
        const cart = userData.cart || [];

        const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

        if (totalCount > 0) {
            badge.textContent = totalCount;
            badge.style.display = 'inline-block';
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => badge.style.transform = 'scale(1)', 150);
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка при обновлении бейджа корзины:', error);
    }
}