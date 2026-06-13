import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { getMisPedidos } from '../services/pedidoApi';
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

const etiquetaEstado = (estado) => {
  const mapa = {
    PENDIENTE_PAGO: 'Pendiente de pago',
    PAGADO: 'Pagado',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
  };
  return mapa[estado] || estado;
};

const calcularItemsResenados = (pedidos, resenasPorProducto, nombreUsuario) => {
  const resenados = new Set();
  if (!nombreUsuario) return resenados;

  const itemsPorProducto = {};
  for (const pedido of pedidos) {
    if (pedido.estado !== 'ENTREGADO') continue;
    for (const item of pedido.items ?? []) {
      if (!item.productoId) continue;
      if (!itemsPorProducto[item.productoId]) itemsPorProducto[item.productoId] = [];
      itemsPorProducto[item.productoId].push(item.id);
    }
  }

  for (const [productoId, itemIds] of Object.entries(itemsPorProducto)) {
    const resenas = resenasPorProducto[productoId] ?? [];
    const misResenas = resenas.filter((r) => r.nombreComprador === nombreUsuario).length;
    for (let i = 0; i < Math.min(misResenas, itemIds.length); i++) {
      resenados.add(itemIds[i]);
    }
  }

  return resenados;
};

// Mis compras: historial con detalle de productos y reseñas
const MisCompras = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [itemsResenados, setItemsResenados] = useState(new Set());
  const [itemResenaAbierta, setItemResenaAbierta] = useState(null);
  const [resenaForm, setResenaForm] = useState({ puntuacion: 5, comentario: '' });
  const [resenaError, setResenaError] = useState(null);
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [confirmandoRecepcion, setConfirmandoRecepcion] = useState(null);

  const cargarPedidos = useCallback(async () => {
    if (!token) {
      setPedidos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [data, perfil] = await Promise.all([
        getMisPedidos(token),
        apiFetch('/usuarios/me', { token }),
      ]);

      setPedidos(data);

      const nombre =
        perfil?.nombre && perfil?.apellido
          ? `${perfil.nombre} ${perfil.apellido}`
          : null;

      const productoIds = [
        ...new Set(
          data.flatMap((pedido) =>
            pedido.estado === 'ENTREGADO'
              ? (pedido.items ?? []).map((item) => item.productoId).filter(Boolean)
              : []
          )
        ),
      ];

      const resenasPorProducto = {};
      await Promise.all(
        productoIds.map(async (productoId) => {
          resenasPorProducto[productoId] = await apiFetch(
            `/resenas/productos/${productoId}`
          );
        })
      );

      setItemsResenados(calcularItemsResenados(data, resenasPorProducto, nombre));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const abrirFormResena = (itemId) => {
    setItemResenaAbierta(itemId);
    setResenaForm({ puntuacion: 5, comentario: '' });
    setResenaError(null);
  };

  const cerrarFormResena = () => {
    setItemResenaAbierta(null);
    setResenaForm({ puntuacion: 5, comentario: '' });
    setResenaError(null);
  };

  const handleConfirmarRecepcion = async (pedidoId) => {
    setConfirmandoRecepcion(pedidoId);
    try {
      await apiFetch(`/pedidos/${pedidoId}/estado`, {
        token,
        method: 'PATCH',
        body: { nuevoEstado: 'ENTREGADO' },
      });
      await cargarPedidos();
    } catch {
      alert('No se pudo confirmar la recepción. El pedido tiene que estar en estado Enviado.');
    } finally {
      setConfirmandoRecepcion(null);
    }
  };

  const handleEnviarResena = async (e, pedidoItemId) => {
    e.preventDefault();
    setResenaError(null);
    setEnviandoResena(true);

    try {
      await apiFetch(`/resenas?pedidoItemId=${pedidoItemId}`, {
        token,
        method: 'POST',
        body: {
          puntuacion: Number(resenaForm.puntuacion),
          comentario: resenaForm.comentario,
        },
      });

      setItemsResenados((prev) => new Set([...prev, pedidoItemId]));
      cerrarFormResena();
    } catch (err) {
      if (err.status === 409) {
        setItemsResenados((prev) => new Set([...prev, pedidoItemId]));
        setResenaError('Ya dejaste reseña para este producto.');
      } else {
        setResenaError('No se pudo publicar la reseña. Intentá de nuevo.');
      }
    } finally {
      setEnviandoResena(false);
    }
  };

  if (loading) return <div className="pedidos-estado">Cargando compras...</div>;
  if (error) return <div className="pedidos-error">Error: {error}</div>;

  return (
    <div className="pedidos-container">
      <h1 className="pedidos-titulo">Mis Compras</h1>
      <p className="pedidos-subtitulo">
        Tus pedidos con detalle de productos. Podés dejar reseñas cuando el pedido esté entregado.
      </p>

      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">Todavía no realizaste ninguna compra.</div>
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
                  {etiquetaEstado(pedido.estado)}
                </span>
              </div>

              {pedido.direccionEnvio && (
                <p className="pedido-fecha">Envío: {pedido.direccionEnvio}</p>
              )}

              {pedido.estado === 'ENVIADO' && (
                <div className="pedido-accion-recepcion">
                  <p className="pedido-ayuda">
                    ¿Ya recibiste el pedido? Confirmá la recepción para poder dejar reseñas.
                  </p>
                  <button
                    type="button"
                    className="btn-confirmar-recepcion"
                    disabled={confirmandoRecepcion === pedido.id}
                    onClick={() => handleConfirmarRecepcion(pedido.id)}
                  >
                    {confirmandoRecepcion === pedido.id
                      ? 'Confirmando...'
                      : 'Confirmar que lo recibí'}
                  </button>
                </div>
              )}

              <div className="pedido-items">
                <h4>Productos</h4>
                {pedido.items?.map((item) => {
                  const puedeResenar =
                    pedido.estado === 'ENTREGADO' && !itemsResenados.has(item.id);
                  const formAbierto = itemResenaAbierta === item.id;

                  return (
                    <div key={item.id} className="pedido-linea-detalle">
                      <div className="pedido-linea">
                        <span>
                          {item.productoId ? (
                            <Link
                              to={`/products/${item.productoId}`}
                              className="pedido-producto-link"
                            >
                              {item.nombreProducto}
                            </Link>
                          ) : (
                            item.nombreProducto
                          )}{' '}
                          × {item.cantidad}
                        </span>
                        <span>{formatearPrecio(item.subtotal)}</span>
                      </div>

                      {puedeResenar && !formAbierto && (
                        <button
                          type="button"
                          className="btn-resena-item"
                          onClick={() => abrirFormResena(item.id)}
                        >
                          Dejar reseña
                        </button>
                      )}

                      {pedido.estado !== 'ENTREGADO' &&
                        pedido.estado !== 'CANCELADO' &&
                        !itemsResenados.has(item.id) && (
                          <p className="pedido-ayuda-item">
                            Reseña disponible cuando el pedido esté entregado.
                          </p>
                        )}

                      {itemsResenados.has(item.id) && (
                        <span className="resena-hecha">✔ Reseña publicada</span>
                      )}

                      {formAbierto && (
                        <form
                          className="resena-form-pedido"
                          onSubmit={(e) => handleEnviarResena(e, item.id)}
                        >
                          <div className="resena-form-fila">
                            <label htmlFor={`puntuacion-${item.id}`}>Puntuación</label>
                            <select
                              id={`puntuacion-${item.id}`}
                              value={resenaForm.puntuacion}
                              onChange={(e) =>
                                setResenaForm({ ...resenaForm, puntuacion: e.target.value })
                              }
                            >
                              {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>
                                  {n} estrellas
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="resena-form-fila">
                            <label htmlFor={`comentario-${item.id}`}>
                              Comentario (opcional)
                            </label>
                            <textarea
                              id={`comentario-${item.id}`}
                              placeholder="Contanos tu experiencia"
                              value={resenaForm.comentario}
                              onChange={(e) =>
                                setResenaForm({ ...resenaForm, comentario: e.target.value })
                              }
                              rows={2}
                            />
                          </div>

                          {resenaError && (
                            <p className="resena-error-pedido">{resenaError}</p>
                          )}

                          <div className="resena-form-acciones">
                            <button
                              type="submit"
                              className="btn-resena-publicar"
                              disabled={enviandoResena}
                            >
                              {enviandoResena ? 'Publicando...' : 'Publicar reseña'}
                            </button>
                            <button
                              type="button"
                              className="btn-resena-cancelar"
                              onClick={cerrarFormResena}
                              disabled={enviandoResena}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="pedido-total">Total: {formatearPrecio(pedido.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCompras;
