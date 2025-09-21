import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { toggleBookmark, getUserBookmarks, checkUserBookmark } from '../controllers/bookmark.controller.js';

const router = Router();

router.post('/:blogId', requireAuth, toggleBookmark);
router.get('/user', requireAuth, getUserBookmarks);
router.get('/:blogId/check', requireAuth, checkUserBookmark);

export default router;
