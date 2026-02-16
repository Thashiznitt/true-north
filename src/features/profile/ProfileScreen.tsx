/* eslint-disable truenorth-performance/no-scrollview */
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { OptimizedImage } from '../../components/performance/OptimizedImage';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { useStore } from '../../store';
import { User, Settings, BookOpen, Crown, ChevronRight, LogOut, Bell, CreditCard, Shield, Sparkles, Camera, Heart, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { username, beliefType, isSubscribed, themes, dailyGoals, profilePicture } = useStore();
    const { setLoggedIn, setProfilePicture } = useStore();

    const handleLogout = () => {
        setLoggedIn(false);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfilePicture(result.assets[0].uri);
        }
    };

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionCard}>
                {children}
            </View>
        </View>
    );

    const MenuItem = ({ icon: Icon, label, value, onPress, isLast = false, color = theme.colors.text }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
            onPress={onPress}
        >
            <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: palette.softGold + '15' }]}>
                    <Icon size={20} color={palette.softGold} />
                </View>
                <Text style={[styles.menuLabel, { color }]}>{label}</Text>
            </View>
            <View style={styles.menuItemRight}>
                {value && <Text style={styles.menuValue}>{value}</Text>}
                <ChevronRight size={18} color={theme.colors.border} />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
                    <View style={styles.avatarContainer}>
                        {profilePicture ? (
                            <OptimizedImage source={{ uri: profilePicture }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{username ? username[0].toUpperCase() : 'U'}</Text>
                        )}
                        {isSubscribed && (
                            <View style={styles.premiumBadge}>
                                <Sparkles size={12} color={palette.ivory} />
                            </View>
                        )}
                    </View>
                    <View style={styles.cameraIconContainer}>
                        <Camera size={14} color={palette.ivory} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.username}>{username || 'Sacred Searcher'}</Text>
                <View style={styles.beliefChip}>
                    <Text style={styles.beliefText}>{beliefType || 'Exploring'}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Heart size={20} color={palette.softGold} fill={palette.softGold} />
                    <Text style={styles.statNumber}>124</Text>
                    <Text style={styles.statLabel}>Blessings</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <BookOpen size={20} color={palette.softGold} />
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Reflections</Text>
                </View>
            </View>

            <Section title="My Journey">
                {(__DEV__ || username === 'Superadmin' || (useStore.getState().email === 'remyngatia@gmail.com' || useStore.getState().email === 'remy_shiznitt@hotmail.com')) && (
                    <MenuItem
                        icon={Shield}
                        label="Superadmin Portal"
                        onPress={() => {
                            console.log('Navigating to SuperAdmin');
                            navigation.navigate('SuperAdmin');
                        }}
                    />
                )}
                <MenuItem
                    icon={ShieldCheck}
                    label="Belief System"
                    value={beliefType}
                    onPress={() => {
                        try {
                            console.log('Navigating to BeliefSettings');
                            navigation.navigate('BeliefSettings');
                        } catch (e) {
                            console.error('Navigation Error:', e);
                        }
                    }}
                />
                <MenuItem
                    icon={Sparkles}
                    label="Focus Themes"
                    value={themes.join(', ')}
                    onPress={() => {
                        try {
                            console.log('Navigating to ThemeSettings');
                            navigation.navigate('ThemeSettings');
                        } catch (e) {
                            console.error('Navigation Error:', e);
                        }
                    }}
                />
                <MenuItem
                    icon={BookOpen}
                    label="Daily Goals"
                    onPress={() => {
                        console.log('Navigating to GoalSettings');
                        navigation.navigate('GoalSettings');
                    }}
                    isLast
                />
            </Section>

            <Section title="Sanctuary Settings">
                <MenuItem
                    icon={Bell}
                    label="Notifications"
                    value="7:30 AM"
                    onPress={() => {
                        console.log('Navigating to Notifications');
                        navigation.navigate('Notifications');
                    }}
                />
                <MenuItem
                    icon={CreditCard}
                    label="Subscription"
                    value={isSubscribed ? 'Premium' : 'Free'}
                    onPress={() => {
                        console.log('Navigating to Subscription');
                        navigation.navigate('Subscription');
                    }}
                    isLast
                />
            </Section>

            <Section title="Account">
                <MenuItem
                    icon={LogOut}
                    label="Sign Out"
                    onPress={handleLogout}
                    color={palette.softGold}
                />
                {__DEV__ && (
                    <MenuItem
                        icon={ShieldCheck}
                        label="Reset Onboarding (Dev)"
                        onPress={() => {
                            useStore.getState().setOnboarded(false);
                            Alert.alert("Reset", "Onboarding reset. proper restart required.");
                        }}
                        color="red"
                        isLast
                    />
                )}
            </Section>

            <Text style={styles.versionText}>True North v1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { alignItems: 'center', marginBottom: theme.spacing.xxl },
    avatarWrapper: { position: 'relative', marginBottom: theme.spacing.md },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, overflow: 'hidden'
    },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { fontFamily: theme.typography.serifBold, fontSize: 40, color: theme.colors.text },
    cameraIconContainer: {
        position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14,
        backgroundColor: theme.colors.text, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: theme.colors.background
    },
    premiumBadge: {
        position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderRadius: 12,
        backgroundColor: palette.softGold, alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: theme.colors.background, zIndex: 1
    },
    username: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: theme.spacing.xs },
    beliefChip: {
        backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 6,
        borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border
    },
    beliefText: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 1 },
    statsRow: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        marginHorizontal: theme.spacing.xl, marginBottom: theme.spacing.xxl,
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border
    },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text, marginTop: 4 },
    statLabel: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    statDivider: { width: 1, height: 40, backgroundColor: theme.colors.border },
    section: { marginBottom: theme.spacing.xl, paddingHorizontal: theme.spacing.xl },
    sectionTitle: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText,
        textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: theme.spacing.md, marginLeft: 4
    },
    sectionCard: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden'
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 },
    iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { fontFamily: theme.typography.sansMedium, fontSize: 16, flexShrink: 1 },
    menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginLeft: theme.spacing.md },
    menuValue: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, flexShrink: 1 },
    versionText: {
        textAlign: 'center', fontFamily: theme.typography.sans, fontSize: 12,
        color: theme.colors.secondaryText, marginTop: theme.spacing.xl, opacity: 0.5
    }
});
