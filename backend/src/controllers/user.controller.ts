import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, bio, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, bio, avatarUrl } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
}


