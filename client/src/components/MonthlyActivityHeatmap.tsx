import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';

interface ActivityData {
  date: string;
  value: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  type: 'pr_review' | 'issue_triage' | 'mentorship' | 'contribution';
  description?: string;
}

interface MonthlyActivityHeatmapProps {
  data: ActivityData[];
  title?: string;
  year?: number;
  month?: number;
  onDayClick?: (data: ActivityData[]) => void;
  className?: string;
}

const MonthlyActivityHeatmap: React.FC<MonthlyActivityHeatmapProps> = ({
  data,
  title = "Monthly Activity Heatmap",
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  onDayClick,
  className = ""
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  // Generate calendar data for the month
  const calendarData = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const calendar: Array<{
      day: number;
      date: string;
      activities: ActivityData[];
      totalValue: number;
      maxValue: number;
      sentiment: 'positive' | 'neutral' | 'negative';
    }> = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push({
        day: 0,
        date: '',
        activities: [],
        totalValue: 0,
        maxValue: 0,
        sentiment: 'neutral'
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayActivities = data.filter(activity => activity.date === date);
      
      const totalValue = dayActivities.reduce((sum, activity) => sum + activity.value, 0);
      const maxValue = Math.max(...data.map(d => d.value), 1);
      const sentiment = dayActivities.length > 0 
        ? dayActivities[dayActivities.length - 1].sentiment 
        : 'neutral';

      calendar.push({
        day,
        date,
        activities: dayActivities,
        totalValue,
        maxValue,
        sentiment
      });
    }

    return calendar;
  }, [data, year, month]);

  const getIntensityColor = (value: number, maxValue: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = value / maxValue;
    if (intensity <= 0.2) return 'bg-green-200 dark:bg-green-900';
    if (intensity <= 0.4) return 'bg-green-300 dark:bg-green-800';
    if (intensity <= 0.6) return 'bg-green-400 dark:bg-green-700';
    if (intensity <= 0.8) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-600 dark:bg-green-500';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-500';
      case 'negative': return 'border-red-500';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pr_review': return <GitPullRequest className="w-3 h-3" />;
      case 'issue_triage': return <MessageSquare className="w-3 h-3" />;
      case 'mentorship': return <Users className="w-3 h-3" />;
      case 'contribution': return <Star className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(activity => {
      const typeMatch = selectedType === 'all' || activity.type === selectedType;
      const sentimentMatch = selectedSentiment === 'all' || activity.sentiment === selectedSentiment;
      return typeMatch && sentimentMatch;
    });
  }, [data, selectedType, selectedSentiment]);

  const handleDayClick = (dayData: any) => {
    if (onDayClick && dayData.activities.length > 0) {
      onDayClick(dayData.activities);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">
          {title}
        </h3>
        
        <div className="flex flex-wrap items-center space-x-4">
          {/* Activity Type Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Activities</option>
              <option value="pr_review">PR Reviews</option>
              <option value="issue_triage">Issue Triage</option>
              <option value="mentorship">Mentorship</option>
              <option value="contribution">Contributions</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sentiment:</span>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Month Header */}
      <div className="text-center mb-4">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
          {monthNames[month - 1]} {year}
        </h4>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all hover:scale-105
                ${day.day === 0 
                  ? 'bg-transparent border-transparent' 
                  : day.activities.length > 0
                    ? `${getIntensityColor(day.totalValue, day.maxValue)} ${getSentimentColor(day.sentiment)} hover:shadow-lg`
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => day.day > 0 && handleDayClick(day)}
            >
              {day.day > 0 && (
                <>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                    {day.day}
                  </div>
                  {day.activities.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      {day.activities.slice(0, 3).map((activity, activityIndex) => (
                        <div key={activityIndex} className="text-gray-600 dark:text-gray-400">
                          {getActivityIcon(activity.type)}
                        </div>
                      ))}
                      {day.activities.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{day.activities.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Level:</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">No activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sentiment:</span>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-green-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Positive</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-red-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Negative</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.filter(d => d.sentiment === 'positive').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {filteredData.filter(d => d.sentiment === 'neutral').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Neutral</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredData.filter(d => d.sentiment === 'negative').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Negative</div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyActivityHeatmap;
