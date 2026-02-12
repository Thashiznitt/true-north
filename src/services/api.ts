import axios from 'axios';

// This would typically come from an environment variable
const API_BASE_URL = 'https://api.truenorth.app/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Affirmation {
    id: string;
    text: string;
    verse?: string;
    quote?: string;
    imageUrl: string;
    songTitle?: string;
    songUrl?: string;
}

export const affirmationService = {
    getDaily: async (): Promise<Affirmation> => {
        // Mocking API for now as per instructions "Do NOT embed AI logic inside mobile app"
        // In production, this calls the backend API
        const response = await apiClient.get<Affirmation>('/affirmations/daily');
        return response.data;
    },
};
