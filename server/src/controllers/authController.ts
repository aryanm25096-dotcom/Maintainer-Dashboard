import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  // GitHub OAuth initiation
  githubAuth: async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard`,
        },
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ url: data.url });
    } catch (error) {
      console.error('GitHub auth error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  },

  // GitHub OAuth callback
  githubCallback: async (req: Request, res: Response) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: 'Authorization code not provided' });
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (data.user) {
        // Create or update user in database
        const user = await prisma.user.upsert({
          where: { email: data.user.email! },
          update: {
            name: data.user.user_metadata?.full_name || data.user.email,
            avatarUrl: data.user.user_metadata?.avatar_url,
            lastLoginAt: new Date(),
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.email!,
            avatarUrl: data.user.user_metadata?.avatar_url,
            lastLoginAt: new Date(),
          },
        });

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
          },
          token,
        });
      } else {
        res.status(400).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('GitHub callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  },

  // Logout
  logout: async (req: Request, res: Response) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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
      console.error('Get current user error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  },
};
