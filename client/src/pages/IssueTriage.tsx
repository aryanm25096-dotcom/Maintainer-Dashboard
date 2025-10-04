import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Tag, 
  User, 
  CheckCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  GitBranch
} from 'lucide-react';
import api from '../utils/api';

interface IssueTriage {
  id: string;
  action: 'LABELED' | 'ASSIGNED' | 'COMMENTED' | 'CLOSED';
  label?: string;
  assignee?: string;
  comment?: string;
  createdAt: string;
  issue: {
    number: number;
    title: string;
    state: 'OPEN' | 'CLOSED';
    url: string;
    repository: {
      name: string;
      fullName: string;
    };
  };
}

interface ActionStats {
  LABELED: number;
  ASSIGNED: number;
  COMMENTED: number;
  CLOSED: number;
}

interface IssueTriageData {
  triage: IssueTriage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  actionStats: ActionStats;
}

const IssueTriage: React.FC = () => {
  const [data, setData] = useState<IssueTriageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    repository: '',
    page: 1,
  });

  useEffect(() => {
    fetchIssueTriage();
  }, [filters]);

  const fetchIssueTriage = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.repository) params.append('repository', filters.repository);
      params.append('page', filters.page.toString());

      const response = await api.get(`/maintainer/issue-triage?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching issue triage:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LABELED':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'ASSIGNED':
        return <User className="w-4 h-4 text-green-600" />;
      case 'COMMENTED':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LABELED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ASSIGNED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMMENTED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CLOSED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStateColor = (state: string) => {
    return state === 'OPEN' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
          Issue Triage
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No issue triage activities found. Try syncing from GitHub first.
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
            Issue Triage
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your issue triage and community management activities
          </p>
        </div>
      </div>

      {/* Action Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(data.actionStats).map(([action, count]) => (
          <div key={action} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {action}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
              </div>
              {getActionIcon(action)}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action Type
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="input"
            >
              <option value="">All actions</option>
              <option value="LABELED">Labeled</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="COMMENTED">Commented</option>
              <option value="CLOSED">Closed</option>
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
              {/* In a real app, you'd fetch unique repositories */}
            </select>
          </div>
        </div>
      </div>

      {/* Triage Activities List */}
      <div className="space-y-4">
        {data.triage.map((triage) => (
          <div key={triage.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getActionIcon(triage.action)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Issue #{triage.issue.number}: {triage.issue.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(triage.action)}`}>
                    {triage.action}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(triage.issue.state)}`}>
                    {triage.issue.state}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{triage.issue.repository.fullName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(triage.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Details */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                  {triage.action === 'LABELED' && triage.label && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Added label: <span className="font-medium">{triage.label}</span>
                      </span>
                    </div>
                  )}
                  
                  {triage.action === 'ASSIGNED' && triage.assignee && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Assigned to: <span className="font-medium">{triage.assignee}</span>
                      </span>
                    </div>
                  )}
                  
                  {triage.action === 'COMMENTED' && triage.comment && (
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Comment: {triage.comment.length > 200 
                            ? `${triage.comment.substring(0, 200)}...` 
                            : triage.comment
                          }
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {triage.action === 'CLOSED' && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Issue was closed
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Repository: {triage.issue.repository.fullName}</span>
                  </div>
                  <a
                    href={triage.issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center space-x-1"
                  >
                    <span>View Issue</span>
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

export default IssueTriage;
