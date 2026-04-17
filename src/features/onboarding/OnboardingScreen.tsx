/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable truenorth-performance/no-scrollview */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground, Keyboard, FlatList, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { OptimizedImage } from '../../components/performance/OptimizedImage';
import { useNavigation } from '@react-navigation/native';
import { FadeIn } from '../../components/FadeIn';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store';
import { notificationService } from '../../services/notifications';
import { theme, palette } from '../../theme';
import { Check, ArrowRight, ChevronLeft, Plus, Shield, Heart, Sparkles, Compass, Fingerprint, Star, Moon, BookOpen, Feather, Mountain, Anchor, Sun, Hourglass, HandHeart } from 'lucide-react-native';
import { subscriptionService } from '../../services/subscription';
import { authService } from '../../services/auth';
import { supabase } from '../../services/supabase';
import PAYWALL_BG from '../../../assets/journal_paywall_bg.jpg';
import * as Location from 'expo-location';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { env } from '../../services/env';
import { COUNTRIES, COUNTRIES_DATA } from '../../data/locations';
import { TrueNorthFlashList } from '../../components/performance/TrueNorthFlashList';
import { Search, MapPin, X, Globe } from 'lucide-react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Popup } from '../../components/Popup';
import { SubscriptionLegal } from '../../components/SubscriptionLegal';
import { APP_THEMES, THEME_ICONS_MAP, AppTheme } from '../../types/themes';


const THEME_ICONS: Record<string, any> = { // eslint-disable-line
    Shield,
    Heart,
    BookOpen,
    Compass,
    Feather,
    Mountain,
    Anchor,
    Sun,
    Hourglass,
    HandHeart
};

// ... 



import { APP_BELIEFS, BeliefId } from '../../types/beliefs';

const BELIEFS = APP_BELIEFS.map(b => b.id);

const BELIEF_META: Record<string, { icon: React.FC<any>, desc: string }> = { // eslint-disable-line
    Catholic: { icon: Heart, desc: "Liturgical dates, Mass reflections, and daily grace." },
    Protestant: { icon: Star, desc: "Sermon insights, scripture focus, and daily guidance." },
    Christian: { icon: Star, desc: "Follower of the teachings of Jesus Christ." },
    Muslim: { icon: Moon, desc: "Khutbah insights and daily alignment prompts." },
    Spiritual: { icon: Sparkles, desc: "Universal wisdom and mindfulness reflections." },
    Jewish: { icon: Star, desc: "Covenant with God through Torah and tradition." },
    Sikh: { icon: Sparkles, desc: "Devotion to the One Creator and service to humanity." },
    Hindu: { icon: Sparkles, desc: "Pursuing Dharma, Karma, and liberation (Moksha)." },
    Buddhist: { icon: Sparkles, desc: "Following the Eightfold Path to enlightenment and compassion." },
    Exploring: { icon: Compass, desc: "Discovering your own unique spiritual path." },
};


const TIER_BENEFITS: Record<string, string[]> = {
    free: ["1 Personal Daily Affirmation", "View Community Reflections", "Join up to 3 Local Circles", "Ad-supported experience"],
    compass: ["Unlimited Private Reflections (Journal)", "Join up to 5 Circles", "Standard Daily Guidance", "No Ask Nur Companion"],
    true_north: ["Unlimited Community Reflections", "Ask Nur Companion", "Personalized Spiritual Guidance", "Join Unlimited Circles", "Create up to 2 Circles"],
    zenith: ["Elite Spiritual Mentoring", "Ask Nur Companion", "Deep Community Analysis", "Unlimited Circle Creation", "Location Intelligence"],
};

const cleanTitle = (title: string) => {
    if (!title) return '';
    return title.split('(')[0].trim()
        .replace(' Monthly', '')
        .replace(' Annual', '')
        .replace(' Yearly', '')
        .replace(' Subscription', '');
};

const INTRO_BG = require('../../../assets/onboarding_intro_bg.jpg'); // eslint-disable-line

