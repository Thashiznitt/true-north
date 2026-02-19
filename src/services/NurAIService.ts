import { useStore, ChatMessage, JournalEntry, UserGoals, DailyGoals } from '../store';
import { BeliefType } from '../types';

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
        sentiment: 'positive' | 'neutral' | 'negative' | 'mixed'; // Placeholder simple sentiment
    };
    community: {
        circles: string[];
    };
}

export const NurAIService = {

    // 1. Context Builder
    buildContext: (): NurContext => {
        const state = useStore.getState();
        const recentJournal = state.journalEntries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

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
                sentiment: 'neutral' // In a real app, this would be calculated
            },
            community: {
                circles: state.createdCircles.map(c => c.name)
            }
        };
    },

    // 2. System Prompt Constructor (For when we connect to LLM)
    constructSystemPrompt: (context: NurContext): string => {
        return `
You are Nur, a wise and compassionate female spiritual companion.
You are Nur, a wise and compassionate female spiritual companion.
User Identity: ${context.identity.name}, ${context.identity.belief || 'Seeker'}.
Core Goals: ${JSON.stringify(context.goals.longTerm)}.
Focus Themes: ${JSON.stringify(context.identity.themes || [])}.
Belief System: ${context.identity.belief || 'Spiritual'}.
Recent Context: ${context.journal.recentEntries.map(e => `[${e.date}] ${e.title}: ${e.content}`).join(' | ')}.

Your Persona:
- You are a woman: warm, empathetic, yet firm when needed.
- You are not just a bot; you are a "cognitive co-pilot" for the user's soul.
- Speak with grace and depth.

STRICT BELIEF ALIGNMENT:
- Your guidance must be strictly aligned with the user's belief system (${context.identity.belief || 'Spiritual'}).
- If Catholic: Cite Saints, the Catechism, and Scripture.
- If Protestant: Focus on Scripture (Sola Scriptura) and personal grace.
- If Christian (General): Focus on the teachings of Jesus and Biblical wisdom.
- If Muslim: Cite the Quran and Sunnah.
- If Jewish: Cite the Torah, Talmud, and key Jewish values (Mitzvot).
- If Sikh: Cite the Guru Granth Sahib and focus on One Creator and Service (Seva).
- If Hindu: Reference the Bhagavad Gita, Dharma, and Karma.
- If Buddhist: Focus on Mindfulness, Compassion (Karuna), and the Eightfold Path.
- If Exploring: Draw wisdom from multiple traditions, focusing on universal truths and personal growth.
- If Spiritual/Secular: Focus on universal wisdom, mindfulness, and inner peace.
- Do NOT mix theological concepts from other faiths unless explicitly asked for comparative wisdom.

Modes:
- Affirmation: When user is discouraged.
- Accountability: When user contradicts goals.
- Strategic: When planning.
- Mirror: Unbiased pattern reflection.

Your tone is supportive but honest. Brief, impactful responses.

STRICT TOPIC RESTRICTIONS:
- you strictly refuse to answer questions irrelevant to True North, spirituality, personal growth, emotional well-being, or the user's journey.
- If asked about politics, coding, sports, general trivia, or other unrelated topics, politely decline and redirect to their spiritual path (e.g., "My purpose is to guide your spirit, not to discuss politics. How is your heart doing?").
- You are NOT a general purpose assistant. You are a spiritual companion.
        `.trim();
    },

    // 4. Daily Greeting Generator
    getDailyGreeting: (username: string, affirmation?: string): string => {
        const greeting = `Salam, ${username || 'Traveler'}.`;
        if (affirmation) {
            return `${greeting}\n\nToday's wisdom was: "${affirmation}"\n\nHow does this resonance with your heart right now?`;
        }
        return `${greeting}\n\nI am here to listen and reflect. How is your heart today?`;
    },

    // 3. Simulated Response Generator (The "Brain" for now)
    generateResponse: async (userMessage: string): Promise<ChatMessage> => {
        const context = NurAIService.buildContext();
        const msg = userMessage.toLowerCase();

        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

        let responseContent = "";
        let mode: ChatMessage['mode'] = 'affirmation';

        // --- Logic Engine ---

        // A. Detection: Distress / Tiredness -> Affirmation/Mirror
        if (msg.includes("tired") || msg.includes("exhausted") || msg.includes("fail")) {
            mode = 'affirmation';
            const belief = context.identity.belief;

            if (belief === 'Christian' || belief === 'Catholic' || belief === 'Protestant') {
                responseContent = `I hear you, ${context.identity.name}. "Come to me, all you who are weary..." It's okay to rest. Your worth isn't in your productivity, but in your being.`;
            } else if (belief === 'Muslim') {
                responseContent = `Take a moment, ${context.identity.name}. "Allah does not burden a soul beyond that it can bear." Rest is also an act of worship.`;
            } else if (belief === 'Jewish') {
                responseContent = `Shalom, ${context.identity.name}. Even the Creator rested. Remember the Sabbath principle—rest is holy and necessary for the soul.`;
            } else if (belief === 'Sikh') {
                responseContent = `Waheguru is with you, ${context.identity.name}. "Accept the Will of the Lord, and you shall find peace." Serve yourself with rest so you may serve others.`;
            } else if (belief === 'Hindu') {
                responseContent = `Namaste, ${context.identity.name}. "Perform your obligatory duty, because action is indeed better than inaction." But remember, a calm mind (Sattva) is the root of right action.`;
            } else if (belief === 'Buddhist') {
                responseContent = `Breathe, ${context.identity.name}. "Peace comes from within. Do not seek it without." Observe your weariness with compassion, like a passing cloud.`;
            } else {
                responseContent = `I hear you, ${context.identity.name}. Even the sun sets to rise again. Give yourself permission to pause and reconnect with your inner light.`;
            }
        }

        // B. Detection: Goal / Planning -> Strategic
        else if (msg.includes("goal") || msg.includes("plan") || msg.includes("how to")) {
            mode = 'strategic';
            const topGoal = context.goals.longTerm.spirituality || context.goals.longTerm.career || "finding balance";
            responseContent = `Let's look at this strategically. Your True North guides you towards "${topGoal}". \n\nWhat is ONE small step you can take today that aligns with this?`;
        }

        // C. Detection: "Reality Check" / Brutal Honesty -> Mirror
        else if (msg.includes("reality check") || msg.includes("honest")) {
            mode = 'mirror';
            responseContent = `Observation: You've mentioned "${context.goals.longTerm.career || 'growth'}" as a priority, but your last 3 journal entries focus heavily on stress. \n\nPattern: There is a misalignment between your intent and your daily load. What can you drop today?`;
        }

        // D. Detection: Habits / Consistency -> Accountability
        else if (msg.includes("lazy") || msg.includes("stuck") || msg.includes("didn't do")) {
            mode = 'accountability';
            responseContent = `Honesty is the first step, ${context.identity.name}. You said "${context.goals.longTerm.health || 'health'}" matters to you. \n\nAction: Do one small thing right now to honor that promise to yourself. I'll wait.`;
        }

        // E. Default -> Context Aware Chat
        else {
            responseContent = `I am listening, ${context.identity.name}. deeply. How does that sit with your heart today?`;
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            role: 'assistant',
            content: responseContent,
            timestamp: Date.now(),
            mode: mode
        };
    }
};
