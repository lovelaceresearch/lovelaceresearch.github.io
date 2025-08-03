// common.js - shared interactions for Lovelace Research site

(function () {
  'use strict';

  //--------------------------------------------------------------
  // Helper – copy email address to clipboard and show feedback
  //--------------------------------------------------------------
  function setupEmailCopy(anchorId, tooltipId, copiedId) {
    const anchor  = document.getElementById(anchorId);
    const tooltip = document.getElementById(tooltipId);
    const copied  = document.getElementById(copiedId);

    if (!anchor) return;

    // Show “Copy email” tooltip on hover (desktop only)
    anchor.addEventListener('mouseenter', () => {
      tooltip && (tooltip.style.opacity = 1);
    });
    anchor.addEventListener('mouseleave', () => {
      tooltip && (tooltip.style.opacity = 0);
    });

    // Copy on click (desktop & mobile)
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const email = anchor.dataset.email || anchor.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copied && (copied.style.opacity = 1);
        setTimeout(() => copied && (copied.style.opacity = 0), 1500);
      });
    });
  }

  //--------------------------------------------------------------
  // Helper – mobile navigation toggle
  //--------------------------------------------------------------
  function setupMobileNav() {
    const trigger = document.querySelector('.mobile-nav-trigger');
    const menu    = document.querySelector('.mobile-nav-menu');
    const icon    = trigger ? trigger.querySelector('.icon') : null;

    if (!trigger || !menu) return;

    trigger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      if (icon) icon.textContent = open ? '−' : '+'; // show minus when open
    });
  }

  //--------------------------------------------------------------
  // Kick things off once DOM is ready
  //--------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupEmailCopy('email-link', 'hover-tooltip', 'copied-message');
    setupEmailCopy('email-link-mobile', 'hover-tooltip-mobile', 'copied-message-mobile');
    setupMobileNav();
  });
})();
