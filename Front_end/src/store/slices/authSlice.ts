import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';

export type Role = 'ADMIN' | 'STAFF' | 'USER' | 'Admin' | 'Staff' | 'User' | string;

export interface User {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const storedUser = JSON.parse(localStorage.getItem('user') || 'null') as User | null;
const storedToken = localStorage.getItem('token');

const persistAuth = (user: User | null, token: string | null) => {
  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return;
  }

  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  accessToken: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async (
    dto: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(loginStart());

    try {
      const response = await authApi.login(dto);
      const user: User = {
        id: '0',
        fullName: response.fullName,
        name: response.fullName,
        email: response.email,
        role: response.role,
        permissions: response.permissions ?? [],
      };

      dispatch(loginSuccess({ user, token: response.accessToken }));
      return { user, token: response.accessToken };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      dispatch(loginFailure(message));
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logoutThunk', async (_, { dispatch }) => {
  try {
    await authApi.logout();
  } catch {
    // Clear client session even if server-side logout fails.
  } finally {
    dispatch(logout());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      persistAuth(action.payload.user, action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string | undefined>) => {
      state.loading = false;
      state.error = action.payload ?? 'Đăng nhập thất bại';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      persistAuth(null, null);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      persistAuth(null, null);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      persistAuth(state.user, action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          fullName: action.payload.fullName ?? action.payload.name ?? state.user.fullName,
          name: action.payload.name ?? action.payload.fullName ?? state.user.name,
        };
        persistAuth(state.user, state.token);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearAuth,
  setAccessToken,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
