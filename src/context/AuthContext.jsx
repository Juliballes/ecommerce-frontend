import React, { createContext, useContext, useState } from 'react';

// Contexto de autenticación: guarda el token JWT y los datos del usuario logueado, persiste la sesión
const AuthContext = createContext();

const cargarUsuarioGuardado = () => {
  try {
    const raw = localStorage.getItem('usuario');
    if (!raw || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    // Si quedó guardado un JWT u otro texto inválido, limpiamos y arrancamos sin usuario
    localStorage.removeItem('usuario');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Iniciamos leyendo el token del localStorage por si el usuario ya estaba logueado
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(cargarUsuarioGuardado);

  // login: guarda el token y los datos del usuario en el estado y en localStorage
  const login = (tokenRecibido, usuarioRecibido) => {
    setToken(tokenRecibido);
    setUsuario(usuarioRecibido);
    localStorage.setItem('token', tokenRecibido);
    localStorage.setItem('usuario', JSON.stringify(usuarioRecibido));
  };

  // logout: limpia todo
  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // isAdmin: verifica si el usuario tiene rol ADMIN
  const isAdmin = usuario?.role === 'ADMIN' || usuario?.roles?.includes('ADMIN');

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => useContext(AuthContext);
