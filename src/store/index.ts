import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NurChatService } from '../services/NurChatService';

export type UserRole = 'member' | 'moderator' | 'admin' | 'platform_admin' | 'validator';
import { BeliefType } from '../types';
export type { BeliefType };

export const SUPER_ADMIN_EMAILS = [
    'remyngatia@gmail.com',
    'remy_shiznitt@hotmail.com'
];

export interface DailyGoals {
    dailyReflection: boolean;
    morningDevotion: boolean;
    eveningGratitude: boolean;
    weeklyCommunity: boolean;
}

export interface PlatformFeatures {
    events: boolean;
    ticketing: boolean;
    contentAgent: boolean;
    askNur: boolean;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    mode?: 'affirmation' | 'accountability' | 'strategic' | 'mirror';
    metadata?: {
        events?: Array<{
            event: unknown;
            circleId: string;
            circleName: string;
        }>;
        [key: string]: unknown;
    };
}

export interface CommunityNews {
    id: string;
    title: string;
    content: string;
    active: boolean;
    createdAt: number;
}

export interface NotificationSettings {
    enabled: boolean;
    time: string;
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'affirmation' | 'blessing' | 'event' | 'community';
    createdAt: number;
}

export interface TicketTier {
    id: string;
    name: string;
    price: number;
    capacity: number;
    ticketsSold: number;
}

export interface CircleEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number; // For backward compatibility / single tier
    currency: string;
    capacity: number; // For backward compatibility / single tier
    ticketsSold: number;
    tiers?: TicketTier[];
}

export interface UserTicket {
    id: string;
    eventId: string;
    circleId: string;
    eventTitle: string;
    eventDate: string;
    qrCodeData: string;
    status: 'valid' | 'used';
    purchaseDate: number;
    userName: string;
    tierId?: string;
    tierName?: string;
}



export interface Reflection {
    id: string;
    content: string;
    user?: string;
    userName: string;
    userId?: string;
    blessings: number;
    time: string;
    image?: string | null;
    createdAt: number;
    isFlagged?: boolean;
    flagReason?: string;
}

export interface CreatedCircle {
    id: string;
    name: string;
    belief: BeliefType;
    members: number;
    type: 'Public' | 'Private';
    city: string;
    country: string;
    description: string;
    lastActivity: string;
    reflections: Reflection[];

    createdAt: number;
    theme?: string;
    adminIds: string[];
    moderatorIds: string[];
    validatorIds?: string[];
    joinRequests?: { userId: string, username: string, status: 'pending' | 'accepted' | 'rejected' }[];
    events?: CircleEvent[];
}



export interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    tags?: string[];
}

export interface UserGoals {
    [key: string]: string | undefined;
    spirituality: string;
    spouse: string;
    career: string;
    business: string;
    health: string;
    family: string;
    children: string;
    friends: string;
    finances: string;
}

interface UserState {
    isOnboarded: boolean;
    onboardingStep: number;
    subscriptionTier: 'free' | 'compass' | 'true_north' | 'zenith';
    username: string;
    email: string | null;
    profilePicture: string | null;
    role: UserRole;
    userId: string | null;
    isLoggedIn: boolean;
    biometricsEnabled: boolean;
    securityPin: string | null;
    beliefType: BeliefType | null;
    themes: string[];
    userGoals: UserGoals;
    dateOfBirth: string | null;
    astrologyEnabled: boolean;
    dailyGoals: {
        dailyReflection: boolean;
        morningDevotion: boolean;
        eveningGratitude: boolean;
        weeklyCommunity: boolean;
    };
    notifications: NotificationSettings;
    lastAdviceTimestamp: number | null;
    lastNurEventNotification: number | null;
    bookmarkedCircleIds: string[];
    notificationsList: NotificationItem[];
    createdCircles: CreatedCircle[];
    journalEntries: JournalEntry[];
    userTickets: UserTicket[];
    blockedUserIds: string[];
    blockedCircleIds: string[];
    platformFeatures: PlatformFeatures;
    communityNews: CommunityNews[];
    nurChats: ChatMessage[];
    isSessionUnlocked: boolean;
    hasSeenUserGuide: boolean;
    onboardedAt: number | null;

