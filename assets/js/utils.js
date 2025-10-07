// Shared utility functions used across multiple modules

// Normalisation helpers
export function normalise(value, fallback = '') {
  return String(value ?? fallback).trim();
}

export function normaliseStatus(status) {
  const value = normalise(status, 'active').toLowerCase();
  return value || 'active';
}

export function normaliseCategory(category) {
  return normalise(category).toLowerCase();
}

export function formatLabel(value) {
  const text = normalise(value);
  if (!text) return '';
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// DOM helpers
export function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (typeof text === 'string' && text) {
    el.textContent = text;
  }
  return el;
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Image helpers
export function resolveImage(src) {
  const path = normalise(src);
  if (!path) return '/placeholder-prototype.jpg';
  return path;
}

export function loadImageSize(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function classifyRatio(size) {
  if (!size || !size.width || !size.height) return 'ratio-4-3';
  const ratio = size.width / size.height;
  if (Math.abs(ratio - 1) < 0.06) return 'ratio-square';
  if (Math.abs(ratio - 3 / 4) < 0.06) return 'ratio-3-4';
  if (Math.abs(ratio - 4 / 3) < 0.12) return 'ratio-4-3';
  return 'ratio-4-3';
}

// Slug and asset helpers
export function slugifyCompany(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function tryLoadImageSequential(srcBases, exts) {
  return new Promise((resolve, reject) => {
    let index = 0;
    function attempt() {
      if (index >= exts.length) {
        reject(new Error('No matching image found'));
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        index += 1;
        attempt();
      };
      img.src = `${srcBases}${exts[index]}`;
      img.alt = '';
    }
    attempt();
  });
}

// Clipboard
export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}


