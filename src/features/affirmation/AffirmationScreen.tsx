import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Share, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { useStore } from '../../store';
import {
    Heart,
    Share2,
    Copy,
    Sparkles,
    X,
    MessageSquare,
    BookOpen
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { FadeIn } from '../../components/FadeIn';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { contentAgentService } from '../../services/ContentAgentService';
import { FaithNews } from '../../components/FaithNews';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import ChoiceModal, { ChoiceOption } from '../../components/ChoiceModal';
import { BottomSheet } from '../../components/BottomSheet';

// Define aliases for icons to avoid name conflicts with common words
const HeartIcon = Heart;
const ShareIcon = Share2;
const CopyIcon = Copy;
const AdviceIcon = MessageSquare;
const CloseIcon = X;
const GuideIcon = BookOpen;
const WalkthroughIcon = Sparkles;


const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop', // Lush mountains
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop', // Sunlight in woods
    'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2000&auto=format&fit=crop', // Lake sunset
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop', // Morning mist
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2000&auto=format&fit=crop', // Forest path
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop', // Alpine peaks
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop', // Zen tree
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2000&auto=format&fit=crop', // Ocean horizon
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop', // Rain on leaf
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2000&auto=format&fit=crop', // Wildflower field
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop', // Valley stream
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop', // Waterfall
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop', // Calm lake
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000&auto=format&fit=crop', // Golden light
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2000&auto=format&fit=crop', // Tree rays
];

const AFFIRMATIONS = [
    { text: "My spirit is anchored in the peace that surpasses all understanding.", author: "Sacred Truth" },
    { text: "I am a vessel of divine light, radiating love to everyone I meet.", author: "Daily Grace" },
    { text: "Today, I walk with purpose and intentionality.", author: "Faithful Path" },
    { text: "Every breath I take is a gift of grace.", author: "True North" },
    { text: "I focus my heart on what is pure, lovely, and of good report.", author: "Alignment" },
];

