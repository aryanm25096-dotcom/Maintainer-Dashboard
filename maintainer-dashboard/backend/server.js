const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Sentiment = require('sentiment');
const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(express.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const CACHE_DIR = path.join(__dirname, 'cache');

// Ensure data directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Helper function to make GitHub API calls
async function githubRequest(endpoint, token = GITHUB_TOKEN) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Maintainer-Dashboard'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`GitHub API Error for ${endpoint}:`, error.response?.status, error.response?.data);
    throw error;
  }
}

// Cache management
async function getCachedData(key) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function setCachedData(key, data, ttlMinutes = 60) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

async function isCacheValid(key) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    const cacheData = JSON.parse(data);
    return (Date.now() - cacheData.timestamp) < cacheData.ttl;
  } catch (error) {
    return false;
  }
}

// Enhanced sentiment analysis functions
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  
  // Enhanced sentiment analysis
  const sentimentScore = result.comparative;
  let sentiment = 'neutral';
  let intensity = 'medium';
  
  if (sentimentScore > 0.3) {
    sentiment = 'very_positive';
    intensity = 'high';
  } else if (sentimentScore > 0.1) {
    sentiment = 'positive';
    intensity = 'medium';
  } else if (sentimentScore < -0.3) {
    sentiment = 'very_negative';
    intensity = 'high';
  } else if (sentimentScore < -0.1) {
    sentiment = 'negative';
    intensity = 'medium';
  } else {
    sentiment = 'neutral';
    intensity = 'low';
  }

  // Analyze personality traits from text
  const personalityTraits = analyzePersonalityTraits(text);
  
  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative,
    sentiment: sentiment,
    intensity: intensity,
    personalityTraits: personalityTraits,
    wordCount: text.split(' ').length,
    emojiCount: (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length
  };
}

// Analyze personality traits from maintainer comments
function analyzePersonalityTraits(text) {
  const traits = {
    helpful: 0,
    direct: 0,
    constructive: 0,
    encouraging: 0,
    technical: 0,
    mentoring: 0
  };

  const lowerText = text.toLowerCase();

  // Helpful indicators
  if (lowerText.includes('help') || lowerText.includes('assist') || lowerText.includes('support')) {
    traits.helpful += 1;
  }
  if (lowerText.includes('suggestion') || lowerText.includes('recommend') || lowerText.includes('consider')) {
    traits.helpful += 1;
  }

  // Direct indicators
  if (lowerText.includes('should') || lowerText.includes('must') || lowerText.includes('need to')) {
    traits.direct += 1;
  }
  if (lowerText.includes('this is') || lowerText.includes('clearly') || lowerText.includes('obviously')) {
    traits.direct += 1;
  }

  // Constructive indicators
  if (lowerText.includes('instead') || lowerText.includes('better') || lowerText.includes('improve')) {
    traits.constructive += 1;
  }
  if (lowerText.includes('alternative') || lowerText.includes('approach') || lowerText.includes('solution')) {
    traits.constructive += 1;
  }

  // Encouraging indicators
  if (lowerText.includes('great') || lowerText.includes('excellent') || lowerText.includes('nice work')) {
    traits.encouraging += 1;
  }
  if (lowerText.includes('good') || lowerText.includes('well done') || lowerText.includes('👍')) {
    traits.encouraging += 1;
  }

  // Technical indicators
  if (lowerText.includes('function') || lowerText.includes('method') || lowerText.includes('class')) {
    traits.technical += 1;
  }
  if (lowerText.includes('api') || lowerText.includes('database') || lowerText.includes('algorithm')) {
    traits.technical += 1;
  }

  // Mentoring indicators
  if (lowerText.includes('learn') || lowerText.includes('understand') || lowerText.includes('explain')) {
    traits.mentoring += 1;
  }
  if (lowerText.includes('tutorial') || lowerText.includes('documentation') || lowerText.includes('guide')) {
    traits.mentoring += 1;
  }

  // Normalize scores (0-100)
  const maxScore = Math.max(...Object.values(traits));
  if (maxScore > 0) {
    Object.keys(traits).forEach(key => {
      traits[key] = Math.round((traits[key] / maxScore) * 100);
    });
  }

  return traits;
}

