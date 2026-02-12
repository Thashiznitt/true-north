export const palette = {
  charcoal: '#111111',
  ivory: '#FDFCFB', // Slightly brighter ivory for cleaner light mode
  softGold: '#C8A95A',
  mutedGray: '#8E8E93', // Apple-style muted gray
  border: '#E5E5EA',
  white: '#FFFFFF',
  black: '#000000',
  success: '#34C759', // For blessings
};

export const theme = {
  colors: {
    background: palette.ivory,
    text: palette.charcoal,
    secondaryText: palette.mutedGray,
    primary: palette.softGold,
    surface: palette.white,
    border: palette.border,
    accent: palette.softGold,
    inverseText: palette.white,
  },
  typography: {
    serif: 'PlayfairDisplay_400Regular',
    serifBold: 'PlayfairDisplay_700Bold',
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansBold: 'Inter_700Bold',
  },
  spacing: {
    xs: 8, // Apple-style 8pt grid
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 9999,
  }
};

export type Theme = typeof theme;
