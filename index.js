import "./style2.css"
import "./src/css/tablet-style.css"
import "./src/css/header-style.css"

import "./src/js/api/api.js"
import "./src/js/translations/translations.js"
import "./src/js/components/block-review.js"
import "./src/js/components/block-favorite.js"
import "./src/js/components/block-info.js"
import "./src/js/components/footer.js"
import "./src/js/components/header.js"

function setTextScale(scale) {
    document.documentElement.style.setProperty('--text-scale', scale);
    localStorage.setItem('textScale', scale);

    const header = document.querySelector('.header');
    if (header) {
        header.style.fontSize = `${scale}em`;
    }

    document.querySelectorAll('.catalog-item, .catalog-item *').forEach(el => {
        el.style.fontSize = `${scale}em`;
    });
}

document.querySelectorAll('[data-scale]').forEach(btn => {
    btn.addEventListener('click', function() {
        const scale = parseFloat(this.dataset.scale);
        setTextScale(scale);

        document.querySelectorAll('[data-scale]').forEach(b =>
            b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', function() {
        const theme = this.dataset.theme;

        if (theme === "default") {

            document.documentElement.classList.remove(
                'dark-theme', 'beige-theme', 'blue-theme'
            );

            document.querySelectorAll('[data-theme]').forEach(b =>
                b.classList.remove('active'));

            localStorage.removeItem('colorTheme');
            this.classList.add('active');
            return;
        }


        document.documentElement.classList.remove(
            'dark-theme', 'beige-theme', 'blue-theme'
        );
        document.documentElement.classList.add(`${theme}-theme`);

        document.querySelectorAll('[data-theme]').forEach(b =>
            b.classList.remove('active'));
        this.classList.add('active');

        localStorage.setItem('colorTheme', theme);
    });
});

document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', function() {
        const theme = this.dataset.theme;
        setTheme(theme);

        document.querySelectorAll('[data-theme]').forEach(b =>
            b.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelector('.toggle-images-btn').addEventListener('click', function() {
    const imagesDisabled = !this.classList.toggle('active');

    if (imagesDisabled) {
        document.body.classList.add('no-images');
    } else {
        document.body.classList.remove('no-images');
    }

    document.querySelectorAll('img, svg, .icon').forEach(el => {
        if (imagesDisabled) {
            el.dataset.originalDisplay = el.style.display || '';
            el.style.display = 'none';

            if (el.alt) {
                const desc = document.createElement('div');
                desc.className = 'image-alt-text';
                desc.textContent = el.alt;
                el.parentNode.insertBefore(desc, el.nextSibling);
            }
        } else {
            el.style.display = el.dataset.originalDisplay || '';
            document.querySelectorAll('.image-alt-text').forEach(d => d.remove());
        }
    });

    localStorage.setItem('imagesDisabled', imagesDisabled);
});

document.addEventListener('DOMContentLoaded', () => {
    const savedScale = localStorage.getItem('textScale') || '1';
    setTextScale(savedScale);
    document.querySelector(`[data-scale="${savedScale}"]`)?.classList.add('active');

    const savedTheme = localStorage.getItem('colorTheme');
    if (savedTheme) {
        const themeBtn = document.querySelector(`[data-theme="${savedTheme}"]`);
        if (themeBtn) themeBtn.click();
    }

    if (localStorage.getItem('imagesDisabled') === 'true') {
        document.querySelector('.toggle-images-btn').classList.add('active');
        document.body.classList.add('no-images');
    }
});