"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Link2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Smartphone,
  ExternalLink,
  Eye,
  BarChart3,
  CalendarClock,
  PenLine,
  Download,
  Mail,
  X,
  Check,
  Copy,
  Megaphone,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Signature Pad Component ───────────────────────────────────────
function SignaturePad({
  onSave,
  onClear,
}: {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#111111";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="space-y-4">
      <div className="relative border-2 border-dashed border-border rounded-2xl overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-48 cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-muted-foreground/40 text-sm font-medium flex items-center gap-2">
              <PenLine size={16} /> Sign here
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={clearSignature}
          className="flex-1 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={saveSignature}
          disabled={!hasSignature}
          className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check size={16} /> Confirm Signature
        </button>
      </div>
    </div>
  );
}

// ─── Example Post Mockup ───────────────────────────────────────────
function ExamplePostMockup() {
  const [copied, setCopied] = useState(false);

  const referralLink = "https://truenorth.app/r/grace-kinuthia";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1a2e] rounded-3xl p-1 shadow-2xl">
      {/* Status Bar Mockup */}
      <div className="flex items-center justify-between px-5 py-2 text-white/60 text-[10px]">
        <span>09:11</span>
        <div className="flex items-center gap-1">
          <span>●●●</span>
          <span>91%</span>
        </div>
      </div>

      {/* Channel Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white font-bold text-sm">
          GK
        </div>
        <div>
          <p className="text-white font-semibold text-sm">
            Grace Kinuthia (Psychology...)
          </p>
          <p className="text-white/50 text-xs">152K followers</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-5 py-4 space-y-4">
        {/* Image placeholder */}
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-emerald-800/40 to-teal-900/40 flex items-center justify-center border border-white/5">
          <div className="text-center">
            <p className="text-white/30 text-xs">🧠 Post Image / Graphic</p>
          </div>
        </div>

        {/* Post Text */}
        <div className="text-white/80 text-[13px] leading-relaxed space-y-3">
          <p className="font-semibold text-white text-sm">
            The Future of Parkinson&#39;s: Hope Through Research and Innovation
          </p>
          <p>
            Despite being a chronic and progressive condition, there is growing
            hope in Parkinson&apos;s research. Scientists are exploring ways to
            slow or even stop disease progression...
          </p>
          <p className="text-white/50 text-[11px]">... read more</p>
        </div>

        {/* ─── THIS IS THE REQUIRED REFERRAL SECTION ─── */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-4 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={14} className="text-primary" />
              <p className="text-primary font-bold text-xs uppercase tracking-wider">
                Download True North
              </p>
            </div>
            <p className="text-white/70 text-[11px] leading-relaxed mb-3">
              Start your mental wellness journey today. Download True North —
              your digital sanctuary for reflection, growth, and spiritual
              clarity.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-3 py-2 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Download size={12} />
                </div>
                <div className="flex-1">
                  <p className="text-white/90 text-[11px] font-bold">
                    📱 Get it on Google Play
                  </p>
                  <p className="text-primary/70 text-[9px] font-mono truncate">
                    play.google.com/store/...?ref=grace-kinuthia
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-white/30 group-hover:text-primary transition-colors"
                />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-3 py-2 transition-colors group"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Download size={12} />
                </div>
                <div className="flex-1">
                  <p className="text-white/90 text-[11px] font-bold">
                    🍏 Download on App Store
                  </p>
                  <p className="text-primary/70 text-[9px] font-mono truncate">
                    apps.apple.com/...?ref=grace-kinuthia
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-white/30 group-hover:text-primary transition-colors"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-4 pt-2 text-white/40 text-xs">
          <span>❤️ 👍 😮 8</span>
          <span>↗️ 3</span>
          <span className="ml-auto text-[10px]">21:28</span>
        </div>
      </div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────────────
function ContractSection({
  icon,
  number,
  title,
  children,
  accent = false,
  warning = false,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
      className={`
        backdrop-blur-xl border rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden
        ${
          warning
            ? "bg-red-50/50 border-red-200/50"
            : accent
            ? "bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
            : "bg-card/50 border-border/50"
        }
      `}
    >
      {!warning && !accent && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
      )}
      {warning && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
      )}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            warning
              ? "bg-red-100 text-red-600"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold">
          {number}. {title}
        </h2>
      </div>
      {children}
    </motion.section>
  );
}

