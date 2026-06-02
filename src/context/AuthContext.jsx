import React, { createContext, useContext, useState } from 'react';

// Contexto de auth: token JWT + datos del usuario, persistidos en localStorage
const AuthContext = createContext();

const cargarUsuarioGuardado = () => {
  try {
    const raw = localStorage.getItem('usuario');
    if (!raw || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    // Si quedó basura en localStorage (ej. un JWT), limpio y arranco de cero
    localStorage.removeItem('usuario');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Leo token y usuario del localStorage por si ya había sesión abierta
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(cargarUsuarioGuardado);

  const login = (tokenRecibido, usuarioRecibido) => {
    setToken(tokenRecibido);
    setUsuario(usuarioRecibido);
    localStorage.setItem('token', tokenRecibido);
    localStorage.setItem('usuario', JSON.stringify(usuarioRecibido));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAdmin = usuario?.role === 'ADMIN' || usuario?.roles?.includes('ADMIN');

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
