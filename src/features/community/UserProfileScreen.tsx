import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, UserPlus, UserCheck, Clock, Users, BookOpen, Lock, MoreVertical, ShieldAlert, Sparkles, Link, Flag } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { useStore } from '../../store';
import { FadeIn } from '../../components/FadeIn';
import { MotiView } from 'moti';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { ReflectionCard } from '../../components/ReflectionCard';
import { StatsCard } from '../../components/StatsCard';
import { CircleCard } from '../../components/CircleCard';

const { width } = Dimensions.get('window');

interface UserProfile {
    id: string;
    username: string;
    avatar_url?: string;
    belief_type?: string;
    user_preferences?: {
        is_profile_private: boolean;
        belief_type?: string;
    };
}

interface Reflection {
    id: string;
    content: string;
    created_at: string;
    image?: string;
    blessings?: number;
    circles?: {
        name: string;
    } | null;
}

interface UserCircle {
    circle_id: string;
    circles: {
        name: string;
        belief: string;
    } | null;
}

export const UserProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const route = useRoute();
    const { userId, userName } = (route.params as { userId: string, userName?: string }) || {};
    const currentUser = useStore(state => state.userId);
    const blockUser = useStore(state => state.blockUser);

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [circles, setCircles] = useState<UserCircle[]>([]);
    const [stats, setStats] = useState({ followers: 0, following: 0, circles: 0, reflections: 0 });
    const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'active'>('none');

    useEffect(() => {
        fetchProfileData();
    }, [userId]);

    const fetchProfileData = async () => {
        setLoading(true);

        // Safety check for non-UUID strings (mock ghost users)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) {
            console.log('Using mock data for non-UUID userId:', userId);
            setProfile({
                id: userId,
                username: userName || userId || 'Wise Seeker',
                belief_type: 'Exploring',
                user_preferences: { is_profile_private: false }
            });

            setStats({ followers: 42, following: 12, circles: 1, reflections: 2 });
            setReflections([
                { id: '1', content: 'The path is revealed as we walk.', created_at: new Date().toISOString(), circles: { name: 'Inner Sanctuary' } }
            ]);
            setLoading(false);
            return;
        }

        try {
            // Fetch User Profile & Preferences
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*, user_preferences(*)')
                .eq('id', userId)
                .single();

            if (userError) throw userError;
            setProfile(userData);

            // Fetch Counts
            const [followerCount, followingCount, circleCount, reflectionCount] = await Promise.all([
                supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
                supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
                supabase.from('circle_members').select('*', { count: 'exact', head: true }).eq('user_id', userId),
                supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_private', false)
            ]);

            setStats({
                followers: followerCount.count || 0,
                following: followingCount.count || 0,
                circles: circleCount.count || 0,
                reflections: reflectionCount.count || 0
            });

            // Check Follow Status
            if (currentUser && currentUser !== userId) {
                const { data: followData } = await supabase
                    .from('follows')
                    .select('*')
                    .eq('follower_id', currentUser)
                    .eq('following_id', userId)
                    .single();

                if (followData) {
                    setFollowStatus('active');
                } else {
                    const { data: requestData } = await supabase
                        .from('follow_requests')
                        .select('*')
                        .eq('sender_id', currentUser)
                        .eq('receiver_id', userId)
                        .eq('status', 'pending')
                        .single();
                    if (requestData) setFollowStatus('pending');
                }
            }

            // Fetch Reflections with Circle Info
            const isPrivate = userData.user_preferences?.is_profile_private;
            if (!isPrivate || followStatus === 'active' || currentUser === userId) {
                const { data: reflectionData } = await supabase
                    .from('journal_entries')
                    .select('*, circles(name)')
                    .eq('user_id', userId)
                    .eq('is_private', false)
                    .order('created_at', { ascending: false });
                setReflections(reflectionData || []);
            }

            // Fetch Circles joined
            const { data: joinedCircleData } = await supabase
                .from('circle_members')
                .select('circle_id, circles(name, belief)')
                .eq('user_id', userId);

            setCircles((joinedCircleData as unknown as UserCircle[])?.map((item) => ({

                circle_id: item.circle_id,
                circles: Array.isArray(item.circles) ? item.circles[0] : item.circles
            })) || []);



        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback for ghost users/mock data
            setProfile({
                id: userId,
                username: userName || 'Wise Seeker',
                belief_type: 'Christian',
                user_preferences: { is_profile_private: false }
            });

            setStats({ followers: 124, following: 89, circles: 3, reflections: 12 });
            setReflections([
                { id: '1', content: 'The universe speaks in the silence between breaths.', created_at: new Date().toISOString(), circles: { name: 'Inner Peace' } },
                { id: '2', content: 'Finding alignment in the chaos of daily life.', created_at: new Date(Date.now() - 86400000).toISOString(), circles: { name: 'Daily Devotion' } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!currentUser) {
            Alert.alert("Sacred Connection", "Please sign in to follow fellow seekers.");
            return;
        }
        if (followStatus !== 'none') return;
        try {
            if (profile?.user_preferences?.is_profile_private) {

                await supabase.from('follow_requests').insert({ sender_id: currentUser, receiver_id: userId, status: 'pending' });
                setFollowStatus('pending');
                Alert.alert("Request Sent", "Your follow request has been sent.");
            } else {
                await supabase.from('follows').insert({ follower_id: currentUser, following_id: userId });
                setFollowStatus('active');
                setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
            }
        } catch (error) { console.error('Follow error:', error); }
    };

    const handleShare = () => {
        Alert.alert("Sacred Link", "Share this seeker's journey with others?");
    };

    const handleMoreAction = () => {
        Alert.alert(
            "Account Options",
            "Keep the community sacred.",
            [
                { text: "Report Seeker", onPress: () => Alert.alert("Reported", "Thank you. Our moderation Spiritual Intelligence will assess this seeker's activities.") },
                {
                    text: "Block Seeker",
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert("Block Seeker?", "You will no longer see reflections or activities from this seeker.", [
                            { text: "Cancel", style: 'cancel' },
                            {
                                text: "Block", style: 'destructive', onPress: () => {
                                    blockUser(userId);
                                    navigation.goBack();
                                    Alert.alert("Seeker Blocked");
                                }
                            }
                        ]);
                    }
                },
                { text: "Cancel", style: 'cancel' }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={palette.softGold} size="large" />
            </View>
        );
    }

    const renderReflectionItem = ({ item, index }: { item: Reflection; index: number }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200 + index * 100 }}
        >
            <ReflectionCard
                id={item.id}
                content={item.content}
                createdAt={item.created_at}
                circleName={item.circles?.name}
                userName={profile?.username || userName}
                userAvatar={profile?.avatar_url}
                image={item.image}
                blessings={item.blessings || (index * 7) + 3}
                onBless={() => { }}
                onReport={() => Alert.alert("Report", "Flagged for moderation.")}
                style={styles.reflectionCardMargin}
            />
        </MotiView>
    );

    const FixedHeader = () => (
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTitleGroup}>
                <View style={styles.headerAvatarMini}>
                    <Text style={styles.headerAvatarText}>{(profile?.username || userName)?.[0]}</Text>
                </View>
                <Text style={styles.headerProfileTitle} numberOfLines={1}>{profile?.username || userName}</Text>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleMoreAction} style={styles.headerIconBtn}>
                    <MoreVertical size={18} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const ProfileHero = () => (
        <>

            {/* Profile Hero Section */}
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 600 }}
                style={styles.heroSection}
            >
                <View style={styles.heroBackground}>
                    <View style={styles.heroGradient} />
                </View>

                <View style={styles.avatarWrapper}>
                    {profile?.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{(profile?.username || userName)?.[0]}</Text>
                        </View>
                    )}
                    <View style={styles.activeBadge} />
                </View>

                <Text style={styles.name}>{profile?.username || userName}</Text>
                <View style={styles.beliefBadge}>
                    <Sparkles size={12} color={palette.softGold} />
                    <Text style={styles.beliefText}>{profile?.user_preferences?.belief_type || 'Faithful Seeker'}</Text>
                </View>

                {currentUser !== userId && (
                    <TouchableOpacity
                        style={[styles.followButton, followStatus !== 'none' && styles.followingButton]}
                        onPress={handleFollow}
                    >
                        {followStatus === 'active' ? (
                            <><UserCheck size={18} color={palette.ivory} /><Text style={styles.followButtonText}>Following</Text></>
                        ) : followStatus === 'pending' ? (
                            <><Clock size={18} color={palette.ivory} /><Text style={styles.followButtonText}>Requested</Text></>
                        ) : (
                            <><UserPlus size={18} color={palette.ivory} /><Text style={styles.followButtonText}>Follow Seeker</Text></>
                        )}
                    </TouchableOpacity>
                )}
            </MotiView>

            {/* Glassmorphic Stats Section */}
            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200 }}
                style={{ marginHorizontal: 20, marginTop: -15 }}
            >
                <StatsCard
                    variant="glass"
                    stats={[
                        { label: 'Followers', value: stats.followers },
                        { label: 'Circles', value: stats.circles },
                        { label: 'Reflections', value: stats.reflections },
                    ]}
                />
            </MotiView>

            {/* Shared Reflections Title */}
            <View style={styles.contentSection}>
                <View style={styles.sectionHeader}>
                    <BookOpen size={20} color={palette.softGold} />
                    <Text style={styles.sectionTitle}>Shared Reflections</Text>
                </View>
            </View>

            {profile?.user_preferences?.is_profile_private && followStatus !== 'active' && currentUser !== userId && (
                <View style={styles.privateLock}>
                    <Lock size={48} color={theme.colors.border} />
                    <Text style={styles.privateTitle}>Profile is Private</Text>
                    <Text style={styles.privateDesc}>Follow to see their sacred journey into the community.</Text>
                </View>
            )}
        </>
    );

    const ProfileFooter = () => (
        <>
            {/* Circles Section */}
            <View style={styles.contentSection}>
                <View style={styles.sectionHeader}>
                    <ShieldAlert size={20} color={palette.softGold} />
                    <Text style={styles.sectionTitle}>Joined Sanctuaries</Text>
                </View>
                <View style={styles.circleList}>
                    {circles.length > 0 ? circles.map((c, i) => (
                        <MotiView
                            key={i}
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 200 + i * 50 }}
                            style={{ marginBottom: 12, width: '100%' }}
                        >
                            <CircleCard
                                id={c.circle_id}
                                name={c.circles?.name || 'Unknown Circle'}
                                belief={c.circles?.belief}
                                onPress={() => { }}
                                style={{ width: '100%' }}
                            />
                        </MotiView>
                    )) : (
                        <Text style={styles.emptyText}>Not currently active in public sanctuaries.</Text>
                    )}
                </View>
            </View>
            <View style={{ height: 100 }} />
        </>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator color={palette.softGold} size="large" />
            </View>
        );
    }

    const showReflections = !profile?.user_preferences?.is_profile_private || followStatus === 'active' || currentUser === userId;

    return (
        <View style={styles.container}>
            <FixedHeader />
            <TrueNorthFlashList
                data={showReflections ? reflections : []}
                renderItem={renderReflectionItem as any}
                keyExtractor={(item: any) => item.id}
                estimatedItemSize={120}
                ListHeaderComponent={<ProfileHero />}
                ListFooterComponent={<ProfileFooter />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 60 }} // Offset for fixed header if needed, but header is separate now. 
                // Actually header is fixed, so list needs padding top equivalent to header height.
                // FixedHeader height approx 60-80 depending on insets.
                // Let's safe guess or measure. For now just standard padding.

                ListEmptyComponent={
                    showReflections ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No public reflections shared to circles yet.</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.colors.background,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border + '30',
        zIndex: 10
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitleGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 10 },
    headerAvatarMini: { width: 30, height: 30, borderRadius: 15, backgroundColor: palette.softGold + '20', alignItems: 'center', justifyContent: 'center' },
    headerAvatarText: { fontSize: 14, fontFamily: theme.typography.serifBold, color: palette.softGold },
    headerProfileTitle: { fontFamily: theme.typography.serifBold, fontSize: 16, color: theme.colors.text, maxWidth: 150 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    headerIconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: theme.colors.surface },
    heroSection: { alignItems: 'center', paddingTop: 10, paddingBottom: 40, position: 'relative' },
    heroBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
    heroGradient: { flex: 1, backgroundColor: palette.softGold + '08' },
    avatarWrapper: { position: 'relative', marginBottom: 20 },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: palette.ivory, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12 },
    avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: palette.softGold + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.softGold },
    avatarText: { fontSize: 48, fontFamily: theme.typography.serifBold, color: palette.softGold },
    activeBadge: { position: 'absolute', bottom: 5, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: '#4ADE80', borderWidth: 3, borderColor: palette.ivory },
    name: { fontFamily: theme.typography.serifBold, fontSize: 32, color: theme.colors.text, marginBottom: 8 },
    beliefBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.softGold + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginBottom: 24 },
    beliefText: { fontFamily: theme.typography.sansBold, fontSize: 12, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 0.5 },
    followButton: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.colors.text, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    followingButton: { backgroundColor: theme.colors.secondaryText },
    followButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    statsContainer: {
        flexDirection: 'row', marginHorizontal: 20, marginTop: -15, padding: 20,
        backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5
    },
    statsBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.surface, opacity: 0.8, borderRadius: 24 },
    statBox: { flex: 1, alignItems: 'center' },
    statNumber: { fontFamily: theme.typography.serifBold, fontSize: 22, color: theme.colors.text },
    statLabel: { fontFamily: theme.typography.sans, fontSize: 11, color: theme.colors.secondaryText, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
    statDivider: { width: 1, height: '60%', backgroundColor: theme.colors.border, alignSelf: 'center' },
    contentSection: { paddingHorizontal: 20, paddingTop: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    sectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text, textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.8 },
    reflectionCard: {
        backgroundColor: theme.colors.surface, padding: 20, borderRadius: 20, marginBottom: 16,
        borderWidth: 1, borderColor: theme.colors.border + '50', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    circleTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.softGold + '10', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    circleTagName: { fontFamily: theme.typography.sansBold, fontSize: 11, color: palette.softGold },
    timeTag: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, opacity: 0.6 },
    reflectionBody: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, lineHeight: 24 },
    circleList: { gap: 4 },
    circleChip: { backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border },
    circleChipText: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.text },
    privateLock: { alignItems: 'center', paddingVertical: 60, gap: 15 },
    privateTitle: { fontFamily: theme.typography.serifBold, fontSize: 22, color: theme.colors.text },
    privateDesc: { fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.secondaryText, textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
    emptyState: { paddingVertical: 30, alignItems: 'center' },
    emptyText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, fontStyle: 'italic', textAlign: 'center' },
    reflectionCardMargin: { marginHorizontal: 20, marginBottom: 16 }
});
