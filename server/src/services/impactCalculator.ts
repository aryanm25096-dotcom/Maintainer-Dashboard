import { prisma } from '../index';
import { GitHubService } from './githubService';

export interface ContributorData {
  id: string;
  githubUsername: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  firstContribution: Date;
  lastActivity?: Date;
  totalContributions: number;
  isActive: boolean;
  returnRate: number;
  qualityScore: number;
}

export interface RepositoryHealthData {
  repositoryId: string;
  repositoryName: string;
  beforeMetrics: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
    activityScore: number;
  };
  afterMetrics: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
    activityScore: number;
  };
  improvement: {
    starsGrowth: number;
    forksGrowth: number;
    issuesResolved: number;
    prsMerged: number;
    contributorGrowth: number;
    activityGrowth: number;
  };
  healthScore: number;
}

export interface ImpactMetrics {
  newContributors: number;
  returningContributors: number;
  contributorRetentionRate: number;
  contributorGrowthRate: number;
  issuesResolved: number;
  prsMerged: number;
  activityGrowth: number;
  repositoryHealthScore: number;
  mentorshipScore: number;
  contributorQualityImprovement: number;
  longTermImpactScore: number;
  overallImpactScore: number;
  predictedLongTermImpact: number;
}

export interface ImpactAnalysis {
  metrics: ImpactMetrics;
  contributors: ContributorData[];
  repositoryHealth: RepositoryHealthData[];
  trends: {
    period: string;
    impactScore: number;
    contributorGrowth: number;
    repositoryHealth: number;
  }[];
  insights: string[];
  recommendations: string[];
  predictedImpact: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
}

export class ImpactCalculatorService {
  private githubService: GitHubService;

  constructor() {
    this.githubService = new GitHubService(''); // Will be set per request
  }

  // Calculate comprehensive impact metrics for a maintainer
  async calculateMaintainerImpact(
    userId: string,
    timeframe: 'week' | 'month' | 'year' = 'month',
    repositoryFilter?: string[]
  ): Promise<ImpactAnalysis> {
    try {
      // Get maintainer's repositories
      const repositories = await prisma.repository.findMany({
        where: {
          userId,
          ...(repositoryFilter && { fullName: { in: repositoryFilter } })
        }
      });

      // Calculate contributor metrics
      const contributorMetrics = await this.calculateContributorMetrics(userId, repositories.map(r => r.id));
      
      // Calculate repository health metrics
      const repositoryHealth = await this.calculateRepositoryHealth(repositories);
      
      // Calculate mentorship metrics
      const mentorshipMetrics = await this.calculateMentorshipMetrics(userId);
      
      // Calculate overall impact
      const overallImpact = this.calculateOverallImpact(
        contributorMetrics,
        repositoryHealth,
        mentorshipMetrics
      );

      // Generate trends
      const trends = await this.calculateTrends(userId, timeframe);
      
      // Generate insights and recommendations
      const insights = this.generateInsights(contributorMetrics, repositoryHealth, mentorshipMetrics);
      const recommendations = this.generateRecommendations(contributorMetrics, repositoryHealth, mentorshipMetrics);
      
      // Predict long-term impact
      const predictedImpact = this.predictLongTermImpact(overallImpact, trends);

      return {
        metrics: overallImpact,
        contributors: contributorMetrics,
        repositoryHealth,
        trends,
        insights,
        recommendations,
        predictedImpact
      };
    } catch (error) {
      console.error('Error calculating maintainer impact:', error);
      throw error;
    }
  }

