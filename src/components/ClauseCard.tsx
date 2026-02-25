"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Volume2,
  Bookmark,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import RiskBadge from "./RiskBadge";

interface ClauseCardProps {
  clause: {
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
  };
  language: string;
  docName?: string;
  docType?: string;
  docId?: string;
}

export default function ClauseCard({ clause, language, docName, docType, docId }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(clause.riskLevel === "HIGH" || clause.isIllegal);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const explanation = language === "hi" ? clause.explanationHi : clause.explanationEn;

  const handleCopy = async () => {
    if (clause.counterClause) {
      await navigator.clipboard.writeText(clause.counterClause);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/saved-clauses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId,
          clauseType: clause.clauseType,
          originalText: clause.originalText,
          riskLevel: clause.riskLevel,
          isIllegal: clause.isIllegal,
          illegalLaw: clause.illegalLaw,
          explanation: language === "hi" ? clause.explanationHi : clause.explanationEn,
          counterClause: clause.counterClause,
          actionAdvice: clause.actionAdvice,
          docName: docName || "Unknown",
          docType: docType || "other",
        }),
      });
      if (res.ok) {
        setSaved(true);
        toast.success("Clause saved to library");
      } else {
        toast.error("Failed to save clause");
      }
    } catch {
      toast.error("Failed to save clause");
    } finally {
      setSaving(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const borderColor = clause.isIllegal
    ? "border-l-red-600"
    : clause.riskLevel === "HIGH"
    ? "border-l-red-400"
    : clause.riskLevel === "MEDIUM"
    ? "border-l-amber-400"
    : "border-l-green-400";

  return (
    <div className={`border border-gray-200 rounded-lg border-l-4 ${borderColor} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="text-xs text-gray-400 font-mono w-6">#{clause.clauseNumber}</span>
        <RiskBadge level={clause.riskLevel} isIllegal={clause.isIllegal} />
        <span className="text-xs text-gray-400 capitalize">{clause.clauseType.replace("-", " ")}</span>
        <span className="flex-1 text-sm text-gray-700 truncate">{clause.riskReason}</span>
        {clause.isBlocking && (
          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
            BLOCKING
          </span>
        )}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); handleSave(); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleSave(); } }}
          aria-disabled={saving || saved}
          className={`p-1 rounded transition-colors cursor-pointer ${
            saved ? "text-black" : "text-gray-300 hover:text-black"
          } ${saving || saved ? "pointer-events-none opacity-60" : ""}`}
          title={saved ? "Saved" : "Save clause"}
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
          )}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Original Text */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1.5">Original Clause</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 leading-relaxed">{clause.originalText}</p>
            </div>
          </div>

          {/* Illegal Flag */}
          {clause.isIllegal && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Illegal — violates {clause.illegalLaw}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  This clause is unenforceable in court even if signed.
                </p>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-xs text-gray-400">Explanation</p>
              <button
                onClick={() => handleSpeak(explanation)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
          </div>

          {/* Benchmark */}
          {clause.benchmarkLabel && (
            <div className="flex items-start gap-2">
              {clause.benchmarkLabel === "standard" ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
              )}
              <div>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded capitalize">
                  {clause.benchmarkLabel.replace(/_/g, " ")}
                </span>
                <p className="text-xs text-gray-500 mt-1">{clause.benchmarkNote}</p>
              </div>
            </div>
          )}

          {/* Counter Clause */}
          {clause.counterClause && (
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700">Suggested Counter-Clause</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed bg-green-50 rounded p-2.5">
                {clause.counterClause}
              </p>
            </div>
          )}

          {/* Action Advice */}
          {clause.actionAdvice && (
            <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3">
              <span className="text-xs">→</span>
              <p className="text-sm text-blue-900">{clause.actionAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
