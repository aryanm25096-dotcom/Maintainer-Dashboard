import React, { useEffect, useRef } from 'react';

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
  className?: string;
}

const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({
  children,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add keyboard navigation support
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip links for keyboard navigation
      if (event.key === 'Tab' && event.shiftKey) {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    };

    // Add ARIA live regions for dynamic content
    const addLiveRegion = () => {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'live-region';
      document.body.appendChild(liveRegion);
    };

    // Announce changes to screen readers
    const announceChange = (message: string) => {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    };

    // Add focus management
    const manageFocus = () => {
      const focusableElements = container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      focusableElements.forEach((element, index) => {
        element.setAttribute('tabindex', index === 0 ? '0' : '-1');
      });
    };

    // Add high contrast mode support
    const addHighContrastSupport = () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-contrast: high) {
          .accessibility-enhanced * {
            border-color: currentColor !important;
          }
          
          .accessibility-enhanced .card {
            border: 2px solid currentColor;
          }
          
          .accessibility-enhanced .btn {
            border: 2px solid currentColor;
            background-color: transparent;
          }
          
          .accessibility-enhanced .btn:hover {
            background-color: currentColor;
            color: white;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Add reduced motion support
    const addReducedMotionSupport = () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          .accessibility-enhanced * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Initialize accessibility features
    addLiveRegion();
    addHighContrastSupport();
    addReducedMotionSupport();
    manageFocus();

    // Add event listeners
    container.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`accessibility-enhanced ${className}`}
      role="main"
      aria-label="Maintainer Dashboard"
    >
      {children}
    </div>
  );
};

// Utility functions for accessibility
export const announceToScreenReader = (message: string) => {
  const liveRegion = document.getElementById('live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
};

export const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const addSkipLink = (targetId: string, label: string) => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
  skipLink.setAttribute('aria-label', `Skip to ${label}`);
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

export const addAriaLabels = () => {
  // Add ARIA labels to interactive elements
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach((button, index) => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });

  // Add ARIA labels to form elements
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input, index) => {
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input ${index + 1}`);
    }
  });
};

export default AccessibilityEnhancements;
