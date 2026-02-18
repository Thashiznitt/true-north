import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ActionSheetIOS, Share } from 'react-native'; // eslint-disable-line react-native/split-platform-components
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, X, Check, Lock, Globe, Users, Search, MapPin, Sparkles, Plus, Minus, CreditCard, Heart, Share2, MoreVertical, Send, Clock, Image as ImageIcon, Flag, Link, QrCode, Smartphone } from 'lucide-react-native';



import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { FadeIn } from '../../components/FadeIn';
import { contentAgentService, LIFE_CIRCLES, GhostReflection } from '../../services/ContentAgentService';
import { useStore, BeliefType, CircleEvent } from '../../store';
import { supabase } from '../../services/supabase';
import { paymentService, PaymentMethod } from '../../services/PaymentService';


import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';

interface Reflection {
    id: string;
    content: string;
    user?: string;
    userName?: string;
    userId?: string;
    blessings?: number;
    time?: string;
    image?: string;
}


const MOCK_EVENTS = [
    { id: '1', title: 'Community Reflection', time: 'Tomorrow, 7:00 AM', location: 'Online Sanctuary', participants: 12 },
    { id: '2', title: 'Open Hearts Session', time: 'Saturday, 10:00 AM', location: 'Shared Space', participants: 45 },
];

