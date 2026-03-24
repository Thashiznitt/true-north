import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Text, DimensionValue, TextInput, Animated, Dimensions } from 'react-native';
import { theme, palette } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    actionLabel?: string;
    onAction?: () => void;
    height?: DimensionValue;
    key?: string | number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheetComponent = ({
    visible,
    onClose,
    title,
    children,
    actionLabel,
    onAction,
    height = 'auto'
}: PropsWithChildren<BottomSheetProps>) => {
    const insets = useSafeAreaInsets();
    const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    
    React.useEffect(() => {
        if (visible) {
            console.log(`[BottomSheet] Showing sheet: ${title}`);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, title, translateY]);

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View 
                        style={[
                            styles.overlay,
                            {
                                opacity: translateY.interpolate({
                                    inputRange: [0, SCREEN_HEIGHT],
                                    outputRange: [1, 0]
                                })
                            }
                        ]}
                    >
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    { 
                                        paddingBottom: insets.bottom + 20, 
                                        height,
                                        transform: [{ translateY }]
                                    },
                                    height !== 'auto' && { flex: 1 }
                                ]}
                            >
                                <View style={styles.header}>
                                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                        <X size={24} color={theme.colors.text} />
                                    </TouchableOpacity>
    
                                    {title && (
                                        <Text style={styles.title}>{title}</Text>
                                    )}
    
                                    {actionLabel && onAction ? (
                                        <TouchableOpacity onPress={onAction}>
                                            <Text style={styles.actionLabel}>{actionLabel}</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.placeholder} />
                                    )}
                                </View>
                                <KeyboardAvoidingView 
                                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                    style={[styles.body, height !== 'auto' ? { flex: 1 } : { flex: 0 }]}
                                >
                                    {children}
                                </KeyboardAvoidingView>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};

const BottomSheetTextInput = (props: React.ComponentProps<typeof TextInput>) => {
    return (
        <TextInput
            placeholderTextColor={theme.colors.secondaryText}
            {...props}
            style={[styles.input, props.style]}
        />
    );
};

export const BottomSheet = Object.assign(BottomSheetComponent, {
    TextInput: BottomSheetTextInput
}) as React.FC<React.PropsWithChildren<BottomSheetProps>> & { TextInput: typeof BottomSheetTextInput };

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    contentContainer: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingHorizontal: 20,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border + '50',
        marginBottom: 16,
    },
    title: {
        fontFamily: theme.typography.serifBold,
        fontSize: 18,
        color: theme.colors.text,
    },
    closeButton: {
        padding: 4,
    },
    placeholder: {
        width: 32,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: palette.softGold + '20',
        borderRadius: 12,
    },
    actionLabel: {
        fontFamily: theme.typography.sansBold,
        fontSize: 14,
        color: palette.softGold,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 16,
        fontFamily: theme.typography.sans,
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 12
    },
    body: {
        width: '100%',
        flexDirection: 'column',
    }
});
