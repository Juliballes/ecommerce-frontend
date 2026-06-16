import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20.5l-1-.9C5.5 14.8 2 11.6 2 7.8 2 5 4.2 3 6.8 3c1.6 0 3.1.8 4 2.1C11.7 3.8 13.2 3 14.8 3 17.4 3 19.6 5 19.6 7.8c0 3.8-3.5 7-9 11.8l-1 .9z" />
  </svg>
);

const IconBag = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 7h12l-1.2 13H7.2L6 7z" />
    <path d="M9 7V5a3 3 0 016 0v2" />
  </svg>
);

const Navbar = () => {
  const cantidadTotal = useSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + item.cantidad, 0)
  );
  const favoriteItems = useSelector((state) => state.favorites.items);
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();
    const q = busqueda.trim();
    navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : '/buscar');
  };

  const handleLogout = () => {
    logout();
    setMenuUsuario(false);
    navigate('/login');
  };

  const irAProductos = () => {
    setMenuAbierto(false);
    if (location.pathname !== '/') {
      navigate('/#productos');
    } else {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="topbar">
        <p>Envío gratis en compras seleccionadas · Hasta 6 cuotas sin interés</p>
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            STORE
          </Link>

          <div className={`navbar-center ${menuAbierto ? 'abierto' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMenuAbierto(false)}>
              Inicio
            </Link>
            <button type="button" className="nav-link nav-link-btn" onClick={irAProductos}>
              Productos
            </button>
            {usuario && (
              <Link to="/vender" className="nav-link" onClick={() => setMenuAbierto(false)}>
                Vender
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="nav-link" onClick={() => setMenuAbierto(false)}>
                Administración
              </Link>
            )}
          </div>

          <form className="navbar-search" onSubmit={handleBuscar}>
            <IconSearch />
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </form>

          <div className="navbar-actions">
            <div className="nav-action-wrap">
              <button
                type="button"
                className="nav-icon-btn"
                aria-label="Mi cuenta"
                onClick={() => {
                  if (!usuario) navigate('/login');
                  else setMenuUsuario(!menuUsuario);
                }}
              >
                <IconUser />
              </button>
              {menuUsuario && usuario && (
                <div className="nav-dropdown">
                  <p className="nav-dropdown-nombre">
                    Hola, {usuario.nombre || usuario.username || usuario.email}
                  </p>
                  <Link to="/perfil" onClick={() => setMenuUsuario(false)}>Mi perfil</Link>
                  <Link to="/vender" onClick={() => setMenuUsuario(false)}>Publicar producto</Link>
                  <Link to="/mis-compras" onClick={() => setMenuUsuario(false)}>Mis compras</Link>
                  <Link to="/mis-ventas" onClick={() => setMenuUsuario(false)}>Mis ventas</Link>
                  <button type="button" onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </div>

            <Link to="/favoritos" className="nav-icon-btn" aria-label="Favoritos">
              <IconHeart />
              {favoriteItems.length > 0 && (
                <span className="nav-badge">{favoriteItems.length}</span>
              )}
            </Link>

            <Link to="/carrito" className="nav-icon-btn" aria-label="Carrito">
              <IconBag />
              {cantidadTotal > 0 && (
                <span className="nav-badge">{cantidadTotal}</span>
              )}
            </Link>

            {!usuario && (
              <Link to="/login" className="nav-login-btn">Ingresar</Link>
            )}
          </div>

          <button
            type="button"
            className="navbar-hamburger"
            aria-label="Menú"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {!usuario && (
        <div className="navbar-promo">
          <Link to="/register">
            Registrate o iniciá sesión para desbloquear tu experiencia personalizada →
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
