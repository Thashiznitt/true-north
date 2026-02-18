import { Alert } from 'react-native';
import * as Linking from 'expo-linking';

export type PaymentMethod = 'STRIPE' | 'MPESA';

export interface PaymentRequest {
    amount: number;
    currency: string;
    description: string;
    email?: string;
    phoneNumber?: string; // Required for M-Pesa
    provider?: PaymentMethod;
    metadata: Record<string, unknown>;
}

class PaymentService {
    private isMock = true; // For simulation

    async initializePayment(request: PaymentRequest): Promise<{ success: boolean; transactionId?: string }> {
        const provider = request.provider || 'STRIPE';

        if (this.isMock) {
            if (provider === 'MPESA') {
                return this.initializeMpesaPayment(request);
            }
            return this.initializeStripePayment(request);
        }

        // Live implementation logic would go here
        return { success: false };
    }

    private async initializeStripePayment(request: PaymentRequest): Promise<{ success: boolean; transactionId?: string }> {
        return new Promise((resolve) => {
            Alert.alert(
                "Secure Payment (Stripe)",
                `Processing ${request.amount} ${request.currency} for "${request.description}".\n\nIn live mode, this opens the Stripe Payment Sheet.`,
                [
                    {
                        text: "Cancel",
                        onPress: () => resolve({ success: false }),
                        style: "cancel"
                    },
                    {
                        text: "Pay with Card",
                        onPress: () => resolve({ success: true, transactionId: `tn_stripe_${Math.random().toString(36).substr(2, 9)}` })
                    }
                ]
            );
        });
    }

    private async initializeMpesaPayment(request: PaymentRequest): Promise<{ success: boolean; transactionId?: string }> {
        if (!request.phoneNumber) {
            Alert.alert("Error", "Phone number is required for M-Pesa.");
            return { success: false };
        }

        // Simulate STK Push
        return new Promise((resolve) => {
            // First alert simulates the "Initiating" phase
            Alert.alert(
                "M-Pesa STK Push",
                `Sending request to ${request.phoneNumber}...\n\nPlease check your phone to enter your PIN.`,
                [
                    {
                        text: "Cancel",
                        onPress: () => resolve({ success: false }),
                        style: "cancel"
                    },
                    {
                        text: "Simulate Success",
                        onPress: () => {
                            // Simulate async delay of user entering PIN
                            setTimeout(() => {
                                resolve({ success: true, transactionId: `tn_mpesa_${Math.random().toString(36).substr(2, 9)}` });
                            }, 1000);
                        }
                    }
                ]
            );
        });
    }

    async handleCallback(url: string) {
        // Parse redirect URL from Flutterwave/Stripe to verify transaction status
        const { queryParams } = Linking.parse(url);
        return queryParams?.status === 'successful';
    }
}

export const paymentService = new PaymentService();
