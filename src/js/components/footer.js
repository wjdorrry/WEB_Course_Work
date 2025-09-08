import Inst from "../../img/instagram.svg";
import Facebook from "../../img/facebook.svg";

class ComponentFooter extends HTMLElement {
    constructor() {
        super();
        console.log('Footer created, initial render');
        this.render();
    }

    render() {
        this.innerHTML = `
          <footer class="footer">
    <div class="header-logo">
        <img src="../../src/img/f_31061dc1e375ab34 1.png" alt="Логотип"/>
    </div>
    <nav class="header-nav">
        <a href="#about" class="footer-nav_link">О нас</a>
        <a href="#catalog" class="footer-nav_link">Каталог</a>
        <a href="#certs" class="footer-nav_link">Сертификаты</a>
        <a href="#reviews" class="footer-nav_link">Отзывы</a>
        <a href="#contacts" class="footer-nav_link">Контакты</a>
    </nav>
    <div class="header-phone">
        <img src="../../src/img/f_02261dce3273ad9e 1.png" height="51" width="187"/></div>
</footer>
        `;
    }
}

customElements.define('widget-footer', ComponentFooter);