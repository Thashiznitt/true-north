import { useStore } from '../store';
import { env } from './env';

// This handles both Mock (Local) and Real (RevenueCat) logic based on environment
export const subscriptionService = {
    restorePurchases: async () => {
        if (env.useMockServices) {
            console.log("[MockSubscription] Restoring purchases...");
            return true;
        }
        // In production, call Purchases.restorePurchases()
        console.log("[Subscription] Restoring purchases (Real Implementation)...");
        return true;
    },

    subscribe: async (tier: 'compass' | 'true_north' | 'zenith') => {
        if (env.useMockServices) {
            console.log(`[MockSubscription] Purchasing tier: ${tier}...`);
            const setSubscriptionTier = useStore.getState().setSubscriptionTier;

            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(async () => {
                    await setSubscriptionTier(tier);
                    resolve(true);
                }, 1000);
            });
        }

        // In production, call Purchases.purchasePackage(package)
        console.log(`[Subscription] Purchasing package for tier: ${tier} (Real Implementation)...`);
        throw new Error("Real subscription not yet implemented.");
    },

    checkSubscriptionStatus: async () => {
        return useStore.getState().subscriptionTier;
    }
};
