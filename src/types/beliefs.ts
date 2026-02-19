export const APP_BELIEFS = [
    { id: 'Catholic', label: 'Catholic', description: 'Rooted in the Sacraments, Tradition, and the Magisterium.' },
    { id: 'Protestant', label: 'Protestant', description: 'Focused on Scripture, Grace, and personal relationship with Christ.' },
    { id: 'Christian', label: 'Christian (General)', description: 'Follower of the teachings of Jesus Christ.' },
    { id: 'Muslim', label: 'Islam', description: 'Submission to the will of Allah and following the Sunnah.' },
    { id: 'Spiritual', label: 'Spiritual', description: 'Seeking connection with the Divine beyond specific religious structures.' },
    { id: 'Sikh', label: 'Sikh', description: 'Devotion to the One Creator and service to humanity.' },
    { id: 'Hindu', label: 'Hindu', description: 'Pursuing Dharma, Karma, and liberation (Moksha).' },
    { id: 'Buddhist', label: 'Buddhist', description: 'Following the Eightfold Path to enlightenment and compassion.' },
    { id: 'Jewish', label: 'Jewish', description: 'Covenant with God through Torah and tradition.' },
    { id: 'Exploring', label: 'Exploring', description: 'Open to wisdom from various paths on the journey to Truth.' },
] as const;

export type BeliefId = typeof APP_BELIEFS[number]['id'];
