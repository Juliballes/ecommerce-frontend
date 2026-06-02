import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AgregarProducto.css';

// Formulario admin para publicar productos (POST /api/productos)
const AgregarProducto = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
    imagen: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categorias');
        if (!response.ok) throw new Error('Error al cargar categorías');
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert('No tenés permisos para realizar esta acción.');
      navigate('/');
      return;
    }

    setLoading(true);
    setError(null);

    const nuevoProducto = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categorias: [{ id: parseInt(form.categoriaId) }],
      imagenes: form.imagen ? [form.imagen] : [],
    };

    try {
      const response = await fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!response.ok) throw new Error('Error al crear el producto');

      alert('Producto creado exitosamente.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="ap-denegado">
        <h2>Acceso denegado</h2>
        <p>Debés iniciar sesión para acceder a esta sección.</p>
        <button onClick={() => navigate('/login')}>Ir al login</button>
      </div>
    );
  }

  return (
    <div className="ap-container">
      <h1 className="ap-titulo">Agregar Producto</h1>

      {error && <div className="ap-error">{error}</div>}

      <div className="ap-form">
        <div className="form-grupo">
          <label>Nombre del producto</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Laptop Pro 15"
          />
        </div>

        <div className="form-grupo">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describí el producto..."
            rows={3}
          />
        </div>

        <div className="ap-fila">
          <div className="form-grupo">
            <label>Precio ($)</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
            />
          </div>

          <div className="form-grupo">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="form-grupo">
          <label>Categoría</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
            <option value="">Seleccioná una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grupo">
          <label>URL de imagen</label>
          <input
            type="text"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {/* Preview de imagen si hay URL */}
        {form.imagen && (
          <div className="ap-preview">
            <img src={form.imagen} alt="preview" />
          </div>
        )}

        <button className="btn-ap" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Publicar producto'}
        </button>
      </div>
    </div>
  );
};

export default AgregarProducto;
