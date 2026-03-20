/* eslint-disable truenorth-performance/no-scrollview */
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, AnimatePresence } from 'moti';
import { useStore } from '../../store';
import {
    Sparkles,
    BookOpen,
    Users,
    User,
    ChevronRight,
    ArrowRight,
    Image as ImageIcon,
    Copy,
    MessageSquare,
    Compass,
    Target,
    Layers,
    CreditCard,
    X
} from 'lucide-react-native';
import { theme, palette } from '../../theme';

const { width, height } = Dimensions.get('window');

interface WalkthroughSlide {
    id: string;
    title: string;
    description: string;
    icon: any;
    colors: [string, string, string];
    features: Array<{ icon: any, label: string }>;
}

const SLIDES: WalkthroughSlide[] = [
    {
        id: 'affirmations',
        title: 'Sacred Affirmations',
        description: 'Begin each day with divine alignment and spiritual strength.',
        icon: Sparkles,
        colors: ['#1a2a6c', '#b21f1f', '#fdbb2d'], // Deep space to sunset
        features: [
            { icon: ImageIcon, label: 'Save as Sacred Wallpaper' },
            { icon: Copy, label: 'Share with your Community' },
            { icon: MessageSquare, label: 'Get Spiritual Advice' },
            { icon: BookOpen, label: 'Access the User Guide' },
        ]
    },
    {
        id: 'nur',
        title: 'Meet Nur',
        description: 'Your intelligent spiritual companion for deep reflection.',
        icon: Compass,
        colors: ['#0f0c29', '#302b63', '#24243e'], // Midnight indigo
        features: [
            { icon: MessageSquare, label: 'Personalized AI Guidance' },
            { icon: Sparkles, label: 'Daily Reality Checks' },
            { icon: Target, label: 'Goal Realization Support' },
            { icon: Layers, label: 'Spiritual Alignment Analysis' },
        ]
    },
    {
        id: 'circles',
        title: 'Community Circles',
        description: 'Connect with fellow seekers and grow together.',
        icon: Users,
        colors: ['#134E5E', '#71B280', '#134E5E'], // Forest green / Teal
        features: [
            { icon: BookOpen, label: 'Share Daily Reflections' },
            { icon: User, label: 'Explore Seeker Profiles' },
            { icon: Users, label: 'Join or Create Sacred Circles' },
            { icon: Sparkles, label: 'Community Gatherings' },
        ]
    },
    {
        id: 'profile',
        title: 'Your Infinite Journey',
        description: 'Track your growth and customize your spiritual space.',
        icon: User,
        colors: ['#42275a', '#734b6d', '#42275a'], // Royal purple
        features: [
            { icon: Target, label: 'Set & Track Life Goals' },
            { icon: Layers, label: 'Curate Spiritual Themes' },
            { icon: CreditCard, label: 'Manage Your Subscription' },
            { icon: ImageIcon, label: 'Customize Your Presence' },
        ]
    }
];

export const NewUserWalkthroughScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const beliefType = useStore((state) => state.beliefType);
    const sanctuaryName = ['Catholic', 'Christian', 'Protestant'].includes(beliefType || '') ? 'Sanctuary' : 'Sacred Space';

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / width);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const nextSlide = () => {
        if (activeIndex < SLIDES.length - 1) {
            scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                {SLIDES.map((slide, index) => (
                    <View key={slide.id} style={[styles.slide, { width }, activeIndex !== index && { opacity: 0 }]}>
                        <LinearGradient
                            colors={slide.colors}
                            style={StyleSheet.absoluteFill}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.overlay} />

                        <ScrollView
                            style={styles.slideScroll}
                            contentContainerStyle={[styles.slideContent, { paddingTop: insets.top + 60, paddingBottom: 180 }]}
                            showsVerticalScrollIndicator={false}
                        >
                            <MotiView
                                from={{ opacity: 0, scale: 0.5, translateY: -20 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                transition={{ type: 'timing', duration: 1000, delay: 200 }}
                                key={`icon-${slide.id}-${activeIndex === index}`}
                                style={styles.iconContainer}
                            >
                                <slide.icon size={60} color={palette.softGold} strokeWidth={1.5} />
                            </MotiView>

                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: 'timing', duration: 800, delay: 400 }}
                                key={`title-${slide.id}-${activeIndex === index}`}
                            >
                                <Text style={styles.title}>{slide.title}</Text>
                                <Text style={styles.description}>{slide.description}</Text>
                            </MotiView>

                            <View style={styles.featuresGrid}>
                                {slide.features.map((feature, fIndex) => (
                                    <MotiView
                                        key={`${slide.id}-f-${fIndex}`}
                                        from={{ opacity: 0, translateX: -20 }}
                                        animate={{ opacity: activeIndex === index ? 1 : 0, translateX: activeIndex === index ? 0 : -20 }}
                                        transition={{ type: 'timing', duration: 600, delay: 600 + (fIndex * 150) }}
                                        style={styles.featureItem}
                                    >
                                        <View style={styles.featureIconContainer}>
                                            <feature.icon size={20} color={palette.softGold} />
                                        </View>
                                        <Text style={styles.featureLabel}>{feature.label}</Text>
                                    </MotiView>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>

            <View style={[styles.footer, { bottom: insets.bottom + 15 }]}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                activeIndex === i && styles.dotActive
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={nextSlide}
                >
                    <Text style={styles.nextButtonText}>
                        {activeIndex === SLIDES.length - 1 ? `Enter ${sanctuaryName}` : 'Next'}
                    </Text>
                    <ArrowRight size={20} color={palette.charcoal} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.closeButton, { top: insets.top + 10 }]}
                onPress={() => navigation.goBack()}
            >
                <X size={24} color={palette.ivory} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    slide: { flex: 1, overflow: 'hidden' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    slideScroll: { flex: 1 },
    slideContent: { alignItems: 'center', paddingHorizontal: 40 },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    title: {
        fontFamily: theme.typography.serifBold,
        fontSize: 32,
        color: palette.ivory,
        textAlign: 'center',
        marginBottom: 16
    },
    description: {
        fontFamily: theme.typography.sans,
        fontSize: 18,
        color: palette.ivory,
        textAlign: 'center',
        lineHeight: 26,
        opacity: 0.9,
        marginBottom: 48
    },
    featuresGrid: {
        width: '100%',
        gap: 20
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    featureIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16
    },
    featureLabel: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 16,
        color: palette.ivory
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 40
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    dotActive: {
        width: 24,
        backgroundColor: palette.softGold
    },
    nextButton: {
        backgroundColor: palette.softGold,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: '100%',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    nextButtonText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 18,
        color: palette.charcoal
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    }
});
