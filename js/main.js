// ==============================
// main.js
// Handles global site behavior.
// Currently: mobile navbar toggle.
// ==============================

// --- Mobile Navbar Toggle ---
const navToggleBtn = document.getElementById('navToggleBtn');
const mobileMenu = document.getElementById('mobileMenu');
const iconHamburger = document.getElementById('iconHamburger');
const iconClose = document.getElementById('iconClose');

navToggleBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');

  // Toggle menu visibility
  mobileMenu.classList.toggle('hidden');

  // Toggle hamburger/close icons
  iconHamburger.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');

  // Update aria-expanded for accessibility
  navToggleBtn.setAttribute('aria-expanded', String(!isOpen));
});


// ==============================
// Project Modal Open/Close
// ==============================

// Grab all "View Details" buttons and all modals once
const projectCardBtns = document.querySelectorAll('.project-card-btn');
const projectModals = document.querySelectorAll('.project-modal');

/**
 * Opens a modal by its project id (matches data-project -> #modal-{id})
 * @param {string} projectId
 */
function openModal(projectId) {
  const modal = document.getElementById(`modal-${projectId}`);
  if (!modal) return;

  modal.classList.remove('hidden');
  modal.classList.add('flex'); // switch to flex so items-center/justify-center apply
  document.body.classList.add('overflow-hidden'); // prevent background scroll
}

/**
 * Closes a specific modal element
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}

// Open modal when a "View Details" button is clicked
projectCardBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const projectId = btn.getAttribute('data-project');
    openModal(projectId);
  });
});

// Close modal via close button (X) or backdrop click
projectModals.forEach((modal) => {
  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');

  closeBtn.addEventListener('click', () => closeModal(modal));
  backdrop.addEventListener('click', () => closeModal(modal));
});

// Close any open modal when Escape key is pressed
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    projectModals.forEach((modal) => {
      if (!modal.classList.contains('hidden')) {
        closeModal(modal);
      }
    });
  }
});


// ==============================
// Contact Form Validation
// ==============================

const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

// Simple, standard-enough email pattern for client-side checks
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Displays a message in the form alert box.
 * @param {string} message - Text to display
 * @param {'error'|'success'} type - Determines the alert's color styling
 */
function showFormAlert(message, type) {
  formAlert.textContent = message;
  formAlert.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');

  if (type === 'error') {
    formAlert.classList.add('bg-red-100', 'text-red-700');
  } else {
    formAlert.classList.add('bg-green-100', 'text-green-700');
  }
}

/** Hides the form alert box and resets its styling */
function hideFormAlert() {
  formAlert.classList.add('hidden');
  formAlert.textContent = '';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default page reload/navigation

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // --- Required field checks ---
  if (!name || !email || !message) {
    showFormAlert('Please fill in all fields before submitting.', 'error');
    return;
  }

  // --- Email format check ---
  if (!EMAIL_REGEX.test(email)) {
    showFormAlert('Please enter a valid email address.', 'error');
    return;
  }

  // --- All checks passed ---
  showFormAlert('Your message has been sent successfully!', 'success');
  contactForm.reset();
});


// ==============================
// Portfolio Title Click - Background Color Cycle
// ==============================

const portfolioTitle = document.getElementById('portfolioTitle');
const portfolioSection = document.getElementById('portfolio');

// Pool of Tailwind background classes to cycle through on click
const PORTFOLIO_BG_COLORS = [
  'bg-white',
  'bg-indigo-300',
  'bg-amber-300',
  'bg-emerald-300',
  'bg-rose-300',
];

let portfolioBgIndex = 0; // tracks current color position in the array

portfolioTitle.addEventListener('click', () => {
  // Remove the current background color class
  portfolioSection.classList.remove(PORTFOLIO_BG_COLORS[portfolioBgIndex]);

  // Advance to the next color, wrapping back to 0 at the end
  portfolioBgIndex = (portfolioBgIndex + 1) % PORTFOLIO_BG_COLORS.length;

  // Apply the new background color class
  portfolioSection.classList.add(PORTFOLIO_BG_COLORS[portfolioBgIndex]);
});

// ==============================
// Scroll Reveal Animation
// Uses IntersectionObserver to add
// .visible to .reveal elements once
// they enter the viewport.
// ==============================

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
      // Toggle 'visible' on/off based on whether the element is currently
      // in the viewport, so the animation replays each time it scrolls into view.
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.15 } // trigger when ~15% of the element is visible
);

revealElements.forEach((el) => revealObserver.observe(el));