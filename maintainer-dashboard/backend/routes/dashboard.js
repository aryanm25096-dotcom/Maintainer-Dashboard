import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const DATA_FILE = join(__dirname, '../data/dashboard.json');

// Initialize dashboard data if it doesn't exist
const initializeData = () => {
  const defaultData = {
    metrics: {
      totalPRReviews: 1234,
      issuesTriaged: 567,
      contributorsMentored: 89,
      avgResponseTime: 2.4
    },
    recentActivity: [
      {
        id: '1',
        action: 'Reviewed PR #234',
        repo: 'user/repo-name',
        time: '2 hours ago',
        type: 'review',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        action: 'Triaged issue #445',
        repo: 'user/another-repo',
        time: '4 hours ago',
        type: 'triage',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        action: 'Mentored contributor @newdev',
        repo: 'user/repo-name',
        time: '1 day ago',
        type: 'mentor',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        action: 'Reviewed PR #230',
        repo: 'user/repo-name',
        time: '2 days ago',
        type: 'review',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    topRepositories: [
      {
        name: 'user/main-project',
        reviews: 45,
        issues: 23,
        stars: '12.3k',
        language: 'TypeScript',
        lastActivity: '2 hours ago'
      },
      {
        name: 'user/secondary-repo',
        reviews: 32,
        issues: 18,
        stars: '8.1k',
        language: 'JavaScript',
        lastActivity: '5 hours ago'
      },
      {
        name: 'user/utility-lib',
        reviews: 28,
        issues: 12,
        stars: '5.4k',
        language: 'Python',
        lastActivity: '1 day ago'
      },
      {
        name: 'user/docs-site',
        reviews: 15,
        issues: 8,
        stars: '2.1k',
        language: 'Markdown',
        lastActivity: '3 days ago'
      }
    ],
    pullRequests: [
      {
        id: '234',
        title: 'Fix authentication bug in login flow',
        repo: 'user/main-project',
        author: 'contributor1',
        status: 'open',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T14:20:00Z',
        reviewStatus: 'pending',
        priority: 'high'
      },
      {
        id: '235',
        title: 'Add new feature for user dashboard',
        repo: 'user/secondary-repo',
        author: 'contributor2',
        status: 'open',
        createdAt: '2024-01-14T16:45:00Z',
        updatedAt: '2024-01-15T09:15:00Z',
        reviewStatus: 'approved',
        priority: 'medium'
      }
    ],
    issues: [
      {
        id: '445',
        title: 'Bug: Memory leak in data processing',
        repo: 'user/another-repo',
        author: 'user123',
        status: 'open',
        priority: 'high',
        labels: ['bug', 'performance'],
        createdAt: '2024-01-14T12:00:00Z',
        updatedAt: '2024-01-15T08:30:00Z'
      },
      {
        id: '446',
        title: 'Feature request: Add dark mode support',
        repo: 'user/main-project',
        author: 'user456',
        status: 'open',
        priority: 'low',
        labels: ['enhancement', 'ui'],
        createdAt: '2024-01-13T15:20:00Z',
        updatedAt: '2024-01-14T11:45:00Z'
      }
    ]
  };

  try {
    readFileSync(DATA_FILE, 'utf8');
  } catch (error) {
    writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize data on startup
initializeData();

// Get dashboard overview
router.get('/overview', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    res.json({
      success: true,
      data: {
        metrics: data.metrics,
        recentActivity: data.recentActivity,
        topRepositories: data.topRepositories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data'
    });
  }
});

// Get pull requests
router.get('/pull-requests', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    const { status, repo, priority } = req.query;
    
    let pullRequests = data.pullRequests;
    
    if (status) {
      pullRequests = pullRequests.filter(pr => pr.status === status);
    }
    if (repo) {
      pullRequests = pullRequests.filter(pr => pr.repo === repo);
    }
    if (priority) {
      pullRequests = pullRequests.filter(pr => pr.priority === priority);
    }
    
    res.json({
      success: true,
      data: pullRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load pull requests'
    });
  }
});

// Get issues
router.get('/issues', (req, res) => {
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    const { status, repo, priority, labels } = req.query;
    
    let issues = data.issues;
    
    if (status) {
      issues = issues.filter(issue => issue.status === status);
    }
    if (repo) {
      issues = issues.filter(issue => issue.repo === repo);
    }
    if (priority) {
      issues = issues.filter(issue => issue.priority === priority);
    }
    if (labels) {
      const labelArray = labels.split(',');
      issues = issues.filter(issue => 
        labelArray.some(label => issue.labels.includes(label))
      );
    }
    
    res.json({
      success: true,
      data: issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load issues'
    });
  }
});

// Update pull request status
router.patch('/pull-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus, status } = req.body;
    
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    const prIndex = data.pullRequests.findIndex(pr => pr.id === id);
    
    if (prIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Pull request not found'
      });
    }
    
    if (reviewStatus) {
      data.pullRequests[prIndex].reviewStatus = reviewStatus;
    }
    if (status) {
      data.pullRequests[prIndex].status = status;
    }
    
    data.pullRequests[prIndex].updatedAt = new Date().toISOString();
    
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json({
      success: true,
      data: data.pullRequests[prIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update pull request'
    });
  }
});

// Update issue status
router.patch('/issues/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, labels } = req.body;
    
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    const issueIndex = data.issues.findIndex(issue => issue.id === id);
    
    if (issueIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }
    
    if (status) {
      data.issues[issueIndex].status = status;
    }
    if (priority) {
      data.issues[issueIndex].priority = priority;
    }
    if (labels) {
      data.issues[issueIndex].labels = labels;
    }
    
    data.issues[issueIndex].updatedAt = new Date().toISOString();
    
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json({
      success: true,
      data: data.issues[issueIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update issue'
    });
  }
});

export default router;