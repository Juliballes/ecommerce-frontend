import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Panel de Administración</h1>
      <p>Bienvenido al panel administrativo. Aquí puede gestionar usuarios registrados.</p>

      <ul>
        <li>
          <Link to="/admin/usuarios">Ver usuarios</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
