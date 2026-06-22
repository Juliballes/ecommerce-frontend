import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protección para rutas que requieren rol ADMIN
const AdminRoute = ({ children }) => {
  const { token, authReady, isAdmin } = useAuth();

  if (!authReady) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
