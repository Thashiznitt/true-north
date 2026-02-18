import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../theme';

export type TypographyVariant = 'header' | 'title' | 'subtitle' | 'body' | 'caption';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    bold?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
    variant = 'body',
    color,
    align,
    bold,
    style,
    children,
    ...props
}) => {
    const variantStyle = theme.typography[variant] as TextStyle;

    const customStyle: TextStyle = {
        color: color || theme.colors.text,
        textAlign: align || 'left',
    };

    if (bold) {
        if (variant === 'header' || variant === 'title') {
            // already bold
        } else {
            customStyle.fontFamily = theme.typography.sansBold;
        }
    }

    return (
        <Text
            style={[variantStyle, customStyle, style]}
            {...props}
        >
            {children}
        </Text>
    );
};
