import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Bell, MessageCircle, Heart, Sparkles, Clock, LucideIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const NotificationSettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [settings, setSettings] = useState({
        dailyGuidance: true,
        communityActivity: true,
        blessings: true,
        reminders: false,
        marketing: false,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    interface SettingRowProps {
        icon: LucideIcon;
        label: string;
        description?: string;
        value: boolean;
        onToggle: () => void;
    }

    const SettingRow = ({ icon: Icon, label, description, value, onToggle }: SettingRowProps) => (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={styles.iconContainer}>
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
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Spiritual Alignment</Text>
                    <SettingRow
                        icon={Sparkles}
                        label="Daily Guidance"
                        description="Morning wisdom and scripture."
                        value={settings.dailyGuidance}
                        onToggle={() => toggleSwitch('dailyGuidance')}
                    />
                    <SettingRow
                        icon={Heart}
                        label="Received Blessings"
                        description="When someone blesses your reflection."
                        value={settings.blessings}
                        onToggle={() => toggleSwitch('blessings')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Community</Text>
                    <SettingRow
                        icon={MessageCircle}
                        label="Circle Activity"
                        description="New reflections in your circles."
                        value={settings.communityActivity}
                        onToggle={() => toggleSwitch('communityActivity')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reminders</Text>
                    <SettingRow
                        icon={Clock}
                        label="Reflection Reminder"
                        description="Nudge to journal at 8:00 PM."
                        value={settings.reminders}
                        onToggle={() => toggleSwitch('reminders')}
                    />
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
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: theme.spacing.md },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md,
        borderWidth: 1, borderColor: theme.colors.border
    },
    textContainer: { flex: 1 },
    label: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, marginBottom: 2 },
    description: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, lineHeight: 18 }
});