    setOnboarded: (value: boolean) => Promise<void>;
    setOnboardingStep: (step: number) => void;
    setHasSeenUserGuide: (value: boolean) => void;
    setSubscriptionTier: (tier: 'free' | 'compass' | 'true_north' | 'zenith') => Promise<void>;
    setUsername: (username: string) => void;
    setEmail: (email: string | null) => void;
    setProfilePicture: (uri: string | null) => void;
    setRole: (role: UserRole) => void;
    setUserId: (userId: string | null) => void;
    setLoggedIn: (value: boolean) => void;
    setBiometricsEnabled: (value: boolean) => void;
    setSecurityPin: (pin: string | null) => void;
    setBeliefType: (belief: BeliefType | null) => void;
    setThemes: (themes: string[]) => void;
    setUserGoals: (goals: UserGoals) => void;
    setDateOfBirth: (dob: string | null) => void;
    setAstrologyEnabled: (enabled: boolean) => void;
    setPreferences: (belief: BeliefType, themes: string[], goals: DailyGoals) => void;
    updateNotificationSettings: (enabled: boolean, time: string) => void;
    addCreatedCircle: (circle: CreatedCircle) => void;
    deleteCreatedCircle: (circleId: string) => void;
    flagCircle: (circleId: string) => void;
    toggleBookmark: (circleId: string) => void;
    setLastAdviceTimestamp: (timestamp: number) => void;
    setLastNurEventNotification: (timestamp: number) => void;
    addNotification: (notification: NotificationItem) => void;
    deleteNotification: (id: string) => void;
    cleanupOldNotifications: () => void;
    toggleDailyGoal: (key: keyof DailyGoals) => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id'> & { id?: string }) => void;
    updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;
    deleteJournalEntry: (id: string) => void;
    blockUser: (userId: string) => void;
    unblockUser: (userId: string) => void;
    blockCircle: (circleId: string) => void;
    unblockCircle: (circleId: string) => void;
    joinCircle: (circleId: string) => void;
    handleJoinRequest: (circleId: string, userId: string, action: 'accept' | 'reject') => void;
    setCircleRole: (circleId: string, userId: string, role: 'admin' | 'moderator' | 'member' | 'validator') => void;
    addCircleEvent: (circleId: string, event: Omit<CircleEvent, 'id' | 'ticketsSold'>) => void;
    updateCircleEvent: (circleId: string, eventId: string, event: Partial<Omit<CircleEvent, 'id' | 'ticketsSold'>>) => void;
    deleteCircleEvent: (circleId: string, eventId: string) => void;
    purchaseTicket: (circleId: string, eventId: string, tierId?: string, quantity?: number) => void;
    validateTicket: (ticketId: string) => { success: boolean, message: string };
    findUserByUsername: (username: string) => { userId: string, username: string } | null;
    addCircleReflection: (circleId: string, reflection: Reflection) => void;
    updateCircleReflection: (circleId: string, reflectionId: string, content: string, image?: string | null) => void;
    deleteCircleReflection: (circleId: string, reflectionId: string) => void;
    togglePlatformFeature: (feature: keyof PlatformFeatures) => void;
    addCommunityNews: (news: Omit<CommunityNews, 'id' | 'createdAt'>) => void;
    updateCommunityNews: (id: string, updates: Partial<CommunityNews>) => void;
    deleteCommunityNews: (id: string) => void;
    addNurMessage: (message: ChatMessage) => void;
    clearNurChat: () => void;
    syncNurChats: () => Promise<void>;
    setSessionUnlocked: (unlocked: boolean) => void;
    reset: () => void;
    logout: () => void;
}



