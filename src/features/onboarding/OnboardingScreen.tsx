/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OptimizedImage } from '../../components/performance/OptimizedImage';
import { useNavigation } from '@react-navigation/native';
import { FadeIn } from '../../components/FadeIn';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { notificationService } from '../../services/notifications';
import { theme, palette } from '../../theme';
import { Check, ArrowRight, ChevronLeft, Plus, Shield, Heart, Sparkles, Compass, Fingerprint, Star, Moon } from 'lucide-react-native';
import { subscriptionService } from '../../services/subscription';
import { authService } from '../../services/auth';
import { supabase } from '../../services/supabase';
import PAYWALL_BG from '../../../assets/journal_paywall_bg.png';
import * as Location from 'expo-location';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { env } from '../../services/env';


const THEME_ICONS: Record<string, any> = { // eslint-disable-line
    Strength: Shield,
    Love: Heart,
    Wisdom: Sparkles,
    Faith: Compass,
};

const THEMES = ['Strength', 'Love', 'Wisdom', 'Faith'];
const BELIEFS = ['Christian', 'Muslim', 'Spiritual', 'Exploring'];

const BELIEF_META: Record<string, { icon: React.FC<any>, desc: string }> = { // eslint-disable-line
    Christian: { icon: Heart, desc: "Personalized daily verses and spiritual guidance." },
    Muslim: { icon: Moon, desc: "Khutbah insights and daily alignment prompts." },
    Spiritual: { icon: Sparkles, desc: "Universal wisdom and mindfulness reflections." },
    Exploring: { icon: Compass, desc: "Discovering your own unique spiritual path." },
};

const TIER_BENEFITS: Record<string, string[]> = {
    free: ["1 Personal Daily Affirmation", "View Community Reflections", "Join up to 3 Local Circles"],
    compass: ["Unlimited Private Reflections", "Join up to 5 Circles", "Standard Daily Guidance"],
    true_north: ["Unlimited Community Reflections", "Personalized Spiritual Guidance", "Join Unlimited Circles"],
    zenith: ["Elite Spiritual Mentoring", "Deep Community Analysis", "Unlimited Circle Creation"],
};

const INTRO_BG = require('../../../assets/onboarding_intro_bg.png'); // eslint-disable-line

const GOAL_KEYS = [
    'spirituality', 'spouse', 'career', 'business',
    'health', 'family', 'children', 'friends', 'finances'
];

const StepContainer = ({ children }: { children: React.ReactNode }) => (
    <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl }}>
        {children}
    </View>
);

