export const env = {
    // In React Native, __DEV__ is a global variable set to true in development builds
    isDev: __DEV__,

    // Toggle this to force mock services even in production builds (useful for testing)
    useMockServices: false,

    // API Base URL (can be switched based on env)
    apiBaseUrl: __DEV__
        ? 'http://localhost:3000' // Local backend (if you have one)
        : 'https://api.truenorth.app', // Production backend
    // RevenueCat
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD,
    revenueCatIosKeyProd: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD,

    revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,

    // Spiritual Intelligence
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    // Google OAuth
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
};
