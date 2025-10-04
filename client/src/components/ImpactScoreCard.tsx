import React from 'react';
import { TrendingUp, Users, GitPullRequest, Star, Target, Zap } from 'lucide-react';

interface ImpactScoreCardProps {
  score: number;
  title: string;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

const ImpactScoreCard: React.FC<ImpactScoreCardProps> = ({
  score,
  title,
  subtitle,
  trend,
  icon,
  color = 'blue',
  className = ''
}) => {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        icon: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-600 dark:text-purple-400',
        icon: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900',
        text: 'text-orange-600 dark:text-orange-400',
        icon: 'text-orange-600'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400',
        icon: 'text-red-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    return 'Needs Improvement';
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
            {icon || <Target className={`w-6 h-6 ${colorClasses.icon}`} />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-sm font-medium">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score.toFixed(0)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {getScoreLabel(score)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${colorClasses.text.replace('text-', 'bg-')}`}
            style={{ width: `${Math.min(score, 100)}%` }}
          ></div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">Current</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {score.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 dark:text-gray-400">Target</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              85.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactScoreCard;
