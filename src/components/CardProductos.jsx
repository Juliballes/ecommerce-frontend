import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { addFavorite, removeFromFavorite } from '../store/slices/favoriteSlice';
import { addFavoriteApi, removeFavoriteApi } from '../services/favoritesApi';
import { setCartItems } from '../store/slices/cartSlice';
import { addCartItem } from '../services/cartApi';
import { getProductImageSrc } from '../utils/productImages';
import './CardProductos.css';

const IconHeart = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20.5l-1-.9C5.5 14.8 2 11.6 2 7.8 2 5 4.2 3 6.8 3c1.6 0 3.1.8 4 2.1C11.7 3.8 13.2 3 14.8 3 17.4 3 19.6 5 19.6 7.8c0 3.8-3.5 7-9 11.8l-1 .9z" />
  </svg>
);

const CardProductos = ({ product, children }) => {
  const favoriteItems = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [agregando, setAgregando] = useState(false);
  const isFavorite = favoriteItems.some((item) => item.id === product.id);
  const sinStock = product.stock === 0;
  const categoria = product.categorias?.[0]?.nombre;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      const favoriteItem = favoriteItems.find((item) => item.id === product.id);
      dispatch(removeFromFavorite(product.id));
      if (token && favoriteItem?.favoritoId) {
        try {
          await removeFavoriteApi(token, favoriteItem.favoritoId);
        } catch {
          dispatch(addFavorite(favoriteItem));
        }
      }
    } else {
      if (token) {
        try {
          const saved = await addFavoriteApi(token, product.id);
          dispatch(addFavorite({ ...product, favoritoId: saved.favoritoId }));
        } catch { /* ignore */ }
      } else {
        dispatch(addFavorite(product));
      }
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (sinStock) return;

    if (!token) {
      navigate('/login');
      return;
    }

    setAgregando(true);
    try {
      const items = await addCartItem(token, product.id, 1);
      dispatch(setCartItems(items));
    } catch {
      alert('No se pudo agregar el producto al carrito.');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <article className="card-producto">
      <div className="producto-imagen-container">
        {!isAdmin && (
          <button
            type="button"
            className={`btn-favorito ${isFavorite ? 'activo' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
          >
            <IconHeart filled={isFavorite} />
          </button>
        )}

        {sinStock && <span className="producto-badge-agotado">Agotado</span>}

        <img
          src={getProductImageSrc(product)}
          alt={product.nombre}
          className="producto-imagen"
          loading="lazy"
        />
      </div>

      <div className="producto-info">
        {children}

        <h3 className="producto-nombre">{product.nombre}</h3>

        {categoria && <p className="producto-categoria-texto">{categoria}</p>}

        {isAdmin ? (
          <p className="producto-precio">
            ${Number(product.precio).toLocaleString('es-AR')}
          </p>
        ) : (
          <div className="producto-footer">
            <p className="producto-precio">
              ${Number(product.precio).toLocaleString('es-AR')}
            </p>
            <button
              type="button"
              className="btn-carrito"
              onClick={handleAddToCart}
              disabled={sinStock || agregando}
            >
              {sinStock ? 'Sin stock' : agregando ? 'Agregando...' : 'Agregar al carrito'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default CardProductos;
