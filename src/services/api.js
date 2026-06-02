// Base URL del backend Spring Boot
export const API_URL = 'http://localhost:8080/api';

// Helper fetch: agrega JSON headers y Bearer token cuando hay sesión
export async function apiFetch(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`; // JWT para rutas protegidas
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const err = new Error(`Error ${response.status}`);
    err.status = response.status;
    throw err;
  }

  // 204 No Content: DELETE u operaciones sin cuerpo de respuesta
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
