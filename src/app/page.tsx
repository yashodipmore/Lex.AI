"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ShieldCheck,
  FileSearch,
  MessageSquareText,
  Gavel,
  GitCompareArrows,
  BookmarkCheck,
  ArrowRight,
  Command,
  BarChart3,
  Download,
  FileText,
  Upload,
  Search,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

/* ── Scroll-reveal wrapper ──────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature data ───────────────────────────────── */
const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Illegal Clause Detection",
    desc: "Every clause checked against 15+ Indian laws — IPC, Contract Act, Rent Control, RERA & more. Exact section citations included.",
  },
  {
    icon: FileSearch,
    title: "Counter-Clauses",
    desc: "For every risky clause, get production-ready alternative wording you can copy and send directly to the other party.",
  },
  {
    icon: MessageSquareText,
    title: "Negotiation Roleplay",
    desc: "Practice tough conversations with AI playing your landlord, employer, or vendor. Get scored on technique.",
  },
  {
    icon: Gavel,
    title: "Legal Notice Generator",
    desc: "Generate professional legal notices under Section 80 CPC with proper formatting. Download as DOCX.",
  },
  {
    icon: GitCompareArrows,
    title: "Contract Comparison",
    desc: "Upload old vs new version of any contract. See every change highlighted with risk implications.",
  },
  {
    icon: BookmarkCheck,
    title: "Clause Library",
    desc: "Save important clauses to your personal library. Search, filter, and reference them anytime.",
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-[#e4e4e4] border-t-[#0a0a0a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — NAVBAR
      ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e4e4e4]">
        <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-dm-serif)] text-[22px] text-black tracking-tight">
            LexAI
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["How it works", "Features", "Pricing"].map((t) => (
              <a
                key={t}
                href={`#${t.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[14px] text-[#525252] hover:text-[#0a0a0a] transition-colors duration-200"
              >
                {t}
              </a>
            ))}
          </nav>

          <Link
            href="/auth"
            className="px-[20px] py-[8px] bg-black text-white text-[14px] font-medium rounded-[6px] hover:bg-[#1a1a1a] transition-colors duration-200"
          >
            Start Free
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — HERO
      ═══════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-0">
          {/* ── Top content area ── */}
          <div
            className="rounded-[32px] overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, #c0c0c0 0%, #b0b0b0 40%, #a3a3a3 100%)",
            }}
          >
            {/* Grid texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.25]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 39px, #999 39px, #999 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #999 39px, #999 40px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative px-8 sm:px-12 lg:px-16 pt-14 lg:pt-16 pb-0">
              {/* ── Two-column layout ── */}
              <div className="grid lg:grid-cols-[50fr_50fr] gap-8 lg:gap-12 items-start">

                {/* LEFT — Text content */}
                <div className="pb-12 lg:pb-16">
                  {/* Pill badge */}
                  <Reveal>
                    <div className="inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full bg-white/80 backdrop-blur-sm border border-[#bfdbfe]">
                      <span className="relative flex h-[6px] w-[6px]">
                        <span className="absolute inset-0 rounded-full bg-[#2563eb] animate-[pulse-dot_2s_ease-in-out_infinite]" />
                        <span className="relative rounded-full h-[6px] w-[6px] bg-[#2563eb]" />
                      </span>
                      <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#2563eb] tracking-wide">
                        Powered by Indian Law · 15+ Acts
                      </span>
                    </div>
                  </Reveal>

                  {/* Headline */}
                  <Reveal delay={0.08}>
                    <h1 className="font-[family-name:var(--font-dm-serif)] text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.08] text-[#0a0a0a] tracking-tight mt-[24px]">
                      Know what
                      <br className="hidden sm:block" />
                      {" "}you&apos;re signing —{" "}
                      <em className="font-[family-name:var(--font-dm-serif)] not-italic" style={{ fontStyle: "italic" }}>
                        before
                      </em>
                      {" "}it&apos;s too late.
                    </h1>
                  </Reveal>

                  {/* Body */}
                  <Reveal delay={0.16}>
                    <p className="text-[16px] text-[#3a3a3a] leading-[1.65] max-w-[400px] mt-[20px]">
                      Upload any rental agreement, job offer, or NDA. LexAI checks every
                      clause against 15+ Indian laws and tells you exactly what to fix — in
                      under 5 seconds.
                    </p>
                  </Reveal>

                  {/* CTAs */}
                  <Reveal delay={0.24}>
                    <div className="flex flex-col sm:flex-row items-start gap-3 mt-[28px]">
                      <Link
                        href="/auth"
                        className="inline-flex items-center gap-2 px-[24px] py-[12px] bg-[#0a0a0a] text-white text-[14px] font-medium rounded-[10px] hover:bg-[#1a1a1a] transition-colors duration-200"
                      >
                        Analyze a Contract
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="#how-it-works"
                        className="inline-flex items-center gap-2 px-[24px] py-[12px] bg-white/90 backdrop-blur-sm text-[#0a0a0a] text-[14px] font-medium rounded-[10px] border border-[#c0c0c0] hover:border-[#888] transition-colors duration-200"
                      >
                        See a sample report
                      </a>
                    </div>
                  </Reveal>

                  <Reveal delay={0.3}>
                    <p className="text-[12px] text-[#555] mt-[18px] tracking-wide">
                      No signup · Works on any PDF · Free forever
                    </p>
                  </Reveal>
                </div>

                {/* RIGHT — Hero Image */}
                <Reveal delay={0.2} className="relative self-end">
                  <div className="relative">
                    {/* Subtle glow behind image */}
                    <div
                      className="absolute -inset-4 rounded-[24px] opacity-30 blur-2xl"
                      style={{ background: "radial-gradient(ellipse at center, #2563eb 0%, transparent 70%)" }}
                    />
                    <div
                      className="relative rounded-t-[20px] overflow-hidden"
                      style={{
                        boxShadow: "0 -8px 40px rgba(0,0,0,0.15), 0 -2px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Image
                        src="/home.png"
                        alt="LexAI — AI-powered contract analysis showing risk detection and legal clause review"
                        width={600}
                        height={500}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — STATS BAR (Editorial)
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#fafafa] border-y border-[#e4e4e4]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { value: "15+", label: "INDIAN LAWS", blue: false },
              { value: "< 5s", label: "ANALYSIS TIME", blue: false },
              { value: "8", label: "AI FEATURES", blue: false },
              { value: "Free", label: "ALWAYS", blue: true },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div
                  className={`text-center py-[60px] px-4 ${
                    i < 3 ? "border-r border-[#e4e4e4]" : ""
                  }`}
                >
                  <p
                    className={`font-[family-name:var(--font-dm-serif)] text-[40px] sm:text-[52px] leading-none ${
                      s.blue ? "text-[#2563eb]" : "text-[#0a0a0a]"
                    }`}
                  >
                    {s.value}
                  </p>
                  <div className="w-[40px] h-px bg-[#e4e4e4] mx-auto mt-4 mb-3" />
                  <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#6b6b6b] uppercase tracking-[0.12em]">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — FEATURES (Square Card Grid)
      ═══════════════════════════════════════════════ */}
      <section id="features" className="scroll-mt-[60px]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-24 sm:py-32">
          <Reveal>
            <div className="flex items-end justify-between mb-14">
              <h2 className="font-[family-name:var(--font-dm-serif)] text-[36px] sm:text-[48px] text-[#0a0a0a] tracking-tight leading-[1.12] max-w-lg">
                Everything you need before you sign.
              </h2>
              <span className="hidden sm:inline font-[family-name:var(--font-dm-mono)] text-[12px] text-[#a0a0a0] shrink-0 ml-8">
                06 Features
              </span>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e4e4e4] border border-[#e4e4e4]">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="feature-card bg-white p-[28px] flex flex-col aspect-square relative">
                  <div className="flex items-start justify-between">
                    <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#d1d1d1]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <f.icon className="w-[20px] h-[20px] text-[#2563eb]" strokeWidth={1.5} />
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-[17px] font-semibold text-[#0a0a0a] mb-2">{f.title}</h3>
                    <p className="text-[14px] text-[#737373] leading-[1.6]">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (MacBook Mockup)
      ═══════════════════════════════════════════════ */}
      <section id="how-it-works" className="scroll-mt-[60px] bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] pt-24 sm:pt-32 pb-20">
          <Reveal>
            <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#2563eb] uppercase tracking-[0.15em] mb-4">
              HOW IT WORKS
            </p>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-[40px] sm:text-[52px] text-white tracking-tight leading-[1.1]">
              Three steps. Under a minute.
            </h2>
          </Reveal>

          {/* MacBook Pro Mockup */}
          <Reveal delay={0.15}>
            <div className="mt-16 sm:mt-20 mx-auto" style={{ maxWidth: "75%" }}>
              {/* Screen bezel */}
              <div className="rounded-t-[12px] bg-[#2a2a2a] p-[6px] pb-0">
                {/* Camera notch */}
                <div className="flex justify-center mb-[4px]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a1a] border border-[#3a3a3a]" />
                </div>
                {/* Screen content */}
                <div className="rounded-t-[4px] bg-[#1e1e1e] overflow-hidden">
                  {/* App menu bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-[#2a2a2a]">
                    <span className="font-[family-name:var(--font-dm-serif)] text-[12px] text-white">LexAI</span>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#3a3a3a]" />
                      <div className="w-2 h-2 rounded-full bg-[#3a3a3a]" />
                      <div className="w-2 h-2 rounded-full bg-[#3a3a3a]" />
                    </div>
                  </div>
                  {/* App body */}
                  <div className="flex min-h-[280px] sm:min-h-[340px]">
                    {/* Sidebar */}
                    <div className="hidden sm:flex flex-col w-[160px] bg-[#161616] border-r border-[#2a2a2a] px-3 py-3 gap-1 shrink-0">
                      {["Dashboard", "Analyze", "History", "Library", "Settings"].map((item, idx) => (
                        <div
                          key={item}
                          className={`px-3 py-[6px] rounded-[4px] text-[11px] ${
                            idx === 1
                              ? "bg-[#2563eb]/10 text-[#2563eb] font-medium"
                              : "text-[#6b6b6b] hover:text-[#a0a0a0]"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    {/* Main panel */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#a0a0a0] font-[family-name:var(--font-dm-mono)]">
                          Rental_Agreement.pdf
                        </span>
                        <span className="px-2 py-[2px] rounded text-[9px] font-bold bg-[#dc2626]/10 text-[#dc2626]">
                          DO NOT SIGN
                        </span>
                      </div>
                      {/* Clause cards */}
                      {[
                        { s: "HIGH", t: "Termination Clause", c: "#dc2626" },
                        { s: "HIGH", t: "Security Deposit", c: "#dc2626" },
                        { s: "MED", t: "Maintenance", c: "#d97706" },
                      ].map((cl) => (
                        <div key={cl.t} className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#1a1a1a] border border-[#2a2a2a]">
                          <span className="text-[9px] font-bold px-[5px] py-[1px] rounded" style={{ color: cl.c, backgroundColor: `${cl.c}15` }}>
                            {cl.s}
                          </span>
                          <span className="text-[10px] text-[#d1d1d1]">{cl.t}</span>
                        </div>
                      ))}
                      <div className="mt-2">
                        <span className="inline-flex px-3 py-[5px] rounded-[4px] bg-[#2563eb] text-white text-[10px] font-medium">
                          Generate Counter-Clause
                        </span>
                      </div>
                    </div>
                    {/* Chat panel */}
                    <div className="hidden md:flex flex-col w-[200px] bg-[#161616] border-l border-[#2a2a2a] p-3 gap-2">
                      <span className="text-[10px] text-[#6b6b6b] font-[family-name:var(--font-dm-mono)] uppercase tracking-wider">AI Chat</span>
                      <div className="flex justify-end">
                        <div className="px-3 py-[6px] rounded-[8px] bg-[#2a2a2a] text-[10px] text-[#a0a0a0] max-w-[140px]">
                          Is the deposit clause legal?
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="px-3 py-[6px] rounded-[8px] bg-[#2563eb]/10 text-[10px] text-[#93b4f5] max-w-[160px]">
                          <span className="text-[8px] text-[#2563eb] font-bold block mb-1">LexAI</span>
                          Under Model Tenancy Act §8, deposit exceeding 2 months rent is not permissible.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hinge */}
              <div className="h-[12px] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] rounded-b-[2px] mx-[4%]" />
              {/* Keyboard deck */}
              <div className="h-[8px] bg-[#2a2a2a] rounded-b-[8px] mx-[2%]" />
            </div>
          </Reveal>

          {/* Step pills */}
          <Reveal delay={0.3}>
            <div className="flex items-center justify-center gap-0 mt-14">
              {[
                { n: "01", label: "Upload", active: false },
                { n: "02", label: "AI Analyzes", active: true },
                { n: "03", label: "Get Verdict", active: false },
              ].map((step, i) => (
                <div key={step.n} className="flex items-center">
                  {i > 0 && (
                    <div className="w-8 sm:w-16 border-t border-dashed border-[#2a2a2a]" />
                  )}
                  <div
                    className={`flex items-center gap-2 px-4 py-[8px] rounded-full text-[13px] font-medium ${
                      step.active
                        ? "bg-[#1a1a1a] border border-[#2563eb] text-[#eff6ff]"
                        : "bg-[#1a1a1a] border border-[#2a2a2a] text-white"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#6b6b6b]">{step.n}</span>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 — BUILT-IN EXTRAS (Bento)
      ═══════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-24 sm:py-32">
          <Reveal>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-[36px] sm:text-[44px] text-[#0a0a0a] tracking-tight leading-[1.15] mb-14">
              More than just analysis.
            </h2>
          </Reveal>

          {/* Bento grid — 12-col */}
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[200px]">

            {/* Quick Ask — 8 cols, 2 rows */}
            <Reveal className="col-span-4 lg:col-span-8 lg:row-span-2">
              <div className="h-full rounded-[16px] bg-[#f7f7f7] border border-[#e4e4e4] p-7 flex flex-col">
                <h3 className="text-[18px] font-bold text-[#0a0a0a] mb-1">Quick Ask</h3>
                <p className="text-[14px] text-[#737373] mb-5">Press ⌘K for instant legal answers from anywhere.</p>
                {/* Fake command palette */}
                <div className="rounded-[10px] bg-white border border-[#e4e4e4] overflow-hidden flex-1 flex flex-col">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f0f0]">
                    <Search className="w-4 h-4 text-[#a0a0a0]" />
                    <span className="text-[14px] text-[#a0a0a0]">Ask anything about your contract...</span>
                    <span className="ml-auto font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] bg-[#f0f0f0] px-2 py-[2px] rounded">⌘K</span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-2">
                    {["Is this clause legal?", "What does §14 mean?", "Generate counter-clause"].map((q) => (
                      <span key={q} className="inline-flex px-3 py-[6px] rounded-full bg-[#f7f7f7] border border-[#e4e4e4] text-[12px] text-[#525252] hover:border-[#2563eb] hover:text-[#2563eb] transition-colors cursor-pointer">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Legal Insights — 4 cols */}
            <Reveal delay={0.05} className="col-span-4">
              <div className="h-full rounded-[16px] bg-[#f0f4ff] border border-[#bfdbfe] p-6 flex flex-col">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-1">Legal Insights Dashboard</h3>
                <p className="text-[12px] text-[#737373] mb-auto">Risk trends across contracts</p>
                {/* Mini bar chart */}
                <div className="flex items-end gap-[6px] h-[60px] mt-3">
                  {[40, 65, 50, 80, 55].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[3px] transition-all"
                      style={{
                        height: `${h}%`,
                        backgroundColor: i === 3 ? "#2563eb" : i === 4 ? "#60a5fa" : "#93c5fd",
                      }}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* DOCX Download — 4 cols */}
            <Reveal delay={0.08} className="col-span-4">
              <div className="h-full rounded-[16px] bg-white border border-[#e4e4e4] p-6 flex flex-col">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-1">Legal Notice Generator</h3>
                <p className="text-[12px] text-[#737373] mb-auto">Download as formatted DOCX</p>
                <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-[#f7f7f7] border border-[#e4e4e4]">
                  <div className="w-8 h-8 rounded-[4px] bg-[#2563eb]/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#2563eb]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#0a0a0a] truncate">Legal_Notice_Section80.docx</p>
                    <p className="text-[10px] text-[#a0a0a0]">24 KB</p>
                  </div>
                  <span className="text-[11px] text-[#2563eb] font-medium shrink-0">Download</span>
                </div>
              </div>
            </Reveal>

            {/* AI Legal Chat — 4 cols */}
            <Reveal delay={0.1} className="col-span-4">
              <div className="h-full rounded-[16px] bg-[#fafafa] border border-[#e4e4e4] p-6 flex flex-col">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-3">AI Legal Chat</h3>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex justify-end">
                    <div className="px-3 py-2 rounded-[10px] bg-[#e4e4e4] text-[12px] text-[#0a0a0a] max-w-[75%]">
                      Can I break this lease early?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-[10px] bg-[#eff6ff] text-[12px] text-[#374151] max-w-[85%]">
                      <span className="text-[9px] text-[#2563eb] font-bold block mb-0.5">LexAI</span>
                      Under §108 TPA, you may terminate with notice as specified...
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Contract Compare — 4 cols */}
            <Reveal delay={0.12} className="col-span-4">
              <div className="h-full rounded-[16px] bg-white border border-[#e4e4e4] p-6 flex flex-col">
                <h3 className="text-[15px] font-semibold text-[#0a0a0a] mb-3">Contract Comparison</h3>
                <div className="grid grid-cols-2 gap-3 mt-auto text-[11px]">
                  <div>
                    <p className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#a0a0a0] mb-2">OLD VERSION</p>
                    <p className="text-[#737373] leading-[1.5]">
                      Deposit: <span className="line-through text-[#dc2626]">6 months rent</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[#a0a0a0] mb-2">NEW VERSION</p>
                    <p className="text-[#737373] leading-[1.5]">
                      Deposit: <span className="underline decoration-[#16a34a] text-[#16a34a]">2 months rent</span>
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — CTA (Split Layout)
      ═══════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#e4e4e4]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            {/* Left — manifesto */}
            <div className="flex flex-col justify-center px-6 sm:px-[80px] py-16 lg:border-r border-[#e4e4e4]">
              <Reveal>
                <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] uppercase tracking-[0.12em] mb-6">
                  Start free · No credit card
                </p>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-[44px] sm:text-[56px] text-[#0a0a0a] tracking-tight leading-[1.08]">
                  Stop signing
                  <br />
                  blindly.
                </h2>
                <p className="text-[16px] text-[#6b6b6b] mt-5 leading-[1.65] max-w-[360px]">
                  Every contract you sign is a legal commitment. Know exactly
                  what you&apos;re agreeing to — before it matters.
                </p>
                <Link
                  href="/auth"
                  className="mt-10 flex items-center justify-center gap-2 w-full py-[18px] bg-black text-white text-[18px] font-medium hover:bg-[#1a1a1a] transition-colors duration-200"
                >
                  Analyze Your Contract
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Reveal>
            </div>

            {/* Right — upload zone */}
            <div className="bg-[#f7f7f7] flex items-center justify-center px-6 sm:px-12 py-16">
              <Reveal delay={0.1}>
                <div
                  className="w-full max-w-[380px] rounded-[12px] border-2 border-dashed border-[#d1d1d1] flex flex-col items-center justify-center py-14 px-8"
                >
                  <ArrowUp className="w-8 h-8 text-[#a0a0a0] mb-4" />
                  <p className="text-[16px] text-[#737373] font-medium">Drop your contract here</p>
                  <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] mt-2">PDF · DOCX · TXT</p>
                  <div className="flex items-center gap-3 w-full mt-6">
                    <div className="flex-1 h-px bg-[#d1d1d1]" />
                    <span className="text-[12px] text-[#a0a0a0]">or</span>
                    <div className="flex-1 h-px bg-[#d1d1d1]" />
                  </div>
                  <button className="mt-5 px-6 py-[10px] bg-white border border-[#e4e4e4] rounded-[6px] text-[14px] text-[#0a0a0a] font-medium hover:border-[#a0a0a0] transition-colors duration-200">
                    Browse files
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER (Newspaper-style 4-column)
      ═══════════════════════════════════════════════ */}
      <footer className="border-t border-[#e4e4e4] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1 — Brand */}
            <div>
              <span className="font-[family-name:var(--font-dm-serif)] text-[20px] text-[#0a0a0a]">LexAI</span>
              <p className="text-[13px] text-[#a0a0a0] mt-2">Indian law, understood.</p>
              <p className="text-[13px] text-[#a0a0a0] mt-4">© 2026 LexAI</p>
            </div>
            {/* Col 2 — Product */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] uppercase tracking-[0.12em] mb-4">Product</p>
              <div className="flex flex-col gap-2">
                {["Analyze", "History", "Clause Library", "Quick Ask"].map((l) => (
                  <span key={l} className="text-[14px] text-[#3a3a3a] hover:text-[#0a0a0a] transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
            {/* Col 3 — Legal */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] uppercase tracking-[0.12em] mb-4">Legal</p>
              <div className="flex flex-col gap-2">
                {["Disclaimer", "Privacy Policy", "Terms"].map((l) => (
                  <span key={l} className="text-[14px] text-[#3a3a3a] hover:text-[#0a0a0a] transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
            {/* Col 4 — Built for India */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#a0a0a0] uppercase tracking-[0.12em] mb-4">Built for India</p>
              <p className="text-[13px] text-[#6b6b6b] leading-[1.5] mb-3">Covering all major Indian contract and property laws.</p>
              <div className="flex flex-wrap gap-[6px]">
                {["IPC", "Contract Act", "RERA", "Consumer Protection"].map((tag) => (
                  <span key={tag} className="inline-flex px-2 py-[2px] bg-[#f0f0f0] border border-[#d1d1d1] rounded-[3px] font-[family-name:var(--font-dm-mono)] text-[10px] text-[#6b6b6b]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom disclaimer */}
        <div className="border-t border-[#e4e4e4]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-5">
            <p className="text-[12px] text-[#a0a0a0] leading-[1.6]">
              <span className="font-medium">Disclaimer:</span> LexAI provides legal information, not legal advice.
              Similar to how WebMD provides health information but is not a substitute for a doctor,
              LexAI helps you understand your contracts but is not a substitute for professional legal counsel.
              Always verify law citations independently and consult a qualified advocate for complex matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
