import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { toggleLike, getLikes, checkUserLike } from '../controllers/like.controller.js';

const router = Router();

router.post('/:blogId', requireAuth, toggleLike);
router.get('/:blogId', getLikes);
router.get('/:blogId/check', requireAuth, checkUserLike);

export default router;
