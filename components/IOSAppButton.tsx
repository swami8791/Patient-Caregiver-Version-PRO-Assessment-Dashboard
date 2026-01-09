import React, { useState, useEffect } from 'react';
import { isIOS, openIOSAppWithFallback, type IOSAppLinkConfig } from '../utils/iosAppBridge';

interface IOSAppButtonProps {
  config?: IOSAppLinkConfig;
  children?: React.ReactNode;
  className?: string;
  showOnlyOnIOS?: boolean;
  variant?: 'primary' | 'secondary' | 'banner';
}

export const IOSAppButton: React.FC<IOSAppButtonProps> = ({
  config = {},
  children,
  className = '',
  showOnlyOnIOS = true,
  variant = 'primary',
}) => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
  }, []);

  // Don't render if showOnlyOnIOS is true and not on iOS
  if (showOnlyOnIOS && !isIOSDevice) {
    return null;
  }

  const handleOpenApp = async () => {
    setIsOpening(true);
    try {
      await openIOSAppWithFallback(config, { showAppStoreOnFail: true });
    } catch (error) {
      console.error('Failed to open iOS app:', error);
    } finally {
      setIsOpening(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#38b6ff] to-[#7843e6] text-white hover:shadow-lg transition-all duration-300';
      case 'secondary':
        return 'bg-white text-[#38b6ff] border-2 border-[#38b6ff] hover:bg-[#38b6ff] hover:text-white transition-all duration-300';
      case 'banner':
        return 'bg-gradient-to-r from-[#7843e6]/10 to-[#38b6ff]/10 text-[#7843e6] border border-[#38b6ff]/30 hover:border-[#38b6ff] transition-all duration-300';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={handleOpenApp}
      disabled={isOpening}
      className={`${getVariantStyles()} px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
      </svg>
      {children || (isOpening ? 'Opening App...' : 'Open in iOS App')}
    </button>
  );
};

interface IOSAppBannerProps {
  onDismiss?: () => void;
  config?: IOSAppLinkConfig;
}

export const IOSAppBanner: React.FC<IOSAppBannerProps> = ({ onDismiss, config = {} }) => {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('iosAppBannerDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('iosAppBannerDismissed', 'true');
    onDismiss?.();
  };

  if (!isIOSDevice || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#7843e6] to-[#38b6ff] text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <svg
            className="w-8 h-8 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
          </svg>
          <div>
            <p className="font-semibold text-sm">Get the best experience with our iOS app</p>
            <p className="text-xs opacity-90">Access surveys, assessments, and insights on the go</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IOSAppButton
            config={config}
            variant="secondary"
            showOnlyOnIOS={false}
            className="whitespace-nowrap text-sm px-4 py-2"
          >
            Open App
          </IOSAppButton>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
