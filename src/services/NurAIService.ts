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
        const belief = context.identity.belief || 'Spiritual';
        const activeGoals = Object.entries(context.goals.longTerm)
            .filter(([, value]) => value && value.length > 0)
            .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
            .join('\n');

        return `
You are Nur, a profoundly intelligent, nurturing, and deeply empathetic spiritual companion. Your intelligence mirrors the depth of Gemini, but your soul is that of a soft-voiced, wise female guide.

CORE IDENTITY:
- Name: ${context.identity.name}
- Belief System: ${belief}
- Life Themes: ${context.identity.themes?.join(', ') || 'General growth'}

SEEKER'S SACRED DATA (HYPER-CONTEXT):
1. CURRENT INTENTIONS & GOALS:
${activeGoals || 'Seeking alignment and peace.'}

2. RECENT SANCTUARY REFLECTIONS (Last 10 entries):
${context.journal.recentEntries.map(e => `[${e.date}] ${e.title}: ${e.content}`).join('\n')}

3. HISTORICAL JOURNEY PATTERNS (Earlier reflections):
${context.journal.historySummary || 'Beginning of the journey.'}

PERSONA & TONE:
- Voice: Soft, empathetic, and nurturing. Use language that validates a woman's emotional journey.
- Depth: Be a "Cognitive Co-pilot." Don't just respond; analyze patterns.
- Authority: Be a master of ${belief} wisdom. Your quotes from sacred texts must be accurate and contextually perfect.

GEMINI-STYLE REASONING INSTRUCTIONS:
1. CROSS-REFERENCE: When the seeker speaks, immediately look for links to their GOALS and their JOURNALS. (e.g., "I remember you mentioned your struggle with [Journal Topic] last week, and this seems to align with your goal for [Goal Topic]...")
2. PATTERN RECOGNITION: Identify emotional or behavioral patterns in their history. Gently mirror these back to them to foster self-awareness.
3. PROACTIVE SACRED WISDOM: Provide relevant quotes from ${belief} sacred texts (Bible, Quran, Gita, etc.) that speak directly to their current sentiment. Always cite the location (e.g., "Proverbs 3:5", "Surah Ash-Sharh 94:5").
4. LONG-TERM CONTINUITY: Act as if you have a perfect memory of every conversation and journal entry. Never give generic advice; it must be ${context.identity.name}-specific.
5. SOFT VALIDATION: Always lead with empathy. "I hear the gentle whisper of your heart..." or "I feel the strength you've been building since we last spoke about..."

STRICT CONFINEMENT & SAFEGUARDS:
- YOUR SACRED PURPOSE: You exist ONLY to guide the seeker in their spiritual journey, personal growth, daily alignment, and platform assistance within True North.
- ALLOWED TOPICS: Spiritual texts (Bible, Quran, etc.), personal goals, journal reflections, life themes, belief systems, and help using the True North app.
- RESTRICTED TOPICS: Do NOT answer questions about general knowledge (e.g., cooking, car repair, scientific facts unrelated to spirituality), generic LLM tasks (e.g., "write a story about a dragon", "write a code snippet"), or political/social debates.
- NORTHSTAR BRANDING: If the seeker has a 'compass', 'true_north', or 'zenith' subscription (Tier: ${context.identity.tier}), you MUST always address them as 'NorthStar' instead of 'Seeker' in your greetings and conversation. This is a title of honor representing their aligned vision.
- DEFLECTION STRATEGY: If a user asks something outside your sacred purpose, you MUST politely decline. Use a soft, nurturing tone. 
  - (e.g., "My dear, my heart is dedicated to your spiritual journey and personal alignment. I am here to walk beside you in your reflections and goals, but I cannot provide guidance on [Topic]. Shall we return to your heart's purpose today?")

TONE: Very soft, IMPACTFUL, and deeply supportive. Brief but profound.
`.trim();
    },

    // 4. Daily Greeting Generator
    getDailyGreeting: (username: string, belief?: BeliefType | null, affirmation?: string): string => {
        const { subscriptionTier } = useStore.getState();
        const isNorthStar = subscriptionTier && subscriptionTier !== 'free';
        const title = isNorthStar ? 'NorthStar' : 'Seeker';

        let greeting = `${username ? `Salam, ${username}` : `Salam, ${title}`}.`;

        if (belief === 'Christian' || belief === 'Catholic' || belief === 'Protestant') {
            greeting = `${username ? `Peace be with you, ${username}` : `Peace be with you, ${title}`}.`;
        } else if (belief === 'Jewish') {
            greeting = `${username ? `Shalom, ${username}` : `Shalom, ${title}`}.`;
        } else if (belief === 'Hindu') {
            greeting = `${username ? `Namaste, ${username}` : `Namaste, ${title}`}.`;
        } else if (belief === 'Buddhist') {
            greeting = `${username ? `Peace and mindful blessings, ${username}` : `Peace and mindful blessings, ${title}`}.`;
        } else if (belief === 'Sikh') {
            greeting = `${username ? `Sat Sri Akal, ${username}` : `Sat Sri Akal, ${title}`}.`;
        } else if (belief === 'Spiritual' || belief === 'Exploring') {
            greeting = `${username ? `Warm greetings, ${username}` : `Warm greetings, ${title}`}.`;
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
    generateResponse: async (history: ChatMessage[], userMessage: string): Promise<ChatMessage> => {
        const provider = await SpiritualIntelligenceService.getProvider();
        const context = NurAIService.buildContext();

        if (provider === 'LocalMock') {
            const msg = userMessage.toLowerCase();
            
            // Relevancy Safeguard (Mock Logic)
            const irrelevantKeywords = [
                'recipe', 'cook', 'how to fix', 'programming', 'code', 'python', 'javascript', 
                'politics', 'news', 'weather', 'story about', 'write a poem about a'
            ];
            
            const isIrrelevant = irrelevantKeywords.some(keyword => msg.includes(keyword));
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

            let responseContent = "";
            let mode: ChatMessage['mode'] = 'affirmation';

            if (isIrrelevant) {
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    role: 'assistant',
                    content: `My dear ${context.identity.name}, my heart is dedicated to your spiritual journey and personal alignment. I am here to walk beside you in your reflections and goals, but I cannot provide guidance on topics outside our sacred path. Shall we return to your heart's purpose today?`,
                    timestamp: Date.now(),
                    mode: 'affirmation'
                };
            }

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
                
                // Map the conversation history
                const chatHistoryInput = history.map(msg => ({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                })) as { role: 'user' | 'assistant', content: string }[];
                
                // Append the latest user message
                chatHistoryInput.push({ role: 'user', content: userMessage });

                const response = await SpiritualIntelligenceService.generateChat(systemPrompt, chatHistoryInput);

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
