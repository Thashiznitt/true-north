import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Text, DimensionValue, TextInput } from 'react-native';
import { theme, palette } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    height?: DimensionValue;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    title,
    children,
    actionLabel,
    onAction,
    height = 'auto'
}) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                            style={[
                                styles.contentContainer,
                                { paddingBottom: insets.bottom + 20, height }
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
                            <View style={[styles.body, height !== 'auto' && { flex: 1 }]}>
                                {children}
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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
});

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
    }
});
