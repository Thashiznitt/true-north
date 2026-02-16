import React from 'react';
import { Image, ImageProps } from 'expo-image';
import { StyleSheet } from 'react-native';

interface OptimizedImageProps extends ImageProps {
    width?: number;
    height?: number;
}

/**
 * A wrapper around expo-image that enforces performance best practices.
 * 
 * Rules:
 * 1. Always use memory-disk cache policy.
 * 2. Default transition for smoothness.
 * 3. Content fit cover by default.
 */
export function OptimizedImage({ width, height, style, ...props }: OptimizedImageProps) {
    return (
        <Image
            {...props}
            style={[{ width, height }, style]}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={100}
        />
    );
}
