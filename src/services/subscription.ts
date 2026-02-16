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

    subscribe: async (packageId: string) => {
        if (env.useMockServices) {
            console.log(`[MockSubscription] Purchasing package: ${packageId}...`);
            const setSubscribed = useStore.getState().setSubscribed;

            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    setSubscribed(true);
                    resolve(true);
                }, 1000);
            });
        }

        // In production, call Purchases.purchasePackage(package)
        console.log(`[Subscription] Purchasing package: ${packageId} (Real Implementation)...`);
        throw new Error("Real subscription not yet implemented.");
    },

    checkSubscriptionStatus: async () => {
        if (env.useMockServices) {
            return useStore.getState().isSubscribed;
        }
        // In production, check customer info from RevenueCat
        return false;
    }
};
