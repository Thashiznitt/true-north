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
    goals: any;
    notifications: {
        enabled: boolean;
        time: string;
    };
    bookmarkedCircleIds: string[];
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
    toggleBookmark: (circleId: string) => void;
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
            goals: {},
            notifications: {
                enabled: true,
                time: '07:30',
            },
            bookmarkedCircleIds: [],
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
            setPreferences: (belief, themes, goals) => set({ beliefType: belief, themes, goals }),
            updateNotificationSettings: (enabled, time) => set({ notifications: { enabled, time } }),
            addCreatedCircle: (circle) => set((state) => ({ createdCircles: [circle, ...state.createdCircles] })),
            toggleBookmark: (circleId) => set((state) => ({
                bookmarkedCircleIds: state.bookmarkedCircleIds.includes(circleId)
                    ? state.bookmarkedCircleIds.filter(id => id !== circleId)
                    : [...state.bookmarkedCircleIds, circleId]
            })),
        }),
        {
            name: 'true-north-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
