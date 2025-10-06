import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, Filter } from 'lucide-react';

const issueTypeData = [
  { name: 'Bug', value: 245, color: '#ef4444' },
  { name: 'Feature', value: 189, color: '#3b82f6' },
  { name: 'Support', value: 133, color: '#10b981' },
];

const efficiencyData = [
  { month: 'Apr', avgTime: 4.2, triaged: 45 },
  { month: 'May', avgTime: 3.8, triaged: 52 },
  { month: 'Jun', avgTime: 3.2, triaged: 61 },
  { month: 'Jul', avgTime: 2.9, triaged: 58 },
  { month: 'Aug', avgTime: 2.4, triaged: 68 },
  { month: 'Sep', avgTime: 2.1, triaged: 72 },
];

const impactMetrics = [
  { label: 'Community Health', value: 87, target: 90, trend: 'up' },
  { label: 'Response Rate', value: 94, target: 95, trend: 'up' },
  { label: 'Resolution Time', value: 2.1, target: 2.0, trend: 'down', unit: 'days' },
  { label: 'Contributor Satisfaction', value: 4.6, target: 4.5, trend: 'up', unit: '/5' },
];

export function IssueTriage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Issue Triage Tracking</h1>
          <p className="text-muted-foreground">Monitor your issue management efficiency</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Repositories</SelectItem>
              <SelectItem value="main">user/main-project</SelectItem>
              <SelectItem value="secondary">user/secondary-repo</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
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
              <p className="text-3xl font-bold">72</p>
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
    </div>
  );
}
