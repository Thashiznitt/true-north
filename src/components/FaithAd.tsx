import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { ExternalLink, Sparkles, X } from 'lucide-react-native';
import { theme, palette } from '../theme';
import { useNavigation } from '@react-navigation/native';

interface FaithAdProps {
    type?: 'event' | 'product' | 'community';
    onClose?: () => void;
}

const MOCK_ADS = [
    {
        id: '1',
        title: 'Gather: Youth Revival 2026',
        subtitle: 'Community Event • Nairobi',
        description: 'Join thousands of seekers for a night of worship and reflection.',
        cta: 'Get Tickets',
        url: 'https://example.com/events/revival',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400',
        type: 'event'
    },
    {
        id: '2',
        title: 'The Sacred Journal (Premium Edition)',
        subtitle: 'Product • Faith Living',
        description: 'A hand-crafted leather journal designed for your daily devotions.',
        cta: 'Shop Now',
        url: 'https://example.com/shop/journal',
        image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400',
        type: 'product'
    },
    {
        id: '3',
        title: 'Open Hearts Community',
        subtitle: 'Global Sanctuary',
        description: 'Find your peace in our newest digital meditation circle.',
        cta: 'Join Circle',
        url: 'truenorth://invite?circleId=c3',
        image: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&q=80&w=400',
        type: 'community'
    }
];

export const FaithAd = ({ type, onClose }: FaithAdProps) => {
    const navigation = useNavigation<any>();
    const ad = type
        ? MOCK_ADS.find(a => a.type === type) || MOCK_ADS[0]
        : MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];

    const handlePress = () => {
        if (ad.url.startsWith('truenorth://')) {
            Linking.openURL(ad.url);
        } else {
            Linking.openURL(ad.url);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>COMMUNITY AD</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Subscription')} style={styles.upsellBtn}>
                    <Sparkles size={12} color={palette.softGold} />
                    <Text style={styles.upsellText}>Remove Ads</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.9}>
                <Image source={{ uri: ad.image }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.subtitle}>{ad.subtitle}</Text>
                    <Text style={styles.title}>{ad.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{ad.description}</Text>
                    <View style={styles.ctaRow}>
                        <Text style={styles.ctaText}>{ad.cta}</Text>
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
        marginHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
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
    upsellBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    upsellText: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 11,
        color: palette.softGold,
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
