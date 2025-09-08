document.addEventListener('DOMContentLoaded', function () {
    const dobInput = document.querySelector('input[type="date"]');
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    dobInput.max = minDate.toISOString().split('T')[0];

    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', function () {
            if (input.checkValidity()) {
                input.parentElement.classList.remove('error');
            }
        });
    });

    form.addEventListener('submit', function (e) {
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.parentElement.classList.add('error');
                isValid = false;
            }
        });

        const password = form.querySelector('input[type="password"]');
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1];

        if (password.value !== confirmPassword.value) {
            confirmPassword.parentElement.classList.add('error');
            isValid = false;
        }

        if (!isValid) e.preventDefault();
    });
});
