import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useStore } from '../store';
import { Home, BookOpen, Users, User, Bell } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';

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
import { theme, palette } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params?: any) {
    if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate(name, params);
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
    }, [isOnboarded]);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
            {!isOnboarded ? (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
};
