import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { Bell, LucideIcon, Heart, Sparkles, MessageCircle, ChevronLeft, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '../../store';
import { useEffect } from 'react';

const getIcon = (type: string) => {
    switch (type) {
        case 'affirmation': return Sparkles;
        case 'blessing': return Heart;
        case 'event': return MessageCircle;
        default: return Bell;
    }
};

export const NotificationsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { notificationsList, cleanupOldNotifications } = useStore();

    useEffect(() => {
        cleanupOldNotifications();
    }, []);

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return 'just now';
    };

    const renderNotification = ({ item }: any) => {
        const Icon = getIcon(item.type);
        return (
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Icon size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardMessage}>{item.message}</Text>
                    <Text style={styles.cardTime}>{formatTime(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={notificationsList}
                renderItem={renderNotification}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Bell size={48} color={theme.colors.border} />
                        <Text style={styles.emptyText}>Your sanctuary is peaceful.{'\n'}No new notifications.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.background
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    list: { padding: theme.spacing.xl },
    card: {
        flexDirection: 'row', backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1
    },
    iconContainer: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md
    },
    content: { flex: 1 },
    cardTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    cardMessage: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText, lineHeight: 20, marginBottom: 6 },
    cardTime: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, opacity: 0.7 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 150 },
    emptyText: {
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText,
        textAlign: 'center', marginTop: theme.spacing.lg, lineHeight: 24
    }
});
