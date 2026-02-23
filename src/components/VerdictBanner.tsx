"use client";

import { ShieldAlert, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

interface VerdictBannerProps {
  verdict: string;
  reason: string;
  blockingClauses: number[];
  riskScore: number;
  illegalCount: number;
}

export default function VerdictBanner({
  verdict,
  reason,
  blockingClauses,
  riskScore,
  illegalCount,
}: VerdictBannerProps) {
  const config = {
    DO_NOT_SIGN: {
      icon: ShieldX,
      label: "Do Not Sign",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-900",
      sub: "text-red-700",
      badge: "bg-red-100 text-red-800",
    },
    CONDITIONAL: {
      icon: AlertTriangle,
      label: "Sign With Caution",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-900",
      sub: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
    },
    SAFE_TO_SIGN: {
      icon: ShieldCheck,
      label: "Safe to Sign",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      sub: "text-green-700",
      badge: "bg-green-100 text-green-800",
    },
  };

  const c = config[verdict as keyof typeof config] || config.CONDITIONAL;
  const Icon = c.icon;

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-5`}>
      <div className="flex items-start gap-4">
        <div className="mt-0.5">
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className={`text-lg font-semibold ${c.text}`}>{c.label}</h2>
            <div className="flex gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.badge}`}>
                Risk: {riskScore}/100
              </span>
              {illegalCount > 0 && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  {illegalCount} Illegal
                </span>
              )}
            </div>
          </div>
          <p className={`text-sm mt-2 ${c.sub}`}>{reason}</p>
          {blockingClauses.length > 0 && (
            <div className="mt-3">
              <p className={`text-xs font-medium ${c.sub}`}>Must change before signing:</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {blockingClauses.map((num) => (
                  <span
                    key={num}
                    className={`px-2 py-0.5 rounded text-xs ${c.badge}`}
                  >
                    Clause {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
