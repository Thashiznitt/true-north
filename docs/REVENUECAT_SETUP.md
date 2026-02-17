# RevenueCat Setup Guide

To ensure the subscription integration works correctly, follow these steps in App Store Connect and the RevenueCat Dashboard.

## 1. App Store Connect Setup

Create three **Auto-Renewable Subscriptions** in App Store Connect with the following Product IDs:

| Tier | Product ID | Recommended Price |
|------|------------|-------------------|
| **Compass** | `tn_annual_compass_7188` | $69.99 (Annual) |
| **True North** | `tn_monthly_alignment_1299` | $12.99 (Monthly) |
| **Zenith** | `tn_monthly_zenith_1999` | $19.99 (Monthly) |

> [!IMPORTANT]
> Ensure the "Product ID" matches exactly. The app uses these IDs to map products to the internal tiers (Compass, True North, Zenith).

### App-Specific Shared Secret
You will need your **App Store Shared Secret** for RevenueCat:
1. Go to **App Store Connect** -> **App Information**.
2. Scroll to the **App-Specific Shared Secret** section.
3. Manage or generate a new secret and copy it.

## 2. Google Play Console Setup

Create three **Subscriptions** in Google Play Console with the following Product IDs:

| Tier | Product ID | Recommended Price |
|------|------------|-------------------|
| **Compass** | `tn_annual_compass_7188` | $69.99 (Annual) |
| **True North** | `tn_monthly_alignment_1299` | $12.99 (Monthly) |
| **Zenith** | `tn_monthly_zenith_1999` | $19.99 (Monthly) |

### Service Account Key (JSON)
RevenueCat needs a **Service Account** to communicate with Google Play:
1. Go to **Google Cloud Console**.
2. Create a Service Account with **Google Play Android Developer** permission.
3. Generate a **JSON Key**.
4. Upload this file to RevenueCat > Project Settings > Android.

## 3. RevenueCat Dashboard Setup

### Create Entitlements
1. Navigate to **Entitlements** in your RevenueCat project.
2. Create a new entitlement with the ID: `premium`.

### Create Offerings
1. Navigate to **Offerings**.
2. Create a new Offering (e.g., `default_offering`).
3. Add three **Packages** to this offering:
   - **Compass**: Link to `tn_annual_compass_7188`.
   - **True North**: Link to `tn_monthly_alignment_1299`.
   - **Zenith**: Link to `tn_monthly_zenith_1999`.

### Attach Entitlements to Products
1. In the **Products** section, ensure all three products are attached to the `premium` entitlement.

## 4. API Key & Credentials (iOS/Android)

RevenueCat needs to talk to Apple to verify receipts and handle renewals.

### App Store Connect API Key
1. Go to **App Store Connect** -> **Users and Access** -> **Integrations** -> **App Store Connect API**.
2. Copy the **Issuer ID**.
3. Create a new key with the **In-App Purchase** role.
4. Download the **.p8** file and copy the **Key ID**.
5. Upload the .p8 file and paste the Issuer ID and Key ID into RevenueCat Settings.

## 5. Environment Variables

Ensure your `.env` file (or Expo environment) has the correct RevenueCat API keys. The app automatically switches between Test and Production keys based on the environment (`__DEV__`).

```bash
# Development (Test) Key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_test_api_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_test_api_key_here

# Production Key (Used in TestFlight, App Store, and Release Builds)
EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD=your_production_api_key_here
```

- **Local Development**: Uses `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (Test Mode). You will see a "Using a Test Store API key" warning.
- **Production/TestFlight**: Uses `EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD`. No warning will be shown.

## 6. Review Information (Apple/Google Requirement)

Before you can submit the app for review, Apple requires:
- **Screenshot**: A 1242 x 2208 pixel (or similar) screenshot of your app's **Subscription Screen** showing these tiers. (You can use a placeholder for now or wait until the app is built to take a real one).
- **Review Notes**: A brief explanation for the reviewer. Example: *"This subscription unlocks premium journaling features, personalized spiritual guidance, and unlimited community circles."*

## 7. Verification & Sandbox Testing

Once configured:
1. Re-run the app.
2. Navigate to the **Profile > Subscription** screen.
3. You should see the products fetched directly from RevenueCat with their localized pricing.

### Troubleshooting "Connection issue"
If RevenueCat shows a connection issue, double-check that the **Issuer ID**, **Key ID**, and **Shared Secret** are correct and that the **Offering** has a blue checkmark (meaning it is "Current").

### Sandbox Testing Tip
To test on a simulator, you need a **Sandbox Tester** account in App Store Connect.
> [!TIP]
> Use the **"plus trick"** if your email is already taken: `yourname+sandbox@email.com`. Apple will treat this as a unique account but send emails to your regular inbox.
> [!TIP]
> Use the **"plus trick"** if your email is already taken: `yourname+sandbox@email.com`. Apple will treat this as a unique account but send emails to your regular inbox.

## 8. Remaining Android Setup (To Do Later)

### 1. Google Play Console (Prerequisite)
Ensure you have created these **Subscriptions** in the Google Play Console > Monetize > Products > Subscriptions:
*   `tn_annual_compass_7188`
*   `tn_monthly_alignment_1299`
*   `tn_monthly_zenith_1999`

### 2. RevenueCat Dashboard (Linking)
Once the subscriptions are created in Google Play, link them in RevenueCat:

**Step A: Add Products to Entitlement**
1.  Go to **Entitlements** side menu.
2.  Click `premium`.
3.  Click **+ Attach** > **Google Play Store**.
4.  Add: `tn_annual_compass_7188`, `tn_monthly_alignment_1299`, `tn_monthly_zenith_1999`.

**Step B: Add Products to Offering**
1.  Go to **Offerings** side menu > `default_offering`.
2.  Click **Compass** package > Select **Google Play Store** > Attach `tn_annual_compass_7188`.
3.  Click **True North** package > Select **Google Play Store** > Attach `tn_monthly_alignment_1299`.
4.  Click **Zenith** package > Select **Google Play Store** > Attach `tn_monthly_zenith_1999`.
