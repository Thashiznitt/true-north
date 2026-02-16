export type BeliefType = 'Christian' | 'Muslim' | 'Secular' | 'Exploring' | 'Open';

export interface GhostReflection {
    id: string;
    userName: string;
    content: string;
    time: string;
    blessings: number;
    theme?: string;
    createdAt: number;
}

export interface GhostCircle {
    id: string;
    name: string;
    belief: BeliefType;
    members: number;
    type: 'Public' | 'Private';
    city: string;
    country: string;
    description: string;
    lastActivity: string;
    reflections: GhostReflection[];
    theme: string;
}

const GHOST_USERS: Record<BeliefType, string[]> = {
    Christian: [
        'Mary W.', 'Peter J.', 'Sarah N.', 'John D.', 'Grace M.', 'Isaac K.', 'Hannah R.', 'Paul S.', 'Lydia B.', 'Mark O.',
        'Ruth A.', 'Apostle T.', 'Sister Martha', 'Brother Jude', 'Faith E.', 'Hope L.', 'Gabriel V.', 'Noel C.', 'Esther P.', 'David S.'
    ],
    Muslim: [
        'Amina Z.', 'Omar H.', 'Fatima S.', 'Yusuf A.', 'Zaynab K.', 'Idris M.', 'Mariam B.', 'Bilal R.', 'Safiya T.', 'Hassan L.',
        'Khadija F.', 'Ahmed Q.', 'Layla J.', 'Hamza N.', 'Sumaya B.', 'Rashid G.', 'Zubair K.', 'Nora Y.', 'Saeed M.', 'Aliyah W.'
    ],
    Secular: [
        'Alex R.', 'Jamie L.', 'Riley M.', 'Jordan S.', 'Casey K.', 'Taylor B.', 'Morgan P.', 'Skyler J.', 'Charlie V.', 'Quinn D.',
        'Sasha F.', 'Robin G.', 'Avery H.', 'Drew T.', 'Peyton B.', 'River O.', 'Dakota W.', 'Phoenix S.', 'Sage K.', 'Emerson J.'
    ],
    Open: [
        'Amara L.', 'David W.', 'Elena R.', 'Marcus T.', 'Sophie K.', 'Julian M.', 'Zara N.', 'Oliver P.', 'Maya J.', 'Leo S.',
        'Isabella G.', 'Noah B.', 'Chloe V.', 'Ethan X.', 'Mia Q.', 'Liam F.', 'Ava G.', 'Lucas R.', 'Sophia T.', 'Mason B.'
    ],
    Exploring: [
        'Sam T.', 'Kim L.', 'Pat M.', 'Chris D.', 'Lee S.', 'Jan K.', 'Ren B.', 'Val P.', 'Noa J.', 'Ari V.'
    ]
};

