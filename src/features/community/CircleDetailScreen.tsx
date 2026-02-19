import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ActionSheetIOS, Share, ScrollView } from 'react-native'; // eslint-disable-line react-native/split-platform-components
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, X, Check, Lock, Globe, Users, Search, MapPin, Sparkles, Plus, Minus, CreditCard, Heart, Share2, MoreVertical, Send, Clock, Image as ImageIcon, Flag, Link, QrCode, Smartphone, Shield } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';



import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { FadeIn } from '../../components/FadeIn';
import { contentAgentService, LIFE_CIRCLES, GhostReflection } from '../../services/ContentAgentService';
import { useStore, BeliefType, CircleEvent, Reflection, TicketTier } from '../../store';
import { supabase } from '../../services/supabase';
import { paymentService, PaymentMethod } from '../../services/PaymentService';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ChoiceModal, { ChoiceOption } from '../../components/ChoiceModal';
import { BottomSheet } from '../../components/BottomSheet';
import { Typography } from '../../components/Typography';


import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';




const MOCK_EVENTS = [
    { id: '1', title: 'Community Reflection', date: 'Tomorrow, 7:00 AM', location: 'Online Sanctuary', participants: 12, price: 0, currency: 'KES' },
    { id: '2', title: 'Open Hearts Session', date: 'Saturday, 10:00 AM', location: 'Shared Space', participants: 45, price: 0, currency: 'KES' },
];

