// common.js
// Shared utilities for Lovelace Research website
// -------------------------------------------------
// 1. Email copy to clipboard with tooltip feedback
// 2. Mobile navigation toggle

(function () {
  'use strict';

  /**
   * Attach copy-to-clipboard behaviour to the given email link + tooltip elements.
   *
   * @param {string} containerSelector Selector for the wrapper that owns the link / tooltip elements.
   * @param {string} linkId            The id of the <a> element holding data-email.
   * @param {string} hoverId           The id of the tooltip that shows "Copy email".
   * @param {string} copiedId          The id of the tooltip that shows "Copied!".
   */
  function attachEmailCopy(containerSelector, linkId, hoverId, copiedId) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const linkEl = document.getElementById(linkId);
    const hoverEl = document.getElementById(hoverId);
    const copiedEl = document.getElementById(copiedId);

    if (!linkEl || !hoverEl || !copiedEl) return;

    // Copy to clipboard on click
    linkEl.addEventListener('click', (e) => {
      e.preventDefault();
      const email = linkEl.getAttribute('data-email');
      if (!email) return;
      navigator.clipboard.writeText(email)
        .then(() => {
          hoverEl.style.opacity = '0';
          copiedEl.classList.add('show');
          setTimeout(() => copiedEl.classList.remove('show'), 2000);
        })
        .catch((err) => console.error('Could not copy text: ', err));
    });

    // Show / hide tooltip helpers
    container.addEventListener('mouseenter', () => {
      if (!copiedEl.classList.contains('show')) {
        hoverEl.style.opacity = '1';
      }
    });

    container.addEventListener('mouseleave', () => {
      hoverEl.style.opacity = '0';
    });
  }

  /**
   * Initialise global behaviours attached to the DOM.
   */
  function initGlobalUI() {
    // Attach email copy behaviour (desktop + mobile)
    attachEmailCopy('.sidebar .email-container', 'email-link', 'hover-tooltip', 'copied-message');
    attachEmailCopy('.mobile-nav-menu .email-container', 'email-link-mobile', 'hover-tooltip-mobile', 'copied-message-mobile');

    // Mobile navigation toggle
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
    if (mobileNavContainer && mobileNavTrigger) {
      mobileNavTrigger.addEventListener('click', () => {
        mobileNavContainer.classList.toggle('is-open');
      });
    }
  }

  // Wait for DOM to be ready before initialising
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalUI);
  } else {
    // DOM already ready (e.g. when script is placed at end of body with defer)
    initGlobalUI();
  }
})();
