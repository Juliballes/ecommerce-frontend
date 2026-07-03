import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { fetchFavorites } from '../store/slices/favoriteSlice';

const FavoritesSync = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavorites(token));
  }, [dispatch, token]);

  return null;
};

export default FavoritesSync;
