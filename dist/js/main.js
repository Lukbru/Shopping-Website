import { updateCartCounter } from './cart.js';
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
});
document.addEventListener('DOMContentLoaded', () => {
    const openLogin = document.getElementById('openLogin');
    const panel = document.getElementById('loginWindow');
    const overlay = document.getElementById('loginOverlay');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    const submit = document.getElementById('loginSubmit');
    const message = document.getElementById('loginMessage');
    openLogin === null || openLogin === void 0 ? void 0 : openLogin.addEventListener('click', (e) => {
        e.preventDefault();
        panel === null || panel === void 0 ? void 0 : panel.classList.remove('hidden');
    });
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', () => {
        panel === null || panel === void 0 ? void 0 : panel.classList.add('hidden');
    });
    togglePassword === null || togglePassword === void 0 ? void 0 : togglePassword.addEventListener('click', () => {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
    submit === null || submit === void 0 ? void 0 : submit.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password) {
            message.textContent = 'Fill all the forms';
            setTimeout(() => { message.textContent = ''; }, 3500);
            message.style.color = 'red';
            return;
        }
        if (!emailRegex.test(email)) {
            message.textContent = 'Invalid email format';
            setTimeout(() => { message.textContent = ''; }, 3500);
            message.style.color = 'red';
            return;
        }
        message.textContent = 'Login successful';
        message.style.color = 'green';
        setTimeout(() => { message.textContent = ''; }, 1500);
        setTimeout(() => { panel === null || panel === void 0 ? void 0 : panel.classList.add('hidden'); }, 1500);
    });
});
