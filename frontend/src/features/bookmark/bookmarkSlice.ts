import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL as string;

interface BookmarkState {
  userBookmarks: Record<string, boolean>; // blogId -> bookmarked
  bookmarkedBlogs: any[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BookmarkState = {
  userBookmarks: {},
  bookmarkedBlogs: [],
  status: 'idle'
};

export const toggleBookmark = createAsyncThunk('bookmark/toggle', async (payload: { blogId: string; token: string }) => {
  const { blogId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.post(`${API}/bookmarks/${blogId}`, {}, { headers });
  return { blogId, ...data };
});

export const getUserBookmarks = createAsyncThunk('bookmark/getUser', async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(`${API}/bookmarks/user`, { headers });
  return data;
});

export const checkUserBookmark = createAsyncThunk('bookmark/check', async (payload: { blogId: string; token: string }) => {
  const { blogId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.get(`${API}/bookmarks/${blogId}/check`, { headers });
  return { blogId, bookmarked: data.bookmarked };
});

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.userBookmarks[action.payload.blogId] = action.payload.bookmarked;
      })
      .addCase(getUserBookmarks.fulfilled, (state, action) => {
        state.bookmarkedBlogs = action.payload;
      })
      .addCase(checkUserBookmark.fulfilled, (state, action) => {
        state.userBookmarks[action.payload.blogId] = action.payload.bookmarked;
      });
  }
});

export default bookmarkSlice.reducer;
