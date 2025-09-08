document.addEventListener('DOMContentLoaded', function () {
    const nicknameInput = document.getElementById('nickname_gen');
    const generateBtn = document.querySelector('.btn-name-for-nickname');

    function generateNickname() {
        const vowels = 'aeiouy'.split('');
        const consonants = 'bcdfghjklmnpqrstvwxz'.split('');
        const length = Math.floor(Math.random() * 4) + 5;
        let nickname = [];

        for (let i = 0; i < length; i++) {
            let char = (i === 0 || consonants.includes(nickname[i - 1]))
                ? vowels[Math.floor(Math.random() * vowels.length)]
                : consonants[Math.floor(Math.random() * consonants.length)];
            nickname.push(char);
        }

        nickname[0] = nickname[0].toUpperCase();
        return nickname.join('');
    }

    generateBtn.addEventListener('click', () => {
        nicknameInput.value = generateNickname();
    });

    nicknameInput.value = generateNickname();
});