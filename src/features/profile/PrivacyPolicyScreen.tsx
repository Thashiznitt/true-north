import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Shield } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';

const renderItem = () => null;
const keyExtractor = () => 'dummy';

export const PrivacyPolicyScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Data Stewardship</Text>
                <View style={styles.headerSpacer} />
            </View>

            <TrueNorthFlashList
                data={[]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                estimatedItemSize={600}
                contentContainerStyle={{ paddingHorizontal: theme.spacing.xl, paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.introSection}>
                            <Shield size={40} color={palette.softGold} style={styles.icon} />
                            <Text style={styles.subtitle}>Privacy Policy</Text>
                            <Text style={styles.lastUpdated}>Last Reviewed: February 2026</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Our Commitment</Text>
                            <Text style={styles.text}>
                                At True North, we believe your spiritual journey is sacred. We are committed to protecting your privacy and ensuring that your reflections remain your own.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
                            <Text style={styles.text}>
                                • <Text style={styles.bold}>Account Data</Text>: Email and name when you sign up.{"\n"}
                                • <Text style={styles.bold}>Reflections</Text>: Your journal entries are encrypted and used only to provide Spiritual Intelligence guidance at your request.{"\n"}
                                • <Text style={styles.bold}>Preferences</Text>: Your selected belief system and themes to personalize your experience.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. Spiritual Intelligence & Spiritual Analysis</Text>
                            <Text style={styles.text}>
                                When you use the Spiritual Intelligence Spiritual Analysis feature, your journal entry is processed by our secure spiritual intelligence partner (Google Gemini) to generate guidance. This data is not used for training models or shared for advertising.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Data Deletion</Text>
                            <Text style={styles.text}>
                                You have the right to delete your account and all associated data at any time through the Privacy & Security settings in your profile.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
                            <Text style={styles.text}>
                                We use Supabase for secure data storage and RevenueCat for managing premium subscriptions. These partners adhere to strict privacy standards.
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Your trust is our foundation.
                            </Text>
                        </View>
                    </>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        height: 60,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerSpacer: { width: 40 },
    title: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    introSection: { alignItems: 'center', marginVertical: theme.spacing.xxl },
    icon: { marginBottom: theme.spacing.md },
    subtitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginBottom: 4 },
    lastUpdated: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, opacity: 0.7 },
    section: { marginBottom: theme.spacing.xxl },
    sectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.softGold, marginBottom: theme.spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
    text: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, lineHeight: 26, opacity: 0.8 },
    bold: { fontFamily: theme.typography.sansBold },
    footer: { marginTop: theme.spacing.xxl, alignItems: 'center', paddingVertical: theme.spacing.xl },
    footerText: { fontFamily: theme.typography.serif, fontStyle: 'italic', fontSize: 16, color: theme.colors.secondaryText }
});
