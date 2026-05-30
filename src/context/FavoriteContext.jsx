import React, { useState, useContext, createContext } from 'react';

const FavoriteContext = createContext();

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite debe ser usado dentro de un FavoriteProvider');
  }
  return context;
}

export function FavoriteProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState([]);

  const addToFavorite = (product) => {
    setFavoriteItems((prevItems) => {
      const exists = prevItems.some((item) => item.id === product.id);
      if (exists) return prevItems;
      return [...prevItems, product];
    });
    console.log(`${product.nombre} agregado a favoritos!`);
  };

  const removeFromFavorite = (id) => {
    setFavoriteItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const value = { favoriteItems, addToFavorite, removeFromFavorite };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}
