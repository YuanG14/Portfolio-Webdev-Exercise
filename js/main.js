// ==============================
// main.js
// Handles global site behavior.
// Currently: mobile navbar toggle.
// ==============================

// --- Mobile Navbar Toggle ---
// In plain terms: one button, one job — if the mobile menu is
// currently hidden, show it; if it's showing, hide it. Same idea
// for swapping which icon (hamburger vs X) is visible.
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
//
// In plain terms: each "View Details" button has a little tag
// (data-project="1", "2", or "3"). Each modal has a matching name
// (modal-1, modal-2, modal-3). One function reads the button's
// tag and opens the modal with that same number — so we don't
// need three separate copies of this code, one per project.
// ==============================

// Grab all "View Details" buttons and all modals once
const projectCardBtns = document.querySelectorAll('.project-card-btn');
const projectModals = document.querySelectorAll('.project-modal');

// Tracks the element that had focus before a modal was opened,
// so we can return focus to it when the modal closes (accessibility).
let lastFocusedElement = null;

/**
 * Returns the focusable elements within a container (used for the Tab focus trap)
 * In plain terms: finds every clickable/typeable thing inside the modal
 * (links, buttons, inputs) so we know what Tab should be allowed to land on.
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')
  );
}

/**
 * Opens a modal by its project id (matches data-project -> #modal-{id})
 * In plain terms: shows the popup, remembers which button opened it
 * (so we can return focus there later), and moves keyboard focus
 * into the popup so keyboard/screen reader users land there right away.
 * @param {string} projectId
 * @param {HTMLElement} triggerEl - the button that triggered the open, for focus return
 */
function openModal(projectId, triggerEl) {
  const modal = document.getElementById(`modal-${projectId}`);
  if (!modal) return;

  lastFocusedElement = triggerEl || document.activeElement;

  modal.classList.remove('hidden');
  modal.classList.add('flex'); // switch to flex so items-center/justify-center apply
  document.body.classList.add('overflow-hidden'); // prevent background scroll

  // Move focus to the modal's close button so keyboard/screen reader
  // users land inside the dialog immediately
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

/**
 * Closes a specific modal element and returns focus to the trigger
 * In plain terms: hides the popup and puts keyboard focus back on
 * whatever button opened it, so the user doesn't lose their place.
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');

  // Return focus to whatever opened the modal
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/**
 * Traps Tab/Shift+Tab focus within the currently open modal
 * In plain terms: while the popup is open, pressing Tab loops around
 * inside just the popup, instead of tabbing out into the rest of the page.
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

// Open modal when a "View Details" button is clicked
projectCardBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const projectId = btn.getAttribute('data-project');
    openModal(projectId, btn);
  });
});

// Close modal via close button (X or bottom "Close" button) or backdrop click
// In plain terms: there are now 2 buttons that close each modal (the X icon
// and the bottom "Close" button), plus clicking the dark background also closes it.
projectModals.forEach((modal) => {
  const closeBtns = modal.querySelectorAll('.modal-close-btn'); // now 2 per modal: top X icon + bottom Close button
  const backdrop = modal.querySelector('.modal-backdrop');

  closeBtns.forEach((btn) => btn.addEventListener('click', () => closeModal(modal)));
  backdrop.addEventListener('click', () => closeModal(modal));

  // Keep Tab navigation trapped inside this modal while it's open
  modal.addEventListener('keydown', (e) => trapFocus(e, modal));
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
//
// In plain terms: when Send Message is clicked, this checks the form
// like a checklist — are any fields empty? Does the email look valid?
// Only if both checks pass does it show a success message.
// ==============================

const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

// Simple, standard-enough email pattern for client-side checks
// In plain terms: checks that the email has a proper "name@domain.extension"
// shape — no double dots, no missing ".com"-style ending, no weird symbols
// in the wrong spot.
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

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
  e.preventDefault(); // Stops the page from doing its normal reload/refresh on submit

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // .trim() removes extra spaces, so typing just spaces doesn't count as "filled in"
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
  alert('Your message has been sent successfully!'); // literal browser alert, as required by assignment spec
  contactForm.reset();
});


// ==============================
// Portfolio Title Click - Background Color Cycle
//
// In plain terms: keeps a running number for "which color are we on."
// Every click moves to the next color in the list, and once it reaches
// the end, it wraps back around to the first one again (like a clock
// hand going back to 12).
// ==============================

const projectTitles = document.querySelectorAll('.project-title');
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

// Cycles the portfolio section's background to the next color in the pool
function cyclePortfolioBg() {
  // Remove the current background color class
  portfolioSection.classList.remove(PORTFOLIO_BG_COLORS[portfolioBgIndex]);

  // Advance to the next color, wrapping back to 0 at the end
  portfolioBgIndex = (portfolioBgIndex + 1) % PORTFOLIO_BG_COLORS.length;

  // Apply the new background color class
  portfolioSection.classList.add(PORTFOLIO_BG_COLORS[portfolioBgIndex]);
}

// Any project title (Project One, Project Two, Project Three) triggers the color cycle
projectTitles.forEach((title) => {
  title.addEventListener('click', cyclePortfolioBg);
});


// ==============================
// Scroll Reveal Animation
// Uses IntersectionObserver to add
// .visible to .reveal elements once
// they enter the viewport.
//
// In plain terms: the browser itself tells us "this card just became
// visible on screen" or "it just left the screen" — we just add or
// remove one class based on that. The actual fade/slide animation is
// all handled by CSS (see .reveal in style.css), not JavaScript.
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
