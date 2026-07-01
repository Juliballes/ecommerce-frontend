const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export const API_URL = `${API_BASE}/api`;

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const err = new Error(`Error ${response.status}`);
    err.status = response.status;
    throw err;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
