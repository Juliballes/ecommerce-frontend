import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);

      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addFavorite, removeFromFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
