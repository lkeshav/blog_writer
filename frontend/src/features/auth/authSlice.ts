import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL as string;

interface AuthState {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  status: 'idle'
};

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const { data } = await axios.post(`${API}/auth/login`, payload);
  return data;
});

export const signup = createAsyncThunk('auth/signup', async (payload: { name: string; email: string; password: string }) => {
  const { data } = await axios.post(`${API}/auth/signup`, payload);
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', state.token!);
      })
      .addCase(login.rejected, (state) => { state.status = 'failed'; })
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', state.token!);
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


