import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Users, 
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import api from '../utils/api';
import SentimentPieChart from '../components/SentimentPieChart';
import PersonalityRadarChart from '../components/PersonalityRadarChart';
import SentimentTrendChart from '../components/SentimentTrendChart';
import RepositoryHeatmap from '../components/RepositoryHeatmap';
import MaintainerPersonalityCard from '../components/MaintainerPersonalityCard';

interface SentimentAnalysisData {
  trends: Array<{
    period: string;
    positive: number;
    neutral: number;
    negative: number;
    averageScore: number;
  }>;
  personality: {
    overallScore: number;
    traits: {
      helpfulness: number;
      constructiveness: number;
      professionalism: number;
      empathy: number;
      clarity: number;
      encouragement: number;
    };
    strengths: string[];
    improvements: string[];
    communicationStyle: string;
    burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  heatmap: Array<{
    repository: string;
    sentiment: number;
    reviewCount: number;
    averageScore: number;
  }>;
  totalReviews: number;
  lastUpdated: string;
}

interface SentimentInsights {
  insights: string[];
  recommendations: string[];
  patterns: string[];
  personality: any;
  lastUpdated: string;
}

const SentimentAnalysis: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<SentimentAnalysisData | null>(null);
  const [insights, setInsights] = useState<SentimentInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  useEffect(() => {
    fetchSentimentAnalysis();
    fetchSentimentInsights();
  }, [selectedTimeframe]);

  const fetchSentimentAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/maintainer/sentiment-analysis?timeframe=${selectedTimeframe}`);
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentimentInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await api.get('/maintainer/sentiment-insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching sentiment insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Sentiment Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No sentiment analysis data found. Try syncing from GitHub first.
        </p>
      </div>
    );
  }

  const sentimentStats = {
    positive: analysisData.trends.reduce((sum, trend) => sum + trend.positive, 0),
    neutral: analysisData.trends.reduce((sum, trend) => sum + trend.neutral, 0),
    negative: analysisData.trends.reduce((sum, trend) => sum + trend.negative, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sentiment Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Advanced analysis of your maintainer communication patterns and personality
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="input w-auto"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
          <button
            onClick={() => {
              fetchSentimentAnalysis();
              fetchSentimentInsights();
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Reviews
          </h3>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {analysisData.totalReviews}
          </div>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Positive Reviews
          </h3>
          <div className="text-3xl font-bold text-green-600">
            {sentimentStats.positive}
          </div>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Neutral Reviews
          </h3>
          <div className="text-3xl font-bold text-gray-600">
            {sentimentStats.neutral}
          </div>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Negative Reviews
          </h3>
          <div className="text-3xl font-bold text-red-600">
            {sentimentStats.negative}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SentimentPieChart data={sentimentStats} />
        <PersonalityRadarChart traits={analysisData.personality.traits} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SentimentTrendChart data={analysisData.trends} />
        <RepositoryHeatmap data={analysisData.heatmap} />
      </div>

      {/* Personality Analysis */}
      <MaintainerPersonalityCard personality={analysisData.personality} />

      {/* Insights and Recommendations */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
              Insights
            </h3>
            {insightsLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : insights.insights.length > 0 ? (
              <div className="space-y-3">
                {insights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {insight}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No specific insights available yet.
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              Recommendations
            </h3>
            {insightsLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : insights.recommendations.length > 0 ? (
              <div className="space-y-3">
                {insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No specific recommendations at this time.
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              Patterns
            </h3>
            {insightsLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : insights.patterns.length > 0 ? (
              <div className="space-y-3">
                {insights.patterns.map((pattern, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {pattern}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No patterns detected yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Last updated: {new Date(analysisData.lastUpdated).toLocaleString()}</p>
        {insights && (
          <p>Insights updated: {new Date(insights.lastUpdated).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysis;
