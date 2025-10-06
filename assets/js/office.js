import { fetchJson } from './data.js';

// Load contributors
async function loadContributors() {
  const contributorsGrid = document.getElementById('contributorsGrid');
  if (!contributorsGrid) return;

  try {
    const data = await fetchJson('data/contributors.json');
    const contributors = data.contributors || [];

    contributorsGrid.innerHTML = contributors.map(person => `
      <div class="contributor-row">
        <div class="contributor-name">${person.name}</div>
        <div class="contributor-role">${person.role}</div>
        <div class="contributor-city">${person.city || 'London'}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading contributors:', error);
  }
}

// Email copy functionality
function setupEmailCopy() {
  const emailButton = document.getElementById('copyEmailButton');
  const tooltip = document.getElementById('emailTooltip');
  
  if (!emailButton || !tooltip) return;

  emailButton.addEventListener('click', async () => {
    const email = 'office@lovelace-research.com';
    
    try {
      await navigator.clipboard.writeText(email);
      tooltip.textContent = 'Copied!';
      tooltip.classList.add('copied');
      
      setTimeout(() => {
        tooltip.textContent = 'Copy email';
        tooltip.classList.remove('copied');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
      tooltip.textContent = 'Failed to copy';
      
      setTimeout(() => {
        tooltip.textContent = 'Copy email';
      }, 2000);
    }
  });
}

// Initialize
async function init() {
  await loadContributors();
  setupEmailCopy();
}

init();

