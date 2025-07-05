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
