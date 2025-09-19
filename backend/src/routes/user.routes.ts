import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);

export default router;


