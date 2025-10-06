import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const ANALYTICS_FILE = join(__dirname, '../data/analytics.json');

// Initialize analytics data if it doesn't exist
const initializeAnalytics = () => {
  const defaultData = {
    prReviewTrends: [
      { date: '2024-01-01', reviews: 45, approvals: 38, rejections: 7 },
      { date: '2024-01-02', reviews: 52, approvals: 44, rejections: 8 },
      { date: '2024-01-03', reviews: 38, approvals: 32, rejections: 6 },
      { date: '2024-01-04', reviews: 61, approvals: 51, rejections: 10 },
      { date: '2024-01-05', reviews: 47, approvals: 40, rejections: 7 },
      { date: '2024-01-06', reviews: 55, approvals: 46, rejections: 9 },
      { date: '2024-01-07', reviews: 43, approvals: 37, rejections: 6 }
    ],
    issueResolutionTrends: [
      { date: '2024-01-01', opened: 12, closed: 8, triaged: 10 },
      { date: '2024-01-02', opened: 15, closed: 12, triaged: 13 },
      { date: '2024-01-03', opened: 8, closed: 11, triaged: 9 },
      { date: '2024-01-04', opened: 18, closed: 14, triaged: 16 },
      { date: '2024-01-05', opened: 11, closed: 9, triaged: 10 },
      { date: '2024-01-06', opened: 14, closed: 16, triaged: 13 },
      { date: '2024-01-07', opened: 9, closed: 7, triaged: 8 }
    ],
    responseTimeMetrics: {
      average: 2.4,
      median: 1.8,
      p95: 6.2,
      p99: 12.5,
      trend: 'decreasing'
    },
    contributorMetrics: {
      activeContributors: 25,
      newContributors: 3,
      returningContributors: 22,
      topContributors: [
        { name: 'contributor1', contributions: 45, avatar: 'https://avatars.githubusercontent.com/u/100?v=4' },
        { name: 'contributor2', contributions: 38, avatar: 'https://avatars.githubusercontent.com/u/101?v=4' },
        { name: 'contributor3', contributions: 32, avatar: 'https://avatars.githubusercontent.com/u/102?v=4' },
        { name: 'contributor4', contributions: 28, avatar: 'https://avatars.githubusercontent.com/u/103?v=4' },
        { name: 'contributor5', contributions: 24, avatar: 'https://avatars.githubusercontent.com/u/104?v=4' }
      ]
    },
    repositoryHealth: [
      {
        name: 'user/main-project',
        healthScore: 95,
        metrics: {
          prVelocity: 4.2,
          issueResolution: 3.8,
          contributorGrowth: 12,
          codeQuality: 92
        }
      },
      {
        name: 'user/secondary-repo',
        healthScore: 87,
        metrics: {
          prVelocity: 3.1,
          issueResolution: 4.2,
          contributorGrowth: 8,
          codeQuality: 88
        }
      },
      {
        name: 'user/utility-lib',
        healthScore: 91,
        metrics: {
          prVelocity: 2.8,
          issueResolution: 2.9,
          contributorGrowth: 15,
          codeQuality: 94
        }
      }
    ],
    sentimentAnalysis: {
      overall: 0.75,
      trends: [
        { date: '2024-01-01', sentiment: 0.72 },
        { date: '2024-01-02', sentiment: 0.78 },
        { date: '2024-01-03', sentiment: 0.71 },
        { date: '2024-01-04', sentiment: 0.79 },
        { date: '2024-01-05', sentiment: 0.76 },
        { date: '2024-01-06', sentiment: 0.74 },
        { date: '2024-01-07', sentiment: 0.75 }
      ],
      sources: {
        prComments: 0.78,
        issueComments: 0.72,
        commitMessages: 0.80,
        discussions: 0.74
      }
    }
  };

  try {
    readFileSync(ANALYTICS_FILE, 'utf8');
  } catch (error) {
    writeFileSync(ANALYTICS_FILE, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize analytics data on startup
initializeAnalytics();

// Get PR review trends
router.get('/pr-trends', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    const { period = '7d' } = req.query;
    
    let trends = data.prReviewTrends;
    
    // Filter by period if needed
    if (period === '30d') {
      // In production, this would filter the last 30 days
      trends = data.prReviewTrends.slice(-30);
    }
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load PR trends'
    });
  }
});

// Get issue resolution trends
router.get('/issue-trends', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    const { period = '7d' } = req.query;
    
    let trends = data.issueResolutionTrends;
    
    if (period === '30d') {
      trends = data.issueResolutionTrends.slice(-30);
    }
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load issue trends'
    });
  }
});

// Get response time metrics
router.get('/response-times', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    
    res.json({
      success: true,
      data: data.responseTimeMetrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load response time metrics'
    });
  }
});

// Get contributor metrics
router.get('/contributors', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    
    res.json({
      success: true,
      data: data.contributorMetrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load contributor metrics'
    });
  }
});

// Get repository health scores
router.get('/repository-health', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    
    res.json({
      success: true,
      data: data.repositoryHealth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load repository health data'
    });
  }
});

// Get sentiment analysis
router.get('/sentiment', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    
    res.json({
      success: true,
      data: data.sentimentAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load sentiment analysis'
    });
  }
});

// Get comprehensive analytics dashboard
router.get('/dashboard', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(ANALYTICS_FILE, 'utf8'));
    
    res.json({
      success: true,
      data: {
        prTrends: data.prReviewTrends.slice(-7),
        issueTrends: data.issueResolutionTrends.slice(-7),
        responseTimes: data.responseTimeMetrics,
        contributors: data.contributorMetrics,
        repositoryHealth: data.repositoryHealth,
        sentiment: data.sentimentAnalysis
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load analytics dashboard'
    });
  }
});

export default router;