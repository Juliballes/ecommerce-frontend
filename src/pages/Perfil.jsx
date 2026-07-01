import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import './Perfil.css';

const OPCIONES_SEXO = [
  { value: '', label: 'Sin especificar' },
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'NO_INDICA', label: 'Prefiero no indicar' },
];

const etiquetaEstado = (estado) => {
  const mapa = {
    PENDIENTE_PAGO: 'Pendiente de pago',
    PAGADO: 'Pagado',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
  };
  return mapa[estado] || estado;
};

const formatearFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleString('es-AR') : '-';

const formatearPrecio = (monto) =>
  `$${Number(monto).toLocaleString('es-AR')}`;

// Perfil del usuario logueado — GET/PATCH /api/usuarios/me
const Perfil = () => {
  const { token, updateUsuario, isAdmin } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
  });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch('/usuarios/me', { token });
        setPerfil(data);
        setForm({
          nombre: data.nombre ?? '',
          apellido: data.apellido ?? '',
          email: data.email ?? '',
          fechaNacimiento: data.fechaNacimiento ?? '',
          sexo: data.sexo ?? '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setMensaje(null);

    try {
      const body = {
        nombre: form.nombre.trim() || null,
        apellido: form.apellido.trim() || null,
        email: form.email.trim() || null,
        fechaNacimiento: form.fechaNacimiento || null,
        sexo: form.sexo || null,
      };

      const actualizado = await apiFetch('/usuarios/me', {
        token,
        method: 'PATCH',
        body,
      });

      setPerfil(actualizado);
      updateUsuario({
        email: actualizado.email,
        nombre: actualizado.nombre,
        username: actualizado.nombreUsuario,
        role: actualizado.role,
      });
      setMensaje('Perfil actualizado correctamente.');
    } catch (err) {
      setError('No se pudo guardar el perfil. Revisa los datos.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="perfil-estado">Cargando perfil...</div>;
  if (error && !perfil) return <div className="perfil-error">Error: {error}</div>;
  if (!perfil) return null;

  return (
    <div className="perfil-container">
      <h1 className="perfil-titulo">Mi Perfil</h1>
      <p className="perfil-subtitulo">
        @{perfil.nombreUsuario} · {perfil.role}
      </p>

      <section className="perfil-seccion">
        <h2>Datos personales</h2>

        {mensaje && <div className="perfil-exito">{mensaje}</div>}
        {error && <div className="perfil-error-inline">{error}</div>}

        <form className="perfil-form" onSubmit={handleSubmit}>
          <div className="form-fila">
            <div className="form-grupo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="form-grupo">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grupo">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-fila">
            <div className="form-grupo">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>
            <div className="form-grupo">
              <label htmlFor="sexo">Sexo</label>
              <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange}>
                {OPCIONES_SEXO.map((op) => (
                  <option key={op.value || 'vacio'} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-perfil-guardar" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      {isAdmin ? (
        <section className="perfil-seccion">
          <div className="perfil-seccion-header">
            <h2>Administracion</h2>
            <Link to="/admin" className="perfil-link">
              Ir al panel →
            </Link>
          </div>
          <p className="perfil-vacio">
            Esta cuenta tiene acceso administrativo y mantiene oculto el flujo
            comercial del ecommerce.
          </p>
        </section>
      ) : (
        <>
          <section className="perfil-seccion">
            <div className="perfil-seccion-header">
              <h2>Mis publicaciones</h2>
              <Link to="/vender" className="perfil-link">
                + Agregar producto
              </Link>
            </div>

            {!perfil.publicaciones?.length ? (
              <p className="perfil-vacio">Todavía no publicaste productos.</p>
            ) : (
              <ul className="perfil-lista">
                {perfil.publicaciones.map((pub) => (
                  <li key={pub.id} className="perfil-lista-item">
                    <Link to={`/products/${pub.id}`} className="perfil-link">
                      {pub.nombre}
                    </Link>
                    <span>
                      {formatearPrecio(pub.precio)} · Stock: {pub.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="perfil-seccion">
            <div className="perfil-seccion-header">
              <h2>Últimas compras</h2>
              <Link to="/mis-compras" className="perfil-link">
                Ver todas →
              </Link>
            </div>

            {!perfil.compras?.length ? (
              <p className="perfil-vacio">No tenés compras registradas.</p>
            ) : (
              <ul className="perfil-lista">
                {perfil.compras.map((compra) => (
                  <li key={compra.id} className="perfil-lista-item">
                    <span>Pedido #{compra.id}</span>
                    <span>
                      {etiquetaEstado(compra.estado)} · {formatearPrecio(compra.total)}
                    </span>
                    <span className="perfil-fecha">{formatearFecha(compra.fecha)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="perfil-seccion">
            <div className="perfil-seccion-header">
              <h2>Últimas ventas</h2>
              <Link to="/mis-ventas" className="perfil-link">
                Ver todas →
              </Link>
            </div>

            {!perfil.ventas?.length ? (
              <p className="perfil-vacio">Todavía no vendiste productos.</p>
            ) : (
              <ul className="perfil-lista">
                {perfil.ventas.map((venta) => (
                  <li key={venta.id} className="perfil-lista-item">
                    <span>Pedido #{venta.id}</span>
                    <span>
                      {etiquetaEstado(venta.estado)} · {formatearPrecio(venta.total)}
                    </span>
                    <span className="perfil-fecha">{formatearFecha(venta.fecha)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Perfil;
