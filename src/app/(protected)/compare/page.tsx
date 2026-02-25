"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Upload, Loader2, ArrowRight, Plus, Minus, RefreshCw, GitCompare } from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface Change {
  change_type: string;
  clause_area: string;
  old_text: string;
  new_text: string;
  impact: string;
  explanation: string;
}

interface CompareResult {
  verdict: string;
  summary: string;
  changes: Change[];
  risk_delta: string;
  action_items: string[];
}

export default function ComparePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [userRole, setUserRole] = useState("tenant");
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  const handleCompare = async () => {
    if (oldText.trim().length < 50 || newText.trim().length < 50) {
      setError("Both texts must be at least 50 characters");
      return;
    }

    setComparing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/compare-contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldText, newText, userRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Comparison failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setComparing(false);
    }
  };

  // Parse file to text
  const handleFile = async (file: File, target: "old" | "new") => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-document", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { rawText } = await res.json();
        if (target === "old") setOldText(rawText);
        else setNewText(rawText);
      }
    } catch {
      // Silently fail, user can paste manually
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const changeTypeConfig: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
    ADDED: { icon: Plus, bg: "bg-green-50 border-green-200", text: "text-green-700" },
    REMOVED: { icon: Minus, bg: "bg-red-50 border-red-200", text: "text-red-700" },
    MODIFIED: { icon: RefreshCw, bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  };

  const impactConfig: Record<string, string> = {
    FAVORABLE: "bg-green-100 text-green-700",
    UNFAVORABLE: "bg-red-100 text-red-700",
    NEUTRAL: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        icon={<GitCompare className="w-5 h-5" />}
        title="Compare Contracts"
        subtitle="Upload old and new versions to see what changed"
      />

      {!result && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm text-gray-500">Your role:</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none cursor-pointer"
            >
              <option value="tenant">Tenant</option>
              <option value="employee">Employee</option>
              <option value="freelancer">Freelancer</option>
              <option value="borrower">Borrower</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Old Contract */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Old Version</label>
                <label className="flex items-center gap-1 text-xs text-gray-400 hover:text-black cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "old")}
                  />
                </label>
              </div>
              <textarea
                value={oldText}
                onChange={(e) => setOldText(e.target.value)}
                placeholder="Paste old contract text..."
                className="w-full h-56 px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* New Contract */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">New Version</label>
                <label className="flex items-center gap-1 text-xs text-gray-400 hover:text-black cursor-pointer transition-colors">
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "new")}
                  />
                </label>
              </div>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Paste new contract text..."
                className="w-full h-56 px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleCompare}
            disabled={comparing || oldText.length < 50 || newText.length < 50}
            className="flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {comparing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {comparing ? "Comparing..." : "Compare"}
          </button>
        </>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <button
            onClick={() => { setResult(null); setError(""); }}
            className="text-sm text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            ← Compare another
          </button>

          {/* Verdict */}
          <div className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-medium mb-2">{result.verdict}</h2>
            <p className="text-sm text-gray-600">{result.summary}</p>
            <p className="text-xs text-gray-400 mt-2">Risk Delta: {result.risk_delta}</p>
          </div>

          {/* Changes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Changes Found ({result.changes?.length || 0})</h3>
            {result.changes?.map((change, i) => {
              const config = changeTypeConfig[change.change_type] || changeTypeConfig.MODIFIED;
              const Icon = config.icon;
              return (
                <div key={i} className={`border rounded-lg p-4 ${config.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${config.text}`} />
                    <span className={`text-xs font-medium ${config.text}`}>{change.change_type}</span>
                    <span className="text-xs text-gray-500">{change.clause_area}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${impactConfig[change.impact] || impactConfig.NEUTRAL}`}>
                      {change.impact}
                    </span>
                  </div>
                  {change.old_text && (
                    <div className="bg-red-100/50 rounded p-2 mb-2">
                      <p className="text-xs text-gray-500 mb-1">Old:</p>
                      <p className="text-sm text-gray-700">{change.old_text}</p>
                    </div>
                  )}
                  {change.new_text && (
                    <div className="bg-green-100/50 rounded p-2 mb-2">
                      <p className="text-xs text-gray-500 mb-1">New:</p>
                      <p className="text-sm text-gray-700">{change.new_text}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{change.explanation}</p>
                </div>
              );
            })}
          </div>

          {/* Action Items */}
          {result.action_items && result.action_items.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-medium mb-3">Recommended Actions</h3>
              <ul className="space-y-2">
                {result.action_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-gray-400 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
