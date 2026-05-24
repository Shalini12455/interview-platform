import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = {
            email: action.payload.email,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            role: action.payload.role,
          };
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(state.user));
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = {
            email: action.payload.email,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            role: action.payload.role,
          };
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(state.user));
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
