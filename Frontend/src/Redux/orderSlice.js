import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
  loading: false,
  userData: null,
  orders: [],
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order/orders`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.responseData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchAllOrdersAdmin = createAsyncThunk(
  "order/fetchAllOrdersAdmin",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.responseData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order/${orderId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.responseData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ orderData }, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order/place-order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.responseData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/* ================= SLICE ================= */
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (o) => o._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
