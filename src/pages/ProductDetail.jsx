import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

// ProductDetail: muestra el detalle de un producto
// useParams() lee el :id de la URL (ruta dinámica /products/:id)
const ProductDetail = () => {
  const { id } = useParams(); // Obtenemos el parámetro id de la URL
  const navigate = useNavigate(); // Para redirigir programáticamente
  const { agregarAlCarrito } = useCarrito();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agregado, setAgregado] = useState(false);

  // useEffect con [id]: se ejecuta al montar Y cada vez que cambia el id de la URL
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // GET /api/productos/:id es público (no necesita token)
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Dependencia [id]: si el usuario navega a otro producto, se vuelve a llamar

  const handleAgregarAlCarrito = () => {
    if (!token) {
      // Si no está logueado, redirigimos al login (useNavigate)
      navigate('/login');
      return;
    }
    if (product.stock > 0) {
      agregarAlCarrito(product);
      setAgregado(true);
      // Después de 2 segundos, ocultamos el mensaje de confirmación
      setTimeout(() => setAgregado(false), 2000);
    }
  };

  // Renderizado condicional según el estado
  if (loading) return <div className="detalle-estado">Cargando producto...</div>;
  if (error) return <div className="detalle-estado detalle-error">Error: {error}</div>;
  if (!product) return null;

  return (
    <div className="detalle-container">
      <button className="btn-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-card">
        <div className="detalle-imagen-container">
          <img
            src={product.imagenes?.[0] || product.imagen || ''}
            alt={product.nombre}
            className="detalle-imagen"
          />
        </div>

        <div className="detalle-info">
          {/* Categoría */}
          {product.categorias?.[0]?.nombre && (
            <span className="detalle-categoria">{product.categorias[0].nombre}</span>
          )}

          <h1 className="detalle-nombre">{product.nombre}</h1>
          <p className="detalle-descripcion">{product.descripcion}</p>

          <p className="detalle-precio">
            ${Number(product.precio).toLocaleString('es-AR')}
          </p>

          {/* Renderizado condicional: stock */}
          <div className="detalle-stock">
            {product.stock > 0 ? (
              <span className="en-stock">✔ {product.stock} unidades disponibles</span>
            ) : (
              <span className="sin-stock">✘ Sin stock</span>
            )}
          </div>

          {/* Mensaje de éxito al agregar al carrito */}
          {agregado && (
            <div className="alerta-agregado">✔ Producto agregado al carrito</div>
          )}

          <button
            className="btn-agregar-detalle"
            disabled={product.stock === 0}
            onClick={handleAgregarAlCarrito}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
