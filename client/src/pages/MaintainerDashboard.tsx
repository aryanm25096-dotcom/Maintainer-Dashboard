import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GitPullRequest, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  BarChart3, 
  RefreshCw,
  ExternalLink,
  Star,
  GitBranch,
  Calendar,
  Brain,
  Target,
  Activity,
  Filter,
  Download
} from 'lucide-react';
import api from '../utils/api';
import ActivityTimelineChart from '../components/ActivityTimelineChart';
import MonthlyActivityHeatmap from '../components/MonthlyActivityHeatmap';
import RepositoryComparisonBar from '../components/RepositoryComparisonBar';
import ContributorFunnelChart from '../components/ContributorFunnelChart';
import { exportDashboardToPDF } from '../utils/pdfExport';
import { exportActivityData, exportImpactMetrics } from '../utils/csvExport';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import Tooltip from '../components/Tooltip';
import SuccessNotification from '../components/SuccessNotification';
import { useGlobalCache } from '../hooks/useCache';

interface DashboardMetrics {
  prReviews: number;
  issueTriage: number;
  mentorship: number;
  contributions: number;
}

interface CommunityImpact {
  maintainerScore: number;
  communityScore: number;
  leadershipScore: number;
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    githubUsername: string;
  };
  metrics: DashboardMetrics;
  communityImpact: CommunityImpact;
  lastUpdated: string;
}

const MaintainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState<'export' | 'share' | 'copy' | 'save' | 'sync'>('export');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/maintainer/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncFromGitHub = async () => {
    try {
      setSyncing(true);
      // In a real app, you'd get the GitHub token from the user
      const githubToken = prompt('Enter your GitHub personal access token:');
      if (!githubToken) return;

      await api.post('/maintainer/sync', { githubToken });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error syncing from GitHub:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportDashboardToPDF({
        filename: `maintainer-dashboard-${Date.now()}.pdf`
      });
      setSuccessType('export');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!dashboardData) return;
    
    try {
      // Export activity data
      const activityData = [
        { date: '2024-01-01', type: 'pr_review', repository: 'react-app', title: 'PR Review', value: dashboardData.metrics.prReviews, sentiment: 'positive', url: '#' },
        { date: '2024-01-01', type: 'issue_triage', repository: 'react-app', title: 'Issue Triage', value: dashboardData.metrics.issueTriage, sentiment: 'positive', url: '#' },
        { date: '2024-01-01', type: 'mentorship', repository: 'react-app', title: 'Mentorship', value: dashboardData.metrics.mentorship, sentiment: 'positive', url: '#' }
      ];
      
      exportActivityData(activityData);

      // Export impact metrics
      const impactData = [{
        period: 'all-time',
        newContributors: dashboardData.communityImpact.maintainerScore,
        returningContributors: Math.floor(dashboardData.communityImpact.maintainerScore * 0.7),
        contributorRetentionRate: 0.7,
        contributorGrowthRate: dashboardData.communityImpact.maintainerScore,
        issuesResolved: dashboardData.metrics.issueTriage,
        prsMerged: dashboardData.metrics.prReviews,
        activityGrowth: dashboardData.communityImpact.maintainerScore,
        repositoryHealthScore: dashboardData.communityImpact.communityScore,
        mentorshipScore: dashboardData.communityImpact.leadershipScore,
        contributorQualityImprovement: dashboardData.communityImpact.leadershipScore,
        longTermImpactScore: dashboardData.communityImpact.maintainerScore,
        overallImpactScore: dashboardData.communityImpact.maintainerScore,
        predictedLongTermImpact: dashboardData.communityImpact.maintainerScore * 1.2
      }];
      
      exportImpactMetrics(impactData);
      
      setSuccessType('export');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" type="dashboard" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Maintainer Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You need to be a maintainer to access this dashboard.
        </p>
        <button
          onClick={syncFromGitHub}
          className="btn-primary"
        >
          Sync from GitHub
        </button>
      </div>
    );
  }

  const metrics = [
    {
      name: 'PR Reviews',
      value: dashboardData.metrics.prReviews,
      icon: GitPullRequest,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      name: 'Issue Triage',
      value: dashboardData.metrics.issueTriage,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      name: 'Mentorship',
      value: dashboardData.metrics.mentorship,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      name: 'Contributions',
      value: dashboardData.metrics.contributions,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <ErrorBoundary>
      <div id="maintainer-dashboard" className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Maintainer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {dashboardData.user.name}! Here's your maintainer activity overview.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={syncFromGitHub}
            disabled={syncing}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync from GitHub'}</span>
          </button>
          <Tooltip content="Export dashboard as PDF for offline viewing and sharing">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </Tooltip>
          <Tooltip content="Export data as CSV for analysis in Excel or Google Sheets">
            <button
              onClick={handleExportCSV}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Impact Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Maintainer Score
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dashboardData.communityImpact.maintainerScore * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {dashboardData.communityImpact.maintainerScore.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Community Score
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dashboardData.communityImpact.communityScore * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {dashboardData.communityImpact.communityScore.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leadership Score
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dashboardData.communityImpact.leadershipScore * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {dashboardData.communityImpact.leadershipScore.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a
          href="/maintainer/pr-reviews"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <GitPullRequest className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PR Reviews</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View sentiment analysis</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="/maintainer/issue-triage"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Issue Triage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track triage activities</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="/maintainer/mentorship"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Mentorship</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View mentorship activities</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="/maintainer/community-impact"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Community Impact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calculate your impact</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="/maintainer/sentiment-analysis"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Sentiment Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analyze communication patterns</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>

        <a
          href="/maintainer/community-impact-calculator"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Impact Calculator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Measure community impact</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </a>
      </div>

      {/* Interactive Analytics Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Interactive Analytics
          </h2>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Activity Timeline Chart */}
        <div className="mb-8">
          <ActivityTimelineChart
            data={[
              { date: '2024-01-01', prReviews: 12, issueTriage: 8, mentorship: 5, contributions: 15, total: 40 },
              { date: '2024-01-02', prReviews: 15, issueTriage: 10, mentorship: 3, contributions: 12, total: 40 },
              { date: '2024-01-03', prReviews: 8, issueTriage: 12, mentorship: 7, contributions: 18, total: 45 },
              { date: '2024-01-04', prReviews: 20, issueTriage: 6, mentorship: 4, contributions: 14, total: 44 },
              { date: '2024-01-05', prReviews: 10, issueTriage: 15, mentorship: 8, contributions: 20, total: 53 },
              { date: '2024-01-06', prReviews: 18, issueTriage: 9, mentorship: 6, contributions: 16, total: 49 },
              { date: '2024-01-07', prReviews: 14, issueTriage: 11, mentorship: 9, contributions: 22, total: 56 }
            ]}
            title="Weekly Activity Timeline"
            onDataPointClick={(data) => console.log('Clicked data point:', data)}
          />
        </div>

        {/* Monthly Activity Heatmap */}
        <div className="mb-8">
          <MonthlyActivityHeatmap
            data={[
              { date: '2024-01-01', value: 5, sentiment: 'positive', type: 'pr_review' },
              { date: '2024-01-02', value: 3, sentiment: 'neutral', type: 'issue_triage' },
              { date: '2024-01-03', value: 8, sentiment: 'positive', type: 'mentorship' },
              { date: '2024-01-04', value: 2, sentiment: 'negative', type: 'contribution' },
              { date: '2024-01-05', value: 6, sentiment: 'positive', type: 'pr_review' },
              { date: '2024-01-06', value: 4, sentiment: 'neutral', type: 'issue_triage' },
              { date: '2024-01-07', value: 7, sentiment: 'positive', type: 'mentorship' }
            ]}
            title="January 2024 Activity Heatmap"
            onDayClick={(activities) => console.log('Clicked day activities:', activities)}
          />
        </div>

        {/* Repository Comparison */}
        <div className="mb-8">
          <RepositoryComparisonBar
            data={[
              {
                repository: 'react-app',
                prReviews: 45,
                issueTriage: 32,
                mentorship: 18,
                contributions: 67,
                stars: 1200,
                forks: 89,
                contributors: 25,
                healthScore: 85.5,
                activityScore: 92.3
              },
              {
                repository: 'node-api',
                prReviews: 38,
                issueTriage: 28,
                mentorship: 15,
                contributions: 54,
                stars: 890,
                forks: 67,
                contributors: 18,
                healthScore: 78.2,
                activityScore: 87.1
              },
              {
                repository: 'vue-components',
                prReviews: 29,
                issueTriage: 22,
                mentorship: 12,
                contributions: 41,
                stars: 650,
                forks: 45,
                contributors: 14,
                healthScore: 72.8,
                activityScore: 79.6
              }
            ]}
            title="Repository Performance Comparison"
            onRepositoryClick={(repo) => console.log('Clicked repository:', repo)}
          />
        </div>

        {/* Contributor Funnel */}
        <div className="mb-8">
          <ContributorFunnelChart
            data={[
              {
                stage: 'First Contact',
                value: 150,
                percentage: 100,
                color: '#3B82F6',
                description: 'Initial community interaction',
                contributors: [
                  { id: '1', username: 'user1', contributions: 1, joinedAt: '2024-01-01' },
                  { id: '2', username: 'user2', contributions: 1, joinedAt: '2024-01-02' }
                ]
              },
              {
                stage: 'First Contribution',
                value: 89,
                percentage: 59.3,
                color: '#10B981',
                description: 'Made their first contribution',
                contributors: [
                  { id: '3', username: 'user3', contributions: 2, joinedAt: '2024-01-03' },
                  { id: '4', username: 'user4', contributions: 1, joinedAt: '2024-01-04' }
                ]
              },
              {
                stage: 'Regular Contributor',
                value: 45,
                percentage: 30.0,
                color: '#8B5CF6',
                description: 'Consistent contributor',
                contributors: [
                  { id: '5', username: 'user5', contributions: 8, joinedAt: '2024-01-05' },
                  { id: '6', username: 'user6', contributions: 12, joinedAt: '2024-01-06' }
                ]
              },
              {
                stage: 'Core Contributor',
                value: 18,
                percentage: 12.0,
                color: '#F59E0B',
                description: 'Key project contributor',
                contributors: [
                  { id: '7', username: 'user7', contributions: 25, joinedAt: '2024-01-07' },
                  { id: '8', username: 'user8', contributions: 30, joinedAt: '2024-01-08' }
                ]
              },
              {
                stage: 'Maintainer',
                value: 5,
                percentage: 3.3,
                color: '#EF4444',
                description: 'Project maintainer',
                contributors: [
                  { id: '9', username: 'user9', contributions: 50, joinedAt: '2024-01-09' },
                  { id: '10', username: 'user10', contributions: 45, joinedAt: '2024-01-10' }
                ]
              }
            ]}
            title="Contributor Journey Funnel"
            onStageClick={(stage, contributors) => console.log('Clicked stage:', stage, contributors)}
            onContributorClick={(contributor) => console.log('Clicked contributor:', contributor)}
          />
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
      </div>
      </div>
      
      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        type={successType}
      />
    </ErrorBoundary>
  );
};

export default MaintainerDashboard;
