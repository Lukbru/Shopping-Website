import { updateCartCounter } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();
});


document.addEventListener('DOMContentLoaded', () => {
const openLogin = document.getElementById('openLogin');
const panel = document.getElementById('loginWindow');
const overlay = document.getElementById('loginOverlay');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;
const submit = document.getElementById('loginSubmit');
const message = document.getElementById('loginMessage');

openLogin?.addEventListener('click', (e)=>{
    e.preventDefault();
    panel?.classList.remove('hidden');
});

overlay?.addEventListener('click', ()=>{
    panel?.classList.add('hidden');
});

togglePassword?.addEventListener('click', ()=>{
    passwordInput.type = passwordInput.type === 'password' ?'text' :'password';
});


submit?.addEventListener('click', (e)=>{
    e.preventDefault();
    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
        message!.textContent = 'Fill all the forms';
        setTimeout(() => {message!.textContent = ''}, 3500);
        message!.style.color = 'red';
        return;
    }
    if (!emailRegex.test(email)) {
        message!.textContent = 'Invalid email format';
        setTimeout(() => {message!.textContent = ''}, 3500);
        message!.style.color = 'red';
        return;
    }

    message!.textContent = 'Login successful';
    message!.style.color = 'green';
    setTimeout(() => {message!.textContent = ''}, 1500);
    setTimeout(() => {panel?.classList.add('hidden');}, 1500);
});
});