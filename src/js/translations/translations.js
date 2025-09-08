document.querySelector('widget-header').setAttribute('data-lang', 'ru');
document.querySelector('widget-footer').setAttribute('data-lang', 'ru');

const translations = {
    ru: {
        header_about: "О нас",
        header_catalog: "Каталог",
        header_feedback: "Отзывы",
        header_contacts: "Контакты",

        footer_about: "О нас",
        footer_catalog: "Каталог",
        footer_feedback: "Отзывы",
        footer_contacts: "Контакты",
        footer_rights: "Все права защищены © 2024 KEMENGER MEKTEBI",

        info_logo: "KEMENGER MEKTEBI – центр интеллектуального развития",
        info_text: "Обучение происходит на казахском и русском языках. При записи на два или более курсов предусмотрена скидка. Запишитесь на бесплатный пробный урок.",
        info_btn: "Оставить заявку",

        facts1: "В нашем центре работают профессиональные педагоги, любящие детей и преданные своему делу. Мы помогаем детям совершенствовать свои интеллектуальные способности, чтобы они могли познавать мир и делать его более красивым и добрым.",
        facts2: "Наши ученики показывают результат уже с первого месяца работы. Мы поддерживаем в нашем центре тёплую и дружескую атмосферу. Побывав у нас, детям обязательно захочется вернуться снова. Развивайтесь вместе с нами!",

        about_text: "Мы развиваем детей с 5 до 16 лет по следующим направлениям",
        course1: "Ментальная арифметика",
        course2: "Скорочтение",
        course3: "Подготовка к школе",
        course4: "Группа продленного дня",
        course5: "Суперпамять",
        course6: "Английский язык",
        course7: "Каллиграфия",

        catalog: "Каталог",
        certs: "Наши сертификаты",
        contacts: "Наши контакты",
        free_lesson: "Запишитесь на бесплатный пробный урок по номеру:",
        address: "Адрес:",
        worktime: "График работы:",
        email: "E-mail:",
        reviews: "Отзывы",

        review1_name: "Малика Фазлиева",
        review1_text: "Очень довольна курсами, ребёнок с радостью ходит на занятия и показывает хорошие результаты!",

        review2_name: "Данияр Тulegenov",
        review2_text: "Прекрасные педагоги и доброжелательная атмосфера. Рекомендую всем родителям!",

        review3_name: "Алима Жанибекова",
        review3_text: "После первого месяца занятий дочка начала читать быстрее и увереннее. Спасибо центру!"

    },
    en: {
        header_about: "About us",
        header_catalog: "Catalog",
        header_feedback: "Reviews",
        header_contacts: "Contacts",

        footer_about: "About us",
        footer_catalog: "Catalog",
        footer_feedback: "Reviews",
        footer_contacts: "Contacts",
        footer_rights: "All rights reserved © 2024 KEMENGER MEKTEBI",

        info_logo: "KEMENGER MEKTEBI – Intellectual Development Center",
        info_text: "Training is conducted in Kazakh and Russian. Discounts are provided when enrolling in two or more courses. Sign up for a free trial lesson.",
        info_btn: "Apply now",

        facts1: "Our center employs professional teachers who love children and are dedicated to their work. We help children improve their intellectual abilities so they can explore the world and make it better and kinder.",
        facts2: "Our students show results from the very first month. We maintain a warm and friendly atmosphere in our center. After visiting us, children will definitely want to come back again. Develop with us!",

        about_text: "We develop children from 5 to 16 years in the following areas",
        course1: "Mental arithmetic",
        course2: "Speed reading",
        course3: "School preparation",
        course4: "After-school program",
        course5: "Super memory",
        course6: "English language",
        course7: "Calligraphy",

        catalog: "Catalog",
        certs: "Our certificates",
        contacts: "Contacts",
        free_lesson: "Sign up for a free trial lesson at:",
        address: "Address:",
        worktime: "Working hours:",
        email: "E-mail:",
        reviews: "Reviews",

        review1_name: "Malika Fazlieva",
        review1_text: "Very satisfied with the courses, my child happily attends classes and shows good results!",

        review2_name: "Daniyar Tulegenov",
        review2_text: "Great teachers and a friendly atmosphere. I recommend it to all parents!",

        review3_name: "Alima Zhanibekova",
        review3_text: "After the first month, my daughter started reading faster and more confidently. Thanks to the center!"

    }
};

function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "ru";
    applyTranslations(savedLang);

    const langBtn = document.createElement("button");
    langBtn.textContent = savedLang === "ru" ? "EN" : "RU";
    langBtn.className = "lang-switch";
    document.body.appendChild(langBtn);

    langBtn.addEventListener("click", () => {
        const newLang = localStorage.getItem("lang") === "ru" ? "en" : "ru";
        applyTranslations(newLang);
        langBtn.textContent = newLang === "ru" ? "EN" : "RU";
    });
});