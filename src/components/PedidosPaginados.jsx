import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import '../pages/Pedidos.css';

// Formatea fecha ISO del backend (LocalDateTime) a texto legible
const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString('es-AR') : '-';

const formatearPrecio = (monto) =>
  `$${Number(monto).toLocaleString('es-AR')}`;

// Clase CSS según el estado del pedido (enum del backend)
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

/**
 * Componente reutilizable para listados paginados de pedidos.
 * Usado por MisCompras y MisVentas: ambos devuelven Page<PedidoSummaryResponseDTO>.
 *
 * @param titulo - Título de la página
 * @param endpoint - Ruta relativa: "mis-compras" o "mis-ventas"
 * @param mensajeVacio - Texto si no hay pedidos
 */
const PedidosPaginados = ({ titulo, endpoint, mensajeVacio }) => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect con [token, page, endpoint]: recarga al cambiar de página o al loguearse
  useEffect(() => {
    if (!token) return;

    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        // Spring Page: query params page (0-based) y size
        const data = await apiFetch(
          `/pedidos/${endpoint}?page=${page}&size=10`,
          { token }
        );
        setPedidos(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (err) {
        setError(err.message);
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [token, page, endpoint]);

  if (loading) return <div className="pedidos-estado">Cargando...</div>;
  if (error) return <div className="pedidos-error">Error: {error}</div>;

  return (
    <div className="pedidos-container">
      <h1 className="pedidos-titulo">{titulo}</h1>
      <p className="pedidos-subtitulo">Historial de tus pedidos</p>

      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">{mensajeVacio}</div>
      ) : (
        <>
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
                <p>Ítems: {pedido.cantidadItems}</p>
                <p className="pedido-total">Total: {formatearPrecio(pedido.total)}</p>
              </div>
            ))}
          </div>

          {/* Paginación simple: el backend devuelve totalPages en la respuesta Page */}
          {totalPages > 1 && (
            <div className="pedidos-paginacion">
              <button
                className="btn-pagina"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Anterior
              </button>
              <span className="pedidos-pagina-info">
                Página {page + 1} de {totalPages}
              </span>
              <button
                className="btn-pagina"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PedidosPaginados;
