"use client";

import { motion } from "framer-motion";
import { 
  Handshake, 
  Users, 
  BarChart, 
  CreditCard,
  Calculator
} from "lucide-react";
import { useState } from "react";

export default function PartnerProposalPage() {
  // Calculator State
  const [compassReferrals, setCompassReferrals] = useState(30);
  const [trueNorthReferrals, setTrueNorthReferrals] = useState(20);
  const [zenithReferrals, setZenithReferrals] = useState(5);
  
  // 30% Apple/Google Store Fee Deduction
  const storeFeeMultiplier = 0.7; // 70% Net Revenue
  
  // Compass: KES 900 * 70% = KES 630 Net -> 10% = KES 63
  // True North: KES 2000 * 70% = KES 1400 Net -> 10% = KES 140
  // Zenith: KES 4500 * 70% = KES 3150 Net -> 10% = KES 315
  const compassIncomeMonthly = compassReferrals * (900 * storeFeeMultiplier * 0.10);
  const trueNorthIncomeMonthly = trueNorthReferrals * (2000 * storeFeeMultiplier * 0.10);
  const zenithIncomeMonthly = zenithReferrals * (4500 * storeFeeMultiplier * 0.10);
  
  const recurringIncomeMonthly = Math.round(compassIncomeMonthly + trueNorthIncomeMonthly + zenithIncomeMonthly);
  const recurringIncomeQuarterly = Math.round(recurringIncomeMonthly * 3);

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
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">True North Affiliates</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Creator Partnership
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            A transparent, collaborative revenue-share framework designed for mutual growth and absolute accountability.
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
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">1. The Partnership Model</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              This agreement outlines the revenue-sharing model between True North and our Creator Partners. We believe that creators should be fairly compensated for the authentic value they bring. Instead of one-off flat rates, we offer a lifetime recurring revenue model directly tied to the subscribers you bring to the platform.
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
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">2. Lifetime Revenue Share</h2>
            </div>
            <p className="text-foreground text-lg mb-6">
              When users subscribe to the <strong>Compass</strong>, <strong>True North</strong>, or <strong>Zenith</strong> tiers using your unique referral code or link, you earn a percentage of that revenue for as long as they stay subscribed.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Compensation:</strong> You will receive a <strong>10% revenue share</strong> of the Net Revenue for every user acquired through your link.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-primary mt-1">✦</span>
                <p className="text-muted-foreground"><strong className="text-foreground">Duration:</strong> This 10% commission is <strong>recurring monthly</strong>. If a user stays subscribed for two years, you get paid every month for two years.</p>
              </li>
            </ul>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-sm text-foreground/80 mt-6">
              <span className="text-primary font-bold block mb-2">What is Net Revenue? (The App Store realities)</span>
              <p className="leading-relaxed">
                Apple and Google charge a mandatory industry-standard platform fee (approx. 30%) on all in-app subscriptions. 
                <strong className="text-foreground"> Net Revenue</strong> is the remaining amount that True North actually receives (70%). 
                To ensure a fair and sustainable long-term partnership, your commission is calculated securely from this actual Net Revenue.
              </p>
            </div>
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
                <h2 className="font-serif text-xl font-semibold">3. 100% Transparency Tracking</h2>
              </div>
              <p className="text-muted-foreground mb-4">We understand trust requires visibility. That's why you get:</p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p>A dedicated <strong>Partner Tracking Dashboard</strong> built specifically for you.</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p>Real-time monitoring of your active referrals, churn rates, and accrued commissions without ever having to ask us for a report.</p>
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
                <h2 className="font-serif text-xl font-semibold">4. Payout Terms</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Minimum Threshold:</strong> Payouts are triggered automatically once accrued balances reach KES 5,000.</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Schedule:</strong> Calculated automatically at the end of each calendar month.</p>
                </li>
                <li className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <p><strong>Disbursement:</strong> Direct mobile money (M-Pesa) or bank transfer within 14 days of the close of the month.</p>
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
                <p className="text-muted-foreground text-sm mt-1">See how small communities can generate large passive income.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Sliders */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-foreground">Compass Tier Referrals</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="0"
                        value={compassReferrals}
                        onChange={(e) => setCompassReferrals(Number(e.target.value))}
                        className="w-24 bg-primary/10 text-primary font-bold text-right rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-primary font-bold text-sm">users</span>
                    </div>
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
                  <p className="text-xs text-muted-foreground mt-1 text-right">KES 63 / mo per user</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-foreground">True North Tier Referrals</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="0"
                        value={trueNorthReferrals}
                        onChange={(e) => setTrueNorthReferrals(Number(e.target.value))}
                        className="w-24 bg-primary/10 text-primary font-bold text-right rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-primary font-bold text-sm">users</span>
                    </div>
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
                  <p className="text-xs text-muted-foreground mt-1 text-right">KES 140 / mo per user</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-foreground">Zenith Tier Referrals</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="0"
                        value={zenithReferrals}
                        onChange={(e) => setZenithReferrals(Number(e.target.value))}
                        className="w-24 bg-primary/10 text-primary font-bold text-right rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-primary/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-primary font-bold text-sm">users</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Tier Price: KES 4,500 / month</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="100000"
                    step="500" 
                    value={zenithReferrals} 
                    onChange={(e) => setZenithReferrals(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">KES 315 / mo per user</p>
                </div>
              </div>

              {/* Results */}
              <div className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col justify-center space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Passive Monthly Income</p>
                  <p className="text-2xl font-semibold text-foreground/80">{formatKES(recurringIncomeMonthly)} <span className="text-sm font-normal text-muted-foreground">/ mo</span></p>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Total Projected Earnings (Quarterly)</p>
                  <p className="text-4xl font-serif font-bold text-foreground">{formatKES(recurringIncomeQuarterly)}</p>
                  <p className="text-sm text-muted-foreground mt-2 italic">Remember: this income recurs automatically every month these users remain subscribed.</p>
                </div>
              </div>
            </div>
            
          </motion.section>

        </div>
        
        <div className="pb-16" />

      </motion.div>
    </main>
  );
}
