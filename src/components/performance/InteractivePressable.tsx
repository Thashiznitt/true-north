import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface InteractivePressableProps extends PressableProps {
    style?: ViewStyle;
    enableHaptics?: boolean;
}

/**
 * A wrapper around Pressable that provides native-like touch feedback.
 * 
 * Features:
 * 1. Scale animation on press.
 * 2. Optional Haptic feedback on press down.
 * 3. Uses Reanimated for 60fps+ performance.
 */
export function InteractivePressable({ children, style, enableHaptics = true, onPress, ...props }: InteractivePressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97);
        if (enableHaptics) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={[style, animatedStyle]}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}
