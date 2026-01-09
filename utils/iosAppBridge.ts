/**
 * iOS App Bridge Utility
 * Handles deep linking to native iOS app and fallback mechanisms
 */

export interface IOSAppLinkConfig {
  surveyId?: string;
  patientId?: string;
  screen?: 'dashboard' | 'survey' | 'portfolio' | 'chat';
  action?: string;
  params?: Record<string, string>;
}

const IOS_APP_SCHEME = 'peltql'; // peltql://
const APP_STORE_URL = 'https://apps.apple.com/app/id123456789'; // Replace with actual App Store ID
const FALLBACK_TIMEOUT = 2000; // 2 seconds

/**
 * Detects if the user is on an iOS device
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipod|ipad/.test(userAgent);

  // Check for iPad on iOS 13+ which reports as Mac
  const isIPadOS = navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent);

  return isIOSDevice || isIPadOS;
}

/**
 * Detects if the user is on Safari browser
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent;
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);

  return isSafariBrowser;
}

/**
 * Builds a deep link URL for the iOS app
 */
export function buildDeepLink(config: IOSAppLinkConfig): string {
  const { screen = 'dashboard', surveyId, patientId, action, params = {} } = config;

  let url = `${IOS_APP_SCHEME}://${screen}`;

  const queryParams: string[] = [];

  if (surveyId) queryParams.push(`surveyId=${encodeURIComponent(surveyId)}`);
  if (patientId) queryParams.push(`patientId=${encodeURIComponent(patientId)}`);
  if (action) queryParams.push(`action=${encodeURIComponent(action)}`);

  // Add additional params
  Object.entries(params).forEach(([key, value]) => {
    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  return url;
}

/**
 * Attempts to open the iOS app with the given configuration
 * Falls back to App Store if app is not installed
 */
export function openIOSApp(config: IOSAppLinkConfig = {}): Promise<{ opened: boolean; method: string }> {
  return new Promise((resolve) => {
    if (!isIOS()) {
      console.log('Not an iOS device, skipping app open');
      resolve({ opened: false, method: 'not-ios' });
      return;
    }

    const deepLink = buildDeepLink(config);
    console.log('Attempting to open iOS app with deep link:', deepLink);

    let appOpened = false;
    let timeoutId: number;

    // Function to handle successful app opening
    const handleAppOpened = () => {
      appOpened = true;
      if (timeoutId) clearTimeout(timeoutId);
      console.log('iOS app opened successfully');
      resolve({ opened: true, method: 'deeplink' });
    };

    // Function to handle fallback
    const handleFallback = () => {
      if (appOpened) return;
      console.log('iOS app not detected, user stayed on web app');
      resolve({ opened: false, method: 'stayed-web' });
    };

    // Listen for page visibility changes (app opening changes visibility)
    const visibilityHandler = () => {
      if (document.hidden) {
        handleAppOpened();
        document.removeEventListener('visibilitychange', visibilityHandler);
      }
    };

    // Listen for page blur (app opening causes blur)
    const blurHandler = () => {
      handleAppOpened();
      window.removeEventListener('blur', blurHandler);
    };

    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('blur', blurHandler);

    // Set timeout for fallback
    timeoutId = window.setTimeout(() => {
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('blur', blurHandler);
      handleFallback();
    }, FALLBACK_TIMEOUT);

    // Attempt to open the app
    try {
      window.location.href = deepLink;
    } catch (error) {
      console.error('Error opening iOS app:', error);
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('blur', blurHandler);
      resolve({ opened: false, method: 'error' });
    }
  });
}

/**
 * Opens the iOS app or redirects to App Store if not installed
 */
export async function openIOSAppWithFallback(
  config: IOSAppLinkConfig = {},
  options: { showAppStoreOnFail?: boolean } = {}
): Promise<void> {
  const { showAppStoreOnFail = true } = options;

  const result = await openIOSApp(config);

  if (!result.opened && showAppStoreOnFail && result.method === 'stayed-web') {
    // Show a prompt to download the app
    const shouldRedirect = window.confirm(
      'The PeLTQL app is not installed. Would you like to download it from the App Store?'
    );

    if (shouldRedirect) {
      window.location.href = APP_STORE_URL;
    }
  }
}

/**
 * Creates a smart link button that opens the app or stays on web
 */
export function createSmartLink(
  config: IOSAppLinkConfig,
  webFallbackUrl?: string
): string {
  if (isIOS()) {
    return buildDeepLink(config);
  }
  return webFallbackUrl || '#';
}

/**
 * Checks if the iOS app might be installed (approximate check)
 * Note: This is not 100% reliable due to browser security restrictions
 */
export async function checkIOSAppInstalled(): Promise<boolean> {
  if (!isIOS()) return false;

  return new Promise((resolve) => {
    const result = openIOSApp({ screen: 'dashboard' });
    result.then((res) => {
      resolve(res.opened);
    });
  });
}
