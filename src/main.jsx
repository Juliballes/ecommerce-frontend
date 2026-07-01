import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { store } from './store/store.js';

// Punto de entrada: Router, auth y store global de Redux
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Disponible para toda la aplicacion, incluida la navbar. */}
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
