import { FEEDBACK_URL, API_URL, USERS_URL } from "../api/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user?.role === "admin") {
        document.getElementById("adminPanel").style.display = "block";

        ["productName", "productCategory", "productPrice", "productRating", "productDescription", "productImage"]
            .forEach(id => document.getElementById(id).addEventListener("input", validateForm));

        document.getElementById("submitProductBtn").addEventListener("click", submitProduct);
        document.getElementById("filterBtn").addEventListener("click", filterReviews);

        loadAllProducts();
        loadAllReviews();
    } else {
        alert("Только администратор может войти в админ-панель");
        window.location.href = "/index.html";
    }
});

function validateForm() {
    const name = document.getElementById("productName").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value);
    const category = document.getElementById("productCategory").value.trim();
    const rating = parseFloat(document.getElementById("productRating").value);
    const description = document.getElementById("productDescription").value.trim();
    const image = document.getElementById("productImage").value.trim();

    const valid = name && category && description && image &&
        !isNaN(price) && price > 0 &&
        !isNaN(rating) && rating >= 0 && rating <= 5;

    document.getElementById("submitProductBtn").disabled = !valid;
    document.getElementById("productError").textContent = valid ? "" : "Заполните все поля корректно";
}

async function submitProduct() {
    const product = getProductFormData();

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    if (response.ok) {
        alert("Товар добавлен!");
        resetForm();
        loadAllProducts();
    } else {
        alert("Ошибка при добавлении товара");
    }
}

function getProductFormData() {
    return {
        name: document.getElementById("productName").value.trim(),
        category: document.getElementById("productCategory").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        rating: parseFloat(document.getElementById("productRating").value),
        description: document.getElementById("productDescription").value.trim(),
        image: document.getElementById("productImage").value.trim()
    };
}

function resetForm() {
    ["productName", "productCategory", "productPrice", "productRating", "productDescription", "productImage"]
        .forEach(id => document.getElementById(id).value = "");

    document.getElementById("submitProductBtn").textContent = "Сохранить";
    document.getElementById("submitProductBtn").onclick = submitProduct;
    validateForm();
}

async function loadAllProducts() {
    try {
        const res = await fetch(API_URL);
        const products = await res.json();
        const list = document.getElementById("productList");
        list.innerHTML = "";

        for (const p of products) {
            const div = document.createElement("div");
            div.className = "product-item";
            div.innerHTML = `
                <strong>${p.name}</strong> — ${p.category}, ${p.price} ₽
                <br>
                <button onclick='editProduct(${JSON.stringify(p)})' class="add-btn">Редактировать</button>
                <button onclick='deleteProduct("${p.id}")' class="add-btn">Удалить</button>
            `;
            list.appendChild(div);
        }
    } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
    }
}

window.deleteProduct = async function (id) {
    if (!confirm("Удалить товар?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления");
        alert("Товар удалён");
        loadAllProducts();
    } catch (err) {
        alert("Не удалось удалить товар");
    }
};

window.editProduct = function (product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productRating").value = product.rating;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productImage").value = product.image;

    document.getElementById("submitProductBtn").textContent = "Обновить";
    document.getElementById("submitProductBtn").onclick = () => updateProduct(product.id);
    validateForm();
};

async function updateProduct(id) {
    const updated = getProductFormData();

    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    });

    if (res.ok) {
        alert("Товар обновлён");
        resetForm();
        loadAllProducts();
    } else {
        alert("Ошибка обновления");
    }
}

export async function loadAllReviews() {
    try {
        const res = await fetch(FEEDBACK_URL);
        const reviews = await res.json();
        renderReviews(reviews);
    } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
        document.getElementById("adminReviews").innerHTML = `<p class="input-error">Ошибка загрузки отзывов</p>`;
    }
}

window.filterReviews = async function () {
    const userId = document.getElementById("filterUserId").value.trim();
    const productId = document.getElementById("filterProductId").value.trim();

    try {
        const res = await fetch(FEEDBACK_URL);
        const reviews = await res.json();
        const filtered = reviews.filter(fb =>
            (!userId || fb.userId === userId) &&
            (!productId || fb.productId === productId)
        );
        renderReviews(filtered);
    } catch (err) {
        console.error("Ошибка при фильтрации:", err);
        alert("Ошибка фильтрации отзывов");
    }
};

async function renderReviews(reviews) {
    const container = document.getElementById("adminReviews");
    container.innerHTML = "";

    for (const fb of reviews) {
        const [userRes, productRes] = await Promise.all([
            fetch(`${USERS_URL}/${fb.userId}`),
            fetch(`${API_URL}/${fb.productId}`)
        ]);
        const user = await userRes.json();
        const product = await productRes.json();

        const div = document.createElement("div");
        div.className = "admin-review";
        div.innerHTML = `
            <strong>${user?.nickname || "Пользователь"}</strong> о <em>${product?.name || "товаре"}</em>:
            <p>${fb.text}</p>
            <small>${new Date(fb.date).toLocaleString()}</small><br>
            <button onclick="deleteReview('${fb.id}')" style="padding: 10px; border-radius: 8px; color: #FFFFFF">Удалить</button>
        `;
        container.appendChild(div);
    }
}

window.deleteReview = async function (id) {
    if (!confirm("Удалить отзыв?")) return;

    try {
        const res = await fetch(`${FEEDBACK_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Ошибка удаления");
        alert("Отзыв удалён");
        loadAllReviews();
    } catch (err) {
        alert("Не удалось удалить отзыв");
    }
};
