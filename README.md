# Cursach
# Макет
[![Figma Preview](https://img.shields.io/badge/Figma-Preview-0ACF83?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/GK6DNhhC3nPrcKYAilSbBM/ROCC--Copy-?node-id=0-1&p=f&t=vbazjZQiTCk7f1ww-0)

# Запуск
Зависимости node v21.5.0 [скачать](https://nodejs.org/en/blog/release/v21.5.0), npm 10.2.4 [скачать](https://www.npmjs.com/package/npm/v/10.2.4)

### Установка и запуск

```
1. Склонируйте репозиторий:
git clone https://github.com/bog-danius/Cursach.git

2. Перейдите в директорию проекта:
cd ./cur/Cursach

3. Установите зависимости:
npm install

4. Запустите серверы в разных терминалах:
# В первом терминале:
json-server --watch cotalog.json
# Во втором терминале:
npm run dev

5. Откройте приложение в браузере:
http://localhost:5173/