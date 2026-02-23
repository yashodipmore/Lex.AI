"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  AlertTriangle,
  Shield,
  Bookmark,
  MessageSquare,
  Flame,
  TrendingUp,
  Calendar,
  Activity,
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface Stats {
  totalDocuments: number;
  totalClauses: number;
  highRiskClauses: number;
  illegalClauses: number;
  savedClauses: number;
  totalChats: number;
  averageRiskScore: number;
  riskDistribution: { HIGH: number; MEDIUM: number; LOW: number };
  verdictDistribution: { DO_NOT_SIGN: number; CONDITIONAL: number; SAFE_TO_SIGN: number };
  docTypeDistribution: Record<string, number>;
  dailyActivity: { date: string; count: number }[];
  streak: number;
  deadlines: { date: string; label: string; docName: string }[];
  riskTrend: { docName: string; score: number }[];
  recentActivities: { type: string; description: string; date: string }[];
}

const PIE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];
const VERDICT_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];
const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  document_analyzed: "Analyzed Document",
  chat_message: "Chat Message",
  clause_saved: "Saved Clause",
  dispute_generated: "Generated Notice",
  comparison_done: "Compared Contracts",
  negotiation_done: "Negotiation",
  counter_clause: "Counter Clause",
  login: "Login",
};

export default function InsightsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm text-gray-500">Loading insights...</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <BarChart3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400">Could not load insights. Try again later.</p>
      </div>
    );
  }

  const riskPieData = [
    { name: "High", value: stats.riskDistribution.HIGH },
    { name: "Medium", value: stats.riskDistribution.MEDIUM },
    { name: "Low", value: stats.riskDistribution.LOW },
  ].filter((d) => d.value > 0);

  const verdictPieData = [
    { name: "Don't Sign", value: stats.verdictDistribution.DO_NOT_SIGN },
    { name: "Conditional", value: stats.verdictDistribution.CONDITIONAL },
    { name: "Safe to Sign", value: stats.verdictDistribution.SAFE_TO_SIGN },
  ].filter((d) => d.value > 0);

  const docTypeData = Object.entries(stats.docTypeDistribution).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Streak */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Legal Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your legal health overview and analytics
          </p>
        </div>
        {stats.streak > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-orange-600">{stats.streak}</p>
              <p className="text-xs text-orange-500">Day Streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<FileText className="w-4 h-4" />}
          label="Documents"
          value={stats.totalDocuments}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<Shield className="w-4 h-4" />}
          label="Total Clauses"
          value={stats.totalClauses}
          color="bg-gray-50 text-gray-600"
        />
        <StatCard
          icon={<AlertTriangle className="w-4 h-4" />}
          label="High Risk"
          value={stats.highRiskClauses}
          color="bg-red-50 text-red-600"
        />
        <StatCard
          icon={<XCircle className="w-4 h-4" />}
          label="Illegal"
          value={stats.illegalClauses}
          color="bg-red-50 text-red-700"
        />
        <StatCard
          icon={<Bookmark className="w-4 h-4" />}
          label="Saved"
          value={stats.savedClauses}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={<MessageSquare className="w-4 h-4" />}
          label="Chats"
          value={stats.totalChats}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Avg Risk"
          value={stats.averageRiskScore.toFixed(1)}
          suffix="/10"
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={stats.streak}
          suffix=" days"
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Daily Activity (30 days)
          </h3>
          {stats.dailyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => {
                    const d = new Date(v);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#000"
                  fill="#f3f4f6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
              No activity data yet
            </div>
          )}
        </div>

        {/* Risk Distribution Pie */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Risk Distribution
          </h3>
          {riskPieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {riskPieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {riskPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    <span className="text-gray-600">
                      {d.name}: <span className="font-medium">{d.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
              No clause data yet
            </div>
          )}
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Verdict Distribution */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Document Verdicts
          </h3>
          {verdictPieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie
                    data={verdictPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {verdictPieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={VERDICT_COLORS[index % VERDICT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {verdictPieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: VERDICT_COLORS[i] }}
                    />
                    <span className="text-gray-600">
                      {d.name}: <span className="font-medium">{d.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
              No verdict data
            </div>
          )}
        </div>

        {/* Doc Type Distribution */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Document Types
          </h3>
          {docTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={docTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">
              No document data
            </div>
          )}
        </div>
      </div>

      {/* Risk Score Trend */}
      {stats.riskTrend.length > 0 && (
        <div className="border border-gray-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            Risk Score Trend (Last 10 Documents)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="docName" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Row: Deadlines + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Upcoming Deadlines
          </h3>
          {stats.deadlines.length > 0 ? (
            <div className="space-y-2">
              {stats.deadlines.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">
                      {new Date(d.date).getDate()}
                    </span>
                    <span className="text-[9px] text-red-500 uppercase">
                      {new Date(d.date).toLocaleString("en", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 truncate">{d.label}</p>
                    <p className="text-xs text-gray-400 truncate">{d.docName}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              No upcoming deadlines
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Recent Activity
          </h3>
          {stats.recentActivities.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentActivities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 py-1.5 text-sm border-b border-gray-50 last:border-0"
                >
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-700 truncate">
                      {a.description ||
                        ACTIVITY_TYPE_LABELS[a.type] ||
                        a.type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-3">
      <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xl font-bold">
        {value}
        {suffix && <span className="text-xs font-normal text-gray-400">{suffix}</span>}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
