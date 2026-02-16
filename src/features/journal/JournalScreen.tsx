import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, LayoutAnimation, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { Search, Plus, X, Bell, Calendar, Sparkles, Fingerprint, Lock as LucideLock, Heart } from 'lucide-react-native';
import { useStore } from '../../store';
import { FaithAd } from '../../components/FaithAd';
import * as LocalAuthentication from 'expo-local-authentication';
import { SanctuaryLock } from '../../components/SanctuaryLock';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { MotiView } from 'moti';

interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
}

import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const JOURNAL_BG = require('../../../assets/journal_paywall_bg.png'); // Need to ensure it's copied there

export const JournalScreen = () => {
    const insets = useSafeAreaInsets();
    const subscriptionTier = useStore(state => state.subscriptionTier);
    const isSubscribed = subscriptionTier !== 'free';
    const dailyGoals = useStore(state => state.dailyGoals);
    const setSubscriptionTier = useStore(state => state.setSubscriptionTier);
    const beliefType = useStore(state => state.beliefType);
    const biometricsEnabled = useStore(state => state.biometricsEnabled);
    const securityPin = useStore(state => state.securityPin);

    const journalEntries = useStore(state => state.journalEntries);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocked, setIsLocked] = useState(biometricsEnabled || !!securityPin);
    const [bioError, setBioError] = useState(false);

    const navigation = useNavigation<any>();

    React.useEffect(() => {
        if (isSubscribed && (biometricsEnabled || securityPin)) {
            authenticate();
        } else {
            setIsLocked(false);
        }
    }, []);

    const authenticate = async () => {
        if (!biometricsEnabled) {
            if (securityPin) {
                setIsLocked(false);
            }
            return;
        }

        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock your private journal',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) {
                setIsLocked(false);
                setBioError(false);
            } else {
                setBioError(true);
                if (securityPin) promptPin();
            }
        } else if (securityPin) {
            promptPin();
        } else {
            setIsLocked(false);
        }
    };

    const promptPin = () => {
        Alert.prompt(
            "Enter PIN",
            "Your sanctuary is protected. Enter your 4-digit PIN to continue.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Unlock",
                    onPress: (enteredPin?: string) => {
                        if (enteredPin === securityPin) {
                            setIsLocked(false);
                            setBioError(false);
                        } else {
                            Alert.alert("Incorrect PIN", "Please try again.");
                        }
                    }
                }
            ],
            "secure-text"
        );
    };

    const filteredEntries = journalEntries.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSearch = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearching(!isSearching);
        if (isSearching) setSearchQuery('');
    };

    const handleSubscribe = () => {
        setSubscriptionTier('true_north');
    };

    const getBeliefTrait = () => {
        if (beliefType === 'Christian') return 'sermons';
        if (beliefType === 'Muslim') return 'khutbahs';
        return 'favorite talks';
    };

    const renderEntry = ({ item, index }: { item: JournalEntry, index: number }) => {
        const delay = index * 100;

        return (
            <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'timing', delay }}
                style={styles.entryCardContainer}
            >
                <TouchableOpacity
                    style={styles.entryCard}
                    onPress={() => navigation.navigate('JournalDetail', {
                        entryId: item.id,
                        entryTitle: item.title,
                        entryContent: item.content
                    })}
                >
                    <Text style={styles.entryDate}>{item.date}</Text>
                    <Text style={styles.entryTitle}>{item.title}</Text>
                    <Text style={styles.entryPreview} numberOfLines={2}>{item.content}</Text>
                </TouchableOpacity>
            </MotiView>
        );
    };

    // Removed hard paywall - free users can now enter but are limited by count


    if (isLocked && subscriptionTier !== 'free') {
        return (
            <SanctuaryLock
                onUnlock={authenticate}
                onBack={() => navigation.goBack()}
                error={bioError}
            />
        );
    }

    return (
        <View style={styles.container}>
            <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800 }}
                style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
                {!isSearching ? (
                    <>
                        <Text style={styles.headerTitle}>Journal</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
                                <Search size={22} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Notifications')}>
                                <Bell size={22} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.searchHeader}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search reflections..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={toggleSearch}>
                            <X size={22} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                )}
            </MotiView>

            <TrueNorthFlashList
                data={filteredEntries}
                renderItem={renderEntry}
                keyExtractor={(item: any) => item.id}
                estimatedItemSize={140}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    dailyGoals.eveningGratitude ? (
                        <TouchableOpacity
                            style={styles.gratitudePrompt}
                            onPress={() => navigation.navigate('JournalDetail', { isNew: true, initialContent: '1. \n2. \n3. ' })}
                        >
                            <View style={styles.gratitudeHeader}>
                                <Sparkles size={20} color={palette.softGold} />
                                <Text style={styles.gratitudeTitle}>Evening Gratitude</Text>
                            </View>
                            <Text style={styles.gratitudeText}>List 3 things you are grateful for today.</Text>
                            <View style={styles.gratitudeAction}>
                                <Text style={styles.gratitudeActionText}>Reflect Now</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            {searchQuery ? "No entries match your search." : "No entries yet. Start reflecting today."}
                        </Text>
                    </View>
                }
                ListFooterComponent={!isSubscribed ? <FaithAd type="product" /> : null}
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => {
                    if (subscriptionTier === 'free') {
                        const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                        const todayEntries = journalEntries.filter(e => e.date === today);
                        if (todayEntries.length >= 3) {
                            Alert.alert(
                                "Journal Limit",
                                "The Seeker Tier allows 3 reflections per day. Upgrade to Compass or higher for unlimited journaling.",
                                [
                                    { text: "Later", style: "cancel" },
                                    { text: "Upgrade", onPress: () => navigation.navigate('Subscription') }
                                ]
                            );
                            return;
                        }
                    }
                    navigation.navigate('JournalDetail', { isNew: true });
                }}
            >
                <Plus size={28} color={palette.ivory} />
            </TouchableOpacity>
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md
    },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 34, color: theme.colors.text, letterSpacing: -1 },
    headerActions: { flexDirection: 'row', gap: theme.spacing.md },
    searchButton: { padding: 4, marginBottom: 6 },
    searchHeader: {
        flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, height: 48,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: 6
    },
    searchInput: { flex: 1, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text },
    listContent: { paddingHorizontal: theme.spacing.xl, paddingBottom: 120 },
    entryCardContainer: {
        width: '100%',
    },
    entryCard: {
        paddingVertical: theme.spacing.xl, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    entryDate: {
        fontFamily: theme.typography.sansBold, fontSize: 12, color: theme.colors.primary,
        marginBottom: theme.spacing.xs, textTransform: 'uppercase', letterSpacing: 1
    },
    entryTitle: {
        fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text,
        marginBottom: theme.spacing.xs, letterSpacing: -0.2
    },
    entryPreview: {
        fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.secondaryText, lineHeight: 22
    },
    fab: {
        position: 'absolute', right: theme.spacing.xl,
        width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5
    },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120 },
    emptyStateText: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText },
    paywall: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xxl },
    paywallTitle: {
        fontFamily: theme.typography.serifBold, fontSize: 26, textAlign: 'center',
        color: theme.colors.text, marginBottom: theme.spacing.md, letterSpacing: -0.5
    },
    paywallSubtitle: {
        fontFamily: theme.typography.sans, fontSize: 16, textAlign: 'center',
        color: theme.colors.secondaryText, marginBottom: theme.spacing.xxl, lineHeight: 24
    },
    benefitList: {
        width: '100%',
        marginBottom: 40,
        gap: 16,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    benefitText: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 15,
        color: palette.ivory,
    },
    paywallFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        gap: 8,
    },
    footerLink: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 12,
        color: palette.ivory,
        opacity: 0.5,
    },
    footerDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: palette.ivory,
        opacity: 0.3,
    },
    subscribeButton: {
        backgroundColor: theme.colors.primary, paddingVertical: 18,
        paddingHorizontal: theme.spacing.xxl, borderRadius: theme.borderRadius.full,
        width: '100%', alignItems: 'center'
    },
    subscribeButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    gratitudePrompt: {
        backgroundColor: palette.softGold + '15',
        marginHorizontal: 0,
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: palette.softGold + '30',
    },
    gratitudeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    gratitudeTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: palette.softGold },
    gratitudeText: { fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.text, opacity: 0.8, marginBottom: 12 },
    gratitudeAction: { alignSelf: 'flex-start', backgroundColor: palette.softGold, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    gratitudeActionText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 13 },
});
