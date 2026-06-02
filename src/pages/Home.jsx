import React from 'react';
import ProductList from '../components/ProductList';
import ProductListCategoria from '../components/ProductListCategoria';
import './Home.css';

// Home: arriba categorías con filtro, abajo listado completo de productos
const Home = () => {
  return (
    <div className="home-container">
      <section className="home-section">
        <ProductListCategoria />
      </section>

      <hr className="home-divisor" />

      <section className="home-section">
        <ProductList />
      </section>
    </div>
  );
};

export default Home;
