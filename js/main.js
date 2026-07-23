// ==============================
// Main JavaScript File
// Controls the website's interactive features.
// ==============================

// Mobile Menu
// Shows or hides the navigation menu on small screens.
const navToggleBtn = document.getElementById('navToggleBtn');
const mobileMenu = document.getElementById('mobileMenu');
const iconHamburger = document.getElementById('iconHamburger');
const iconClose = document.getElementById('iconClose');

navToggleBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');

  // Show or hide the menu
  mobileMenu.classList.toggle('hidden');

  // Switch between menu and close icons
  iconHamburger.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');

  // Update accessibility status
  navToggleBtn.setAttribute('aria-expanded', String(!isOpen));
});

// ==============================
// Project Modals
// Opens and closes the project details window.
// ==============================

// Get all project buttons and modals
const projectCardBtns = document.querySelectorAll('.project-card-btn');
const projectModals = document.querySelectorAll('.project-modal');

// Stores the last selected element
let lastFocusedElement = null;

/**
 * Gets all clickable elements inside the modal.
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

/**
 * Opens the selected project modal.
 * @param {string} projectId
 * @param {HTMLElement} triggerEl
 */
function openModal(projectId, triggerEl) {
  const modal = document.getElementById(`modal-${projectId}`);
  if (!modal) return;

  lastFocusedElement = triggerEl || document.activeElement;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');

  // Focus on the close button
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

/**
 * Closes the selected modal.
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');

  // Return focus to the previous element
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/**
 * Keeps keyboard focus inside the modal.
 * @param {KeyboardEvent} e
 * @param {HTMLElement} modal
 */
function trapFocus(e, modal) {
  if (e.key !== 'Tab') return;

  const focusable = getFocusableElements(modal);
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// Open the selected project
projectCardBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const projectId = btn.getAttribute('data-project');
    openModal(projectId, btn);
  });
});

// Close the modal when the user clicks the close button or background
projectModals.forEach((modal) => {
  const closeBtns = modal.querySelectorAll('.modal-close-btn');
  const backdrop = modal.querySelector('.modal-backdrop');

  closeBtns.forEach((btn) =>
    btn.addEventListener('click', () => closeModal(modal))
  );

  backdrop.addEventListener('click', () => closeModal(modal));

  // Keep keyboard navigation inside the modal
  modal.addEventListener('keydown', (e) => trapFocus(e, modal));
});

// Close the modal when Escape is pressed
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
// Contact Form
// Validates user input before submission.
// ==============================

const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

// Checks if the email format is valid
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\\.[a-zA-Z]{2,}$/;

/**
 * Displays a message on the form.
 * @param {string} message
 * @param {'error'|'success'} type
 */
function showFormAlert(message, type) {
  formAlert.textContent = message;
  formAlert.classList.remove(
    'hidden',
    'bg-red-100',
    'text-red-700',
    'bg-green-100',
    'text-green-700'
  );

  if (type === 'error') {
    formAlert.classList.add('bg-red-100', 'text-red-700');
  } else {
    formAlert.classList.add('bg-green-100', 'text-green-700');
  }
}

/** Hides the form message. */
function hideFormAlert() {
  formAlert.classList.add('hidden');
  formAlert.textContent = '';
}

contactForm.addEventListener('submit', (e) => {
  // Prevent page refresh
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Remove extra spaces from the input
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Check if all fields are filled
  if (!name || !email || !message) {
    showFormAlert('Please fill in all fields before submitting.', 'error');
    return;
  }

  // Check if the email is valid
  if (!EMAIL_REGEX.test(email)) {
    showFormAlert('Please enter a valid email address.', 'error');
    return;
  }

  // Show success message
  showFormAlert('Your message has been sent successfully!', 'success');
  alert('Your message has been sent successfully!');
  contactForm.reset();
});

// ==============================
// Portfolio Background
// Changes the background color when a title is clicked.
// ==============================

const projectTitles = document.querySelectorAll('.project-title');
const portfolioSection = document.getElementById('portfolio');

// List of background colors
const PORTFOLIO_BG_COLORS = [
  'bg-white',
  'bg-indigo-300',
  'bg-amber-300',
  'bg-emerald-300',
  'bg-rose-300',
];

// Current background color
let portfolioBgIndex = 0;

// Change to the next background color
function cyclePortfolioBg() {
  // Remove the current color
  portfolioSection.classList.remove(PORTFOLIO_BG_COLORS[portfolioBgIndex]);

  // Move to the next color
  portfolioBgIndex = (portfolioBgIndex + 1) % PORTFOLIO_BG_COLORS.length;

  // Apply the new color
  portfolioSection.classList.add(PORTFOLIO_BG_COLORS[portfolioBgIndex]);
}

// Change color when a project title is clicked
projectTitles.forEach((title) => {
  title.addEventListener('click', cyclePortfolioBg);
});

// ==============================
// Scroll Animation
// Shows elements with an animation when they appear on the screen.
// ==============================

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Show or hide the animation
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  {
    // Trigger animation when 15% is visible
    threshold: 0.15,
  }
);

revealElements.forEach((el) => revealObserver.observe(el));