export const AffirmationScreen = () => {
    const renderItem = () => null;
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
    const viewShotRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const { beliefType, subscriptionTier, themes } = useStore();
    const isSubscribed = subscriptionTier !== 'free';

    const [currentIdx, setCurrentIdx] = useState(0);
    const [bgIdx, setBgIdx] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);
    const [adviceContent, setAdviceContent] = useState<any>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [isWallpaperMode, setIsWallpaperMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [showChoiceModal, setShowChoiceModal] = useState(false);
    const [choiceModalConfig, setChoiceModalConfig] = useState<{
        title: string;
        message?: string;
        options: ChoiceOption[];
    }>({ title: '', options: [] });

    useEffect(() => {
        // Daily cycling based on day of year for better variety
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        setCurrentIdx(dayOfYear % AFFIRMATIONS.length);
        setBgIdx(dayOfYear % BACKGROUNDS.length);

        // Auto-display guidance if past 10:00 AM and not seen today
        const checkAutoAdvice = async () => {
            const hour = now.getHours();
            if (hour >= 10) {
                const { DailyRitualService } = require('../../services/DailyRitualService');
                const lastSeen = await DailyRitualService.shouldShowAdvice();
                if (lastSeen) {
                    handleGetAdvice();
                    await DailyRitualService.markAdviceShown();
                }
            }
        };
        checkAutoAdvice();
    }, []);

    const current = AFFIRMATIONS[currentIdx];

    const copyToClipboard = async () => {
        // Fallback to share if clipboard is not available
        try {
            await Share.share({
                message: `"${current.text}" - ${current.author}\n\nDiscover spiritual guidance and affirmations on True North. Download here: https://www.truenorth.you/download`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = async () => {
        setChoiceModalConfig({
            title: 'Spread the Word',
            message: 'Share this sacred affirmation with your community.',
            options: [
                {
                    text: 'Share Text',
                    onPress: async () => {
                        try {
                            await Share.share({
                                message: `Today's True North Affirmation:\n\n"${current.text}"\n\nDiscover spiritual guidance and affirmations on True North. Download here: https://www.truenorth.you/download`,
                            });
                        } catch (error) {
                            console.error(error);
                        }
                    }
                },
                {
                    text: 'Copy to Clipboard',
                    onPress: copyToClipboard
                },
                { text: 'Cancel', style: 'cancel', onPress: () => { } }
            ]
        });
        setShowChoiceModal(true);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleGetAdvice = async () => {
        setLoadingAdvice(true);
        setShowAdvice(true);
        setAdviceContent({ greeting: 'Reflecting...', analysis: 'Preparing your spiritual guidance...' });

        try {
            const advice = await contentAgentService.getSpiritualAnalysis(
                current.text,
                beliefType || 'Spiritual',
                themes
            );
            setAdviceContent(advice);
        } catch (error) {
            setAdviceContent({ analysis: "Rest in the silence. The guidance will come clear soon." });
        } finally {
            setLoadingAdvice(false);
        }
    };

    const copyAdvice = async () => {
        if (!adviceContent) return;

        const textToCopy = [
            adviceContent.greeting,
            adviceContent.analysis,
            adviceContent.quote ? `"${adviceContent.quote}" — ${adviceContent.location}` : '',
            adviceContent.advice
        ].filter(Boolean).join('\n\n');

        try {
            await Share.share({
                message: `${textToCopy}\n\n— Sent from True North Sanctuary`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const saveWallpaper = async () => {
        try {
            setSaving(true);
            setCapturing(true);
            
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Allow access to photos to save your wallpaper.");
                setCapturing(false);
                return;
            }

            // Ensure isWallpaperMode is true (safety)
            setIsWallpaperMode(true);
            
            // Small delay to ensure UI updates (hiding header and buttons)
            await new Promise(resolve => setTimeout(resolve, 200));

            const uri = await viewShotRef.current.capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            
            setCapturing(false);
            setIsWallpaperMode(false);
            Alert.alert("Sanctuary Saved", "Your sacred wallpaper is now in your photo library.");
        } catch (error) {
            setCapturing(false);
            console.error('Error saving wallpaper:', error);
            Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
        } finally {
            setSaving(false);
            setCapturing(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* @ts-ignore */}
            <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ flex: 1 }}>
                <ImageBackground
                    source={{ uri: BACKGROUNDS[bgIdx] }}
                    style={styles.background}
                >

                    <View style={styles.overlay} />

                    <TrueNorthFlashList
                        data={[]}
                        renderItem={renderItem}
                        keyExtractor={() => 'affirmation'}
                        estimatedItemSize={800}
                        contentContainerStyle={isWallpaperMode ? styles.scrollContentWallpaper : styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <>
                                <View style={isWallpaperMode ? styles.contentWallpaper : styles.content}>
                                    <FadeIn from="none" duration={1000}>
                                        <View>
                                            <Text 
                                                style={styles.quoteText}
                                                adjustsFontSizeToFit
                                                numberOfLines={10}
                                                minimumFontScale={0.4}
                                            >
                                                &quot;{current.text}&quot;
                                            </Text>
                                        </View>
                                    </FadeIn>
                                    <FadeIn delay={300} from="bottom">
                                        <View>
                                            <Text style={styles.authorText}>{current.author}</Text>
                                        </View>
                                    </FadeIn>

                                    {!isWallpaperMode && (
                                        <FadeIn delay={600} from="bottom">
                                            <View style={styles.actions}>
                                                <View style={styles.actionItem}>
                                                    <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                                                        <CopyIcon color={palette.softGold} size={24} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.actionItemLabel}>Copy</Text>
                                                </View>

                                                <View style={styles.actionItem}>
                                                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                                        <ShareIcon color={palette.softGold} size={24} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.actionItemLabel}>Share</Text>
                                                </View>

                                                <View style={styles.actionItem}>
                                                    <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                                                        <HeartIcon
                                                            color={isFavorite ? palette.softGold : palette.ivory + '80'}
                                                            fill={isFavorite ? palette.softGold : 'transparent'}
                                                            size={24}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={styles.actionItemLabel}>Bless</Text>
                                                </View>

                                                <View style={styles.actionItem}>
                                                    <TouchableOpacity style={styles.actionButton} onPress={handleGetAdvice}>
                                                        <AdviceIcon color={palette.softGold} size={24} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.actionItemLabel}>Advice</Text>
                                                </View>
                                            </View>
                                        </FadeIn>
                                    )}
                                </View>

                                {!isWallpaperMode && (
                                    <FadeIn delay={900} from="bottom">
                                        <View style={styles.bottomActions}>
                                            <TouchableOpacity
                                                style={styles.wallpaperButton}
                                                onPress={() => setIsWallpaperMode(true)}
                                            >
                                                <Text style={styles.wallpaperButtonText}>Sacred Wallpaper</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.journalButton}
                                                onPress={() => navigation.navigate('JournalDetail', {
                                                    isNew: true,
                                                    initialContent: `Reflecting on today's affirmation:\n\n"${current.text}"\n\n`
                                                })}
                                            >
                                                <Text style={styles.journalButtonText}>Reflect in Journal</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </FadeIn>
                                )}

                                {!isWallpaperMode && (
                                    <View style={{ marginTop: theme.spacing.xl }}>
                                        <FaithNews type="community" />
                                    </View>
                                )}
                            </>
                        }
                    />
                </ImageBackground>
            </ViewShot>

            {!capturing && (
                <FadeIn delay={100} from="top" pointerEvents="box-none" style={{ zIndex: 100, position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity
                                style={styles.guideButton}
                                onPress={() => navigation.navigate('UserGuide')}
                            >
                                <GuideIcon color={palette.ivory} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.guideButton}
                                onPress={() => navigation.navigate('Walkthrough')}
                            >
                                <WalkthroughIcon color={palette.softGold} size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </FadeIn>
            )}

            {
                isWallpaperMode && (
                    <View style={styles.wallpaperOverlay}>
                        <View style={styles.wallpaperActions}>
                            <TouchableOpacity style={styles.wallpaperButton} onPress={() => setIsWallpaperMode(false)}>
                                <Text style={styles.wallpaperButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.wallpaperButton, styles.saveButton]} onPress={saveWallpaper} disabled={saving}>
                                <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Wallpaper'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }



            <BottomSheet
                visible={showAdvice}
                onClose={() => setShowAdvice(false)}
                title="Spiritual Guidance"
                height="70%"
            >
                <TrueNorthFlashList
                    data={[]}
                    renderItem={renderItem}
                    keyExtractor={() => 'advice'}
                    estimatedItemSize={600}
                    contentContainerStyle={styles.adviceScroll}
                    ListHeaderComponent={
                        <View style={{ paddingHorizontal: 4 }}>
                            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                                <Sparkles color={palette.softGold} size={32} />
                                <Text style={[styles.modalTitle, { marginTop: 12, textAlign: 'center' }]}>
                                    {adviceContent?.title || "Spiritual Insight"}
                                </Text>
                            </View>

                            {adviceContent?.greeting && (
                                <Text style={styles.greetingText}>
                                    {adviceContent.greeting}
                                </Text>
                            )}

                            {adviceContent?.analysis && (
                                <Text style={styles.analysisText}>
                                    {adviceContent.analysis}
                                </Text>
                            )}

                            {adviceContent?.quote && (
                                <View style={styles.quoteBlock}>
                                    <Text style={styles.quoteTextSmall}>
                                        &quot;{adviceContent.quote}&quot;
                                    </Text>
                                    {adviceContent?.location && (
                                        <Text style={styles.quoteLocation}>
                                            — {adviceContent.location}
                                        </Text>
                                    )}
                                </View>
                            )}

                            {adviceContent?.advice && (
                                <View style={styles.adviceBlock}>
                                    <View style={styles.adviceHeader}>
                                        <AdviceIcon color={palette.softGold} size={20} />
                                        <Text style={styles.adviceLabel}>DAILY ADVICE</Text>
                                    </View>
                                    <Text style={styles.adviceText}>
                                        {adviceContent.advice}
                                    </Text>
                                    
                                    <TouchableOpacity style={styles.copyAdviceBtn} onPress={copyAdvice}>
                                        <CopyIcon color={palette.softGold} size={16} />
                                        <Text style={styles.copyAdviceBtnText}>Copy Advice</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {adviceContent?.action && (
                                <View style={styles.actionBlock}>
                                    <Text style={styles.actionLabel}>SOUL STEP</Text>
                                    <Text style={styles.actionText}>{adviceContent.action}</Text>
                                </View>
                            )}
                        </View>
                    }
                />

                <TouchableOpacity
                    style={[styles.closeBtn, { marginTop: 24 }]}
                    onPress={() => setShowAdvice(false)}
                >
                    <Text style={styles.closeBtnText}>Return to Presence</Text>
                </TouchableOpacity>
            </BottomSheet>

            <ChoiceModal
                visible={showChoiceModal}
                onClose={() => setShowChoiceModal(false)}
                title={choiceModalConfig.title}
                message={choiceModalConfig.message}
                options={choiceModalConfig.options}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    scrollContent: { flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingBottom: 60, paddingTop: 120 },
    scrollContentWallpaper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xxl, paddingBottom: 0, paddingTop: 0 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contentWallpaper: { flex: 1, paddingHorizontal: 20, paddingTop: '100%', alignItems: 'center', justifyContent: 'flex-start' },
    quoteText: {
        fontFamily: theme.typography.serifBold, fontSize: 36, color: palette.ivory,
        textAlign: 'center', lineHeight: 48, letterSpacing: -0.5
    },
    authorText: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold,
        textTransform: 'uppercase', letterSpacing: 2, marginTop: theme.spacing.lg
    },
    actions: { flexDirection: 'row', marginTop: theme.spacing.xl, gap: theme.spacing.xl, alignItems: 'center' },
    actionItem: { alignItems: 'center', gap: 8 },
    actionButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
    actionItemLabel: { fontFamily: theme.typography.sansBold, fontSize: 10, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 },
    bottomActions: { marginTop: theme.spacing.xl, gap: theme.spacing.xl },
    wallpaperButton: {
        paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center'
    },
    wallpaperButtonText: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: palette.ivory },
    journalButton: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 30, backgroundColor: palette.softGold, alignItems: 'center' },
    journalButtonText: { fontFamily: theme.typography.sansBold, fontSize: 15, color: palette.charcoal },
    wallpaperActions: { flexDirection: 'row', gap: theme.spacing.md, marginTop: 40 },
    saveButton: { backgroundColor: palette.softGold, borderColor: palette.softGold },
    saveButtonText: { fontFamily: theme.typography.sansBold, fontSize: 15, color: palette.charcoal },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
    modalContent: {
        width: '100%', backgroundColor: theme.colors.surface, borderRadius: 24, padding: theme.spacing.xl,
        maxHeight: '80%', borderWidth: 1, borderColor: theme.colors.border
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
    modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    modalTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    adviceScroll: { paddingBottom: 40, paddingHorizontal: 8 },
    greetingText: {
        fontFamily: theme.typography.serifBold,
        fontSize: 22,
        color: palette.softGold,
        marginBottom: 12,
        textAlign: 'left'
    },
    analysisText: {
        fontFamily: theme.typography.serif,
        fontSize: 17,
        color: theme.colors.text,
        lineHeight: 28,
        textAlign: 'left',
        opacity: 0.9,
        marginBottom: 24
    },
    adviceBlock: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    adviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12
    },
    adviceLabel: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.softGold,
        letterSpacing: 1,
    },
    adviceText: { 
        fontFamily: theme.typography.serif, 
        fontSize: 17, 
        color: theme.colors.text, 
        lineHeight: 28, 
        textAlign: 'left',
        opacity: 0.9
    },
    copyAdviceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(200, 169, 90, 0.1)',
        borderRadius: 8
    },
    copyAdviceBtnText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.softGold,
        textTransform: 'uppercase'
    },
    quoteBlock: {
        backgroundColor: 'rgba(200, 169, 90, 0.08)',
        borderLeftWidth: 3,
        borderLeftColor: palette.softGold,
        padding: 20,
        marginBottom: 24,
        borderRadius: 8,
    },
    quoteTextSmall: {
        fontFamily: theme.typography.serifBold,
        fontSize: 19,
        color: palette.softGold,
        lineHeight: 28,
        fontStyle: 'italic',
    },
    quoteLocation: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 13,
        color: theme.colors.secondaryText,
        marginTop: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    actionBlock: {
        marginTop: 32,
        padding: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: palette.softGold + '30',
        alignItems: 'center',
    },
    actionLabel: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.softGold,
        letterSpacing: 2,
        marginBottom: 8,
    },
    actionText: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
    },
    closeBtn: { paddingVertical: 16, borderRadius: 12, backgroundColor: theme.colors.text, alignItems: 'center' },
    closeBtnText: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.background, textTransform: 'uppercase', letterSpacing: 1 },
    wallpaperOverlay: {
        position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center', zIndex: 100
    },
    headerOverlay: {
        position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 50
    },
    guideButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center'
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center'
    }
});


