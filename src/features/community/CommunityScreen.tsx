import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { Users, Lock, ChevronRight, Heart, Search, Plus, Bell } from 'lucide-react-native';
import { contentAgentService, GhostCircle } from '../../services/ContentAgentService';
import { useStore } from '../../store';
import { FaithAd } from '../../components/FaithAd';

export const CommunityScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [circles, setCircles] = useState<any[]>([]);
    const { createdCircles, bookmarkedCircleIds, isSubscribed } = useStore();

    useEffect(() => {
        const initialGhostCircles = contentAgentService.initializeCircles().map(c => ({
            ...c,
            reflections: contentAgentService.cleanupOldReflections(c.reflections)
        }));
        setCircles([...createdCircles, ...initialGhostCircles]);

        // Simulated Cron: Randomly add a reflection every 30 seconds for higher activity
        const interval = setInterval(() => {
            setCircles(current => {
                const updated = [...current];
                if (updated.length === 0) return updated;

                const randomIndex = Math.floor(Math.random() * updated.length);
                const circle = updated[randomIndex];

                // If it's a user circle, it might not have belief/theme in the same place
                const belief = circle.belief || 'Open';
                const theme = circle.theme || 'Wisdom';

                const newReflection = contentAgentService.generateReflection(circle.id, belief, theme);

                updated[randomIndex] = {
                    ...circle,
                    lastActivity: 'Just now',
                    reflections: contentAgentService.cleanupOldReflections([newReflection, ...(circle.reflections || [])]).slice(0, 15)
                };
                return updated;
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [createdCircles]);

    const filteredCircles = circles
        .filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.belief && c.belief.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const aBookmarked = bookmarkedCircleIds.includes(a.id);
            const bBookmarked = bookmarkedCircleIds.includes(b.id);
            if (aBookmarked && !bBookmarked) return -1;
            if (!aBookmarked && bBookmarked) return 1;
            return 0;
        });

    const dataWithAds = React.useMemo(() => {
        if (isSubscribed || searchQuery) return filteredCircles;

        const result = [];
        for (let i = 0; i < filteredCircles.length; i++) {
            result.push(filteredCircles[i]);
            if ((i + 1) % 4 === 0) {
                result.push({ id: `ad-${i}`, isAd: true });
            }
        }
        return result;
    }, [filteredCircles, isSubscribed, searchQuery]);

    const renderCircle = ({ item }: { item: any }) => {
        if (item.isAd) return <FaithAd />;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('CircleDetail', {
                    circleId: item.id,
                    circleName: item.name,
                    circleType: `${item.belief} Circle`
                })}
            >
                {bookmarkedCircleIds.includes(item.id) && (
                    <View style={styles.bookmarkBadge}>
                        <Heart size={12} color={palette.ivory} fill={palette.ivory} />
                    </View>
                )}
                <View style={styles.cardIconContainer}>
                    <View style={styles.cardIcon}>
                        {item.type === 'Private' ? <Lock size={20} color={palette.softGold} /> : <Users size={20} color={palette.softGold} />}
                    </View>
                    <View style={styles.beliefBadge}>
                        <Text style={styles.cardBelief}>{item.belief}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardLocation} numberOfLines={1}>{item.city}, {item.country}</Text>
                    <View style={styles.cardStats}>
                        <Text style={styles.cardDetail}>{item.members.toLocaleString()} members</Text>
                        <View style={styles.statDot} />
                        <Text style={styles.cardDetail}>{item.lastActivity}</Text>
                    </View>
                </View>
                <ChevronRight size={18} color={theme.colors.border} style={{ marginLeft: theme.spacing.sm }} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={dataWithAds}
                renderItem={renderCircle}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Communities</Text>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                                <Bell size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.subtitle}>Find your sacred sanctuary among fellow seekers.</Text>

                        <View style={styles.searchContainer}>
                            <Search size={20} color={theme.colors.secondaryText} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name, city, or belief..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={theme.colors.secondaryText}
                            />
                        </View>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateCircle')}
            >
                <Plus size={32} color={palette.ivory} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    listContent: { paddingBottom: 100 },
    header: { paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.xl },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
    title: { fontFamily: theme.typography.serifBold, fontSize: 34, color: theme.colors.text, letterSpacing: -1 },
    subtitle: { fontFamily: theme.typography.sans, fontSize: 17, color: theme.colors.secondaryText, lineHeight: 24, marginBottom: theme.spacing.lg },
    iconButton: { padding: 4 },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg, paddingHorizontal: theme.spacing.md, height: 50,
        borderWidth: 1, borderColor: theme.colors.border
    },
    searchInput: { flex: 1, marginLeft: theme.spacing.sm, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text },
    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.xl, marginBottom: theme.spacing.md,
        padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
    },
    cardIconContainer: { alignItems: 'center', marginRight: theme.spacing.lg, width: 64 },
    cardIcon: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: palette.softGold + '10',
        alignItems: 'center', justifyContent: 'center', marginBottom: 6
    },
    cardContent: { flex: 1 },
    cardName: { fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text, marginBottom: 2 },
    beliefBadge: { backgroundColor: palette.softGold + '10', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'center' },
    cardBelief: { fontFamily: theme.typography.sansBold, fontSize: 8, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 0.5 },
    cardLocation: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.secondaryText, marginBottom: 4 },
    cardStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardDetail: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, opacity: 0.5 },
    statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: theme.colors.border },
    fab: {
        position: 'absolute', right: theme.spacing.xl, bottom: 30,
        width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5
    },
    bookmarkBadge: {
        position: 'absolute', top: -5, left: -5, width: 24, height: 24, borderRadius: 12,
        backgroundColor: palette.softGold, alignItems: 'center', justifyContent: 'center',
        zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    }
});
