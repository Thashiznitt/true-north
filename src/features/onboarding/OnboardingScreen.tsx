/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OptimizedImage } from '../../components/performance/OptimizedImage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { theme, palette } from '../../theme';
import { Check, ArrowRight, ChevronLeft, Plus, Shield, Heart, Sparkles, Compass, Lock, Fingerprint, Star } from 'lucide-react-native';
import { subscriptionService } from '../../services/subscription';
import * as Location from 'expo-location';


const THEME_ICONS: Record<string, any> = {
    Strength: Shield,
    Love: Heart,
    Wisdom: Sparkles,
    Faith: Compass,
};

const THEMES = ['Strength', 'Love', 'Wisdom', 'Faith'];
const BELIEFS = ['Christian', 'Muslim', 'Secular'];

const INTRO_BG = require('../../../assets/onboarding_intro_bg.png');

export const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    const setOnboarded = useStore(state => state.setOnboarded);
    const setPreferences = useStore(state => state.setPreferences);
    const setStoreUsername = useStore(state => state.setUsername);
    const setProfilePicture = useStore(state => state.setProfilePicture);
    const setLoggedIn = useStore(state => state.setLoggedIn);
    const setBiometricsEnabled = useStore(state => state.setBiometricsEnabled);
    const setSecurityPin = useStore(state => state.setSecurityPin);

    const navigation = useNavigation<any>();
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
        if (step === 4) {
            // Step 4 is now the Auth choice (previously 3)
            setLoading(true);
            // Mock delay
            setTimeout(() => {
                setLoading(false);
                setStep(5);
            }, 1000);
        } else if (step === 5) {
            setStep(6);
        } else if (step === 6) {
            setStep(7);
        } else if (step === 7) {
            setStep(8);
        } else if (step === 8) {
            // Step 8 is Location (previously 7)
            setStep(9);
        } else if (step === 9) {
            // Step 9 is Subscription (previously 8)
            finishOnboarding();
        } else {
            setStep(step + 1);
        }
    };

    const finishOnboarding = () => {
        setStoreUsername(username);
        setProfilePicture(profileImage);
        setPreferences(beliefType, selectedThemes, {
            ...goals,
            dailyReflection: true,
            morningDevotion: true,
            eveningGratitude: true,
            weeklyCommunity: true
        });
        setBiometricsEnabled(setupBiometrics);
        setSecurityPin(pin || null);
        setLoggedIn(true);
        setOnboarded(true);
    };

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            await subscriptionService.subscribe('monthly_journey');
            finishOnboarding();
        } catch (error) {
            Alert.alert("Subscription Failed", "Please try again or continue with the limited version.");
        } finally {
            setLoading(false);
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

    const StepContainer = ({ children }: { children: React.ReactNode }) => (
        <View style={[styles.stepContainer, { paddingHorizontal: theme.spacing.xl }]}>
            {children}
        </View>
    );

    const renderIntroStep = () => (
        <View style={StyleSheet.absoluteFill}>
            <ImageBackground source={INTRO_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.introContent}>
                <Sparkles size={48} color={palette.softGold} style={{ marginBottom: 24 }} />
                <Text style={styles.introTitle}>Align Your Soul</Text>
                <Text style={styles.introSubtitle}>
                    Daily affirmations are the sacred whispers that reshape your mindset, unlocking divine peace and purpose in every moment.
                </Text>

                <View style={styles.introBenefits}>
                    <View style={styles.introBenefitRow}>
                        <Star size={20} color={palette.softGold} />
                        <Text style={styles.introBenefitText}>Positive Life Transformation</Text>
                    </View>
                    <View style={styles.introBenefitRow}>
                        <Star size={20} color={palette.softGold} />
                        <Text style={styles.introBenefitText}>Spiritual Mindset Alignment</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.introButton} onPress={nextStep}>
                    <Text style={styles.introButtonText}>Begin</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep0 = () => (
        <StepContainer>
            {renderHeader("Core Themes", "What areas of life do you want to focus on?")}
            <View style={styles.grid}>
                {THEMES.map((t, index) => {
                    const Icon = THEME_ICONS[t];
                    return (
                        <View key={t} style={{ width: '47.5%' }}>
                            <TouchableOpacity
                                style={[styles.themeCard, selectedThemes.includes(t) && styles.themeCardActive, { width: '100%' }]}
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
                        </View>
                    );
                })}
            </View>
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLinkText}>Have an account? <Text style={styles.loginLinkHighlight}>Log In</Text></Text>
            </TouchableOpacity>
        </StepContainer>
    );

    // ... (logic for handleGoalChange)

    // ... (logic for handleGoalChange)
    const handleGoalChange = (key: string, text: string) => {
        setGoals(prev => ({
            ...prev,
            [key]: text
        }));
    };

    const renderStep1 = () => (
        <>
            {/* eslint-disable-next-line truenorth-performance/no-scrollview */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <StepContainer>
                    {renderHeader("Daily Goals", "Tell us about your current priorities (max 10 words)")}
                    {Object.keys(goals).map((key, index) => (
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
                </StepContainer>
            </ScrollView>
        </>
    );

    const renderStep2 = () => (
        <StepContainer>
            {renderHeader("Belief Type", "This helps us personalize your affirmations")}
            <View style={styles.beliefGrid}>
                {BELIEFS.map((b, index) => (
                    <View key={b}>
                        <TouchableOpacity
                            style={[styles.beliefCard, beliefType === b && styles.beliefCardActive]}
                            onPress={() => setBeliefType(b)}
                        >
                            <Text style={[styles.beliefText, beliefType === b && styles.beliefTextActive]}>{b}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </StepContainer>
    );

    const renderStep3 = () => (
        <StepContainer>
            {renderHeader("Join True North", "Create an account to save your journey.")}
            <View style={styles.authGrid}>
                {loading ? (
                    <ActivityIndicator color={theme.colors.text} size="large" style={{ marginTop: 40 }} />
                ) : (
                    <>
                        <TouchableOpacity style={styles.socialButton} onPress={() => {
                            useStore.getState().setEmail('remy_shiznitt@hotmail.com');
                            nextStep();
                        }}>
                            <Text style={styles.socialButtonText}>Continue with Apple</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={() => {
                            useStore.getState().setEmail('remyngatia@gmail.com');
                            nextStep();
                        }}>
                            <Text style={[styles.socialButtonText, styles.googleButtonText]}>Continue with Google</Text>
                        </TouchableOpacity>
                        <View style={styles.authDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        <TouchableOpacity style={styles.emailButton} onPress={() => {
                            useStore.getState().setEmail('user@example.com');
                            nextStep();
                        }}>
                            <Text style={styles.emailButtonText}>Continue with Email</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </StepContainer>
    );

    const renderStep4 = () => (
        <StepContainer>
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
        </StepContainer>
    );

    const renderStep5 = () => (
        <StepContainer>
            {renderHeader("Profile Picture", "Let the community put a face to your name (Optional)")}
            <View style={styles.avatarPickerContainer}>
                <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
                    {profileImage ? (
                        <OptimizedImage source={{ uri: profileImage }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <OptimizedImage source={{ uri: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=400' }} style={[styles.avatarImage, { opacity: 0.3 }]} />
                            <View style={styles.plusOverlay}>
                                <Plus size={24} color={palette.ivory} />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.pickerHint}>{profileImage ? 'Tap to change' : 'Tap to upload'}</Text>
            </View>
        </StepContainer>
    );

    const renderStep6 = () => (
        <StepContainer>
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
        </StepContainer>
    );

    const renderStep7 = () => (
        <StepContainer>
            {renderHeader("Local Sanctuaries", "Find fellow seekers in your area for deeper connection.")}

            <View style={styles.locationCard}>
                <View style={styles.locationIconContainer}>
                    <Compass size={40} color={palette.softGold} />
                </View>
                <Text style={styles.locationTitle}>Find Your Community</Text>
                <Text style={styles.locationDesc}>
                    Granting location access helps us prioritize community sanctuaries near you. Your exact position is never shared.
                </Text>

                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={async () => {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert("Permission Needed", "Location access helps us find nearby sanctuaries. You can enable this later in settings.");
                        }
                        nextStep();
                    }}
                >
                    <Text style={styles.locationButtonText}>Allow Sanctuary Scaling</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={nextStep}>
                    <Text style={styles.skipButtonText}>Maybe Later</Text>
                </TouchableOpacity>
            </View>
        </StepContainer>
    );

    const renderStep8 = () => (
        // Premium Upsell Step
        <>
            {/* eslint-disable-next-line truenorth-performance/no-scrollview */}
            <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
                {renderHeader("Unlock Full Potential", "Start your journey with full access.")}

                <View style={styles.premiumCard}>
                    <View style={styles.premiumHeader}>
                        <Sparkles size={32} color={palette.softGold} />
                        <Text style={styles.premiumTitle}>True North Premium</Text>
                    </View>

                    <View style={styles.benefitList}>
                        <View style={styles.benefitRow}>
                            <Check size={20} color={palette.softGold} />
                            <Text style={styles.benefitText}>Unlimited Journal Entries</Text>
                        </View>
                        <View style={styles.benefitRow}>
                            <Check size={20} color={palette.softGold} />
                            <Text style={styles.benefitText}>Personalized Divine Guidance</Text>
                        </View>
                        <View style={styles.benefitRow}>
                            <Check size={20} color={palette.softGold} />
                            <Text style={styles.benefitText}>Prioritized Local Sanctuaries</Text>
                        </View>
                        <View style={styles.benefitRow}>
                            <Check size={20} color={palette.softGold} />
                            <Text style={styles.benefitText}>Secure Biometric Lock</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                        {loading ? (
                            <ActivityIndicator color={palette.ivory} />
                        ) : (
                            <>
                                <Text style={styles.subscribeButtonText}>Subscribe $12.99 / mo</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipButton} onPress={finishOnboarding}>
                        <Text style={styles.skipButtonText}>Maybe Later (Continue Free)</Text>
                    </TouchableOpacity>

                    <Text style={styles.disclaimerText}>
                        No commitment. Cancel anytime in settings.
                    </Text>
                </View>
            </ScrollView>
        </>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, step !== 0 && { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            {step !== 0 && (
                <View style={styles.nav}>
                    {step > 0 && !loading && (
                        <TouchableOpacity onPress={prevStep}>
                            <ChevronLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.content}>
                {step === 0 && renderIntroStep()}
                {step === 1 && renderStep0()}
                {step === 2 && renderStep1()}
                {step === 3 && renderStep2()}
                {step === 4 && renderStep3()}
                {step === 5 && renderStep4()}
                {step === 6 && renderStep5()}
                {step === 7 && renderStep6()}
                {step === 8 && renderStep7()}
                {step === 9 && renderStep8()}
            </View>

            {step !== 0 && step !== 4 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.nextButton, step === 5 && !username && { opacity: 0.5 }]}
                        onPress={nextStep}
                        disabled={(step === 5 && !username) || step === 8 || step === 9}
                    >
                        <Text style={styles.nextButtonText}>{(step === 8 || step === 9) ? "" : "Continue"}</Text>
                        {(step !== 8 && step !== 9) && <ArrowRight size={20} color={theme.colors.inverseText} />}
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    introContent: { flex: 1, justifyContent: 'flex-end', paddingBottom: 60, paddingHorizontal: theme.spacing.xl * 2 },
    introTitle: { fontFamily: theme.typography.serifBold, fontSize: 42, color: palette.ivory, marginBottom: theme.spacing.md, letterSpacing: -1 },
    introSubtitle: { fontFamily: theme.typography.sans, fontSize: 18, color: palette.ivory, opacity: 0.9, lineHeight: 28, marginBottom: 32 },
    introBenefits: { marginBottom: 40, gap: 12 },
    introBenefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    introBenefitText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: palette.softGold },
    introButton: { backgroundColor: palette.softGold, paddingVertical: 20, borderRadius: theme.borderRadius.full, alignItems: 'center', shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
    introButtonText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: palette.ivory },
    nav: { height: 40, justifyContent: 'center', marginBottom: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
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
    footer: { paddingVertical: theme.spacing.xl, paddingHorizontal: theme.spacing.xl },
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
    pinHint: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, marginTop: 12, textAlign: 'center' },
    loginLink: { marginTop: theme.spacing.xl, alignItems: 'center' },
    loginLinkText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.secondaryText },
    loginLinkHighlight: { fontFamily: theme.typography.sansBold, color: palette.softGold },
    premiumCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: palette.softGold,
        marginTop: theme.spacing.md,
        alignItems: 'center',
        shadowColor: palette.softGold,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5
    },
    premiumHeader: { alignItems: 'center', marginBottom: theme.spacing.xl },
    premiumTitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginTop: theme.spacing.md },
    benefitList: { width: '100%', gap: theme.spacing.md, marginBottom: theme.spacing.xxl },
    benefitRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
    benefitText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text },
    subscribeButton: {
        backgroundColor: theme.colors.text,
        width: '100%',
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginBottom: theme.spacing.md
    },
    subscribeButtonText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: palette.ivory },
    subscribeSubText: { fontFamily: theme.typography.sans, fontSize: 12, color: palette.ivory, opacity: 0.8, marginTop: 2 },
    skipButton: { paddingVertical: 12 },
    skipButtonText: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: theme.colors.secondaryText },
    saveButtonText: { color: theme.colors.text, fontFamily: theme.typography.sansBold, fontSize: 14 },
    locationCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        padding: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginTop: theme.spacing.md,
        alignItems: 'center',
    },
    locationIconContainer: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.xl
    },
    locationTitle: { fontFamily: theme.typography.serifBold, fontSize: 24, color: theme.colors.text, marginBottom: theme.spacing.md },
    locationDesc: { fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText, textAlign: 'center', lineHeight: 24, marginBottom: theme.spacing.xxl },
    locationButton: {
        backgroundColor: theme.colors.text,
        width: '100%',
        paddingVertical: 18,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginBottom: theme.spacing.md
    },
    locationButtonText: { fontFamily: theme.typography.sansBold, fontSize: 17, color: palette.ivory },
    disclaimerText: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: theme.spacing.lg, textAlign: 'center', opacity: 0.7 }
});
