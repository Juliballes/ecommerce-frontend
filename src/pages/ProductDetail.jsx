import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import './ProductDetail.css';

// Detalle de producto — :id viene de la ruta /products/:id (useParams)
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [resumenVendedor, setResumenVendedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agregado, setAgregado] = useState(false);

  // Cargo producto + reseñas + reputación del vendedor cuando cambia el id
  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);

        const listaResenas = await apiFetch(`/resenas/productos/${id}`);
        setResenas(listaResenas);

        if (data.vendedorId) {
          try {
            const resumen = await apiFetch(`/resenas/vendedores/${data.vendedorId}`);
            setResumenVendedor(resumen);
          } catch {
            setResumenVendedor(null);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  const handleAgregarAlCarrito = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (product.stock > 0) {
      const ok = await agregarAlCarrito(product);
      if (ok) {
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2000);
      }
    }
  };

  if (loading) return <div className="detalle-estado">Cargando producto...</div>;
  if (error) return <div className="detalle-estado detalle-error">Error: {error}</div>;
  if (!product) return null;

  const isFavorite = favoriteItems.some((item) => item.id === product.id);

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
          {product.categorias?.[0]?.nombre && (
            <span className="detalle-categoria">{product.categorias[0].nombre}</span>
          )}

          <h1 className="detalle-nombre">{product.nombre}</h1>
          <p className="detalle-descripcion">{product.descripcion}</p>

          {product.vendedorNombre && (
            <p className="detalle-vendedor">Vendido por: {product.vendedorNombre}</p>
          )}

          {resumenVendedor && (
            <p className="detalle-reputacion">
              ⭐ {resumenVendedor.promedioPuntuacion?.toFixed(1)} —{' '}
              {resumenVendedor.cantidadResenas} reseñas
            </p>
          )}

          <p className="detalle-precio">
            ${Number(product.precio).toLocaleString('es-AR')}
          </p>

          <div className="detalle-stock">
            {product.stock > 0 ? (
              <span className="en-stock">✔ {product.stock} unidades disponibles</span>
            ) : (
              <span className="sin-stock">✘ Sin stock</span>
            )}
          </div>

          {agregado && (
            <div className="alerta-agregado">✔ Producto agregado al carrito</div>
          )}

          <button
            className="btn-agregar-detalle"
            disabled={product.stock === 0}
            onClick={handleAgregarAlCarrito}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
          </button>

          <button
            className="btn-favorito-detalle"
            onClick={async () => {
              if (!token) {
                navigate('/login');
                return;
              }
              if (isFavorite) await removeFromFavorite(product.id);
              else await addToFavorite(product);
            }}
          >
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
        </div>
      </div>

      <section className="resenas-seccion">
        <h2>Reseñas ({resenas.length})</h2>

        {resenas.length === 0 ? (
          <p className="resenas-vacio">Todavía no hay reseñas para este producto.</p>
        ) : (
          <div className="resenas-lista">
            {resenas.map((r) => (
              <div key={r.id} className="resena-card">
                <p className="resena-autor">{r.nombreComprador}</p>
                <p className="resena-estrellas">{'⭐'.repeat(r.puntuacion)}</p>
                {r.comentario && <p className="resena-comentario">{r.comentario}</p>}
                <p className="resena-fecha">
                  {r.fecha ? new Date(r.fecha).toLocaleDateString('es-AR') : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
