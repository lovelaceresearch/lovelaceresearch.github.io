const cache = new Map<string, any>();

export async function fetchJson(path: string): Promise<any> {
  if (!path) {
    throw new Error('Path is required when calling fetchJson');
  }
  const url = path.startsWith('/') ? path : `/${path}`;
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
}


