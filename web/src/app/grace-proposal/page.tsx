"use client";

import { motion } from "framer-motion";
import { 
  Handshake, 
  Users, 
  Crown, 
  BarChart, 
  CreditCard,
  Calculator
} from "lucide-react";
import { useState } from "react";

export default function GraceProposalPage() {
  // Calculator State
  const [compassReferrals, setCompassReferrals] = useState(30);
  const [trueNorthReferrals, setTrueNorthReferrals] = useState(20);
  const [zenithClients, setZenithClients] = useState(5);
  
  // 30% Apple/Google Store Fee Deduction
  const storeFeeMultiplier = 0.7; // 70% Net Revenue
  
  // Compass: KES 900 * 70% = KES 630 Net -> 10% = KES 63
  // True North: KES 2000 * 70% = KES 1400 Net -> 10% = KES 140
  const compassIncomeMonthly = compassReferrals * (900 * storeFeeMultiplier * 0.10);
  const trueNorthIncomeMonthly = trueNorthReferrals * (2000 * storeFeeMultiplier * 0.10);
  const recurringIncomeQuarterly = Math.round((compassIncomeMonthly + trueNorthIncomeMonthly) * 3);

  // KES 4,000 flat per Zenith onboarding session (measured per quarter here)
  const zenithIncome = zenithClients * 4000;
  
  const totalProjectedEarnings = recurringIncomeQuarterly + zenithIncome;

  const formatKES = (num: number) => {
    return "KES " + num.toLocaleString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <main className="min-h-screen bg-background py-16 px-6 sm:px-12 md:px-24 font-sans selection:bg-primary/20">
      
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="text-center mb-16">
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">True North Partnership</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Partnership Proposal
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            A collaborative framework between True North and Grace Kinuthia for mutual growth and user wellness.
          </p>
        </motion.header>

        <div className="space-y-8">
          
          <motion.section 
            variants={itemVariants} 
            className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Handshake size={24} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">1. Purpose of Partnership</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              This agreement outlines the revenue-sharing and service-fulfillment partnership between True North and Grace Kinuthia. The goal is to provide high-quality mental wellness tools to users while compensating Grace for both user acquisition and expert session fulfillment.
            </p>
          </motion.section>

          <motion.section 
            variants={itemVariants} 
            className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">2. Tier 1 & 2: Compass & True North</h2>
            </div>
            <p className="text-foreground text-lg mb-6">
              For users who subscribe to the <strong>Compass</strong> or <strong>True North</strong> tiers, Grace will act as a referral partner (Affiliate Model).
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Compensation:</strong> Grace will receive a <strong>10% revenue share</strong> of the Net Revenue strictly for users who sign up using her unique referral code or link.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Duration:</strong> This 10% commission is <strong>recurring</strong> and will be paid out for the lifetime of that user’s active subscription.</p>
              </li>
            </ul>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-sm text-foreground/80 mt-6">
              <span className="text-primary font-bold block mb-2">What are App Store Fees?</span>
              <p className="leading-relaxed">
                Apple and Google charge a mandatory industry-standard platform fee (up to 30%) on all in-app subscriptions. 
                <strong className="text-foreground"> Net Revenue</strong> is the remaining amount that True North directly receives (e.g. 70%). 
                To ensure a fair and sustainable long-term partnership, your 10% commission is calculated securely from this actual Net Revenue.
              </p>
            </div>
          </motion.section>

          <motion.section 
            variants={itemVariants} 
            className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Crown size={24} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">3. Tier 3: "Zenith" Subscription</h2>
            </div>
            <p className="text-foreground text-lg mb-6">
              For users who subscribe to the premium <strong>Zenith</strong> tier, the package includes an exclusive, one-time introductory session with Grace (Service Fulfillment Model).
            </p>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Service Expected:</strong> A single 1-on-1 consultation session between the Zenith subscriber and Grace.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Compensation:</strong> True North will pay Grace a flat fee of <strong>KES 4,000</strong> for this session.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Limitations:</strong> This is a <strong>one-time payment</strong> applicable <em>only</em> to the user's first month of the Zenith subscription. True North will not pay consultation fees for subsequent months.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Non-Solicitation & Ongoing Value:</strong> Following the introductory session, the user remains a True North Zenith subscriber. While Grace may offer additional private services directly, she will continue to encourage ongoing engagement with the True North platform.</p>
              </li>
            </ul>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section 
              variants={itemVariants} 
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BarChart size={20} />
                </div>
                <h2 className="font-serif text-xl font-semibold">4. Tracking & Transparency</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p>Access to a dedicated Partner Tracking Dashboard.</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p>Monitor active referrals, track Zenith sessions originating from the app, and view accrued commissions in real-time.</p>
                </li>
              </ul>
            </motion.section>

            <motion.section 
              variants={itemVariants} 
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <h2 className="font-serif text-xl font-semibold">5. Payout Terms</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Schedule:</strong> Tabulated at the end of each calendar quarter.</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Disbursement:</strong> Paid on a Net-30 basis (e.g., Q1 earnings paid by end of April).</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Conditions:</strong> Zenith fees payable only upon successful completion/fulfillment of the consultation.</p>
                </li>
              </ul>
            </motion.section>
          </div>

          {/* Earnings Calculator Section */}
          <motion.section 
            variants={itemVariants} 
            className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden mt-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                <Calculator size={24} />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold">Interactive Earnings Projection</h2>
                <p className="text-muted-foreground text-sm mt-1">Estimate your quarterly payouts based on active users.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-medium text-foreground">Compass Referrals</label>
                    <span className="text-primary font-bold">{compassReferrals.toLocaleString()} users</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Tier Price: KES 900 / month</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000"
                    step="500" 
                    value={compassReferrals} 
                    onChange={(e) => setCompassReferrals(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">KES 63 / mo per user (paid quarterly)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-medium text-foreground">True North Referrals</label>
                    <span className="text-primary font-bold">{trueNorthReferrals.toLocaleString()} users</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Tier Price: KES 2,000 / month</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000"
                    step="500" 
                    value={trueNorthReferrals} 
                    onChange={(e) => setTrueNorthReferrals(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">KES 140 / mo per user (paid quarterly)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="font-medium text-foreground">New Zenith Clients (This Quarter)</label>
                    <span className="text-primary font-bold">{zenithClients.toLocaleString()} clients</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Tier Price: KES 4,500 / month</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000"
                    step="10" 
                    value={zenithClients} 
                    onChange={(e) => setZenithClients(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Earn KES 4,000 flat per new Zenith onboarding session.</p>
                </div>
              </div>

              {/* Results */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quarterly Recurring (10% Share)</p>
                  <p className="text-2xl font-semibold">{formatKES(recurringIncomeQuarterly)}</p>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Zenith Income (This Quarter)</p>
                  <p className="text-2xl font-semibold">{formatKES(zenithIncome)}</p>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Total Projected Earnings (This Quarter)</p>
                  <p className="text-4xl font-serif font-bold text-foreground">{formatKES(totalProjectedEarnings)}</p>
                </div>
              </div>
            </div>
            
          </motion.section>

        </div>
        
        {/* The 'Accept Proposal' button has been intentionally removed as requested. */}
        <div className="pb-16" />

      </motion.div>
    </main>
  );
}
