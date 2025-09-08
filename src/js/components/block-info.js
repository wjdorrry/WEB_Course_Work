class Block extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return ['logo', 'img1', 'img2', 'info1', 'info2', 'info3', 'upend', 'data-lang'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const logo = this.getAttribute('logo') || '';
        const img1 = this.getAttribute('img1') || '';
        const img2 = this.getAttribute('img2') || '';
        const info1 = this.getAttribute('info1') || '';
        const info2 = this.getAttribute('info2') || '';
        const info3 = this.getAttribute('info3') || '';
        const upend = this.getAttribute('upend') || 'row';
        const i18nKey = this.getAttribute('data-i18n');

        // Получаем переводы из глобального объекта или используем оригинальные тексты
        const lang = document.documentElement.lang || 'en';
        const translations = window.translations || {};
        const currentTranslations = translations[lang] || {};
        const blockTranslations = i18nKey ? currentTranslations[i18nKey] : null;

        this.innerHTML = `
            <div class="info__block flex" style="flex-direction: ${upend}">
                <img src="${img1}" alt="Cursach" class="info__block-img">
                <div class="info__block-text flex upend center-horizontal center-vertical">
                    <div class="flex upend gap-31">
                        <div class="info__block_text-logo flex upend gap-41">
                            <img src="${img2}" alt="Cursach Logo" class="info__block-text-logo-img">
                            <p class="info__block-text-even-logo text-bold text-2xl text-style-normal">
                                ${blockTranslations?.logo || logo}
                            </p>
                        </div>
                        <div class="flex upend gap-23">
                            <p class="info__block-text-even-info text-lg text-normal text-style-normal">
                                ${blockTranslations?.info1 || info1}
                            </p>
                            <p class="info__block-text-even-info text-lg text-normal text-style-normal">
                                ${blockTranslations?.info2 || info2}
                            </p>
                            <p class="info__block-text-even-info text-lg text-normal text-style-normal">
                                ${blockTranslations?.info3 || info3}
                            </p>
                        </div>
                    </div>    
                </div>
            </div>
        `;
    }
}

customElements.define('widget-block', Block);