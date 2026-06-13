import { apiFetch } from './api';

const mapFavorite = (fav) => ({
  id: fav.productId,
  favoritoId: fav.id,
  nombre: fav.nombreProducto,
  precio: fav.precio,
});

export const getFavorites = async (token) => {
  const data = await apiFetch('/favorites', { token });
  return Array.isArray(data) ? data.map(mapFavorite) : [];
};

export const addFavoriteApi = async (token, productId) => {
  const data = await apiFetch('/favorites', {
    token,
    method: 'POST',
    body: { productId },
  });
  return mapFavorite(data);
};

export const removeFavoriteApi = async (token, favoritoId) => {
  await apiFetch(`/favorites/${favoritoId}`, { token, method: 'DELETE' });
};
