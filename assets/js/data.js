const cache = new Map();

export async function fetchJson(path) {
  if (!path) {
    throw new Error('Path is required when calling fetchJson');
  }

  if (cache.has(path)) {
    return cache.get(path);
  }

  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  cache.set(path, data);
  return data;
}
