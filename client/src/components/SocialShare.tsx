import React, { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Copy, 
  Check,
  ExternalLink,
  Facebook,
  Reddit,
  Telegram
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
  onShare?: (platform: string) => void;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  image,
  hashtags = [],
  onShare,
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url,
    title,
    description,
    image,
    hashtags: hashtags.join(',')
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShare?.('copy');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} - ${description}`);
    const hashtagString = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : '';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}${hashtagString}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    onShare?.('twitter');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
    onShare?.('linkedin');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    onShare?.('facebook');
  };

  const shareToReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, '_blank', 'width=550,height=420');
    onShare?.('reddit');
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank', 'width=550,height=420');
    onShare?.('telegram');
  };

  const shareToGitHub = () => {
    // GitHub doesn't have a direct sharing API, so we'll copy the link
    copyToClipboard();
    onShare?.('github');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(emailUrl);
    onShare?.('email');
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        onShare?.('native');
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      action: shareToTwitter
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: shareToLinkedIn
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: shareToFacebook
    },
    {
      name: 'Reddit',
      icon: Reddit,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: shareToReddit
    },
    {
      name: 'Telegram',
      icon: Telegram,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: shareToTelegram
    },
    {
      name: 'GitHub',
      icon: Github,
      color: 'bg-gray-800 hover:bg-gray-900',
      action: shareToGitHub
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: shareViaEmail
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Share Profile
        </h3>
        <button
          onClick={shareViaNative}
          className="btn-primary flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Copy Link */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
        />
        <button
          onClick={copyToClipboard}
          className="btn-secondary flex items-center space-x-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shareButtons.map((button) => (
          <button
            key={button.name}
            onClick={button.action}
            className={`flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors ${button.color}`}
          >
            <button.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{button.name}</span>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Preview
        </h4>
        <div className="flex items-start space-x-3">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-16 h-16 rounded object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 truncate mt-1">
              {url}
            </p>
          </div>
        </div>
      </div>

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
          {hashtags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialShare;
