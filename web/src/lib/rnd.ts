import { fetchJson } from '@/lib/data';
import {
  normalise,
  normaliseStatus,
  normaliseCategory,
  formatLabel,
  resolveImage,
  loadImageSize,
  classifyRatio
} from '@/lib/utils';

const STATUS_PRIORITY = new Map<string, number>([
  ['active', 0],
  ['featured', 1],
  ['shake', 1],
  ['previous', 2],
  ['archive', 3]
]);

const STATUS_FILTERS: Record<string, (project: any) => boolean> = {
  shake: (project) => Boolean(project.shake),
  featured: (project) => Boolean(project.featured),
  active: (project) => project.statusKey === 'active',
  archive: (project) => project.statusKey === 'archive',
  previous: (project) => project.statusKey === 'previous'
};

let preparedProjects: any[] = [];

function pickStatusBadge(project: any) {
  const status = formatLabel(project.statusKey);
  const category = formatLabel(project.category);
  if (status && category) return `${status} · ${category}`;
  return status || category || 'In progress';
}

function setupFilters() {
  const filterGroups = document.querySelectorAll<HTMLElement>('[data-filter-group]');
  filterGroups.forEach((group) => {
    group.addEventListener('click', (event) => {
      const item = (event.target as HTMLElement).closest('.filter-item') as HTMLElement | null;
      if (!item) return;
      const filterType = group.dataset.filterGroup;
      if (filterType === 'category') {
        const wasActive = item.classList.contains('is-active');
        group.querySelectorAll('.filter-item').forEach((el) => el.classList.remove('is-active'));
        if (!wasActive) item.classList.add('is-active');
      } else if (filterType === 'status') {
        // Status filters are single-select
        const wasActive = item.classList.contains('is-active');
        group.querySelectorAll('.filter-item').forEach((el) => el.classList.remove('is-active'));
        if (!wasActive) item.classList.add('is-active');
      } else {
        item.classList.toggle('is-active');
      }
      applyFiltersAndRender();
    });
  });
}

function getActiveFilters() {
  const filters = { category: new Set<string>(), status: new Set<string>() };
  const filterGroups = document.querySelectorAll<HTMLElement>('[data-filter-group]');
  filterGroups.forEach((group) => {
    const type = group.dataset.filterGroup;
    if (!type) return;
    group.querySelectorAll<HTMLElement>('.filter-item.is-active').forEach((item) => {
      const value = item.dataset.filterValue;
      if (!value || value === 'all') return; // Skip 'all' filter - it means show everything
      if (type === 'category') filters.category.add(normaliseCategory(value));
      else if (type === 'status') filters.status.add(value.toLowerCase());
    });
  });
  return filters;
}

function filterProjects(projects: any[], filters: { category: Set<string>; status: Set<string> }) {
  if (!projects.length) return [] as any[];
  const { category, status } = filters;
  return projects.filter((project) => {
    if (category.size && !category.has(project.categoryKey)) return false;
    if (status.size) {
      let matchesStatus = false;
      for (const value of status) {
        const predicate = STATUS_FILTERS[value];
        if (predicate && predicate(project)) {
          matchesStatus = true; break;
        }
      }
      if (!matchesStatus) return false;
    }
    return true;
  });
}

function renderTags(host: HTMLElement, tags?: string[]) {
  if (!host || !Array.isArray(tags) || !tags.length) return;
  const list = document.createElement('ul');
  list.className = 'rnd-card-tags';
  tags.forEach((tag) => {
    const label = normalise(tag);
    if (!label) return;
    const item = document.createElement('li');
    item.textContent = label;
    list.appendChild(item);
  });
  if (list.children.length) host.appendChild(list);
}

function renderLinks(host: HTMLElement, links?: Array<{ url: string; label?: string }>) {
  if (!host || !Array.isArray(links) || !links.length) return;
  const isDirectory = host.classList.contains('directory-desc-col');
  const container = document.createElement('div');
  container.className = isDirectory ? 'directory-links' : 'rnd-card-links';
  links.forEach((link) => {
    if (!link?.url) return;
    const anchor = document.createElement('a');
    anchor.className = isDirectory ? 'directory-link' : 'rnd-card-link';
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.label || 'Open link';
    container.appendChild(anchor);
  });
  if (container.children.length) host.appendChild(container);
}

