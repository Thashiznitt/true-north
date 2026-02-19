import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, FlatList } from 'react-native'; // eslint-disable-line react-native/split-platform-components
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme, palette } from '../../theme';
import { useStore, CommunityNews, CreatedCircle } from '../../store';
import { ChevronLeft, BarChart2, Settings, Users, ShieldAlert, Plus, Trash2, Edit2, CheckCircle, XCircle, Megaphone, Lock } from 'lucide-react-native';
import { Popup } from '../../components/Popup';
import { BottomSheet } from '../../components/BottomSheet';

type AdminTab = 'overview' | 'features' | 'users' | 'circles' | 'news';

export const SuperAdminDashboard = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const {
        platformFeatures,
        togglePlatformFeature,
        createdCircles,
        communityNews,
        addCommunityNews,
        updateCommunityNews,
        deleteCommunityNews,
        blockedUserIds,
        blockUser,
        unblockUser,
        deleteCreatedCircle,
        userId,
        email
    } = useStore();

    const { SUPER_ADMIN_EMAILS } = require('../../store'); // eslint-disable-line @typescript-eslint/no-var-requires
    const isSuperAdmin = email && SUPER_ADMIN_EMAILS.includes(email);

    React.useEffect(() => {
        if (!isSuperAdmin) {
            Alert.alert("Access Denied", "You do not have permission to view this sacred sanctuary.");
            navigation.goBack();
        }
    }, [isSuperAdmin]);

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    if (!isSuperAdmin) return null;

    // News Management State
    const [newsSheetVisible, setNewsSheetVisible] = useState(false);
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

    const handleFeatureToggle = (feature: keyof typeof platformFeatures) => {
        togglePlatformFeature(feature);
        Alert.alert("Feature Updated", `${feature.charAt(0).toUpperCase() + feature.slice(1)} has been ${!platformFeatures[feature] ? 'enabled' : 'disabled'}.`);
    };

    const handleSaveNews = () => {
        if (!newsTitle.trim() || !newsContent.trim()) {
            Alert.alert("Error", "Title and content are required.");
            return;
        }

        if (editingNewsId) {
            updateCommunityNews(editingNewsId, { title: newsTitle, content: newsContent });
            Alert.alert("Success", "News updated.");
        } else {
            addCommunityNews({ title: newsTitle, content: newsContent, active: true });
            Alert.alert("Success", "News posted.");
        }
        setNewsSheetVisible(false);
        setNewsTitle('');
        setNewsContent('');
        setEditingNewsId(null);
    };

    const handleDeleteNews = (id: string) => {
        Alert.alert("Delete News", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteCommunityNews(id) }
        ]);
    };

    const renderOverview = () => (
        <ScrollView style={styles.contentContainer}>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Users size={24} color={palette.softGold} />
                    <Text style={styles.statValue}>1,234</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                </View>
                <View style={styles.statCard}>
                    <ShieldAlert size={24} color={palette.softGold} />
                    <Text style={styles.statValue}>{createdCircles.length}</Text>
                    <Text style={styles.statLabel}>Circles</Text>
                </View>
                <View style={styles.statCard}>
                    <CheckCircle size={24} color={theme.colors.success} />
                    <Text style={styles.statValue}>98%</Text>
                    <Text style={styles.statLabel}>System Health</Text>
                </View>
                <View style={styles.statCard}>
                    <Lock size={24} color={theme.colors.error} />
                    <Text style={styles.statValue}>{blockedUserIds.length}</Text>
                    <Text style={styles.statLabel}>Blocked Users</Text>
                </View>
            </View>

            <Text style={styles.sectionHeader}>Recent System Activity</Text>
            {/* Mock Activity Log */}
            {[1, 2, 3].map(i => (
                <View key={i} style={styles.activityItem}>
                    <Text style={styles.activityText}>User ID: user-{Math.floor(Math.random() * 1000)} created a new circle.</Text>
                    <Text style={styles.activityTime}>{i}h ago</Text>
                </View>
            ))}
        </ScrollView>
    );

    const renderFeatures = () => (
        <ScrollView style={styles.contentContainer}>
            <Text style={styles.descriptionText}>
                Toggle system-wide features. Disabling a feature will hide it from all users immediately.
            </Text>
            {Object.keys(platformFeatures).map((feature) => (
                <View key={feature} style={styles.featureRow}>
                    <View>
                        <Text style={styles.featureName}>{feature.charAt(0).toUpperCase() + feature.slice(1)}</Text>
                        <Text style={styles.featureDescription}>Enable/Disable {feature} module</Text>
                    </View>
                    <Switch
                        value={platformFeatures[feature as keyof typeof platformFeatures]}
                        onValueChange={() => handleFeatureToggle(feature as keyof typeof platformFeatures)}
                        trackColor={{ true: palette.softGold, false: theme.colors.border }}
                    />
                </View>
            ))}
        </ScrollView>
    );

    const renderNews = () => (
        <View style={styles.contentContainer}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setNewsTitle('');
                    setNewsContent('');
                    setEditingNewsId(null);
                    setNewsSheetVisible(true);
                }}
            >
                <Plus size={20} color={palette.ivory} />
                <Text style={styles.addButtonText}>Post Community News</Text>
            </TouchableOpacity>

            <FlatList
                data={communityNews}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.newsCard}>
                        <View style={styles.newsHeader}>
                            <Text style={styles.newsTitle}>{item.title}</Text>
                            <View style={styles.newsActions}>
                                <TouchableOpacity onPress={() => {
                                    setNewsTitle(item.title);
                                    setNewsContent(item.content);
                                    setEditingNewsId(item.id);
                                    setNewsSheetVisible(true);
                                }}>
                                    <Edit2 size={18} color={theme.colors.secondaryText} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteNews(item.id)}>
                                    <Trash2 size={18} color={theme.colors.error} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.newsContent} numberOfLines={2}>{item.content}</Text>
                        <View style={styles.newsMeta}>
                            <Text style={styles.newsDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                            <Switch
                                value={item.active}
                                onValueChange={() => updateCommunityNews(item.id, { active: !item.active })}
                                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                                trackColor={{ true: theme.colors.success, false: theme.colors.border }}
                            />
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );

    const renderCircles = () => (
        <FlatList
            data={createdCircles}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={styles.listItem}>
                    <View>
                        <Text style={styles.listItemTitle}>{item.name}</Text>
                        <Text style={styles.listItemSubtitle}>{item.members} members • {item.type}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        Alert.alert("Delete Circle", `Permanently delete ${item.name}?`, [
                            { text: "Cancel" },
                            { text: "Delete", style: 'destructive', onPress: () => deleteCreatedCircle(item.id) }
                        ])
                    }}>
                        <Trash2 size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            )}
            style={styles.contentContainer}
        />
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Super Admin</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
                {(['overview', 'features', 'news', 'circles', 'users'] as AdminTab[]).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content */}
            <View style={styles.mainContent}>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'features' && renderFeatures()}
                {activeTab === 'news' && renderNews()}
                {activeTab === 'circles' && renderCircles()}
                {activeTab === 'users' && (
                    <View style={styles.centerContent}>
                        <Text style={styles.placeholderText}>User management mock</Text>
                        <Text style={styles.statValue}>{blockedUserIds.length} Blocked</Text>
                    </View>
                )}
            </View>

            {/* News Bottom Sheet */}
            <BottomSheet
                visible={newsSheetVisible}
                onClose={() => setNewsSheetVisible(false)}
                title={editingNewsId ? "Edit News" : "Post News"}
                actionLabel="Save"
                onAction={handleSaveNews}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Title</Text>
                    <BottomSheet.TextInput
                        placeholder="News Headline"
                        value={newsTitle}
                        onChangeText={setNewsTitle}
                    />
                    <Text style={styles.label}>Content</Text>
                    <BottomSheet.TextInput
                        placeholder="Full announcement text..."
                        value={newsContent}
                        onChangeText={setNewsContent}
                        multiline
                        numberOfLines={4}
                        style={{ height: 100 }}
                    />
                </View>
            </BottomSheet>
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
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    tabBar: { maxHeight: 60, backgroundColor: theme.colors.surface },
    tabBarContent: { paddingHorizontal: theme.spacing.md, alignItems: 'center', paddingVertical: 10 },
    tab: {
        paddingVertical: 8, paddingHorizontal: 16, marginRight: 8,
        borderRadius: 20, backgroundColor: theme.colors.background,
        borderWidth: 1, borderColor: theme.colors.border
    },
    activeTab: { backgroundColor: palette.softGold, borderColor: palette.softGold },
    tabText: { fontFamily: theme.typography.sansMedium, color: theme.colors.secondaryText },
    activeTabText: { color: palette.ivory },
    mainContent: { flex: 1 },
    contentContainer: { flex: 1, padding: theme.spacing.lg },

    // Overview Styles
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    statCard: {
        width: '48%', backgroundColor: theme.colors.surface, padding: 16, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.colors.border,
        gap: 8
    },
    statValue: { fontFamily: theme.typography.sansBold, fontSize: 24, color: theme.colors.text },
    statLabel: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    sectionHeader: { fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text, marginBottom: 12 },
    activityItem: {
        backgroundColor: theme.colors.surface, padding: 12, borderRadius: 12, marginBottom: 8,
        borderLeftWidth: 3, borderLeftColor: palette.softGold
    },
    activityText: { fontFamily: theme.typography.sans, color: theme.colors.text, fontSize: 13 },
    activityTime: { fontFamily: theme.typography.sans, color: theme.colors.secondaryText, fontSize: 11, marginTop: 4 },

    // Feature Styles
    descriptionText: { fontFamily: theme.typography.sans, color: theme.colors.secondaryText, marginBottom: 20 },
    featureRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: theme.colors.surface, padding: 16, borderRadius: 16, marginBottom: 12,
        borderWidth: 1, borderColor: theme.colors.border
    },
    featureName: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    featureDescription: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },

    // News Styles
    addButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: palette.softGold, padding: 14, borderRadius: 12, marginBottom: 20
    },
    addButtonText: { fontFamily: theme.typography.sansBold, color: palette.ivory },
    newsCard: {
        backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 12,
        borderWidth: 1, borderColor: theme.colors.border
    },
    newsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    newsTitle: { fontFamily: theme.typography.sansBold, fontSize: 15, color: theme.colors.text, flex: 1 },
    newsActions: { flexDirection: 'row', gap: 12 },
    newsContent: { fontFamily: theme.typography.sans, color: theme.colors.secondaryText, fontSize: 13, marginBottom: 12 },
    newsMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    newsDate: { fontFamily: theme.typography.sans, fontSize: 11, color: theme.colors.tertiaryText },

    // List Item Styles
    listItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 12,
        borderWidth: 1, borderColor: theme.colors.border
    },
    listItemTitle: { fontFamily: theme.typography.sansBold, fontSize: 15, color: theme.colors.text },
    listItemSubtitle: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    placeholderText: { fontFamily: theme.typography.sans, color: theme.colors.secondaryText, fontSize: 16, marginBottom: 8 },

    // Form Styles
    formContainer: { padding: 16, gap: 16 },
    label: { fontFamily: theme.typography.sansBold, fontSize: 14, color: theme.colors.text, marginBottom: 4 }
});
