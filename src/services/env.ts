export const env = {
    // In React Native, __DEV__ is a global variable set to true in development builds
    isDev: __DEV__,

    // Toggle this to force mock services even in production builds (useful for testing)
    useMockServices: __DEV__ || false, // Defaults to true in dev, false in prod

    // API Base URL (can be switched based on env)
    apiBaseUrl: __DEV__
        ? 'http://localhost:3000' // Local backend (if you have one)
        : 'https://api.truenorth.app', // Production backend
};
