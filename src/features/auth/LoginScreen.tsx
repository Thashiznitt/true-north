import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TextInput, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, palette } from '../../theme';
import { useStore } from '../../store';
import { authService, AuthProvider } from '../../services/auth';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { FadeIn } from '../../components/FadeIn';
import { Typography } from '../../components/Typography';

export const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const { reset, beliefType } = useStore();
    const sanctuaryName = ['Catholic', 'Christian', 'Protestant'].includes(beliefType || '') ? 'Sanctuary' : 'Sacred Space';

    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'options' | 'email'>('options');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (provider: AuthProvider) => {
        setLoading(true);
        try {
            await authService.login(provider, provider === 'Email' ? email : undefined, provider === 'Email' ? password : undefined);

            // Allow state to update
            setTimeout(() => {
                const { subscriptionTier } = useStore.getState();
                if (subscriptionTier === 'free') {
                    // Navigate to subscription if not subscribed
                    // We need to use root navigation to ensure we can go to the Subscription screen
                    // forcing navigation to subscription
                    // Note: RootNavigator switches stacks based on state, so we might need to handle this carefully.
                    // If RootNavigator switches to Main, we can rely on initialRoute or navigate there.
                }
            }, 100);

        } catch (error) {
            Alert.alert("Login Failed", `Unable to access the ${sanctuaryName.toLowerCase()} at this time. Please check your credentials.`);
        } finally {
            setLoading(false);
        }
    };

    const handleRestartOnboarding = () => {
        Alert.alert(
            "Start Fresh?",
            "This will clear your current progress and let you begin the onboarding journey again.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Restart",
                    style: "destructive",
                    onPress: async () => {
                        reset();
                        // Give a slight delay to ensure state update propagates before navigating
                        setTimeout(() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Onboarding' }],
                            });
                        }, 100);
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                <FadeIn delay={100} from="top">
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <ShieldCheck size={40} color={palette.softGold} />
                        </View>
                        <Typography variant="header" align="center" style={{ marginBottom: 12 }}>Welcome Back</Typography>
                        <Typography variant="body" align="center" color={theme.colors.secondaryText}>Enter your {sanctuaryName.toLowerCase()} to continue your journey of reflection.</Typography>
                    </View>
                </FadeIn>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={palette.softGold} />
                        <Text style={styles.loadingText}>Opening {sanctuaryName}...</Text>
                    </View>
                ) : mode === 'options' ? (
                    <FadeIn delay={300} from="bottom">
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity style={styles.socialButton} onPress={() => handleLogin('Apple')}>
                                <Text style={styles.socialButtonText}>Continue with Apple</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={() => handleLogin('Google')}>
                                <Text style={[styles.socialButtonText, styles.googleButtonText]}>Continue with Google</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>or</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity style={styles.emailButton} onPress={() => setMode('email')}>
                                <Text style={styles.emailButtonText}>Continue with Email</Text>
                            </TouchableOpacity>
                        </View>
                    </FadeIn>
                ) : (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <TouchableOpacity style={styles.backButton} onPress={() => setMode('options')}>
                            <ArrowLeft size={20} color={theme.colors.secondaryText} />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor={theme.colors.secondaryText}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={theme.colors.secondaryText}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin('Email')}>
                            <Text style={styles.loginButtonText}>Enter {sanctuaryName}</Text>
                            <ArrowRight size={20} color={palette.ivory} />
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                )}
            </View>

            <FadeIn delay={600} from="bottom">
                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleRestartOnboarding}>
                        <Text style={styles.restartText}>Need to start over? <Text style={styles.restartLink}>Restart Onboarding</Text></Text>
                    </TouchableOpacity>

                    <View style={styles.legalFooter}>
                        <Text style={styles.legalText}>By continuing, you agree to our </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://truenorth.you/terms')}>
                            <Text style={styles.legalLink}>Terms of Service</Text>
                        </TouchableOpacity>
                        <Text style={styles.legalText}> and </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://truenorth.you/privacy')}>
                            <Text style={styles.legalLink}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </FadeIn>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.xl },
    content: { flex: 1, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 48 },
    logoContainer: {
        width: 80, height: 80, borderRadius: 24, backgroundColor: theme.colors.surface,
        alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        borderWidth: 1, borderColor: theme.colors.border
    },
    loadingContainer: { alignItems: 'center', gap: 20 },
    loadingText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: palette.softGold },
    optionsContainer: { gap: 16 },
    socialButton: {
        height: 56, borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.text,
        alignItems: 'center', justifyContent: 'center'
    },
    socialButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 16 },
    googleButton: { backgroundColor: palette.white, borderWidth: 1, borderColor: theme.colors.border },
    googleButtonText: { color: theme.colors.text },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
    dividerText: { marginHorizontal: 16, color: theme.colors.secondaryText, fontFamily: theme.typography.sans, fontSize: 14 },
    emailButton: {
        height: 56, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.border,
        alignItems: 'center', justifyContent: 'center'
    },
    emailButtonText: { color: theme.colors.text, fontFamily: theme.typography.sansBold, fontSize: 16 },
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
    backButtonText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.secondaryText },
    inputGroup: { marginBottom: 20 },
    label: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    input: {
        height: 56, backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border,
        paddingHorizontal: 16, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text
    },
    loginButton: {
        height: 56, backgroundColor: theme.colors.text, borderRadius: theme.borderRadius.full,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12
    },
    loginButtonText: { color: palette.ivory, fontFamily: theme.typography.sansBold, fontSize: 17 },
    footer: { paddingVertical: 24, alignItems: 'center' },
    restartText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText },
    restartLink: { color: palette.softGold, fontFamily: theme.typography.sansBold },
    legalFooter: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, paddingHorizontal: 20 },
    legalText: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText },
    legalLink: { fontFamily: theme.typography.sansMedium, fontSize: 12, color: palette.softGold, textDecorationLine: 'underline' }
});
