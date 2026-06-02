import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// Navbar fija en todas las páginas — en App.jsx está fuera de <Routes>
const Navbar = () => {
  const { cantidadTotal } = useCarrito(); // badge del carrito
  const { favoriteItems } = useFavorite(); // badge de favoritos
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // useNavigate: redirijo por código después del logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Link de React Router — no recarga la SPA como un <a href> */}
        <Link to="/" className="navbar-logo">🛒 E-Commerce</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/buscar" className="nav-link">Buscar</Link>

        {/* Renderizado condicional: link de admin solo si isAdmin es true */}
        {isAdmin && (
          <Link to="/admin/agregar-producto" className="nav-link nav-link-admin">
            + Producto
          </Link>
        )}

        {/* Links de pedidos — solo los muestro si hay sesión */}
        {usuario && (
          <>
            <Link to="/mis-compras" className="nav-link">Mis compras</Link>
            <Link to="/mis-ventas" className="nav-link">Mis ventas</Link>
          </>
        )}

        <Link to="/favoritos" className="nav-link nav-favoritos">
          ❤️ Favoritos
          {favoriteItems.length > 0 && (
            <span className="carrito-badge">{favoriteItems.length}</span>
          )}
        </Link>

        <Link to="/carrito" className="nav-link nav-carrito">
          🛒 Carrito
          {cantidadTotal > 0 && (
            <span className="carrito-badge">{cantidadTotal}</span>
          )}
        </Link>

        {/* Ternario: logueado → saludo + logout; si no → login y registro */}
        {usuario ? (
          <div className="nav-usuario">
            <span className="nav-nombre">Hola, {usuario.nombre || usuario.username}</span>
            <button onClick={handleLogout} className="btn-logout">Salir</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">Iniciar sesión</Link>
            <Link to="/register" className="nav-link nav-link-register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
