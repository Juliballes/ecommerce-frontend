import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './slices/favoriteSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    cart: cartReducer,
  },
});
