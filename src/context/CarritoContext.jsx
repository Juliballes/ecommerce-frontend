import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';
import { mergeProductImages } from '../utils/productImages';

const CarritoContext = createContext();

// Adapto la respuesta del backend al formato que usa la UI del carrito
const mapLineas = (lineas) =>
  lineas.map((linea) => ({
    lineaId: linea.id,
    id: linea.productId,
    nombre: linea.nombreProducto,
    precio: linea.precioActual,
    cantidad: linea.cantidad,
    stock: linea.stockDisponible,
    imagenes: linea.imagenes,
    imagen: linea.imagen,
  }));

const hydrateCartImages = async (items) =>
  Promise.all(
    items.map(async (item) => {
      try {
        const productDetail = await apiFetch(`/productos/${item.id}`);
        return mergeProductImages(item, productDetail);
      } catch {
        return item;
      }
    })
  );

export const CarritoProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  // Recargo el carrito cada vez que cambia el token (login/logout)
  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }

    const cargarCarrito = async () => {
      try {
        const data = await apiFetch('/cart', { token }); // GET /api/cart
        const lineas = mapLineas(data);
        setItems(await hydrateCartImages(lineas));
      } catch {
        setItems([]);
      }
    };

    cargarCarrito();
  }, [token]);

  const agregarAlCarrito = async (producto) => {
    if (!token) return false; // sin sesión no puedo tocar el carrito del backend

    try {
      const data = await apiFetch('/cart', {
        token,
        method: 'POST',
        body: { productId: producto.id, quantity: 1 },
      });
      const lineas = mapLineas(data);
      setItems(await hydrateCartImages(lineas));
      return true;
    } catch {
      return false;
    }
  };

  const eliminarDelCarrito = async (lineaId) => {
    if (!token) return;

    try {
      const data = await apiFetch(`/cart/${lineaId}`, { token, method: 'DELETE' });
      const lineas = mapLineas(data);
      setItems(await hydrateCartImages(lineas));
    } catch {
      // sin cambios si falla
    }
  };

  const vaciarCarrito = async () => {
    if (!token) {
      setItems([]);
      return;
    }

    try {
      const data = await apiFetch('/cart', { token, method: 'DELETE' });
      const lineas = mapLineas(data);
      setItems(await hydrateCartImages(lineas));
    } catch {
      setItems([]);
    }
  };

  const calcularTotal = () =>
    items.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // Suma de cantidades — lo uso para el badge del Navbar
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        calcularTotal,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
