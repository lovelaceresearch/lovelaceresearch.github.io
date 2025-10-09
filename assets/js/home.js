import { fetchJson } from './data.js';
import {
  loadImageSize,
  classifyRatio,
  slugifyCompany,
  tryLoadImageSequential
} from './utils.js';

// Hover scroll functionality
const hoverScrollContainer = document.getElementById('hoverScrollContainer');
let hoverScrollItems = [];
let currentHoverIndex = 0;
let hoverScrollListenersBound = false;

const HOVER_SLIDES_PATH = 'data/slides.json';

function isGithubPagesHost() {
  const host = window.location.hostname || '';
  return /\.github\.io$/i.test(host);
}

function getGithubRepoInfo() {
  // For user/org pages, hostname is <owner>.github.io and repo is <owner>.github.io
  const host = window.location.hostname || '';
  const [owner] = host.split('.');
  const repo = host; // e.g., lovelaceresearch.github.io
  if (!owner || !repo) return null;
  return { owner, repo, branch: 'main' };
}

async function listSlidesViaGithubApi() {
  if (!isGithubPagesHost()) return null;
  const info = getGithubRepoInfo();
  if (!info) return null;
  const apiUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/contents/images/slides?ref=${info.branch}`;
  const response = await fetch(apiUrl, { cache: 'no-store' });
  if (!response.ok) {
    return null;
  }
  const items = await response.json();
  if (!Array.isArray(items)) return null;
  const allowed = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov']);
  const slides = items
    .filter((it) => it && it.type === 'file' && typeof it.name === 'string')
    .filter((it) => allowed.has(it.name.slice(it.name.lastIndexOf('.')).toLowerCase()))
    .map((it, index) => ({
      src: `images/slides/${it.name}`,
      alt: `Slide ${index + 1}`,
      order: index
    }));
  return slides.length ? slides : null;
}

// Featured projects
const featuredProjectsGrid = document.getElementById('featuredProjectsGrid');

// People and logos (legacy people section support)
const peopleGrid = document.getElementById('peopleGrid');

// Office Image Hover
const officeImageContainer = document.getElementById('officeImageContainer');

// Initialize hover scroll functionality
function initHoverScroll() {
  if (!hoverScrollContainer) return;

  const content = hoverScrollContainer.querySelector('.hover-scroll-content');
  if (!content) return;

  hoverScrollItems = Array.from(content.querySelectorAll('.hover-scroll-item'));

  if (hoverScrollItems.length === 0) return;

  // Set initial active item
  updateActiveHoverItem(0);

  if (!hoverScrollListenersBound) {
    // Desktop: mouse events
    hoverScrollContainer.addEventListener('mousemove', handleMouseMove);
    hoverScrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    // Mobile: touch events
    hoverScrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    hoverScrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    hoverScrollContainer.addEventListener('touchend', handleTouchEnd);
    
    hoverScrollListenersBound = true;
  }
}

function handleMouseMove(e) {
  if (hoverScrollItems.length === 0) return;
  
  const rect = hoverScrollContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  if (width === 0) return;
  
  // Calculate which item should be active based on mouse position
  const itemIndex = Math.floor((x / width) * hoverScrollItems.length);
  const clampedIndex = Math.min(itemIndex, hoverScrollItems.length - 1);
  
  if (clampedIndex !== currentHoverIndex) {
    updateActiveHoverItem(clampedIndex);
  }
}

function handleMouseLeave() {
  // Keep the last active item when mouse leaves
  // No need to change anything
}

let touchStartX = 0;
let touchCurrentX = 0;

function handleTouchStart(e) {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX;
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 0 || hoverScrollItems.length === 0) return;
  
  touchCurrentX = e.touches[0].clientX;
  const rect = hoverScrollContainer.getBoundingClientRect();
  const x = touchCurrentX - rect.left;
  const width = rect.width;
  if (width === 0) return;
  
  const itemIndex = Math.floor((x / width) * hoverScrollItems.length);
  const clampedIndex = Math.max(0, Math.min(itemIndex, hoverScrollItems.length - 1));
  
  if (clampedIndex !== currentHoverIndex) {
    updateActiveHoverItem(clampedIndex);
  }
}

function handleTouchEnd() {
  // Optional: Add swipe gesture detection here if you want discrete swipes
  // For now, the continuous touch tracking in handleTouchMove handles it
}

function updateActiveHoverItem(index) {
  hoverScrollItems.forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });
  currentHoverIndex = index;
}

async function loadHoverSlides() {
  if (!hoverScrollContainer) return;

  const host = hoverScrollContainer.querySelector('.hover-scroll-content');

  try {
    // Prefer automatic folder listing on GitHub Pages
    const autoSlides = await listSlidesViaGithubApi();
    let slides;
    if (autoSlides && autoSlides.length) {
      slides = autoSlides;
    } else {
      const data = await fetchJson(HOVER_SLIDES_PATH);
      const jsonSlides = Array.isArray(data?.slides) ? data.slides : [];
      slides = jsonSlides.map((slide, index) => {
        const filename = slide?.filename || slide?.src || '';
        if (!filename) return null;
        return {
          src: `images/slides/${filename}`,
          alt: slide?.alt || `Slide ${index + 1}`,
          order: typeof slide?.order === 'number' ? slide.order : index
        };
      }).filter(Boolean);
    }

    const preparedSlides = slides.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (!preparedSlides.length) {
      if (host) host.innerHTML = '';
      return;
    }

    const markup = preparedSlides
      .map((slide, index) => {
        const src = slide.src || '';
        const lower = src.toLowerCase();
        const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov');
        const media = isVideo
          ? `<video src="${src}" autoplay muted loop playsinline></video>`
          : `<img src="${src}" alt="${slide.alt}" />`;
        return `
        <div class="hover-scroll-item" data-index="${index}">
          <div class="hover-scroll-media">
            ${media}
          </div>
        </div>
        `;
      })
      .join('');

    if (host) {
      host.innerHTML = markup;
    } else {
      const content = document.createElement('div');
      content.className = 'hover-scroll-content';
      content.innerHTML = markup;
      hoverScrollContainer.appendChild(content);
    }

    initHoverScroll();
  } catch (error) {
    console.error('Error loading hover scroll slides:', error);
  }
}

// Load and display featured projects
async function loadFeaturedProjects() {
  if (!featuredProjectsGrid) return;

  try {
    const data = await fetchJson('data/rnd.json');
    const projects = Array.isArray(data?.projects) ? data.projects : [];

    // Show up to 6 active projects
    const featuredProjects = projects
      .filter((project) => (project?.status || 'active') === 'active')
      .slice(0, 6);

    // Preload images to detect aspect ratios
    const withMeta = await Promise.all(featuredProjects.map(async (project) => {
      const src = project.image || '/placeholder-prototype.jpg';
      const dims = await loadImageSize(src);
      const ratioClass = classifyRatio(dims);
      return { project, src, ratioClass };
    }));

    featuredProjectsGrid.innerHTML = withMeta.map(({ project, src, ratioClass }, idx) => {
      // Add size variations for visual interest
      let sizeVariant = '';
      
      // Make some square items larger
      if (ratioClass === 'ratio-square' && (idx === 0 || idx % 5 === 0)) {
        sizeVariant = 'project-item--large';
      }
      // Make some landscape items smaller
      else if (ratioClass === 'ratio-4-3' && idx % 4 === 2) {
        sizeVariant = 'project-item--small';
      }
      
      return `
      <div class="project-item ${ratioClass} ${sizeVariant}">
        <div class="project-thumb">
          <img src="${src}" alt="${project.imageAlt || project.title}" />
        </div>
        <div class="project-meta">
          <p class="project-one-liner">${project.description || project.title}</p>
          <div></div>
        </div>
      </div>`;
    }).join('');

    // Scroll-in animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    featuredProjectsGrid.querySelectorAll('.project-item').forEach((el) => observer.observe(el));
  } catch (error) {
    console.error('Error loading featured projects:', error);
    featuredProjectsGrid.innerHTML = '<p>Projects coming soon...</p>';
  }
}

function getProjectType(project) {
  // Determine project type based on tags or other criteria
  if (project.tags && project.tags.includes('AI')) return 'Product';
  if (project.tags && project.tags.includes('HCI')) return 'Prototype';
  return 'Paradigm';
}

// Load and display people (legacy)
async function loadPeople() {
  if (!peopleGrid) return;

  try {
    const data = await fetchJson('data/contributors.json');
    const contributors = data.contributors || [];

    peopleGrid.innerHTML = contributors.map(person => `
      <div class="person-card">
        <div class="person-photo">
          <img src="${person.image || '/placeholder-person.jpg'}" alt="${person.name}" />
        </div>
        <div class="person-info">
          <h3>${person.name}</h3>
          <div class="person-role">${person.role}</div>
          <div class="person-affiliation">${person.affiliation}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading people:', error);
    peopleGrid.innerHTML = '<p>Team information coming soon...</p>';
  }
}

