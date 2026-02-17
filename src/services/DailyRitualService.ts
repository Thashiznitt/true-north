import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_LAST_SEEN_WISDOM = 'last_seen_wisdom_date';

export const AFFIRMATIONS = [
    { text: "My spirit is anchored in the peace that surpasses all understanding.", author: "Sacred Truth" },
    { text: "I am a vessel of divine light, radiating love to everyone I meet.", author: "Daily Grace" },
    { text: "Today, I walk with purpose and intentionality.", author: "Faithful Path" },
    { text: "Every breath I take is a gift of grace.", author: "True North" },
    { text: "I focus my heart on what is pure, lovely, and of good report.", author: "Alignment" },
    { text: "I am worthy of the journey I am on.", author: "Inner Wisdom" },
    { text: "Gratitude turns what I have into enough.", author: "Daily Thanks" },
];

export const DailyRitualService = {
    getDailyAffirmation: () => {
        const day = new Date().getDate();
        return AFFIRMATIONS[day % AFFIRMATIONS.length];
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
};
