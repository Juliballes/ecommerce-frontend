import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import ProductListCategoria from '../components/ProductListCategoria';
import './Home.css';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoriaId, setCategoriaId] = useState(null);

  const soloOfertas = searchParams.get('sale') === '1';

  // Si venís con ?categoriaId= en la URL, aplico el filtro al cargar
  useEffect(() => {
    const catParam = searchParams.get('categoriaId');
    if (catParam) {
      setCategoriaId(Number(catParam));
    }
  }, [searchParams]);

  const handleCategoriaChange = (id) => {
    setCategoriaId(id);

    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set('categoriaId', String(id));
    } else {
      params.delete('categoriaId');
    }
    setSearchParams(params, { replace: true });
  };

  const irAProductos = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Nueva temporada</span>
          <h1 className="hero-title">Encontrá lo que buscás</h1>
          <p className="hero-text">
            Productos destacados, envío a todo el país y la mejor experiencia de compra.
          </p>
          <button type="button" className="hero-cta" onClick={irAProductos}>
            Ver productos
          </button>
        </div>
      </section>

      <section id="productos" className="catalog-section">
        {soloOfertas && (
          <p className="catalog-aviso">Mostrando productos con envío gratis</p>
        )}

        <div className="catalog-layout">
          <ProductListCategoria
            variant="sidebar"
            categoriaSeleccionada={categoriaId}
            onCategoriaChange={handleCategoriaChange}
          />
          <ProductList categoriaId={categoriaId} soloOfertas={soloOfertas} />
        </div>
      </section>
    </div>
  );
};

export default Home;
