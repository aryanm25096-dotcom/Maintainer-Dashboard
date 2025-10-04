import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Star, 
  GitPullRequest, 
  Users, 
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  Globe,
  Mail,
  Twitter,
  Github,
  Linkedin,
  ExternalLink,
  Download,
  Share2,
  QrCode,
  Activity,
  Target
} from 'lucide-react';
import ShareableProfileCard from '../components/ShareableProfileCard';
import SocialShare from '../components/SocialShare';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { exportToPDF } from '../utils/pdfExport';
import { exportActivityData, exportImpactMetrics } from '../utils/csvExport';
import api from '../utils/api';

interface PublicProfileData {
  user: {
    id: string;
    username: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    joinedAt: string;
    isMaintainer: boolean;
  };
  stats: {
    totalContributions: number;
    prReviews: number;
    issueTriage: number;
    mentorship: number;
    repositories: number;
    stars: number;
    forks: number;
    contributors: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    earnedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'pr_review' | 'issue_triage' | 'mentorship' | 'contribution';
    title: string;
    repository: string;
    date: string;
    url?: string;
  }>;
  topRepositories: Array<{
    name: string;
    fullName: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
  }>;
  impactMetrics: {
    overallImpactScore: number;
    contributorRetentionRate: number;
    repositoryHealthScore: number;
    mentorshipScore: number;
  };
  lastUpdated: string;
}

const PublicProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/maintainer/profile/${username}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      await exportToPDF('shareable-profile', {
        filename: `${username}-profile-${Date.now()}.pdf`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (!profileData) return;
    
    // Export activity data
    exportActivityData(profileData.recentActivity.map(activity => ({
      date: activity.date,
      type: activity.type,
      repository: activity.repository,
      title: activity.title,
      value: 1,
      sentiment: 'positive',
      url: activity.url
    })));

    // Export impact metrics
    exportImpactMetrics([{
      period: 'all-time',
      newContributors: profileData.stats.contributors,
      returningContributors: Math.floor(profileData.stats.contributors * profileData.impactMetrics.contributorRetentionRate),
      contributorRetentionRate: profileData.impactMetrics.contributorRetentionRate,
      contributorGrowthRate: profileData.stats.contributors,
      issuesResolved: profileData.stats.issueTriage,
      prsMerged: profileData.stats.prReviews,
      activityGrowth: profileData.impactMetrics.repositoryHealthScore,
      repositoryHealthScore: profileData.impactMetrics.repositoryHealthScore,
      mentorshipScore: profileData.impactMetrics.mentorshipScore,
      contributorQualityImprovement: profileData.impactMetrics.mentorshipScore,
      longTermImpactScore: profileData.impactMetrics.overallImpactScore,
      overallImpactScore: profileData.impactMetrics.overallImpactScore,
      predictedLongTermImpact: profileData.impactMetrics.overallImpactScore * 1.2
    }]);
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
    // Analytics tracking could be added here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The requested maintainer profile could not be found.
        </p>
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/maintainer/profile/${username}`;
  const shareTitle = `${profileData.user.name} - Open Source Maintainer`;
  const shareDescription = `Check out ${profileData.user.name}'s maintainer profile with ${profileData.stats.totalContributions} contributions and ${profileData.stats.repositories} repositories.`;
  const hashtags = ['opensource', 'maintainer', 'github', 'contributor'];

  return (
    <>
      <Helmet>
        <title>{shareTitle}</title>
        <meta name="description" content={shareDescription} />
        <meta name="keywords" content={hashtags.join(', ')} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:image" content={profileData.user.avatarUrl || '/default-avatar.png'} />
        <meta property="og:site_name" content="Maintainer Dashboard" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={profileData.user.avatarUrl || '/default-avatar.png'} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="author" content={profileData.user.name} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={profileUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": profileData.user.name,
            "url": profileUrl,
            "image": profileData.user.avatarUrl,
            "description": profileData.user.bio,
            "jobTitle": "Open Source Maintainer",
            "worksFor": {
              "@type": "Organization",
              "name": "Open Source Community"
            },
            "sameAs": [
              profileData.user.github ? `https://github.com/${profileData.user.github}` : null,
              profileData.user.twitter ? `https://twitter.com/${profileData.user.twitter}` : null,
              profileData.user.linkedin ? `https://linkedin.com/in/${profileData.user.linkedin}` : null
            ].filter(Boolean)
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header with Export Options */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profileData.user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Open Source Maintainer Profile
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button
                  onClick={() => setShowQR(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </button>
                
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
                </button>
                
                <button
                  onClick={handleExportCSV}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Social Share Component */}
            <SocialShare
              url={profileUrl}
              title={shareTitle}
              description={shareDescription}
              image={profileData.user.avatarUrl}
              hashtags={hashtags}
              onShare={handleShare}
            />
          </div>

          {/* Main Profile Content */}
          <div id="shareable-profile">
            <ShareableProfileCard
              profile={{
                id: profileData.user.id,
                username: profileData.user.username,
                name: profileData.user.name,
                email: profileData.user.email,
                avatarUrl: profileData.user.avatarUrl,
                bio: profileData.user.bio,
                location: profileData.user.location,
                website: profileData.user.website,
                twitter: profileData.user.twitter,
                github: profileData.user.github,
                linkedin: profileData.user.linkedin,
                joinedAt: profileData.user.joinedAt,
                isMaintainer: profileData.user.isMaintainer,
                stats: profileData.stats,
                achievements: profileData.achievements,
                recentActivity: profileData.recentActivity,
                topRepositories: profileData.topRepositories
              }}
              onShare={handleShare}
              onExport={handleExportPDF}
            />
          </div>

          {/* Impact Metrics Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Impact Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {profileData.impactMetrics.overallImpactScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Impact</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {profileData.impactMetrics.contributorRetentionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Contributor Retention</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {profileData.impactMetrics.repositoryHealthScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Repository Health</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {profileData.impactMetrics.mentorshipScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mentorship Score</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: {new Date(profileData.lastUpdated).toLocaleString()}</p>
            <p className="mt-2">
              Generated by Maintainer Dashboard • 
              <a href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                Create your own profile
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <QRCodeGenerator
            url={profileUrl}
            title={`${profileData.user.name}'s Profile`}
            onClose={() => setShowQR(false)}
            className="max-w-sm w-full"
          />
        </div>
      )}
    </>
  );
};

export default PublicProfile;
