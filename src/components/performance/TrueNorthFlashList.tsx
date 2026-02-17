import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * A wrapper around FlashList that enforces performance best practices.
 */
export function TrueNorthFlashList<T>(props: FlashListProps<T> & { estimatedItemSize: number }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FlashListComp = FlashList as any;
    return (
        <FlashListComp
            {...props}
            drawDistance={2 * SCREEN_HEIGHT}
            removeClippedSubviews={true}
            keyboardDismissMode="on-drag"
        />
    );
}
