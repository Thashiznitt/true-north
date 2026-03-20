import { useStore } from '../store';
import { env } from './env';
import { notificationService } from './notifications';
import { supabase } from './supabase';
import Purchases, { PurchasesPackage, PurchasesOffering } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

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

            // Check for 'premium' entitlement
            const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
            const newTier = isPremium ? 'true_north' : 'free';

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

            // Check for 'premium' entitlement which covers all paid tiers
            const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
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
            // Check for 'premium' entitlement
            const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
            const setSubscriptionTier = useStore.getState().setSubscriptionTier;

            // Default to 'free' if not premium. 
            // In a more complex setup, we'd check which specific product gives which tier.
            // But for now, any active premium entitlement maps to their last known tier or true_north.
            const currentTier = useStore.getState().subscriptionTier;
            const newTier = isPremium ? (currentTier === 'free' ? 'true_north' : currentTier) : 'free';

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
