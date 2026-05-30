import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; //useNavigate — hook para redirigir por código, no por click del usuario
import { useCarrito } from '../context/CarritoContext'; //Importa el hook personalizado del carrito. Le da acceso al estado global del carrito (cuántos items hay).
import { useFavorite } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext'; // Importa el hook de autenticación. Le da acceso al usuario logueado, la función logout, y si es admin.
import './Navbar.css';

// Navbar: barra de navegación principal
// Usa Link de react-router-dom (no <a>) para navegar sin recargar la página (SPA)
const Navbar = () => {
  const { cantidadTotal } = useCarrito(); //Lee del CarritoContext cuántos items hay en el carrito en total. Este número se usa para el badge rojo del ícono.
  const { favoriteItems } = useFavorite();
  const { usuario, logout, isAdmin } = useAuth(); //Lee tres cosas del AuthContext:
                                                  //usuario — objeto con los datos del usuario logueado (o null si no hay nadie)
                                                  //logout — función que limpia el token y el usuario del estado y del localStorage
                                                  //isAdmin — booleano: true si el usuario tiene rol ADMIN

  const navigate = useNavigate(); //Guarda el hook de navegación en una variable para poder usarlo dentro de funciones.

  const handleLogout = () => { //Función que se ejecuta cuando el usuario clickea "Salir".
                              //logout(); Llama a la función del contexto que limpia el token del localStorage y pone usuario en null.
    logout();
    navigate('/login'); //Después de limpiar la sesión, redirige al usuario a la página de login. Esto es navegación programática: no es un <Link>, sino código que decide a dónde ir.
  };

  return (//El logo que lleva al home. Usa Link y no <a href="/"> porque con <a> el navegador recargaría toda la app (perdería el carrito, el estado, todo).
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Link evita la recarga completa de página, a diferencia de <a href> */}
        <Link to="/" className="navbar-logo">🛒 E-Commerce</Link>
      </div>

      <div className="navbar-links"> 
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/buscar" className="nav-link">Buscar</Link>
        
        {/* Solo mostramos "Agregar Producto" si el usuario es ADMIN */}
        {isAdmin && ( //Renderizado condicional con &&. Si isAdmin es false, el link de "+ Producto" directamente no existe en el DOM. Solo los admins lo ven.
          <Link to="/admin/agregar-producto" className="nav-link nav-link-admin"> 
            + Producto
          </Link> //Ruta protegida de admin. Solo se renderiza si pasó el && de arriba.
        )}

        {/* Favoritos con badge de cantidad */}
        <Link to="/favoritos" className="nav-link nav-favoritos">
          ❤️ Favoritos
          {favoriteItems.length > 0 && (
            <span className="carrito-badge">{favoriteItems.length}</span>
          )}
        </Link>

        {/* Mostramos carrito con badge de cantidad */}
        <Link to="/carrito" className="nav-link nav-carrito"> {/* Link al carrito. */}
          🛒 Carrito
          {cantidadTotal > 0 && ( //Otro &&. El badge con el número solo aparece si hay al menos un item en el carrito. Si está vacío, no se renderiza nada.
            <span className="carrito-badge">{cantidadTotal}</span> //El numerito rojo que muestra cuántos productos hay. Viene directamente del CarritoContext, se actualiza solo cada vez que alguien agrega o elimina algo.
          )}
        </Link>

        {/* Si el usuario está logueado mostramos su nombre y botón de logout */}
        {usuario ? ( //{usuario ? (Ternario. Pregunta: ¿hay un usuario logueado? Si usuario no es null, muestra el saludo y el botón salir. Si es null, muestra los links de login y registro.
          <div className="nav-usuario">
            <span className="nav-nombre">Hola, {usuario.nombre || usuario.username}</span>
            <button onClick={handleLogout} className="btn-logout">Salir</button>
          </div>
        ) : (
          //Los dos links que ve alguien que no está logueado.
          <> 
            <Link to="/login" className="nav-link">Iniciar sesión</Link>
            <Link to="/register" className="nav-link nav-link-register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; //Exporta el componente para que App.jsx pueda importarlo y usarlo fuera de las <Routes> (la Navbar aparece en todas las páginas).
