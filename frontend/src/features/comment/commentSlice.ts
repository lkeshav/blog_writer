import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL as string;

export interface Comment {
  _id: string;
  content: string;
  author: { _id: string; name: string };
  blog: string;
  parentComment?: string;
  likes?: number;
  createdAt: string;
  replies?: Comment[];
}

interface CommentState {
  comments: Record<string, Comment[]>; // blogId -> comments
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CommentState = {
  comments: {},
  status: 'idle'
};

export const createComment = createAsyncThunk('comment/create', async (payload: { blogId: string; content: string; parentCommentId?: string; token: string }) => {
  const { blogId, content, parentCommentId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.post(`${API}/comments/${blogId}`, { content, parentCommentId }, { headers });
  return { blogId, comment: data };
});

export const getComments = createAsyncThunk('comment/getAll', async (blogId: string) => {
  const { data } = await axios.get(`${API}/comments/${blogId}`);
  return { blogId, comments: data };
});

export const updateComment = createAsyncThunk('comment/update', async (payload: { commentId: string; content: string; token: string }) => {
  const { commentId, content, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  const { data } = await axios.put(`${API}/comments/${commentId}`, { content }, { headers });
  return data;
});

export const deleteComment = createAsyncThunk('comment/delete', async (payload: { commentId: string; token: string }) => {
  const { commentId, token } = payload;
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${API}/comments/${commentId}`, { headers });
  return commentId;
});

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        const { blogId, comment } = action.payload;
        if (!state.comments[blogId]) {
          state.comments[blogId] = [];
        }
        if (comment.parentComment) {
          // Find parent comment and add reply
          const parent = state.comments[blogId].find(c => c._id === comment.parentComment);
          if (parent) {
            if (!parent.replies) parent.replies = [];
            parent.replies.push(comment);
          }
        } else {
          state.comments[blogId].unshift(comment);
        }
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { blogId, comments } = action.payload;
        state.comments[blogId] = comments;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        // Update comment in all blog comment lists
        Object.keys(state.comments).forEach(blogId => {
          const commentIndex = state.comments[blogId].findIndex(c => c._id === updatedComment._id);
          if (commentIndex !== -1) {
            state.comments[blogId][commentIndex] = updatedComment;
          } else {
            // Check in replies
            state.comments[blogId].forEach(comment => {
              if (comment.replies) {
                const replyIndex = comment.replies.findIndex(r => r._id === updatedComment._id);
                if (replyIndex !== -1) {
                  comment.replies[replyIndex] = updatedComment;
                }
              }
            });
          }
        });
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        // Remove comment from all blog comment lists
        Object.keys(state.comments).forEach(blogId => {
          state.comments[blogId] = state.comments[blogId].filter(c => c._id !== commentId);
          // Also remove from replies
          state.comments[blogId].forEach(comment => {
            if (comment.replies) {
              comment.replies = comment.replies.filter(r => r._id !== commentId);
            }
          });
        });
      });
  }
});

export default commentSlice.reducer;
