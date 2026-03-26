import React, { useMemo, useEffect, useRef, PropsWithChildren } from 'react';
import { ViewStyle, Animated } from 'react-native';

interface FadeInProps {
    delay?: number;
    duration?: number;
    style?: ViewStyle;
    from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
    key?: string | number;
}

export const FadeIn = ({
    children,
    delay = 0,
    duration = 500,
    style,
    from = 'bottom',
    pointerEvents = 'auto'
}: PropsWithChildren<FadeInProps>) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translate = useRef(new Animated.Value(20)).current; // Default for 'bottom'

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translate, {
                toValue: 0,
                duration,
                delay,
                useNativeDriver: true,
            })
        ]).start();
    }, [opacity, translate, duration, delay]);

    const transformStyle = useMemo(() => {
        switch (from) {
            case 'bottom': return [{ translateY: translate }];
            case 'top': return [{ translateY: translate.interpolate({ inputRange: [0, 20], outputRange: [0, -20] }) }];
            case 'left': return [{ translateX: translate.interpolate({ inputRange: [0, 20], outputRange: [0, -20] }) }];
            case 'right': return [{ translateX: translate }];
            default: return [];
        }
    }, [from, translate]);

    return (
        <Animated.View
            pointerEvents={pointerEvents}
            collapsable={false}
            style={[
                style,
                {
                    opacity,
                    transform: from !== 'none' ? transformStyle : undefined
                } as any
            ]}
        >
            {children}
        </Animated.View>
    );
};