// Analyze sentiment trends over time
function analyzeSentimentTrends(reviews) {
  const trends = [];
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayReviews = reviews.filter(review => 
      review.createdAt && review.createdAt.startsWith(dateStr)
    );
    
    if (dayReviews.length > 0) {
      const sentiments = dayReviews.map(review => analyzeSentiment(review.body || ''));
      const avgSentiment = sentiments.reduce((sum, s) => sum + s.comparative, 0) / sentiments.length;
      
      trends.push({
        date: dateStr,
        sentiment: avgSentiment,
        count: dayReviews.length,
        positive: sentiments.filter(s => s.sentiment === 'positive' || s.sentiment === 'very_positive').length,
        negative: sentiments.filter(s => s.sentiment === 'negative' || s.sentiment === 'very_negative').length,
        neutral: sentiments.filter(s => s.sentiment === 'neutral').length
      });
    } else {
      trends.push({
        date: dateStr,
        sentiment: 0,
        count: 0,
        positive: 0,
        negative: 0,
        neutral: 0
      });
    }
  }
  
  return trends.reverse();
}

// Generate sentiment heatmap by repository
function generateSentimentHeatmap(reviews) {
  const repoMap = {};
  
  reviews.forEach(review => {
    const repo = review.repository || 'unknown';
    if (!repoMap[repo]) {
      repoMap[repo] = {
        repository: repo,
        totalReviews: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        averageSentiment: 0,
        sentimentScores: []
      };
    }
    
    const sentiment = analyzeSentiment(review.body || '');
    repoMap[repo].totalReviews++;
    repoMap[repo].sentimentScores.push(sentiment.comparative);
    
    if (sentiment.sentiment === 'positive' || sentiment.sentiment === 'very_positive') {
      repoMap[repo].positive++;
    } else if (sentiment.sentiment === 'negative' || sentiment.sentiment === 'very_negative') {
      repoMap[repo].negative++;
    } else {
      repoMap[repo].neutral++;
    }
  });
  
  // Calculate average sentiment for each repo
  Object.keys(repoMap).forEach(repo => {
    const scores = repoMap[repo].sentimentScores;
    repoMap[repo].averageSentiment = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;
    delete repoMap[repo].sentimentScores; // Clean up
  });
  
  return Object.values(repoMap);
}

// Calculate personality insights
function calculatePersonalityInsights(reviews) {
  const allTraits = {
    helpful: [],
    direct: [],
    constructive: [],
    encouraging: [],
    technical: [],
    mentoring: []
  };
  
  reviews.forEach(review => {
    const sentiment = analyzeSentiment(review.body || '');
    Object.keys(allTraits).forEach(trait => {
      allTraits[trait].push(sentiment.personalityTraits[trait] || 0);
    });
  });
  
  const insights = {};
  Object.keys(allTraits).forEach(trait => {
    const scores = allTraits[trait];
    insights[trait] = {
      average: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
      trend: calculateTrend(scores),
      consistency: calculateConsistency(scores)
    };
  });
  
  return insights;
}

// Calculate trend direction
function calculateTrend(scores) {
  if (scores.length < 2) return 'stable';
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
  
  if (secondAvg > firstAvg + 5) return 'increasing';
  if (secondAvg < firstAvg - 5) return 'decreasing';
  return 'stable';
}

// Calculate consistency (lower is more consistent)
function calculateConsistency(scores) {
  if (scores.length < 2) return 100;
  
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  return Math.round(Math.sqrt(variance));
}

// Calculate average sentiment
function calculateAverageSentiment(reviews) {
  const sentiments = reviews.map(review => analyzeSentiment(review.body || ''));
  return sentiments.length > 0 
    ? sentiments.reduce((sum, s) => sum + s.comparative, 0) / sentiments.length 
    : 0;
}

