import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { useStore, ChatMessage } from '../../store';
import { NurAIService } from '../../services/NurAIService';
import { ChevronLeft, Send, Sparkles, AlertCircle, TrendingUp, ShieldCheck, Lock, MessageSquare, Calendar, ArrowRight, MapPin, Users as UsersIcon, Clock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { SubscriptionScreen } from '../profile/SubscriptionScreen';
import { useRoute } from '@react-navigation/native';
import { CircleEvent } from '../../store';

export const AskNurScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { nurChats, addNurMessage, clearNurChat, username, subscriptionTier, createdCircles, beliefType, themes } = useStore();

    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flatListRef = useRef<any>(null);

    // Paywall Check
    const isSubscriber = subscriptionTier === 'true_north' || subscriptionTier === 'zenith';

    if (!isSubscriber) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Ask Nur</Text>
                        <Lock size={16} color={theme.colors.secondaryText} style={{ marginTop: 4 }} />
                    </View>
                    <View style={{ width: 28 }} />
                </View>
                <SubscriptionScreen />
            </View>
        );
    }

    // Daily Reset & Greeting Logic
    useEffect(() => {
        if (!isSubscriber) return;

        const checkDailyReset = async () => {
            const today = new Date().toDateString();
            const lastMsg = nurChats[nurChats.length - 1];

            // Check if last message was from a previous day
            const lastMsgDate = lastMsg ? new Date(lastMsg.timestamp).toDateString() : null;
            const needsReset = lastMsgDate !== today;

            if (needsReset) {
                clearNurChat(); // Clear previous history

                // Get Daily Wisdom for context
                try {
                    // Ideally fetch from store or service. For now mock or try to grab recently stored.
                    // We'll simulate fetching the daily affirmation shown to the user.
                    // In a real scenario, DailyRitualService.getDailyAffirmation() would return the *current* one.
                    const dailyAffirmation = "Faith is taking the first step even when you don't see the whole staircase.";

                    const greetingText = NurAIService.getDailyGreeting(username, dailyAffirmation);

                    const initialGreeting: ChatMessage = {
                        id: 'init-' + Date.now(),
                        role: 'assistant',
                        content: greetingText,
                        timestamp: Date.now(),
                        mode: 'affirmation'
                    };
                    addNurMessage(initialGreeting);
                } catch (e) {
                    console.warn("Failed to generate daily greeting", e);
                }
            } else if (nurChats.length === 0) {
                // Fallback if empty but same day (unlikely unless manually cleared)
                const greetingText = NurAIService.getDailyGreeting(username);
                const initialGreeting: ChatMessage = {
                    id: 'init-' + Date.now(),
                    role: 'assistant',
                    content: greetingText,
                    timestamp: Date.now(),
                    mode: 'affirmation'
                };
                addNurMessage(initialGreeting);
            }
        };

        checkDailyReset();
    }, [isSubscriber]); // Run on mount or sub change

    // Handle deep-linked events
    useEffect(() => {
        if (route.params?.showEvents) {
            // Find relevant events
            const relevantEvents: Array<{ event: CircleEvent, circleId: string, circleName: string }> = [];

            createdCircles.forEach(circle => {
                // If it aligns with belief OR themes
                const alignsBelief = circle.belief === beliefType;
                const alignsTheme = themes.some(t => circle.description?.includes(t) || circle.name.includes(t));

                if (alignsBelief || alignsTheme) {
                    circle.events?.forEach(event => {
                        relevantEvents.push({ event, circleId: circle.id, circleName: circle.name });
                    });
                }
            });

            if (relevantEvents.length > 0) {
                const eventMsg: ChatMessage = {
                    id: 'events-' + Date.now(),
                    role: 'assistant',
                    content: "I've found some gatherings that might resonate with your journey today. Would you like to explore them?",
                    timestamp: Date.now(),
                    mode: 'affirmation',
                    metadata: { events: relevantEvents }
                };
                addNurMessage(eventMsg);
                // Clear params so it doesn't re-trigger
                navigation.setParams({ showEvents: undefined });
            }
        }
    }, [route.params?.showEvents, beliefType, themes, createdCircles]);

    // Auto-scroll
    useEffect(() => {
        if (nurChats.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [nurChats.length]);

    const handleSuggestion = (text: string) => {
        setInputText(text);
        // Optional: auto-send
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText.trim(),
            timestamp: Date.now()
        };

        addNurMessage(userMsg);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await NurAIService.generateResponse(userMsg.content);
            addNurMessage(response);
        } catch (error) {
            console.error("Nur Error:", error);
            const errorMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to my inner guidance right now. Please try again in a moment.",
                timestamp: Date.now(),
                mode: 'affirmation'
            };
            addNurMessage(errorMsg);
        } finally {
            setIsTyping(false);
        }
    };

    const handleRealityCheck = async () => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: "Give me a Reality Check.",
            timestamp: Date.now()
        };
        addNurMessage(userMsg);
        setIsTyping(true);
        try {
            const response = await NurAIService.generateResponse("reality check");
            addNurMessage(response);
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const message = item as ChatMessage;
        const isUser = message.role === 'user';

        // Mode indicator for AI messages
        let TypeIcon = Sparkles;
        let modeColor = palette.softGold;

        if (message.mode === 'accountability') { TypeIcon = AlertCircle; modeColor = theme.colors.error; }
        else if (message.mode === 'strategic') { TypeIcon = TrendingUp; modeColor = theme.colors.success; }
        else if (message.mode === 'mirror') { TypeIcon = ShieldCheck; modeColor = palette.charcoal; }

        return (
            <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.aiMessage,
                    !isUser && message.mode === 'accountability' && styles.accountabilityMessage
                ]}
            >
                {!isUser && (
                    <View style={styles.aiHeader}>
                        <TypeIcon size={12} color={modeColor} />
                        <Text style={[styles.aiModeText, { color: modeColor }]}>
                            {message.mode ? message.mode.toUpperCase() : 'NUR'}
                        </Text>
                    </View>
                )}
                <Text style={[styles.messageText, isUser && styles.userMessageText]}>{message.content}</Text>

                {/* Event Cards */}
                {message.metadata?.events && (
                    <View style={styles.eventCardsContainer}>
                        {(message.metadata.events as any[]).map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.eventCard}
                                onPress={() => navigation.navigate('CircleDetail', { circleId: item.circleId })}
                            >
                                <View style={styles.eventCardHeader}>
                                    <View style={[styles.eventIcon, { backgroundColor: palette.softGold + '20' }]}>
                                        <Calendar size={16} color={palette.softGold} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.eventTitle} numberOfLines={1}>{item.event.title}</Text>
                                        <Text style={styles.eventCircleName} numberOfLines={1}>{item.circleName}</Text>
                                    </View>
                                </View>

                                <View style={styles.eventDetails}>
                                    <View style={styles.eventDetailRow}>
                                        <Clock size={12} color={theme.colors.secondaryText} />
                                        <Text style={styles.eventDetailText}>{item.event.date}</Text>
                                    </View>
                                    {item.event.location && (
                                        <View style={styles.eventDetailRow}>
                                            <MapPin size={12} color={theme.colors.secondaryText} />
                                            <Text style={styles.eventDetailText} numberOfLines={1}>{item.event.location}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.eventFooter}>
                                    <Text style={styles.eventPrice}>{item.event.price > 0 ? `${item.event.currency} ${item.event.price}` : 'Free'}</Text>
                                    <View style={styles.viewEventButton}>
                                        <Text style={styles.viewEventText}>View</Text>
                                        <ArrowRight size={14} color={palette.softGold} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </MotiView>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Ask Nur</Text>
                    <Text style={styles.headerSubtitle}>AI Companion</Text>
                </View>
                <TouchableOpacity onPress={clearNurChat}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {/* Chat Area or Intro */}
            {nurChats.length === 0 ? (
                <View style={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Sparkles size={40} color={palette.ivory} />
                    </View>
                    <Text style={styles.introTitle}>Salam, {username || 'Traveler'}</Text>
                    <Text style={styles.introSubtitle}>
                        I am Nur, your spiritual companion.{"\n"}
                        I'm here to listen, reflect, and help you align with your True North.
                    </Text>

                    <View style={styles.suggestionContainer}>
                        <TouchableOpacity style={styles.suggestionButton} onPress={() => handleSuggestion("I feel overwhelmed today.")}>
                            <Text style={styles.suggestionText}>"I feel overwhelmed today."</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.suggestionButton} onPress={() => handleSuggestion("Help me plan my spiritual goals.")}>
                            <Text style={styles.suggestionText}>"Help me plan my spiritual goals."</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.suggestionButton} onPress={() => handleSuggestion("Give me a reality check on my habits.")}>
                            <Text style={styles.suggestionText}>"Give me a reality check."</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TrueNorthFlashList
                    ref={flatListRef}
                    data={nurChats}
                    renderItem={renderMessage}
                    keyExtractor={(item: any) => item.id}
                    estimatedItemSize={100}
                    contentContainerStyle={styles.chatContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
            )}

            {/* Typing Indicator */}
            {isTyping && (
                <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color={palette.softGold} />
                    <Text style={styles.typingText}>Nur is reflecting...</Text>
                </View>
            )}

            {/* Action Bar (Reality Check) */}
            {!isTyping && nurChats.length > 0 && (
                <View style={styles.actionBar}>
                    <TouchableOpacity style={styles.quickAction} onPress={handleRealityCheck}>
                        <ShieldCheck size={14} color={palette.ivory} />
                        <Text style={styles.quickActionText}>Reality Check</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Share your thoughts..."
                        placeholderTextColor={theme.colors.secondaryText}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isTyping}
                    >
                        <Send size={20} color={palette.ivory} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { padding: 4 },
    headerTitleContainer: { alignItems: 'center' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text },
    headerSubtitle: { fontFamily: theme.typography.sans, fontSize: 12, color: palette.softGold },
    clearText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText },

    chatContent: { padding: 16, paddingBottom: 20 },
    messageContainer: {
        maxWidth: '85%', borderRadius: 16, padding: 12, marginBottom: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
    },
    userMessage: {
        alignSelf: 'flex-end', backgroundColor: palette.softGold, borderBottomRightRadius: 4
    },
    aiMessage: {
        alignSelf: 'flex-start', backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4,
        borderWidth: 1, borderColor: theme.colors.border
    },
    accountabilityMessage: {
        borderLeftColor: theme.colors.error, borderLeftWidth: 3
    },
    messageText: { fontFamily: theme.typography.sans, fontSize: 15, color: theme.colors.text, lineHeight: 22 },
    userMessageText: { color: palette.ivory },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    aiModeText: { fontFamily: theme.typography.sansBold, fontSize: 10, letterSpacing: 0.5 },
    timestamp: {
        fontFamily: theme.typography.sans, fontSize: 10, color: theme.colors.secondaryText,
        marginTop: 4, alignSelf: 'flex-end'
    },
    userTimestamp: { color: 'rgba(255,255,255,0.7)' },

    typingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10, gap: 8 },
    typingText: { fontFamily: theme.typography.sansMedium, fontSize: 12, color: theme.colors.secondaryText },

    actionBar: {
        flexDirection: 'row', justifyContent: 'center', paddingBottom: 8
    },
    quickAction: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: palette.charcoal, // Fixed: removed invalid 'slice' property
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20
    },
    quickActionText: { fontFamily: theme.typography.sansBold, fontSize: 12, color: palette.ivory },

    inputContainer: {
        flexDirection: 'row', alignItems: 'flex-end', padding: 12,
        backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border
    },
    input: {
        flex: 1, backgroundColor: theme.colors.background, borderRadius: 20,
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100,
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text
    },
    sendButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginBottom: 2
    },
    sendButtonDisabled: { opacity: 0.5 },

    // Intro Styles
    introContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, opacity: 0.8
    },
    introIcon: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: palette.softGold,
        alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10
    },
    introTitle: {
        fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginBottom: 8, textAlign: 'center'
    },
    introSubtitle: {
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText, textAlign: 'center', marginBottom: 32, lineHeight: 24
    },
    suggestionContainer: { width: '100%', gap: 12 },
    suggestionButton: {
        padding: 16, backgroundColor: theme.colors.surface, borderRadius: 12,
        borderWidth: 1, borderColor: theme.colors.border
    },
    suggestionText: {
        fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.text, textAlign: 'center'
    },

    // Event Card Styles
    eventCardsContainer: {
        marginTop: 12,
        gap: 12
    },
    eventCard: {
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        width: 240,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    eventCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8
    },
    eventIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventTitle: {
        fontFamily: theme.typography.sansBold,
        fontSize: 14,
        color: theme.colors.text
    },
    eventCircleName: {
        fontFamily: theme.typography.sans,
        fontSize: 11,
        color: theme.colors.secondaryText
    },
    eventDetails: {
        gap: 6,
        marginBottom: 10,
        paddingLeft: 2
    },
    eventDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    eventDetailText: {
        fontFamily: theme.typography.sans,
        fontSize: 11,
        color: theme.colors.secondaryText
    },
    eventFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border
    },
    eventPrice: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: theme.colors.primary
    },
    viewEventButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    viewEventText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 12,
        color: palette.softGold
    }
});
