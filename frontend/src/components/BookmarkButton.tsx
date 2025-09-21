import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { toggleBookmark, checkUserBookmark } from '../features/bookmark/bookmarkSlice';

interface BookmarkButtonProps {
  blogId: string;
}

export default function BookmarkButton({ blogId }: BookmarkButtonProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const isBookmarked = useAppSelector(s => s.bookmark.userBookmarks[blogId]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (user && token) {
      dispatch(checkUserBookmark({ blogId, token }));
    }
  }, [blogId, user, token, dispatch]);

  const handleBookmark = async () => {
    if (!user || !token) return;
    await dispatch(toggleBookmark({ blogId, token }));
  };

  if (!user) {
    return null;
  }

  return (
    <button 
      onClick={handleBookmark}
      className={`bookmark-button ${isBookmarked ? 'bookmark-button--bookmarked' : ''}`}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <span className="bookmark-icon">
        {isBookmarked ? '🔖' : '📖'}
      </span>
    </button>
  );
}
