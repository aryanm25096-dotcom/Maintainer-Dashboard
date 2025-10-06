import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, GitPullRequest, Heart, Lightbulb, Sparkles } from 'lucide-react';
import { Progress } from '../components/ui/progress';

const retentionData = [
  { month: 'Apr', retained: 68, churned: 12 },
  { month: 'May', retained: 75, churned: 9 },
  { month: 'Jun', retained: 82, churned: 7 },
  { month: 'Jul', retained: 78, churned: 11 },
  { month: 'Aug', retained: 88, churned: 6 },
  { month: 'Sep', retained: 92, churned: 5 },
];

const healthComparison = [
  { metric: 'Response Time', before: 45, after: 85 },
  { metric: 'PR Merge Rate', before: 62, after: 88 },
  { metric: 'Issue Resolution', before: 58, after: 92 },
  { metric: 'Contributor Growth', before: 40, after: 78 },
  { metric: 'Code Quality', before: 70, after: 89 },
];

const insights = [
  {
    type: 'positive',
    title: 'Excellent Mentor Engagement',
    description: 'Your mentorship activities have led to 24% increase in repeat contributors',
    icon: Users,
  },
  {
    type: 'warning',
    title: 'Response Time Spike',
    description: 'PRs older than 48 hours increased by 15%. Consider prioritizing reviews',
    icon: GitPullRequest,
  },
  {
    type: 'insight',
    title: 'Community Sentiment Rising',
    description: 'Positive feedback increased by 18% this month. Keep up the great work!',
    icon: Heart,
  },
  {
    type: 'suggestion',
    title: 'Automate Common Tasks',
    description: 'Consider adding CI/CD workflows to reduce manual review time by ~30%',
    icon: Lightbulb,
  },
];

export function CommunityImpact() {
  const overallScore = 87;
  const breakdownScores = {
    responsiveness: 92,
    mentorship: 85,
    codeQuality: 89,
    community: 82,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Community Impact Calculator</h1>
        <p className="text-muted-foreground">Measure and visualize your maintainer impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-chart-4" />
              Overall Impact Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{overallScore}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                {Object.entries(breakdownScores).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contributor Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="retained" fill="hsl(var(--chart-4))" name="Retained Contributors" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churned" fill="hsl(var(--destructive))" name="Churned Contributors" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Health: Before vs After</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {healthComparison.map(item => (
              <div key={item.metric}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.metric}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.before}% → {item.after}% 
                    <span className="text-chart-4 ml-2">
                      +{item.after - item.before}%
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                    <Progress value={item.before} className="h-2" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">After</p>
                    <Progress value={item.after} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'positive' ? 'border-chart-4 bg-chart-4/10' :
                    insight.type === 'warning' ? 'border-destructive bg-destructive/10' :
                    'border-border bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'positive' ? 'bg-chart-4 text-white' :
                      insight.type === 'warning' ? 'bg-destructive text-white' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
