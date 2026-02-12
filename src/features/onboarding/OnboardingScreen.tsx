import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { theme, palette } from '../../theme';
import { Check, ArrowRight, ChevronLeft, Plus, Shield, Heart, Sparkles, Compass, Lock, Fingerprint } from 'lucide-react-native';

const THEME_ICONS: Record<string, any> = {
    Strength: Shield,
    Love: Heart,
    Wisdom: Sparkles,
    Faith: Compass,
};

const THEMES = ['Strength', 'Love', 'Wisdom', 'Faith'];
const BELIEFS = ['Christian', 'Muslim', 'Secular'];

export const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    const setOnboarded = useStore(state => state.setOnboarded);
    const setPreferences = useStore(state => state.setPreferences);
    const setStoreUsername = useStore(state => state.setUsername);
    const setProfilePicture = useStore(state => state.setProfilePicture);
    const setLoggedIn = useStore(state => state.setLoggedIn);
    const setBiometricsEnabled = useStore(state => state.setBiometricsEnabled);
    const setSecurityPin = useStore(state => state.setSecurityPin);

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [beliefType, setBeliefType] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [setupBiometrics, setSetupBiometrics] = useState(false);
    const [pin, setPin] = useState('');
    const [goals, setGoals] = useState({
        spirituality: '',
        spouse: '',
        career: '',
        business: '',
        health: '',
        family: '',
        children: '',
        friends: '',
        finances: '',
    });

    const nextStep = async () => {
        if (step === 3) {
            // Step 3 is the Auth choice (mock sign in)
            setLoading(true);
            // Mock delay
            setTimeout(() => {
                setLoading(false);
                setStep(4);
            }, 1000);
        } else if (step === 4) {
            setStep(5);
        } else if (step === 5) {
            setStep(6);
        } else {
            // Final step: Finish onboarding
            setStoreUsername(username);
            setProfilePicture(profileImage);
            setPreferences(beliefType, selectedThemes, goals);
            setBiometricsEnabled(setupBiometrics);
            setSecurityPin(pin || null);
            setLoggedIn(true);
            setOnboarded(true);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const toggleTheme = (t: string) => {
        setSelectedThemes(prev =>
            prev.includes(t) ? prev.filter(i => i !== t) : [...prev, t]
        );
    };

    const renderHeader = (title: string, subtitle: string) => (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );

    const renderStep0 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Core Themes", "What areas of life do you want to focus on?")}
            <View style={styles.grid}>
                {THEMES.map(t => {
                    const Icon = THEME_ICONS[t];
                    return (
                        <TouchableOpacity
                            key={t}
                            style={[styles.themeCard, selectedThemes.includes(t) && styles.themeCardActive]}
                            onPress={() => toggleTheme(t)}
                        >
                            <View style={styles.themeHeader}>
                                <Icon
                                    size={24}
                                    color={selectedThemes.includes(t) ? palette.softGold : theme.colors.secondaryText}
                                    strokeWidth={1.5}
                                />
                                {selectedThemes.includes(t) && <Check size={18} color={palette.softGold} />}
                            </View>
                            <Text style={[styles.themeText, selectedThemes.includes(t) && styles.themeTextActive]}>{t}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    const handleGoalChange = (key: string, text: string) => {
        const words = text.trim().split(/\s+/);
        if (words.length <= 10 || text.endsWith(' ')) {
            setGoals(prev => ({ ...prev, [key]: text }));
        }
    };

    const renderStep1 = () => (
        <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
            {renderHeader("Daily Goals", "Tell us about your current priorities (max 10 words)")}
            {Object.keys(goals).map((key) => (
                <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Your ${key} goal...`}
                        placeholderTextColor={theme.colors.secondaryText}
                        value={(goals as any)[key]}
                        onChangeText={(text) => handleGoalChange(key, text)}
                        maxLength={100}
                    />
                </View>
            ))}
        </ScrollView>
    );
    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Belief Type", "This helps us personalize your affirmations")}
            <View style={styles.beliefGrid}>
                {BELIEFS.map(b => (
                    <TouchableOpacity
                        key={b}
                        style={[styles.beliefCard, beliefType === b && styles.beliefCardActive]}
                        onPress={() => setBeliefType(b)}
                    >
                        <Text style={[styles.beliefText, beliefType === b && styles.beliefTextActive]}>{b}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Join True North", "Create an account to save your journey.")}
            <View style={styles.authGrid}>
                {loading ? (
                    <ActivityIndicator color={theme.colors.text} size="large" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <TouchableOpacity style={styles.socialButton} onPress={nextStep}>
                            <Text style={styles.socialButtonText}>Continue with Apple</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={nextStep}>
                            <Text style={[styles.socialButtonText, styles.googleButtonText]}>Continue with Google</Text>
                        </TouchableOpacity>
                        <View style={styles.authDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        <TouchableOpacity style={styles.emailButton} onPress={nextStep}>
                            <Text style={styles.emailButtonText}>Continue with Email</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Choose Username", "How should we address you in True North?")}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={username}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setUsername}
                />
            </View>
        </View>
    );

    const renderStep5 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Profile Picture", "Let the community put a face to your name (Optional)")}
            <View style={styles.avatarPickerContainer}>
                <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400' }} style={[styles.avatarImage, { opacity: 0.3 }]} />
                            <View style={styles.plusOverlay}>
                                <Plus size={24} color={palette.ivory} />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.pickerHint}>{profileImage ? 'Tap to change' : 'Tap to upload'}</Text>
            </View>
        </View>
    );

    const renderStep6 = () => (
        <View style={styles.stepContainer}>
            {renderHeader("Sanctuary Security", "Protect your private reflections with biometrics or a PIN.")}

            <TouchableOpacity
                style={[styles.securityCard, setupBiometrics && styles.securityCardActive]}
                onPress={() => setSetupBiometrics(!setupBiometrics)}
            >
                <View style={styles.securityIconContainer}>
                    <Fingerprint size={28} color={setupBiometrics ? palette.ivory : theme.colors.text} />
                </View>
                <View style={styles.securityTextContainer}>
                    <Text style={[styles.securityTitle, setupBiometrics && styles.securityTextActive]}>Enable Biometrics</Text>
                    <Text style={[styles.securityDesc, setupBiometrics && styles.securityTextActive]}>Use FaceID or TouchID to unlock your journal.</Text>
                </View>
                {setupBiometrics && <Check size={20} color={palette.ivory} />}
            </TouchableOpacity>

            <View style={styles.pinSection}>
                <Text style={styles.label}>Or set a 4-digit PIN</Text>
                <TextInput
                    style={styles.pinInput}
                    placeholder="••••"
                    placeholderTextColor={theme.colors.secondaryText}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={pin}
                    onChangeText={setPin}
                    secureTextEntry
                />
                <Text style={styles.pinHint}>Recommended if biometrics are unavailable.</Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <View style={styles.nav}>
                {step > 0 && !loading && (
                    <TouchableOpacity onPress={prevStep}>
                        <ChevronLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {step === 0 && renderStep0()}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
            </View>

            <View style={styles.footer}>
                {step !== 3 && (
                    <TouchableOpacity
                        style={[styles.nextButton, step === 4 && !username && { opacity: 0.5 }]}
                        onPress={nextStep}
                        disabled={step === 4 && !username}
                    >
                        <Text style={styles.nextButtonText}>{step === 6 ? "Get Started" : "Continue"}</Text>
                        <ArrowRight size={20} color={theme.colors.inverseText} />
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.xl },
    nav: { height: 40, justifyContent: 'center', marginBottom: theme.spacing.md },
    content: { flex: 1 },
    header: { marginBottom: theme.spacing.xxl, marginTop: theme.spacing.lg },
    title: { fontFamily: theme.typography.serifBold, fontSize: 34, color: theme.colors.text, marginBottom: theme.spacing.sm, letterSpacing: -0.5 },
    subtitle: { fontFamily: theme.typography.sans, fontSize: 17, color: theme.colors.secondaryText, lineHeight: 24 },
    stepContainer: { flex: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    themeCard: {
        width: '47.5%', height: 110, backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg,
        justifyContent: 'space-between', borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 1
    },
    themeCardActive: { borderColor: palette.softGold, backgroundColor: '#FAF9F6' },
    themeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    themeText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    themeTextActive: { color: palette.softGold },
    inputGroup: { marginBottom: theme.spacing.lg },
    label: { fontFamily: theme.typography.sansMedium, fontSize: 14, color: theme.colors.text, marginBottom: theme.spacing.xs, textTransform: 'uppercase', letterSpacing: 1 },
    input: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text,
        borderWidth: 1, borderColor: theme.colors.border
    },
    beliefGrid: { gap: theme.spacing.md },
    beliefCard: {
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border
    },
    beliefCardActive: { backgroundColor: theme.colors.text },
    beliefText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: theme.colors.text },
    beliefTextActive: { color: theme.colors.inverseText },
    authGrid: { gap: theme.spacing.md },
    socialButton: {
        backgroundColor: theme.colors.text, height: 56, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center'
    },
    socialButtonText: { color: theme.colors.inverseText, fontFamily: theme.typography.sansBold, fontSize: 16 },
    googleButton: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border },
    googleButtonText: { color: theme.colors.text },
    authDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.md },
    dividerLine: { flex: 1, height: 1, backgroundColor: palette.border },
    dividerText: { marginHorizontal: theme.spacing.md, color: theme.colors.secondaryText, fontFamily: theme.typography.sans },
    emailButton: {
        height: 56, borderRadius: theme.borderRadius.full, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.colors.border
    },
    emailButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    footer: { paddingVertical: theme.spacing.xl },
    nextButton: {
        backgroundColor: theme.colors.text, borderRadius: theme.borderRadius.full,
        height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm
    },
    nextButtonText: { color: theme.colors.inverseText, fontFamily: theme.typography.sansBold, fontSize: 17 },
    avatarPickerContainer: { alignItems: 'center', marginTop: 40 },
    avatarCircle: {
        width: 150, height: 150, borderRadius: 75, backgroundColor: theme.colors.surface,
        overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border,
        justifyContent: 'center', alignItems: 'center'
    },
    avatarImage: { width: '100%', height: '100%' },
    avatarPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    plusOverlay: {
        position: 'absolute', width: 44, height: 44, borderRadius: 22,
        backgroundColor: theme.colors.text, justifyContent: 'center', alignItems: 'center'
    },
    pickerHint: { fontFamily: theme.typography.sansBold, fontSize: 15, color: theme.colors.primary, marginTop: theme.spacing.lg },
    securityCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: 16, padding: theme.spacing.xl, borderWidth: 1, borderColor: theme.colors.border,
        marginBottom: 24, gap: theme.spacing.lg
    },
    securityCardActive: { backgroundColor: theme.colors.text, borderColor: theme.colors.text },
    securityIconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: palette.softGold + '20', alignItems: 'center', justifyContent: 'center' },
    securityTextContainer: { flex: 1 },
    securityTitle: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text, marginBottom: 4 },
    securityDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, lineHeight: 18 },
    securityTextActive: { color: palette.ivory },
    pinSection: { marginTop: 8 },
    pinInput: {
        backgroundColor: theme.colors.surface, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border,
        height: 60, textAlign: 'center', fontSize: 28, letterSpacing: 20, color: theme.colors.text,
        fontFamily: theme.typography.serifBold, marginTop: 12
    },
    pinHint: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, marginTop: 12, textAlign: 'center' }
});
