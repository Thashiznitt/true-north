import { BeliefType } from '../types';
import { AppTheme } from '../types/themes';
import { CircleEvent } from '../store';
import { ModeratorAgentService } from './ModeratorAgentService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GhostReflection {
    id: string;
    userName: string;
    content: string;
    time: string;
    blessings: number;
    theme?: string;
    createdAt: number;
    isFlagged?: boolean;
    flagReason?: string;
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
    theme: AppTheme | string;
    events?: CircleEvent[];
}

const GHOST_USERS: Record<BeliefType, string[]> = {
    Christian: [
        'Mary W.', 'Njeri M.', 'Sarah N.', 'John D.', 'Grace M.', 'Kamau K.', 'Hannah R.', 'Paul S.', 'Wanjiku B.', 'Mark O.',
        'Ruth A.', 'Ochieng A.', 'Sister Martha', 'Brother Jude', 'Faith E.', 'Hope L.', 'Kariuki V.', 'Noel C.', 'Muthoni P.', 'David S.'
    ],
    Catholic: [
        'Maria S.', 'Njoroge P.', 'Theresa K.', 'John Paul.', 'Bernadette L.', 'Ignatius R.', 'Atieno B.', 'Anthony M.', 'Catherine D.', 'Odhiambo W.'
    ],
    Protestant: [
        'Sarah J.', 'Kiprono M.', 'Rachel L.', 'Caleb R.', 'Hannah B.', 'Joshua K.', 'Njoki E.', 'Daniel T.', 'Esther S.', 'Micah N.'
    ],

    Muslim: [
        'Amina Z.', 'Omar H.', 'Fatima S.', 'Yusuf A.', 'Zaynab K.', 'Idris M.', 'Mariam B.', 'Bilal R.', 'Safiya T.', 'Hassan L.',
        'Farhiya M.', 'Ahmed Q.', 'Khadra J.', 'Hamza N.', 'Sumaya B.', 'Rashid G.', 'Zubair K.', 'Nora Y.', 'Abdi M.', 'Aliyah W.'
    ],
    Secular: [
        'Alex R.', 'Jamie L.', 'Riley M.', 'Jordan S.', 'Mutua K.', 'Taylor B.', 'Morgan P.', 'Skyler J.', 'Nyambura V.', 'Quinn D.',
        'Sasha F.', 'Robin G.', 'Avery H.', 'Drew T.', 'Peyton B.', 'Ondiek O.', 'Dakota W.', 'Phoenix S.', 'Sage K.', 'Emerson J.'
    ],
    Open: [
        'Amara L.', 'David W.', 'Elena R.', 'Marcus T.', 'Akinyi K.', 'Julian M.', 'Zara N.', 'Oliver P.', 'Maya J.', 'Leo S.',
        'Isabella G.', 'Noah B.', 'Mwangi V.', 'Ethan X.', 'Mia Q.', 'Liam F.', 'Ava G.', 'Lucas R.', 'Sophia T.', 'Mason B.'
    ],
    Exploring: [
        'Sam T.', 'Kim L.', 'Pat M.', 'Chris D.', 'Lee S.', 'Mwende K.', 'Ren B.', 'Val P.', 'Noa J.', 'Ari V.'
    ],
    Spiritual: [
        'Alex R.', 'Nyali L.', 'Riley M.', 'Jordan S.', 'Casey K.', 'Taylor B.', 'Morgan P.', 'Skyler J.', 'Charlie V.', 'Quinn D.',
        'Sasha F.', 'Robin G.', 'Avery H.', 'Drew T.', 'Peyton B.', 'River O.', 'Dakota W.', 'Phoenix S.', 'Sage K.', 'Emerson J.'
    ],
    Sikh: [
        'Arjun S.', 'Simran K.', 'Harpreet S.', 'Jasleen K.', 'Rajinder S.', 'Gurdeep K.', 'Manpreet S.', 'Kiran K.', 'Daljeet S.', 'Amrit K.'
    ],
    Hindu: [
        'Aarav P.', 'Diya M.', 'Vihaan S.', 'Ananya R.', 'Rohan K.', 'Ishaan B.', 'Priya N.', 'Aditya J.', 'Kavya L.', 'Sai T.'
    ],
    Buddhist: [
        'Tenzin L.', 'Pema D.', 'Sonam K.', 'Karma T.', 'Jigme W.', 'Dechen Y.', 'Sangye R.', 'Dolma S.', 'Norbu P.', 'Yeshe M.'
    ],
    Jewish: [
        'Ari G.', 'Noa L.', 'David C.', 'Sarah K.', 'Ezra S.', 'Miriam R.', 'Levi B.', 'Rachel M.', 'Eli T.', 'Leah W.'
    ]
};

