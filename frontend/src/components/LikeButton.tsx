import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { toggleLike, checkUserLike } from '../features/like/likeSlice';
import { updateBlogLikes } from '../features/blog/blogSlice';

interface LikeButtonProps {
  blogId: string;
  likes: number;
}

export default function LikeButton({ blogId, likes }: LikeButtonProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const isLiked = useAppSelector(s => s.like.userLikes[blogId]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (user && token) {
      dispatch(checkUserLike({ blogId, token }));
    }
  }, [blogId, user, token, dispatch]);

  const handleLike = async () => {
    if (!user || !token) return;
    const result = await dispatch(toggleLike({ blogId, token }));
    if (result.payload && 'likes' in result.payload) {
      dispatch(updateBlogLikes({ blogId, likes: result.payload.likes }));
    }
  };

  if (!user) {
    return (
      <div className="like-button">
        <span className="like-count">❤️ {likes}</span>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLike}
      className={`like-button ${isLiked ? 'like-button--liked' : ''}`}
    >
      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likes}</span>
    </button>
  );
}
