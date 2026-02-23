"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Scale, ArrowRight, Shield, FileText, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            <span className="font-semibold tracking-tight">LexAI</span>
          </div>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <p className="text-sm text-gray-400 mb-4 tracking-wide uppercase">AI Legal Agent</p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Understand every contract
            <br />
            <span className="text-gray-400">before you sign.</span>
          </h1>
          <p className="text-lg text-gray-500 mt-6 leading-relaxed max-w-lg">
            Upload any agreement. Get instant analysis, illegal clause detection with Indian law citations, 
            counter-clauses you can copy and send, and negotiation training.
          </p>
          <div className="flex gap-3 mt-8">
            <Link
              href="/auth"
              className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Analyzing — Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-sm text-gray-400 mb-8 tracking-wide uppercase">What LexAI does</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Illegal Clause Detection",
                desc: "Catches clauses that violate Indian law — with exact section citations.",
              },
              {
                icon: FileText,
                title: "Counter-Clauses",
                desc: "For every risky clause, get alternative wording you can copy and send.",
              },
              {
                icon: MessageSquare,
                title: "Negotiation Roleplay",
                desc: "Practice negotiating with AI playing your landlord, employer, or client.",
              },
              {
                icon: Zap,
                title: "Sign or Don't Sign",
                desc: "A clear verdict — not a score. Tells you exactly what must change.",
              },
            ].map((f) => (
              <div key={f.title}>
                <f.icon className="w-5 h-5 text-gray-400 mb-3" />
                <h3 className="font-medium text-sm mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">7+</p>
              <p className="text-sm text-gray-400 mt-1">Indian Laws Checked</p>
            </div>
            <div>
              <p className="text-3xl font-bold">&lt;5s</p>
              <p className="text-sm text-gray-400 mt-1">Analysis Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold">Free</p>
              <p className="text-sm text-gray-400 mt-1">For Everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer + Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <strong>Disclaimer:</strong> LexAI provides legal information, not legal advice. 
            Similar to how WebMD provides health information but is not a substitute for a doctor, 
            LexAI helps you understand your contracts but is not a substitute for professional legal counsel.
            Law citations are provided for your independent verification.
          </p>
          <p className="text-xs text-gray-300 mt-4">© 2026 LexAI. Built for everyone who signs contracts.</p>
        </div>
      </footer>
    </div>
  );
}
