import React, { useState, useContext, createContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

const FavoriteContext = createContext();

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite debe ser usado dentro de un FavoriteProvider');
  }
  return context;
}

const mapFavorito = (fav) => ({
  favoritoId: fav.id,
  id: fav.productId,
  nombre: fav.nombreProducto,
  precio: fav.precio,
});

export function FavoriteProvider({ children }) {
  const { token } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    if (!token) {
      setFavoriteItems([]);
      return;
    }

    const cargarFavoritos = async () => {
      try {
        const data = await apiFetch('/favorites', { token });
        setFavoriteItems(data.map(mapFavorito));
      } catch {
        setFavoriteItems([]);
      }
    };

    cargarFavoritos();
  }, [token]);

  const addToFavorite = async (product) => {
    if (!token) return false;

    try {
      await apiFetch('/favorites', {
        token,
        method: 'POST',
        body: { productId: product.id },
      });
      const data = await apiFetch('/favorites', { token });
      setFavoriteItems(data.map(mapFavorito));
      return true;
    } catch {
      return false;
    }
  };

  const removeFromFavorite = async (productId) => {
    if (!token) return false;

    const favorito = favoriteItems.find((item) => item.id === productId);
    if (!favorito?.favoritoId) return false;

    try {
      await apiFetch(`/favorites/${favorito.favoritoId}`, { token, method: 'DELETE' });
      setFavoriteItems((prev) => prev.filter((item) => item.id !== productId));
      return true;
    } catch {
      return false;
    }
  };

  const value = { favoriteItems, addToFavorite, removeFromFavorite };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}
