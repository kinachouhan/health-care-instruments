import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;




const initialState = {
      user: null,
       isAuthenticated: false,
      loading: false,
      error: null,
};


export const sendOtp = createAsyncThunk(
      "auth/sendOtp",
      async (email, { rejectWithValue }) => {
            try {
                  const res = await fetch(`${API}/api/v1/user/send-otp`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ email }),
                  });

                  if (!res.ok) {
                        const errorData = await res.json();
                        return rejectWithValue(errorData.message || "Failed to send OTP");
                  }
                  const data = await res.json();
                  return data;
            } catch (err) {
                  return rejectWithValue(err.message);
            }
      }
);


export const verifyOtp = createAsyncThunk(
      "auth/verifyOtp",
      async ({ email, otp }, { rejectWithValue }) => {
            try {
                  const res = await fetch(`${API}/api/v1/user/verify-otp`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ email, otp }),
                  });

                  if (!res.ok) {
                        const errorData = await res.json();
                        return rejectWithValue(errorData.message || "Failed to verify OTP");
                  }

                  const data = await res.json();
                  return data;
            } catch (err) {
                  return rejectWithValue(err.message);
            }
      }
);


export const resendOtp = createAsyncThunk(
      "auth/resendOtp",
      async (email, { rejectWithValue }) => {
            try {
                  const res = await fetch(`${API}/api/v1/user/resend-otp`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ email }),
                  });

                  if (!res.ok) {
                        const errorData = await res.json();
                        return rejectWithValue(errorData.message || "Failed to resend OTP");
                  }

                  const data = await res.json();
                  return data;
            } catch (err) {
                  return rejectWithValue(err.message);
            }
      }
);




export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // correct way to send cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json(); 

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Signup failed");
      }
     
      return data.responseData
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // correct way to send cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json(); 

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Login failed");
      }
     
      return data.responseData
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include", 
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return rejectWithValue(data.message || "Logout failed");
      }

      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);





const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {

      },
      extraReducers: (builder) => {
            builder
                  .addCase(sendOtp.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(sendOtp.fulfilled, (state, action) => {
                        state.loading = false;
                        state.user = action.payload;
                  })
                  .addCase(sendOtp.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || "Something went wrong";
                  })
                  .addCase(resendOtp.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(resendOtp.fulfilled, (state, action) => {
                        state.loading = false;
                        state.user = action.payload;
                  })
                  .addCase(resendOtp.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || "Something went wrong";
                  })
                  .addCase(verifyOtp.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(verifyOtp.fulfilled, (state, action) => {
                        state.loading = false;
                        state.user = action.payload
                  })
                  .addCase(verifyOtp.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })
                  .addCase(signup.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(signup.fulfilled, (state, action) => {
                        state.loading = false;
                        state.isAuthenticated = true;
                        state.user = action.payload;
                  })
                  .addCase(signup.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })
                  .addCase(login.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(login.fulfilled, (state, action) => {
                        state.loading = false;
                        state.isAuthenticated = true;
                        state.user = action.payload;
                  })
                  .addCase(login.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload;
                  })
                  .addCase(logout.fulfilled, (state) => {
                         state.user = null;
                          state.isAuthenticated = false; 
                          state.loading = false; 
                  }) 
                  .addCase(logout.rejected, (state, action) => { 
                        state.loading = false; 
                        state.error = action.payload; 
                  });
      },
});


export default authSlice.reducer;
