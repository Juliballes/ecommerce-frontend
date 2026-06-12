import React, { useEffect, useState } from 'react';
import { API_URL } from '../services/api';
import './ProductListCategoria.css';

const normalizarCategoria = (nombre) => {
  const normalizada = nombre
    .replace('Perif??ricos', 'Perifericos')
    .replace('PerifÃ©ricos', 'Perifericos')
    .replace('Periféricos', 'Perifericos')
    .replace('Audio y v??deo', 'Audio y video')
    .replace('Audio y vÃ­deo', 'Audio y video')
    .replace('Audio y vídeo', 'Audio y video');

  return normalizada;
};

const quitarCategoriasDuplicadas = (categorias) => {
  const porNombre = new Map();

  categorias.forEach((cat) => {
    const nombre = normalizarCategoria(cat.nombre);
    const key = nombre.toLowerCase();

    if (!porNombre.has(key)) {
      porNombre.set(key, { ...cat, nombre });
    }
  });

  return Array.from(porNombre.values());
};

const ProductListCategoria = ({
  variant = 'default',
  categoriaSeleccionada = null,
  onCategoriaChange,
}) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true);

  const categoriaActiva = categoriaSeleccionada ?? null;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorias');
        const data = await response.json();
        setCategorias(quitarCategoriasDuplicadas(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const seleccionar = (id) => {
    if (onCategoriaChange) {
      onCategoriaChange(id === categoriaActiva ? null : id);
    }
  };

  const limpiar = () => {
    if (onCategoriaChange) onCategoriaChange(null);
  };

  if (loading) return <div className="filtros-estado">Cargando filtros...</div>;
  if (error) return <div className="filtros-error">{error}</div>;

  if (variant === 'sidebar') {
    return (
      <aside className="filtros-sidebar">
        <div className="filtros-header">
          <h2>Filtros</h2>
          {categoriaActiva && (
            <button type="button" className="filtros-limpiar" onClick={limpiar}>
              Limpiar
            </button>
          )}
        </div>

        <div className="filtro-grupo">
          <button
            type="button"
            className="filtro-grupo-titulo"
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
          >
            Categoria
            <span className={`filtro-flecha ${filtrosAbiertos ? 'abierto' : ''}`}>›</span>
          </button>

          {filtrosAbiertos && (
            <ul className="filtro-lista">
              <li>
                <button
                  type="button"
                  className={`filtro-item ${!categoriaActiva ? 'activo' : ''}`}
                  onClick={limpiar}
                >
                  Todos
                </button>
              </li>
              {categorias.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    className={`filtro-item ${categoriaActiva === cat.id ? 'activo' : ''}`}
                    onClick={() => seleccionar(cat.id)}
                  >
                    {cat.nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    );
  }

  return null;
};

export default ProductListCategoria;
