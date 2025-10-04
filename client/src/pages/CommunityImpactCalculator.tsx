import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  GitPullRequest, 
  Star,
  TrendingUp,
  Download,
  Share2,
  Filter,
  Calendar,
  RefreshCw,
  Target,
  Award,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import api from '../utils/api';
import ImpactScoreCard from '../components/ImpactScoreCard';
import ContributorRetentionChart from '../components/ContributorRetentionChart';
import RepositoryHealthBeforeAfter from '../components/RepositoryHealthBeforeAfter';
import MentorshipSuccessTimeline from '../components/MentorshipSuccessTimeline';

interface ImpactAnalysis {
  metrics: {
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
  };
  contributors: Array<{
    id: string;
    githubUsername: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
    firstContribution: string;
    lastActivity?: string;
    totalContributions: number;
    isActive: boolean;
    returnRate: number;
    qualityScore: number;
  }>;
  repositoryHealth: Array<{
    repositoryId: string;
    repositoryName: string;
    beforeMetrics: any;
    afterMetrics: any;
    improvement: any;
    healthScore: number;
  }>;
  trends: Array<{
    period: string;
    impactScore: number;
    contributorGrowth: number;
    repositoryHealth: number;
  }>;
  insights: string[];
  recommendations: string[];
  predictedImpact: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
}

const CommunityImpactCalculator: React.FC = () => {
  const [analysis, setAnalysis] = useState<ImpactAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeframe: 'month',
    repository: '',
    dateRange: '6months'
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchImpactAnalysis();
  }, [filters]);

  const fetchImpactAnalysis = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.timeframe) params.append('timeframe', filters.timeframe);
      if (filters.repository) params.append('repository', filters.repository);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);

      const response = await api.get(`/maintainer/impact-analysis?${params}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching impact analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);
      // In a real implementation, you would call an API endpoint to generate PDF
      console.log('Exporting to PDF...');
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('PDF export completed!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      // In a real implementation, you would call an API endpoint to generate CSV
      console.log('Exporting to CSV...');
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('CSV export completed!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const shareImpact = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Community Impact Report',
        text: `Check out my maintainer impact: ${analysis?.metrics.overallImpactScore.toFixed(1)}% overall score!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Community Impact Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No impact analysis data found. Try syncing from GitHub first.
        </p>
      </div>
    );
  }

  const retentionData = analysis.trends.map(trend => ({
    period: trend.period,
    newContributors: Math.floor(Math.random() * 10) + 1, // Mock data
    returningContributors: Math.floor(Math.random() * 8) + 1,
    retentionRate: trend.impactScore,
    totalContributors: Math.floor(Math.random() * 15) + 5
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Community Impact Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive analysis of your maintainer impact on open source communities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchImpactAnalysis}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeframe
            </label>
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
              className="input"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repository
            </label>
            <select
              value={filters.repository}
              onChange={(e) => setFilters({ ...filters, repository: e.target.value })}
              className="input"
            >
              <option value="">All repositories</option>
              {/* In a real app, you'd fetch repositories */}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="input"
            >
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Impact Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ImpactScoreCard
          score={analysis.metrics.overallImpactScore}
          title="Overall Impact"
          subtitle="Community contribution score"
          icon={<Target className="w-6 h-6" />}
          color="blue"
        />
        <ImpactScoreCard
          score={analysis.metrics.contributorRetentionRate * 100}
          title="Contributor Retention"
          subtitle="Returning contributors rate"
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
        <ImpactScoreCard
          score={analysis.metrics.repositoryHealthScore}
          title="Repository Health"
          subtitle="Project health improvement"
          icon={<Star className="w-6 h-6" />}
          color="purple"
        />
        <ImpactScoreCard
          score={analysis.metrics.mentorshipScore * 100}
          title="Mentorship Score"
          subtitle="Guidance and support quality"
          icon={<Award className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContributorRetentionChart 
          data={retentionData}
          title="Contributor Retention Analysis"
        />
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Predicted Long-term Impact
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Short-term (3 months)</div>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.predictedImpact.shortTerm.toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium-term (6 months)</div>
                <div className="text-2xl font-bold text-green-600">
                  {analysis.predictedImpact.mediumTerm.toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Long-term (1 year)</div>
                <div className="text-2xl font-bold text-purple-600">
                  {analysis.predictedImpact.longTerm.toFixed(1)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Repository Health Analysis */}
      <RepositoryHealthBeforeAfter data={analysis.repositoryHealth} />

      {/* Mentorship Timeline */}
      <MentorshipSuccessTimeline 
        activities={[]} // Would come from mentorship data
        title="Mentorship Success Timeline"
      />

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
            Key Insights
          </h3>
          <div className="space-y-3">
            {analysis.insights.length > 0 ? (
              analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {insight}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No specific insights available yet.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
            Recommendations
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {recommendation}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No specific recommendations at this time.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Export and Share Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export & Share
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={exporting}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={shareImpact}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Impact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityImpactCalculator;
