import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_LAST_SEEN_WISDOM = 'last_seen_wisdom_date';
const STORAGE_KEY_LAST_SEEN_ADVICE = 'last_seen_advice_date';

import { contentAgentService } from './ContentAgentService';
import { useStore } from '../store';

export const DailyRitualService = {
    getDailyAffirmation: async () => {
        try {
            const { beliefType, themes } = useStore.getState();
            // We use the content agent to get a personalized affirmation
            // It internally handles the "Sacred Calendar" logic we just added
            const affirmation = await contentAgentService.getDailyAffirmation(beliefType || 'Open', themes || []);

            return {
                text: affirmation.text,
                author: affirmation.verse || "Daily Wisdom"
            };
        } catch (error) {
            console.error('Error fetching daily ritual affirmation:', error);
            // Fallback (simulating the old static list behavior if offline/error)
            return {
                text: "My spirit is anchored in the peace that surpasses all understanding.",
                author: "Sacred Truth"
            };
        }
    },

    shouldShowMorningWisdom: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const lastSeen = await AsyncStorage.getItem(STORAGE_KEY_LAST_SEEN_WISDOM);
            return lastSeen !== today;
        } catch (error) {
            console.error('Error checking daily wisdom status:', error);
            return false;
        }
    },

    markMorningWisdomShown: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(STORAGE_KEY_LAST_SEEN_WISDOM, today);
        } catch (error) {
            console.error('Error marking daily wisdom shown:', error);
        }
    },

    shouldShowAdvice: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const lastSeen = await AsyncStorage.getItem(STORAGE_KEY_LAST_SEEN_ADVICE);
            return lastSeen !== today;
        } catch (error) {
            console.error('Error checking daily advice status:', error);
            return false;
        }
    },

    markAdviceShown: async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(STORAGE_KEY_LAST_SEEN_ADVICE, today);
        } catch (error) {
            console.error('Error marking daily advice shown:', error);
        }
    },
};
