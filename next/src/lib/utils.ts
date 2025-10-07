export function normalise(value: unknown, fallback = ''): string {
  return String(value ?? fallback).trim();
}

export function normaliseStatus(status?: string): string {
  const value = normalise(status, 'active').toLowerCase();
  return value || 'active';
}

export function normaliseCategory(category?: string): string {
  return normalise(category).toLowerCase();
}

export function formatLabel(value?: string): string {
  const text = normalise(value);
  if (!text) return '';
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function resolveImage(src?: string): string {
  const path = normalise(src);
  if (!path) return '/images/general/imperial2.jpg';
  return path;
}

export function loadImageSize(src: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: (img as HTMLImageElement).naturalWidth, height: (img as HTMLImageElement).naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function classifyRatio(size: { width: number; height: number } | null): string {
  if (!size || !size.width || !size.height) return 'ratio-4-3';
  const ratio = size.width / size.height;
  if (Math.abs(ratio - 1) < 0.06) return 'ratio-square';
  if (Math.abs(ratio - 3 / 4) < 0.06) return 'ratio-3-4';
  if (Math.abs(ratio - 4 / 3) < 0.12) return 'ratio-4-3';
  return 'ratio-4-3';
}

export function slugifyCompany(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function tryLoadImageSequential(srcBase: string, exts: string[]): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let index = 0;
    function attempt() {
      if (index >= exts.length) {
        reject(new Error('No matching image found'));
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img as HTMLImageElement);
      img.onerror = () => {
        index += 1;
        attempt();
      };
      (img as HTMLImageElement).src = `${srcBase}${exts[index]}`;
      (img as HTMLImageElement).alt = '';
    }
    attempt();
  });
}

export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('Clipboard API not available');
  }
  await navigator.clipboard.writeText(text);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


