import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { theme, palette } from '../theme';
import { Check } from 'lucide-react-native';

export const TrueNorthToast = () => {
    const insets = useSafeAreaInsets();
    const { toast } = useStore();

    return (
        <AnimatePresence>
            {toast.visible && (
                <MotiView
                    from={{ opacity: 0, translateY: 50, scale: 0.95 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    exit={{ opacity: 0, translateY: 30, scale: 0.95 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={[styles.container, { bottom: insets.bottom + 80 }]}
                >
                    <View style={styles.toastBox}>
                        <Check size={18} color={palette.softGold} style={styles.icon} />
                        <Text style={styles.message}>{toast.message}</Text>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
    },
    toastBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(25, 25, 25, 0.95)',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(200, 169, 90, 0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    icon: {
        marginRight: theme.spacing.sm,
    },
    message: {
        fontFamily: theme.typography.sansBold,
        fontSize: 14,
        color: palette.ivory,
        letterSpacing: 0.5,
    }
});
