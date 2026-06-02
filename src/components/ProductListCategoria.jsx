import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import './ProductListCategoria.css';

// Filtro por categoría: primero cargo categorías, después productos al elegir una
const ProductListCategoria = () => {
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState(null);

  // Efecto 1: GET /api/categorias al montar (solo una vez)
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categorias');
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Efecto 2: cuando cambia la categoría elegida, filtro productos con ?categoriaId=
  useEffect(() => {
    if (!categoriaSeleccionada) return;

    const fetchProductosPorCategoria = async () => {
      setLoadingProductos(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/productos?categoriaId=${categoriaSeleccionada}`
        );
        if (!response.ok) throw new Error('Error al filtrar productos');
        const data = await response.json();
        setProductosFiltrados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductosPorCategoria();
  }, [categoriaSeleccionada]);

  if (loadingCategorias) return <div className="estado-carga">Cargando categorías...</div>;
  if (error) return <div className="estado-error">Error: {error}</div>;

  return (
    <div className="categorias-container">
      <h2 className="categorias-titulo">Categorías</h2>

      <div className="categorias-lista">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            // Ternario: marco la categoría activa con otra clase CSS
            className={`btn-categoria ${categoriaSeleccionada === cat.id ? 'activa' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}

        {categoriaSeleccionada && (
          <button
            className="btn-categoria btn-limpiar"
            onClick={() => {
              setCategoriaSeleccionada(null);
              setProductosFiltrados([]);
            }}
          >
            ✕ Ver todos
          </button>
        )}
      </div>

      {categoriaSeleccionada && (
        <div className="productos-filtrados">
          {loadingProductos ? (
            <div className="estado-carga">Cargando productos...</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="sin-productos">No hay productos en esta categoría.</div>
          ) : (
            <div className="grid-filtrado">
              {productosFiltrados.map((product) => (
                <div key={product.id} className="card-mini">
                  <button
                    type="button"
                    className="btn-favorito-mini"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation(); // evito que el Link navegue al hacer click en el corazón
                      if (!token) {
                        navigate('/login');
                        return;
                      }
                      const isFav = favoriteItems.some((item) => item.id === product.id);
                      if (isFav) await removeFromFavorite(product.id);
                      else await addToFavorite(product);
                    }}
                  >
                    {favoriteItems.some((item) => item.id === product.id) ? '❤️' : '🤍'}
                  </button>
                  <Link to={`/products/${product.id}`} className="card-mini-link">
                    <img
                      src={product.imagenes?.[0] || product.imagen || ''}
                      alt={product.nombre}
                      className="card-mini-img"
                    />
                    <div className="card-mini-info">
                      <p className="card-mini-nombre">{product.nombre}</p>
                      <p className="card-mini-precio">
                        ${Number(product.precio).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListCategoria;
