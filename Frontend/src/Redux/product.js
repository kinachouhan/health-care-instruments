import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
    products: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    singleProduct : null
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

            return id; // 🔥 return id
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id) => {
        const res = await fetch(`${API}/api/v1/product/${id}`);

        const data = await res.json();

        return data.responseData
    }
);


export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API}/api/v1/product/update/${id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update product");
            }

            return data.responseData;
        } catch (error) {
            return rejectWithValue(error.message);
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
                state.products = state.products.filter(
                    (p) => p._id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(getProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProduct = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;

                state.products = state.products.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );

                if (state.singleProduct?._id === action.payload._id) {
                    state.singleProduct = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default productSlice.reducer;




