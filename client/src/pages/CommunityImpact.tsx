import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  GitPullRequest, 
  MessageSquare,
  Star,
  BarChart3,
  Calendar,
  Award,
  Target,
  Zap
} from 'lucide-react';
import api from '../utils/api';

interface CommunityImpact {
  id: string;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  prReviews: number;
  issuesTriage: number;
  mentorship: number;
  contributions: number;
  repositories: number;
  maintainerScore: number;
  communityScore: number;
  leadershipScore: number;
  createdAt: string;
}

interface ImpactData {
  impact: CommunityImpact[];
  trends: {
    maintainerScore: number[];
    communityScore: number[];
    leadershipScore: number[];
  };
  averages: {
    maintainerScore: number;
    communityScore: number;
    leadershipScore: number;
  };
  period: string;
}

const CommunityImpact: React.FC = () => {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('MONTHLY');

  useEffect(() => {
    fetchCommunityImpact();
  }, [selectedPeriod]);

  const fetchCommunityImpact = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/maintainer/community-impact?period=${selectedPeriod}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching community impact:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900';
    if (score >= 6) return 'bg-yellow-100 dark:bg-yellow-900';
    if (score >= 4) return 'bg-orange-100 dark:bg-orange-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Community Impact
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No community impact data found. Try syncing from GitHub first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Community Impact Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Measure your impact as a maintainer in the open source community
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Period:
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>

      {/* Overall Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Maintainer Score
            </h3>
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(data.averages.maintainerScore)}`}>
              {data.averages.maintainerScore.toFixed(1)}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(data.averages.maintainerScore)} ${getScoreColor(data.averages.maintainerScore)}`}>
              {getScoreText(data.averages.maintainerScore)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on PR reviews, issue triage, and code contributions
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Community Score
            </h3>
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(data.averages.communityScore)}`}>
              {data.averages.communityScore.toFixed(1)}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(data.averages.communityScore)} ${getScoreColor(data.averages.communityScore)}`}>
              {getScoreText(data.averages.communityScore)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on community engagement and mentorship activities
            </p>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leadership Score
            </h3>
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(data.averages.leadershipScore)}`}>
              {data.averages.leadershipScore.toFixed(1)}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(data.averages.leadershipScore)} ${getScoreColor(data.averages.leadershipScore)}`}>
              {getScoreText(data.averages.leadershipScore)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Based on mentorship, guidance, and community leadership
            </p>
          </div>
        </div>
      </div>

      {/* Impact Trends Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Impact Trends Over Time
        </h3>
        <div className="space-y-4">
          {data.impact.slice(0, 6).map((period, index) => (
            <div key={period.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {period.maintainerScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Maintainer</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {period.communityScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Community</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {period.leadershipScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Leadership</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <GitPullRequest className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            PR Reviews
          </h4>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.impact.reduce((sum, period) => sum + period.prReviews, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total reviews across all periods
          </p>
        </div>

        <div className="card text-center">
          <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Issue Triage
          </h4>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.impact.reduce((sum, period) => sum + period.issuesTriage, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Issues triaged and managed
          </p>
        </div>

        <div className="card text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Mentorship
          </h4>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.impact.reduce((sum, period) => sum + period.mentorship, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mentorship activities
          </p>
        </div>

        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Contributions
          </h4>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.impact.reduce((sum, period) => sum + period.contributions, 0)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total contributions made
          </p>
        </div>
      </div>

      {/* Shareable Profile Link */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Share Your Impact
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create a shareable profile to showcase your maintainer journey
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Generate Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityImpact;
