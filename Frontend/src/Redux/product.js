import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
    products: [],
    loading: false,
    error: null,
    totalPages: 1,
  currentPage: 1,
};


export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/api/v1/product/add`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to add product");
            }

            return data.responseData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getAllProduct = createAsyncThunk(
    "product/getAllProduct",
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/api/v1/product?page=${page}&limit=${limit}`, {
                method: "GET",
                credentials: "include"
            })

            const data = await res.json()

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to fetch products")
            }

            return data
        }
        catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/api/v1/product/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to delete product");
            }

            return data // return deleted product info
        } catch (error) {
            return rejectWithValue(error.message || "Network error");
        }
    }
);



const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload)
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.responseData;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getAllProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter((p) => p._id !== action.payload._id);
            })
            .addCase(deleteProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default productSlice.reducer;




