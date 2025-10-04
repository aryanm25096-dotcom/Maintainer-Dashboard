import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SentimentPieChartProps {
  data: {
    positive: number;
    neutral: number;
    negative: number;
  };
  title?: string;
  className?: string;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data, title = "Sentiment Distribution", className = "" }) => {
  const chartData = [
    { name: 'Positive', value: data.positive, color: '#10B981' },
    { name: 'Neutral', value: data.neutral, color: '#6B7280' },
    { name: 'Negative', value: data.negative, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const total = data.positive + data.neutral + data.negative;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.name}: {data.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">{data.positive}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">{data.neutral}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Neutral</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{data.negative}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Negative</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentPieChart;
