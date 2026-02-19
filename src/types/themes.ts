export const APP_THEMES = [
    'Strength',
    'Love',
    'Wisdom',
    'Faith',
    'Peace',
    'Purpose',
    'Hope',
    'Joy',
    'Patience',
    'Gratitude'
] as const;

export type AppTheme = typeof APP_THEMES[number];

export const THEME_ICONS_MAP: Record<AppTheme, string> = {
    Strength: 'Shield',
    Love: 'Heart',
    Wisdom: 'BookOpen',
    Faith: 'Compass',
    Peace: 'Feather',
    Purpose: 'Mountain',
    Hope: 'Anchor',
    Joy: 'Sun',
    Patience: 'Hourglass',
    Gratitude: 'HandHeart'
};

export const THEME_DESCRIPTIONS: Record<AppTheme, string> = {
    Strength: "Building resilience and inner power.",
    Love: "Cultivating compassion and connection.",
    Wisdom: "Seeking understanding and insight.",
    Faith: "Deepening trust in the divine.",
    Peace: "Finding tranquility in simple moments.",
    Purpose: "Aligning actions with high calling.",
    Hope: "Looking forward with trust.",
    Joy: "Celebrating the gifts of life.",
    Patience: "Enduring with grace.",
    Gratitude: "Appreciating the present moment."
};
