import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar } from '../components/ui/calendar';

const activityData = [
  { date: 'Apr 1', reviews: 12, issues: 8, commits: 15 },
  { date: 'Apr 8', reviews: 19, issues: 12, commits: 22 },
  { date: 'Apr 15', reviews: 15, issues: 9, commits: 18 },
  { date: 'Apr 22', reviews: 22, issues: 15, commits: 25 },
  { date: 'Apr 29', reviews: 18, issues: 11, commits: 20 },
  { date: 'May 6', reviews: 25, issues: 18, commits: 28 },
  { date: 'May 13', reviews: 21, issues: 14, commits: 24 },
  { date: 'May 20', reviews: 28, issues: 20, commits: 32 },
];

const repoComparison = [
  { name: 'main-project', reviews: 245, issues: 156, prs: 189 },
  { name: 'secondary-repo', reviews: 189, issues: 123, prs: 145 },
  { name: 'utility-lib', reviews: 134, issues: 89, prs: 98 },
  { name: 'docs-site', reviews: 98, issues: 67, prs: 76 },
];

const funnelData = [
  { stage: 'First-time', count: 245, color: 'hsl(var(--chart-1))' },
  { stage: 'Second PR', count: 189, color: 'hsl(var(--chart-2))' },
  { stage: 'Regular (3-5)', count: 134, color: 'hsl(var(--chart-3))' },
  { stage: 'Core (5+)', count: 98, color: 'hsl(var(--chart-4))' },
];

// Generate heatmap data for the last 6 months
const generateHeatmapData = () => {
  const data: { [key: string]: number } = {};
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data[dateStr] = Math.floor(Math.random() * 20);
  }
  return data;
};

const heatmapData = generateHeatmapData();

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Interactive Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your maintainer activity patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="reviews" stackId="1" stroke="hsl(var(--chart-1))" fill="url(#colorReviews)" />
              <Area type="monotone" dataKey="issues" stackId="1" stroke="hsl(var(--chart-2))" fill="url(#colorIssues)" />
              <Area type="monotone" dataKey="commits" stackId="1" stroke="hsl(var(--chart-3))" fill="url(#colorCommits)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Repository Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={repoComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="reviews" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="issues" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="prs" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contributor Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, index) => {
                const percentage = (item.count / funnelData[0].count) * 100;
                return (
                  <div key={item.stage}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{item.stage}</span>
                      <span className="text-muted-foreground">{item.count} contributors</span>
                    </div>
                    <div className="h-12 relative">
                      <div
                        className="h-full rounded-lg flex items-center justify-center transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      >
                        <span className="text-white font-medium">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(heatmapData).slice(-84).map(([date, count]) => {
              const intensity = Math.min(count / 20, 1);
              return (
                <div
                  key={date}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: intensity > 0 
                      ? `rgba(59, 130, 246, ${0.2 + intensity * 0.8})` 
                      : 'hsl(var(--muted))',
                  }}
                  title={`${date}: ${count} activities`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded"
                style={{
                  backgroundColor: intensity > 0 
                    ? `rgba(59, 130, 246, ${0.2 + intensity * 0.8})` 
                    : 'hsl(var(--muted))',
                }}
              />
            ))}
            <span>More</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
