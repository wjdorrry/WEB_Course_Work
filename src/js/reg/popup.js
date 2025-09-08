document.addEventListener('DOMContentLoaded', function () {
    const openModalLink = document.getElementById('openModal');
    const popup = document.getElementById('privacyPopup');
    const closePopup = document.getElementById('closePopup');
    const body = document.body;

    openModalLink.addEventListener('click', function (e) {
        e.preventDefault();
        popup.style.display = 'block'
        body.style.overflow = 'hidden';
    });

    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
        body.style.overflow = '';
    });

    window.addEventListener('click', function (e) {
        if (e.target === popup) {
            popup.style.display = 'none';
            body.style.overflow = '';
        }
    });
});