import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  HandHeart,
  Star,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api';

interface MentorshipActivity {
  id: string;
  type: 'REVIEW' | 'COMMENT' | 'GUIDANCE' | 'COLLABORATION';
  description: string;
  mentee?: string;
  url?: string;
  impact?: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
}

interface TypeStats {
  REVIEW: number;
  COMMENT: number;
  GUIDANCE: number;
  COLLABORATION: number;
}

interface ImpactStats {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
  UNKNOWN: number;
}

interface MentorshipData {
  activities: MentorshipActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  typeStats: TypeStats;
  impactStats: ImpactStats;
}

const MentorshipActivities: React.FC = () => {
  const [data, setData] = useState<MentorshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    impact: '',
    page: 1,
  });

  useEffect(() => {
    fetchMentorshipActivities();
  }, [filters]);

  const fetchMentorshipActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.impact) params.append('impact', filters.impact);
      params.append('page', filters.page.toString());

      const response = await api.get(`/maintainer/mentorship?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching mentorship activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'GUIDANCE':
        return <HandHeart className="w-4 h-4 text-purple-600" />;
      case 'COLLABORATION':
        return <Users className="w-4 h-4 text-orange-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'COMMENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'GUIDANCE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'COLLABORATION':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getImpactIcon = (impact?: string) => {
    switch (impact) {
      case 'HIGH':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'MEDIUM':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'LOW':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'HIGH':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
          Mentorship Activities
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No mentorship activities found. Try syncing from GitHub first.
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
            Mentorship Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your mentorship and community guidance activities
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Type Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Types
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.typeStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(type)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {type}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Impact Levels
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.impactStats).map(([impact, count]) => (
              <div key={impact} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getImpactIcon(impact)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {impact}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">All types</option>
              <option value="REVIEW">Review</option>
              <option value="COMMENT">Comment</option>
              <option value="GUIDANCE">Guidance</option>
              <option value="COLLABORATION">Collaboration</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Impact Level
            </label>
            <select
              value={filters.impact}
              onChange={(e) => setFilters({ ...filters, impact: e.target.value })}
              className="input"
            >
              <option value="">All impacts</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {data.activities.map((activity) => (
          <div key={activity.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(activity.type)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {activity.type}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                    {activity.type}
                  </span>
                  {activity.impact && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(activity.impact)}`}>
                      {activity.impact} IMPACT
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                  </div>
                  {activity.mentee && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Mentee: {activity.mentee}</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Created: {new Date(activity.createdAt).toLocaleString()}</span>
                  </div>
                  {activity.url && (
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <span>View Activity</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
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

export default MentorshipActivities;
