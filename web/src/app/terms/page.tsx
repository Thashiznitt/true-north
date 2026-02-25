import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export default function TermsPage() {
    return (
        <LegalLayout
            title="Covenant of Community"
            subtitle="Terms of Service"
            lastUpdated="Last Cleansing: February 2026"
        >
            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">1. The Sacred Trust</h2>
                <p className="text-muted-foreground leading-relaxed">
                    By entering True North, you agree to uphold a standard of grace, respect, and spiritual integrity. This is a sanctuary for growth, not a platform for judgment or commercial exploitation.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">2. Divine Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Your reflections are yours alone. While our system provides guidance to help you connect with your spiritual path, your data is encrypted and guarded with the highest level of digital and ethical security.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">3. Community Governance</h2>
                <p className="text-muted-foreground leading-relaxed">
                    True North communities (Circles) are governed by their creators. By joining a Circle, you agree to respect the specific guidelines set forth by its leadership.
                </p>
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 uppercase tracking-wider">4. Premium Sanctuary Access</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Subscription grants access to unlimited reflections, community creation, and location-based sanctuary finding. These features are provided to enhance your spiritual journey and are subject to Apple's Standard EULA.
                </p>
            </section>

            <div className="text-center pt-10 border-t border-white/5 font-serif italic text-muted-foreground">
                Walk in peace, and may your journey be ever guided by the North Star.
            </div>
        </LegalLayout>
    );
}