const REFLECTION_TEMPLATES: Record<BeliefType, Record<string, string[]>> = {
    Christian: {
        Strength: [
            "Today's verse about waiting on the Lord really hit home. Struggling with patience lately but feeling stronger now.",
            "Walking through a tough season at work, but finding so much peace in the promise of His strength.",
            "Just a reminder to our circle: His grace is sufficient for you today. Keep pushing.",
            "I was reminded this morning that we can do all things through Him. Don't give up on your prayer request.",
            "The battle is the Lord's. Peace to everyone here facing a giant today."
        ],
        Peace: [
            "The quiet time this morning was exactly what I needed. 'Be still and know' is my mantra for the week.",
            "Finding so much tranquility in our shared morning prayers. Thank you all for the support.",
            "In the middle of the storm, I'm choosing to lean on the Prince of Peace today.",
            "Let not your heart be troubled. Finding rest in His presence today.",
            "Grateful for the peace that surpasses understanding. It's a gift we often forget to unwrap."
        ],
        Purpose: [
            "Seeking His will for my career pivot. It's scary but I know I'm called to more.",
            "Our purpose isn't found in what we do, but in whose we are. Grounding myself in that truth today.",
            "Light your lamp and let it shine. What's one way you're serving others this week?"
        ]
    },
    Muslim: {
        Strength: [
            "SubhanAllah, the Fajr prayer today felt so grounding. Facing my meetings with new resolve.",
            "Reminding myself that Allah does not burden a soul beyond what it can bear. Stay strong, brothers and sisters.",
            "Checking in with the circle—how are you all staying consistent with your daily intentions?",
            "In every hardship there is ease. Keeping this at the center of my heart tonight.",
            "True strength is found in our vulnerability before Allah. May He grant us steadfastness."
        ],
        Wisdom: [
            "Reflecting on the wisdom of patience (Sabr) tonight. It's not just waiting, it's how we wait.",
            "Grateful for the clarity I found in today's reflection. May we all be guided to what is best.",
            "Alhamdulillah for another day to learn and grow. What's one thing you learned today?",
            "Knowledge without action is like a tree without fruit. Let's put our wisdom into practice.",
            "The heart that remembers its Creator finds wisdom in the simplest of signs."
        ],
        Peace: [
            "The tranquility of Dhikr is unmatched. A small moment of peace in a loud world.",
            "May the peace of Allah be upon this circle. Thank you for being a safe space for growth.",
            "Finding Sakinah in the middle of a chaotic week. Just breathe and trust."
        ]
    },
    Secular: {
        Purpose: [
            "Spent some time today realigning my actions with my core values. Hard work, but so rewarding.",
            "Thinking about 'Ikigai'—finding that sweet spot between what I love and what the world needs.",
            "If you're feeling lost, remember that direction is more important than speed.",
            "Living intentionally is a practice, not a destination. Grateful for this community's focus.",
            "What's one thing you're doing today that your future self will thank you for?"
        ],
        Gratitude: [
            "Today I'm grateful for the small things: a hot cup of coffee and a kind word from a stranger.",
            "Perspective shift: focusing on what I have rather than what I'm missing. Life feels lighter.",
            "Three good things today: finished a project, long walk, and this community. What's yours?",
            "Practicing radical gratitude today. Even for the challenges that are teaching me resilience.",
            "Happiness is a byproduct of being grateful. Noticing the beauty in the ordinary."
        ],
        Peace: [
            "Silence is so underrated. Just five minutes of it changed my whole morning mood.",
            "Learning to let go of things I can't control. It's a weight off my shoulders.",
            "May your day be as calm as you need it to be. Breathing through the rush."
        ]
    },
    Open: {
        Love: [
            "Sending a wave of compassion out to everyone in the circle. You are enough exactly as you are.",
            "Choosing kindness today, especially to myself. It's the foundation of everything else.",
            "Reminded today that love is an action, not just a feeling. Reach out to someone today.",
            "Heart-centered living is the path. Thank you for walking it with me.",
            "May we all find a bit more empathy for ourselves and each other today."
        ],
        Wisdom: [
            "Ancient wisdom for a modern world: the only constant is change. Breathing through it.",
            "Listening more than I talk today. It's amazing what you hear when you truly pay attention.",
            "Seeking clarity in the chaos. Sometimes the answer is just to unplug for a while.",
            "The greatest teacher is the present moment. Re-centering right now.",
            "Wisdom is knowing when to hold on and when to let go. Finding that balance."
        ],
        Strength: [
            "Persistence in the face of uncertainty. We've got this.",
            "Your journey is unique, but you don't have to walk it alone. Strength to the circle.",
            "Every setback is an opportunity for a stronger comeback. Keep going."
        ]
    },
    Exploring: {
        Wisdom: [
            "Every tradition has a piece of the puzzle. Grateful for the diversity of thought here.",
            "Seeking alignment wherever it may be found. Keep an open heart today.",
            "Truth is a journey, not a destination. Still exploring, still growing."
        ]
    }
};

const GENERIC_TEMPLATES = [
    "Thinking about our shared intentions today. I'm feeling particularly inspired by this circle.",
    "Checking in—how is everyone finding balance today?",
    "A quick reflection: what's one moment of clarity you've had in the last 24 hours?",
    "Grateful for the energy in this community. It makes a difference.",
    "Small consistent steps lead to big changes. Proud of everyone's journey here.",
    "Sharing a bit of positivity with you all. May your path be clear today.",
    "Re-reading our circle's purpose and feeling re-energized. Let's make today count.",
    "Sometimes the best reflection is just acknowledging how far we've come.",
    "Community makes the heavy times lighter. Thank you for being here.",
    "Just a reminder that you are valued and your journey matters."
];

