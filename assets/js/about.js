import { fetchJson } from './data.js';

const contributorsList = document.querySelector('[data-contributors-list]');
const logoWall = document.querySelector('[data-logo-wall]');
const hoverArea = document.querySelector('[data-hover-area]');
const hoverCardHost = document.querySelector('[data-hover-card]');

let hideTimeout = null;
let animationTimeout = null;

function resolveAssetPath(path) {
  if (!path) return '';
  if (/^https?:/i.test(path)) return path;
  const cleaned = path.startsWith('/') ? path.slice(1) : path;
  return cleaned;
}

function createContributorItem(contributor) {
  const item = document.createElement('div');
  item.className = 'contributor-item';

  const name = document.createElement('span');
  name.className = 'contributor-name';
  name.textContent = contributor.name ?? '';

  const city = document.createElement('span');
  city.className = 'contributor-city';
  city.textContent = contributor.city ?? '';

  item.appendChild(name);
  item.appendChild(city);

  item.addEventListener('mouseenter', () => showHoverCard(contributor));
  item.addEventListener('mouseleave', scheduleHide);

  return item;
}

function createLogoItem(logo) {
  const container = document.createElement('div');
  container.className = 'logo-item';

  const img = document.createElement('img');
  img.src = resolveAssetPath(logo.src);
  img.alt = logo.alt ?? 'Logo';
  img.loading = 'lazy';
  img.decoding = 'async';
  container.appendChild(img);

  return container;
}

function renderContributors(contributors) {
  if (!contributorsList) return;
  contributorsList.innerHTML = '';

  const fragment = document.createDocumentFragment();
  contributors.forEach((contributor) => {
    fragment.appendChild(createContributorItem(contributor));
  });

  contributorsList.appendChild(fragment);
}

function renderLogos(logos) {
  if (!logoWall) return;
  logoWall.innerHTML = '';

  const fragment = document.createDocumentFragment();
  logos.forEach((logo) => {
    fragment.appendChild(createLogoItem(logo));
  });

  logoWall.appendChild(fragment);
}

function renderHoverCard(contributor) {
  if (!hoverCardHost) return;

  const card = document.createElement('div');
  card.className = 'hover-info-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hover-info-image';

  const image = document.createElement('img');
  image.src = resolveAssetPath(contributor.image) || 'images/slides/DSC06369.jpg';
  image.alt = contributor.name || 'Contributor portrait';
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f0f0f0'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%23666'%3EContributor Photo%3C/text%3E%3C/svg%3E";
  });

  imageWrapper.appendChild(image);

  const content = document.createElement('div');
  content.className = 'hover-info-content';

  const header = document.createElement('div');
  header.className = 'hover-info-header';

  const city = document.createElement('div');
  city.className = 'hover-info-city';
  city.textContent = contributor.city ?? '';
  header.appendChild(city);

  if (contributor.role) {
    const role = document.createElement('div');
    role.className = 'hover-info-role';
    role.textContent = contributor.role;
    header.appendChild(role);
  }

  const title = document.createElement('h3');
  title.className = 'hover-info-title';
  title.textContent = contributor.name ?? '';

  content.appendChild(header);
  content.appendChild(title);

  if (contributor.affiliation) {
    const affiliation = document.createElement('div');
    affiliation.className = 'hover-info-affiliation';
    affiliation.textContent = contributor.affiliation;
    content.appendChild(affiliation);
  }

  if (contributor.bio) {
    const bio = document.createElement('p');
    bio.className = 'hover-info-description';
    bio.textContent = contributor.bio;
    content.appendChild(bio);
  }

  if (Array.isArray(contributor.links) && contributor.links.length > 0) {
    const linksContainer = document.createElement('div');
    linksContainer.className = 'hover-info-links';
    contributor.links.forEach((link) => {
      if (!link?.url) return;
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'hover-info-link';
      anchor.textContent = link.label ?? 'Link';
      linksContainer.appendChild(anchor);
    });
    content.appendChild(linksContainer);
  }

  card.appendChild(imageWrapper);
  card.appendChild(content);

  hoverCardHost.innerHTML = '';
  hoverCardHost.appendChild(card);
}

function showHoverCard(contributor) {
  clearTimeouts();
  const card = hoverCardHost?.querySelector('.hover-info-card');
  if (card) {
    card.classList.remove('fade-out');
  }
  renderHoverCard(contributor);
}

function clearTimeouts() {
  if (hideTimeout) {
    window.clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  if (animationTimeout) {
    window.clearTimeout(animationTimeout);
    animationTimeout = null;
  }
}

function scheduleHide() {
  clearTimeouts();
  hideTimeout = window.setTimeout(() => {
    const card = hoverCardHost?.querySelector('.hover-info-card');
    if (!card) return;
    card.classList.add('fade-out');
    animationTimeout = window.setTimeout(() => {
      if (hoverCardHost) {
        hoverCardHost.innerHTML = '';
      }
    }, 200);
  }, 120);
}

function registerHoverAreaHandlers() {
  if (!hoverArea) return;
  hoverArea.addEventListener('mouseenter', clearTimeouts);
  hoverArea.addEventListener('mouseleave', scheduleHide);
}

async function prefetchContributorImages(contributors, limit = 12) {
  const unique = Array.from(
    new Set(
      contributors
        .map((contributor) => resolveAssetPath(contributor.image))
        .filter(Boolean)
    )
  );

  await Promise.all(
    unique.slice(0, limit).map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        })
    )
  );
}

async function initContributors() {
  if (!contributorsList) return;
  try {
    const data = await fetchJson('data/contributors.json');
    const contributors = Array.isArray(data.contributors) ? data.contributors : [];
    renderContributors(contributors);
    await prefetchContributorImages(contributors);
  } catch (error) {
    console.error('Unable to load contributors data', error);
    contributorsList.innerHTML = '<p>Unable to load contributors at this time.</p>';
  }
}

async function initLogos() {
  if (!logoWall) return;
  try {
    const data = await fetchJson('data/logos.json');
    const logos = Array.isArray(data.logos) ? data.logos : [];
    renderLogos(logos);
  } catch (error) {
    console.error('Unable to load logos', error);
  }
}

async function initAboutPage() {
  await initContributors();
  await initLogos();
  registerHoverAreaHandlers();
}

initAboutPage();
