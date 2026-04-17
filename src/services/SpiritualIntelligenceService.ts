import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AIProvider = 'LocalMock' | 'OpenAI' | 'Groq' | 'Custom' | 'Gemini';

export interface ChatHistoryMessage {
    role: 'user' | 'assistant';
    content: string;
}

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
const STORAGE_KEY_DAILY_QUOTA = 'ai_daily_quota_stats';
const MAX_DAILY_CALLS = 100; // Increased for thorough testing

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

    generateChat: async (systemPrompt: string, messages: ChatHistoryMessage[], jsonMode = false): Promise<string> => {
        // --- Quota Check ---
        const today = new Date().toISOString().split('T')[0];
        const quotaDataStr = await AsyncStorage.getItem(STORAGE_KEY_DAILY_QUOTA);
        let quotaData = quotaDataStr ? JSON.parse(quotaDataStr) : { date: today, count: 0 };

        if (quotaData.date !== today) quotaData = { date: today, count: 0 };

        if (quotaData.count >= MAX_DAILY_CALLS) {
            console.warn(`Spiritual Intelligence Quota Exceeded for ${today}.`);
            return "The sanctuary is currently resting to preserve its energy. Your guide will return with fresh insights tomorrow morning. In the meantime, find stillness in your current reflections.";
        }

        const provider = await SpiritualIntelligenceService.getProvider();

        if (provider === 'LocalMock') {
            throw new Error('LocalMock provider does not support dynamic generation. Use static templates.');
        }

        let apiKey = await SpiritualIntelligenceService.getApiKey(provider);
        let endpoint = '';
        const model = await SpiritualIntelligenceService.getModel();

        if (provider === 'Gemini') {
            const storedKey = await SpiritualIntelligenceService.getApiKey(provider);
            apiKey = storedKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

            if (!apiKey) throw new Error("Missing Gemini API Key. Please check your configuration.");

            const geminiModel = 'gemini-2.5-flash';
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

            // Map standard messages to Gemini format
            const geminiContents = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: systemPrompt }]
                        },
                        contents: geminiContents,
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2048,
                            ...(jsonMode ? { responseMimeType: 'application/json' } : {})
                        }
                    })
                });

                if (!response.ok) {
                    const errorJson = await response.json().catch(() => ({}));
                    const errorMsg = errorJson?.error?.message || response.statusText || 'Unknown error';
                    throw new Error(`Gemini API ${response.status}: ${errorMsg}`);
                }

                const data = await response.json();
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                    quotaData.count += 1;
                    await AsyncStorage.setItem(STORAGE_KEY_DAILY_QUOTA, JSON.stringify(quotaData));
                    return data.candidates[0].content.parts[0].text;
                } else {
                    return "The sanctuary is currently in a state of deep reflection. Please try again in a moment.";
                }
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                if (message.includes('429')) return "The sanctuary is receiving many seekers. Please pause for a moment and try again.";
                if (message.includes('API key') || message.includes('API_KEY_INVALID') || message.includes('403')) return `Guidance Interrupted: API Configuration Error. Please contact support.`;
                if (message.includes('400') || message.includes('404')) return `Guidance Interrupted: Service Endpoint Error.`;
                return "I am currently taking a moment of silence. Please try again soon.";
            }
        }

        // OpenAi / Groq / Custom logic
        if (!apiKey) throw new Error(`Missing API Key for provider: ${provider}`);

        const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content }))
            ],
            temperature: 0.7
        };

        try {
            switch (provider) {
                case 'OpenAI': endpoint = 'https://api.openai.com/v1/chat/completions'; break;
                case 'Groq': 
                    endpoint = 'https://api.groq.com/openai/v1/chat/completions'; 
                    if (!model.includes('llama') && !model.includes('mixtral')) body.model = 'llama3-8b-8192';
                    break;
                case 'Custom': 
                    const customUrl = await SpiritualIntelligenceService.getCustomEndpoint();
                    if (!customUrl) throw new Error('Custom endpoint URL not configured');
                    endpoint = customUrl;
                    break;
            }

            const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
            if (!response.ok) throw new Error(`Spiritual Intelligence Provider Error (${response.status}): ${await response.text()}`);

            const data = await response.json();
            quotaData.count += 1;
            await AsyncStorage.setItem(STORAGE_KEY_DAILY_QUOTA, JSON.stringify(quotaData));
            return data.choices[0].message.content.trim();
        } catch (error) {
            throw error;
        }
    },

    generateText: async (systemPrompt: string, userPrompt: string, jsonMode = false): Promise<string> => {
        // --- Quota Check ---
        const today = new Date().toISOString().split('T')[0];
        const quotaDataStr = await AsyncStorage.getItem(STORAGE_KEY_DAILY_QUOTA);
        let quotaData = quotaDataStr ? JSON.parse(quotaDataStr) : { date: today, count: 0 };

        // Reset if new day
        if (quotaData.date !== today) {
            quotaData = { date: today, count: 0 };
        }

        if (quotaData.count >= MAX_DAILY_CALLS) {
            console.warn(`Spiritual Intelligence Quota Exceeded for ${today}.`);
            return "The sanctuary is currently resting to preserve its energy. Your guide will return with fresh insights tomorrow morning. In the meantime, find stillness in your current reflections.";
        }

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
                console.error("[Gemini] No API Key found in Store or Env");
                throw new Error("Missing Gemini API Key. Please check your configuration.");
            }

            // Use Google Generative AI REST API (v1beta for 2.5-flash support)
            const geminiModel = 'gemini-2.5-flash';
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `${systemPrompt}\n\nUser: ${userPrompt}` }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024,
                            ...(jsonMode ? { responseMimeType: 'application/json' } : {})
                        }
                    })
                });

                if (!response.ok) {
                    const errorJson = await response.json().catch(() => ({}));
                    const errorMsg = errorJson?.error?.message || response.statusText || 'Unknown error';
                    console.error("[Gemini] API Error Response:", errorMsg);
                    throw new Error(`Gemini API ${response.status}: ${errorMsg}`);
                }

                const data = await response.json();
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                    const result = data.candidates[0].content.parts[0].text;

                    // Increment Quota on successful call
                    quotaData.count += 1;
                    await AsyncStorage.setItem(STORAGE_KEY_DAILY_QUOTA, JSON.stringify(quotaData));

                    return result;
                } else {
                    console.error("[Gemini] Unexpected data structure:", JSON.stringify(data));
                    return "The sanctuary is currently in a state of deep reflection. Please try again in a moment.";
                }

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("[Gemini] Generation Caught Error:", message);
                
                if (message.includes('429')) {
                    return "The sanctuary is receiving many seekers. Please pause for a moment and try again.";
                }
                
                // For dev/test builds or major config issues, let the user know what's wrong precisely
                if (message.includes('API key') || message.includes('API_KEY_INVALID') || message.includes('403')) {
                    return `Guidance Interrupted: API Configuration Error. Please contact support.`;
                }

                if (message.includes('400') || message.includes('404')) {
                    return `Guidance Interrupted: Service Endpoint Error.`;
                }

                return "I am currently taking a moment of silence. Please try again soon.";
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
            const result = data.choices[0].message.content.trim();

            // Increment Quota on successful call
            quotaData.count += 1;
            await AsyncStorage.setItem(STORAGE_KEY_DAILY_QUOTA, JSON.stringify(quotaData));

            return result;

        } catch (error) {
            console.error('SpiritualIntelligenceService Generation Error:', error);
            throw error; // Re-throw for UI handling
        }
    }
};
