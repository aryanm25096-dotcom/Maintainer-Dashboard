import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { GitPullRequest, AlertCircle, Users, Clock, RefreshCw, Download, Share2 } from 'lucide-react';

const metrics = [
  {
    title: 'Total PR Reviews',
    value: '1,234',
    change: '+12% from last month',
    icon: GitPullRequest,
    color: 'text-chart-1',
  },
  {
    title: 'Issues Triaged',
    value: '567',
    change: '+8% from last month',
    icon: AlertCircle,
    color: 'text-chart-2',
  },
  {
    title: 'Contributors Mentored',
    value: '89',
    change: '+24% from last month',
    icon: Users,
    color: 'text-chart-3',
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    change: '-15% from last month',
    icon: Clock,
    color: 'text-chart-4',
  },
];

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your maintainer activity summary.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{metric.title}</CardTitle>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Reviewed PR #234', repo: 'user/repo-name', time: '2 hours ago', type: 'review' },
                { action: 'Triaged issue #445', repo: 'user/another-repo', time: '4 hours ago', type: 'triage' },
                { action: 'Mentored contributor @newdev', repo: 'user/repo-name', time: '1 day ago', type: 'mentor' },
                { action: 'Reviewed PR #230', repo: 'user/repo-name', time: '2 days ago', type: 'review' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'review' ? 'bg-chart-1' : 
                    activity.type === 'triage' ? 'bg-chart-2' : 'bg-chart-3'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.repo}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'user/main-project', reviews: 45, issues: 23, stars: '12.3k' },
                { name: 'user/secondary-repo', reviews: 32, issues: 18, stars: '8.1k' },
                { name: 'user/utility-lib', reviews: 28, issues: 12, stars: '5.4k' },
                { name: 'user/docs-site', reviews: 15, issues: 8, stars: '2.1k' },
              ].map((repo, i) => (
                <div key={i} className="pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{repo.name}</p>
                    <span className="text-xs text-muted-foreground">{repo.stars} ⭐</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{repo.reviews} reviews</span>
                    <span>{repo.issues} issues</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
