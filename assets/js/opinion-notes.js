import { fetchJson } from './data.js';

const notesContainer = document.querySelector('[data-notes-list]');

function renderNotes(notes) {
  if (!notesContainer) return;
  notesContainer.innerHTML = '';

  if (!notes.length) {
    notesContainer.innerHTML = '<p>No notes available at this time.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  notes.forEach((note) => {
    const item = document.createElement('div');
    item.className = 'project-item';

    const title = document.createElement('div');
    title.className = 'project-title';
    title.textContent = note.title ?? '';
    item.appendChild(title);

    if (note.date) {
      const date = document.createElement('div');
      date.className = 'project-description';
      date.textContent = note.date;
      item.appendChild(date);
    }

    if (note.summary) {
      const summary = document.createElement('p');
      summary.textContent = note.summary;
      item.appendChild(summary);
    }

    if (note.link) {
      const linksWrapper = document.createElement('div');
      linksWrapper.className = 'project-links';
      const anchor = document.createElement('a');
      anchor.href = note.link;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'project-link';
      anchor.textContent = 'Read';
      linksWrapper.appendChild(anchor);
      item.appendChild(linksWrapper);
    }

    fragment.appendChild(item);
  });

  notesContainer.appendChild(fragment);
}

async function initOpinionNotes() {
  if (!notesContainer) return;
  try {
    const data = await fetchJson('data/opinion-notes.json');
    const notes = Array.isArray(data.notes) ? data.notes : [];
    renderNotes(notes);
  } catch (error) {
    console.error('Unable to load opinion notes', error);
    notesContainer.innerHTML = '<p>Unable to load opinion notes right now.</p>';
  }
}

initOpinionNotes();