export const LIFE_CIRCLES: GhostCircle[] = [
    // Christian Circles
    { id: 'c1', name: 'Faithful Parents', belief: 'Christian', theme: 'Strength', members: 1240, type: 'Public', city: 'Nairobi', country: 'Kenya', description: 'Grounded parenting through Christ.', lastActivity: '2m ago', reflections: [] },
    { id: 'c2', name: 'Scripture & Stillness', belief: 'Christian', theme: 'Peace', members: 850, type: 'Public', city: 'London', country: 'UK', description: 'Finding God in the quiet moments.', lastActivity: '15m ago', reflections: [] },
    { id: 'c3', name: 'Youth in Alignment', belief: 'Christian', theme: 'Purpose', members: 2100, type: 'Public', city: 'Lagos', country: 'Nigeria', description: 'Refining our path as young believers.', lastActivity: '1h ago', reflections: [] },
    // Muslim Circles
    { id: 'c4', name: 'Sabr & Strength', belief: 'Muslim', theme: 'Strength', members: 1560, type: 'Public', city: 'Dubai', country: 'UAE', description: 'Endurance and faith in daily life.', lastActivity: '30m ago', reflections: [] },
    { id: 'c5', name: 'Quiet Reflections', belief: 'Muslim', theme: 'Peace', members: 920, type: 'Public', city: 'London', country: 'UK', description: 'Modern living, Islamic peace.', lastActivity: '45m ago', reflections: [] },
    { id: 'c6', name: 'Guided Growth', belief: 'Muslim', theme: 'Wisdom', members: 3400, type: 'Public', city: 'Istanbul', country: 'Turkey', description: 'Seeking Ilm and understanding.', lastActivity: '10m ago', reflections: [] },
    // Secular Circles
    { id: 'c7', name: 'Mindful Techies', belief: 'Secular', theme: 'Peace', members: 1900, type: 'Public', city: 'San Francisco', country: 'USA', description: 'Humanity in the digital age.', lastActivity: '12m ago', reflections: [] },
    { id: 'c8', name: 'The Purpose Lab', belief: 'Secular', theme: 'Purpose', members: 2800, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Practical steps toward a meaningful life.', lastActivity: '2h ago', reflections: [] },
    { id: 'c9', name: 'Stoic Stillness', belief: 'Secular', theme: 'Peace', members: 780, type: 'Public', city: 'Austin', country: 'USA', description: 'Ancient philosophy for modern calm.', lastActivity: '5m ago', reflections: [] },
    // ... adding more to reach 30
    { id: 'c10', name: 'Sleepless Parents', belief: 'Open', theme: 'Strength', members: 1240, type: 'Public', city: 'Nairobi', country: 'Kenya', description: 'A refuge for the beautiful chaos of parenthood.', lastActivity: '2m ago', reflections: [] },
    { id: 'c11', name: 'Career Pivot Support', belief: 'Open', theme: 'Purpose', members: 850, type: 'Public', city: 'London', country: 'UK', description: 'Finding your true north in the professional world.', lastActivity: '15m ago', reflections: [] },
    { id: 'c12', name: 'Creative Slump Recovery', belief: 'Open', theme: 'Wisdom', members: 420, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Rekindling the spark when the well runs dry.', lastActivity: '1h ago', reflections: [] },
    { id: 'c13', name: 'Grief & Healing', belief: 'Open', theme: 'Peace', members: 880, type: 'Public', city: 'Toronto', country: 'Canada', description: 'Walking through the shadows into the light.', lastActivity: '1h ago', reflections: [] },
    { id: 'c14', name: 'Anxiety Management', belief: 'Open', theme: 'Peace', members: 4500, type: 'Public', city: 'Global', country: 'Online', description: 'Breathe in, find your center.', lastActivity: '3m ago', reflections: [] },
    { id: 'c15', name: 'Self-Love Sanctuary', belief: 'Open', theme: 'Love', members: 4100, type: 'Public', city: 'Los Angeles', country: 'USA', description: 'Your most important relationship.', lastActivity: '6m ago', reflections: [] },
    { id: 'c16', name: 'Morning Devoted', belief: 'Christian', theme: 'Gratitude', members: 5600, type: 'Public', city: 'Dallas', country: 'USA', description: 'Scripture and sunrise.', lastActivity: '8m ago', reflections: [] },
    { id: 'c17', name: 'Ramadan Daily Reflections', belief: 'Muslim', theme: 'Purpose', members: 12000, type: 'Public', city: 'Cairo', country: 'Egypt', description: 'Spiritual growth during the holy month.', lastActivity: '1m ago', reflections: [] },
    { id: 'c18', name: 'Minimalist Minds', belief: 'Secular', theme: 'Wisdom', members: 3100, type: 'Public', city: 'Tokyo', country: 'Japan', description: 'Less stuff, more soul.', lastActivity: '20m ago', reflections: [] },
    { id: 'c19', name: 'Solo Travelers Haven', belief: 'Open', theme: 'Wisdom', members: 940, type: 'Public', city: 'Bali', country: 'Indonesia', description: 'Connecting while wandering.', lastActivity: '4h ago', reflections: [] },
    { id: 'c20', name: 'Adulting 101', belief: 'Open', theme: 'Purpose', members: 2100, type: 'Public', city: 'New York', country: 'USA', description: 'Figuring it out together.', lastActivity: '12m ago', reflections: [] },
    { id: 'c21', name: 'Navigating Divorce', belief: 'Open', theme: 'Peace', members: 670, type: 'Public', city: 'Sydney', country: 'Australia', description: 'Grace through transition.', lastActivity: '3h ago', reflections: [] },
    { id: 'c22', name: 'Chronic Pain Circle', belief: 'Open', theme: 'Strength', members: 1100, type: 'Public', city: 'Cape Town', country: 'South Africa', description: 'Support for the physical journey.', lastActivity: '25m ago', reflections: [] },
    { id: 'c23', name: 'Empty Nesters', belief: 'Open', theme: 'Purpose', members: 540, type: 'Public', city: 'Phoenix', country: 'USA', description: 'The next chapter starts now.', lastActivity: '2h ago', reflections: [] },
    { id: 'c24', name: 'Grad School Grinds', belief: 'Open', theme: 'Wisdom', members: 920, type: 'Public', city: 'Boston', country: 'USA', description: 'Sanity for scholars.', lastActivity: '45m ago', reflections: [] },
    { id: 'c25', name: 'The Art of Ordinary Joy', belief: 'Secular', theme: 'Gratitude', members: 5200, type: 'Public', city: 'Paris', country: 'France', description: 'Finding truth in the mundane.', lastActivity: '4m ago', reflections: [] },
    { id: 'c26', name: 'Mercy & Love', belief: 'Christian', theme: 'Love', members: 3800, type: 'Public', city: 'Manila', country: 'Philippines', description: 'Extending grace to all.', lastActivity: '14m ago', reflections: [] },
    { id: 'c27', name: 'Sisters in Faith', belief: 'Muslim', theme: 'Love', members: 4500, type: 'Public', city: 'London', country: 'UK', description: 'A sacred space for Muslim women.', lastActivity: '22m ago', reflections: [] },
    { id: 'c28', name: 'Business Ethics Lab', belief: 'Secular', theme: 'Wisdom', members: 1400, type: 'Public', city: 'Dublin', country: 'Ireland', description: 'Integrity in the marketplace.', lastActivity: '55m ago', reflections: [] },
    { id: 'c29', name: 'Grief Recovery (Biblical)', belief: 'Christian', theme: 'Peace', members: 930, type: 'Public', city: 'Chicago', country: 'USA', description: 'Comfort from the word.', lastActivity: '1h ago', reflections: [] },
    { id: 'c30', name: 'New Muslim Support', belief: 'Muslim', theme: 'Wisdom', members: 1700, type: 'Public', city: 'Online', country: 'Global', description: 'Welcome to the Ummah.', lastActivity: '18m ago', reflections: [] },
];

import { AIService } from './AIService';

// ... (existing helper functions and constants)

export const contentAgentService = {
    generateReflection: async (circleId: string, customBelief?: BeliefType, customTheme?: string): Promise<GhostReflection> => {
        const circle = LIFE_CIRCLES.find(c => c.id === circleId);
        const belief = customBelief || (circle?.belief as BeliefType) || 'Open';
        const theme = customTheme || circle?.theme || 'Wisdom';
        const names = GHOST_USERS[belief as BeliefType] || GHOST_USERS.Open;
        const user = names[Math.floor(Math.random() * names.length)];

        const provider = await AIService.getProvider();

        let content = '';

        if (provider === 'LocalMock') {
            const templates = (REFLECTION_TEMPLATES[belief as BeliefType] && REFLECTION_TEMPLATES[belief as BeliefType][theme])
                ? REFLECTION_TEMPLATES[belief as BeliefType][theme]
                : GENERIC_TEMPLATES;
            content = templates[Math.floor(Math.random() * templates.length)];
        } else {
            try {
                const systemPrompt = `You are a member of a ${belief} spiritual circle focused on ${theme}. Write a short, personal reflection (max 2 sentences) to share with the group. Be authentic, vulnerable, and supportive. Do not use hashtags or emojis.`;
                const userPrompt = `Write a reflection about ${theme}.`;
                content = await AIService.generateText(systemPrompt, userPrompt);
            } catch (error) {
                console.warn('AI Generation failed, falling back to templates', error);
                const templates = GENERIC_TEMPLATES;
                content = templates[Math.floor(Math.random() * templates.length)];
            }
        }

        return {
            id: Math.random().toString(36).substr(2, 9),
            userName: user,
            content: content,
            time: 'Just now',
            blessings: Math.floor(Math.random() * 50) + 5,
            theme: theme,
            createdAt: Date.now()
        };
    },

    cleanupOldReflections: (reflections: GhostReflection[]): GhostReflection[] => {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return reflections.filter(r => (now - r.createdAt) < SEVEN_DAYS_MS);
    },

    initializeCircles: async () => {
        // Keep initialization local/fast for now, or parallelize
        // For performance, we might want to stick to templates for bulk/init
        return LIFE_CIRCLES.map(circle => ({
            ...circle,
            reflections: [] // Start empty or use a separate "fill" function later to avoid massive AI calls on startup
        }));
    },

    getDailyAdvice: async (username: string, belief: BeliefType, themes: string[], journalInput?: string): Promise<string> => {
        const theme = themes[0] || 'Wisdom';
        const provider = await AIService.getProvider();

        if (provider === 'LocalMock') {
            const adviceTemplates: Record<BeliefType, string[]> = {
                Christian: [
                    "Dear {{name}}, based on your focus on {{theme}}, remember that your path is prepared. Lean into the stillness today.",
                    "{{name}}, I see you've been reflecting on {{theme}}. The word reminds us that grace is a marathon, not a sprint. Take a breath.",
                    "Your journey in {{theme}} is being noted, {{name}}. Take five minutes for prayerful silence this afternoon; the clarity you seek is already within you."
                ],
                Muslim: [
                    "{{name}}, reflecting on {{theme}}, remember that Sabr (patience) is your greatest ally today. Stay grounded in your intentions.",
                    "For your path in {{theme}}, {{name}}, consider how your small actions today echo your larger faith. Every step towards goodness is counted.",
                    "In the pursuit of {{theme}}, {{name}}, find tranquility in the remembrance of Allah. Your heart is being guided."
                ],
                Secular: [
                    "{{name}}, focusing on {{theme}} today? Remember that consistency is better than intensity. What's one tiny step you can take right now?",
                    "Your path in {{theme}} is becoming clearer, {{name}}. Trust the process and honor your boundaries today.",
                    "{{name}}, science and stillness both agree: your growth in {{theme}} requires rest. Don't forget to unplug tonight."
                ],
                Open: [
                    "{{name}}, the universe is reflecting your focus on {{theme}}. Stay open to the small signs appearing in your day.",
                    "Your journey toward {{theme}} is unique, {{name}}. Comparison is the thief of joy; stay centered in your own light.",
                    "In the flow of {{theme}}, {{name}}, remember that you are exactly where you need to be. Breathe through the transition."
                ],
                Exploring: [
                    "{{name}}, as you explore {{theme}}, keep your heart open to the wisdom found in unexpected places today.",
                    "Truth reveals itself in the quiet, {{name}}. Your pursuit of {{theme}} is a beautiful endeavor.",
                    "Keep seeking {{theme}}, {{name}}. The questions are more important than the answers right now."
                ]
            };

            const templates = adviceTemplates[belief] || adviceTemplates.Open;
            const template = templates[Math.floor(Math.random() * templates.length)];

            let advice = template.replace('{{theme}}', theme.toLowerCase()).replace('{{name}}', username || 'friend');

            if (journalInput && journalInput.length > 20) {
                advice += "\n\nI also noticed your recent journal entries touched on something deeper. Trust that those feelings are pointing you toward your True North.";
            }
            return advice;
        } else {
            try {
                const systemPrompt = `You are a wise spiritual guide. The user is ${belief}. Their current focus is ${theme}. Provide personalized, compassionate advice (max 3 sentences).`;
                let userPrompt = `User Name: ${username || 'Friend'}. Focus: ${theme}.`;
                if (journalInput) {
                    userPrompt += ` Recent thoughts: "${journalInput}".`;
                }
                return await AIService.generateText(systemPrompt, userPrompt);
            } catch {
                console.warn('AI daily advice failed');
                return "Take a moment to breathe. Your answers are within.";
            }
        }
    },

    getDailyPrayerOrQuote: async (username: string, belief: BeliefType): Promise<{ content: string, title: string, buttonLabel: string }> => {
        const isReligious = belief === 'Christian' || belief === 'Muslim';
        const provider = await AIService.getProvider();

        if (provider === 'LocalMock') {
            const name = username || 'friend';
            const prayers: Record<'Christian' | 'Muslim', string[]> = {
                Christian: [
                    "Heavenly Father, we lift up {{name}} today. Grant them the strength to walk in Your light and the wisdom to see Your path. May Your peace, which surpasses all understanding, guard their heart and mind. Amen.",
                    "Lord, thank You for {{name}}. Bless their journey this day. Fill them with Your Spirit and guide their every step. May they be a beacon of Your love to everyone they meet. Amen."
                ],
                Muslim: [
                    "O Allah, we ask You to bless {{name}} with guidance, piety, and contentment. Grant them success in this life and the hereafter, and protect them from all harm. Ameen.",
                    "Allahumma, guide {{name}} to the straight path. Fill their day with barakah and grant them the patience and wisdom to navigate their challenges with faith. Ameen."
                ]
            };

            const quotes: string[] = [
                "{{name}}, remember that your potential is limitless. Today is a clean slate to build the life you envision. Stay focused, stay kind, and trust your inner strength.",
                "The journey of a thousand miles begins with a single step, {{name}}. Honor your progress today, no matter how small it may seem. You are growing in ways you cannot yet see.",
                "{{name}}, find stillness in the chaos. Your clarity comes from within. Trust yourself to handle whatever today brings with grace and resilience."
            ];

            if (isReligious && belief in prayers) {
                const templates = prayers[belief as keyof typeof prayers];
                const content = templates[Math.floor(Math.random() * templates.length)].replace('{{name}}', name);
                return {
                    title: belief === 'Christian' ? "Daily Prayer" : "Daily Du'a",
                    content,
                    buttonLabel: belief === 'Christian' ? "Amen" : "Ameen"
                };
            } else {
                const content = quotes[Math.floor(Math.random() * quotes.length)].replace('{{name}}', name);
                return {
                    title: "Daily Wisdom",
                    content,
                    buttonLabel: "Reflect"
                };
            }
        } else {
            try {
                const type = isReligious ? (belief === 'Christian' ? 'Prayer' : 'Dua') : 'Quote/Wisdom';
                const systemPrompt = `You are a spiritual companion. Write a short ${type} for the user.`;
                const userPrompt = `User: ${username}. Belief: ${belief}.`;
                const content = await AIService.generateText(systemPrompt, userPrompt);

                return {
                    title: isReligious ? (belief === 'Christian' ? "Daily Prayer" : "Daily Du'a") : "Daily Wisdom",
                    content,
                    buttonLabel: isReligious ? (belief === 'Christian' ? "Amen" : "Ameen") : "Reflect"
                };
            } catch {
                return { title: "Daily Wisdom", content: "Peace be with you today.", buttonLabel: "Reflect" };
            }
        }
    },

    getSpiritualAnalysis: async (content: string, belief: BeliefType): Promise<{ title: string, message: string, action: string }> => {
        const provider = await AIService.getProvider();

        if (provider === 'LocalMock') {
            const text = content.toLowerCase();

            // Keyword matching
            const isAnxious = text.includes('anxi') || text.includes('worry') || text.includes('stress') || text.includes('fear') || text.includes('nervous');
            const isSad = text.includes('sad') || text.includes('grief') || text.includes('lost') || text.includes('pain') || text.includes('hurt');
            const isHappy = text.includes('happy') || text.includes('joy') || text.includes('great') || text.includes('excited') || text.includes('blessed');
            const isWork = text.includes('work') || text.includes('job') || text.includes('career') || text.includes('boss') || text.includes('interview');

            const title = "Spiritual Insight";
            let message = "";
            let action = "Reflect on this";

            if (belief === 'Christian') {
                if (isAnxious) {
                    if (isWork) {
                        message = "I sense some anxiety about your work. Remember Colossians 3:23: 'Whatever you do, work at it with all your heart, as working for the Lord.' Your value is not in the outcome, but in your faithfulness. Trust Him with the results.";
                    } else {
                        message = "In moments of anxiety, recall Philippians 4:6-7. 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' Breathe in His peace right now.";
                    }
                    action = "Pray for Peace";
                } else if (isSad) {
                    message = "The Lord is close to the brokenhearted (Psalm 34:18). It's okay to not be okay. Bring your authentic sorrow to Him; He is big enough to hold it.";
                    action = "Receive Comfort";
                } else if (isHappy) {
                    message = "This joy is a gift! 'Every good and perfect gift is from above' (James 1:17). Take a moment to simply say 'Thank You' for this season of blessing.";
                    action = "Offer Praise";
                } else {
                    message = "As you reflect today, ask yourself: Where did I see God's hand moving in the small details? He is present in the stillness.";
                    action = "Seek Him";
                }
            }
            else if (belief === 'Muslim') {
                if (isAnxious) {
                    if (isWork) {
                        message = "Work is a form of worship (Ibadah), but results are from Allah. 'Tie your camel and trust in Allah.' Do your best, and leave the outcome to Al-Wakil (The Trustee).";
                    } else {
                        message = "When worry takes over, remember: 'Verily, in the remembrance of Allah do hearts find rest' (Quran 13:28). Recite 'HasbunAllahu wa ni'mal wakil' (Allah is sufficient for us).";
                    }
                    action = "Make Dua";
                } else if (isSad) {
                    message = "Allah does not burden a soul beyond that it can bear. Your pain is seen by Him. Turned to Him in simple, honest dua. He is Al-Sami (The All-Hearing).";
                    action = "Seek Patience";
                } else if (isHappy) {
                    message = "Alhamdulillah for this happiness. 'If you are grateful, I will surely increase you' (Quran 14:7). Let your joy turn into gratitude and charity (Sadaqah).";
                    action = "Say Alhamdulillah";
                } else {
                    message = "Reflect on your intention (Niyyah) today. Simply purifying your intention turns ordinary actions into rewards. What is your heart's direction?";
                    action = "Renew Intention";
                }
            }
            else { // Secular / Open / Exploring
                if (isAnxious) {
                    if (isWork) {
                        message = "Work anxiety often comes from attaching our worth to our output. Remember: You are not your job. Your value is intrinsic. Focus on what is within your control, and release the rest.";
                    } else {
                        message = "Anxiety is often excitement without the breath. Take three deep, slow breaths. Ground yourself in this present moment. You have handled everything up to this point, and you can handle this too.";
                    }
                    action = "Breathe Deeply";
                } else if (isSad) {
                    message = "Honor this feeling. Sadness is often love with nowhere to go, or a sign that something mattered. Don't rush to 'fix' it. Just witness it with compassion.";
                    action = "Be Kind to Self";
                } else if (isHappy) {
                    message = "Savor this feeling. Our brains are wired to overlook the good. Take 10 seconds to really feel this joy in your body. This stores it as resilience for later.";
                    action = "Savor the Moment";
                } else {
                    message = "As you write, try to connect with your 'Why'. What values are guiding your actions today? Clarity often comes when we pause to listen to our own inner wisdom.";
                    action = "Find Clarity";
                }
            }

            return { title, message, action };
        } else {
            try {
                const systemPrompt = `You are a spiritual counselor. Analyze the user's journal entry. Provide a compassionate insight, a quote/scripture based on their belief (${belief}), and a simple action step. Output JSON with keys: title, message, action.`;
                const userPrompt = `Journal: "${content}"`;
                const jsonStr = await AIService.generateText(systemPrompt, userPrompt);

                // Try to parse JSON, if fails, fallback
                try {
                    const parsed = JSON.parse(jsonStr);
                    return {
                        title: parsed.title || "Spiritual Insight",
                        message: parsed.message || "Keep reflecting.",
                        action: parsed.action || "Reflect"
                    };
                } catch {
                    return { title: "Insight", message: jsonStr, action: "Reflect" };
                }

            } catch {
                return { title: "Insight", message: "Your thoughts are heard.", action: "Breathe" };
            }
        }
    }
};
