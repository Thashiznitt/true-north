import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Share, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { Heart, Share2, PenLine, Music, Sparkles, Bell, Image as ImageIcon, HandHelping, X as CloseIcon, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { affirmationService } from '../../services/api';
import * as MediaLibrary from 'expo-media-library';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useStore } from '../../store';
import { FaithAd } from '../../components/FaithAd';
import { Modal, ScrollView as RnScrollView } from 'react-native';
import { contentAgentService } from '../../services/ContentAgentService';
import { MotiView, MotiText } from 'moti';

export const AffirmationScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const viewShotRef = React.useRef<any>(null);
    const [isWallpaperMode, setIsWallpaperMode] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [showAdvice, setShowAdvice] = React.useState(false);
    const [showLimitModal, setShowLimitModal] = React.useState(false);
    const [showPrayerModal, setShowPrayerModal] = React.useState(false);
    const [prayerData, setPrayerData] = React.useState<any>(null);
    const [blessed, setBlessed] = React.useState(false);
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const glowAnim = React.useRef(new Animated.Value(0)).current;

    const { isSubscribed, beliefType, themes, username, lastAdviceTimestamp, setLastAdviceTimestamp } = useStore();

    // Phase 9: Dynamic Daily Backgrounds
    const BACKGROUND_URLS = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80", // Mountains
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80", // Forest
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80", // Mist
        "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1000&q=80", // Valley
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80", // Nature
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80", // Peaks
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80", // Morning sun
    ];

    const getDailyBackground = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return BACKGROUND_URLS[dayOfYear % BACKGROUND_URLS.length];
    };

    const { data: affirmation } = useQuery({
        queryKey: ['daily-affirmation', beliefType, themes[0]],
        queryFn: () => contentAgentService.getDailyAffirmation(beliefType || 'Open', themes),
    });

    const mockAffirmation = {
        text: "Today, I walk in the strength of my purpose, guided by wisdom and fueled by love.",
        verse: "Isaiah 40:31",
        imageUrl: getDailyBackground(),
    };

    const current = affirmation ? { ...affirmation, imageUrl: getDailyBackground() } : mockAffirmation;

    const canGetAdvice = () => {
        if (!lastAdviceTimestamp) return true;
        const now = Date.now();
        const diff = now - lastAdviceTimestamp;
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const ONE_WEEK_MS = 7 * ONE_DAY_MS;
        return isSubscribed ? diff >= ONE_DAY_MS : diff >= ONE_WEEK_MS;
    };

    const [adviceContent, setAdviceContent] = React.useState('');
    const [loadingAdvice, setLoadingAdvice] = React.useState(false);

    const handleAdvicePress = async () => {
        if (canGetAdvice()) {
            setLoadingAdvice(true);
            try {
                const advice = await contentAgentService.getDailyAdvice(username || 'friend', beliefType || 'Open', themes);
                setAdviceContent(advice);
                setShowAdvice(true);
                setLastAdviceTimestamp(Date.now());
            } catch (error) {
                console.error('Failed to get advice', error);
            } finally {
                setLoadingAdvice(false);
            }
        } else {
            setShowLimitModal(true);
        }
    };

    const handleBless = () => {
        setBlessed(true);

        // Spiritual animation sequence
        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 400, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
            ])
        ]).start(() => setBlessed(false));
    };

    // ... existing onShare and saveWallpaper ...

    const onShare = async () => {
        try {
            await Share.share({
                message: `${current.text}\n\n— ${current.verse || 'True North'}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const saveWallpaper = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please allow gallery access to save wallpapers.');
                return;
            }

            setSaving(true);
            const uri = await captureRef(viewShotRef, {
                format: 'jpg',
                quality: 0.9,
            });

            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert('Success', 'Sanctuary wallpaper saved to your gallery.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save wallpaper.');
        } finally {
            setSaving(false);
            setIsWallpaperMode(false);
        }
    };

    return (
        <View style={styles.container}>
            <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: 'jpg', quality: 0.9 }}>
                <ImageBackground
                    source={{ uri: current.imageUrl }}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <Animated.View style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: palette.softGold,
                            opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] })
                        }
                    ]} />

                    <Animated.ScrollView
                        style={{ flex: 1, transform: [{ scale: scaleAnim }] }}
                        contentContainerStyle={[
                            styles.content,
                            {
                                paddingTop: insets.top + 20,
                                paddingBottom: insets.bottom + 120, // Extra padding for tab bar + ad
                                flexGrow: 1,
                                flex: 0,
                            }
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {!isWallpaperMode ? (
                            <View style={styles.topNav}>
                                <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
                                <View style={styles.topActions}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                                        <Bell color={palette.ivory} size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton} onPress={onShare}>
                                        <Share2 color={palette.ivory} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : <View style={{ height: 40 }} />}

                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 1000, delay: 300 }}
                            style={styles.affirmationContainer}
                        >
                            <Sparkles color={palette.softGold} size={32} style={{ marginBottom: theme.spacing.xl }} />
                            <MotiText
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: 'timing', duration: 1500, delay: 600 }}
                                style={styles.text}
                            >
                                {current.text}
                            </MotiText>
                            {current.verse && (
                                <MotiText
                                    from={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ type: 'timing', duration: 1000, delay: 1200 }}
                                    style={styles.reference}
                                >
                                    {current.verse}
                                </MotiText>
                            )}
                        </MotiView>

                        {!isWallpaperMode ? (
                            <View style={styles.footer}>
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.blessButton} onPress={handleBless}>
                                        <Heart
                                            color={palette.softGold}
                                            size={24}
                                            fill={palette.softGold}
                                            style={blessed && { transform: [{ scale: 1.2 }] }}
                                        />
                                        <Text style={styles.blessText}>{blessed ? 'Blessed' : 'Bless'}</Text>
                                    </TouchableOpacity>

                                    <View style={styles.divider} />

                                    <TouchableOpacity style={styles.actionIcon} onPress={() => setIsWallpaperMode(true)}>
                                        <ImageIcon color={palette.ivory} size={24} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionIcon} onPress={handleAdvicePress} disabled={loadingAdvice}>
                                        <HandHelping color={palette.ivory} size={24} style={{ opacity: loadingAdvice ? 0.5 : 1 }} />
                                        {canGetAdvice() && <View style={styles.availableIndicator} />}
                                    </TouchableOpacity>
                                </View>
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
                    </Animated.ScrollView>
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

                        <RnScrollView style={styles.adviceScroll}>
                            <Text style={styles.adviceText}>
                                {adviceContent}
                            </Text>

                            {!isSubscribed && (
                                <TouchableOpacity
                                    style={styles.nudgeBox}
                                    onPress={() => {
                                        setShowAdvice(false);
                                        navigation.navigate('Subscription');
                                    }}
                                >
                                    <LinearGradient
                                        colors={[palette.softGold, '#D4AF37']}
                                        style={styles.nudgeGradient}
                                    >
                                        <Sparkles color={palette.ivory} size={20} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.nudgeTitle}>Unlock Daily Guidance</Text>
                                            <Text style={styles.nudgeDesc}>Get personalized spiritual wisdom every single day with Premium.</Text>
                                        </View>
                                        <ChevronRight color={palette.ivory} size={20} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}
                        </RnScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={async () => {
                                const data = await contentAgentService.getDailyPrayerOrQuote(username || 'friend', beliefType || 'Open');
                                setPrayerData(data);
                                setShowAdvice(false);
                                setShowPrayerModal(true);
                            }}
                        >
                            <Text style={styles.closeButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showPrayerModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPrayerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderLeft}>
                                <Sparkles color={palette.softGold} size={20} />
                                <Text style={styles.modalTitle}>{prayerData?.title || 'Daily Wisdom'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowPrayerModal(false)}>
                                <CloseIcon color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <RnScrollView style={styles.adviceScroll}>
                            <Text style={styles.adviceText}>{prayerData?.content}</Text>
                        </RnScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowPrayerModal(false)}
                        >
                            <Text style={styles.closeButtonText}>{prayerData?.buttonLabel || 'Amen'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showLimitModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLimitModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderLeft}>
                                <Sparkles color={palette.softGold} size={20} />
                                <Text style={styles.modalTitle}>Divine Patience</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowLimitModal(false)}>
                                <CloseIcon color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.adviceText}>
                            You&apos;ve received your spiritual guidance for this {isSubscribed ? 'day' : 'week'}.
                            {isSubscribed ? ' Your next insight will be ready tomorrow.' : ' Subscribers unlock personalized daily wisdom.'}
                        </Text>

                        {!isSubscribed ? (
                            <TouchableOpacity
                                style={styles.premiumNudgeButton}
                                onPress={() => {
                                    setShowLimitModal(false);
                                    navigation.navigate('Subscription');
                                }}
                            >
                                <LinearGradient
                                    colors={[palette.softGold, '#D4AF37']}
                                    style={styles.premiumNudgeGradient}
                                >
                                    <Text style={styles.premiumNudgeText}>Upgrade to Daily Advice</Text>
                                    <ChevronRight color={palette.ivory} size={20} />
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : null}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowLimitModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.text },
    background: { flex: 1 },
    content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: theme.spacing.xl },
    topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    topActions: { flexDirection: 'row', gap: theme.spacing.sm },
    date: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.8 },
    iconButton: { padding: theme.spacing.sm },
    affirmationContainer: { alignItems: 'center', marginBottom: theme.spacing.xxl },
    text: {
        fontFamily: theme.typography.serif, fontSize: 38, color: palette.ivory,
        textAlign: 'center', lineHeight: 52, marginBottom: theme.spacing.xl,
        letterSpacing: -0.5
    },
    reference: {
        fontFamily: theme.typography.sansBold, fontSize: 15, color: palette.softGold,
        textTransform: 'uppercase', letterSpacing: 4
    },
    footer: { gap: theme.spacing.xl, marginBottom: 20 },
    actions: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: theme.spacing.md, paddingVertical: 12, borderRadius: theme.borderRadius.full,
        overflow: 'visible'
    },
    blessButton: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md, paddingVertical: 4 },
    blessText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    divider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
    actionIcon: { padding: theme.spacing.xs },
    journalButton: {
        backgroundColor: palette.ivory, height: 60, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10
    },
    journalButtonText: {
        color: theme.colors.text, fontFamily: theme.typography.sansBold, fontSize: 17
    },
    wallpaperActions: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: 20 },
    wallpaperButton: {
        flex: 1, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
    },
    saveButton: { backgroundColor: palette.softGold },
    wallpaperButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 14 },
    saveButtonText: { color: theme.colors.text, fontFamily: theme.typography.sansBold, fontSize: 14 },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl
    },
    modalContent: {
        backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.lg, width: '100%',
        maxHeight: '80%', padding: theme.spacing.xl, overflow: 'hidden'
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
    modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    modalTitle: { fontFamily: theme.typography.serifBold, fontSize: 22, color: theme.colors.text },
    adviceScroll: { marginBottom: theme.spacing.xl },
    adviceText: {
        fontFamily: theme.typography.sans, fontSize: 17, color: theme.colors.text,
        lineHeight: 28, opacity: 0.9, marginBottom: theme.spacing.xl
    },
    nudgeBox: { marginTop: theme.spacing.md, borderRadius: theme.borderRadius.lg, overflow: 'hidden' },
    nudgeGradient: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg, gap: theme.spacing.md },
    nudgeTitle: { fontFamily: theme.typography.sansBold, fontSize: 15, color: palette.ivory },
    nudgeDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: palette.ivory, opacity: 0.9 },
    closeButton: {
        backgroundColor: theme.colors.text, height: 50, borderRadius: 25,
        alignItems: 'center', justifyContent: 'center'
    },
    closeButtonText: { color: theme.colors.background, fontFamily: theme.typography.sansBold, fontSize: 16 },
    availableIndicator: {
        position: 'absolute', top: 0, right: 0, width: 8, height: 8,
        borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1, borderColor: palette.ivory
    },
    premiumNudgeButton: {
        borderRadius: theme.borderRadius.lg, overflow: 'hidden', marginBottom: theme.spacing.xl
    },
    premiumNudgeGradient: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10
    },
    premiumNudgeText: {
        color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16
    }
});
