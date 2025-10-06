import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Star, 
  GitFork, 
  Target, 
  Award,
  Calendar,
  BarChart3,
  Loader2,
  RefreshCw,
  Download,
  Share2,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import apiService from '../services/apiService';

export function CommunityImpact() {
  const { user, isLoading } = useApp();
  const [impactData, setImpactData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load community impact data
  useEffect(() => {
    const loadImpactData = async () => {
      if (user?.username) {
        setIsLoadingData(true);
        try {
          const response = await apiService.fetchAPI(`/community/impact?username=${user.username}`);
          if (response.success) {
            setImpactData(response.data);
          }
        } catch (error) {
          console.error('Error loading impact data:', error);
          toast.error('Failed to load community impact data');
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadImpactData();
  }, [user?.username]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoadingData(true);
    try {
      const response = await apiService.fetchAPI(`/community/impact?username=${user.username}`);
      if (response.success) {
        setImpactData(response.data);
        toast.success('Impact data refreshed');
      }
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle export
  const handleExport = async (format = 'json') => {
    if (!impactData) return;

    try {
      const exportData = {
        ...impactData,
        exportedAt: new Date().toISOString(),
        username: user?.username
      };

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = [
          ['Metric', 'Value', 'Trend'],
          ['Overall Impact Score', impactData.overallImpact.score, impactData.overallImpact.level],
          ['First-time Contributors', impactData.firstTimeContributors.total, impactData.firstTimeContributors.growthRate + '%'],
          ['Retention Rate', impactData.retentionRates.overall.toFixed(1) + '%', impactData.retentionRates.trend],
          ['Repository Health', impactData.repositoryHealth.averageHealth.toFixed(1), impactData.repositoryHealth.healthTrend],
          ['Mentorship Score', impactData.mentorshipEffectiveness.score, 'N/A']
        ];
        
        const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `community-impact-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Impact data exported as CSV');
      } else {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `community-impact-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Impact data exported as JSON');
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
        toast.success('Community impact link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (error) {
      toast.error('Failed to share impact data');
    }
  };

  // Prepare chart data
  const retentionData = impactData?.retentionRates?.byRepository ? 
    Object.entries(impactData.retentionRates.byRepository).map(([repo, data]) => ({
      repository: repo,
      retention: data.rate,
      contributors: data.contributors,
      active: data.activeContributors
    })) : [];

  const healthData = impactData?.repositoryHealth?.improvements || [];
  const contributorData = impactData?.firstTimeContributors?.contributors || [];

  // Impact level colors
  const getImpactLevelColor = (level) => {
    switch (level) {
      case 'Exceptional': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Good': return 'text-yellow-600 bg-yellow-100';
      case 'Moderate': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Calculating community impact...</span>
        </div>
      </div>
    );
  }

  if (!impactData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">No impact data available</p>
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
          <h1 className="text-3xl font-bold">Community Impact</h1>
          <p className="text-muted-foreground">Measure your impact on the open source community</p>
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

      {/* Overall Impact Score */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-8 w-8 text-yellow-500" />
              <h2 className="text-2xl font-bold">Overall Impact Score</h2>
            </div>
            <div className="text-6xl font-bold mb-2">{impactData.overallImpact.score}</div>
            <Badge className={`text-lg px-4 py-2 ${getImpactLevelColor(impactData.overallImpact.level)}`}>
              {impactData.overallImpact.level} Impact
            </Badge>
            <p className="text-muted-foreground mt-4">
              Based on contributor growth, retention rates, repository health, and mentorship effectiveness
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              First-time Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.firstTimeContributors.total}</div>
            <p className="text-xs text-muted-foreground">
              +{impactData.firstTimeContributors.growthRate}% growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.retentionRates.overall.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {impactData.retentionRates.trend} trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Repository Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.repositoryHealth.averageHealth.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {impactData.repositoryHealth.healthTrend} trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4" />
              Mentorship Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impactData.mentorshipEffectiveness.score}</div>
            <p className="text-xs text-muted-foreground">
              {impactData.mentorshipEffectiveness.metrics.menteesHelped} mentees helped
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Rates by Repository */}
        <Card>
          <CardHeader>
            <CardTitle>Retention Rates by Repository</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="repository" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="retention" fill="#3b82f6" name="Retention Rate %" />
                <Bar dataKey="active" fill="#10b981" name="Active Contributors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Repository Health Improvements */}
        <Card>
          <CardHeader>
            <CardTitle>Repository Health Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="healthScore" fill="#10b981" name="Health Score" />
                <Bar dataKey="stars" fill="#fbbf24" name="Stars" />
                <Bar dataKey="forks" fill="#3b82f6" name="Forks" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* First-time Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            First-time Contributors Helped
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributorData.slice(0, 9).map((contributor, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contributor.avatar} alt={contributor.username} />
                  <AvatarFallback>{contributor.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{contributor.username}</div>
                  <div className="text-sm text-muted-foreground">{contributor.repository}</div>
                  <div className="text-xs text-muted-foreground">
                    {contributor.contributions} contributions
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {contributorData.length > 9 && (
            <div className="text-center mt-4">
              <p className="text-muted-foreground">
                And {contributorData.length - 9} more contributors...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mentorship Effectiveness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mentorship Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {impactData.mentorshipEffectiveness.metrics.menteesHelped}
              </div>
              <div className="text-sm text-muted-foreground">Mentees Helped</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {impactData.mentorshipEffectiveness.metrics.successfulContributions}
              </div>
              <div className="text-sm text-muted-foreground">Successful Contributions</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {impactData.mentorshipEffectiveness.metrics.averageResponseTime}h
              </div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {impactData.mentorshipEffectiveness.metrics.satisfactionScore}%
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Score</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Recommendations</h3>
            <div className="space-y-2">
              {impactData.mentorshipEffectiveness.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}