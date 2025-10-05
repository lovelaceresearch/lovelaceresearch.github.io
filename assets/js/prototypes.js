import { fetchJson } from './data.js';

const prototypesList = document.querySelector('[data-prototypes-list]');
const pastPrototypesList = document.querySelector('[data-past-prototypes-list]');
const pastSection = document.querySelector('#past-prototypes');
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

function createPrototypeItem(prototype) {
  const item = document.createElement('div');
  item.className = 'prototype-item';

  item.addEventListener('mouseenter', () => showHoverCard(prototype));
  item.addEventListener('mouseleave', scheduleHide);

  const header = document.createElement('div');
  header.className = 'prototype-header';

  const number = document.createElement('div');
  number.className = 'prototype-number';
  number.textContent = prototype.number ?? '';
  header.appendChild(number);

  const content = document.createElement('div');
  content.className = 'prototype-content';

  const left = document.createElement('div');
  left.className = 'prototype-left';
  const title = document.createElement('div');
  title.className = 'prototype-title';
  title.textContent = prototype.title ?? '';
  left.appendChild(title);

  const right = document.createElement('div');
  right.className = 'prototype-right';
  const description = document.createElement('div');
  description.className = 'prototype-description';
  description.textContent = prototype.description ?? '';
  right.appendChild(description);

  if (prototype.collaborator) {
    const collaborator = document.createElement('span');
    collaborator.className = 'prototype-collaborator-link';
    collaborator.textContent = prototype.collaborator;
    right.appendChild(collaborator);
  }

  content.appendChild(left);
  content.appendChild(right);

  item.appendChild(header);
  item.appendChild(content);

  return item;
}

function renderPrototypeList(list, target) {
  if (!target) return;
  target.innerHTML = '';
  const fragment = document.createDocumentFragment();
  list.forEach((prototype) => {
    fragment.appendChild(createPrototypeItem(prototype));
  });
  target.appendChild(fragment);
}

function renderHoverCard(prototype) {
  if (!hoverCardHost) return;

  const card = document.createElement('div');
  card.className = 'hover-info-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'hover-info-image';

  const image = document.createElement('img');
  image.src = resolveAssetPath(prototype.image) || 'images/slides/DSC06369.jpg';
  image.alt = prototype.title || 'Prototype image';
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f0f0f0'/%3E%3Ctext x='100' y='75' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%23666'%3EPrototype Image%3C/text%3E%3C/svg%3E";
  });

  imageWrapper.appendChild(image);

  const content = document.createElement('div');
  content.className = 'hover-info-content';

  const header = document.createElement('div');
  header.className = 'hover-info-header';

  const number = document.createElement('div');
  number.className = 'hover-info-number';
  number.textContent = prototype.number ?? '';

  const status = document.createElement('div');
  status.className = `hover-info-status ${prototype.status ?? ''}`.trim();
  status.textContent = prototype.status ?? '';

  header.appendChild(number);
  if (prototype.status) {
    header.appendChild(status);
  }

  const title = document.createElement('h3');
  title.className = 'hover-info-title';
  title.textContent = prototype.title ?? '';

  content.appendChild(header);
  content.appendChild(title);

  if (prototype.collaborator) {
    const collaborator = document.createElement('div');
    collaborator.className = 'hover-info-collaborator';
    collaborator.textContent = prototype.collaborator;
    content.appendChild(collaborator);
  }

  if (prototype.date) {
    const meta = document.createElement('div');
    meta.className = 'hover-info-meta';
    const date = document.createElement('div');
    date.className = 'hover-info-date';
    date.textContent = prototype.date;
    meta.appendChild(date);
    content.appendChild(meta);
  }

  if (prototype.description) {
    const description = document.createElement('p');
    description.className = 'hover-info-description';
    description.textContent = prototype.description;
    content.appendChild(description);
  }

  if (Array.isArray(prototype.links) && prototype.links.length > 0) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'hover-info-links';
    prototype.links.forEach((link) => {
      if (!link?.url) return;
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'hover-info-link';
      anchor.textContent = link.label ?? 'Open link';
      linkContainer.appendChild(anchor);
    });
    content.appendChild(linkContainer);
  }

  card.appendChild(imageWrapper);
  card.appendChild(content);

  hoverCardHost.innerHTML = '';
  hoverCardHost.appendChild(card);
}

function showHoverCard(prototype) {
  clearTimeouts();
  if (!prototype) return;

  const currentCard = hoverCardHost?.querySelector('.hover-info-card');
  if (currentCard) {
    currentCard.classList.remove('fade-out');
  }

  renderHoverCard(prototype);
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

async function prefetchImages(prototypes, limit = 24) {
  const unique = Array.from(
    new Set(
      prototypes
        .map((prototype) => resolveAssetPath(prototype.image))
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

async function initPrototypes() {
  if (!prototypesList) return;

  try {
    const data = await fetchJson('data/prototypes.json');
    const current = Array.isArray(data.prototypes) ? data.prototypes : [];
    const past = Array.isArray(data.pastPrototypes) ? data.pastPrototypes : [];

    renderPrototypeList(current, prototypesList);

    if (past.length && pastPrototypesList && pastSection) {
      renderPrototypeList(past, pastPrototypesList);
      pastSection.hidden = false;
    }

    await prefetchImages([...current, ...past]);
  } catch (error) {
    console.error('Unable to load prototypes data', error);
    prototypesList.innerHTML = '<p>Unable to load prototypes at this time.</p>';
  }

  registerHoverAreaHandlers();
}

initPrototypes();
