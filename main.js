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
