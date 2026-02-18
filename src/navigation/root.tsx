/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store';
import { Home, BookOpen, Users, User } from 'lucide-react-native';
import * as Linking from 'expo-linking';


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
import { SuperAdminScreen } from '../features/admin/SuperAdminScreen';
import { notificationService } from '../services/notifications';
import { TermsOfServiceScreen } from '../features/profile/TermsOfServiceScreen';
import { NotificationSettingsScreen } from '../features/profile/NotificationSettingsScreen';
import { PrivacySettingsScreen } from '../features/profile/PrivacySettingsScreen';
import { HelpCenterScreen } from '../features/profile/HelpCenterScreen';
import { PrivacyPolicyScreen } from '../features/profile/PrivacyPolicyScreen';
import { UserProfileScreen } from '../features/community/UserProfileScreen';
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

const MainTabs = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
            headerTitleStyle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text },
            tabBarStyle: {
                backgroundColor: theme.colors.background,
                borderTopColor: theme.colors.border,
                height: Platform.OS === 'ios' ? 90 : 70,
                paddingTop: 10,
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
                tabBarIcon: ({ color }) => <Home size={22} color={color} />
            }}
        />
        <Tab.Screen
            name="Journal"
            component={JournalScreen}
            options={{
                headerShown: false,
                tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />
            }}
        />
        <Tab.Screen
            name="Circles"
            component={CommunityScreen}
            options={{
                headerShown: false,
                tabBarIcon: ({ color }) => <Users size={22} color={color} />
            }}
        />
        <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
                headerShown: false,
                tabBarIcon: ({ color }) => <User size={22} color={color} />
            }}
        />
    </Tab.Navigator>
);

export const RootNavigator = () => {
    const isOnboarded = useStore((state) => state.isOnboarded);
    const isLoggedIn = useStore((state) => state.isLoggedIn);

    React.useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const data = Linking.parse(event.url);
            if (data.path === 'invite' && data.queryParams?.circleId) {
                navigate('CircleDetail', { circleId: data.queryParams.circleId });
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);

        Linking.getInitialURL().then(url => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, [isOnboarded, isLoggedIn]);

    React.useEffect(() => {
        if (isOnboarded) {
            notificationService.scheduleEveningGratitude();
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
                        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
                        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />

                        <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
                        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
                        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                    </Stack.Group>
                )}
                <Stack.Screen
                    name="SuperAdmin"
                    component={SuperAdminScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
            {isOnboarded && isLoggedIn && <DailyWisdomModal />}
        </>
    );
};
