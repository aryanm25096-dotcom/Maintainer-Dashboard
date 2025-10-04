import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  GitPullRequest, 
  MessageSquare, 
  Users, 
  Star,
  TrendingUp,
  Filter,
  Download,
  Eye,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface RepositoryData {
  repository: string;
  prReviews: number;
  issueTriage: number;
  mentorship: number;
  contributions: number;
  stars: number;
  forks: number;
  contributors: number;
  healthScore: number;
  activityScore: number;
}

interface RepositoryComparisonBarProps {
  data: RepositoryData[];
  title?: string;
  chartType?: 'bar' | 'pie';
  metrics?: string[];
  onRepositoryClick?: (repository: string) => void;
  className?: string;
}

const RepositoryComparisonBar: React.FC<RepositoryComparisonBarProps> = ({
  data,
  title = "Repository Comparison",
  chartType: initialChartType = 'bar',
  metrics = ['prReviews', 'issueTriage', 'mentorship', 'contributions'],
  onRepositoryClick,
  className = ""
}) => {
  const [chartType, setChartType] = useState(initialChartType);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(metrics);
  const [sortBy, setSortBy] = useState<string>('healthScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const COLORS = {
    prReviews: '#3B82F6',
    issueTriage: '#10B981',
    mentorship: '#8B5CF6',
    contributions: '#F59E0B',
    stars: '#EF4444',
    forks: '#06B6D4',
    contributors: '#84CC16',
    healthScore: '#F97316',
    activityScore: '#EC4899'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
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
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          {onRepositoryClick && (
            <button
              onClick={() => onRepositoryClick(label)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>View Repository</span>
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy as keyof RepositoryData] as number;
    const bValue = b[sortBy as keyof RepositoryData] as number;
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const pieData = selectedMetrics.map(metric => ({
    name: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1'),
    value: data.reduce((sum, repo) => sum + (repo[metric as keyof RepositoryData] as number), 0),
    color: COLORS[metric as keyof typeof COLORS]
  }));

  const getChartComponent = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
    }

    return (
      <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="repository" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {selectedMetrics.map(metric => (
          <Bar
            key={metric}
            dataKey={metric}
            fill={COLORS[metric as keyof typeof COLORS]}
            name={metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    );
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          {title}
        </h3>
        
        <div className="flex flex-wrap items-center space-x-4">
          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'pie'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="healthScore">Health Score</option>
              <option value="activityScore">Activity Score</option>
              <option value="prReviews">PR Reviews</option>
              <option value="issueTriage">Issue Triage</option>
              <option value="mentorship">Mentorship</option>
              <option value="contributions">Contributions</option>
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="contributors">Contributors</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <TrendingUp className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap items-center space-x-4 mb-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Metrics:</span>
        {Object.keys(COLORS).map(metric => (
          <button
            key={metric}
            onClick={() => toggleMetric(metric)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedMetrics.includes(metric)
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[metric as keyof typeof COLORS] }}
            />
            <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent()}
        </ResponsiveContainer>
      </div>

      {/* Repository List */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Repository Details
        </h4>
        <div className="space-y-2">
          {sortedData.slice(0, 5).map((repo, index) => (
            <div 
              key={repo.repository}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onRepositoryClick?.(repo.repository)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {repo.repository}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Health: {repo.healthScore.toFixed(1)}% | Activity: {repo.activityScore.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitPullRequest className="w-4 h-4" />
                  <span>{repo.prReviews}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{repo.contributors}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepositoryComparisonBar;
