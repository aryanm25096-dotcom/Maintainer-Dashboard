import express from 'express';
import { maintainerController } from '../controllers/maintainerController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard overview
router.get('/dashboard', maintainerController.getDashboard);

// PR Reviews with sentiment analysis
router.get('/pr-reviews', maintainerController.getPRReviews);

// Issue triage tracking
router.get('/issue-triage', maintainerController.getIssueTriage);

// Mentorship activities
router.get('/mentorship', maintainerController.getMentorshipActivities);

// Community impact calculator
router.get('/community-impact', maintainerController.getCommunityImpact);

// Sync data from GitHub
router.post('/sync', maintainerController.syncFromGitHub);

// Shareable profile (public)
router.get('/profile/:username', maintainerController.getShareableProfile);

// Public profile (no auth required)
router.get('/public-profile/:username', maintainerController.getPublicProfile);

// Sentiment analysis routes
router.get('/sentiment-analysis', maintainerController.getSentimentAnalysis);
router.post('/analyze-comment', maintainerController.analyzeComment);
router.post('/batch-analyze', maintainerController.batchAnalyzeComments);
router.get('/sentiment-insights', maintainerController.getSentimentInsights);

// Impact analysis routes
router.get('/impact-analysis', maintainerController.getImpactAnalysis);
router.post('/store-impact-metrics', maintainerController.storeImpactMetrics);
router.post('/create-repository-snapshot', maintainerController.createRepositorySnapshot);

export default router;
