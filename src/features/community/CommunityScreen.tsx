/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { Users, Lock, ChevronRight, Heart, Search, Plus, Bell, BookOpen, Moon, Leaf, Sun, Compass } from 'lucide-react-native';
import { contentAgentService, GhostCircle } from '../../services/ContentAgentService';
import { useStore } from '../../store';
import { FaithAd } from '../../components/FaithAd';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import * as Location from 'expo-location';
import { MotiView, MotiText } from 'moti';

const getBeliefIcon = (belief: string) => {
    switch (belief) {
        case 'Christian': return BookOpen;
        case 'Muslim': return Moon;
        case 'Secular': return Leaf;
        case 'Open': return Sun;
        case 'Exploring': return Compass;
        default: return Users;
    }
};

export const CommunityScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [circles, setCircles] = useState<any[]>([]);
    const circlesRef = useRef<any[]>([]);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const { createdCircles, bookmarkedCircleIds, subscriptionTier, dailyGoals } = useStore();
    const isSubscribed = subscriptionTier !== 'free';

    useEffect(() => {
        const getLocation = async () => {
            if (!isSubscribed) return;
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
            }
        };
        getLocation();
    }, [isSubscribed]);

    useEffect(() => {
        circlesRef.current = circles;
    }, [circles]);

    useEffect(() => {
        const loadCircles = async () => {
            const rawCircles = await contentAgentService.initializeCircles();
            const initialGhostCircles = rawCircles.map(c => ({
                ...c,
                reflections: contentAgentService.cleanupOldReflections(c.reflections)
            }));
            setCircles([...createdCircles, ...initialGhostCircles]);
        };

        loadCircles();

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
                console.log('Cron: Generated reflection:', newReflection);
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
            // 1. Premium Location Prioritization (Pseudo-match for demo)
            if (isSubscribed && userLocation) {
                // For demo: Nairobi and London are "Nearby" if user has location (since mock data uses them)
                const isANearby = a.city === 'Nairobi' || a.city === 'London';
                const isBNearby = b.city === 'Nairobi' || b.city === 'London';
                if (isANearby && !isBNearby) return -1;
                if (!isANearby && isBNearby) return 1;
            }

            // 2. Bookmarks
            const aBookmarked = bookmarkedCircleIds.includes(a.id);
            const bBookmarked = bookmarkedCircleIds.includes(b.id);
            if (aBookmarked && !bBookmarked) return -1;
            if (!aBookmarked && bBookmarked) return 1;

            return 0;
        });

    const dataWithAds = React.useMemo(() => {
        const displayCircles = isSubscribed || searchQuery ? filteredCircles : filteredCircles.slice(0, 3);

        const result = [];
        for (let i = 0; i < displayCircles.length; i++) {
            result.push(displayCircles[i]);
            // Internal Ad Management: Ads show every 4 items regardless of subscription
            if ((i + 1) % 4 === 0) {
                result.push({ id: `ad-${i}`, isAd: true });
            }
        }

        // Add one ad at the end if none were added and user is subscribed (for free users, the top ad is enough for short lists)
        if (isSubscribed && result.length > 0 && !result.some(item => item.isAd)) {
            result.push({ id: 'ad-end', isAd: true });
        }

        // Add paywall item at the end for non-subscribers
        if (!isSubscribed && !searchQuery && filteredCircles.length > 3) {
            result.push({ id: 'community-paywall', isPaywall: true });
        }

        return result;
    }, [filteredCircles, isSubscribed, searchQuery]);

    const renderCircle = React.useCallback(({ item, index }: { item: any, index: number }) => {
        if (item.isPaywall) {
            return (
                <TouchableOpacity
                    style={styles.paywallCard}
                    onPress={() => navigation.navigate('Subscription')}
                >
                    <ImageBackground
                        source={require('../../../assets/journal_paywall_bg.png')}
                        style={styles.paywallBg}
                        imageStyle={{ borderRadius: theme.borderRadius.lg }}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.paywallContent}>
                            <Lock size={24} color={palette.softGold} style={{ marginBottom: 8 }} />
                            <Text style={styles.paywallTitle}>Unlock {filteredCircles.length - 3} More Circles</Text>
                            <Text style={styles.paywallSubtitle}>Join the full True North collective.</Text>
                            <View style={styles.paywallBadge}>
                                <Text style={styles.paywallBadgeText}>Subscribe $12.99 / mo</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            );
        }
        return <CircleItem item={item} index={index} bookmarkedCircleIds={bookmarkedCircleIds} navigation={navigation} />;
    }, [bookmarkedCircleIds, navigation, isSubscribed, filteredCircles]);

    return (
        <View style={styles.container}>
            <TrueNorthFlashList
                data={dataWithAds}
                renderItem={renderCircle}
                keyExtractor={(item: any) => item.id}
                estimatedItemSize={120}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 800 }}
                        style={[styles.header, { paddingTop: insets.top + 20 }]}
                    >
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>Circles</Text>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                                <Bell size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        {/* eslint-disable-next-line react-native/no-raw-text */}
                        <MotiText
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 300 }}
                            style={styles.subtitle}
                        >{'Find your sacred sanctuary among fellow seekers.'}</MotiText>

                        <View style={{ marginBottom: theme.spacing.lg }}>
                            <FaithAd type="community" />
                        </View>

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

                        {dailyGoals.weeklyCommunity && (
                            <View style={styles.missionBanner}>
                                <View style={styles.missionIcon}>
                                    <Heart size={18} color={palette.ivory} fill={palette.ivory} />
                                </View>
                                <View style={styles.missionCard}>
                                    <Text style={styles.missionTitle}>Weekly Mission</Text>
                                    <Text style={styles.missionText}>Bless a reflection today to stay aligned.</Text>
                                </View>
                            </View>
                        )}
                    </MotiView>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    if (subscriptionTier === 'true_north' || subscriptionTier === 'zenith') {
                        // Limit True North to 2 circles
                        if (subscriptionTier === 'true_north' && createdCircles.length >= 2) {
                            alert("You've reached the limit of 2 Circles for the True North tier. Upgrade to Zenith for unlimited creation.");
                            return;
                        }
                        navigation.navigate('CreateCircle');
                    } else {
                        navigation.navigate('Subscription');
                    }
                }}
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
    searchInput: { flex: 1, marginLeft: theme.spacing.sm, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, letterSpacing: 0 },
    cardContainer: {
        marginBottom: theme.spacing.md,
    },
    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.xl,
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
    },
    missionBanner: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: palette.softGold + '40',
    },
    missionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: palette.softGold,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md
    },
    missionCard: { flex: 1 },
    missionTitle: { fontFamily: theme.typography.sansBold, fontSize: 14, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 1 },
    missionText: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.text, opacity: 0.7 },
    paywallCard: {
        marginHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        height: 160,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    paywallBg: {
        flex: 1,
        justifyContent: 'center',
    },
    paywallContent: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    paywallTitle: {
        fontFamily: theme.typography.serifBold,
        fontSize: 20,
        color: palette.ivory,
        textAlign: 'center',
        marginBottom: 4,
    },
    paywallSubtitle: {
        fontFamily: theme.typography.sans,
        fontSize: 14,
        color: palette.ivory,
        opacity: 0.8,
        textAlign: 'center',
        marginBottom: 16,
    },
    paywallBadge: {
        backgroundColor: palette.softGold,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    paywallBadgeText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 10,
        color: palette.ivory,
    }
});

const CircleItem = React.memo(({ item, index, bookmarkedCircleIds, navigation }: { item: any, index: number, bookmarkedCircleIds: string[], navigation: any }) => {
    if (item.isAd) return (
        <View style={[styles.cardContainer, { marginHorizontal: theme.spacing.xl }]}>
            <FaithAd />
        </View>
    );

    const BeliefIcon = getBeliefIcon(item.belief);
    const delay = index * 100;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 10 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'timing', delay }}
            style={styles.cardContainer}
        >
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
                        {item.type === 'Private' ? (
                            <Lock size={20} color={palette.softGold} />
                        ) : (
                            <BeliefIcon size={20} color={palette.softGold} />
                        )}
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
        </MotiView>
    );
});
CircleItem.displayName = 'CircleItem';
