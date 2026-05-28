import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FormAuth.css';

// Login: formulario para autenticarse con email y contraseña
// Llama a POST /api/auth/login y guarda el token en el contexto
const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Manejamos el cambio de inputs con un solo handler genérico
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {//El login hace un POST a /api/auth/login con email y contraseña. El backend responde con un token JWT. Llamamos a login(data.token, data.usuario) del AuthContext, que guarda el token en el estado de React y en localStorage. Guardarlo en localStorage hace que si el usuario recarga la página, siga logueado porque el token se lee al inicializar el contexto.
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Email o contraseña incorrectos');

      const data = await response.json();
      // Guardamos el token y el usuario en el contexto (y localStorage)
      login(data.token, data.usuario || { email: form.email });
      // useNavigate: redirigimos al home después del login
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

        {/* Renderizado condicional: error */}
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
          ¿No tenés cuenta?{' '}
          {/* Link de React Router para no recargar la página */}
          <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
