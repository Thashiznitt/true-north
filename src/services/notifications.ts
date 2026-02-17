import * as Notifications from 'expo-notifications';

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
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                hour,
                minute,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });
    },
};
