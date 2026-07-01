import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  deleteAdminUser,
  fetchAdminUsers,
  getAdminRequestMessage,
  getAdminUserStatus,
  normalizeUsersList,
} from '../services/adminUsers';
import './Admin.css';

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const normalizarRol = (role) => String(role || '-').toUpperCase();

const AdminUsuarios = () => {
  const { token, usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operandoId, setOperandoId] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarUsuarios = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAdminUsers();
        if (!activo) return;
        setUsuarios(normalizeUsersList(data));
      } catch (err) {
        console.error('Error real al obtener usuarios admin:', err);
        if (!activo) return;
        setUsuarios([]);
        setError(
          getAdminRequestMessage(err, {
            defaultMessage: 'No se pudieron obtener usuarios del backend.',
          })
        );
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, [token]);

  const handleEliminarUsuario = async (usuario) => {
    if (usuarioActual?.id === usuario.id) {
      setError('No podes eliminar tu propio usuario administrador.');
      return;
    }

    const confirmado = window.confirm(`Eliminar el usuario ${usuario.email}?`);
    if (!confirmado) return;

    setOperandoId(usuario.id);
    setError(null);

    try {
      await deleteAdminUser(usuario.id);
      setUsuarios((actuales) =>
        actuales.map((item) =>
          item.id === usuario.id ? { ...item, activo: false } : item
        )
      );
    } catch (err) {
      setError(
        getAdminRequestMessage(err, {
          defaultMessage: 'No se pudo eliminar el usuario.',
        })
      );
    } finally {
      setOperandoId(null);
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return usuarios;

    return usuarios.filter((usuario) => {
      const estado = getAdminUserStatus(usuario).toLowerCase();
      return [
        usuario.id,
        usuario.nombre,
        usuario.apellido,
        usuario.email,
        usuario.role,
        estado,
      ]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(term));
    });
  }, [query, usuarios]);

  return (
    <div className="admin-page">
      <header className="admin-hero">
        <span className="admin-eyebrow">Administracion</span>
        <h1 className="admin-title">Gestion de Usuarios</h1>
        <p className="admin-description">
          Supervisa cuentas registradas, roles asignados y estado general de acceso.
        </p>
      </header>

      <div className="admin-toolbar">
        <Link to="/admin" className="admin-back-link">
          Volver al panel
        </Link>

        <label className="admin-search" aria-label="Buscar usuarios">
          <IconSearch />
          <input
            type="search"
            placeholder="Buscar por nombre, email, rol o estado"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {loading && (
        <div className="admin-status-panel">
          <p>Cargando usuarios...</p>
        </div>
      )}

      {!loading && error && (
        <div className="admin-status-panel error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && usuarios.length === 0 && (
        <div className="admin-status-panel">
          <p>No hay usuarios registrados</p>
        </div>
      )}

      {!loading && !error && usuarios.length > 0 && (
        <section className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => {
                  const estado = getAdminUserStatus(usuario);
                  const statusClass =
                    estado.toLowerCase() === 'inactivo' ? 'inactivo' : 'activo';

                  return (
                    <tr key={usuario.id}>
                      <td data-label="ID">
                        <Link
                          to={`/admin/usuarios/${usuario.id}`}
                          className="admin-link-inline"
                        >
                          #{usuario.id}
                        </Link>
                      </td>
                      <td data-label="Nombre">{usuario.nombre || '-'}</td>
                      <td data-label="Apellido">{usuario.apellido || '-'}</td>
                      <td data-label="Email">{usuario.email || '-'}</td>
                      <td data-label="Rol">
                        <span className="admin-role-pill">
                          {normalizarRol(usuario.role)}
                        </span>
                      </td>
                      <td data-label="Estado">
                        <span className={`admin-state-pill ${statusClass}`}>
                          {estado}
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <div className="admin-row-actions">
                          <Link
                            to={`/admin/usuarios/${usuario.id}`}
                            className="admin-link-inline"
                          >
                            Ver
                          </Link>
                          <button
                            type="button"
                            className="admin-danger-button"
                            disabled={
                              operandoId === usuario.id ||
                              usuarioActual?.id === usuario.id ||
                              estado.toLowerCase() === 'inactivo'
                            }
                            onClick={() => handleEliminarUsuario(usuario)}
                          >
                            {operandoId === usuario.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && !error && usuarios.length > 0 && usuariosFiltrados.length === 0 && (
        <div className="admin-status-panel">
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
