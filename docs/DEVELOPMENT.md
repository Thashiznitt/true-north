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

## Seeding Test Data

### Apple Review Account

To create the test account used for Apple App Store review (`apple-review@truenorth.app`):

1. **Prerequisites**:
   - Ensure your `.env` contains valid `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`.
   - Ensure you have network access to the database (port 5432) for email confirmation.

2. **Run the script**:
   ```bash
   npx ts-node scripts/seed-review-user.ts
   ```

3. **Manual Verification (if script fails)**:
   - If the script cannot auto-confirm the email due to network restrictions, go to the Supabase Dashboard > Authentication > Users.
   - Find `apple-review@truenorth.app` and manually confirm the user.

### Option 2: SQL Migration (Recommended)
You can apply the provided SQL migration file directly using the Supabase Dashboard SQL Editor or CLI.

File: `supabase/migrations/20260217215000_seed_apple_review_user.sql`

This SQL script will:
1. Create the user in `auth.users` with the password `ReviewPassword123!`.
2. Automatically confirm the email.
3. Link the necessary identity.
4. Create the public user profile, preferences, and goals.

