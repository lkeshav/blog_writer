import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, searchBlogs } from '../controllers/blog.controller.js';

const router = Router();

router.get('/', getBlogs);
router.get('/search', searchBlogs);
router.get('/:id', getBlogById);
router.post('/', requireAuth, createBlog);
router.put('/:id', requireAuth, updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;


