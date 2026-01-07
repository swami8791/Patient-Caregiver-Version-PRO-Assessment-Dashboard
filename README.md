<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cIAIPP3p3rEVnMJe7ceh7t0kdI7Hph1q

## Run Locally

**Prerequisites:**  Node.js (v16 or later)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## iOS Development

This app is configured to run as a native iOS application using Capacitor.

### Quick Start for iOS

1. Build the web assets:
   ```bash
   npm run build
   ```

2. Sync and open in Xcode:
   ```bash
   npm run ios:open
   ```

3. Run the app from Xcode on a simulator or device.

For detailed iOS setup, testing, and deployment instructions, see [iOS_TESTING.md](./iOS_TESTING.md).

## Testing

Run the test suite:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production web assets
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run ios:build` - Build and sync iOS project
- `npm run ios:open` - Open iOS project in Xcode
- `npm run ios:run` - Build, sync, and run iOS app
- `npm run ios:sync` - Sync web assets to iOS project
