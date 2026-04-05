"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Navigation, Clock, Sunrise } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FeatureCard = ({
  icon: Icon,
  title,
  explanation,
  benefit,
  delay
}: {
  icon: any;
  title: string;
  explanation: string;
  benefit: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="bg-card text-card-foreground border border-black/[0.03] hover:border-primary/30 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col"
  >
    <div className="mb-8 p-4 bg-primary/5 rounded-2xl inline-flex group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 text-primary self-start">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="font-serif text-2xl font-bold mb-4 tracking-tight text-foreground">{title}</h3>
    <div className="mb-6 space-y-2 flex-grow">
      <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-primary/80">How to explain it:</h4>
      <p className="text-muted-foreground leading-relaxed text-sm opacity-80">{explanation}</p>
    </div>
    <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl">
      <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-primary mb-2">The Mental Benefit:</h4>
      <p className="text-sm leading-relaxed text-foreground/80 font-medium">{benefit}</p>
    </div>
  </motion.div>
);

export default function AboutPage() {
  const [storeUrl, setStoreUrl] = useState("https://apps.apple.com/app/true-north-life-compass/id6759246707");

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setStoreUrl("https://play.google.com/store/apps/details?id=com.truenorth.app"); // Placeholder for Play Store
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans flex flex-col">
      {/* Exact Home Page Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
              <Image
                src="/logo.png"
                alt="True North Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">True North</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em]">
            <a href="/#features" className="hover:text-primary transition-colors">Features</a>
            <Link href="/about" className="hover:text-primary transition-colors text-primary">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
              Download
            </Button>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-10 shadow-sm">
              <span role="img" aria-label="microphone" className="text-base leading-none">🎙️</span>
              <span>The Core Idea</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              &ldquo;True North is a quiet room <span className="text-primary italic">just for you.</span>&rdquo;
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mx-auto leading-relaxed max-w-3xl font-sans opacity-80">
              It’s an app designed entirely for your peace of mind. We spend all day performing on social media for other people. True North is the exact opposite: it’s a private space to slow down, write down your thoughts, and figure out who you want to be.
            </p>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto bg-secondary/20 rounded-[3rem] mb-20 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 tracking-tight">How It Works</h2>
            <div className="w-20 h-1 bg-primary/30 mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground tracking-widest uppercase text-xs font-bold opacity-70">
              And why it matters
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 px-4 md:px-12">
            <FeatureCard
              icon={Lock}
              title="1. The Private Journal"
              explanation="It’s a completely locked, private diary on your phone."
              benefit="Writing things down gets them out of your head, which drastically lowers anxiety. Because the journal is locked with a PIN, you know nobody else will ever see it. You don't have to pretend. You can just be honest with yourself, which is the first step to feeling better."
              delay={0.1}
            />
            <FeatureCard
              icon={Navigation}
              title="2. A Personal Guide"
              explanation='We built a gentle, built-in "Guide" that understands your goals and helps you reflect on what you write.'
              benefit="When you're going through a tough time, it’s easy to get stuck in your own head. Our Guide acts like a supportive sounding board. It helps you notice positive patterns in your writing and gives you a fresh perspective when you're feeling down."
              delay={0.2}
            />
            <FeatureCard
              icon={Clock}
              title="3. Disappearing Communities"
              explanation='We have group spaces called "Circles" where you can share thoughts with others, but everything you write disappears after 7 days.'
              benefit="Everything on the internet feels so permanent, which makes us afraid to speak our minds or make mistakes. By having messages disappear, True North teaches the beautiful practice of letting go. It removes the pressure of judgment and lets you connect with people authentically in the moment."
              delay={0.3}
            />
            <FeatureCard
              icon={Sunrise}
              title="4. Positive Morning Momentum"
              explanation="The app gives you daily words of encouragement based on what matters to you."
              benefit="Most of us wake up and immediately read stressful news. True North breaks that bad habit. Starting your day with a simple, positive thought trains your brain to look for the good in life."
              delay={0.4}
            />
          </div>
        </section>

        {/* Talking Points Section */}
        <section className="px-6 py-20 md:py-32 bg-foreground text-background">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 tracking-tight">The True North Philosophy</h2>
              <div className="w-20 h-1 bg-primary/30 mx-auto rounded-full" />
            </motion.div>

            <div className="space-y-12 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center md:text-left bg-background/5 border border-background/10 rounded-3xl p-8 md:p-12"
              >
                <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  Anti-Social Media
                </div>
                <p className="text-base md:text-xl leading-relaxed text-balance text-background/90 max-w-3xl md:mx-0 mx-auto">
                  True North is not a social network. We have no "likes," no followers to chase, and no endless scrolling feed. The goal isn't to keep you on the app as long as possible; it's to help you check in with yourself and then get back to your real life.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center md:text-left bg-background/5 border border-background/10 rounded-3xl p-8 md:p-12"
              >
                <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  The Pressure to Perform
                </div>
                <p className="text-base md:text-xl leading-relaxed text-balance text-background/90 max-w-3xl md:mx-0 mx-auto">
                  It is undeniably exhausting to constantly "perform" online. True North is purposefully built to be your quiet antidote to that exhaustion.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center md:text-left bg-background/5 border border-background/10 rounded-3xl p-8 md:p-12"
              >
                <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                  You Aren't Alone
                </div>
                <p className="text-base md:text-xl leading-relaxed text-balance text-background/90 max-w-3xl md:mx-0 mx-auto">
                  While your Sanctuary is entirely private, you can still connect with real people through local events and safe, expiring community circles. True North cures isolation without ever compromising your privacy.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center pt-8 border-t border-background/10 mt-12"
            >
              <p className="font-serif italic text-lg md:text-xl text-primary opacity-90 text-center">Available now on iOS and Android.</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Exact Home Page Footer */}
      <footer className="py-24 border-t border-black/5 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                  <Image
                    src="/logo.png"
                    alt="True North Logo"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight">True North</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed tracking-wide opacity-70 italic font-serif">
                A digital sanctuary for spiritual growth and community connection.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-foreground/40">Legal Sanctuary</h4>
              <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-foreground/40">Connect</h4>
              <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-black/5 mb-10" />
          <div className="flex flex-col md:row items-center justify-between gap-6 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">
            <span>© {new Date().getFullYear()} True North. All rights reserved.</span>
            <div className="flex items-center gap-8">
              <span>Designed with Grace</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