function renderProjects(projects: any[]) {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';
  if (!projects.length) {
    const p = document.createElement('p');
    p.className = 'rnd-empty-state';
    p.textContent = 'No projects match the current filters.';
    projectsGrid.appendChild(p);
    return;
  }
  const categoryOrder = ['product', 'prototype', 'paradigm'];
  const groupedProjects: Record<string, any[]> = { product: [], prototype: [], paradigm: [] };
  projects.forEach((project) => {
    const cat = project.categoryKey || 'paradigm';
    if (groupedProjects[cat]) groupedProjects[cat].push(project);
  });
  const fragment = document.createDocumentFragment();
  categoryOrder.forEach((category) => {
    const categoryProjects = groupedProjects[category];
    if (!categoryProjects || !categoryProjects.length) return;
    const sectionHeader = document.createElement('h2');
    sectionHeader.className = 'rnd-section-header';
    sectionHeader.dataset.category = category;
    sectionHeader.textContent = formatLabel(category);
    fragment.appendChild(sectionHeader);
    categoryProjects.forEach((project: any, idx: number) => {
      // Directory-style layout for all categories
      const card = document.createElement('div');
      card.className = 'project-item project-item--directory';
      card.dataset.category = category;
      card.dataset.status = project.statusKey || '';
      card.dataset.featured = project.featured ? '1' : '0';
      card.dataset.shake = project.shake ? '1' : '0';
      
      // Column 1: Number
      const numberCol = document.createElement('div');
      numberCol.className = 'directory-number';
      numberCol.textContent = project.number || String(idx + 1).padStart(3, '0');
      
      // Column 2: Title / Tagline / Collaborator (for Prototype)
      const titleCol = document.createElement('div');
      titleCol.className = 'directory-title-col';
      const title = document.createElement('h3');
      title.className = 'directory-title';
      title.textContent = project.title || 'Untitled';
      titleCol.appendChild(title);
      
      // Show tagline if it exists (with gap = font size from title)
      if (project.tagline) {
        const tagline = document.createElement('div');
        tagline.className = 'directory-tagline';
        tagline.textContent = project.tagline;
        titleCol.appendChild(tagline);
      }
      
      // For Prototype items, show collaborator as a hover-able link below tagline
      if (category === 'prototype' && project.collaborator) {
        const collaboratorLink = document.createElement('a');
        collaboratorLink.className = 'directory-collaborator';
        collaboratorLink.href = project.collaboratorUrl || '#';
        collaboratorLink.textContent = project.collaborator;
        if (!project.collaboratorUrl || project.collaboratorUrl === '#') {
          collaboratorLink.addEventListener('click', (e) => {
            e.preventDefault();
          });
        }
        collaboratorLink.target = project.collaboratorUrl && project.collaboratorUrl !== '#' ? '_blank' : '_self';
        collaboratorLink.rel = project.collaboratorUrl && project.collaboratorUrl !== '#' ? 'noopener noreferrer' : '';
        titleCol.appendChild(collaboratorLink);
      } else if (category !== 'prototype' && project.collaborator && !project.tagline) {
        // For non-prototype items, show collaborator as tagline if no tagline exists
        const tagline = document.createElement('div');
        tagline.className = 'directory-tagline';
        tagline.textContent = project.collaborator;
        titleCol.appendChild(tagline);
      }
      
      // Column 3: Description / Links
      const descCol = document.createElement('div');
      descCol.className = 'directory-desc-col';
      const description = document.createElement('p');
      description.className = 'directory-description';
      description.textContent = project.description || 'Details coming soon.';
      descCol.appendChild(description);
      renderLinks(descCol, project.links);
      
      // Column 4: Image
      const imageCol = document.createElement('div');
      imageCol.className = 'directory-image-col';
      const image = document.createElement('img');
      image.src = project.imageSrc;
      image.alt = project.imageAlt || project.title || 'R&D project image';
      image.loading = 'lazy';
      imageCol.appendChild(image);
      
      card.appendChild(numberCol);
      card.appendChild(titleCol);
      card.appendChild(descCol);
      card.appendChild(imageCol);
      fragment.appendChild(card);
    });
  });
  projectsGrid.appendChild(fragment);
  // Make items visible (CSS starts them at opacity:0 until .in-view)
  projectsGrid.querySelectorAll('.project-item').forEach((el) => el.classList.add('in-view'));
}

