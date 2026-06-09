import { useState, useContext, createContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';
import { mergeProductImages } from '../utils/productImages';

const FavoriteContext = createContext();

// Hook custom — tiro error si lo uso fuera del Provider (me ayuda a debuggear)
export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('Falta FavoriteProvider en main.jsx');
  }
  return context;
}

const mapFavorito = (fav) => ({
  favoritoId: fav.id, // id del registro en /api/favorites (lo necesito para DELETE)
  id: fav.productId,
  nombre: fav.nombreProducto,
  precio: fav.precio,
  imagenes: fav.imagenes,
  imagen: fav.imagen,
});

const hydrateFavoriteImages = async (items) =>
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

export function FavoriteProvider({ children }) {
  const { token } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);

  // GET /api/favorites al montar o cuando cambia la sesión
  useEffect(() => {
    if (!token) {
      setFavoriteItems([]);
      return;
    }

    const cargarFavoritos = async () => {
      try {
        const data = await apiFetch('/favorites', { token });
        const items = data.map(mapFavorito);
        setFavoriteItems(await hydrateFavoriteImages(items));
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
      const items = data.map(mapFavorito);
      setFavoriteItems(await hydrateFavoriteImages(items));
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
