import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { theme, palette } from '../theme';
import { Fingerprint } from 'lucide-react-native';

interface SanctuaryLockProps {
    onUnlock: () => void;
    onBack: () => void;
    error?: boolean;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
}

export const SanctuaryLock = ({
    onUnlock,
    onBack,
    error,
    loading,
    title = "Sanctuary Locked",
    subtitle = "Your reflections are protected by your security settings.",
    buttonText = "Unlock Journal",
    icon: Icon = Fingerprint,
    securityPin,
    onPinSuccess,
    promptPinMode = false
}: SanctuaryLockProps & { loading?: boolean, securityPin?: string | null, onPinSuccess?: () => void, promptPinMode?: boolean }) => {
    
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');
    const [isPinMode, setIsPinMode] = useState(promptPinMode);

    React.useEffect(() => {
        if (promptPinMode) setIsPinMode(true);
    }, [promptPinMode]);

    const handlePinSubmit = () => {
        if (pinInput === securityPin) {
            setPinError('');
            onPinSuccess?.();
        } else {
            setPinError('Incorrect PIN');
            setPinInput('');
        }
    };
    return (
        <View style={styles.lockContainer}>
            <View style={styles.lockContent}>
                <View style={styles.lockIconCircle}>
                    <Icon size={48} color={palette.softGold} />
                </View>
                <Text style={styles.lockTitle}>{isPinMode ? "Enter PIN" : title}</Text>
                <Text style={styles.lockSubtitle}>{isPinMode ? "Enter your 4-digit PIN to continue." : subtitle}</Text>

                {error && !isPinMode && (
                    <Text style={styles.bioErrorText}>Authentication failed. Please try again.</Text>
                )}

                {isPinMode ? (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <TextInput
                            style={styles.pinInput}
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={4}
                            value={pinInput}
                            onChangeText={(text) => {
                                setPinInput(text);
                                setPinError('');
                            }}
                            autoFocus
                        />
                        {pinError ? <Text style={styles.bioErrorText}>{pinError}</Text> : null}
                    </View>
                ) : null}

                <TouchableOpacity 
                    style={[styles.unlockButton, loading && { opacity: 0.7 }]} 
                    onPress={isPinMode ? handlePinSubmit : onUnlock}
                    disabled={loading || (isPinMode && pinInput.length < 4)}
                >
                    {loading ? (
                        <ActivityIndicator color={palette.ivory} />
                    ) : (
                        <Text style={styles.unlockButtonText}>{isPinMode ? "Unlock" : buttonText}</Text>
                    )}
                </TouchableOpacity>

                {isPinMode && !promptPinMode && (
                    <TouchableOpacity style={styles.backButton} onPress={() => setIsPinMode(false)}>
                        <Text style={styles.backButtonText}>Use Biometrics</Text>
                    </TouchableOpacity>
                )}

                {(!isPinMode || promptPinMode) && (
                    <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    lockContainer: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    lockContent: { alignItems: 'center', width: '100%' },
    lockIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
    lockTitle: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: 12 },
    lockSubtitle: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
    unlockButton: { backgroundColor: theme.colors.text, paddingVertical: 18, paddingHorizontal: 40, borderRadius: theme.borderRadius.full, width: '100%', alignItems: 'center', marginBottom: 16 },
    unlockButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    backButton: { paddingVertical: 12 },
    backButtonText: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: theme.colors.secondaryText },
    bioErrorText: { color: '#E57373', fontFamily: theme.typography.sansMedium, fontSize: 14, marginBottom: 20, textAlign: 'center' },
    pinInput: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: 16, fontSize: 24, fontFamily: theme.typography.sansBold, color: theme.colors.text, textAlign: 'center', letterSpacing: 8, width: 200, marginBottom: 24 }
});
