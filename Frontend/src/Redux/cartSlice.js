import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API = import.meta.env.VITE_API_URL;

const initialState = {
  items: [],
  cartLoading: false,
  error: null,
};

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/cart`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to load cart");
      return data.responseData.items;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ADD / INCREASE / DECREASE
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      // Ensure payload is items array
      return data.responseData || data.cart.items;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return data.responseData; // always items array
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CLEAR CART
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);
      return []; // empty cart
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.cartLoading = false;
      })

      // ADD
      .addCase(addToCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = action.payload || [];
      })
      .addCase(addToCart.rejected, (state) => {
        state.cartLoading = false;
      })

      // REMOVE
      .addCase(removeFromCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.cartLoading = false;
      })

      // CLEAR
      .addCase(clearCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartLoading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state) => {
        state.cartLoading = false;
      });
  },
});

export default cartSlice.reducer;
