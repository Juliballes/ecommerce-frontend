import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFavorites,
  addFavoriteApi,
  removeFavoriteApi,
} from '../../services/favoritesApi';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (token, { rejectWithValue }) => {
    if (!token) return [];

    try {
      return await getFavorites(token);
    } catch (err) {
      return rejectWithValue(err.message ?? 'Error al cargar favoritos');
    }
  }
);

export const addFavoriteAsync = createAsyncThunk(
  'favorites/addFavorite',
  async ({ token, product }, { rejectWithValue }) => {
    try {
      if (token) {
        const saved = await addFavoriteApi(token, product.id);
        return { ...product, favoritoId: saved.favoritoId };
      }

      return product;
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo agregar a favoritos');
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ token, productId, favoritoId }, { rejectWithValue }) => {
    try {
      if (token && favoritoId) {
        await removeFavoriteApi(token, favoritoId);
      }

      return productId;
    } catch (err) {
      return rejectWithValue(err.message ?? 'No se pudo quitar de favoritos');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        const exists = state.items.some((item) => item.id === action.payload.id);

        if (!exists) {
          state.items.push(action.payload);
        }

        state.error = null;
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
