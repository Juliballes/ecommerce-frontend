import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

const mapPerfilToUsuario = (perfil) => ({
  id: perfil.id,
  email: perfil.email,
  nombre: perfil.nombre,
  username: perfil.nombreUsuario,
  role: perfil.role,
  activo: perfil.activo,
});

const cargarUsuarioGuardado = () => {
  try {
    const raw = localStorage.getItem('usuario');
    if (!raw || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('usuario');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(cargarUsuarioGuardado);
  const [authReady, setAuthReady] = useState(false);

  const guardarUsuario = (usuarioRecibido) => {
    setUsuario(usuarioRecibido);
    localStorage.setItem('usuario', JSON.stringify(usuarioRecibido));
    localStorage.removeItem('token');
  };

  const limpiarSesionLocal = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    let activo = true;

    const validarSesion = async () => {
      try {
        const perfil = await apiFetch('/usuarios/me');
        if (activo) guardarUsuario(mapPerfilToUsuario(perfil));
      } catch {
        if (activo) limpiarSesionLocal();
      } finally {
        if (activo) setAuthReady(true);
      }
    };

    validarSesion();

    return () => {
      activo = false;
    };
  }, []);

  const login = (usuarioRecibido) => {
    guardarUsuario(usuarioRecibido);
  };

  const updateUsuario = (usuarioActualizado) => {
    guardarUsuario({
      ...usuario,
      id: usuarioActualizado.id,
      email: usuarioActualizado.email,
      nombre: usuarioActualizado.nombre,
      username: usuarioActualizado.nombreUsuario ?? usuarioActualizado.username,
      role: usuarioActualizado.role,
      activo: usuarioActualizado.activo,
    });
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      limpiarSesionLocal();
    }
  };

  const token = usuario ? 'cookie-session' : null;
  const isAdmin = usuario?.role === 'ADMIN' || usuario?.roles?.includes('ADMIN');

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        authReady,
        login,
        logout,
        updateUsuario,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
