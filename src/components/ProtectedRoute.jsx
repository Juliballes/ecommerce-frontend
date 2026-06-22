import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrapper para rutas que requieren login — si no hay token, redirijo a /login
const ProtectedRoute = ({ children }) => {
  const { token, authReady } = useAuth();

  if (!authReady) return null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
