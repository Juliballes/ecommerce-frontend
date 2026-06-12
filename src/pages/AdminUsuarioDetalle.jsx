import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

const AdminUsuarioDetalle = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/usuarios/${id}`, { token });
        setUsuario(res);
      } catch (e) {
        setError('No se pudo cargar el usuario.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const handleBaja = async () => {
    if (!window.confirm('Confirmar baja del usuario (acción irreversible si el backend lo permite).')) return;
    setBusy(true);
    setError(null);
    try {
      // Intentamos DELETE por convención REST; si el backend no lo implementa devolverá 4xx/5xx
      await apiFetch(`/usuarios/${id}`, { token, method: 'DELETE' });
      // Si responde OK/204, volvemos al listado
      navigate('/admin/usuarios');
    } catch (e) {
      // Si falla, informamos y no rompemos la UI
      setError('La operación de baja falló: ' + (e.message || e.status || 'error'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Cargando usuario...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  if (!usuario) return <div style={{ padding: 24 }}>Usuario no encontrado.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Usuario #{usuario.id} — {usuario.nombre} {usuario.apellido}</h1>

      <div style={{ marginTop: 12 }}>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Nombre de usuario:</strong> {usuario.nombreUsuario || '-'}</p>
        <p><strong>Rol:</strong> {String(usuario.role)}</p>
        <p><strong>Sexo:</strong> {String(usuario.sexo || '')}</p>
        <p><strong>Fecha nacimiento:</strong> {usuario.fechaNacimiento || '-'}</p>
      </div>

      <div style={{ marginTop: 18 }}>
        <button onClick={() => navigate('/admin/usuarios')} style={{ marginRight: 8 }}>Volver</button>
        <button onClick={handleBaja} disabled={busy} style={{ background: 'crimson', color: 'white' }}>
          {busy ? 'Procesando...' : 'Dar de baja'}
        </button>
      </div>

      {usuario.publicaciones && usuario.publicaciones.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Publicaciones</h3>
          <ul>
            {usuario.publicaciones.map(p => (
              <li key={p.id}>{p.nombre} — ${p.precio}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarioDetalle;
