import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { fetchBlog, saveBlog } from '../features/blog/blogSlice';

export default function EditorPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selected = useAppSelector(s => s.blog.selected);
  const user = useAppSelector(s => s.auth.user);
  const token = localStorage.getItem('token') || '';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { if (id) dispatch(fetchBlog(id)); }, [id, dispatch]);
  useEffect(() => { 
    if (selected && id) { 
      setTitle(selected.title); 
      setContent(selected.content);
      setTags(selected.tags?.join(', ') || '');
    } 
  }, [selected, id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await dispatch(saveBlog({ 
        _id: id, 
        title: title.trim(), 
        content: content.trim(),
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        token 
      }));
      
      if (saveBlog.fulfilled.match(res)) {
        setSuccess(id ? 'Post updated successfully!' : 'Post created successfully!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError('Failed to save post');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    navigate(-1);
  }

  if (!user) {
    return (
      <div className="editor">
        <div className="editor__error">
          <h2>Please log in to create or edit posts</h2>
          <button onClick={() => navigate('/login')} className="btn btn--primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor">
      <header className="editor__header">
        <button onClick={goBack} className="btn btn--ghost">
          ← Back
        </button>
        <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
        <div className="editor__actions">
          <button 
            type="button" 
            onClick={() => navigate('/feed')} 
            className="btn btn--secondary"
          >
            Cancel
          </button>
        </div>
      </header>

      <div className="editor__content">
        <form onSubmit={onSubmit} className="editor__form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              id="title"
              type="text"
              placeholder="Enter a compelling title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="editor__title-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optional)</label>
            <input
              id="tags"
              type="text"
              placeholder="tech, programming, tutorial (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="editor__tags-input"
            />
            <small>Separate multiple tags with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              placeholder="Write your post content here... Use line breaks to separate paragraphs."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="editor__content-textarea"
              rows={20}
              required
            />
            <div className="editor__char-count">
              {content.length} characters
            </div>
          </div>

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {success && (
            <div className="message success">
              {success}
            </div>
          )}

          <div className="editor__form-actions">
            <button 
              type="submit" 
              disabled={loading || !title.trim() || !content.trim()}
              className="btn btn--primary btn--large"
            >
              {loading ? 'Saving...' : (id ? 'Update Post' : 'Publish Post')}
            </button>
          </div>
        </form>

        <div className="editor__preview">
          <h3>Preview</h3>
          <div className="preview-card">
            <h2 className="preview-title">{title || 'Your title will appear here'}</h2>
            <div className="preview-meta">
              <span>By {user.name}</span>
            </div>
            {tags && (
              <div className="preview-tags">
                {tags.split(',').map((tag, i) => (
                  <span key={i} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


