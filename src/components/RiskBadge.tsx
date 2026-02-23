"use client";

import { ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
  level: string;
  isIllegal?: boolean;
}

export default function RiskBadge({ level, isIllegal }: RiskBadgeProps) {
  if (isIllegal) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded">
        <ShieldAlert className="w-3 h-3" />
        ILLEGAL
      </span>
    );
  }

  const config: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    LOW: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded ${config[level] || config.MEDIUM}`}>
      {level}
    </span>
  );
}
