# Architecture Overview

True North is a React Native application built with the Expo SDK 52.

## Technology Stack

- **Framework**: React Native with Expo (SDK 52.0.33)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stacks)
- **Styling**: Vanilla CSS-in-JS (Theme-based)
- **Icons**: Lucide React Native

## Project Structure

- `App.tsx`: Entry point and navigation container.
- `src/navigation/`: Navigation configuration and root navigator.
- `src/features/`: Feature-based modules (Community, Journal, Profile, etc.).
- `src/store/`: Zustand store for global application state.
- `src/services/`: Business logic and external service integrations (Content Agent, API).
- `src/theme/`: Centralized theme tokens and color palette.
- `src/components/`: Shared reusable components (e.g., FaithAd).

## Key Patterns

### Global Navigation Ref
The app uses a `navigationRef` in `src/navigation/root.tsx` to enable navigation from outside of React components (e.g., from deep links or services).

### Ghost Communities
The `ContentAgentService` simulates active communities and reflections for a "lived-in" feel, while allowing users to create their own real communities.

### Persistence
Application state is persisted using Zustand's `persist` middleware with `@react-native-async-storage/async-storage`.
