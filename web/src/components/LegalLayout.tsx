import React from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LegalLayoutProps {
    title: string;
    subtitle: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, lastUpdated, children }: LegalLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30">
            {/* Navigation */}
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
                        <span className="font-serif text-2xl font-bold tracking-tight">True North</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-primary">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-40 max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
                    <p className="text-primary font-medium uppercase tracking-[0.2em] mb-2">{subtitle}</p>
                    <p className="text-muted-foreground text-sm opacity-60 italic">{lastUpdated}</p>
                </div>

                <div className="prose prose-invert prose-primary max-w-none">
                    {children}
                </div>
            </main>
        </div>
    );
}
