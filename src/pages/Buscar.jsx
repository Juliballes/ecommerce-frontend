import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_URL } from '../services/api';
import CardProductos from '../components/CardProductos';
import './Buscar.css';

// Búsqueda con query string ?q= — useSearchParams lee y escribe la URL
const Buscar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cada vez que cambia q en la URL, disparo el GET al backend
  useEffect(() => {
    setQuery(q);

    if (!q.trim()) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_URL}/productos/search?q=${encodeURIComponent(q)}&page=0&size=20`
        );
        if (!response.ok) throw new Error('Error al buscar productos');
        const data = await response.json();
        // Spring devuelve Page: content[]; por las dudas acepto también un array plano
        setProducts(data.content ?? data);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const termino = query.trim();
    setSearchParams(termino ? { q: termino } : {});
  };

  return (
    <div className="buscar-container">
      <h1 className="buscar-titulo">Buscar productos</h1>

      <form className="buscar-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: mouse, laptop, auricular..."
          className="buscar-input"
        />
        <button type="submit" className="btn-buscar">
          Buscar
        </button>
      </form>

      {!q.trim() && (
        <p className="buscar-ayuda">Escribí un término y presioná Buscar.</p>
      )}

      {loading && <div className="buscar-estado">Buscando...</div>}
      {error && <div className="buscar-error">Error: {error}</div>}

      {!loading && !error && q.trim() && products.length === 0 && (
        <div className="buscar-estado">No se encontraron productos para "{q}".</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="buscar-grid">
          {products.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <CardProductos product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Buscar;
