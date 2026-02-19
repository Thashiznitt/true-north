import * as Notifications from 'expo-notifications';
import { useStore } from '../store';
import { LIFE_CIRCLES } from './ContentAgentService';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    requestPermissions: async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    },

    scheduleDailyAffirmation: async (tier: 'free' | 'compass' | 'true_north' | 'zenith') => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const hour = 7;
        const minute = 30;

        // If 'free', they only get it on Mondays (weekday 2 in Expo)
        if (tier === 'free') {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Your Weekly True North",
                    body: "Tap to see your weekly affirmation.",
                    data: { screen: 'Affirmation' },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                    hour,
                    minute,
                    weekday: 2,
                    repeats: true,
                } as Notifications.CalendarTriggerInput,
            });
        } else {
            // Compass, True North, and Zenith get daily affirmations
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Your Daily True North (${tier.replace('_', ' ').toUpperCase()})`,
                    body: "Start your morning with alignment.",
                    data: { screen: 'Affirmation' },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                    hour,
                    minute,
                    repeats: true,
                } as Notifications.CalendarTriggerInput,
            });
        }
    },

    scheduleEveningGratitude: async () => {
        // Schedule for 8:00 PM
        const hour = 20;
        const minute = 0;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Evening Reflection",
                body: "What are you grateful for today?",
                data: { screen: 'Journal' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });
    },

    scheduleDailyJournaling: async (tier: 'free' | 'compass' | 'true_north' | 'zenith') => {
        const isPaid = tier !== 'free';
        const hour = isPaid ? 8 : 9;
        const minute = isPaid ? 30 : 0;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: isPaid ? "Morning Reflection" : "Daily Growth",
                body: isPaid
                    ? "Time to journal. Your morning reflection awaits to keep you aligned."
                    : "Journal your experiences today. Sharing helps us provide better personalized advice!",
                data: { screen: 'Journal' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });
    },

    scheduleNurEventReminder: async () => {
        const state = useStore.getState();
        const { createdCircles, beliefType, themes, lastNurEventNotification } = state;

        // 1. Check if already notified today
        const today = new Date().toDateString();
        const lastNotifiedDate = lastNurEventNotification ? new Date(lastNurEventNotification).toDateString() : null;
        if (lastNotifiedDate === today) return;

        // 2. Find relevant events
        const hasRelevantEvents = createdCircles.some(circle => {
            const alignsBelief = circle.belief === beliefType;
            const alignsTheme = themes.some(t => circle.description?.includes(t) || circle.name.includes(t));
            return (alignsBelief || alignsTheme) && (circle.events?.length || 0) > 0;
        }) || LIFE_CIRCLES.some(circle => {
            const alignsBelief = circle.belief === beliefType;
            const alignsTheme = themes.some(t => circle.description?.includes(t) || circle.name.includes(t));
            return (alignsBelief || alignsTheme) && (circle.events?.length || 0) > 0;
        });

        if (!hasRelevantEvents) return;

        // 3. Schedule for 12:00 PM
        const hour = 12;
        const minute = 0;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Spiritual Gatherings",
                body: "Nur has found events that align with your journey. Tap to see them.",
                data: { screen: 'AskNur', showEvents: true },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });

        // 4. Ideally, we mark it as notified when they TAP it or when we schedule it?
        // Usually, mark as notified when scheduled or when the time passes. 
        // For local simplicity, we'll assume scheduling implies intent to notify.
    },


};
