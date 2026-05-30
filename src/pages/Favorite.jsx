import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import './Favorite.css';

const Favorite = () => {
  const { favoriteItems, removeFromFavorite } = useFavorite();
  const navigate = useNavigate();

  if (favoriteItems.length === 0) {
    return (
      <div className="favoritos-vacio">
        <h2>No tenés productos favoritos</h2>
        <p>¡Tocá el corazón en un producto para guardarlo acá!</p>
        <button className="btn-ir-home" onClick={() => navigate('/')}>
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="favoritos-container">
      <h1 className="favoritos-titulo">Mis Favoritos</h1>

      <div className="favoritos-lista">
        {favoriteItems.map((product) => (
          <div key={product.favoritoId ?? product.id} className="favorito-item">
            <div className="favorito-info">
              <p className="favorito-nombre">{product.nombre}</p>
              <p className="favorito-precio">
                ${Number(product.precio).toLocaleString('es-AR')}
              </p>
            </div>

            <div className="favorito-acciones">
              <Link to={`/products/${product.id}`} className="btn-ver-detalle">
                Ver detalle
              </Link>
              <button
                className="btn-quitar-favorito"
                onClick={() => removeFromFavorite(product.id)}
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
