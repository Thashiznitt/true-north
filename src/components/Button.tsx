import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { theme, palette } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary': return styles.secondary;
            case 'outline': return styles.outline;
            default: return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return styles.outlineText;
            case 'secondary': return styles.secondaryText;
            default: return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.base, getButtonStyle(), style, (disabled || loading) && styles.disabled]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : palette.ivory} />
            ) : (
                <Text style={[styles.text, getTextStyle()]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        height: 56,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    primary: { backgroundColor: theme.colors.text },
    secondary: { backgroundColor: theme.colors.primary },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.text },
    disabled: { opacity: 0.5 },
    text: { fontFamily: theme.typography.sansBold, fontSize: 16 },
    primaryText: { color: palette.ivory },
    secondaryText: { color: palette.ivory },
    outlineText: { color: theme.colors.text },
});
