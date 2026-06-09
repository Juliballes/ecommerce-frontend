import React from 'react';
import PedidosPaginados from '../components/PedidosPaginados';

// Mis ventas: pedidos donde vendí al menos un producto (GET /api/pedidos/mis-ventas)
const MisVentas = () => (
  <PedidosPaginados
    titulo="Mis Ventas"
    endpoint="mis-ventas"
    mensajeVacio="Todavía no vendiste productos en ningún pedido."
  />
);

export default MisVentas;
