import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';
import CardProductos from './CardProductos';
import './ProductList.css';

const ProductList = ({ categoriaId = null, soloOfertas = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orden, setOrden] = useState('recientes');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let items;

        // Filtro por categoría: el backend lo expone en GET /api/productos/search
        if (categoriaId) {
          const response = await fetch(
            `${API_URL}/productos/search?categoriaId=${categoriaId}&page=0&size=4`
          );
          if (!response.ok) throw new Error('Error al cargar los productos');
          const data = await response.json();
          items = data.content ?? [];
        } else {
          const response = await fetch(`${API_URL}/productos`);
          if (!response.ok) throw new Error('Error al cargar los productos');
          items = await response.json();
        }

        if (soloOfertas) {
          items = items.filter((p) => p.entregaGratis);
        }

        setProducts(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoriaId, soloOfertas]);

  const productosOrdenados = [...products].sort((a, b) => {
    if (orden === 'precio-asc') return a.precio - b.precio;
    if (orden === 'precio-desc') return b.precio - a.precio;
    if (orden === 'nombre') return a.nombre.localeCompare(b.nombre);
    return b.id - a.id;
  });

  if (loading) return <div className="estado-carga">Cargando productos...</div>;
  if (error) return <div className="estado-error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <p className="product-list-count">
          {products.length} {products.length === 1 ? 'Producto' : 'Productos'}
          {categoriaId && ' en esta categoría'}
        </p>
        <div className="product-list-sort">
          <label htmlFor="orden">Ordenar por</label>
          <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="product-list-vacio">
          {soloOfertas
            ? 'No hay productos con envío gratis en este momento.'
            : categoriaId
              ? 'No hay productos en esta categoría.'
              : 'No hay productos disponibles.'}
        </div>
      ) : (
        <div className="products-grid">
          {productosOrdenados.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="product-card-link"
            >
              <CardProductos product={product}>
                {product.entregaGratis && (
                  <span className="badge badge-envio">Envío gratis</span>
                )}
              </CardProductos>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
