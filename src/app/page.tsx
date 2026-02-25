"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
  Star,
  Quote,
  Plus,
  Minus,
  Sparkles,
  Users,
  CheckCircle,
  Scale,
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

/* ── Testimonials data ──────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Startup Founder, Bengaluru",
    text: "My co-founder and I were about to sign a lease with a 6-month deposit clause. LexAI flagged it as illegal under the Model Tenancy Act in seconds. Saved us ₹3.6 lakhs.",
    rating: 5,
    initials: "PS",
    color: "from-violet-400 to-purple-500",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer, Pune",
    text: "I used LexAI before signing my job offer. It caught a non-compete clause that would have prevented me from freelancing. The counter-clause feature is absolutely brilliant.",
    rating: 5,
    initials: "RM",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Anjali Desai",
    role: "Law Student, Mumbai",
    text: "As a law student, I use LexAI to cross-reference my analysis. The section citations are accurate and the negotiation roleplay helped me prepare for moot court.",
    rating: 5,
    initials: "AD",
    color: "from-rose-400 to-pink-500",
  },
];

/* ── FAQ data ───────────────────────────────────── */
const FAQS = [
  {
    q: "Is LexAI a substitute for a lawyer?",
    a: "No. LexAI provides legal information and analysis, similar to how WebMD provides health information. For complex legal matters, always consult a qualified advocate. LexAI helps you understand your contracts better so you can have more informed conversations with your lawyer.",
  },
  {
    q: "Which Indian laws does LexAI cover?",
    a: "LexAI covers 15+ major Indian laws including the Indian Contract Act 1872, Transfer of Property Act 1882, RERA 2016, Consumer Protection Act 2019, IT Act 2000, Indian Penal Code, Model Tenancy Act, and more. We continuously update our coverage.",
  },
  {
    q: "Is my contract data safe and private?",
    a: "Absolutely. Your documents are encrypted, never shared with third parties, and automatically deleted after analysis. We do not use your contract data to train our AI models. Your legal documents remain completely confidential.",
  },
  {
    q: "What file formats are supported?",
    a: "LexAI supports PDF, DOCX, and TXT files. Simply upload your contract in any of these formats and get instant analysis. We're working on adding support for scanned documents with OCR.",
  },
  {
    q: "How accurate is the analysis?",
    a: "LexAI uses advanced AI models trained on Indian legal frameworks. While our accuracy rate is high, we always recommend cross-referencing critical findings with a legal professional. Every flagged clause includes the exact law section for easy verification.",
  },
  {
    q: "Is LexAI really free?",
    a: "Yes, LexAI is completely free to use. We believe everyone deserves access to legal understanding regardless of their ability to pay for expensive legal consultations. No credit card required, no hidden charges.",
  },
];

/* ── Law marquee data ───────────────────────────── */
const LAWS = [
  "Indian Contract Act, 1872",
  "Transfer of Property Act, 1882",
  "RERA, 2016",
  "Consumer Protection Act, 2019",
  "IT Act, 2000",
  "Indian Penal Code",
  "Model Tenancy Act, 2021",
  "Stamp Act, 1899",
  "Registration Act, 1908",
  "Specific Relief Act, 1963",
  "Arbitration Act, 1996",
  "Labour Laws",
  "Companies Act, 2013",
  "FEMA, 1999",
  "Sale of Goods Act, 1930",
];

