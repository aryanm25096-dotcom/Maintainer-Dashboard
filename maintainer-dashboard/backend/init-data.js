const fs = require('fs').promises;
const path = require('path');

// Initialize sample data files
async function initializeData() {
  const dataDir = path.join(__dirname, 'data');
  
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // Sample dashboard data
    const dashboardData = {
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
          repo: 'user/main-project',
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
        }
      ]
    };

    // Sample PR reviews data
    const reviewsData = {
      reviews: [
        {
          id: '234',
          title: 'Fix authentication bug in login flow',
          repo: 'user/main-project',
          author: 'contributor1',
          status: 'open',
          reviewStatus: 'pending',
          sentiment: 'positive',
          comments: 5,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          priority: 'high'
        },
        {
          id: '235',
          title: 'Add new feature for user dashboard',
          repo: 'user/secondary-repo',
          author: 'contributor2',
          status: 'open',
          reviewStatus: 'approved',
          sentiment: 'neutral',
          comments: 3,
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-15T09:15:00Z',
          priority: 'medium'
        }
      ],
      sentimentData: [
        { name: 'Positive', value: 654, color: '#10b981' },
        { name: 'Neutral', value: 423, color: '#3b82f6' },
        { name: 'Negative', value: 157, color: '#ef4444' }
      ],
      personalityData: [
        { trait: 'Helpful', value: 85 },
        { trait: 'Direct', value: 92 },
        { trait: 'Constructive', value: 78 }
      ]
    };

    // Sample issues data
    const issuesData = [
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
    ];

    // Write sample data files
    await fs.writeFile(
      path.join(dataDir, 'dashboard.json'),
      JSON.stringify(dashboardData, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'reviews.json'),
      JSON.stringify(reviewsData, null, 2)
    );
    
    await fs.writeFile(
      path.join(dataDir, 'issues.json'),
      JSON.stringify(issuesData, null, 2)
    );

    console.log('✅ Sample data initialized successfully');
    console.log('📁 Data files created in:', dataDir);
    
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

// Run initialization
initializeData();