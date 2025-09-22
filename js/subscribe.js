// Accessible newsletter form UX (client-side only)
(function(){
  const form = document.getElementById('subscribe-form');
  const status = document.getElementById('subscribe-status');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      status.classList.remove('visually-hidden');
      status.textContent = 'Please fix the form errors and try again.';
      return;
    }

    // Simulate a POST (replace with real fetch later)
    const data = Object.fromEntries(new FormData(form).entries());
    await new Promise(r => setTimeout(r, 400));

    status.classList.remove('visually-hidden');
    status.textContent = `Thanks, ${data.name || 'friend'}! You’re subscribed.`;
    form.reset();
    form.classList.remove('was-validated');
  });
})();