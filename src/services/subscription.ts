import { useStore } from '../store';
import { env } from './env';
import { notificationService } from './notifications';
import { supabase } from './supabase';
import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import * as Notifications from 'expo-notifications';

// This handles both Mock (Local) and Real (RevenueCat) logic based on environment
export const subscriptionService = {
    restorePurchases: async () => {
        if (env.useMockServices) {
            console.log("[MockSubscription] Restoring purchases...");
            return true;
        }

        try {
            const customerInfo = await Purchases.restorePurchases();
            const setSubscriptionTier = useStore.getState().setSubscriptionTier;
            // Broad search for ANY active entitlement to ensure features unlock
            const activeEntitlements = Object.keys(customerInfo.entitlements.active);
            console.log("[Subscription] Active entitlements discovery:", activeEntitlements);
            
            const isPremium = activeEntitlements.length > 0;
            let newTier: 'free' | 'compass' | 'true_north' | 'zenith' = 'free';

            if (isPremium) {
                // Try to find the specific tier from entitlement IDs
                if (activeEntitlements.some(e => e.includes('zenith'))) newTier = 'zenith';
                else if (activeEntitlements.some(e => e.includes('true_north') || e.includes('truenorth') || e.includes('premium') || e.includes('pro') || e.includes('plus') || e.includes('standard'))) newTier = 'true_north';
                else if (activeEntitlements.some(e => e.includes('compass') || e.includes('basic') || e.includes('starter'))) newTier = 'compass';
                else {
                    console.log("[Subscription] Found active entitlement but no specific tier match, defaulting to true_north");
                    newTier = 'true_north'; // Default to true_north if entitlement exists but name is generic
                }
            }

            console.log(`[Subscription] Restore result - isPremium: ${isPremium}, mappedTier: ${newTier}`);
            await setSubscriptionTier(newTier);
            await subscriptionService.syncSubscriptionToDb(newTier);
            return true;
        } catch (e) {
            console.error("[Subscription] Restore failed:", e);
            return false;
        }
    },

    getOfferings: async () => {
        if (env.useMockServices) return null;
        try {
            const offerings = await Purchases.getOfferings();
            return offerings;
        } catch (e: unknown) {
            const error = e as { message?: string, code?: string, underlyingErrorMessage?: string, userCancelled?: boolean };
            console.error("[Subscription] Error fetching offerings:", {
                message: error?.message,
                code: error?.code,
                underlyingErrorMessage: error?.underlyingErrorMessage,
                userCancelled: error?.userCancelled
            });
            return null;
        }
    },

    presentPaywall: async (offering?: PurchasesOffering) => {
        if (env.useMockServices) {
            console.log("[MockSubscription] Presenting paywall...");
            return false;
        }
        try {
            const result = await RevenueCatUI.presentPaywall({ offering });
            const success = result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
            if (success) {
                await subscriptionService.checkSubscriptionStatus();
            }
            return success;
        } catch (e) {
            console.error("[Subscription] Error presenting paywall:", e);
            return false;
        }
    },

    presentPaywallIfNeeded: async (entitlementId: string) => {
        if (env.useMockServices) return;
        try {
            const result = await RevenueCatUI.presentPaywallIfNeeded({
                requiredEntitlementIdentifier: entitlementId
            });
            if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
                await subscriptionService.checkSubscriptionStatus();
            }
        } catch (e) {
            console.error("[Subscription] Error presenting paywall if needed:", e);
        }
    },

    subscribe: async (tier: 'compass' | 'true_north' | 'zenith') => {
        if (env.useMockServices) {
            console.log(`[MockSubscription] Purchasing tier: ${tier}...`);
            const setSubscriptionTier = useStore.getState().setSubscriptionTier;

            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(async () => {
                    await setSubscriptionTier(tier);
                    await subscriptionService.syncSubscriptionToDb(tier);
                    // Schedule notifications for the new tier
                    await notificationService.scheduleDailyAffirmation(tier);
                    resolve(true);
                }, 1000);
            });
        }

        // Real implementation would usually involve picking a package from offerings
        // For convenience, we'll implement purchasePackage separately and call it from the UI
        console.log(`[Subscription] subscribe() called for ${tier}. Use purchasePackage for real RC flow.`);
        return false;
    },

    purchasePackage: async (pkg: PurchasesPackage) => {
        const setSubscriptionTier = useStore.getState().setSubscriptionTier;
        try {
            console.log("[Subscription] Attempting purchase for package:", pkg.identifier);
            const { customerInfo } = await Purchases.purchasePackage(pkg);

            // Broad search for ANY active entitlement
            const activeEntitlements = Object.keys(customerInfo.entitlements.active);
            console.log("[Subscription] Purchase success. Active entitlements:", activeEntitlements);
            
            const isPremium = activeEntitlements.length > 0;
            console.log("[Subscription] Purchase result - isPremium:", isPremium);

            if (isPremium) {
                // Map the package identifier or product ID to our internal tier
                // Handle storeProduct or product depending on version
                const product = pkg.product || (pkg as unknown as { storeProduct: unknown }).storeProduct;
                const productId = (product as { identifier?: string })?.identifier || "";

                let newTier: 'compass' | 'true_north' | 'zenith' = 'true_north';

                if (productId.includes('compass')) newTier = 'compass';
                else if (productId.includes('zenith')) newTier = 'zenith';
                else if (productId.includes('true_north') || productId.includes('truenorth')) newTier = 'true_north';

                console.log(`[Subscription] Mapping product ${productId} to tier ${newTier}`);

                // Update Local State FIRST
                await setSubscriptionTier(newTier);

                // Then DB
                await subscriptionService.syncSubscriptionToDb(newTier);

                // Then Notifications
                try {
                    // @ts-expect-error: categoryIdentifier requirement for secondary reminders
                    await notificationService.scheduleDailyAffirmation(newTier, { categoryIdentifier: 'gratitude-reminders-secondary' });
                    await notificationService.scheduleDailyJournaling(newTier);
                    
                    // Immediate success notification
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Vision Aligned ✨',
                            body: `Your journey continues. Welcome to the ${newTier.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} path.`,
                            sound: true,
                        },
                        trigger: null, // trigger immediately
                    });
                } catch (notiError) {
                    console.error("[Subscription] Notification scheduling failed after purchase:", notiError);
                }

                return true;
            }
            return false;
        } catch (e) {
            const error = e as { userCancelled?: boolean; message?: string; code?: string; underlyingError?: unknown };
            if (!error?.userCancelled) {
                console.error("[Subscription] Purchase error details:", {
                    message: error?.message,
                    code: error?.code,
                    underlyingError: error?.underlyingError
                });
            }
            return false;
        }
    },

    checkSubscriptionStatus: async () => {
        if (env.useMockServices) {
            return useStore.getState().subscriptionTier;
        }

        try {
            const customerInfo = await Purchases.getCustomerInfo();
            // Broad search for ANY active entitlement
            const activeEntitlements = Object.keys(customerInfo.entitlements.active);
            const isPremium = activeEntitlements.length > 0;
            const setSubscriptionTier = useStore.getState().setSubscriptionTier;

            const currentTier = useStore.getState().subscriptionTier;
            let newTier: 'free' | 'compass' | 'true_north' | 'zenith' = 'free';

            if (isPremium) {
                // Try to map active entitlement to tier
                if (activeEntitlements.some(e => e.includes('zenith'))) newTier = 'zenith';
                else if (activeEntitlements.some(e => e.includes('true_north') || e.includes('truenorth') || e.includes('premium') || e.includes('pro') || e.includes('plus') || e.includes('standard'))) newTier = 'true_north';
                else if (activeEntitlements.some(e => e.includes('compass') || e.includes('basic') || e.includes('starter'))) newTier = 'compass';
                else newTier = currentTier === 'free' ? 'true_north' : currentTier;
            }

            if (currentTier !== newTier) {
                await setSubscriptionTier(newTier);
                await subscriptionService.syncSubscriptionToDb(newTier);
            }
            return newTier;
        } catch (e) {
            console.error("[Subscription] Error checking status:", e);
            return useStore.getState().subscriptionTier;
        }
    },

    syncSubscriptionToDb: async (tier: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.log("[Subscription] No user logged in, skipping DB sync.");
                return;
            }

            console.log(`[Subscription] Syncing ${tier} to DB for user ${user.id}...`);
            const { error } = await supabase
                .from('users')
                .update({
                    subscription_tier: tier,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            console.log("[Subscription] DB sync successful.");
        } catch (e) {
            console.error("[Subscription] DB sync failed:", e);
        }
    },

    logIn: async (userId: string) => {
        if (env.useMockServices) return;
        try {
            await Purchases.logIn(userId);
            console.log(`[Subscription] Logged in to RevenueCat with ID: ${userId}`);
            await subscriptionService.checkSubscriptionStatus();
        } catch (e) {
            console.error("[Subscription] RevenueCat login failed:", e);
        }
    },

    logOut: async () => {
        if (env.useMockServices) return;
        try {
            await Purchases.logOut();
            console.log("[Subscription] Logged out from RevenueCat");
        } catch (e) {
            console.error("[Subscription] RevenueCat logout failed:", e);
        }
    }
};
