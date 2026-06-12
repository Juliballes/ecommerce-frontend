import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromFavorite } from '../store/slices/favoriteSlice';
import { getProductImageSrc } from '../utils/productImages';
import './Favorite.css';

// Página de favoritos conectada al estado global de Redux
const Favorite = () => {
  const favoriteItems = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();
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
            <img
              src={getProductImageSrc(product)}
              alt={product.nombre}
              className="favorito-imagen"
            />

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
                onClick={() => dispatch(removeFromFavorite(product.id))}
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
