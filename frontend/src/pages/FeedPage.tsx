import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { fetchBlogs } from '../features/blog/blogSlice';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';

export default function FeedPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const blogs = useAppSelector(s => s.blog.items);
  const user = useAppSelector(s => s.auth.user);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  return (
    <div className="feed">
      <header className="feed__header">
        <h1>Blog Feed</h1>
        <div className="feed__header-right">
          <SearchBar />
          {user && (
            <button onClick={() => navigate('/editor')} className="btn btn--primary">
              ✍️ Write a Post
            </button>
          )}
        </div>
      </header>
      
      <div className="feed__content">
        {blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h3>No posts yet</h3>
            <p>Be the first to share your story!</p>
            {user && (
              <button onClick={() => navigate('/editor')} className="btn btn--primary">
                Create First Post
              </button>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {blogs.map(blog => (
              <article key={blog._id} className="post-card">
                <div className="post-card__image" />
                <div className="post-card__content">
                  <h3 className="post-card__title">
                    <Link to={`/post/${blog._id}`}>{blog.title}</Link>
                  </h3>
                  <p className="post-card__excerpt">
                    {blog.content.substring(0, 120)}...
                  </p>
                  <div className="post-card__meta">
                    <span className="author">
                      By {typeof blog.author === 'string' ? blog.author : blog.author?.name}
                    </span>
                    <span className="date">
                      {new Date(blog.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="post-card__actions">
                    <LikeButton blogId={blog._id} likes={blog.likes || 0} />
                    <BookmarkButton blogId={blog._id} />
                    <span className="comment-count">💬 {blog.comments || 0}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


