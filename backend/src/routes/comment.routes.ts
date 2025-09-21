import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/comment.controller.js';

const router = Router();

router.post('/:blogId', requireAuth, createComment);
router.get('/:blogId', getComments);
router.put('/:commentId', requireAuth, updateComment);
router.delete('/:commentId', requireAuth, deleteComment);

export default router;