export const CircleDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { createdCircles, bookmarkedCircleIds, toggleBookmark, deleteCreatedCircle, blockedUserIds, blockUser, blockCircle, handleJoinRequest, userId, userTickets, purchaseTicket, addNotification, findUserByUsername, setCircleRole, addCircleReflection, platformFeatures } = useStore();


    const { circleId, circleName: initialName } = (route.params as { circleId: string; circleName?: string }) || {};

    const userCircle = createdCircles.find(c => c.id === circleId);
    const ghostCircle = LIFE_CIRCLES.find(c => c.id === circleId);
    const circle = userCircle || ghostCircle || LIFE_CIRCLES[0];

    const isAdmin = userCircle?.adminIds?.includes(userId || 'creator') || false;
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
            image: r.image,
            blessings: r.blessings,
            time: r.time
        }));

    const [isSharing, setIsSharing] = useState(false);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [showRoleManagement, setShowRoleManagement] = useState(false);
    const [roleSearchQuery, setRoleSearchQuery] = useState('');
    const [foundUser, setFoundUser] = useState<{ userId: string, username: string } | null>(null);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'member' | 'validator'>('moderator');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [editingReflectionId, setEditingReflectionId] = useState<string | null>(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [newEvent, setNewEvent] = useState<any>({ // eslint-disable-line @typescript-eslint/no-explicit-any
        title: '',
        date: '',
        location: '',
        price: '',
        currency: 'USD',
        capacity: '',
        tiers: []
    });
    const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [eventDate, setEventDate] = useState(new Date());
    const [showChoiceModal, setShowChoiceModal] = useState(false);
    const [choiceModalConfig, setChoiceModalConfig] = useState<{
        title: string;
        message?: string;
        options: ChoiceOption[];
    }>({ title: '', options: [] });


    // If you created it (ID starts with 'user-'), you are the admin.

    const handleShare = async () => {
        // Spiritual Intelligence Fraud Detection logic
        const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
        const paymentKeywords = [/\$/g, /Ksh/gi, /payment/gi, /send money/gi, /donate/gi, /M-Pesa/gi];

        const subscriptionTier = useStore.getState().subscriptionTier;
        const canPostInCircles = subscriptionTier === 'true_north' || subscriptionTier === 'zenith';
        const isOrganizer = isAdmin || isModerator;
        const isCircleMember = isMember || isOrganizer;

        if (!canPostInCircles && !isCircleMember) {
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
                const effectiveUserId = user.userId || (user.isLoggedIn ? 'user-123' : null);

                if (effectiveUserId) {
                    if (editingReflectionId) {
                        // Update existing reflection
                        useStore.getState().updateCircleReflection(circleId, editingReflectionId, newPostContent.trim(), selectedImage);
                        setReflections(prev => prev.map(p => p.id === editingReflectionId ? { ...p, content: newPostContent.trim(), image: selectedImage } : p));
                        Alert.alert("Reflection Updated", "Your reflection has been updated.");
                        setEditingReflectionId(null);
                    } else {
                        // Create new reflection
                        const newReflection: Reflection = {
                            id: Math.random().toString(36).substr(2, 9),
                            userId: effectiveUserId,
                            userName: user.username || 'Anonymous',
                            content: newPostContent.trim(),
                            time: 'Just now',
                            blessings: 0,
                            createdAt: Date.now(),
                            image: selectedImage
                        };

                        addCircleReflection(circleId, newReflection);
                        setReflections(prev => [newReflection, ...prev]);

                        await supabase.from('journal_entries').insert({
                            user_id: effectiveUserId,
                            content: newPostContent.trim(),
                            is_private: false,
                            shared_in_circle_id: circleId,
                            image: selectedImage
                        });
                        Alert.alert("Blessing Shared", "Your reflection has been shared with the circle.");
                    }

                    setNewPostContent('');
                    setSelectedImage(null);
                    setIsSharing(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } else {
                    Alert.alert("Error", "You must be logged in to share reflections.");
                }
            } catch (error) {
                console.error('Error sharing reflection:', error);
                Alert.alert("Error", "Could not share your reflection at this time.");
            }
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
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
        const isOrganizer = isAdmin || isModerator;

        return (
            <TouchableOpacity
                style={styles.eventCard}
                onPress={() => {
                    if (isOrganizer) {
                        setChoiceModalConfig({
                            title: 'Event Management',
                            message: 'What would you like to do?',
                            options: [
                                { text: "Validate Tickets", onPress: () => (navigation as any).navigate('TicketScanner', { circleId, eventId: item.id }) }, // eslint-disable-line @typescript-eslint/no-explicit-any
                                {
                                    text: "Edit Event", onPress: () => {
                                        setNewEvent({ ...item });
                                        setEditingEventId(item.id);
                                        setIsAddingEvent(true);
                                    }
                                },
                                { text: "Delete Event", style: 'destructive', onPress: () => handleDeleteEvent(item.id) },
                                { text: "Cancel", style: 'cancel', onPress: () => { } }
                            ]
                        });
                        setShowChoiceModal(true);
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
                        <View style={styles.eventDetailRow}>
                            <Clock size={12} color={palette.softGold} />
                            <Text style={styles.eventDetailText}>{item.date || (item as any).time}</Text>{/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                        </View>
                        <View style={styles.eventDetailRow}>
                            <MapPin size={12} color={palette.softGold} />
                            <Text style={styles.eventDetailText}>{item.location}</Text>
                        </View>
                    </View>
                    <Text style={styles.eventPrice}>
                        {item.tiers && item.tiers.length > 0
                            ? `From ${item.currency} ${Math.min(...item.tiers.map(t => t.price))}`
                            : `${item.currency} ${item.price}`}
                    </Text>
                </View>
                {(hasTicket || isOrganizer) && (
                    <View style={[
                        styles.eventStatus,
                        hasTicket && styles.eventStatusActive,
                        isOrganizer && styles.eventStatusAdmin
                    ]}>
                        {isOrganizer ? (
                            <Shield size={18} color={palette.softGold} fill="rgba(200, 169, 90, 0.1)" />
                        ) : (
                            <Check size={18} color={palette.white} />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    }, [userTickets, isAdmin, isModerator, navigation, setSelectedEventToPay, setShowPaymentModal, circleId]);

    const handleDeleteEvent = (eventId: string) => {
        Alert.alert(
            "Delete Event",
            "Are you sure you want to remove this event? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        useStore.getState().deleteCircleEvent(circleId, eventId);
                        Alert.alert("Event Deleted", "The event has been removed from your sanctuary.");
                    }
                }
            ]
        );
    };

    const handleCreateEvent = useCallback(() => {
        if (newEvent.title && newEvent.date && newEvent.location) {
            const eventToSave = {
                ...newEvent,
                price: Number(newEvent.price) || 0,
                capacity: Number(newEvent.capacity) || 0,
                tiers: (newEvent.tiers || []).map((t: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
                    ...t,
                    price: Number(t.price) || 0,
                    capacity: Number(t.capacity) || 0
                }))
            };

            if (editingEventId) {
                useStore.getState().updateCircleEvent(circleId, editingEventId, eventToSave);
                Alert.alert("Event Updated", "Your event has been successfully updated.");
            } else {
                useStore.getState().addCircleEvent(circleId, eventToSave);
                Alert.alert("Event Created", "Members have been notified about your new event.");
            }
            setIsAddingEvent(false);
            setEditingEventId(null);
            setNewEvent({
                title: '',
                date: '',
                location: '',
                price: '',
                currency: 'USD',
                capacity: '',
                tiers: []
            });
        } else {
            Alert.alert("Error", "Please provide a title, date, and location.");
        }
    }, [newEvent, circleId, setIsAddingEvent, setNewEvent, editingEventId]);

    const handleBuyTicket = async (event: CircleEvent) => {
        const existingTickets = userTickets.filter(t => t.eventId === event.id);

        if (existingTickets.length >= 2) {
            Alert.alert("Limit Reached", "To ensure fair access for all seekers, purchases are limited to 2 tickets per event.");
            return;
        }

        if (!platformFeatures.ticketing) {
            Alert.alert("Feature Unavailable", "Ticketing is currently disabled for maintenance.");
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

        const message = `Join me in our sacred sanctuary on True North! Use this link to join the "${circleName}" circle: ${inviteUrl}\n\nDiscover spiritual guidance and affirmations on True North. Download here: https://www.truenorth.you/download`;

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
        setChoiceModalConfig({
            title: 'Community Safety',
            message: 'Report this reflection for Spiritual Intelligence assessment or block this user to hide their content.',
            options: [
                {
                    text: 'Report Reflection',
                    onPress: () => Alert.alert("Spiritual Intelligence Assessment Started", "Our moderation Spiritual Intelligence is reviewing this post. It will be hidden if it violates our sacred space policies.")
                },
                {
                    text: 'Block User',
                    style: 'destructive',
                    onPress: () => {
                        const post = reflections.find(p => p.id === postId);
                        if (post && post.userId) {
                            blockUser(post.userId);
                            Alert.alert("User Blocked", "You will no longer see reflections from this seeker.");
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel', onPress: () => { } }
            ]
        });
        setShowChoiceModal(true);
    };

    const handleCircleMenu = () => {
        const options: ChoiceOption[] = [
            { text: 'Flag Sanctuary', onPress: handleFlagCircle },
            { text: 'Block Sanctuary', onPress: handleBlockCircle },
            { text: 'Cancel', style: 'cancel', onPress: () => { } }
        ];

        if (isAdmin) {
            if (platformFeatures.events) {
                options.splice(2, 0, { text: 'Create Event', onPress: () => setIsAddingEvent(true) });
            }
            options.push(
                { text: 'Manage Roles', onPress: () => setShowRoleManagement(true) },
                { text: 'Delete Sanctuary', style: 'destructive', onPress: handleDeleteCircle }
            );
        }

        setChoiceModalConfig({
            title: circleName,
            message: isAdmin ? 'Manage your sacred sanctuary.' : 'Help keep this space sacred.',
            options
        });
        setShowChoiceModal(true);
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
            "Spiritual Intelligence Assessment Started",
            "This sanctuary is now being assessed by our moderation Spiritual Intelligence. Thank you for keeping True North sacred.",
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

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            "Delete Reflection",
            "Are you sure you want to delete this reflection?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        useStore.getState().deleteCircleReflection(circleId, postId);
                        setReflections(prev => prev.filter(p => p.id !== postId));
                        Alert.alert("Deleted", "Reflection removed.");
                    }
                }
            ]
        );
    };

    const handlePostOptions = (post: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const user = useStore.getState();
        const isAuthor = post.userId === user.userId || (post.userId === 'user-123' && user.isLoggedIn); // Mock ID check
        const isCircleAdmin = isAdmin || isModerator;

        if (isAuthor) {
            const now = Date.now();
            const createdAt = post.createdAt || 0;
            const minutesDiff = (now - createdAt) / 1000 / 60;
            const canEdit = minutesDiff <= 15;

            const options: ChoiceOption[] = [];

            if (canEdit) {
                options.push({
                    text: 'Edit Reflection',
                    onPress: () => {
                        setNewPostContent(post.content);
                        setSelectedImage(post.image);
                        setEditingReflectionId(post.id);
                        setIsSharing(true);
                    }
                });
            }

            options.push({
                text: 'Delete Reflection',
                style: 'destructive',
                onPress: () => handleDeletePost(post.id)
            });

            options.push({ text: 'Cancel', style: 'cancel', onPress: () => { } });

            setChoiceModalConfig({
                title: 'Manage Reflection',
                message: canEdit ? 'You can edit this reflection for 15 minutes after posting.' : 'Reflection posted over 15 minutes ago cannot be edited.',
                options
            });
            setShowChoiceModal(true);

        } else {
            // Options for non-authors (Report, Block, Admin Delete)
            const options: ChoiceOption[] = [
                {
                    text: 'Report Reflection',
                    onPress: () => Alert.alert("Spiritual Intelligence Assessment Started", "Our moderation Spiritual Intelligence is reviewing this post. It will be hidden if it violates our sacred space policies.")
                },
                {
                    text: 'Block User',
                    style: 'destructive',
                    onPress: () => {
                        if (post.userId) {
                            blockUser(post.userId);
                            Alert.alert("User Blocked", "You will no longer see reflections from this seeker.");
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel', onPress: () => { } }
            ];

            if (isCircleAdmin) {
                options.splice(2, 0, {
                    text: 'Delete (Admin)',
                    style: 'destructive',
                    onPress: () => handleDeletePost(post.id)
                });
            }

            setChoiceModalConfig({
                title: 'Community Safety',
                message: 'Keep this space sacred.',
                options
            });
            setShowChoiceModal(true);
        }
    };

    const renderPost = React.useCallback(({ item, index }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const isCircleAdmin = (userCircle?.adminIds?.includes(item.userId) || userCircle?.moderatorIds?.includes(item.userId)) ?? false;
        return (
            <FadeIn delay={Math.min(index * 100, 1000)} from="bottom">
                <PostItem
                    item={item}
                    onBless={() => handleBless(item.id)}
                    onReport={() => handlePostOptions(item)}
                    isAdminPost={isCircleAdmin}
                />
            </FadeIn>
        );
    }, [userCircle, isAdmin, isModerator]);

    const PostItem = React.memo(({ item, onBless, onReport, isAdminPost }: { item: any, onBless: () => void, onReport: () => void, isAdminPost: boolean }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
                            <View style={styles.userNameContainer}>
                                <Text style={styles.userName}>{userName}</Text>
                                {isAdminPost && (
                                    <View style={styles.adminBadge}>
                                        <Shield size={10} color={palette.ivory} fill={palette.ivory} />
                                        <Text style={styles.adminBadgeText}>Admin</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.postType}>{item.type} • {item.time}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onReport()}>
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

                        {!isGhostCircle && platformFeatures.events && (
                            <>
                                {(circle as any).events && (circle as any).events.length > 0 && (
                                    <>
                                        <View style={styles.sectionHeader}>
                                            <Text style={styles.sectionTitle}>Upcoming Events</Text>
                                        </View>
                                        <TrueNorthFlashList
                                            horizontal
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            data={(circle as any).events || MOCK_EVENTS}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            renderItem={({ item }: { item: any }) => renderEvent({ item })}
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
                            </>
                        )}
                        <Text style={[styles.sectionTitle, { marginBottom: theme.spacing.xl }]}>Reflections</Text>
                    </View>

                }
            />

            <TouchableOpacity
                style={[styles.fab, { bottom: insets.bottom + 20 }]}
                onPress={() => setIsSharing(true)}
            >
                <Text style={styles.fabText}>Share Reflection</Text>
            </TouchableOpacity>

            <BottomSheet
                visible={isSharing}
                onClose={() => { setIsSharing(false); setEditingReflectionId(null); setNewPostContent(''); setSelectedImage(null); }}
                title={editingReflectionId ? "Edit Reflection" : "Share Reflection"}
                actionLabel={editingReflectionId ? "Update" : "Share"}
                onAction={handleShare}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[styles.modalInput, { padding: 0 }]}
                            placeholder="What's on your heart? (No phone numbers or payment requests)"
                            placeholderTextColor={theme.colors.secondaryText}
                            multiline
                            autoFocus
                            value={newPostContent}
                            onChangeText={setNewPostContent}
                        />
                    </View>

                    {selectedImage && (
                        <View style={styles.selectedImageContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.selectedImagePreview} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setSelectedImage(null)}>
                                <X size={16} color={palette.white} />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.modalFooter, { borderTopWidth: 0, paddingHorizontal: 0 }]}>
                        <TouchableOpacity style={styles.modalIconButton} onPress={handlePickImage}>
                            <ImageIcon size={22} color={palette.softGold} />
                            <Typography variant="body" color={palette.softGold} style={{ marginLeft: 8 }}>Add Image</Typography>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </BottomSheet>

            <BottomSheet
                visible={isAddingEvent}
                onClose={() => { setIsAddingEvent(false); setEditingEventId(null); setNewEvent({ title: '', date: '', location: '', price: '', currency: 'USD', capacity: '', tiers: [] }); setShowDatePicker(false); }}
                title={editingEventId ? 'Edit Event' : 'New Event'}
                actionLabel={editingEventId ? 'Update' : 'Create'}
                onAction={handleCreateEvent}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
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
                        <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Platform.OS === 'ios' ? 8 : 12 }]}>
                            <Text style={{ color: newEvent.date ? theme.colors.text : theme.colors.secondaryText, flex: 1 }}>
                                {newEvent.date || 'Date & Time'}
                            </Text>
                            <DateTimePicker
                                value={eventDate}
                                mode="datetime"
                                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                                style={{ width: 180, height: 36 }}
                                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                    if (selectedDate) {
                                        setEventDate(selectedDate);
                                        setNewEvent({
                                            ...newEvent,
                                            date: selectedDate.toLocaleString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })
                                        });
                                    }
                                }}
                            />
                        </View>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={styles.inputLabel}>Ticket</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={[styles.input, { width: 60, height: 32, paddingVertical: 0, fontSize: 13 }]}
                                    placeholder="USD"
                                    value={newEvent.currency}
                                    onChangeText={t => setNewEvent({ ...newEvent, currency: t.toUpperCase() })}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity
                                    style={styles.addTierButton}
                                    onPress={() => {
                                        const newTier = { id: Math.random().toString(36).substr(2, 9), name: '', price: '', capacity: '', ticketsSold: 0 };
                                        setNewEvent({ ...newEvent, tiers: [...(newEvent.tiers || []), newTier] });
                                    }}
                                >
                                    <Plus size={16} color={palette.softGold} />
                                    <Text style={styles.addTierText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {(newEvent.tiers || []).map((tier: any, idx: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                            <View key={tier.id} style={styles.tierRow}>
                                <TextInput
                                    style={[styles.input, { flex: 2, marginRight: 4 }]}
                                    placeholder="Tier Name (e.g. VIP)"
                                    value={tier.name}
                                    onChangeText={t => {
                                        const updated = [...(newEvent.tiers || [])];
                                        updated[idx] = { ...tier, name: t };
                                        setNewEvent({ ...newEvent, tiers: updated });
                                    }}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 4 }]}
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    value={tier.price?.toString() || ''}
                                    onChangeText={t => {
                                        const updated = [...(newEvent.tiers || [])];
                                        updated[idx] = { ...tier, price: t };
                                        setNewEvent({ ...newEvent, tiers: updated });
                                    }}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 4 }]}
                                    placeholder="Cap"
                                    keyboardType="numeric"
                                    value={tier.capacity?.toString() || ''}
                                    onChangeText={t => {
                                        const updated = [...(newEvent.tiers || [])];
                                        updated[idx] = { ...tier, capacity: t };
                                        setNewEvent({ ...newEvent, tiers: updated });
                                    }}
                                />
                                <TouchableOpacity onPress={() => {
                                    const updated = (newEvent.tiers || []).filter((_: any, i: number) => i !== idx); // eslint-disable-line @typescript-eslint/no-explicit-any
                                    setNewEvent({ ...newEvent, tiers: updated });
                                }}>
                                    <X size={18} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </BottomSheet>
            <BottomSheet
                visible={showJoinRequests}
                onClose={() => setShowJoinRequests(false)}
                title="Join Requests"
                actionLabel="Accept All"
                onAction={() => {
                    pendingRequests.forEach(r => handleJoinRequest(circleId, r.userId, 'accept'));
                    setShowJoinRequests(false);
                    Alert.alert("Success", "All seekers have been accepted into the sanctuary.");
                }}
            >
                <TrueNorthFlashList
                    data={pendingRequests}
                    renderItem={({ item }: { item: any }) => renderRequests({ item })}
                    keyExtractor={(item: any) => item.userId}
                    estimatedItemSize={70}
                />
            </BottomSheet>
            <BottomSheet
                visible={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title="Complete Purchase"
            >

                {selectedEventToPay && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.eventTitle}>{selectedEventToPay.title}</Text>
                        {(selectedEventToPay.tiers && selectedEventToPay.tiers.length > 0) ? (
                            <View style={{ marginTop: 12 }}>
                                <Text style={styles.paymentSectionTitle}>Select Ticket Tier</Text>
                                <View style={styles.tierSelector}>
                                    {selectedEventToPay.tiers.map((tier: TicketTier) => (
                                        <TouchableOpacity
                                            key={tier.id}
                                            style={[
                                                styles.tierOption,
                                                selectedTierId === tier.id && styles.tierOptionSelected
                                            ]}
                                            onPress={() => setSelectedTierId(tier.id)}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.tierOptionName, selectedTierId === tier.id && styles.tierOptionTextSelected]}>{tier.name}</Text>
                                                <Text style={styles.tierOptionPrice}>{selectedEventToPay.currency} {tier.price}</Text>
                                            </View>
                                            {selectedTierId === tier.id && <Check size={18} color={palette.ivory} />}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.eventPrice}>{selectedEventToPay.currency} {selectedEventToPay.price}</Text>
                        )}
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
                    style={[
                        styles.payButton,
                        isProcessingPayment && styles.payButtonDisabled,
                        (!!selectedEventToPay?.tiers?.length && !selectedTierId) && styles.payButtonDisabled
                    ]}
                    onPress={async () => {
                        if (!selectedEventToPay) return;

                        if (paymentProvider === 'MPESA' && !paymentPhone) {
                            Alert.alert("Required", "Please enter your M-Pesa phone number.");
                            return;
                        }

                        if (selectedEventToPay?.tiers && selectedEventToPay.tiers.length > 0 && !selectedTierId) {
                            Alert.alert("Selection Required", "Please choose your desired ticket tier.");
                            return;
                        }

                        setIsProcessingPayment(true);

                        try {
                            const selectedTier = selectedEventToPay.tiers?.find((t: TicketTier) => t.id === selectedTierId);
                            const currentPrice = selectedTier ? selectedTier.price : selectedEventToPay.price;
                            const totalAmount = currentPrice * quantity;

                            const result = await paymentService.initializePayment({
                                amount: totalAmount,
                                currency: selectedEventToPay.currency,
                                description: `Ticket for ${selectedEventToPay.title} ${selectedTier ? `(${selectedTier.name})` : ''} (x${quantity})`,
                                provider: paymentProvider,
                                phoneNumber: paymentProvider === 'MPESA' ? paymentPhone : undefined,
                                metadata: {
                                    eventId: selectedEventToPay.id,
                                    circleId: circleId,
                                    userId: userId,
                                    tierId: selectedTierId,
                                    quantity: quantity
                                }
                            });

                            if (result.success) {
                                await purchaseTicket(circleId, selectedEventToPay.id, selectedTierId || undefined, quantity);

                                addNotification({
                                    id: Math.random().toString(36).substr(2, 9),
                                    createdAt: Date.now(),
                                    title: "Ticket Purchased",
                                    message: `You've secured ${quantity} spot${quantity > 1 ? 's' : ''} for ${selectedEventToPay.title}.`,
                                    type: 'event'
                                });


                                setShowPaymentModal(false);
                                Alert.alert(
                                    "Success",
                                    "Ticket purchased successfully! Your spot is secured.",
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    [{ text: "OK", onPress: () => (navigation as any).navigate('Profile') }]
                                );
                            } else {
                                // Alert handled in service for mock
                            }
                        } catch (error) {
                            Alert.alert("Error", "Payment failed. Please try again.");
                        } finally {
                            setIsProcessingPayment(false);
                        }
                    }}
                    disabled={isProcessingPayment || (!!selectedEventToPay?.tiers?.length && !selectedTierId)}
                >
                    <Text style={styles.payButtonText}>
                        {isProcessingPayment ? "Processing..." : `Pay ${selectedEventToPay?.currency} ${((selectedEventToPay?.tiers?.find((t: TicketTier) => t.id === selectedTierId)?.price || selectedEventToPay?.price || 0) * quantity).toLocaleString()}`}
                    </Text>
                </TouchableOpacity>
            </BottomSheet>

            {/* Role Management Modal */}
            < BottomSheet
                visible={showRoleManagement}
                onClose={() => {
                    setShowRoleManagement(false);
                    setRoleSearchQuery('');
                    setFoundUser(null);
                }}
                title="Manage Circle Roles"
            >

                <Text style={styles.inputLabel}>Search seeker by username</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter username..."
                        placeholderTextColor={theme.colors.secondaryText}
                        value={roleSearchQuery}
                        onChangeText={setRoleSearchQuery}
                    />
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => {
                            const user = findUserByUsername(roleSearchQuery);
                            if (user) {
                                setFoundUser(user);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            } else {
                                Alert.alert("Not Found", "We couldn't find a seeker with that username.");
                            }
                        }}
                    >
                        <Search size={20} color={palette.ivory} />
                    </TouchableOpacity>
                </View>

                {
                    foundUser && (
                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.foundUserCard}
                        >
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}><Text style={styles.avatarText}>{foundUser.username[0]}</Text></View>
                                <Text style={styles.userName}>{foundUser.username}</Text>
                            </View>

                            <View style={styles.rolePicker}>
                                {(['member', 'moderator', 'validator', 'admin'] as const).map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            styles.roleOption,
                                            selectedRole === role && styles.roleOptionSelected
                                        ]}
                                        onPress={() => setSelectedRole(role)}
                                    >
                                        <Text style={[
                                            styles.roleOptionText,
                                            selectedRole === role && styles.roleOptionTextSelected
                                        ]}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={styles.assignButton}
                                onPress={() => {
                                    setCircleRole(circleId, foundUser.userId, selectedRole);
                                    Alert.alert("Success", `${foundUser.username} is now a ${selectedRole} in this sanctuary.`);
                                    setShowRoleManagement(false);
                                    setRoleSearchQuery('');
                                    setFoundUser(null);
                                }}
                            >
                                <Text style={styles.assignButtonText}>Assign Role</Text>
                            </TouchableOpacity>
                        </MotiView>
                    )
                }
            </BottomSheet >

            <ChoiceModal
                visible={showChoiceModal}
                onClose={() => setShowChoiceModal(false)}
                title={choiceModalConfig.title}
                message={choiceModalConfig.message}
                options={choiceModalConfig.options}
            />
        </View >

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
    eventList: { paddingBottom: theme.spacing.lg, paddingLeft: theme.spacing.xxl, paddingRight: theme.spacing.xxl },

    eventCard: {
        width: 280, backgroundColor: theme.colors.surface, borderRadius: 20,
        padding: 20, borderWidth: 1, borderColor: theme.colors.border,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
        marginRight: theme.spacing.lg
    },
    eventInfo: { flex: 1 },
    eventTitle: { fontFamily: theme.typography.sansBold, fontSize: 17, color: theme.colors.text, marginBottom: 8 },
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
    modalIconText: { fontFamily: theme.typography.sansMedium, fontSize: 15 },
    inputGroup: { marginBottom: theme.spacing.lg },
    inputLabel: { fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText, marginBottom: 8, textTransform: 'uppercase' },
    input: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: theme.spacing.md,
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border
    },
    eventPrice: { fontFamily: theme.typography.sansBold, fontSize: 13, color: palette.softGold, marginTop: 4 },
    eventDetails: { gap: 6 },
    eventDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    eventDetailText: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    eventStatus: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border },
    eventStatusActive: { backgroundColor: palette.success, borderColor: palette.success },
    eventStatusAdmin: { borderColor: palette.softGold, backgroundColor: 'rgba(200, 169, 90, 0.05)' },
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
    userNameContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    adminBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: palette.softGold, paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 4
    },
    adminBadgeText: { fontFamily: theme.typography.sansBold, fontSize: 10, color: palette.ivory, textTransform: 'uppercase' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    searchInput: {
        flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12,
        padding: 12, fontFamily: theme.typography.sans, fontSize: 16,
        color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border
    },
    searchButton: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center'
    },
    foundUserCard: {
        backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: theme.colors.border
    },
    rolePicker: { flexDirection: 'row', gap: 10, marginVertical: 20 },
    roleOption: {
        flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1,
        borderColor: theme.colors.border, alignItems: 'center'
    },
    roleOptionSelected: { borderColor: palette.softGold, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    roleOptionText: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.secondaryText },
    roleOptionTextSelected: { color: palette.softGold, fontFamily: theme.typography.sansBold },
    assignButton: {
        backgroundColor: palette.softGold, borderRadius: 12, paddingVertical: 14,
        alignItems: 'center'
    },
    assignButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory },
    selectedImageContainer: { position: 'relative', marginVertical: 10, width: 100, height: 100 },
    selectedImagePreview: { width: '100%', height: '100%', borderRadius: 10 },
    removeImageBtn: {
        position: 'absolute', top: -5, right: -5, backgroundColor: 'rgba(0,0,0,0.5)',
        width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
    },
    requestUserInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 },
    requestUsername: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text },
    requestActions: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    requestActionBtn: {
        width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.colors.border
    },
    acceptBtn: { backgroundColor: palette.success, borderColor: palette.success },
    rejectBtn: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
    tierRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 4 },
    tierSelector: { gap: 10, marginTop: 10 },
    tierOption: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        borderRadius: 12, backgroundColor: theme.colors.background,
        borderWidth: 1, borderColor: theme.colors.border
    },
    tierOptionSelected: { borderColor: palette.softGold, backgroundColor: 'rgba(212, 175, 55, 0.05)' },
    tierOptionName: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: theme.colors.text },
    tierOptionTextSelected: { color: palette.softGold, fontFamily: theme.typography.sansBold },
    tierOptionPrice: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText },
    payButtonDisabled: { opacity: 0.5 },
    addTierButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
        marginLeft: 12
    },
    addTierText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 13,
        color: palette.softGold,
    }
});
