"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UploadZone from "@/components/UploadZone";
import VerdictBanner from "@/components/VerdictBanner";
import SummaryCard from "@/components/SummaryCard";
import ClauseCard from "@/components/ClauseCard";
import DangerTimeline from "@/components/DangerTimeline";
import LanguageToggle from "@/components/LanguageToggle";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface ClauseData {
  clauseNumber: number;
  clauseType: string;
  originalText: string;
  riskLevel: string;
  isIllegal: boolean;
  illegalLaw: string;
  riskReason: string;
  explanationEn: string;
  explanationHi: string;
  counterClause: string;
  actionAdvice: string;
  benchmarkLabel: string;
  benchmarkNote: string;
  isBlocking: boolean;
  timelineMonth: number;
  timelineEvent: string;
  startChar: number;
  endChar: number;
  // snake_case variants from AI response
  [key: string]: string | number | boolean | undefined;
}

interface AnalysisResult {
  document: {
    doc_type: string;
    overall_risk: string;
    risk_score: number;
    illegal_count: number;
    sign_verdict: string;
    blocking_clauses: number[];
    sign_verdict_reason: string;
    parties: string[];
    key_dates: string[];
    monthly_obligations: string[];
    summary_en: string;
    summary_hi: string;
    clause_count: number;
    high_risk_count: number;
  };
  clauses: ClauseData[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");
  const [docType, setDocType] = useState("other");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const handleAnalyze = useCallback(
    async (rawText: string, fileName: string) => {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      try {
        const res = await fetch("/api/analyze-clauses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText, docType, language, fileName }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Analysis failed");
        }

        const data = await res.json();
        setAnalysis(data.analysis);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setAnalyzing(false);
      }
    },
    [docType, language]
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      try {
        // Step 1: Parse document
        const formData = new FormData();
        formData.append("file", file);

        const parseRes = await fetch("/api/parse-document", {
          method: "POST",
          body: formData,
        });

        if (!parseRes.ok) {
          const data = await parseRes.json();
          throw new Error(data.error || "Failed to parse document");
        }

        const { rawText } = await parseRes.json();

        // Step 2: Analyze
        await handleAnalyze(rawText, file.name);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setAnalyzing(false);
      }
    },
    [handleAnalyze]
  );

  const handleTextSubmit = useCallback(
    (text: string) => {
      handleAnalyze(text, "Pasted Text");
    },
    [handleAnalyze]
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Analyze Document</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Upload a contract, agreement, or legal document
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
          >
            <option value="other">Auto-detect</option>
            <option value="rental">Rental Agreement</option>
            <option value="employment">Employment Contract</option>
            <option value="nda">NDA</option>
            <option value="freelance">Freelance Contract</option>
            <option value="loan">Loan Agreement</option>
            <option value="tos">Terms of Service</option>
          </select>
          <LanguageToggle language={language} onChange={setLanguage} />
        </div>
      </div>

      {/* Upload Zone */}
      {!analysis && !analyzing && (
        <UploadZone
          onFileUpload={handleFileUpload}
          onTextSubmit={handleTextSubmit}
          loading={analyzing}
        />
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => { setError(""); setAnalysis(null); }}
            className="text-sm text-red-900 font-medium mt-2 hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {analyzing && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Analyzing your document with AI...</p>
          </div>
          <LoadingSkeleton />
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-6 mt-2">
          {/* New analysis button */}
          <button
            onClick={() => { setAnalysis(null); setError(""); }}
            className="text-sm text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            ← Upload another document
          </button>

          {/* Verdict */}
          <VerdictBanner
            verdict={analysis.document.sign_verdict}
            reason={analysis.document.sign_verdict_reason}
            blockingClauses={analysis.document.blocking_clauses}
            riskScore={analysis.document.risk_score}
            illegalCount={analysis.document.illegal_count}
          />

          {/* Summary */}
          <SummaryCard
            docType={analysis.document.doc_type}
            clauseCount={analysis.document.clause_count}
            highRiskCount={analysis.document.high_risk_count}
            illegalCount={analysis.document.illegal_count}
            parties={analysis.document.parties}
            keyDates={analysis.document.key_dates}
            monthlyObligations={analysis.document.monthly_obligations}
            summaryEn={analysis.document.summary_en}
            summaryHi={analysis.document.summary_hi}
            language={language}
          />

          {/* Language toggle for clauses */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">
              Clauses ({analysis.clauses.length})
            </h2>
            <LanguageToggle language={language} onChange={setLanguage} />
          </div>

          {/* Clause Cards - high risk & illegal first */}
          <div className="space-y-3">
            {[...analysis.clauses]
              .sort((a, b) => {
                const priority = (c: ClauseData) => {
                  const illegal = c.isIllegal || Boolean(c["is_illegal"]);
                  const risk = c.riskLevel || String(c["risk_level"] || "LOW");
                  return illegal ? 3 : risk === "HIGH" ? 2 : risk === "MEDIUM" ? 1 : 0;
                };
                return priority(b) - priority(a);
              })
              .map((clause, i) => (
                <ClauseCard
                  key={clause.clauseNumber || clause["clause_number"] || i}
                  clause={{
                    clauseNumber: clause.clauseNumber || Number(clause["clause_number"] || 0),
                    clauseType: clause.clauseType || String(clause["clause_type"] || "other"),
                    originalText: clause.originalText || String(clause["original_text"] || ""),
                    riskLevel: clause.riskLevel || String(clause["risk_level"] || "LOW"),
                    isIllegal: clause.isIllegal || Boolean(clause["is_illegal"]),
                    illegalLaw: clause.illegalLaw || String(clause["illegal_law"] || ""),
                    riskReason: clause.riskReason || String(clause["risk_reason"] || ""),
                    explanationEn: clause.explanationEn || String(clause["explanation_en"] || ""),
                    explanationHi: clause.explanationHi || String(clause["explanation_hi"] || ""),
                    counterClause: clause.counterClause || String(clause["counter_clause"] || ""),
                    actionAdvice: clause.actionAdvice || String(clause["action_advice"] || ""),
                    benchmarkLabel: clause.benchmarkLabel || String(clause["benchmark_label"] || ""),
                    benchmarkNote: clause.benchmarkNote || String(clause["benchmark_note"] || ""),
                    isBlocking: clause.isBlocking || Boolean(clause["is_blocking"]),
                  }}
                  language={language}
                />
              ))}
          </div>

          {/* Danger Timeline */}
          <DangerTimeline
            clauses={analysis.clauses.map((c) => ({
              clauseNumber: c.clauseNumber || Number(c["clause_number"] || 0),
              timelineMonth: c.timelineMonth || Number(c["timeline_month"] || 0),
              timelineEvent: c.timelineEvent || String(c["timeline_event"] || ""),
              riskLevel: c.riskLevel || String(c["risk_level"] || "LOW"),
              isIllegal: c.isIllegal || Boolean(c["is_illegal"]),
            }))}
          />
        </div>
      )}
    </div>
  );
}
