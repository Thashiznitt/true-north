import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { theme, palette } from '../theme';
import { X, Share2, Sparkles } from 'lucide-react-native';
import { DailyRitualService } from '../services/DailyRitualService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const DailyWisdomModal = () => {
    const [visible, setVisible] = useState(false);
    const [affirmation, setAffirmation] = useState<{ text: string, author: string } | null>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        checkDailyWisdom();
    }, []);

    const checkDailyWisdom = async () => {
        const shouldShow = await DailyRitualService.shouldShowMorningWisdom();
        if (shouldShow) {
            const dailyAffirmation = DailyRitualService.getDailyAffirmation();
            setAffirmation(dailyAffirmation);
            // Slight delay to allow app to load
            setTimeout(() => setVisible(true), 1500);
        }
    };

    const handleClose = async () => {
        await DailyRitualService.markMorningWisdomShown();
        setVisible(false);
    };

    if (!affirmation) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?q=80&w=2000&auto=format&fit=crop' }}
                    style={StyleSheet.absoluteFill}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
                        <View style={styles.iconContainer}>
                            <Sparkles size={40} color={palette.softGold} />
                        </View>

                        <Text style={styles.title}>Daily Wisdom</Text>

                        <View style={styles.card}>
                            <Text style={styles.affirmationText}>&quot;{affirmation.text}&quot;</Text>
                            <Text style={styles.author}>- {affirmation.author}</Text>
                        </View>

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity style={styles.button} onPress={handleClose}>
                            <Text style={styles.buttonText}>Receive & Begin</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: theme.spacing.xl },
    iconContainer: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    title: { fontFamily: theme.typography.serifBold, fontSize: 32, color: palette.ivory, marginBottom: 40, textAlign: 'center' },
    card: {
        width: '100%', backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 30, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center'
    },
    affirmationText: {
        fontFamily: theme.typography.serifBold, fontSize: 24, color: palette.ivory,
        textAlign: 'center', lineHeight: 36, marginBottom: 20
    },
    author: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: palette.softGold, letterSpacing: 1, textTransform: 'uppercase' },
    button: {
        width: '100%', backgroundColor: palette.softGold, paddingVertical: 20, borderRadius: 30,
        alignItems: 'center', shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 10
    },
    buttonText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: palette.ivory, letterSpacing: 0.5 }
});
