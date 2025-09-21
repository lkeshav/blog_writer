import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL as string;

interface LikeState {
  userLikes: Record<string, boolean>; // blogId -> liked
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LikeState = {
  userLikes: {},
  status: 'idle'
};

export const toggleLike = createAsyncThunk('like/toggle', async (payload: { blogId: string; token: string }) => {
  const { blogId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.post(`${API}/likes/${blogId}`, {}, { headers });
  return { blogId, liked: data.liked, likes: data.likes };
});

export const checkUserLike = createAsyncThunk('like/check', async (payload: { blogId: string; token: string }) => {
  const { blogId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(`${API}/likes/${blogId}/check`, { headers });
  return { blogId, liked: data.liked };
});

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.userLikes[action.payload.blogId] = action.payload.liked;
      })
      .addCase(checkUserLike.fulfilled, (state, action) => {
        state.userLikes[action.payload.blogId] = action.payload.liked;
      });
  }
});

export default likeSlice.reducer;
