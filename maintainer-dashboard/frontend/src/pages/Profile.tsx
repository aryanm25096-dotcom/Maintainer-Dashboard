import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Github, 
  MapPin, 
  Building, 
  Link, 
  Users, 
  Star, 
  GitFork, 
  Calendar,
  ExternalLink,
  Share2,
  Download,
  Loader2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import apiService from '../services/apiService';

export function Profile() {
  const { user, isLoading } = useApp();
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.username) {
        setIsLoadingProfile(true);
        try {
          const response = await apiService.getProfileData(user.username);
          if (response.success) {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          toast.error('Failed to load profile data');
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfileData();
  }, [user?.username]);

  // Handle profile export
  const handleExportProfile = async (format = 'json') => {
    if (!profileData) return;

    setIsExporting(true);
    try {
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.username}-profile.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Profile exported successfully');
      } else if (format === 'csv') {
        // Convert profile to CSV
        const csvData = [
          ['Field', 'Value'],
          ['Username', profileData.user.username],
          ['Name', profileData.user.name],
          ['Bio', profileData.user.bio],
          ['Location', profileData.user.location],
          ['Company', profileData.user.company],
          ['Blog', profileData.user.blog],
          ['Followers', profileData.user.followers],
          ['Following', profileData.user.following],
          ['Total Repos', profileData.stats.totalRepos],
          ['Total Stars', profileData.stats.totalStars],
          ['Total Forks', profileData.stats.totalForks]
        ];
        
        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.username}-profile.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Profile exported as CSV');
      }
    } catch (error) {
      toast.error('Failed to export profile');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle share profile
  const handleShareProfile = async () => {
    try {
      const shareUrl = apiService.generateShareableLink(user?.username);
      const success = await apiService.copyToClipboard(shareUrl);
      
      if (success) {
        toast.success('Profile link copied to clipboard');
      } else {
        toast.error('Failed to copy link');
      }
    } catch (error) {
      toast.error('Failed to share profile');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your maintainer profile and statistics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportProfile('json')}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExportProfile('csv')}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button onClick={handleShareProfile}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData.user.avatar} alt={profileData.user.name} />
                <AvatarFallback>
                  {profileData.user.name?.charAt(0) || profileData.user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{profileData.user.name || profileData.user.username}</h2>
                <p className="text-muted-foreground">@{profileData.user.username}</p>
                {profileData.user.bio && (
                  <p className="mt-2 text-sm">{profileData.user.bio}</p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profileData.user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profileData.user.location}
                  </div>
                )}
                {profileData.user.company && (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {profileData.user.company}
                  </div>
                )}
                {profileData.user.blog && (
                  <div className="flex items-center gap-1">
                    <Link className="h-4 w-4" />
                    <a 
                      href={profileData.user.blog} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {profileData.user.blog}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{profileData.user.followers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{profileData.user.following}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Github className="h-4 w-4" />
              Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.stats.totalRepos}</div>
            <p className="text-xs text-muted-foreground">Total repositories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Star className="h-4 w-4" />
              Stars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.stats.totalStars.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total stars received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitFork className="h-4 w-4" />
              Forks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileData.stats.totalForks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total forks</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Repositories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileData.repositories.length > 0 ? (
              profileData.repositories.map((repo, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{repo.name}</h3>
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(repo.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No repositories found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}