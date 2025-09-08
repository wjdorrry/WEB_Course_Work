document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordFields = document.getElementById('passwordFields');

    const topPasswords2024 = [
        "123456", "123456789", "qwerty", "password", "111111", "123123", "12345678", "abc123", "qwerty123", "1q2w3e4r",
        "admin", "654321", "qwe123", "iloveyou", "000000", "password1", "zaq12wsx", "dragon", "sunshine", "princess",
        "welcome", "football", "monkey", "shadow", "master", "letmein", "login", "passw0rd", "starwars", "freedom",
        "1234", "696969", "12345", "trustno1", "whatever", "batman", "baseball", "mustang", "superman", "hello",
        "1qaz2wsx", "qazwsx", "password123", "google", "pokemon", "ninja", "michael", "jordan", "hunter", "killer",
        "naruto", "test", "asdfgh", "zxcvbn", "charlie", "biteme", "jessica", "pepper", "ginger", "tigger", "soccer",
        "hannah", "george", "harley", "fuckyou", "cookie", "maggie", "peanut", "winter", "purple", "banana", "chelsea",
        "love", "donald", "q1w2e3r4", "asdf1234", "samsung", "hello123", "liverpool", "matrix", "7777777", "mercedes",
        "qwertyuiop", "blink182", "sweet", "babygirl", "taylor", "summer", "ashley", "sunset", "loveme", "flower",
        "angel", "jesus", "pokemon123", "justin", "batman123", "michelle", "harrypotter", "happy", "pass1234"
    ];;

    const passwordRulesRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    function generateStrongPassword() {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const digits = "0123456789";
        const special = "@$!%*?&";
        const all = upper + lower + digits + special;

        let passwordArray, passwordStr;
        do {
            passwordArray = [
                upper[Math.floor(Math.random() * upper.length)],
                lower[Math.floor(Math.random() * lower.length)],
                digits[Math.floor(Math.random() * digits.length)],
                special[Math.floor(Math.random() * special.length)]
            ];
            while (passwordArray.length < 12) {
                passwordArray.push(all[Math.floor(Math.random() * all.length)]);
            }
            passwordStr = passwordArray.sort(() => Math.random() - 0.5).join('');
        } while (topPasswords2024.includes(passwordStr));

        return passwordStr;
    }

    document.getElementsByName('passwordOption').forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'manual') {
                passwordFields.style.display = 'block';
                confirmPassword.disabled = false;
                password.value = '';
                confirmPassword.value = '';
            } else {
                const generated = generateStrongPassword();
                passwordFields.style.display = 'block';
                password.value = generated;
                confirmPassword.value = generated;
                confirmPassword.disabled = true;
                alert("Ваш сгенерированный пароль: " + generated);
            }
        });
    });

    confirmPassword.addEventListener('paste', (e) => {
        e.preventDefault();
        alert("Вставка в это поле запрещена.");
    });

    form.addEventListener('submit', (e) => {
        let isValid = true;
        const selectedOption = document.querySelector('input[name="passwordOption"]:checked').value;

        form.querySelectorAll('.input-box').forEach(box => {
            box.classList.remove('error');
            const errorMessage = box.querySelector('.error-message');
            if (errorMessage) errorMessage.style.display = 'none';
        });

        if (!passwordRulesRegex.test(password.value)) {
            const box = password.parentElement;
            box.classList.add('error');
            const errorMessage = box.querySelector('.error-message');
            if (errorMessage) errorMessage.style.display = 'block';
            isValid = false;
        }

        if (selectedOption === 'manual') {
            if (password.value !== confirmPassword.value) {
                const box = confirmPassword.parentElement;
                box.classList.add('error');
                const errorMessage = box.querySelector('.error-message');
                if (errorMessage) errorMessage.style.display = 'block';
                isValid = false;
            }

            if (topPasswords2024.includes(password.value)) {
                alert("Пароль входит в список самых популярных. Придумайте другой.");
                const box = password.parentElement;
                box.classList.add('error');
                const errorMessage = box.querySelector('.error-message');
                if (errorMessage) errorMessage.style.display = 'block';
                isValid = false;
            }
        }

        if (!isValid) e.preventDefault();
    });
});
