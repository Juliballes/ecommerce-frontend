import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import './FormAuth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/auth/login', {
        method: 'POST',
        body: form,
      });

      const perfil = await apiFetch('/usuarios/me');
      login({
        id: perfil.id,
        email: perfil.email,
        nombre: perfil.nombre,
        username: perfil.nombreUsuario,
        role: perfil.role,
        activo: perfil.activo,
      });
      navigate('/');
    } catch (err) {
      setError(err.status === 401 ? 'Email o contrasena incorrectos' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-titulo">Iniciar sesion</h2>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-grupo">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-grupo">
            <label>Contrasena</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contrasena"
            />
          </div>

          <button
            className="btn-auth"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>

        <p className="auth-link">
          No tenes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
