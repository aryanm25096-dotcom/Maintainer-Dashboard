import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShareableProfileCard from '../components/ShareableProfileCard';
import api from '../utils/api';

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

const ShareableProfile: React.FC = () => {
  const [profile, setProfile] = useState<MaintainerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/maintainer/profile/${username}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (method: string) => {
    console.log('Sharing via:', method);
    // Implement sharing logic
  };

  const handleExport = (format: string) => {
    console.log('Exporting as:', format);
    // Implement export logic
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ShareableProfileCard
        profile={profile}
        onShare={handleShare}
        onExport={handleExport}
      />
    </div>
  );
};

export default ShareableProfile;