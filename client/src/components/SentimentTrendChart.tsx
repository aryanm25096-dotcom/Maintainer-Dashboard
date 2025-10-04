import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SentimentTrend {
  period: string;
  positive: number;
  neutral: number;
  negative: number;
  averageScore: number;
}

interface SentimentTrendChartProps {
  data: SentimentTrend[];
  title?: string;
  className?: string;
}

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ 
  data, 
  title = "Sentiment Trends", 
  className = "" 
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatPeriod = (period: string) => {
    // Format period for display
    if (period.includes('W')) {
      return `Week ${period.split('W')[1]}`;
    }
    if (period.includes('-')) {
      const [year, month] = period.split('-');
      return `${year}-${month}`;
    }
    return period;
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatPeriod}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="#10B981"
              strokeWidth={2}
              name="Positive"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#6B7280"
              strokeWidth={2}
              name="Neutral"
              dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="#EF4444"
              strokeWidth={2}
              name="Negative"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#3B82F6"
              strokeWidth={3}
              name="Average Score"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Positive</div>
          <div className="text-lg font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.positive, 0)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Neutral</div>
          <div className="text-lg font-bold text-gray-600">
            {data.reduce((sum, item) => sum + item.neutral, 0)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Negative</div>
          <div className="text-lg font-bold text-red-600">
            {data.reduce((sum, item) => sum + item.negative, 0)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
          <div className="text-lg font-bold text-blue-600">
            {data.length > 0 
              ? (data.reduce((sum, item) => sum + item.averageScore, 0) / data.length).toFixed(1)
              : '0.0'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
