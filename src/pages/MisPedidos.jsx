import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import './Pedidos.css';

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString('es-AR') : '-';

const formatearPrecio = (monto) =>
  `$${Number(monto).toLocaleString('es-AR')}`;

const claseEstado = (estado) => {
  const mapa = {
    PENDIENTE_PAGO: 'estado-pendiente',
    PAGADO: 'estado-pagado',
    ENVIADO: 'estado-enviado',
    ENTREGADO: 'estado-entregado',
    CANCELADO: 'estado-cancelado',
  };
  return mapa[estado] || 'estado-pendiente';
};

// MisPedidos: lista COMPLETA de pedidos del comprador (sin paginación)
// GET /api/pedidos/mis-pedidos → List<PedidoResponseDTO> con ítems incluidos
const MisPedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const cargar = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/pedidos/mis-pedidos', { token });
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [token]);

  if (loading) return <div className="pedidos-estado">Cargando pedidos...</div>;
  if (error) return <div className="pedidos-error">Error: {error}</div>;

  return (
    <div className="pedidos-container">
      <h1 className="pedidos-titulo">Mis Pedidos</h1>
      <p className="pedidos-subtitulo">Detalle completo de cada pedido</p>

      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">
          Todavía no realizaste ningún pedido.
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-cabecera">
                <div>
                  <p className="pedido-id">Pedido #{pedido.id}</p>
                  <p className="pedido-fecha">{formatearFecha(pedido.fecha)}</p>
                </div>
                <span className={`pedido-estado ${claseEstado(pedido.estado)}`}>
                  {pedido.estado}
                </span>
              </div>

              {pedido.direccionEnvio && (
                <p className="pedido-fecha">Envío: {pedido.direccionEnvio}</p>
              )}
              {pedido.notas && (
                <p className="pedido-fecha">Notas: {pedido.notas}</p>
              )}

              {/* items: cada línea del pedido con precio snapshot del checkout */}
              <div className="pedido-items">
                <h4>Productos</h4>
                {pedido.items?.map((item) => (
                  <div key={item.id} className="pedido-linea">
                    <span>
                      {item.nombreProducto} × {item.cantidad}
                    </span>
                    <span>{formatearPrecio(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <p className="pedido-total">Total: {formatearPrecio(pedido.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
