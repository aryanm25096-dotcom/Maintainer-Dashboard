import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Download, Share2, Copy } from 'lucide-react';

interface SuccessNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'export' | 'share' | 'copy' | 'save' | 'sync';
  message?: string;
  duration?: number;
  className?: string;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  onClose,
  type,
  message,
  duration = 3000,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'export': return <Download className="w-5 h-5" />;
      case 'share': return <Share2 className="w-5 h-5" />;
      case 'copy': return <Copy className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'export':
        return 'Export completed successfully!';
      case 'share':
        return 'Profile shared successfully!';
      case 'copy':
        return 'Link copied to clipboard!';
      case 'save':
        return 'Changes saved successfully!';
      case 'sync':
        return 'Data synced successfully!';
      default:
        return 'Operation completed successfully!';
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'export':
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      case 'share':
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200';
      case 'copy':
        return 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isAnimating 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      } ${className}`}
    >
      <div className={`rounded-lg border p-4 shadow-lg ${getTypeClasses()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {getMessage()}
            </p>
            
            {type === 'export' && (
              <p className="text-xs mt-1 opacity-75">
                Your file has been downloaded to your default downloads folder.
              </p>
            )}
            
            {type === 'share' && (
              <p className="text-xs mt-1 opacity-75">
                Your profile is now shareable with the generated link.
              </p>
            )}
            
            {type === 'copy' && (
              <p className="text-xs mt-1 opacity-75">
                You can now paste the link anywhere you need it.
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
