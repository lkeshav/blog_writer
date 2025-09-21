import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { deleteBlog, fetchBlog } from '../features/blog/blogSlice';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const post = useAppSelector(s => s.blog.selected);
  const user = useAppSelector(s => s.auth.user);
  const token = localStorage.getItem('token') || '';

  useEffect(() => { if (id) dispatch(fetchBlog(id)); }, [id, dispatch]);

  async function onDelete() {
    if (!id) return;
    await dispatch(deleteBlog({ id, token }));
    navigate('/feed');
  }

  function goBack() {
    navigate(-1);
  }

  if (!post) return <div className="post-loading">Loading...</div>;
  
  const isAuthor = user && typeof post.author === 'object' && post.author?._id === user.id;
  
  return (
    <div className="post">
      <header className="post__header">
        <button onClick={goBack} className="btn btn--ghost">
          ← Back
        </button>
        {isAuthor && (
          <div className="post__actions">
            <Link to={`/editor/${post._id}`} className="btn btn--secondary">
              Edit
            </Link>
            <button onClick={onDelete} className="btn btn--danger">
              Delete
            </button>
          </div>
        )}
      </header>
      
      <article className="post__content">
        <h1 className="post__title">{post.title}</h1>
        <div className="post__meta">
          <span className="author">
            By {typeof post.author === 'string' ? post.author : post.author?.name}
          </span>
          <span className="date">
            {new Date(post.createdAt || '').toLocaleDateString()}
          </span>
        </div>
        <div className="post__actions">
          <LikeButton blogId={post._id} likes={post.likes || 0} />
          <BookmarkButton blogId={post._id} />
        </div>
        <div className="post__body">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
      
      <CommentSection blogId={post._id} />
    </div>
  );
}


