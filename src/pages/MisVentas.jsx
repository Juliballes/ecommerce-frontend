import React from 'react';
import PedidosPaginados from '../components/PedidosPaginados';

// MisVentas: pedidos que incluyen al menos un producto tuyo (actuás como vendedor)
// GET /api/pedidos/mis-ventas — mismo formato paginado que mis-compras
const MisVentas = () => (
  <PedidosPaginados
    titulo="Mis Ventas"
    endpoint="mis-ventas"
    mensajeVacio="Todavía no vendiste productos en ningún pedido."
  />
);

export default MisVentas;
