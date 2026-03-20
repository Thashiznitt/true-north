import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator, navigationRef } from './src/navigation/root';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';


const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }

    let iosApiKey = '';
    let androidApiKey = '';

    if (__DEV__) {
      // Allow overriding with PROD key even in dev for simulator testing
      iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD || process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'test_wBhjehklKDMwfUnPjCTIklJxHwE';
      androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'test_wBhjehklKDMwfUnPjCTIklJxHwE';
    } else {
      // Production / TestFlight / Release
      // Strictly use PROD key, no fallback to test keys to avoid RevenueCat security block
      iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD || '';
      androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY_PROD || '';

      if (!iosApiKey && Platform.OS === 'ios') {
        // Last resort safety: if env var missing in build, use the validated production key
        iosApiKey = 'appl_XkmqCwmuRnOaxhvHAtIczSdJbsd';
      }
    }

    if (Platform.OS === 'ios' && iosApiKey) {
      console.log("[RevenueCat] Configuring for iOS with key:", iosApiKey.substring(0, 8) + '...');
      Purchases.configure({ apiKey: iosApiKey });
    } else if (Platform.OS === 'android' && androidApiKey) {
      console.log("[RevenueCat] Configuring for Android with key:", androidApiKey.substring(0, 8) + '...');
      Purchases.configure({ apiKey: androidApiKey });
    } else {
      console.warn("[RevenueCat] No API key found for platform:", Platform.OS);
    }
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
