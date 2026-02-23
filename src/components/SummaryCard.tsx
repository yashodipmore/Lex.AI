"use client";

import { FileText, Users, Calendar, CreditCard } from "lucide-react";

interface SummaryCardProps {
  docType: string;
  clauseCount: number;
  highRiskCount: number;
  illegalCount: number;
  parties: string[];
  keyDates: string[];
  monthlyObligations: string[];
  summaryEn: string;
  summaryHi: string;
  language: string;
}

export default function SummaryCard({
  docType,
  clauseCount,
  highRiskCount,
  illegalCount,
  parties,
  keyDates,
  monthlyObligations,
  summaryEn,
  summaryHi,
  language,
}: SummaryCardProps) {
  const summary = language === "hi" ? summaryHi : summaryEn;

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-medium">Document Summary</h3>
        <span className="ml-auto px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 capitalize">
          {docType}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">{summary}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-lg font-semibold">{clauseCount}</p>
          <p className="text-xs text-gray-500">Clauses</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <p className="text-lg font-semibold text-red-700">{highRiskCount}</p>
          <p className="text-xs text-gray-500">High Risk</p>
        </div>
        <div className={`rounded-lg p-3 text-center ${illegalCount > 0 ? "bg-red-50" : "bg-green-50"}`}>
          <p className={`text-lg font-semibold ${illegalCount > 0 ? "text-red-700" : "text-green-700"}`}>
            {illegalCount}
          </p>
          <p className="text-xs text-gray-500">Illegal</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {parties.length > 0 && (
          <div className="flex items-start gap-2">
            <Users className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Parties</p>
              <p className="text-gray-700">{parties.join(" · ")}</p>
            </div>
          </div>
        )}
        {keyDates.length > 0 && (
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Key Dates</p>
              <p className="text-gray-700">{keyDates.join(" · ")}</p>
            </div>
          </div>
        )}
        {monthlyObligations.length > 0 && (
          <div className="flex items-start gap-2">
            <CreditCard className="w-3.5 h-3.5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Obligations</p>
              <p className="text-gray-700">{monthlyObligations.join(" · ")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
