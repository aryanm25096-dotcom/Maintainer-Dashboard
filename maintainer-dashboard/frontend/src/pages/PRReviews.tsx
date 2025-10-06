import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ExternalLink, MessageSquare, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';

export function PRReviews() {
  const { dashboardData, isLoading, updatePullRequest, loadDashboardData } = useApp();
  const [timeRange, setTimeRange] = useState('30');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (!dashboardData.pullRequests?.length) {
      loadDashboardData();
    }
  }, []);

  // Use real sentiment data from API
  const getSentimentData = () => {
    // Use data from API if available, otherwise calculate from PRs
    if (dashboardData.sentimentData && dashboardData.sentimentData.length > 0) {
      return dashboardData.sentimentData;
    }
    
    // Fallback calculation from PR data
    const prs = dashboardData.pullRequests || [];
    const positive = prs.filter(pr => pr.sentiment === 'positive' || pr.reviewStatus === 'approved').length;
    const neutral = prs.filter(pr => pr.sentiment === 'neutral' || pr.reviewStatus === 'pending').length;
    const negative = prs.filter(pr => pr.sentiment === 'negative' || pr.reviewStatus === 'rejected').length;
    
    return [
      { name: 'Positive', value: positive, color: '#10b981' },
      { name: 'Neutral', value: neutral, color: '#3b82f6' },
      { name: 'Negative', value: negative, color: '#ef4444' },
    ];
  };

  // Generate trend data based on time range
  const generateTrendData = () => {
    const days = parseInt(timeRange);
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Generate mock trend data based on time range
      const positive = Math.floor(Math.random() * 20) + 30;
      const neutral = Math.floor(Math.random() * 15) + 20;
      const negative = Math.floor(Math.random() * 10) + 5;
      
      data.push({
        month: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : month,
        positive,
        neutral,
        negative
      });
    }
    
    return data;
  };

  // Use real personality data from API
  const getPersonalityData = () => {
    // Use data from API if available, otherwise use default
    if (dashboardData.personalityData && dashboardData.personalityData.length > 0) {
      return dashboardData.personalityData;
    }
    
    // Default personality data
    return [
      { trait: 'Helpful', value: 85 },
      { trait: 'Direct', value: 92 },
      { trait: 'Constructive', value: 78 },
    ];
  };

  // Handle PR status update
  const handlePRUpdate = async (prId, status) => {
    setIsUpdating(true);
    try {
      await updatePullRequest(prId, { reviewStatus: status });
      toast.success(`PR ${prId} ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update PR status');
    } finally {
      setIsUpdating(false);
    }
  };

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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const sentimentData = getSentimentData();
  const personalityData = getPersonalityData();
  const trendData = generateTrendData();
  const recentReviews = dashboardData.pullRequests || [];

  if (isLoading && !dashboardData.pullRequests?.length) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading PR reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PR Reviews Analytics</h1>
          <p className="text-muted-foreground">Analyze your code review patterns and sentiment</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {sentimentData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintainer Personality Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={personalityData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: 'hsl(var(--foreground))' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Radar name="Your Score" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map(review => (
                <div key={review.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">#{review.id}</span>
                      <Badge variant={
                        review.reviewStatus === 'approved' ? 'default' : 
                        review.reviewStatus === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {review.reviewStatus || 'pending'}
                      </Badge>
                      {getStatusIcon(review.reviewStatus)}
                    </div>
                    <p className="font-medium">{review.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{review.repo}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {review.comments || 0} comments
                      </span>
                      <span>{formatTimeAgo(review.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.reviewStatus === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePRUpdate(review.id, 'approved')}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePRUpdate(review.id, 'rejected')}
                          disabled={isUpdating}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No pull requests found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
