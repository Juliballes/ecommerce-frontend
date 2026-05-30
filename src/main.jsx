import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
// es donde React monta la app en el DOM.
// Envolvemos la app con:
// - BrowserRouter: habilita el sistema de rutas de React Router
// - AuthProvider: provee el contexto de autenticación (token, usuario)
// - CarritoProvider: carrito del usuario vía /api/cart (requiere login)
// - FavoriteProvider: favoritos del usuario vía /api/favorites (requiere login)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
