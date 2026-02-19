/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Platform, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store';
import { Home, BookOpen, Users, User, Sparkles } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';


// Screens
import { AffirmationScreen } from '../features/affirmation/AffirmationScreen';
import { JournalScreen } from '../features/journal/JournalScreen';
import { CommunityScreen } from '../features/community/CommunityScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { LoginScreen } from '../features/auth/LoginScreen';
import { NotificationsScreen } from '../features/notifications/NotificationsScreen';
import { CircleDetailScreen } from '../features/community/CircleDetailScreen';
import { JournalDetailScreen } from '../features/journal/JournalDetailScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { BeliefSettingsScreen } from '../features/profile/BeliefSettingsScreen';
import { ThemeSettingsScreen } from '../features/profile/ThemeSettingsScreen';
import { GoalSettingsScreen } from '../features/profile/GoalSettingsScreen';
import { SubscriptionScreen } from '../features/profile/SubscriptionScreen';
import { CreateCircleScreen } from '../features/community/CreateCircleScreen';
import { SuperAdminDashboard } from '../features/admin/SuperAdminDashboard';
import { AskNurScreen } from '../features/nur/AskNurScreen';
import { notificationService } from '../services/notifications';
import { TermsOfServiceScreen } from '../features/profile/TermsOfServiceScreen';
import { NotificationSettingsScreen } from '../features/profile/NotificationSettingsScreen';
import { PrivacySettingsScreen } from '../features/profile/PrivacySettingsScreen';
import { HelpCenterScreen } from '../features/profile/HelpCenterScreen';
import { UserGuideScreen } from '../features/profile/UserGuideScreen';
import { PrivacyPolicyScreen } from '../features/profile/PrivacyPolicyScreen';

import { UserProfileScreen } from '../features/community/UserProfileScreen';
import { TicketScannerScreen } from '../features/community/TicketScannerScreen';
import { DailyWisdomModal } from '../components/DailyWisdomModal';

import { theme, palette } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: Record<string, unknown>) {
    if (navigationRef.current?.isReady()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigationRef.current as any).navigate(name as never, params as never);
    }
}

const MainTabs = () => {
    const askNurEnabled = useStore((state) => state.platformFeatures.askNur);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
                headerTitleStyle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text },
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 95 : 75,
                    paddingTop: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 10,
                },
                tabBarActiveTintColor: palette.softGold,
                tabBarInactiveTintColor: theme.colors.secondaryText,
                tabBarLabelStyle: { fontFamily: theme.typography.sansMedium, fontSize: 11, marginBottom: Platform.OS === 'ios' ? 0 : 10 },
                tabBarIconStyle: { marginTop: 5 },
            }}
        >
            <Tab.Screen
                name="Affirmation"
                component={AffirmationScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Journal"
                component={JournalScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />
                }}
            />
            {askNurEnabled && (
                <Tab.Screen
                    name="AskNur"
                    component={AskNurScreen}
                    options={{
                        headerShown: false,
                        tabBarLabel: () => null, // Hide label for the action button
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                width: 64, height: 64, borderRadius: 32,
                                backgroundColor: palette.softGold,
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: 40, // Float upwards
                                borderWidth: 4, borderColor: theme.colors.background, // Create "cutout" effect
                                shadowColor: palette.softGold,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 8,
                                elevation: 8
                            }}>
                                <Sparkles size={28} color={palette.ivory} />
                            </View>
                        )
                    }}
                />
            )}
            <Tab.Screen
                name="Circles"
                component={CommunityScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Users size={24} color={color} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <User size={24} color={color} />
                }}
            />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const isOnboarded = useStore((state) => state.isOnboarded);
    const isLoggedIn = useStore((state) => state.isLoggedIn);

    React.useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const data = Linking.parse(event.url);
            if (data.path === 'invite' && data.queryParams?.circleId) {
                navigate('CircleDetail', { circleId: data.queryParams.circleId });
            } else if (data.scheme === 'nur' && data.path === 'events') {
                navigate('AskNur', { showEvents: true });
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        Linking.getInitialURL().then(url => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, [isOnboarded, isLoggedIn]);

    React.useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            if (data?.screen === 'Journal') {
                const userTier = useStore.getState().subscriptionTier;
                if (userTier !== 'free') {
                    navigate('Journal');
                } else {
                    navigate('Subscription');
                }
            } else if (data?.screen === 'Affirmation') {
                navigate('Affirmation');
            } else if (data?.screen === 'AskNur') {
                navigate('AskNur', { showEvents: data.showEvents });
            }
        });

        return () => subscription.remove();
    }, []);

    React.useEffect(() => {
        if (isOnboarded) {
            notificationService.scheduleEveningGratitude();
            notificationService.scheduleNurEventReminder();
        }
    }, [isOnboarded]);

    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.background },
                    gestureEnabled: true,
                    fullScreenGestureEnabled: true,
                    animation: 'slide_from_right'
                }}
            >
                {!isOnboarded ? (
                    <Stack.Group>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </Stack.Group>
                ) : !isLoggedIn ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="Notifications"
                            component={NotificationsScreen}
                            options={{ presentation: 'modal' }}
                        />
                        <Stack.Screen name="CircleDetail" component={CircleDetailScreen} />
                        <Stack.Screen name="JournalDetail" component={JournalDetailScreen} />
                        <Stack.Screen name="BeliefSettings" component={BeliefSettingsScreen} />
                        <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
                        <Stack.Screen name="GoalSettings" component={GoalSettingsScreen} />
                        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                        <Stack.Screen name="CreateCircle" component={CreateCircleScreen} />
                        <Stack.Screen
                            name="SuperAdmin"
                            component={SuperAdminDashboard}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
                        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />

                        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
                        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
                        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                        <Stack.Screen name="TicketScanner" component={TicketScannerScreen} />
                    </Stack.Group>

                )}
                <Stack.Screen
                    name="UserGuide"
                    component={UserGuideScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
            {isOnboarded && isLoggedIn && <DailyWisdomModal />}
        </>
    );
};
