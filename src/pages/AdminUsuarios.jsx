import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminUsuarios = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError(null);

      // Primero intento endpoint administrativo, si falla uso el genérico
      const endpoints = ['/api/admin/usuarios', '/api/usuarios'];

      let data = null;

      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          data = await res.json();
          break;
        } catch (err) {
          // intento siguiente endpoint
        }
      }

      if (!data) {
        setError('No se pudieron obtener usuarios del backend.');
        setUsuarios([]);
        setLoading(false);
        return;
      }

      // Si el backend devuelve un objeto con lista bajo `usuarios`, normalizo
      const list = Array.isArray(data) ? data : data.usuarios || data.data || [];
      setUsuarios(list);
      setLoading(false);
    };

    fetchUsuarios();
  }, [token]);

  const filtered = usuarios.filter((u) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      String(u.id || u._id || u.uuid || '').toLowerCase().includes(term) ||
      String(u.nombre || u.firstName || u.name || '').toLowerCase().includes(term) ||
      String(u.apellido || u.lastName || '').toLowerCase().includes(term) ||
      String(u.email || u.username || '').toLowerCase().includes(term) ||
      String(u.role || u.roles || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Gestión de Usuarios</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Buscar usuarios por nombre, email o id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, width: '100%', maxWidth: 480 }}
        />
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>ID</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Apellido</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Rol</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id || u._id || u.email}>
                  <td style={{ padding: 8 }}>{u.id || u._id || ''}</td>
                  <td style={{ padding: 8 }}>{u.nombre || u.firstName || ''}</td>
                  <td style={{ padding: 8 }}>{u.apellido || u.lastName || ''}</td>
                  <td style={{ padding: 8 }}>{u.email || u.username || ''}</td>
                  <td style={{ padding: 8 }}>{u.role || (u.roles && u.roles.join(', ')) || ''}</td>
                  <td style={{ padding: 8 }}>
                    <Link to={`/admin/usuarios/${u.id || u._id}`} style={{ marginRight: 8 }}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
