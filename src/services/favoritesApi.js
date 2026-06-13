import { apiFetch } from './api';
import { mergeProductImages } from '../utils/productImages';

const mapFavorite = (fav) => ({
  id: fav.productId,
  favoritoId: fav.id,
  nombre: fav.nombreProducto,
  precio: fav.precio,
});

const hydrateFavoriteImages = (items) =>
  Promise.all(
    items.map(async (item) => {
      try {
        const productDetail = await apiFetch(`/productos/${item.id}`);
        return mergeProductImages(item, productDetail);
      } catch {
        return item;
      }
    })
  );

export const getFavorites = async (token) => {
  const data = await apiFetch('/favorites', { token });
  const items = Array.isArray(data) ? data.map(mapFavorite) : [];
  return hydrateFavoriteImages(items);
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
