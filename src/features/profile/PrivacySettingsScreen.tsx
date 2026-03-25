import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { ChevronLeft, Shield, Eye, Lock, UserX, Trash2, LucideIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store';
import { FadeIn } from '../../components/FadeIn';
import { BottomSheet } from '../../components/BottomSheet';
import { supabase } from '../../services/supabase';
import { authService } from '../../services/auth';
import * as LocalAuthentication from 'expo-local-authentication';

export const PrivacySettingsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const logout = useStore(state => state.logout);
    const biometricsEnabled = useStore(state => state.biometricsEnabled);
    const setBiometricsEnabled = useStore(state => state.setBiometricsEnabled);
    const securityPin = useStore(state => state.securityPin);
    const setSecurityPin = useStore(state => state.setSecurityPin);

    const [isPinModalVisible, setPinModalVisible] = useState(false);
    const [pinInput, setPinInput] = useState('');

    const [privacy, setPrivacy] = useState({
        privateProfile: false,
        allowTagging: true,
        showOnlineStatus: true,
    });

    const toggleSwitch = async (key: keyof typeof privacy) => {
        const newValue = !privacy[key];
        setPrivacy(prev => ({ ...prev, [key]: newValue }));

        if (key === 'privateProfile') {
            const user = useStore.getState();
            if (user.userId) {
                await supabase
                    .from('user_preferences')
                    .update({ is_profile_private: newValue })
                    .eq('user_id', user.userId);
            }
        }
    };


    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to permanently delete your account? This action cannot be undone and all your reflections will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        const success = await authService.deleteAccount();
                        if (!success) {
                            Alert.alert("Error", "Unable to delete account at this time. Please try again later.");
                        }
                    }
                }
            ]
        );
    };

    const handleBiometricsToggle = async () => {
        if (!biometricsEnabled) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!hasHardware || !isEnrolled) {
                Alert.alert("Not Available", "Biometrics are not set up on this device.");
                return;
            }
            const result = await LocalAuthentication.authenticateAsync({ 
                promptMessage: 'Enable App Lock',
                requireConfirmation: false,
            });
            if (result.success) setBiometricsEnabled(true);
        } else {
            setBiometricsEnabled(false);
        }
    };

    const handlePinSave = () => {
        if (pinInput.length === 4) {
            setSecurityPin(pinInput);
            setPinModalVisible(false);
            setPinInput('');
        } else if (pinInput.length === 0) {
            setSecurityPin(null);
            setPinModalVisible(false);
        } else {
            Alert.alert("Invalid PIN", "PIN must be exactly 4 digits, or leave empty to remove it.");
        }
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
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <FadeIn delay={100} from="bottom">
                        <Text style={styles.sectionTitle}>App Lock</Text>
                    </FadeIn>
                    <FadeIn delay={150} from="bottom">
                        <SettingRow
                            icon={Lock}
                            label="Require Biometrics"
                            description="Lock your journal and circles with Face ID / Fingerprint."
                            value={biometricsEnabled}
                            onToggle={handleBiometricsToggle}
                        />
                    </FadeIn>
                    <FadeIn delay={170} from="bottom">
                        <TouchableOpacity style={[styles.actionRow, { borderBottomWidth: 0 }]} onPress={() => setPinModalVisible(true)}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: palette.softGold + '10' }]}>
                                    <Lock size={20} color={palette.softGold} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>{securityPin ? "Change Security PIN" : "Set Security PIN"}</Text>
                                    <Text style={styles.description}>Fallback access when biometrics fail.</Text>
                                </View>
                            </View>
                            <ChevronLeft size={20} color={theme.colors.border} style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    </FadeIn>
                </View>

                <View style={styles.section}>
                    <FadeIn delay={200} from="bottom">
                        <Text style={styles.sectionTitle}>Visibility</Text>
                    </FadeIn>
                    <FadeIn delay={200} from="bottom">
                        <SettingRow
                            icon={Lock}
                            label="Private Profile"
                            description="Only approved followers can see your reflections."
                            value={privacy.privateProfile}
                            onToggle={() => toggleSwitch('privateProfile')}
                        />
                    </FadeIn>
                    <FadeIn delay={300} from="bottom">
                        <SettingRow
                            icon={Eye}
                            label="Show Online Status"
                            description="Let others see when you are active."
                            value={privacy.showOnlineStatus}
                            onToggle={() => toggleSwitch('showOnlineStatus')}
                        />
                    </FadeIn>
                </View>

                <View style={styles.section}>
                    <FadeIn delay={400} from="bottom">
                        <Text style={styles.sectionTitle}>Safety</Text>
                    </FadeIn>
                    <FadeIn delay={500} from="bottom">
                        <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('BlockedUsers' as never)}>
                            <View style={styles.rowLeft}>
                                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                                    <UserX size={20} color={theme.colors.text} />
                                </View>
                                <Text style={styles.label}>Blocked Accounts</Text>
                            </View>
                            <ChevronLeft size={20} color={theme.colors.border} style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    </FadeIn>
                </View>

                <View style={[styles.section, { marginTop: 40 }]}>
                    <FadeIn delay={600} from="bottom">
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                            <Trash2 size={20} color={'#FF4444'} />
                            <Text style={styles.deleteText}>Delete Account</Text>
                        </TouchableOpacity>
                    </FadeIn>
                </View>
            </View>
            <BottomSheet
                visible={isPinModalVisible}
                onClose={() => setPinModalVisible(false)}
                title={securityPin ? "Change PIN" : "Set PIN"}
                actionLabel="Save"
                onAction={handlePinSave}
            >
                <Text style={{ fontFamily: theme.typography.sansMedium, color: theme.colors.text, marginBottom: 16 }}>
                    Enter a 4-digit PIN. Leave empty to remove it.
                </Text>
                <BottomSheet.TextInput
                    placeholder="****"
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={4}
                    value={pinInput}
                    onChangeText={setPinInput}
                    autoFocus
                    style={{ letterSpacing: 8, fontSize: 24, textAlign: 'center' }}
                />
            </BottomSheet>
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
