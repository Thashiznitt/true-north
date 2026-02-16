import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * A wrapper around FlashList that enforces performance best practices.
 * 
 * Rules:
 * 1. Must implement estimatedItemSize (strict enforcement).
 * 2. Uses a large drawing distance to pre-warm images.
 * 3. Removes clipped subviews for memory efficiency.
 */
export function TrueNorthFlashList<T>({ estimatedItemSize = 250, ...props }: FlashListProps<T>) {
    return (
        <FlashList
            {...props}
            estimatedItemSize={estimatedItemSize}
            drawDistance={2 * SCREEN_HEIGHT}
            removeClippedSubviews={true}
            keyboardDismissMode="on-drag"
        />
    );
}
