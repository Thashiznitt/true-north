"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Sparkles,
  Users,
  MapPin,
  BookOpen,
  ArrowRight,
  Download,
  Github,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [storeUrl, setStoreUrl] = React.useState("https://apps.apple.com/app/true-north-life-compass/id6759246707");

  React.useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setStoreUrl("https://play.google.com/store/apps/details?id=com.truenorth.app"); // Placeholder for Play Store
    }
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em]">
            <a href="/#features" className="hover:text-primary transition-colors">Features</a>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
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

      <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        {/* Subtle Spiritual Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-10 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Your Digital Sanctuary
            </div>
            <h1 className="font-serif text-5xl md:text-8xl font-bold leading-[1.05] mb-10 max-w-5xl mx-auto tracking-tight text-foreground">
              Align Your Soul with <span className="text-primary italic">True North</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed font-sans opacity-80">
              A minimalist sanctuary designed to help you navigate life with spiritual clarity.
              Discover sacred tools for reflection, connection, and grace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold w-full shadow-xl shadow-primary/20">
                  <Download className="mr-2 w-5 h-5" /> Get the App
                </Button>
              </a>
              <Button onClick={scrollToFeatures} size="lg" variant="outline" className="h-14 px-10 rounded-full border-black/10 hover:bg-black/5 text-lg font-medium w-full sm:w-auto">
                Explore Features
              </Button>
            </div>

            {/* Abstract Decorative Element instead of Mockup */}
            <div className="relative max-w-4xl mx-auto py-20">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -rotate-1 -z-10" />
              <div className="px-10 py-28 bg-white border border-black/[0.03] rounded-[3rem] shadow-2xl shadow-primary/5 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl mb-12 shadow-primary/20">
                  <Image
                    src="/logo.png"
                    alt="True North Logo"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 italic opacity-80">"Finding your way, one reflection at a time."</h2>
                <Separator className="w-24 h-1 bg-primary/20 mx-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative overflow-hidden bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Pillars of Peace</h2>
            <div className="w-20 h-1 bg-primary/30 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title="Sacred Journaling"
              description="Guided reflection powered by spiritual intelligence analysis to uncover the quiet whispers of your soul."
            />
            <FeatureCard
              icon={<Users className="w-7 h-7" />}
              title="Community Circles"
              description="Connect with like-minded souls in safe, faith-based spaces for shared growth and discussion."
            />
            <FeatureCard
              icon={<Sparkles className="w-7 h-7" />}
              title="Daily Affirmations"
              description="Start every morning with personalized devotions and affirmations aligned with your belief system."
            />
            <FeatureCard
              icon={<MapPin className="w-7 h-7" />}
              title="Sanctuary Finder"
              description="Locate nearby spiritual centers and sacred spaces wherever your journey takes you."
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7" />}
              title="Encrypted & Private"
              description="Your reflections are sacred. We use high-level encryption to ensure your data stays truly private."
            />
            <FeatureCard
              icon={<Heart className="w-7 h-7" />}
              title="Faith Neutral"
              description="Designed for everyone, regardless of your specific faith or spiritual background."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-background text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-8 tracking-tight">Begin Your Journey Today</h2>
          <p className="text-lg text-muted-foreground mb-12 decoration-primary underline-offset-4 font-serif italic">
            "Your journey is sacred. Your sanctuary is here."
          </p>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="h-16 px-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xl font-bold shadow-2xl shadow-primary/20">
              Download True North
            </Button>
          </a>
        </div>
      </section>
      </main>

      {/* Footer */}
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
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed tracking-wide font-serif">
                A digital sanctuary for spiritual growth and community connection.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-foreground/70">Legal Sanctuary</h4>
              <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-foreground/70">Connect</h4>
              <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-black/5 mb-10" />
          <div className="flex flex-col md:row items-center justify-between gap-6 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-80">
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-white border border-black/[0.03] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group rounded-[2rem] overflow-hidden">
      <CardContent className="pt-12 pb-12 px-10">
        <div className="mb-8 p-4 bg-primary/5 rounded-2xl inline-block group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 text-primary">{icon}</div>
        <h3 className="font-serif text-2xl font-bold mb-4 tracking-tight text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}
