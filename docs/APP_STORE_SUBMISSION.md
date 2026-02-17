# Apple App Store Submission Guide

## Prerequisites
- **Apple Developer Account**: Enrolled ($99/year).
- **Transporter App** (Mac) or **EAS Submit** configured.

## 1. Prepare for Build
Ensure your `app.json` has the correct `ios.bundleIdentifier` and `version`.
The `buildNumber` is managed automatically by EAS if `"autoIncrement": true` is set in `eas.json` (Production profile).

## 2. Build for TestFlight (Beta)
To create a build for TestFlight (and eventually App Store Review):

```bash
eas build --platform ios --profile production
```

This will:
1.  Build the **.ipa** file (iOS App Store Package).
2.  Sign it with your Distribution Certificate.

## 3. Submit to App Store Connect
### Option A: Automatic Submission (EAS)
If you have configured `eas.json` submit profile:

```bash
eas submit -p ios --profile production
```
Follow the prompts to select the build you just created.

### Option B: Manual Upload (Transporter)
1.  Download the `.ipa` file from the Expo build dashboard.
2.  Open **Transporter** app on your Mac.
3.  Drag and drop the `.ipa` file.
4.  Click **Deliver**.

## 4. TestFlight Distribution
1.  Go to [App Store Connect](https://appstoreconnect.apple.com).
2.  Navigate to **My Apps > Your App > TestFlight**.
3.  You should see your uploaded build processing.
4.  Once processed, add **Internal Testers** (yourself) or **External Testers**.
5.  Testers will receive an email to install the app via the TestFlight app.

## 5. App Store Review (Production)
When confident in the beta build:
1.  Go to **App Store** tab.
2.  Select the build you tested in TestFlight.
3.  Fill out release notes and app information.
4.  **Credentials**: If your app requires login, provide the **Apple Review Test Account** credentials you seeded (`apple-review@truenorth.app`).
5.  Submit for Review.
