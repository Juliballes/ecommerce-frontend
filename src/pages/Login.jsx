import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch, API_URL } from '../services/api';
import './FormAuth.css';

// Login: POST /api/auth/login — soporta JWT en JSON o en texto plano
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Actualizo el form con spread: copio el estado anterior y cambio solo el campo editado
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Email o contraseña incorrectos');

      const contentType = response.headers.get('content-type') ?? '';
      const rawBody = await response.text();
      let tokenJwt = rawBody.trim();

      if (contentType.includes('application/json')) {
        const payload = JSON.parse(rawBody);
        tokenJwt = payload?.token?.trim?.() ?? '';
      }

      if (!tokenJwt) throw new Error('La respuesta de login no incluyó un token válido');

      const perfil = await apiFetch('/usuarios/me', { token: tokenJwt });
      login(tokenJwt, {
        email: perfil.email,
        nombre: perfil.nombre,
        username: perfil.nombreUsuario,
        role: perfil.role,
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-titulo">Iniciar sesión</h2>

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
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
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
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
