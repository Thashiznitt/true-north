import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notifications';

export type UserRole = 'member' | 'moderator' | 'admin' | 'platform_admin';
export type BeliefType = 'Christian' | 'Muslim' | 'Secular' | 'Exploring' | 'Open';

interface UserState {
    isOnboarded: boolean;
    isSubscribed: boolean;
    username: string;
    profilePicture: string | null;
    role: UserRole;
    beliefType: BeliefType | null;
    themes: string[];
    dailyGoals: {
        dailyReflection: boolean;
        morningDevotion: boolean;
        eveningGratitude: boolean;
        weeklyCommunity: boolean;
    };
    notifications: {
        enabled: boolean;
        time: string;
    };
    lastAdviceTimestamp: number | null;
    bookmarkedCircleIds: string[];
    notificationsList: any[];
    createdCircles: any[];
    setOnboarded: (value: boolean) => Promise<void>;
    setSubscribed: (value: boolean) => Promise<void>;
    setUsername: (username: string) => void;
    setProfilePicture: (uri: string | null) => void;
    setRole: (role: UserRole) => void;
    setBeliefType: (belief: BeliefType | null) => void;
    setThemes: (themes: string[]) => void;
    setPreferences: (belief: BeliefType, themes: string[], goals: any) => void;
    updateNotificationSettings: (enabled: boolean, time: string) => void;
    addCreatedCircle: (circle: any) => void;
    deleteCreatedCircle: (circleId: string) => void;
    flagCircle: (circleId: string) => void;
    toggleBookmark: (circleId: string) => void;
    setLastAdviceTimestamp: (timestamp: number) => void;
    addNotification: (notification: any) => void;
    cleanupOldNotifications: () => void;
    toggleDailyGoal: (key: string) => void;
}

export const useStore = create<UserState>()(
    persist(
        (set, get) => ({
            isOnboarded: false,
            isSubscribed: false,
            username: '',
            profilePicture: null,
            role: 'member',
            beliefType: null,
            themes: [],
            dailyGoals: {
                dailyReflection: true,
                morningDevotion: true,
                eveningGratitude: false,
                weeklyCommunity: true,
            },
            notifications: {
                enabled: true,
                time: '07:30',
            },
            lastAdviceTimestamp: null,
            bookmarkedCircleIds: [],
            notificationsList: [
                { id: '1', title: 'New Affirmation', message: 'Your personal alignment for today is ready.', type: 'affirmation', createdAt: Date.now() - 2 * 60 * 60 * 1000 },
                { id: '2', title: 'Blessing Received', message: 'Sarah blessed your reflection in Nairobi Chapel Circle.', type: 'blessing', createdAt: Date.now() - 4 * 60 * 60 * 1000 },
                { id: '3', title: 'Upcoming Event', message: 'Business Alignment session starts in 30 minutes.', type: 'event', createdAt: Date.now() - 24 * 60 * 60 * 1000 },
            ],
            createdCircles: [],
            setOnboarded: async (isOnboarded: boolean) => {
                if (isOnboarded) {
                    const hasPermission = await notificationService.requestPermissions();
                    if (hasPermission) {
                        await notificationService.scheduleDailyAffirmation(get().isSubscribed);
                    }
                }
                set({ isOnboarded });
            },
            setSubscribed: async (isSubscribed: boolean) => {
                set({ isSubscribed });
                await notificationService.scheduleDailyAffirmation(isSubscribed);
            },
            setUsername: (username) => set({ username }),
            setProfilePicture: (profilePicture) => set({ profilePicture }),
            setRole: (role) => set({ role }),
            setBeliefType: (beliefType) => set({ beliefType }),
            setThemes: (themes) => set({ themes }),
            setPreferences: (belief, themes, dailyGoals) => set({ beliefType: belief, themes, dailyGoals }),
            updateNotificationSettings: (enabled, time) => set({ notifications: { enabled, time } }),
            addCreatedCircle: (circle) => set((state) => ({ createdCircles: [circle, ...state.createdCircles] })),
            deleteCreatedCircle: (circleId) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                const newCreatedCircles = state.createdCircles.filter(c => c.id !== circleId);

                // Add notification about deletion
                if (circle) {
                    const notification = {
                        title: 'Sanctuary Closed',
                        message: `The sanctuary "${circle.name}" has been closed by the admin.`,
                        type: 'community'
                    };
                    return {
                        createdCircles: newCreatedCircles,
                        notificationsList: [{ ...notification, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }, ...state.notificationsList]
                    };
                }
                return { createdCircles: newCreatedCircles };
            }),
            flagCircle: (circleId) => {
                // In a real app, this would send to a moderation API
                // For now, we simulate the logic in the component but could store flag state here
            },
            toggleBookmark: (circleId) => set((state) => ({
                bookmarkedCircleIds: state.bookmarkedCircleIds.includes(circleId)
                    ? state.bookmarkedCircleIds.filter(id => id !== circleId)
                    : [...state.bookmarkedCircleIds, circleId]
            })),
            setLastAdviceTimestamp: (lastAdviceTimestamp) => set({ lastAdviceTimestamp }),
            addNotification: (notification) => set((state) => ({
                notificationsList: [{ ...notification, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }, ...state.notificationsList]
            })),
            cleanupOldNotifications: () => set((state) => {
                const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
                const now = Date.now();
                return {
                    notificationsList: state.notificationsList.filter(n => (now - n.createdAt) < SEVEN_DAYS_MS)
                };
            }),
            toggleDailyGoal: (key) => set((state) => ({
                dailyGoals: {
                    ...state.dailyGoals,
                    [key]: !state.dailyGoals[key as keyof typeof state.dailyGoals]
                }
            })),
        }),
        {
            name: 'true-north-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
