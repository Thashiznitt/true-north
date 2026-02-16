# Architecture Overview

True North is a React Native application built with the Expo SDK 52.

## Technology Stack

- **Framework**: React Native with Expo (SDK 52.0.33)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Bottom Tabs + Native Stacks)
- **Styling**: Vanilla CSS-in-JS (Theme-based)
- **Animations**: React Native Reanimated + Moti
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

### Ghost Communities & Content Agent
The `ContentAgentService` simulates active communities and reflections for a "lived-in" feel, while allowing users to create their own real communities. It also handles the "Spiritual Analysis" logic for journal feedback.

### Persistence & Backend
- **State**: Persisted using Zustand's `persist` middleware with `@react-native-async-storage/async-storage`.
- **Database**: Planned integration with Supabase for user data, community posts, and events.
- **ORM**: Prisma schema is defined and ready for client generation.

### Admin Module
A dedicated `src/features/admin` module encapsulates the Superadmin logic, ensuring separation of concerns from the main user flow.

### Environment Configuration
The app exposes "Developer Options" (like resetting onboarding or accessing the admin portal) based on the `__DEV__` flag, ensuring a smooth developer experience without compromising production security.
