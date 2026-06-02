import { Navigate } from 'react-router-dom';

// Redirige la ruta vieja a Mis compras (misma info, unificada)
const MisPedidos = () => <Navigate to="/mis-compras" replace />;

export default MisPedidos;
