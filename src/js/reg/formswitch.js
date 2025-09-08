const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

if (window.innerWidth <= 768) {
    document.querySelector('.register-btn').addEventListener('click', function () {
        document.querySelector('.form-box.login').classList.remove('active');
        document.querySelector('.form-box.register').classList.add('active');
    });

    document.querySelector('.login-btn').addEventListener('click', function () {
        document.querySelector('.form-box.register').classList.remove('active');
        document.querySelector('.form-box.login').classList.add('active');
    });

    document.querySelector('.form-box.login').classList.add('active');
}



