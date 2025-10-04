import React from 'react';
import { Loader2, BarChart3, Users, GitPullRequest, Star } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  type?: 'default' | 'dashboard' | 'chart' | 'profile';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  type = 'default',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-8 h-8';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'dashboard': return <BarChart3 className={getSizeClasses()} />;
      case 'chart': return <GitPullRequest className={getSizeClasses()} />;
      case 'profile': return <Users className={getSizeClasses()} />;
      default: return <Loader2 className={`${getSizeClasses()} animate-spin`} />;
    }
  };

  const getText = () => {
    if (text) return text;
    
    switch (type) {
      case 'dashboard': return 'Loading dashboard...';
      case 'chart': return 'Loading chart data...';
      case 'profile': return 'Loading profile...';
      default: return 'Loading...';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {type === 'default' ? (
          <Loader2 className={`${getSizeClasses()} animate-spin text-primary-600`} />
        ) : (
          <div className="relative">
            {getIcon()}
            <div className="absolute inset-0 animate-ping">
              <div className={`${getSizeClasses()} rounded-full bg-primary-200 dark:bg-primary-800 opacity-75`} />
            </div>
          </div>
        )}
      </div>
      
      {getText() && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {getText()}
          </p>
          {type === 'dashboard' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Fetching your maintainer data...
            </p>
          )}
          {type === 'chart' && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Processing analytics...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
