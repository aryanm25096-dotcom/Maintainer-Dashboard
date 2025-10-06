import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Users, TrendingUp, Trophy, Star, Target } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const mentorStats = [
  { label: 'Contributors Helped', value: 89, icon: Users },
  { label: 'Retention Rate', value: '87%', icon: TrendingUp },
  { label: 'Success Stories', value: 34, icon: Trophy },
  { label: 'Active Mentorships', value: 12, icon: Target },
];

const successData = [
  { month: 'Apr', firstTime: 12, repeat: 8, regular: 15 },
  { month: 'May', firstTime: 15, repeat: 11, regular: 18 },
  { month: 'Jun', firstTime: 18, repeat: 14, regular: 22 },
  { month: 'Jul', firstTime: 14, repeat: 12, regular: 25 },
  { month: 'Aug', firstTime: 21, repeat: 18, regular: 28 },
  { month: 'Sep', firstTime: 19, repeat: 16, regular: 32 },
];

const achievements = [
  { name: 'First Mentor', description: 'Helped your first contributor', earned: true, icon: '🌟' },
  { name: 'Super Mentor', description: 'Mentored 50+ contributors', earned: true, icon: '🏆' },
  { name: 'Community Builder', description: '80%+ retention rate', earned: true, icon: '🏗️' },
  { name: 'Patience Master', description: 'Maintained positive sentiment', earned: true, icon: '🧘' },
  { name: 'Code Sensei', description: '100 successful PRs from mentees', earned: false, icon: '🥋' },
  { name: 'Open Source Hero', description: 'Mentored across 10+ repos', earned: false, icon: '🦸' },
];

const mentees = [
  { name: 'Alice Johnson', avatar: 'AJ', prs: 12, status: 'active', progress: 85, joined: '2 months ago' },
  { name: 'Bob Smith', avatar: 'BS', prs: 8, status: 'active', progress: 65, joined: '1 month ago' },
  { name: 'Carol White', avatar: 'CW', prs: 24, status: 'graduated', progress: 100, joined: '6 months ago' },
  { name: 'David Chen', avatar: 'DC', prs: 5, status: 'active', progress: 45, joined: '3 weeks ago' },
];

export function Mentorship() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Mentorship Activities</h1>
        <p className="text-muted-foreground">Track your impact on the contributor community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mentorStats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contributor Journey Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={successData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="firstTime" stroke="hsl(var(--chart-1))" strokeWidth={2} name="First-time" />
              <Line type="monotone" dataKey="repeat" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Repeat" />
              <Line type="monotone" dataKey="regular" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Regular" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Mentees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mentees.map(mentee => (
                <div key={mentee.name} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{mentee.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{mentee.name}</p>
                        <Badge variant={mentee.status === 'active' ? 'default' : 'secondary'}>
                          {mentee.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{mentee.prs} PRs · {mentee.joined}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{mentee.progress}%</span>
                    </div>
                    <Progress value={mentee.progress} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-chart-4" />
              Achievements & Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(achievement => (
                <div
                  key={achievement.name}
                  className={`p-4 border rounded-lg ${
                    achievement.earned
                      ? 'border-chart-4 bg-chart-4/10'
                      : 'border-border bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-medium text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.earned && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-chart-4">
                      <Star className="h-3 w-3 fill-current" />
                      Earned
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
