import { Request, Response } from 'express';
import { prisma } from '../index';

export const userController = {
  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  },

  // Update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { name, avatarUrl } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          avatarUrl: avatarUrl || undefined,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          lastLoginAt: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  },

  // Delete user account
  deleteAccount: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      await prisma.user.delete({
        where: { id: userId },
      });

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  },
};
