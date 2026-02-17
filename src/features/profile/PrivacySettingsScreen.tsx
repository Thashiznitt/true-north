import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Shield, Eye, Lock, UserX, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';

export const PrivacySettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const logout = useStore(state => state.logout);

    const [privacy, setPrivacy] = useState({
        privateProfile: false,
        allowTagging: true,
        showOnlineStatus: true,
    });

    const toggleSwitch = (key: keyof typeof privacy) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    };


    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: () => {
                        // In a real app, API call here
                        logout();
                    }
                }
            ]
        );
    };

    const SettingRow = ({ icon: Icon, label, description, value, onToggle }: any) => (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: palette.softGold + '10' }]}>
                    <Icon size={20} color={palette.softGold} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>{label}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>
            </View>
            <Switch
                trackColor={{ false: theme.colors.border, true: palette.softGold }}
                thumbColor={palette.ivory}
                ios_backgroundColor={theme.colors.border}
                onValueChange={onToggle}
                value={value}
            />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Visibility</Text>
                    <SettingRow
                        icon={Lock}
                        label="Private Profile"
                        description="Only approved followers can see your reflections."
                        value={privacy.privateProfile}
                        onToggle={() => toggleSwitch('privateProfile')}
                    />
                    <SettingRow
                        icon={Eye}
                        label="Show Online Status"
                        description="Let others see when you are active."
                        value={privacy.showOnlineStatus}
                        onToggle={() => toggleSwitch('showOnlineStatus')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Safety</Text>
                    <TouchableOpacity style={styles.actionRow}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                                <UserX size={20} color={theme.colors.text} />
                            </View>
                            <Text style={styles.label}>Blocked Accounts</Text>
                        </View>
                        <ChevronLeft size={20} color={theme.colors.border} style={{ transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { marginTop: 40 }]}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                        <Trash2 size={20} color={'#FF4444'} />
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.lg
    },
    backButton: { width: 40, alignItems: 'flex-start' },
    headerTitle: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text },
    headerSpacer: { width: 40 },
    content: { padding: theme.spacing.xl },
    section: { marginBottom: theme.spacing.xxl },
    sectionTitle: {
        fontFamily: theme.typography.sansBold, fontSize: 13, color: theme.colors.secondaryText,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: theme.spacing.lg
    },
    row: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: theme.spacing.lg
    },
    actionRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: theme.spacing.md },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border
    },
    textContainer: { flex: 1 },
    label: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    description: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, lineHeight: 18 },
    deleteButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 16, backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: theme.borderRadius.lg,
        gap: 8
    },
    deleteText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: '#FF4444' }
});
