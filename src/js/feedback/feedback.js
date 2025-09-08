import {ORDERS_URL, FEEDBACK_URL, API_URL, USERS_URL} from "../api/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadProducts();
    await loadFeedbacks();

    document.getElementById("submitReviewBtn").addEventListener("click", submitReview);
});

async function loadProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();

    const select = document.getElementById("productSelect");
    select.innerHTML = "<option value=''>Выберите товар</option>";
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
    });
}

async function submitReview() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const productId = document.getElementById("productSelect").value;
    const text = document.getElementById("reviewText").value.trim();
    const errorEl = document.getElementById("reviewError");
    errorEl.textContent = "";

    if (!user || user.role === "admin") {
        return (errorEl.textContent = "Администраторы не могут оставлять отзывы.");
    }
    if (!productId) return (errorEl.textContent = "Выберите товар.");
    if (text.length < 10) return (errorEl.textContent = "Минимум 10 символов.");

    const ordersRes = await fetch(`${ORDERS_URL}?userId=${user.id}`);
    const orders = await ordersRes.json();
    const bought = orders.some(o => o.items.some(i => i.productId === productId));
    if (!bought) return (errorEl.textContent = "Вы можете оставить отзыв только на купленный товар.");

    await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId: user.id,
            productId,
            text,
            date: new Date().toISOString()
        })
    });

    alert("Отзыв добавлен!");
    document.getElementById("reviewText").value = "";
    await loadFeedbacks();
}

async function loadFeedbacks() {
    const container = document.getElementById("feedbackList");
    container.innerHTML = "<p>Загрузка отзывов...</p>";

    try {
        const [feedbackRes, usersRes, productsRes] = await Promise.all([
            fetch(FEEDBACK_URL),
            fetch(USERS_URL),
            fetch(API_URL)
        ]);

        if (!feedbackRes.ok || !usersRes.ok || !productsRes.ok)
            throw new Error("Ошибка загрузки данных");

        const [feedbacks, users, products] = await Promise.all([
            feedbackRes.json(),
            usersRes.json(),
            productsRes.json()
        ]);

        if (feedbacks.length === 0) {
            container.innerHTML = "<p>Пока нет отзывов</p>";
            return;
        }

        container.innerHTML = "";
        feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));

        feedbacks.forEach(fb => {
            const userData = users.find(u => u.id === fb.userId);
            const productData = products.find(p => p.id === fb.productId);

            const div = document.createElement("div");
            div.className = "feedback-item";
            div.innerHTML = `
                <strong>${userData?.nickname || "Пользователь"}</strong> о <em>${productData?.name || "товаре"}</em>:
                <p>${fb.text}</p>
                <small>${new Date(fb.date).toLocaleString()}</small>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Ошибка:", error);
        container.innerHTML = `<p class="input-error">${error.message}</p>`;
    }
}
