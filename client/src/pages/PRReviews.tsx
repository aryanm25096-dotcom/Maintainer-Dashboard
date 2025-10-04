import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  Code,
  Brain,
  BarChart3
} from 'lucide-react';
import api from '../utils/api';
import SentimentPieChart from '../components/SentimentPieChart';

interface PRReview {
  id: string;
  prNumber: number;
  title: string;
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  sentimentScore: number;
  url: string;
  createdAt: string;
  repository: {
    name: string;
    fullName: string;
    language: string;
  };
}

interface SentimentStats {
  POSITIVE: number;
  NEUTRAL: number;
  NEGATIVE: number;
  UNKNOWN: number;
}

interface PRReviewsData {
  reviews: PRReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sentimentStats: SentimentStats;
}

const PRReviews: React.FC = () => {
  const [data, setData] = useState<PRReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    repository: '',
    sentiment: '',
    page: 1,
  });

  useEffect(() => {
    fetchPRReviews();
  }, [filters]);

  const fetchPRReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.repository) params.append('repository', filters.repository);
      if (filters.sentiment) params.append('sentiment', filters.sentiment);
      params.append('page', filters.page.toString());

      const response = await api.get(`/maintainer/pr-reviews?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching PR reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'NEGATIVE':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CHANGES_REQUESTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
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
          PR Reviews
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No PR reviews found. Try syncing from GitHub first.
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
            PR Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sentiment analysis of your pull request reviews
          </p>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(data.sentimentStats).map(([sentiment, count]) => (
            <div key={sentiment} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {sentiment}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {count}
                  </p>
                </div>
                {getSentimentIcon(sentiment)}
              </div>
            </div>
          ))}
        </div>
        <SentimentPieChart 
          data={{
            positive: data.sentimentStats.POSITIVE || 0,
            neutral: data.sentimentStats.NEUTRAL || 0,
            negative: data.sentimentStats.NEGATIVE || 0,
          }}
          title="Sentiment Distribution"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
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
              {/* In a real app, you'd fetch unique repositories */}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sentiment
            </label>
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
              className="input"
            >
              <option value="">All sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {data.reviews.map((review) => (
          <div key={review.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <GitPullRequest className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {review.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(review.state)}`}>
                    {review.state.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                    {review.sentiment}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Code className="w-4 h-4" />
                    <span>{review.repository.language || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Score: {review.sentimentScore.toFixed(2)}</span>
                  </div>
                </div>

                {review.body && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {review.body.length > 200 
                        ? `${review.body.substring(0, 200)}...` 
                        : review.body
                      }
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Repository: {review.repository.fullName}</span>
                  </div>
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <span>View PR</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
            disabled={filters.page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {filters.page} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: Math.min(data.pagination.totalPages, filters.page + 1) })}
            disabled={filters.page === data.pagination.totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PRReviews;
