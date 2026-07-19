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