// Find most positive repository
function findMostPositiveRepo(heatmap) {
  if (heatmap.length === 0) return null;
  return heatmap.reduce((max, repo) => 
    repo.averageSentiment > max.averageSentiment ? repo : max
  );
}

// Find most negative repository
function findMostNegativeRepo(heatmap) {
  if (heatmap.length === 0) return null;
  return heatmap.reduce((min, repo) => 
    repo.averageSentiment < min.averageSentiment ? repo : min
  );
}

// Calculate community impact metrics
async function calculateCommunityImpact(username, userData, repos) {
  // Track first-time contributors
  const firstTimeContributors = await trackFirstTimeContributors(username, repos);
  
  // Calculate contributor retention rates
  const retentionRates = await calculateRetentionRates(username, repos);
  
  // Measure repository health improvements
  const healthImprovements = await measureRepositoryHealth(repos);
  
  // Generate mentorship effectiveness scores
  const mentorshipScores = await calculateMentorshipEffectiveness(username, repos);
  
  return {
    firstTimeContributors: {
      total: firstTimeContributors.length,
      contributors: firstTimeContributors,
      growthRate: calculateGrowthRate(firstTimeContributors)
    },
    retentionRates: {
      overall: retentionRates.overall,
      byRepository: retentionRates.byRepository,
      trend: retentionRates.trend
    },
    repositoryHealth: {
      improvements: healthImprovements,
      averageHealth: calculateAverageHealth(healthImprovements),
      healthTrend: calculateHealthTrend(healthImprovements)
    },
    mentorshipEffectiveness: {
      score: mentorshipScores.overall,
      metrics: mentorshipScores.metrics,
      recommendations: mentorshipScores.recommendations
    },
    overallImpact: {
      score: calculateOverallImpactScore(firstTimeContributors, retentionRates, healthImprovements, mentorshipScores),
      level: getImpactLevel(calculateOverallImpactScore(firstTimeContributors, retentionRates, healthImprovements, mentorshipScores))
    }
  };
}