/* ── FAQ Accordion Component ────────────────────── */
function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#e4e4e4] last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 sm:py-6 text-left cursor-pointer group"
      >
        <span className={`text-[15px] sm:text-[16px] font-medium pr-4 transition-colors ${isOpen ? "text-[#0a0a0a]" : "text-[#3a3a3a] group-hover:text-[#0a0a0a]"}`}>
          {q}
        </span>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "bg-[#0a0a0a] text-white rotate-0" : "bg-[#f0f0f0] text-[#737373]"}`}>
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      <div className={`faq-answer ${isOpen ? "open" : ""}`}>
        <div>
          <p className="text-[14px] sm:text-[15px] text-[#6b6b6b] leading-[1.7] pb-5 sm:pb-6 max-w-[640px]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-[#e4e4e4] border-t-[#0a0a0a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-[#0a0a0a]">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — NAVBAR (Glassmorphism)
      ═══════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}>
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logolex.png"
              alt="LexAI"
              width={90}
              height={90}
              className="rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
            />
          </Link>

          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-black/[0.04] rounded-full p-[3px]">
              {["Features", "How it works", "FAQ"].map((t) => (
                <a
                  key={t}
                  href={`#${t.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-[7px] rounded-full text-[13px] font-medium text-[#525252] hover:text-[#0a0a0a] hover:bg-white/70 transition-all duration-200"
                >
                  {t}
                </a>
              ))}
            </div>
          </nav>

          <Link
            href="/auth"
            className="px-[22px] py-[9px] bg-[#0a0a0a] text-white text-[13px] font-medium rounded-full hover:bg-[#1a1a1a] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Start Free →
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — HERO (Animated Gradient)
      ═══════════════════════════════════════════════ */}
      <section className="bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 pb-0">
          {/* ── Top content area ── */}
          <div
            className="rounded-[32px] overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #5ee7df 75%, #667eea 100%)",
              backgroundSize: "400% 400%",
              animation: "mesh-shift 12s ease-in-out infinite",
            }}
          >
            {/* Noise overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
            {/* Grid texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.12]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Floating badge — top right */}
            <div
              className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg shadow-black/[0.08] border border-white/50"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <div className="flex -space-x-2">
                {[
                  "from-violet-400 to-purple-500",
                  "from-blue-400 to-indigo-500",
                  "from-rose-400 to-pink-500",
                ].map((c, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} border-2 border-white flex items-center justify-center text-[8px] text-white font-bold`}>
                    {["P", "R", "A"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#0a0a0a]">3,200+</p>
                <p className="text-[9px] text-[#737373]">Contracts Analyzed</p>
              </div>
            </div>

            <div className="relative px-8 sm:px-12 lg:px-16 pt-14 lg:pt-16 pb-0">
              {/* ── Two-column layout ── */}
              <div className="grid lg:grid-cols-[50fr_50fr] gap-8 lg:gap-12 items-start">

                {/* LEFT — Text content */}
                <div className="pb-12 lg:pb-16">
                  {/* Pill badge */}
                  <Reveal>
                    <div className="inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full bg-background/80 backdrop-blur-sm border border-[#bfdbfe]">
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
                        className="inline-flex items-center gap-2 px-[24px] py-[12px] bg-background/90 backdrop-blur-sm text-[#0a0a0a] text-[14px] font-medium rounded-[10px] border border-[#c0c0c0] hover:border-[#888] transition-colors duration-200"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e4e4e4] border border-[#e4e4e4] rounded-[16px] overflow-hidden">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="feature-card bg-background p-[28px] flex flex-col aspect-square relative">
                  <div className="flex items-start justify-between">
                    <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#d1d1d1]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <f.icon className="feature-icon w-[20px] h-[20px] text-[#2563eb]" strokeWidth={1.5} />
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
      <section className="bg-background">
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
                <div className="rounded-[10px] bg-background border border-[#e4e4e4] overflow-hidden flex-1 flex flex-col">
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
              <div className="h-full rounded-[16px] bg-background border border-[#e4e4e4] p-6 flex flex-col">
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
              <div className="h-full rounded-[16px] bg-background border border-[#e4e4e4] p-6 flex flex-col">
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
          SECTION 7 — SOCIAL PROOF (Trust Strip)
      ═══════════════════════════════════════════════ */}
      <section className="border-y border-[#e4e4e4] bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-12 sm:py-16">
          <Reveal>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="flex -space-x-3">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} border-[3px] border-white flex items-center justify-center text-[11px] text-white font-bold shadow-sm`}>
                      {t.initials}
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full bg-gray-200 border-[3px] border-white flex items-center justify-center text-[10px] text-gray-500 font-medium shadow-sm">
                    +99
                  </div>
                </div>
              </div>
              <p className="text-[15px] text-[#3a3a3a]">
                <span className="font-semibold text-[#0a0a0a]">Trusted by thousands</span> of tenants, employees, and founders across India
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Users, value: "3,200+", label: "Contracts Analyzed" },
              { icon: ShieldCheck, value: "12,800+", label: "Clauses Checked" },
              { icon: CheckCircle, value: "98%", label: "Accuracy Rate" },
              { icon: Sparkles, value: "4.9/5", label: "User Rating" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#e4e4e4] flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <s.icon className="w-4.5 h-4.5 text-[#2563eb]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[28px] sm:text-[32px] font-bold text-[#0a0a0a] tracking-tight">{s.value}</p>
                  <p className="text-[12px] text-[#737373] mt-0.5">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="bg-background">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-24 sm:py-32">
          <Reveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#2563eb] uppercase tracking-[0.15em] mb-3">
                  TESTIMONIALS
                </p>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-[36px] sm:text-[44px] text-[#0a0a0a] tracking-tight leading-[1.15]">
                  Real people, real protection.
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <div className="relative bg-white rounded-2xl border border-[#e4e4e4] p-7 hover:border-[#c0c0c0] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-[#2563eb]/10 mb-4" strokeWidth={1.5} />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-[14px] text-[#3a3a3a] leading-[1.7] mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-5 border-t border-[#f0f0f0]">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[13px] font-bold shadow-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0a0a0a]">{t.name}</p>
                      <p className="text-[12px] text-[#737373]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 9 — LAW COVERAGE MARQUEE
      ═══════════════════════════════════════════════ */}
      <section className="border-y border-[#e4e4e4] bg-[#0a0a0a] py-8 overflow-hidden">
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

          <div className="flex animate-marquee whitespace-nowrap">
            {[...LAWS, ...LAWS].map((law, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mx-4 px-4 py-2 rounded-full border border-[#2a2a2a] text-[13px] text-[#a0a0a0] font-medium whitespace-nowrap hover:border-[#2563eb] hover:text-[#93b4f5] transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                {law}
              </span>
            ))}
          </div>
        </div>
        <Reveal>
          <p className="text-center text-[12px] text-[#525252] mt-5 font-[family-name:var(--font-dm-mono)]">
            Covering 15+ Indian laws and acts · Updated regularly
          </p>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 10 — FAQ ACCORDION
      ═══════════════════════════════════════════════ */}
      <section id="faq" className="scroll-mt-[60px] bg-background">
        <div className="max-w-[720px] mx-auto px-6 py-24 sm:py-32">
          <Reveal>
            <div className="text-center mb-12">
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#2563eb] uppercase tracking-[0.15em] mb-3">
                FAQ
              </p>
              <h2 className="font-[family-name:var(--font-dm-serif)] text-[36px] sm:text-[44px] text-[#0a0a0a] tracking-tight leading-[1.15]">
                Common questions
              </h2>
              <p className="text-[15px] text-[#737373] mt-3">
                Everything you need to know about LexAI
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-[#e4e4e4] rounded-xl">
              {FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 11 — CTA (Gradient Dark Section)
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111827] to-[#1e1b4b]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 25% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 75% 50%, #7c3aed 0%, transparent 50%)",
        }} />

        <div className="relative max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            {/* Left — manifesto */}
            <div className="flex flex-col justify-center px-6 sm:px-[80px] py-16">
              <Reveal>
                <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#60a5fa] uppercase tracking-[0.12em] mb-6">
                  Start free · No credit card
                </p>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-[44px] sm:text-[56px] text-white tracking-tight leading-[1.08]">
                  Stop signing
                  <br />
                  blindly.
                </h2>
                <p className="text-[16px] text-[#9ca3af] mt-5 leading-[1.65] max-w-[360px]">
                  Every contract you sign is a legal commitment. Know exactly
                  what you&apos;re agreeing to — before it matters.
                </p>
                <Link
                  href="/auth"
                  className="mt-10 flex items-center justify-center gap-2 w-full py-[18px] bg-white text-[#0a0a0a] text-[18px] font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-white/10"
                >
                  Analyze Your Contract
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Reveal>
            </div>

            {/* Right — upload zone */}
            <div className="flex items-center justify-center px-6 sm:px-12 py-16">
              <Reveal delay={0.1}>
                <div
                  className="w-full max-w-[380px] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center py-14 px-8 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <ArrowUp className="w-7 h-7 text-white/60" />
                  </div>
                  <p className="text-[16px] text-white/80 font-medium">Drop your contract here</p>
                  <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-white/40 mt-2">PDF · DOCX · TXT</p>
                  <div className="flex items-center gap-3 w-full mt-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[12px] text-white/30">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <button className="mt-5 px-6 py-[10px] bg-white/10 border border-white/20 rounded-lg text-[14px] text-white font-medium hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm">
                    Browse files
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER (Premium dark)
      ═══════════════════════════════════════════════ */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/logolex.png"
                  alt="LexAI"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <p className="text-[13px] text-[#6b7280] mt-2">Indian law, understood.</p>
              <p className="text-[13px] text-[#4b5563] mt-4">© 2026 LexAI</p>
            </div>
            {/* Col 2 — Product */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#6b7280] uppercase tracking-[0.12em] mb-4">Product</p>
              <div className="flex flex-col gap-2.5">
                {["Analyze", "History", "Clause Library", "Quick Ask"].map((l) => (
                  <span key={l} className="text-[14px] text-[#9ca3af] hover:text-white transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
            {/* Col 3 — Legal */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#6b7280] uppercase tracking-[0.12em] mb-4">Legal</p>
              <div className="flex flex-col gap-2.5">
                {["Disclaimer", "Privacy Policy", "Terms"].map((l) => (
                  <span key={l} className="text-[14px] text-[#9ca3af] hover:text-white transition-colors cursor-pointer">{l}</span>
                ))}
              </div>
            </div>
            {/* Col 4 — Built for India */}
            <div>
              <p className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#6b7280] uppercase tracking-[0.12em] mb-4">Built for India</p>
              <p className="text-[13px] text-[#6b7280] leading-[1.5] mb-3">Covering all major Indian contract and property laws.</p>
              <div className="flex flex-wrap gap-[6px]">
                {["IPC", "Contract Act", "RERA", "Consumer Protection"].map((tag) => (
                  <span key={tag} className="inline-flex px-2 py-[2px] bg-white/[0.05] border border-white/[0.08] rounded-[3px] font-[family-name:var(--font-dm-mono)] text-[10px] text-[#6b7280]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom disclaimer */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-[80px] py-5">
            <p className="text-[12px] text-[#4b5563] leading-[1.6]">
              <span className="font-medium text-[#6b7280]">Disclaimer:</span> LexAI provides legal information, not legal advice.
              Similar to how WebMD provides health information but is not a substitute for a doctor,
              LexAI helps you understand your contracts but is not a substitute for professional legal counsel.
              Always verify law citations independently and consult a qualified advocate for complex matters.
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════
          SCROLL TO TOP BUTTON
      ═══════════════════════════════════════════════ */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="scroll-top-btn fixed bottom-8 right-8 z-50 w-11 h-11 bg-[#0a0a0a] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 cursor-pointer border border-white/10"
        >
          <ArrowUp className="w-4.5 h-4.5" />
        </motion.button>
      )}
    </div>
  );
}
