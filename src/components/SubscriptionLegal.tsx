import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { theme, palette } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { subscriptionService } from '../services/subscription';

interface SubscriptionLegalProps {
    light?: boolean;
}

export const SubscriptionLegal: React.FC<SubscriptionLegalProps> = ({ light = false }) => {
    const navigation = useNavigation<any>();
    const [restoring, setRestoring] = React.useState(false);

    const handleRestore = async () => {
        setRestoring(true);
        const success = await subscriptionService.restorePurchases();
        setRestoring(false);
        if (success) {
            Alert.alert("Success", "Your purchases have been restored.");
        } else {
            Alert.alert("Restore Failed", "We couldn't find any active subscriptions for your account.");
        }
    };

    const textColor = light ? palette.ivory : theme.colors.secondaryText;
    const linkColor = light ? palette.softGold : theme.colors.primary;
    const opacity = light ? 0.7 : 0.8;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleRestore}
                disabled={restoring}
                style={styles.restoreButton}
            >
                {restoring ? (
                    <ActivityIndicator size="small" color={linkColor} />
                ) : (
                    <Text style={[styles.restoreText, { color: linkColor }]}>Already a member? Restore Purchases</Text>
                )}
            </TouchableOpacity>

            <Text style={[styles.legalText, { color: textColor, opacity }]}>
                A purchase will be applied to your iTunes account on confirmation of purchase for the selected plan.
                Subscriptions will automatically renew unless canceled within 24-hours before the end of the current period.
                You can cancel anytime with your iTunes account settings. Any unused portion of a free trial, if offered,
                will be forfeited if you purchase a subscription.
            </Text>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => Linking.openURL('https://truenorth.you/privacy')}>
                    <Text style={[styles.linkText, { color: linkColor }]}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={[styles.separator, { color: textColor }]}> • </Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://truenorth.you/terms')}>
                    <Text style={[styles.linkText, { color: linkColor }]}>Terms of Use</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    restoreButton: {
        marginBottom: 20,
        padding: 8,
    },
    restoreText: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 13,
        textDecorationLine: 'underline',
    },
    legalText: {
        fontFamily: theme.typography.sans,
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    linkText: {
        fontFamily: theme.typography.sansMedium,
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    separator: {
        fontSize: 12,
    }
});