function applyFiltersAndRender() {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  const filters = getActiveFilters();
  if (filters.category.size > 0) {
    projectsGrid.querySelectorAll<HTMLElement>('.rnd-section-header, .project-item').forEach((el) => {
      el.style.display = 'none';
    });
    filters.category.forEach((category) => {
      projectsGrid.querySelectorAll<HTMLElement>(`[data-category="${category}"]`).forEach((el) => {
        el.style.display = '';
      });
    });
  } else {
    projectsGrid.querySelectorAll<HTMLElement>('.rnd-section-header, .project-item').forEach((el) => {
      el.style.display = '';
    });
  }
  if (filters.status.size > 0) {
    projectsGrid.querySelectorAll<HTMLElement>('.project-item').forEach((card) => {
      // Only consider cards currently visible from category filter
      if (card.style.display === 'none') return;
      const status = (card.dataset.status || '').toLowerCase();
      const featured = card.dataset.featured === '1';
      const shake = card.dataset.shake === '1';
      let matchesStatus = false;
      for (const value of filters.status) {
        if (value === 'featured' && featured) { matchesStatus = true; break; }
        if (value === 'active' && status === 'active') { matchesStatus = true; break; }
        if (value === 'archive' && status === 'archive') { matchesStatus = true; break; }
        if (value === 'previous' && status === 'previous') { matchesStatus = true; break; }
        if (value === 'shake' && shake) { matchesStatus = true; break; }
      }
      if (!matchesStatus) {
        card.style.display = 'none';
      }
    });
  }
  document.querySelectorAll<HTMLElement>('.rnd-section-header').forEach((header) => {
    const category = header.dataset.category!;
    const visibleProjects = Array.from(document.querySelectorAll<HTMLElement>(`[data-category="${category}"].project-item`)).filter((el) => el.style.display !== 'none');
    if (visibleProjects.length === 0) header.style.display = 'none';
    else header.style.display = '';
  });
  // Normalize margins: ensure consistent spacing between headers and lists
  const headers = Array.from(document.querySelectorAll<HTMLElement>('.rnd-section-header'));
  // Get the computed value of --space-32 (which is 2rem = 32px)
  const root = document.documentElement;
  const space32 = getComputedStyle(root).getPropertyValue('--space-32').trim() || '2rem';
  
  headers.forEach((h) => {
    // Reset all margins to use CSS defaults
    h.style.marginTop = '';
    h.style.marginBottom = '';
  });
  // Set first visible header to have zero top margin, but keep consistent bottom margin
  const firstVisible = headers.find((h) => h.style.display !== 'none');
  if (firstVisible) {
    firstVisible.style.marginTop = '0';
  }
  // Ensure all visible headers have consistent bottom margin (32px gap between header and list)
  headers.forEach((h) => {
    if (h.style.display !== 'none') {
      h.style.marginBottom = space32;
    }
  });
}

function sortProjects(projects: any[]) {
  return [...projects].sort((a, b) => {
    const priorityA = STATUS_PRIORITY.get(a.statusKey) ?? STATUS_PRIORITY.get(a.statusKey === 'active' && a.featured ? 'featured' : '') ?? Number.MAX_SAFE_INTEGER;
    const priorityB = STATUS_PRIORITY.get(b.statusKey) ?? STATUS_PRIORITY.get(b.statusKey === 'active' && b.featured ? 'featured' : '') ?? Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;
    if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return a.order - b.order;
  });
}

async function prepareProjects(projects: any[]) {
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

export async function init() {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  setupFilters();
  try {
    // Load category data separately
    const [product, prototype, paradigm] = await Promise.all([
      fetchJson('data/product.json').catch(() => null),
      fetchJson('data/prototype.json').catch(() => null),
      fetchJson('data/paradigm.json').catch(() => null)
    ]);

    const productProjects = product?.products ?? product ?? [];
    const prototypeProjects = prototype?.prototypes ?? prototype ?? [];
    const paradigmProjects = paradigm?.paradigms ?? paradigm ?? [];

    const mapWithCategory = (arr: any[], categoryKey: string) =>
      (Array.isArray(arr) ? arr : []).map((p) => ({ ...p, category: categoryKey }));

    const combined = [
      ...mapWithCategory(productProjects, 'product'),
      ...mapWithCategory(prototypeProjects, 'prototype'),
      ...mapWithCategory(paradigmProjects, 'paradigm')
    ];

    preparedProjects = await prepareProjects(combined);
    renderProjects(preparedProjects);
  } catch (e) {
    console.error('Failed to load R&D projects:', e);
    projectsGrid.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'rnd-empty-state';
    p.textContent = 'Unable to load projects at this time.';
    projectsGrid.appendChild(p);
  }
}


