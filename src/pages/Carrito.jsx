import React from 'react';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api';
import './Carrito.css';

// Carrito: muestra los items del carrito y permite hacer checkout
// Renderizado condicional: si está vacío, muestra mensaje; si no, muestra la lista
const Carrito = () => {
  const { items, eliminarDelCarrito, vaciarCarrito, calcularTotal } = useCarrito();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Checkout: llama al endpoint de pedidos con el token del usuario
  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await apiFetch('/pedidos/checkout', {
        token,
        method: 'POST',
        body: {},
      });

      alert('¡Pedido realizado con éxito! Se descontó el stock.');
      await vaciarCarrito();
      navigate('/');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Renderizado condicional: carrito vacío
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

      {/* Lista de items con .map() — renderizado de listas */}
      <div className="carrito-lista">
        {items.map((item) => (
          <div key={item.lineaId} className="carrito-item">
            <img
              src={item.imagenes?.[0] || item.imagen || ''}
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
              {/* Eliminar un item del carrito */}
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

      {/* Footer del carrito: total y botones */}
      <div className="carrito-footer">
        <div className="carrito-total">
          <span>Total:</span>
          <span className="total-monto">
            ${Number(calcularTotal()).toLocaleString('es-AR')}
          </span>
        </div>

        <div className="carrito-acciones">
          {/* Vaciar todo el carrito */}
          <button className="btn-vaciar" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>

          {/* Checkout: envía el pedido al backend */}
          <button className="btn-checkout" onClick={handleCheckout}>
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
