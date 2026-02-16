import { env } from './env';
import { useStore } from '../store';

export type AuthProvider = 'Apple' | 'Google' | 'Email';

class AuthService {
    /**
     * Attempts to log the user in via the specified provider.
     * @param provider The auth provider to use
     * @returns Promise<boolean> True if login was successful
     */
    async login(provider: AuthProvider): Promise<boolean> {
        if (env.useMockServices) {
            return this.mockLogin(provider);
        }

        return this.realLogin(provider);
    }

    /**
     * Simulated login for Development/Local environment
     */
    private async mockLogin(provider: AuthProvider): Promise<boolean> {
        console.log(`[MockAuth] Logging in with ${provider}...`);

        return new Promise((resolve) => {
            setTimeout(() => {
                // Update store state directly for mock
                const { setOnboarded, setLoggedIn, setUsername } = useStore.getState();

                setOnboarded(true);
                setLoggedIn(true);
                // Optionally set a mock username if none exists
                if (!useStore.getState().username) {
                    setUsername(`User_${Math.floor(Math.random() * 1000)}`);
                }

                console.log(`[MockAuth] Login successful.`);
                resolve(true);
            }, 1500); // Simulate network delay
        });
    }

    /**
     * Real login logic for Production environment
     */
    private async realLogin(provider: AuthProvider): Promise<boolean> {
        console.log(`[Auth] Logging in with ${provider} (Real Implementation)...`);
        // TODO: Implement actual Supabase/Auth handling here

        // For now, fail if not implemented to avoid false positives in prod
        throw new Error("Real authentication not yet implemented.");
    }

    async logout(): Promise<void> {
        if (env.useMockServices) {
            const { setLoggedIn } = useStore.getState();
            setLoggedIn(false);
            return;
        }

        // TODO: Implement real logout
        throw new Error("Real logout not yet implemented.");
    }
}

export const authService = new AuthService();
