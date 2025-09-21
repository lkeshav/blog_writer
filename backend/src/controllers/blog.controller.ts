import { Response } from 'express';
import { Blog } from '../models/Blog.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createBlog(req: AuthRequest, res: Response) {
  try {
    const { title, content, tags, coverImageUrl } = req.body;
    const blog = await Blog.create({ title, content, tags, coverImageUrl, author: req.userId });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Create failed' });
  }
}

export async function getBlogs(_req: AuthRequest, res: Response) {
  try {
    const blogs = await Blog.find().populate('author', 'name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
}

export async function getBlogById(req: AuthRequest, res: Response) {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
}

export async function updateBlog(req: AuthRequest, res: Response) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Not found' });
    if (blog.author.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    const { title, content, tags, coverImageUrl } = req.body;
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.tags = tags ?? blog.tags;
    blog.coverImageUrl = coverImageUrl ?? blog.coverImageUrl;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
}

export async function deleteBlog(req: AuthRequest, res: Response) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Not found' });
    if (blog.author.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    await blog.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
}

export async function searchBlogs(req: AuthRequest, res: Response) {
  try {
    const { q, tags } = req.query;
    let query: any = {};

    if (q) {
      query.$or = [
        { title: { $regex: q as string, $options: 'i' } },
        { content: { $regex: q as string, $options: 'i' } }
      ];
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const blogs = await Blog.find(query).populate('author', 'name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
}


