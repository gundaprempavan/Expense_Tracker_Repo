import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      userData
    );
    return response.data; // Returning the user data or token
  }
);

export const loginUser = createAsyncThunk("user/login", async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    userData
  );
  // Store the token in local storage
  sessionStorage.setItem("token", response.data.token);
  return response.data; // Returning the user data or token
});

export const recoverPassword = createAsyncThunk(
  "user/recoverPassword",
  async (userData) => {
    const response = await axios.post(
      "http://localhost:5000/api/auth/recover-password",
      userData
    );
    return response.data; // Returning recovery success message
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    isAuthenticated: !!sessionStorage.getItem("token"), // Added to track authentication state
    recoveryMessage: null, // Added for password recovery success message
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      state.isAuthenticated = false; // Set authentication state to false
      sessionStorage.removeItem("token"); // Clear token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Store user info or token
        state.isAuthenticated = true; // Set authenticated state
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message.includes("Username already exists")
          ? "Username already exists"
          : action.error.message; // Set custom error message
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload; // Store user info or token
        state.isAuthenticated = true; // Set authenticated state
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(recoverPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recoverPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.recoveryMessage = action.payload.message; // Store recovery success message
      })
      .addCase(recoverPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the logout action
export const { logout } = userSlice.actions;

// Export the user reducer
export default userSlice.reducer;
