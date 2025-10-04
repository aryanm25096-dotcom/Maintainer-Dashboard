import React, { useEffect, useState } from 'react';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
  className?: string;
}

const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({
  children,
  className = ""
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsTouchDevice(isTouch);
      
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className={`mobile-optimized ${className} ${
        deviceType === 'mobile' ? 'mobile-layout' : 
        deviceType === 'tablet' ? 'tablet-layout' : 
        'desktop-layout'
      } ${isTouchDevice ? 'touch-device' : 'no-touch'}`}
      data-device={deviceType}
      data-touch={isTouchDevice}
    >
      {children}
    </div>
  );
};

// CSS-in-JS styles for mobile optimizations
const mobileStyles = `
  .mobile-optimized {
    /* Base mobile optimizations */
  }
  
  .mobile-layout {
    /* Mobile-specific styles */
  }
  
  .mobile-layout .card {
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .mobile-layout .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .mobile-layout .flex {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mobile-layout .btn {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
  }
  
  .mobile-layout .text-3xl {
    font-size: 1.875rem;
  }
  
  .mobile-layout .text-2xl {
    font-size: 1.5rem;
  }
  
  .mobile-layout .text-xl {
    font-size: 1.25rem;
  }
  
  .tablet-layout {
    /* Tablet-specific styles */
  }
  
  .tablet-layout .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .tablet-layout .flex {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .touch-device {
    /* Touch-specific optimizations */
  }
  
  .touch-device .btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .touch-device .card {
    padding: 1.25rem;
  }
  
  .touch-device input,
  .touch-device select,
  .touch-device textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    .mobile-optimized * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    .mobile-optimized {
      color-scheme: dark;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .mobile-optimized .card {
      border: 2px solid;
    }
    
    .mobile-optimized .btn {
      border: 2px solid;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mobileStyles;
  document.head.appendChild(styleSheet);
}

export default MobileOptimizations;