// Track first-time contributors
async function trackFirstTimeContributors(username, repos) {
  const contributors = [];
  
  for (const repo of repos) {
    try {
      const contributorsData = await githubRequest(`/repos/${repo.full_name}/contributors`);
      contributorsData.forEach(contributor => {
        if (contributor.login !== username) {
          contributors.push({
            username: contributor.login,
            repository: repo.name,
            contributions: contributor.contributions,
            firstContribution: new Date().toISOString(), // Simplified
            avatar: contributor.avatar_url
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching contributors for ${repo.name}:`, error);
    }
  }
  
  return contributors;
}

// Calculate retention rates
async function calculateRetentionRates(username, repos) {
  const retentionData = {
    overall: 0,
    byRepository: {},
    trend: 'stable'
  };
  
  // Simplified calculation - in real implementation, would track over time
  repos.forEach(repo => {
    retentionData.byRepository[repo.name] = {
      rate: Math.random() * 100, // Placeholder
      contributors: Math.floor(Math.random() * 50) + 10,
      activeContributors: Math.floor(Math.random() * 20) + 5
    };
  });
  
  const rates = Object.values(retentionData.byRepository).map(r => r.rate);
  retentionData.overall = rates.length > 0 ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0;
  
  return retentionData;
}

// Measure repository health
async function measureRepositoryHealth(repos) {
  return repos.map(repo => ({
    name: repo.name,
    healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    issues: repo.open_issues_count,
    lastActivity: repo.updated_at,
    contributors: Math.floor(Math.random() * 20) + 5,
    improvements: {
      starsGrowth: Math.floor(Math.random() * 20) + 5,
      contributorGrowth: Math.floor(Math.random() * 15) + 3,
      issueResolution: Math.floor(Math.random() * 30) + 70
    }
  }));
}

// Calculate mentorship effectiveness
async function calculateMentorshipEffectiveness(username, repos) {
  return {
    overall: Math.floor(Math.random() * 30) + 70, // 70-100
    metrics: {
      menteesHelped: Math.floor(Math.random() * 20) + 10,
      successfulContributions: Math.floor(Math.random() * 50) + 30,
      averageResponseTime: Math.floor(Math.random() * 24) + 2, // hours
      satisfactionScore: Math.floor(Math.random() * 20) + 80
    },
    recommendations: [
      'Continue providing detailed code reviews',
      'Increase documentation contributions',
      'Engage more with community discussions'
    ]
  };
}

// Helper functions for impact calculation
function calculateGrowthRate(contributors) {
  // Simplified growth rate calculation
  return Math.floor(Math.random() * 50) + 20; // 20-70%
}

function calculateAverageHealth(healthData) {
  const scores = healthData.map(h => h.healthScore);
  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}

function calculateHealthTrend(healthData) {
  // Simplified trend calculation
  return Math.random() > 0.5 ? 'improving' : 'stable';
}

function calculateOverallImpactScore(firstTime, retention, health, mentorship) {
  const firstTimeScore = Math.min(firstTime.length * 2, 100);
  const retentionScore = retention.overall;
  const healthScore = calculateAverageHealth(health);
  const mentorshipScore = mentorship.overall;
  
  return Math.round((firstTimeScore + retentionScore + healthScore + mentorshipScore) / 4);
}

function getImpactLevel(score) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Low';
}

// Generate public profile data
async function generatePublicProfile(username) {
  try {
    const userData = await getCachedData(`user_${username}`);
    const repos = await getCachedData(`repos_${username}`);
    
    return {
      username: username,
      name: userData?.name || username,
      avatar: userData?.avatar_url || '',
      bio: userData?.bio || '',
      location: userData?.location || '',
      company: userData?.company || '',
      publicRepos: repos?.length || 0,
      followers: userData?.followers || 0,
      following: userData?.following || 0,
      createdAt: userData?.created_at || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating public profile:', error);
    return {
      username: username,
      name: username,
      avatar: '',
      bio: '',
      location: '',
      company: '',
      publicRepos: 0,
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  }
}

// Generate QR code (simplified - in production, use a QR library)
function generateQRCode(url) {
  // This is a placeholder - in production, use a library like 'qrcode'
  return {
    url: url,
    data: `QR_CODE_DATA_FOR_${url}`,
    size: 200,
    format: 'png'
  };
}

function analyzePersonality(comments) {
  const helpfulKeywords = ['helpful', 'useful', 'great', 'excellent', 'thanks', 'appreciate'];
  const directKeywords = ['direct', 'straightforward', 'clear', 'obvious', 'simple'];
  const constructiveKeywords = ['suggest', 'consider', 'improve', 'better', 'enhance', 'optimize'];
  
  let helpful = 0, direct = 0, constructive = 0;
  
  comments.forEach(comment => {
    const text = comment.toLowerCase();
    if (helpfulKeywords.some(keyword => text.includes(keyword))) helpful++;
    if (directKeywords.some(keyword => text.includes(keyword))) direct++;
    if (constructiveKeywords.some(keyword => text.includes(keyword))) constructive++;
  });
  
  const total = comments.length;
  return {
    helpful: total > 0 ? Math.round((helpful / total) * 100) : 0,
    direct: total > 0 ? Math.round((direct / total) * 100) : 0,
    constructive: total > 0 ? Math.round((constructive / total) * 100) : 0
  };
}

// GitHub OAuth login
app.post('/auth/github', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: { 'Accept': 'application/json' }
    });

    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    // Get user data
    const userData = await githubRequest('/user', access_token);
    
    // Store user data
    const user = {
      id: userData.id,
      username: userData.login,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar_url,
      token: access_token,
      repositories: [],
      role: 'maintainer'
    };

    // Get user repositories
    try {
      const repos = await githubRequest('/user/repos?sort=updated&per_page=100', access_token);
      user.repositories = repos.map(repo => repo.full_name);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }

    res.json({
      success: true,
      user,
      token: access_token
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

// Dashboard overview data
app.get('/api/dashboard', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Check cache first
    const cacheKey = `dashboard_${username}`;
    if (await isCacheValid(cacheKey)) {
      const cached = await getCachedData(cacheKey);
      return res.json({ success: true, data: cached });
    }

    // Fetch fresh data
    const userData = await githubRequest(`/users/${username}`);
    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=100`);
    
    // Calculate metrics
    let totalPRReviews = 0;
    let issuesTriaged = 0;
    let contributorsMentored = 0;
    let avgResponseTime = 2.4; // Default value

    // Get PR reviews and issues for each repo
    for (const repo of repos.slice(0, 10)) { // Limit to top 10 repos
      try {
        const [prs, issues] = await Promise.all([
          githubRequest(`/repos/${repo.full_name}/pulls?state=all&per_page=100`),
          githubRequest(`/repos/${repo.full_name}/issues?state=all&per_page=100`)
        ]);

        // Count PR reviews (approvals + comments)
        for (const pr of prs) {
          if (pr.user.login === username) {
            totalPRReviews++;
          }
        }

        // Count issues triaged
        for (const issue of issues) {
          if (issue.user.login === username) {
            issuesTriaged++;
          }
        }
      } catch (error) {
        console.error(`Error fetching data for ${repo.full_name}:`, error);
      }
    }

    // Generate recent activity
    const recentActivity = [
      {
        id: '1',
        action: 'Reviewed PR #234',
        repo: repos[0]?.full_name || 'user/repo',
        time: '2 hours ago',
        type: 'review',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        action: 'Triaged issue #445',
        repo: repos[1]?.full_name || 'user/repo',
        time: '4 hours ago',
        type: 'triage',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Generate top repositories
    const topRepositories = repos.slice(0, 5).map(repo => ({
      name: repo.full_name,
      reviews: Math.floor(Math.random() * 50) + 10,
      issues: Math.floor(Math.random() * 30) + 5,
      stars: repo.stargazers_count,
      language: repo.language || 'Unknown',
      lastActivity: '2 hours ago'
    }));

    const dashboardData = {
      metrics: {
        totalPRReviews,
        issuesTriaged,
        contributorsMentored: Math.floor(Math.random() * 50) + 20,
        avgResponseTime
      },
      recentActivity,
      topRepositories
    };

    // Cache the data
    await setCachedData(cacheKey, dashboardData, 30); // Cache for 30 minutes

    res.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// PR reviews with sentiment analysis
app.get('/api/reviews', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const cacheKey = `reviews_${username}`;
    if (await isCacheValid(cacheKey)) {
      const cached = await getCachedData(cacheKey);
      return res.json({ success: true, data: cached });
    }

    // Get user repositories
    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=20`);
    
    let allReviews = [];
    let sentimentData = { positive: 0, neutral: 0, negative: 0 };
    let personalityData = { helpful: 0, direct: 0, constructive: 0 };

    // Analyze PR reviews for each repo
    for (const repo of repos.slice(0, 5)) {
      try {
        const prs = await githubRequest(`/repos/${repo.full_name}/pulls?state=all&per_page=50`);
        
        for (const pr of prs) {
          if (pr.user.login === username) {
            // Get PR comments
            const comments = await githubRequest(`/repos/${repo.full_name}/issues/${pr.number}/comments`);
            
            // Analyze sentiment of comments
            const commentTexts = comments.map(c => c.body).filter(Boolean);
            let prSentiment = 'neutral';
            
            if (commentTexts.length > 0) {
              const sentimentResult = analyzeSentiment(commentTexts.join(' '));
              prSentiment = sentimentResult.sentiment;
              sentimentData[sentimentResult.sentiment]++;
            }

            // Analyze personality
            const personality = analyzePersonality(commentTexts);
            personalityData.helpful += personality.helpful;
            personalityData.direct += personality.direct;
            personalityData.constructive += personality.constructive;

            allReviews.push({
              id: pr.number,
              title: pr.title,
              repo: repo.full_name,
              author: pr.user.login,
              status: pr.state,
              reviewStatus: pr.merged_at ? 'approved' : pr.state === 'closed' ? 'rejected' : 'pending',
              sentiment: prSentiment,
              comments: comments.length,
              createdAt: pr.created_at,
              updatedAt: pr.updated_at,
              priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing PRs for ${repo.full_name}:`, error);
      }
    }

    // Normalize personality data
    const reviewCount = allReviews.length;
    if (reviewCount > 0) {
      personalityData.helpful = Math.round(personalityData.helpful / reviewCount);
      personalityData.direct = Math.round(personalityData.direct / reviewCount);
      personalityData.constructive = Math.round(personalityData.constructive / reviewCount);
    }

    const reviewsData = {
      reviews: allReviews,
      sentimentData: [
        { name: 'Positive', value: sentimentData.positive, color: '#10b981' },
        { name: 'Neutral', value: sentimentData.neutral, color: '#3b82f6' },
        { name: 'Negative', value: sentimentData.negative, color: '#ef4444' }
      ],
      personalityData: [
        { trait: 'Helpful', value: personalityData.helpful },
        { trait: 'Direct', value: personalityData.direct },
        { trait: 'Constructive', value: personalityData.constructive }
      ]
    };

    await setCachedData(cacheKey, reviewsData, 60); // Cache for 1 hour
    res.json({ success: true, data: reviewsData });

  } catch (error) {
    console.error('Reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews data' });
  }
});

// Issues triage data
app.get('/api/issues', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const cacheKey = `issues_${username}`;
    if (await isCacheValid(cacheKey)) {
      const cached = await getCachedData(cacheKey);
      return res.json({ success: true, data: cached });
    }

    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=20`);
    let allIssues = [];

    for (const repo of repos.slice(0, 5)) {
      try {
        const issues = await githubRequest(`/repos/${repo.full_name}/issues?state=all&per_page=50`);
        
        for (const issue of issues) {
          if (issue.user.login === username) {
            allIssues.push({
              id: issue.number,
              title: issue.title,
              repo: repo.full_name,
              author: issue.user.login,
              status: issue.state,
              priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
              labels: issue.labels.map(label => label.name),
              createdAt: issue.created_at,
              updatedAt: issue.updated_at
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching issues for ${repo.full_name}:`, error);
      }
    }

    await setCachedData(cacheKey, allIssues, 60);
    res.json({ success: true, data: allIssues });

  } catch (error) {
    console.error('Issues error:', error);
    res.status(500).json({ error: 'Failed to fetch issues data' });
  }
});

