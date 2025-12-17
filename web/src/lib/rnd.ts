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
let currentView = 'card';

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

        // If nothing is active, select 'All'
        if (!group.querySelector('.filter-item.is-active')) {
          const allBtn = group.querySelector('[data-filter-value="all"]');
          if (allBtn) allBtn.classList.add('is-active');
        }
      } else if (filterType === 'status') {
        // Status filters are single-select
        const wasActive = item.classList.contains('is-active');
        group.querySelectorAll('.filter-item').forEach((el) => el.classList.remove('is-active'));
        if (!wasActive) item.classList.add('is-active');

        // If nothing is active, select 'All'
        if (!group.querySelector('.filter-item.is-active')) {
          const allBtn = group.querySelector('[data-filter-value="all"]');
          if (allBtn) allBtn.classList.add('is-active');
        }
      } else {
        item.classList.toggle('is-active');
      }
      applyFiltersAndRender();
    });
  });
}

function setupViewToggle() {
  const toggleGroup = document.querySelector<HTMLElement>('.view-toggle');
  if (!toggleGroup) return;

  toggleGroup.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest('.view-btn') as HTMLElement | null;
    if (!btn) return;

    const view = btn.dataset.view;
    if (view && view !== currentView) {
      currentView = view;
      toggleGroup.querySelectorAll('.view-btn').forEach((el) => el.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProjects(preparedProjects);
      // Re-apply filters to ensure correct visibility after re-render
      // actually renderProjects resets innerHTML so we need to re-apply filter visibility
      // But renderProjects renders ALL items initially.
      // Wait, renderProjects renders them but applyFiltersAndRender hides them.
      // So we must call applyFiltersAndRender after renderProjects.
      applyFiltersAndRender();
    }
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

function renderIndexItem(project: any, idx: number) {
  const card = document.createElement('div');
  card.className = 'project-item project-item--index';
  card.dataset.category = project.categoryKey;
  card.dataset.status = project.statusKey || '';
  card.dataset.featured = project.featured ? '1' : '0';
  card.dataset.shake = project.shake ? '1' : '0';

  // [Number]
  const numberCol = document.createElement('div');
  numberCol.className = 'index-number';
  numberCol.textContent = project.number || String(idx + 1).padStart(3, '0');
  card.appendChild(numberCol);

  // [Title] 
  const titleCol = document.createElement('div');
  titleCol.className = 'index-title';

  const titleEl = document.createElement('div');
  titleEl.className = 'index-title-text';
  titleEl.textContent = project.title || 'Untitled';
  titleCol.appendChild(titleEl);

  // Product: Show Tagline + Description in Col 3 (Venue Col equivalent) logic below, or append here?
  // User said: "number - name - Tagline / Description - active"
  // This implies Tagline/Desc is the 3rd column. 
  // Let's keep Title simple here.

  // Row Link logic
  if (project.links && project.links.length > 0 && project.links[0].url) {
    const link = document.createElement('a');
    link.href = project.links[0].url;
    link.className = 'index-row-link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = project.title || 'Untitled';
    titleEl.innerHTML = '';
    titleEl.appendChild(link);
  }
  card.appendChild(titleCol);

  // [Middle Info] (Venue / Description / Tagline)
  const middleCol = document.createElement('div');
  middleCol.className = 'index-venue'; // Reusing class for layout consistency

  if (project.categoryKey === 'product') {
    // Product: Tagline / Description
    if (project.tagline) {
      const taglineEl = document.createElement('div');
      taglineEl.className = 'index-item-tagline';
      taglineEl.textContent = project.tagline;
      middleCol.appendChild(taglineEl);
    }
    if (project.description) {
      const descEl = document.createElement('div');
      descEl.className = 'index-item-description';
      descEl.textContent = project.description;
      middleCol.appendChild(descEl);
    }
  } else {
    // Paradigm & Prototype: Collaborator (Venue)
    const rawVenue = project.collaborator || '';
    if (rawVenue) {
      const parts = rawVenue.split('/').map((s: string) => s.trim()).filter((s: string) => s);
      parts.forEach((part: string) => {
        const line = document.createElement('div');
        line.textContent = part;
        middleCol.appendChild(line);
      });
    }
  }
  card.appendChild(middleCol);

  // [Right Info] (Status / Date / Tags)
  const rightCol = document.createElement('div');
  rightCol.className = 'index-tag'; // Reusing class for layout consistency

  if (project.categoryKey === 'product') {
    // Product: Active (Status)
    if (project.statusKey === 'active') {
      rightCol.textContent = 'Active';
    } else if (project.statusKey) {
      rightCol.textContent = formatLabel(project.statusKey);
    }
  } else if (project.categoryKey === 'prototype') {
    // Prototype: "if done show date. if active show active"
    if (project.statusKey === 'active') {
      rightCol.textContent = 'Active';
    } else if (project.statusKey === 'done' && project.date) {
      rightCol.textContent = project.date; // Date acts as status here
      rightCol.classList.add('index-item-date');
    } else {
      // Fallback
      rightCol.textContent = project.date || formatLabel(project.statusKey) || '';
    }
  } else {
    // Paradigm: Tags (no tagline, no status)
    // "add the tag in the json" -> use tags array
    const tags = [];
    if (Array.isArray(project.tags)) tags.push(...project.tags);
    // if (project.type) tags.push(project.type); // Optional fallback if tags missing
    rightCol.textContent = tags.join(', ');
  }

  card.appendChild(rightCol);

  return card;
}

function renderCardItem(project: any) {
  const card = document.createElement('div');
  card.className = `project-item project-item--card card-${project.categoryKey}`;
  card.dataset.category = project.categoryKey;
  card.dataset.status = project.statusKey || '';
  card.dataset.featured = project.featured ? '1' : '0';
  card.dataset.shake = project.shake ? '1' : '0';

  const category = project.categoryKey;

  // VISUALS
  // Hide image for Paradigm to focus on text density (span 2)
  if (category !== 'paradigm' && project.image) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'card-image-container';
    // Check for video extension
    const isVideo = /\.(mov|mp4|webm)$/i.test(project.image);

    if (isVideo) {
      const video = document.createElement('video');
      video.src = project.imageSrc || project.image; // fallback to raw if src not set
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      // visual styles
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';

      // Hover to play logic
      video.pause();
      card.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log('Hover play prevented', e));
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Optional: reset to start
      });

      imageContainer.appendChild(video);
    } else {
      const image = document.createElement('img');
      image.src = project.imageSrc;
      image.alt = project.imageAlt || project.title;
      image.loading = 'lazy';
      imageContainer.appendChild(image);
    }
    card.appendChild(imageContainer);
  }

  // CONTENT
  const content = document.createElement('div');
  content.className = 'card-content';

  // [Paradigm Specific Header: Number]
  if (category === 'paradigm') {
    const num = document.createElement('div');
    num.className = 'card-number';
    num.textContent = project.number || '000';
    content.appendChild(num);
  }

  // Header varies by category
  const header = document.createElement('div');
  header.className = 'card-header';

  // Title First (for all)
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = project.title || 'Untitled';
  header.appendChild(title);

  // Tagline (Product & Prototype)
  if (project.tagline && (category === 'product' || category === 'prototype')) {
    const tagline = document.createElement('div');
    tagline.className = 'card-tagline';
    tagline.textContent = project.tagline;
    header.appendChild(tagline);
  }

  // Prototype Collaborator (After Tagline)
  if (category === 'prototype' && project.collaborator) {
    const collaborator = document.createElement('div');
    collaborator.className = 'card-collaborator';
    collaborator.textContent = project.collaborator;
    header.appendChild(collaborator);
  }

  content.appendChild(header);

  // Description (Product / Prototype only? Paradigm is just Title/Tag per user req? "Number. Title. Tag. Button. Maybe year?")
  // User didn't list description for Paradigm.
  // Description (Product only? Paradigm/Prototype per user req skipped)
  if (category !== 'paradigm' && category !== 'prototype' && project.description) {
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = project.description || '';
    content.appendChild(description);
  }

  // Footer / Details
  const footer = document.createElement('div');
  footer.className = 'card-footer';

  // [Paradigm Tags & Year]
  if (category === 'paradigm') {
    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const tags = [];
    if (Array.isArray(project.tags)) tags.push(...project.tags);
    if (tags.length) {
      const tagEl = document.createElement('div');
      tagEl.className = 'card-tags';
      tagEl.textContent = tags.join(', ');
      meta.appendChild(tagEl);
    }

    if (project.date) {
      const dateEl = document.createElement('div');
      dateEl.className = 'card-date';
      dateEl.textContent = project.date; // "2024"
      meta.appendChild(dateEl);
    }
    content.appendChild(meta);
  }

  // Status Badge for Products - REMOVED per user request


  // Links (Button)
  if (project.links && project.links.length > 0) {
    renderLinks(footer, project.links);
  } else if (category === 'paradigm') {
    // Logic for "Button" if empty? Or just skip.
  }

  if (footer.childNodes.length > 0) {
    content.appendChild(footer);
  }

  card.appendChild(content);

  return card;
}

