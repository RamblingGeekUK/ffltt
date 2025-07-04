// Shared modal logic for FAQ and Feedback
// Assumes Bootstrap 5 and Cloudflare Turnstile are loaded

// Ensure Turnstile script is loaded in <head> in your HTML:
// <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

function renderTurnstiles() {
  if (window.turnstile && document.querySelectorAll('.cf-turnstile').length) {
    document.querySelectorAll('.cf-turnstile').forEach(el => {
      if (!el.hasAttribute('data-rendered')) {
        window.turnstile.render(el, { sitekey: el.getAttribute('data-sitekey') });
        el.setAttribute('data-rendered', 'true');
      }
    });
  }
}

// Re-render Turnstile widgets after modals are injected
document.addEventListener('DOMContentLoaded', function () {
  renderTurnstiles();
  // Feedback form validation and submission
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      feedbackForm.classList.add('was-validated');
      const name = feedbackForm.fbName.value.trim();
      const email = feedbackForm.fbEmail.value.trim();
      const message = feedbackForm.fbMessage.value.trim();
      const turnstileToken = window.turnstile && window.turnstile.getResponse ? window.turnstile.getResponse() : '';
      const statusDiv = document.getElementById('feedbackStatus');
      const captchaError = document.getElementById('captchaError');
      captchaError.style.display = 'none';
      statusDiv.textContent = '';
      if (!name || !email || !message) return;
      if (!turnstileToken) {
        captchaError.style.display = 'block';
        return;
      }
      statusDiv.textContent = 'Sending...';
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message, turnstileToken })
        });
        const data = await res.json();
        if (data.success) {
          statusDiv.textContent = 'Thank you for your feedback!';
          feedbackForm.reset();
          feedbackForm.classList.remove('was-validated');
          if (window.turnstile && window.turnstile.reset) window.turnstile.reset();
        } else {
          statusDiv.textContent = data.error || 'Submission failed.';
        }
      } catch (err) {
        statusDiv.textContent = 'Submission failed.';
      }
    });
  }
});

// Also re-render Turnstile widgets after modals are dynamically loaded
document.addEventListener('modalsLoaded', renderTurnstiles);
