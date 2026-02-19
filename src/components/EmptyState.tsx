import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import { theme, palette } from '../theme';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    buttonLabel?: string;
    onPress?: () => void;
    isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    buttonLabel,
    onPress,
    isLoading = false
}) => {
    return (
        <View style={styles.container}>
            <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 1000 }}
                style={styles.content}
            >
                <View style={styles.iconContainer}>
                    <Icon size={48} color={theme.colors.primary} strokeWidth={1.5} />
                </View>

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                {onPress && buttonLabel && (
                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={onPress}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </MotiView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'transparent',
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.primary + '10', // 10% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        ...theme.typography.body,
        color: theme.colors.secondaryText,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        ...theme.typography.caption,
        fontFamily: theme.typography.sansBold,
        color: 'white',
    },
});
