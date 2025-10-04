import express from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

// GitHub OAuth routes
router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

export default router;
