class Favorite extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return ['img', 'info', 'data-lang', 'data-i18n'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const img = this.getAttribute('img') || '';
        const defaultInfo = this.getAttribute('info') || '';
        const i18nKey = this.getAttribute('data-i18n');

        // Получаем текущий язык и переводы
        const lang = document.documentElement.lang || 'en';
        const translations = window.translations?.[lang] || {};

        // Используем перевод или оригинальный текст
        const info = translations[i18nKey] || defaultInfo;

        this.innerHTML = `
            <div class="favorites__text-block-component flex upend gap-22 center-horizontal center-vertical">
                <img src="${img}" alt="ico-favorite" class="favorites__text-block-component-img">
                <p class="favorites__text-block-component-text text-sm text-style-normal text-normal">${info}</p>
            </div>
        `;
    }
}

customElements.define('widget-favorite', Favorite);