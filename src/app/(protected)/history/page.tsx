"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Clock, ShieldAlert, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DocSummary {
  _id: string;
  fileName: string;
  docType: string;
  overallRisk: string;
  riskScore: number;
  illegalCount: number;
  signVerdict: string;
  clauseCount: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<DocSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchDocuments();
  }, [user, fetchDocuments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document and its analysis?")) return;
    try {
      const res = await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d._id !== id));
      }
    } catch {
      // Silently fail
    }
  };

  const riskConfig: Record<string, string> = {
    HIGH: "text-red-600",
    MEDIUM: "text-amber-600",
    LOW: "text-green-600",
  };

  const verdictConfig: Record<string, { bg: string; text: string }> = {
    DO_NOT_SIGN: { bg: "bg-red-100", text: "text-red-700" },
    CONDITIONAL: { bg: "bg-amber-100", text: "text-amber-700" },
    SAFE_TO_SIGN: { bg: "bg-green-100", text: "text-green-700" },
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Document History</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          All your previously analyzed documents
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="skeleton w-8 h-8 rounded" />
                <div className="flex-1">
                  <div className="skeleton w-40 h-4 mb-2" />
                  <div className="skeleton w-24 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No documents analyzed yet</p>
          <Link
            href="/dashboard"
            className="inline-block mt-4 text-sm text-black font-medium hover:underline"
          >
            Analyze your first document →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const v = verdictConfig[doc.signVerdict] || verdictConfig.CONDITIONAL;
            return (
              <div
                key={doc._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{doc.fileName}</p>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500 capitalize">
                        {doc.docType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${riskConfig[doc.overallRisk] || "text-gray-500"}`}>
                        Risk: {doc.riskScore}/100
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${v.bg} ${v.text}`}>
                        {doc.signVerdict?.replace(/_/g, " ")}
                      </span>
                      {doc.illegalCount > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-red-600">
                          <ShieldAlert className="w-3 h-3" />
                          {doc.illegalCount} illegal
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{doc.clauseCount} clauses</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      href={`/history/${doc._id}`}
                      className="p-1.5 text-gray-400 hover:text-black transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