// Office image hover functionality (direct from images/office/)
// slugifyCompany and tryLoadImageSequential imported from utils

async function resolveCompanyImage(companyName) {
  const slug = slugifyCompany(companyName);
  const base = `/images/office/${slug}`;
  const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  try {
    const img = await tryLoadImageSequential(base, extensions);
    img.alt = companyName;
    img.dataset.imageFor = companyName.toLowerCase();
    return img;
  } catch (_e) {
    return null;
  }
}

async function initOfficeImageHover() {
  if (!officeImageContainer) return;

  const companyNameSpans = document.querySelectorAll('.company-name[data-company]');
  const logoMap = new Map();
  const companyNames = Array.from(companyNameSpans).map(span => span.dataset.company || '');
  let currentCompanyIndex = 0;

  // Helper to activate a company image, loading if needed
  const activateCompany = async (companyRaw) => {
    const company = (companyRaw || '').toLowerCase();
    if (!company) return;

    // Deactivate cached images
    logoMap.forEach((img) => img.classList.remove('active'));
    // Ensure only one image node exists; this avoids double images and overflow
    officeImageContainer.innerHTML = '';

    let img = logoMap.get(company) || null;
    if (!img) {
      img = await resolveCompanyImage(company);
      if (img) {
        logoMap.set(company, img);
      }
    }
    if (img) {
      img.classList.add('active');
      officeImageContainer.appendChild(img);
    }
  };

  const activateNextCompany = () => {
    currentCompanyIndex = (currentCompanyIndex + 1) % companyNames.length;
    const nextCompany = companyNames[currentCompanyIndex];
    if (nextCompany) {
      activateCompany(nextCompany);
    }
  };

  // Default: show OpenAI on init if available
  activateCompany('OpenAI');

  // Desktop: hover to show different company images
  companyNameSpans.forEach((span, index) => {
    span.addEventListener('mouseenter', () => {
      const company = span.dataset.company || '';
      currentCompanyIndex = index;
      activateCompany(company);
    });
  });

  // Mobile: click on names to show image
  companyNameSpans.forEach((span, index) => {
    span.addEventListener('click', () => {
      const company = span.dataset.company || '';
      currentCompanyIndex = index;
      activateCompany(company);
    });
  });

  // Mobile: tap on image viewport to cycle through companies
  officeImageContainer.addEventListener('click', () => {
    // Check if we're on mobile (simplified check)
    if (window.innerWidth <= 768) {
      activateNextCompany();
    }
  });

  // Do not clear on mouseleave; keep last viewed image visible
}

// Initialize the landing page
async function initLandingPage() {
  await loadHoverSlides();
  initOfficeImageHover();

  await Promise.all([
    loadFeaturedProjects(),
    loadPeople()
  ]);
}

// Start the application
initLandingPage();
