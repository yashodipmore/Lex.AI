"use client";

import { useAuth } from "@/context/AuthContext";
import { FileText, MessageSquare, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface QuickStats {
  totalDocuments: number;
  totalChats: number;
  savedClauses: number;
}

export default function WelcomeBanner() {
  const { user } = useAuth();
  const [stats, setStats] = useState<QuickStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalDocuments: data.stats?.totalDocuments ?? 0,
            totalChats: data.stats?.totalChats ?? 0,
            savedClauses: data.stats?.savedClauses ?? 0,
          });
        }
      } catch {
        /* silent */
      }
    };
    load();
  }, []);

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 mb-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/logolex.png"
              alt="LexAI"
              width={70}
              height={70}
              className="rounded"
            />
          </div>
          <h2 className="text-lg font-semibold">
            {greeting}, {firstName}
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Upload a document to get started, or continue where you left off.
          </p>
        </div>

        {stats && (
          <div className="flex gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <FileText className="w-3 h-3" />
              </div>
              <p className="text-lg font-bold">{stats.totalDocuments}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Docs</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <MessageSquare className="w-3 h-3" />
              </div>
              <p className="text-lg font-bold">{stats.totalChats}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Chats</p>
            </div>
            <div className="w-px bg-gray-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                <Shield className="w-3 h-3" />
              </div>
              <p className="text-lg font-bold">{stats.savedClauses}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">Saved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
