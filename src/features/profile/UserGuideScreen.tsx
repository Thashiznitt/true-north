import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { Search, ChevronLeft, BookOpen, Users, Sparkles, User, Star, ChevronRight, Check } from 'lucide-react-native';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { FadeIn } from '../../components/FadeIn';

interface GuideSection {
    id: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    description: string;
    link?: string;
    content?: string;
}

export const UserGuideScreen = () => {
    const insets = useSafeAreaInsets();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');

    const GUIDES: GuideSection[] = [
        {
            id: 'journal',
            title: 'Sacred Journal',
            icon: BookOpen,
            description: 'Reflect daily with Spiritual Intelligence guidance.',
            link: 'Journal',
            content: "Your private space for spiritual reflection. All entries are encrypted. Premium users receive Spiritual Intelligence-powered spiritual analysis on their entries."
        },
        {
            id: 'circles',
            title: 'Community Circles',
            icon: Users,
            description: 'Join or create faith-based communities.',
            link: 'Circles',
            content: "Connect with others who share your values. Join existing circles or create your own. Circles can be public or private."
        },
        {
            id: 'profile',
            title: 'Your Profile',
            icon: User,
            description: 'Manage your journey and settings.',
            link: 'Profile',
            content: "Track your growth, view your ticket history, and manage your subscription and security settings."
        },
        {
            id: 'subscription',
            title: 'Premium Features',
            icon: Star,
            description: 'Unlock the full power of True North.',
            link: 'Subscription',
            content: "Upgrade to True North or Zenith tiers to unlock unlimited circles, advanced Spiritual Intelligence insights, and more."
        },
        {
            id: 'events',
            title: 'Sacred Events',
            icon: Sparkles,
            description: 'Create and manage sanctuary gatherings.',
            content: "Community leaders can create events with ticketing. Admins can edit or delete events, and members are notified of updates automatically."
        },
        {
            id: 'validation',
            title: 'Ticket Validation',
            icon: Check,
            description: 'Designate validators to scan tickets.',
            content: "Organizers and designated Validators can scan ticket QR codes to welcome seekers. Validated tickets automatically disappear from the seeker's profile."
        }
    ];

    const TIER_FEATURES = [
        { feature: "Daily Affirmations", free: true, paid: true },
        { feature: "Basic Journaling", free: true, paid: true },
        { feature: "Community Access", free: true, paid: true },
        { feature: "Spiritual Intelligence Analysis", free: false, paid: true },
        { feature: "Unlimited Circles", free: false, paid: true },
        { feature: "Advanced Security", free: false, paid: true },
        { feature: "Priority Support", free: false, paid: true },
    ];

    const filteredGuides = GUIDES.filter(g =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderGuideItem = ({ item, index }: { item: GuideSection, index: number }) => (
        <FadeIn delay={index * 100} from="bottom">
            <TouchableOpacity
                style={styles.guideCard}
                onPress={() => item.link ? navigation.navigate(item.link) : null}
            >
                <View style={styles.iconContainer}>
                    <item.icon size={24} color={palette.softGold} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                    {item.content && <Text style={styles.cardDetail}>{item.content}</Text>}
                </View>
                {item.link && <ChevronRight size={20} color={theme.colors.border} />}
            </TouchableOpacity>
        </FadeIn>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.searchBox}>
                <Search size={20} color={theme.colors.secondaryText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search guides..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {!searchQuery && (
                <View style={styles.tierSection}>
                    <Text style={styles.sectionTitle}>Free vs. Premium</Text>
                    <View style={styles.tierTable}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.colFeature, styles.headerText]}>Feature</Text>
                            <Text style={[styles.colFree, styles.headerText]}>Free</Text>
                            <Text style={[styles.colPaid, styles.headerText]}>Paid</Text>
                        </View>
                        {TIER_FEATURES.map((row, i) => (
                            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.rowAlt]}>
                                <Text style={styles.colFeature}>{row.feature}</Text>
                                <View style={styles.colFree}>
                                    {row.free ? <Sparkles size={14} color={palette.softGold} /> : <Text style={styles.dash}>-</Text>}
                                </View>
                                <View style={styles.colPaid}>
                                    {row.paid ? <Sparkles size={14} color={palette.success} /> : <Text style={styles.dash}>-</Text>}
                                </View>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={styles.upgradeButton}
                        onPress={() => navigation.navigate('Subscription')}
                    >
                        <Text style={styles.upgradeText}>View Upgrade Options</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl, marginBottom: theme.spacing.md }]}>
                {searchQuery ? 'Search Results' : 'Explore Features'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Guide</Text>
                <View style={{ width: 40 }} />
            </View>

            <TrueNorthFlashList
                data={filteredGuides}
                renderItem={renderGuideItem}
                keyExtractor={(item) => item.id}
                estimatedItemSize={120}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
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
    listContent: { padding: theme.spacing.xl, paddingBottom: 100 },
    headerContainer: { marginBottom: theme.spacing.md },
    searchBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg, paddingHorizontal: theme.spacing.md, height: 50,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.xl
    },
    searchInput: {
        flex: 1, marginLeft: theme.spacing.sm, fontFamily: theme.typography.sans,
        fontSize: 16, color: theme.colors.text
    },
    sectionTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text, marginBottom: theme.spacing.md },
    guideCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border
    },
    iconContainer: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md
    },
    cardContent: { flex: 1, marginRight: theme.spacing.sm },
    cardTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 4 },
    cardDescription: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText },
    cardDetail: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: 4, opacity: 0.8 },
    tierSection: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border },
    tierTable: { marginTop: theme.spacing.sm },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 8, marginBottom: 8 },
    tableRow: { flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
    rowAlt: { backgroundColor: 'rgba(255,255,255,0.03)' },
    headerText: { fontFamily: theme.typography.sansBold, fontSize: 12, color: theme.colors.secondaryText, textTransform: 'uppercase' },
    colFeature: { flex: 2, fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.text },
    colFree: { flex: 1, alignItems: 'center' },
    colPaid: { flex: 1, alignItems: 'center' },
    dash: { fontFamily: theme.typography.sans, color: theme.colors.secondaryText },
    upgradeButton: {
        marginTop: theme.spacing.lg, backgroundColor: palette.softGold,
        paddingVertical: 12, borderRadius: 20, alignItems: 'center'
    },
    upgradeText: { fontFamily: theme.typography.sansBold, fontSize: 14, color: palette.ivory }
});
