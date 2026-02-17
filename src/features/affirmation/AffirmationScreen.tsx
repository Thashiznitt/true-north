import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ImageBackground, Share, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { useStore } from '../../store';
import {
    Heart,
    Share2,
    Copy,
    Sparkles,
    X,
    MessageSquare
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { contentAgentService } from '../../services/ContentAgentService';
import { FaithAd } from '../../components/FaithAd';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';

// Define aliases for icons to avoid name conflicts with common words
const HeartIcon = Heart;
const ShareIcon = Share2;
const CopyIcon = Copy;
const AdviceIcon = MessageSquare;
const CloseIcon = X;

const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000&auto=format&fit=crop', // Lush mountains
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop', // Sunlight in woods
    'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2000&auto=format&fit=crop', // Lake sunset
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop', // Morning mist
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2000&auto=format&fit=crop', // Forest path
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
    const { beliefType, subscriptionTier } = useStore();
    const isSubscribed = subscriptionTier !== 'free';

    const [currentIdx, setCurrentIdx] = useState(0);
    const [bgIdx, setBgIdx] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);
    const [adviceContent, setAdviceContent] = useState('');
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [isWallpaperMode, setIsWallpaperMode] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Daily cycling based on date
        const day = new Date().getDate();
        setCurrentIdx(day % AFFIRMATIONS.length);
        setBgIdx(day % BACKGROUNDS.length);
    }, []);

    const current = AFFIRMATIONS[currentIdx];

    const copyToClipboard = async () => {
        // Fallback to share if clipboard is not available
        try {
            await Share.share({
                message: `"${current.text}" - ${current.author}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Today's True North Affirmation:\n\n"${current.text}"\n\nDownload True North for your daily spiritual alignment.`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleGetAdvice = async () => {
        if (!isSubscribed) {
            navigation.navigate('Subscription');
            return;
        }

        setLoadingAdvice(true);
        setShowAdvice(true);
        setAdviceContent('Receiving spiritual guidance...');

        try {
            const advice = await contentAgentService.getSpiritualAnalysis(
                current.text,
                beliefType || 'Spiritual'
            );
            setAdviceContent(advice.message);
        } catch (error) {
            setAdviceContent("Rest in the silence. The guidance will come clear soon.");
        } finally {
            setLoadingAdvice(false);
        }
    };

    const saveWallpaper = async () => {
        try {
            setSaving(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Allow access to photos to save your wallpaper.");
                return;
            }

            const uri = await viewShotRef.current.capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Sanctuary Saved", "Your sacred wallpaper is now in your photo library.");
            setIsWallpaperMode(false);
        } catch (error) {
            Alert.alert("Error", "Could not save the wallpaper.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
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
                                <View style={styles.content}>
                                    <View>
                                        <Text style={styles.quoteText}>&quot;{current.text}&quot;</Text>
                                    </View>
                                    <View style={{ height: 20 }} />
                                    <View>
                                        <Text style={styles.authorText}>{current.author}</Text>
                                    </View>

                                    {!isWallpaperMode && (
                                        <View style={styles.actions}>
                                            <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                                                <CopyIcon color={palette.softGold} size={24} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                                <ShareIcon color={palette.softGold} size={24} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                                                <HeartIcon
                                                    color={isFavorite ? palette.softGold : palette.ivory + '80'}
                                                    fill={isFavorite ? palette.softGold : 'transparent'}
                                                    size={24}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton} onPress={handleGetAdvice}>
                                                <AdviceIcon color={palette.softGold} size={24} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>

                                {!isWallpaperMode ? (
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
                                ) : (
                                    <View style={styles.wallpaperActions}>
                                        <TouchableOpacity style={styles.wallpaperButton} onPress={() => setIsWallpaperMode(false)}>
                                            <Text style={styles.wallpaperButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.wallpaperButton, styles.saveButton]} onPress={saveWallpaper} disabled={saving}>
                                            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Wallpaper'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!isSubscribed && !isWallpaperMode && (
                                    <View style={{ marginTop: theme.spacing.md }}>
                                        <FaithAd type="community" />
                                    </View>
                                )}
                            </>
                        }
                    />
                </ImageBackground>
            </ViewShot>

            <Modal
                visible={showAdvice}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAdvice(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderLeft}>
                                <Sparkles color={palette.softGold} size={20} />
                                <Text style={styles.modalTitle}>Spiritual Advice</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowAdvice(false)}>
                                <CloseIcon color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <TrueNorthFlashList
                            data={[]}
                            renderItem={renderItem}
                            keyExtractor={() => 'advice'}
                            estimatedItemSize={400}
                            contentContainerStyle={styles.adviceScroll}
                            ListHeaderComponent={
                                <Text style={styles.adviceText}>
                                    {adviceContent}
                                </Text>
                            }
                        />

                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setShowAdvice(false)}
                        >
                            <Text style={styles.closeBtnText}>Return to Presence</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    scrollContent: { flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingBottom: 60, paddingTop: 100 },
    scrollContentWallpaper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xxl },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    quoteText: {
        fontFamily: theme.typography.serifBold, fontSize: 36, color: palette.ivory,
        textAlign: 'center', lineHeight: 48, letterSpacing: -0.5
    },
    authorText: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold,
        textTransform: 'uppercase', letterSpacing: 2, marginTop: theme.spacing.lg
    },
    actions: { flexDirection: 'row', marginTop: theme.spacing.xxl, gap: theme.spacing.xxl },
    actionButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    bottomActions: { marginTop: theme.spacing.xl, gap: theme.spacing.md },
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
    adviceScroll: { paddingBottom: theme.spacing.xl },
    adviceText: { fontFamily: theme.typography.serif, fontSize: 18, color: theme.colors.text, lineHeight: 28, textAlign: 'center' },
    closeBtn: { paddingVertical: 14, borderRadius: 12, backgroundColor: theme.colors.text, alignItems: 'center' },
    closeBtnText: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.background, textTransform: 'uppercase', letterSpacing: 1 }
});
