import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AIProvider = 'LocalMock' | 'OpenAI' | 'Groq' | 'Custom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AIConfig {
    provider: AIProvider;
    apiKey?: string;
    customEndpoint?: string;
    model?: string;
}

const STORAGE_KEY_PROVIDER = 'ai_provider_preference';
const STORAGE_KEY_CUSTOM_ENDPOINT = 'ai_custom_endpoint';
const STORAGE_KEY_MODEL = 'ai_selected_model';
const SECURE_KEY_PREFIX = 'ai_api_key_';

export const AIService = {
    // --- Configuration Management ---

    getProvider: async (): Promise<AIProvider> => {
        const provider = await AsyncStorage.getItem(STORAGE_KEY_PROVIDER);
        return (provider as AIProvider) || 'LocalMock';
    },

    setProvider: async (provider: AIProvider): Promise<void> => {
        await AsyncStorage.setItem(STORAGE_KEY_PROVIDER, provider);
    },

    getApiKey: async (provider: AIProvider): Promise<string | null> => {
        if (provider === 'LocalMock') return null;
        return await SecureStore.getItemAsync(`${SECURE_KEY_PREFIX}${provider}`);
    },

    setApiKey: async (provider: AIProvider, key: string): Promise<void> => {
        if (provider === 'LocalMock') return;
        await SecureStore.setItemAsync(`${SECURE_KEY_PREFIX}${provider}`, key);
    },

    getCustomEndpoint: async (): Promise<string | null> => {
        return await AsyncStorage.getItem(STORAGE_KEY_CUSTOM_ENDPOINT);
    },

    setCustomEndpoint: async (endpoint: string): Promise<void> => {
        await AsyncStorage.setItem(STORAGE_KEY_CUSTOM_ENDPOINT, endpoint);
    },

    getModel: async (): Promise<string> => {
        return (await AsyncStorage.getItem(STORAGE_KEY_MODEL)) || 'gpt-4o-mini';
    },

    setModel: async (model: string): Promise<void> => {
        await AsyncStorage.setItem(STORAGE_KEY_MODEL, model);
    },

    // --- Inference ---

    generateText: async (systemPrompt: string, userPrompt: string): Promise<string> => {
        const provider = await AIService.getProvider();

        if (provider === 'LocalMock') {
            throw new Error('LocalMock provider does not support dynamic generation. Use static templates.');
        }

        const apiKey = await AIService.getApiKey(provider);
        if (!apiKey) {
            throw new Error(`Missing API Key for provider: ${provider}`);
        }

        const model = await AIService.getModel();
        let endpoint = '';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7
        };

        try {
            switch (provider) {
                case 'OpenAI': {
                    endpoint = 'https://api.openai.com/v1/chat/completions';
                    break;
                }
                case 'Groq': {
                    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
                    // Groq requires specific models, ensure user selected one or fallback
                    if (!model.includes('llama') && !model.includes('mixtral')) {
                        body.model = 'llama3-8b-8192'; // Fallback for Groq
                    }
                    break;
                }
                case 'Custom': {
                    const customUrl = await AIService.getCustomEndpoint();
                    if (!customUrl) throw new Error('Custom endpoint URL not configured');
                    endpoint = customUrl;
                    break;
                }
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI Provider Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error('AIService Generation Error:', error);
            throw error; // Re-throw for UI handling
        }
    }
};
