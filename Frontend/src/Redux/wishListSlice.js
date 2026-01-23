import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
    items: [],
    wishListLoading: false,
    error: null,
};



export const fetchWishList = createAsyncThunk(
    "wishlist/fetch",
    async (_, { rejectWithValue }) => {
        try {
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

/* ================= ADD ================= */
export const addToWishList = createAsyncThunk(
    "wishlist/add",
    async ({ productId }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/api/v1/wishlist/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            return data.responseData; // ALWAYS items array
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

/* ================= REMOVE ================= */
export const removeFromWishList = createAsyncThunk(
    "wishlist/remove",
    async ({ productId }, { rejectWithValue }) => {
        try {
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

/* =========================
   CLEAR WISHLIST
========================= */
export const clearWishList = createAsyncThunk(
    "wishlist/clearWishList",
    async (_, { rejectWithValue }) => {
        try {
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

/* =========================
   SLICE
========================= */
const wishListSlice = createSlice({
    name: "wishList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
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

            // ADD
            .addCase(addToWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(addToWishList.fulfilled, (state, action) => {
                state.wishListLoading = false;
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(addToWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })

            // REMOVE
            .addCase(removeFromWishList.pending, (state) => {
                state.wishListLoading = true;
            })
            .addCase(removeFromWishList.fulfilled, (state, action) => {
                state.wishListLoading = false;
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(removeFromWishList.rejected, (state, action) => {
                state.wishListLoading = false;
                state.error = action.payload;
            })

            // CLEAR
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
            });
    },
});

export default wishListSlice.reducer;
