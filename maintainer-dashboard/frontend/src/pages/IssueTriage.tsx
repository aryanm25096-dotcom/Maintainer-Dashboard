import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Filter, Loader2, CheckCircle, XCircle, Clock, AlertCircle, Search, Download, Share2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import apiService from '../services/apiService';

export function IssueTriage() {
  const { dashboardData, isLoading, updateIssue, loadDashboardData, filters, setFilters } = useApp();
  const [timeRange, setTimeRange] = useState('30');
  const [selectedRepo, setSelectedRepo] = useState('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load data on component mount
  useEffect(() => {
    if (!dashboardData.issues?.length) {
      loadDashboardData();
    }
  }, []);

  // Calculate issue type data from real issues
  const calculateIssueTypeData = () => {
    const issues = dashboardData.issues || [];
    const bugCount = issues.filter(issue => issue.labels?.includes('bug')).length;
    const featureCount = issues.filter(issue => issue.labels?.includes('enhancement')).length;
    const supportCount = issues.filter(issue => issue.labels?.includes('question')).length;
    
    return [
      { name: 'Bug', value: bugCount, color: '#ef4444' },
      { name: 'Feature', value: featureCount, color: '#3b82f6' },
      { name: 'Support', value: supportCount, color: '#10b981' },
    ];
  };

  // Generate efficiency data based on time range
  const generateEfficiencyData = () => {
    const days = parseInt(timeRange);
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Generate mock efficiency data
      const avgTime = Math.random() * 2 + 1.5; // 1.5-3.5 hours
      const triaged = Math.floor(Math.random() * 10) + 5; // 5-15 issues
      
      data.push({
        month: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : month,
        avgTime: parseFloat(avgTime.toFixed(1)),
        triaged
      });
    }
    
    return data;
  };

  // Calculate impact metrics from real data
  const calculateImpactMetrics = () => {
    const issues = dashboardData.issues || [];
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === 'closed').length;
    const responseRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;
    
    return [
      { label: 'Community Health', value: 87, target: 90, trend: 'up' },
      { label: 'Response Rate', value: responseRate, target: 95, trend: responseRate >= 95 ? 'up' : 'down' },
      { label: 'Resolution Time', value: 2.1, target: 2.0, trend: 'down', unit: 'days' },
      { label: 'Contributor Satisfaction', value: 4.6, target: 4.5, trend: 'up', unit: '/5' },
    ];
  };

  // Handle issue status update
  const handleIssueUpdate = async (issueId, status) => {
    setIsUpdating(true);
    try {
      await updateIssue(issueId, { status });
      toast.success(`Issue ${issueId} ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update issue status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle priority update
  const handlePriorityUpdate = async (issueId, priority) => {
    setIsUpdating(true);
    try {
      await updateIssue(issueId, { priority });
      toast.success(`Issue ${issueId} priority updated to ${priority}`);
    } catch (error) {
      toast.error('Failed to update issue priority');
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

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Filter and search issues
  const getFilteredIssues = () => {
    let filtered = dashboardData.issues || [];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Repository filter
    if (selectedRepo !== 'all') {
      filtered = filtered.filter(issue => issue.repo === selectedRepo);
    }

    return filtered;
  };

  // Handle export issues
  const handleExportIssues = async (format = 'json') => {
    try {
      const filteredIssues = getFilteredIssues();
      const exportData = {
        issues: filteredIssues,
        filters: {
          search: searchQuery,
          priority: priorityFilter,
          status: statusFilter,
          repository: selectedRepo,
          timeRange: timeRange
        },
        exportedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        const csvData = [
          ['ID', 'Title', 'Repository', 'Author', 'Status', 'Priority', 'Labels', 'Created At', 'Updated At'],
          ...filteredIssues.map(issue => [
            issue.id,
            issue.title,
            issue.repo,
            issue.author,
            issue.status,
            issue.priority,
            issue.labels?.join('; ') || '',
            issue.createdAt,
            issue.updatedAt
          ])
        ];
        
        const csv = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `issues-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Issues exported as CSV');
      } else {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `issues-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Issues exported as JSON');
      }
    } catch (error) {
      toast.error('Failed to export issues');
    }
  };

  // Handle share issues
  const handleShareIssues = async () => {
    try {
      const shareUrl = apiService.generateShareableLink(user?.username);
      const success = await apiService.copyToClipboard(shareUrl);
      
      if (success) {
        toast.success('Issues link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (error) {
      toast.error('Failed to share issues');
    }
  };

  const issueTypeData = calculateIssueTypeData();
  const efficiencyData = generateEfficiencyData();
  const impactMetrics = calculateImpactMetrics();
  const issues = getFilteredIssues();

  if (isLoading && !dashboardData.issues?.length) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading issue data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issue Triage Tracking</h1>
          <p className="text-muted-foreground">Monitor your issue management efficiency</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-sm w-64"
            />
          </div>
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="main">user/main-project</SelectItem>
              <SelectItem value="secondary">user/secondary-repo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Button variant="outline" onClick={() => handleExportIssues('json')}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" onClick={() => handleExportIssues('csv')}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={handleShareIssues}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactMetrics.map(metric => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                {metric.label}
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-chart-1" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}{metric.unit || '%'}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                Target: {metric.target}{metric.unit || '%'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {issueTypeData.map(item => (
                <div key={item.name} className="text-center">
                  <div className="h-3 w-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.value} issues</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Triage Efficiency Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Avg Time (hours)" />
                <Line yAxisId="right" type="monotone" dataKey="triaged" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Issues Triaged" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Triage Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">{issues.length}</p>
              <p className="text-sm text-chart-4">+15% from last month</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Response Time</p>
              <p className="text-3xl font-bold">2.1h</p>
              <p className="text-sm text-chart-4">-12% faster than average</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-3xl font-bold">94%</p>
              <p className="text-sm text-chart-4">Above target of 90%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.length > 0 ? (
              issues.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">#{issue.id}</span>
                      <Badge variant={getPriorityColor(issue.priority)}>
                        {issue.priority || 'medium'}
                      </Badge>
                      <Badge variant={issue.status === 'open' ? 'default' : 'secondary'}>
                        {issue.status}
                      </Badge>
                      {getStatusIcon(issue.status)}
                    </div>
                    <p className="font-medium">{issue.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{issue.repo}</span>
                      <span>{formatTimeAgo(issue.updatedAt)}</span>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex gap-1">
                          {issue.labels.slice(0, 3).map(label => (
                            <Badge key={label} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.status === 'open' && (
                      <>
                        <Select 
                          value={issue.priority || 'medium'} 
                          onValueChange={(value) => handlePriorityUpdate(issue.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleIssueUpdate(issue.id, 'closed')}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Close
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
              <p className="text-muted-foreground text-center py-8">No issues found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
