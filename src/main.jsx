import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';

// Punto de entrada: envuelvo la app con Router y los contextos globales
// Auth va afuera porque Carrito y Favoritos dependen del token
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
