import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, removeFromCart } from '../store/slices/cartSlice';
import { getProductImageSrc } from '../utils/productImages';
import './Carrito.css';

// Carrito conectado al estado global de Redux
const Carrito = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [compraConfirmada, setCompraConfirmada] = useState(false);

  const calcularTotal = () =>
    items.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const confirmarCompra = () => {
    dispatch(clearCart());
    setCompraConfirmada(true);
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
        {items.map((item) => (
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
              <p className="item-cantidad">Cantidad: {item.cantidad}</p>
            </div>

            <div className="item-subtotal">
              <p>${Number(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
              <button
                className="btn-eliminar"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <span>Total:</span>
          <span className="total-monto">
            ${Number(calcularTotal()).toLocaleString('es-AR')}
          </span>
        </div>

        <div className="carrito-acciones">
          <button className="btn-vaciar" onClick={() => dispatch(clearCart())}>
            Vaciar carrito
          </button>
          <button className="btn-checkout" onClick={confirmarCompra}>
            Confirmar compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
