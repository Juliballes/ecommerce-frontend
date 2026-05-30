import React from 'react';
import { useFavorite } from '../context/FavoriteContext';
import './CardProductos.css';

// CardProductos recibe el objeto product y children (badges de envío)
// Los children se pasan desde ProductList de forma condicional
const CardProductos = ({ product, children }) => {
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const isFavorite = favoriteItems.some((item) => item.id === product.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isFavorite ? removeFromFavorite(product.id) : addToFavorite(product);
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
        {/* Renderizado condicional: solo muestra la categoría si existe */}
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

        {/* Renderizado condicional: stock disponible o agotado */}
        <div className="producto-stock">
          <span className={product.stock > 0 ? 'en-stock' : 'sin-stock'}>
            {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Agotado'}
          </span>
        </div>

        {/* children: badges pasados desde el padre (envío gratis, compra internacional) */}
        <div className="producto-badges">
          {children}
        </div>

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
