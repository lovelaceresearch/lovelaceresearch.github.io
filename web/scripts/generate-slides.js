#!/usr/bin/env node
/**
 * Generates public/data/slides.json from the images found in public/images/slides.
 * This script automatically creates slides based on filename order.
 *
 * Run: node scripts/generate-slides.js
 */

const fs = require('fs').promises;
const path = require('path');

const ROOT = process.cwd();
const SLIDES_DIR = path.resolve(ROOT, 'public/images/slides');
const OUTPUT_FILE = path.resolve(ROOT, 'public/data/slides.json');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.mp4', '.webm', '.mov']);

function humanizeFilename(filename) {
  const withoutExt = filename.replace(path.extname(filename), '');
  const formatted = withoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  if (!formatted) {
    return 'Slide';
  }

  return formatted
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (/^[0-9]+$/.test(word) || word.toUpperCase() === word) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

async function getSlideFilenames() {
  const entries = await fs.readdir(SLIDES_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

async function generateSlides() {
  const filenames = await getSlideFilenames();

  const slides = filenames.map((filename, index) => ({
    id: `slide-${String(index + 1).padStart(2, '0')}`,
    filename,
    alt: humanizeFilename(filename),
    order: index, // Use 0-based indexing for automatic ordering
  }));

  const payload = { slides };
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  await fs.writeFile(OUTPUT_FILE, json, 'utf8');
  
  console.log(`Generated slides.json with ${slides.length} slides:`);
  slides.forEach((slide, index) => {
    console.log(`  ${index + 1}. ${slide.filename} (${slide.alt})`);
  });
}

async function ensureDirectories() {
  try {
    await fs.access(SLIDES_DIR);
  } catch (error) {
    throw new Error(`Slides directory not found at ${SLIDES_DIR}`);
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
}

async function main() {
  await ensureDirectories();
  await generateSlides();
  console.log(`Generated ${OUTPUT_FILE.replace(`${ROOT}${path.sep}`, '')}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
