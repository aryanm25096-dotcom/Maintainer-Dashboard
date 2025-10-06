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
import { ExternalLink, MessageSquare } from 'lucide-react';

const sentimentData = [
  { name: 'Positive', value: 654, color: '#10b981' },
  { name: 'Neutral', value: 423, color: '#3b82f6' },
  { name: 'Negative', value: 157, color: '#ef4444' },
];

const trendData = [
  { month: 'Apr', positive: 45, neutral: 30, negative: 10 },
  { month: 'May', positive: 52, neutral: 28, negative: 12 },
  { month: 'Jun', positive: 61, neutral: 35, negative: 8 },
  { month: 'Jul', positive: 58, neutral: 32, negative: 15 },
  { month: 'Aug', positive: 68, neutral: 38, negative: 9 },
  { month: 'Sep', positive: 72, neutral: 41, negative: 11 },
];

const personalityData = [
  { trait: 'Constructive', value: 85 },
  { trait: 'Responsive', value: 92 },
  { trait: 'Thorough', value: 78 },
  { trait: 'Collaborative', value: 88 },
  { trait: 'Mentoring', value: 81 },
];

const recentReviews = [
  { id: '#234', title: 'Add user authentication', repo: 'user/main-project', sentiment: 'positive', comments: 5, date: '2 hours ago' },
  { id: '#233', title: 'Fix memory leak in worker', repo: 'user/main-project', sentiment: 'neutral', comments: 3, date: '5 hours ago' },
  { id: '#445', title: 'Update documentation', repo: 'user/docs-site', sentiment: 'positive', comments: 2, date: '1 day ago' },
  { id: '#230', title: 'Refactor database queries', repo: 'user/main-project', sentiment: 'negative', comments: 8, date: '2 days ago' },
  { id: '#112', title: 'Add new API endpoints', repo: 'user/secondary-repo', sentiment: 'positive', comments: 4, date: '3 days ago' },
];

export function PRReviews() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>PR Reviews Analytics</h1>
          <p className="text-muted-foreground">Analyze your code review patterns and sentiment</p>
        </div>
        <Select defaultValue="30">
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
            {recentReviews.map(review => (
              <div key={review.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-muted-foreground">{review.id}</span>
                    <Badge variant={
                      review.sentiment === 'positive' ? 'default' : 
                      review.sentiment === 'neutral' ? 'secondary' : 'destructive'
                    }>
                      {review.sentiment}
                    </Badge>
                  </div>
                  <p className="font-medium">{review.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{review.repo}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {review.comments} comments
                    </span>
                    <span>{review.date}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
