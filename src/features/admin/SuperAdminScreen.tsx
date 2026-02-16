/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Shield, Users, Flag, Cpu, Search, MoreVertical, DollarSign, TrendingUp } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AIService, AIProvider } from '../../services/AIService';

type Tab = 'content' | 'users' | 'ai' | 'sales';

const MOCK_FLAGS = [
    { id: '1', type: 'Reflection', content: 'Trying to sell crypto here...', user: 'CryptoKing', time: '2h ago', status: 'pending' },
    { id: '2', type: 'Circle', content: 'Hate speech in description', user: 'Unknown', time: '5h ago', status: 'pending' },
    { id: '3', type: 'Reflection', content: 'Spamming phone numbers', user: 'Spammer123', time: '1d ago', status: 'resolved' },
];

const MOCK_USERS = [
    { id: '1', name: 'Sophie K.', email: 'sophie@example.com', status: 'active', role: 'Member' },
    { id: '2', name: 'John D.', email: 'john@example.com', status: 'active', role: 'Member' },
    { id: '3', name: 'Spammer123', email: 'spam@test.com', status: 'suspended', role: 'Member' },
];

const MOCK_SALES = {
    revenue: { total: '$12,450', monthly: '$1,290', growth: '+12%' },
    subscriptions: { active: 145, trials: 32, cancelled: 8 },
    transactions: [
        { id: '1', user: 'Sophie K.', amount: '$12.99', date: 'Today, 2:30 PM', status: 'Success' },
        { id: '2', user: 'John D.', amount: '$12.99', date: 'Yesterday', status: 'Success' },
        { id: '3', user: 'Mike R.', amount: '$12.99', date: 'Oct 22', status: 'Failed' },
    ]
};

