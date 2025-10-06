import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { GitPullRequest, AlertCircle, Users, Clock, RefreshCw, Download, Share2, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import apiService from '../services/apiService';

export function Overview() {
  const { 
    dashboardData, 
    isLoading, 
    loadDashboardData, 
    user 
  } = useApp();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (!dashboardData.metrics.totalPRReviews) {
      loadDashboardData();
    }
  }, []);

  // Handle data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboardData();
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle export report
  const handleExport = async (format = 'json') => {
    try {
      const data = await apiService.exportDashboardData(user?.username, format);
      
      if (format === 'csv') {
        // Download CSV file
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maintainer-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('CSV report exported successfully');
      } else if (format === 'pdf') {
        // For PDF, show a message (in real app, implement PDF generation)
        toast.success('PDF export would be implemented with jsPDF library');
      } else {
        // JSON export
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maintainer-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('JSON report exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  // Handle share profile
  const handleShare = async () => {
    try {
      const shareUrl = apiService.generateShareableLink(user?.username);
      const success = await apiService.copyToClipboard(shareUrl);
      
      if (success) {
        toast.success('Profile link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (error) {
      toast.error('Failed to share profile');
    }
  };

  // Format metrics data
  const metrics = [
    {
      title: 'Total PR Reviews',
      value: dashboardData.metrics.totalPRReviews?.toLocaleString() || '0',
      change: '+12% from last month',
      icon: GitPullRequest,
      color: 'text-chart-1',
    },
    {
      title: 'Issues Triaged',
      value: dashboardData.metrics.issuesTriaged?.toLocaleString() || '0',
      change: '+8% from last month',
      icon: AlertCircle,
      color: 'text-chart-2',
    },
    {
      title: 'Contributors Mentored',
      value: dashboardData.metrics.contributorsMentored?.toLocaleString() || '0',
      change: '+24% from last month',
      icon: Users,
      color: 'text-chart-3',
    },
    {
      title: 'Avg Response Time',
      value: `${dashboardData.metrics.avgResponseTime || 0}h`,
      change: '-15% from last month',
      icon: Clock,
      color: 'text-chart-4',
    },
  ];

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  if (isLoading && !dashboardData.metrics.totalPRReviews) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here's your maintainer activity summary.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync Data'}
          </Button>
          <div className="flex gap-1">
            <Button variant="outline" onClick={() => handleExport('json')}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity and Top Repositories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity?.length > 0 ? (
                dashboardData.recentActivity.map((activity, i) => (
                  <div key={activity.id || i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === 'review' ? 'bg-chart-1' : 
                      activity.type === 'triage' ? 'bg-chart-2' : 'bg-chart-3'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.repo}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Repositories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topRepositories?.length > 0 ? (
                dashboardData.topRepositories.map((repo, i) => (
                  <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{repo.name}</p>
                      <span className="text-xs text-muted-foreground">{repo.stars} ⭐</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{repo.reviews} reviews</span>
                      <span>{repo.issues} issues</span>
                    </div>
                    {repo.language && (
                      <div className="mt-1">
                        <span className="text-xs bg-muted px-2 py-1 rounded">{repo.language}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No repositories found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
