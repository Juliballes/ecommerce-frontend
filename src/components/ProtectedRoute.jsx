import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrapper para rutas que requieren login — si no hay token, redirijo a /login
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
