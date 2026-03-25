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
import { subscriptionService } from './src/services/subscription';


const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  console.log("[App] Component mounting...");
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
      androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY_PROD || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'test_wBhjehklKDMwfUnPjCTIklJxHwE';
    } else {
      // Production / TestFlight / Release
      // Strictly use PROD key, no fallback to test keys to avoid RevenueCat security block
      iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD || '';
      androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY_PROD || '';

      if (!iosApiKey && Platform.OS === 'ios') {
        // Last resort safety: if env var missing in build, use the validated production key
        iosApiKey = 'appl_XkmqCwmuRnOaxhvHAtIczSdJbsd';
      }
      if (!androidApiKey && Platform.OS === 'android') {
        // Last resort safety for Android production
        androidApiKey = 'goog_CkXHjYDdxoHaGbVfnWaqLpEcqAo';
      }
    }

    if (Platform.OS === 'ios' && iosApiKey) {
      console.log("[RevenueCat] Configuring for iOS with key:", iosApiKey.substring(0, 8) + '...');
      Purchases.configure({ apiKey: iosApiKey });
      // Sync real subscription state with RevenueCat to clear any stale persisted tier
      subscriptionService.checkSubscriptionStatus().catch(e =>
        console.warn('[RevenueCat] Initial status check failed:', e)
      );
    } else if (Platform.OS === 'android' && androidApiKey) {
      console.log("[RevenueCat] Configuring for Android with key:", androidApiKey.substring(0, 8) + '...');
      Purchases.configure({ apiKey: androidApiKey });
      // Sync real subscription state with RevenueCat to clear any stale persisted tier
      subscriptionService.checkSubscriptionStatus().catch(e =>
        console.warn('[RevenueCat] Initial status check failed:', e)
      );
    } else {
      console.warn("[RevenueCat] No API key found for platform:", Platform.OS);
    }
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    // onLayout is often unreliable for hiding the splash screen if the initial render is null
    // We already handle this in useEffect now as a primary mechanism
    if (fontsLoaded) {
      console.log("[App] onLayout triggered - and fonts are loaded");
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  React.useEffect(() => {
    console.log("[App] fontsLoaded status:", fontsLoaded);
    if (fontsLoaded) {
      const hideSplash = async () => {
        console.log("[App] Hiding splash screen via useEffect...");
        await SplashScreen.hideAsync().catch(err => {
          console.warn("[App] Error hiding splash screen:", err);
        });
      };
      hideSplash();
    }
  }, [fontsLoaded]);

  // Emergency safety: hide splash screen after 8 seconds no matter what
  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log("[App] Emergency splash screen hide triggered");
      SplashScreen.hideAsync().catch(() => {});
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

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
