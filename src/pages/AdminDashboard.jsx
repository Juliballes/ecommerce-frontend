import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <header className="admin-hero">
        <span className="admin-eyebrow">Administracion</span>
        <h1 className="admin-title">Panel de Administracion</h1>
        <p className="admin-description">
          Gestion y supervision de usuarios registrados.
        </p>
      </header>

      <section className="admin-grid">
        <article className="admin-card">
          <h2 className="admin-card-title">Usuarios</h2>
          <p className="admin-card-copy">
            Ver y supervisar cuentas registradas del sistema desde un espacio
            administrativo separado del flujo comercial.
          </p>
          <Link to="/admin/usuarios" className="admin-button-primary">
            Gestionar usuarios
          </Link>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboard;
