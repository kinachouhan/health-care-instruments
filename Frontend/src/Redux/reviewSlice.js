import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;

const initialState = {
  reviews: [],
  userReview: null,
  loading: false,
  error: null,
  count: 0,
  canReview: false,
};


export const checkCanReview = createAsyncThunk(
  "review/checkCanReview",
  async (productId, thunkAPI) => {
    try {
      const res = await fetch(
        `${API}/api/v1/review/can-review/${productId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return Boolean(data.responseData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const fetchProductReviews = createAsyncThunk(
  "review/fetchProductReview",
  async (productId, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/review/${productId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchUserReviews = createAsyncThunk(
  "review/fetchUserReview",
  async (productId, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/review/user/${productId}`, {
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


export const submitReview = createAsyncThunk(
  "review/submitReview",
  async ({ productId, rating, comment }, thunkAPI) => {
    try {
      const res = await fetch(`${API}/api/v1/review`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, rating, comment }),
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
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkCanReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCanReview.fulfilled, (state, action) => {
        state.loading = false;
        state.canReview = action.payload;
      })
      .addCase(checkCanReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.responseData;
        state.count = action.payload.count;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReview = action.payload;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.userReview = action.payload;

        const index = state.reviews.findIndex(
          (r) => r._id === action.payload._id
        );

        if (index !== -1) {
          state.reviews[index] = action.payload;
        } else {
          state.reviews.unshift(action.payload);
          state.count += 1;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
