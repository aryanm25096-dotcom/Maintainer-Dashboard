import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Heart, 
  MessageSquare, 
  Users, 
  BarChart3,
  Calendar,
  Repository,
  Loader2,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import apiService from '../services/apiService';

export function SentimentAnalysis() {
  const { user, isLoading } = useApp();
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [timeRange, setTimeRange] = useState('30');

  // Load sentiment analysis data
  useEffect(() => {
    const loadSentimentData = async () => {
      if (user?.username) {
        setIsLoadingData(true);
        try {
          const response = await apiService.fetchAPI(`/sentiment/analysis?username=${user.username}`);
          if (response.success) {
            setSentimentData(response.data);
          }
        } catch (error) {
          console.error('Error loading sentiment data:', error);
          toast.error('Failed to load sentiment analysis');
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadSentimentData();
  }, [user?.username, timeRange]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoadingData(true);
    try {
      const response = await apiService.fetchAPI(`/sentiment/analysis?username=${user.username}`);
      if (response.success) {
        setSentimentData(response.data);
        toast.success('Sentiment data refreshed');
      }
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle export
  const handleExport = async (format = 'json') => {
    if (!sentimentData) return;

    try {
      const exportData = {
        ...sentimentData,
        exportedAt: new Date().toISOString(),
        username: user?.username
      };

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = [
          ['Date', 'Sentiment', 'Count', 'Positive', 'Negative', 'Neutral'],
          ...sentimentData.trends.map(trend => [
            trend.date,
            trend.sentiment.toFixed(3),
            trend.count,
            trend.positive,
            trend.negative,
            trend.neutral
          ])
        ];
        
        const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Sentiment data exported as CSV');
      } else {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Sentiment data exported as JSON');
      }
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      const shareUrl = apiService.generateShareableLink(user?.username);
      const success = await apiService.copyToClipboard(shareUrl);
      
      if (success) {
        toast.success('Sentiment analysis link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (error) {
      toast.error('Failed to share analysis');
    }
  };

  // Prepare chart data
  const sentimentTrendData = sentimentData?.trends || [];
  const heatmapData = sentimentData?.heatmap || [];
  const personalityData = sentimentData?.personality ? Object.entries(sentimentData.personality).map(([trait, data]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    value: data.average,
    trend: data.trend,
    consistency: data.consistency
  })) : [];

  // Sentiment distribution for pie chart
  const sentimentDistribution = sentimentData?.summary ? [
    { name: 'Positive', value: sentimentData.summary.totalReviews - (sentimentData.summary.totalReviews * 0.3), color: '#10b981' },
    { name: 'Neutral', value: sentimentData.summary.totalReviews * 0.2, color: '#3b82f6' },
    { name: 'Negative', value: sentimentData.summary.totalReviews * 0.1, color: '#ef4444' }
  ] : [];

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Analyzing sentiment data...</span>
        </div>
      </div>
    );
  }

  if (!sentimentData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">No sentiment data available</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Load Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
          <p className="text-muted-foreground">Analyze your maintainer personality and communication patterns</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoadingData}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            Refresh
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
          </div>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentData.summary.totalReviews}</div>
            <p className="text-xs text-muted-foreground">Analyzed comments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Avg Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sentimentData.summary.averageSentiment > 0 ? '+' : ''}
              {sentimentData.summary.averageSentiment.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {sentimentData.summary.averageSentiment > 0.1 ? 'Positive' : 
               sentimentData.summary.averageSentiment < -0.1 ? 'Negative' : 'Neutral'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Repository className="h-4 w-4" />
              Most Positive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {sentimentData.summary.mostPositiveRepo?.repository || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {sentimentData.summary.mostPositiveRepo?.averageSentiment?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sentiment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {sentimentTrendData.length > 1 ? 
                (sentimentTrendData[sentimentTrendData.length - 1].sentiment > sentimentTrendData[0].sentiment ? 
                  <TrendingUp className="h-5 w-5 text-green-500" /> : 
                  <TrendingDown className="h-5 w-5 text-red-500" />) : 
                <div className="h-5 w-5" />
              }
            </div>
            <p className="text-xs text-muted-foreground">30-day trend</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Sentiment Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Review Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Maintainer Personality Traits</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={personalityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Personality"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Repository Sentiment Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Repository Sentiment Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="repository" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" fill="#10b981" name="Positive" />
                <Bar dataKey="neutral" fill="#3b82f6" name="Neutral" />
                <Bar dataKey="negative" fill="#ef4444" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Personality Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Personality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalityData.map((trait) => (
              <div key={trait.trait} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{trait.trait}</h3>
                  <Badge variant={trait.trend === 'increasing' ? 'default' : trait.trend === 'decreasing' ? 'destructive' : 'secondary'}>
                    {trait.trend}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{trait.value}%</div>
                <div className="text-sm text-muted-foreground">
                  Consistency: {trait.consistency}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${trait.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}