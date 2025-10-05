const NAV_LINKS = [
  { href: 'prototypes.html', label: 'Prototype' },
  { href: 'paradigm.html', label: 'Paradigm' },
  { href: 'product.html', label: 'Product' },
  { href: 'about.html', label: 'About' }
];

const EMAIL_ADDRESS = 'office@lovelace-research.com';

function getCurrentPage() {
  const { pathname } = window.location;
  if (!pathname || pathname === '/' || pathname.endsWith('/')) {
    return 'index.html';
  }
  const parts = pathname.split('/').filter(Boolean);
  const last = parts.at(-1) ?? 'index.html';
  return last || 'index.html';
}

function renderSidebar() {
  const container = document.querySelector('[data-component="sidebar"]');
  if (!container) return;

  const navItems = NAV_LINKS
    .map((link) => `<li><a data-nav-link href="${link.href}">${link.label}</a></li>`)
    .join('');

  container.innerHTML = `
    <div class="sidebar-block" style="border-radius: 4px;">
      <a href="index.html" class="sidebar-title">Lovelace Research</a>
      <p class="sidebar-subtitle">Independent research-led innovation lab for personal &amp; humane AI</p>
    </div>
    <div class="sidebar-block" style="border-radius: 4px;">
      <nav class="sidebar-nav">
        <ul>${navItems}</ul>
      </nav>
    </div>
    <div class="page-nav-block" data-page-nav hidden></div>
    <div class="sidebar-block sidebar-block--footer" style="border-radius: 4px;">
      <div class="sidebar-contact">
        <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
        ${renderEmailCopy()}
      </div>
    </div>
  `;
}

function renderMobileNav() {
  const container = document.querySelector('[data-component="mobile-nav"]');
  if (!container) return;

  const navItems = NAV_LINKS
    .map((link) => `<li><a data-nav-link href="${link.href}">${link.label}</a></li>`)
    .join('');

  container.innerHTML = `
    <div class="mobile-nav-menu">
      <div class="sidebar-block" style="border-radius: 4px;">
        <div class="sidebar-contact">
          <a href="https://instagram.com/lovelaceresearch" target="_blank" rel="noopener noreferrer">IG</a>
          ${renderEmailCopy()}
        </div>
      </div>
      <div class="sidebar-block" style="border-radius: 4px;">
        <nav class="mobile-nav">
          <ul>${navItems}</ul>
        </nav>
      </div>
    </div>
    <div class="mobile-nav-trigger">
      <div class="mobile-nav-trigger-content">
        <div class="mobile-nav-title">
          <a href="index.html" class="sidebar-title">Lovelace Research</a>
          <p class="sidebar-subtitle mobile-only">Independent research-led innovation lab for personal &amp; humane AI</p>
        </div>
        <span class="icon">+</span>
      </div>
    </div>
  `;

  const trigger = container.querySelector('.mobile-nav-trigger');
  if (trigger) {
    trigger.addEventListener('click', () => {
      container.classList.toggle('is-open');
    });
  }

  container.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      container.classList.remove('is-open');
    });
  });
}

function renderFooter() {
  const containers = document.querySelectorAll('[data-component="footer"]');
  if (!containers.length) return;

  const template = `
    <div class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="logo.svg" alt="Lovelace Research logo" width="64" height="64" loading="lazy" />
        </div>
        <p class="footer-text">Lovelace Research 2025</p>
      </div>
    </div>
  `;

  containers.forEach((container) => {
    container.innerHTML = template;
  });
}

function renderEmailCopy() {
  return `
    <span class="email-container">
      <a href="#" class="js-email-copy" data-email-copy>
        ${EMAIL_ADDRESS}
      </a>
      <span class="hover-tooltip">Copy email</span>
      <span class="copied-message">Copied!</span>
    </span>
  `;
}

function initEmailCopy() {
  const containers = document.querySelectorAll('[data-email-copy]');
  containers.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      if (!navigator.clipboard) {
        return;
      }

      navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
        const wrapper = anchor.closest('.email-container');
        const message = wrapper?.querySelector('.copied-message');
        if (message) {
          message.classList.add('show');
          window.setTimeout(() => {
            message.classList.remove('show');
          }, 2000);
        }
      });
    });
  });
}

function highlightActiveLinks() {
  const current = getCurrentPage();
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive = current === href || window.location.pathname.endsWith(`/${href}`);
    link.classList.toggle('nav-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initPageNav() {
  const navHost = document.querySelector('[data-page-nav]');
  if (!navHost) return;

  const sections = Array.from(document.querySelectorAll('[data-section]'));
  if (!sections.length) {
    navHost.remove();
    return;
  }

  const listItems = sections
    .map((section) => {
      const id = section.getAttribute('id');
      const title = section.dataset.section || id || '';
      if (!id) {
        console.warn('Sections used in page navigation need an id attribute.');
        return null;
      }
      return `<li><button class="page-nav-link" data-scroll-target="${id}">${title}</button></li>`;
    })
    .filter(Boolean)
    .join('');

  if (!listItems) {
    navHost.remove();
    return;
  }

  navHost.innerHTML = `<nav class="page-nav"><ul>${listItems}</ul></nav>`;
  navHost.hidden = false;

  navHost.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-scroll-target');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function initMobileNavCloseOnEscape() {
  const container = document.querySelector('[data-component="mobile-nav"]');
  if (!container) return;
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      container.classList.remove('is-open');
    }
  });
}

function init() {
  renderSidebar();
  renderMobileNav();
  renderFooter();
  highlightActiveLinks();
  initEmailCopy();
  initPageNav();
  initMobileNavCloseOnEscape();
}

document.addEventListener('DOMContentLoaded', init);
