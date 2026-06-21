document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm') as HTMLFormElement;
  const feedback = document.getElementById('contactFeedback')!;

  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = (document.getElementById('contactName') as HTMLInputElement).value.trim();
    const email = (document.getElementById('contactEmail') as HTMLInputElement).value.trim();
    const topic = (document.getElementById('contactTopic') as HTMLInputElement).value.trim();
    const message = (document.getElementById('contactMessage') as HTMLTextAreaElement).value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !topic || !message) {
      feedback.textContent = 'Fill all the forms';
      setTimeout(()=>{feedback.textContent = ''}, 4500);
      feedback.style.color = 'red';
      return;
    }
    if (!emailRegex.test(email)) {
      feedback.textContent = 'Invalid email format';
      setTimeout(()=>{feedback.textContent = ''}, 4500);
      feedback.style.color = 'red';
      return;
    }
    feedback.textContent = 'Success message';
    setTimeout(()=>{feedback.textContent = ''}, 8500);
    feedback.style.color = 'green';

    form.reset();
  });
});
