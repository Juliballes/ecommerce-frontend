import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorite } from '../context/FavoriteContext';
import './ProductListCategoria.css';

// ProductListCategoria: muestra las categorías disponibles desde la API
// Cuando el usuario hace click en una, filtra los productos de esa categoría
// useEffect con [categoriaSeleccionada] se re-ejecuta cada vez que cambia el filtro
const ProductListCategoria = () => {
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavorite();
  const [categorias, setCategorias] = useState([]); //Guarda el array de categorías que vienen del backend. Arranca vacío.
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);//Guarda el id de la categoría que el usuario clickeó. Arranca en null porque ninguna está seleccionada todavía. Este estado es la clave de todo el componente — cuando cambia, dispara el segundo useEffect.
  const [productosFiltrados, setProductosFiltrados] = useState([]);//Guarda los productos que devuelve el backend al filtrar por categoría.
  const [loadingCategorias, setLoadingCategorias] = useState(true);//Loading específico para las categorías. Arranca en true.
  const [loadingProductos, setLoadingProductos] = useState(false);//Loading específico para los productos filtrados. Arranca en false porque todavía no buscamos productos.
  const [error, setError] = useState(null); //Guarda el error si algo falla en cualquiera de los dos fetches.

  // Efecto 1: carga las categorías UNA sola vez al montar el componente
  useEffect(() => {//Primer efecto.
    const fetchCategorias = async () => {//Función asíncrona definida adentro del efecto.
      try {
        const response = await fetch('http://localhost:8080/api/categorias'); //GET al endpoint de categorías. No necesita token, es público.
        if (!response.ok) throw new Error('Error al cargar categorías');//Si el servidor respondió con error (4xx, 5xx), lanzamos el error para que lo capture el catch.
        const data = await response.json();//Convierte la respuesta a array de objetos JavaScript.
        setCategorias(data); //Guarda las categorías en el estado → React re-renderiza → aparecen los botones.
      } catch (err) {
        setError(err.message);//Si algo falló, guarda el mensaje de error.
      } finally {
        setLoadingCategorias(false);//Siempre apaga el loading de categorías, haya error o no.
      }
    };

    fetchCategorias();
  }, []); // [] = solo al montar,  se ejecuta una sola vez al montar. Las categorías no cambian mientras el usuario navega, no tiene sentido buscarlas de nuevo.

  // Efecto 2: se re-ejecuta cada vez que cambia categoriaSeleccionada
  // Dependencia [categoriaSeleccionada]: el efecto "vigila" esa variable
  useEffect(() => {
    // Si no hay categoría seleccionada, no hacemos nada
    if (!categoriaSeleccionada) return;

    const fetchProductosPorCategoria = async () => {
      setLoadingProductos(true);//Activa el loading de productos antes de ir a buscarlos.
      try {
        const response = await fetch(
          `http://localhost:8080/api/productos?categoriaId=${categoriaSeleccionada}` //GET con query param. Si el usuario clickeó la categoría con id: 3, la URL queda ...?categoriaId=3. El backend filtra y devuelve solo los productos de esa categoría.
        );                                                                           
        if (!response.ok) throw new Error('Error al filtrar productos');
        const data = await response.json();
        setProductosFiltrados(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductosPorCategoria();
  }, [categoriaSeleccionada]); // se re-ejecuta cuando cambia la categoría, //Al poner categoriaSeleccionada en el array, le decimos a React: "vigilá esta variable, y cada vez que cambie su valor, volvé a ejecutar este efecto". Cuando el usuario clickea "Audio", categoriaSeleccionada pasa de null a 3 → el efecto se dispara → busca los productos de Audio.

  if (loadingCategorias) return <div className="estado-carga">Cargando categorías...</div>;//Mientras no llegaron las categorías, muestra solo esto.
  if (error) return <div className="estado-error">Error: {error}</div>;//Si hubo error en cualquier fetch, muestra el error.

  return (
    <div className="categorias-container">
      <h2 className="categorias-titulo">Categorías</h2>

      {/* Lista de botones de categoría */}
      <div className="categorias-lista">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`btn-categoria ${categoriaSeleccionada === cat.id ? 'activa' : ''}`} //** Ternario que agrega la clase CSS activaal botón de la categoría seleccionada. SicategoriaSeleccionadaes3y este botón es el de id3`, le agrega la clase (se pone resaltado). Los demás quedan sin la clase.
            onClick={() => setCategoriaSeleccionada(cat.id)}//Cuando el usuario clickea un botón, guarda el id de esa categoría en el estado. Eso dispara el segundo useEffect.
          >
            {cat.nombre}
          </button>
        ))}

        {/* Botón para limpiar el filtro */}
        {categoriaSeleccionada && ( //Todo el bloque de productos filtrados solo se renderiza si hay una categoría seleccionada. Si categoriaSeleccionada es null, no muestra nada acá.
          <button
            className="btn-categoria btn-limpiar"
            onClick={() => {
              setCategoriaSeleccionada(null);
              setProductosFiltrados([]); //Al clickear "Ver todos": limpia la categoría seleccionada (vuelve a null) y vacía el array de productos filtrados. Como categoriaSeleccionada vuelve a null, el segundo useEffect se dispara pero entra al if (!categoriaSeleccionada) return y no hace nada.
            }}
          >
            ✕ Ver todos
          </button>
        )}
      </div>

      {/* Renderizado condicional: solo mostramos productos si hay una categoría seleccionada */}
      {categoriaSeleccionada && (
        <div className="productos-filtrados">
          {loadingProductos ? (//Ternario anidado de tres ramas. Primero pregunta: ¿está cargando?
            <div className="estado-carga">Cargando productos...</div>//Si está cargando, muestra esto.
          ) : productosFiltrados.length === 0 ? (//Si no está cargando, segunda pregunta: ¿llegaron productos?
            <div className="sin-productos">No hay productos en esta categoría.</div>//Si el array está vacío, muestra esto.
          ) : (//Si no está cargando y hay productos, muestra la grilla.
            <div className="grid-filtrado">
              {productosFiltrados.map((product) => (//Renderiza cada producto filtrado con .map().
                <div key={product.id} className="card-mini">
                  <button
                    type="button"
                    className="btn-favorito-mini"
                    onClick={(e) => {
                      e.preventDefault();
                      const isFav = favoriteItems.some((item) => item.id === product.id);
                      isFav ? removeFromFavorite(product.id) : addToFavorite(product);
                    }}
                  >
                    {favoriteItems.some((item) => item.id === product.id) ? '❤️' : '🤍'}
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="card-mini-link"
                  >
                    <img
                      src={product.imagenes?.[0] || product.imagen || ''}
                      alt={product.nombre}
                      className="card-mini-img"
                    />
                    <div className="card-mini-info">
                      <p className="card-mini-nombre">{product.nombre}</p>
                      <p className="card-mini-precio">
                        ${Number(product.precio).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListCategoria;
