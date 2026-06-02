import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CardProductos from './CardProductos';
import './ProductList.css';

// Listado general de productos — GET /api/productos (público, no lleva token)
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect con []: cargo los productos una sola vez al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (!response.ok) throw new Error('Error al cargar los productos');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Renderizado condicional según loading / error
  if (loading) return <div className="estado-carga">Cargando productos...</div>;
  if (error) return <div className="estado-error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Productos</h2>

      <div className="products-grid">
        {products.length === 0 && <div>No hay productos disponibles.</div>}

        {/* .map() para renderizar una card por producto; Link navega sin recargar la página */}
        {products.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <CardProductos product={product}>
              {product.entregaGratis && (
                <span className="badge badge-envio">Envío gratis</span>
              )}
              {product.compraInternacional && (
                <span className="badge badge-internacional">Compra internacional</span>
              )}
            </CardProductos>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
