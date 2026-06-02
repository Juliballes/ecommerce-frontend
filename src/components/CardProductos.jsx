import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import './CardProductos.css';

// Card reutilizable — recibe el producto y opcionalmente badges como children
const CardProductos = ({ product, children }) => {
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const { token } = useAuth();
  const navigate = useNavigate();
  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // el corazón está dentro de un Link, corto la navegación
    if (!token) {
      navigate('/login');
      return;
    }
    if (isFavorite) await removeFromFavorite(product.id);
    else await addToFavorite(product);
  };

  return (
    <div className="card-producto">
      <div className="producto-imagen-container">
        <button
          type="button"
          className={`btn-favorito ${isFavorite ? 'activo' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <img
          src={product.imagenes?.[0] || product.imagen || ''}
          alt={product.nombre}
          className="producto-imagen"
        />
        {product.categorias?.[0]?.nombre && (
          <span className="producto-categoria">
            {product.categorias[0].nombre}
          </span>
        )}
      </div>

      <div className="producto-info">
        <h3 className="producto-nombre">{product.nombre}</h3>
        <p className="producto-descripcion">{product.descripcion}</p>

        {product.vendedorNombre && (
          <p className="producto-vendedor">Vendido por: {product.vendedorNombre}</p>
        )}

        <div className="producto-stock">
          <span className={product.stock > 0 ? 'en-stock' : 'sin-stock'}>
            {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Agotado'}
          </span>
        </div>

        <div className="producto-badges">{children}</div>

        <div className="producto-footer">
          <span className="producto-precio">
            ${Number(product.precio).toLocaleString('es-AR')}
          </span>
          <button className="btn-agregar" disabled={product.stock === 0}>
            {product.stock > 0 ? 'Ver detalle' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductos;
