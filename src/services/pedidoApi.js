import { apiFetch } from './api';

export const checkoutCart = async (token, checkoutData = {}) =>
  apiFetch('/pedidos/checkout', {
    token,
    method: 'POST',
    body: checkoutData,
  });

export const getMisPedidos = async (token) =>
  apiFetch('/pedidos/mis-pedidos', { token });
