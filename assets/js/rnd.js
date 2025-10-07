import { fetchJson } from './data.js';
import {
  normalise,
  normaliseStatus,
  normaliseCategory,
  formatLabel,
  createEl,
  resolveImage,
  loadImageSize,
  classifyRatio,
  shuffleArray
} from './utils.js';

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
  shuffle: () => true, // shuffle shows all
  shake: (project) => Boolean(project.shake),
  featured: (project) => Boolean(project.featured),
  active: (project) => project.statusKey === 'active',
  archive: (project) => project.statusKey === 'archive',
  previous: (project) => project.statusKey === 'previous'
};

let preparedProjects = [];

function pickStatusBadge(project) {
  const status = formatLabel(project.statusKey);
  const category = formatLabel(project.category);
  if (status && category) return `${status} · ${category}`;
  return status || category || 'In progress';
}


function setupFilters() {
  filterGroups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const item = event.target.closest('.filter-item');
      if (!item) return;
      
      // Handle "Shuffle!" - clear all filters and shuffle
      if (item.dataset.filterValue === 'shuffle') {
        // Clear all active filters
        document.querySelectorAll('.filter-item.is-active').forEach(el => el.classList.remove('is-active'));
        // Shuffle the projects within each category
        const shuffled = shuffleArray([...preparedProjects]);
        renderProjects(shuffled);
        return;
      }
      
      const filterType = group.dataset.filterGroup;
      
      // For category filters, only allow one selection at a time
      if (filterType === 'category') {
        const wasActive = item.classList.contains('is-active');
        // Deselect all category filters
        group.querySelectorAll('.filter-item').forEach(el => el.classList.remove('is-active'));
        // Toggle this item (if it wasn't active, make it active)
        if (!wasActive) {
          item.classList.add('is-active');
        }
      } else {
        // For status filters, allow multiple selections
        item.classList.toggle('is-active');
      }
      
      applyFiltersAndRender();
    });
  });
}

// shuffleArray imported from utils

function getActiveFilters() {
  const filters = { category: new Set(), status: new Set() };
  filterGroups.forEach((group) => {
    const type = group.dataset.filterGroup;
    if (!type) return;
    group.querySelectorAll('.filter-item.is-active').forEach((item) => {
      const value = item.dataset.filterValue;
      if (!value || value === 'shuffle') return;
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
    return;
  }

  // Group projects by category in the order: Product, Prototype, Paradigm
  const categoryOrder = ['product', 'prototype', 'paradigm'];
  const groupedProjects = {
    product: [],
    prototype: [],
    paradigm: []
  };

  projects.forEach(project => {
    const cat = project.categoryKey || 'paradigm';
    if (groupedProjects[cat]) {
      groupedProjects[cat].push(project);
    }
  });

  const fragment = document.createDocumentFragment();

  categoryOrder.forEach(category => {
    const categoryProjects = groupedProjects[category];
    if (!categoryProjects || categoryProjects.length === 0) return;

    // Create section header
    const sectionHeader = createEl('h2', 'rnd-section-header', formatLabel(category));
    sectionHeader.dataset.category = category;
    fragment.appendChild(sectionHeader);

    // Render projects in this category
    categoryProjects.forEach((project, idx) => {
      // Add size variations for visual interest
      let sizeVariant = '';
      
      // Make some square items larger
      if (project.ratioClass === 'ratio-square' && (idx === 0 || idx % 5 === 0)) {
        sizeVariant = 'project-item--large';
      }
      // Make some landscape items smaller
      else if (project.ratioClass === 'ratio-4-3' && idx % 4 === 2) {
        sizeVariant = 'project-item--small';
      }
      
      const card = createEl('div', `project-item rnd-card ${project.ratioClass} ${sizeVariant}`.trim());
      card.dataset.category = category;

      const thumb = createEl('div', 'project-thumb');
      const image = document.createElement('img');
      image.src = project.imageSrc;
      image.alt = project.imageAlt || project.title || 'R&D project image';
      image.loading = 'lazy';
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
  });

  projectsGrid.appendChild(fragment);
}

function applyFiltersAndRender() {
  const filters = getActiveFilters();
  
  // If category filters are active, show/hide sections
  if (filters.category.size > 0) {
    // Hide all sections first
    projectsGrid.querySelectorAll('.rnd-section-header, .project-item').forEach(el => {
      el.style.display = 'none';
    });
    
    // Show only selected category sections
    filters.category.forEach(category => {
      projectsGrid.querySelectorAll(`[data-category="${category}"]`).forEach(el => {
        el.style.display = '';
      });
    });
  } else {
    // Show all sections if no category filter
    projectsGrid.querySelectorAll('.rnd-section-header, .project-item').forEach(el => {
      el.style.display = '';
    });
  }
  
  // Apply status filters by hiding/showing individual cards
  if (filters.status.size > 0) {
    projectsGrid.querySelectorAll('.project-item').forEach(card => {
      const project = preparedProjects.find(p => 
        card.querySelector('.rnd-card-title')?.textContent === p.title
      );
      
      if (project) {
        let matchesStatus = false;
        for (const value of filters.status) {
          const predicate = STATUS_FILTERS[value];
          if (predicate && predicate(project)) {
            matchesStatus = true;
            break;
          }
        }
        
        if (!matchesStatus) {
          card.style.display = 'none';
        }
      }
    });
  }
  
  // Hide section headers that have no visible projects
  projectsGrid.querySelectorAll('.rnd-section-header').forEach(header => {
    const category = header.dataset.category;
    const visibleProjects = Array.from(projectsGrid.querySelectorAll(`[data-category="${category}"].project-item`))
      .filter(el => el.style.display !== 'none');
    
    if (visibleProjects.length === 0) {
      header.style.display = 'none';
    }
  });
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
