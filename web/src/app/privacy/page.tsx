import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export default function PrivacyPage() {
    return (
        <LegalLayout
            title="Data Stewardship"
            subtitle="Privacy Policy"
            lastUpdated="Last Reviewed: February 2026"
        >
            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">1. Our Commitment</h2>
                <p className="text-muted-foreground leading-relaxed">
                    At True North, we believe your spiritual journey is sacred. We are committed to protecting your privacy and ensuring that your reflections remain your own.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">2. Information We Collect</h2>
                <ul className="space-y-4 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">Account Data:</strong> Email and name when you sign up to ensure a personalized experience.
                    </li>
                    <li>
                        <strong className="text-foreground">Reflections:</strong> Your journal entries are encrypted and used only to provide Spiritual Intelligence guidance at your explicit request.
                    </li>
                    <li>
                        <strong className="text-foreground">Preferences:</strong> Your selected belief system and themes to personalize your spiritual journey.
                    </li>
                </ul>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">3. Spiritual Intelligence</h2>
                <p className="text-muted-foreground leading-relaxed">
                    When you use the Spiritual Analysis feature, your journal entry is processed by our secure spiritual intelligence partner to generate guidance. This data is handled with enterprise-grade encryption and is strictly not used for training models or shared with third parties for advertising.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">4. Data Deletion</h2>
                <p className="text-muted-foreground leading-relaxed">
                    You have the absolute right to delete your account and all associated data at any time through the Privacy & Security settings in your profile.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">5. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                    We use Supabase for secure data storage and RevenueCat for managing premium subscriptions. These partners adhere to strict privacy and ethical standards.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">6. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                    If you have any questions regarding your data or this policy, please reach out to our stewardship team at <strong className="text-foreground">support@truenorth.you</strong>.
                </p>
            </section>

            <div className="text-center pt-10 border-t border-black/5 font-serif italic text-muted-foreground">
                Your trust is our foundation.
            </div>
        </LegalLayout>
    );
}
