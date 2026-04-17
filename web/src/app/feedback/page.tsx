"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  CheckCircle2,
  Loader2
} from "lucide-react";

type Theme = "Problem" | "Idea" | "Suggestion" | "Other";

const THEMES: { id: Theme; label: string; icon: any; description: string }[] = [
  { id: "Problem", label: "Report a Problem", icon: ShieldAlert, description: "Bugs, crashes, or usability issues." },
  { id: "Idea", label: "Share an Idea", icon: Lightbulb, description: "New features or structural additions." },
  { id: "Suggestion", label: "General Suggestion", icon: MessageSquare, description: "UI tweaks or copy improvements." },
  { id: "Other", label: "Other Thoughts", icon: HelpCircle, description: "Anything else on your mind." },
];

function FeedbackContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<Theme | "">("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const passedEmail = searchParams.get("email");
    if (passedEmail) {
      setEmail(passedEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !message) {
      setErrorMessage("Please select a theme and share your thoughts.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, theme, message }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit feedback.");

      setStatus("success");
      setTheme("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-white mb-4">Your Voice is Heard</h2>
        <p className="text-[#888888] max-w-md mx-auto mb-10 leading-relaxed">
          Thank you for helping us shape True North. Your perspective is crucial to the foundation of our sanctuary.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors px-8 py-3 rounded-full text-sm tracking-wider font-semibold"
        >
          SUBMIT MORE INSIGHTS
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Introduction */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight">Help Us Build True North</h1>
        <p className="text-[#888888] text-lg leading-relaxed">
          As a beta tester, your perspective anchors our roadmap. Select a focus area and share your profound thoughts, issues, or ideas.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <label className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase">1. What brings you here?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? "bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "bg-[#1A1A1A] border-[#333333] hover:border-[#555555]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? "text-[#D4AF37]" : "text-[#888888]"}`} />
                  <span className={`font-medium ${isSelected ? "text-white" : "text-[#CCCCCC]"}`}>{t.label}</span>
                </div>
                <span className="text-sm text-[#888888]">{t.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-4">
        <label className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase">2. Share your thoughts</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I noticed that when I open the community feed..."
          rows={6}
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-2xl p-5 text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none transition-all"
        />
      </div>

      {/* Optional Email Input */}
      <div className="space-y-4">
        <label className="text-sm font-semibold tracking-wider text-[#D4AF37] uppercase flex items-center justify-between">
          <span>3. Email Identity</span>
          <span className="text-[#555555] text-xs">OPTIONAL</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com (helps us follow up)"
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 text-white placeholder-[#555555] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
        />
      </div>

      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading" || !theme || !message.trim()}
        className="w-full bg-white text-[#111111] hover:bg-[#D4AF37] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#111111] transition-all py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            TRANSMITTING...
          </>
        ) : (
          "SUBMIT FEEDBACK"
        )}
      </button>
    </form>
  );
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#111111] font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* Minimal Header */}
      <header className="border-b border-[#222222] bg-[#111111]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <span className="font-serif font-bold text-xl tracking-widest uppercase">True North</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm">
            <ChevronLeft className="h-4 w-4" />
            RETURN HOME
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
          </div>
        }>
          <FeedbackContent />
        </Suspense>
      </main>
    </div>
  );
}