function renderProjects(projects: any[]) {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  projectsGrid.innerHTML = '';

  // Set View Class
  projectsGrid.className = `projects-grid view-${currentView}`;

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
    let categoryProjects = groupedProjects[category];
    if (!categoryProjects || !categoryProjects.length) return;

    // Sort by number order in all views
    categoryProjects = sortByNumber(categoryProjects);

    // Header logic
    const sectionHeader = document.createElement('h2');
    sectionHeader.className = 'rnd-section-header';
    sectionHeader.dataset.category = category;
    sectionHeader.textContent = formatLabel(category);
    fragment.appendChild(sectionHeader);

    // Wrapper for Card View Grid logic
    if (currentView === 'card') {
      const gridContainer = document.createElement('div');
      gridContainer.className = 'category-grid';
      gridContainer.dataset.category = category;

      categoryProjects.forEach((project, idx) => {
        const item = renderCardItem(project);
        gridContainer.appendChild(item);
      });
      fragment.appendChild(gridContainer);
    } else {
      // Index View - Keep Flat (Unified Layout)
      categoryProjects.forEach((project, idx) => {
        const item = renderIndexItem(project, idx);
        fragment.appendChild(item);
      });
    }
  });

  projectsGrid.appendChild(fragment);

  // Animation
  requestAnimationFrame(() => {
    projectsGrid.querySelectorAll('.project-item').forEach((el) => el.classList.add('in-view'));
  });
}

