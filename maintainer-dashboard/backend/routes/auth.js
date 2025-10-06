import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const USERS_FILE = join(__dirname, '../data/users.json');

// Initialize users file if it doesn't exist
try {
  readFileSync(USERS_FILE, 'utf8');
} catch (error) {
  writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    username: 'maintainer',
    email: 'maintainer@example.com',
    name: 'John Maintainer',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    githubToken: process.env.GITHUB_TOKEN || 'mock-token',
    repositories: ['user/main-project', 'user/secondary-repo', 'user/utility-lib'],
    role: 'maintainer',
    createdAt: new Date().toISOString()
  }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username === 'maintainer' && password === 'password') {
    const user = mockUsers[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        repositories: user.repositories,
        role: user.role
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token === 'mock-jwt-token') {
    const user = mockUsers[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        repositories: user.repositories,
        role: user.role
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
});

export default router;