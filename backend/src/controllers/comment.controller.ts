import { Response } from 'express';
import { Comment } from '../models/Comment.js';
import { Blog } from '../models/Blog.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createComment(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Create comment
    const comment = await Comment.create({
      content,
      author: userId,
      blog: blogId,
      parentComment: parentCommentId || undefined
    });

    // Update comment count on blog
    blog.comments = (blog.comments || 0) + 1;
    await blog.save();

    // Populate author info
    await comment.populate('author', 'name');

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment' });
  }
}

export async function getComments(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId, parentComment: { $exists: false } })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name')
          .sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );

    res.json(commentsWithReplies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
}

export async function updateComment(req: AuthRequest, res: Response) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment' });
  }
}

export async function deleteComment(req: AuthRequest, res: Response) {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Update comment count on blog
    const blog = await Blog.findById(comment.blog);
    if (blog) {
      blog.comments = Math.max(0, (blog.comments || 0) - 1);
      await blog.save();
    }

    // Delete comment and all its replies
    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentComment: commentId }
      ]
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
}
