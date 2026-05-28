import React, { useEffect, useState } from 'react'; //useState para manejar el estado local del componente, y useEffect para ejecutar el efecto secundario (la llamada a la API).
import { Link } from 'react-router-dom'; //Importa Link para navegar a la página de detalle sin recargar la página.
import CardProductos from './CardProductos'; //Importa el componente de la card. Este componente va a recibir cada producto como prop.
import './ProductList.css';

// ProductList: obtiene los productos desde la API con useEffect y los muestra
// useEffect con [] se ejecuta UNA sola vez al montar el componente (carga inicial)
const ProductList = () => {
  const [products, setProducts] = useState([]); //Estado que guarda el array de productos. Arranca vacío [] porque todavía no fuimos a buscar nada al backend.
  const [loading, setLoading] = useState(true); //Estado que indica si estamos esperando la respuesta de la API. Arranca en true porque apenas monta el componente ya está cargando.
  const [error, setError] = useState(null); //Estado que guarda el mensaje de error si algo falla. Arranca en null porque todavía no hubo ningún error.

  // useEffect: efecto secundario — llama a la API cuando el componente se monta,Todo lo que está adentro se ejecuta después de que React pinta el componente en pantalla.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // GET /api/productos es público según SecurityConfig (no necesita token)
        const response = await fetch('http://localhost:8080/api/productos'); //Hace el GET al backend. El await pausa la función hasta que el servidor responda. 
        if (!response.ok) {
          throw new Error('Error al cargar los productos'); //response.ok es true si el servidor respondió con un código 200-299. Si respondió con 404, 500, etc., ok es false y lanzamos un error a mano para que lo capture el catch.
        }
        const data = await response.json();//Convierte la respuesta (que llega como texto) a un objeto JavaScript. El segundo await porque .json() también es asíncrono.
        setProducts(data); //Guarda el array de productos en el estado. Esto dispara un re-render y React vuelve a pintar el componente, ahora con los datos reales.
      } catch (err) {
        setError(err.message); //Si cualquier línea del try lanzó un error, llega acá. Guarda el mensaje en el estado error para mostrárselo al usuario.
      } finally {
        // finally siempre se ejecuta: apagamos el loading haya error o no
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // [] = solo se ejecuta al montar, no en cada re-render, Array de dependencias vacío. Le dice a React: ejecutá este efecto una sola vez, cuando el componente se monta. Nunca más.

  // Renderizado condicional: mostramos estados de carga o error
  if (loading) return <div className="estado-carga">Cargando productos...</div>;
  if (error) return <div className="estado-error">Error: {error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Nuestros Productos</h2>

      <div className="products-grid">
        {products.length === 0 && <div>No hay productos disponibles.</div>}

        {products.map((product) => ( //Renderizado de listas con .map(). Transforma cada objeto del array en un elemento JSX. Lo que está adentro del map se repite una vez por cada producto.
          // Link reemplaza <a href> para navegación SPA sin recarga de página
          <Link //Envuelve cada card en un Link. El to usa un template literal para armar la URL dinámica: si el producto tieneid: 5, genera /products/5. El key es obligatorio cuando usás.map()` — React lo necesita para identificar cada elemento y optimizar los re-renders.
            to={`/products/${product.id}`}
            key={product.id}
            style={{ textDecoration: 'none', color: 'inherit' }}

            //Le pasa el objeto product como prop al componente
          >
            <CardProductos product={product}> 
              {product.entregaGratis && (
                <span className="badge badge-envio">Envío gratis</span> //Renderizado condicional con &&. Si el producto tiene entregaGratis: true, este <span> se pasa como children a CardProductos. Si es false, no se pasa nada.
              )}
              {product.compraInternacional && (
                <span className="badge badge-internacional">Compra internacional</span>
              )}
            </CardProductos>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList; //Exporta el componente para que Home.jsx pueda importarlo.