export const SuperAdminScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<Tab>('content');

    // AI Settings State
    const [aiModel, setAiModel] = useState('Compass v2 (Stable)');
    const [strictness, setStrictness] = useState(0.7);
    const [autoFlag, setAutoFlag] = useState(true);
    const [aiProvider, setAiProvider] = useState<AIProvider>('LocalMock');
    const [apiKey, setApiKey] = useState('');
    const [customEndpoint, setCustomEndpoint] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            loadSettings();
        }, [])
    );

    const loadSettings = async () => {
        const provider = await AIService.getProvider();
        setAiProvider(provider as AIProvider);
        const key = await AIService.getApiKey(provider);
        setApiKey(key || '');
        const endpoint = await AIService.getCustomEndpoint();
        setCustomEndpoint(endpoint || '');
        const model = await AIService.getModel();
        setAiModel(model);
    };

    const saveAISettings = async () => {
        try {
            await AIService.setProvider(aiProvider);
            if (apiKey) await AIService.setApiKey(aiProvider, apiKey);
            if (customEndpoint) await AIService.setCustomEndpoint(customEndpoint);
            if (aiModel) await AIService.setModel(aiModel);
            Alert.alert("Success", "AI Configuration saved successfully.");
        } catch {
            Alert.alert("Error", "Failed to save settings.");
        }
    };

    const renderContentTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.statRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Resolved</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>2</Text>
                    <Text style={styles.statLabel}>Banned</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Flagged Content</Text>
            {MOCK_FLAGS.map(item => (
                <View key={item.id} style={styles.flagCard}>
                    <View style={styles.flagHeader}>
                        <View style={styles.flagBadge}>
                            <Flag size={12} color={palette.ivory} />
                            <Text style={styles.flagBadgeText}>{item.type}</Text>
                        </View>
                        <Text style={styles.flagTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.flagContent}>{item.content}</Text>
                    <Text style={styles.flagUser}>Reported by: System (AI)</Text>

                    {item.status === 'pending' && (
                        <View style={styles.flagActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Dismissed", "Flag has been dismissed.")}>
                                <Text style={styles.actionText}>Dismiss</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.banButton]} onPress={() => Alert.alert("Content Removed", "User has been warned.")}>
                                <Text style={[styles.actionText, { color: palette.ivory }]}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );

    const renderUsersTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.searchContainer}>
                <Search size={20} color={theme.colors.secondaryText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users by name or email..."
                    placeholderTextColor={theme.colors.secondaryText}
                />
            </View>

            {MOCK_USERS.map(user => (
                <View key={user.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user.name[0]}</Text>
                        </View>
                        <View>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.userActions}>
                        <View style={[styles.statusBadge, { backgroundColor: user.status === 'active' ? '#E6F4EA' : '#FCE8E6' }]}>
                            <Text style={[styles.statusText, { color: user.status === 'active' ? '#137333' : '#C5221F' }]}>
                                {user.status}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => Alert.alert("User Options", "Edit, Suspend, or Delete user.")}>
                            <MoreVertical size={20} color={theme.colors.secondaryText} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );

    const renderAITab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.aiCard}>
                <View style={styles.aiHeader}>
                    <Cpu size={24} color={palette.softGold} />
                    <Text style={styles.aiTitle}>Model Configuration</Text>
                </View>

                {/* Provider Selection */}
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>AI Provider</Text>
                    <View style={styles.providerRow}>
                        {['LocalMock', 'OpenAI', 'Groq', 'Custom'].map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.providerButton, aiProvider === p && styles.activeProvider]}
                                onPress={() => setAiProvider(p)}
                            >
                                <Text style={[styles.providerText, aiProvider === p && styles.activeProviderText]}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* API Key Input (Hidden for LocalMock) */}
                {aiProvider !== 'LocalMock' && (
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>API Key</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={`Enter ${aiProvider} API Key`}
                            placeholderTextColor={theme.colors.secondaryText}
                            secureTextEntry
                            value={apiKey}
                            onChangeText={setApiKey}
                        />
                    </View>
                )}

                {/* Custom Endpoint Input */}
                {aiProvider === 'Custom' && (
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Custom VPS Endpoint</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://my-vps-llm.com/v1"
                            placeholderTextColor={theme.colors.secondaryText}
                            value={customEndpoint}
                            onChangeText={setCustomEndpoint}
                        />
                    </View>
                )}

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Active Model</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. gpt-4o, llama3-70b"
                        placeholderTextColor={theme.colors.secondaryText}
                        value={aiModel}
                        onChangeText={setAiModel}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={saveAISettings}>
                    <Text style={styles.saveButtonText}>Save Configuration</Text>
                </TouchableOpacity>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Safety Strictness</Text>
                    <View style={styles.sliderContainer}>
                        <View style={[styles.sliderTrack, styles.fullWidth]}>
                            <View style={[styles.sliderFill, { width: `${strictness * 100}%` }]} />
                        </View>
                        {/* Mock slider interaction for now since we don't have a Slider component installed */}
                        <TouchableOpacity onPress={() => setStrictness(Math.min(1, strictness + 0.1))}>
                            <Text style={styles.sliderValue}>{(strictness * 100).toFixed(0)}%</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Auto-Flag Content</Text>
                    <Switch
                        value={autoFlag}
                        onValueChange={setAutoFlag}
                        trackColor={{ false: theme.colors.border, true: palette.softGold }}
                    />
                </View>
            </View>

            <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>System Logs</Text>
                <Text style={styles.logText}>[10:42 AM] Auto-flagged comment in Circle #42</Text>
                <Text style={styles.logText}>[10:30 AM] Model updated to v2.1.4</Text>
                <Text style={styles.logText}>[09:15 AM] Daily affirmation generation complete</Text>
            </View>
        </ScrollView>
    );

    const renderSalesTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.statRow}>
                <View style={[styles.statCard, { borderColor: palette.softGold }]}>
                    <Text style={[styles.statNumber, { color: palette.softGold }]}>{MOCK_SALES.revenue.total}</Text>
                    <Text style={styles.statLabel}>Total Revenue</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{MOCK_SALES.revenue.monthly}</Text>
                    <Text style={styles.statLabel}>This Month</Text>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                    <TrendingUp size={20} color={theme.colors.text} />
                    <Text style={styles.cardTitle}>Subscription Health</Text>
                </View>
                <View style={styles.healthStats}>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthValue}>{MOCK_SALES.subscriptions.active}</Text>
                        <Text style={styles.healthLabel}>Active</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.healthItem}>
                        <Text style={styles.healthValue}>{MOCK_SALES.subscriptions.trials}</Text>
                        <Text style={styles.healthLabel}>Trials</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.healthItem}>
                        <Text style={[styles.healthValue, { color: '#E57373' }]}>{MOCK_SALES.subscriptions.cancelled}</Text>
                        <Text style={styles.healthLabel}>Churned</Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}>Recent Transactions</Text>
            {MOCK_SALES.transactions.map(tx => (
                <View key={tx.id} style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <View style={[styles.avatar, { backgroundColor: palette.softGold + '20' }]}>
                            <DollarSign size={20} color={palette.softGold} />
                        </View>
                        <View>
                            <Text style={styles.userName}>{tx.user}</Text>
                            <Text style={styles.userEmail}>{tx.date}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.userName}>{tx.amount}</Text>
                        <Text style={[styles.userEmail, { color: tx.status === 'Success' ? '#137333' : '#C5221F' }]}>{tx.status}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );

    // ... (existing helper functions)

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Superadmin</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'content' && styles.activeTab]}
                    onPress={() => setActiveTab('content')}
                >
                    <Shield size={20} color={activeTab === 'content' ? palette.softGold : theme.colors.secondaryText} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => setActiveTab('users')}
                >
                    <Users size={20} color={activeTab === 'users' ? palette.softGold : theme.colors.secondaryText} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
                    onPress={() => setActiveTab('ai')}
                >
                    <Cpu size={20} color={activeTab === 'ai' ? palette.softGold : theme.colors.secondaryText} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sales' && styles.activeTab]}
                    onPress={() => setActiveTab('sales')}
                >
                    <DollarSign size={20} color={activeTab === 'sales' ? palette.softGold : theme.colors.secondaryText} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeTab === 'content' && renderContentTab()}
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'ai' && renderAITab()}
                {activeTab === 'sales' && renderSalesTab()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    backButton: { width: 40 },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    headerRight: { width: 40 },
    tabs: { flexDirection: 'row', padding: theme.spacing.md, gap: theme.spacing.md },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: theme.borderRadius.md, gap: 8,
        backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border
    },
    activeTab: { borderColor: palette.softGold, backgroundColor: palette.softGold + '10' },
    content: { flex: 1 },
    tabContent: { padding: theme.spacing.lg },

    // Content Tab Styles
    statRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl },
    statCard: {
        flex: 1, backgroundColor: theme.colors.surface, padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border,
        alignItems: 'center'
    },
    statNumber: { fontFamily: theme.typography.sansBold, fontSize: 24, color: theme.colors.text },
    statLabel: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    sectionTitle: { fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text, marginBottom: theme.spacing.md },
    flagCard: {
        backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.md
    },
    flagHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
    flagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EA4335', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    flagBadgeText: { color: palette.ivory, fontSize: 10, fontFamily: theme.typography.sansBold, textTransform: 'uppercase' },
    flagTime: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    flagContent: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, marginBottom: theme.spacing.md },
    flagUser: { fontFamily: theme.typography.sansMedium, fontSize: 12, color: theme.colors.secondaryText, marginBottom: theme.spacing.md },
    flagActions: { flexDirection: 'row', gap: theme.spacing.md },
    actionButton: { flex: 1, padding: 10, borderRadius: theme.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
    banButton: { backgroundColor: '#EA4335', borderColor: '#EA4335' },
    actionText: { fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.text },

    // Users Tab Styles
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, height: 48,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg
    },
    searchInput: { flex: 1, marginLeft: theme.spacing.sm, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text },
    userCard: {
        backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm,
        borderWidth: 1, borderColor: theme.colors.border
    },
    userInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    userName: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    userEmail: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    userActions: { alignItems: 'flex-end', gap: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontFamily: theme.typography.sansBold, fontSize: 10, textTransform: 'uppercase' },

    // AI Tab Styles
    aiCard: {
        backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg
    },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg },
    aiTitle: { fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text },
    settingRow: { marginBottom: theme.spacing.lg },
    settingLabel: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.text, marginBottom: 8 },
    providerRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    providerButton: {
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: theme.borderRadius.md,
        borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.background
    },
    activeProvider: { backgroundColor: palette.softGold, borderColor: palette.softGold },
    providerText: { fontFamily: theme.typography.sansMedium, color: theme.colors.text, fontSize: 13 },
    activeProviderText: { color: palette.ivory },
    input: {
        backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md, padding: 12, color: theme.colors.text, fontFamily: theme.typography.sans
    },
    saveButton: {
        backgroundColor: palette.softGold, padding: 14, borderRadius: theme.borderRadius.md,
        alignItems: 'center', marginBottom: theme.spacing.xl
    },
    saveButtonText: { fontFamily: theme.typography.sansBold, color: palette.ivory, fontSize: 16 },
    fullWidth: { width: '100%' },
    sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    sliderTrack: { height: 4, backgroundColor: theme.colors.border, borderRadius: 2, flex: 1, overflow: 'hidden' },
    sliderFill: { height: '100%', backgroundColor: palette.softGold },
    sliderValue: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text, width: 40, textAlign: 'right' },
    logText: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginBottom: 4 },

    // Sales Tab Styles
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 12, marginBottom: 16 },
    cardTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    sectionCard: {
        backgroundColor: theme.colors.surface, padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg,
        borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg
    },
    healthStats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    healthItem: { alignItems: 'center' },
    healthValue: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text },
    healthLabel: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: 4 },
    divider: { width: 1, height: 30, backgroundColor: theme.colors.border }
});
