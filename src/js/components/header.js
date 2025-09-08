import profile from '../../img/img.png';
import logo from '../../img/f_31061dc1e375ab34 1.png';
import phoneIcon from '../../img/ico-phone.jpg';
class Header extends HTMLElement {
    constructor() {
        super();
        this._themeSwitchHandler = this._themeSwitchHandler.bind(this);
        this._logoutHandler = this._logoutHandler.bind(this);
        this.render();
    }

    static get observedAttributes() {
        return ['data-lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-lang' && oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this._setupEventListeners();
        const logoutBtn = this.querySelector("#logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", this._logoutHandler);
        }
    }

    disconnectedCallback() {
        const logoutBtn = this.querySelector("#logoutBtn");
        if (logoutBtn) {
            logoutBtn.removeEventListener("click", this._logoutHandler);
        }
    }

    _logoutHandler() {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user) {
            localStorage.removeItem(`favorites_${user.id}`);
            localStorage.removeItem(`cart_${user.id}`);
        }
        localStorage.removeItem("loggedInUser");
        window.location.href = "../reg/index.html";
    }

    _themeSwitchHandler() {
        const htmlElement = document.documentElement;
        const isDark = !htmlElement.classList.contains("dark-theme");
        htmlElement.classList.toggle("dark-theme", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");

        const toggleButton = this.querySelector("#theme-switch");
        if (toggleButton) {
            toggleButton.checked = isDark;
        }

        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDark }
        }));
    }

    _setupEventListeners() {
        const oldToggle = this.querySelector("#theme-switch");
        if (oldToggle) {
            oldToggle.removeEventListener("click", this._themeSwitchHandler);
        }

        const savedTheme = localStorage.getItem("theme");
        const isDark = savedTheme === "dark";
        document.documentElement.classList.toggle("dark-theme", isDark);

        const toggleButton = this.querySelector("#theme-switch");
        if (toggleButton) {
            toggleButton.checked = isDark;
            toggleButton.addEventListener("click", this._themeSwitchHandler);
        }

        const navLinks = this.querySelectorAll(".header-nav_link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                this._closeMobileMenu();
            });
        });
    }

    _closeMobileMenu() {
        const burgerToggle = this.querySelector("#burger-toggle");
        if (burgerToggle) {
            burgerToggle.checked = false;
            this._toggleMobileMenu(false);
        }
    }

    _toggleMobileMenu(show) {
        const navbar = this.querySelector(".header-nav");
        const overlay = this.querySelector(".overlay");
        const body = document.body;

        if (show) {
            navbar.style.display = "flex";
            overlay.style.display = "block";
            body.style.overflow = "hidden";
            setTimeout(() => {
                navbar.style.opacity = "1";
                navbar.style.transform = "translateY(0)";
                overlay.style.opacity = "1";
            }, 10);
        } else {
            navbar.style.opacity = "0";
            overlay.style.opacity = "0";
            body.style.overflow = "";
            setTimeout(() => {
                navbar.style.display = "none";
                overlay.style.display = "none";
            }, 300);
        }
    }

    render() {
        const currentLang = this.getAttribute('data-lang') || 'ru';

        const translations = {
            en: {
                about: "About",
                catalog: "Catalog",
                reviews: "Reviews",
                registration: "Registration",
                contact: "Contacts",
                admin: "Admin-panel",
                logout: "Logout",
                login: "Login",
                phone: "8 (771) 145-98-26",
            },
            ru: {
                about: "О нас",
                catalog: "Каталог",
                reviews: "Отзывы",
                registration: "Регистрация",
                contact: "Контакты",
                admin: "Админ-панель",
                logout: "Выйти",
                login: "Войти",
                phone: "8 (771) 145-98-26",
            }
        };

        const userData = JSON.parse(localStorage.getItem("loggedInUser"));
        const userInfoHtml = userData
            ? `<div class="user-info">
                    <a href="../../../profile/index.html" class="header-nav_link">
                        <img src="${profile}" alt="profile" style="width: 32px; height: 32px; border-radius: 50%">
                    </a>
                    <button id="logoutBtn" class="get-tickets1">${translations[currentLang].logout}</button>
               </div>`
            : `<a href="/reg/index.html" class="header-nav_link">${translations[currentLang].login}</a>`;

        const adminLink = userData && userData.role === "admin"
            ? `<a href="../../../admin/index.html" class="header-nav_link">${translations[currentLang].admin}</a>`
            : '';

        this.innerHTML = `
            <header class="header">
                <div class="header-logo">
                    <img src="${logo}" alt="Логотип"/>
                </div>

                <input type="checkbox" id="burger-toggle" class="burger-checkbox">
                <label for="burger-toggle" class="burger-menu">
                    <span></span><span></span><span></span>
                </label>
                <div class="overlay"></div>

                <nav class="header-nav">
                    <a href="/index.html" class="header-nav_link">${translations[currentLang].about}</a>
                    <a href="/catalog/index.html" class="header-nav_link">${translations[currentLang].catalog}</a>
                    <a href="/feedback/index.html" class="header-nav_link">${translations[currentLang].reviews}</a>
                    <a href="/reg/index.html" class="header-nav_link">${translations[currentLang].registration}</a>
                    ${adminLink}
                    ${userInfoHtml}
                   
                </nav>

                <div class="header-phone">
                    <img src="${phoneIcon}" alt="телефон"/>
                    <p class="header-phone_num">${translations[currentLang].phone}</p>
                </div>
            </header>
        `;

        const burgerToggle = this.querySelector("#burger-toggle");
        if (burgerToggle) {
            burgerToggle.addEventListener("change", (e) => {
                this._toggleMobileMenu(e.target.checked);
            });
        }

        const overlay = this.querySelector(".overlay");
        if (overlay) {
            overlay.addEventListener("click", () => {
                this._closeMobileMenu();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    customElements.define('widget-header', Header);
});