/**
 * iOS App Bridge - Vanilla JavaScript Version
 * Handles deep linking to native iOS app and fallback mechanisms
 * Can be used in both React and vanilla HTML/JS applications
 */

(function(window) {
  'use strict';

  const IOS_APP_SCHEME = 'peltql'; // peltql://
  const APP_STORE_URL = 'https://apps.apple.com/app/id123456789'; // Replace with actual App Store ID
  const FALLBACK_TIMEOUT = 2000; // 2 seconds

  /**
   * Detects if the user is on an iOS device
   * @returns {boolean}
   */
  function isIOS() {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipod|ipad/.test(userAgent);

    // Check for iPad on iOS 13+ which reports as Mac
    const isIPadOS = navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent);

    return isIOSDevice || isIPadOS;
  }

  /**
   * Detects if the user is on Safari browser
   * @returns {boolean}
   */
  function isSafari() {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);

    return isSafariBrowser;
  }

  /**
   * Builds a deep link URL for the iOS app
   * @param {Object} config - Configuration object
   * @param {string} config.screen - Target screen (dashboard, survey, portfolio, chat)
   * @param {string} config.surveyId - Survey ID
   * @param {string} config.patientId - Patient ID
   * @param {string} config.action - Action to perform
   * @param {Object} config.params - Additional query parameters
   * @returns {string}
   */
  function buildDeepLink(config) {
    config = config || {};
    const screen = config.screen || 'dashboard';
    const surveyId = config.surveyId;
    const patientId = config.patientId;
    const action = config.action;
    const params = config.params || {};

    let url = IOS_APP_SCHEME + '://' + screen;

    const queryParams = [];

    if (surveyId) queryParams.push('surveyId=' + encodeURIComponent(surveyId));
    if (patientId) queryParams.push('patientId=' + encodeURIComponent(patientId));
    if (action) queryParams.push('action=' + encodeURIComponent(action));

    // Add additional params
    Object.keys(params).forEach(function(key) {
      queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    });

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&');
    }

    return url;
  }

  /**
   * Attempts to open the iOS app with the given configuration
   * Falls back to staying on web if app is not installed
   * @param {Object} config - Configuration object
   * @returns {Promise<Object>}
   */
  function openIOSApp(config) {
    config = config || {};

    return new Promise(function(resolve) {
      if (!isIOS()) {
        console.log('Not an iOS device, skipping app open');
        resolve({ opened: false, method: 'not-ios' });
        return;
      }

      const deepLink = buildDeepLink(config);
      console.log('Attempting to open iOS app with deep link:', deepLink);

      let appOpened = false;
      let timeoutId;

      // Function to handle successful app opening
      function handleAppOpened() {
        appOpened = true;
        if (timeoutId) clearTimeout(timeoutId);
        console.log('iOS app opened successfully');
        resolve({ opened: true, method: 'deeplink' });
      }

      // Function to handle fallback
      function handleFallback() {
        if (appOpened) return;
        console.log('iOS app not detected, user stayed on web app');
        resolve({ opened: false, method: 'stayed-web' });
      }

      // Listen for page visibility changes (app opening changes visibility)
      function visibilityHandler() {
        if (document.hidden) {
          handleAppOpened();
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      }

      // Listen for page blur (app opening causes blur)
      function blurHandler() {
        handleAppOpened();
        window.removeEventListener('blur', blurHandler);
      }

      document.addEventListener('visibilitychange', visibilityHandler);
      window.addEventListener('blur', blurHandler);

      // Set timeout for fallback
      timeoutId = window.setTimeout(function() {
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
   * @param {Object} config - Configuration object
   * @param {Object} options - Options object
   * @param {boolean} options.showAppStoreOnFail - Whether to show App Store prompt on failure
   * @returns {Promise<void>}
   */
  function openIOSAppWithFallback(config, options) {
    config = config || {};
    options = options || {};
    const showAppStoreOnFail = options.showAppStoreOnFail !== false;

    return openIOSApp(config).then(function(result) {
      if (!result.opened && showAppStoreOnFail && result.method === 'stayed-web') {
        // Show a prompt to download the app
        const shouldRedirect = window.confirm(
          'The PeLTQL app is not installed. Would you like to download it from the App Store?'
        );

        if (shouldRedirect) {
          window.location.href = APP_STORE_URL;
        }
      }
    });
  }

  /**
   * Creates a banner to prompt iOS users to open the app
   * @param {Object} config - Configuration for deep link
   * @returns {HTMLElement|null}
   */
  function createIOSAppBanner(config) {
    if (!isIOS()) return null;

    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('iosAppBannerDismissed');
    if (dismissed === 'true') return null;

    const banner = document.createElement('div');
    banner.id = 'ios-app-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: linear-gradient(to right, #7843e6, #38b6ff);
      color: white;
      padding: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
        <svg style="width: 2rem; height: 2rem; flex-shrink: 0;" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
        </svg>
        <div style="flex: 1; min-width: 0;">
          <p style="font-weight: 600; font-size: 0.875rem; margin: 0;">Get the best experience with our iOS app</p>
          <p style="font-size: 0.75rem; opacity: 0.9; margin: 0;">Access surveys and insights on the go</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button id="ios-app-open-btn" style="
          background: white;
          color: #38b6ff;
          border: 2px solid white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          white-space: nowrap;
        ">Open App</button>
        <button id="ios-app-dismiss-btn" style="
          background: transparent;
          border: none;
          color: white;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
        ">×</button>
      </div>
    `;

    // Add event listeners
    const openBtn = banner.querySelector('#ios-app-open-btn');
    const dismissBtn = banner.querySelector('#ios-app-dismiss-btn');

    openBtn.addEventListener('click', function() {
      openIOSAppWithFallback(config, { showAppStoreOnFail: true });
    });

    dismissBtn.addEventListener('click', function() {
      banner.remove();
      localStorage.setItem('iosAppBannerDismissed', 'true');
    });

    return banner;
  }

  /**
   * Shows the iOS app banner
   * @param {Object} config - Configuration for deep link
   */
  function showIOSAppBanner(config) {
    const banner = createIOSAppBanner(config);
    if (banner) {
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  // Export functions to window object
  window.IOSAppBridge = {
    isIOS: isIOS,
    isSafari: isSafari,
    buildDeepLink: buildDeepLink,
    openIOSApp: openIOSApp,
    openIOSAppWithFallback: openIOSAppWithFallback,
    createIOSAppBanner: createIOSAppBanner,
    showIOSAppBanner: showIOSAppBanner
  };

})(window);
