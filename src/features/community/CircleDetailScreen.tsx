import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ActionSheetIOS, Share, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { Users, Lock, ChevronLeft, Heart, Share2, MoreVertical, Plus, Send, Clock, MapPin, Sparkles, X, Image as ImageIcon, Flag, Link } from 'lucide-react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { contentAgentService, LIFE_CIRCLES } from '../../services/ContentAgentService';
import { useStore, BeliefType } from '../../store';

const MOCK_EVENTS = [
    { id: '1', title: 'Community Reflection', time: 'Tomorrow, 7:00 AM', location: 'Online Sanctuary', participants: 12 },
    { id: '2', title: 'Open Hearts Session', time: 'Saturday, 10:00 AM', location: 'Shared Space', participants: 45 },
];

export const CircleDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { createdCircles, bookmarkedCircleIds, toggleBookmark, deleteCreatedCircle } = useStore();
    const { circleId, circleName: initialName } = (route.params as any) || {};

    // Check in both ghost circles and user-created circles
    const ghostCircle = LIFE_CIRCLES.find(c => c.id === circleId);
    const userCircle = createdCircles.find(c => c.id === circleId);
    const circle = ghostCircle || userCircle || LIFE_CIRCLES[0];

    const circleName = circle.name;
    const circleType = `${circle.belief} Circle`;
    const isGhostCircle = circleId?.startsWith('c');

    // State for local reflections so we can see updates
    const [reflections, setReflections] = useState<any[]>([]);
    const isBookmarked = bookmarkedCircleIds.includes(circleId);

    useEffect(() => {
        const loadReflections = async () => {
            if (circle.reflections && circle.reflections.length > 0) {
                setReflections(contentAgentService.cleanupOldReflections(circle.reflections));
            } else {
                // Generate some initial reflections for empty user circles (simulated agent)
                const initial = await Promise.all([
                    contentAgentService.generateReflection(circle.id, circle.belief as BeliefType, circle.theme),
                    contentAgentService.generateReflection(circle.id, circle.belief as BeliefType, circle.theme)
                ]);
                setReflections(initial);
            }
        };
        loadReflections();
    }, [circleId, isFocused]);

    const MOCK_POSTS = reflections.map(r => ({
        id: r.id,
        user: r.userName,
        type: 'Reflection',
        content: r.content,
        blessings: r.blessings,
        time: r.time
    }));

    const [isSharing, setIsSharing] = useState(false);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newEvent, setNewEvent] = useState({ title: '', time: '', location: '' });

    const isAdmin = circle.id.startsWith('user-'); // Ghost communities are 'c-', so you are not admin by default
    // If you created it (ID starts with 'user-'), you are the admin.

    const handleShare = () => {
        // AI Fraud Detection logic
        const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
        const paymentKeywords = [/\$/g, /Ksh/gi, /payment/gi, /send money/gi, /donate/gi, /M-Pesa/gi];

        const subscriptionTier = useStore.getState().subscriptionTier;
        const canPostInCircles = subscriptionTier === 'true_north' || subscriptionTier === 'zenith';

        if (!canPostInCircles) {
            Alert.alert(
                "Community Reflection",
                "Sharing reflections in public circles is a True North feature. Upgrade to join the conversation.",
                [
                    { text: "Later", style: "cancel" },
                    { text: "Upgrade", onPress: () => (navigation as any).navigate('Subscription') }
                ]
            );
            return;
        }

        if (phoneRegex.test(newPostContent)) {
            Alert.alert("Sacred Space Policy", "To ensure the safety of our community, sharing phone numbers is not permitted in public circles.");
            return;
        }

        if (paymentKeywords.some(regex => regex.test(newPostContent))) {
            Alert.alert("Fraud Protection", "True North is a sacred space for reflection. Financial requests or payment mentions are automatically flagged to protect our members.");
            return;
        }

        if (newPostContent.trim()) {
            Alert.alert("Blessing Shared", "Your reflection has been shared with the circle.");
            setNewPostContent('');
            setIsSharing(false);
        }
    };

    const handleCreateEvent = () => {
        if (newEvent.title && newEvent.time) {
            Alert.alert(
                "Event Created",
                "Members have been notified about your new event.",
                [{ text: "Great" }]
            );
            setIsAddingEvent(false);
            setNewEvent({ title: '', time: '', location: '' });
        } else {
            Alert.alert("Error", "Please provide at least a title and time.");
        }
    };

    const handleInvite = async () => {
        const circleId = (route.params as any)?.circleId || '1';
        const inviteUrl = Linking.createURL(`invite / ${circleId} `);
        // For WhatsApp, we want a message that includes the link
        // We can also use a "store redirect" link if we want, but usually expo-linking handles this if configured correctly
        // However, for the specific requirement of "redirect to store if not installed", we usually use a web redirector
        // For now, we'll use the deep link and a friendly message.

        const message = `Join me in our sacred sanctuary on True North! Use this link to join the "${circleName}" circle: ${inviteUrl}\n\nIf you don't have the app, download it here: https://truenorth.app/download`;

        try {
            await Share.share({
                message,
                url: inviteUrl, // iOS support
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReport = (postId: string) => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Report Reflection'],
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 0,
                    title: 'Community Safety',
                    message: 'Report this reflection for AI assessment if it contains fraud, numbers, or misaligned content.'
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        Alert.alert("AI Assessment Started", "Our moderation AI is reviewing this post. It will be hidden if it violates our sacred space policies.");
                    }
                }
            );
        } else {
            Alert.alert(
                "Report Reflection",
                "Start AI assessment for this post?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Report", onPress: () => Alert.alert("AI Assessment Started", "Our moderation AI is reviewing this post.") }
                ]
            );
        }
    };

    const handleCircleMenu = () => {
        const options = ['Cancel', 'Flag Sanctuary'];
        if (isAdmin) options.push('Delete Sanctuary');

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    destructiveButtonIndex: isAdmin ? 2 : undefined,
                    cancelButtonIndex: 0,
                    title: circleName,
                    message: isAdmin ? 'Manage your sacred sanctuary.' : 'Help keep this space sacred.'
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) handleFlagCircle();
                    if (isAdmin && buttonIndex === 2) handleDeleteCircle();
                }
            );
        } else {
            const buttons: any[] = [
                { text: "Cancel", style: "cancel" },
                { text: "Flag Sanctuary", onPress: handleFlagCircle }
            ];
            if (isAdmin) {
                buttons.push({ text: "Delete Sanctuary", style: "destructive", onPress: handleDeleteCircle });
            }
            Alert.alert(circleName, "Sanctuary Management", buttons);
        }
    };

    const handleFlagCircle = () => {
        Alert.alert(
            "AI Assessment Started",
            "This sanctuary is now being assessed by our moderation AI. Thank you for keeping True North sacred.",
            [{ text: "Praise" }]
        );
    };

    const handleDeleteCircle = () => {
        Alert.alert(
            "Delete Sanctuary?",
            "This will permanently close this sanctuary for all members. This action cannot be undone.",
            [
                { text: "Keep Sanctuary", style: "cancel" },
                {
                    text: "Close Permanently",
                    style: "destructive",
                    onPress: () => {
                        deleteCreatedCircle(circleId);
                        navigation.goBack();
                        Alert.alert("Sanctuary Closed", "Your sanctuary has been dissolved and members have been notified.");
                    }
                }
            ]
        );
    };

    const renderEvent = ({ item }: any) => (
        <View style={styles.eventCard}>
            <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventTime}>{item.time}</Text>
                <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => Alert.alert("Event Joined", `You have successfully RSVP'd to "${item.title}". We'll remind you 1 hour before.`)}
            >
                <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPost = ({ item }: any) => {
        const userName = item.user || 'Anonymous';
        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>{userName[0]}</Text></View>
                        <View>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.postType}>{item.type} • {item.time}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => handleReport(item.id)}>
                        <MoreVertical size={18} color={theme.colors.secondaryText} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                {item.image && (
                    <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                )}
                <View style={styles.postFooter}>
                    <TouchableOpacity style={styles.blessButton}>
                        <Heart size={18} color={palette.softGold} fill={palette.softGold} />
                        <Text style={styles.blessCount}>{item.blessings} Blessings</Text>
                    </TouchableOpacity>
                    <View style={styles.footerActions}>
                        <TouchableOpacity style={styles.actionIcon}><Share2 size={18} color={theme.colors.secondaryText} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{circleName}</Text>
                    <Text style={styles.headerSubtitle}>{circleType || 'Public Circle'}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => {
                            const subscriptionTier = useStore.getState().subscriptionTier;
                            const isCurrentlyBookmarked = bookmarkedCircleIds.includes(circleId);

                            if (!isCurrentlyBookmarked) {
                                if (subscriptionTier === 'free' && bookmarkedCircleIds.length >= 1) {
                                    Alert.alert("Join Limit", "The Seeker Tier allows joining 1 Circle. Upgrade to Compass to join up to 5 Circles.");
                                    return;
                                }
                                if (subscriptionTier === 'compass' && bookmarkedCircleIds.length >= 5) {
                                    Alert.alert("Join Limit", "The Compass Tier allows joining 5 Circles. Upgrade to True North for unlimited access.");
                                    return;
                                }
                            }
                            toggleBookmark(circleId);
                        }}
                        style={styles.headerAction}
                    >
                        <Heart size={24} color={isBookmarked ? palette.softGold : theme.colors.text} fill={isBookmarked ? palette.softGold : 'transparent'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerAction} onPress={handleInvite}>
                        <Link size={22} color={palette.softGold} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerAction} onPress={handleCircleMenu}>
                        <MoreVertical size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={MOCK_POSTS}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.sectionContainer}>
                        {!isGhostCircle && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                                    {isAdmin && (
                                        <TouchableOpacity onPress={() => setIsAddingEvent(true)}>
                                            <Plus size={20} color={palette.softGold} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.eventList}
                                >
                                    {MOCK_EVENTS.map(event => (
                                        <React.Fragment key={event.id}>
                                            {renderEvent({ item: event })}
                                        </React.Fragment>
                                    ))}
                                </ScrollView>
                                <View style={styles.sectionDivider} />
                            </>
                        )}
                        <Text style={[styles.sectionTitle, { marginBottom: theme.spacing.lg }]}>Reflections</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => setIsSharing(true)}
            >
                <Text style={styles.fabText}>Share Reflection</Text>
            </TouchableOpacity>

            <Modal visible={isSharing} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setIsSharing(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Share Reflection</Text>
                            <TouchableOpacity onPress={handleShare}>
                                <Text style={[styles.shareAction, { opacity: newPostContent.trim() ? 1 : 0.5 }]}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="What's on your heart? (No phone numbers or payment requests)"
                            placeholderTextColor={theme.colors.secondaryText}
                            multiline
                            autoFocus
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                        />

                        <View style={styles.modalFooter}>
                            <TouchableOpacity style={styles.modalIconButton}>
                                <ImageIcon size={22} color={theme.colors.primary} />
                                <Text style={styles.modalIconText}>Add Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={isAddingEvent} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { height: 'auto', paddingBottom: insets.bottom + 40 }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setIsAddingEvent(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>New Event</Text>
                            <TouchableOpacity onPress={handleCreateEvent}>
                                <Text style={styles.shareAction}>Create</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Event Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Weekly Reflection"
                                value={newEvent.title}
                                onChangeText={t => setNewEvent({ ...newEvent, title: t })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Date & Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Friday, 6:00 PM"
                                value={newEvent.time}
                                onChangeText={t => setNewEvent({ ...newEvent, time: t })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Zoom or Physical Address"
                                value={newEvent.location}
                                onChangeText={t => setNewEvent({ ...newEvent, location: t })}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    headerCenter: { alignItems: 'center', flex: 1, marginHorizontal: theme.spacing.md },
    headerTitle: { fontFamily: theme.typography.sansBold, fontSize: 17, color: theme.colors.text, textAlign: 'center' },
    headerSubtitle: { fontFamily: theme.typography.sans, fontSize: 11, color: theme.colors.secondaryText, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
    backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    headerAction: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingBottom: 100 },
    sectionContainer: { padding: theme.spacing.xl, paddingBottom: 0 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
    sectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 15, color: theme.colors.secondaryText, textTransform: 'uppercase', letterSpacing: 1 },
    eventList: { gap: theme.spacing.md, paddingBottom: theme.spacing.lg },
    eventCard: {
        width: 240, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    eventInfo: { flex: 1 },
    eventTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 4 },
    eventTime: { fontFamily: theme.typography.sansMedium, fontSize: 13, color: palette.softGold, marginBottom: 2 },
    eventLocation: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    joinButton: {
        backgroundColor: theme.colors.text, paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: theme.borderRadius.full
    },
    joinButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 13 },
    sectionDivider: { height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.xl },
    postCard: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, marginBottom: theme.spacing.xl,
        marginHorizontal: theme.spacing.xl,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1,
        borderWidth: 1, borderColor: theme.colors.border
    },
    postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FAF9F6', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
    avatarText: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text },
    userName: { fontFamily: theme.typography.sansBold, fontSize: 15, color: theme.colors.text },
    postType: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    postContent: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, lineHeight: 24, marginBottom: theme.spacing.lg },
    postImage: { width: '100%', height: 200, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.xl },
    postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.lg },
    blessButton: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    blessCount: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold },
    footerActions: { flexDirection: 'row', gap: theme.spacing.xl },
    actionIcon: { padding: 4 },
    fab: {
        position: 'absolute', left: theme.spacing.xxl, right: theme.spacing.xxl,
        height: 56, borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center', shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5
    },
    fabText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: theme.colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl, height: '80%'
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xxl },
    modalTitle: { fontFamily: theme.typography.sansBold, fontSize: 17, color: theme.colors.text },
    shareAction: { fontFamily: theme.typography.sansBold, fontSize: 17, color: palette.softGold },
    modalInput: {
        fontFamily: theme.typography.sans, fontSize: 18, color: theme.colors.text,
        lineHeight: 26, flex: 1, textAlignVertical: 'top'
    },
    modalFooter: {
        borderTopWidth: 1, borderTopColor: theme.colors.border,
        paddingVertical: theme.spacing.lg, flexDirection: 'row', gap: theme.spacing.xl
    },
    modalIconButton: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    modalIconText: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: theme.colors.primary },
    inputGroup: { marginBottom: theme.spacing.lg },
    inputLabel: { fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText, marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.spacing.md,
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border
    }
});
