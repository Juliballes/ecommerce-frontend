import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FormAuth.css';

// Register: formulario de registro de nuevo usuario
// Llama a POST /api/auth/register con los datos del formulario
const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {//Cuando el usuario hace click en "Crear cuenta", se ejecuta handleSubmit, que hace un POST a /api/auth/register con esos datos en el body como JSON. Si el backend responde OK, redirigimos al login con useNavigate.
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Error al registrarse. Revisá los datos.');

      alert('¡Registro exitoso! Ya podés iniciar sesión.');
      // useNavigate: redirigimos al login después del registro
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-titulo">Crear cuenta</h2>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-form">
          <div className="form-fila">
            <div className="form-grupo">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>
            <div className="form-grupo">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="form-grupo">
            <label>Nombre de usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="usuario123"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            className="btn-auth"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>

        <p className="auth-link">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
