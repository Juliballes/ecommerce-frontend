import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { clearFavorites, setFavorites } from '../store/slices/favoriteSlice';
import { getFavorites } from '../services/favoritesApi';

const FavoritesSync = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    let activo = true;

    const cargarFavoritos = async () => {
      if (!token) {
        dispatch(clearFavorites());
        return;
      }

      try {
        const items = await getFavorites(token);
        if (activo) dispatch(setFavorites(items));
      } catch {
        if (activo) dispatch(clearFavorites());
      }
    };

    cargarFavoritos();

    return () => {
      activo = false;
    };
  }, [dispatch, token]);

  return null;
};

export default FavoritesSync;
