import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { 
  Users, 
  Star, 
  GitPullRequest, 
  MessageSquare, 
  Award, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface MentorshipActivity {
  id: string;
  type: 'REVIEW' | 'COMMENT' | 'GUIDANCE' | 'COLLABORATION';
  description: string;
  mentee?: string;
  url?: string;
  impact?: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  contributor?: {
    githubUsername: string;
    name?: string;
    avatarUrl?: string;
  };
}

interface MentorshipSuccessTimelineProps {
  activities: MentorshipActivity[];
  title?: string;
  className?: string;
}

const MentorshipSuccessTimeline: React.FC<MentorshipSuccessTimelineProps> = ({
  activities,
  title = "Mentorship Success Timeline",
  className = ""
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return <GitPullRequest className="w-4 h-4" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4" />;
      case 'GUIDANCE':
        return <Users className="w-4 h-4" />;
      case 'COLLABORATION':
        return <Award className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'REVIEW':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'COMMENT':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
      case 'GUIDANCE':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      case 'COLLABORATION':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'HIGH':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group activities by date for better timeline display
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = new Date(activity.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, MentorshipActivity[]>);

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No mentorship activities found yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date}>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-500" />
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
              </div>

              <div className="space-y-4">
                {dayActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < dayActivities.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2"></div>
                      )}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.type}
                          </span>
                          {activity.impact && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(activity.impact)}`}>
                              {activity.impact} IMPACT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(activity.createdAt)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {activity.description}
                      </p>

                      {activity.contributor && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-2">
                            {activity.contributor.avatarUrl ? (
                              <img
                                src={activity.contributor.avatarUrl}
                                alt={activity.contributor.githubUsername}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.contributor.name || activity.contributor.githubUsername}
                            </span>
                          </div>
                        </div>
                      )}

                      {activity.url && (
                        <a
                          href={activity.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span>View Activity</span>
                          <TrendingUp className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {activities.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activities.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.impact === 'HIGH').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(activities.map(a => a.contributor?.githubUsername).filter(Boolean)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique Mentees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {activities.filter(a => a.type === 'GUIDANCE').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Guidance Sessions</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipSuccessTimeline;
