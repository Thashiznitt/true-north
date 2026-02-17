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

    const iosApiKey = __DEV__ 
      ? (process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'test_wBhjehklKDMwfUnPjCTIklJxHwE')
      : (process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD || '');

    const androidApiKey = __DEV__
      ? (process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || 'test_wBhjehklKDMwfUnPjCTIklJxHwE')
      : (process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || ''); // Add android prod key if available

    if (Platform.OS === 'ios' && iosApiKey) {
      Purchases.configure({ apiKey: iosApiKey });
    } else if (Platform.OS === 'android' && androidApiKey) {
      Purchases.configure({ apiKey: androidApiKey });
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
