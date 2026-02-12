import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Check, Sparkles, ShieldCheck, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const SubscriptionScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sanctuary Premium</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <ImageBackground
                    source={{ uri: 'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.heroImage}
                    borderRadius={20}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.heroGradient}
                    >
                        <View style={styles.heroContent}>
                            <Sparkles size={32} color={palette.softGold} />
                            <Text style={styles.heroTitle}>Unlock Full Potential</Text>
                            <Text style={styles.heroSub}>Experience True North without limits.</Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                <View style={styles.benefits}>
                    <BenefitItem icon={ShieldCheck} title="Complete Privacy" desc="Advanced security for your personal reflections." />
                    <BenefitItem icon={Heart} title="Unlimited Circles" desc="Create and join as many sacred spaces as you wish." />
                    <BenefitItem icon={Sparkles} title="Deep Reflections" desc="Personalized weekly assessments of your journey." />
                </View>

                <View style={styles.plans}>
                    <TouchableOpacity style={styles.planCardActive}>
                        <View style={styles.planHeader}>
                            <Text style={styles.planName}>Sacred Annual</Text>
                            <View style={styles.saveBadge}><Text style={styles.saveBadgeText}>SAVE 30%</Text></View>
                        </View>
                        <Text style={styles.planPrice}>$49.99 / year</Text>
                        <Text style={styles.planNote}>That's just $4.16 per month</Text>
                        <View style={styles.planSelect}>
                            <Check size={20} color={palette.ivory} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.planCard}>
                        <Text style={styles.planName}>Monthly Journey</Text>
                        <Text style={styles.planPrice}>$5.99 / month</Text>
                        <Text style={styles.planNote}>Cancel anytime</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>Start 7-Day Free Trial</Text>
                </TouchableOpacity>
                <Text style={styles.footerNote}>Secured and encrypted by App Store</Text>
            </ScrollView>
        </View>
    );
};

const BenefitItem = ({ icon: Icon, title, desc }: any) => (
    <View style={styles.benefitItem}>
        <View style={styles.benefitIcon}>
            <Icon size={20} color={palette.softGold} />
        </View>
        <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>{title}</Text>
            <Text style={styles.benefitDesc}>{desc}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    content: { padding: theme.spacing.xl, paddingBottom: 60 },
    heroImage: { height: 200, marginBottom: theme.spacing.xxl, overflow: 'hidden' },
    heroGradient: { flex: 1, justifyContent: 'flex-end', padding: theme.spacing.xl },
    heroContent: { alignItems: 'center' },
    heroTitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: palette.ivory, marginBottom: 4 },
    heroSub: { fontFamily: theme.typography.sans, fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    benefits: { marginBottom: theme.spacing.xxl },
    benefitItem: { flexDirection: 'row', gap: theme.spacing.lg, marginBottom: theme.spacing.xl },
    benefitIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
    benefitText: { flex: 1 },
    benefitTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    benefitDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    plans: { gap: theme.spacing.md, marginBottom: theme.spacing.xxl },
    planCard: {
        padding: theme.spacing.xl, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.surface,
        borderWidth: 1, borderColor: theme.colors.border
    },
    planCardActive: {
        padding: theme.spacing.xl, borderRadius: theme.borderRadius.lg, backgroundColor: '#FFFDF9',
        borderWidth: 2, borderColor: palette.softGold
    },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    planName: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text },
    saveBadge: { backgroundColor: palette.softGold, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    saveBadgeText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 10 },
    planPrice: { fontFamily: theme.typography.sansBold, fontSize: 20, color: theme.colors.text, marginBottom: 4 },
    planNote: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    planSelect: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: palette.softGold, alignItems: 'center', justifyContent: 'center' },
    ctaButton: {
        backgroundColor: theme.colors.text, height: 60, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg
    },
    ctaButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 18 },
    footerNote: { textAlign: 'center', fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText }
});
