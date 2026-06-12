import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        state.items.push({ ...product, cantidad: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload);

      if (item) {
        item.cantidad += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload);

      if (!item) return;

      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        state.items = state.items.filter((product) => product.id !== action.payload);
      }
    },
    setQuantity: (state, action) => {
      const { id, cantidad } = action.payload;
      const item = state.items.find((product) => product.id === id);
      const nuevaCantidad = Number(cantidad);

      if (!item || Number.isNaN(nuevaCantidad)) return;

      if (nuevaCantidad > 0) {
        item.cantidad = nuevaCantidad;
      } else {
        state.items = state.items.filter((product) => product.id !== id);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
