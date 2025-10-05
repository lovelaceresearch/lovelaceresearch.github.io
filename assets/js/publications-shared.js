export function renderPublications(container, publications = []) {
  if (!container) return;
  container.innerHTML = '';

  if (!publications.length) {
    container.innerHTML = '<p>No publications available yet.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  publications.forEach((publication) => {
    const item = document.createElement('div');
    item.className = 'publication-item';

    const title = document.createElement('div');
    title.className = 'publication-title';
    title.textContent = publication.title ?? '';
    item.appendChild(title);

    if (publication.authors || publication.venue || publication.year) {
      const meta = document.createElement('div');
      meta.className = 'publication-meta';

      let hasPrevious = false;
      if (Array.isArray(publication.authors) && publication.authors.length) {
        meta.appendChild(document.createTextNode(publication.authors.join(', ')));
        hasPrevious = true;
      }

      if (publication.venue) {
        if (hasPrevious) {
          meta.appendChild(document.createTextNode(' · '));
        }
        const venue = document.createElement('span');
        venue.className = 'publication-venue';
        venue.textContent = publication.venue;
        meta.appendChild(venue);
        hasPrevious = true;
      }

      if (publication.year) {
        if (hasPrevious) {
          meta.appendChild(document.createTextNode(' · '));
        }
        const year = document.createElement('span');
        year.className = 'publication-year';
        year.textContent = publication.year;
        meta.appendChild(year);
      }

      item.appendChild(meta);
    }

    if (publication.abstract) {
      const abstract = document.createElement('div');
      abstract.className = 'publication-abstract';
      abstract.textContent = publication.abstract;
      item.appendChild(abstract);
    }

    const footer = document.createElement('div');
    footer.className = 'publication-footer';

    if (Array.isArray(publication.tags) && publication.tags.length) {
      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'publication-tags';
      publication.tags.forEach((tag) => {
        const pill = document.createElement('span');
        pill.className = 'publication-tag';
        pill.textContent = tag;
        tagsContainer.appendChild(pill);
      });
      footer.appendChild(tagsContainer);
    }

    if (Array.isArray(publication.links) && publication.links.length) {
      const linksContainer = document.createElement('div');
      linksContainer.className = 'publication-links';
      publication.links.forEach((link) => {
        if (!link?.url) return;
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'publication-link';
        anchor.textContent = link.label ?? 'Link';
        linksContainer.appendChild(anchor);
      });
      footer.appendChild(linksContainer);
    }

    if (footer.children.length) {
      item.appendChild(footer);
    }

    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}

export function renderReadingList(container, items = []) {
  if (!container) return;
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = '<p>The reading list is being curated.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'prototype-item';

    const header = document.createElement('div');
    header.className = 'prototype-header';
    const category = document.createElement('div');
    category.className = 'prototype-number';
    category.textContent = entry.category || 'Reading';
    header.appendChild(category);

    const content = document.createElement('div');
    content.className = 'prototype-content';

    const left = document.createElement('div');
    left.className = 'prototype-left';
    const title = document.createElement('div');
    title.className = 'prototype-title';
    title.textContent = entry.title ?? '';
    left.appendChild(title);

    const right = document.createElement('div');
    right.className = 'prototype-right';

    if (entry.summary) {
      const summary = document.createElement('div');
      summary.className = 'prototype-description';
      summary.textContent = entry.summary;
      right.appendChild(summary);
    }

    if (entry.author) {
      const author = document.createElement('div');
      author.className = 'prototype-collaborator-link';
      author.textContent = entry.author;
      right.appendChild(author);
    }

    content.appendChild(left);
    content.appendChild(right);

    item.appendChild(header);
    item.appendChild(content);

    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}
