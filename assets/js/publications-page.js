import { fetchJson } from './data.js';
import { renderPublications } from './publications-shared.js';

const currentContainer = document.querySelector('[data-publications-list]');
const pastContainer = document.querySelector('[data-past-publications-list]');
const pastSection = document.querySelector('#past-publications');

async function initPublicationsPage() {
  if (!currentContainer) return;

  try {
    const data = await fetchJson('data/publications.json');
    const current = Array.isArray(data.publications) ? data.publications : [];
    const past = Array.isArray(data.pastPublications) ? data.pastPublications : [];

    renderPublications(currentContainer, current);

    if (past.length && pastContainer && pastSection) {
      renderPublications(pastContainer, past);
      pastSection.hidden = false;
    }
  } catch (error) {
    console.error('Unable to load publications data', error);
    currentContainer.innerHTML = '<p>Unable to load publications right now.</p>';
  }
}

initPublicationsPage();
