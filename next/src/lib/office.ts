import { fetchJson } from './data';
import { copyToClipboard } from './utils';

async function loadContributors() {
  const contributorsGrid = document.getElementById('contributorsGrid');
  if (!contributorsGrid) return;
  try {
    const data = await fetchJson('data/contributors.json');
    const contributors = data.contributors || [];
    (contributorsGrid as HTMLElement).innerHTML = contributors.map((person: any) => `
      <div class="contributor-row">
        <div class="contributor-name">${person.name}</div>
        <div class="contributor-role">${person.role}</div>
        <div class="contributor-city">${person.city || 'London'}</div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Error loading contributors:', e);
  }
}

function setupEmailCopy() {
  const emailButton = document.getElementById('copyEmailButton') as HTMLButtonElement | null;
  const tooltip = document.getElementById('emailTooltip') as HTMLElement | null;
  if (!emailButton || !tooltip) return;
  emailButton.addEventListener('click', async () => {
    const email = 'office@lovelace-research.com';
    try {
      await copyToClipboard(email);
      tooltip.textContent = 'Copied!';
      tooltip.classList.add('copied');
      setTimeout(() => {
        tooltip.textContent = 'Copy email';
        tooltip.classList.remove('copied');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
      tooltip.textContent = 'Failed to copy';
      setTimeout(() => { tooltip.textContent = 'Copy email'; }, 2000);
    }
  });
}

export async function init() {
  await loadContributors();
  setupEmailCopy();
}


