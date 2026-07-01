import { API_URL } from './api';

const leerRespuesta = async (response) => {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const adminUsersFetch = async (path, { method = 'GET' } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    error.isNetworkError = true;
    throw error;
  }

  const data = await leerRespuesta(response);

  if (!response.ok) {
    const error = new Error(data?.message || `Error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const fetchAdminUsers = () => adminUsersFetch('/usuarios');

export const fetchAdminUserById = (id) =>
  adminUsersFetch(`/usuarios/${id}`);

export const deleteAdminUser = (id) =>
  adminUsersFetch(`/usuarios/${id}`, { method: 'DELETE' });

export const normalizeUsersList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.usuarios)) return payload.usuarios;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.value)) return payload.value;
  return [];
};

export const getAdminUserStatus = (user) => {
  if (typeof user?.estado === 'string' && user.estado.trim()) {
    return user.estado.trim();
  }
  if (typeof user?.activo === 'boolean') {
    return user.activo ? 'Activo' : 'Inactivo';
  }
  if (typeof user?.enabled === 'boolean') {
    return user.enabled ? 'Activo' : 'Inactivo';
  }
  return 'Activo';
};

export const getAdminRequestMessage = (
  error,
  {
    defaultMessage = 'No se pudo completar la operación.',
    forbiddenMessage = 'No tenés permisos para acceder a esta sección.',
    offlineMessage = 'No se pudo conectar con el servidor.',
  } = {}
) => {
  if (error?.status === 401 || error?.status === 403) {
    return forbiddenMessage;
  }

  if (
    error?.isNetworkError ||
    error?.name === 'TypeError' ||
    /Failed to fetch/i.test(error?.message || '')
  ) {
    return offlineMessage;
  }

  return defaultMessage;
};
