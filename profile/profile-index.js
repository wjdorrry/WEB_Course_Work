import "../style2.css"
import "../src/css/footer-style.css"
import "../src/css/header-style.css"
import "../src/css/basic-style.css"
import "../src/css/style-profile.css"

import "../src/js/components/header.js"
import "../src/js/components/footer.js"

const USERS_URL = "http://localhost:3000/users";
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
const userId = loggedInUser?.id;

const avatarImg = document.getElementById('profile-avatar');
const nicknameInput = document.getElementById('nickname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const saveBtn = document.getElementById('save-btn');
const messageDiv = document.getElementById('message');

async function loadUserData() {
    if (!userId) {
        showMessage('Please login first', 'error');
        return;
    }

    try {
        const response = await fetch(`${USERS_URL}/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to load user data');
        }

        const user = await response.json();
        console.log('User data from server:', user);

        nicknameInput.value = user.nickname || loggedInUser.nickname || '';
        emailInput.value = user.email || loggedInUser.email || '';
        phoneInput.value = user.phone || loggedInUser.phone || '';

        if (user.avatarUrl) {
            avatarImg.src = user.avatarUrl;
        }
    } catch (error) {
        console.log('Using data from localStorage');
        nicknameInput.value = loggedInUser.nickname || '';
        emailInput.value = loggedInUser.email || '';
        phoneInput.value = loggedInUser.phone || '';

        showMessage('Using cached data. ' + error.message, 'error');
        console.error('Error loading user data:', error);
    }
}

function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = type;
    setTimeout(() => messageDiv.textContent = '', 5000);
}

saveBtn.addEventListener('click', async () => {
    if (!nicknameInput.value || !emailInput.value || !phoneInput.value) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    const updatedData = {
        nickname: nicknameInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    };

    if (passwordInput.value) {
        if (passwordInput.value.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        updatedData.password = passwordInput.value;
    }

    try {
        const response = await fetch(`${USERS_URL}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }

        showMessage('Profile updated successfully!');
        passwordInput.value = '';

    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
        console.error('Error updating profile:', error);
    }
});

if (!userId) {
    showMessage('Please login first', 'error');
    console.error('No userId found in localStorage');
} else {
    document.addEventListener('DOMContentLoaded', loadUserData);
}