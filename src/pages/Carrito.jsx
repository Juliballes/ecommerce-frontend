import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setCartItems } from '../store/slices/cartSlice';
import {
  clearRemoteCart,
  removeCartLine,
  updateCartItemQuantity,
} from '../services/cartApi';
import { getProductImageSrc } from '../utils/productImages';
import './Carrito.css';

// Carrito conectado al estado global de Redux
const Carrito = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [compraConfirmada, setCompraConfirmada] = useState(false);
  const [operando, setOperando] = useState(false);

  const calcularTotal = () =>
    items.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const requerirSesion = () => {
    if (token) return true;
    navigate('/login');
    return false;
  };

  const aplicarCarrito = async (operacion, mensajeError) => {
    if (!requerirSesion()) return;

    setOperando(true);
    try {
      const carritoActualizado = await operacion();
      dispatch(setCartItems(carritoActualizado));
    } catch {
      alert(mensajeError);
    } finally {
      setOperando(false);
    }
  };

  const sumarCantidad = (item) => {
    aplicarCarrito(
      () => updateCartItemQuantity(token, item.id, item.cantidad + 1),
      'No se pudo actualizar la cantidad.'
    );
  };

  const restarCantidad = (item) => {
    aplicarCarrito(
      () => updateCartItemQuantity(token, item.id, item.cantidad - 1),
      'No se pudo actualizar la cantidad.'
    );
  };

  const eliminarItem = (item) => {
    aplicarCarrito(
      () =>
        item.lineaId
          ? removeCartLine(token, item.lineaId)
          : updateCartItemQuantity(token, item.id, 0),
      'No se pudo eliminar el producto del carrito.'
    );
  };

  const vaciarCarrito = () => {
    aplicarCarrito(
      () => clearRemoteCart(token),
      'No se pudo vaciar el carrito.'
    );
  };

  const confirmarCompra = async () => {
    if (!requerirSesion()) return;

    setOperando(true);
    try {
      const carritoActualizado = await clearRemoteCart(token);
      dispatch(setCartItems(carritoActualizado));
      setCompraConfirmada(true);
    } catch {
      alert('No se pudo confirmar la compra.');
    } finally {
      setOperando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>{compraConfirmada ? 'Compra confirmada' : 'Tu carrito esta vacio'}</h2>
        <p>
          {compraConfirmada
            ? 'Gracias por tu compra.'
            : 'Explora nuestros productos y agrega algo.'}
        </p>
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
        {items.map((item) => {
          const alcanzoStock = item.stock !== undefined && item.cantidad >= item.stock;

          return (
            <div key={item.id} className="carrito-item">
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
                <div className="item-cantidad-control" aria-label={`Cantidad de ${item.nombre}`}>
                  <button
                    type="button"
                    className="btn-cantidad"
                    onClick={() => restarCantidad(item)}
                    disabled={operando}
                    aria-label="Restar una unidad"
                  >
                    -
                  </button>
                  <span className="item-cantidad">{item.cantidad}</span>
                  <button
                    type="button"
                    className="btn-cantidad"
                    onClick={() => sumarCantidad(item)}
                    disabled={operando || alcanzoStock}
                    aria-label="Sumar una unidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-subtotal">
                <p>${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarItem(item)}
                  disabled={operando}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <span>Total:</span>
          <span className="total-monto">
            ${Number(calcularTotal()).toLocaleString('es-AR')}
          </span>
        </div>

        <div className="carrito-acciones">
          <button className="btn-vaciar" onClick={vaciarCarrito} disabled={operando}>
            Vaciar carrito
          </button>
          <button className="btn-checkout" onClick={confirmarCompra} disabled={operando}>
            {operando ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
