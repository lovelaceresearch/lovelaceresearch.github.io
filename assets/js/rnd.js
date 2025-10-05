import { fetchJson } from './data.js';

const projectsGrid = document.getElementById('rndProjectsGrid');
const filterGroups = document.querySelectorAll('[data-filter-group]');

const STATUS_PRIORITY = new Map([
  ['active', 0],
  ['featured', 1],
  ['shake', 1],
  ['previous', 2],
  ['archive', 3]
]);

const STATUS_FILTERS = {
  shake: (project) => Boolean(project.shake),
  featured: (project) => Boolean(project.featured),
  active: (project) => project.statusKey === 'active',
  archive: (project) => project.statusKey === 'archive',
  previous: (project) => project.statusKey === 'previous'
};

let preparedProjects = [];
let masonryFrame = null;
let resizeTimer = null;

function normalise(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normaliseStatus(status) {
  const value = normalise(status, 'active').toLowerCase();
  return value || 'active';
}

function normaliseCategory(category) {
  return normalise(category).toLowerCase();
}

function formatLabel(value) {
  const text = normalise(value);
  if (!text) return '';
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveImage(src) {
  const path = normalise(src);
  if (!path) return '/placeholder-prototype.jpg';
  return path;
}

function loadImageSize(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function classifyRatio(size) {
  if (!size || !size.width || !size.height) return 'ratio-4-3';
  const ratio = size.width / size.height;
  if (Math.abs(ratio - 1) < 0.06) return 'ratio-square';
  if (Math.abs(ratio - 3 / 4) < 0.06) return 'ratio-3-4';
  if (Math.abs(ratio - 4 / 3) < 0.12) return 'ratio-4-3';
  return 'ratio-4-3';
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === 'string' && text) {
    el.textContent = text;
  }
  return el;
}

function pickStatusBadge(project) {
  const status = formatLabel(project.statusKey);
  const category = formatLabel(project.category);
  if (status && category) return `${status} · ${category}`;
  return status || category || 'In progress';
}

function scheduleMasonry() {
  if (!projectsGrid) return;
  if (masonryFrame) window.cancelAnimationFrame(masonryFrame);
  masonryFrame = window.requestAnimationFrame(applyMasonryLayout);
}

function applyMasonryLayout() {
  masonryFrame = null;
  if (!projectsGrid) return;

  const computed = window.getComputedStyle(projectsGrid);
  const rowHeight = parseFloat(computed.getPropertyValue('grid-auto-rows')) || 8;
  const rowGap = parseFloat(computed.getPropertyValue('grid-row-gap')) || 0;

  projectsGrid.querySelectorAll('.project-item').forEach((item) => {
    item.style.gridRowEnd = 'span 1';
    const rect = item.getBoundingClientRect();
    const height = rect.height;
    const span = Math.max(1, Math.ceil((height + rowGap) / (rowHeight + rowGap)));
    item.style.gridRowEnd = `span ${span}`;
  });
}

function setupResizeListener() {
  window.addEventListener('resize', () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(scheduleMasonry, 150);
  });
}

function setupFilters() {
  filterGroups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const button = event.target.closest('.rnd-filter-button');
      if (!button) return;
      const isActive = button.classList.toggle('is-active');
      button.setAttribute('aria-pressed', String(isActive));
      applyFiltersAndRender();
    });
  });
}

function getActiveFilters() {
  const filters = { category: new Set(), status: new Set() };
  filterGroups.forEach((group) => {
    const type = group.dataset.filterGroup;
    if (!type) return;
    group.querySelectorAll('.rnd-filter-button.is-active').forEach((button) => {
      const value = button.dataset.filterValue;
      if (!value) return;
      if (type === 'category') {
        filters.category.add(normaliseCategory(value));
      } else if (type === 'status') {
        filters.status.add(value.toLowerCase());
      }
    });
  });
  return filters;
}

function filterProjects(projects, filters) {
  if (!projects.length) return [];
  const { category, status } = filters;

  return projects.filter((project) => {
    if (category.size && !category.has(project.categoryKey)) {
      return false;
    }

    if (status.size) {
      let matchesStatus = false;
      for (const value of status) {
        const predicate = STATUS_FILTERS[value];
        if (predicate && predicate(project)) {
          matchesStatus = true;
          break;
        }
      }
      if (!matchesStatus) return false;
    }

    return true;
  });
}

