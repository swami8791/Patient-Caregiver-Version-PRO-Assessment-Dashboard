# iOS Testing Guide

This guide explains how to build, run, and test the PRO Assessment Dashboard on iOS.

## Prerequisites

### Required Software

1. **macOS** - iOS development requires a Mac computer
2. **Xcode** - Download from the Mac App Store (version 14.0 or later recommended)
3. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
4. **CocoaPods** (usually installed with Xcode):
   ```bash
   sudo gem install cocoapods
   ```
5. **Node.js** - Version 16 or later

### iOS Development Setup

1. Install all npm dependencies:
   ```bash
   npm install
   ```

2. Build the web assets:
   ```bash
   npm run build
   ```

3. Sync the iOS project:
   ```bash
   npm run ios:sync
   ```

## Running on iOS

### Method 1: Using npm Scripts (Recommended)

1. **Build and sync the iOS project**:
   ```bash
   npm run ios:build
   ```

2. **Open Xcode**:
   ```bash
   npm run ios:open
   ```

3. In Xcode:
   - Select your target device (simulator or connected iOS device)
   - Click the "Play" button or press `Cmd + R` to build and run

### Method 2: Direct Command

Run the app directly (builds, syncs, and launches):
```bash
npm run ios:run
```

### Method 3: Manual Xcode Workflow

1. Build the web assets:
   ```bash
   npm run build
   ```

2. Sync Capacitor:
   ```bash
   npx cap sync ios
   ```

3. Open the iOS project:
   ```bash
   npx cap open ios
   ```

4. In Xcode, select your device and run the app.

## Testing

### Running Unit Tests

The project uses Jest and React Testing Library for testing.

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run tests in watch mode**:
   ```bash
   npm run test:watch
   ```

3. **Generate coverage report**:
   ```bash
   npm run test:coverage
   ```

### Test Structure

- `__tests__/` - Test files directory
- `__tests__/components/` - Component-specific tests
- `__tests__/lib/` - Utility function tests
- `__mocks__/` - Mock implementations for external dependencies

### Writing Tests

Tests use React Testing Library. Example:

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Testing on Physical Devices

### Setup

1. **Apple Developer Account**: Free account works for testing, paid ($99/year) required for App Store distribution

2. **Connect your iPhone/iPad**:
   - Connect device via USB
   - Trust the computer on your device
   - In Xcode, select your device from the device menu

3. **Code Signing**:
   - In Xcode, select the project in the navigator
   - Select your target under "TARGETS"
   - Go to "Signing & Capabilities"
   - Select your team from the dropdown
   - Xcode will automatically manage provisioning profiles

4. **Run on device**: Click the "Play" button in Xcode

### Troubleshooting Device Testing

**"Untrusted Developer" error on device:**
1. On your iOS device, go to Settings > General > VPN & Device Management
2. Tap your developer profile
3. Tap "Trust [Your Name]"

**Build fails with signing error:**
- Ensure you're logged into Xcode with your Apple ID (Xcode > Settings > Accounts)
- Clean build folder: Product > Clean Build Folder
- Try "Automatically manage signing"

## iOS Simulator Testing

### Launching Specific Simulators

List available simulators:
```bash
xcrun simctl list devices
```

Launch a specific simulator:
```bash
open -a Simulator --args -CurrentDeviceUDID <device-udid>
```

### Common Simulators

- iPhone 15 Pro (recommended for testing)
- iPhone SE (3rd generation) - test smaller screens
- iPad Pro 12.9-inch - test tablet layouts

## Development Workflow

1. **Make changes to web code** (TypeScript, React, CSS)
2. **Build and sync**:
   ```bash
   npm run ios:build
   ```
3. **Test in Xcode** - Changes will be reflected in the iOS app

### Hot Reload for Development

For faster development, you can run the Vite dev server and point Capacitor to it:

1. Update `capacitor.config.ts` temporarily:
   ```typescript
   server: {
     url: 'http://localhost:5173',
     cleartext: true
   }
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Rebuild and run the iOS app

⚠️ **Remember to remove the server URL before production builds!**

## Configuration

### Capacitor Configuration

Edit `capacitor.config.ts` for app-level configuration:

```typescript
{
  appId: 'com.proassessment.dashboard',
  appName: 'PRO Assessment Dashboard',
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true,
  }
}
```

### iOS Permissions

Permissions are configured in `ios/App/App/Info.plist`:

- **Camera**: For profile photos
- **Photo Library**: For selecting images
- **App Transport Security**: Configured for secure networking

## Building for Distribution

### Creating an Archive

1. In Xcode, select "Any iOS Device" as the destination
2. Go to Product > Archive
3. Wait for the archive to complete
4. The Organizer window will open automatically

### TestFlight Distribution

1. In the Organizer, select your archive
2. Click "Distribute App"
3. Select "TestFlight & App Store"
4. Follow the prompts to upload to App Store Connect
5. In App Store Connect, add testers and submit for review

### Ad Hoc Distribution

For testing without TestFlight:

1. In the Organizer, select your archive
2. Click "Distribute App"
3. Select "Ad Hoc"
4. Follow the prompts to create an IPA file
5. Distribute the IPA to testers via tools like TestFlight alternatives

## Debugging

### Xcode Debugger

- Set breakpoints in native iOS code
- Use `lldb` commands in the console
- View memory, network, and performance metrics

### Safari Web Inspector

For debugging the web layer:

1. On your Mac, open Safari
2. Enable Develop menu: Safari > Settings > Advanced > Show Develop menu
3. Connect your iOS device or run in simulator
4. In Safari, go to Develop > [Your Device] > [Your App]
5. Use Web Inspector to debug HTML, CSS, and JavaScript

### Console Logs

View native logs in Xcode console:
- Xcode > View > Debug Area > Activate Console
- Filter logs using the search box

## Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Note**: `.env.local` is git-ignored for security.

## Common Issues

### Build Errors

**"Command PhaseScriptExecution failed"**
- Clean build folder: Product > Clean Build Folder
- Delete `ios/App/Pods` folder and run `pod install` in `ios/App`
- Try `npx cap sync ios` again

**"No valid signing identity found"**
- Check your Apple Developer account in Xcode > Settings > Accounts
- Enable "Automatically manage signing" in project settings

### Runtime Issues

**White screen on launch**
- Check that `npm run build` completed successfully
- Verify `dist` folder exists and contains files
- Check browser console in Safari Web Inspector

**API calls failing**
- Verify GEMINI_API_KEY is set correctly
- Check network permissions in Info.plist
- Review App Transport Security settings

## Performance Testing

### Instruments

Use Xcode Instruments for performance profiling:

1. Product > Profile (or Cmd + I)
2. Select a template:
   - **Time Profiler**: CPU usage
   - **Allocations**: Memory usage
   - **Network**: Network requests
3. Record and analyze performance

## Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Support

For issues specific to this project, please check:
1. This documentation
2. The main [README.md](./README.md)
3. Project issue tracker

For Capacitor-specific issues, visit: https://github.com/ionic-team/capacitor/issues
