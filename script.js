const navToggle = document.querySelector('.nav-toggle');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();

    if (navToggle) navToggle.checked = false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView();
      return;
    }

    const startPosition = window.scrollY;
    const targetPosition = target.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    const duration = 700;
    let startTime;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  });
});

const siteHeader = document.querySelector('.site-header');
let previousScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;

  if (currentScrollY <= 16 || currentScrollY < previousScrollY) {
    siteHeader.classList.remove('is-hidden');
  } else if (currentScrollY > previousScrollY) {
    siteHeader.classList.add('is-hidden');
  }

  previousScrollY = currentScrollY;
}, { passive: true });

const contactForm = document.querySelector('.contact form');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector('.form-status');

  submitButton.disabled = true;
  status.classList.add('is-visible');
  status.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: {
        Accept: 'application/json'
      }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send your message.');
    }

    status.textContent = "Thank you, I'll be in touch.";
    contactForm.reset();
    setTimeout(() => {
      status.classList.remove('is-visible');
      status.textContent = '';
    }, 3000);
  } catch (error) {
    status.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});