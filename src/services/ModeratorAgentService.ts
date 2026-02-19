import { SpiritualIntelligenceService } from './SpiritualIntelligenceService';

export interface ModerationResult {
    isSafe: boolean;
    flaggedCategory?: 'Sexual' | 'Fraud' | 'Trafficking' | 'Illegal' | 'Gambling' | 'Abusive' | 'Other';
    reason?: string;
    confidence: number;
}

const HARMFUL_KEYWORDS = {
    Sexual: ['porn', 'sex', 'nsfw', 'naked', 'explicit'],
    Fraud: ['scam', 'money', 'crypto', 'investment', 'guaranteed profit', 'whatsapp', 'telegram', 'send money'],
    Trafficking: ['job offer', 'passport', 'visa', 'human', 'sell', 'buy', 'girl', 'boy', 'shipping'],
    Illegal: ['drugs', 'weapons', 'hack', 'steal', 'darknet'],
    Gambling: ['bet', 'casino', 'slots', 'odds', 'wager'],
    Abusive: ['hate', 'kill', 'threat', 'stupid', 'idiot', 'harass']
};

export const ModeratorAgentService = {
    /**
     * Scans content for harmful material using a layered approach.
     * Layer 1: Fast keyword check.
     * Layer 2: Deep AI check (optional/async).
     */
    scanContent: async (content: string, deepCheck: boolean = false): Promise<ModerationResult> => {
        const lowerContent = content.toLowerCase();

        // Layer 1: Fast Keyword Match
        for (const [category, keywords] of Object.entries(HARMFUL_KEYWORDS)) {
            for (const keyword of keywords) {
                if (lowerContent.includes(keyword)) {
                    return {
                        isSafe: false,
                        flaggedCategory: category as ModerationResult['flaggedCategory'],
                        reason: `Matched sensitive keyword in category: ${category}`,
                        confidence: 0.8
                    };
                }
            }
        }

        // Layer 2: Deep AI Analysis (if requested and possible)
        if (deepCheck) {
            try {
                const systemPrompt = `You are the True North Safety Moderator. Analyze the following content for:
                1. Sexual/Explicit content
                2. Fraud/Scams/Crypto investment schemes
                3. Human trafficking indicators
                4. Illegal activities (drugs, weapons) or Gambling
                5. Abusive or hateful content
                
                Respond ONLY with a JSON object: 
                { "isSafe": boolean, "flaggedCategory": string or null, "reason": string or null, "confidence": number (0-1) }`;

                const userPrompt = `Content to analyze: "${content}"`;

                const response = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);
                const parsed = JSON.parse(response);

                return {
                    isSafe: parsed.isSafe,
                    flaggedCategory: parsed.flaggedCategory,
                    reason: parsed.reason,
                    confidence: parsed.confidence || 0.9
                };
            } catch (error) {
                console.warn('Moderator AI Analysis failed, falling back to safe status (since keyword check passed).', error);
                // If AI fails but keyword check passed, we might assume it's safe OR flag for human review (not implemented)
                return { isSafe: true, confidence: 0.5 };
            }
        }

        return { isSafe: true, confidence: 1.0 };
    }
};
