import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';

export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Khôi phục session từ localStorage khi app khởi động
const savedToken = localStorage.getItem('accessToken');
const savedUser = localStorage.getItem('authUser');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  accessToken: savedToken,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
};

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch {
    // Vẫn logout phía client dù BE lỗi
  }
});

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const data = await authApi.refreshToken(accessToken);
      return data.accessToken;
    } catch (err: any) {
      return rejectWithValue('Phiên đăng nhập hết hạn');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Dùng khi refresh token thành công từ interceptor
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = {
          fullName: action.payload.fullName,
          email: action.payload.email,
          role: action.payload.role,
          permissions: action.payload.permissions,
        };
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('authUser', JSON.stringify(state.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // LOGOUT
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    });

    // REFRESH TOKEN
    builder
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        localStorage.setItem('accessToken', action.payload);
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authUser');
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

/** Kiểm tra permission cụ thể */
export const selectHasPermission = (permission: string) => (state: { auth: AuthState }) =>
  state.auth.user?.permissions?.includes(permission) ?? false;

/** Kiểm tra role */
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role === 'Admin';
