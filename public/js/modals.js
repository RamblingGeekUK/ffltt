// Improved accessibility fix: prevent aria-hidden on focused modals, use inert for background
document.addEventListener('DOMContentLoaded', function () {
  const modals = [
    document.getElementById('faqModal'),
    document.getElementById('feedbackModal')
  ];
  // Select all siblings of modals' parent to inert when modal is open
  function getBackgroundElements(modal) {
    const all = Array.from(document.body.children);
    return all.filter(el => el !== modal && !el.classList.contains('modal-backdrop'));
  }
  modals.forEach(modal => {
    if (!modal) return;
    modal.addEventListener('show.bs.modal', function () {
      // Remove aria-hidden if present
      modal.removeAttribute('aria-hidden');
      // Inert all background content
      getBackgroundElements(modal).forEach(el => el.setAttribute('inert', ''));
    });
    modal.addEventListener('hidden.bs.modal', function () {
      // Only set aria-hidden when hidden
      modal.setAttribute('aria-hidden', 'true');
      // Remove inert from background
      getBackgroundElements(modal).forEach(el => el.removeAttribute('inert'));
    });
  });
});
// Shared modal logic for FAQ and Feedback
// Assumes Bootstrap 5 is loaded

// Remove any Turnstile/CAPTCHA logic and feedback form submission
// Feedback modal now only provides a link to GitHub Issues

// Re-render Turnstile widgets after modals are injected
document.addEventListener('DOMContentLoaded', function () {
  // No feedback or creator forms anymore; see modals.html for GitHub issue instructions.
});

// Also re-render Turnstile widgets after modals are dynamically loaded
document.addEventListener('modalsLoaded', function () {
  // No feedback or creator forms anymore; see modals.html for GitHub issue instructions.
});