function renderTags(host, tags) {
  if (!host || !Array.isArray(tags) || !tags.length) return;
  const list = createEl('ul', 'rnd-card-tags');
  tags.forEach((tag) => {
    const label = normalise(tag);
    if (!label) return;
    const item = createEl('li', null, label);
    list.appendChild(item);
  });
  if (list.children.length) host.appendChild(list);
}

function renderLinks(host, links) {
  if (!host || !Array.isArray(links) || !links.length) return;
  const container = createEl('div', 'rnd-card-links');
  links.forEach((link) => {
    if (!link?.url) return;
    const anchor = createEl('a', 'rnd-card-link', link.label || 'Open link');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    container.appendChild(anchor);
  });
  if (container.children.length) host.appendChild(container);
}

function renderProjects(projects) {
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';

  if (!projects.length) {
    projectsGrid.appendChild(createEl('p', 'rnd-empty-state', 'No projects match the current filters.'));
    scheduleMasonry();
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    const card = createEl('div', `project-item rnd-card ${project.ratioClass}`.trim());
    card.style.gridRowEnd = 'span 1';

    const thumb = createEl('div', 'project-thumb');
    const image = document.createElement('img');
    image.src = project.imageSrc;
    image.alt = project.imageAlt || project.title || 'R&D project image';
    image.loading = 'lazy';
    image.addEventListener('load', scheduleMasonry);
    image.addEventListener('error', scheduleMasonry);
    if (image.complete) scheduleMasonry();
    thumb.appendChild(image);

    const meta = createEl('div', 'project-meta');

    const heading = createEl('div', 'rnd-card-heading');
    heading.appendChild(createEl('span', 'rnd-card-status', pickStatusBadge(project)));
    heading.appendChild(createEl('h3', 'rnd-card-title', project.title || 'Untitled exploration'));

    const description = createEl('p', 'rnd-card-description', project.description || 'Details coming soon.');

    const metaRow = createEl('div', 'rnd-card-meta');
    if (project.collaborator) {
      metaRow.appendChild(createEl('span', null, project.collaborator));
    }
    if (project.date) {
      metaRow.appendChild(createEl('span', null, project.date));
    }

    meta.appendChild(heading);
    meta.appendChild(description);
    if (metaRow.children.length) meta.appendChild(metaRow);

    renderTags(meta, project.tags);
    renderLinks(meta, project.links);

    card.appendChild(thumb);
    card.appendChild(meta);

    fragment.appendChild(card);
  });

  projectsGrid.appendChild(fragment);
  scheduleMasonry();
}

function applyFiltersAndRender() {
  const filters = getActiveFilters();
  const filtered = filterProjects(preparedProjects, filters);
  renderProjects(filtered);
}

function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    const priorityA = STATUS_PRIORITY.get(a.statusKey) ?? STATUS_PRIORITY.get(a.statusKey === 'active' && a.featured ? 'featured' : '') ?? Number.MAX_SAFE_INTEGER;
    const priorityB = STATUS_PRIORITY.get(b.statusKey) ?? STATUS_PRIORITY.get(b.statusKey === 'active' && b.featured ? 'featured' : '') ?? Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;
    if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return a.order - b.order;
  });
}

async function prepareProjects(projects) {
  const prepared = await Promise.all(projects.map(async (project, index) => {
    const imageSrc = resolveImage(project.image);
    const size = await loadImageSize(imageSrc);
    return {
      ...project,
      order: index,
      statusKey: normaliseStatus(project.status),
      categoryKey: normaliseCategory(project.category),
      imageSrc,
      ratioClass: classifyRatio(size)
    };
  }));
  return sortProjects(prepared);
}

async function init() {
  if (!projectsGrid) return;

  setupFilters();
  setupResizeListener();

  try {
    const data = await fetchJson('data/rnd.json');
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    preparedProjects = await prepareProjects(projects);
    renderProjects(preparedProjects);
  } catch (error) {
    console.error('Failed to load R&D projects:', error);
    if (projectsGrid) {
      projectsGrid.innerHTML = '';
      projectsGrid.appendChild(createEl('p', 'rnd-empty-state', 'Unable to load projects at this time.'));
    }
  }
}

init();
