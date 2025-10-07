import { fetchJson } from '@/lib/data';
import {
  loadImageSize,
  classifyRatio,
  slugifyCompany,
  tryLoadImageSequential
} from '@/lib/utils';

const HOVER_SLIDES_PATH = 'data/slides.json';

function isGithubPagesHost(): boolean {
  const host = typeof window !== 'undefined' ? window.location.hostname || '' : '';
  return /\.github\.io$/i.test(host);
}

function getGithubRepoInfo(): { owner: string; repo: string; branch: string } | null {
  const host = typeof window !== 'undefined' ? window.location.hostname || '' : '';
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
    .filter((it: any) => it && it.type === 'file' && typeof it.name === 'string')
    .filter((it: any) => allowed.has(it.name.slice(it.name.lastIndexOf('.')).toLowerCase()))
    .map((it: any, index: number) => ({
      src: `images/slides/${it.name}`,
      alt: `Slide ${index + 1}`,
      order: index
    }));
  return slides.length ? slides : null;
}

function initHoverScroll(hoverScrollContainer: HTMLElement) {
  const content = hoverScrollContainer.querySelector('.hover-scroll-content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll<HTMLElement>('.hover-scroll-item'));
  if (!items.length) return;
  let currentHoverIndex = 0;

  const updateActiveHoverItem = (index: number) => {
    items.forEach((item, i) => item.classList.toggle('active', i === index));
    currentHoverIndex = index;
  };
  updateActiveHoverItem(0);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = hoverScrollContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (width === 0) return;
    const itemIndex = Math.floor((x / width) * items.length);
    const clampedIndex = Math.min(itemIndex, items.length - 1);
    if (clampedIndex !== currentHoverIndex) updateActiveHoverItem(clampedIndex);
  };

  hoverScrollContainer.addEventListener('mousemove', handleMouseMove);
}

async function loadHoverSlides() {
  const hoverScrollContainer = document.getElementById('hoverScrollContainer');
  if (!hoverScrollContainer) return;
  const host = hoverScrollContainer.querySelector('.hover-scroll-content');
  if (!host) return;

  try {
    const autoSlides = await listSlidesViaGithubApi();
    let slides: Array<{ src: string; alt: string; order: number }> = [];
    if (autoSlides && autoSlides.length) {
      slides = autoSlides;
    } else {
      const data = await fetchJson(HOVER_SLIDES_PATH);
      const jsonSlides = Array.isArray(data?.slides) ? data.slides : [];
      slides = jsonSlides.map((slide: any, index: number) => {
        const filename = slide?.filename || slide?.src || '';
        if (!filename) return null as any;
        return {
          src: `images/slides/${filename}`,
          alt: slide?.alt || `Slide ${index + 1}`,
          order: typeof slide?.order === 'number' ? slide.order : index
        };
      }).filter(Boolean);
    }

    const preparedSlides = slides.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const markup = preparedSlides.map((slide, index) => {
      const src = slide.src || '';
      const lower = src.toLowerCase();
      const isVideo = lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov');
      const media = isVideo
        ? `<video src="${src}" autoplay muted loop playsinline></video>`
        : `<img src="${src}" alt="${slide.alt}" />`;
      return `
        <div class="hover-scroll-item" data-index="${index}">
          <div class="hover-scroll-media">${media}</div>
        </div>`;
    }).join('');
    (host as HTMLElement).innerHTML = markup;
    initHoverScroll(hoverScrollContainer as HTMLElement);
  } catch (e) {
    console.error('Error loading hover scroll slides:', e);
  }
}

async function loadFeaturedProjects() {
  const featuredProjectsGrid = document.getElementById('featuredProjectsGrid');
  if (!featuredProjectsGrid) return;
  try {
    const data = await fetchJson('data/rnd.json');
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const featuredProjects = projects
      .filter((project: any) => (project?.status || 'active') === 'active')
      .slice(0, 6);
    const withMeta = await Promise.all(featuredProjects.map(async (project: any) => {
      const src = project.image || '/placeholder-prototype.jpg';
      const dims = await loadImageSize(src);
      const ratioClass = classifyRatio(dims);
      return { project, src, ratioClass };
    }));
    (featuredProjectsGrid as HTMLElement).innerHTML = withMeta.map(({ project, src, ratioClass }, idx) => {
      let sizeVariant = '';
      if (ratioClass === 'ratio-square' && (idx === 0 || idx % 5 === 0)) sizeVariant = 'project-item--large';
      else if (ratioClass === 'ratio-4-3' && idx % 4 === 2) sizeVariant = 'project-item--small';
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
  } catch (e) {
    console.error('Error loading featured projects:', e);
    (featuredProjectsGrid as HTMLElement).innerHTML = '<p>Projects coming soon...</p>';
  }
}

async function resolveCompanyImage(companyName: string): Promise<HTMLImageElement | null> {
  const slug = slugifyCompany(companyName);
  const base = `/images/office/${slug}`;
  const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
  try {
    const img = await tryLoadImageSequential(base, extensions);
    (img as HTMLImageElement).alt = companyName;
    (img as HTMLImageElement).dataset.imageFor = companyName.toLowerCase();
    return img;
  } catch (_) {
    return null;
  }
}

async function initOfficeImageHover() {
  const officeImageContainer = document.getElementById('officeImageContainer');
  if (!officeImageContainer) return;
  const companyNameSpans = document.querySelectorAll<HTMLElement>('.company-name[data-company]');
  const logoMap = new Map<string, HTMLImageElement>();
  const activateCompany = async (companyRaw: string) => {
    const company = (companyRaw || '').toLowerCase();
    if (!company) return;
    officeImageContainer.querySelectorAll('img').forEach((img) => img.classList.remove('active'));
    if (logoMap.has(company)) {
      logoMap.get(company)!.classList.add('active');
      return;
    }
    const img = await resolveCompanyImage(company);
    if (img) {
      officeImageContainer.appendChild(img);
      logoMap.set(company, img);
      img.classList.add('active');
    }
  };
  activateCompany('OpenAI');
  companyNameSpans.forEach((span) => {
    span.addEventListener('mouseenter', () => {
      const company = span.dataset.company || '';
      activateCompany(company);
    });
  });
}

export async function initLandingPage() {
  await loadHoverSlides();
  await initOfficeImageHover();
  await Promise.all([loadFeaturedProjects()]);
}


