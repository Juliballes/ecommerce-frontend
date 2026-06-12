import { apiFetch } from './api';
import { mergeProductImages } from '../utils/productImages';

const mapCartLine = (line) => ({
  lineaId: line.id,
  id: line.productId,
  nombre: line.nombreProducto,
  precio: line.precioActual,
  cantidad: line.cantidad,
  stock: line.stockDisponible,
});

const hydrateCartImages = async (items) =>
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

const mapCartResponse = async (lines) => {
  const items = Array.isArray(lines) ? lines.map(mapCartLine) : [];
  return hydrateCartImages(items);
};

export const getCart = async (token) => {
  const lines = await apiFetch('/cart', { token });
  return mapCartResponse(lines);
};

export const addCartItem = async (token, productId, quantity = 1) => {
  const lines = await apiFetch('/cart', {
    token,
    method: 'POST',
    body: { productId, quantity },
  });

  return mapCartResponse(lines);
};

export const updateCartItemQuantity = async (token, productId, quantity) => {
  const lines = await apiFetch('/cart', {
    token,
    method: 'PUT',
    body: { productId, quantity },
  });

  return mapCartResponse(lines);
};

export const removeCartLine = async (token, lineId) => {
  const lines = await apiFetch(`/cart/${lineId}`, {
    token,
    method: 'DELETE',
  });

  return mapCartResponse(lines);
};

export const clearRemoteCart = async (token) => {
  const lines = await apiFetch('/cart', {
    token,
    method: 'DELETE',
  });

  return mapCartResponse(lines);
};