  // Calculate contributor metrics
  private async calculateContributorMetrics(userId: string, repositoryIds: string[]): Promise<ContributorData[]> {
    const contributors = await prisma.contributor.findMany({
      where: {
        contributions: {
          some: {
            repositoryId: { in: repositoryIds }
          }
        }
      },
      include: {
        contributions: {
          where: {
            repositoryId: { in: repositoryIds }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return contributors.map(contributor => {
      const contributions = contributor.contributions;
      const firstContribution = contributions[0]?.createdAt || contributor.firstContribution;
      const lastContribution = contributions[contributions.length - 1]?.createdAt;
      
      // Calculate return rate (contributors who made multiple contributions)
      const returnRate = contributions.length > 1 ? 1 : 0;
      
      // Calculate quality score based on contribution types and frequency
      const qualityScore = this.calculateContributorQuality(contributions);
      
      return {
        id: contributor.id,
        githubUsername: contributor.githubUsername,
        name: contributor.name,
        email: contributor.email,
        avatarUrl: contributor.avatarUrl,
        firstContribution,
        lastActivity: lastContribution,
        totalContributions: contributions.length,
        isActive: contributor.isActive,
        returnRate,
        qualityScore
      };
    });
  }

  // Calculate repository health metrics
  private async calculateRepositoryHealth(repositories: any[]): Promise<RepositoryHealthData[]> {
    const healthData: RepositoryHealthData[] = [];

    for (const repo of repositories) {
      // Get snapshots for before/after comparison
      const snapshots = await prisma.repositorySnapshot.findMany({
        where: { repositoryId: repo.id },
        orderBy: { snapshotDate: 'asc' }
      });

      if (snapshots.length < 2) continue;

      const beforeSnapshot = snapshots[0];
      const afterSnapshot = snapshots[snapshots.length - 1];

      const beforeMetrics = {
        stars: beforeSnapshot.stars,
        forks: beforeSnapshot.forks,
        issues: beforeSnapshot.issues,
        pullRequests: beforeSnapshot.pullRequests,
        contributors: beforeSnapshot.contributors,
        activityScore: beforeSnapshot.activityScore
      };

      const afterMetrics = {
        stars: afterSnapshot.stars,
        forks: afterSnapshot.forks,
        issues: afterSnapshot.issues,
        pullRequests: afterSnapshot.pullRequests,
        contributors: afterSnapshot.contributors,
        activityScore: afterSnapshot.activityScore
      };

      const improvement = {
        starsGrowth: ((afterMetrics.stars - beforeMetrics.stars) / beforeMetrics.stars) * 100,
        forksGrowth: ((afterMetrics.forks - beforeMetrics.forks) / beforeMetrics.forks) * 100,
        issuesResolved: beforeMetrics.issues - afterMetrics.issues,
        prsMerged: afterMetrics.pullRequests - beforeMetrics.pullRequests,
        contributorGrowth: ((afterMetrics.contributors - beforeMetrics.contributors) / beforeMetrics.contributors) * 100,
        activityGrowth: ((afterMetrics.activityScore - beforeMetrics.activityScore) / beforeMetrics.activityScore) * 100
      };

      const healthScore = this.calculateRepositoryHealthScore(improvement);

      healthData.push({
        repositoryId: repo.id,
        repositoryName: repo.fullName,
        beforeMetrics,
        afterMetrics,
        improvement,
        healthScore
      });
    }

    return healthData;
  }

  // Calculate mentorship metrics
  private async calculateMentorshipMetrics(userId: string): Promise<{
    mentorshipScore: number;
    contributorQualityImprovement: number;
    longTermImpactScore: number;
  }> {
    const mentorshipActivities = await prisma.mentorshipActivity.findMany({
      where: { userId },
      include: {
        contributor: true
      }
    });

    const mentorshipScore = this.calculateMentorshipScore(mentorshipActivities);
    const contributorQualityImprovement = this.calculateQualityImprovement(mentorshipActivities);
    const longTermImpactScore = this.calculateLongTermImpact(mentorshipActivities);

    return {
      mentorshipScore,
      contributorQualityImprovement,
      longTermImpactScore
    };
  }

  // Calculate overall impact score
  private calculateOverallImpact(
    contributors: ContributorData[],
    repositoryHealth: RepositoryHealthData[],
    mentorshipMetrics: any
  ): ImpactMetrics {
    const newContributors = contributors.filter(c => c.totalContributions === 1).length;
    const returningContributors = contributors.filter(c => c.returnRate > 0).length;
    const contributorRetentionRate = contributors.length > 0 ? returningContributors / contributors.length : 0;
    const contributorGrowthRate = contributors.length; // Simplified for now

    const issuesResolved = repositoryHealth.reduce((sum, repo) => sum + repo.improvement.issuesResolved, 0);
    const prsMerged = repositoryHealth.reduce((sum, repo) => sum + repo.improvement.prsMerged, 0);
    const activityGrowth = repositoryHealth.reduce((sum, repo) => sum + repo.improvement.activityGrowth, 0) / repositoryHealth.length;
    const repositoryHealthScore = repositoryHealth.reduce((sum, repo) => sum + repo.healthScore, 0) / repositoryHealth.length;

    const overallImpactScore = this.calculateWeightedImpactScore({
      contributorRetentionRate,
      repositoryHealthScore,
      mentorshipScore: mentorshipMetrics.mentorshipScore,
      activityGrowth
    });

    const predictedLongTermImpact = this.predictLongTermImpact(overallImpactScore, []);

    return {
      newContributors,
      returningContributors,
      contributorRetentionRate,
      contributorGrowthRate,
      issuesResolved,
      prsMerged,
      activityGrowth,
      repositoryHealthScore,
      mentorshipScore: mentorshipMetrics.mentorshipScore,
      contributorQualityImprovement: mentorshipMetrics.contributorQualityImprovement,
      longTermImpactScore: mentorshipMetrics.longTermImpactScore,
      overallImpactScore,
      predictedLongTermImpact
    };
  }

  // Calculate trends over time
  private async calculateTrends(userId: string, timeframe: string): Promise<any[]> {
    const impactMetrics = await prisma.impactMetric.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' }
    });

    return impactMetrics.map(metric => ({
      period: metric.period,
      impactScore: metric.overallImpactScore,
      contributorGrowth: metric.contributorGrowthRate,
      repositoryHealth: metric.repositoryHealthScore
    }));
  }

  // Generate insights based on metrics
  private generateInsights(
    contributors: ContributorData[],
    repositoryHealth: RepositoryHealthData[],
    mentorshipMetrics: any
  ): string[] {
    const insights: string[] = [];

    const avgRetentionRate = contributors.reduce((sum, c) => sum + c.returnRate, 0) / contributors.length;
    if (avgRetentionRate > 0.7) {
      insights.push('Excellent contributor retention rate - you\'re building a strong community');
    } else if (avgRetentionRate < 0.3) {
      insights.push('Low contributor retention - consider improving onboarding and support');
    }

    const avgRepositoryHealth = repositoryHealth.reduce((sum, r) => sum + r.healthScore, 0) / repositoryHealth.length;
    if (avgRepositoryHealth > 0.8) {
      insights.push('Outstanding repository health improvements across your projects');
    }

    if (mentorshipMetrics.mentorshipScore > 0.8) {
      insights.push('Exceptional mentorship skills - contributors are thriving under your guidance');
    }

    return insights;
  }

  // Generate recommendations
  private generateRecommendations(
    contributors: ContributorData[],
    repositoryHealth: RepositoryHealthData[],
    mentorshipMetrics: any
  ): string[] {
    const recommendations: string[] = [];

    const avgRetentionRate = contributors.reduce((sum, c) => sum + c.returnRate, 0) / contributors.length;
    if (avgRetentionRate < 0.5) {
      recommendations.push('Focus on improving contributor retention through better onboarding and ongoing support');
    }

    if (mentorshipMetrics.mentorshipScore < 0.6) {
      recommendations.push('Enhance mentorship activities to provide more guidance and support to contributors');
    }

    const avgRepositoryHealth = repositoryHealth.reduce((sum, r) => sum + r.healthScore, 0) / repositoryHealth.length;
    if (avgRepositoryHealth < 0.6) {
      recommendations.push('Work on improving repository health through better issue management and documentation');
    }

    return recommendations;
  }

  // Predict long-term impact
  private predictLongTermImpact(currentImpact: number, trends: any[]): {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  } {
    const trendGrowth = trends.length > 1 ? 
      (trends[trends.length - 1].impactScore - trends[0].impactScore) / trends.length : 0;

    return {
      shortTerm: currentImpact * 1.1,
      mediumTerm: currentImpact * (1.1 + trendGrowth * 6),
      longTerm: currentImpact * (1.1 + trendGrowth * 12)
    };
  }

  // Helper methods
  private calculateContributorQuality(contributions: any[]): number {
    if (contributions.length === 0) return 0;
    
    const qualityFactors = {
      frequency: Math.min(contributions.length / 10, 1), // Normalize to 0-1
      diversity: this.calculateContributionDiversity(contributions),
      recency: this.calculateRecencyScore(contributions)
    };

    return (qualityFactors.frequency + qualityFactors.diversity + qualityFactors.recency) / 3;
  }

  private calculateContributionDiversity(contributions: any[]): number {
    const types = new Set(contributions.map(c => c.type));
    return types.size / 5; // Assuming 5 possible types
  }

  private calculateRecencyScore(contributions: any[]): number {
    const now = new Date();
    const lastContribution = contributions[contributions.length - 1]?.createdAt;
    if (!lastContribution) return 0;
    
    const daysSinceLastContribution = (now.getTime() - lastContribution.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (daysSinceLastContribution / 365)); // Decay over a year
  }

  private calculateRepositoryHealthScore(improvement: any): number {
    const factors = {
      starsGrowth: Math.min(improvement.starsGrowth / 100, 1),
      forksGrowth: Math.min(improvement.forksGrowth / 100, 1),
      issuesResolved: Math.min(improvement.issuesResolved / 50, 1),
      prsMerged: Math.min(improvement.prsMerged / 20, 1),
      contributorGrowth: Math.min(improvement.contributorGrowth / 50, 1),
      activityGrowth: Math.min(improvement.activityGrowth / 100, 1)
    };

    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) / Object.keys(factors).length;
  }

  private calculateMentorshipScore(activities: any[]): number {
    if (activities.length === 0) return 0;
    
    const highImpactActivities = activities.filter(a => a.impact === 'HIGH').length;
    const totalActivities = activities.length;
    
    return highImpactActivities / totalActivities;
  }

  private calculateQualityImprovement(activities: any[]): number {
    // Simplified calculation - in reality, this would analyze contributor progression
    return activities.length > 0 ? Math.min(activities.length / 10, 1) : 0;
  }

  private calculateLongTermImpact(activities: any[]): number {
    const longTermActivities = activities.filter(a => 
      a.type === 'GUIDANCE' || a.type === 'COLLABORATION'
    ).length;
    
    return Math.min(longTermActivities / 5, 1);
  }

  private calculateWeightedImpactScore(metrics: any): number {
    const weights = {
      contributorRetentionRate: 0.3,
      repositoryHealthScore: 0.3,
      mentorshipScore: 0.2,
      activityGrowth: 0.2
    };

    return Object.entries(weights).reduce((sum, [key, weight]) => {
      return sum + (metrics[key] * weight);
    }, 0);
  }

  // Store impact metrics in database
  async storeImpactMetrics(userId: string, metrics: ImpactMetrics, period: string): Promise<void> {
    await prisma.impactMetric.create({
      data: {
        userId,
        period,
        startDate: new Date(),
        endDate: new Date(),
        ...metrics
      }
    });
  }

  // Create repository snapshot
  async createRepositorySnapshot(repositoryId: string, metrics: any): Promise<void> {
    await prisma.repositorySnapshot.create({
      data: {
        repositoryId,
        snapshotDate: new Date(),
        ...metrics
      }
    });
  }
}
