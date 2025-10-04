import React from 'react';
import { TrendingUp, TrendingDown, Star, GitFork, AlertCircle, GitPullRequest, Users, Activity } from 'lucide-react';

interface RepositoryHealthData {
  repositoryId: string;
  repositoryName: string;
  beforeMetrics: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
    activityScore: number;
  };
  afterMetrics: {
    stars: number;
    forks: number;
    issues: number;
    pullRequests: number;
    contributors: number;
    activityScore: number;
  };
  improvement: {
    starsGrowth: number;
    forksGrowth: number;
    issuesResolved: number;
    prsMerged: number;
    contributorGrowth: number;
    activityGrowth: number;
  };
  healthScore: number;
}

interface RepositoryHealthBeforeAfterProps {
  data: RepositoryHealthData[];
  className?: string;
}

const RepositoryHealthBeforeAfter: React.FC<RepositoryHealthBeforeAfterProps> = ({
  data,
  className = ""
}) => {
  const getImprovementIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  const getImprovementColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    if (score >= 40) return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
    return 'text-red-600 bg-red-100 dark:bg-red-900';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Repository Health Analysis
      </h3>
      
      <div className="space-y-6">
        {data.map((repo, index) => (
          <div key={repo.repositoryId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {repo.repositoryName}
              </h4>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(repo.healthScore)}`}>
                {getHealthScoreLabel(repo.healthScore)} ({repo.healthScore.toFixed(0)}%)
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Metrics */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Before Maintainer Involvement
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Stars</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Forks</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.forks.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.issues.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitPullRequest className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">PRs</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.pullRequests.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Contributors</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.contributors.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Activity Score</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {repo.beforeMetrics.activityScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* After Metrics */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  After Maintainer Involvement
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Stars</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.stars.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.starsGrowth)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.starsGrowth)}`}>
                          {repo.improvement.starsGrowth > 0 ? '+' : ''}{repo.improvement.starsGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Forks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.forks.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.forksGrowth)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.forksGrowth)}`}>
                          {repo.improvement.forksGrowth > 0 ? '+' : ''}{repo.improvement.forksGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.issues.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.issuesResolved)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.issuesResolved)}`}>
                          {repo.improvement.issuesResolved > 0 ? '-' : '+'}{Math.abs(repo.improvement.issuesResolved)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GitPullRequest className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">PRs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.pullRequests.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.prsMerged)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.prsMerged)}`}>
                          {repo.improvement.prsMerged > 0 ? '+' : ''}{repo.improvement.prsMerged}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Contributors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.contributors.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.contributorGrowth)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.contributorGrowth)}`}>
                          {repo.improvement.contributorGrowth > 0 ? '+' : ''}{repo.improvement.contributorGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Activity Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {repo.afterMetrics.activityScore.toFixed(1)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getImprovementIcon(repo.improvement.activityGrowth)}
                        <span className={`text-sm font-medium ${getImprovementColor(repo.improvement.activityGrowth)}`}>
                          {repo.improvement.activityGrowth > 0 ? '+' : ''}{repo.improvement.activityGrowth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, repo) => sum + repo.improvement.issuesResolved, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Issues Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, repo) => sum + repo.improvement.prsMerged, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">PRs Merged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {data.reduce((sum, repo) => sum + repo.improvement.contributorGrowth, 0) / data.length}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Contributor Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {data.reduce((sum, repo) => sum + repo.healthScore, 0) / data.length}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Health Score</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryHealthBeforeAfter;