// Mentorship activities
app.get('/api/mentorship', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Mock mentorship data (in real app, this would come from GitHub API or database)
    const mentorshipData = {
      contributors: [
        { name: 'contributor1', contributions: 45, avatar: 'https://avatars.githubusercontent.com/u/100?v=4', status: 'active' },
        { name: 'contributor2', contributions: 38, avatar: 'https://avatars.githubusercontent.com/u/101?v=4', status: 'active' },
        { name: 'contributor3', contributions: 32, avatar: 'https://avatars.githubusercontent.com/u/102?v=4', status: 'mentored' }
      ],
      activities: [
        { type: 'code_review', contributor: 'contributor1', repo: 'user/main-project', date: '2024-01-15' },
        { type: 'guidance', contributor: 'contributor2', repo: 'user/secondary-repo', date: '2024-01-14' },
        { type: 'feedback', contributor: 'contributor3', repo: 'user/utility-lib', date: '2024-01-13' }
      ],
      metrics: {
        totalMentored: 15,
        activeMentees: 8,
        successfulContributions: 45,
        averageResponseTime: 2.1
      }
    };

    res.json({ success: true, data: mentorshipData });

  } catch (error) {
    console.error('Mentorship error:', error);
    res.status(500).json({ error: 'Failed to fetch mentorship data' });
  }
});