export const useStore = create<UserState>()(
    persist(
        (set) => ({
            isOnboarded: false,
            onboardingStep: 0,
            subscriptionTier: 'free',
            username: '',
            email: null,
            profilePicture: null,
            role: 'member',
            userId: 'user-123',
            isLoggedIn: true, // Default to true for demo flow
            biometricsEnabled: false,
            securityPin: null,
            beliefType: 'Christian',
            themes: ['Faith', 'Perseverance', 'Gratitude'],
            dateOfBirth: null,
            astrologyEnabled: false,
            userGoals: {
                spirituality: '',
                spouse: '',
                career: '',
                business: '',
                health: '',
                family: '',
                children: '',
                friends: '',
                finances: ''
            },
            selectedTheme: 'Strength',
            dailyGoals: {
                dailyReflection: false,
                morningDevotion: false,
                eveningGratitude: false,
                weeklyCommunity: false,
            },
            notifications: {
                enabled: true,
                time: '07:30',
            },
            lastAdviceTimestamp: null,
            lastNurEventNotification: null,
            bookmarkedCircleIds: [],
            notificationsList: [],
            createdCircles: [],
            journalEntries: [],
            userTickets: [],
            blockedUserIds: [],
            blockedCircleIds: [],
            platformFeatures: {
                events: true,
                ticketing: true,
                contentAgent: true,
                askNur: false // Disabled by default
            },
            communityNews: [],
            nurChats: [],
            isSessionUnlocked: false,
            hasSeenUserGuide: false,
            onboardedAt: null,
            setOnboarded: async (isOnboarded: boolean) => {
                set((state) => ({ 
                    isOnboarded,
                    onboardedAt: (isOnboarded && !state.onboardedAt) ? Date.now() : state.onboardedAt
                }));
                if (isOnboarded) set({ onboardingStep: 0 }); // Reset on completion
            },
            setOnboardingStep: (onboardingStep: number) => set({ onboardingStep }),
            setHasSeenUserGuide: (hasSeenUserGuide: boolean) => set({ hasSeenUserGuide }),
            reset: () => {
                set({
                    isOnboarded: false,
                    onboardingStep: 0,
                    isLoggedIn: false,
                    subscriptionTier: 'free',
                    username: '',
                    profilePicture: null,
                    biometricsEnabled: false,
                    securityPin: null,
                    beliefType: 'Christian',
                    themes: ['Faith', 'Perseverance', 'Gratitude'],
                    userGoals: {
                        spirituality: '',
                        spouse: '',
                        career: '',
                        business: '',
                        health: '',
                        family: '',
                        children: '',
                        friends: '',
                        finances: ''
                    },
                    dateOfBirth: null,
                    astrologyEnabled: false,
                    dailyGoals: {
                        dailyReflection: true,
                        morningDevotion: true,
                        eveningGratitude: true,
                        weeklyCommunity: true,
                    },
                    blockedUserIds: [],
                    blockedCircleIds: [],
                    userTickets: [],
                    platformFeatures: {
                        events: true,
                        ticketing: true,
                        contentAgent: true,
                        askNur: true,
                    },
                    communityNews: [],
                    nurChats: [],
                    hasSeenUserGuide: false,
                });

            },
            setUserId: (userId) => set({ userId }),
            setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
            setBiometricsEnabled: (biometricsEnabled) => set({ biometricsEnabled }),
            setSecurityPin: (securityPin) => set({ securityPin }),
            setSubscriptionTier: async (tier: 'free' | 'compass' | 'true_north' | 'zenith') => {
                set({ subscriptionTier: tier });
            },
            setUsername: (username) => set({ username }),
            setEmail: (email) => set({ email }),
            setProfilePicture: (profilePicture) => set({ profilePicture }),
            setRole: (role) => set({ role }),
            setBeliefType: (beliefType) => set({ beliefType }),
            setThemes: (themes) => set({ themes }),
            setUserGoals: (goals) => set({ userGoals: goals }),
            setDateOfBirth: (dateOfBirth) => set({ dateOfBirth }),
            setAstrologyEnabled: (astrologyEnabled) => set({ astrologyEnabled }),
            setPreferences: (belief, themes, dailyGoals) => set({ beliefType: belief, themes, dailyGoals }),
            updateNotificationSettings: (enabled, time) => set({ notifications: { enabled, time } }),
            addCreatedCircle: (circle) => set((state) => ({
                createdCircles: [{
                    ...circle,
                    adminIds: circle.adminIds || [state.userId || 'creator'],
                    moderatorIds: circle.moderatorIds || []
                }, ...state.createdCircles]
            })),

            deleteCreatedCircle: (circleId) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                const newCreatedCircles = state.createdCircles.filter(c => c.id !== circleId);

                // Add notification about deletion
                if (circle) {
                    const notification: NotificationItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        title: 'Sanctuary Closed',
                        message: `The sanctuary "${circle.name}" has been closed by the admin.`,
                        type: 'community',
                        createdAt: Date.now()
                    };
                    return {
                        createdCircles: newCreatedCircles,
                        notificationsList: [notification, ...state.notificationsList]
                    };
                }
                return { createdCircles: newCreatedCircles };
            }),
            flagCircle: (circleId) => {
                console.log('Flagging circle:', circleId);
                // In a real app, this would send to a moderation API
                // For now, we simulate the logic in the component but could store flag state here
            },
            toggleBookmark: (circleId) => set((state) => ({
                bookmarkedCircleIds: state.bookmarkedCircleIds.includes(circleId)
                    ? state.bookmarkedCircleIds.filter(id => id !== circleId)
                    : [...state.bookmarkedCircleIds, circleId]
            })),
            setLastAdviceTimestamp: (lastAdviceTimestamp) => set({ lastAdviceTimestamp }),
            setLastNurEventNotification: (lastNurEventNotification) => set({ lastNurEventNotification }),
            addNotification: (notification) => set((state) => ({
                notificationsList: [{ ...notification, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }, ...state.notificationsList]
            })),
            deleteNotification: (id) => set((state) => ({
                notificationsList: state.notificationsList.filter(n => n.id !== id)
            })),
            cleanupOldNotifications: () => set((state) => {
                const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
                const now = Date.now();
                return {
                    notificationsList: state.notificationsList.filter(n => (now - n.createdAt) < SEVEN_DAYS_MS)
                };
            }),
            toggleDailyGoal: (key) => set((state) => ({
                dailyGoals: {
                    ...state.dailyGoals,
                    [key]: !state.dailyGoals[key as keyof typeof state.dailyGoals]
                }
            })),
            addJournalEntry: (entry) => set((state) => ({
                journalEntries: [{ ...entry, id: entry.id || Math.random().toString(36).substr(2, 9) }, ...state.journalEntries]
            })),
            updateJournalEntry: (id, entry) => set((state) => ({
                journalEntries: state.journalEntries.map(e => e.id === id ? { ...e, ...entry } : e)
            })),
            deleteJournalEntry: (id) => set((state) => ({
                journalEntries: state.journalEntries.filter(e => e.id !== id)
            })),
            blockUser: (userId) => set((state) => ({
                blockedUserIds: [...state.blockedUserIds, userId]
            })),
            unblockUser: (userId) => set((state) => ({
                blockedUserIds: state.blockedUserIds.filter(id => id !== userId)
            })),
            blockCircle: (circleId) => set((state) => ({
                blockedCircleIds: [...state.blockedCircleIds, circleId]
            })),
            unblockCircle: (circleId) => set((state) => ({
                blockedCircleIds: state.blockedCircleIds.filter(id => id !== circleId)
            })),
            joinCircle: (circleId) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                if (!circle) return state;

                if (circle.type === 'Public') {
                    return {
                        createdCircles: state.createdCircles.map(c =>
                            c.id === circleId ? { ...c, members: c.members + 1 } : c
                        )
                    };
                } else {
                    const request = {
                        userId: state.userId || 'anon',
                        username: state.username || 'Anonymous',
                        status: 'pending' as 'pending' | 'accepted' | 'rejected'
                    };
                    return {
                        createdCircles: state.createdCircles.map(c =>
                            c.id === circleId ? { ...c, joinRequests: [...(c.joinRequests || []), request] } : c
                        )
                    };
                }
            }),
            handleJoinRequest: (circleId, userId, action) => set((state) => ({
                createdCircles: state.createdCircles.map(c => {
                    if (c.id !== circleId) return c;
                    const requests = (c.joinRequests || []).map(r =>
                        r.userId === userId ? { ...r, status: (action === 'accept' ? 'accepted' : 'rejected') as 'pending' | 'accepted' | 'rejected' } : r
                    );
                    return {
                        ...c,
                        joinRequests: requests,
                        members: action === 'accept' ? c.members + 1 : c.members
                    };
                })
            })),

            setCircleRole: (circleId: string, userId: string, role: 'admin' | 'moderator' | 'member' | 'validator') => set((state) => {
                let circleName = '';
                const newCircles = state.createdCircles.map(c => {
                    if (c.id !== circleId) return c;
                    circleName = c.name;
                    const admins = c.adminIds.filter(id => id !== userId);
                    const mods = c.moderatorIds.filter(id => id !== userId);
                    const validators = (c.validatorIds || []).filter(id => id !== userId);

                    if (role === 'admin') admins.push(userId);
                    else if (role === 'moderator') mods.push(userId);
                    else if (role === 'validator') validators.push(userId);

                    return { ...c, adminIds: admins, moderatorIds: mods, validatorIds: validators };
                });

                // Trigger Notification
                const notification: NotificationItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'Role Update',
                    message: `You have been assigned the role of ${role} in ${circleName || 'the circle'}.`,
                    type: 'community',
                    createdAt: Date.now()
                };

                return {
                    createdCircles: newCircles,
                    notificationsList: [notification, ...state.notificationsList]
                };
            }),

            addCircleEvent: (circleId, event) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                const notification: NotificationItem = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: 'New Event',
                    message: `New event "${event.title}" created in ${circle?.name || 'your circle'}.`,
                    type: 'event',
                    createdAt: Date.now()
                };

                return {
                    createdCircles: state.createdCircles.map(c =>
                        c.id === circleId ? {
                            ...c,
                            events: [...(c.events || []), { ...event, id: Math.random().toString(36).substr(2, 9), ticketsSold: 0 }]
                        } : c
                    ),
                    notificationsList: [notification, ...state.notificationsList]
                };
            }),
            updateCircleEvent: (circleId, eventId, event) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                const notification: NotificationItem = {
                    id: Math.random().toString(34).substr(2, 9),
                    title: 'Event details updated',
                    message: `${circle?.name || 'A sanctuary'} has updated the event: ${event.title}`,
                    type: 'event',
                    createdAt: Date.now()
                };

                return {
                    createdCircles: state.createdCircles.map(c =>
                        c.id === circleId ? {
                            ...c,
                            events: c.events?.map(e => e.id === eventId ? { ...e, ...event } : e)
                        } : c
                    ),
                    notificationsList: [notification, ...state.notificationsList]
                };
            }),
            deleteCircleEvent: (circleId, eventId) => set((state) => ({
                createdCircles: state.createdCircles.map(c =>
                    c.id === circleId ? {
                        ...c,
                        events: c.events?.filter(e => e.id !== eventId)
                    } : c
                )
            })),

            purchaseTicket: (circleId: string, eventId: string, tierId?: string, quantity = 1) => set((state) => {
                const circle = state.createdCircles.find(c => c.id === circleId);
                const event = circle?.events?.find(e => e.id === eventId);
                if (!circle || !event) return state;

                const tier = tierId ? event.tiers?.find(t => t.id === tierId) : null;
                const _price = tier ? tier.price : event.price;
                const tierName = tier ? tier.name : undefined;

                const newTickets: UserTicket[] = [];
                for (let i = 0; i < quantity; i++) {
                    const ticketId = Math.random().toString(36).substr(2, 9);
                    newTickets.push({
                        id: ticketId,
                        eventId,
                        circleId,
                        eventTitle: event.title,
                        eventDate: event.date,
                        qrCodeData: `tn-ticket-${circleId}-${eventId}-${ticketId}`,
                        status: 'valid',
                        purchaseDate: Date.now(),
                        userName: state.username || 'Anonymous Seeker',
                        tierId,
                        tierName
                    });
                }

                return {
                    userTickets: [...state.userTickets, ...newTickets],
                    createdCircles: state.createdCircles.map(c =>
                        c.id === circleId ? {
                            ...c,
                            events: c.events?.map(e =>
                                e.id === eventId ? {
                                    ...e,
                                    ticketsSold: e.ticketsSold + quantity,
                                    tiers: e.tiers?.map(t =>
                                        t.id === tierId ? { ...t, ticketsSold: t.ticketsSold + quantity } : t
                                    )
                                } : e
                            )
                        } : c
                    )
                };
            }),
            validateTicket: (ticketId: string) => {
                let result = { success: false, message: 'Ticket not found' };
                set((state) => {
                    const ticket = state.userTickets.find(t => t.id === ticketId);
                    if (!ticket) return state;
                    if (ticket.status === 'used') {
                        result = { success: false, message: 'Ticket already used' };
                        return state;
                    }

                    result = { success: true, message: `Ticket validated for ${ticket.userName}` };
                    return {
                        userTickets: state.userTickets.map(t =>
                            t.id === ticketId ? { ...t, status: 'used' } : t
                        )
                    };
                });
                return result;
            },
            findUserByUsername: (_username: string) => {
                // Return null by default, or implement dynamic search if needed
                return null;
            },
            addCircleReflection: (circleId: string, reflection: Reflection) => set((state) => ({
                createdCircles: state.createdCircles.map(c =>
                    c.id === circleId ? { ...c, reflections: [reflection, ...(c.reflections || [])] } : c
                )
            })),
            updateCircleReflection: (circleId, reflectionId, content, image) => set((state) => ({
                createdCircles: state.createdCircles.map(c =>
                    c.id === circleId ? {
                        ...c,
                        reflections: (c.reflections || []).map(r =>
                            r.id === reflectionId ? { ...r, content, image } : r
                        )
                    } : c
                )
            })),
            deleteCircleReflection: (circleId, reflectionId) => set((state) => ({
                createdCircles: state.createdCircles.map(c =>
                    c.id === circleId ? {
                        ...c,
                        reflections: (c.reflections || []).filter(r => r.id !== reflectionId)
                    } : c
                )
            })),
            togglePlatformFeature: (feature) => set((state) => ({
                platformFeatures: {
                    ...state.platformFeatures,
                    [feature]: !state.platformFeatures[feature]
                }
            })),
            addCommunityNews: (news) => set((state) => ({
                communityNews: [{ ...news, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() }, ...state.communityNews]
            })),
            updateCommunityNews: (id, updates) => set((state) => ({
                communityNews: state.communityNews.map(n => n.id === id ? { ...n, ...updates } : n)
            })),
            deleteCommunityNews: (id) => set((state) => ({
                communityNews: state.communityNews.filter(n => n.id !== id)
            })),
            addNurMessage: (message) => set((state) => {
                const newChats = [...state.nurChats, message];
                if (state.isLoggedIn && state.userId) {
                    NurChatService.pushMessage(state.userId, message);
                }
                return { nurChats: newChats };
            }),
            setSessionUnlocked: (isSessionUnlocked) => set({ isSessionUnlocked }),
            clearNurChat: () => set((state) => {
                if (state.isLoggedIn && state.userId) {
                    NurChatService.clearHistory(state.userId);
                }
                return { nurChats: [] };
            }),
            syncNurChats: async () => {
                const state = useStore.getState();
                if (state.isLoggedIn && state.userId) {
                    const cloudChats = await NurChatService.pullHistory(state.userId);
                    if (cloudChats && cloudChats.length > 0) {
                        set({ nurChats: cloudChats });
                    }
                }
            },
            logout: () => set({ isLoggedIn: false, userId: null, subscriptionTier: 'free', username: '', profilePicture: null, dateOfBirth: null, astrologyEnabled: false, isSessionUnlocked: false }),
        }),
        {
            name: 'true-north-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => {
                const { isSessionUnlocked: _, ...rest } = state;
                return rest;
            },
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Force enable Ask Nur feature if it's missing or false in persisted state
                    if (!state.platformFeatures?.askNur) {
                        state.togglePlatformFeature('askNur');
                    }
                }
            }
        }
    )
);
