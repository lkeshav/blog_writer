import { Response } from 'express';
import { Like } from '../models/Like.js';
import { Blog } from '../models/Blog.js';
import { AuthRequest } from '../middleware/auth.js';

export async function toggleLike(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if user already liked this blog
    const existingLike = await Like.findOne({ user: userId, blog: blogId });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      blog.likes = Math.max(0, (blog.likes || 0) - 1);
      await blog.save();
      res.json({ liked: false, likes: blog.likes });
    } else {
      // Like
      await Like.create({ user: userId, blog: blogId });
      blog.likes = (blog.likes || 0) + 1;
      await blog.save();
      res.json({ liked: true, likes: blog.likes });
    }
  } catch (err) {
    res.status(500).json({ message: 'Like operation failed' });
  }
}

export async function getLikes(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const likes = await Like.find({ blog: blogId }).populate('user', 'name');
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch likes' });
  }
}

export async function checkUserLike(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const userId = req.userId;
    
    const like = await Like.findOne({ user: userId, blog: blogId });
    res.json({ liked: !!like });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check like status' });
  }
}