const GOAL_KEYS = [
    'spirituality', 'spouse', 'career & business',
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
    const currentStoreTier = useStore(state => state.subscriptionTier);

    const navigation = useNavigation<any>(); // eslint-disable-line
    const storeStep = useStore(state => state.onboardingStep);
    const setOnboardingStep = useStore(state => state.setOnboardingStep);

    const [step, setStep] = useState(storeStep || 0);
    const [showDatePicker, setShowDatePicker] = useState(false);
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
    const [isRestoring, setIsRestoring] = useState(false);
    const [subscriptionDetected, setSubscriptionDetected] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Username State
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Location State
    const [locationCountry, setLocationCountry] = useState('');
    const [locationCity, setLocationCity] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showCityPicker, setShowCityPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredCities = (COUNTRIES_DATA[locationCountry] || []).filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    console.log(`[LocationPicker] type=${showCountryPicker ? 'country' : showCityPicker ? 'city' : 'none'} countries=${filteredCountries.length} cities=${filteredCities.length} query="${searchQuery}"`);

    const renderPickerItem = React.useCallback(({ item, type }: { item: string, type: 'country' | 'city' }) => (
        <TouchableOpacity
            style={styles.pickerItem}
            onPress={() => {
                if (type === 'country') {
                    setLocationCountry(item);
                    setLocationCity(''); // Reset city on country change
                    setShowCountryPicker(false);
                } else {
                    setLocationCity(item);
                    setShowCityPicker(false);
                }
                setSearchQuery('');
            }}
        >
            <MapPin size={18} color={palette.softGold} style={{ marginRight: 12 }} />
            <Text style={styles.pickerItemText}>{item}</Text>
            {(type === 'country' ? locationCountry : locationCity) === item && (
                <Check size={18} color={palette.success} />
            )}
        </TouchableOpacity>
    ), [locationCountry, locationCity, setLocationCountry, setLocationCity, setShowCountryPicker, setShowCityPicker, setSearchQuery]);

    const renderCountryItem = React.useCallback(({ item }: { item: string }) =>
        renderPickerItem({ item, type: 'country' }),
        [renderPickerItem]);

    const renderCityItem = React.useCallback(({ item }: { item: string }) =>
        renderPickerItem({ item, type: 'city' }),
        [renderPickerItem]);

    const renderLocationPickerModal = (visible: boolean, onClose: () => void, type: 'country' | 'city') => (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title={`Select ${type === 'country' ? 'Country' : 'City'}`}
            height="80%"
        >
            <View style={[styles.searchBar, { marginTop: 0 }]}>
                <Search size={20} color={theme.colors.secondaryText} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                />
            </View>
            <View style={{ flex: 1, minHeight: 400 }}>
                {((type === 'country' ? filteredCountries : filteredCities).length === 0) ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ color: theme.colors.secondaryText, textAlign: 'center' }}>
                            {searchQuery ? 'No results found' : 'Loading locations...'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={(type === 'country' ? filteredCountries : filteredCities)}
                        keyExtractor={memoizedLocationKeyExtractor}
                        renderItem={(type === 'country' ? renderCountryItem : renderCityItem) as any}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </BottomSheet>
    );

    const memoizedLocationKeyExtractor = React.useCallback((item: unknown) => item as string, []);
    const memoizedLocationRenderItem = React.useCallback(({ item }: { item: unknown }) => {
        const itemStr = item as string;
        return step === 10 ? renderCountryItem({ item: itemStr }) : renderCityItem({ item: itemStr });
    }, [step, renderCountryItem, renderCityItem]);

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

    React.useEffect(() => {
        setOnboardingStep(step);
    }, [step]);

    React.useEffect(() => {
        if (step === 11 && !env.useMockServices) {
            // Check if user is already subscribed (auto-restore detection)
            subscriptionService.checkSubscriptionStatus().then((newTier) => {
                if (newTier !== 'free') {
                    console.log("[Onboarding] Active subscription detected on paywall mount:", newTier);
                    setSubscriptionDetected(true);
                }
            }).catch(e => console.error("[Onboarding] Auto-check subscription failed:", e));
        }
    }, [step]);


    const checkUsernameAvailability = React.useCallback(async (name: string) => {
        if (!name || name.length < 3) {
            setUsernameAvailable(null);
            setUsernameSuggestions([]);
            return;
        }

        setIsCheckingUsername(true);
        setUsernameAvailable(null);

        try {
            // Check if username exists in Supabase
            // Note: This requires a policy allowing public read of usernames or an edge function
            // For now assuming we can query users table for username existence
            const { count, error } = await supabase
                .from('users')
                .select('username', { count: 'exact', head: true })
                .eq('username', name);

            if (error) throw error;

            const isAvailable = count === 0;
            setUsernameAvailable(isAvailable);

            if (!isAvailable) {
                // Generate suggestions
                const random = Math.floor(Math.random() * 1000);
                const year = new Date().getFullYear();
                const suggestions = [
                    `${name}${random}`,
                    `${name}_${random}`,
                    `${name}${year}`
                ];
                setUsernameSuggestions(suggestions);
            } else {
                setUsernameSuggestions([]);
            }

        } catch (error) {
            console.error("Error checking username:", error);
            // Fallback to allowing it if check fails to avoid blocking users
            setUsernameAvailable(true);
        } finally {
            setIsCheckingUsername(false);
        }
    }, []);

    // Debounce the check
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (username.length >= 3) {
                checkUsernameAvailability(username);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username, checkUsernameAvailability]);


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
            // Find first empty field (excluding spouse) and focus it, or proceed if all filled
            const emptyFieldIndex = GOAL_KEYS.findIndex(key => key !== 'spouse' && !goals[key as keyof typeof goals]?.trim());

            if (emptyFieldIndex !== -1) {
                // Simply focus the empty input for a smoother experience
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
            if (!username.trim() || username.trim().length < 3) {
                Alert.alert("Name Required", "Please enter a valid username (min 3 characters).");
                return;
            }
            if (usernameAvailable !== true) {
                Alert.alert("Unavailable", "Please wait for validation or choose a different username.");
                return;
            }
            if (!dateOfBirth) {
                Keyboard.dismiss();
                setShowDatePicker(true);
                return;
            }
            setStep(8);

        } else if (step === 8) {
            // Profile Picture step - no strict validation needed
            setStep(9);

        } else if (step === 9) {
            // This is the Security Step (Biometrics/PIN)
            if (setupBiometrics && !pin) {
                Alert.alert("PIN Required", "Please set a backup PIN for security.");
                return;
            }
            if (pin && pin.length > 0 && pin.length < 4) {
                Alert.alert("Invalid PIN", "PIN must be 4 digits.");
                return;
            }
            setStep(10);
        } else if (step === 10) {
            // Location Step
            if (!locationCountry || !locationCity) {
                Alert.alert("Location Required", "Please select your country and city.");
                return;
            }
            setStep(11);
        } else if (step === 11) {
            // This will be the Paywall
        } else {
            setStep(step + 1);
        }
    };


    const finishOnboarding = async () => {
        setLoading(true);
        try {
            // 1. Create Auth User
            let userId: string | undefined = useStore.getState().userId || undefined;

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
            
            // Set optimistically; revenuecat will sync it correctly on next launch if out of sync
            setSubscriptionTier(tier as any);

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
                        belief_type: beliefType,
                        liturgical_calendar_enabled: beliefType === 'Catholic' || beliefType === 'Protestant',
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
                        career: (goals as any)['career & business'],
                        business: (goals as any)['career & business'],
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
                        liturgical_calendar_enabled: beliefType === 'Catholic' || beliefType === 'Protestant',
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
                    console.log("[Onboarding] Signing up email user before purchase...");
                    const { success, error } = await authService.signUp(email, password);
                    if (!success) {
                        Alert.alert("Registration Failed", error || "Could not create account for subscription.");
                        setIsPurchasing(false);
                        return;
                    }
                }

                console.log("[Onboarding] Proceeding to purchase with package for tier:", tier);
                const pkg = offering.availablePackages.find(p => {
                    const prod = p.product || (p as any).storeProduct;
                    const pId = (prod.identifier || '').toLowerCase();
                    const ptLC = (p.packageType || '').toLowerCase();
                    let tId = 'true_north';
                    if (pId.includes('compass')) tId = 'compass';
                    else if (pId.includes('zenith')) tId = 'zenith';
                    else if (pId.includes('true_north') || pId.includes('truenorth') || pId.includes('true-north')) tId = 'true_north';
                    else if (ptLC.includes('annual') || ptLC.includes('yearly')) tId = 'compass';
                    return tId === tier;
                }) || offering.availablePackages[0];

                if (!pkg) {
                    console.error("[Onboarding] No package found for tier:", tier);
                    setIsPurchasing(false);
                    return;
                }

                const success = await subscriptionService.purchasePackage(pkg);
                if (success) {
                    console.log("[Onboarding] Purchase successful, showing success modal...");
                    setShowSuccessModal(true);
                } else {
                    console.log("[Onboarding] Purchase was not successful or was cancelled.");
                    setIsPurchasing(false);
                }
            } else {
                console.warn("[Onboarding] Offering is null, cannot proceed with purchase.");
                setIsPurchasing(false);
            }
        } catch (error) {
            console.error("[Onboarding] handleSubscribe unexpected error:", error);
            setIsPurchasing(false);
            Alert.alert("Error", "An unexpected error occurred during the subscription process.");
        }
    };

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const success = await subscriptionService.restorePurchases();
            if (success) {
                const currentTier = useStore.getState().subscriptionTier;
                if (currentTier !== 'free') {
                    setSubscriptionDetected(true);
                    Alert.alert(
                        "Subscription Restored", 
                        `Welcome back, Seeker! Your ${currentTier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} subscription has been restored.`,
                        [{ text: "Continue", onPress: () => {
                            setLoggedIn(true);
                            setOnboarded(true);
                        }}]
                    );
                } else {
                    Alert.alert("No Subscription Found", "We couldn't find an active subscription associated with your store account.");
                }
            } else {
                Alert.alert("Restore Failed", "We encountered an issue restoring your purchases. Please try again later.");
            }
        } catch (error) {
            console.error("[Onboarding] handleRestore error:", error);
            Alert.alert("Error", "An unexpected error occurred during restore.");
        } finally {
            setIsRestoring(false);
        }
    };

    const handleSocialLogin = async (provider: 'Apple' | 'Google') => {
        setLoading(true);
        try {
            const result = await authService.login(provider, goals);
            if (result.success) {
                setAuthMode('social');
                
                // If existing user, redirect immediately
                if (result.isExistingUser) {
                    console.log(`[Onboarding] Existing ${provider} user detected. Redirecting to Affirmation.`);
                    setLoggedIn(true);
                    setOnboarded(true);
                    // Navigation will be handled by RootNavigator reacting to isOnboarded
                    // but we can also trigger it manually for immediate effect
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main', params: { screen: 'Affirmation' } }],
                    });
                    return;
                }

                // New user - User is logged in, proceed to username or next appropriate step
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

                <TouchableOpacity 
                    style={[styles.introButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.softGold, marginTop: 16 }]} 
                    onPress={() => setStep(4)}
                >
                    <Text style={[styles.introButtonText, { color: palette.softGold }]}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep1 = () => (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            <StepContainer>
                <FadeIn delay={100} from="bottom">
                    {renderHeader("Core Themes", "What areas of life do you want to focus on?")}
                </FadeIn>
                <View style={styles.grid}>
                    {APP_THEMES.map((t, index) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (THEME_ICONS as any)[THEME_ICONS_MAP[t]] || Sparkles;
                        return (
                            <FadeIn key={t} delay={200 + index * 50} from="bottom" style={{ width: '47.5%' }}>
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
        </ScrollView>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <StepContainer>
                    <FadeIn delay={100} from="bottom">
                        {renderHeader("Daily Goals", "Tell us about your current priorities (max 10 words)")}
                        <Text style={[styles.subtitle, { marginTop: 8, fontSize: 13, opacity: 0.8 }]}>Setting clear goals allows your companion Nur to profoundly personalize your guidance and recognize patterns in your reflections.</Text>
                    </FadeIn>
                    {GOAL_KEYS.map((key, index) => (
                        <FadeIn key={key} delay={200 + index * 50} from="bottom">
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>
                                    {key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    {key === 'spouse' && " (Optional)"}
                                </Text>
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

    const renderStep3 = () => {
        // Sort beliefs to prioritize Muslim, then others
        const sortedBeliefs = [...BELIEFS].sort((a, b) => {
            if (a === 'Muslim') return -1;
            if (b === 'Muslim') return 1;
            return 0; // Keep original order for others
        });

        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 120 }}>
                    <StepContainer>
                        <FadeIn delay={100} from="bottom">
                            {renderHeader("Spiritual Path", "This helps us personalize your affirmations and guidance.")}
                        </FadeIn>
                        <View style={styles.beliefGrid}>
                            {sortedBeliefs.map((b, index) => {
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
                </ScrollView>
                {/* Scroll Indicator Hint */}
                <FadeIn delay={1000} style={{ position: 'absolute', bottom: 20, alignSelf: 'center', zIndex: 10 }}>
                    <View style={{
                        alignItems: 'center',
                        backgroundColor: theme.colors.surface,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                        flexDirection: 'row',
                        gap: 8
                    }}>
                        <Text style={{ fontFamily: theme.typography.sansMedium, fontSize: 13, color: palette.softGold }}>Scroll for more</Text>
                        <ChevronLeft size={16} color={palette.softGold} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </View>
                </FadeIn>
            </View>
        );
    };

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
                                {Platform.OS === 'ios' && (
                                    <TouchableOpacity style={[styles.socialButton, { backgroundColor: palette.ivory, opacity: loading ? 0.7 : 1 }]} onPress={() => handleSocialLogin('Apple')} disabled={loading}>
                                        <View style={{ position: 'absolute', left: 24 }}>
                                            {/* Apple Logo placeholder or icon if available */}
                                        </View>
                                        <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Continue with Apple</Text>
                                    </TouchableOpacity>
                                )}
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

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const renderStep6 = () => (


        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <StepContainer>
                <FadeIn delay={100} from="bottom">
                    {renderHeader("Choose Username", "How should we address you in True North?")}
                </FadeIn>
                <FadeIn delay={300} from="bottom">
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    usernameAvailable === true && { borderColor: palette.success },
                                    usernameAvailable === false && { borderColor: 'red' }
                                ]}
                                placeholder="Enter your username..."
                                placeholderTextColor={theme.colors.secondaryText}
                                value={username}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}
                                returnKeyType="done"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                            {isCheckingUsername && (
                                <ActivityIndicator
                                    size="small"
                                    color={palette.softGold}
                                    style={{ position: 'absolute', right: 16, top: 20 }}
                                />
                            )}
                            {!isCheckingUsername && usernameAvailable === true && (
                                <Check
                                    size={20}
                                    color={palette.success}
                                    style={{ position: 'absolute', right: 16, top: 20 }}
                                />
                            )}
                            {!isCheckingUsername && usernameAvailable === false && (
                                <View style={{ position: 'absolute', right: 16, top: 20 }}>
                                    <Text style={{ color: 'red', fontSize: 20 }}>✕</Text>
                                </View>
                            )}
                        </View>

                        {!isCheckingUsername && usernameAvailable === false && usernameSuggestions.length > 0 && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                <Text style={{ width: '100%', color: theme.colors.secondaryText, fontSize: 13, marginBottom: 4 }}>Suggestions:</Text>
                                {usernameSuggestions.map(s => (
                                    <TouchableOpacity
                                        key={s}
                                        style={{
                                            backgroundColor: theme.colors.surface,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            borderRadius: 16,
                                            borderWidth: 1,
                                            borderColor: palette.softGold
                                        }}
                                        onPress={() => setUsername(s)}
                                    >
                                        <Text style={{ color: theme.colors.text, fontSize: 13 }}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                    <View style={[styles.inputGroup, { marginTop: 24, paddingBottom: 100 }]}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => {
                                Keyboard.dismiss();
                                setShowDatePicker(true);
                            }}
                        >
                            <Text style={{
                                color: dateOfBirth ? theme.colors.text : theme.colors.secondaryText,
                                fontFamily: theme.typography.sans
                            }}>
                                {dateOfBirth ? formatDisplayDate(dateOfBirth) : "Select your birthday..."}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                value={dateOfBirth ? (() => {
                                    const parts = dateOfBirth.split('-');
                                    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                                })() : new Date(2000, 0, 1)}
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    // Don't hide immediately on iOS spinner or it feels glitchy
                                    if (Platform.OS !== 'ios') {
                                        setShowDatePicker(false);
                                    }
                                    if (selectedDate) {
                                        const year = selectedDate.getFullYear();
                                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                        const day = String(selectedDate.getDate()).padStart(2, '0');
                                        setDateOfBirth(`${year}-${month}-${day}`);
                                    }
                                }}
                            />
                        )}

                        <Text style={[styles.pickerHint, { marginTop: 8, textAlign: 'left' }]}>Used for birthday blessings.</Text>
                    </View>
                </FadeIn>
            </StepContainer>
        </ScrollView>
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
                    {renderHeader("Privacy & Security", "Protect your private reflections with a 4-digit PIN.")}
                </FadeIn>

                <FadeIn delay={300} from="bottom" pointerEvents="box-none">
                    <View style={[styles.pinSection, { marginBottom: 60, marginTop: 40 }]}>
                        <Text style={styles.label}>Set a security PIN</Text>
                        <TextInput
                            style={styles.pinInput}
                            placeholder="••••"
                            placeholderTextColor={theme.colors.secondaryText}
                            keyboardType="number-pad"
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                            secureTextEntry
                            autoFocus={true}
                        />
                        <Text style={styles.pinHint}>This PIN will be required to unlock your Journal and Circles.</Text>

                        {pin.length === 4 && (
                            <FadeIn delay={100} from="bottom">
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginTop: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <Fingerprint size={24} color={palette.softGold} />
                                        <View>
                                            <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 16, color: theme.colors.text }}>Enable Biometrics</Text>
                                            <Text style={{ fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: 2 }}>Unlock faster with FaceID / TouchID</Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={setupBiometrics}
                                        onValueChange={setSetupBiometrics}
                                        trackColor={{ false: 'rgba(255,255,255,0.1)', true: palette.softGold }}
                                        thumbColor={setupBiometrics ? palette.ivory : theme.colors.secondaryText}
                                    />
                                </View>
                            </FadeIn>
                        )}
                    </View>
                </FadeIn>
            </StepContainer>
        </ScrollView>
    );

    const renderStep9 = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <StepContainer>
                    <FadeIn delay={100} from="bottom">
                        {renderHeader("Your Location", "Connect with a sanctuary near you.")}
                    </FadeIn>

                    <FadeIn delay={300} from="bottom">
                        <View style={{ gap: 16 }}>
                            <TouchableOpacity
                                style={[styles.locationCard, !!locationCountry && styles.locationCardActive]}
                                onPress={() => setShowCountryPicker(true)}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.locationIconContainer, !!locationCountry && styles.locationIconContainerActive]}>
                                    <Globe size={24} color={!!locationCountry ? palette.softGold : theme.colors.text} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.locationLabel, !!locationCountry && styles.locationLabelActive]}>Country</Text>
                                    <Text style={[styles.locationValue, !!locationCountry && styles.locationValueActive, !locationCountry && { color: theme.colors.secondaryText }]}>
                                        {locationCountry || 'Select Country'}
                                    </Text>
                                </View>
                                <ChevronLeft size={20} color={!!locationCountry ? palette.softGold : theme.colors.secondaryText} style={{ transform: [{ rotate: '-90deg' }] }} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.locationCard, !!locationCity && styles.locationCardActive, !locationCountry && { opacity: 0.5 }]}
                                onPress={() => {
                                    if (!locationCountry) return;
                                    setShowCityPicker(true);
                                }}
                                disabled={!locationCountry}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.locationIconContainer, !!locationCity && styles.locationIconContainerActive]}>
                                    <MapPin size={24} color={!!locationCity ? palette.softGold : theme.colors.text} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.locationLabel, !!locationCity && styles.locationLabelActive]}>City</Text>
                                    <Text style={[styles.locationValue, !!locationCity && styles.locationValueActive, !locationCity && { color: theme.colors.secondaryText }]}>
                                        {locationCity || 'Select City'}
                                    </Text>
                                </View>
                                <ChevronLeft size={20} color={!!locationCity ? palette.softGold : theme.colors.secondaryText} style={{ transform: [{ rotate: '-90deg' }] }} />
                            </TouchableOpacity>

                        </View>
                    </FadeIn>
                </StepContainer>
            </ScrollView>
        );
    };

    const renderStep10 = () => {
        const DEFAULT_TIERS = [
            { id: 'compass', label: 'Compass', price: '$2.99', sub: '/ mo', save: 'Billed Monthly' },
            { id: 'true_north', label: 'True North', price: '$9.99', sub: '/ mo', save: 'Most Aligned' },
            { id: 'zenith', label: 'Zenith', price: '$19.99', sub: '/ mo', save: 'Elite Experience' },
        ];

        return (
            <View style={{ flex: 1, backgroundColor: palette.charcoal, paddingTop: insets.top }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 40 }}>
                        <Sparkles size={48} color={palette.softGold} style={{ marginBottom: 16 }} />
                        <Text style={[styles.title, { color: palette.ivory, textAlign: 'center', fontSize: 32 }]}>Unlock Full Potential</Text>
                        <Text style={[styles.subtitle, { color: palette.ivory, opacity: 0.9, textAlign: 'center', maxWidth: '90%' }]}>
                            Choose the plan that fits your journey.
                        </Text>
                    </View>

                    <View style={{ gap: 16 }}>
                        {offeringLoading ? (
                            <ActivityIndicator color={palette.softGold} size="large" />
                        ) : offering ? (
                            offering.availablePackages.map((pkg: any) => {
                                const product = pkg.product || pkg.storeProduct;
                                const productId = (product.identifier || '').toLowerCase();
                                const pkgTypeLC = (pkg.packageType || '').toLowerCase();
                                
                                let tierId = 'true_north';
                                if (productId.includes('compass')) tierId = 'compass';
                                else if (productId.includes('zenith')) tierId = 'zenith';
                                else if (productId.includes('true_north') || productId.includes('truenorth') || productId.includes('true-north')) tierId = 'true_north';
                                else if (pkgTypeLC.includes('annual') || pkgTypeLC.includes('yearly')) tierId = 'compass';

                                const active = tier === tierId;
                                const isCurrent = currentStoreTier === tierId;
                                const benefits = TIER_BENEFITS[tierId as keyof typeof TIER_BENEFITS] || [];

                                return (
                                    <TouchableOpacity
                                        key={pkg.identifier}
                                        style={{
                                            padding: 20, borderRadius: 24,
                                            backgroundColor: active ? palette.white : 'rgba(255,255,255,0.08)',
                                            borderWidth: 2, borderColor: active ? palette.softGold : 'rgba(255,255,255,0.1)',
                                            width: '90%', alignSelf: 'center'
                                        }}
                                        onPress={() => setTier(tierId)}
                                    >
                                        {isCurrent && (
                                            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: palette.softGold, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 10 }}>
                                                <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 10, color: palette.white }}>CURRENT PLAN</Text>
                                            </View>
                                        )}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{
                                                    width: 24, height: 24, borderRadius: 12,
                                                    borderWidth: 2, borderColor: active ? palette.softGold : 'rgba(255,255,255,0.5)',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {active && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: palette.softGold }} />}
                                                </View>
                                                <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 18, color: active ? palette.charcoal : palette.ivory }}>{cleanTitle(product.title)}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 20, color: active ? palette.charcoal : palette.ivory }}>
                                                    {product.priceString}
                                                </Text>
                                                <Text style={{ fontFamily: theme.typography.sans, fontSize: 12, color: active ? 'rgba(0,0,0,0.6)' : palette.softGold, opacity: 0.8 }}>
                                                    {pkgTypeLC.includes('annual') || pkgTypeLC.includes('yearly') || productId.includes('annual') ? '/ year' : '/ month'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ gap: 8, marginTop: 8 }}>
                                            {benefits.map((b, i) => (
                                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Check size={14} color={active ? palette.charcoal : 'rgba(255,255,255,0.6)'} />
                                                    <Text style={{ fontFamily: theme.typography.sans, fontSize: 13, color: active ? 'rgba(0,0,0,0.7)' : palette.ivory, opacity: 0.9 }}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            DEFAULT_TIERS.map((t) => {
                                const active = tier === t.id;
                                const benefits = TIER_BENEFITS[t.id as keyof typeof TIER_BENEFITS] || [];
                                return (
                                    <TouchableOpacity
                                        key={t.id}
                                        style={{
                                            padding: 20, borderRadius: 24,
                                            backgroundColor: active ? palette.white : 'rgba(255,255,255,0.08)',
                                            borderWidth: 2, borderColor: active ? palette.softGold : 'rgba(255,255,255,0.1)',
                                            width: '90%', alignSelf: 'center'
                                        }}
                                        onPress={() => setTier(t.id as any)}
                                    >
                                        {currentStoreTier === t.id && (
                                            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: palette.softGold, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 12, zIndex: 10 }}>
                                                <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 10, color: palette.white }}>CURRENT PLAN</Text>
                                            </View>
                                        )}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{
                                                    width: 24, height: 24, borderRadius: 12,
                                                    borderWidth: 2, borderColor: active ? palette.softGold : 'rgba(255,255,255,0.5)',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {active && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: palette.softGold }} />}
                                                </View>
                                                <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 18, color: active ? palette.charcoal : palette.ivory }}>{t.label}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 20, color: active ? palette.charcoal : palette.ivory }}>{t.price}</Text>
                                                <Text style={{ fontFamily: theme.typography.sans, fontSize: 12, color: active ? 'rgba(0,0,0,0.6)' : palette.softGold, opacity: 0.8 }}>{t.sub}</Text>
                                            </View>
                                        </View>
                                        <View style={{ gap: 8, marginTop: 8 }}>
                                            {benefits.map((b, i) => (
                                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Check size={14} color={active ? palette.charcoal : 'rgba(255,255,255,0.6)'} />
                                                    <Text style={{ fontFamily: theme.typography.sans, fontSize: 13, color: active ? 'rgba(0,0,0,0.7)' : palette.ivory, opacity: 0.9 }}>{b}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}

                        {/* Free Tier Card */}
                        <TouchableOpacity
                            key="free-tier"
                            style={{
                                padding: 20, borderRadius: 24,
                                backgroundColor: tier === 'free' ? palette.white : 'rgba(255,255,255,0.08)',
                                borderWidth: 2, borderColor: tier === 'free' ? palette.softGold : 'rgba(255,255,255,0.1)',
                                width: '90%', alignSelf: 'center'
                            }}
                            onPress={() => setTier('free')}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{
                                        width: 24, height: 24, borderRadius: 12,
                                        borderWidth: 2, borderColor: tier === 'free' ? palette.softGold : 'rgba(255,255,255,0.5)',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {tier === 'free' && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: palette.softGold }} />}
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: theme.typography.sansBold, fontSize: 18, color: tier === 'free' ? palette.charcoal : palette.ivory }}>Free Plan</Text>
                                        <Text style={{ fontFamily: theme.typography.sans, fontSize: 12, color: tier === 'free' ? 'rgba(0,0,0,0.6)' : palette.softGold, opacity: 0.8 }}>Basic Experience</Text>
                                    </View>
                                </View>
                                <Text style={{ fontFamily: theme.typography.serifBold, fontSize: 20, color: tier === 'free' ? palette.charcoal : palette.ivory }}>Free</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.disclaimerText, { color: palette.ivory, opacity: 0.4, textAlign: 'center', marginBottom: 12, marginTop: 24 }]}>
                        No commitment. Cancel anytime in settings.
                    </Text>

                        <TouchableOpacity 
                            onPress={handleRestore}
                            disabled={isRestoring}
                            style={{ marginVertical: 12, alignItems: 'center' }}
                        >
                            <Text style={{ 
                                fontFamily: theme.typography.sansBold, 
                                fontSize: 14, 
                                color: palette.softGold,
                                textDecorationLine: 'underline'
                            }}>
                                {isRestoring ? "Checking Store Account..." : "Restore Purchases"}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ paddingHorizontal: 20, paddingBottom: 60 }}>
                            <SubscriptionLegal light />
                        </View>
                    </ScrollView>

                    {/* ALWAYS FLOATING BUTTON */}
                    <View style={{
                        position: 'absolute', bottom: 30, left: 0, right: 0,
                        paddingHorizontal: 20,
                    }}>
                        <TouchableOpacity
                            style={[
                                styles.subscribeButton,
                                { backgroundColor: palette.softGold, height: 64, borderRadius: 32 },
                                (offeringLoading || isPurchasing) && { opacity: 0.7 }
                            ]}
                            onPress={subscriptionDetected ? () => { setLoggedIn(true); setOnboarded(true); } : handleSubscribe}
                            disabled={offeringLoading || isPurchasing}
                        >
                            {isPurchasing ? (
                                <ActivityIndicator color={palette.ivory} />
                            ) : (
                                <Text style={[styles.subscribeButtonText, { fontSize: 18, fontFamily: theme.typography.sansBold }]}>
                                    {subscriptionDetected ? "Continue to App" : (
                                        tier === 'free'
                                            ? "Continue to App"
                                            : offering
                                                ? "Subscribe Now"
                                                : `Subscribe ${DEFAULT_TIERS.find(t => t.id === tier)?.price}`
                                    )}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.container, step !== 0 && step !== 4 && step !== 11 && { paddingTop: insets.top + 20, paddingBottom: insets.bottom }, { backgroundColor: 'transparent' }]}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
            {step !== 0 && step !== 4 && step !== 11 && (
                <View style={styles.nav}>
                    {step > 0 && !loading && (
                        <TouchableOpacity onPress={prevStep}>
                            <ChevronLeft size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <View style={styles.content}>
                <FadeIn key={step} style={{ flex: 1 }} delay={100} pointerEvents="box-none">
                    {step === 0 && renderIntroStep()}
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                    {step === 6 && renderStepPassword()}
                    {step === 7 && renderStep6()}
                    {step === 8 && renderStep7()}
                    {step === 9 ? (
                        <View style={{ flex: 1 }}>{renderStep8()}</View>
                    ) : (
                        <>
                            {step === 10 && renderStep9()}
                            {step === 11 && renderStep10()}
                        </>
                    )}
                </FadeIn>
            </View>

            {step !== 0 && step !== 4 && step !== 11 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            step === 5 && !email && { opacity: 0.5 },
                            step === 6 && password.length < 6 && { opacity: 0.5 },
                            step === 7 && !username && { opacity: 0.5 },
                            step === 10 && (!locationCountry || !locationCity) && { opacity: 0.5 }
                        ]}
                        // Disable if requirements not met
                        disabled={
                            (step === 5 && !email) ||
                            (step === 6 && password.length < 6) ||
                            (step === 7 && !username) ||
                            (step === 10 && (!locationCountry || !locationCity))
                        }
                        onPress={nextStep}
                    >
                        <Text style={styles.nextButtonText}>Continue</Text>
                        <ArrowRight size={20} color={theme.colors.inverseText} />
                    </TouchableOpacity>
                </View>
            )}
            </KeyboardAvoidingView >
            {renderLocationPickerModal(showCountryPicker || showCityPicker, () => {
                setShowCountryPicker(false);
                setShowCityPicker(false);
            }, showCountryPicker ? 'country' : 'city')}

            <Popup
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    finishOnboarding();
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.successIconContainer}>
                        <Sparkles size={48} color={palette.softGold} />
                    </View>
                    <Text style={styles.successTitle}>Welcome, NorthStar</Text>
                    <Text style={styles.successDesc}>
                        Your vision is now aligned. Your path is now set to <Text style={{ fontFamily: theme.typography.sansBold, color: palette.softGold }}>{tier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Text>.{'\n'}
                        May your journey be filled with divine light and clarity.
                    </Text>

                    <View style={styles.successBenefitBox}>
                        <Text style={styles.benefitBoxTitle}>Your New Access Level:</Text>
                        {(TIER_BENEFITS[tier] || []).map((benefit: string, i: number) => (
                            <View key={i} style={styles.successBenefitRow}>
                                <Check size={16} color={palette.softGold} />
                                <Text style={styles.successBenefitText}>{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.praiseButton}
                        onPress={() => {
                            setShowSuccessModal(false);
                            finishOnboarding();
                        }}
                    >
                        <Text style={styles.praiseButtonText}>Praise</Text>
                    </TouchableOpacity>
                </View>
            </Popup>
        </View>
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
    disclaimerText: { fontFamily: theme.typography.sans, fontSize: 12, color: theme.colors.secondaryText, marginTop: theme.spacing.lg, textAlign: 'center', opacity: 0.7 },

    // Location Picker Styles
    inputDropdown: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border,
        height: 56
    },
    inputText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text },
    // New Location Card Styles
    locationCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: 16, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border,
        gap: theme.spacing.md, height: 88,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
    },
    locationCardActive: {
        backgroundColor: '#FAF9F6',
        borderColor: palette.softGold
    },
    locationIconContainer: {
        width: 48, height: 48, borderRadius: 12, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center'
    },
    locationIconContainerActive: {
        backgroundColor: palette.softGold + '25'
    },
    locationLabel: {
        fontFamily: theme.typography.sansMedium, fontSize: 13, color: theme.colors.secondaryText,
        marginBottom: 2
    },
    locationLabelActive: {
        color: palette.softGold
    },
    locationValue: {
        fontFamily: theme.typography.serifBold, fontSize: 18, color: theme.colors.text
    },
    locationValueActive: {
        color: theme.colors.text
    },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface,
        borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16,
        borderWidth: 1, borderColor: theme.colors.border
    },
    searchInput: { flex: 1, marginLeft: 8, fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.text, letterSpacing: 0 },
    pickerItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border
    },
    pickerItemText: { fontFamily: theme.typography.sansMedium, fontSize: 16, color: theme.colors.text, flex: 1 },
    successIconContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: palette.softGold + '15',
        alignItems: 'center', justifyContent: 'center', marginBottom: 24
    },
    successTitle: { fontFamily: theme.typography.serifBold, fontSize: 28, color: theme.colors.text, marginBottom: 16 },
    successDesc: {
        fontFamily: theme.typography.sans, fontSize: 16, color: theme.colors.secondaryText,
        textAlign: 'center', lineHeight: 24, marginBottom: 24
    },
    successBenefitBox: {
        width: '100%', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 16, padding: 20, marginBottom: 32,
        borderWidth: 1, borderColor: palette.softGold + '20'
    },
    benefitBoxTitle: { fontFamily: theme.typography.sansBold, fontSize: 12, color: palette.softGold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    successBenefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    successBenefitText: { fontFamily: theme.typography.sans, fontSize: 14, color: theme.colors.text, opacity: 0.9, flex: 1 },
    praiseButton: {
        backgroundColor: theme.colors.text, paddingHorizontal: 48, height: 56,
        borderRadius: 28, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8
    },
    praiseButtonText: { fontFamily: theme.typography.sansBold, fontSize: 16, color: palette.ivory },
});
