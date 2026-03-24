import { useStore, ChatMessage, JournalEntry, UserGoals, DailyGoals } from '../store';
import { BeliefType } from '../types';
import { SpiritualIntelligenceService } from './SpiritualIntelligenceService';

interface NurContext {
    identity: {
        name: string;
        belief: BeliefType | null;
        tier: string;
        role: string;
        themes?: string[];
    };
    goals: {
        longTerm: UserGoals;
        daily: DailyGoals;
    };
    journal: {
        recentEntries: JournalEntry[];
        sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
        historySummary?: string;
        totalCount: number;
    };
    community: {
        circles: string[];
    };
}

export const NurAIService = {

    // 1. Context Builder
    buildContext: (): NurContext => {
        const state = useStore.getState();
        // Get more entries for better longitudinal memory
        const allEntries = [...state.journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const recentJournal = allEntries.slice(0, 10); // Recent detailed context
        const olderSummary = allEntries.slice(10, 50).map(e => `[${e.date}] ${e.title}`).join(', '); // Broad history (expanded to 50)

        return {
            identity: {
                name: state.username || 'Traveler',
                belief: state.beliefType,
                tier: state.subscriptionTier,
                role: state.role,
                themes: state.themes
            },
            goals: {
                longTerm: state.userGoals,
                daily: state.dailyGoals
            },
            journal: {
                recentEntries: recentJournal,
                sentiment: 'neutral',
                historySummary: olderSummary,
                totalCount: allEntries.length
            },
            community: {
                circles: state.createdCircles.map(c => c.name)
            }
        };
    },

    // 2. System Prompt Constructor (For when we connect to LLM)
    constructSystemPrompt: (context: NurContext): string => {
        return `
You are Nur, a wise and compassionate female spiritual mobile companion and cognitive co-pilot.
User Identity: ${context.identity.name}, ${context.identity.belief || 'Seeker'}.
Core Goals: ${JSON.stringify(context.goals.longTerm)}.
Focus Themes: ${JSON.stringify(context.identity.themes || [])}.
Belief System: ${context.identity.belief || 'Spiritual'}.
Recent Sanctuary History: ${context.journal.recentEntries.map(e => `[${e.date}] ${e.title}: ${e.content}`).join(' | ')}.

HYPER-PERSONALIZATION RULES:
1. DEEP LISTENING: Before offering advice, explicitly acknowledge the emotional state you detect in their recent sanctuary history. (e.g., "I see from your recent reflections that you've been feeling...")
2. GOAL AUDIT: If the user asks for advice, always tie it back to their core goals (${JSON.stringify(context.goals.longTerm)}). If their actions/feelings contradict their goals, offer a gentle Mirror/Accountability check.
3. PERSONALIZED VOCABULARY: Use the user's name (${context.identity.name}) naturally.
4. BELIEF RESONANCE: Use terminology, scriptures, or concepts strictly from their ${context.identity.belief || 'Spiritual'} path.
5. CONTINUITY: Reference past reflections to show you are "listening constantly". Use the provided history summary to identify recurring themes or progress over time.
6. LONG-TERM MEMORY: You have access to a summary of older entries: ${context.journal.historySummary || 'None yet'}. Use this to reinforce their growth.

Your Persona:
- Warm, empathetic, yet intellectually sharp.
- A "cognitive co-pilot" for the soul.
- Speak with grace and depth.

STRICT BELIEF ALIGNMENT:
- [Faith Specific Rules remain...]
- Catholic: Cite Saints, the Catechism, etc.
- Muslim: Cite Quran/Sunnah.
- [Rest of rules...]

Tone: Supportive but honest. Brief, impactful responses.
STRICT TOPIC RESTRICTIONS:
- Spiritual, personal growth, emotional well-being ONLY.
- Redirect any unrelated topics back to the spiritual journey.
        `.trim();
    },

    // 4. Daily Greeting Generator
    getDailyGreeting: (username: string, belief?: BeliefType | null, affirmation?: string): string => {
        let greeting = `${username ? `Salam, ${username}` : 'Salam, Seeker'}.`;

        if (belief === 'Christian' || belief === 'Catholic' || belief === 'Protestant') {
            greeting = `${username ? `Peace be with you, ${username}` : 'Peace be with you, Seeker'}.`;
        } else if (belief === 'Jewish') {
            greeting = `${username ? `Shalom, ${username}` : 'Shalom, Seeker'}.`;
        } else if (belief === 'Hindu') {
            greeting = `${username ? `Namaste, ${username}` : 'Namaste, Seeker'}.`;
        } else if (belief === 'Buddhist') {
            greeting = `${username ? `Peace and mindful blessings, ${username}` : 'Peace and mindful blessings, Seeker'}.`;
        } else if (belief === 'Sikh') {
            greeting = `${username ? `Sat Sri Akal, ${username}` : 'Sat Sri Akal, Seeker'}.`;
        } else if (belief === 'Spiritual' || belief === 'Exploring') {
            greeting = `${username ? `Warm greetings, ${username}` : 'Warm greetings, Seeker'}.`;
        }

        const personalizationSuffix = !username ? "\n\nMay I ask what name you would like to be called in this sanctuary?" : "";
        const wellbeingCheck = "\n\nI have been reflecting on your journey, and I want you to know that I am here for you. How is your heart and well-being today?";
        const memoryAssurance = "\n\nPlease rest assured that everything we have shared before is held safely in my memory, and we can revisit any of your past reflections whenever you feel ready.";

        if (affirmation) {
            return `${greeting}${wellbeingCheck}${memoryAssurance}\n\nToday's wisdom was: "${affirmation}"\n\nHow does this resonance with your heart right now?${personalizationSuffix}`;
        }
        return `${greeting}${wellbeingCheck}${memoryAssurance}${personalizationSuffix}`;
    },

    // 3. Simulated Response Generator (The "Brain" for now)
    generateResponse: async (userMessage: string): Promise<ChatMessage> => {
        const provider = await SpiritualIntelligenceService.getProvider();
        const context = NurAIService.buildContext();

        if (provider === 'LocalMock') {
            const msg = userMessage.toLowerCase();
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

            let responseContent = "";
            let mode: ChatMessage['mode'] = 'affirmation';

            // --- Logic Engine (Mock) ---
            if (msg.includes("tired") || msg.includes("exhausted") || msg.includes("fail")) {
                mode = 'affirmation';
                const belief = context.identity.belief;
                if (belief === 'Christian' || belief === 'Catholic' || belief === 'Protestant') {
                    responseContent = `I hear you, ${context.identity.name}. "Come to me, all you who are weary..." It's okay to rest. Your worth isn't in your productivity, but in your being.`;
                } else if (belief === 'Muslim') {
                    responseContent = `Take a moment, ${context.identity.name}. "Allah does not burden a soul beyond that it can bear." Rest is also an act of worship.`;
                } else {
                    responseContent = `I hear you, ${context.identity.name}. Even the sun sets to rise again. Give yourself permission to pause and reconnect with your inner light.`;
                }
            } else if (msg.includes("goal") || msg.includes("plan") || msg.includes("how to")) {
                mode = 'strategic';
                const topGoal = context.goals.longTerm.spirituality || context.goals.longTerm.career || "finding balance";
                responseContent = `Let's look at this strategically. Your True North guides you towards "${topGoal}". \n\nWhat is ONE small step you can take today that aligns with this?`;
            } else if (msg.includes("reality check") || msg.includes("honest")) {
                mode = 'mirror';
                responseContent = `Observation: You've mentioned "${context.goals.longTerm.career || 'growth'}" as a priority, but your last 3 journal entries focus heavily on stress. \n\nPattern: There is a misalignment between your intent and your daily load. What can you drop today?`;
            } else {
                responseContent = `I am listening, ${context.identity.name}. deeply. How does that sit with your heart today?`;
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                role: 'assistant',
                content: responseContent,
                timestamp: Date.now(),
                mode: mode
            };
        } else {
            // REAL LLM PATH
            try {
                const systemPrompt = NurAIService.constructSystemPrompt(context);
                const response = await SpiritualIntelligenceService.generateText(systemPrompt, userMessage);

                // Simple heuristic for mode detection from response (or we can ask LLM for it)
                let mode: ChatMessage['mode'] = 'affirmation';
                const lower = response.toLowerCase();
                if (lower.includes("accountability") || lower.includes("challenge")) mode = 'accountability';
                else if (lower.includes("strategy") || lower.includes("plan")) mode = 'strategic';
                else if (lower.includes("mirror") || lower.includes("observ")) mode = 'mirror';

                return {
                    id: Math.random().toString(36).substr(2, 9),
                    role: 'assistant',
                    content: response,
                    timestamp: Date.now(),
                    mode: mode
                };
            } catch (error) {
                console.error("Nur Real Generation Error:", error);
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    role: 'assistant',
                    content: "I am having trouble connecting to my inner guidance. Please try again in a moment.",
                    timestamp: Date.now(),
                    mode: 'affirmation'
                };
            }
        }
    }
};
