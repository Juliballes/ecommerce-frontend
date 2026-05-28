import React from 'react';
import ProductList from '../components/ProductList';
import ProductListCategoria from '../components/ProductListCategoria';
import './Home.css';

// Home: página principal del sitio
// Muestra dos secciones según el TPO:
// 1. Listado de productos (conectado a la API)
// 2. Listado de categorías con filtro (conectado a la API)
const Home = () => {
  return (
    <div className="home-container">
      {/* Sección 1: Categorías con filtro */}
      <section className="home-section">
        <ProductListCategoria />
      </section>

      {/* Divisor visual */}
      <hr className="home-divisor" />

      {/* Sección 2: Todos los productos */}
      <section className="home-section">
        <ProductList />
      </section>
    </div>
  );
};

export default Home;