function applyFiltersAndRender() {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  const filters = getActiveFilters();

  // SHOW/HIDE ITEMS
  const allItems = projectsGrid.querySelectorAll<HTMLElement>('.project-item');
  allItems.forEach((card) => {
    const category = card.dataset.category!;
    const status = (card.dataset.status || '').toLowerCase();
    const featured = card.dataset.featured === '1';
    const shake = card.dataset.shake === '1';

    let visible = true;

    // Category Filter
    if (filters.category.size > 0 && !filters.category.has(category)) {
      visible = false;
    }

    // Status Filter
    if (visible && filters.status.size > 0) {
      let matchesStatus = false;
      for (const value of filters.status) {
        if (value === 'featured' && featured) { matchesStatus = true; break; }
        if (value === 'active' && status === 'active') { matchesStatus = true; break; }
        if (value === 'archive' && status === 'archive') { matchesStatus = true; break; }
        if (value === 'previous' && status === 'previous') { matchesStatus = true; break; }
        if (value === 'shake' && shake) { matchesStatus = true; break; }
      }
      if (!matchesStatus) visible = false;
    }

    card.style.display = visible ? '' : 'none';
  });

  // SHOW/HIDE HEADERS & GRIDS
  document.querySelectorAll<HTMLElement>('.rnd-section-header').forEach((header) => {
    const category = header.dataset.category!;
    const selector = `[data-category="${category}"].project-item`;

    // Check if any items in this category are visible
    const visibleProjects = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((el) => el.style.display !== 'none');

    const isVisible = visibleProjects.length > 0;
    header.style.display = isVisible ? '' : 'none';

    // Also toggle the grid wrapper if present (Card view)
    const gridWrapper = projectsGrid.querySelector<HTMLElement>(`.category-grid[data-category="${category}"]`);
    if (gridWrapper) {
      gridWrapper.style.display = isVisible ? '' : 'none';
    }
  });

  // MARGIN NORMALIZATION (for Index view mostly, but good for Card headers too)
  const headers = Array.from(document.querySelectorAll<HTMLElement>('.rnd-section-header'));
  const root = document.documentElement;
  const space32 = getComputedStyle(root).getPropertyValue('--space-32').trim() || '2rem';

  headers.forEach((h) => {
    h.style.marginTop = '';
    h.style.marginBottom = '';
  });

  const firstVisible = headers.find((h) => h.style.display !== 'none');
  if (firstVisible) {
    firstVisible.style.marginTop = '0';
  }

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

function sortByNumber(projects: any[]) {
  return [...projects].sort((a, b) => {
    const numA = parseInt(String(a.number).replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(String(b.number).replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });
}

export async function init() {
  const projectsGrid = document.getElementById('rndProjectsGrid');
  if (!projectsGrid) return;
  setupFilters();
  setupViewToggle();
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
    applyFiltersAndRender();
  } catch (e) {
    console.error('Failed to load R&D projects:', e);
    projectsGrid.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'rnd-empty-state';
    p.textContent = 'Unable to load projects at this time.';
    projectsGrid.appendChild(p);
  }
}


