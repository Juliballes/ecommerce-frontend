import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto del carrito
// createContext crea un "canal" global para compartir datos entre componentes
const CarritoContext = createContext();

// CarritoProvider es el componente que "envuelve" la app y provee el estado del carrito
export const CarritoProvider = ({ children }) => {
  // items: array de productos en el carrito, cada uno con cantidad
  const [items, setItems] = useState([]);

  // Agregar producto al carrito
  // Si ya existe, incrementa la cantidad; si no, lo agrega con cantidad 1
  const agregarAlCarrito = (producto) => {
    setItems((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Eliminar un item del carrito por id
  const eliminarDelCarrito = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Vaciar todo el carrito
  const vaciarCarrito = () => {
    setItems([]);
  };

  // Calcular el total sumando precio * cantidad de cada item
  const calcularTotal = () => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  // Cantidad total de items (para el badge del ícono del carrito)
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

// Hook personalizado para usar el carrito fácilmente en cualquier componente
export const useCarrito = () => useContext(CarritoContext);
