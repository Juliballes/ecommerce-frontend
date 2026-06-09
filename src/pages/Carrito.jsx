import { useEffect, useState } from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import { getProductImageSrc } from '../utils/productImages';
import './Carrito.css';

const direccionVacia = {
  calle: '',
  numero: '',
  codigoPostal: '',
  ciudad: '',
  provincia: '',
  pais: 'Argentina',
  referencia: '',
};

// Carrito conectado al backend: direcciones, checkout y pago mock
const Carrito = () => {
  const { items, eliminarDelCarrito, vaciarCarrito, calcularTotal } = useCarrito();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState('');
  const [nuevaDir, setNuevaDir] = useState(direccionVacia);
  const [mostrarFormDir, setMostrarFormDir] = useState(false);
  const [pedidoPendiente, setPedidoPendiente] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargo mis direcciones al entrar (GET /api/direcciones)
    if (!token) return;

    const cargar = async () => {
      try {
        const data = await apiFetch('/direcciones', { token });
        setDirecciones(data);
        const principal = data.find((d) => d.principal);
        if (principal) setDireccionId(String(principal.id));
        else if (data.length > 0) setDireccionId(String(data[0].id));
      } catch {
        setDirecciones([]);
      }
    };

    cargar();
  }, [token]);

  const handleGuardarDireccion = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const creada = await apiFetch('/direcciones', {
        token,
        method: 'POST',
        body: { ...nuevaDir, principal: direcciones.length === 0 },
      });
      setDirecciones((prev) => [...prev, creada]);
      setDireccionId(String(creada.id));
      setNuevaDir(direccionVacia);
      setMostrarFormDir(false);
    } catch (err) {
      alert('Error al guardar dirección: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const body = direccionId ? { direccionId: Number(direccionId) } : {};
      const pedido = await apiFetch('/pedidos/checkout', {
        token,
        method: 'POST',
        body,
      });

      await vaciarCarrito();
      setPedidoPendiente(pedido);
    } catch (err) {
      alert('Error al confirmar pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePago = async (aprobado) => {
    if (!pedidoPendiente) return;
    setLoading(true);
    try {
      await apiFetch('/pagos/mock', {
        token,
        method: 'POST',
        body: {
          pedidoId: pedidoPendiente.id,
          resultado: aprobado ? 'APROBADO' : 'RECHAZADO',
        },
      });
      alert(aprobado ? '¡Pago aprobado!' : 'Pago rechazado.');
      navigate('/mis-compras');
    } catch (err) {
      alert('Error en el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="carrito-vacio">
        <h2>Iniciá sesión para ver tu carrito</h2>
        <button className="btn-ir-home" onClick={() => navigate('/login')}>
          Ir al login
        </button>
      </div>
    );
  }

  if (pedidoPendiente) {
    return (
      <div className="carrito-container">
        <h1 className="carrito-titulo">Pago del pedido #{pedidoPendiente.id}</h1>
        <p className="checkout-ayuda">
          Estado: <strong>{pedidoPendiente.estado}</strong> — Total:{' '}
          ${Number(pedidoPendiente.total).toLocaleString('es-AR')}
        </p>
        <p className="checkout-ayuda">
          Simulación de pago (POST /api/pagos/mock)
        </p>
        <div className="carrito-acciones">
          <button
            className="btn-checkout"
            disabled={loading}
            onClick={() => handlePago(true)}
          >
            Aprobar pago
          </button>
          <button
            className="btn-vaciar"
            disabled={loading}
            onClick={() => handlePago(false)}
          >
            Rechazar pago
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>¡Explorá nuestros productos y agregá algo!</p>
        <button className="btn-ir-home" onClick={() => navigate('/')}>
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h1 className="carrito-titulo">Tu Carrito</h1>

      <div className="carrito-lista">
        {items.map((item) => (
          <div key={item.lineaId} className="carrito-item">
            <img
              src={getProductImageSrc(item)}
              alt={item.nombre}
              className="item-imagen"
            />

            <div className="item-info">
              <p className="item-nombre">{item.nombre}</p>
              <p className="item-precio">
                ${Number(item.precio).toLocaleString('es-AR')}
              </p>
              <p className="item-cantidad">Cantidad: {item.cantidad}</p>
            </div>
            <div className="item-subtotal">
              <p>${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
              <button
                className="btn-eliminar"
                onClick={() => eliminarDelCarrito(item.lineaId)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-seccion">
        <h3>Dirección de envío</h3>

        {direcciones.length > 0 ? (
          <select
            className="checkout-select"
            value={direccionId}
            onChange={(e) => setDireccionId(e.target.value)}
          >
            {direcciones.map((d) => (
              <option key={d.id} value={d.id}>
                {d.calle} {d.numero}, {d.ciudad} ({d.codigoPostal})
                {d.principal ? ' — Principal' : ''}
              </option>
            ))}
          </select>
        ) : (
          <p className="checkout-ayuda">No tenés direcciones guardadas. Agregá una abajo.</p>
        )}

        <button
          type="button"
          className="btn-link-dir"
          onClick={() => setMostrarFormDir(!mostrarFormDir)}
        >
          {mostrarFormDir ? 'Cancelar' : '+ Nueva dirección'}
        </button>

        {mostrarFormDir && (
          <div className="form-direccion">
            <input
              placeholder="Calle"
              value={nuevaDir.calle}
              onChange={(e) => setNuevaDir({ ...nuevaDir, calle: e.target.value })}
            />
            <input
              placeholder="Número"
              value={nuevaDir.numero}
              onChange={(e) => setNuevaDir({ ...nuevaDir, numero: e.target.value })}
            />
            <input
              placeholder="Código postal"
              value={nuevaDir.codigoPostal}
              onChange={(e) => setNuevaDir({ ...nuevaDir, codigoPostal: e.target.value })}
            />
            <input
              placeholder="Ciudad"
              value={nuevaDir.ciudad}
              onChange={(e) => setNuevaDir({ ...nuevaDir, ciudad: e.target.value })}
            />
            <input
              placeholder="Provincia"
              value={nuevaDir.provincia}
              onChange={(e) => setNuevaDir({ ...nuevaDir, provincia: e.target.value })}
            />
            <button
              type="button"
              className="btn-checkout"
              disabled={loading}
              onClick={handleGuardarDireccion}
            >
              Guardar dirección
            </button>
          </div>
        )}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <span>Total:</span>
          <span className="total-monto">
            ${Number(calcularTotal()).toLocaleString('es-AR')}
          </span>
        </div>

        <div className="carrito-acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>
          <button
            className="btn-checkout"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
