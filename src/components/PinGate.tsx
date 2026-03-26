import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    Animated,
    Dimensions
} from 'react-native';
import { useStore } from '../store';
import { theme, palette } from '../theme';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PinGateProps {
    children: React.ReactNode;
}

export const PinGate: React.FC<PinGateProps> = ({ children }) => {
    const { securityPin, isSessionUnlocked, setSessionUnlocked } = useStore();
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!isSessionUnlocked && securityPin) {
            // Focus input when the gate is active
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isSessionUnlocked, securityPin]);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handlePinChange = (text: string) => {
        setPin(text);
        setError(false);
        if (text.length === 4) {
            if (text === securityPin) {
                setSessionUnlocked(true);
            } else {
                setError(true);
                shake();
                setPin('');
            }
        }
    };

    if (!securityPin || isSessionUnlocked) {
        return <>{children}</>;
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Lock size={32} color={palette.softGold} />
                    </View>
                    <Text style={styles.title}>Session Locked</Text>
                    <Text style={styles.subtitle}>Enter your 4-digit PIN to continue your journey.</Text>
                </View>

                <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnim }] }]}>
                    <TextInput
                        ref={inputRef}
                        style={styles.hiddenInput}
                        value={pin}
                        onChangeText={handlePinChange}
                        keyboardType="number-pad"
                        maxLength={4}
                        autoFocus={true}
                    />
                    
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2, 3].map((i) => (
                            <View 
                                key={i} 
                                style={[
                                    styles.dot, 
                                    pin.length > i && styles.dotFilled,
                                    error && styles.dotError
                                ]} 
                            />
                        ))}
                    </View>
                </Animated.View>

                {error && (
                    <Text style={styles.errorText}>Incorrect PIN. Please try again.</Text>
                )}

                <View style={styles.footer}>
                    <ShieldCheck size={16} color={theme.colors.secondaryText} />
                    <Text style={styles.footerText}>Your sanctuary is protected</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: palette.softGold + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontFamily: theme.typography.serifBold,
        fontSize: 28,
        color: theme.colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: theme.typography.sans,
        fontSize: 16,
        color: theme.colors.secondaryText,
        textAlign: 'center',
        lineHeight: 24,
    },
    pinContainer: {
        marginBottom: 40,
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: palette.softGold + '40',
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: palette.softGold,
        borderColor: palette.softGold,
    },
    dotError: {
        borderColor: 'rebeccapurple', // User might prefer a standard red or something themed
    },
    errorText: {
        color: 'red',
        fontFamily: theme.typography.sansMedium,
        fontSize: 14,
        marginBottom: 20,
    },
    footerStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: 0.6,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        opacity: 0.6,
    },
    footerText: {
        fontFamily: theme.typography.sans,
        fontSize: 13,
        color: theme.colors.secondaryText,
    }
});
