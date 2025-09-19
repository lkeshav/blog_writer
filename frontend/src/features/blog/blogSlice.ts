import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL as string;

export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string } | string;
  tags?: string[];
  coverImageUrl?: string;
  createdAt?: string;
}

interface BlogState {
  items: Blog[];
  selected: Blog | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BlogState = {
  items: [],
  selected: null,
  status: 'idle'
};

export const fetchBlogs = createAsyncThunk('blog/fetchAll', async () => {
  const { data } = await axios.get(`${API}/blogs`);
  return data as Blog[];
});

export const fetchBlog = createAsyncThunk('blog/fetchOne', async (id: string) => {
  const { data } = await axios.get(`${API}/blogs/${id}`);
  return data as Blog;
});

export const saveBlog = createAsyncThunk('blog/save', async (payload: Partial<Blog> & { token: string }) => {
  const { token, _id, ...rest } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  if (_id) {
    const { data } = await axios.put(`${API}/blogs/${_id}`, rest, { headers });
    return data as Blog;
  }
  const { data } = await axios.post(`${API}/blogs`, rest, { headers });
  return data as Blog;
});

export const deleteBlog = createAsyncThunk('blog/delete', async (payload: { id: string; token: string }) => {
  const { id, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${API}/blogs/${id}`, { headers });
  return id;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => { state.selected = action.payload; })
      .addCase(saveBlog.fulfilled, (state, action) => {
        const idx = state.items.findIndex(b => b._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload; else state.items.unshift(action.payload);
        state.selected = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b._id !== action.payload);
        if (state.selected?._id === action.payload) state.selected = null;
      });
  }
});

export default blogSlice.reducer;


