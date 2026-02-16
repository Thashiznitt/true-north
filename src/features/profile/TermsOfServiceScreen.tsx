import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Scale } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';

const renderItem = () => null;
const keyExtractor = () => 'dummy';

export const TermsOfServiceScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Covenant of Community</Text>
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
                            <Scale size={40} color={palette.softGold} style={styles.icon} />
                            <Text style={styles.subtitle}>Our Terms of Service</Text>
                            <Text style={styles.lastUpdated}>Last Cleansing: February 2026</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. The Sacred Trust</Text>
                            <Text style={styles.text}>
                                By entering True North, you agree to uphold a standard of grace, respect, and spiritual integrity. This is a sanctuary for growth, not a platform for judgment or commercial exploitation.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Divine Privacy</Text>
                            <Text style={styles.text}>
                                Your reflections are yours alone. While our system provides guidance to help you connect with your spiritual path, your data is encrypted and guarded with the highest level of digital and ethical security.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. Community Governance</Text>
                            <Text style={styles.text}>
                                True North communities (Circles) are governed by their creators. By joining a Circle, you agree to respect the specific guidelines set forth by its leadership.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. Premium Sanctuary Access</Text>
                            <Text style={styles.text}>
                                Subscription grants access to unlimited reflections, community creation, and location-based sanctuary finding. These features are provided to enhance your spiritual journey.
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Walk in peace, and may your journey be ever guided by the North Star.
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
    footer: { marginTop: theme.spacing.xxl, alignItems: 'center', paddingVertical: theme.spacing.xl },
    footerText: { fontFamily: theme.typography.serif, fontStyle: 'italic', fontSize: 16, color: theme.colors.secondaryText, textAlign: 'center', lineHeight: 24 }
});
