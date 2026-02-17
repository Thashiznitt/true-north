import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, ChevronDown, Mail, Book } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HelpCenterScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenIndex(openIndex === index ? null : index);
    };

    const FAQS = [
        {
            q: "How do I create a Circle?",
            a: "Go to the Community tab and tap the + button. You can create up to 2 circles on the True North plan, or unlimited on Zenith."
        },
        {
            q: "Is my journal private?",
            a: "Yes. Your personal reflections are encrypted and only visible to you. If you enable Biometrics, they are locked behind FaceID/TouchID."
        },
        {
            q: "How does the daily algorithm work?",
            a: "We analyze your journal entries and selected themes to provide scripture and wisdom that aligns with your current spiritual state."
        },
        {
            q: "Can I change my subscription?",
            a: "Yes, you can upgrade, downgrade, or cancel anytime in the Subscription settings under your Profile."
        }
    ];

    const renderContent = React.useCallback(() => (
        <>
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>How can we guide you?</Text>
                <Text style={styles.heroSubtitle}>Find answers to support your journey.</Text>
            </View>

            <View style={styles.section}>
                {FAQS.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.accordionItem, isOpen && styles.accordionItemOpen]}
                            onPress={() => toggleAccordion(index)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.accordionHeader}>
                                <Text style={[styles.question, isOpen && styles.questionOpen]}>{faq.q}</Text>
                                <ChevronDown
                                    size={20}
                                    color={isOpen ? palette.softGold : theme.colors.secondaryText}
                                    style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                                />
                            </View>
                            {isOpen && (
                                <View style={styles.accordionContent}>
                                    <Text style={styles.answer}>{faq.a}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.supportOptions}>
                <TouchableOpacity style={styles.supportCard}>
                    <Mail size={24} color={palette.softGold} />
                    <Text style={styles.supportText}>Email Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportCard}>
                    <Book size={24} color={palette.softGold} />
                    <Text style={styles.supportText}>User Guide</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.version}>True North v1.0.0 (Build 42)</Text>
        </>
    ), [openIndex, palette.softGold, theme.colors.secondaryText, theme.colors.text]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Guide & FAQ</Text>
                <View style={styles.headerSpacer} />
            </View>

            <TrueNorthFlashList
                data={['content']}
                renderItem={renderContent}
                keyExtractor={(item: string) => item}
                estimatedItemSize={600}
                contentContainerStyle={styles.content}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.lg
    },
    backButton: { width: 40, alignItems: 'flex-start' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    headerSpacer: { width: 40 },
    content: { padding: theme.spacing.xl },
    hero: { marginBottom: theme.spacing.xl, alignItems: 'center' },
    heroTitle: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: 8 },
    heroSubtitle: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText },

    section: { marginBottom: theme.spacing.xxl },
    accordionItem: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border
    },
    accordionItemOpen: { borderColor: palette.softGold },
    accordionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: theme.spacing.lg
    },
    question: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, flex: 1, marginRight: 10 },
    questionOpen: { color: palette.softGold },
    accordionContent: {
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg,
        borderTopWidth: 1, borderTopColor: theme.colors.border
    },
    answer: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 22, marginTop: 10 },

    supportOptions: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl },
    supportCard: {
        flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg, alignItems: 'center', gap: 10,
        borderWidth: 1, borderColor: theme.colors.border
    },
    supportText: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text },
    version: { textAlign: 'center', fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, opacity: 0.5, marginBottom: 40 }
});
