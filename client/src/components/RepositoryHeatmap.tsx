import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RepositoryHeatmapData {
  repository: string;
  sentiment: number;
  reviewCount: number;
  averageScore: number;
}

interface RepositoryHeatmapProps {
  data: RepositoryHeatmapData[];
  title?: string;
  className?: string;
}

const RepositoryHeatmap: React.FC<RepositoryHeatmapProps> = ({ 
  data, 
  title = "Repository Sentiment Heatmap", 
  className = "" 
}) => {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return '#10B981'; // Green for positive
    if (sentiment < -0.5) return '#EF4444'; // Red for negative
    return '#6B7280'; // Gray for neutral
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.5) return 'Positive';
    if (sentiment < -0.5) return 'Negative';
    return 'Neutral';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            {data.repository}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reviews: {data.reviewCount}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sentiment: {getSentimentLabel(data.sentiment)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Score: {data.averageScore.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const sortedData = [...data].sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              label={{ value: 'Review Count', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="category" 
              dataKey="repository" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="reviewCount" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSentimentColor(entry.sentiment)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Repositories</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.length}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reviews</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, item) => sum + item.reviewCount, 0)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Sentiment</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.length > 0 
              ? (data.reduce((sum, item) => sum + item.sentiment, 0) / data.length).toFixed(2)
              : '0.00'
            }
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeatmap;