export const OnboardingScreen = () => {
    const insets = useSafeAreaInsets();
    const setOnboarded = useStore(state => state.setOnboarded);
    const setPreferences = useStore(state => state.setPreferences);
    const setStoreUsername = useStore(state => state.setUsername);
    const setProfilePicture = useStore(state => state.setProfilePicture);
    const setLoggedIn = useStore(state => state.setLoggedIn);
    const setBiometricsEnabled = useStore(state => state.setBiometricsEnabled);
    const setSecurityPin = useStore(state => state.setSecurityPin);
    const setSubscriptionTier = useStore(state => state.setSubscriptionTier);
    const setDateOfBirthStore = useStore(state => state.setDateOfBirth);
    const setUserGoals = useStore(state => state.setUserGoals);

    const navigation = useNavigation<any>(); // eslint-disable-line
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
    const [beliefType, setBeliefType] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [setupBiometrics, setSetupBiometrics] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authMode, setAuthMode] = useState<'social' | 'email'>('social');
    const [pin, setPin] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [tier, setTier] = useState<string>('compass');
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
    const [offering, setOffering] = useState<PurchasesOffering | null>(null);
    const [offeringLoading, setOfferingLoading] = useState(!env.useMockServices);
    const [isPurchasing, setIsPurchasing] = useState(false);

    React.useEffect(() => {
        if (!env.useMockServices) {
            const fetchOfferings = async () => {
                const offerings = await subscriptionService.getOfferings();
                if (offerings && offerings.current) {
                    setOffering(offerings.current);
                }
                setOfferingLoading(false);
            };
            fetchOfferings();
        }
    }, []);


    const inputRefs = React.useRef<Array<TextInput | null>>([]);

    const nextStep = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            if (selectedThemes.length === 0) {
                Alert.alert("Select Themes", "Please select at least one theme to guide your journey.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate goals - find first empty field
            const emptyFieldIndex = GOAL_KEYS.findIndex(key => !goals[key as keyof typeof goals]?.trim());

            if (emptyFieldIndex !== -1) {
                Alert.alert(
                    "Share Your Goals",
                    "Please fill in all fields so we can personalize your daily affirmations and guidance."
                );
                // Focus the empty input
                inputRefs.current[emptyFieldIndex]?.focus();
                return;
            }

            setStep(3);
        } else if (step === 3) {
            if (!beliefType) {
                Alert.alert("Please select a path", "Choose the spiritual path that resonates with you most.");
                return;
            }
            setStep(4);
        } else if (step === 4) {
            // Auth choice step - handled by buttons but we need to route correctly
            if (authMode === 'email') {
                setStep(5);
            } else {
                setStep(7); // Skip email/password for social
            }
        } else if (step === 5) {
            if (!email.trim() || !email.includes('@')) {
                Alert.alert("Invalid Email", "Please enter a valid email address.");
                return;
            }
            setStep(6);
        } else if (step === 6) {
            if (password.length < 6) {
                Alert.alert("Password weak", "Please enter at least 6 characters.");
                return;
            }
            setStep(7);
        } else if (step === 7) {
            if (!username.trim()) {
                Alert.alert("Name Required", "Please let us know what to call you.");
                return;
            }
            if (!dateOfBirth.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
                Alert.alert("DOB Required", "Please enter your date of birth in YYYY-MM-DD format so we can celebrate your journey.");
                return;
            }
            setStep(8);
        } else if (step === 8) {
            if (setupBiometrics && !pin) {
                Alert.alert("PIN Required", "Please set a backup PIN for security.");
                return;
            }
            if (pin && pin.length < 4) {
                Alert.alert("Invalid PIN", "PIN must be at least 4 digits.");
                return;
            }
            setStep(9);
        } else if (step === 9) {
            setStep(10);
        } else if (step === 10) {
            // Subscription handled by buttons
        } else {
            setStep(step + 1);
        }
    };

    const finishOnboarding = async () => {
        setLoading(true);
        try {
            // 1. Create Auth User
            let userId: string | undefined;

            if (authMode === 'email' && email && password) {
                const { success, error } = await authService.signUp(email, password);
                if (!success) {
                    Alert.alert("Registration Failed", error || "Could not create account.");
                    setLoading(false);
                    return;
                }
                const { data } = await supabase.auth.getUser();
                userId = data.user?.id;
            }

            // 2. Update Local Store
            setStoreUsername(username);
            setProfilePicture(profileImage);
            if (email) useStore.getState().setEmail(email);
            setDateOfBirthStore(dateOfBirth);
            setUserGoals(goals);
            setPreferences(beliefType as any, selectedThemes, { // eslint-disable-line
                dailyReflection: true,
                morningDevotion: true,
                eveningGratitude: true,
                weeklyCommunity: true
            });
            setBiometricsEnabled(setupBiometrics);
            setSecurityPin(pin || null);
            setSubscriptionTier('free'); // Default to free initially

            // 3. Sync to Supabase (if we have a userId)
            if (userId) {
                // Upsert User Profile
                const { error: userError } = await supabase
                    .from('users')
                    .upsert({
                        id: userId,
                        email: email,
                        username: username,
                        avatar_url: profileImage,
                        date_of_birth: dateOfBirth,
                        astrology_enabled: useStore.getState().astrologyEnabled,
                        role: 'member',
                        subscription_tier: tier,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });

                if (userError) console.error("Error creating user profile:", userError);

                // Create Goals
                const { error: goalsError } = await supabase
                    .from('user_goals')
                    .insert({
                        user_id: userId,
                        spirituality: goals.spirituality,
                        spouse: goals.spouse,
                        career: goals.career,
                        business: goals.business,
                        health: goals.health,
                        family: goals.family,
                        children: goals.children,
                        friends: goals.friends,
                        finances: goals.finances,
                    });

                if (goalsError) console.error("Error creating goals:", goalsError);

                // Create Preferences
                const { error: prefError } = await supabase
                    .from('user_preferences')
                    .insert({
                        user_id: userId,
                        belief_type: beliefType,
                        themes: selectedThemes,
                        is_onboarded: true,
                        date_of_birth: dateOfBirth,
                        astrology_enabled: useStore.getState().astrologyEnabled,
                        biometrics_enabled: setupBiometrics,
                        security_pin: pin,
                        notifications_enabled: true
                    });

                if (prefError) console.error("Error creating preferences:", prefError);
            }

            setLoggedIn(true);
            setOnboarded(true);

            // Request permissions and schedule
            const hasPermission = await notificationService.requestPermissions();
            if (hasPermission) {
                await notificationService.scheduleDailyAffirmation('free');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong finishing onboarding.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        setIsPurchasing(true);
        try {
            if (tier === 'free') {
                await finishOnboarding();
                setIsPurchasing(false);
                return;
            }

            if (env.useMockServices) {
                // Emulate subscription process
                setTimeout(async () => {
                    setSubscriptionTier(tier as any); // eslint-disable-line @typescript-eslint/no-explicit-any
                    setLoggedIn(true);
                    setOnboarded(true);

                    // Request permissions and schedule
                    const hasPermission = await notificationService.requestPermissions();
                    if (hasPermission) {
                        await notificationService.scheduleDailyAffirmation(tier as any);
                    }

                    setIsPurchasing(false);
                }, 1500);
            } else if (offering) {
                // For Email users, ensure they are signed up before purchasing
                if (authMode === 'email' && !useStore.getState().isLoggedIn) {
                    if (!email || !password) {
                        Alert.alert("Account Required", "Please ensure you've entered an email and password in previous steps.");
                        setIsPurchasing(false);
                        return;
                    }
                    const { success, error } = await authService.signUp(email, password);
                    if (!success) {
                        Alert.alert("Registration Failed", error || "Could not create account for subscription.");
                        setIsPurchasing(false);
                        return;
                    }
                    // Profile creation will happen either here or in finishOnboarding
                    // But authService.signUp now calls subscriptionService.logIn
                }

                const pkg = offering.availablePackages.find(p => p.packageType.toLowerCase().includes(tier)) || offering.availablePackages[0];
                const success = await subscriptionService.purchasePackage(pkg);
                if (success) {
                    setLoggedIn(true);
                    notificationService.scheduleDailyAffirmation(tier as any);
                    notificationService.scheduleDailyJournaling(tier as any);
                    setOnboarded(true);
                }
                setIsPurchasing(false);
            } else {
                setIsPurchasing(false);
            }
        } catch (error) {
            setIsPurchasing(false);
        }
    };

    const handleSocialLogin = async (provider: 'Apple' | 'Google') => {
        setLoading(true);
        try {
            const success = await authService.login(provider);
            if (success) {
                setAuthMode('social');
                // User is logged in, proceed to username or next appropriate step
                // Check if username is set, if so validation might pass to skip step 7
                const currentUsername = useStore.getState().username;
                if (currentUsername && currentUsername.trim().length > 0) {
                    setUsername(currentUsername);
                }

                // Navigate to next steps - likely skipping email/password 
                // We go to step 7 (Username) to confirm/set it
                setStep(7);
            } else {
                // Determine if it was a cancellation or error
                // For now, consistent error
                // Alert.alert("Sign In Failed", `Could not sign in with ${provider}.`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An unexpected error occurred.");
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
        if (step > 0) {
            if (step === 7 && authMode === 'social') {
                setStep(4); // Go back to auth choice from username if social
            } else {
                setStep(step - 1);
            }
        } else {
            navigation.goBack();
        }
    };

    const toggleTheme = (t: string) => {
        // Enforce 1 theme limit for new users (free tier start) - radio behavior
        if (selectedThemes.includes(t)) {
            setSelectedThemes(prev => prev.filter(i => i !== t));
        } else {
            // Clear others and select new
            setSelectedThemes([t]);
        }
    };

    const renderHeader = (title: string, subtitle: string) => (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );


    const renderIntroStep = () => (
        <View style={StyleSheet.absoluteFill}>
            <ImageBackground source={INTRO_BG} style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]} resizeMode="cover" />
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

    const renderStep1 = () => (
        <StepContainer>
            <FadeIn delay={100} from="bottom">
                {renderHeader("Core Themes", "What areas of life do you want to focus on?")}
            </FadeIn>
            <View style={styles.grid}>
                {THEMES.map((t, index) => {
                    const Icon = THEME_ICONS[t];
                    return (
                        <FadeIn key={t} delay={200 + index * 100} from="bottom" style={{ width: '47.5%' }}>
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
                        </FadeIn>
                    );
                })}
            </View>
            <FadeIn delay={800} from="bottom">
                <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLinkText}>Have an account? <Text style={styles.loginLinkHighlight}>Log In</Text></Text>
                </TouchableOpacity>
            </FadeIn>
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

    const renderStep2 = () => (
        <>
            {/* eslint-disable-next-line truenorth-performance/no-scrollview */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <StepContainer>
                    <FadeIn delay={100} from="bottom">
                        {renderHeader("Daily Goals", "Tell us about your current priorities (max 10 words)")}
                    </FadeIn>
                    {GOAL_KEYS.map((key, index) => (
                        <FadeIn key={key} delay={200 + index * 50} from="bottom">
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                <TextInput
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    style={styles.input}
                                    placeholder={`Your ${key} goal...`}
                                    placeholderTextColor={theme.colors.secondaryText}
                                    value={(goals as any)[key]}
                                    onChangeText={(text) => handleGoalChange(key, text)}
                                    maxLength={100}
                                    returnKeyType={index === GOAL_KEYS.length - 1 ? "done" : "next"}
                                    onSubmitEditing={() => {
                                        if (index < GOAL_KEYS.length - 1) {
                                            inputRefs.current[index + 1]?.focus();
                                        }
                                    }}
                                    blurOnSubmit={false}
                                />
                            </View>
                        </FadeIn>
                    ))}
                </StepContainer>
            </ScrollView>
        </>
    );

    const renderStep3 = () => (
        <StepContainer>
            <FadeIn delay={100} from="bottom">
                {renderHeader("Spiritual Path", "This helps us personalize your affirmations and guidance.")}
            </FadeIn>
            <View style={styles.beliefGrid}>
                {BELIEFS.map((b, index) => {
                    const meta = BELIEF_META[b];
                    const Icon = meta.icon;
                    const isActive = beliefType === b;

                    return (
                        <FadeIn
                            key={b}
                            delay={200 + index * 100}
                            from="bottom"
                        >
                            <TouchableOpacity
                                style={[styles.beliefCard, isActive && styles.beliefCardActive]}
                                onPress={() => setBeliefType(b)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[styles.beliefIconCircle, isActive && styles.beliefIconCircleActive]}
                                >
                                    <Icon size={32} color={isActive ? palette.ivory : palette.softGold} />
                                </View>

                                <View style={styles.beliefContent}>
                                    <Text style={[styles.beliefText, isActive && styles.beliefTextActive]}>{b}</Text>
                                    <Text style={[styles.beliefDesc, isActive && styles.beliefDescActive]}>{meta.desc}</Text>
                                </View>

                                {isActive && (
                                    <View
                                        style={styles.beliefCheck}
                                    >
                                        <Check size={16} color={palette.softGold} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </FadeIn>
                    );
                })}
            </View>
        </StepContainer>
    );

    const renderStep4 = () => (
        <View style={StyleSheet.absoluteFill}>
            <ImageBackground source={INTRO_BG} style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]} resizeMode="cover" />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
                style={StyleSheet.absoluteFill}
            />
            <View style={{ position: 'absolute', top: insets.top, left: theme.spacing.xl, zIndex: 10 }}>
                <TouchableOpacity onPress={prevStep} style={{ width: 40, height: 40, justifyContent: 'center' }}>
                    <ChevronLeft size={28} color={palette.ivory} />
                </TouchableOpacity>
            </View>
            <StepContainer>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <Text style={[styles.title, { color: palette.ivory, textAlign: 'center' }]}>Join True North</Text>
                        <Text style={[styles.subtitle, { color: palette.ivory, opacity: 0.8, textAlign: 'center' }]}>Create an account to save your sacred journey.</Text>
                    </View>

                    <View style={[styles.authGrid, { marginTop: 40 }]}>
                        {loading ? (
                            <ActivityIndicator color={palette.softGold} size="large" style={{ marginTop: 40 }} />
                        ) : (
                            <>
                                <TouchableOpacity style={[styles.socialButton, { backgroundColor: palette.ivory, opacity: loading ? 0.7 : 1 }]} onPress={() => handleSocialLogin('Apple')} disabled={loading}>
                                    <View style={{ position: 'absolute', left: 24 }}>
                                        {/* Apple Logo placeholder or icon if available */}
                                    </View>
                                    <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Continue with Apple</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.socialButton, styles.googleButton, { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.3)', opacity: loading ? 0.7 : 1 }]} onPress={() => handleSocialLogin('Google')} disabled={loading}>
                                    <View style={{ position: 'absolute', left: 24 }}>
                                        {/* Google Logo placeholder */}
                                    </View>
                                    <Text style={[styles.socialButtonText, { color: palette.ivory }]}>Continue with Google</Text>
                                </TouchableOpacity>
                                <View style={styles.authDivider}>
                                    <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                                    <Text style={[styles.dividerText, { color: palette.ivory, opacity: 0.5 }]}>or</Text>
                                    <View style={[styles.dividerLine, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                                </View>
                                <TouchableOpacity style={[styles.emailButton, { borderColor: 'rgba(255,255,255,0.3)' }]} onPress={() => {
                                    setAuthMode('email');
                                    nextStep();
                                }}>
                                    <Text style={[styles.emailButtonText, { color: palette.ivory }]}>Continue with Email</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </StepContainer>
        </View>
    );

    const renderStep5 = () => (
        <StepContainer>
            {renderHeader("Enter Email", "We'll use this to keep your journey synced.")}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
            </View>
        </StepContainer>
    );

    const renderStepPassword = () => (
        <StepContainer>
            {renderHeader("Secure Account", "Create a password to protect your journey.")}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Min. 6 characters"
                    placeholderTextColor={theme.colors.secondaryText}
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    onChangeText={setPassword}
                />
            </View>
        </StepContainer>
    );

    const renderStep6 = () => (
        <StepContainer>
            <FadeIn delay={100} from="bottom">
                {renderHeader("Choose Username", "How should we address you in True North?")}
            </FadeIn>
            <FadeIn delay={300} from="bottom">
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
                <View style={[styles.inputGroup, { marginTop: 24 }]}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.colors.secondaryText}
                        value={dateOfBirth}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={setDateOfBirth}
                        keyboardType="numeric"
                    />
                    <Text style={[styles.pickerHint, { marginTop: 8, textAlign: 'left' }]}>Used for birthday blessings.</Text>
                </View>
            </FadeIn>
        </StepContainer>
    );

    const renderStep7 = () => (
        <StepContainer>
            <FadeIn delay={100} from="bottom">
                {renderHeader("Profile Picture", "Let the community put a face to your name (Optional)")}
            </FadeIn>
            <FadeIn delay={300} from="bottom">
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
            </FadeIn>
        </StepContainer>
    );

    const renderStep8 = () => (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <StepContainer>
                <FadeIn delay={100} from="bottom">
                    {renderHeader("Privacy & Security", "Protect your private reflections with biometrics or a PIN.")}
                </FadeIn>

                <FadeIn delay={300} from="bottom">
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
                </FadeIn>

                <FadeIn delay={500} from="bottom">
                    <View style={[styles.pinSection, { marginBottom: 60 }]}>
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
                </FadeIn>
            </StepContainer>
        </ScrollView>
    );

    const renderStep9 = () => (
        <StepContainer>
            <FadeIn delay={100} from="bottom">
                {renderHeader("Local Communities", "Find fellow seekers in your area for deeper connection.")}
            </FadeIn>

            <FadeIn delay={300} from="bottom">
                <View style={styles.locationCard}>
                    <View style={styles.locationIconContainer}>
                        <Compass size={40} color={palette.softGold} />
                    </View>
                    <Text style={styles.locationTitle}>Find Your Community</Text>
                    <Text style={styles.locationDesc}>
                        Granting location access helps us prioritize local groups near you. Your exact position is never shared.
                    </Text>

                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={async () => {
                            const { status } = await Location.requestForegroundPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert("Permission Needed", "Location access helps us find nearby communities. You can enable this later in settings.");
                            }
                            nextStep();
                        }}
                    >
                        <Text style={styles.locationButtonText}>Enable Location Access</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skipButton} onPress={nextStep}>
                        <Text style={styles.skipButtonText}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </FadeIn>
        </StepContainer>
    );

    const renderStep10 = () => {
        const DEFAULT_TIERS = [
            { id: 'compass', label: 'Compass', price: '$5.99', sub: '/ mo', save: 'Billed Yearly' },
            { id: 'true_north', label: 'True North', price: '$12.99', sub: '/ mo', save: 'Most Popular' },
            { id: 'zenith', label: 'Zenith', price: '$19.99', sub: '/ mo', save: 'Best Value' },
        ];

        return (
            <View style={StyleSheet.absoluteFill}>
                <ImageBackground
                    source={PAYWALL_BG}
                    style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                    style={StyleSheet.absoluteFill}
                />

                <View style={{ position: 'absolute', top: insets.top, left: theme.spacing.xl, zIndex: 10 }}>
                    <TouchableOpacity onPress={prevStep} style={{ width: 40, height: 40, justifyContent: 'center' }}>
                        <ChevronLeft size={28} color={palette.ivory} />
                    </TouchableOpacity>
                </View>

                <StepContainer>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', marginBottom: 32 }}>
                            <Sparkles size={48} color={palette.softGold} style={{ marginBottom: 16 }} />
                            <Text style={[styles.title, { color: palette.ivory, textAlign: 'center', fontSize: 32 }]}>Unlock Full Potential</Text>
                            <Text style={[styles.subtitle, { color: palette.ivory, opacity: 0.9, textAlign: 'center', maxWidth: '90%' }]}>
                                Choose the plan that fits your journey.
                            </Text>
                        </View>

                        <View style={{ gap: 12, marginBottom: 32 }}>
                            {offeringLoading ? (
                                <ActivityIndicator color={palette.softGold} size="large" />
                            ) : offering ? (
                                offering.availablePackages.map((pkg: any) => {
                                    const tierId = pkg.packageType.toLowerCase().includes('annual') ? 'compass' :
                                        pkg.packageType.toLowerCase().includes('monthly') ? 'true_north' : 'zenith';
                                    const active = tier === tierId;
                                    const product = pkg.product || pkg.storeProduct;

                                    return (
                                        <TouchableOpacity
                                            key={pkg.identifier}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                                padding: 16, borderRadius: 16,
                                                backgroundColor: active ? palette.ivory : 'rgba(255,255,255,0.1)',
                                                borderWidth: 1, borderColor: active ? palette.ivory : 'rgba(255,255,255,0.2)'
                                            }}
                                            onPress={() => setTier(tierId)}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{
                                                    width: 20, height: 20, borderRadius: 10,
                                                    borderWidth: 2, borderColor: active ? theme.colors.text : 'rgba(255,255,255,0.5)',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {active && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.text }} />}
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 16, color: active ? theme.colors.text : palette.ivory }}>{product.title}</Text>
                                                    <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 10, color: active ? palette.softGold : palette.softGold }}>{product.description}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 18, color: active ? theme.colors.text : palette.ivory }}>
                                                {product.priceString}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                DEFAULT_TIERS.map((t) => {
                                    const active = tier === t.id;
                                    return (
                                        <TouchableOpacity
                                            key={t.id}
                                            style={{
                                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                                padding: 16, borderRadius: 16,
                                                backgroundColor: active ? palette.ivory : 'rgba(255,255,255,0.1)',
                                                borderWidth: 1, borderColor: active ? palette.ivory : 'rgba(255,255,255,0.2)'
                                            }}
                                            onPress={() => setTier(t.id as any)}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{
                                                    width: 20, height: 20, borderRadius: 10,
                                                    borderWidth: 2, borderColor: active ? theme.colors.text : 'rgba(255,255,255,0.5)',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {active && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.text }} />}
                                                </View>
                                                <View>
                                                    <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 16, color: active ? theme.colors.text : palette.ivory }}>{t.label}</Text>
                                                    {t.save && <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 12, color: active ? palette.softGold : palette.softGold }}>{t.save}</Text>}
                                                </View>
                                            </View>
                                            <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 18, color: active ? theme.colors.text : palette.ivory }}>
                                                {t.price} <Text style={{ fontSize: 14, fontFamily: theme.typography.sans, opacity: 0.7 }}>{t.sub}</Text>
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            )}

                            {/* Free Tier Card */}
                            <TouchableOpacity
                                key="free-tier"
                                style={{
                                    padding: 16, borderRadius: 16,
                                    backgroundColor: tier === 'free' ? palette.ivory : 'rgba(255,255,255,0.05)',
                                    borderWidth: 1, borderColor: tier === 'free' ? palette.ivory : 'rgba(255,255,255,0.1)',
                                    marginTop: 8
                                }}
                                onPress={() => setTier('free')}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: tier === 'free' ? 12 : 0 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{
                                            width: 20, height: 20, borderRadius: 10,
                                            borderWidth: 2, borderColor: tier === 'free' ? theme.colors.text : 'rgba(255,255,255,0.5)',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {tier === 'free' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.text }} />}
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 16, color: tier === 'free' ? theme.colors.text : palette.ivory }}>Free Plan</Text>
                                            {!tier || tier !== 'free' && <Text style={{ fontFamily: theme.typography.sans, fontSize: 12, color: palette.softGold, opacity: 0.7 }}>Daily Personal Affirmation</Text>}
                                        </View>
                                    </View>
                                    <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 18, color: tier === 'free' ? theme.colors.text : palette.ivory }}>
                                        Free
                                    </Text>
                                </View>

                                {tier === 'free' && (
                                    <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)', paddingTop: 12, gap: 8 }}>
                                        {TIER_BENEFITS.free.map((b, i) => (
                                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Check size={14} color={palette.softGold} />
                                                <Text style={{ fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.text, opacity: 0.8 }}>{b}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.subscribeButton, { backgroundColor: palette.softGold, height: 60, marginBottom: 20 }, (offeringLoading || isPurchasing) && { opacity: 0.7 }]}
                            onPress={handleSubscribe}
                            disabled={offeringLoading || isPurchasing}
                        >
                            {isPurchasing ? (
                                <ActivityIndicator color={palette.ivory} />
                            ) : (
                                <Text style={[styles.subscribeButtonText, { fontSize: 18 }]}>
                                    {tier === 'free'
                                        ? "Continue to App"
                                        : offering
                                            ? "Subscribe Now"
                                            : `Subscribe ${DEFAULT_TIERS.find(t => t.id === tier)?.price}`
                                    }
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 12, alignItems: 'center' }} onPress={finishOnboarding} disabled={isPurchasing}>
                            <Text style={{ fontFamily: theme.typography.sansMedium, fontSize: 16, color: palette.ivory, textDecorationLine: 'underline' }}>Maybe Later (Continue Free)</Text>
                        </TouchableOpacity>

                        <Text style={[styles.disclaimerText, { color: palette.ivory, opacity: 0.5, marginTop: 10 }]}>
                            No commitment. Cancel anytime in settings.
                        </Text>
                    </View>
                </StepContainer>
            </View>
        );
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, step !== 0 && step !== 4 && step !== 10 && { paddingTop: insets.top + 20, paddingBottom: insets.bottom }]}
        >
            {step !== 0 && step !== 4 && step !== 9 && step !== 10 && (
                <View style={styles.nav}>
                    {step > 0 && !loading && (
                        <TouchableOpacity onPress={prevStep}>
                            <ChevronLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.content}>
                <FadeIn key={step} style={{ flex: 1 }} delay={100}>
                    {step === 0 && renderIntroStep()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                    {step === 6 && renderStepPassword()}
                    {step === 7 && renderStep6()}
                    {step === 8 && renderStep7()}
                    {step === 9 && renderStep9()}
                    {step === 10 && renderStep10()}
                </FadeIn>
            </View>

            {step !== 0 && step !== 4 && step !== 9 && step !== 10 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            step === 5 && !email && { opacity: 0.5 },
                            step === 6 && password.length < 6 && { opacity: 0.5 },
                            step === 7 && !username && { opacity: 0.5 }
                        ]}
                        // Disable if requirements not met
                        disabled={
                            (step === 5 && !email) ||
                            (step === 6 && password.length < 6) ||
                            (step === 7 && !username) ||
                            step === 9 ||
                            step === 10
                        }
                        onPress={nextStep}
                    >
                        <Text style={styles.nextButtonText}>{(step === 9 || step === 10) ? "" : "Continue"}</Text>
                        {(step !== 9 && step !== 10) && <ArrowRight size={20} color={theme.colors.inverseText} />}
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    introContent: { flex: 1, justifyContent: 'center', paddingBottom: 60, paddingHorizontal: theme.spacing.xl * 2 },
    introTitle: { fontFamily: theme.typography.serifBold, fontSize: 42, color: palette.ivory, marginBottom: theme.spacing.md, letterSpacing: -1 },
    introSubtitle: { fontFamily: theme.typography.sans, fontSize: 18, color: palette.ivory, opacity: 0.9, lineHeight: 28, marginBottom: 32 },
    introBenefits: { marginBottom: 40, gap: 12 },
    introBenefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    introBenefitText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: palette.softGold },
    introButton: { backgroundColor: palette.softGold, paddingVertical: 20, borderRadius: theme.borderRadius.full, alignItems: 'center', shadowColor: palette.softGold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
    introButtonText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: palette.ivory },
    nav: { height: 40, justifyContent: 'center', marginBottom: theme.spacing.md, paddingHorizontal: theme.spacing.xl, zIndex: 10 },
    content: { flex: 1 },
    header: { marginBottom: theme.spacing.xxl },
    title: { fontFamily: theme.typography.serifBold, fontSize: 34, color: theme.colors.text, marginBottom: theme.spacing.sm, letterSpacing: -0.5 },
    subtitle: { fontFamily: theme.typography.sans, fontSize: 17, color: theme.colors.secondaryText, lineHeight: 24 },
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
    beliefGrid: { gap: theme.spacing.lg },
    beliefCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface, borderRadius: 20,
        padding: theme.spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    beliefCardActive: { backgroundColor: theme.colors.text, borderColor: theme.colors.text },
    beliefIconCircle: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center',
        marginRight: theme.spacing.lg
    },
    beliefIconCircleActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
    beliefContent: { flex: 1 },
    beliefText: { fontFamily: theme.typography.serifBold, fontSize: 20, color: theme.colors.text, marginBottom: 2 },
    beliefTextActive: { color: palette.ivory },
    beliefDesc: { fontFamily: theme.typography.sans, fontSize: 13, color: theme.colors.secondaryText, lineHeight: 18, opacity: 0.7 },
    beliefDescActive: { color: palette.ivory, opacity: 0.8 },
    beliefCheck: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: palette.ivory,
        alignItems: 'center', justifyContent: 'center',
        marginLeft: theme.spacing.md
    },
    authGrid: { gap: theme.spacing.md },
    socialButton: {
        backgroundColor: theme.colors.text, height: 56, borderRadius: theme.borderRadius.full,
        alignItems: 'center', justifyContent: 'center'
    },
    socialButtonText: { color: theme.colors.inverseText, fontFamily: theme.typography.sansBold, fontSize: 16 },
    googleButton: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border },
    authDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.md },
    dividerLine: { flex: 1, height: 1, backgroundColor: palette.border },
    dividerText: { marginHorizontal: theme.spacing.md, color: theme.colors.secondaryText, fontFamily: theme.typography.sans },
    emailButton: {
        height: 56, borderRadius: 100, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: theme.colors.border
    },
    emailButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text },
    footer: {
        paddingVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)'
    },
    nextButton: {
        backgroundColor: theme.colors.text, borderRadius: 100,
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
    subscribeButton: {
        backgroundColor: theme.colors.text,
        width: '100%',
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        marginBottom: theme.spacing.md
    },
    subscribeButtonText: { fontFamily: theme.typography.sansBold, fontSize: 18, color: palette.ivory },
    skipButton: { paddingVertical: 12 },
    skipButtonText: { fontFamily: theme.typography.sansMedium, fontSize: 15, color: theme.colors.secondaryText },
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
    disclaimerText: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: theme.spacing.lg, textAlign: 'center', opacity: 0.7 },
});
