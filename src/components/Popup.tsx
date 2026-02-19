import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native';
import { theme, palette } from '../theme';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface PopupProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    transparent?: boolean;
}

export const Popup: React.FC<PopupProps> = ({
    visible,
    onClose,
    children,
    transparent = true,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={transparent}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: Math.min(width * 0.85, 340),
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        overflow: 'hidden',
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});
