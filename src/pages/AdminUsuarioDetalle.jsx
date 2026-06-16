import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminUserById,
  getAdminRequestMessage,
  getAdminUserStatus,
} from '../services/adminUsers';
import './Admin.css';

const AdminUsuarioDetalle = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarUsuario = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAdminUserById(id, token);
        if (!activo) return;
        setUsuario(data);
      } catch (err) {
        console.error('Error real al obtener detalle de usuario admin:', err);
        if (!activo) return;
        setUsuario(null);
        setError(
          getAdminRequestMessage(err, {
            defaultMessage: 'No se pudo cargar el usuario seleccionado.',
          })
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarUsuario();

    return () => {
      activo = false;
    };
  }, [id, token]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-status-panel">
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-status-panel error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="admin-page">
        <div className="admin-status-panel">
          <p>No hay usuarios registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-hero">
        <span className="admin-eyebrow">Administracion</span>
        <h1 className="admin-title">Usuario #{usuario.id}</h1>
        <p className="admin-description">
          Resumen del perfil seleccionado dentro del modulo de gestion de usuarios.
        </p>
      </header>

      <div className="admin-actions">
        <button
          type="button"
          className="admin-back-link"
          onClick={() => navigate('/admin/usuarios')}
        >
          Volver al listado
        </button>
        <Link to="/admin" className="admin-button-secondary">
          Ir al panel
        </Link>
      </div>

      <section className="admin-detail-grid admin-detail-section">
        <article className="admin-detail-card">
          <p className="admin-detail-label">Nombre</p>
          <p className="admin-detail-value">{usuario.nombre || '-'}</p>
        </article>
        <article className="admin-detail-card">
          <p className="admin-detail-label">Apellido</p>
          <p className="admin-detail-value">{usuario.apellido || '-'}</p>
        </article>
        <article className="admin-detail-card">
          <p className="admin-detail-label">Email</p>
          <p className="admin-detail-value">{usuario.email || '-'}</p>
        </article>
        <article className="admin-detail-card">
          <p className="admin-detail-label">Rol</p>
          <p className="admin-detail-value">{String(usuario.role || '-').toUpperCase()}</p>
        </article>
        <article className="admin-detail-card">
          <p className="admin-detail-label">Estado</p>
          <p className="admin-detail-value">{getAdminUserStatus(usuario)}</p>
        </article>
        <article className="admin-detail-card">
          <p className="admin-detail-label">Nombre de usuario</p>
          <p className="admin-detail-value subtle">{usuario.nombreUsuario || '-'}</p>
        </article>
      </section>
    </div>
  );
};

export default AdminUsuarioDetalle;
