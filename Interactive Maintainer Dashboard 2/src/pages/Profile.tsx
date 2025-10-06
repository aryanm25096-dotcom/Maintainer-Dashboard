import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Download, Share2, QrCode, Github, Twitter, Linkedin, Globe, MapPin, Calendar } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const personalityData = [
  { trait: 'Constructive', value: 85 },
  { trait: 'Responsive', value: 92 },
  { trait: 'Thorough', value: 78 },
  { trait: 'Collaborative', value: 88 },
  { trait: 'Mentoring', value: 81 },
];

const impactData = [
  { metric: 'Code Quality', score: 89 },
  { metric: 'Community', score: 87 },
  { metric: 'Responsiveness', score: 92 },
  { metric: 'Mentorship', score: 85 },
];

const milestones = [
  { year: '2023', event: 'First Open Source Contribution', description: 'Started journey as maintainer' },
  { year: '2023', event: 'Joined Main Project', description: 'Became core maintainer' },
  { year: '2024', event: 'Mentored 50+ Contributors', description: 'Achieved Super Mentor badge' },
  { year: '2024', event: '1000+ PR Reviews', description: 'Major milestone reached' },
];

const skills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'CI/CD',
  'Code Review', 'Mentoring', 'Technical Writing', 'Community Building'
];

export function Profile() {
  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="mb-2">John Doe</h1>
              <p className="text-muted-foreground mb-4">
                Senior Maintainer & Open Source Advocate
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined January 2023</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Github className="h-3 w-3" />
                  github.com/johndoe
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Twitter className="h-3 w-3" />
                  @johndoe
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Linkedin className="h-3 w-3" />
                  linkedin.com/in/johndoe
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  johndoe.dev
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">1,234</div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">567</div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm text-muted-foreground">Mentees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">87</div>
                  <div className="text-sm text-muted-foreground">Impact Score</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contribution CV Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-chart-1" />
                    {i !== milestones.length - 1 && (
                      <div className="w-px h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{milestone.year}</Badge>
                      <h4 className="font-medium">{milestone.event}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {skills.map(skill => (
                <Badge key={skill} variant="outline" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Top Languages</h4>
              <div className="space-y-3">
                {[
                  { lang: 'TypeScript', percent: 45, color: 'hsl(var(--chart-1))' },
                  { lang: 'Python', percent: 28, color: 'hsl(var(--chart-2))' },
                  { lang: 'JavaScript', percent: 18, color: 'hsl(var(--chart-3))' },
                  { lang: 'Go', percent: 9, color: 'hsl(var(--chart-4))' },
                ].map(item => (
                  <div key={item.lang}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.lang}</span>
                      <span className="text-muted-foreground">{item.percent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintainer Personality</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={personalityData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: 'hsl(var(--foreground))' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Radar name="Score" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Impact Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="score" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-br from-chart-1/20 to-chart-4/20 p-8">
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>John Doe - Maintainer Profile</h3>
                    <p className="text-muted-foreground">Impact Score: 87 | 1,234 Reviews | 89 Mentees</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check out my open source maintainer profile and community impact metrics
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
