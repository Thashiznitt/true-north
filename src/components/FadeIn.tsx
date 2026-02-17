import React, { useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    style?: ViewStyle;
    from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    duration = 500,
    style,
    from = 'bottom'
}) => {
    const fromAnimation = useMemo(() => {
        switch (from) {
            case 'bottom': return { opacity: 0, translateY: 20 };
            case 'top': return { opacity: 0, translateY: -20 };
            case 'left': return { opacity: 0, translateX: -20 };
            case 'right': return { opacity: 0, translateX: 20 };
            default: return { opacity: 0 };
        }
    }, [from]);

    return (
        <MotiView
            from={fromAnimation}
            animate={{ opacity: 1, translateY: 0, translateX: 0 }}
            transition={{
                type: 'timing',
                duration: duration,
                delay: delay,
            }}
            style={style}
        >
            {children}
        </MotiView>
    );
};
