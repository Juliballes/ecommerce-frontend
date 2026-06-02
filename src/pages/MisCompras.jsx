import React from 'react';
import PedidosPaginados from '../components/PedidosPaginados';

// MisCompras: historial paginado donde vos sos el comprador
// Delegamos en PedidosPaginados que llama GET /api/pedidos/mis-compras
const MisCompras = () => (
  <PedidosPaginados
    titulo="Mis Compras"
    endpoint="mis-compras"
    mensajeVacio="No tenés compras registradas."
  />
);

export default MisCompras;