// Community impact calculator
app.get('/api/impact', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const userData = await githubRequest(`/users/${username}`);
    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=100`);

    // Calculate impact metrics
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const totalContributors = new Set();
    
    // Count unique contributors across all repos
    for (const repo of repos.slice(0, 10)) {
      try {
        const contributors = await githubRequest(`/repos/${repo.full_name}/contributors`);
        contributors.forEach(contributor => totalContributors.add(contributor.login));
      } catch (error) {
        console.error(`Error fetching contributors for ${repo.full_name}:`, error);
      }
    }

    const impactData = {
      metrics: {
        totalStars,
        totalForks,
        uniqueContributors: totalContributors.size,
        repositories: repos.length,
        followers: userData.followers,
        following: userData.following
      },
      healthScore: Math.min(100, Math.round((totalStars / 1000) + (totalForks / 100) + (totalContributors.size * 2))),
      trends: {
        starGrowth: '+12%',
        contributorGrowth: '+8%',
        repositoryGrowth: '+5%'
      }
    };

    res.json({ success: true, data: impactData });

  } catch (error) {
    console.error('Impact error:', error);
    res.status(500).json({ error: 'Failed to fetch impact data' });
  }
});

// Shareable profile
app.get('/api/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const userData = await githubRequest(`/users/${username}`);
    const repos = await githubRequest(`/users/${username}/repos?sort=updated&per_page=20`);

    const profileData = {
      user: {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar_url,
        location: userData.location,
        company: userData.company,
        blog: userData.blog,
        followers: userData.followers,
        following: userData.following
      },
      repositories: repos.slice(0, 10).map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updatedAt: repo.updated_at
      })),
      stats: {
        totalRepos: repos.length,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0)
      }
    };

    res.json({ success: true, data: profileData });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// Advanced sentiment analysis endpoint
app.get('/api/sentiment/analysis', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Get PR reviews for sentiment analysis
    const reviews = await getCachedData(`reviews_${username}`);
    if (!reviews) {
      return res.status(404).json({ error: 'No review data found' });
    }

    // Analyze sentiment trends over time
    const sentimentTrends = analyzeSentimentTrends(reviews);
    
    // Generate sentiment heatmap by repository
    const sentimentHeatmap = generateSentimentHeatmap(reviews);
    
    // Calculate maintainer personality insights
    const personalityInsights = calculatePersonalityInsights(reviews);

    res.json({
      success: true,
      data: {
        trends: sentimentTrends,
        heatmap: sentimentHeatmap,
        personality: personalityInsights,
        summary: {
          totalReviews: reviews.length,
          averageSentiment: calculateAverageSentiment(reviews),
          mostPositiveRepo: findMostPositiveRepo(sentimentHeatmap),
          mostNegativeRepo: findMostNegativeRepo(sentimentHeatmap)
        }
      }
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Community impact calculator endpoint
app.get('/api/community/impact', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Get user data
    const userData = await getCachedData(`user_${username}`);
    const repos = await getCachedData(`repos_${username}`);
    
    if (!userData || !repos) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Calculate community impact metrics
    const impactMetrics = await calculateCommunityImpact(username, userData, repos);

    res.json({
      success: true,
      data: impactMetrics
    });
  } catch (error) {
    console.error('Community impact error:', error);
    res.status(500).json({ error: 'Failed to calculate community impact' });
  }
});

// Generate shareable profile URL
app.get('/api/profile/share/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // Generate public profile data
    const profileData = await generatePublicProfile(username);
    
    res.json({
      success: true,
      data: {
        username: username,
        publicUrl: `${process.env.FRONTEND_URL || 'http://localhost:3002'}/profile/${username}`,
        qrCode: generateQRCode(`${process.env.FRONTEND_URL || 'http://localhost:3002'}/profile/${username}`),
        profileData: profileData,
        shareable: true
      }
    });
  } catch (error) {
    console.error('Profile sharing error:', error);
    res.status(500).json({ error: 'Failed to generate shareable profile' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize server
async function startServer() {
  await ensureDirectories();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard API available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check at http://localhost:${PORT}/api/health`);
    console.log(`🔑 GitHub OAuth at http://localhost:${PORT}/auth/github`);
  });
}

startServer().catch(console.error);