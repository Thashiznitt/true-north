// This would typically come from an environment variable
const API_BASE_URL = 'https://api.truenorth.app/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Request failed: ${response.statusText}`);
    }

    return response.json();
}

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
        return request<Affirmation>('/affirmations/daily');
    },
};