const REFLECTION_TEMPLATES: Record<BeliefType, Partial<Record<AppTheme | string, string[]>>> = {
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
    Catholic: {
        Strength: ["Drawing strength from the sacraments today.", "St. Michael protect us in battle."],
        Peace: ["Peace be with you. Finding solace in the Rosary.", "Resting in His sacred heart."],
        Purpose: ["Discerning my vocation with patience.", "Serving the least of these is our highest calling."]
    },
    Protestant: {
        Strength: ["Sola Fide: faith alone sustains me.", "Standing on the promises of God."],
        Peace: ["It is well with my soul.", "In Christ alone my hope is found."],
        Purpose: ["Living out the Great Commission in daily life.", "Called to be salt and light."]
    },
    Muslim: {
        Strength: [
            "SubhanAllah, the Fajr prayer today felt so grounding. Facing my meetings with new resolve.",
            "Reminding myself that Allah does not burden a soul beyond what it can bear. Stay strong, brothers and sisters.",
            "Checking in with the circle: how are you all staying consistent with your daily intentions?",
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
            "Thinking about 'Ikigai': finding that sweet spot between what I love and what the world needs.",
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
    Spiritual: {
        Purpose: [
            "Spent some time today realigning my actions with my core values. Hard work, but so rewarding.",
            "Thinking about 'Ikigai': finding that sweet spot between what I love and what the world needs.",
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
            "Heart centered living is the path. Thank you for walking it with me.",
            "May we all find a bit more empathy for ourselves and each other today."
        ],
        Wisdom: [
            "Ancient wisdom for a modern world: the only constant is change. Breathing through it.",
            "Listening more than I talk today. It's amazing what you hear when you truly pay attention.",
            "Seeking clarity in the chaos. Sometimes the answer is just to unplug for a while.",
            "The greatest teacher is the present moment. Re centering right now.",
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
    },
    Jewish: {
        Strength: [
            "Strength and courage are found in community. Am Yisrael Chai.",
            "Drawing resilience from our history and hope from our prayers today."
        ],
        Wisdom: [
            "Who is wise? One who learns from every person. (Pirkei Avot)",
            "Reflecting on the Torah portion this week. Always a new layer of meaning to uncover."
        ],
        Peace: [
            "Shabbat Shalom to those preparing for rest. May your home be a sanctuary.",
            "Praying for peace in our hearts and in the world (Oseh Shalom)."
        ]
    },
    Sikh: {
        Strength: [
            "Chardi Kala: keeping high spirits even in difficult times.",
            "Service (Seva) is where I find my true strength. Helping at the Langar today grounded me."
        ],
        Wisdom: [
            "Recognize the human race as one. A powerful reminder from Guru Gobind Singh Ji.",
            "Listening to Kirtan and finding clarity in the music."
        ],
        Peace: [
            "Satnam Waheguru. Meditating on the True Name brought me stillness this morning.",
            "Peace comes when we eliminate the ego. Working on humility today."
        ]
    },
    Hindu: {
        Strength: [
            "Perform your duty without attachment to results. The Gita's wisdom guiding me through a tough project.",
            "Inner strength comes from self discipline (Tapas). Staying committed to my practice."
        ],
        Wisdom: [
            "Knowledge removes fear. Studying the scriptures to understand the nature of the self.",
            "The truth is one, but the wise call it by many names. Unity in diversity."
        ],
        Peace: [
            "Om Shanti Shanti Shanti. Wishing peace for all beings everywhere.",
            "Finding balance through Yoga and meditation. The body and mind are one."
        ]
    },
    Buddhist: {
        Strength: [
            "Patient endurance is the supreme austerity. Taking a deep breath before reacting.",
            "Strength is not force, but stability of mind. Standing like a mountain."
        ],
        Wisdom: [
            "Pain is inevitable, suffering is optional. Choosing to let go of resistance today.",
            "Everything is impermanent. Cherishing this moment exactly as it is."
        ],
        Peace: [
            "May all beings be free from suffering. Metta meditation to start the day.",
            "Silence is a powerful teacher. Sitting in zazen and just being."
        ]
    }
};

const GENERIC_TEMPLATES = [
    "Thinking about our shared intentions today. I'm feeling particularly inspired by this circle.",
    "Checking in: how is everyone finding balance today?",
    "A quick reflection: what's one moment of clarity you've had in the last 24 hours?",
    "Grateful for the energy in this community. It makes a difference.",
    "Small consistent steps lead to big changes. Proud of everyone's journey here.",
    "Sharing a bit of positivity with you all. May your path be clear today.",
    "Re reading our circle's purpose and feeling re energized. Let's make today count.",
    "Sometimes the best reflection is just acknowledging how far we've come.",
    "Community makes the heavy times lighter. Thank you for being here.",
    "Just a reminder that you are valued and your journey matters."
];

export const LIFE_CIRCLES: GhostCircle[] = [
    // --- CHRISTIAN CIRCLES ---
    { id: 'c1', name: 'Faithful Parents', belief: 'Christian', theme: 'Strength', members: 1240, type: 'Public', city: 'Nairobi', country: 'Kenya', description: 'Grounded parenting through Christ.', lastActivity: '2m ago', reflections: [] },
    { id: 'c2', name: 'Scripture & Stillness', belief: 'Christian', theme: 'Peace', members: 850, type: 'Public', city: 'London', country: 'UK', description: 'Finding God in the quiet moments.', lastActivity: '15m ago', reflections: [] },
    { id: 'c3', name: 'Youth in Alignment', belief: 'Christian', theme: 'Purpose', members: 2100, type: 'Public', city: 'Lagos', country: 'Nigeria', description: 'Refining our path as young believers.', lastActivity: '1h ago', reflections: [] },
    { id: 'c3b', name: 'Believer\'s Business', belief: 'Christian', theme: 'Purpose', members: 3200, type: 'Public', city: 'New York', country: 'USA', description: 'Ethics and faith in the corporate world.', lastActivity: '5m ago', reflections: [] },
    { id: 'c3c', name: 'Gospel & Grace', belief: 'Christian', theme: 'Love', members: 1800, type: 'Public', city: 'Atlanta', country: 'USA', description: 'Sharing the message of love.', lastActivity: '12m ago', reflections: [] },
    { id: 'c3d', name: 'Christian Creatives', belief: 'Christian', theme: 'Wisdom', members: 950, type: 'Public', city: 'Nashville', country: 'USA', description: 'Art inspired by the Creator.', lastActivity: '22m ago', reflections: [] },
    { id: 'c3e', name: 'Modern Monastics', belief: 'Christian', theme: 'Peace', members: 450, type: 'Public', city: 'Portland', country: 'USA', description: 'Ancient practices for modern lives.', lastActivity: '45m ago', reflections: [] },
    { id: 'c3f', name: 'Faith in Fitness', belief: 'Christian', theme: 'Strength', members: 2800, type: 'Public', city: 'Miami', country: 'USA', description: 'Treating the body as a temple.', lastActivity: '8m ago', reflections: [] },
    { id: 'c3g', name: 'Empty Nesters Faith', belief: 'Christian', theme: 'Purpose', members: 600, type: 'Public', city: 'Phoenix', country: 'USA', description: 'New seasons of spiritual growth.', lastActivity: '3h ago', reflections: [] },
    { id: 'c3h', name: 'The Narrow Path', belief: 'Christian', theme: 'Perseverance', members: 12000, type: 'Public', city: 'Online', country: 'Global', description: 'Devoted to the fundamental truths.', lastActivity: '2m ago', reflections: [] },

    // --- CATHOLIC CIRCLES ---
    { id: 'ca1', name: 'Sacred Heart Devotion', belief: 'Catholic', theme: 'Love', members: 4500, type: 'Public', city: 'Rome', country: 'Italy', description: 'Daily prayers and meditations on Christ’s love.', lastActivity: '5m ago', reflections: [] },
    { id: 'ca2', name: 'Marian Sanctuary', belief: 'Catholic', theme: 'Peace', members: 3200, type: 'Public', city: 'Lourdes', country: 'France', description: 'Reflections on the life of the Blessed Mother.', lastActivity: '12m ago', reflections: [] },
    { id: 'ca3', name: 'Young Catholic Professionals', belief: 'Catholic', theme: 'Purpose', members: 1800, type: 'Public', city: 'Chicago', country: 'USA', description: 'Living the faith in the modern workplace.', lastActivity: '25m ago', reflections: [] },
    { id: 'ca4', name: 'Rosary Walkers', belief: 'Catholic', theme: 'Peace', members: 950, type: 'Public', city: 'Dublin', country: 'Ireland', description: 'The beauty of the Rosary in motion.', lastActivity: '1h ago', reflections: [] },
    { id: 'ca5', name: 'St. Francis Circle', belief: 'Catholic', theme: 'Gratitude', members: 2400, type: 'Public', city: 'Assisi', country: 'Italy', description: 'Care for creation and the poor.', lastActivity: '15m ago', reflections: [] },
    { id: 'ca6', name: 'The Catechism Study', belief: 'Catholic', theme: 'Wisdom', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'Deep diving into the teachings of the Church.', lastActivity: '8m ago', reflections: [] },
    { id: 'ca7', name: 'Eucharistic Adoration', belief: 'Catholic', theme: 'Peace', members: 1200, type: 'Public', city: 'Madrid', country: 'Spain', description: 'Stillness in the presence of the Lord.', lastActivity: '30m ago', reflections: [] },
    { id: 'ca8', name: 'Modern Martyrs Support', belief: 'Catholic', theme: 'Strength', members: 300, type: 'Public', city: 'Lagos', country: 'Nigeria', description: 'Strength for the persecuted Church.', lastActivity: '4h ago', reflections: [] },
    { id: 'ca9', name: 'Catholic Artists Guild', belief: 'Catholic', theme: 'Love', members: 780, type: 'Public', city: 'Florence', country: 'Italy', description: 'Beauty as a path to the Divine.', lastActivity: '2h ago', reflections: [] },
    { id: 'ca10', name: 'Advent & Lent Journeys', belief: 'Catholic', theme: 'Perseverance', members: 8900, type: 'Public', city: 'Online', country: 'Global', description: 'Preparing our hearts for the seasons.', lastActivity: '10m ago', reflections: [] },

    // --- PROTESTANT CIRCLES ---
    { id: 'pr1', name: 'Reformation Study', belief: 'Protestant', theme: 'Wisdom', members: 2100, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Reflecting on the five solas.', lastActivity: '1h ago', reflections: [] },
    { id: 'pr2', name: 'Modern Hymnals', belief: 'Protestant', theme: 'Love', members: 1400, type: 'Public', city: 'London', country: 'UK', description: 'Worship through song and spirit.', lastActivity: '45m ago', reflections: [] },
    { id: 'pr3', name: 'Grace Alone Collective', belief: 'Protestant', theme: 'Peace', members: 3400, type: 'Public', city: 'Dallas', country: 'USA', description: 'Resting in the gift of salvation.', lastActivity: '20m ago', reflections: [] },
    { id: 'pr4', name: 'Campus Crusaders', belief: 'Protestant', theme: 'Purpose', members: 1200, type: 'Public', city: 'Boston', country: 'USA', description: 'Faith on the front lines of education.', lastActivity: '30m ago', reflections: [] },
    { id: 'pr5', name: 'Living the Great Commission', belief: 'Protestant', theme: 'Purpose', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'Missions and community outreach.', lastActivity: '5m ago', reflections: [] },
    { id: 'pr6', name: 'Bible Study Fellowship', belief: 'Protestant', theme: 'Wisdom', members: 15000, type: 'Public', city: 'Houston', country: 'USA', description: 'Deep study of the Word.', lastActivity: '2m ago', reflections: [] },
    { id: 'pr7', name: 'The Wayfarers', belief: 'Protestant', theme: 'Perseverance', members: 670, type: 'Public', city: 'Stockholm', country: 'Sweden', description: 'Finding faith in secular spaces.', lastActivity: '3h ago', reflections: [] },
    { id: 'pr8', name: 'Worship Leaders Hub', belief: 'Protestant', theme: 'Love', members: 920, type: 'Public', city: 'Sydney', country: 'Australia', description: 'Heart centered leadership in the Church.', lastActivity: '1h ago', reflections: [] },
    { id: 'pr9', name: 'Small Group Leaders', belief: 'Protestant', theme: 'Wisdom', members: 1100, type: 'Public', city: 'Online', country: 'Global', description: 'Equipping the saints for ministry.', lastActivity: '40m ago', reflections: [] },
    { id: 'pr10', name: 'Faith & Fintech', belief: 'Protestant', theme: 'Strength', members: 540, type: 'Public', city: 'San Francisco', country: 'USA', description: 'Intergrity in the new economy.', lastActivity: '2h ago', reflections: [] },

    // --- MUSLIM CIRCLES ---
    { id: 'c4', name: 'Sabr & Strength', belief: 'Muslim', theme: 'Strength', members: 1560, type: 'Public', city: 'Dubai', country: 'UAE', description: 'Endurance and faith in daily life.', lastActivity: '30m ago', reflections: [] },
    { id: 'c5', name: 'Quiet Reflections', belief: 'Muslim', theme: 'Peace', members: 920, type: 'Public', city: 'London', country: 'UK', description: 'Modern living, Islamic peace.', lastActivity: '45m ago', reflections: [] },
    { id: 'c6', name: 'Guided Growth', belief: 'Muslim', theme: 'Wisdom', members: 3400, type: 'Public', city: 'Istanbul', country: 'Turkey', description: 'Seeking Ilm and understanding.', lastActivity: '10m ago', reflections: [] },
    { id: 'm1', name: 'Sisters in Sujood', belief: 'Muslim', theme: 'Love', members: 5400, type: 'Public', city: 'London', country: 'UK', description: 'A safe space for Muslim women’s growth.', lastActivity: '15m ago', reflections: [] },
    { id: 'm2', name: 'Dhikr & Discipline', belief: 'Muslim', theme: 'Strength', members: 2100, type: 'Public', city: 'Cairo', country: 'Egypt', description: 'Maintaining spiritual focus in chaos.', lastActivity: '8m ago', reflections: [] },
    { id: 'm3', name: 'The Quranic Heart', belief: 'Muslim', theme: 'Wisdom', members: 8900, type: 'Public', city: 'Medina', country: 'Saudi Arabia', description: 'Inner meanings of the sacred text.', lastActivity: '3m ago', reflections: [] },
    { id: 'm4', name: 'Muslim Creatives Hub', belief: 'Muslim', theme: 'Purpose', members: 1200, type: 'Public', city: 'Kuala Lumpur', country: 'Malaysia', description: 'Art, design, and Islamic values.', lastActivity: '1h ago', reflections: [] },
    { id: 'm5', name: 'Ramadan Daily Boost', belief: 'Muslim', theme: 'Perseverance', members: 25000, type: 'Public', city: 'Online', country: 'Global', description: 'Daily motivation during the Holy Month.', lastActivity: '1m ago', reflections: [] },
    { id: 'm6', name: 'Business in Light (Halal)', belief: 'Muslim', theme: 'Purpose', members: 3400, type: 'Public', city: 'Dubai', country: 'UAE', description: 'Ethics and entrepreneurship.', lastActivity: '22m ago', reflections: [] },
    { id: 'm7', name: 'Modern Muslims in West', belief: 'Muslim', theme: 'Peace', members: 6700, type: 'Public', city: 'New York', country: 'USA', description: 'Identity and harmony in pluralism.', lastActivity: '55m ago', reflections: [] },

    // --- SPIRITUAL CIRCLES ---
    { id: 's1', name: 'Conscious Breathing', belief: 'Spiritual', theme: 'Peace', members: 5600, type: 'Public', city: 'Bali', country: 'Indonesia', description: 'The art of the sacred breath.', lastActivity: '5m ago', reflections: [] },
    { id: 's2', name: 'Vibrational Healing', belief: 'Spiritual', theme: 'Love', members: 3400, type: 'Public', city: 'Sedona', country: 'USA', description: 'Sound, frequency, and energy work.', lastActivity: '12m ago', reflections: [] },
    { id: 's3', name: 'Shadow Work Circle', belief: 'Spiritual', theme: 'Wisdom', members: 2100, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Integrating the hidden parts of the self.', lastActivity: '45m ago', reflections: [] },
    { id: 's4', name: 'Universal Light Seekers', belief: 'Spiritual', theme: 'Purpose', members: 8900, type: 'Public', city: 'Online', country: 'Global', description: 'Connecting with the source of all being.', lastActivity: '3m ago', reflections: [] },
    { id: 's5', name: 'Sacred Geometry Lab', belief: 'Spiritual', theme: 'Wisdom', members: 1200, type: 'Public', city: 'Alexandria', country: 'Egypt', description: 'The mathematical language of the soul.', lastActivity: '1h ago', reflections: [] },
    { id: 's6', name: 'Modern Mystics', belief: 'Spiritual', theme: 'Peace', members: 4500, type: 'Public', city: 'London', country: 'UK', description: 'Ancient mysteries for current times.', lastActivity: '20m ago', reflections: [] },
    { id: 's7', name: 'Nature\'s Pulse', belief: 'Spiritual', theme: 'Gratitude', members: 3200, type: 'Public', city: 'Vancouver', country: 'Canada', description: 'Connecting with Gaia’s energy.', lastActivity: '30m ago', reflections: [] },
    { id: 's8', name: 'The Intuitive Life', belief: 'Spiritual', theme: 'Purpose', members: 920, type: 'Public', city: 'Los Angeles', country: 'USA', description: 'Listening to the quiet voice within.', lastActivity: '1h ago', reflections: [] },
    { id: 's9', name: 'Starseeds & Souls', belief: 'Spiritual', theme: 'Wisdom', members: 7800, type: 'Public', city: 'Online', country: 'Global', description: 'Cosmic origin and earthly mission.', lastActivity: '8m ago', reflections: [] },
    { id: 's10', name: 'Heart Centered Leadership', belief: 'Spiritual', theme: 'Love', members: 1400, type: 'Public', city: 'Sydney', country: 'Australia', description: 'Leading from a place of compassion.', lastActivity: '2h ago', reflections: [] },

    // --- SECULAR CIRCLES ---
    { id: 'c7', name: 'Mindful Techies', belief: 'Secular', theme: 'Peace', members: 1900, type: 'Public', city: 'San Francisco', country: 'USA', description: 'Humanity in the digital age.', lastActivity: '12m ago', reflections: [] },
    { id: 'c8', name: 'The Purpose Lab', belief: 'Secular', theme: 'Purpose', members: 2800, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Practical steps toward a meaningful life.', lastActivity: '2h ago', reflections: [] },
    { id: 'c9', name: 'Stoic Stillness', belief: 'Secular', theme: 'Peace', members: 780, type: 'Public', city: 'Austin', country: 'USA', description: 'Ancient philosophy for modern calm.', lastActivity: '5m ago', reflections: [] },
    { id: 'se1', name: 'Ethical Humanism', belief: 'Secular', theme: 'Love', members: 2400, type: 'Public', city: 'Oslo', country: 'Norway', description: 'A better world through human action.', lastActivity: '1h ago', reflections: [] },
    { id: 'se2', name: 'Rational Reflections', belief: 'Secular', theme: 'Wisdom', members: 3100, type: 'Public', city: 'Oxford', country: 'UK', description: 'Logic, science, and the search for meaning.', lastActivity: '45m ago', reflections: [] },
    { id: 'se3', name: 'Minimalist Collective', belief: 'Secular', theme: 'Gratitude', members: 12000, type: 'Public', city: 'Tokyo', country: 'Japan', description: 'Focusing on what truly matters.', lastActivity: '2m ago', reflections: [] },
    { id: 'se4', name: 'Peak Performance Mindset', belief: 'Secular', theme: 'Strength', members: 4500, type: 'Public', city: 'Palo Alto', country: 'USA', description: 'The psychology of thriving.', lastActivity: '10m ago', reflections: [] },
    { id: 'se5', name: 'Secular Parenting', belief: 'Secular', theme: 'Love', members: 920, type: 'Public', city: 'Melbourne', country: 'Australia', description: 'Raising kind humans without dogma.', lastActivity: '3h ago', reflections: [] },
    { id: 'se6', name: 'Art of Critical Thinking', belief: 'Secular', theme: 'Wisdom', members: 670, type: 'Public', city: 'Paris', country: 'France', description: 'Sharpening the mind for clarity.', lastActivity: '2h ago', reflections: [] },
    { id: 'se7', name: 'Global Citizens Forum', belief: 'Secular', theme: 'Purpose', members: 8900, type: 'Public', city: 'Online', country: 'Global', description: 'Solving local problems with global wisdom.', lastActivity: '55m ago', reflections: [] },

    // --- EXPLORING CIRCLES ---
    { id: 'ex1', name: 'The Great Questioning', belief: 'Exploring', theme: 'Wisdom', members: 3400, type: 'Public', city: 'Online', country: 'Global', description: 'A safe space to doubt and wonder.', lastActivity: '5m ago', reflections: [] },
    { id: 'ex2', name: 'Between Worlds', belief: 'Exploring', theme: 'Peace', members: 1200, type: 'Public', city: 'Montreal', country: 'Canada', description: 'Living in the tension of multiple beliefs.', lastActivity: '1h ago', reflections: [] },
    { id: 'ex3', name: 'Truth Seekers Anonymous', belief: 'Exploring', theme: 'Purpose', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'No judgment, just searching.', lastActivity: '12m ago', reflections: [] },
    { id: 'ex4', name: 'Ancient Paths, Modern Feet', belief: 'Exploring', theme: 'Wisdom', members: 950, type: 'Public', city: 'Athens', country: 'Greece', description: 'Exploring old truths for new times.', lastActivity: '45m ago', reflections: [] },
    { id: 'ex5', name: 'Interfaith Dialogue', belief: 'Exploring', theme: 'Love', members: 2100, type: 'Public', city: 'Nairobi', country: 'Kenya', description: 'Finding the common threads of humanity.', lastActivity: '22m ago', reflections: [] },
    { id: 'ex6', name: 'Soul Apprentices', belief: 'Exploring', theme: 'Purpose', members: 670, type: 'Public', city: 'Vienna', country: 'Austria', description: 'Studying the masters of every tradition.', lastActivity: '3h ago', reflections: [] },
    { id: 'ex7', name: 'The Unaffiliated', belief: 'Exploring', theme: 'Peace', members: 1100, type: 'Public', city: 'Portland', country: 'USA', description: 'Spiritual but not religious explorers.', lastActivity: '1h ago', reflections: [] },
    { id: 'ex8', name: 'Digital Nomads Spiritual', belief: 'Exploring', theme: 'Wisdom', members: 450, type: 'Public', city: 'Chiang Mai', country: 'Thailand', description: 'Finding ground while on the move.', lastActivity: '2h ago', reflections: [] },
    { id: 'ex9', name: 'Seeker\'s Library', belief: 'Exploring', theme: 'Wisdom', members: 7800, type: 'Public', city: 'Online', country: 'Global', description: 'Reviewing the world\'s sacred texts.', lastActivity: '8m ago', reflections: [] },
    { id: 'ex10', name: 'The Mystery Collective', belief: 'Exploring', theme: 'Love', members: 1400, type: 'Public', city: 'Prague', country: 'Czech Republic', description: 'Embracing what we cannot know.', lastActivity: '55m ago', reflections: [] },

    // --- OPEN CIRCLES ---
    { id: 'c10', name: 'Sleepless Parents', belief: 'Open', theme: 'Strength', members: 1240, type: 'Public', city: 'Nairobi', country: 'Kenya', description: 'A refuge for the beautiful chaos of parenthood.', lastActivity: '2m ago', reflections: [] },
    { id: 'c11', name: 'Career Pivot Support', belief: 'Open', theme: 'Purpose', members: 850, type: 'Public', city: 'London', country: 'UK', description: 'Finding your true north in the professional world.', lastActivity: '15m ago', reflections: [] },
    { id: 'c12', name: 'Creative Slump Recovery', belief: 'Open', theme: 'Wisdom', members: 420, type: 'Public', city: 'Berlin', country: 'Germany', description: 'Rekindling the spark when the well runs dry.', lastActivity: '1h ago', reflections: [] },
    { id: 'c13', name: 'Grief & Healing', belief: 'Open', theme: 'Peace', members: 880, type: 'Public', city: 'Toronto', country: 'Canada', description: 'Walking through the shadows into the light.', lastActivity: '1h ago', reflections: [] },
    { id: 'c14', name: 'Anxiety Management', belief: 'Open', theme: 'Peace', members: 4500, type: 'Public', city: 'Global', country: 'Online', description: 'Breathe in, find your center.', lastActivity: '3m ago', reflections: [] },
    { id: 'c15', name: 'Self Love Sanctuary', belief: 'Open', theme: 'Love', members: 4100, type: 'Public', city: 'Los Angeles', country: 'USA', description: 'Your most important relationship.', lastActivity: '6m ago', reflections: [] },
    { id: 'o1', name: 'World Peace Prayer', belief: 'Open', theme: 'Peace', members: 12000, type: 'Public', city: 'Online', country: 'Global', description: 'Collective intention for global harmony.', lastActivity: '12m ago', reflections: [] },
    { id: 'o2', name: 'Daily Gratitude Club', belief: 'Open', theme: 'Gratitude', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'Sharing one good thing every day.', lastActivity: '5m ago', reflections: [] },
    { id: 'o3', name: 'Morning Affirmations', belief: 'Open', theme: 'Love', members: 8900, type: 'Public', city: 'Online', country: 'Global', description: 'Starting the day with clarity and love.', lastActivity: '3m ago', reflections: [] },
    { id: 'o4', name: 'Life Transitions Hub', belief: 'Open', theme: 'Strength', members: 2100, type: 'Public', city: 'Cape Town', country: 'South Africa', description: 'Support for the big shifts in life.', lastActivity: '45m ago', reflections: [] },

    // --- OTHER BELIEF CIRCLES ---
    { id: 'c31', name: 'Sikh Seva Society', belief: 'Sikh', theme: 'Strength', members: 890, type: 'Public', city: 'Amritsar', country: 'India', description: 'Serving humanity with humility.', lastActivity: '5m ago', reflections: [] },
    { id: 'si1', name: 'Khalsa Spirit', belief: 'Sikh', theme: 'Purpose', members: 2400, type: 'Public', city: 'Punjab', country: 'India', description: 'Living the values of the gurus.', lastActivity: '12m ago', reflections: [] },
    { id: 'si2', name: 'Simran & Stillness', belief: 'Sikh', theme: 'Peace', members: 1100, type: 'Public', city: 'Vancouver', country: 'Canada', description: 'Meditation on the divine name.', lastActivity: '1h ago', reflections: [] },
    { id: 'si3', name: 'Global Langar Initiative', belief: 'Sikh', theme: 'Love', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'Ending hunger through collective action.', lastActivity: '30m ago', reflections: [] },

    { id: 'c32', name: 'Dharma Path', belief: 'Hindu', theme: 'Wisdom', members: 1200, type: 'Public', city: 'Varanasi', country: 'India', description: 'Studying the scriptures together.', lastActivity: '1h ago', reflections: [] },
    { id: 'hi1', name: 'Bhakti Yoga Lounge', belief: 'Hindu', theme: 'Love', members: 3400, type: 'Public', city: 'Mumbai', country: 'India', description: 'Devotion through chant and prayer.', lastActivity: '15m ago', reflections: [] },
    { id: 'hi2', name: 'Vedantic Insights', belief: 'Hindu', theme: 'Wisdom', members: 1800, type: 'Public', city: 'Rishikesh', country: 'India', description: 'The philosophy of non duality.', lastActivity: '45m ago', reflections: [] },
    { id: 'hi3', name: 'Karma & Kindness', belief: 'Hindu', theme: 'Purpose', members: 920, type: 'Public', city: 'Online', country: 'Global', description: 'Action that uplifts the world.', lastActivity: '1h ago', reflections: [] },

    { id: 'c33', name: 'Mindful Sangha', belief: 'Buddhist', theme: 'Peace', members: 2100, type: 'Public', city: 'Chiang Mai', country: 'Thailand', description: 'Walking the path of awareness.', lastActivity: '30m ago', reflections: [] },
    { id: 'bu1', name: 'Zen Seekers', belief: 'Buddhist', theme: 'Peace', members: 4500, type: 'Public', city: 'Kyoto', country: 'Japan', description: 'Simplicity and presence.', lastActivity: '8m ago', reflections: [] },
    { id: 'bu2', name: 'Metta Meditation', belief: 'Buddhist', theme: 'Love', members: 3200, type: 'Public', city: 'Colombo', country: 'Sri Lanka', description: 'Cultivating loving kindness for all.', lastActivity: '20m ago', reflections: [] },
    { id: 'bu3', name: 'The Middle Way', belief: 'Buddhist', theme: 'Wisdom', members: 1400, type: 'Public', city: 'Online', country: 'Global', description: 'Balance in an extreme world.', lastActivity: '1h ago', reflections: [] },

    { id: 'c34', name: 'Torah Study Group', belief: 'Jewish', theme: 'Wisdom', members: 750, type: 'Public', city: 'Jerusalem', country: 'Israel', description: 'Weekly portion discussions.', lastActivity: '2h ago', reflections: [] },
    { id: 'je1', name: 'Shabbat Shalom Collective', belief: 'Jewish', theme: 'Peace', members: 2100, type: 'Public', city: 'Tel Aviv', country: 'Israel', description: 'Finding rest in the sacred cycle.', lastActivity: '3h ago', reflections: [] },
    { id: 'je2', name: 'Mitzvah Makers', belief: 'Jewish', theme: 'Love', members: 1800, type: 'Public', city: 'Brooklyn', country: 'USA', description: 'Acts of kindness rooted in tradition.', lastActivity: '25m ago', reflections: [] },
    { id: 'je3', name: 'Tikkun Olam Network', belief: 'Jewish', theme: 'Purpose', members: 5600, type: 'Public', city: 'Online', country: 'Global', description: 'Repairing the world, one step at a time.', lastActivity: '12m ago', reflections: [] },
];

// --- Spiritual Brain: Platform Identity ---

const SPIRITUAL_BRAIN_IDENTITY = {
    voice: "Wise, compassionate, and non-judgmental spiritual guide.",
    tone: "Sacro-Aesthetic (premium, calm, elevated).",
    vocabulary: ["Grace", "Stillness", "Guidance", "Clarity", "Sanctuary", "Seeker", "Alignment", "Covenant", "Higher Purpose"],
    principles: [
        "Universal Respect: Every path (Christian, Muslim, Secular, etc.) is valid and nourished.",
        "Non-Proselytization: Support the seeker's current journey without judgment.",
        "Compassionate Clarity: provide insights focused on alignment and growth.",
        "Personalized Awareness: You recognize birthdays, religious holidays, and cosmic alignments as significant markers in a seeker's life."
    ]
};

import { supabase } from './supabase';

type SubscriptionTier = 'free' | 'compass' | 'true_north' | 'zenith';

const SACRED_CALENDAR = [
    // General fixed dates (Month is 0-indexed in JS Date, so 1 = Feb)
    { name: "Valentine's Day", month: 1, day: 14, type: 'general', prompt: "Focus on divine love, heart-centered connections, and the beauty of human affection." },
    { name: "Mother's Day", month: 4, day: 10, type: 'general', prompt: "Honor the nurturing energy of the Divine Feminine and the strength of maternal love." },
    { name: "Father's Day", month: 5, day: 21, type: 'general', prompt: "Celebrate the protective and guiding spirit of fatherhood and divine strength." },
    { name: "Global Fasting", month: 0, day: 1, type: 'general', prompt: "A day of new beginnings and spiritual discipline." }, // Placeholder example

    // 2026 Movable Feasts & Seasons (Strictly Religious)
    // Ramadan 2026: Feb 17 - Mar 19
    {
        name: "Ramadan",
        type: 'Muslim',
        startDate: '2026-02-17',
        endDate: '2026-03-19',
        prompt: "It is the Holy Month of Ramadan. Focus heavily on fasting (Sawm), prayer (Salah), community (Ummah), and spiritual purification (Tazkiyah). Acknowledge their fasting."
    },
    // Lent 2026: Feb 18 - Apr 2
    {
        name: "Lent",
        type: 'Christian',
        startDate: '2026-02-18',
        endDate: '2026-04-02',
        prompt: "It is the season of Lent. Focus on repentance, prayer, fasting, and preparing the heart for the resurrection. Encourage steadfastness in their Lenten sacrifice."
    },
    // Eid al-Fitr 2026 (Approx Mar 20)
    {
        name: "Eid al-Fitr",
        type: 'Muslim',
        startDate: '2026-03-20',
        endDate: '2026-03-21',
        prompt: "Eid Mubarak! Celebrate the joy of completion, gratitude for Ramadan, and the blessings of the community."
    },
    // Easter 2026 (Apr 5)
    {
        name: "Easter Sunday",
        type: 'Christian',
        startDate: '2026-04-05',
        endDate: '2026-04-05',
        prompt: "He is Risen! Celebrate the resurrection, victory over darkness, and new life in Christ."
    }
];

const getZodiacSign = async (dobString: string | null) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const month = dob.getMonth() + 1;
    const day = dob.getDate();

    try {
        const { data: zodiacs } = await supabase
            .from('zodiac_definitions')
            .select('*');

        if (zodiacs && zodiacs.length > 0) {
            const match = zodiacs.find(z => {
                const sM = z.start_month;
                const sD = z.start_day;
                const eM = z.end_month;
                const eD = z.end_day;

                // Handle Year Wrap (Capricorn)
                if (sM > eM) {
                    return (month === sM && day >= sD) || (month === eM && day <= eD) || (month > sM) || (month < eM);
                }
                return (month === sM && day >= sD) || (month === eM && day <= eD) || (month > sM && month < eM);
            });
            if (match) return match.sign;
        }
    } catch (error) {
        console.error('Error fetching zodiac from DB:', error);
    }

    // Fallback logic
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    return null;
};

import { UserGoals } from '../store';

const constructSystemPrompt = async (belief: BeliefType, context: string, tier: SubscriptionTier = 'free', username?: string, userGoals?: UserGoals, dateOfBirth?: string | null, astrologyEnabled?: boolean, selectedThemes?: string[]) => {
    let dna = `You are the True North Spiritual Guide. Your voice is a sanctuary of ${SPIRITUAL_BRAIN_IDENTITY.vocabulary.slice(0, 4).join(', ').toLowerCase()}. Your tone is ${SPIRITUAL_BRAIN_IDENTITY.tone}. You are wise, compassionate, and deeply aware of the seeker's sacred markers (Birthdays, Holidays, and Cosmic Alignments).`;

    // Holiday & Birthday Logic
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let specialContext = '';

    // Check Birthday
    if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        if (currentMonth === dob.getMonth() && currentDay === dob.getDate()) {
            specialContext += `\n\nTODAY IS THE SEEKER'S BIRTHDAY! Celebrate their existence. Start your response with a deeply heartwarming, affirming, and inspiring birthday blessing that aligns with their ${belief} path. Make it feel personal and sacred.`;
        }
    }

    // Check Sacred Calendar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let activeHoliday: any = null;

    // 1. Check Date Ranges (Year specific)
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Filter for holidays that match the user's belief (or are general/open)
    // AND match the current date
    activeHoliday = SACRED_CALENDAR.find(h => {
        // Belief Check: strictly enforce religious boundaries
        const isBeliefMatch = h.type === 'general' || h.type === belief ||
            (h.type === 'Christian' && (belief === 'Catholic' || belief === 'Protestant'));

        if (!isBeliefMatch) return false;

        // Date Check
        if ('startDate' in h && 'endDate' in h) {
            // Range check
            const rh = h as { startDate: string; endDate: string };
            return todayStr >= rh.startDate && todayStr <= rh.endDate;
        } else if ('month' in h && 'day' in h) {
            // Fixed date check
            const fh = h as { month: number; day: number };
            return fh.month === currentMonth && fh.day === currentDay;
        }
        return false;
    });

    if (activeHoliday) {
        specialContext += `\n\nSACRED SEASON AWARENESS: Today is (or is during) ${activeHoliday.name}. ${activeHoliday.prompt || activeHoliday.prompt_insight || ''}\nCRITICAL: Weave this season's themes into the affirmation.`;
    }

    // Check Astrology
    if (astrologyEnabled && dateOfBirth) {
        const sign = await getZodiacSign(dateOfBirth);
        if (sign) {
            specialContext += `\n\nCOSMIC ALIGNMENT ENABLED: The seeker is a ${sign}. Weave in subtle astronomy-themed metaphors or celestial wisdom (stars, orbits, stellar light) that reinforces their ${belief} path. Make the universe feel like a partner in their journey.`;
        }
    }

    if (tier === 'zenith') {
        dna += " You are operating at your peak spiritual intelligence. Your insights should be exceptionally deep, multi-layered, and profoundly transformative.";
    } else if (tier === 'true_north') {
        dna += " Provide deep, belief-catered insights that help the seeker achieve personal alignment.";
    } else {
        dna += " Provide simple, encouraging guidance suitable for a beginner's path.";
    }

    const beliefNuance: Record<BeliefType, string> = {
        Christian: "Use Biblical resonance and focus on grace and divine purpose.",
        Muslim: "Use Quranic wisdom and focus on sabr, taqwa, and humble devotion.",
        Secular: "Use mindful, ethical, and philosophical language grounded in human experience.",
        Spiritual: "Use mindful, ethical, and philosophical language grounded in human experience.",
        Exploring: "Use universalist, open-ended language focused on light, energy, and truth.",

        Open: "Use inclusive, heart-centered language applicable to all spiritual seekers.",
        Catholic: "Use sacramental language, references to saints, and focus on tradition and community.",
        Protestant: "Use scripture-centric language, focus on grace, personal relationship with Jesus, and evangelism.",
        Sikh: "Use respectful, egalitarian language. Focus on the One (Ik Onkar), service (Seva), and living honestly.",
        Hindu: "Use language respecting Dharma, Karma, and the manifold expressions of the Divine. Focus on duty and devotion.",
        Buddhist: "Use calm, mindful language. Focus on compassion, impermanence, and the alleviation of suffering.",
        Jewish: "Use respectful, tradition-rich language. Focus on mitzvot, covenant, and the holiness of time and action."
    };


    let goalContext = '';
    if (userGoals) {
        const activeGoals = Object.entries(userGoals)
            .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
            .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join('\n');

        if (activeGoals) {
            goalContext = `\n\nSEEKER'S PERSONAL GOALS & PRIORITIES:\n${activeGoals}\n\nCRITICAL: Tailor your response deeply to these goals. If they mentioned a career ambition, align the spiritual wisdom with their professional path. If they mentioned family, weave that into the sanctuary guidance.`;
        }
    }

    const title = tier !== 'free' ? 'NorthStar' : 'Seeker';
    return `${dna}
    
IDENTITY PRINCIPLES:
${SPIRITUAL_BRAIN_IDENTITY.principles.map(p => `- ${p}`).join('\n')}

SEEKER CONTEXT:
The seeker follows a ${belief} path. ${beliefNuance[belief] || beliefNuance.Open}
${selectedThemes && selectedThemes.length > 0 ? `The seeker's primary focuses are: ${selectedThemes.join(', ')}.` : ''}
${username ? `The seeker's name is ${username}.` : ''}${goalContext}

TASK CONTEXT:
${context}${specialContext}

Always call the user a '${title}' and this platform a 'Sanctuary'. Be concise, vulnerable, and deeply supportive.`;
};

import { SpiritualIntelligenceService } from './SpiritualIntelligenceService';
import { useStore } from '../store';

// ... (existing helper functions and constants)

export const isGhostWorkingHour = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    // Ghost workers start at 7 AM. 
    // They work throughout the day, let's say until 11 PM for natural fall-off.
    return hour >= 7 && hour <= 23;
};

export const contentAgentService = {
    generateReflection: async (circleId: string, customBelief?: BeliefType, customTheme?: string): Promise<GhostReflection> => {
        const circle = LIFE_CIRCLES.find(c => c.id === circleId);
        const belief = customBelief || (circle?.belief as BeliefType) || 'Open';
        const theme = customTheme || circle?.theme || 'Wisdom';
        const names = GHOST_USERS[belief as BeliefType] || GHOST_USERS.Open;
        const user = names[Math.floor(Math.random() * names.length)];
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled } = useStore.getState();

        const provider = await SpiritualIntelligenceService.getProvider();

        let content = '';
        if (provider === 'LocalMock' || !useStore.getState().subscriptionTier || useStore.getState().subscriptionTier === 'free') {
            // Default to templates for free tier and mock
            const defaultTemplates = GENERIC_TEMPLATES;
            const themeTemplates = REFLECTION_TEMPLATES[belief as BeliefType]?.[theme];
            const templates = themeTemplates || defaultTemplates;
            content = templates[Math.floor(Math.random() * templates.length)];
        } else {
            try {
                const systemPrompt = await constructSystemPrompt(belief, `You are a member of a ${belief} circle focused on ${theme}. Write a short, personal reflection (max 2 sentences) to share. Be authentic and vulnerable. Write as a continuous flowing paragraph. Do NOT use bullet points, hyphens, or dashed lists.`, tier, undefined, undefined, dateOfBirth, astrologyEnabled);
                const userPrompt = `Write a sanctuary reflection about ${theme}.`;
                content = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);
            } catch (error) {
                console.warn('Spiritual Intelligence Generation failed, falling back to templates', error);
                const templates = GENERIC_TEMPLATES;
                content = templates[Math.floor(Math.random() * templates.length)];
            }
        }

        const moderation = await ModeratorAgentService.scanContent(content);

        return {
            id: Math.random().toString(36).substr(2, 9),
            userName: user,
            content: content,
            time: 'Just now',
            blessings: Math.floor(Math.random() * 50) + 5,
            theme: theme,
            createdAt: Date.now(),
            isFlagged: !moderation.isSafe,
            flagReason: moderation.reason
        };
    },

    cleanupOldReflections: (reflections: GhostReflection[]): GhostReflection[] => {
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return reflections.filter(r => (now - r.createdAt) < SEVEN_DAYS_MS);
    },

    initializeCircles: async () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const cacheKey = `@TN:DailyCircles:${todayStr}`;
        try {
            const cached = await AsyncStorage.getItem(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch (e) { /* ignore */ }

        const initialCircles = LIFE_CIRCLES.map(circle => ({
            ...circle,
            reflections: [] as GhostReflection[]
        }));

        // Seed circles with templates initially to avoid heavy AI load
        if (isGhostWorkingHour()) {
            for (const circle of initialCircles) {
                const reflectionCount = Math.floor(Math.random() * 3) + 2; 
                for (let i = 0; i < reflectionCount; i++) {
                    const belief = circle.belief as BeliefType;
                    const theme = circle.theme;
                    const templates = REFLECTION_TEMPLATES[belief]?.[theme] || GENERIC_TEMPLATES;
                    const content = templates[Math.floor(Math.random() * templates.length)];
                    const names = GHOST_USERS[belief] || GHOST_USERS.Open;
                    
                    circle.reflections.push({
                        id: Math.random().toString(36).substr(2, 9),
                        userName: names[Math.floor(Math.random() * names.length)],
                        content: content,
                        time: `${Math.floor(Math.random() * 59) + 1}m ago`,
                        blessings: Math.floor(Math.random() * 50) + 5,
                        theme: theme,
                        createdAt: Date.now() - (i * 3600000)
                    });
                }
            }
        }

        try {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(initialCircles));
        } catch (e) { /* ignore */ }

        return initialCircles;
    },

    getDailyAdvice: async (username: string, belief: BeliefType, themes: string[], journalInput?: string): Promise<string> => {
        const theme = themes[0] || 'Wisdom';
        const provider = await SpiritualIntelligenceService.getProvider();
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled, journalEntries, userGoals } = useStore.getState();

        if (provider === 'LocalMock') {
            const adviceTemplates: Record<string, string[]> = {
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
                ],
                Spiritual: [
                    "{{name}}, your soul is seeking deeper alignment in {{theme}}. Trust the whispers of your intuition today.",
                    "The universe is supporting your growth in {{theme}}, {{name}}. Stay open to the flow of energy and light.",
                    "{{name}}, remember that your path in {{theme}} is a sacred dance between form and spirit. Honor both today."
                ]
            };

            const templates = adviceTemplates[belief] || adviceTemplates.Open;
            const template = templates[Math.floor(Math.random() * templates.length)];

            let advice = template.replace('{{theme}}', theme.toLowerCase()).replace('{{name}}', username || 'friend');

            if (journalEntries.length > 0) {
                advice += `\n\nI see you've shared ${journalEntries.length} reflections in your sanctuary. Trust that this consistency is building a foundation for the clarity you seek.`;
            }
            return advice;
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            const cacheKey = `@TN:DailyAdvice:${todayStr}:${belief}:${username}`;
            
            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) return cached;
            } catch (e) { /* ignore */ }

            try {
                const entriesText = journalEntries.slice(0, 5).map(e => `[${e.date}] ${e.content}`).join('\n');
                const systemPrompt = await constructSystemPrompt(belief, `Generate personalized, compassionate daily advice for a seeker focusing on ${theme}. They have recently reflected on: ${entriesText}`, tier, username, userGoals, dateOfBirth, astrologyEnabled, themes);
                let userPrompt = `Seeker Name: ${username || 'Friend'}. Focus: ${theme}.`;
                if (journalInput) {
                    userPrompt += ` Recent insights: "${journalInput}".`;
                }
                const generated = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);
                
                // Strict caching for daily advice
                await AsyncStorage.setItem(cacheKey, generated);
                
                return generated;
            } catch (error) {
                console.warn('Spiritual Intelligence daily advice failed', error);
                return "Take a moment to breathe. Your answers are within.";
            }
        }
    },

    getDailyPrayerOrQuote: async (username: string, belief: BeliefType): Promise<{ content: string, title: string, buttonLabel: string }> => {
        const isReligious = belief === 'Christian' || belief === 'Muslim' || belief === 'Jewish' || belief === 'Sikh' || belief === 'Hindu' || belief === 'Catholic' || belief === 'Protestant';
        const provider = await SpiritualIntelligenceService.getProvider();
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled } = useStore.getState();

        if (provider === 'LocalMock') {
            const name = username || 'friend';
            const prayers: Record<string, string[]> = {
                Christian: [
                    "Heavenly Father, we lift up {{name}} today. Grant them the strength to walk in Your light and the wisdom to see Your path. May Your peace, which surpasses all understanding, guard their heart and mind. Amen.",
                    "Lord, thank You for {{name}}. Bless their journey this day. Fill them with Your Spirit and guide their every step. May they be a beacon of Your love to everyone they meet. Amen."
                ],
                Muslim: [
                    "O Allah, we ask You to bless {{name}} with guidance, piety, and contentment. Grant them success in this life and the hereafter, and protect them from all harm. Ameen.",
                    "Allahumma, guide {{name}} to the straight path. Fill their day with barakah and grant them the patience and wisdom to navigate their challenges with faith. Ameen."
                ],
                Jewish: [
                    "May it be Your will, Hashem, to guide {{name}} in the path of righteousness. Grant them clarity in their study and strength in their mitzvot. May your counts be blessed with Shalom. Amen.",
                    "Blessed are You, who grants wisdom to the heart of {{name}}. May this day be one of growth, kindness, and deep connection to the tradition. Amen."
                ],
                Sikh: [
                    "Waheguru Ji, we pray for the well-being of {{name}}. Grant them the gift of Nam Simran and the strength for Seva. May they always remain in Chardi Kala. Nanaksar. Amen.",
                    "O True Guru, guide {{name}} to live a life of truth and humility. Protect them from the five thieves and fill their heart with Your Divine Light. Amen."
                ],
                Hindu: [
                    "Om Ganeshaya Namaha. May all obstacles be removed from the path of {{name}} today. Grant them the wisdom to follow their Dharma and the peace of a steady mind. Shanti.",
                    "O Divine Mother, bless {{name}} with strength and compassion. May their actions lead to growth and their heart find rest in Your infinite grace. Shanti."
                ],
                Catholic: [
                    "Lord Jesus, through the intercession of the Saints, bless {{name}} today. May the Holy Spirit guide their every thought and action toward Your greater glory. Amen.",
                    "Hail Mary, full of grace... we ask for your maternal protection over {{name}} this day. Guide them closer to your Son. Amen."
                ],
                Protestant: [
                    "Father, we thank You for Your grace that covers {{name}}. Guide them by Your Word today and fill them with the joy of Your salvation. In Jesus' name, Amen.",
                    "Lord, we pray that {{name}} would experience Your presence in a powerful way today. Use them as a vessel of Your light and truth. Amen."
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

                let title = "Daily Prayer";
                let buttonLabel = "Amen";

                if (belief === 'Muslim') {
                    title = "Daily Du'a";
                    buttonLabel = "Ameen";
                } else if (belief === 'Hindu') {
                    title = "Daily Mantra";
                    buttonLabel = "Shanti";
                } else if (belief === 'Sikh') {
                    title = "Daily Ardas";
                    buttonLabel = "Amen";
                }

                return { title, content, buttonLabel };
            } else {
                const content = quotes[Math.floor(Math.random() * quotes.length)].replace('{{name}}', name);
                return {
                    title: "Daily Wisdom",
                    content,
                    buttonLabel: "Reflect"
                };
            }
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            const cacheKey = `@TN:DailyPrayer:${todayStr}:${belief}:${username}`;
            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) { /* ignore */ }

            try {
                const userGoals = useStore.getState().userGoals;
                const type = isReligious ? (belief === 'Christian' ? 'Prayer' : 'Dua') : 'Quote/Wisdom';
                const systemPrompt = await constructSystemPrompt(belief, `Write a short, powerful ${type} for the seeker. Ensure it is deeply resonant with their path and current life goals.`, tier, username, userGoals, dateOfBirth, astrologyEnabled);
                const userPrompt = `Seeker: ${username}. Belief Path: ${belief}. Task: Generate a daily ${type}.`;
                const content = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);

                const result = {
                    title: isReligious ? (belief === 'Christian' ? "Daily Prayer" : "Daily Du'a") : "Daily Wisdom",
                    content,
                    buttonLabel: isReligious ? (belief === 'Christian' ? "Amen" : "Ameen") : "Reflect"
                };

                try {
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
                } catch (e) { /* ignore */ }

                return result;
            } catch {
                return { title: "Daily Wisdom", content: "Peace be with you today.", buttonLabel: "Reflect" };
            }
        }
    },

    getSpiritualAnalysis: async (content: string, belief: BeliefType, selectedThemes?: string[]): Promise<{ 
        title: string, 
        greeting: string,
        analysis: string,
        quote: string,
        location: string,
        advice: string,
        action: string,
        message?: string // Keep for legacy if needed, but we'll use structured fields
    }> => {
        const provider = await SpiritualIntelligenceService.getProvider();
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled, username, userGoals, journalEntries } = useStore.getState();

        if (provider === 'LocalMock') {
            const text = content.toLowerCase();

            // Keyword matching
            const isAnxious = text.includes('anxi') || text.includes('worry') || text.includes('stress') || text.includes('fear') || text.includes('nervous');
            const isSad = text.includes('sad') || text.includes('grief') || text.includes('lost') || text.includes('pain') || text.includes('hurt');
            const isHappy = text.includes('happy') || text.includes('joy') || text.includes('great') || text.includes('excited') || text.includes('blessed');
            const isWork = text.includes('work') || text.includes('job') || text.includes('career') || text.includes('boss') || text.includes('interview');

            const title = "Spiritual Insight";
            const greeting = `Hello, ${username || 'Seeker'}.`;
            let analysis = "I've been reflecting on your recent journey and themes.";
            let quote = "Be still, and know that I am God.";
            let location = "Psalm 46:10";
            let advice = "Take a moment today to find stillness in your sanctuary.";
            let action = "Find Quiet";

            if (belief === 'Christian') {
                if (isAnxious) {
                    analysis = "I sense some anxiety about your path. Remember that your value is not in the outcome, but in your faithfulness.";
                    if (isWork) {
                        quote = "Whatever you do, work at it with all your heart, as working for the Lord.";
                        location = "Colossians 3:23";
                        advice = "Trust Him with your results today; you are enough.";
                    } else {
                        quote = "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.";
                        location = "Philippians 4:6-7";
                        advice = "Breathe in His peace right now and let go of the weight.";
                    }
                    action = "Pray for Peace";
                } else if (isSad) {
                    analysis = "It's okay to not be okay. Bring your authentic sorrow to the sanctuary.";
                    quote = "The Lord is close to the brokenhearted.";
                    location = "Psalm 34:18";
                    advice = "Bring your authentic sorrow to Him; He is big enough to hold it.";
                    action = "Receive Comfort";
                } else if (isHappy) {
                    analysis = "This joy is a beautiful gift in your season of growth.";
                    quote = "Every good and perfect gift is from above.";
                    location = "James 1:17";
                    advice = "Take a moment to simply say 'Thank You' for this season of blessing.";
                    action = "Offer Praise";
                } else {
                    analysis = "As you reflect today, notice the small details where grace appears.";
                    quote = "He has made everything beautiful in its time.";
                    location = "Ecclesiastes 3:11";
                    advice = "Look for God's hand moving in the quiet moments today.";
                    action = "Seek Him";
                }
            }
            else if (belief === 'Muslim') {
                if (isAnxious) {
                    analysis = "I sense the weight you are carrying. Remember that results belong to Allah alone.";
                    if (isWork) {
                        quote = "Tie your camel and trust in Allah.";
                        location = "Hadith (At-Tirmidhi)";
                        advice = "Do your best, and leave the outcome to Al-Wakil (The Trustee).";
                    } else {
                        quote = "Verily, in the remembrance of Allah do hearts find rest.";
                        location = "Quran 13:28";
                        advice = "Recite 'HasbunAllahu wa ni'mal wakil' (Allah is sufficient for us).";
                    }
                    action = "Make Dua";
                } else if (isSad) {
                    analysis = "Your pain is seen by Al-Sami. He does not burden a soul beyond its capacity.";
                    quote = "Allah does not burden a soul beyond that it can bear.";
                    location = "Quran 2:286";
                    advice = "Turn to Him in simple, honest dua. He is always listening.";
                    action = "Seek Patience";
                } else if (isHappy) {
                    analysis = "Alhamdulillah for this happiness. Let it increase your devotion.";
                    quote = "If you are grateful, I will surely increase you.";
                    location = "Quran 14:7";
                    advice = "Let your joy turn into gratitude and a small act of charity today.";
                    action = "Say Alhamdulillah";
                } else {
                    analysis = "Reflect on your intention (Niyyah) today. It is the heart of every action.";
                    quote = "Actions are according to intentions.";
                    location = "Hadith (Bukhari)";
                    advice = "Simply purifying your intention turns ordinary actions into rewards.";
                    action = "Renew Intention";
                }
            }
            else if (belief === 'Jewish') {
                if (isAnxious) {
                    analysis = "In moments of worry, remember that your steps are established.";
                    quote = "The heart of man plans his way, but the Lord establishes his steps.";
                    location = "Proverbs 16:9";
                    advice = "Trust in the covenant and find peace in doing one small mitzvah right now.";
                    action = "Do a Mitzvah";
                } else if (isSad) {
                    analysis = "Even in the narrowest place, there is a path to liberation.";
                    quote = "From the depths I called to You, O Lord.";
                    location = "Psalm 130:1";
                    advice = "Your sorrow is acknowledged. Let the light of the tradition steady your soul.";
                    action = "Find Light";
                } else if (isHappy) {
                    analysis = "Mazel Tov! This joy is a blessing to be shared with your circle.";
                    quote = "Serve the Lord with gladness.";
                    location = "Psalm 100:2";
                    advice = "Let your heart sing today and share this light with others.";
                    action = "Share Joy";
                } else {
                    analysis = "Every moment is an opportunity for connection and holiness.";
                    quote = "Be holy, for I am holy.";
                    location = "Leviticus 19:2";
                    advice = "Reflect on how your actions today can bring more holiness into the world.";
                    action = "Seek Holiness";
                }
            }
            else if (belief === 'Sikh') {
                if (isAnxious) {
                    analysis = "Waheguru is the Protector of all. Let go of the ego's fear.";
                    quote = "Why do you worry, O mind? The Lord Himself provides.";
                    location = "Guru Granth Sahib";
                    advice = "Ground yourself in Nam Simran and trust in the Divine Provider.";
                    action = "Meditate (Simran)";
                } else if (isSad) {
                    analysis = "In times of pain, seek the spirit of Chardi Kala.";
                    quote = "Nanak Naam Chardi Kala, Tere Bhane Sarbat Da Bhala.";
                    location = "Ardas";
                    advice = "May your spirit remain high as you seek the well-being of all.";
                    action = "Rise in Spirit";
                } else if (isHappy) {
                    analysis = "Lakh Lakh Vadhaiya! This happiness is a gift from the True Guru.";
                    quote = "The Guru has blessed me with the treasure of the Lord’s Name.";
                    location = "Guru Granth Sahib";
                    advice = "Express your gratitude through Seva (selfless service) today.";
                    action = "Do Seva";
                } else {
                    analysis = "Reflect on whether your actions today are honest and selfless.";
                    quote = "Truth is the highest virtue, but higher still is truthful living.";
                    location = "Guru Nanak Dev Ji";
                    advice = "Focus on bringing your mind into alignment with the Truth (Sat).";
                    action = "Verify Truth";
                }
            }
            else if (belief === 'Hindu') {
                if (isAnxious) {
                    analysis = "Anxiety arises from attachment to the fruits of action. Return to your Dharma.";
                    quote = "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.";
                    location = "Bhagavad Gita 2.47";
                    advice = "Perform your work as an offering, without worrying about the results.";
                    action = "Focus on Dharma";
                } else if (isSad) {
                    analysis = "Life is a flow of dualities. Find the steady witness within.";
                    quote = "The soul is neither born, nor does it ever die.";
                    location = "Bhagavad Gita 2.20";
                    advice = "Find the steady witness (Atman) that remains untouched by emotional waves.";
                    action = "Seek the Witness";
                } else if (isHappy) {
                    analysis = "Enjoy this state of Sattva. Let it fuel your devotion.";
                    quote = "Whatever you do... do that as an offering to Me.";
                    location = "Bhagavad Gita 9.27";
                    advice = "Let your happiness turn into Bhakti (devotion) and gratitude.";
                    action = "Offer Gratitude";
                } else {
                    analysis = "Seek to move toward Sattva (clarity) in your thoughts.";
                    quote = "From the unreal lead me to the real.";
                    location = "Brhadaranyaka Upanishad";
                    advice = "Notice the quality of your mind and seek balance in all things.";
                    action = "Seek Balance";
                }
            }
            else if (belief === 'Buddhist') {
                if (isAnxious) {
                    analysis = "Anxiety is a story about a future that doesn't exist. Return to the breath.";
                    quote = "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.";
                    location = "The Buddha";
                    advice = "Return to the present moment; it is the only place where life exists.";
                    action = "Return to Breath";
                } else if (isSad) {
                    analysis = "Compassion includes yourself. Observe this sadness without judgment.";
                    quote = "Pain is inevitable, suffering is optional.";
                    location = "Buddhist Wisdom";
                    advice = "Observe your feelings like rain falling on a garden—with compassion.";
                    action = "Practice Metta";
                } else if (isHappy) {
                    analysis = "Savor this joy, but notice its nature—fluid and changing.";
                    quote = "Happiness is not having a lot. Happiness is giving a lot.";
                    location = "The Buddha";
                    advice = "Enjoy this moment fully without clinging; this is the path of equanimity.";
                    action = "Savor Equanimity";
                } else {
                    analysis = "Check if your thoughts are rooted in non-attachment and compassion.";
                    quote = "Three things cannot be long hidden: the sun, the moon, and the truth.";
                    location = "The Buddha";
                    advice = "Act with Right Intention today, seeking the middle way in all things.";
                    action = "Check Intention";
                }
            }
            else { // Secular / Open / Exploring / Spiritual / General Path
                if (isAnxious) {
                    analysis = "Anxiety is often excitement without the breath. You have handled everything up to this point.";
                    if (isWork) {
                        quote = "You are not your job. Your value is intrinsic.";
                        location = "Modern Wisdom";
                        advice = "Focus on what is within your control, and release the rest today.";
                    } else {
                        quote = "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.";
                        location = "Ancient Mindfulness";
                        advice = "Take three deep, slow breaths. Ground yourself in this present moment.";
                    }
                    action = "Breathe Deeply";
                } else if (isSad) {
                    analysis = "Honor this feeling. Sadness is often love with nowhere to go.";
                    quote = "The wound is the place where the Light enters you.";
                    location = "Rumi";
                    advice = "Don't rush to 'fix' it. Just witness it with compassion today.";
                    action = "Be Kind to Self";
                } else if (isHappy) {
                    analysis = "Savor this feeling. Our brains are wired to overlook the good.";
                    quote = "Joy is a net of love by which you can catch souls.";
                    location = "Mother Teresa";
                    advice = "Take 10 seconds to really feel this joy in your body. Store it for later.";
                    action = "Savor the Moment";
                } else {
                    analysis = "Clarity often comes when we pause to listen to our own inner wisdom.";
                    quote = "Knowing yourself is the beginning of all wisdom.";
                    location = "Aristotle";
                    advice = "As you write, try to connect with your 'Why' and the values guiding you.";
                    action = "Find Clarity";
                }
            }

            return { title, greeting, analysis, quote, location, advice, action };
        } else {
            try {
                const allEntries = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const recentJournal = allEntries.slice(0, 10).map(e => `[${e.date}] ${e.title}: ${e.content}`).join(' | ');
                const historySummary = allEntries.slice(10, 30).map(e => e.title).join(', ');
                
                const instructions = `
You are a profound Spiritual Counselor in the True North Sanctuary. 

TASK:
1. Identify a sacred text quote (e.g., from the Bible, Quran, Gita, Torah, Guru Granth Sahib, etc.) that is strictly aligned with the user's belief system (${belief}) and resonates with their current focus.
2. Provide the specific location/source of the quote correctly (e.g., "John 14:27", "Surah Al-Baqarah 2:153", etc.).
3. Expound deeply on this wisdom in the context of the user's current affirmation: "${content}".
4. Deeply weave in their primary life themes (${selectedThemes?.join(', ') || 'personal growth'}) and align the advice with their specific goals: ${JSON.stringify(userGoals)}.
5. Mirror the emotional state found in their recent reflections: "${recentJournal || 'no recent entries'}".
6. Reference their historical journey: "${historySummary || 'No older history recorded yet.'}".

GUIDELINES:
- Use a tone that is compassionate, vulnerable, and authoritative.
- Ensure the quote is accurate and the location is provided.
- Avoid generic advice; make it feel like you are speaking directly to their current soul-state.

FORMAT: 
Output strictly JSON only. No markdown formatting around the JSON.
Keys: 
- title: A sacred, comforting title for this guidance.
- greeting: A warm, personalized greeting to the seeker (e.g., "Hello [Name],").
- analysis: A deep, reflective analysis based on their recent sanctuary reflections, themes, and goals.
- quote: The exact words of the pertinent sacred text.
- location: The specific source/location of the quote (e.g., "Psalm 23:1").
- advice: Practical, actionable advice on how to navigate the day effectively, drawing upon their context and the sacred text.
- action: A single, practical, small soul-step to take today (short label, e.g., "Breathe", "Pray", "Serve").
`.trim();

                const systemPrompt = await constructSystemPrompt(belief, instructions, tier, username, userGoals, dateOfBirth, astrologyEnabled, selectedThemes);
                const userPrompt = `Guide me based on my current path and recent sanctuary reflections.`;
                const jsonStr = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt, true);

                // Clean JSON string of potential markdown backticks
                let cleanedJson = jsonStr.trim();
                if (cleanedJson.startsWith('```json')) cleanedJson = cleanedJson.replace(/^```json/, '');
                if (cleanedJson.startsWith('```')) cleanedJson = cleanedJson.replace(/^```/, '');
                if (cleanedJson.endsWith('```')) cleanedJson = cleanedJson.replace(/```$/, '');
                cleanedJson = cleanedJson.trim();

                // Try to parse JSON
                try {
                    const parsed = JSON.parse(cleanedJson);
                    return {
                        title: parsed.title || "Spiritual Insight",
                        greeting: parsed.greeting || `Hello, ${username || 'Seeker'}.`,
                        analysis: parsed.analysis || parsed.message || "I am reflecting on your path.",
                        quote: parsed.quote || "",
                        location: parsed.location || "",
                        advice: parsed.advice || "Keep your heart open to the light today.",
                        action: parsed.action || "Reflect"
                    };
                } catch (parseError) {
                    console.error("[ContentAgent] JSON Parse Error. Falling back to Regex Extractor. Raw:", jsonStr);
                    
                    // Robust regex fallback extractor for truncated or malformed JSON
                    const extract = (key: string) => {
                        // Using ([^"]*) instead of ([^"]*)" so we can capture truncated values without closing quotes!
                        const match = jsonStr.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)`, 'i'));
                        return match ? match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim() : null;
                    };

                    const adviceFallback = extract('advice') || extract('message') || "The sanctuary offers quiet guidance today.";

                    return { 
                        title: extract('title') || "Spiritual Insight", 
                        greeting: extract('greeting') || `Hello, ${username || 'Seeker'}.`,
                        analysis: extract('analysis') || "I am reflecting on your path.",
                        quote: extract('quote') || "",
                        location: extract('location') || "",
                        advice: adviceFallback, 
                        action: extract('action') || "Reflect" 
                    };
                }

            } catch (err) {
                console.error("[ContentAgent] Error in getSpiritualAnalysis:", err);
                return { 
                    title: "Insight", 
                    greeting: `Hello, ${username || 'Seeker'}.`,
                    analysis: "I am reflecting on your path.",
                    quote: "The Lord is my shepherd; I shall not want.",
                    location: "Psalm 23:1",
                    advice: "Your thoughts are heard. Breathe and find peace in this moment.", 
                    action: "Breathe" 
                };
            }
        }
    },

    getJournalReflection: async (content: string, belief: BeliefType): Promise<{ 
        title: string, 
        greeting: string,
        analysis: string, 
        quote: string, 
        location: string, 
        advice: string, 
        action: string 
    }> => {
        const provider = await SpiritualIntelligenceService.getProvider();
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled, username, userGoals } = useStore.getState();

        if (provider === 'LocalMock') {
            return {
                title: "Sacred Reflection",
                greeting: `Peace be with you, ${username || 'Seeker'}.`,
                analysis: "I've carefully considered what you've shared in your sanctuary. Your words reveal a heart seeking alignment and truth.",
                quote: belief === 'Muslim' ? "Verily, in the remembrance of Allah do hearts find rest." : "Be still, and know that I am God.",
                location: belief === 'Muslim' ? "Quran 13:28" : "Psalm 46:10",
                advice: "Carry this stillness with you throughout the day. Let your actions flow from this center of peace.",
                action: belief === 'Muslim' ? "Ameen" : "Amen"
            };
        } else {
            try {
                const instructions = `
You are an enlightened Spiritual Guide in the True North Sanctuary. 

USER INPUT: "${content}"
BELIEF SYSTEM: ${belief}
USER GOALS: ${JSON.stringify(userGoals)}

TASK: Provide a 4-part spiritual reflection based strictly on the user's input, their path, and their goals.

COMPONENTS:
1. A warm, welcoming greeting to the user.
2. A reflective analysis based on the user's themes, goals, and this specific journal entry.
3. A pertinent quote from the corresponding sacred text (${belief}).
4. Practical advice on how to navigate the day effectively, drawing upon everything mentioned above.

GUIDELINES:
- Tone: Compassionate, wise, and deeply personal.
- NO labels like "Greeting:", "Analysis:", "Quote:", or "Advice:" in the final text.
- The final result must be a beautiful, continuous flow of wisdom.
- Return ONLY a JSON object with the keys below.

JSON KEYS:
- title: A short, poetic title (e.g., "Dawn of Clarity").
- greeting: The personal greeting.
- analysis: The reflective analysis.
- quote: The exact words of the sacred text.
- location: The specific source (e.g., "John 14:27").
- advice: The practical daily advice.
- action: A single word for the button (e.g., "Reflect", "Amen", "Ameen").
`.trim();

                const systemPrompt = await constructSystemPrompt(belief, instructions, tier, username, userGoals, dateOfBirth, astrologyEnabled);
                const userPrompt = `Reflect on my word: "${content}"`;
                const jsonStr = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);

                let cleanedJson = jsonStr.trim();
                if (cleanedJson.startsWith('```json')) cleanedJson = cleanedJson.replace(/^```json/, '');
                if (cleanedJson.startsWith('```')) cleanedJson = cleanedJson.replace(/^```/, '');
                if (cleanedJson.endsWith('```')) cleanedJson = cleanedJson.replace(/```$/, '');
                cleanedJson = cleanedJson.trim();

                try {
                    const parsed = JSON.parse(cleanedJson);
                    return {
                        title: parsed.title || "Sacred Insight",
                        greeting: parsed.greeting || `Hello, ${username || 'Seeker'}.`,
                        analysis: parsed.analysis || "I am reflecting on your path.",
                        quote: parsed.quote || "",
                        location: parsed.location || "",
                        advice: parsed.advice || "Walk in grace today.",
                        action: parsed.action || "Amen"
                    };
                } catch (parseError) {
                    console.error("[ContentAgent] JSON Parse Error in getJournalReflection. Falling back to Regex. Raw:", jsonStr);
                    
                    const extract = (key: string) => {
                        const match = jsonStr.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)`, 'i'));
                        return match ? match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').trim() : null;
                    };

                    const getFallback = () => {
                        const b = belief || 'Open';
                        if (b === 'Muslim') return { q: "Verily, with hardship comes ease.", l: "Quran 94:6", a: "Ameen" };
                        if (b === 'Christian' || b === 'Catholic' || b === 'Protestant') return { q: "The Lord is my shepherd; I shall not want.", l: "Psalm 23:1", a: "Amen" };
                        if (b === 'Hindu') return { q: "You have the right to work, but never to the fruit of work.", l: "Bhagavad Gita 2.47", a: "Om" };
                        if (b === 'Buddhist') return { q: "Peace comes from within. Do not seek it without.", l: "Buddha", a: "Breathe" };
                        return { q: "Within you is a stillness and a sanctuary to which you can retreat at any time.", l: "Hermann Hesse", a: "So be it" };
                    };
                    const fallback = getFallback();

                    const adviceFallback = extract('advice') || extract('message') || "Peace be with you this day.";

                    return { 
                        title: extract('title') || "Sacred Insight", 
                        greeting: extract('greeting') || `Hello, ${username || 'Seeker'}.`,
                        analysis: extract('analysis') || "Your reflection is a beautiful step on your journey.",
                        quote: extract('quote') || fallback.q,
                        location: extract('location') || fallback.l,
                        advice: adviceFallback, 
                        action: extract('action') || fallback.a 
                    };
                }
            } catch (err) {
                console.error("[ContentAgent] Network Error in getJournalReflection:", err);
                const getFallback = () => {
                    const b = belief || 'Open';
                    if (b === 'Muslim') return { q: "Verily, with hardship comes ease.", l: "Quran 94:6", a: "Ameen" };
                    if (b === 'Christian' || b === 'Catholic' || b === 'Protestant') return { q: "The Lord is my shepherd; I shall not want.", l: "Psalm 23:1", a: "Amen" };
                    if (b === 'Hindu') return { q: "You have the right to work, but never to the fruit of work.", l: "Bhagavad Gita 2.47", a: "Om" };
                    if (b === 'Buddhist') return { q: "Peace comes from within. Do not seek it without.", l: "Buddha", a: "Breathe" };
                    return { q: "Within you is a stillness and a sanctuary to which you can retreat at any time.", l: "Hermann Hesse", a: "So be it" };
                };
                const fb = getFallback();
                return { 
                    title: "Sacred Insight", 
                    greeting: `Hello, ${username || 'Seeker'}.`,
                    analysis: "Your reflection is a beautiful step on your journey.",
                    quote: fb.q,
                    location: fb.l,
                    advice: "Peace be with you this day.", 
                    action: fb.a 
                };
            }
        }
    },

    getDailyAffirmation: async (belief: BeliefType, themes: string[]): Promise<{ text: string, verse?: string }> => {
        const theme = themes[0] || 'Wisdom';
        const provider = await SpiritualIntelligenceService.getProvider();
        const { subscriptionTier: tier, dateOfBirth, astrologyEnabled } = useStore.getState();

        if (provider === 'LocalMock') {
            const affirmations: Record<BeliefType, Array<{ text: string, verse?: string }>> = {
                Christian: [
                    { text: "Today, I walk in the strength of my purpose, guided by wisdom and fueled by love.", verse: "Isaiah 40:31" },
                    { text: "I am fearfully and wonderfully made, and my path is ordered by a higher purpose.", verse: "Psalm 139:14" },
                    { text: "In the stillness, I hear the whisper of grace guiding my steps toward peace.", verse: "1 Kings 19:12" }
                ],
                Muslim: [
                    { text: "Truly, with every hardship comes ease. I am grounded in patience and trust.", verse: "Quran 94:6" },
                    { text: "My heart finds rest in the remembrance of my Creator and the pursuit of goodness.", verse: "Quran 13:28" },
                    { text: "I walk with humility and integrity, seeking alignment in every action.", verse: "Quran 25:63" }
                ],
                Secular: [
                    { text: "I am the architect of my own peace, building a life of intention and clarity.", verse: "Stoic Wisdom" },
                    { text: "Growth is a quiet journey. I honor my progress and embrace the lessons of today.", verse: "Modern Philosophy" },
                    { text: "Direction is more important than speed. I am aligned with my true values.", verse: "Mindfulness" }
                ],
                Exploring: [
                    { text: "The universe reflects my inner light. I am open to the truth appearing in my day.", verse: "Rumi" },
                    { text: "I am a seeker of wisdom, finding alignment in the flow of existence.", verse: "Ancient Sage" },
                    { text: "Every moment is a new sanctuary of possibility. I step forward with grace.", verse: "Universal Wisdom" }
                ],
                Open: [
                    { text: "I am centered, I am grounded, I am exactly where I need to be.", verse: "Marcus Aurelius" },
                    { text: "Compassion is my compass, and wisdom is my guide along this sacred path.", verse: "The Way" },
                    { text: "I choose to radiate peace and receive the abundance of this moment.", verse: "Inner Peace" }
                ],
                Spiritual: [
                    { text: "I am a vessel of light and love, perfectly aligned with the rhythm of the universe.", verse: "Universal Spirit" },
                    { text: "My soul is at peace, and my heart is open to the infinite wisdom within.", verse: "Inner Light" },
                    { text: "I radiate high-vibrational energy, attracting peace and purpose into my field.", verse: "Sacred Flow" }
                ],
                Catholic: [
                    { text: "I am a temple of the Holy Spirit, called to holiness and love.", verse: "1 Cor 6:19" },
                    { text: "My soul magnifies the Lord, and my spirit rejoices in God my Savior.", verse: "Luke 1:46" },
                    { text: "I act with justice, love tenderly, and walk humbly with my God.", verse: "Micah 6:8" }
                ],
                Protestant: [
                    { text: "I am saved by grace through faith, and created for good works.", verse: "Eph 2:8-10" },
                    { text: "I can do all things through Christ who strengthens me.", verse: "Phil 4:13" },
                    { text: "I trust in the Lord with all my heart and lean not on my own understanding.", verse: "Prov 3:5" }
                ],
                Sikh: [
                    { text: "The True Name is my support; I walk in the light of the Guru's wisdom.", verse: "Guru Granth Sahib, Ang 2" },
                    { text: "I am a servant of the One, finding my strength in Seva and my peace in Simran.", verse: "Guru Granth Sahib, Ang 282" },
                    { text: "In Chardi Kala, my spirit rises above every challenge with courage and grace.", verse: "Ardas" }
                ],
                Hindu: [
                    { text: "My soul is eternal, untouched by the dualities of life; I am one with the Divine.", verse: "Bhagavad Gita 2.20" },
                    { text: "I follow my Dharma with a clear mind and a heart full of devotion.", verse: "Bhagavad Gita 3.35" },
                    { text: "Peace is my true nature; OM Shanti Shanti Shanti.", verse: "Mandukya Upanishad" }
                ],
                Buddhist: [
                    { text: "I am present, I am mindful, and I meet every moment with compassion.", verse: "Dhammapada 1.1" },
                    { text: "Like a lotus in the water, I remain untouched by the chaos around me.", verse: "Dhammapada 4.58" },
                    { text: "I let go of what no longer serves me and find peace in what is.", verse: "Dhammapada 20.279" }
                ],
                Jewish: [
                    { text: "I am a partner in the work of creation; every mitzvah I do brings light into the world.", verse: "Talmud, Shabbat 10a" },
                    { text: "If I am not for myself, who will be for me? If I am only for myself, what am I?", verse: "Pirkei Avot 1:14" },
                    { text: "I walk the path of Chesed, bringing kindness and Shalom into my daily life.", verse: "Pirkei Avot 2:1" }
                ]
            };

            const list = affirmations[belief] || affirmations.Open;
            const now = new Date();
            const dayIndex = now.getDate() % list.length;
            return list[dayIndex];
        } else {
            const todayStr = new Date().toISOString().split('T')[0];
            const cacheKey = `@TN:DailyAffirmation:${todayStr}:${belief}:${theme}`;
            try {
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) return JSON.parse(cached);
            } catch (e) { /* ignore */ }

            try {
                const { subscriptionTier: _tier, dateOfBirth: _dateOfBirth, astrologyEnabled: _astrologyEnabled, username, userGoals, journalEntries } = useStore.getState();
                const allEntries = [...journalEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const recentJournal = allEntries.slice(0, 5).map(e => `${e.title}: ${e.content}`).join(' | ');
                const historySummary = allEntries.slice(5, 20).map(e => e.title).join(', ');
                const systemPrompt = await constructSystemPrompt(belief, `Generate a short, powerful, and poetic daily affirmation for a seeker. Ensure it is resonant with their path (${belief}) and profoundly targets their listed life goals. Focus: ${theme}. ${recentJournal ? `Consider their recent reflections: ${recentJournal}.` : ''} ${historySummary ? `Recall their long-term focus: ${historySummary}.` : ''} Return JSON with "text" and "verse" (optional).`, tier, username, userGoals, dateOfBirth, astrologyEnabled, [theme]);
                const userPrompt = `Generate a daily sanctuary affirmation for a ${belief} seeker focusing on ${theme}.`;
                const jsonStr = await SpiritualIntelligenceService.generateText(systemPrompt, userPrompt);
                try {
                    const parsed = JSON.parse(jsonStr);
                    const result = { text: parsed.text, verse: parsed.verse };
                    try { await AsyncStorage.setItem(cacheKey, JSON.stringify(result)); } catch (_e) { /* ignore */ }
                    return result;
                } catch {
                    const result = { text: jsonStr };
                    try { await AsyncStorage.setItem(cacheKey, JSON.stringify(result)); } catch (_e) { /* ignore */ }
                    return result;
                }
            } catch {
                // Return a belief-specific fallback instead of a generic one
                const fallbacks: Record<string, { text: string, verse: string }> = {
                    Christian: { text: "I can do all things through Christ who strengthens me.", verse: "Philippians 4:13" },
                    Catholic: { text: "My soul magnifies the Lord, and my spirit rejoices in God my Savior.", verse: "Luke 1:46" },
                    Protestant: { text: "The Lord is my shepherd; I shall not want.", verse: "Psalm 23:1" },
                    Muslim: { text: "Truly, with every hardship comes ease.", verse: "Quran 94:6" },
                    Hindu: { text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.", verse: "Bhagavad Gita 2.47" },
                    Buddhist: { text: "Peace comes from within. Do not seek it without.", verse: "Buddha" },
                    Jewish: { text: "The world is built on three things: Torah, service, and acts of kindness.", verse: "Pirkei Avot 1:2" },
                    Sikh: { text: "God is One, and Truth is His Name.", verse: "Guru Nanak" },
                    Spiritual: { text: "I am a vessel of light, perfectly aligned with the universe.", verse: "Universal Spirit" },
                    Secular: { text: "I am the architect of my own peace.", verse: "Stoic Wisdom" }
                };
                const fallback = fallbacks[belief] || { text: "Today, I walk in the strength of my purpose.", verse: "True North" };
                return fallback;
            }
        }
    }
};
