import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import blogReducer from '../features/blog/blogSlice';
import likeReducer from '../features/like/likeSlice';
import bookmarkReducer from '../features/bookmark/bookmarkSlice';
import commentReducer from '../features/comment/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    like: likeReducer,
    bookmark: bookmarkReducer,
    comment: commentReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


