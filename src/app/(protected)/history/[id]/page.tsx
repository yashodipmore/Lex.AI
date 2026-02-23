"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import VerdictBanner from "@/components/VerdictBanner";
import SummaryCard from "@/components/SummaryCard";
import ClauseCard from "@/components/ClauseCard";
import DangerTimeline from "@/components/DangerTimeline";
import LanguageToggle from "@/components/LanguageToggle";

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
}

interface DocumentData {
  fileName: string;
  docType: string;
  overallRisk: string;
  riskScore: number;
  illegalCount: number;
  signVerdict: string;
  blockingClauses: number[];
  signVerdictReason: string;
  parties: string[];
  keyDates: string[];
  monthlyObligations: string[];
  summaryEn: string;
  summaryHi: string;
  clauseCount: number;
  highRiskCount: number;
  createdAt: string;
}

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [clauses, setClauses] = useState<ClauseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const fetchDocument = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDocument(data.document);
        setClauses(data.clauses);
      } else {
        router.push("/history");
      }
    } catch {
      router.push("/history");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (user && id) fetchDocument();
  }, [user, id, fetchDocument]);

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.push("/history")}
        className="text-sm text-gray-400 hover:text-black transition-colors mb-6 cursor-pointer"
      >
        ← Back to history
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{document.fileName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Analyzed {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
        <LanguageToggle language={language} onChange={setLanguage} />
      </div>

      <div className="space-y-6">
        <VerdictBanner
          verdict={document.signVerdict}
          reason={document.signVerdictReason}
          blockingClauses={document.blockingClauses}
          riskScore={document.riskScore}
          illegalCount={document.illegalCount}
        />

        <SummaryCard
          docType={document.docType}
          clauseCount={document.clauseCount}
          highRiskCount={document.highRiskCount}
          illegalCount={document.illegalCount}
          parties={document.parties}
          keyDates={document.keyDates}
          monthlyObligations={document.monthlyObligations}
          summaryEn={document.summaryEn}
          summaryHi={document.summaryHi}
          language={language}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Clauses ({clauses.length})</h2>
        </div>

        <div className="space-y-3">
          {clauses.map((clause) => (
            <ClauseCard key={clause.clauseNumber} clause={clause} language={language} docName={document?.fileName} docType={document?.docType} docId={id} />
          ))}
        </div>

        <DangerTimeline
          clauses={clauses.map((c) => ({
            clauseNumber: c.clauseNumber,
            timelineMonth: c.timelineMonth,
            timelineEvent: c.timelineEvent,
            riskLevel: c.riskLevel,
            isIllegal: c.isIllegal,
          }))}
        />
      </div>
    </div>
  );
}
