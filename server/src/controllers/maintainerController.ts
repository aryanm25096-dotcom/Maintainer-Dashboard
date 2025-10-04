import { Request, Response } from 'express';
import { prisma } from '../index';
import { GitHubService } from '../services/githubService';
import { SentimentService } from '../services/sentimentService';
import { SentimentAnalysisService } from '../services/sentimentAnalysis';
import { ImpactCalculatorService } from '../services/impactCalculator';

const sentimentAnalysis = new SentimentAnalysisService();
const impactCalculator = new ImpactCalculatorService();

export const maintainerController = {
  // Get maintainer dashboard overview
  getDashboard: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      
      // Get user with maintainer status
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          githubUsername: true,
          isMaintainer: true,
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isMaintainer) {
        return res.status(403).json({ error: 'User is not a maintainer' });
      }

      // Get recent activity metrics
      const [
        recentPRReviews,
        recentIssueTriage,
        recentMentorship,
        recentContributions,
        communityImpact
      ] = await Promise.all([
        prisma.pRReview.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        prisma.issueTriage.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.mentorshipActivity.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.contribution.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.communityImpact.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      const dashboard = {
        user: {
          id: user.id,
          name: user.name,
          githubUsername: user.githubUsername,
        },
        metrics: {
          prReviews: recentPRReviews,
          issueTriage: recentIssueTriage,
          mentorship: recentMentorship,
          contributions: recentContributions,
        },
        communityImpact: communityImpact || {
          maintainerScore: 0,
          communityScore: 0,
          leadershipScore: 0,
        },
        lastUpdated: new Date().toISOString(),
      };

      res.json(dashboard);
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({ error: 'Failed to get dashboard' });
    }
  },

  // Get PR reviews with sentiment analysis
  getPRReviews: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20, repository, sentiment } = req.query;

      const where: any = { userId };
      
      if (repository) {
        where.repository = {
          fullName: repository
        };
      }

      if (sentiment) {
        where.sentiment = sentiment;
      }

      const [reviews, total] = await Promise.all([
        prisma.pRReview.findMany({
          where,
          include: {
            repository: {
              select: {
                name: true,
                fullName: true,
                language: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.pRReview.count({ where })
      ]);

      // Calculate sentiment distribution
      const sentimentStats = await prisma.pRReview.groupBy({
        by: ['sentiment'],
        where: { userId },
        _count: { sentiment: true }
      });

      res.json({
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        },
        sentimentStats: sentimentStats.reduce((acc, stat) => {
          acc[stat.sentiment || 'UNKNOWN'] = stat._count.sentiment;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      console.error('Get PR reviews error:', error);
      res.status(500).json({ error: 'Failed to get PR reviews' });
    }
  },

  // Get issue triage activities
  getIssueTriage: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20, action, repository } = req.query;

      const where: any = { userId };
      
      if (action) {
        where.action = action;
      }

      if (repository) {
        where.issue = {
          repository: {
            fullName: repository
          }
        };
      }

      const [triage, total] = await Promise.all([
        prisma.issueTriage.findMany({
          where,
          include: {
            issue: {
              select: {
                number: true,
                title: true,
                state: true,
                url: true,
                repository: {
                  select: {
                    name: true,
                    fullName: true,
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.issueTriage.count({ where })
      ]);

      // Get action statistics
      const actionStats = await prisma.issueTriage.groupBy({
        by: ['action'],
        where: { userId },
        _count: { action: true }
      });

      res.json({
        triage,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        },
        actionStats: actionStats.reduce((acc, stat) => {
          acc[stat.action] = stat._count.action;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      console.error('Get issue triage error:', error);
      res.status(500).json({ error: 'Failed to get issue triage' });
    }
  },

  // Get mentorship activities
  getMentorshipActivities: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20, type, impact } = req.query;

      const where: any = { userId };
      
      if (type) {
        where.type = type;
      }

      if (impact) {
        where.impact = impact;
      }

      const [activities, total] = await Promise.all([
        prisma.mentorshipActivity.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.mentorshipActivity.count({ where })
      ]);

      // Get type and impact statistics
      const [typeStats, impactStats] = await Promise.all([
        prisma.mentorshipActivity.groupBy({
          by: ['type'],
          where: { userId },
          _count: { type: true }
        }),
        prisma.mentorshipActivity.groupBy({
          by: ['impact'],
          where: { userId },
          _count: { impact: true }
        })
      ]);

      res.json({
        activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        },
        typeStats: typeStats.reduce((acc, stat) => {
          acc[stat.type] = stat._count.type;
          return acc;
        }, {} as Record<string, number>),
        impactStats: impactStats.reduce((acc, stat) => {
          acc[stat.impact || 'UNKNOWN'] = stat._count.impact;
          return acc;
        }, {} as Record<string, number>)
      });
    } catch (error) {
      console.error('Get mentorship activities error:', error);
      res.status(500).json({ error: 'Failed to get mentorship activities' });
    }
  },

  // Get community impact metrics
  getCommunityImpact: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { period = 'MONTHLY' } = req.query;

      const impact = await prisma.communityImpact.findMany({
        where: {
          userId,
          period: period as string
        },
        orderBy: { startDate: 'desc' },
        take: 12 // Last 12 periods
      });

      // Calculate trends
      const trends = {
        maintainerScore: impact.map(i => i.maintainerScore),
        communityScore: impact.map(i => i.communityScore),
        leadershipScore: impact.map(i => i.leadershipScore),
      };

      // Calculate averages
      const averages = {
        maintainerScore: impact.reduce((sum, i) => sum + i.maintainerScore, 0) / impact.length || 0,
        communityScore: impact.reduce((sum, i) => sum + i.communityScore, 0) / impact.length || 0,
        leadershipScore: impact.reduce((sum, i) => sum + i.leadershipScore, 0) / impact.length || 0,
      };

      res.json({
        impact,
        trends,
        averages,
        period
      });
    } catch (error) {
      console.error('Get community impact error:', error);
      res.status(500).json({ error: 'Failed to get community impact' });
    }
  },

  // Sync data from GitHub
  syncFromGitHub: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { githubToken } = req.body;

      if (!githubToken) {
        return res.status(400).json({ error: 'GitHub token required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { githubUsername: true, isMaintainer: true }
      });

      if (!user || !user.isMaintainer) {
        return res.status(403).json({ error: 'User is not a maintainer' });
      }

      if (!user.githubUsername) {
        return res.status(400).json({ error: 'GitHub username not set' });
      }

      const githubService = new GitHubService(githubToken);
      const sentimentService = new SentimentService();

      // Get user repositories
      const repositories = await githubService.getUserRepositories(user.githubUsername);
      
      // Store repositories
      for (const repo of repositories) {
        await prisma.repository.upsert({
          where: { fullName: repo.full_name },
          update: {
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            isPrivate: repo.private,
            updatedAt: new Date(repo.updated_at),
          },
          create: {
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            isPrivate: repo.private,
            userId,
            createdAt: new Date(repo.created_at),
            updatedAt: new Date(repo.updated_at),
          }
        });
      }

      // Get maintainer activity
      const repoFullNames = repositories.map(r => r.full_name);
      const activity = await githubService.getMaintainerActivity(user.githubUsername, repoFullNames);

      // Process PR reviews
      for (const review of activity.prReviews) {
        const sentiment = sentimentService.analyze(review.body);
        
        await prisma.pRReview.create({
          data: {
            prNumber: review.id,
            title: `Review for PR #${review.id}`,
            body: review.body,
            state: review.state,
            sentiment: sentiment.sentiment,
            sentimentScore: sentiment.score,
            url: review.html_url,
            userId,
            repositoryId: (await prisma.repository.findFirst({
              where: { fullName: review.pull_request_url.split('/').slice(-4, -2).join('/') }
            }))?.id || '',
            createdAt: new Date(review.created_at),
          }
        });
      }

      // Process issue triage
      for (const triage of activity.issueTriage) {
        await prisma.issueTriage.create({
          data: {
            action: 'COMMENTED',
            comment: triage.body,
            userId,
            issueId: (await prisma.issue.findFirst({
              where: { url: triage.html_url }
            }))?.id || '',
            createdAt: new Date(triage.created_at),
          }
        });
      }

      res.json({ 
        message: 'Data synced successfully',
        repositories: repositories.length,
        prReviews: activity.prReviews.length,
        issueTriage: activity.issueTriage.length,
      });
    } catch (error) {
      console.error('Sync from GitHub error:', error);
      res.status(500).json({ error: 'Failed to sync from GitHub' });
    }
  },

  // Get shareable profile
  getShareableProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { username } = req.params;

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { githubUsername: username }
          ]
        },
        select: {
          id: true,
          name: true,
          githubUsername: true,
          avatarUrl: true,
          isMaintainer: true,
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get public metrics
      const [prReviews, issueTriage, mentorship, contributions] = await Promise.all([
        prisma.pRReview.count({ where: { userId: user.id } }),
        prisma.issueTriage.count({ where: { userId: user.id } }),
        prisma.mentorshipActivity.count({ where: { userId: user.id } }),
        prisma.contribution.count({ where: { userId: user.id } })
      ]);

      const profile = {
        user: {
          name: user.name,
          githubUsername: user.githubUsername,
          avatarUrl: user.avatarUrl,
          isMaintainer: user.isMaintainer,
        },
        metrics: {
          prReviews,
          issueTriage,
          mentorship,
          contributions,
        },
        lastUpdated: new Date().toISOString(),
      };

      res.json(profile);
    } catch (error) {
      console.error('Get shareable profile error:', error);
      res.status(500).json({ error: 'Failed to get shareable profile' });
    }
  },

  // Get sentiment analysis for PR reviews
  getSentimentAnalysis: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { timeframe = 'month' } = req.query;

      // Get PR reviews with sentiment data
      const reviews = await prisma.pRReview.findMany({
        where: { userId },
        include: {
          repository: {
            select: {
              name: true,
              fullName: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      // Convert to sentiment analysis format
      const sentimentData = reviews.map(review => ({
        sentiment: {
          sentiment: review.sentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
          score: review.sentimentScore || 0,
          confidence: 0.8, // Default confidence
          emotions: [],
          personality: {
            helpfulness: 0.5,
            constructiveness: 0.5,
            professionalism: 0.5,
            empathy: 0.5,
            clarity: 0.5,
            encouragement: 0.5,
          }
        },
        date: review.createdAt
      }));

      // Generate trends
      const trends = sentimentAnalysis.generateSentimentTrends(sentimentData, timeframe as 'week' | 'month' | 'year');

      // Calculate personality
      const personality = sentimentAnalysis.calculateMaintainerPersonality(sentimentData.map(d => d.sentiment));

      // Create repository heatmap
      const repositoryData = await prisma.repository.findMany({
        where: { userId },
        include: {
          prReviews: {
            where: { userId }
          }
        }
      });

      const heatmapData = repositoryData.map(repo => ({
        repository: repo.fullName,
        reviews: repo.prReviews.map(review => ({
          sentiment: review.sentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
          score: review.sentimentScore || 0,
          confidence: 0.8,
          emotions: [],
          personality: {
            helpfulness: 0.5,
            constructiveness: 0.5,
            professionalism: 0.5,
            empathy: 0.5,
            clarity: 0.5,
            encouragement: 0.5,
          }
        }))
      }));

      const heatmap = sentimentAnalysis.createSentimentHeatmap(heatmapData);

      res.json({
        trends,
        personality,
        heatmap,
        totalReviews: reviews.length,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get sentiment analysis error:', error);
      res.status(500).json({ error: 'Failed to get sentiment analysis' });
    }
  },

  // Analyze new PR comment sentiment
  analyzeComment: async (req: Request, res: Response) => {
    try {
      const { commentText } = req.body;

      if (!commentText) {
        return res.status(400).json({ error: 'Comment text is required' });
      }

      const analysis = await sentimentAnalysis.analyzePRComment(commentText);

      res.json(analysis);
    } catch (error) {
      console.error('Analyze comment error:', error);
      res.status(500).json({ error: 'Failed to analyze comment' });
    }
  },

  // Batch analyze comments
  batchAnalyzeComments: async (req: Request, res: Response) => {
    try {
      const { comments } = req.body;

      if (!comments || !Array.isArray(comments)) {
        return res.status(400).json({ error: 'Comments array is required' });
      }

      const analyses = await sentimentAnalysis.batchAnalyzeComments(comments);

      res.json({ analyses });
    } catch (error) {
      console.error('Batch analyze comments error:', error);
      res.status(500).json({ error: 'Failed to analyze comments' });
    }
  },

  // Get sentiment insights and recommendations
  getSentimentInsights: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;

      // Get recent reviews for analysis
      const recentReviews = await prisma.pRReview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      if (recentReviews.length === 0) {
        return res.json({
          insights: [],
          recommendations: [],
          patterns: [],
          message: 'Not enough data for analysis'
        });
      }

      // Convert to sentiment format
      const sentimentData = recentReviews.map(review => ({
        sentiment: review.sentiment as 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE',
        score: review.sentimentScore || 0,
        confidence: 0.8,
        emotions: [],
        personality: {
          helpfulness: 0.5,
          constructiveness: 0.5,
          professionalism: 0.5,
          empathy: 0.5,
          clarity: 0.5,
          encouragement: 0.5,
        }
      }));

      const personality = sentimentAnalysis.calculateMaintainerPersonality(sentimentData);

      // Generate insights
      const insights = [];
      const recommendations = [];
      const patterns = [];

      // Analyze sentiment trends
      const positiveRatio = sentimentData.filter(s => s.sentiment === 'POSITIVE').length / sentimentData.length;
      const negativeRatio = sentimentData.filter(s => s.sentiment === 'NEGATIVE').length / sentimentData.length;

      if (positiveRatio > 0.7) {
        insights.push('You maintain a very positive tone in your reviews');
      } else if (negativeRatio > 0.4) {
        insights.push('Your reviews tend to be more critical');
        recommendations.push('Consider adding more positive reinforcement');
      }

      // Analyze personality traits
      if (personality.traits.helpfulness < 0.4) {
        recommendations.push('Try to provide more helpful guidance in reviews');
      }

      if (personality.traits.encouragement < 0.4) {
        recommendations.push('Add more encouraging language to boost contributor morale');
      }

      if (personality.burnoutRisk === 'HIGH') {
        insights.push('High burnout risk detected - consider taking breaks');
        recommendations.push('Take regular breaks and focus on positive interactions');
      }

      // Communication patterns
      patterns.push(`Communication style: ${personality.communicationStyle}`);
      patterns.push(`Overall score: ${(personality.overallScore * 100).toFixed(0)}%`);
      patterns.push(`Burnout risk: ${personality.burnoutRisk}`);

      res.json({
        insights,
        recommendations,
        patterns,
        personality,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get sentiment insights error:', error);
      res.status(500).json({ error: 'Failed to get sentiment insights' });
    }
  },

  // Get comprehensive impact analysis
  getImpactAnalysis: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { timeframe = 'month', repository, dateRange = '6months' } = req.query;

      const repositoryFilter = repository ? [repository as string] : undefined;
      
      const analysis = await impactCalculator.calculateMaintainerImpact(
        userId,
        timeframe as 'week' | 'month' | 'year',
        repositoryFilter
      );

      res.json(analysis);
    } catch (error) {
      console.error('Get impact analysis error:', error);
      res.status(500).json({ error: 'Failed to get impact analysis' });
    }
  },

  // Store impact metrics
  storeImpactMetrics: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { metrics, period } = req.body;

      await impactCalculator.storeImpactMetrics(userId, metrics, period);

      res.json({ message: 'Impact metrics stored successfully' });
    } catch (error) {
      console.error('Store impact metrics error:', error);
      res.status(500).json({ error: 'Failed to store impact metrics' });
    }
  },

  // Create repository snapshot
  createRepositorySnapshot: async (req: Request, res: Response) => {
    try {
      const { repositoryId, metrics } = req.body;

      await impactCalculator.createRepositorySnapshot(repositoryId, metrics);

      res.json({ message: 'Repository snapshot created successfully' });
    } catch (error) {
      console.error('Create repository snapshot error:', error);
      res.status(500).json({ error: 'Failed to create repository snapshot' });
    }
  },

  // Get public profile data
  getPublicProfile: async (req: Request, res: Response) => {
    try {
      const { username } = req.params;

      // Get user by username
      const user = await prisma.user.findUnique({
        where: { githubUsername: username },
        include: {
          prReviews: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              repository: true
            }
          },
          issueTriage: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              issue: true
            }
          },
          mentorship: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              contributor: true
            }
          },
          contributions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              repository: true
            }
          },
          repositories: {
            take: 5,
            orderBy: { stars: 'desc' }
          },
          communityImpact: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Calculate stats
      const stats = {
        totalContributions: user.contributions.length,
        prReviews: user.prReviews.length,
        issueTriage: user.issueTriage.length,
        mentorship: user.mentorship.length,
        repositories: user.repositories.length,
        stars: user.repositories.reduce((sum, repo) => sum + repo.stars, 0),
        forks: user.repositories.reduce((sum, repo) => sum + repo.forks, 0),
        contributors: user.contributions.length
      };

      // Get recent activity
      const recentActivity = [
        ...user.prReviews.map(review => ({
          id: review.id,
          type: 'pr_review' as const,
          title: review.title,
          repository: review.repository.fullName,
          date: review.createdAt.toISOString(),
          url: review.url
        })),
        ...user.issueTriage.map(triage => ({
          id: triage.id,
          type: 'issue_triage' as const,
          title: triage.issue.title,
          repository: triage.issue.repository.fullName,
          date: triage.createdAt.toISOString(),
          url: triage.issue.url
        })),
        ...user.mentorship.map(mentorship => ({
          id: mentorship.id,
          type: 'mentorship' as const,
          title: mentorship.description,
          repository: 'Community',
          date: mentorship.createdAt.toISOString(),
          url: mentorship.url
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      // Get top repositories
      const topRepositories = user.repositories.map(repo => ({
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description || '',
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language || 'Unknown',
        url: repo.url
      }));

      // Get achievements (mock data for now)
      const achievements = [
        {
          id: '1',
          title: 'First Contribution',
          description: 'Made your first contribution to open source',
          icon: 'star',
          earnedAt: user.createdAt.toISOString()
        },
        {
          id: '2',
          title: 'Active Maintainer',
          description: 'Maintained repositories for 6+ months',
          icon: 'award',
          earnedAt: new Date().toISOString()
        }
      ];

      // Calculate impact metrics
      const impactMetrics = {
        overallImpactScore: user.communityImpact[0]?.maintainerScore || 75,
        contributorRetentionRate: 0.7,
        repositoryHealthScore: user.communityImpact[0]?.communityScore || 80,
        mentorshipScore: user.communityImpact[0]?.leadershipScore || 85
      };

      const profileData = {
        user: {
          id: user.id,
          username: user.githubUsername,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          location: user.location,
          website: user.website,
          twitter: user.twitter,
          github: user.githubUsername,
          linkedin: user.linkedin,
          joinedAt: user.createdAt.toISOString(),
          isMaintainer: user.isMaintainer
        },
        stats,
        achievements,
        recentActivity,
        topRepositories,
        impactMetrics,
        lastUpdated: new Date().toISOString()
      };

      res.json(profileData);
    } catch (error) {
      console.error('Get public profile error:', error);
      res.status(500).json({ error: 'Failed to get public profile' });
    }
  }
};
