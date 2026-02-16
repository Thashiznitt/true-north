import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../services/notifications';

export type UserRole = 'member' | 'moderator' | 'admin' | 'platform_admin';
import { BeliefType } from '../types';
export { BeliefType };

export interface DailyGoals {
    dailyReflection: boolean;
    morningDevotion: boolean;
    eveningGratitude: boolean;
    weeklyCommunity: boolean;
}

export interface NotificationSettings {
    enabled: boolean;
    time: string;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'affirmation' | 'blessing' | 'event' | 'community';
    createdAt: number;
}

export interface CreatedCircle {
    id: string;
    name: string;
    belief: BeliefType;
    members: number;
    type: 'Public' | 'Private';
    city: string;
    country: string;
    description: string;
    lastActivity: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reflections: any[];
    createdAt: number;
    theme?: string;
}

export interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    tags?: string[];
}

interface UserState {
    isOnboarded: boolean;
    isSubscribed: boolean;
    username: string;
    email: string | null;
    profilePicture: string | null;
    role: UserRole;
    isLoggedIn: boolean;
    biometricsEnabled: boolean;
    securityPin: string | null;
    beliefType: BeliefType | null;
    themes: string[];
    dailyGoals: {
        dailyReflection: boolean;
        morningDevotion: boolean;
        eveningGratitude: boolean;
        weeklyCommunity: boolean;
    };
    notifications: NotificationSettings;
    lastAdviceTimestamp: number | null;
    bookmarkedCircleIds: string[];
    notificationsList: NotificationItem[];
    createdCircles: CreatedCircle[];
    journalEntries: JournalEntry[];
    setOnboarded: (value: boolean) => Promise<void>;
    setSubscribed: (value: boolean) => Promise<void>;
    setUsername: (username: string) => void;
    setEmail: (email: string | null) => void;
    setProfilePicture: (uri: string | null) => void;
    setRole: (role: UserRole) => void;
    setLoggedIn: (value: boolean) => void;
    setBiometricsEnabled: (value: boolean) => void;
    setSecurityPin: (pin: string | null) => void;
    setBeliefType: (belief: BeliefType | null) => void;
    setThemes: (themes: string[]) => void;
    setPreferences: (belief: BeliefType, themes: string[], goals: DailyGoals) => void;
    updateNotificationSettings: (enabled: boolean, time: string) => void;
    addCreatedCircle: (circle: CreatedCircle) => void;
    deleteCreatedCircle: (circleId: string) => void;
    flagCircle: (circleId: string) => void;
    toggleBookmark: (circleId: string) => void;
    setLastAdviceTimestamp: (timestamp: number) => void;
    addNotification: (notification: NotificationItem) => void;
    cleanupOldNotifications: () => void;
    toggleDailyGoal: (key: keyof DailyGoals) => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
    updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;
    deleteJournalEntry: (id: string) => void;
}

export const useStore = create<UserState>()(
    persist(
        (set, get) => ({
            isOnboarded: false,
            isSubscribed: false,
            username: '',
            email: null,
            profilePicture: null,
            role: 'member',
            isLoggedIn: true, // Default to true for demo flow
            biometricsEnabled: false,
            securityPin: null,
            beliefType: 'Christian',
            themes: ['Faith', 'Perseverance', 'Gratitude'],
            selectedTheme: 'Strength',
            dailyGoals: {
                dailyReflection: false,
                morningDevotion: false,
                eveningGratitude: false,
                weeklyCommunity: false,
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
            journalEntries: [
                { id: '1', date: 'Oct 24, 2023', title: 'A New Beginning', content: 'Today was the first day I felt truly aligned. The morning affirmation really spoke to me...' },
                { id: '2', date: 'Oct 23, 2023', title: 'Strength in Silence', content: 'Finding peace in the quiet moments between meetings. Focusing on the "Strength" theme.' },
            ],
            setOnboarded: async (isOnboarded: boolean) => {
                if (isOnboarded) {
                    const hasPermission = await notificationService.requestPermissions();
                    if (hasPermission) {
                        await notificationService.scheduleDailyAffirmation(get().isSubscribed);
                    }
                } else {
                    // Reset ALL user state when resetting onboarding
                    set({
                        isLoggedIn: false,
                        isSubscribed: false,
                        username: '',
                        profilePicture: null,
                        biometricsEnabled: false,
                        securityPin: null,
                        beliefType: 'Spiritual',
                        themes: [],
                        dailyGoals: {
                            dailyReflection: true,
                            morningDevotion: true,
                            eveningGratitude: false,
                            weeklyCommunity: true,
                        }
                    });
                }
                set({ isOnboarded });
            },
            setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
            setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
            setSecurityPin: (securityPin) => set({ securityPin }),
            setSubscribed: async (isSubscribed: boolean) => {
                set({ isSubscribed });
                await notificationService.scheduleDailyAffirmation(isSubscribed);
            },
            setUsername: (username) => set({ username }),
            setEmail: (email) => set({ email }),
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
                    const notification: NotificationItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'Sanctuary Closed',
                        message: `The sanctuary "${circle.name}" has been closed by the admin.`,
                        type: 'community',
                        createdAt: Date.now()
                    };
                    return {
                        createdCircles: newCreatedCircles,
                        notificationsList: [notification, ...state.notificationsList]
                    };
                }
                return { createdCircles: newCreatedCircles };
            }),
            flagCircle: (circleId) => {
                console.log('Flagging circle:', circleId);
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
            addJournalEntry: (entry) => set((state) => ({
                journalEntries: [{ ...entry, id: Math.random().toString(36).substr(2, 9) }, ...state.journalEntries]
            })),
            updateJournalEntry: (id, entry) => set((state) => ({
                journalEntries: state.journalEntries.map(e => e.id === id ? { ...e, ...entry } : e)
            })),
            deleteJournalEntry: (id) => set((state) => ({
                journalEntries: state.journalEntries.filter(e => e.id !== id)
            })),
        }),
        {
            name: 'true-north-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