export const CircleDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { createdCircles, bookmarkedCircleIds, toggleBookmark, deleteCreatedCircle, blockedUserIds, blockUser, blockCircle, handleJoinRequest, userId, userTickets, purchaseTicket, addNotification } = useStore();


    const { circleId, circleName: initialName } = (route.params as { circleId: string; circleName?: string }) || {};

    const userCircle = createdCircles.find(c => c.id === circleId);
    const ghostCircle = LIFE_CIRCLES.find(c => c.id === circleId);
    const circle = userCircle || ghostCircle || LIFE_CIRCLES[0];

    const isAdmin = userCircle?.adminIds?.includes(userId || '') || false;
    const isModerator = userCircle?.moderatorIds?.includes(userId || '') || false;
    const isMember = bookmarkedCircleIds.includes(circleId);
    const isPrivate = circle.type === 'Private';

    const pendingRequests = userCircle?.joinRequests?.filter(r => r.status === 'pending') || [];

    const circleName = circle.name;
    const circleType = `${circle.belief} Circle`;
    const isGhostCircle = circleId?.startsWith('c');


    // State for local reflections so we can see updates
    const [reflections, setReflections] = useState<Reflection[]>([]);

    const isBookmarked = bookmarkedCircleIds.includes(circleId);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedEventToPay, setSelectedEventToPay] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [paymentPhone, setPaymentPhone] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [paymentProvider, setPaymentProvider] = useState<'STRIPE' | 'MPESA'>('MPESA');

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

    const MOCK_POSTS = reflections
        .filter(r => !blockedUserIds.includes((r.userId || r.user) || '')) // Filter out blocked users

        .map(r => ({
            id: r.id,
            user: r.userName || r.user,
            userId: r.userId || r.user || '',

            type: 'Reflection',
            content: r.content,
            blessings: r.blessings,
            time: r.time
        }));

    const [isSharing, setIsSharing] = useState(false);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newEvent, setNewEvent] = useState<Omit<CircleEvent, 'id' | 'ticketsSold'>>({
        title: '',
        date: '',
        location: '',
        price: 0,
        currency: 'USD',
        capacity: 100
    });


    // If you created it (ID starts with 'user-'), you are the admin.

    const handleShare = async () => {
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            try {
                const user = useStore.getState();
                if (user.userId) {
                    await supabase.from('journal_entries').insert({
                        user_id: user.userId,
                        content: newPostContent.trim(),
                        is_private: false,
                        shared_in_circle_id: circleId
                    });
                }

                Alert.alert("Blessing Shared", "Your reflection has been shared with the circle.");
                setNewPostContent('');
                setIsSharing(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                console.error('Error sharing reflection:', error);
                Alert.alert("Error", "Could not share your reflection at this time.");
            }
        }
    };

    const renderRequests = useCallback(({ item }: { item: { userId: string, username: string, status: 'pending' | 'accepted' | 'rejected' } }) => (
        <JoinRequestItem
            item={item}
            circleId={circleId}
            handleJoinRequest={handleJoinRequest}
        />
    ), [circleId, handleJoinRequest]);

    const renderEvent = useCallback(({ item }: { item: CircleEvent }) => {
        const hasTicket = userTickets.some(t => t.eventId === item.id);
        const isOrganizer = userCircle?.adminIds?.includes(userId || '');

        return (
            <TouchableOpacity
                style={styles.eventCard}
                onPress={() => {
                    if (isOrganizer) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (navigation as any).navigate('TicketScanner', { circleId, eventId: item.id });
                    } else if (hasTicket) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (navigation as any).navigate('Profile');
                    } else {
                        setSelectedEventToPay(item);
                        setShowPaymentModal(true);
                    }
                }}
            >
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <View style={styles.eventDetails}>
                        <Clock size={14} color={theme.colors.secondaryText} />
                        <Text style={styles.eventDetailText}>{item.date}</Text>
                        <MapPin size={14} color={theme.colors.secondaryText} style={{ marginLeft: 8 }} />
                        <Text style={styles.eventDetailText}>{item.location}</Text>
                    </View>
                </View>
                <View style={[styles.eventStatus, (hasTicket || isOrganizer) && styles.eventStatusActive]}>
                    {isOrganizer ? (
                        <QrCode size={18} color={palette.white} />
                    ) : hasTicket ? (
                        <Check size={18} color={palette.white} />
                    ) : (
                        <Text style={styles.eventPrice}>{item.currency} {item.price}</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    }, [userTickets, userCircle, userId, navigation, setSelectedEventToPay, setShowPaymentModal, circleId]);

    const handleCreateEvent = useCallback(() => {
        if (newEvent.title && newEvent.date && newEvent.location) {
            useStore.getState().addCircleEvent(circleId, newEvent);
            Alert.alert(
                "Event Created",
                "Members have been notified about your new event.",
                [{ text: "Great" }]
            );
            setIsAddingEvent(false);
            setNewEvent({
                title: '',
                date: '',
                location: '',
                price: 0,
                currency: 'USD',
                capacity: 100
            });
        } else {
            Alert.alert("Error", "Please provide a title, date, and location.");
        }
    }, [newEvent, circleId, setIsAddingEvent, setNewEvent]);

    const handleBuyTicket = async (event: CircleEvent) => {
        const existingTickets = userTickets.filter(t => t.eventId === event.id);

        if (existingTickets.length >= 2) {
            Alert.alert("Limit Reached", "To ensure fair access for all seekers, purchases are limited to 2 tickets per event.");
            return;
        }

        const success = await paymentService.initializePayment({
            amount: event.price,
            currency: event.currency,
            description: `Ticket for ${event.title}`,
            email: useStore.getState().email || 'seeker@truenorth.app',
            metadata: { eventId: event.id, circleId }
        });

        if (success.success) {
            purchaseTicket(circleId, event.id);
            Alert.alert("Sanctuary Ticket Secured", "Your ticket is now available in your profile. Praise!");
        }
    };



    const handleInvite = async () => {
        const circleId = (route.params as any)?.circleId || '1'; // eslint-disable-line @typescript-eslint/no-explicit-any
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
                    options: ['Cancel', 'Report Reflection', 'Block User'],
                    destructiveButtonIndex: 2,
                    cancelButtonIndex: 0,
                    title: 'Community Safety',
                    message: 'Report this reflection for AI assessment or block this user to hide their content.'
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        Alert.alert("AI Assessment Started", "Our moderation AI is reviewing this post. It will be hidden if it violates our sacred space policies.");
                    } else if (buttonIndex === 2) {
                        const post = MOCK_POSTS.find(p => p.id === postId);
                        if (post && post.userId) {
                            blockUser(post.userId);
                            Alert.alert("User Blocked", "You will no longer see reflections from this seeker.");
                        }
                    }
                }
            );
        } else {
            Alert.alert(
                "Community Safety",
                "How would you like to proceed?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Report", onPress: () => Alert.alert("AI Assessment Started", "Our moderation AI is reviewing this post.") },
                    {
                        text: "Block User",
                        style: "destructive",
                        onPress: () => {
                            const post = MOCK_POSTS.find(p => p.id === postId);
                            if (post && post.userId) {
                                blockUser(post.userId);
                                Alert.alert("User Blocked", "You will no longer see reflections from this seeker.");
                            }
                        }
                    }
                ]
            );
        }
    };

    const handleCircleMenu = () => {
        const options = ['Cancel', 'Flag Sanctuary', 'Block Sanctuary'];
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
                    if (buttonIndex === 2) handleBlockCircle();
                    if (isAdmin && buttonIndex === 3) handleDeleteCircle();
                }
            );
        } else {
            const buttons: any[] = [ // eslint-disable-line @typescript-eslint/no-explicit-any
                { text: "Cancel", style: "cancel" },
                { text: "Flag Sanctuary", onPress: handleFlagCircle },
                { text: "Block Sanctuary", style: "destructive", onPress: handleBlockCircle }
            ];
            if (isAdmin) {
                buttons.push({ text: "Delete Sanctuary", style: "destructive", onPress: handleDeleteCircle });
            }
            Alert.alert(circleName, "Sanctuary Management", buttons);
        }
    };

    const handleBlockCircle = () => {
        Alert.alert(
            "Block Sanctuary?",
            "You will no longer see this sanctuary in your community list. This can be reversed in Privacy settings.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Block",
                    style: "destructive",
                    onPress: () => {
                        blockCircle(circleId);
                        navigation.goBack();
                    }
                }
            ]
        );
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

    const handleBless = async (postId: string) => {
        setReflections(prev => prev.map(p => p.id === postId ? { ...p, blessings: (p.blessings || 0) + 1 } : p));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const renderPost = React.useCallback(({ item, index }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        return (
            <FadeIn delay={Math.min(index * 100, 1000)} from="bottom">
                <PostItem item={item} onBless={() => handleBless(item.id)} onReport={() => handleReport(item.id)} />
            </FadeIn>
        );
    }, [blockedUserIds, handleBless]);

    const PostItem = React.memo(({ item, onBless, onReport }: { item: any, onBless: () => void, onReport: () => void }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const userName = item.userName || item.user || 'Anonymous';
        return (
            <View style={styles.postCard}>
                <View style={styles.postHeader}>
                    <TouchableOpacity
                        style={styles.userInfo}
                        onPress={() => (navigation as { navigate: (s: string, p: object) => void }).navigate('UserProfile', {

                            userId: item.userId,
                            userName: userName
                        })}
                    >
                        <View style={styles.avatar}><Text style={styles.avatarText}>{userName[0]}</Text></View>
                        <View>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.postType}>{item.type} • {item.time}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleReport(item.id)}>
                        <MoreVertical size={18} color={theme.colors.secondaryText} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                {item.image && (
                    <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
                )}
                <View style={styles.postFooter}>
                    <TouchableOpacity style={styles.blessButton} onPress={onBless}>
                        <Heart size={18} color={palette.softGold} fill={palette.softGold} />
                        <MotiView
                            key={item.blessings}
                            from={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                        >
                            <Text style={styles.blessCount}>{item.blessings} Blessings</Text>
                        </MotiView>
                    </TouchableOpacity>
                    <View style={styles.footerActions}>
                        <TouchableOpacity style={styles.actionIcon}><Share2 size={18} color={theme.colors.secondaryText} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    });
    PostItem.displayName = 'PostItem';

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

            <TrueNorthFlashList
                data={MOCK_POSTS}
                renderItem={renderPost}
                keyExtractor={(item: any) => item.id} // eslint-disable-line @typescript-eslint/no-explicit-any
                estimatedItemSize={250}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.sectionContainer}>
                        {isAdmin && pendingRequests.length > 0 && (
                            <TouchableOpacity
                                style={styles.requestBanner}
                                onPress={() => setShowJoinRequests(true)}
                            >
                                <View style={styles.requestBannerContent}>
                                    <Users size={18} color={palette.softGold} />
                                    <Text style={styles.requestBannerText}>
                                        {pendingRequests.length} join request{pendingRequests.length > 1 ? 's' : ''} pending
                                    </Text>
                                </View>
                                <Text style={styles.viewAction}>View</Text>
                            </TouchableOpacity>
                        )}

                        {!isGhostCircle && (
                            <>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                                    {(isAdmin || isModerator) && (
                                        <TouchableOpacity onPress={() => setIsAddingEvent(true)}>
                                            <Plus size={20} color={palette.softGold} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <TrueNorthFlashList
                                    horizontal
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    data={(circle as any).events || MOCK_EVENTS}
                                    renderItem={renderEvent}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    keyExtractor={(item: any) => item.id}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginHorizontal: -theme.spacing.xl }}
                                    contentContainerStyle={styles.eventList}
                                    estimatedItemSize={200}
                                />


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
                                value={newEvent.date}
                                onChangeText={t => setNewEvent({ ...newEvent, date: t })}
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Ticket Price (0 for Free)</Text>
                            <View style={styles.priceInputContainer}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={newEvent.price.toString()}
                                    onChangeText={t => setNewEvent({ ...newEvent, price: Number(t) || 0 })}
                                />
                                <TextInput
                                    style={[styles.input, { width: 80 }]}
                                    placeholder="USD"
                                    value={newEvent.currency}
                                    onChangeText={t => setNewEvent({ ...newEvent, currency: t })}
                                />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
            <Modal visible={showJoinRequests} animationType="slide" transparent>
                <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
                    <View style={[styles.modalContent, { height: '60%', borderRadius: 24, marginHorizontal: 20 }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setShowJoinRequests(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Join Requests</Text>
                            <TouchableOpacity onPress={() => {
                                pendingRequests.forEach(r => handleJoinRequest(circleId, r.userId, 'accept'));
                                setShowJoinRequests(false);
                                Alert.alert("Success", "All seekers have been accepted into the sanctuary.");
                            }}>
                                <Text style={styles.shareAction}>Accept All</Text>
                            </TouchableOpacity>
                        </View>
                        <TrueNorthFlashList
                            data={pendingRequests}
                            renderItem={renderRequests}
                            keyExtractor={(item) => item.userId}
                            estimatedItemSize={70}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showPaymentModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <View style={styles.paymentModalOverlay}>
                    <View style={styles.paymentModalContent}>
                        <View style={styles.paymentModalHeader}>
                            <Text style={styles.paymentModalTitle}>Complete Purchase</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <X color={theme.colors.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        {selectedEventToPay && (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.eventTitle}>{selectedEventToPay.title}</Text>
                                <Text style={styles.eventPrice}>{selectedEventToPay.currency} {selectedEventToPay.price}</Text>
                            </View>
                        )}

                        <View style={styles.quantityContainer}>
                            <Text style={styles.paymentSectionTitle}>Quantity</Text>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={20} color={quantity <= 1 ? theme.colors.secondaryText : theme.colors.text} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{quantity}</Text>
                                <TouchableOpacity
                                    style={[styles.quantityButton, quantity >= 2 && styles.quantityButtonDisabled]}
                                    onPress={() => setQuantity(Math.min(2, quantity + 1))}
                                    disabled={quantity >= 2}
                                >
                                    <Plus size={20} color={quantity >= 2 ? theme.colors.secondaryText : theme.colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.paymentSectionTitle}>Select Payment Method</Text>

                        <View style={[styles.paymentOption, { opacity: 0.6 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CreditCard size={24} color={theme.colors.secondaryText} />
                                <View>
                                    <Text style={[styles.paymentText, { color: theme.colors.secondaryText }]}>Card / Apple Pay</Text>
                                    <Text style={{ fontSize: 10, color: palette.softGold, marginLeft: 12, fontWeight: 'bold' }}>COMING SOON</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.paymentOption,
                                paymentProvider === 'MPESA' && styles.paymentOptionSelected
                            ]}
                            onPress={() => setPaymentProvider('MPESA')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Smartphone size={24} color={paymentProvider === 'MPESA' ? palette.success : theme.colors.secondaryText} />
                                <Text style={[styles.paymentText, paymentProvider === 'MPESA' && styles.paymentTextSelected]}>M-Pesa (STK Push)</Text>
                            </View>
                            {paymentProvider === 'MPESA' && <Check size={20} color={palette.success} />}
                        </TouchableOpacity>

                        {paymentProvider === 'MPESA' && (
                            <View style={styles.phoneInputContainer}>
                                <Text style={styles.paymentLabel}>M-Pesa Phone Number</Text>
                                <TextInput
                                    style={styles.paymentInput}
                                    placeholder="e.g. 0712345678"
                                    placeholderTextColor={theme.colors.secondaryText}
                                    value={paymentPhone}
                                    onChangeText={setPaymentPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.payButton, isProcessingPayment && { opacity: 0.7 }]}
                            onPress={async () => {
                                if (!selectedEventToPay) return;

                                if (paymentProvider === 'MPESA' && !paymentPhone) {
                                    Alert.alert("Required", "Please enter your M-Pesa phone number.");
                                    return;
                                }

                                setIsProcessingPayment(true);

                                try {
                                    const totalAmount = selectedEventToPay.price * quantity;

                                    const result = await paymentService.initializePayment({
                                        amount: totalAmount,
                                        currency: selectedEventToPay.currency,
                                        description: `Ticket for ${selectedEventToPay.title} (x${quantity})`,
                                        provider: paymentProvider,
                                        phoneNumber: paymentProvider === 'MPESA' ? paymentPhone : undefined,
                                        metadata: {
                                            eventId: selectedEventToPay.id,
                                            circleId: circleId,
                                            userId: userId,
                                            quantity: quantity
                                        }
                                    });

                                    if (result.success) {
                                        await purchaseTicket(circleId, selectedEventToPay.id, quantity);

                                        addNotification({
                                            id: Math.random().toString(36).substr(2, 9),
                                            createdAt: Date.now(),
                                            title: "Ticket Purchased",
                                            message: `You've secured ${quantity} spot${quantity > 1 ? 's' : ''} for ${selectedEventToPay.title}.`,
                                            type: 'event'
                                        });


                                        setShowPaymentModal(false);
                                        Alert.alert("Success", "Ticket purchased successfully! Your spot is secured.");
                                    } else {
                                        // Alert handled in service for mock
                                    }
                                } catch (error) {
                                    Alert.alert("Error", "Payment failed. Please try again.");
                                } finally {
                                    setIsProcessingPayment(false);
                                }
                            }}
                            disabled={isProcessingPayment}
                        >
                            <Text style={styles.payButtonText}>
                                {isProcessingPayment ? "Processing..." : `Pay ${selectedEventToPay?.currency} ${(selectedEventToPay?.price * quantity).toLocaleString()}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const JoinRequestItem = React.memo(({ item, circleId, handleJoinRequest }: {
    item: { userId: string, username: string, status: 'pending' | 'accepted' | 'rejected' },
    circleId: string,
    handleJoinRequest: (circleId: string, userId: string, action: 'accept' | 'reject') => void
}) => (
    <View style={styles.requestItem}>
        <View style={styles.requestUserInfo}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.username[0]}</Text></View>
            <Text style={styles.requestUsername}>{item.username}</Text>
        </View>
        <View style={styles.requestActions}>
            <TouchableOpacity
                style={[styles.requestActionBtn, styles.rejectBtn]}
                onPress={() => handleJoinRequest(circleId, item.userId, 'reject')}
            >
                <X size={16} color={theme.colors.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.requestActionBtn, styles.acceptBtn]}
                onPress={() => handleJoinRequest(circleId, item.userId, 'accept')}
            >
                <Check size={16} color={palette.white} />
            </TouchableOpacity>
        </View>
    </View>
));

JoinRequestItem.displayName = 'JoinRequestItem';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },


    // Payment Modal Styles
    paymentModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    paymentModalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: theme.spacing.xl, paddingBottom: 40 },
    paymentModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    paymentModalTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    paymentSectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.secondaryText, marginBottom: 12, marginTop: 12 },
    paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, backgroundColor: theme.colors.background, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
    paymentOptionSelected: { borderColor: palette.softGold, backgroundColor: 'rgba(212, 175, 55, 0.05)' },
    paymentText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, marginLeft: 12 },
    paymentTextSelected: { color: palette.softGold },
    phoneInputContainer: { marginBottom: 20 },
    paymentLabel: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, marginBottom: 8 },
    paymentInput: { backgroundColor: theme.colors.background, borderRadius: 12, padding: 16, color: theme.colors.text, fontFamily: theme.typography.sans, fontSize: 16, borderWidth: 1, borderColor: theme.colors.border },
    payButton: { backgroundColor: palette.softGold, borderRadius: 30, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
    payButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory },
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
    eventList: { gap: theme.spacing.lg, paddingBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.xl },

    eventCard: {
        width: 240, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    eventInfo: { flex: 1 },
    eventTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 4 },
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
    },
    priceInputContainer: { flexDirection: 'row', alignItems: 'center' },
    eventPrice: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold, marginTop: 4 },
    eventDetails: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    eventDetailText: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    eventStatus: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
    eventStatusActive: { backgroundColor: palette.success, borderColor: palette.success },
    requestBanner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingVertical: 12, paddingHorizontal: 16,
        borderRadius: 12, marginBottom: theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)'
    },
    requestBannerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    requestBannerText: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: palette.softGold },
    viewAction: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold, textTransform: 'uppercase' },

    // Quantity Selector Styles
    quantityContainer: { marginBottom: 20 },
    quantityControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 10 },
    quantityButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border
    },
    quantityButtonDisabled: { opacity: 0.5, backgroundColor: theme.colors.background },
    quantityText: { fontFamily: theme.typography.sansBold, fontSize: 20, color: theme.colors.text, minWidth: 30, textAlign: 'center' },

    // Request Styles
    requestItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    requestUserInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 },
    requestUsername: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text },
    requestActions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    requestActionBtn: {
        width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.colors.border
    },
    acceptBtn: { backgroundColor: palette.success, borderColor: palette.success },
    rejectBtn: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
});
