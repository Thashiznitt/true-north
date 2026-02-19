import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, LayoutAnimation, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { Search, Plus, X, Bell, Calendar, Sparkles, Fingerprint, Lock as LucideLock, Heart, Tag } from 'lucide-react-native';
import { useStore } from '../../store';
import { FaithNews } from '../../components/FaithNews';
import * as LocalAuthentication from 'expo-local-authentication';
import { SanctuaryLock } from '../../components/SanctuaryLock';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { FadeIn } from '../../components/FadeIn';
import { EmptyState } from '../../components/EmptyState';
import { Book } from 'lucide-react-native';


interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    tags?: string[];
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
    const isSessionUnlocked = useStore(state => state.isSessionUnlocked);
    const setSessionUnlocked = useStore(state => state.setSessionUnlocked);

    const journalEntries = useStore(state => state.journalEntries);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [bioError, setBioError] = useState(false);

    const navigation = useNavigation<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any

    React.useEffect(() => {
        if (isSubscribed && (biometricsEnabled || securityPin) && !isSessionUnlocked) {
            authenticate();
        }
    }, [isSessionUnlocked]);

    const authenticate = async () => {
        if (!biometricsEnabled) {
            if (!securityPin) {
                setSessionUnlocked(true);
            }
            return;
        }

        // Handle Simulator Mock Success
        if (Platform.OS === 'ios' && !LocalAuthentication.hasHardwareAsync()) {
            setSessionUnlocked(true);
            setBioError(false);
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
                setSessionUnlocked(true);
                setBioError(false);
            } else {
                setBioError(true);
                if (securityPin) promptPin();
            }
        } else if (securityPin) {
            promptPin();
        } else {
            setSessionUnlocked(true);
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
                            setSessionUnlocked(true);
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
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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
        if (beliefType === 'Catholic' || beliefType === 'Protestant' || beliefType === 'Christian') return 'sermons';
        if (beliefType === 'Muslim') return 'khutbahs';
        return 'favorite talks';
    };


    const renderEntry = ({ item, index }: any) => {
        const delay = index * 100;

        return (
            <FadeIn delay={Math.min(index * 100, 1000)} from="bottom">
                <View
                    style={styles.entryCardContainer}
                >
                    <TouchableOpacity
                        style={styles.entryCard}
                        onPress={() => navigation.navigate('JournalDetail', {
                            entryId: item.id,
                            entryTitle: item.title,
                            entryContent: item.content,
                            entryTags: item.tags
                        })}

                    >
                        <Text style={styles.entryDate}>{item.date}</Text>
                        <Text style={styles.entryTitle}>{item.title}</Text>
                        <Text style={styles.entryPreview} numberOfLines={2}>{item.content}</Text>
                        {item.tags && item.tags.length > 0 && (
                            <View style={styles.entryTags}>
                                {item.tags.map((tag: string, i: number) => (
                                    <View key={i} style={styles.entryTag}>
                                        <Tag size={10} color={palette.softGold} style={{ marginRight: 4 }} />
                                        <Text style={styles.entryTagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>

                </View>
            </FadeIn>
        );
    };

    // Removed hard paywall - free users can now enter but are limited by count


    const getBeliefSubtitle = () => {
        if (beliefType === 'Catholic') return "Capture your Mass reflections, prayers for grace, and journey of faith.";
        if (beliefType === 'Protestant' || beliefType === 'Christian') return "Capture your sermon notes, prayers, and daily walk with Christ.";
        if (beliefType === 'Muslim') return "Record your Khutbah reflections, Duas, and spiritual journey.";
        if (beliefType === 'Spiritual') return "Document your meditation insights, mindfulness journey, and inner growth.";
        if (beliefType === 'Exploring') return "Journal your discoveries, questions, and path to finding your truth.";
        return "Unlock your private sanctuary to document your unique journey.";
    };


    if (subscriptionTier === 'free') {
        const handleUnlock = () => {
            navigation.navigate('Subscription');
        };

        return (
            <SanctuaryLock
                onUnlock={handleUnlock}
                onBack={() => navigation.goBack()}
                error={false}
                title="Sacred Journal"
                subtitle={getBeliefSubtitle()}
                buttonText="Upgrade to Access"
                icon={LucideLock}
            />
        );
    }

    if (!isSessionUnlocked && (biometricsEnabled || securityPin)) {
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
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                {!isSearching ? (
                    <>
                        <FadeIn from="left">
                            <Text style={styles.headerTitle}>Journal</Text>
                        </FadeIn>
                        <FadeIn from="right">
                            <View style={styles.headerActions}>
                                <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
                                    <Search size={22} color={theme.colors.text} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Notifications')}>
                                    <Bell size={22} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>
                        </FadeIn>
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
            </View>

            {new Date().getHours() >= 18 && dailyGoals.eveningGratitude && (
                <FadeIn delay={300} from="bottom">
                    <TouchableOpacity
                        style={styles.gratitudeCard}
                        onPress={() => navigation.navigate('JournalDetail', { type: 'gratitude' })}
                    >
                        <LinearGradient
                            colors={[palette.softGold, '#D4AF37']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gratitudeGradient}
                        >
                            <View style={styles.gratitudeContent}>
                                <View style={styles.gratitudeIcon}>
                                    <Heart size={24} color={palette.ivory} fill={palette.ivory} />
                                </View>
                                <View style={styles.gratitudeTextContainer}>
                                    <Text style={styles.gratitudeTitle} numberOfLines={1}>Evening Gratitude</Text>
                                    <Text style={styles.gratitudeSubtitle} numberOfLines={1}>Take a moment to give thanks.</Text>
                                </View>
                            </View>
                            <View style={styles.gratitudeButton}>
                                <Text style={styles.gratitudeButtonText}>Begin</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </FadeIn>
            )}

            <TrueNorthFlashList
                data={filteredEntries}
                renderItem={renderEntry}
                keyExtractor={(item: any) => item.id} // eslint-disable-line @typescript-eslint/no-explicit-any
                estimatedItemSize={140}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        icon={searchQuery ? Search : Book}
                        title={searchQuery ? "No entries found" : "Your Sanctuary Awaits"}
                        description={searchQuery
                            ? "No reflections match your search."
                            : beliefType === 'Catholic'
                                ? "Start by sharing a reflection on today's Mass, a prayer for grace, or a moment of divine guidance."
                                : beliefType === 'Protestant' || beliefType === 'Christian'
                                    ? "Record your first sermon insight, a heartfelt prayer, or a step in your walk with Christ."
                                    : beliefType === 'Muslim'
                                        ? "Begin by recording a reflection on the Khutbah, a sincere Dua, or a moment of spiritual clarity."
                                        : beliefType === 'Spiritual'
                                            ? "Share your first meditation insight, a moment of presence, or a ripple of universal wisdom."
                                            : beliefType === 'Exploring'
                                                ? "Start by journaling a discovery, a question that sparks your soul, or a step on your path."
                                                : "Start your sacred journal today."
                        }
                        buttonLabel="New Reflection"
                        onPress={() => navigation.navigate('JournalDetail')}
                    />
                }

                ListFooterComponent={!isSubscribed ? <FaithNews type="product" /> : null}
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => {
                    navigation.navigate('JournalDetail', { isNew: true, entryTags: [] });
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
    gratitudeCard: {
        marginHorizontal: theme.spacing.xl, marginBottom: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg, overflow: 'hidden',
        elevation: 4, shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8
    },
    gratitudeGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: theme.spacing.lg
    },
    gratitudeContent: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1, marginRight: 12 },
    gratitudeIcon: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center'
    },
    gratitudeTextContainer: { flex: 1 },
    gratitudeTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: palette.ivory },
    gratitudeSubtitle: { fontFamily: theme.typography.sans, fontSize: 13, color: palette.ivory, opacity: 0.9 },
    gratitudeButton: {
        backgroundColor: palette.ivory, paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20
    },
    gratitudeButtonText: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold },
    fab: {
        position: 'absolute', right: theme.spacing.xl, bottom: 30,
        width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5
    },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
    emptyStateTitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginBottom: 8, textAlign: 'center' },
    emptyStateText: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText, textAlign: 'center', lineHeight: 24 },
    entryTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    entryTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.softGold + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    entryTagText: { fontFamily: theme.typography.sansMedium, fontSize: 11, color: palette.softGold },
});


