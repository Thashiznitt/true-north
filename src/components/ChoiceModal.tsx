import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { theme, palette } from '../theme';
import { Popup } from './Popup';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export interface ChoiceOption {
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'cancel';
}

interface ChoiceModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    options: ChoiceOption[];
}

const ChoiceModal: React.FC<ChoiceModalProps> = ({ visible, onClose, title, message, options }) => {
    // Sort options: cancel should be at the bottom for better UX
    const sortedOptions = [...options].sort((a, b) => {
        if (a.style === 'cancel') return 1;
        if (b.style === 'cancel') return -1;
        return 0;
    });

    return (
        <Popup visible={visible} onClose={onClose}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {message ? <Text style={styles.message}>{message}</Text> : null}

                <View style={styles.optionsContainer}>
                    {sortedOptions.map((option, index) => (
                        <TouchableOpacity
                            key={`${option.text}-${index}`}
                            style={[
                                styles.optionButton,
                                index === sortedOptions.length - 1 && styles.lastOption
                            ]}
                            onPress={() => {
                                onClose();
                                // Small delay to let modal close before triggerring navigation/alerts
                                setTimeout(() => option.onPress(), 100);
                            }}
                        >
                            <Text style={[
                                styles.optionText,
                                option.style === 'destructive' && styles.destructiveText,
                                option.style === 'cancel' && styles.cancelText
                            ]}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Popup>
    );
};

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
    },
    title: {
        fontFamily: theme.typography.sansBold,
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 8,
        color: theme.colors.text,
    },
    message: {
        fontFamily: theme.typography.sans,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 24,
        color: theme.colors.secondaryText,
        lineHeight: 20,
        marginBottom: 12,
    },
    optionsContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginTop: 12,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 30,
        marginBottom: 10,
    },
    lastOption: {
        marginBottom: 0,
        marginTop: 4,
        backgroundColor: 'transparent',
    },
    optionText: {
        fontFamily: theme.typography.sansBold,
        fontSize: 16,
        color: theme.colors.text,
    },
    destructiveText: {
        color: '#FF3B30',
    },
    cancelText: {
        color: palette.softGold,
        fontFamily: theme.typography.sansBold,
    }
});

export default ChoiceModal;
