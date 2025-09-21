import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { createComment, getComments, updateComment, deleteComment, Comment } from '../features/comment/commentSlice';

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const comments = useAppSelector(s => s.comment.comments[blogId] || []);
  const token = localStorage.getItem('token') || '';

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    dispatch(getComments(blogId));
  }, [blogId, dispatch]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !token) return;

    await dispatch(createComment({
      blogId,
      content: newComment.trim(),
      token
    }));
    setNewComment('');
  };

  const handleReply = async (parentCommentId: string, content: string) => {
    if (!user || !token) return;
    await dispatch(createComment({
      blogId,
      content,
      parentCommentId,
      token
    }));
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editContent.trim() || !token) return;
    await dispatch(updateComment({
      commentId: editingComment,
      content: editContent.trim(),
      token
    }));
    setEditingComment(null);
    setEditContent('');
  };

  const handleDelete = async (commentId: string) => {
    if (!token) return;
    await dispatch(deleteComment({ commentId, token }));
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = user && comment.author._id === user.id;

    return (
      <div className={`comment ${isReply ? 'comment--reply' : ''}`}>
        <div className="comment__header">
          <span className="comment__author">{comment.author.name}</span>
          <span className="comment__date">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          {isAuthor && (
            <div className="comment__actions">
              <button onClick={() => handleEdit(comment)} className="btn btn--small">
                Edit
              </button>
              <button onClick={() => handleDelete(comment._id)} className="btn btn--small btn--danger">
                Delete
              </button>
            </div>
          )}
        </div>
        
        {editingComment === comment._id ? (
          <div className="comment__edit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="comment__edit-input"
            />
            <div className="comment__edit-actions">
              <button onClick={handleSaveEdit} className="btn btn--small btn--primary">
                Save
              </button>
              <button onClick={() => setEditingComment(null)} className="btn btn--small btn--secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="comment__content">{comment.content}</div>
        )}

        {!isReply && (
          <ReplyForm parentCommentId={comment._id} onSubmit={handleReply} />
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment__replies">
            {comment.replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-input"
            rows={3}
          />
          <button type="submit" className="btn btn--primary">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="comment-login-prompt">
          Please log in to leave a comment.
        </p>
      )}

      <div className="comments-list">
        {comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

interface ReplyFormProps {
  parentCommentId: string;
  onSubmit: (parentCommentId: string, content: string) => void;
}

function ReplyForm({ parentCommentId, onSubmit }: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onSubmit(parentCommentId, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  if (!showReplyForm) {
    return (
      <button 
        onClick={() => setShowReplyForm(true)}
        className="btn btn--small btn--ghost"
      >
        Reply
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Write a reply..."
        className="reply-input"
        rows={2}
      />
      <div className="reply-actions">
        <button type="submit" className="btn btn--small btn--primary">
          Reply
        </button>
        <button 
          type="button" 
          onClick={() => setShowReplyForm(false)}
          className="btn btn--small btn--secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
