import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { 
  Calendar, 
  GitPullRequest, 
  MessageSquare, 
  Users, 
  Star,
  TrendingUp,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface ActivityData {
  date: string;
  prReviews: number;
  issueTriage: number;
  mentorship: number;
  contributions: number;
  total: number;
}

interface ActivityTimelineChartProps {
  data: ActivityData[];
  title?: string;
  type?: 'area' | 'line' | 'bar';
  showLegend?: boolean;
  showTotal?: boolean;
  onDataPointClick?: (data: any) => void;
  className?: string;
}

const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({
  data,
  title = "Maintainer Activity Timeline",
  type = 'area',
  showLegend = true,
  showTotal = true,
  onDataPointClick,
  className = ""
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState({
    prReviews: true,
    issueTriage: true,
    mentorship: true,
    contributions: true,
    total: showTotal
  });

  const [timeRange, setTimeRange] = useState('30days');
  const [chartType, setChartType] = useState(type);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
          {onDataPointClick && (
            <button
              onClick={() => onDataPointClick({ date: label, data: payload })}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>View Details</span>
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric as keyof typeof prev]
    }));
  };

  const getChartComponent = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatDate}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedMetrics.prReviews && (
              <Area
                type="monotone"
                dataKey="prReviews"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="PR Reviews"
              />
            )}
            {selectedMetrics.issueTriage && (
              <Area
                type="monotone"
                dataKey="issueTriage"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Issue Triage"
              />
            )}
            {selectedMetrics.mentorship && (
              <Area
                type="monotone"
                dataKey="mentorship"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Mentorship"
              />
            )}
            {selectedMetrics.contributions && (
              <Area
                type="monotone"
                dataKey="contributions"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.6}
                name="Contributions"
              />
            )}
            {selectedMetrics.total && (
              <Area
                type="monotone"
                dataKey="total"
                stackId="2"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.3}
                name="Total"
                strokeDasharray="5 5"
              />
            )}
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatDate}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedMetrics.prReviews && (
              <Line
                type="monotone"
                dataKey="prReviews"
                stroke="#3B82F6"
                strokeWidth={2}
                name="PR Reviews"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            )}
            {selectedMetrics.issueTriage && (
              <Line
                type="monotone"
                dataKey="issueTriage"
                stroke="#10B981"
                strokeWidth={2}
                name="Issue Triage"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            )}
            {selectedMetrics.mentorship && (
              <Line
                type="monotone"
                dataKey="mentorship"
                stroke="#8B5CF6"
                strokeWidth={2}
                name="Mentorship"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            )}
            {selectedMetrics.contributions && (
              <Line
                type="monotone"
                dataKey="contributions"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Contributions"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            )}
            {selectedMetrics.total && (
              <Line
                type="monotone"
                dataKey="total"
                stroke="#EF4444"
                strokeWidth={3}
                name="Total"
                strokeDasharray="5 5"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }}
              />
            )}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatDate}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {selectedMetrics.prReviews && (
              <Bar dataKey="prReviews" fill="#3B82F6" name="PR Reviews" />
            )}
            {selectedMetrics.issueTriage && (
              <Bar dataKey="issueTriage" fill="#10B981" name="Issue Triage" />
            )}
            {selectedMetrics.mentorship && (
              <Bar dataKey="mentorship" fill="#8B5CF6" name="Mentorship" />
            )}
            {selectedMetrics.contributions && (
              <Bar dataKey="contributions" fill="#F59E0B" name="Contributions" />
            )}
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          {title}
        </h3>
        
        <div className="flex flex-wrap items-center space-x-4">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="area">Area</option>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7days">7 days</option>
              <option value="30days">30 days</option>
              <option value="90days">90 days</option>
              <option value="1year">1 year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap items-center space-x-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</span>
        {Object.entries(selectedMetrics).map(([key, value]) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              value
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {value ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent()}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.prReviews, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total PR Reviews</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.issueTriage, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Issues Triaged</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.reduce((sum, item) => sum + item.mentorship, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mentorship Activities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((sum, item) => sum + item.contributions, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contributions</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimelineChart;
