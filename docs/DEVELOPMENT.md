# Development Setup

## Prerequisites

- Node.js (Latest LTS)
- Watchman
- Xcode (for iOS development)
- CocoaPods

## Installation

1. Clone the repository.
2. Run `npm install --legacy-peer-deps`.
3. Align dependencies if necessary using `npx expo-doctor`.

## Running the App

### iOS
To run on the iPhone 16e simulator:
```bash
npm run ios:16e
```

Or manually:
```bash
npx expo run:ios --device "iPhone 16e"
```

### Resetting the Environment
If you encounter "Missing native module" or "App entry not found" errors:
1. `rm -rf ios android node_modules`
2. `npm install --legacy-peer-deps`
3. `npx expo prebuild`
4. `npx expo run:ios` (or android)

## Version Lock
This project is strictly aligned with **Expo SDK 52**.
- **React**: 18.3.1
- **React Native**: 0.76.9
Do not upgrade these packages beyond these versions as it will break native module compatibility.
