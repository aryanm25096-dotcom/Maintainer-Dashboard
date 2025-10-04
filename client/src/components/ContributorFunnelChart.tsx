import React, { useState } from 'react';
import { 
  FunnelChart, 
  Funnel, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  LabelList,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Star,
  TrendingUp,
  Filter,
  Download,
  Eye,
  BarChart3,
  Funnel as FunnelIcon
} from 'lucide-react';

interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
  color: string;
  description: string;
  contributors: Array<{
    id: string;
    username: string;
    avatarUrl?: string;
    joinedAt: string;
    lastActivity?: string;
    contributions: number;
  }>;
}

interface ContributorFunnelChartProps {
  data: FunnelData[];
  title?: string;
  chartType?: 'funnel' | 'bar';
  onStageClick?: (stage: string, contributors: any[]) => void;
  onContributorClick?: (contributor: any) => void;
  className?: string;
}

const ContributorFunnelChart: React.FC<ContributorFunnelChartProps> = ({
  data,
  title = "Contributor Journey Funnel",
  chartType: initialChartType = 'funnel',
  onStageClick,
  onContributorClick,
  className = ""
}) => {
  const [chartType, setChartType] = useState(initialChartType);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const COLORS = {
    'First Contact': '#3B82F6',
    'First Contribution': '#10B981',
    'Regular Contributor': '#8B5CF6',
    'Core Contributor': '#F59E0B',
    'Maintainer': '#EF4444'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {data.stage}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Contributors:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {data.value}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Percentage:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {data.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {data.description}
          </p>
          {onStageClick && (
            <button
              onClick={() => onStageClick(data.stage, data.contributors)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" />
              <span>View Contributors</span>
            </button>
          )}
        </div>
      );
    }
    return null;
  };

  const getChartComponent = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="stage" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    return (
      <FunnelChart>
        <Funnel
          dataKey="value"
          data={data}
          isAnimationActive={true}
        >
          <LabelList position="center" fill="#fff" stroke="none" />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Funnel>
        <Tooltip content={<CustomTooltip />} />
      </FunnelChart>
    );
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'First Contact': return <UserPlus className="w-4 h-4" />;
      case 'First Contribution': return <Star className="w-4 h-4" />;
      case 'Regular Contributor': return <Users className="w-4 h-4" />;
      case 'Core Contributor': return <UserCheck className="w-4 h-4" />;
      case 'Maintainer': return <TrendingUp className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getConversionRate = (currentIndex: number) => {
    if (currentIndex === 0) return 100;
    const current = data[currentIndex]?.value || 0;
    const previous = data[currentIndex - 1]?.value || 0;
    return previous > 0 ? (current / previous) * 100 : 0;
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          {title}
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('funnel')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'funnel'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <FunnelIcon className="w-4 h-4" />
            </button>
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
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent()}
        </ResponsiveContainer>
      </div>

      {/* Stage Details */}
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Journey Stages
        </h4>
        <div className="space-y-3">
          {data.map((stage, index) => (
            <div 
              key={stage.stage}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedStage === stage.stage
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => {
                setSelectedStage(selectedStage === stage.stage ? null : stage.stage);
                onStageClick?.(stage.stage, stage.contributors);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: stage.color }}
                  >
                    {getStageIcon(stage.stage)}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {stage.stage}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stage.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stage.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stage.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Conversion Rate */}
              {index > 0 && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                    <span className={`font-medium ${
                      getConversionRate(index) >= 50 
                        ? 'text-green-600' 
                        : getConversionRate(index) >= 25 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {getConversionRate(index).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(getConversionRate(index), 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Contributors List (if selected) */}
              {selectedStage === stage.stage && stage.contributors.length > 0 && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Contributors ({stage.contributors.length})
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stage.contributors.slice(0, 6).map((contributor) => (
                      <div 
                        key={contributor.id}
                        className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => onContributorClick?.(contributor)}
                      >
                        {contributor.avatarUrl ? (
                          <img
                            src={contributor.avatarUrl}
                            alt={contributor.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {contributor.username}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {contributor.contributions} contributions
                          </div>
                        </div>
                      </div>
                    ))}
                    {stage.contributors.length > 6 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        +{stage.contributors.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data[0]?.value || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data[data.length - 1]?.value || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Became Maintainers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.length > 1 ? getConversionRate(data.length - 1).toFixed(1) : '0.0'}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((sum, stage) => sum + stage.value, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Contributors</div>
        </div>
      </div>
    </div>
  );
};

export default ContributorFunnelChart;
