import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL, apiFetch } from '../services/api';
import './AgregarProducto.css';

// Formulario para publicar productos (POST /api/productos).
const AgregarProducto = () => {
  const { token } = useAuth();
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
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar categorias');
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

    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    const nuevoProducto = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
      categoriaIds: [parseInt(form.categoriaId, 10)],
      imagenes: [form.imagen.trim()],
    };

    try {
      await apiFetch('/productos', {
        method: 'POST',
        body: nuevoProducto,
      });

      alert('Producto publicado exitosamente.');
      navigate('/perfil');
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
        <p>Debes iniciar sesion para acceder a esta seccion.</p>
        <button onClick={() => navigate('/login')}>Ir al login</button>
      </div>
    );
  }

  return (
    <div className="ap-container">
      <h1 className="ap-titulo">Publicar producto</h1>

      {error && <div className="ap-error">{error}</div>}

      <form className="ap-form" onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label>Nombre del producto</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Laptop Pro 15"
            required
          />
        </div>

        <div className="form-grupo">
          <label>Descripcion</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describi el producto..."
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
              min="0.01"
              step="0.01"
              required
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
              step="1"
              required
            />
          </div>
        </div>

        <div className="form-grupo">
          <label>Categoria</label>
          <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
            <option value="">Selecciona una categoria</option>
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
            type="url"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </div>

        {form.imagen && (
          <div className="ap-preview">
            <img src={form.imagen} alt="preview" />
          </div>
        )}

        <button type="submit" className="btn-ap" disabled={loading}>
          {loading ? 'Guardando...' : 'Publicar producto'}
        </button>
      </form>
    </div>
  );
};

export default AgregarProducto;
