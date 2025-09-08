import { USERS_URL } from "../api/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    if (!form) {
        console.error("Форма регистрации не найдена!");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = form.querySelector('input[placeholder="First Name*"]').value.trim();
        const lastName = form.querySelector('input[placeholder="Last Name*"]').value.trim();
        const middleName = form.querySelector('input[placeholder="Middle name"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const dob = form.querySelector('input[type="date"]').value;
        const password = document.getElementById("password").value.trim();
        const nickname = document.getElementById("nickname_gen").value.trim();

        if (!firstName || !lastName || !email || !password || !nickname) {
            alert("Please fill in all required fields.");
            return;
        }

        const newUser = {
            firstName,
            lastName,
            middleName,
            phone,
            email,
            dob,
            password,
            nickname,
            favorites: [],
            cart: []
        };

        try {
            const response = await fetch(USERS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }

            const createdUser = await response.json();
            console.log("Создан пользователь:", createdUser);

            localStorage.setItem("loggedInUser", JSON.stringify(createdUser));

            window.location.href = "../../index.html";
        } catch (err) {
            console.error("Ошибка регистрации:", err);
            alert("Ошибка при регистрации пользователя.");
        }
    });
});
