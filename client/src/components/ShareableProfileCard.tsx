import React, { useState } from 'react';
import { 
  Share2, 
  Download, 
  Copy, 
  ExternalLink, 
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
  QrCode,
  Check,
  X
} from 'lucide-react';

interface MaintainerProfile {
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
}

interface ShareableProfileCardProps {
  profile: MaintainerProfile;
  onShare?: (method: string) => void;
  onExport?: (format: string) => void;
  className?: string;
}

const ShareableProfileCard: React.FC<ShareableProfileCardProps> = ({
  profile,
  onShare,
  onExport,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'pr_review': return <GitPullRequest className="w-4 h-4" />;
      case 'issue_triage': return <MessageSquare className="w-4 h-4" />;
      case 'mentorship': return <Users className="w-4 h-4" />;
      case 'contribution': return <Star className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'pr_review': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'issue_triage': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'mentorship': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'contribution': return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/maintainer/profile/${profile.username}`;
  };

  const handleShare = (method: string) => {
    const shareUrl = generateShareableLink();
    const shareText = `Check out ${profile.name}'s maintainer profile: ${shareUrl}`;

    switch (method) {
      case 'copy':
        copyToClipboard(shareUrl);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Check out ${profile.name}'s maintainer profile`)}&body=${encodeURIComponent(shareText)}`);
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: `${profile.name}'s Maintainer Profile`,
            text: shareText,
            url: shareUrl
          });
        }
    }
    onShare?.(method);
  };

  const handleExport = (format: string) => {
    setSelectedFormat(format);
    onExport?.(format);
    
    // Simulate export process
    setTimeout(() => {
      setSelectedFormat('');
      alert(`${format.toUpperCase()} export completed!`);
    }, 2000);
  };

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex items-start space-x-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              @{profile.username}
            </p>
            {profile.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {profile.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              {profile.location && (
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(profile.joinedAt).toLocaleDateString()}</span>
              </div>
              {profile.isMaintainer && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Award className="w-4 h-4" />
                  <span>Maintainer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share & Export Actions */}
        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleShare('copy')}
              className="btn-secondary flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="btn-secondary flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedFormat}
              onChange={(e) => e.target.value && handleExport(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Export as...</option>
              <option value="pdf">PDF</option>
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(profile.website || profile.twitter || profile.github || profile.linkedin) && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Connect
          </h3>
          <div className="flex flex-wrap items-center space-x-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.github && (
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.twitter && (
              <a
                href={`https://twitter.com/${profile.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-600"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={`https://linkedin.com/in/${profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {profile.stats.totalContributions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Contributions</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {profile.stats.prReviews}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">PR Reviews</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {profile.stats.mentorship}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mentorship</div>
        </div>
        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {profile.stats.repositories}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {profile.recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.repository} • {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
              {activity.url && (
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Repositories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Repositories
        </h3>
        <div className="space-y-3">
          {profile.topRepositories.slice(0, 3).map((repo) => (
            <div key={repo.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {repo.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {repo.description}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitPullRequest className="w-3 h-3" />
                    <span>{repo.forks}</span>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                    {repo.language}
                  </span>
                </div>
              </div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-4"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Options */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Share Profile
        </h3>
        <div className="flex flex-wrap items-center space-x-4">
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>Twitter</span>
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </button>
          <button
            onClick={() => handleShare('email')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
          <button
            onClick={() => handleShare('native')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                QR Code
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scan to view {profile.name}'s profile
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareableProfileCard;
