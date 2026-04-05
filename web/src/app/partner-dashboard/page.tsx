"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Copy,
  CheckCircle2,
  LogOut,
  Target,
  Calendar,
  ChevronDown
} from "lucide-react";

export default function PartnerDashboard() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCopy = (type: "link" | "code") => {
    if (type === "link") {
      navigator.clipboard.writeText("truenorth.you/join/creator");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      navigator.clipboard.writeText("CREATOR10");
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-foreground font-sans flex flex-col">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-[#FDFBF7]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 flex items-center justify-center bg-white">
              {/* Replace with actual Logo */}
              <img src="/logo.png" alt="True North" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground">
              Partner
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-sm font-semibold text-muted-foreground mr-2">True North Partner</span>
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-secondary/50 overflow-hidden shadow-sm">
              <img src="https://i.pravatar.cc/150?u=partner" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="text-muted-foreground hover:text-black transition-colors p-2 rounded-full hover:bg-black/5">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8 md:py-16 max-w-7xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          {/* Welcome Section & Filters */}
          <motion.div variants={itemVariants} className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
            <div className="text-center sm:text-left">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-[#111]">
                Hi, Partner.
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">
                Here is exactly how your community is growing.
              </p>
            </div>
            
            {/* Flexible Time Filter */}
            <div className="flex flex-col xl:flex-row items-center gap-3 self-center xl:self-end w-full sm:w-auto z-40">
              
              {/* Custom Date Inputs (Appears dynamically) */}
              {timeFilter === 'Custom Range...' && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 w-full sm:w-auto">
                  <input type="date" className="w-full sm:w-auto px-3 py-3 rounded-2xl border border-black/10 text-sm font-medium bg-white text-foreground outline-none focus:border-primary transition-colors shadow-sm" />
                  <span className="text-muted-foreground font-bold text-[10px] uppercase">to</span>
                  <input type="date" className="w-full sm:w-auto px-3 py-3 rounded-2xl border border-black/10 text-sm font-medium bg-white text-foreground outline-none focus:border-primary transition-colors shadow-sm" />
                </motion.div>
              )}

              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2 px-5 py-3 bg-white border border-black/10 hover:border-black/20 rounded-2xl text-sm font-bold shadow-sm transition-all text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="whitespace-nowrap">{timeFilter}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 left-0 sm:left-auto md:right-0 top-full mt-2 w-full sm:w-56 bg-white border border-black/5 rounded-2xl shadow-2xl overflow-hidden py-1">
                    {['This Month', 'Last Month', 'This Quarter', 'This Year', 'All Time', 'Custom Range...'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setTimeFilter(filter);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm font-semibold hover:bg-black/5 transition-colors ${
                          timeFilter === filter ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
            {/* Impressions */}
            <motion.div variants={itemVariants} className="bg-white border border-black/[0.04] p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -z-10 group-hover:bg-primary/10 transition-all" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Total Clicks</h3>
              </div>
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-serif font-bold text-[#111]">2,450</span>
                <p className="text-xs text-primary font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% from last week
                </p>
              </div>
            </motion.div>

            {/* Conversion Funnel */}
            <motion.div variants={itemVariants} className="bg-white border border-black/[0.04] p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Funnel</h3>
              </div>
              
              <div className="flex justify-between items-end gap-2">
                 <div className="flex-1">
                    <span className="text-2xl lg:text-3xl font-serif font-bold text-[#111]">23.4%</span>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1 text-nowrap">Click → Sign up</p>
                 </div>
                 <div className="w-px h-10 bg-black/5 mx-2"></div>
                 <div className="flex-1">
                    <span className="text-2xl lg:text-3xl font-serif font-bold text-primary">68.2%</span>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mt-1 text-nowrap">Sign up → Paid</p>
                 </div>
              </div>
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div variants={itemVariants} className="bg-white border border-black/[0.04] p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -z-10 group-hover:bg-primary/10 transition-all" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Active Subs</h3>
              </div>
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-serif font-bold text-[#111]">574</span>
                <p className="text-xs text-primary font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +45 new this month
                </p>
              </div>
            </motion.div>

            {/* Churn Rate */}
            <motion.div variants={itemVariants} className="bg-white border border-black/[0.04] p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-[40px] -z-10 group-hover:bg-destructive/10 transition-all" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-widest">Churn Rate</h3>
              </div>
              <div className="space-y-1">
                <span className="text-4xl md:text-5xl font-serif font-bold text-[#111]">1.2%</span>
                <p className="text-xs text-muted-foreground font-semibold">Below industry average</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Financial Ledger */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#1A1A1A] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col justify-between group">
              {/* Subtle Gold Accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10 mb-12 lg:mb-0">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-serif text-2xl font-medium tracking-wide">Pending Payout</h2>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Estimated Net Revenue (30 Days)</p>
                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-6xl md:text-8xl font-serif font-bold tracking-tight leading-none">KES 48,206</span>
                    <span className="text-white/40 font-bold text-2xl md:text-4xl mb-1 md:mb-3">.00</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 lg:mt-16 w-full">
                <button className="px-8 py-5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg flex-[3] text-center text-sm uppercase tracking-widest">
                  Request Payout
                </button>
                <button className="px-8 py-5 bg-white/5 hover:bg-white/10 font-bold rounded-2xl transition-all border border-white/10 flex-[2] text-center text-sm uppercase tracking-widest backdrop-blur-sm">
                  View Ledger
                </button>
              </div>
            </motion.div>

            {/* Affiliate Details */}
            <motion.div variants={itemVariants} className="bg-white border border-black/[0.04] p-8 md:p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-8 text-[#111]">Your Metrics</h2>
                
                <div className="space-y-8">
                  {/* Link Block */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3 block">Unique Sign-up Link</label>
                    <div className="flex items-center gap-3 p-1.5 pl-5 border border-black/5 rounded-2xl bg-[#FDFBF7] focus-within:border-primary/50 transition-colors shadow-inner">
                      <input 
                        type="text" 
                        readOnly 
                        value="truenorth.you/join/creator" 
                        className="bg-transparent border-none outline-none flex-grow text-sm font-medium text-foreground w-full truncate"
                      />
                      <button 
                        onClick={() => handleCopy('link')}
                        className={`p-3 rounded-xl transition-all flex-shrink-0 ${copiedLink ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}
                      >
                        {copiedLink ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Code Block */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3 block">Podcast Promo Code</label>
                    <div className="flex items-center gap-3 p-1.5 pl-5 border border-black/5 rounded-2xl bg-[#FDFBF7] focus-within:border-primary/50 transition-colors shadow-inner">
                      <input 
                        type="text" 
                        readOnly 
                        value="CREATOR10" 
                        className="bg-transparent border-none outline-none flex-grow text-base md:text-sm font-bold text-foreground tracking-widest uppercase"
                      />
                      <button 
                        onClick={() => handleCopy('code')}
                        className={`p-3 rounded-xl transition-all flex-shrink-0 ${copiedCode ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}
                      >
                        {copiedCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="mt-10 pt-8 border-t border-black/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Subscriber Breakdown</span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4 bg-secondary">
                  <div className="bg-primary w-[65%] hover:opacity-90 transition-opacity" title="True North"></div>
                  <div className="bg-foreground w-[25%] hover:opacity-90 transition-opacity" title="Compass"></div>
                  <div className="bg-black/20 w-[10%] hover:opacity-90 transition-opacity" title="Zenith"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span className="text-primary tracking-wide">True North <span className="font-medium text-primary/70">(373)</span></span>
                  <span className="text-foreground tracking-wide">Compass <span className="font-medium text-muted-foreground">(143)</span></span>
                  <span className="text-muted-foreground/60 tracking-wide">Zenith <span className="font-medium text-black/30">(58)</span></span>
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              <div className="mt-8 pt-8 border-t border-black/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Traffic Sources</span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4 bg-secondary">
                  <div className="bg-[#E1306C] w-[45%] hover:opacity-90 transition-opacity" title="Instagram"></div>
                  <div className="bg-foreground w-[35%] hover:opacity-90 transition-opacity" title="TikTok"></div>
                  <div className="bg-[#1DA1F2] w-[20%] hover:opacity-90 transition-opacity" title="Twitter"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span className="text-[#E1306C] tracking-wide">Instagram <span className="font-medium opacity-70">(1,102)</span></span>
                  <span className="text-foreground tracking-wide">TikTok <span className="font-medium opacity-70">(858)</span></span>
                  <span className="text-[#1DA1F2] tracking-wide">Twitter <span className="font-medium opacity-70">(490)</span></span>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
