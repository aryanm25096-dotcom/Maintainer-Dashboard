import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface ContributorRetentionData {
  period: string;
  newContributors: number;
  returningContributors: number;
  retentionRate: number;
  totalContributors: number;
}

interface ContributorRetentionChartProps {
  data: ContributorRetentionData[];
  title?: string;
  type?: 'bar' | 'line';
  className?: string;
}

const ContributorRetentionChart: React.FC<ContributorRetentionChartProps> = ({
  data,
  title = "Contributor Retention Analysis",
  type = 'bar',
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
              {entry.dataKey === 'retentionRate' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatPeriod = (period: string) => {
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
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatPeriod}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="newContributors" 
                fill="#3B82F6" 
                name="New Contributors"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="returningContributors" 
                fill="#10B981" 
                name="Returning Contributors"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
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
                dataKey="newContributors"
                stroke="#3B82F6"
                strokeWidth={2}
                name="New Contributors"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="returningContributors"
                stroke="#10B981"
                strokeWidth={2}
                name="Returning Contributors"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="retentionRate"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Retention Rate %"
                strokeDasharray="5 5"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.newContributors, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total New</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.returningContributors, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Returning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.length > 0 
              ? (data.reduce((sum, item) => sum + item.retentionRate, 0) / data.length).toFixed(1)
              : '0.0'
            }%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Retention</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {data.reduce((sum, item) => sum + item.totalContributors, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Contributors</div>
        </div>
      </div>
    </div>
  );
};

export default ContributorRetentionChart;
