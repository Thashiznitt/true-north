import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';

interface NavigationShellProps {
    children: React.ReactNode;
    backgroundColor?: string;
    style?: ViewStyle;
    footer?: React.ReactNode;
}

/**
 * NavigationShell
 * 
 * A performance-optimized shell for screens.
 * Ensures safe area handling and consistent background color
 * to prevent white flashes during navigation transitions.
 */
export const NavigationShell = ({
    children,
    backgroundColor = theme.colors.background,
    style,
    footer
}: NavigationShellProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            { backgroundColor, paddingTop: insets.top },
            style
        ]}>
            <View style={styles.content}>
                {children}
            </View>
            {footer && (
                <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
                    {footer}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.md,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});
