/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Check, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';

const ALL_THEMES = [
    { title: 'Strength', description: 'Finding inner power and resilience.' },
    { title: 'Love', description: 'Cultivating compassion and connection.' },
    { title: 'Wisdom', description: 'Seeking clarity and understanding.' },
    { title: 'Peace', description: 'Nurturing tranquility and stillness.' },
    { title: 'Purpose', description: 'Aligning with your core values.' },
    { title: 'Gratitude', description: 'Focusing on blessings and abundance.' },
];

export const ThemeSettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { themes, setThemes } = useStore();
    const [selectedThemes, setSelectedThemes] = useState<string[]>(themes);

    const toggleTheme = (title: string) => {
        if (selectedThemes.includes(title)) {
            setSelectedThemes(selectedThemes.filter(t => t !== title));
        } else {
            if (selectedThemes.length >= 3) {
                Alert.alert("Sacred Focus", "We recommend focusing on no more than 3 themes at a time to maintain clarity.");
                return;
            }
            setSelectedThemes([...selectedThemes, title]);
        }
    };

    const handleSave = () => {
        setThemes(selectedThemes);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Focus Themes</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.introBox}>
                    <Sparkles size={24} color={palette.softGold} />
                    <Text style={styles.introText}>
                        Select the themes that resonate most with your current journey. We'll tailor your daily affirmations and reflections based on these focus areas.
                    </Text>
                </View>

                {ALL_THEMES.map((item) => (
                    <TouchableOpacity
                        key={item.title}
                        style={[styles.themeCard, selectedThemes.includes(item.title) && styles.themeCardActive]}
                        onPress={() => toggleTheme(item.title)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.themeInfo}>
                            <Text style={[styles.themeTitle, selectedThemes.includes(item.title) && styles.themeTitleActive]}>{item.title}</Text>
                            <Text style={styles.themeDesc}>{item.description}</Text>
                        </View>
                        {selectedThemes.includes(item.title) && (
                            <View style={styles.checkContainer}>
                                <Check size={20} color={palette.ivory} />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    saveText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.softGold },
    content: { padding: theme.spacing.xl },
    introBox: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.xxl,
        borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', gap: theme.spacing.md, alignItems: 'center'
    },
    introText: { flex: 1, fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 20 },
    themeCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border
    },
    themeCardActive: { borderColor: palette.softGold, backgroundColor: '#FFFDF9' },
    themeInfo: { flex: 1, marginRight: theme.spacing.md },
    themeTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text, marginBottom: 4 },
    themeTitleActive: { color: palette.softGold },
    themeDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    checkContainer: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center'
    }
});
