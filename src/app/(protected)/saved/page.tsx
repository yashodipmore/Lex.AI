"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

interface SavedClause {
  _id: string;
  clauseType: string;
  originalText: string;
  riskLevel: string;
  isIllegal: boolean;
  illegalLaw?: string;
  explanation: string;
  counterClause?: string;
  actionAdvice?: string;
  docName?: string;
  docType?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

const RISK_COLORS: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-green-50 text-green-700 border-green-200",
};

const RISK_ICONS: Record<string, React.ReactNode> = {
  HIGH: <XCircle className="w-3.5 h-3.5" />,
  MEDIUM: <AlertTriangle className="w-3.5 h-3.5" />,
  LOW: <CheckCircle className="w-3.5 h-3.5" />,
};

export default function SavedClausesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [clauses, setClauses] = useState<SavedClause[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadClauses();
  }, [user, search, riskFilter, typeFilter]);

  const loadClauses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (riskFilter) params.set("riskLevel", riskFilter);
      if (typeFilter) params.set("clauseType", typeFilter);

      const res = await fetch(`/api/saved-clauses?${params}`);
      if (res.ok) {
        const data = await res.json();
        setClauses(data.clauses || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const deleteClause = async (id: string) => {
    try {
      setDeleting(id);
      const res = await fetch(`/api/saved-clauses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setClauses((prev) => prev.filter((c) => c._id !== id));
        toast.success("Clause removed");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const uniqueTypes = [...new Set(clauses.map((c) => c.clauseType))];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          Saved Clauses
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your personal legal clause library — {clauses.length} saved
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clauses, notes, tags..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
          >
            <option value="">All Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clause Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : clauses.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-400 mb-1">No saved clauses</h3>
          <p className="text-sm text-gray-400">
            Analyze a document and save important clauses to build your library.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {clauses.map((clause) => {
            const isExpanded = expandedId === clause._id;

            return (
              <div
                key={clause._id}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                {/* Card header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : clause._id)}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-0.5">
                    {RISK_ICONS[clause.riskLevel] || RISK_ICONS.MEDIUM}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          RISK_COLORS[clause.riskLevel] || RISK_COLORS.MEDIUM
                        }`}
                      >
                        {clause.riskLevel}
                      </span>
                      <span className="text-xs text-gray-400">{clause.clauseType}</span>
                      {clause.isIllegal && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                          ILLEGAL
                        </span>
                      )}
                      {clause.docName && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {clause.docName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {clause.originalText}
                    </p>
                    {clause.tags && clause.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {clause.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500 flex items-center gap-0.5"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClause(clause._id);
                      }}
                      disabled={deleting === clause._id}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50 space-y-4">
                    {/* Original Text */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-medium text-gray-500 uppercase">
                          Original Clause
                        </h4>
                        <button
                          onClick={() => copyText(clause.originalText)}
                          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {clause.originalText}
                      </p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Explanation
                      </h4>
                      <p className="text-sm text-gray-700">{clause.explanation}</p>
                    </div>

                    {/* Illegal Law */}
                    {clause.isIllegal && clause.illegalLaw && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="text-xs font-medium text-red-600 uppercase mb-1">
                          Violated Law
                        </h4>
                        <p className="text-sm text-red-700">{clause.illegalLaw}</p>
                      </div>
                    )}

                    {/* Counter Clause */}
                    {clause.counterClause && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-medium text-gray-500 uppercase">
                            Counter Clause
                          </h4>
                          <button
                            onClick={() => copyText(clause.counterClause!)}
                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                          {clause.counterClause}
                        </p>
                      </div>
                    )}

                    {/* Action Advice */}
                    {clause.actionAdvice && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Action Advice
                        </h4>
                        <p className="text-sm text-gray-700">{clause.actionAdvice}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {clause.notes && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Your Notes
                        </h4>
                        <p className="text-sm text-gray-600 italic">{clause.notes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Saved on{" "}
                      {new Date(clause.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
