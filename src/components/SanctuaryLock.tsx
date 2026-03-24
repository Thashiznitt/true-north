import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    icon: Icon = Fingerprint
}: SanctuaryLockProps & { loading?: boolean }) => {
    return (
        <View style={styles.lockContainer}>
            <View style={styles.lockContent}>
                <View style={styles.lockIconCircle}>
                    <Icon size={48} color={palette.softGold} />
                </View>
                <Text style={styles.lockTitle}>{title}</Text>
                <Text style={styles.lockSubtitle}>{subtitle}</Text>

                {error && (
                    <Text style={styles.bioErrorText}>Authentication failed. Please try again.</Text>
                )}

                <TouchableOpacity 
                    style={[styles.unlockButton, loading && { opacity: 0.7 }]} 
                    onPress={onUnlock}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={palette.ivory} />
                    ) : (
                        <Text style={styles.unlockButtonText}>{buttonText}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={loading}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
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
    bioErrorText: { color: '#E57373', fontFamily: theme.typography.sansMedium, fontSize: 14, marginBottom: 20, textAlign: 'center' }
});
