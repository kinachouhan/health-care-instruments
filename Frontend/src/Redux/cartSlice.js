import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../Redux/auth";

import {
  getGuestCart,
  addToGuestCart,
  removeFromGuestCart,
  clearGuestCart
} from "../utils/guestCart";


const API = import.meta.env.VITE_API_URL;

const initialState = {
  items: getGuestCart() || [],
  cartLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (isLoggedIn, { rejectWithValue }) => {
    try {

      if (!isLoggedIn) {
        return getGuestCart()
      }

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

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, quantity = 1, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        if (!product || !product._id) {
          throw new Error("Product data missing for guest cart");
        }

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

      return data.responseData.items;
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
        removeFromGuestCart(productId)
        return getGuestCart()
      }

      const res = await fetch(`${API}/api/v1/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return data.responseData;
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
        clearGuestCart()
        return []
      }
      const res = await fetch(`${API}/api/v1/cart/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Failed to clear cart");
      }
      return [];
    } catch (err) {
      return rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async (guestItems, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/cart/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ items: guestItems }),
      });

      const data = await res.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      }

      return data.responseData;
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


      .addCase(addToCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartLoading = false;

        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {

          const { product, quantity } = action.meta.arg;
          const existing = state.items.find(
            i => i.product._id === product._id
          );

          if (existing) {
            existing.quantity += quantity;
          } else {
            state.items.push({ product, quantity });
          }
        }
      })
      .addCase(addToCart.rejected, (state) => {
        state.cartLoading = false;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartLoading = false;

        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {

          state.items = state.items.filter(
            item => item.product._id !== action.meta.arg.productId
          );
        }
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.cartLoading = false;
      })

      .addCase(clearCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartLoading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state) => {
        state.cartLoading = false;
      })
      .addCase(mergeCart.pending, (state) => {
        state.cartLoading = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.cartLoading = false;

        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else if (action.payload?.items) {
          state.items = action.payload.items;
        } else {
          state.items = [];
        }
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.cartLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.cartLoading = false;
      })
  },
});

export default cartSlice.reducer;
