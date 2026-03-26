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
- **Backend API**: Node.js (Express)
- **Caching**: Redis
- **Infra**: Docker + Docker Compose

## Project Structure

- `App.tsx`: Entry point and navigation container.
- `src/navigation/`: Navigation configuration and root navigator.
- `src/features/`: Feature-based modules (Community, Journal, Profile, etc.).
- `src/store/`: Zustand store for global application state.
- `src/services/`: Business logic and external service integrations (Content Agent, API).
- `src/theme/`: Centralized theme tokens and color palette.
- `src/components/`: Shared reusable components (e.g., FaithAd, PinGate).

## Key Patterns

### Global Navigation Ref
The app uses a `navigationRef` in `src/navigation/root.tsx` to enable navigation from outside of React components (e.g., from deep links or services).

### Unified UI Patterns
- **ChoiceModal**: Reusable alternative to native alerts/action sheets, providing consistent branding, capsule-style buttons, and immersive background dimming.
- **Vertical Rhythm**: standardized 32px spacing established across all core sanctuary screens (Affirmation, Community, Detail).

### Ghost Communities & Content Agent
The `ContentAgentService` simulates active communities and reflections for a "lived-in" feel, while allowing users to create their own real communities. It also handles the "Spiritual Analysis" logic for journal feedback, now hyper-personalized by integrating the user's belief system, selected life themes, and recent journal history into a unified SI context. The system also supports debounced auto-save to ensure data persistence during the creative process.

### Persistence & Backend
- **State**: Persisted using Zustand's `persist` middleware with `@react-native-async-storage/async-storage`.
- **Database**: Supabase integration for user data, community posts, and multi-tier events with relational ticket mapping.
- **Ticketing**: Functional QR code generation using `react-native-qrcode-svg` for secure, verifiable community access.
- **ORM**: Prisma schema is defined and ready for client generation.
- **Backend Infrastructure**: Optimized containerized setup using Docker Compose, integrating Node.js for API logic and Redis for AI reflection pre-caching. See [BACKEND_DEPLOYMENT.md](file:///Users/rn/Github/true-north/docs/BACKEND_DEPLOYMENT.md) for details.

### Admin Module
A dedicated `src/features/admin` module encapsulates the Superadmin logic, ensuring separation of concerns from the main user flow.

### Security Architecture
- **Supabase RLS**: Granular Row Level Security policies are used to enforce access control based on user roles (Admin, Moderator, Validator).
- **Fraud Prevention**: Content Agent service performs real-time analysis to block sensitive data sharing in public spaces.
- **PIN-Only Security**: For simplified and reliable access, the app utilizes a unified 4-digit PIN system to secure sensitive journal entries and community interactions.