// ─── Main Contract Page ────────────────────────────────────────────
export default function GraceContractPage() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contractDate = "April 1, 2026";
  const commencementDate = "April 13, 2026";
  const referralLink = "https://truenorth.you/r/grace-kinuthia";

  const handleSubmit = useCallback(async () => {
    if (!signatureData || !agreedToTerms || !fullName || !email) return;
    setSubmitError(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/sign-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          idNumber,
          signatureData,
          commencementDate: "2026-04-13",
          referenceCode: "TN-GK-2026-001",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sign contract");
      setIsSent(true);
      setShowSuccess(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [signatureData, agreedToTerms, fullName, email, idNumber]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <main className="min-h-screen bg-background py-12 px-6 sm:px-12 md:px-24 font-sans selection:bg-primary/20">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="font-serif text-3xl font-bold mb-4">
                Contract Signed Successfully
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A copy of the signed agreement has been sent to{" "}
                <strong className="text-foreground">{email}</strong>. Please
                check your inbox for confirmation.
              </p>
              <div className="bg-primary/5 rounded-2xl p-4 text-sm text-muted-foreground mb-8">
                <p>
                  <strong className="text-foreground">Reference:</strong>{" "}
                  TN-GK-2026-001
                </p>
                <p>
                  <strong className="text-foreground">Commencement:</strong>{" "}
                  {commencementDate}
                </p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <FileText size={12} />
            Legally Binding Agreement
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Influencer Partnership Contract
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Referral & Content Distribution Agreement between True North and
            Grace Kinuthia
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarClock size={14} className="text-primary" />
              Drafted: {contractDate}
            </span>
            <span className="text-border">|</span>
            <span>Ref: TN-GK-2026-001</span>
          </div>
        </motion.header>

        {/* Parties */}
        <motion.section
          variants={itemVariants}
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-sm mb-8"
        >
          <h2 className="font-serif text-xl font-semibold mb-6 text-primary">
            PARTIES TO THIS AGREEMENT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary/5 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Party A — The Company
              </p>
              <p className="font-semibold text-lg">True North</p>
              <p className="text-muted-foreground text-sm mt-1">
                Digital Mental Wellness Platform
              </p>
              <p className="text-muted-foreground text-sm">
                Contact: admin@truenorth.you
              </p>
            </div>
            <div className="bg-secondary/50 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Party B — The Partner
              </p>
              <p className="font-semibold text-lg">Grace Kinuthia</p>
              <p className="text-muted-foreground text-sm mt-1">
                Licensed Psychologist & Content Creator
              </p>
              <p className="text-muted-foreground text-sm">
                Channel: 152,000+ followers
              </p>
            </div>
          </div>

          {/* Legal Representation */}
          <div className="mt-8 bg-gradient-to-r from-[#1a1a2e]/5 to-transparent border border-[#1a1a2e]/10 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a2e]/60 mb-3 flex items-center gap-2">
              <ShieldCheck size={12} />
              Legal Representation — Party A
            </p>
            <p className="font-serif font-bold text-lg text-foreground tracking-wide">
              K&apos;ANJEJO &amp; COMPANY ADVOCATES
            </p>
            <div className="mt-3 text-sm text-muted-foreground space-y-1">
              <p>Junction of General Mathenge Drive</p>
              <p>Ring Road Parklands, Opposite Kwacha House</p>
              <p>Nairobi, Kenya</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <a href="mailto:walter@kadvocates.co.ke" className="text-primary hover:underline flex items-center gap-1.5">
                <Mail size={13} /> walter@kadvocates.co.ke
              </a>
            </div>
          </div>
        </motion.section>

        <div className="space-y-8">
          {/* Section 1: Purpose */}
          <ContractSection
            icon={<FileText size={24} />}
            number="1"
            title="Purpose & Scope"
          >
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                This Agreement establishes a formal referral and content
                distribution partnership between True North (&quot;the
                Company&quot;) and Grace Kinuthia (&quot;the Partner&quot;).
              </p>
              <p>
                The Partner agrees to promote the True North mobile application
                across her social media channels (collectively &quot;the
                Channels&quot;), which currently maintain a combined audience of
                approximately <strong className="text-foreground">152,000 followers</strong>,
                by including traceable referral download links after
                each content post published on the Channels.
              </p>
              <p>
                The purpose of this arrangement is to generate measurable app
                installs via attributable referral links, enabling transparent
                revenue tracking and performance-based compensation.
              </p>
            </div>
          </ContractSection>

          {/* Section 2: Referral Link Obligation */}
          <ContractSection
            icon={<Link2 size={24} />}
            number="2"
            title="Referral Link Obligation"
            accent
          >
            <div className="text-foreground leading-relaxed space-y-4">
              <p className="text-lg font-medium">
                The Partner shall include the following referral download links
                at the end of <strong>every post</strong> published on her Channels:
              </p>

              <div className="bg-white rounded-2xl p-6 border border-border/50 space-y-4 my-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Google Play Store Link
                  </p>
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3 font-mono text-sm">
                    <span className="text-primary truncate flex-1">
                      https://play.google.com/store/apps/details?id=com.truenorth.app&referrer=utm_source%3Dgrace-kinuthia
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Apple App Store Link
                  </p>
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3 font-mono text-sm">
                    <span className="text-primary truncate flex-1">
                      https://apps.apple.com/app/true-north/id6759246707?pt=grace-kinuthia
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Universal Short Link (Recommended)
                  </p>
                  <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 font-mono text-sm">
                    <span className="text-primary font-bold truncate flex-1">
                      {referralLink}
                    </span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(referralLink);
                      }}
                      className="text-primary hover:text-primary/70 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This smart link auto-redirects to the correct app store
                    based on the user&apos;s device.
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p className="text-muted-foreground">
                    Links must be placed{" "}
                    <strong className="text-foreground">at the end of every post</strong>{" "}
                    with a clear call-to-action directing followers to download
                    the app.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p className="text-muted-foreground">
                    The referral links contain{" "}
                    <strong className="text-foreground">
                      unique tracking parameters
                    </strong>{" "}
                    that attribute each install to the Partner, enabling
                    transparent revenue tracking.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p className="text-muted-foreground">
                    The Partner may customize the call-to-action text but{" "}
                    <strong className="text-foreground">
                      must not alter or remove the tracking parameters
                    </strong>{" "}
                    from the URLs.
                  </p>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* Section 3: Example Post */}
          <ContractSection
            icon={<Megaphone size={24} />}
            number="3"
            title="Example Post Format"
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              Below is a reference mockup demonstrating the required post format.
              The Partner&apos;s regular content is followed by the mandatory
              referral section at the bottom of every post:
            </p>
            <div className="max-w-sm mx-auto">
              <ExamplePostMockup />
            </div>
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-5 text-sm">
              <p className="text-primary font-bold mb-2 flex items-center gap-2">
                <Eye size={14} /> Key Requirements
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Every post must end with the True North download section
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Both Google Play and App Store links must be included
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Referral tracking parameter (?ref=grace-kinuthia) must remain
                    intact
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Minimum call-to-action text encouraging downloads
                  </span>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* Section 4: Install Tracking */}
          <ContractSection
            icon={<BarChart3 size={24} />}
            number="4"
            title="Install Tracking & Attribution"
          >
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                All installs originating from the Partner&apos;s referral links
                will be tracked through the following mechanisms:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="bg-secondary/50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Smartphone size={16} />
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      Google Play
                    </p>
                  </div>
                  <p className="text-sm">
                    Install referrer API captures the{" "}
                    <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
                      utm_source=grace-kinuthia
                    </code>{" "}
                    parameter at install time.
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Smartphone size={16} />
                    </div>
                    <p className="font-semibold text-foreground text-sm">
                      App Store
                    </p>
                  </div>
                  <p className="text-sm">
                    Campaign token{" "}
                    <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
                      pt=grace-kinuthia
                    </code>{" "}
                    tracked via App Analytics and provider token attribution.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    The Company shall provide the Partner with access to a{" "}
                    <strong className="text-foreground">
                      real-time Partner Dashboard
                    </strong>{" "}
                    displaying: total installs, active subscriptions, and
                    accrued revenue attributable to her referral links.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    Revenue attribution follows the same structure outlined in
                    the existing Partnership Proposal — a{" "}
                    <strong className="text-foreground">
                      10% net revenue share
                    </strong>{" "}
                    on Compass and True North tiers, and a{" "}
                    <strong className="text-foreground">
                      KES 4,000 flat fee
                    </strong>{" "}
                    per Zenith onboarding session.
                  </p>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* Section 5: BREACH — Full Red Warning */}
          <ContractSection
            icon={<AlertTriangle size={24} />}
            number="5"
            title="Breach & Forfeiture"
            warning
          >
            <div className="leading-relaxed space-y-4">
              <p className="text-red-800 font-medium text-lg">
                Failure to comply with the referral link obligation constitutes
                a material breach of this Agreement.
              </p>
              <div className="bg-white rounded-2xl p-6 border border-red-200">
                <p className="text-sm text-red-700 font-bold uppercase tracking-wider mb-4">
                  Specifically:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <X
                      size={16}
                      className="text-red-500 mt-0.5 shrink-0"
                    />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">
                        Omitting referral links
                      </strong>{" "}
                      from any post on the Channels shall be considered a
                      breach of this Agreement.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <X
                      size={16}
                      className="text-red-500 mt-0.5 shrink-0"
                    />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">
                        Tampering with or removing tracking parameters
                      </strong>{" "}
                      from the referral URLs shall constitute a breach.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <X
                      size={16}
                      className="text-red-500 mt-0.5 shrink-0"
                    />
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">
                        Repeated breaches (3 or more posts without links within
                        a 30-day period)
                      </strong>{" "}
                      will result in the Partner{" "}
                      <strong className="text-red-600">
                        forfeiting all accrued and future revenue
                      </strong>{" "}
                      under this Agreement until the breach is remedied.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="bg-red-100/50 rounded-2xl p-5 border border-red-200/50">
                <p className="text-sm text-red-700">
                  <strong>Grace Period:</strong> Upon detection of a breach, the
                  Company shall notify the Partner in writing. The Partner has{" "}
                  <strong>48 hours</strong> to remedy the breach (by editing the
                  offending post to include the referral links). Failure to
                  remedy within this period will trigger revenue forfeiture for
                  the applicable period.
                </p>
              </div>
            </div>
          </ContractSection>

          {/* Section 6: Commencement */}
          <ContractSection
            icon={<CalendarClock size={24} />}
            number="6"
            title="Commencement & Duration"
          >
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
                  Agreement Commencement Date
                </p>
                <p className="font-serif text-4xl font-bold text-foreground">
                  {commencementDate}
                </p>
              </div>
              <ul className="space-y-3 mt-6">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    This Agreement shall commence on{" "}
                    <strong className="text-foreground">
                      {commencementDate}
                    </strong>{" "}
                    and shall continue for an initial term of{" "}
                    <strong className="text-foreground">12 months</strong>,
                    automatically renewing for successive 6-month periods unless
                    terminated by either party with 30 days&apos; written notice.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    All posts published on or after the commencement date must
                    include the referral links as specified in Section 2.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    Either party may terminate this Agreement with{" "}
                    <strong className="text-foreground">
                      30 calendar days&apos; written notice
                    </strong>
                    . Upon termination, accrued but unpaid commissions shall be
                    settled within 30 days of the termination effective date.
                  </p>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* Section 7: Payout Terms */}
          <ContractSection
            icon={<ShieldCheck size={24} />}
            number="7"
            title="Payout & Revenue Terms"
          >
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Revenue compensation follows the tiers defined in the True North
                Partnership Proposal:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-4 mb-4">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-bold text-foreground">
                        Tier
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">
                        Net Rev (70%)
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">
                        Grace&apos;s Share
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Compass</td>
                      <td className="py-3 px-4">KES 900/mo</td>
                      <td className="py-3 px-4">KES 630</td>
                      <td className="py-3 px-4 text-primary font-bold">
                        KES 63/mo (10%)
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">True North</td>
                      <td className="py-3 px-4">KES 2,000/mo</td>
                      <td className="py-3 px-4">KES 1,400</td>
                      <td className="py-3 px-4 text-primary font-bold">
                        KES 140/mo (10%)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Zenith</td>
                      <td className="py-3 px-4">KES 4,500/mo</td>
                      <td className="py-3 px-4">—</td>
                      <td className="py-3 px-4 text-primary font-bold">
                        KES 4,000 flat per session
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">Payout Schedule:</strong>{" "}
                    Commissions are tabulated quarterly and paid on a Net-30
                    basis.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Attribution Requirement:
                    </strong>{" "}
                    Only installs and subscriptions originating from the
                    Partner&apos;s unique referral links shall qualify for
                    commission purposes.
                  </p>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* Section 8: General Provisions */}
          <ContractSection
            icon={<FileText size={24} />}
            number="8"
            title="General Provisions"
          >
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Confidentiality:
                    </strong>{" "}
                    Both parties agree to keep the financial terms of this
                    Agreement confidential, except as required by law.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Intellectual Property:
                    </strong>{" "}
                    The Partner grants True North a non-exclusive license to use
                    her name, likeness, and channel content excerpts for
                    marketing purposes in connection with the partnership.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Non-Disparagement:
                    </strong>{" "}
                    Neither party shall make derogatory or disparaging statements
                    about the other, whether during or after the term of this
                    Agreement.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Governing Law:
                    </strong>{" "}
                    This Agreement shall be governed by and construed in
                    accordance with the laws of the Republic of Kenya.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Dispute Resolution:
                    </strong>{" "}
                    Any disputes arising from this Agreement shall be resolved
                    through mediation before pursuing litigation.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-0.5">✦</span>
                  <p>
                    <strong className="text-foreground">
                      Entire Agreement:
                    </strong>{" "}
                    This document, together with the True North Partnership
                    Proposal, constitutes the entire agreement between the
                    parties and supersedes all prior negotiations and
                    representations.
                  </p>
                </li>
              </ul>
            </div>
          </ContractSection>

          {/* ─── SIGNATURE SECTION ─── */}
          <motion.section
            variants={itemVariants}
            className="bg-gradient-to-br from-card to-secondary/30 backdrop-blur-xl border-2 border-primary/30 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-[60px]" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                <PenLine size={24} />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                  Digital Signature
                </h2>
                <p className="text-muted-foreground text-sm">
                  Sign below to accept the terms of this Agreement
                </p>
              </div>
            </div>

            {isSent ? (
              <div className="text-center py-10">
                <CheckCircle2
                  size={48}
                  className="text-green-600 mx-auto mb-4"
                />
                <p className="font-serif text-2xl font-bold mb-2">
                  Contract Signed
                </p>
                <p className="text-muted-foreground">
                  A copy has been sent to {email}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Grace Kinuthia"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="grace@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    National ID / Passport Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter your ID number"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Signature Pad */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
                    Your Signature
                  </label>
                  <SignaturePad
                    onSave={(data) => setSignatureData(data)}
                    onClear={() => setSignatureData(null)}
                  />
                  {signatureData && (
                    <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Signature captured
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-border accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    I, <strong className="text-foreground">{fullName || "____"}</strong>,
                    have read, understood, and agree to all the terms and
                    conditions outlined in this Influencer Partnership Contract,
                    including the referral link obligation, breach & forfeiture clause,
                    and revenue-sharing terms. I understand that this constitutes
                    a legally binding agreement commencing on{" "}
                    <strong className="text-foreground">
                      {commencementDate}
                    </strong>
                    .
                  </span>
                </label>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    !signatureData ||
                    !agreedToTerms ||
                    !fullName ||
                    !email ||
                    isSending
                  }
                 className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing & Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Sign Contract & Send Copy via Email
                    </>
                  )}
                </button>

                {submitError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  <Mail size={12} className="inline mr-1" />
                  Upon signing, a PDF copy of this agreement will be emailed to
                  both parties for their records.
                </p>
              </div>
            )}
          </motion.section>
        </div>

        {/* Legal Endorsement Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-10 border-t-2 border-border/30 pt-8 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/50 mb-4">
            Prepared & Reviewed By
          </p>
          <p className="font-serif text-xl font-bold text-foreground tracking-wide">
            K&apos;ANJEJO &amp; COMPANY ADVOCATES
          </p>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Junction of General Mathenge Drive, Ring Road Parklands
            <br />
            Opposite Kwacha House — Nairobi, Kenya
          </p>
          <div className="flex items-center justify-center gap-6 mt-3 text-sm text-muted-foreground">
            <a href="mailto:walter@kadvocates.co.ke" className="hover:text-primary transition-colors">
              walter@kadvocates.co.ke
            </a>
          </div>
        </motion.div>

        <div className="pb-16" />
      </motion.div>
    </main>
  );
}
