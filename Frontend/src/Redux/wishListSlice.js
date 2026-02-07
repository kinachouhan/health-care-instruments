import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../Redux/auth";
import { getGuestWishList, addToGuestWishList, removeFromGuestWishList, clearGuestWishList } from "../utils/guestWishList";

const API = import.meta.env.VITE_API_URL;

const initialState = {
    items: getGuestWishList() || [],
    wishListLoading: false,
    error: null,
}


export const mergeWishList = createAsyncThunk(
  "wishlist/merge",
  async (guestItems, { rejectWithValue }) => {
    try {
      const formattedItems = guestItems.map(item => ({
        product: item.product._id
      }));

      const res = await fetch(`${API}/api/v1/wishlist/merge`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: formattedItems }),
      });

      const data = await res.json();
      if (!data.success) return rejectWithValue(data.message);

      return data.responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchWishList = createAsyncThunk(
    "wishlist/fetch",
    async (isLoggedIn, { rejectWithValue }) => {
        try {

            if (!isLoggedIn) {
                return getGuestWishList()
            }
            const res = await fetch(`${API}/api/v1/wishlist`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            return data.responseData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addToWishList = createAsyncThunk(
  "wishlist/add",
  async ({ product, isLoggedIn }, { rejectWithValue }) => {
    try {
      if (!isLoggedIn) {
        addToGuestWishList(product);
        return getGuestWishList();
      }

      const res = await fetch(`${API}/api/v1/wishlist/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,   
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return Array.isArray(data.responseData)
        ? data.responseData
        : data.responseData.items;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const removeFromWishList = createAsyncThunk(
    "wishlist/remove",
    async ({ productId, isLoggedIn }, { rejectWithValue }) => {
        try {

            if (!isLoggedIn) {
                removeFromGuestWishList(productId)
                return getGuestWishList()
            }

            const res = await fetch(`${API}/api/v1/wishlist/remove`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            return data.responseData;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const clearWishList = createAsyncThunk(
    "wishlist/clearWishList",
    async (isLoggedIn, { rejectWithValue }) => {
        try {

            if (!isLoggedIn) {
                clearGuestWishList()
                return []
            }

            const res = await fetch(`${API}/api/v1/wishlist/clear`, {
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

const wishListSlice = createSlice({
    name: "wishList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(fetchWishList.fulfilled, (state, action) => {
                state.wishListLoading = false;
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.items = [];
                state.error = action.payload;
            })


            .addCase(addToWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(addToWishList.fulfilled, (state, action) => {
                state.wishListLoading = false;

                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    const product = action.meta.arg.product;
                    const exists = state.items.some(
                        i => i.product._id === product._id
                    );

                    if (!exists) {
                        state.items.push({ product });
                    }
                }
            })
            .addCase(addToWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })

            .addCase(removeFromWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(removeFromWishList.fulfilled, (state, action) => {
                state.wishListLoading = false;
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {

                    state.items = state.items.filter(
                        item => item.product._id !== action.meta.arg.productId
                    );
                }

            })
            .addCase(removeFromWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })


            .addCase(clearWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(clearWishList.fulfilled, (state) => {
                state.wishListLoading = false;
                state.items = [];
            })
            .addCase(clearWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })

            .addCase(logout.fulfilled, (state) => {
                state.items = [];
                clearGuestWishList();
            })

            .addCase(mergeWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(mergeWishList.fulfilled, (state, action) => {
                state.wishListLoading = false

                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else if (action.payload?.items) {
                    state.items = action.payload.items;
                } else {
                    state.items = [];
                }
            })
            .addCase(mergeWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })
    },
});

export default wishListSlice.reducer;
