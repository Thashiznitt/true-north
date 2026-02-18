import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { ExternalLink, Sparkles, X, Newspaper } from 'lucide-react-native';
import { theme, palette } from '../theme';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '../store';

interface FaithNewsProps {
    type?: 'event' | 'product' | 'community';
    onClose?: () => void;
}

const MOCK_NEWS = [
    // Christian News
    {
        id: 'c1',
        title: 'Gather: Youth Revival 2026',
        subtitle: 'Community Event • Nairobi',
        description: 'Join thousands of seekers for a night of worship and reflection.',
        cta: 'Get Tickets',
        url: 'https://example.com/events/revival',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
        type: 'event',
        belief: 'Christian'
    },
    {
        id: 'c2',
        title: 'The Sacred Journal (Biblical)',
        subtitle: 'Product • Faith Living',
        description: 'Keep your sermon notes and prayers in this luxury leather journal.',
        cta: 'Shop Now',
        url: 'https://example.com/shop/journal',
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
        type: 'product',
        belief: 'Christian'
    },
    // Muslim News
    {
        id: 'm1',
        title: 'Ramadan Night Market',
        subtitle: 'Community Event • Dubai',
        description: 'Experience the beauty of the community this holy season.',
        cta: 'Explore More',
        url: 'https://example.com/events/ramadan',
        image: 'https://images.unsplash.com/photo-1542151733-431526549219?auto=format&fit=crop&q=80&w=400',
        type: 'event',
        belief: 'Muslim'
    },
    {
        id: 'm2',
        title: 'Modern Misbaha Set',
        subtitle: 'Product • Al-Amin Designs',
        description: 'Hand-crafted Tasbih beads for your daily Dhikr.',
        cta: 'Shop Collection',
        url: 'https://example.com/shop/tasbih',
        image: 'https://images.unsplash.com/photo-1563223552-90d0349633e0?auto=format&fit=crop&q=80&w=400',
        type: 'product',
        belief: 'Muslim'
    },
    // Spiritual/Secular News
    {
        id: 's1',
        title: 'Zenith Meditation Retreat',
        subtitle: 'Experience • Sedona',
        description: 'Three days of silence and soul alignment in the desert.',
        cta: 'Book Now',
        url: 'https://example.com/events/retreat',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
        type: 'event',
        belief: 'Spiritual'
    },
    {
        id: 's2',
        title: 'Aura Alignment Stones',
        subtitle: 'Product • Essence Shop',
        description: 'Natural crystals to harmonize your sanctuary space.',
        cta: 'View Store',
        url: 'https://example.com/shop/crystals',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400',
        type: 'product',
        belief: 'Spiritual'
    },
    // Open/Exploring News
    {
        id: 'o1',
        title: 'Open Hearts Community',
        subtitle: 'Global Sanctuary',
        description: 'Find your peace in our newest digital meditation circle.',
        cta: 'Join Circle',
        url: 'truenorth://invite?circleId=c3',
        image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&q=80&w=400',
        type: 'community',
        belief: 'Open'
    },
    {
        id: 'o2',
        title: 'True North Guiding App',
        subtitle: 'Featured Partner',
        description: 'Unlock higher levels of spiritual intelligence today.',
        cta: 'Upgrade',
        url: 'truenorth://subscription',
        image: 'https://images.unsplash.com/photo-1449156006008-251f02f928a6?auto=format&fit=crop&q=80&w=400',
        type: 'product',
        belief: 'Exploring'
    }
];

export const FaithNews = ({ type, onClose }: FaithNewsProps) => {
    const navigation = useNavigation<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
    const beliefType = useStore(state => state.beliefType);

    // Filter by belief and type
    const availableNews = MOCK_NEWS.filter(n => {
        // Must match type if specified
        if (type && n.type !== type) return false;

        // Match belief or be Open
        return n.belief === beliefType || n.belief === 'Open' || n.belief === 'Exploring' || beliefType === 'Exploring';
    });

    const news = availableNews.length > 0
        ? availableNews[Math.floor(Math.random() * availableNews.length)]
        : MOCK_NEWS[Math.floor(Math.random() * MOCK_NEWS.length)];

    const handlePress = () => {
        if (news.url.startsWith('truenorth://')) {
            Linking.openURL(news.url);
        } else {
            Linking.openURL(news.url);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>COMMUNITY NEWS</Text>
                </View>
                <Newspaper size={12} color={theme.colors.secondaryText} />
            </View>

            <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.9}>
                <Image source={{ uri: news.image }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.subtitle}>{news.subtitle}</Text>
                    <Text style={styles.title}>{news.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{news.description}</Text>
                    <View style={styles.ctaRow}>
                        <Text style={styles.ctaText}>{news.cta}</Text>
                        <ExternalLink size={14} color={palette.softGold} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background + '50',
    },
    badge: {
        backgroundColor: theme.colors.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 9,
        color: theme.colors.secondaryText,
        letterSpacing: 0.5,
    },
    content: {
        flexDirection: 'row',
        padding: theme.spacing.md,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.border,
    },
    textContainer: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
    subtitle: {
        fontFamily: theme.typography.sansBold,
        fontSize: 10,
        color: palette.softGold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    title: {
        fontFamily: theme.typography.serifBold,
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 4,
    },
    description: {
        fontFamily: theme.typography.sans,
        fontSize: 12,
        color: theme.colors.secondaryText,
        lineHeight: 16,
        marginBottom: 8,
    },
    ctaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ctaText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.softGold,
    }
});
