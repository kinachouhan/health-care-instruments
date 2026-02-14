import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGuestCart,
  addToGuestCart,
  removeFromGuestCart,
  clearGuestCart,
} from "../utils/guestCart";

const API = import.meta.env.VITE_API_URL;

const initialState = {
  items: [],
  cartLoading: false,
  error: null,
};


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        return getGuestCart();
      }

      const res = await fetch(`${API}/api/v1/cart`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to load cart");

      return data.responseData?.items || []; // ✅ FIX
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        addToGuestCart({ product, quantity });
        return getGuestCart();
      }

      const res = await fetch(`${API}/api/v1/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });

      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return data.responseData || []; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        removeFromGuestCart(productId);
        return getGuestCart();
      }

      const res = await fetch(`${API}/api/v1/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return data.responseData || []; // ✅ FIXED
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (isLoggedIn, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        clearGuestCart();
        return [];
      }

      const res = await fetch(`${API}/api/v1/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.cartLoading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartLoading = false;
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.cartLoading = false;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
