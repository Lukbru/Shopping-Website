"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('contactFeedback');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const topic = document.getElementById('contactTopic').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !topic || !message) {
            feedback.textContent = 'Fill all the forms';
            setTimeout(() => { feedback.textContent = ''; }, 4500);
            feedback.style.color = 'red';
            return;
        }
        if (!emailRegex.test(email)) {
            feedback.textContent = 'Invalid email format';
            setTimeout(() => { feedback.textContent = ''; }, 4500);
            feedback.style.color = 'red';
            return;
        }
        feedback.textContent = 'Success message';
        setTimeout(() => { feedback.textContent = ''; }, 8500);
        feedback.style.color = 'green';
        form.reset();
    });
});
