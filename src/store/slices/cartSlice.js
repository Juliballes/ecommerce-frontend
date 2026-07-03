import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartLine,
  clearRemoteCart,
} from '../../services/cartApi';
import { checkoutCart } from '../../services/pedidoApi';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (token, { rejectWithValue }) => {
    if (!token) return [];

    try {
      return await getCart(token);
    } catch (err) {
      return rejectWithValue(err.message ?? 'Error al cargar el carrito');
    }
  }
);

export const addCartItemAsync = createAsyncThunk(
  'cart/addCartItem',
  async ({ token, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      return await addCartItem(token, productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo agregar el producto al carrito');
    }
  }
);

export const updateCartItemQuantityAsync = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ token, productId, quantity }, { rejectWithValue }) => {
    try {
      return await updateCartItemQuantity(token, productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo actualizar la cantidad');
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  'cart/removeCartItem',
  async ({ token, item }, { rejectWithValue }) => {
    try {
      if (item.lineaId) {
        return await removeCartLine(token, item.lineaId);
      }

      return await updateCartItemQuantity(token, item.id, 0);
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo eliminar el producto del carrito');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (token, { rejectWithValue }) => {
    try {
      return await clearRemoteCart(token);
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo vaciar el carrito');
    }
  }
);

export const checkoutCartAsync = createAsyncThunk(
  'cart/checkout',
  async (token, { rejectWithValue }) => {
    try {
      return await checkoutCart(token);
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo confirmar la compra');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setCartFromPayload = (state, action) => {
      state.items = action.payload;
      state.error = null;
    };

    const setCartError = (state, action) => {
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(addCartItemAsync.fulfilled, setCartFromPayload)
      .addCase(addCartItemAsync.rejected, setCartError)
      .addCase(updateCartItemQuantityAsync.fulfilled, setCartFromPayload)
      .addCase(updateCartItemQuantityAsync.rejected, setCartError)
      .addCase(removeCartItemAsync.fulfilled, setCartFromPayload)
      .addCase(removeCartItemAsync.rejected, setCartError)
      .addCase(clearCartAsync.fulfilled, setCartFromPayload)
      .addCase(clearCartAsync.rejected, setCartError)
      .addCase(checkoutCartAsync.fulfilled, (state) => {
        state.items = [];
        state.error = null;
      })
      .addCase(checkoutCartAsync.rejected, setCartError);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
