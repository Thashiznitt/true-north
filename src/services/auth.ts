import { env } from './env';
import { useStore } from '../store';
import { supabase } from './supabase';
import { subscriptionService } from './subscription';

import { Platform, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

export type AuthProvider = 'Apple' | 'Google' | 'Email';

class AuthService {
    constructor() {
        // Initialize Google Sign-In
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        });
    }

    /**
     * Attempts to log the user in via the specified provider.
     */
    async login(provider: AuthProvider, email?: string, password?: string): Promise<boolean> {
        if (env.useMockServices) {
            return this.mockLogin(provider);
        }

        try {
            if (provider === 'Apple') return await this.signInWithApple();
            if (provider === 'Google') return await this.signInWithGoogle();
            if (provider === 'Email') return await this.signInWithEmail(email, password);

            throw new Error(`Auth provider ${provider} not supported`);
        } catch (error) {
            console.error(`${provider} login error:`, error);
            return false;
        }
    }

    private async signInWithEmail(email?: string, password?: string): Promise<boolean> {
        if (!email || !password) throw new Error("Email and password required");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        const { setLoggedIn, setEmail } = useStore.getState();
        setLoggedIn(true);
        setEmail(email);
        return true;
    }

    private async signInWithApple(): Promise<boolean> {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential.identityToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });

                if (error) throw error;

                if (data.session) {
                    const { setLoggedIn, setEmail, setUsername } = useStore.getState();
                    setLoggedIn(true);
                    if (data.user.email) setEmail(data.user.email);
                    if (credential.fullName?.givenName) {
                        setUsername(credential.fullName.givenName);
                    }

                    // Ensure DB profile exists
                    await this.ensureUserProfile(data.user.id, data.user.email, credential.fullName?.givenName || undefined);

                    // Sync with RevenueCat
                    await subscriptionService.logIn(data.user.id);

                    return true;
                }
            }
            return false;
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_CANCELED') return false;
            throw e;
        }
    }

    private async signInWithGoogle(): Promise<boolean> {
        try {
            if (Platform.OS === 'android') {
                await GoogleSignin.hasPlayServices();
            }
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) throw error;

                if (data.session) {
                    const { setLoggedIn, setEmail, setUsername } = useStore.getState();
                    setLoggedIn(true);
                    if (data.user.email) setEmail(data.user.email);
                    if (userInfo.data.user.name) setUsername(userInfo.data.user.name);

                    // Ensure DB profile exists
                    await this.ensureUserProfile(data.user.id, data.user.email, userInfo.data.user.name || undefined);

                    // Sync with RevenueCat
                    await subscriptionService.logIn(data.user.id);

                    return true;
                }
            }
            return false;
        } catch (error: unknown) {
            const err = error as any; // eslint-disable-line @typescript-eslint/no-explicit-any
            if (err.code === 'SIGN_IN_CANCELLED') return false;
            console.error('Google Sign-In Error Details:', {
                code: err.code,
                message: err.message,
                details: err
            });

            Alert.alert("Sign In Error", "Could not complete Google Sign-In at this time. Please ensure you have a stable connection.");
            return false;
        }
    }


    /**
     * Signs up a new user with email and password
     */
    async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        if (env.useMockServices) {
            return { success: true };
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                const { setLoggedIn, setEmail } = useStore.getState();
                setLoggedIn(true);
                setEmail(email);

                // Sync with RevenueCat
                await subscriptionService.logIn(data.user.id);

                return { success: true };
            }
            return { success: false, error: 'User creation failed' };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Signup failed';
            console.error('Signup error:', error);
            return { success: false, error: message };
        }
    }

    /**
     * Simulated login for Development/Local environment
     */
    private async mockLogin(provider: AuthProvider): Promise<boolean> {
        console.log(`[MockAuth] Logging in with ${provider}...`);

        return new Promise((resolve) => {
            setTimeout(() => {
                const { setOnboarded, setLoggedIn, setUsername } = useStore.getState();

                setOnboarded(true);
                setLoggedIn(true);
                if (!useStore.getState().username) {
                    setUsername(`User_${Math.floor(Math.random() * 1000)}`);
                }

                console.log(`[MockAuth] Login successful.`);
                resolve(true);
            }, 1500);
        });
    }

    private async ensureUserProfile(userId: string, email?: string, username?: string): Promise<void> {
        try {
            // Check if user already exists in the 'users' table
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', userId)
                .single();

            if (!existingUser) {
                console.log(`[Auth] Creating new profile for user ${userId}...`);

                // 1. Create User Record
                const { error: userError } = await supabase
                    .from('users')
                    .insert({
                        id: userId,
                        email: email,
                        username: username || 'Sacred Voyager',
                        role: 'member',
                        subscription_tier: 'free',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    });

                if (userError) throw userError;

                // 2. Create Default Goals
                const { error: goalsError } = await supabase
                    .from('user_goals')
                    .insert({
                        user_id: userId,
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

                if (goalsError) throw goalsError;

                // 3. Create Default Preferences
                const { error: prefError } = await supabase
                    .from('user_preferences')
                    .insert({
                        user_id: userId,
                        belief_type: 'Exploring',
                        themes: [],
                        is_onboarded: true, // Social users are considered onboarded at this point or directed to onboarding
                        biometrics_enabled: false,
                        notifications_enabled: true
                    });

                if (prefError) throw prefError;
            }
        } catch (error) {
            console.error('[Auth] Error ensuring user profile:', error);
        }
    }

    async logout(): Promise<void> {
        const { reset } = useStore.getState();

        if (!env.useMockServices) {
            await subscriptionService.logOut();
            await supabase.auth.signOut();
        }

        reset();
    }

    /**
     * Deletes the current user's account and all associated data.
     */
    async deleteAccount(): Promise<boolean> {
        if (env.useMockServices) {
            console.log('[MockAuth] Deleting account...');
            const { reset } = useStore.getState();
            reset();
            return true;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            console.log(`[Auth] Deleting account for user ${user.id}...`);

            // 1. Delete user from public.users table
            // Due to ON DELETE CASCADE, this will delete:
            // - user_preferences
            // - user_goals
            // - journal_entries
            // - circle_members
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', user.id);

            if (error) throw error;

            // 2. Clear local storage and state
            await this.logout();

            return true;
        } catch (error) {
            console.error('[Auth] Error deleting account:', error);
            return false;
        }
    }
}

export const authService = new AuthService();

