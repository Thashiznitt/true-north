import React, { forwardRef } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * A wrapper around FlashList that enforces performance best practices.
 */
export const TrueNorthFlashList = forwardRef(<T,>(props: FlashListProps<T> & { estimatedItemSize: number }, ref: React.Ref<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const FlashListComp = FlashList as any;
    return (
        <FlashListComp
            ref={ref}
            {...props}
            drawDistance={2 * SCREEN_HEIGHT}
            removeClippedSubviews={true}
            keyboardDismissMode="on-drag"
        />
    );
});
