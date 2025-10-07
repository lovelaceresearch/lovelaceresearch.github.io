import { fetchJson } from '@/lib/data';
import {
  normalise,
  normaliseStatus,
  normaliseCategory,
  formatLabel,
  resolveImage,
  loadImageSize,
  classifyRatio,
  shuffleArray
} from '@/lib/utils';

const STATUS_PRIORITY = new Map<string, number>([
  ['active', 0],
  ['featured', 1],
  ['shake', 1],
  ['previous', 2],
  ['archive', 3]
]);

const STATUS_FILTERS: Record<string, (project: any) => boolean> = {
  shuffle: () => true,
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
      if (item.dataset.filterValue === 'shuffle') {
        document.querySelectorAll('.filter-item.is-active').forEach((el) => el.classList.remove('is-active'));
        const shuffled = shuffleArray([...preparedProjects]);
        renderProjects(shuffled);
        return;
      }
      const filterType = group.dataset.filterGroup;
      if (filterType === 'category') {
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
      if (!value || value === 'shuffle') return;
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
  const container = document.createElement('div');
  container.className = 'rnd-card-links';
  links.forEach((link) => {
    if (!link?.url) return;
    const anchor = document.createElement('a');
    anchor.className = 'rnd-card-link';
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
      let sizeVariant = '';
      if (project.ratioClass === 'ratio-square' && (idx === 0 || idx % 5 === 0)) sizeVariant = 'project-item--large';
      else if (project.ratioClass === 'ratio-4-3' && idx % 4 === 2) sizeVariant = 'project-item--small';
      const card = document.createElement('div');
      card.className = `project-item rnd-card ${project.ratioClass} ${sizeVariant}`.trim();
      card.dataset.category = category;
      const thumb = document.createElement('div');
      thumb.className = 'project-thumb';
      const image = document.createElement('img');
      image.src = project.imageSrc;
      image.alt = project.imageAlt || project.title || 'R&D project image';
      image.loading = 'lazy';
      thumb.appendChild(image);
      const meta = document.createElement('div');
      meta.className = 'project-meta';
      const heading = document.createElement('div');
      heading.className = 'rnd-card-heading';
      const statusSpan = document.createElement('span');
      statusSpan.className = 'rnd-card-status';
      statusSpan.textContent = pickStatusBadge(project);
      heading.appendChild(statusSpan);
      const h3 = document.createElement('h3');
      h3.className = 'rnd-card-title';
      h3.textContent = project.title || 'Untitled exploration';
      heading.appendChild(h3);
      const description = document.createElement('p');
      description.className = 'rnd-card-description';
      description.textContent = project.description || 'Details coming soon.';
      const metaRow = document.createElement('div');
      metaRow.className = 'rnd-card-meta';
      if (project.collaborator) metaRow.appendChild(document.createTextNode(project.collaborator));
      if (project.date) metaRow.appendChild(document.createTextNode(project.date));
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
      const title = card.querySelector('.rnd-card-title')?.textContent;
      const project = preparedProjects.find((p) => p.title === title);
      if (!project) return;
      let matchesStatus = false;
      for (const value of filters.status) {
        const predicate = STATUS_FILTERS[value];
        if (predicate && predicate(project)) { matchesStatus = true; break; }
      }
      if (!matchesStatus) card.style.display = 'none';
    });
  }
  document.querySelectorAll<HTMLElement>('.rnd-section-header').forEach((header) => {
    const category = header.dataset.category!;
    const visibleProjects = Array.from(document.querySelectorAll<HTMLElement>(`[data-category="${category}"].project-item`)).filter((el) => el.style.display !== 'none');
    if (visibleProjects.length === 0) header.style.display = 'none';
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
    const data = await fetchJson('data/rnd.json');
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    preparedProjects = await prepareProjects(projects);
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


