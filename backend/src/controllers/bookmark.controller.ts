import { Response } from 'express';
import { Bookmark } from '../models/Bookmark.js';
import { Blog } from '../models/Blog.js';
import { AuthRequest } from '../middleware/auth.js';

export async function toggleBookmark(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const userId = req.userId;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if user already bookmarked this blog
    const existingBookmark = await Bookmark.findOne({ user: userId, blog: blogId });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.json({ bookmarked: false });
    } else {
      // Add bookmark
      await Bookmark.create({ user: userId, blog: blogId });
      res.json({ bookmarked: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Bookmark operation failed' });
  }
}

export async function getUserBookmarks(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('blog')
      .populate('blog.author', 'name')
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
}

export async function checkUserBookmark(req: AuthRequest, res: Response) {
  try {
    const { blogId } = req.params;
    const userId = req.userId;
    
    const bookmark = await Bookmark.findOne({ user: userId, blog: blogId });
    res.json({ bookmarked: !!bookmark });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check bookmark status' });
  }
}
