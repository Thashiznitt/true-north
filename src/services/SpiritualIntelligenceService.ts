import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AIProvider = 'LocalMock' | 'OpenAI' | 'Groq' | 'Custom' | 'Gemini';

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

export const SpiritualIntelligenceService = {
    // --- Configuration Management ---

    getProvider: async (): Promise<AIProvider> => {
        const provider = await AsyncStorage.getItem(STORAGE_KEY_PROVIDER);
        // Default to 'Gemini' if not set, so users get "live" Spiritual Intelligence out of the box with our system key
        return (provider as AIProvider) || 'Gemini';
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
        const provider = await SpiritualIntelligenceService.getProvider();

        // Check if using default/system provider (Gemini via Env) or local mock
        if (provider === 'LocalMock') {
            // If we have a system key, we can try to use it even if provider says 'LocalMock' 
            // (unless user explicitly wants offline mode, but for now we assume 'LocalMock' means 'Offline/Dev')
            // However, to fix the user issue where Spiritual Intelligence should "just work", we will treat 'Gemini' as the default if 'LocalMock' is selected but we are in PROD.
            // For safety, let's keep LocalMock strict for dev, but we expect the app to default to Gemini in prod if we change the default getProvider logic.
            // Actually, let's just add the Gemini logic.
            throw new Error('LocalMock provider does not support dynamic generation. Use static templates.');
        }

        let apiKey = await SpiritualIntelligenceService.getApiKey(provider);
        let endpoint = '';
        const model = await SpiritualIntelligenceService.getModel();

        // Special handling for System Gemini
        if (provider === 'Gemini') {
            // Try to get from secure store first (if user overrode it), else use env
            const storedKey = await SpiritualIntelligenceService.getApiKey(provider);
            apiKey = storedKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

            if (!apiKey) {
                throw new Error("Missing Gemini API Key. Please check your configuration.");
            }

            // Use Google Generative Spiritual Intelligence REST API
            // For simplicity, we'll use the v1beta/models/gemini-pro:generateContent endpoint
            // Note: 'model' from storage might be 'gpt-4o-mini', so we force a gemini model if it's mismatched
            const geminiModel = 'gemini-flash-latest'; // Verified working identifier
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\nUser: ${userPrompt}` }] // Gemini doesn't have system role in simple API, often prepended
                        }]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Gemini API Error (${response.status}) for ${geminiModel}: ${errorText}`);
                }

                const data = await response.json();
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    return "No response from Spirit Guide.";
                }

            } catch (error) {
                console.error("Gemini Generation Error:", error);
                throw error;
            }
        }

        // ... Existing OpenAI/Groq/Custom logic ...
        if (!apiKey) {
            throw new Error(`Missing API Key for provider: ${provider}`);
        }

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
                    const customUrl = await SpiritualIntelligenceService.getCustomEndpoint();
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
                throw new Error(`Spiritual Intelligence Provider Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error('SpiritualIntelligenceService Generation Error:', error);
            throw error; // Re-throw for UI handling
        }
    }
};
