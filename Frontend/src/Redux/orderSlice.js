import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
  loading: false,
  userOrders: [],
  adminOrders: [],
  error: null,
  buyNowItem: null,
};


export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order/orders`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
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
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/order/place-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await fetch(
        `${API}/api/v1/order/${orderId}/status`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const verifyUpiPayment = createAsyncThunk(
  "order/verifyUpiPayment",
  async ({ orderId }, thunkAPI) => {
    try {
      const res = await fetch(
        `${API}/api/v1/order/${orderId}/verify-payment`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data.responseData;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setBuyNowItem: (state, action) => {
      state.buyNowItem = action.payload;
    },
    clearBuyNowItem: (state) => {
      state.buyNowItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  
      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

   
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.userOrders.unshift(action.payload);
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        state.adminOrders = state.adminOrders.map((o) =>
          o._id === updated._id ? updated : o
        );

        state.userOrders = state.userOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
      })

      .addCase(verifyUpiPayment.fulfilled, (state, action) => {
        const updated = action.payload;

        state.adminOrders = state.adminOrders.map((o) =>
          o._id === updated._id ? updated : o
        );

        state.userOrders = state.userOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
      });
  },
});

export const { setBuyNowItem, clearBuyNowItem } = orderSlice.actions;
export default orderSlice.reducer;
