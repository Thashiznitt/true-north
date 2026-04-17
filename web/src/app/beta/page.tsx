"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle, Apple, Smartphone } from "lucide-react";

export default function BetaWaitlist() {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"ios" | "android" | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) {
      setErrorMessage("Please select your preferred platform.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, platform }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("idle");
        setEmail("");
        setPlatform("");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Failed to connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="bg-[#1A1A1A] border border-[#E5D3B3]/30 shadow-2xl rounded-full px-6 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#E5D3B3]" />
            <span className="text-white text-sm font-medium tracking-wide">You're on the list! We'll be in touch.</span>
          </div>
        </div>
      )}

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E5D3B3]/10 flex items-center justify-center border border-[#E5D3B3]/20">
              <Sparkles className="w-6 h-6 text-[#E5D3B3]" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#FCFBF8] mb-4">True North Beta</h1>
          <p className="text-white/60 text-lg">
            Be the first to experience the journey.
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seeker@truenorth.you"
                className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-[#E5D3B3] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPlatform("ios")}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    platform === "ios"
                      ? "border-[#E5D3B3] bg-[#E5D3B3]/10"
                      : "border-white/5 bg-[#111111] hover:border-white/20"
                  }`}
                >
                  <Apple className={`w-8 h-8 ${platform === "ios" ? "text-[#E5D3B3]" : "text-white/40"}`} />
                  <span className={`text-sm font-semibold ${platform === "ios" ? "text-white" : "text-white/50"}`}>
                    iOS
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform("android")}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    platform === "android"
                      ? "border-[#E5D3B3] bg-[#E5D3B3]/10"
                      : "border-white/5 bg-[#111111] hover:border-white/20"
                  }`}
                >
                  <Smartphone className={`w-8 h-8 ${platform === "android" ? "text-[#E5D3B3]" : "text-white/40"}`} />
                  <span className={`text-sm font-semibold ${platform === "android" ? "text-white" : "text-white/50"}`}>
                    Android
                  </span>
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#E5D3B3] text-[#111111] font-semibold rounded-xl py-4 flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              {status === "loading" ? "Securing spot..." : "Become Tester"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
