import { fetchJson } from './data.js';
import { renderPublications, renderReadingList } from './publications-shared.js';

const publicationsContainer = document.querySelector('[data-publications-list]');
const readingSection = document.querySelector('#reading-list');
const readingContainer = document.querySelector('[data-reading-list]');

async function initParadigmPage() {
  if (publicationsContainer) {
    try {
      const data = await fetchJson('data/publications.json');
      const publications = Array.isArray(data.publications) ? data.publications : [];
      renderPublications(publicationsContainer, publications);
    } catch (error) {
      console.error('Unable to load publications', error);
      publicationsContainer.innerHTML = '<p>Unable to load publications right now.</p>';
    }
  }

  if (readingContainer && readingSection) {
    try {
      const data = await fetchJson('data/reading-list.json');
      const list = Array.isArray(data.readingList) ? data.readingList : [];
      if (list.length) {
        renderReadingList(readingContainer, list);
        readingSection.hidden = false;
      }
    } catch (error) {
      console.error('Unable to load reading list', error);
    }
  }
}

initParadigmPage();
